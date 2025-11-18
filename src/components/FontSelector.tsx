import React, { useState, useEffect } from 'react';
import { getAvailableFonts, getAvailableFontsSync, loadAllCustomFonts, loadCustomFontsConfig } from '../utils/fonts';

interface FontSelectorProps {
    value: string;
    onChange: (fontFamily: string) => void;
    style?: React.CSSProperties;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange, style }) => {
    const [fonts, setFonts] = useState(getAvailableFontsSync());
    const [customFontsLoaded, setCustomFontsLoaded] = useState(false);

    useEffect(() => {
        // Load custom fonts on component mount
        const initCustomFonts = async () => {
            try {
                // First load the font configuration
                await loadCustomFontsConfig();
                // Then get the updated font list
                const updatedFonts = await getAvailableFonts();
                setFonts(updatedFonts);
                // Finally load the actual font files
                await loadAllCustomFonts();
                setCustomFontsLoaded(true);
            } catch (error) {
                console.warn('Some custom fonts failed to load:', error);
                setCustomFontsLoaded(true); // Still mark as loaded to show available fonts
            }
        };

        initCustomFonts();
    }, []);

    // Group fonts by type
    const groupedFonts = fonts.reduce((groups, font) => {
        if (!groups[font.type]) {
            groups[font.type] = [];
        }
        groups[font.type].push(font);
        return groups;
    }, {} as Record<string, typeof fonts>);

    const defaultStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid #d1d5db',
        fontSize: '15px',
        fontWeight: '500',
        color: '#374151',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
        outline: 'none',
        fontFamily: value // Preview the selected font
    };

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
        e.target.style.borderColor = '#3b82f6';
        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
        e.target.style.borderColor = '#d1d5db';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ ...defaultStyle, ...style }}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                {/* Custom Fonts Section */}
                {groupedFonts.custom && groupedFonts.custom.length > 0 && (
                    <optgroup label="📁 Custom Fonts">
                        {groupedFonts.custom.map(font => (
                            <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
                                {font.name} {!customFontsLoaded && '(Loading...)'}
                            </option>
                        ))}
                    </optgroup>
                )}

                {/* Google Fonts Section */}
                {groupedFonts.google && (
                    <optgroup label="🌐 Google Fonts">
                        {groupedFonts.google.map(font => (
                            <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
                                {font.name}
                            </option>
                        ))}
                    </optgroup>
                )}

                {/* System Fonts Section */}
                {groupedFonts.system && (
                    <optgroup label="💻 System Fonts">
                        {groupedFonts.system.map(font => (
                            <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
                                {font.name}
                            </option>
                        ))}
                    </optgroup>
                )}
            </select>

            {/* Instructions for adding custom fonts */}
            {(!groupedFonts.custom || groupedFonts.custom.length === 0) && (
                <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb'
                }}>
                    💡 <strong>Add custom fonts:</strong>
                    <br />1. Place .ttf or .otf files in <code style={{
                        backgroundColor: '#e5e7eb',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontFamily: 'monospace'
                    }}>public/fonts/</code>
                    <br />2. Create <code style={{
                        backgroundColor: '#e5e7eb',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontFamily: 'monospace'
                    }}>public/fonts/fonts.json</code> to configure them
                    <br />3. Add @font-face declarations in <code style={{
                        backgroundColor: '#e5e7eb',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontFamily: 'monospace'
                    }}>src/styles/fonts.css</code>
                </div>
            )}
        </div>
    );
};

export default FontSelector;