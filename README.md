# Image Size Inspector 🔍

A Chrome extension that displays detailed image information when you right-click on any image. Perfect for web developers, designers, and anyone who needs quick access to image dimensions and properties.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)
![Version](https://img.shields.io/badge/version-1.1-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ Features

- **📏 Dual Dimensions**: Shows both intrinsic (original) and rendered (displayed) image sizes
- **📐 Smart Aspect Ratios**: Automatically detects and displays common ratios (16:9, 4:3, etc.)
- **📁 File Size Detection**: Displays actual file size when available
- **🔗 Source URLs**: Shows both current and original image sources
- **🎯 Responsive Image Support**: Handles modern responsive images with srcset
- **⚡ Instant Display**: Information appears immediately on right-click
- **🖱️ Hover to Keep**: Tooltip stays open while hovering for easy reading
- **🎨 Professional UI**: Clean, dark tooltip that matches developer tools

## 🚀 Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link coming soon)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

## 📖 Usage

1. **Navigate** to any webpage with images
2. **Right-click** on any image
3. **Select** "Show Image Dimensions" from the context menu
4. **View** the detailed information tooltip
5. **Hover** over the tooltip to keep it open longer

## 📊 Information Displayed

The tooltip shows comprehensive image data:

```
Image Details
─────────────────────────────
Rendered size: 664 × 498 px
Rendered aspect ratio: 4:3

Intrinsic size: 1366 × 1024 px  
Intrinsic aspect ratio: 4:3
File size: 156.7 kB

Current source: [responsive image URL]
Original source: [original image URL]
```

## 🎯 Use Cases

### For Web Developers
- ✅ Debug responsive image implementations
- ✅ Verify image scaling and optimization
- ✅ Check if images are being served at appropriate sizes
- ✅ Identify oversized images that need compression

### For Designers
- ✅ Verify aspect ratios match design specifications
- ✅ Check image quality and resolution
- ✅ Ensure consistent sizing across layouts
- ✅ Analyze competitor websites and image usage

### For Content Creators
- ✅ Understand image requirements for different platforms
- ✅ Optimize images for better performance
- ✅ Check image dimensions before downloading
- ✅ Verify image quality on various websites

## 🛠️ Technical Details

### Architecture
- **Manifest V3** compatible
- **Content Script** for DOM interaction and measurement
- **Background Script** for context menu management
- **No external dependencies** or remote code execution

### Permissions Used
- `contextMenus`: Add right-click menu option for images
- `activeTab`: Access current page to analyze images
- Content script injection on all URLs (images exist everywhere)

### Privacy & Security
- 🔒 **No data collection** - all processing happens locally
- 🔒 **No external requests** - except for optional file size detection
- 🔒 **User-initiated only** - activates only on right-click
- 🔒 **No persistent storage** - information is displayed temporarily

## 📁 Project Structure

```
image-size-inspector/
├── manifest.json          # Extension configuration
├── background.js          # Context menu handler
├── content.js            # Image analysis and tooltip display
├── icons/               # Extension icons (128x128)
├── README.md           # This file
└── LICENSE            # MIT license
```

## 🔧 Development

### Setup
```bash
git clone https://github.com/NovaProton/Image-Size-Inspector/image-size-inspector.git
cd image-size-inspector
```

### Testing
1. Load the extension in developer mode
2. Test on various websites with different image types
3. Verify responsive image handling
4. Check tooltip positioning and behavior

### Building for Production
1. Ensure all files are present and up to date
2. Test thoroughly across different websites
3. Zip the extension folder for Chrome Web Store submission

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow existing code style and patterns
- Test on multiple websites and image types
- Ensure privacy and security standards are maintained
- Update documentation for any new features

## 📝 Changelog

### Version 1.1 (Initial Release)
- ✨ Right-click context menu integration
- ✨ Intrinsic and rendered dimension display
- ✨ Smart aspect ratio detection and simplification
- ✨ File size detection via HTTP headers
- ✨ Responsive image support with srcset handling
- ✨ Hover-to-keep tooltip behavior
- ✨ Professional dark theme UI

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by browser developer tools image inspection
- Built for the web development and design community
- Thanks to all contributors and users providing feedback

## 📞 Support

If you encounter any issues or have suggestions:
- 🐛 [Report bugs](https://github.com/NovaProton/Image-Size-Inspector/issues)
- 💡 [Request features](https://github.com/NovaProton/Image-Size-Inspector/issues)
- ⭐ [Star this repo](https://github.com/NovaProton/Image-Size-Inspector) if you find it useful!

---

**Made with ❤️ for the web development community**
