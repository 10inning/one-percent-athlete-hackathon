"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Circularbar({ currentNumber, maxNumber }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 120; // Width and height of the SVG
    const height = 120;
    const radius = 50;
    const percentage = isNaN(currentNumber) ? 0 : (currentNumber / maxNumber) * 100;

    // Clear previous SVG if it exists
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Background Circle (transparent background, but stroke visible)
    svg
      .append("circle")
      .attr("r", radius)
      .attr("fill", "none") // No fill to make it transparent
      .attr("stroke", "#151515") // Dark gray border
      .attr("stroke-width", 10);

    // Progress Circle
    const arc = d3
      .arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle((2 * Math.PI * percentage) / 100);

    svg
      .append("path")
      .attr("d", arc)
      .attr("fill", "#E50914"); // Netflix red for progress bar

    // Text in the center
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "18px")
      .style("font-family", "Raleway, serif")
      .style("font-weight", "400")
      .style("fill", "red")
      .text(`${isNaN(currentNumber) ? "N/A" : currentNumber + "/" + maxNumber}`);
  }, [currentNumber, maxNumber]);

  return (
    <div
      style={{
        backgroundColor: "transparent", // Make container transparent
      }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
}
