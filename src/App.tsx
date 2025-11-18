import { useState } from 'react'
import CalendarCanvas from './components/CalendarCanvas'
import CalendarControls, { type CalendarSettings } from './components/CalendarControls'
import LanguageSelector from './components/LanguageSelector'
import type { CalendarColors, TitlePosition, NumberPosition } from './components/CalendarCanvas'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import './App.css'

function AppContent() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 8, 1)) // September 2024
  const [dateInputValue, setDateInputValue] = useState('2024-09') // Separate state for input value

  // Calendar customization states
  const [colors, setColors] = useState<CalendarColors>({
    main: '#000000',
    accent: '#ff0000',
    background: '#ffffff',
    hint: '#d3d3d3'
  });
  const [fontFamily, setFontFamily] = useState('Arial');
  const [titleFontSize, setTitleFontSize] = useState(32);
  const [numberFontSize, setNumberFontSize] = useState(20);
  const [showGrid, setShowGrid] = useState(true);
  const [titlePosition, setTitlePosition] = useState<TitlePosition>('center');
  const [numberPosition, setNumberPosition] = useState<NumberPosition>('center');
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(400);
  const [borderRadius, setBorderRadius] = useState(15);
  const [useLongDayNames, setUseLongDayNames] = useState(false);

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    // Remove all non-numeric characters except dash if it's already there
    let cleanValue = inputValue.replace(/[^\d-]/g, '');

    // Remove dash and work with numbers only for formatting
    let numbersOnly = cleanValue.replace(/-/g, '');

    // Auto-format to YYYY-MM as user types
    let formattedValue = '';
    if (numbersOnly.length > 0) {
      // Add year part (up to 4 digits)
      formattedValue = numbersOnly.substring(0, 4);

      // Add dash and month part if we have more than 4 digits
      if (numbersOnly.length > 4) {
        formattedValue += '-' + numbersOnly.substring(4, 6);
      }
    }

    // Update the input value immediately
    setDateInputValue(formattedValue);

    // Only update calendar if we have a complete and valid date (YYYY-MM format)
    if (formattedValue.length === 7 && formattedValue.includes('-')) {
      const [year, month] = formattedValue.split('-');
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);

      // Validate year and month ranges
      if (yearNum >= 1000 && yearNum <= 9999 && monthNum >= 1 && monthNum <= 12) {
        try {
          const date = new Date(yearNum, monthNum - 1, 1); // monthNum - 1 because months are 0-indexed
          if (!isNaN(date.getTime())) {
            setSelectedDate(date);
          }
        } catch (error) {
          console.warn('Invalid date:', formattedValue);
        }
      }
    }
  };

  const handleSettingsImport = (settings: CalendarSettings) => {
    setColors(settings.colors);
    setFontFamily(settings.fontFamily);
    setTitleFontSize(settings.titleFontSize);
    setNumberFontSize(settings.numberFontSize);
    setShowGrid(settings.showGrid);
    setTitlePosition(settings.titlePosition);
    setNumberPosition(settings.numberPosition);
    setCanvasWidth(settings.width);
    setCanvasHeight(settings.height);
    setBorderRadius(settings.borderRadius);
    setUseLongDayNames(settings.useLongDayNames);
  };

  return (
    <>
      <LanguageSelector />
      <div style={{ margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>{t.title}</h1>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <label htmlFor="month-picker" style={{ marginRight: '10px', fontSize: '16px' }}>
            {t.selectMonth}
          </label>
          <input
            id="month-picker"
            type="text"
            value={dateInputValue}
            onChange={handleMonthChange}
            placeholder="2024-09"
            maxLength={8}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '2px solid #d1d5db',
              fontSize: '16px',
              fontFamily: 'monospace',
              width: '120px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            onKeyDown={(e) => {
              // Allow: backspace, delete, tab, escape, enter
              if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
              }
              // Ensure that it's a number and stop the keypress
              if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
              }
            }}
          />
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            {t.monthInputHelper}
          </div>
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '0 20px'
          }}
        >
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: '30px',
            alignItems: 'flex-start'
          }}>
            <CalendarControls
              colors={colors}
              fontFamily={fontFamily}
              titleFontSize={titleFontSize}
              numberFontSize={numberFontSize}
              showGrid={showGrid}
              titlePosition={titlePosition}
              numberPosition={numberPosition}
              width={canvasWidth}
              height={canvasHeight}
              borderRadius={borderRadius}
              useLongDayNames={useLongDayNames}
              selectedDate={selectedDate}
              onColorsChange={setColors}
              onFontFamilyChange={setFontFamily}
              onTitleFontSizeChange={setTitleFontSize}
              onNumberFontSizeChange={setNumberFontSize}
              onShowGridChange={setShowGrid}
              onTitlePositionChange={setTitlePosition}
              onNumberPositionChange={setNumberPosition}
              onWidthChange={setCanvasWidth}
              onHeightChange={setCanvasHeight}
              onBorderRadiusChange={setBorderRadius}
              onUseLongDayNamesChange={setUseLongDayNames}
              onSettingsImport={handleSettingsImport}
            />

          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            minHeight: '500px',
            marginLeft: '20px',
            marginRight: '40px',
          }}>
            <CalendarCanvas
              date={selectedDate}
              width={canvasWidth}
              height={canvasHeight}
              colors={colors}
              fontFamily={fontFamily}
              titleFontSize={titleFontSize}
              numberFontSize={numberFontSize}
              showGrid={showGrid}
              titlePosition={titlePosition}
              numberPosition={numberPosition}
              borderRadius={borderRadius}
              translation={t}
              useLongDayNames={useLongDayNames}
            />
          </div>
        </div>

        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '15px'
        }}>
          <div style={{
            maxWidth: '800px',
            width: '100%',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '12px' }}>{t.usageInstructions}</h3>
            <ul>
              <li><strong>{t.controls.colors}:</strong> {t.instructions.colors}</li>
              <li><strong>{t.controls.font}:</strong> {t.instructions.font}</li>
              <li><strong>{t.controls.grid}:</strong> {t.instructions.grid}</li>
              <li><strong>{t.controls.titlePosition}:</strong> {t.instructions.titlePosition}</li>
              <li><strong>{t.controls.numberPosition}:</strong> {t.instructions.numberPosition}</li>
            </ul>
          </div>
        </div>

        {/* Year View Grid */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          <div style={{
            width: '100%',
            padding: '5px'
          }}>
            <h3 style={{
              textAlign: 'center',
              marginBottom: '30px',
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {selectedDate.getFullYear()} {t.yearOverview}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '30px',
              justifyItems: 'center'
            }}>
              {Array.from({ length: 12 }, (_, index) => {
                const monthDate = new Date(selectedDate.getFullYear(), index, 1);
                const aspectRatio = canvasWidth / canvasHeight;
                const scaleFactor = 0.85; // 85% of original size
                const smallWidth = Math.round(canvasWidth * scaleFactor);
                const smallHeight = Math.round(smallWidth / aspectRatio); // Maintain aspect ratio

                return (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CalendarCanvas
                      date={monthDate}
                      width={smallWidth}
                      height={smallHeight}
                      colors={colors}
                      fontFamily={fontFamily}
                      titleFontSize={Math.round(titleFontSize * scaleFactor)} // Exact proportional scaling
                      numberFontSize={Math.round(numberFontSize * scaleFactor)} // Exact proportional scaling
                      showGrid={showGrid}
                      titlePosition={titlePosition}
                      numberPosition={numberPosition}
                      borderRadius={Math.round(borderRadius * scaleFactor)} // Exact proportional scaling
                      translation={t}
                      useLongDayNames={useLongDayNames}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App
