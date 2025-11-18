export interface Translation {
    // App title and descriptions
    title: string;
    selectMonth: string;
    monthInputHelper: string;
    usageInstructions: string;
    yearOverview: string;

    // Usage instructions
    instructions: {
        colors: string;
        font: string;
        grid: string;
        titlePosition: string;
        numberPosition: string;
    };

    // Control labels
    controls: {
        colors: string;
        main: string;
        accent: string;
        background: string;
        hint: string;
        font: string;
        titleFontSize: string;
        numberFontSize: string;
        grid: string;
        show: string;
        hide: string;
        titlePosition: string;
        numberPosition: string;
        dimensions: string;
        width: string;
        height: string;
        borderRadius: string;
        settings: string;
        export: string;
        import: string;
        exportImages: string;
        exportWidth: string;
        exportHeight: string;
        language: string;
        dayNameFormat: string;
        shortDayNames: string;
        longDayNames: string;
    };

    // Position options
    positions: {
        left: string;
        center: string;
        right: string;
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
    };

    // Messages
    messages: {
        settingsCopied: string;
        settingsDownloaded: string;
        settingsImported: string;
        invalidSettings: string;
        generatingImages: string;
        exportComplete: string;
        validDimensions: string;
        generating: string;
        of: string;
    };    // Month names
    months: {
        january: string;
        february: string;
        march: string;
        april: string;
        may: string;
        june: string;
        july: string;
        august: string;
        september: string;
        october: string;
        november: string;
        december: string;
    };

    // Day names
    days: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };

    // Full day names
    daysLong: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
}

export const translations: Record<string, Translation> = {
    en: {
        title: 'Calendar Generator',
        selectMonth: 'Select Month:',
        monthInputHelper: 'Enter numbers only (e.g., 202409)',
        usageInstructions: 'Usage Instructions:',
        yearOverview: 'Year Overview',

        instructions: {
            colors: 'Click the color boxes to change main text, accent (weekends), background, and grid line colors',
            font: 'Select from popular Google Fonts for a different typography style',
            grid: 'Toggle grid lines on/off for a cleaner or more structured look',
            titlePosition: 'Place the month name on the left, center, or right',
            numberPosition: 'Position day numbers in different corners of each cell or center them'
        },

        controls: {
            colors: 'Colors',
            main: 'Main:',
            accent: 'Accent:',
            background: 'Background:',
            hint: 'Grid:',
            font: 'Font Family',
            titleFontSize: 'Title Font Size',
            numberFontSize: 'Number Font Size',
            grid: 'Grid Lines',
            show: 'Show',
            hide: 'Hide',
            titlePosition: 'Title Position',
            numberPosition: 'Number Position',
            dimensions: 'Dimensions',
            width: 'Width',
            height: 'Height',
            borderRadius: 'Border Radius',
            settings: 'Settings',
            export: 'Export Settings',
            import: 'Import Settings',
            exportImages: 'Export Calendar Images',
            exportWidth: 'Export Width (px)',
            exportHeight: 'Export Height (px)',
            language: 'Language',
            dayNameFormat: 'Day Name Format',
            shortDayNames: 'Short (Mon, Tue, Wed)',
            longDayNames: 'Long (Monday, Tuesday, Wednesday)'
        },

        positions: {
            left: 'Left',
            center: 'Center',
            right: 'Right',
            topLeft: 'Top Left',
            topRight: 'Top Right',
            bottomLeft: 'Bottom Left',
            bottomRight: 'Bottom Right'
        },

        messages: {
            settingsCopied: 'Settings copied to clipboard!',
            settingsDownloaded: 'Settings downloaded as JSON file!',
            settingsImported: 'Settings imported successfully!',
            invalidSettings: 'Invalid settings format. Please check your JSON.',
            generatingImages: 'Generating calendar images...',
            exportComplete: 'ZIP file downloaded successfully!',
            validDimensions: 'Please enter valid width and height values',
            generating: 'Generating',
            of: 'of'
        },

        months: {
            january: 'January',
            february: 'February',
            march: 'March',
            april: 'April',
            may: 'May',
            june: 'June',
            july: 'July',
            august: 'August',
            september: 'September',
            october: 'October',
            november: 'November',
            december: 'December'
        },

        days: {
            monday: 'Mon',
            tuesday: 'Tue',
            wednesday: 'Wed',
            thursday: 'Thu',
            friday: 'Fri',
            saturday: 'Sat',
            sunday: 'Sun'
        },

        daysLong: {
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday'
        }
    },

    ru: {
        title: 'Генератор календаря',
        selectMonth: 'Выберите месяц:',
        monthInputHelper: 'Введите только цифры (например, 202409)',
        usageInstructions: 'Инструкции по использованию:',
        yearOverview: 'Обзор года',

        instructions: {
            colors: 'Нажмите на цветные квадраты, чтобы изменить цвет основного текста, акцента (выходные), фона и линий сетки',
            font: 'Выберите из популярных Google Fonts для другого стиля типографики',
            grid: 'Включите/отключите линии сетки для более чистого или структурированного вида',
            titlePosition: 'Разместите название месяца слева, по центру или справа',
            numberPosition: 'Расположите номера дней в разных углах каждой ячейки или по центру'
        },

        controls: {
            colors: 'Цвета',
            main: 'Основной:',
            accent: 'Акцент:',
            background: 'Фон:',
            hint: 'Сетка:',
            font: 'Шрифт',
            titleFontSize: 'Размер шрифта заголовка',
            numberFontSize: 'Размер шрифта чисел',
            grid: 'Линии сетки',
            show: 'Показать',
            hide: 'Скрыть',
            titlePosition: 'Позиция заголовка',
            numberPosition: 'Позиция чисел',
            dimensions: 'Размеры',
            width: 'Ширина',
            height: 'Высота',
            borderRadius: 'Радиус границы',
            settings: 'Настройки',
            export: 'Экспорт настроек',
            import: 'Импорт настроек',
            exportImages: 'Экспорт изображений календаря',
            exportWidth: 'Ширина экспорта (px)',
            exportHeight: 'Высота экспорта (px)',
            language: 'Язык',
            dayNameFormat: 'Формат дней недели',
            shortDayNames: 'Краткий (Пн, Вт, Ср)',
            longDayNames: 'Полный (Понедельник, Вторник, Среда)'
        },

        positions: {
            left: 'Слева',
            center: 'По центру',
            right: 'Справа',
            topLeft: 'Вверху слева',
            topRight: 'Вверху справа',
            bottomLeft: 'Внизу слева',
            bottomRight: 'Внизу справа'
        },

        messages: {
            settingsCopied: 'Настройки скопированы в буфер обмена!',
            settingsDownloaded: 'Настройки загружены как JSON файл!',
            settingsImported: 'Настройки успешно импортированы!',
            invalidSettings: 'Неверный формат настроек. Проверьте ваш JSON.',
            generatingImages: 'Генерация изображений календаря...',
            exportComplete: 'ZIP файл успешно загружен!',
            validDimensions: 'Пожалуйста, введите корректные значения ширины и высоты',
            generating: 'Генерация',
            of: 'из'
        },

        months: {
            january: 'Январь',
            february: 'Февраль',
            march: 'Март',
            april: 'Апрель',
            may: 'Май',
            june: 'Июнь',
            july: 'Июль',
            august: 'Август',
            september: 'Сентябрь',
            october: 'Октябрь',
            november: 'Ноябрь',
            december: 'Декабрь'
        },

        days: {
            monday: 'Пн',
            tuesday: 'Вт',
            wednesday: 'Ср',
            thursday: 'Чт',
            friday: 'Пт',
            saturday: 'Сб',
            sunday: 'Вс'
        },

        daysLong: {
            monday: 'Понедельник',
            tuesday: 'Вторник',
            wednesday: 'Среда',
            thursday: 'Четверг',
            friday: 'Пятница',
            saturday: 'Суббота',
            sunday: 'Воскресенье'
        }
    }
};