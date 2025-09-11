# Airtable Timeline

My implementation of a timeline visualization component that displays project items with start and end dates in a horizontal format. The timeline supports zooming, editing, and automatic lane assignment to prevent overlapping items.

## Features

- Interactive timeline with zoom controls (mouse wheel: Ctrl/Cmd + scroll)
- Inline editing (double-click to edit item names)
- Automatic lane assignment to prevent overlap
- Smart date markers and responsive design

## Functions

### Core Component
- **`App()`** - Main React component with zoom/editing state management
  - `calculateContentWidth()` - Calculates timeline content width
  - `generateDateMarkers()` - Creates smart date markers
  - `handleZoomIn/Out/Reset()` - Zoom controls
  - `handleDoubleClick/SaveEdit/CancelEdit()` - Editing functionality

### Utilities
- **`calculateTimeRange(items)`** - Returns `{start, end, totalDays}` for all items
- **`calculatePosition(startDate, timeRange, timelineWidth)`** - Calculates horizontal pixel position
- **`calculateWidth(startDate, endDate, timeRange, timelineWidth)`** - Calculates item width (min 20px)