import React from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";
import assignLanes from "./assignLanes.js";
import calculateTimeRange from "./timeRange.js";
import calculatePosition from "./position.js";
import calculateWidth from "./width.js";

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