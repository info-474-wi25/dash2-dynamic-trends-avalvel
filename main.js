// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svgChart = d3.select("#lineChart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// (If applicable) Tooltip element for interactivity
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.75)")
    .style("color", "white")
    .style("padding", "8px 12px")
    .style("border-radius", "6px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("z-index", "10");

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
    console.log("Loaded data sample:", data.slice(0, 5));
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

    const cities = [...new Set(data.map(d => d.city))].sort();
    const defaultCity = cities[0];
    const cityData = data.filter(d => d.city === defaultCity);
    
    // 3.a: SET SCALES FOR CHART 1

    // X Scale - Time scale for the date
    const xScale = d3.scaleTime()
        .domain(d3.extent(cityData, d => d.date))  // Min and max date
        .range([0, width]);

    // Y Scale - Temperature scale
    const yScale = d3.scaleLinear()
        .domain([
            d3.min(cityData, d => d.actual_min_temp) - 5,
            d3.max(cityData, d => d.actual_max_temp) + 5
        ])
        .range([height, 0]);

    // 4.a: PLOT DATA FOR CHART 1
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.actual_mean_temp))
        .curve(d3.curveMonotoneX);

    // Populate Dropdown menu
    const dropdown = d3.select("#cityDropdown");
    dropdown.selectAll("option")
        .data(cities)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // initial axis
    svgChart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y")));

    svgChart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    // initial x/y axis
    svgChart.append("text")
        .attr("class", "axis-label x-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Date");

    svgChart.append("text")
        .attr("class", "axis-label y-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Actual Mean Temperature (°F)");

    // title
    svgChart.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "28px")
        .style("font-weight", "bold")
        .text(`Mean Temperature Trends in ${defaultCity} (2014–2015)`);

    // draw line
    svgChart.append("path")
        .datum(cityData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // dropdown function
    function updateChart(selectedCity) {
        const filteredData = data.filter(d => d.city === selectedCity);

        // Update scales
        xScale.domain(d3.extent(filteredData, d => d.date));
        yScale.domain([
            d3.min(filteredData, d => d.actual_min_temp) - 5,
            d3.max(filteredData, d => d.actual_max_temp) + 5
        ]);

        // Update axes with transition
        svgChart.select(".x-axis")
            .transition()
            .duration(750)
            .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y")));

        svgChart.select(".y-axis")
            .transition()
            .duration(750)
            .call(d3.axisLeft(yScale));

        // Update line path
        svgChart.select(".line")
            .datum(filteredData)
            .transition()
            .duration(750)
            .attr("d", line);
        
        // TOOLTIP DATA POINTS
        svgChart.selectAll(".data-point").remove();

        svgChart.selectAll(".data-point")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("class", "data-point")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.actual_mean_temp))
            .attr("r", 5)
            .style("fill", "steelblue")
            .style("opacity", 0)
            .on("mouseover", function (event, d) {
                tooltip.style("visibility", "visible")
                    .html(`
                        <strong>Date:</strong> ${d3.timeFormat("%b %d, %Y")(d.date)}<br>
                        <strong>Mean Temp:</strong> ${d.actual_mean_temp} °F
                    `)
                    .style("top", (event.pageY + 12) + "px")
                    .style("left", (event.pageX + 12) + "px");

                d3.select(this).style("opacity", 1);

                // Highlight point
                svgChart.append("circle")
                    .attr("class", "hover-circle")
                    .attr("cx", xScale(d.date))
                    .attr("cy", yScale(d.actual_mean_temp))
                    .attr("r", 6)
                    .style("fill", "steelblue");
            })
            .on("mousemove", function (event) {
                tooltip.style("top", (event.pageY + 12) + "px")
                    .style("left", (event.pageX + 12) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
                d3.select(this).style("opacity", 0);
                svgChart.selectAll(".hover-circle").remove();
            });

        // Update chart title
        svgChart.select(".title")
            .text(`Temperature Trends in ${selectedCity} (2014–2015)`);
    }

    // trigger update
    dropdown.on("change", function () {
        const selectedCity = d3.select(this).property("value");
        updateChart(selectedCity);
    });

    // initilize chart
    updateChart(defaultCity);

});