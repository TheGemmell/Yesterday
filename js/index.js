const APIKey = "K6W03DLD7N6KHG1G";
const searchBar = document.getElementById("searchBar")
const displayArea = document.getElementById("fetched-info")

let querySelector = document.getElementById("query-options")

searchBar.addEventListener('keypress', e =>{
    if (e.code === "Enter") {
        //console.log(e)
    }
})

querySelector.addEventListener('click', e => {
    let querySelected = e.target.innerHTML
    let option = "TIME_SERIES_" + querySelected.toUpperCase()
    document.getElementById('query-dropdown').innerText = querySelected
    fetchRequest(option, searchBar.value)
})


let dataLookingFor = []


let fetchUrl = function(option, stock) {
    return `https://www.alphavantage.co/query?function=${option}&symbol=${stock}&apikey=${APIKey}`
}

//searchBar.setAttribute("placeholder", 'Starting typing a company')

let fetchRequest = function(query, stockSymbol) {
    fetch(fetchUrl(query, stockSymbol))
    .then(Response => Response.json())
    .then(data => {
        dataLookingFor = Object.values(data)[1]
        console.log(dataLookingFor)
        return dataLookingFor
    })
    .then(data => {
        let dates = Object.entries(data)
        console.log(`First Date was: ${dates[dates.length-1]}`)
        return populatePage(dates)
    })
    .catch(error => {
        console.error(error)
        return displayError(error)
    })}

function populatePage(data) {
    console.log("Populating Page: ", data)
    for (let item of data) {
        let newP = document.createElement('p')
        newP.innerText = `${item[0]} + ${item[1]['4. close']}`
        displayArea.appendChild(newP)
    }
    //displayArea.innerHTML = JSON.stringify(data);
}
