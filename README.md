# GlobalNOC Worldview Panel

The Worldview Map Panel is a world map that provides the ability to monitor and visualize realtime traffic statistics. It uses timeseries data to represent traffic between nodes as circuits. It provides this information when hovered over the circuits and nodes.

![Intro Image](./docs/img/intro-image.png)

## Features
The Worldview Map Panel also provides the ability to configure different map options and display options. 

## Documentation
For more information on how to use the Worldview Panel, check out our [Documentation Page](https://globalnoc.github.io/globalnoc-worldview-panel/docs/intro)
## Installation

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```

4. Create a symlink to the `globalnoc-worldview-panel/dist` directory or place the `globalnoc-worldview-panel/dist` directory inside Grafana's plugin directory

## Using Atlas Editor To Edit Custom Maps

![Editor Map](./docs/img/editor_overview.png)

<p>Clicking on the pen <img src="./docs/img/pen.png" width="12"/> in the upper right corner toggles the atlas editor. The toolbar displays the set of all tools available to edit a map:</p>

| Icon | Tool | Description |
| :------: | ------ | ------ |
| <img src="./docs/img/add_node.png" width="18"/> | Add Node | Add new nodes to the map |
| <img src="./docs/img/add_line.png" width="18"/> | Add Circuit | Add new circuits to the map |
| <img src="./docs/img/edit_node.png" width="18"/> | Edit Node | Edit existing nodes |
| <img src="./docs/img/edit_line.png" width="18"/> | Edit Lines | Edit existing circuits |
| <img src="./docs/img/get_json.png" width="18"/> | Get JSON | Get Atlas4 formatted map JSON |
| <img src="./docs/img/set_json.png" width="18"/> | Set Topology | Import map from JSON |
| <img src="./docs/img/edit_topology.png" width="18"/> | Edit Topology | Edit Topology Features |

#### Add curves to circuit
<p>To add curves to a circuit, select <img src="./docs/img/edit_line.png" width="18"/> <code>Edit Lines</code> from the toolbar and click on the circuit that needs to be edited. Double click the circuit's anchor point which would have turned red in color. That would open a window in the sidebar on the right.</p> 

To add a cubic bezier curve, set the point type as `C`. To add a quadratic bezier curve, choose `Q`. To change the curve back to a line, choose `L`. If `C` or `Q` are selected, a green waypoint should appear in the middle of the circuit. Drag the waypoint to a desired location to change the magnitude of the curve.

![Add Line Curve](./docs/img/add_curve.png)

#### Change map logo, description, link etc.
<p>Select <code>Edit Topology</code> <img src="./docs/img/edit_topology.png" width="18"/>. Click on <code>Manage Properties</code> that will open a form. Add/Edit top level map metadata in the form and press save to finalize the changes.</p>

