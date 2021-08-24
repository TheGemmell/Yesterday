const populateData = (function (document, window) {
    
    let logoAPI = 'https://logo.clearbit.com/IBM.com'
    let summaryContentHeader = document.getElementById('summary-content-header')
    let mainDataBody = document.getElementById('mainDataBody')
    let summaryContentFooter = document.getElementById('summary-content-footer')
    let summaryStockLogo = document.getElementById('stock-logo');
    let rightHandName = document.getElementById('rightHandName')
    let rightHandSector = document.getElementById('rightHandSector')
    let rightHandIndustry = document.getElementById('rightHandIndustry')
    let searchBar = document.getElementById("searchBar")
    let fetchedSummary = document.getElementById("fetchedSummary")


    const fillSummary = function (data) {
        fetchedSummary.innerText = data.Description;
        rightHandName.innerText = data.Symbol;
        rightHandSector.innerText = data.Sector;
        rightHandIndustry.innerText = data.Industry;
    }

    function grabLogo(data) {

    }

    const fillFooter = function(data) {
        console.log('Filling Footer: ', data)
        data.shift()
        let listOfInfo = document.createElement('ul')
        listOfInfo.classList = ('list-group list-group-horizontal')
        for (let item of data) {
            let newItem = document.createElement('li')
            newItem.classList = ('list-group-item flex-fill')
            item[0] = item[0].slice(3)
            newItem.innerHTML = `${item[0]}<br>${item[1]}`
            listOfInfo.appendChild(newItem)
        }
        if (summaryContentFooter.hasChildNodes()) {
            summaryContentFooter.removeChild(summaryContentFooter.firstChild)
        }
        summaryContentFooter.appendChild(listOfInfo)
    }

    function populatePage(data) {
        mainDataBody.innerHTML = ''
        console.log("Populating Page: ", data)
        for (let item of data) {
            let newP = document.createElement('p')
            newP.innerText = `${item[0]} + ${item[1]['4. close']}`
            mainDataBody.appendChild(newP)
        }
    }

    return {
        summary: fillSummary,
        populatePage: populatePage,
        footer: fillFooter,
    }
    



})(document, window);