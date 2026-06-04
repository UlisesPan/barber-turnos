"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const formatDate = (date) => {
    if (!date)
        return '';
    let dateObj;
    if (typeof date === 'string') {
        dateObj = new Date(date);
    }
    else {
        dateObj = date;
    }
    if (isNaN(dateObj.getTime())) {
        return '';
    }
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
exports.formatDate = formatDate;
