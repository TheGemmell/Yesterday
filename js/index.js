'use strict';
(function (populateData, document) {
    const APIKey = "K6W03DLD7N6KHG1G";

    const investDate = document.getElementById('invest-date')
    const valueInvested = document.getElementById('valueToInvest')
    const goButton = document.getElementById('startCalcs')
    const searchBar = document.getElementById("searchBar")

    // TODO: Find out why searchBar can be found.
    searchBar.addEventListener('startSearch', e =>{
        console.log(e)
        fetchOverview((searchBar.value).toUpperCase())
})

const notWeekend = function(date){
    let dayNum = new Date(date).getDay()
    console.log(dayNum)
    if (dayNum === 0 || dayNum === 6) {
        return false
    }
    else {
        return true
    }
}

    valueInvested.addEventListener('keypress', e => {
        if (valueInvested.value > 10) {
            valueInvested.classList.add('is-valid')
            valueInvested.classList.remove('is-invalid')
        }
        else if (valueInvested.value < 10) {
            valueInvested.classList.remove('is-valid')
            valueInvested.classList.add('is-invalid')
        }
    })

    goButton.addEventListener('click', e => {
        console.log('Go! Button Clicked: ', e)
        document.getElementById('tableLoading').classList.remove('visually-hidden')
        fetchTimeInfo(document.getElementById('rightHandName').innerText, investDate.value, valueInvested.value)
    })

    investDate.addEventListener('change', e => {
        console.log(e)
        if (notWeekend(e.target.value)) {
            if (valueInvested.value > 0) {
                goButton.classList.remove('disabled')
            }
        }
        else {
            goButton.classList.add('disabled')
        }
    })


let fetchUrl = function(option, stock) {
    return `https://www.alphavantage.co/query?function=${option}&symbol=${stock}&apikey=${APIKey}`
}

let fetchOverview = function(stock) {
    fetch(fetchUrl("OVERVIEW", stock))
    .then(Response => Response.json())
    .then(data => {
        console.log('fetchOverview: ',data)
        if (Object.keys(data).length > 1) {
        populateData.summary(data)}
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
        console.log('fetchFooter: ', data)
        data = Object.values(data)[0]
        console.log('First Promise: ', data)
        return data
    })
    .then(data => {
        data = Object.entries(data)
        console.log('Second Promise: ', data)
        document.getElementById('graphcard').classList.remove('visually-hidden')
        populateData.footer(data)
    })
    .catch(error => {
        console.log(error)
    })
}

let fetchTimeInfo = function(stockSymbol, date, amount) {
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockSymbol}&outputsize=full&apikey=${APIKey}`)
    .then(Response => Response.json())
    .then(data => {
        console.log(data)
        populateData.dividendCalculation(data['Time Series (Daily)'], date, amount)
        document.getElementById('tableLoading').classList.add('visually-hidden')
        document.getElementById('dividendTable').classList.remove('visually-hidden')
    })
    .catch(error => {
        console.error(error)
        populateData.displayError(error)
    })
}






})(populateData, document);