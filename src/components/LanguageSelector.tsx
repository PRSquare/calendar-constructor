import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const LanguageSelector: React.FC = () => {
    const { language, setLanguage, availableLanguages } = useLanguage();

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
        }}>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '2px solid #d1d5db',
                    fontSize: '14px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    outline: 'none',
                    cursor: 'pointer',
                    minWidth: '120px'
                }}
            >
                {availableLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.nativeName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;