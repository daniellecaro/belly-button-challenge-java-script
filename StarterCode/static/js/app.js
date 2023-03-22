// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Console log JSON data
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up 
function init() {

    // Select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Get sample names and populate drop-down selector
    d3.json(url).then((data) => {
        
        // Set variable for sample names
        let samplenames = data.names;

        // Add samples to dropdown menu
        samplenames.forEach((id) => {

            // Iterate through and log data
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample_one = samplenames[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the base for plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
    });
};

// Populate metadata info
function buildMetadata(sample) {

    // Use D3 to retrieve data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on sample value
        let value = metadata.filter(result => result.id == sample);

        // Log the filtered metadata objects
        console.log(value)

        // Find first index
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the pairs as they are being appended
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Build the bar chart
function buildBarChart(sample) {

    // Retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Find first index
        let valueData = value[0];

        // Identify data to plot
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to console
        console.log(otu_ids,otu_labels,sample_values);

        // Display top ten in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Set the layout
        let layout = {
            title: `Top 10 OTUs Present in Each Individual`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };

        // Plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Builds the bubble chart
function buildBubbleChart(sample) {

    // Retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Find forst index
        let valueData = value[0];

        // Identify data to plot
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"}
        };

        // Plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Updates dashboard when dropdown changes
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

// Initialize
init();
