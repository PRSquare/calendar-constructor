import type { Translation } from './translations';

export const getMonthNames = (t: Translation): string[] => {
    return [
        t.months.january,
        t.months.february,
        t.months.march,
        t.months.april,
        t.months.may,
        t.months.june,
        t.months.july,
        t.months.august,
        t.months.september,
        t.months.october,
        t.months.november,
        t.months.december
    ];
};

export const getDayNames = (t: Translation, useLongNames: boolean = false): string[] => {
    const daySource = useLongNames ? t.daysLong : t.days;
    return [
        daySource.monday,
        daySource.tuesday,
        daySource.wednesday,
        daySource.thursday,
        daySource.friday,
        daySource.saturday,
        daySource.sunday
    ];
};