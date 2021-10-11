import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Made For Grafana",
    Svg: require("../../static/img/grafana_logo-web-dark.svg").default,
    description: (
      <>Visualize network maps on Grafana with the worldview panel</>
    ),
  },
  {
    title: "Flexible Map Editor",
    Svg: require("../../static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>Use the built-in map editor/creator to draw network maps quickly.</>
    ),
  },
  {
    title: "Apply Data To Circuits Easily",
    Svg: require("../../static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>Easily map data to the circuits using any Grafana datasource!</>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
