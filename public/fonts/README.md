# Custom Fonts Directory

This directory is for storing custom font files (.ttf, .otf, .woff, .woff2) that you want to use in your calendar generator app.

## Quick Setup

### Method 1: JSON Configuration (Recommended)

1. **Place your font files here** - Copy your font files into this `public/fonts/` directory.

2. **Create fonts.json** - Copy the example config and modify it:
```bash
cp fonts.json.example fonts.json
```

3. **Configure your fonts** - Edit `fonts.json`:
```json
{
  "customFonts": [
    {
      "name": "My Custom Font",
      "family": "MyCustomFont", 
      "weights": [400, 700],
      "styles": ["normal"],
      "files": [
        {
          "weight": 400,
          "style": "normal",
          "url": "/fonts/MyCustomFont-Regular.ttf"
        },
        {
          "weight": 700,
          "style": "normal", 
          "url": "/fonts/MyCustomFont-Bold.ttf"
        }
      ]
    }
  ]
}
```

4. **Add CSS declarations** - Open `src/styles/fonts.css` and add:
```css
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/MyCustomFont-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

5. **Use the fonts** - Your font will automatically appear in the calendar's font selector!

### Method 2: Code Configuration (Legacy)

If you prefer not to use JSON configuration, you can still configure fonts directly in `src/utils/fonts.ts` by modifying the `defaultCustomFonts` array.

## File Structure Example
```
public/fonts/
├── fonts.json              # Your font configuration
├── fonts.json.example      # Example configuration
├── README.md              # This file
├── MyFont-Regular.ttf     # Your font files
├── MyFont-Bold.ttf
└── AnotherFont-Regular.otf
```

## Font formats supported:
- `.ttf` (TrueType Font)
- `.otf` (OpenType Font)
- `.woff` (Web Open Font Format)
- `.woff2` (Web Open Font Format 2)

## Best practices:
- Use `font-display: swap` for better loading performance
- Include fallback fonts in your font-family declarations
- Consider font licensing when using custom fonts
- Optimize font files for web use when possible

## Example fonts directory structure:
```
public/fonts/
├── MyFont-Regular.ttf
├── MyFont-Bold.ttf
├── MyFont-Italic.ttf
└── AnotherFont-Regular.otf
```