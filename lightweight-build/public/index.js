/**
 * Main entry point -- this file has been added to index.html in a <script> tag. Add whatever code you want below.
 */
"use strict";

const labels = ["Negative", "Neutral", "Positive"]
/*
 * Why this line? Because if this script runs before the svg exists, then nothing will happen, and d3 won't even
 * complain.  This delays drawing until the entire DOM has loaded.
 */

window.addEventListener("load", populateDropdown);

function populateDropdown() {
    const select = d3.select("select");
    // TODO create <option>s as children of the <select>, one for each city

    select.on("change", changeEvent => {
        // Runs when the dropdown is changed
        console.log(changeEvent.target.selectedIndex); // The newly selected index
        drawRects(changeEvent.target.selectedIndex)
    })
    .selectAll("option")
    .data(labels)
    .enter()
    .append("option")
    .attr("value", (d, i) => i)
    .text(d => d);
}

function updateTooltipPosition(mouseEvent) {
    const offsetX = 25;
    const offsetY = 100;

    const svgCoords = d3.pointer(mouseEvent);

    return {left: (svgCoords[0] + offsetX) + 'px', top: (svgCoords[1] + offsetY) + 'px'}
}

function drawRects(sentiment) {
    // d3 has been added to the html in a <script> tag so referencing it here should work.
    // scaleBand API --> https://github.com/d3/d3-scale/blob/master/README.md#band-scales

    var dtData = dt_tweet.filter(d => d.sentiment === (sentiment - 1));
    var jbData = jb_tweet.filter(d => d.sentiment === (sentiment - 1));

    const Padding = {TOP: 10, LEFT: 100, RIGHT: 50, BOTTOM: 20};
    var svg = d3.select("svg");
    svg.selectAll("path").remove();
    svg.selectAll("g").remove();
    svg.selectAll("text").remove();
    

    var x = d3.scaleBand()
        .domain(dtData.map(d => d.day.substring(5)))
        .range([0 + Padding.LEFT, svg.attr("width") - Padding.RIGHT]) // TODO
        .padding(.25); // TODO experiment and choose a number between 0 and 1
    
    var y = d3.scaleLinear()
        .domain([0, d3.max(dtData, d => Math.max(d.likes, d3.max(jbData, d => d.likes)))])
        .range([svg.attr("height") - Padding.BOTTOM, 0 + Padding.TOP]);
    
    var line1 = d3.line()
        .x(function(d) { return x(d.day.substring(5)) + x.bandwidth() / 2; })
        .y(function(d) { return y(d.likes); });

    var line2 = d3.line()
        .x(function(d) { return x(d.day.substring(5)) + x.bandwidth() / 2; })
        .y(function(d) { return y(d.likes); });
    svg.append("path")
        .datum(dtData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line1);   
    
    svg.append("path")
        .datum(jbData)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", line2);   

    const xAxis = svg.append("g")
        .call(d3.axisBottom(x)) // creates a bunch of elements inside the <g>
        .attr("transform", `translate(0, ${svg.attr("height") - Padding.BOTTOM})`); // TODO yTranslation
    const yAxis = svg.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", `translate(${Padding.LEFT}, 0)`); // TODO xTranslation

    svg.append("text")
        .attr("font-size", 12) // This code duplication signals that these properties
        .attr("font-weight", "bold") // should be moved to CSS. For now, the code is here
        .attr("font-family", "sans-serif") // to simplify our directions to you.
        .attr("transform", `translate(${Padding.LEFT / 2} ${(svg.attr("height")) / 2 + Padding.BOTTOM}) rotate(-90)`)
        .text("Total Likes");
}