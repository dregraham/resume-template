import React, { Component } from "react";
import Zmage from "react-zmage";

let id = 0;
class Portfolio extends Component {
  render() {
    if (!this.props.data) return null;

    const projects = this.props.data.projects.map(function (projects) {
      let projectImage = "images/portfolio/" + projects.image;

      return (
        <div key={id++} className="columns portfolio-item">
          <div className="item-wrap">
          <a href={projects.url} target="_blank" rel="noopener noreferrer">
  <img alt={projects.title} src={projectImage} />
</a>
            <div style={{ textAlign: "center" }}>{projects.title}</div>
          </div>
        </div>
      );
    });

    return (
      <section id="portfolio">
        <div className="row">
        <div className="twelve columns collapsed">
          <h1>Check Out Some of My Projects.</h1>

          <div
          id="portfolio-wrapper"
          className="bgrid-thirds s-bgrid-thirds cf">
          {projects}
          </div>
        </div>
        </div>
      </section>
    );
  }
}

export default Portfolio;
