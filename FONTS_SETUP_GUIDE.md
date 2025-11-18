# Custom Fonts Setup Guide

This guide explains how to add and use custom fonts in your Calendar Generator app.

## 📁 Directory Structure
```
public/fonts/
├── README.md (this file)
├── YourFont-Regular.ttf
├── YourFont-Bold.ttf
└── AnotherFont-Regular.otf
```

## 🚀 Quick Start

### 1. Add Font Files
Place your `.ttf`, `.otf`, `.woff`, or `.woff2` files in the `public/fonts/` directory.

### 2. Declare Fonts in CSS
Open `src/styles/fonts.css` and add your font declarations:

```css
@font-face {
    font-family: 'MyAwesomeFont';
    src: url('/fonts/MyAwesomeFont-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'MyAwesomeFont';
    src: url('/fonts/MyAwesomeFont-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
```

### 3. Register Font in Utils
Open `src/utils/fonts.ts` and add your font to the `customFonts` array:

```javascript
export const customFonts: CustomFont[] = [
    {
        name: 'My Awesome Font',
        family: 'MyAwesomeFont',
        weights: [400, 700],
        styles: ['normal'],
        files: [
            { weight: 400, style: 'normal', url: '/fonts/MyAwesomeFont-Regular.ttf' },
            { weight: 700, style: 'normal', url: '/fonts/MyAwesomeFont-Bold.ttf' }
        ]
    }
];
```

### 4. Use in Calendar
Your font will automatically appear in the font selector under "📁 Custom Fonts" section.

## 📋 Supported Formats

| Format | Extension | Browser Support | Recommended |
|--------|-----------|----------------|-------------|
| TrueType | `.ttf` | Excellent | ✅ Yes |
| OpenType | `.otf` | Excellent | ✅ Yes |
| WOFF | `.woff` | Excellent | ⚡ Best for web |
| WOFF2 | `.woff2` | Modern browsers | ⚡ Smallest size |

## 🎯 Best Practices

### Font Loading
- Use `font-display: swap` for better loading performance
- Consider using WOFF/WOFF2 for smaller file sizes
- Preload critical fonts in your HTML:

```html
<link rel="preload" href="/fonts/YourFont-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

### Font Fallbacks
The system automatically provides fallbacks:
- Custom fonts fall back to Google Fonts
- Google Fonts fall back to system fonts
- Final fallback is always `sans-serif`

### File Organization
```
public/fonts/
├── serif/
│   ├── Playfair-Regular.ttf
│   └── Playfair-Bold.ttf
├── sans-serif/
│   ├── Lato-Regular.ttf
│   └── Lato-Bold.ttf
└── display/
    └── Bebas-Regular.ttf
```

### Performance Tips
- Limit to 2-3 custom font families
- Only load weights/styles you actually use
- Use font subsetting for international characters
- Consider system fonts for body text

## ⚖️ Font Licensing

**Important:** Always check font licensing before using fonts in your project!

### Common License Types:
- **Free/Open Source**: Can be used freely (Google Fonts, etc.)
- **Desktop License**: Usually for print, may not cover web use
- **Web License**: Required for web use, often sold separately
- **Commercial License**: May be needed for commercial projects

### Safe Sources:
- [Google Fonts](https://fonts.google.com/) - All free for web use
- [Adobe Fonts](https://fonts.adobe.com/) - Subscription required
- [Font Squirrel](https://www.fontsquirrel.com/) - Free fonts for commercial use
- [Open Font Library](https://fontlibrary.org/) - Open source fonts

## 🔧 Troubleshooting

### Font Not Appearing
1. Check file path is correct (`/fonts/FontName.ttf`)
2. Verify font is added to `src/utils/fonts.ts`
3. Ensure `@font-face` declaration matches family name
4. Check browser console for loading errors

### Font Loading Slowly
1. Use WOFF/WOFF2 formats for smaller files
2. Add `font-display: swap` to `@font-face`
3. Preload critical fonts in HTML
4. Consider reducing number of font weights

### Font Looks Different
1. Ensure correct font-weight in `@font-face`
2. Check if font supports the weight you're using
3. Browser may be using fallback font
4. Verify font file isn't corrupted

## 📝 Examples

### Simple Font
```css
@font-face {
    font-family: 'SimpleFont';
    src: url('/fonts/SimpleFont.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

```javascript
{
    name: 'Simple Font',
    family: 'SimpleFont',
    weights: [400],
    styles: ['normal'],
    files: [
        { weight: 400, style: 'normal', url: '/fonts/SimpleFont.ttf' }
    ]
}
```

### Complete Font Family
```css
@font-face {
    font-family: 'CompleteFont';
    src: url('/fonts/CompleteFont-Light.woff2') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'CompleteFont';
    src: url('/fonts/CompleteFont-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'CompleteFont';
    src: url('/fonts/CompleteFont-Italic.woff2') format('woff2');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
}

@font-face {
    font-family: 'CompleteFont';
    src: url('/fonts/CompleteFont-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
```

```javascript
{
    name: 'Complete Font Family',
    family: 'CompleteFont',
    weights: [300, 400, 700],
    styles: ['normal', 'italic'],
    files: [
        { weight: 300, style: 'normal', url: '/fonts/CompleteFont-Light.woff2' },
        { weight: 400, style: 'normal', url: '/fonts/CompleteFont-Regular.woff2' },
        { weight: 400, style: 'italic', url: '/fonts/CompleteFont-Italic.woff2' },
        { weight: 700, style: 'normal', url: '/fonts/CompleteFont-Bold.woff2' }
    ]
}
```

## 🎨 Font Categories

### Serif Fonts
Good for: Traditional calendars, elegant designs
Examples: Times New Roman, Georgia, Playfair Display

### Sans-Serif Fonts  
Good for: Modern calendars, clean designs
Examples: Arial, Helvetica, Lato, Montserrat

### Display Fonts
Good for: Headers, decorative elements
Examples: Bebas Neue, Oswald, Impact

### Monospace Fonts
Good for: Technical calendars, coding themes
Examples: Courier New, Monaco, Roboto Mono

---

Happy font customization! 🎨✨