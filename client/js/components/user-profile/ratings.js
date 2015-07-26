var React = require('react');
var d3 = require('d3');

//Width and height
var ratingVisualization = React.createClass({

  render: function() {

    // add counter to check if any questions answered

    var w = 500;
    var h = window.innerHeight*.6;
    var barPadding = 1;

    var dataset = [];
    dataset.push(Number(this.props.stats.dominance));
    dataset.push(Number(this.props.stats.adaptable));
    dataset.push(Number(this.props.stats.blunt));
    dataset.push(Number(this.props.stats.collaborative));
    dataset.push(Number(this.props.stats.brute));
    dataset.push(Number(this.props.stats.aggressive));
    dataset.push(Number(this.props.stats.boundaries));
    dataset.push(Number(this.props.stats.loud));
    dataset.push(Number(this.props.stats.committed));
    dataset.push(Number(this.props.stats.ambition));

    var dataDesc = [
      ["more empathetic", "more dominant"],
      ["more rigid", "more adaptable"],
      ["more reticent", "more blunt"],
      ["more independent", "more collaborative"],
      ["brute style", "technical style"],
      ["more cautious", "more aggressive"],
      ["more inclusive", "pushes boundaries"],
      ["more calm", "more vocal"],
      ["more relaxed", "more committed"],
      ["more fun-driven", "more ambitious"]
    ];

    var dataObj = function(val, desc) {
      this.value = val;
      this.desc = desc;
    };
    var graphPoints = [];
    for (var i = 0; i < dataset.length; i++) {
      if (dataset[i] >= 0) {
        var graphObj = new dataObj(dataset[i], dataDesc[i][0]);
      } else var graphObj = new dataObj(dataset[i], dataDesc[i][1]);
      graphPoints.push(graphObj);
    }

    //Create SVG element
    var svg = d3.select(".ratingViz") //change this to the appropriate div
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("rect")
      .data(graphPoints) // maybe put the data inside an object so we can recall names
      .enter()
      .append("rect")
      .attr("x", function(d) {
        if (d.value >= 0) {
          return (w / 2) - (d.value * 4);
        } else {
          return (w / 2);
        }
      })
      .attr("y", function(d, i) {
        // return h - (d * 4);
        return i * ((h / 4) / dataset.length);
      })
      .attr("height", (h / 4) / dataset.length - barPadding)
      .attr("width", function(d) {
        // console.log(d)
        return Math.abs(d.value) * 4;
      })
      .attr("fill", function(d) { //change colors to match scheme later
        if (d.value >= 0) return "rgb(150, 100, " + (d.value * 10) + ")";
        else return "rgb(150, " + (Math.abs(d.value) * 10) + ", 100)";
      });

    svg.selectAll("text")
      .data(graphPoints)
      .enter()
      .append("text")
      .text(function(d) {
        return d.desc;
      })
      .attr("text-anchor", function(d) {
        return d.value >= 0 ? "left" : "right";
      })
      .attr("x", function(d) {
        if (d.value <= 0) {
          return (w / 2) - (d.desc.length * 7);
        } else {
          return (w / 2) + 10;
        }
      })
      .attr("y", function(d, i) {
        return i * ((h / 4) / dataset.length) + (h / 4) / dataset.length - barPadding - 5;
      })
      .attr("font-family", "Helvetica Neue")
      .attr("font-size", "14px")
      .attr("fill", "black");

    return (
      <div className="ratingViz" id="whitebox"> </div>
    )
  }
})

module.exports = ratingVisualization
