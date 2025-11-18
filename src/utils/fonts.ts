// Font utility types and helpers

export interface CustomFont {
    name: string;
    family: string;
    weights: number[];
    styles: string[];
    files: {
        weight: number;
        style: string;
        url: string;
    }[];
}

export interface FontConfig {
    customFonts: CustomFont[];
}

// Default custom fonts (fallback when fonts.json is not available)
const defaultCustomFonts: CustomFont[] = [];

// Cache for loaded font configuration
let cachedCustomFonts: CustomFont[] | null = null;
let loadingPromise: Promise<CustomFont[]> | null = null;

// Load custom fonts from JSON configuration
export const loadCustomFontsConfig = async (): Promise<CustomFont[]> => {
    // Return cached result if available
    if (cachedCustomFonts !== null) {
        return cachedCustomFonts;
    }

    // Return existing loading promise if in progress
    if (loadingPromise !== null) {
        return loadingPromise;
    }

    // Start loading
    loadingPromise = (async () => {
        try {
            const response = await fetch('/fonts/fonts.json');
            if (!response.ok) {
                console.info('No fonts.json found, using default configuration');
                cachedCustomFonts = defaultCustomFonts;
                return defaultCustomFonts;
            }

            const config: FontConfig = await response.json();

            if (!config.customFonts || !Array.isArray(config.customFonts)) {
                console.warn('Invalid fonts.json format, using default configuration');
                cachedCustomFonts = defaultCustomFonts;
                return defaultCustomFonts;
            }

            cachedCustomFonts = config.customFonts;
            return config.customFonts;
        } catch (error) {
            console.warn('Failed to load fonts.json:', error);
            cachedCustomFonts = defaultCustomFonts;
            return defaultCustomFonts;
        }
    })();

    return loadingPromise;
};

// Get currently loaded custom fonts (synchronous, may return empty array if not loaded yet)
export const getCustomFonts = (): CustomFont[] => {
    return cachedCustomFonts || [];
};

// Get available font families for dropdowns
export const getAvailableFonts = async (): Promise<{ name: string; family: string; type: 'system' | 'google' | 'custom' }[]> => {
    const systemFonts = [
        { name: 'Arial', family: 'Arial', type: 'system' as const },
        { name: 'Helvetica', family: 'Helvetica', type: 'system' as const },
        { name: 'Georgia', family: 'Georgia', type: 'system' as const },
        { name: 'Times New Roman', family: 'Times New Roman', type: 'system' as const },
        { name: 'Verdana', family: 'Verdana', type: 'system' as const },
        { name: 'Courier New', family: 'Courier New', type: 'system' as const }
    ];

    const googleFonts = [
        { name: 'Inter', family: 'Inter', type: 'google' as const },
        { name: 'Roboto', family: 'Roboto', type: 'google' as const },
        { name: 'Open Sans', family: 'Open Sans', type: 'google' as const },
        { name: 'Lato', family: 'Lato', type: 'google' as const },
        { name: 'Montserrat', family: 'Montserrat', type: 'google' as const },
        { name: 'Oswald', family: 'Oswald', type: 'google' as const },
        { name: 'Source Sans 3', family: 'Source Sans 3', type: 'google' as const },
        { name: 'Raleway', family: 'Raleway', type: 'google' as const },
        { name: 'PT Sans', family: 'PT Sans', type: 'google' as const },
        { name: 'Merriweather', family: 'Merriweather', type: 'google' as const },
        { name: 'Playfair Display', family: 'Playfair Display', type: 'google' as const },
        { name: 'Ubuntu', family: 'Ubuntu', type: 'google' as const },
        { name: 'Nunito', family: 'Nunito', type: 'google' as const },
        { name: 'Poppins', family: 'Poppins', type: 'google' as const }
    ];

    // Load custom fonts configuration
    const customFonts = await loadCustomFontsConfig();
    const customFontItems = customFonts.map(font => ({
        name: font.name,
        family: font.family,
        type: 'custom' as const
    }));

    return [...customFontItems, ...googleFonts, ...systemFonts];
};

// Synchronous version for immediate access (returns without custom fonts if not loaded)
export const getAvailableFontsSync = (): { name: string; family: string; type: 'system' | 'google' | 'custom' }[] => {
    const systemFonts = [
        { name: 'Arial', family: 'Arial', type: 'system' as const },
        { name: 'Helvetica', family: 'Helvetica', type: 'system' as const },
        { name: 'Georgia', family: 'Georgia', type: 'system' as const },
        { name: 'Times New Roman', family: 'Times New Roman', type: 'system' as const },
        { name: 'Verdana', family: 'Verdana', type: 'system' as const },
        { name: 'Courier New', family: 'Courier New', type: 'system' as const }
    ];

    const googleFonts = [
        { name: 'Inter', family: 'Inter', type: 'google' as const },
        { name: 'Roboto', family: 'Roboto', type: 'google' as const },
        { name: 'Open Sans', family: 'Open Sans', type: 'google' as const },
        { name: 'Lato', family: 'Lato', type: 'google' as const },
        { name: 'Montserrat', family: 'Montserrat', type: 'google' as const },
        { name: 'Oswald', family: 'Oswald', type: 'google' as const },
        { name: 'Source Sans 3', family: 'Source Sans 3', type: 'google' as const },
        { name: 'Raleway', family: 'Raleway', type: 'google' as const },
        { name: 'PT Sans', family: 'PT Sans', type: 'google' as const },
        { name: 'Merriweather', family: 'Merriweather', type: 'google' as const },
        { name: 'Playfair Display', family: 'Playfair Display', type: 'google' as const },
        { name: 'Ubuntu', family: 'Ubuntu', type: 'google' as const },
        { name: 'Nunito', family: 'Nunito', type: 'google' as const },
        { name: 'Poppins', family: 'Poppins', type: 'google' as const }
    ];

    // Use currently loaded custom fonts (may be empty if not loaded yet)
    const customFonts = getCustomFonts();
    const customFontItems = customFonts.map(font => ({
        name: font.name,
        family: font.family,
        type: 'custom' as const
    }));

    return [...customFontItems, ...googleFonts, ...systemFonts];
};

// Load custom fonts dynamically
export const loadCustomFont = async (fontName: string, fontUrl: string): Promise<void> => {
    try {
        const font = new FontFace(fontName, `url(${fontUrl})`);
        await font.load();
        document.fonts.add(font);
    } catch (error) {
        console.error(`Failed to load custom font ${fontName}:`, error);
        throw error;
    }
};

// Load all custom fonts
export const loadAllCustomFonts = async (): Promise<void> => {
    const customFonts = await loadCustomFontsConfig();
    const promises = customFonts.flatMap(font =>
        font.files.map(file =>
            loadCustomFont(font.family, file.url)
        )
    );

    await Promise.allSettled(promises);
};

// Check if a font is loaded
export const isFontLoaded = (fontFamily: string): boolean => {
    return document.fonts.check(`12px "${fontFamily}"`);
};

// Get font CSS string
export const getFontCSSString = (fontFamily: string, fallbacks: string[] = ['sans-serif']): string => {
    const allFonts = [fontFamily, ...fallbacks].map(font =>
        font.includes(' ') ? `"${font}"` : font
    );
    return allFonts.join(', ');
};

// Auto-detect and register custom fonts from the fonts directory
export const detectCustomFonts = async (): Promise<string[]> => {
    const detectedFonts: string[] = [];

    // Load custom fonts configuration and return detected fonts
    const customFonts = await loadCustomFontsConfig();
    customFonts.forEach(font => {
        if (!detectedFonts.includes(font.family)) {
            detectedFonts.push(font.family);
        }
    });

    return detectedFonts;
};