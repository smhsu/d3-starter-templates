/**
 * Main entry point -- this file has been added to index.html in a <script> tag. Add whatever imports and code you
 * want below.  For a detailed explanation of JS modules, see
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
 */
import * as d3 from "d3";

const data = [
    {x: 10, y: 30, r: 10, color: "red"},
    {x: 50, y: 30, r: 20, color: "green"},
    {x: 110, y: 30, r: 30, color: "blue"}
];

/*
 * Why this line? Because if this script runs before the svg exists, then nothing will happen, and d3 won't even
 * complain.  This delays drawing until the entire DOM has loaded.
 */
window.addEventListener("load", drawCircles);

function drawCircles() {
    const svg = d3.select("svg");
    svg.selectAll("circle")
        .data(data)
        .join("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .attr("fill", d => d.color);
}
