# Custom Fonts JSON Configuration

This document explains how to use the new JSON-based font configuration system.

## 🚀 Quick Setup

### 1. Copy the Example Configuration
```bash
cd public/fonts
cp fonts.json.example fonts.json
```

### 2. Edit fonts.json
Open `public/fonts/fonts.json` and configure your fonts:

```json
{
  "customFonts": [
    {
      "name": "My Beautiful Font",
      "family": "MyBeautifulFont",
      "weights": [400, 700],
      "styles": ["normal"],
      "files": [
        {
          "weight": 400,
          "style": "normal", 
          "url": "/fonts/MyBeautifulFont-Regular.ttf"
        },
        {
          "weight": 700,
          "style": "normal",
          "url": "/fonts/MyBeautifulFont-Bold.ttf"
        }
      ]
    }
  ]
}
```

### 3. Add CSS Declarations
In `src/styles/fonts.css`, add the @font-face declarations:

```css
@font-face {
    font-family: 'MyBeautifulFont';
    src: url('/fonts/MyBeautifulFont-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'MyBeautifulFont';
    src: url('/fonts/MyBeautifulFont-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
```

### 4. Your Font is Ready!
The font will automatically appear in the calendar's font selector under "📁 Custom Fonts".

## 📁 JSON Structure

```json
{
  "customFonts": [
    {
      "name": "Display name shown in the UI",
      "family": "CSS font-family name (matches @font-face)",
      "weights": [300, 400, 700],
      "styles": ["normal", "italic"],
      "files": [
        {
          "weight": 400,
          "style": "normal",
          "url": "/fonts/FontFile-Regular.ttf"
        }
      ]
    }
  ]
}
```

## ⚙️ Benefits of JSON Configuration

- **Easy to manage**: All font configurations in one place
- **Version control friendly**: JSON format is diff-friendly
- **No code changes**: Add fonts without touching TypeScript files
- **Automatic loading**: The system automatically loads fonts from the JSON
- **Error handling**: Graceful fallback if fonts.json is missing
- **Gitignored by default**: Keep your font configurations private

## 🔧 File Organization

```
public/fonts/
├── fonts.json              # Your custom configuration (gitignored)
├── fonts.json.example      # Example template (tracked in git)
├── README.md              # Documentation
├── YourFont-Regular.ttf   # Your font files (gitignored)
└── YourFont-Bold.ttf      # Your font files (gitignored)
```

## 🔄 Migration from Code Configuration

If you previously configured fonts in `src/utils/fonts.ts`, you can:

1. Create `fonts.json` with your existing font configurations
2. The system will automatically use the JSON configuration
3. Your old configuration in `defaultCustomFonts` serves as a fallback

## 🐛 Troubleshooting

### Font not appearing in selector
1. Check `fonts.json` syntax (use JSON validator)
2. Verify file paths in `url` fields
3. Ensure @font-face declarations match the `family` name
4. Check browser console for loading errors

### fonts.json not loading
1. Ensure file is placed in `public/fonts/fonts.json`
2. Check file permissions
3. Verify JSON syntax is valid
4. The system will fall back to default fonts if JSON is invalid

### Font loading slow
1. Use WOFF/WOFF2 formats for smaller file sizes
2. Limit number of font weights/styles
3. Consider preloading critical fonts in HTML

## 📝 Example Complete Configuration

```json
{
  "customFonts": [
    {
      "name": "Playfair Display",
      "family": "PlayfairDisplay",
      "weights": [400, 700],
      "styles": ["normal", "italic"],
      "files": [
        {
          "weight": 400,
          "style": "normal",
          "url": "/fonts/PlayfairDisplay-Regular.woff2"
        },
        {
          "weight": 400,
          "style": "italic", 
          "url": "/fonts/PlayfairDisplay-Italic.woff2"
        },
        {
          "weight": 700,
          "style": "normal",
          "url": "/fonts/PlayfairDisplay-Bold.woff2"
        }
      ]
    },
    {
      "name": "Source Code Pro",
      "family": "SourceCodePro",
      "weights": [400],
      "styles": ["normal"],
      "files": [
        {
          "weight": 400,
          "style": "normal",
          "url": "/fonts/SourceCodePro-Regular.woff2"
        }
      ]
    }
  ]
}
```

With corresponding CSS:

```css
@font-face {
    font-family: 'PlayfairDisplay';
    src: url('/fonts/PlayfairDisplay-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'PlayfairDisplay';
    src: url('/fonts/PlayfairDisplay-Italic.woff2') format('woff2');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
}

@font-face {
    font-family: 'PlayfairDisplay';
    src: url('/fonts/PlayfairDisplay-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'SourceCodePro';
    src: url('/fonts/SourceCodePro-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

---

Happy font customization! 🎨✨