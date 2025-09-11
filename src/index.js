import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ZoomIn, ZoomOut } from "react-bootstrap-icons";
import timelineItems from "./timelineItems.js";
import assignLanes from "./assignLanes.js";
import calculateTimeRange from "./utils/timeRange.js";
import calculatePosition from "./utils/position.js";
import calculateWidth from "./utils/width.js";

function App() {
  // State for zoom level
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // State for editing item names
  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [timelineData, setTimelineData] = useState(timelineItems);

  // Alocate items to lanes using the provided function
  const lanes = assignLanes(timelineData);
  // Calculate the overall time range (earliest start to latest end) for all timeline items
  const timeRange = calculateTimeRange(timelineData);

  // Keep timeline container width fixed
  const timelineWidth = window.innerWidth * 0.98;

  // Calculate the actual content width based on timeline items
  const calculateContentWidth = () => {
    if (timelineData.length === 0) return timelineWidth;

    const maxPosition = Math.max(
      ...timelineData.map(item => {
        const position = calculatePosition(item.start, timeRange, timelineWidth) * zoomLevel;
        const width = calculateWidth(item.start, item.end, timeRange, timelineWidth) * zoomLevel;
        return position + width;
      })
    );

    return Math.max(timelineWidth, maxPosition + 20);
  };

  const contentWidth = calculateContentWidth();

  // Generate date markers for the timeline axis
  const generateDateMarkers = () => {
    if (timeRange.totalDays === 0) return [];

    const markers = [];
    const startDate = new Date(timeRange.start);
    const endDate = new Date(timeRange.end);

    // Calculate minimum pixel spacing between markers to avoid overlap
    const minPixelSpacing = 60;
    const totalTimelineWidth = timelineWidth * zoomLevel;
    const maxMarkers = Math.floor(totalTimelineWidth / minPixelSpacing);

    // Calculate days between markers based on available space
    const daysBetweenMarkers = Math.max(1, Math.ceil(timeRange.totalDays / maxMarkers));

    // Generate markers with smart spacing
    const usedPositions = new Set();
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + daysBetweenMarkers)) {
      const position = calculatePosition(d, timeRange, timelineWidth) * zoomLevel;

      // Check if this position is too close to existing markers
      const tooClose = Array.from(usedPositions).some(usedPos =>
        Math.abs(position - usedPos) < minPixelSpacing
      );

      if (!tooClose) {
        markers.push({
          date: new Date(d),
          position: position,
          label: d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: zoomLevel < 0.3 ? '2-digit' : undefined
          })
        });
        usedPositions.add(position);
      }
    }

    return markers;
  };

  const dateMarkers = generateDateMarkers();

  // Zoom control functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.25));
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

  // Handle double-click to start editing
  const handleDoubleClick = (item) => {
    setEditingItem(item.id);
    setEditingName(item.name);
  };

  // Handle saving the edited name
  const handleSaveEdit = () => {
    if (editingItem && editingName.trim()) {
      setTimelineData(prev =>
        prev.map(item =>
          item.id === editingItem
            ? { ...item, name: editingName.trim() }
            : item
        )
      );
    }
    setEditingItem(null);
    setEditingName('');
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditingName('');
  };

  // Handle Enter key to save
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col justify-center items-center p-4"
      onWheel={handleWheel}
    >
      {/* Zoom Controls */}
      <div className="w-full flex gap-4">
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
        <div
          className="px-3 py-1 bg-gray-100 rounded text-sm h-fit text-gray-600"
        >
          Double-click to edit a item
        </div>
      </div>

      <div
        className="relative flex flex-col border border-neutral-200 rounded-sm overflow-x-auto"
        style={{ width: `${timelineWidth}px`, height: '600px' }}
      >
        {/* Date Axis */}
        <div
          className="relative bg-gray-50 border-b border-neutral-200"
          style={{ height: '40px', width: `${contentWidth}px` }}
        >
          {dateMarkers.map((marker, index) => (
            <div key={index} className="absolute top-0">
              {/* Vertical line */}
              <div
                className="bg-neutral-300"
                style={{
                  position: 'absolute',
                  left: `${marker.position}px`,
                  top: '0px',
                  width: '1px',
                  height: '40px'
                }}
              />
              {/* Date label */}
              <div
                className="absolute text-xs text-gray-600 bg-gray-50 px-1"
                style={{
                  left: `${marker.position}px`,
                  top: '8px',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap'
                }}
              >
                {marker.label}
              </div>
            </div>
          ))}
        </div>
        {lanes.map((lane, laneIndex) => (
          <div key={laneIndex}
            className="relative"
            style={{ height: `${40 * zoomLevel}px` }}
          >
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
                  top: `${(40 * zoomLevel - 30 * zoomLevel) / 2}px`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 4px',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer'
                }}
                title={`${item.name} (${item.start} to ${item.end}) - Double-click to edit`}
                onDoubleClick={() => handleDoubleClick(item)}
              >
                {editingItem === item.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyPress}
                    className="w-full bg-transparent text-white text-xs border-none outline-none"
                    style={{ fontSize: `${12 * zoomLevel}px` }}
                    autoFocus
                  />
                ) : (
                  item.name
                )}
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