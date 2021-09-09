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

let isApiNotExceeded = function(data) {
    if ("Note" in data) {
        populateData.apiError()
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

const fetchOverview = function(stock) {
    fetch(fetchUrl("OVERVIEW", stock))
    .then(Response => Response.json())
    .then(data => {
        if (isApiNotExceeded(data)) {
        console.log('fetchOverview: ', data)
        populateData.summary(data)
        fetchFooter((searchBar.value).toUpperCase())
        }
    })
    .catch(error => {
        console.log(error)
    })
}


const fetchFooter = function(stock) {
    fetch(fetchUrl("GLOBAL_QUOTE", stock))
    .then(Response => Response.json())
    .then(data => {
        if (isApiNotExceeded(data)) {
        console.log('Fetching Footer: ', data)
        data = Object.values(data)[0]
        data = Object.entries(data)
        document.getElementById('graphcard').classList.remove('visually-hidden')
        populateData.footer(data)
        }
    })
    .catch(error => {
        console.log(error)
    })
}

const fetchTimeInfo = function(stockSymbol, date, amount) {
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockSymbol}&outputsize=full&apikey=${APIKey}`)
    .then(Response => Response.json())
    .then(data => {
        if (isApiNotExceeded(data)) {
        console.log(data)
        populateData.dividendCalculation(data['Time Series (Daily)'], date, amount)
        document.getElementById('tableLoading').classList.add('visually-hidden')
        document.getElementById('dividendTable').classList.remove('visually-hidden')
        }
    })
    .catch(error => {
        console.error(error)
        populateData.displayError(error)
    })
}






})(populateData, document);