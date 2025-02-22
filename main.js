// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1_RENAME = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2_RENAME = d3.select("#lineChart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// (If applicable) Tooltip element for interactivity
// const tooltip = ...

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
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
    });
    // 3.a: SET SCALES FOR CHART 1


    // 4.a: PLOT DATA FOR CHART 1


    // 5.a: ADD AXES FOR CHART 1


    // 6.a: ADD LABELS FOR CHART 1


    // 7.a: ADD INTERACTIVITY FOR CHART 1
    

    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2


    // 4.b: PLOT DATA FOR CHART 2


    // 5.b: ADD AXES FOR CHART 


    // 6.b: ADD LABELS FOR CHART 2


    // 7.b: ADD INTERACTIVITY FOR CHART 2


});