/*
Liam McBride (mailmcbride)
*/

import * as d3 from "d3";
import { useEffect } from "react";
import './DotPlot.css'
import Box from '@mui/material/Box';


function DotPlot(props) {
  var svg = null;

  //shows and populates data on demand elements on hover
  const hoverDetails = (e) => {
    var obj = props.data[e.target.id.split('_')[1]]
    var selected = e.target.className.baseVal === "selected-bar"
    d3.select("#data-on-demand-text")
      .text(`${props.conf.keyName}: ${obj[props.conf.keyName]} ${props.conf.valueName}: ${obj[props.conf.valueName]}`)
      .attr("class", "")
      d3.select("#data-on-demand")
      .attr("class", selected ? "selected-data-on-demand" : "not-selected-data-on-demand") //determines color of data on demand bar based on if it's selected
  }

  //hides the data on demand elements
  const removeHover = () => {
    d3.select("#data-on-demand-text")
    .attr("class", "hidden")
    d3.select("#data-on-demand")
      .attr("class", "hidden")
  }

  function drawChart(data, selection, conf) {
    d3.select("#chart-div svg").remove() //removes old svg

    var maxValue = getMaxValue(data) //assembles maxPop and dataLen

    const barSpacing = Math.max(conf.bar.barSpacing - (data.length * 2) / 3, 1)
    const barWidth = ((conf.viewBox.width - 2 * conf.dataPadding) / data.length) - barSpacing //how wide the bar is that changes with different #'s of values
    const barHeight = (d) => (d / maxValue) * (conf.viewBox.height - 4 * conf.dataPadding) //how tall based off pop value
    const barX = (i) => (i * barWidth) + (0.5 * barSpacing) + (i * barSpacing) + conf.dataPadding //x position based off of index
    const barY = (d) => (conf.viewBox.height - conf.dataPadding) - barHeight(d) //y position

    //creates svg and viewbox
    svg = d3.select("#chart-div")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 " + conf.viewBox.width + " " + conf.viewBox.height)
      .attr("preserveAspectRatio", "none")

    //title
    const titleGroup = svg.append("g")
      .attr("id", "title")
    
    titleGroup.append("text")
      .text(conf.title.text)
      .attr("text-anchor", "middle")
      .attr("x", (conf.viewBox.width / 2)) //anchored on middle so it's just width/2
      .attr("dy", "3pt")
    
    //data on demand elements
    titleGroup.append("rect")
      .attr("id", "data-on-demand")
      .attr("y", "5px")
      .attr("x", (conf.viewBox.width / 2) - conf.viewBox.width * .30)
      .attr("class", "hidden")
      
    titleGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("id", "data-on-demand-text")
      .attr("x", (conf.viewBox.width / 2))
      .attr("dy", "3pt")
      .attr("y", "5px")
      .attr("class", "hidden")

    //values (y-axis)
    const valuesGroup = svg.append("g")
      .attr("id", "values")

    //generates the scales needed to show information properly
    var graphScales = createScales(maxValue)
    graphScales.forEach((d) => { //create a value label for each scale
      valuesGroup
        .append("text")
        .text(d)
        .attr("dy", "0.25pt")
        .attr("x", (conf.dataPadding - .5) / 2)
        .attr("y", barY(d))
    })

    //creating bars group
    const bars = svg.append("g")
      .attr("id", "bars")

    graphScales.forEach((d) => { //use graph scales to generate a line for each value also ensures height is a match
      bars.append("line")
        .attr("x1", conf.dataPadding)
        .attr("x2", conf.viewBox.width - conf.dataPadding)
        .attr("y1", barY(d))
        .attr("y2", barY(d))
    })

    //creates a circle for each data point
    for (var d in data) {
      d = Number(d)
      bars.append("circle")
        .attr("r", 2)
        .attr("cx", barX(d) + .5 * barWidth)
        .attr("cy", barY(data[d][conf.valueName]))
        .attr("id", `bar_${d}`)
        .on("click", props.updateSelection) //new additions to handle selection, data on demand, and coloring of the bar
        .on("mouseover", hoverDetails)
        .on("mouseout", removeHover)
        .attr("class", selection.indexOf(d) != -1 ? "selected-bar" : "")
    }

    const labels = svg.append("g")
      .attr("id", "labels")

    //creates a label for each data point
    for (var d in data) {
      labels.append("text")
        .text(data[d][conf.keyName])
        .attr("text-anchor", "middle")
        .attr("dy", "1pt")
        .attr("x", barX(d) + .5 * barWidth)
        .attr("y", barY(data[d][conf.valueName]) + barHeight(data[d][conf.valueName]))
    }

    //utility function to determine max population value
    function getMaxValue(data) {
      var maxVal = 0
      var dataLen = 0
      for (var d in data) {
        if (data[d][conf.valueName] > maxVal) {
          maxVal = data[d][conf.valueName]
        }
        dataLen++
      }

      return maxVal
    }

    //Creates the scales needed for the max value
    function createScales(maxPop) {
      var scales = []

      var maxScale = Math.round(maxPop)

      var index = 0
      const step = () => {
        if (maxScale <= 10){
          return .5
        }
        else {
          return Math.round(maxScale / 14)
        }
      }

      while (index < maxScale) {
        scales.push(index.toFixed(1))
        index += step()
      }
      return scales
    }
  }

  //runs on load and when props.data changes
  useEffect(() => {
    drawChart(props.data, props.selection, props.conf)
  }, [props.data, props.selection, props.conf])

  return (
    <Box sx={{
      userSelect: "none",
    }} id="chart-div"></Box>
  );
}

export default DotPlot;
