---
sidebar_position: 1
---

# Map JSON

A map in the **GlobalNOC Worldview Panel** is just a JSON structured as follows:

```json title="Map JSON"
[
  "name": "Map Name"
  {
    "adjacencies": [
      {
        "id": "O2LPdq", // Circuit ID
        "anchors": [
          // Circuit Path Anchors (This example shows a Cubic [C] bezier curve)
          // That will be drawn with the anchors below between Chicago and Amsterdam
          "C",
          [62.42273329229529, -79.98046875000001],
          [67.73918797934685, -13.183593750000002]
        ],
        "a": "8PrAEX", // Chicago Endpoint ID
        "b": "0ZUNVC", // Amsterdam Endpoint ID
        "label": "Chicago - Amsterdam", // Circuit Label
        "metadata": {
          // Circuit specific metadata
          "data_targets": ["a+b+input", "a+b+output"] // Will be used to map data to this circuit
        },
        "min": 0, // Minimum Circuit Speed
        "max": 10000000000 // Maximum Circuit Speed
      }
    ],
    "endpoints": {
      "0ZUNVC": {
        "id": "0ZUNVC", // Node ID
        "label": "Amsterdam", // Node Label
        "lat": 52.38403598352702, // Node Latitude
        "lng": 4.87493238293106 // Node Longitude
      },
      "8PrAEX": {
        "id": "8PrAEX", // Node ID
        "label": "Chicago", // Node Label
        "lat": 41.83953534409783, // Node Latitude
        "lng": -87.64798738682728 // Node Longitude
      }
    },
    "metadata": {
      // Map Specific Metadata. Can be used to reference in the tooltip
      "description": "",
      "logo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/"
    }
  }
]
```
