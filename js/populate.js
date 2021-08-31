const populateData = (function (document, window) {
    
    let logoAPI = 'https://logo.clearbit.com/IBM.com'
    let summaryContentHeader = document.getElementById('summary-content-header')
    let mainDataBody = document.getElementById('mainDataBody')
    let summaryContentFooter = document.getElementById('summary-content-footer')
    let summaryStockLogo = document.getElementById('stock-logo');
    let rightHandName = document.getElementById('rightHandName')
    let rightHandSector = document.getElementById('rightHandSector')
    let rightHandIndustry = document.getElementById('rightHandIndustry')
    let rightHandExchange = document.getElementById('rightHandExchange')
    let rightHandCurrency = document.getElementById('rightHandCurrency')
    let searchBar = document.getElementById("searchBar")
    let fetchedSummary = document.getElementById("fetchedSummary")
    let mainContent = document.getElementById('maincontent')


    

    const fillSummary = function (data) {
        rightHandExchange.innerText = data.Exchange;
        rightHandCurrency.innerText = data.Currency;
        summaryContentHeader.innerText = data.Name;
        fetchedSummary.innerHTML = '<p id="fetchedDesc">'+data.Description+'</p>';
        rightHandName.innerText = data.Symbol;
        rightHandSector.innerText = data.Sector;
        rightHandIndustry.innerText = data.Industry;
        mainContent.classList.remove("visually-hidden")
    }


    const fillFooter = function(data) {
        console.log('Filling Footer: ', data)
        data.shift()
        let currencySign = () => {
            if (rightHandCurrency.innerText === "USD") {
                return '$'
            }
            else if (rightHandCurrency.innerText === "EUR") {
                return '€'
            }
        }
        let listOfInfo = document.createElement('ul')
        listOfInfo.classList = ('list-group list-group-horizontal text-center card-footer')
        for (let item of data) {
            let newItem = document.createElement('li')
            newItem.classList = ('list-group-item flex-fill')
            item[0] = item[0].slice(3)
            if (item[0].toUpperCase() === " LATEST TRADING DAY") {
                newItem.innerHTML = '<p class="">'+item[1]+'</p>'+'<p class="text-muted">'+item[0].toUpperCase()+'</p>'
                listOfInfo.appendChild(newItem)
            } 
            else if (item[1] % 1 === 0)  {
                newItem.innerHTML = '<p class="">'+parseFloat(item[1])+'</p>'+'<p class="text-muted">'+item[0].toUpperCase()+'</p>'
                listOfInfo.appendChild(newItem)
                }
            else {
            newItem.innerHTML = '<p class="">'+currencySign()+parseFloat(item[1]).toFixed(2)+'</p>'+'<p class="text-muted">'+item[0].toUpperCase()+'</p>'
            listOfInfo.appendChild(newItem)
            }
            if (summaryContentFooter.hasChildNodes()) {
            summaryContentFooter.removeChild(summaryContentFooter.firstChild)
            }
        summaryContentFooter.appendChild(listOfInfo)
        }
    let changePercentItem = listOfInfo.lastChild.firstChild.innerText.slice(1) + '%'
    listOfInfo.lastChild.firstChild.innerText = changePercentItem
    }

    const displayError = function (error) {
        let displayedError = document.createElement('div')
        displayedError.classList = 'alert alert-dismissible alert-danger';
        displayedError.innerHTML = `
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      <strong>Oh snap!</strong>
      <p>${error}`
        document.getElementById('summary-content-header').prepend(displayedError)
    }
    




    return {
        summary: fillSummary,
        footer: fillFooter,
        displayError: displayError,
    }
    



})(document, window);