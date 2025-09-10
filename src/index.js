import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ZoomIn, ZoomOut } from "react-bootstrap-icons";
import timelineItems from "./timelineItems.js";
import assignLanes from "./assignLanes.js";
import calculateTimeRange from "./timeRange.js";
import calculatePosition from "./position.js";
import calculateWidth from "./width.js";

function App() {
  // State for zoom level (1.0 = normal, >1.0 = zoomed in, <1.0 = zoomed out)
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Alocate items to lanes using the provided function
  const lanes = assignLanes(timelineItems);
  // Calculate the overall time range (earliest start to latest end) for all timeline items
  const timeRange = calculateTimeRange(timelineItems);

  // Keep timeline container width fixed
  const timelineWidth = window.innerWidth * 0.98;
  
  // Calculate the actual content width based on timeline items
  const calculateContentWidth = () => {
    if (timelineItems.length === 0) return timelineWidth;
    
    const maxPosition = Math.max(
      ...timelineItems.map(item => {
        const position = calculatePosition(item.start, timeRange, timelineWidth) * zoomLevel;
        const width = calculateWidth(item.start, item.end, timeRange, timelineWidth) * zoomLevel;
        return position + width;
      })
    );
    
    return Math.max(timelineWidth, maxPosition + 20); // Add some padding
  };
  
  const contentWidth = calculateContentWidth();

  // Zoom control functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 2.5)); // Max zoom 5x
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.25)); // Min zoom 0.1x
  };

  const handleResetZoom = () => {
    setZoomLevel(1.0);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col justify-center items-center p-4"
      onWheel={handleWheel}
    >
      {/* Zoom Controls */}
      <div className="w-full">
        <div className="mb-4 flex gap-2">
          <button
            onClick={handleResetZoom}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Reset ({Math.round(zoomLevel * 100)}%)
          </button>
          <button
            onClick={handleZoomOut}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm"
          >
            <ZoomOut />
          </button>
          <button
            onClick={handleZoomIn}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm"
          >
            <ZoomIn />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-col border border-neutral-200 rounded-sm overflow-x-auto"
        style={{ width: `${timelineWidth}px`, height: '600px' }}
      >
        {lanes.map((lane, laneIndex) => (
          <div key={laneIndex}
            className="relative"
            style={{ height: `${40 * zoomLevel}px` }}
          >
            {/* Divider line that extends to full content width */}
            {laneIndex > 0 && (
              <div 
                className="absolute top-0 left-0 bg-neutral-200"
                style={{ 
                  width: `${contentWidth}px`, 
                  height: '1px' 
                }}
              />
            )}
            {lane.map(item => (
              <div
                key={item.id}
                className="ml-1 top-1 bg-blue-500 rounded-sm text-xs text-white overflow-hidden"
                style={{
                  position: 'absolute',
                  left: `${calculatePosition(item.start, timeRange, timelineWidth) * zoomLevel}px`,
                  width: `${calculateWidth(item.start, item.end, timeRange, timelineWidth) * zoomLevel}px`,
                  height: `${30 * zoomLevel}px`,
                  top: `${(40 * zoomLevel - 30 * zoomLevel) / 2}px`, // Center vertically in the lane
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