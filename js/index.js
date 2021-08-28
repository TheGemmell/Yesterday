'use strict';
(function (populateData, document) {
    const APIKey = "K6W03DLD7N6KHG1G";

    let querySelector = document.getElementById("query-options")
    let mainContent = document.getElementById('maincontent')
    // TODO: Find out why searchBar can be found.
searchBar.addEventListener('keypress', e =>{
    if (e.code === "Enter") {
        console.log(e)
        searchBar.classList.add('is-valid')
        fetchOverview((searchBar.value).toUpperCase())
        mainContent.classList.remove("visually-hidden")
    }
})


querySelector.addEventListener('click', e => {
    let querySelected = e.target.innerHTML
    let option = "TIME_SERIES_" + querySelected.toUpperCase()
    document.getElementById('query-dropdown').innerText = querySelected
    fetchTimeInfo(option, searchBar.value)
    document.getElementById('graphcard').classList.remove('visually-hidden')
})

let fetchUrl = function(option, stock) {
    return `https://www.alphavantage.co/query?function=${option}&symbol=${stock}&apikey=${APIKey}`
}

let fetchOverview = function(stock) {
    fetch(fetchUrl("OVERVIEW", stock))
    .then(Response => Response.json())
    .then(data => {
        console.log(data)
        populateData.summary(data)
        fetchFooter((searchBar.value).toUpperCase())
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
        console.log('First Promise: ', data)
        return data
    })
    .then(data => {
        data = Object.entries(data)
        console.log('Second Promise: ', data)

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
        console.log(data)
        data = Object.values(data)[1]
        return data
    })
    .then(data => {
        let dates = Object.entries(data)
        renderChart(dates, stockSymbol, document.getElementById('query-dropdown').innerText)
    })
    .catch(error => {
        console.error(error)
        displayError(error)
    })
}


function displayError(error) {
    let displayedError = document.createElement('div')
    displayedError.classList = 'alert alert-dismissible alert-danger';
    displayedError.innerHTML = `
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  <strong>Oh snap!</strong>
  <p>${error}`
    document.getElementById('summary-content-header').prepend(displayedError)
}




//  TODO: Fix it not making a second chart if one already rendered.
//let newCtx = document.createElement('canvas').getContext('2d')
let ctx = document.getElementById('timelineChart').getContext('2d');
let renderChart = function(data, title, timeline) {
    let dates = []
    let values = []
    for (let date of data) {
        dates.push(date[0])
        values.push(date[1]['4. close'])
    }
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: title,
                backgroundColor: 'rgb(255, 99, 255)',
                borderColor: 'rgb(255, 99, 132)',
                data: values 
            }]
        },
        options: {
            plugins: {
                zoom: {
                    // TODO: Fix Panning Issue
                    pan: {
                        enabled: true,
                        modifierKey: 'ctrl',
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        drag: {
                            enabled: true,
                        },
                        mode: 'xy',
                    },
                    limits: {
                        x: {min: 'original', max: 'original'},
                        y: {min: 'original', max: 'original'},
                    },
                },
                legend: {
                    display: false,
                },
            }
          
        }
    });
}

})(populateData, document);