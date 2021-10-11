"use strict";(self.webpackChunkgrafana_panel_docs=self.webpackChunkgrafana_panel_docs||[]).push([[618],{252:function(t,e,a){a.r(e),a.d(e,{frontMatter:function(){return r},contentTitle:function(){return d},metadata:function(){return p},toc:function(){return s},default:function(){return c}});var n=a(7462),o=a(3366),i=(a(7294),a(3905)),l=["components"],r={sidebar_position:2},d="Create a Custom Map",p={unversionedId:"Map Settings/create-a-custom-map",id:"Map Settings/create-a-custom-map",isDocsHomePage:!1,title:"Create a Custom Map",description:"To create a map inside the dashboard locally, open the Map Settings tab and select the Custom button. There are two ways to create a custom map.",source:"@site/docs/Map Settings/create-a-custom-map.md",sourceDirName:"Map Settings",slug:"/Map Settings/create-a-custom-map",permalink:"/globalnoc-worldview-panel/docs/Map Settings/create-a-custom-map",editUrl:"https://github.com/facebook/docusaurus/edit/main/website/docs/Map Settings/create-a-custom-map.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Map JSON",permalink:"/globalnoc-worldview-panel/docs/Map Settings/map-json"},next:{title:"Link External Maps",permalink:"/globalnoc-worldview-panel/docs/Map Settings/link-external-map"}},s=[{value:"Map Editor UI",id:"map-editor-ui",children:[]},{value:"Paste Map JSON",id:"paste-map-json",children:[]}],m={toc:s};function c(t){var e=t.components,r=(0,o.Z)(t,l);return(0,i.kt)("wrapper",(0,n.Z)({},m,r,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"create-a-custom-map"},"Create a Custom Map"),(0,i.kt)("p",null,"To create a map inside the dashboard locally, open the ",(0,i.kt)("inlineCode",{parentName:"p"},"Map Settings")," tab and select the ",(0,i.kt)("inlineCode",{parentName:"p"},"Custom")," button. There are two ways to create a custom map."),(0,i.kt)("h2",{id:"map-editor-ui"},"Map Editor UI"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Editor Map",src:a(4476).Z})),(0,i.kt)("p",null,"Clicking on the pen ",(0,i.kt)("img",{src:"https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/pen.png",width:"12"})," in the upper right corner toggles the atlas editor. The toolbar displays the set of all tools available to edit a map:"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"center"},"Icon"),(0,i.kt)("th",{parentName:"tr",align:null},"Tool"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"center"},(0,i.kt)("img",{src:"https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/add_node.png",width:"18"})),(0,i.kt)("td",{parentName:"tr",align:null},"Add Node"),(0,i.kt)("td",{parentName:"tr",align:null},"Add new nodes to the map")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"center"},(0,i.kt)("img",{src:"https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/add_line.png",width:"18"})),(0,i.kt)("td",{parentName:"tr",align:null},"Add Circuit"),(0,i.kt)("td",{parentName:"tr",align:null},"Add new circuits to the map")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"center"},(0,i.kt)("img",{src:"https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/edit_node.png",width:"18"})),(0,i.kt)("td",{parentName:"tr",align:null},"Edit Node"),(0,i.kt)("td",{parentName:"tr",align:null},"Edit existing nodes")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"center"},(0,i.kt)("img",{src:"https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/edit_line.png",width:"18"})),(0,i.kt)("td",{parentName:"tr",align:null},"Edit Lines"),(0,i.kt)("td",{parentName:"tr",align:null},"Edit existing circuits")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"center"},(0,i.kt)("img",{src:"https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/get_json.png",width:"18"})),(0,i.kt)("td",{parentName:"tr",align:null},"Get JSON"),(0,i.kt)("td",{parentName:"tr",align:null},"Get Atlas4 formatted map JSON")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"center"},(0,i.kt)("img",{src:"https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/set_json.png",width:"18"})),(0,i.kt)("td",{parentName:"tr",align:null},"Set Topology"),(0,i.kt)("td",{parentName:"tr",align:null},"Import map from JSON")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"center"},(0,i.kt)("img",{src:"https://github.com/GlobalNOC/globalnoc-worldview-panel/blob/main/docs/img/edit_topology.png",width:"18"})),(0,i.kt)("td",{parentName:"tr",align:null},"Edit Topology"),(0,i.kt)("td",{parentName:"tr",align:null},"Edit Topology Features")))),(0,i.kt)("p",null,"These tools can be used to create new nodes and circuits for the map. Additional details about each tool should be present on the right sidebar when any tool is selected."),(0,i.kt)("h2",{id:"paste-map-json"},"Paste Map JSON"),(0,i.kt)("p",null,"Raw map JSON can also be pasted directly in the code editor window in the panel sidebar. The map should automatically update if the map JSON is valid."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"JSON Editor",src:a(5425).Z})))}c.isMDXComponent=!0},4476:function(t,e,a){e.Z=a.p+"assets/images/editor_overview-57e4c12a484d1d392ff05e9ea6469221.png"},5425:function(t,e,a){e.Z=a.p+"assets/images/custom-map-editor-4dae1e914a56aa489f1522b25cdfc0d4.png"}}]);