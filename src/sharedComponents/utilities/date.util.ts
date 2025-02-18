export function getCurrentDate() {
    let now = new Date();
    let offset = now.getTimezoneOffset();
    offset = Math.abs(offset / 60);
    now.setHours(now.getHours() + offset);
    return now
}

export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}