// Patch for leaflet-draw type error
// This fixes the "type is not defined" error in readableArea function

if (typeof window !== 'undefined') {
  // Wait for leaflet-draw to be loaded
  const patchLeafletDraw = () => {
    const L = (window as any).L;
    if (!L) return;

    // Patch L.Draw.readableArea if it exists
    if (L.Draw && typeof L.Draw.readableArea === 'function') {
      const originalReadableArea = L.Draw.readableArea;
      L.Draw.readableArea = function(area: number, isMetric: boolean, _precision?: number) {
        try {
          // Ensure type is defined
          const type = isMetric !== undefined ? (isMetric ? 'metric' : 'imperial') : 'metric';
          const areaStr = (Math.round(area * 100) / 100).toString();
          
          if (isMetric) {
            if (area >= 10000) {
              return (area / 10000).toFixed(2) + ' ha';
            } else {
              return areaStr + ' m²';
            }
          } else {
            return areaStr + ' ft²';
          }
        } catch (e) {
          // Fallback if there's an error
          return area.toFixed(2);
        }
      };
    }

    // Also try to patch if it's in L.Draw.Rectangle or other draw handlers
    if (L.Draw && L.Draw.Rectangle) {
      const Rectangle = L.Draw.Rectangle;
      if (Rectangle && Rectangle.prototype && Rectangle.prototype._getMeasurementString) {
        const originalGetMeasurement = Rectangle.prototype._getMeasurementString;
        Rectangle.prototype._getMeasurementString = function() {
          try {
            return originalGetMeasurement.call(this);
          } catch (e) {
            // If there's a type error, return empty string
            return '';
          }
        };
      }
    }
  };

  // Try to patch immediately
  patchLeafletDraw();

  // Also try after delays in case leaflet-draw loads later
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchLeafletDraw);
  }
  setTimeout(patchLeafletDraw, 100);
  setTimeout(patchLeafletDraw, 500);
  setTimeout(patchLeafletDraw, 1000);
}

