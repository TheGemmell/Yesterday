



(function (populateData, document) {
    const APIKey = "K6W03DLD7N6KHG1G";

    let querySelector = document.getElementById("query-options")

searchBar.addEventListener('keypress', e =>{
    if (e.code === "Enter") {
        fetchOverview((searchBar.value).toUpperCase())
        fetchFooter((searchBar.value).toUpperCase())
    }
})

querySelector.addEventListener('click', e => {
    let querySelected = e.target.innerHTML
    let option = "TIME_SERIES_" + querySelected.toUpperCase()
    document.getElementById('query-dropdown').innerText = querySelected
    fetchTimeInfo(option, searchBar.value)
})


let summaryQuoteURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=&apikey=${APIKey}`

let brandFetchAPIKey = 'eYaM5Rz8mp32U7yRBjTMp4ggLW2krcfl8GylLbrj'


let fetchUrl = function(option, stock) {
    return `https://www.alphavantage.co/query?function=${option}&symbol=${stock}&apikey=${APIKey}`
}

let fetchOverview = function(stock) {
    fetch(fetchUrl("OVERVIEW", stock))
    .then(Response => Response.json())
    .then(data => {
        console.log(data)
        console.log(data)
        populateData.summary(data)
    })
    .catch(error => {
        console.log(error)
    })
}


let fetchFooter = function(stock) {
    fetch(fetchUrl("GLOBAL_QUOTE", stock))
    .then(Response => Response.json())
    .then(data => {
        data = Object.values(data)[0]
        return data
    })
    .then(data => {
        data = Object.entries(data)
        console.log("Changing to Array", data)
        return populateData.footer(data)
    })
    .catch(error => {
        console.log(error)
    })
}

let fetchTimeInfo = function(query, stockSymbol) {
    fetch(fetchUrl(query, stockSymbol))
    .then(Response => Response.json())
    .then(data => {
        data = Object.values(data)[1]
        return data
    })
    .then(data => {
        let dates = Object.entries(data)
        console.log(`First Date was: ${dates[dates.length-1]}`)
        console.log(dates)
        //populateData.populatePage(dates)
        renderChart(dates, stockSymbol, document.getElementById('query-dropdown').innerText)
    })
    .catch(error => {
        console.error(error)
        displayError(error)
    })
}

var ctx = document.getElementById('timelineChart').getContext('2d');
let renderChart = function(data, title, timeline) {
    let dates = []
    let values = []
    for (let date of data) {
        dates.push(date[0])
        values.push(date[1]['4. close'])
    }
    console.log(dates)
    console.log(values)
    new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: dates,
            datasets: [{
                label: title,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: values 
                //[0, 10, 5, 2, 20, 30, 45]
            }]
        },
    
        // Configuration options go here
        options: {}
    });
}

})(populateData, document);