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

export const getDayNames = (t: Translation): string[] => {
    return [
        t.days.monday,
        t.days.tuesday,
        t.days.wednesday,
        t.days.thursday,
        t.days.friday,
        t.days.saturday,
        t.days.sunday
    ];
};