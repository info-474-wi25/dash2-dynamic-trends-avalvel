// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svgChart = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// (If applicable) Tooltip element for interactivity
// const tooltip = ...

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
    console.log("Loaded data sample:", data.slice(0, 5)); // Check if data is loading
    // 2.b: ... AND TRANSFORM DATA
    data.forEach(d => {
        // Date object
        d.date = new Date(d.date);  

        // Integers
        d.actual_mean_temp = parseInt(d.actual_mean_temp);
        d.actual_min_temp = parseInt(d.actual_min_temp);
        d.actual_max_temp = parseInt(d.actual_max_temp);
        d.average_min_temp = parseInt(d.average_min_temp);
        d.average_max_temp = parseInt(d.average_max_temp);
        d.record_min_temp = parseInt(d.record_min_temp);
        d.record_max_temp = parseInt(d.record_max_temp);
        d.record_min_temp_year = parseInt(d.record_min_temp_year);
        d.record_max_temp_year = parseInt(d.record_max_temp_year);

        // Doubles
        d.actual_precipitation = parseFloat(d.actual_precipitation);
        d.average_precipitation = parseFloat(d.average_precipitation);
        d.record_precipitation = parseFloat(d.record_precipitation);

        // Strings
        d.city = d.city.trim();
        d.city_code = d.city_code.trim();
        d.city_full = d.city_full.trim();
        // console.log(d.city);
    });

    const cities = [...new Set(data.map(d => d.city))].sort();  // Get unique city names, sorted alphabetically
    const defaultCity = cities[0];  // Select first city alphabetically (Indianapolis, most likely)
    const cityData = data.filter(d => d.city === defaultCity); // Filter data for this city
    
    // 3.a: SET SCALES FOR CHART 1

    // X Scale - Time scale for the date
    const xScale = d3.scaleTime()
        .domain(d3.extent(cityData, d => d.date))  // Min and max date
        .range([0, width]);

    // Y Scale - Temperature scale
    const yScale = d3.scaleLinear()
        .domain([
            d3.min(cityData, d => d.actual_min_temp) - 5,  // Min temp, padded for visibility
            d3.max(cityData, d => d.actual_max_temp) + 5   // Max temp, padded for visibility
        ])
        .range([height, 0]);

    // console.log("Default city:", defaultCity);
    // console.log("X Scale domain:", xScale.domain());
    // console.log("Y Scale domain:", yScale.domain());


    // 4.a: PLOT DATA FOR CHART 1
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.actual_mean_temp))
        .curve(d3.curveMonotoneX);

    // 4.b: APPEND LINE PATH TO SVG
    svgChart.append("path")
        .datum(cityData)  // Binds the filtered dataset
        .attr("fill", "none")  // No fill, just a line
        .attr("stroke", "steelblue")  // Line color
        .attr("stroke-width", 2)
        .attr("d", line);  // Uses the line generator


    // 5.a: ADD AXES FOR CHART 1
    // X-Axis
    svgChart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y")));  // Format: Month Year

    // 5.b: Y-Axis
    svgChart.append("g")
        .call(d3.axisLeft(yScale));

    // 6.a: ADD LABELS FOR CHART 1
    svgChart.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .text("Chicago Temperature Trends (2014-2015)")
        .style("font-size", "16px")
        .style("font-weight", "bold");

    // 6.b: X-AXIS LABEL
    svgChart.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Date");

    // 6.c: Y-AXIS LABEL
    svgChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Actual Mean Temperature (°F)");

    // // 7.a: ADD INTERACTIVITY FOR CHART 1

});