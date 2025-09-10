/**
 * Calculates the overall time range (earliest start date to latest end date) for a set of timeline items.
 * Returns an object containing the minimum start date, maximum end date, and the total number of days in the range.
 *
 * @param {Array} items - Array of timeline items, each with 'start' and 'end' date properties.
 * @returns {Object} An object with 'start' (Date), 'end' (Date), and 'totalDays' (number).
 */
function calculateTimeRange(items) {
    if (items.length === 0) return { start: 0, end: 0, totalDays: 0 };

    const dates = items.flatMap(item => [new Date(item.start), new Date(item.end)]);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

    return {
        start: minDate,
        end: maxDate,
        totalDays: totalDays
    };
}

export default calculateTimeRange;