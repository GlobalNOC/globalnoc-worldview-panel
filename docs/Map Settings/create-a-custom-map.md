---
sidebar_position: 2
---

# Create a Custom Map

To create a map inside the dashboard locally, open the `Map Settings` tab and select the `Custom` button. There are two ways to create a custom map.

## Map Editor UI

![Editor Map](../../static/img/atlas/editor_overview.png)

<p>Clicking on the pen <img src="https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/pen.png" width="12"/> in the upper right corner toggles the atlas editor. The toolbar displays the set of all tools available to edit a map:</p>

|                                      Icon                                      | Tool          | Description                   |
| :----------------------------------------------------------------------------: | ------------- | ----------------------------- |
|   <img src="https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/add_node.png" width="18"/>    | Add Node      | Add new nodes to the map      |
|   <img src="https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/add_line.png" width="18"/>    | Add Circuit   | Add new circuits to the map   |
|   <img src="https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/edit_node.png" width="18"/>   | Edit Node     | Edit existing nodes           |
|   <img src="https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/edit_line.png" width="18"/>   | Edit Lines    | Edit existing circuits        |
|   <img src="https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/get_json.png" width="18"/>    | Get JSON      | Get Atlas4 formatted map JSON |
|   <img src="https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/set_json.png" width="18"/>    | Set Topology  | Import map from JSON          |
| <img src="https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/edit_topology.png" width="18"/> | Edit Topology | Edit Topology Features        |

These tools can be used to create new nodes and circuits for the map. Additional details about each tool should be present on the right sidebar when any tool is selected.

## Paste Map JSON

Raw map JSON can also be pasted directly in the code editor window in the panel sidebar. The map should automatically update if the map JSON is valid.

![JSON Editor](../../static/img/docs/custom-map-editor.png)
