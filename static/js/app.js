function MetaDataSample(sample) {

    // Build function to build metadata panel

    console.log(sample);

    // Use d3 to select panel with sample data id

    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    panel.html("");

    // Use 'd3.json' to grab metadata to take sample

    d3.json("samples.json").then((samplesData) => {

        // Reading the data
        var metaData = samplesData.metadata;
        console.log(metaData)
        var resultsArray = metaData.filter(s => s.id == sample) //sample_id = param fed into ChartBuild
        var result = resultsArray[0]


        // Use `Object.entries` to add each key and value pair to the panel

        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);

            // Console log key and value

            console.log(key, value)
        });
    });

}

function ChartBuild(sample) {

    // Build Bar Chart using sample data

    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsArray = samples.filter(s => s.id = sample) //sample_id = param fed into ChartBuild
        var result = resultsArray[0]


        var sample_values_filter = result.sample_values;
        var otu_ids_filter = result.otu_ids;
        var otu_labels_filter = result.otu_labels;


        var barChart = {
            type: 'bar',
            y: otu_ids_filter.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: sample_values_filter.slice(0, 10).reverse(),
            text: otu_labels_filter.slice(0, 10),
            marker: {
                color: '#1978B5',
            },
            orientation: 'h'
        };

        var data = [barChart];

        var layout = {
            title: "Top 10 Bacteria Found",
            showlegend: false,
            width: 600,
            height: 400
        };

        Plotly.newPlot("bar", data, layout);


        // Build Bubble Chart using sample data  

        var bubbleLayout = {
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" }
        };

        var bubbleData = [{
            x: otu_ids_filter,
            y: sample_values_filter,
            text: otu_labels_filter,
            mode: "markers",
            marker: {
                size: sample_values_filter,
                color: otu_ids_filter,
                colorscale: "Earth"
            }
        }];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};




function Init() {

    // Grab a reference to the dropdown select element

    var selector = d3.select("#selDataset");

    // Use sample names list to populate select options

    d3.json("samples.json").then((samplesData) => {
        var sampleName = samplesData.names
        sampleName.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", JSON.stringify(sample));
        });
        // Use first sample from list to build initial plots

        const firstSample = sampleName[0];
        ChartBuild(firstSample);
        MetaDataSample(firstSample);
    });
}

function ChangeOption(newSample) {

    // Grab data each time sample is selected

    var Sample = JSON.parse(newSample);
    ChartBuild(Sample);
    MetaDataSample(Sample);
}
// // // Initialize dashboard

Init();