// from data.js
var tableData = data;

// Select the submit button
var submit = d3.select('#filter-btn');

// Complete the click handler for the form
submit.on("click", () => {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    let inputElement = d3.select("#datetime");

    // Get the value property of the input element
    let inputValue = inputElement.property('value');
    
    // Use the form input to filter the date
    let filteredData = tableData.filter(table => table.datetime === inputValue);
    console.log(filteredData);

    // add the summary stats to the `tbody` tag
    var tableBody = d3.select("table>tbody").html('');

    filteredData.forEach((sighting) => {
        console.log(sighting);

        var tableItem = tableBody.append('tr');
        // Get the entries for each object in the array
        Object.entries(sighting).forEach(([key, value]) => {
            // Log the key and value
            var item = tableBody.append('td');
            item.text(value);
        });
    });    
});
