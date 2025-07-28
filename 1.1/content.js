// content.js
let currentTooltip = null;
let tooltipTimeout = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showImageSize") {
    showImageDimensions(message.imageSrc);
  }
});

function showImageDimensions(imageSrc) {
  // Remove any existing tooltip
  removeTooltip();
  
  // Find the image element that was right-clicked
  const images = document.querySelectorAll('img');
  let targetImage = null;
  
  for (let img of images) {
    if (img.src === imageSrc || img.currentSrc === imageSrc) {
      targetImage = img;
      break;
    }
  }
  
  if (!targetImage) {
    console.log('Image not found');
    return;
  }
  
  // Get rendered dimensions
  const renderedWidth = targetImage.offsetWidth;
  const renderedHeight = targetImage.offsetHeight;
  
  // Try to get the original source URL, not the responsive variant
  let originalSrc = imageSrc;
  
  // Check if this is a processed/resized image URL and try to extract original
  if (imageSrc.includes('/tco-images/unsafe/') && imageSrc.includes('/https://')) {
    // Extract the original URL from the processed URL
    const match = imageSrc.match(/\/https:\/\/(.+)$/);
    if (match) {
      originalSrc = 'https://' + match[1];
    }
  }
  
  // Also check the img element's src attribute (not currentSrc) which might have the original
  if (targetImage.src && targetImage.src !== imageSrc && !targetImage.src.includes('/tco-images/unsafe/')) {
    originalSrc = targetImage.src;
  }
  
  // Get intrinsic dimensions from both the current image and original source
  Promise.all([
    getImageDimensions(imageSrc), // Current loaded image
    getImageDimensions(originalSrc) // Original source
  ]).then(([currentDims, originalDims]) => {
    // Use the larger dimensions as the true intrinsic size
    const intrinsicWidth = Math.max(currentDims.width, originalDims.width);
    const intrinsicHeight = Math.max(currentDims.height, originalDims.height);
    
    // Calculate aspect ratios
    const renderedAspectRatio = renderedWidth / renderedHeight;
    const intrinsicAspectRatio = intrinsicWidth / intrinsicHeight;
    
    // Get file size
    getImageFileSize(originalSrc).then(fileSize => {
      createTooltip(targetImage, {
        intrinsic: { width: intrinsicWidth, height: intrinsicHeight },
        rendered: { width: renderedWidth, height: renderedHeight },
        renderedAspectRatio,
        intrinsicAspectRatio,
        fileSize,
        currentSource: imageSrc,
        originalSource: originalSrc !== imageSrc ? originalSrc : null
      });
    });
  });
}

function getImageDimensions(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      resolve({ width: this.naturalWidth, height: this.naturalHeight });
    };
    img.onerror = function() {
      resolve({ width: 0, height: 0 });
    };
    img.src = src;
  });
}

async function getImageFileSize(imageSrc) {
  try {
    const response = await fetch(imageSrc, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const bytes = parseInt(contentLength);
      return formatFileSize(bytes);
    }
    return 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'kB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function simplifyAspectRatio(width, height) {
  const ratio = width / height;
  
  // Common aspect ratios with tolerance
  const commonRatios = [
    { ratio: 16/9, display: '16:9', tolerance: 0.02 },
    { ratio: 4/3, display: '4:3', tolerance: 0.02 },
    { ratio: 3/2, display: '3:2', tolerance: 0.02 },
    { ratio: 5/4, display: '5:4', tolerance: 0.02 },
    { ratio: 1/1, display: '1:1', tolerance: 0.02 },
    { ratio: 2/1, display: '2:1', tolerance: 0.02 },
    { ratio: 3/1, display: '3:1', tolerance: 0.02 },
    { ratio: 21/9, display: '21:9', tolerance: 0.02 },
    { ratio: 16/10, display: '16:10', tolerance: 0.02 },
    { ratio: 9/16, display: '9:16', tolerance: 0.02 },
    { ratio: 3/4, display: '3:4', tolerance: 0.02 },
    { ratio: 2/3, display: '2:3', tolerance: 0.02 }
  ];
  
  // Check if ratio is close to any common ratio
  for (const common of commonRatios) {
    if (Math.abs(ratio - common.ratio) <= common.tolerance) {
      return common.display;
    }
  }
  
  // If not close to common ratios, try to find simple GCD-based ratio
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  const simplifiedWidth = width / divisor;
  const simplifiedHeight = height / divisor;
  
  // Only use simplified if the numbers are reasonable (not too large)
  if (simplifiedWidth <= 50 && simplifiedHeight <= 50) {
    return `${simplifiedWidth}:${simplifiedHeight}`;
  }
  
  // Fall back to original
  return `${width}:${height}`;
}

function createTooltip(targetElement, dimensions) {
  const tooltip = document.createElement('div');
  tooltip.id = 'image-size-tooltip';
  
  // Calculate scaling info
  const scaleX = dimensions.rendered.width / dimensions.intrinsic.width;
  const scaleY = dimensions.rendered.height / dimensions.intrinsic.height;
  
  // Format aspect ratios with simplification
  const renderedRatio = simplifyAspectRatio(dimensions.rendered.width, dimensions.rendered.height);
  const intrinsicRatio = simplifyAspectRatio(dimensions.intrinsic.width, dimensions.intrinsic.height);
  
  let sourceInfo = `<div style="font-size: 11px; color: #ccc; word-break: break-all;"><strong>Current source:</strong><br>${dimensions.currentSource}</div>`;
  
  if (dimensions.originalSource) {
    sourceInfo = `
      <div style="font-size: 11px; color: #ccc; word-break: break-all; margin-bottom: 6px;"><strong>Current source:</strong><br>${dimensions.currentSource}</div>
      <div style="font-size: 11px; color: #ccc; word-break: break-all;"><strong>Original source:</strong><br>${dimensions.originalSource}</div>
    `;
  }
  
  tooltip.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold; color: #fff; border-bottom: 1px solid #444; padding-bottom: 4px;">Image Details</div>
    
    <div style="margin-bottom: 4px;"><strong>Rendered size:</strong> ${dimensions.rendered.width} × ${dimensions.rendered.height} px</div>
    <div style="margin-bottom: 4px;"><strong>Rendered aspect ratio:</strong> ${renderedRatio}</div>
    
    <div style="margin: 8px 0; border-top: 1px solid #444; padding-top: 4px;"></div>
    
    <div style="margin-bottom: 4px;"><strong>Intrinsic size:</strong> ${dimensions.intrinsic.width} × ${dimensions.intrinsic.height} px</div>
    <div style="margin-bottom: 4px;"><strong>Intrinsic aspect ratio:</strong> ${intrinsicRatio}</div>
    <div style="margin-bottom: 4px;"><strong>File size:</strong> ${dimensions.fileSize}</div>
    
    <div style="margin: 8px 0; border-top: 1px solid #444; padding-top: 4px;"></div>
    
    ${sourceInfo}
  `;
  
  // Style the tooltip
  Object.assign(tooltip.style, {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.95)',
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    zIndex: '10000',
    pointerEvents: 'auto', // Changed from 'none' to 'auto' to enable hover
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    maxWidth: '320px',
    lineHeight: '1.4',
    border: '1px solid #333'
  });
  
  // Add hover event listeners to the tooltip
  tooltip.addEventListener('mouseenter', () => {
    // Clear any existing timeout when hovering over tooltip
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
  });
  
  tooltip.addEventListener('mouseleave', () => {
    // Start timeout to hide tooltip when mouse leaves
    startTooltipTimeout();
  });
  
  // Position tooltip near the image
  const rect = targetElement.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // Position to the right of the image if there's space, otherwise to the left
  const tooltipLeft = rect.right + scrollX + 10;
  const tooltipTop = rect.top + scrollY;
  
  // Check if tooltip would go off-screen and adjust
  if (tooltipLeft + 320 > window.innerWidth + scrollX) {
    tooltip.style.left = (rect.left + scrollX - 330) + 'px';
  } else {
    tooltip.style.left = tooltipLeft + 'px';
  }
  
  tooltip.style.top = tooltipTop + 'px';
  
  document.body.appendChild(tooltip);
  currentTooltip = tooltip;
  
  // Start the initial timeout
  startTooltipTimeout();
}

function startTooltipTimeout() {
  // Clear any existing timeout
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }
  
  // Set new timeout to hide tooltip after 6 seconds
  tooltipTimeout = setTimeout(() => {
    removeTooltip();
  }, 6000);
}

function removeTooltip() {
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }
}

function removeTooltip() {
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }
}

// Hide tooltip when clicking anywhere
document.addEventListener('click', removeTooltip);

// Hide tooltip when scrolling
window.addEventListener('scroll', removeTooltip);