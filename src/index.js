import React from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";
import assignLanes from "./assignLanes.js";

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

function App() {
  // Alocate items to lanes using the provided function
  const lanes = assignLanes(timelineItems);
  // Calculate the overall time range (earliest start to latest end) for all timeline items
  const timeRange = calculateTimeRange(timelineItems);
  
  // A responsive width that adapts to screen size
  const timelineWidth = Math.min(1000, window.innerWidth * 0.8);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center p-4">
      <div className="text-center mb-4">
        <h2>Good luck with your assignment! {"\u2728"}</h2>
        <h3>{timelineItems.length} timeline items to render</h3>
      </div>
      <div 
        className="relative flex flex-col divide-y divide-neutral-200 border border-neutral-200 rounded-sm overflow-x-auto"
        style={{ width: `${timelineWidth}px` }}
      >
        {lanes.map((lane, laneIndex) => (
          <div key={laneIndex}
            className="relative h-[40px]"
          >
            {lane.map(item => (
                <div
                  key={item.id}
                  className="h-[30px] ml-1 top-1 bg-blue-500 rounded-sm text-xs text-white overflow-hidden"
                  style={{
                    position: 'absolute',
                    left: `${calculatePosition(item.start, timeRange, timelineWidth)}px`,
                    width: `${calculateWidth(item.start, item.end, timeRange, timelineWidth)}px`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 4px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                  title={`${item.name} (${item.start} to ${item.end})`}
                >
                  {item.name}
                </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);