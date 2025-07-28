// background.js
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item for images
  chrome.contextMenus.create({
    id: "showImageSize",
    title: "Show Image Dimensions",
    contexts: ["image"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "showImageSize") {
    // Send message to content script with the image source
    chrome.tabs.sendMessage(tab.id, {
      action: "showImageSize",
      imageSrc: info.srcUrl
    });
  }
});