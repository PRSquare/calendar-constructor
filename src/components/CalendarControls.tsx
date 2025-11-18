import React, { useState, useEffect } from 'react';
import type { CalendarColors, TitlePosition, NumberPosition } from './CalendarCanvas';
import { useLanguage } from '../i18n/LanguageContext';
import { getMonthNames, getDayNames } from '../i18n/helpers';

export interface CalendarSettings {
    colors: CalendarColors;
    fontFamily: string;
    titleFontSize: number;
    numberFontSize: number;
    showGrid: boolean;
    titlePosition: TitlePosition;
    numberPosition: NumberPosition;
    width: number;
    height: number;
    borderRadius: number;
}

interface CalendarControlsProps {
    colors: CalendarColors;
    fontFamily: string;
    titleFontSize: number;
    numberFontSize: number;
    showGrid: boolean;
    titlePosition: TitlePosition;
    numberPosition: NumberPosition;
    width: number;
    height: number;
    borderRadius: number;
    selectedDate: Date;
    onColorsChange: (colors: CalendarColors) => void;
    onFontFamilyChange: (font: string) => void;
    onTitleFontSizeChange: (size: number) => void;
    onNumberFontSizeChange: (size: number) => void;
    onShowGridChange: (show: boolean) => void;
    onTitlePositionChange: (position: TitlePosition) => void;
    onNumberPositionChange: (position: NumberPosition) => void;
    onWidthChange: (width: number) => void;
    onHeightChange: (height: number) => void;
    onBorderRadiusChange: (radius: number) => void;
    onSettingsImport: (settings: CalendarSettings) => void;
}

const CalendarControls: React.FC<CalendarControlsProps> = ({
    colors,
    fontFamily,
    titleFontSize,
    numberFontSize,
    showGrid,
    titlePosition,
    numberPosition,
    width,
    height,
    borderRadius,
    selectedDate,
    onColorsChange,
    onFontFamilyChange,
    onTitleFontSizeChange,
    onNumberFontSizeChange,
    onShowGridChange,
    onTitlePositionChange,
    onNumberPositionChange,
    onWidthChange,
    onHeightChange,
    onBorderRadiusChange,
    onSettingsImport,
}) => {
    const { t } = useLanguage();

    const [showImportInput, setShowImportInput] = useState(false);
    const [importJson, setImportJson] = useState('');
    const [exportMessage, setExportMessage] = useState('');
    const [showExportImages, setShowExportImages] = useState(false);
    const [exportWidth, setExportWidth] = useState('1920');
    const [exportHeight, setExportHeight] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [showExportSettings, setShowExportSettings] = useState(false);
    const [exportSettingsJson, setExportSettingsJson] = useState('');

    // Popular Google Fonts (matching those loaded in index.html)
    const googleFonts = [
        'Arial',
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Oswald',
        'Source Sans 3',  // Fixed: was "Source Sans Pro"
        'Raleway',
        'PT Sans',
        'Merriweather',
        'Playfair Display',
        'Ubuntu',
        'Nunito',
        'Poppins'
    ];

    // Initialize export height based on current calendar dimensions
    useEffect(() => {
        if (exportWidth && !exportHeight) {
            calculateHeight(exportWidth);
        }
    }, [width, height]); // Re-calculate when calendar dimensions change

    const handleExportSettings = () => {
        const settings: CalendarSettings = {
            colors,
            fontFamily,
            titleFontSize,
            numberFontSize,
            showGrid,
            titlePosition,
            numberPosition,
            width,
            height,
            borderRadius
        };

        const settingsJson = JSON.stringify(settings, null, 2);
        setExportSettingsJson(settingsJson);
        setShowExportSettings(true);
        setExportMessage(t.messages.settingsCopied);
        setTimeout(() => setExportMessage(''), 3000);
    };

    const handleImportSettings = () => {
        try {
            const settings: CalendarSettings = JSON.parse(importJson);

            // Validate the settings object
            if (settings.colors && settings.fontFamily &&
                typeof settings.titleFontSize === 'number' &&
                typeof settings.numberFontSize === 'number' &&
                typeof settings.showGrid === 'boolean' &&
                settings.titlePosition && settings.numberPosition) {

                onSettingsImport(settings);
                setImportJson('');
                setShowImportInput(false);
                setExportMessage('Settings imported successfully!');
                setTimeout(() => setExportMessage(''), 3000);
            } else {
                setExportMessage('Invalid settings format');
                setTimeout(() => setExportMessage(''), 3000);
            }
        } catch (error) {
            setExportMessage('Invalid JSON format');
            setTimeout(() => setExportMessage(''), 3000);
        }
    };

    const handleColorChange = (colorKey: keyof CalendarColors, value: string) => {
        onColorsChange({
            ...colors,
            [colorKey]: value
        });
    };

    // Calculate height from width maintaining aspect ratio
    const calculateHeight = (inputWidth: string) => {
        const w = parseInt(inputWidth);
        if (w && !isNaN(w)) {
            const aspectRatio = width / height;
            const calculatedHeight = Math.round(w / aspectRatio);
            setExportHeight(calculatedHeight.toString());
        }
    };

    // Handle width input change
    const handleExportWidthChange = (value: string) => {
        setExportWidth(value);
        calculateHeight(value);
    };

    // Handle height input change
    const handleExportHeightChange = (value: string) => {
        setExportHeight(value);
        const h = parseInt(value);
        if (h && !isNaN(h)) {
            const aspectRatio = width / height;
            const calculatedWidth = Math.round(h * aspectRatio);
            setExportWidth(calculatedWidth.toString());
        }
    };

    // Create calendar image on canvas for a specific month and size (using exact CalendarCanvas logic)
    const createCalendarCanvas = async (date: Date, targetWidth: number, targetHeight: number): Promise<string> => {
        return new Promise(async (resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Set up high DPI rendering
            const dpr = window.devicePixelRatio || 1;
            canvas.width = targetWidth * dpr;
            canvas.height = targetHeight * dpr;
            canvas.style.width = targetWidth + 'px';
            canvas.style.height = targetHeight + 'px';
            ctx.scale(dpr, dpr);

            // Load fonts first (same as CalendarCanvas)
            if (fontFamily !== 'Arial') {
                try {
                    const scaleFactor = targetWidth / width;
                    const scaledTitleFontSize = Math.round(titleFontSize * scaleFactor);
                    const scaledNumberFontSize = Math.round(numberFontSize * scaleFactor);

                    await Promise.all([
                        document.fonts.load(`bold ${scaledTitleFontSize}px "${fontFamily}"`),
                        document.fonts.load(`bold ${scaledNumberFontSize}px "${fontFamily}"`),
                        document.fonts.load(`bold ${Math.round(18 * scaleFactor)}px "${fontFamily}"`),
                        document.fonts.load(`normal ${scaledTitleFontSize}px "${fontFamily}"`),
                        document.fonts.load(`normal ${scaledNumberFontSize}px "${fontFamily}"`),
                        document.fonts.load(`normal ${Math.round(18 * scaleFactor)}px "${fontFamily}"`)
                    ]);
                    await document.fonts.ready;
                } catch (error) {
                    console.warn('Font loading failed:', fontFamily, error);
                }
            }

            // Clear canvas to transparent (same as CalendarCanvas)
            ctx.clearRect(0, 0, targetWidth, targetHeight);

            // Get translated month and day names
            const monthNames = getMonthNames(t);
            const dayNames = getDayNames(t);

            // Layout calculations (scaled for export)
            const scaleFactor = targetWidth / width;
            const padding = 20 * scaleFactor;
            const headerHeight = 60 * scaleFactor;
            const dayHeaderHeight = 40 * scaleFactor;
            const gridStartY = padding + headerHeight + dayHeaderHeight;
            const gridWidth = targetWidth - 2 * padding;
            const gridHeight = targetHeight - gridStartY - padding;
            const cellWidth = gridWidth / 7;
            const cellHeight = gridHeight / 6;

            // Draw rounded background for the entire grid area (scaled for export)
            const scaledBorderRadius = borderRadius * scaleFactor;
            const gridAreaX = padding;
            const gridAreaY = padding;
            const gridAreaWidth = targetWidth - 2 * padding;
            const gridAreaHeight = targetHeight - 2 * padding;

            // Fill the rounded grid area with background color (exact same as CalendarCanvas)
            if (colors.background !== 'transparent') {
                ctx.fillStyle = colors.background;
                ctx.beginPath();
                ctx.roundRect(gridAreaX, gridAreaY, gridAreaWidth, gridAreaHeight, scaledBorderRadius);
                ctx.fill();
            }

            // Helper function to get title x position (with proper scaling)
            const getTitleX = () => {
                const scaledOffset = 20 * scaleFactor; // Scale the offset
                switch (titlePosition) {
                    case 'left':
                        return padding + scaledOffset;
                    case 'right':
                        return targetWidth - padding - scaledOffset;
                    case 'center':
                    default:
                        return targetWidth / 2;
                }
            };

            // Helper function to get title text alignment (exact same as CalendarCanvas)
            const getTitleAlign = (): CanvasTextAlign => {
                switch (titlePosition) {
                    case 'left':
                        return 'left';
                    case 'right':
                        return 'right';
                    case 'center':
                    default:
                        return 'center';
                }
            };

            // Calculate scale factor and scaled font sizes
            const scaledTitleFontSize = Math.round(titleFontSize * scaleFactor);
            const scaledNumberFontSize = Math.round(numberFontSize * scaleFactor);

            // Draw month title (exact same as CalendarCanvas)
            ctx.fillStyle = colors.main;
            ctx.font = `bold ${scaledTitleFontSize}px "${fontFamily}", Arial, sans-serif`;
            ctx.textAlign = getTitleAlign();
            ctx.textBaseline = 'middle';
            const monthTitle = monthNames[date.getMonth()];
            ctx.fillText(monthTitle, getTitleX(), padding + headerHeight / 2);

            // Draw day headers (exact same as CalendarCanvas)
            ctx.font = `bold ${Math.round(18 * scaleFactor)}px "${fontFamily}", Arial, sans-serif`;
            ctx.textAlign = 'center';
            for (let i = 0; i < 7; i++) {
                const x = padding + (i + 0.5) * cellWidth;
                const y = padding + headerHeight + dayHeaderHeight / 2;

                // Color weekends with accent color
                if (i >= 5) {
                    ctx.fillStyle = colors.accent;
                } else {
                    ctx.fillStyle = colors.main;
                }

                ctx.fillText(dayNames[i], x, y);
            }

            // Calculate first day of month and number of days (exact same as CalendarCanvas)
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();

            // Get the day of week for first day (exact same as CalendarCanvas)
            let startDay = firstDay.getDay();
            startDay = startDay === 0 ? 6 : startDay - 1;

            // Draw calendar grid lines (with clipping to stay within rounded corners)
            if (showGrid) {
                // Save the current context state
                ctx.save();

                // Create a clipping path using the same rounded rectangle as the background
                ctx.beginPath();
                ctx.roundRect(gridAreaX, gridAreaY, gridAreaWidth, gridAreaHeight, scaledBorderRadius);
                ctx.clip();

                ctx.strokeStyle = colors.hint;
                ctx.lineWidth = 1;

                // Horizontal lines
                for (let i = 0; i <= 6; i++) {
                    const y = gridStartY + i * cellHeight;
                    ctx.beginPath();
                    ctx.moveTo(padding, y);
                    ctx.lineTo(targetWidth - padding, y);
                    ctx.stroke();
                }

                // Vertical lines
                for (let i = 0; i <= 7; i++) {
                    const x = padding + i * cellWidth;
                    ctx.beginPath();
                    ctx.moveTo(x, gridStartY);
                    ctx.lineTo(x, gridStartY + 6 * cellHeight);
                    ctx.stroke();
                }

                // Restore the context state (removes the clipping path)
                ctx.restore();
            }

            // Helper function to get number position within cell (with proper scaling)
            const getNumberPosition = (cellX: number, cellY: number, cellW: number, cellH: number) => {
                const margin = 8 * scaleFactor; // Scale the margin
                const textOffset = 15 * scaleFactor; // Scale the text offset
                const bottomOffset = 5 * scaleFactor; // Scale the bottom offset

                switch (numberPosition) {
                    case 'top-left':
                        return { x: cellX + margin, y: cellY + margin + textOffset, align: 'left' as CanvasTextAlign };
                    case 'top-right':
                        return { x: cellX + cellW - margin, y: cellY + margin + textOffset, align: 'right' as CanvasTextAlign };
                    case 'bottom-left':
                        return { x: cellX + margin, y: cellY + cellH - margin - bottomOffset, align: 'left' as CanvasTextAlign };
                    case 'bottom-right':
                        return { x: cellX + cellW - margin, y: cellY + cellH - margin - bottomOffset, align: 'right' as CanvasTextAlign };
                    case 'center':
                    default:
                        return { x: cellX + cellW / 2, y: cellY + cellH / 2, align: 'center' as CanvasTextAlign };
                }
            };

            // Draw dates (exact same as CalendarCanvas)
            ctx.font = `bold ${scaledNumberFontSize}px "${fontFamily}", Arial, sans-serif`;
            ctx.textBaseline = 'middle';

            for (let day = 1; day <= daysInMonth; day++) {
                const totalDays = startDay + day - 1;
                const row = Math.floor(totalDays / 7);
                const col = totalDays % 7;

                const cellX = padding + col * cellWidth;
                const cellY = gridStartY + row * cellHeight;
                const position = getNumberPosition(cellX, cellY, cellWidth, cellHeight);

                // Color weekends with accent color
                if (col >= 5) {
                    ctx.fillStyle = colors.accent;
                } else {
                    ctx.fillStyle = colors.main;
                }

                ctx.textAlign = position.align;
                ctx.fillText(day.toString(), position.x, position.y);
            }

            // Convert to data URL with small delay to ensure rendering is complete
            setTimeout(() => {
                resolve(canvas.toDataURL('image/png'));
            }, 200);
        });
    };    // Export all months as PNG images in ZIP file
    const handleExportImages = async () => {
        const targetWidth = parseInt(exportWidth);
        const targetHeight = parseInt(exportHeight);

        if (!targetWidth || !targetHeight || isNaN(targetWidth) || isNaN(targetHeight)) {
            setExportMessage('Please enter valid width and height values');
            setTimeout(() => setExportMessage(''), 3000);
            return;
        }

        setIsExporting(true);
        setExportMessage('Generating calendar images...');

        try {
            // Dynamic import of JSZip
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();

            const currentYear = selectedDate.getFullYear();
            const monthNames = ['01-January', '02-February', '03-March', '04-April', '05-May', '06-June',
                '07-July', '08-August', '09-September', '10-October', '11-November', '12-December'];

            // Generate all 12 months
            for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
                setExportMessage(`Generating ${monthNames[monthIndex]}... (${monthIndex + 1}/12)`);

                const monthDate = new Date(currentYear, monthIndex, 1);
                const dataUrl = await createCalendarCanvas(monthDate, targetWidth, targetHeight);

                // Convert data URL to blob
                const base64Data = dataUrl.split(',')[1];
                const binaryData = atob(base64Data);
                const bytes = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    bytes[i] = binaryData.charCodeAt(i);
                }

                // Add to ZIP
                zip.file(`${currentYear}-${monthNames[monthIndex]}.png`, bytes);
            }

            setExportMessage('Creating ZIP file...');

            // Generate ZIP file
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            // Download ZIP file
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `calendar-${currentYear}-${targetWidth}x${targetHeight}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            setExportMessage('✅ Calendar images downloaded successfully!');
            setTimeout(() => setExportMessage(''), 5000);

        } catch (error) {
            console.error('Export error:', error);
            setExportMessage('❌ Error generating images');
            setTimeout(() => setExportMessage(''), 3000);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            margin: '0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            width: '520px',
            flexShrink: 0
        }}>
            {/* Column 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Color Controls */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '18px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>🎨 Colors</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{
                                minWidth: '90px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>Main:</label>
                            <input
                                type="color"
                                value={colors.main}
                                onChange={(e) => handleColorChange('main', e.target.value)}
                                style={{
                                    width: '44px',
                                    height: '34px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    padding: '2px'
                                }}
                            />
                            <span style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                fontFamily: 'monospace',
                                backgroundColor: '#f3f4f6',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #d1d5db'
                            }}>{colors.main}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{
                                minWidth: '90px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>Accent:</label>
                            <input
                                type="color"
                                value={colors.accent}
                                onChange={(e) => handleColorChange('accent', e.target.value)}
                                style={{
                                    width: '44px',
                                    height: '34px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    padding: '2px'
                                }}
                            />
                            <span style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                fontFamily: 'monospace',
                                backgroundColor: '#f3f4f6',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #d1d5db'
                            }}>{colors.accent}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{
                                minWidth: '90px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>Background:</label>
                            <input
                                type="color"
                                value={colors.background === 'transparent' ? '#ffffff' : colors.background}
                                onChange={(e) => handleColorChange('background', e.target.value)}
                                style={{
                                    width: '44px',
                                    height: '34px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    padding: '2px'
                                }}
                            />
                            <span style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                fontFamily: 'monospace',
                                backgroundColor: '#f3f4f6',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #d1d5db'
                            }}>{colors.background}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{
                                minWidth: '90px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>Hint:</label>
                            <input
                                type="color"
                                value={colors.hint}
                                onChange={(e) => handleColorChange('hint', e.target.value)}
                                style={{
                                    width: '44px',
                                    height: '34px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    padding: '2px'
                                }}
                            />
                            <span style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                fontFamily: 'monospace',
                                backgroundColor: '#f3f4f6',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #d1d5db'
                            }}>{colors.hint}</span>
                        </div>
                    </div>
                </div>

                {/* Font Controls */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '18px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>🔤 Font</h3>
                    <select
                        value={fontFamily}
                        onChange={(e) => onFontFamilyChange(e.target.value)}
                        style={{
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
                            marginBottom: '16px'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        {googleFonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                        ))}
                    </select>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Title Font Size: {titleFontSize}px
                            </label>
                            <input
                                type="range"
                                min="16"
                                max="48"
                                step="2"
                                value={titleFontSize}
                                onChange={(e) => onTitleFontSizeChange(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: '#e5e7eb',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Number Font Size: {numberFontSize}px
                            </label>
                            <input
                                type="range"
                                min="12"
                                max="32"
                                step="2"
                                value={numberFontSize}
                                onChange={(e) => onNumberFontSizeChange(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: '#e5e7eb',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Dimensions Controls */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '18px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>📐 Dimensions</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151',
                                display: 'block',
                                marginBottom: '8px'
                            }}>Width: {width}px</label>
                            <input
                                type="range"
                                min="400"
                                max="1000"
                                step="50"
                                value={width}
                                onChange={(e) => onWidthChange(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: '#e5e7eb',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151',
                                display: 'block',
                                marginBottom: '8px'
                            }}>Height: {height}px</label>
                            <input
                                type="range"
                                min="300"
                                max="800"
                                step="25"
                                value={height}
                                onChange={(e) => onHeightChange(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: '#e5e7eb',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151',
                                display: 'block',
                                marginBottom: '8px'
                            }}>Border Radius: {borderRadius}px</label>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={borderRadius}
                                onChange={(e) => onBorderRadiusChange(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: '#e5e7eb',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Grid Controls */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '18px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>🔲 Grid</h3>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}>
                        <input
                            type="checkbox"
                            checked={showGrid}
                            onChange={(e) => onShowGridChange(e.target.checked)}
                            style={{
                                transform: 'scale(1.3)',
                                accentColor: '#3b82f6',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>Show Grid Lines</span>
                    </label>
                </div>

                {/* Position Controls */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '18px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>📍 Positions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Title Position:
                            </label>
                            <select
                                value={titlePosition}
                                onChange={(e) => onTitlePositionChange(e.target.value as TitlePosition)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '2px solid #d1d5db',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    backgroundColor: '#ffffff',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Number Position:
                            </label>
                            <select
                                value={numberPosition}
                                onChange={(e) => onNumberPositionChange(e.target.value as NumberPosition)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '2px solid #d1d5db',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    backgroundColor: '#ffffff',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="top-left">Top Left</option>
                                <option value="top-right">Top Right</option>
                                <option value="center">Center</option>
                                <option value="bottom-left">Bottom Left</option>
                                <option value="bottom-right">Bottom Right</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Import/Export Settings */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '18px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>💾 Settings</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={handleExportSettings}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: '#3b82f6',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2563eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#3b82f6';
                            }}
                        >
                            📋 Export Settings
                        </button>

                        <button
                            onClick={() => setShowImportInput(!showImportInput)}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: showImportInput ? '#10b981' : '#6b7280',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!showImportInput) {
                                    e.currentTarget.style.backgroundColor = '#4b5563';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!showImportInput) {
                                    e.currentTarget.style.backgroundColor = '#6b7280';
                                }
                            }}
                        >
                            📥 {showImportInput ? 'Cancel Import' : 'Import Settings'}
                        </button>

                        {showImportInput && (
                            <div style={{ marginTop: '12px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    Paste Settings JSON:
                                </label>
                                <textarea
                                    value={importJson}
                                    onChange={(e) => setImportJson(e.target.value)}
                                    placeholder='{"colors":{"main":"#000000",...}}'
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '2px solid #d1d5db',
                                        fontSize: '12px',
                                        fontFamily: 'monospace',
                                        backgroundColor: '#ffffff',
                                        color: '#374151',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                />
                                <button
                                    onClick={handleImportSettings}
                                    disabled={!importJson.trim()}
                                    style={{
                                        marginTop: '8px',
                                        padding: '8px 16px',
                                        backgroundColor: importJson.trim() ? '#10b981' : '#d1d5db',
                                        color: importJson.trim() ? '#ffffff' : '#6b7280',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        cursor: importJson.trim() ? 'pointer' : 'not-allowed',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                >
                                    Apply Settings
                                </button>
                            </div>
                        )}

                        {/* Export Images Button */}
                        <button
                            onClick={() => setShowExportImages(!showExportImages)}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: showExportImages ? '#7c3aed' : '#8b5cf6',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                marginTop: '12px'
                            }}
                            onMouseEnter={(e) => {
                                if (!showExportImages) {
                                    e.currentTarget.style.backgroundColor = '#7c3aed';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!showExportImages) {
                                    e.currentTarget.style.backgroundColor = '#8b5cf6';
                                }
                            }}
                        >
                            🖼️ {showExportImages ? 'Cancel Export' : 'Export Images'}
                        </button>

                        {showExportImages && (
                            <div style={{ marginTop: '12px' }}>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            color: '#374151'
                                        }}>
                                            Width (px):
                                        </label>
                                        <input
                                            type="number"
                                            value={exportWidth}
                                            onChange={(e) => handleExportWidthChange(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #d1d5db',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                            placeholder="1920"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            color: '#374151'
                                        }}>
                                            Height (px):
                                        </label>
                                        <input
                                            type="number"
                                            value={exportHeight}
                                            onChange={(e) => handleExportHeightChange(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #d1d5db',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                            placeholder="Auto"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleExportImages}
                                    disabled={isExporting || !exportWidth.trim() || !exportHeight.trim()}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        backgroundColor: (isExporting || !exportWidth.trim() || !exportHeight.trim()) ? '#d1d5db' : '#10b981',
                                        color: (isExporting || !exportWidth.trim() || !exportHeight.trim()) ? '#6b7280' : '#ffffff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: (isExporting || !exportWidth.trim() || !exportHeight.trim()) ? 'not-allowed' : 'pointer',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                >
                                    {isExporting ? '🔄 Generating...' : '📦 Download ZIP'}
                                </button>
                            </div>
                        )}

                        {exportMessage && (
                            <div style={{
                                padding: '8px 12px',
                                backgroundColor: exportMessage.includes('successfully') || exportMessage.includes('copied') ? '#dcfce7' : '#fef2f2',
                                color: exportMessage.includes('successfully') || exportMessage.includes('copied') ? '#16a34a' : '#dc2626',
                                borderRadius: '4px',
                                fontSize: '13px',
                                fontWeight: '500',
                                textAlign: 'center'
                            }}>
                                {exportMessage}
                            </div>
                        )}

                        {showExportSettings && (
                            <div style={{ marginTop: '12px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    Settings JSON (copy manually):
                                </label>
                                <textarea
                                    value={exportSettingsJson}
                                    readOnly
                                    rows={8}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '2px solid #d1d5db',
                                        fontSize: '12px',
                                        fontFamily: 'monospace',
                                        backgroundColor: '#f9fafb',
                                        color: '#374151',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.select();
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                />
                                <button
                                    onClick={() => setShowExportSettings(false)}
                                    style={{
                                        marginTop: '8px',
                                        padding: '6px 12px',
                                        backgroundColor: '#6b7280',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarControls;