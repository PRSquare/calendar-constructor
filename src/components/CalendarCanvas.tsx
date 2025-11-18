import React, { useEffect, useRef } from 'react';
import type { Translation } from '../i18n/translations';
import { getMonthNames, getDayNames } from '../i18n/helpers';

export interface CalendarColors {
    main: string;        // Main text color (default: black)
    accent: string;      // Weekend/highlight color (default: red)
    background: string;  // Background color (default: white)
    hint: string;        // Grid lines and subtle elements (default: light grey)
}

export type TitlePosition = 'left' | 'center' | 'right';
export type NumberPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface CalendarCanvasProps {
    date: Date;
    width?: number;
    height?: number;
    colors?: CalendarColors;
    fontFamily?: string;  // Google Font name or standard font
    titleFontSize?: number;  // Font size for month title
    numberFontSize?: number; // Font size for day numbers
    showGrid?: boolean;
    titlePosition?: TitlePosition;
    numberPosition?: NumberPosition;
    borderRadius?: number;  // Border radius for the background
    useLongDayNames?: boolean;  // Use full day names instead of abbreviated
    translation: Translation;  // Translation object
}

const CalendarCanvas: React.FC<CalendarCanvasProps> = ({
    date,
    width = 600,
    height = 400,
    colors = {
        main: '#000000',
        accent: '#ff0000',
        background: '#ffffff',
        hint: '#d3d3d3'
    },
    fontFamily = 'Arial',
    titleFontSize = 32,
    numberFontSize = 20,
    showGrid = true,
    titlePosition = 'center',
    numberPosition = 'center',
    borderRadius = 15,
    useLongDayNames = false,
    translation
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Get translated month and day names
    const monthNames = getMonthNames(translation);
    const dayNames = getDayNames(translation, useLongDayNames);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Wait for fonts to load before rendering
        const renderCalendar = async () => {
            // Ensure the font is loaded before using it
            if (fontFamily !== 'Arial') {
                try {
                    // Load font with different weights and sizes
                    await Promise.all([
                        document.fonts.load(`bold ${titleFontSize}px "${fontFamily}"`),
                        document.fonts.load(`bold ${numberFontSize}px "${fontFamily}"`),
                        document.fonts.load(`bold 18px "${fontFamily}"`), // For day headers
                        document.fonts.load(`normal ${titleFontSize}px "${fontFamily}"`),
                        document.fonts.load(`normal ${numberFontSize}px "${fontFamily}"`),
                        document.fonts.load(`normal 18px "${fontFamily}"`)
                    ]);

                    // Additional check to ensure font is ready
                    await document.fonts.ready;
                } catch (error) {
                    console.warn('Font loading failed:', fontFamily, error);
                }
            }

            // Clear canvas to transparent
            ctx.clearRect(0, 0, width, height);

            // Set high DPI scaling for crisp text
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.scale(dpr, dpr);

            // Calculate dimensions
            const padding = 20;
            const headerHeight = 60;
            const dayHeaderHeight = 40;
            const gridStartY = padding + headerHeight + dayHeaderHeight;
            const gridWidth = width - 2 * padding;
            const gridHeight = height - gridStartY - padding;
            const cellWidth = gridWidth / 7;
            const cellHeight = gridHeight / 6;

            // Draw rounded background for the entire grid area (from title to bottom)
            const gridAreaX = padding;
            const gridAreaY = padding;
            const gridAreaWidth = width - 2 * padding;
            const gridAreaHeight = height - 2 * padding;

            // Fill the rounded grid area with background color
            if (colors.background !== 'transparent') {
                ctx.fillStyle = colors.background;
                ctx.beginPath();
                ctx.roundRect(gridAreaX, gridAreaY, gridAreaWidth, gridAreaHeight, borderRadius);
                ctx.fill();
            }

            // Helper function to get title x position
            const getTitleX = () => {
                switch (titlePosition) {
                    case 'left':
                        return padding + 20;
                    case 'right':
                        return width - padding - 20;
                    case 'center':
                    default:
                        return width / 2;
                }
            };

            // Helper function to get title text alignment
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

            // Draw month title
            ctx.fillStyle = colors.main;
            ctx.font = `bold ${titleFontSize}px "${fontFamily}", Arial, sans-serif`;
            ctx.textAlign = getTitleAlign();
            ctx.textBaseline = 'middle';
            const monthTitle = monthNames[date.getMonth()];
            ctx.fillText(monthTitle, getTitleX(), padding + headerHeight / 2);

            // Draw day headers
            ctx.font = `bold 18px "${fontFamily}", Arial, sans-serif`;
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

            // Calculate first day of month and number of days
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();

            // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
            // Convert to Monday = 0 format
            let startDay = firstDay.getDay();
            startDay = startDay === 0 ? 6 : startDay - 1;

            // Draw calendar grid lines (if enabled) - with clipping to stay within rounded corners
            if (showGrid) {
                // Save the current context state
                ctx.save();

                // Create a clipping path using the same rounded rectangle as the background
                ctx.beginPath();
                ctx.roundRect(gridAreaX, gridAreaY, gridAreaWidth, gridAreaHeight, Number(borderRadius));
                ctx.clip();

                ctx.strokeStyle = colors.hint;
                ctx.lineWidth = 1;

                // Horizontal lines
                for (let i = 0; i <= 6; i++) {
                    const y = gridStartY + i * cellHeight;
                    ctx.beginPath();
                    ctx.moveTo(padding, y);
                    ctx.lineTo(width - padding, y);
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

            // Helper function to get number position within cell
            const getNumberPosition = (cellX: number, cellY: number, cellW: number, cellH: number) => {
                const margin = 8;
                switch (numberPosition) {
                    case 'top-left':
                        return { x: cellX + margin, y: cellY + margin + 15, align: 'left' as CanvasTextAlign };
                    case 'top-right':
                        return { x: cellX + cellW - margin, y: cellY + margin + 15, align: 'right' as CanvasTextAlign };
                    case 'bottom-left':
                        return { x: cellX + margin, y: cellY + cellH - margin - 5, align: 'left' as CanvasTextAlign };
                    case 'bottom-right':
                        return { x: cellX + cellW - margin, y: cellY + cellH - margin - 5, align: 'right' as CanvasTextAlign };
                    case 'center':
                    default:
                        return { x: cellX + cellW / 2, y: cellY + cellH / 2, align: 'center' as CanvasTextAlign };
                }
            };

            // Draw dates
            ctx.font = `bold ${numberFontSize}px "${fontFamily}", Arial, sans-serif`;
            ctx.textBaseline = 'middle'; // Use middle baseline for all positions for consistency

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
        };

        // Call the async rendering function
        renderCalendar();

    }, [date, width, height, colors, fontFamily, titleFontSize, numberFontSize, showGrid, titlePosition, numberPosition, borderRadius, useLongDayNames, translation]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                border: 'none',
                display: 'block',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#21354788',
                borderRadius: '10px'
            }}
        />
    );
};

export default CalendarCanvas;