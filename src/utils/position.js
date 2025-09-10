/**
 * Calculates the horizontal position (in pixels) of a timeline item bar based on its start date,
 * the overall time range, and the total width of the timeline.
 *
 * @param {string|Date} startDate - The start date of the item.
 * @param {Object} timeRange - The overall time range object with .start, .end, and .totalDays.
 * @param {number} [timelineWidth=800] - The total width of the timeline in pixels.
 * @returns {number} The calculated left position in pixels for the item bar.
 */
function calculatePosition(startDate, timeRange, timelineWidth = 800) {
    const start = new Date(startDate);
    const daysFromStart = Math.ceil((start - timeRange.start) / (1000 * 60 * 60 * 24));
    const position = (daysFromStart / timeRange.totalDays) * timelineWidth;
    return Math.max(0, position);
}

export default calculatePosition;