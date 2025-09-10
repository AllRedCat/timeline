/**
 * Calculates the width (in pixels) of a timeline item bar based on its start and end dates,
 * the overall time range, and the total width of the timeline.
 * Ensures a minimum width of 20px and subtracts 4px for spacing.
 *
 * @param {string|Date} startDate - The start date of the item.
 * @param {string|Date} endDate - The end date of the item.
 * @param {Object} timeRange - The overall time range object with .start, .end, and .totalDays.
 * @param {number} [timelineWidth=800] - The total width of the timeline in pixels.
 * @returns {number} The calculated width in pixels for the item bar.
 */
function calculateWidth(startDate, endDate, timeRange, timelineWidth = 800) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const width = (durationInDays / timeRange.totalDays) * timelineWidth;
    return Math.max(20, width - 4);
}

export default calculateWidth;