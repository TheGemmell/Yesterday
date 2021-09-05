const populateData = (function (document, window) {

    const summaryContentHeader = document.getElementById('summary-content-header')
    const mainDataBody = document.getElementById('mainDataBody')
    const summaryContentFooter = document.getElementById('summary-content-footer')
    const summaryStockLogo = document.getElementById('stock-logo');
    const rightHandName = document.getElementById('rightHandName')
    const rightHandSector = document.getElementById('rightHandSector')
    const rightHandIndustry = document.getElementById('rightHandIndustry')
    const rightHandExchange = document.getElementById('rightHandExchange')
    const rightHandCurrency = document.getElementById('rightHandCurrency')
    const fetchedSummary = document.getElementById("fetchedSummary")
    const mainContent = document.getElementById('maincontent')
    const chartToRender = document.getElementById('timelineChart').getContext('2d');

    const tblPos = document.getElementById('tbc1')    
    const tblPos2 = document.getElementById('tbc1b')    
    const tblPosA = document.getElementById('tbc2')
    const tblPosA2 = document.getElementById('tbc2b')    
    const tblVol = document.getElementById('tbc3')
    const tblVol2 = document.getElementById('tbc3b')
    const tblTimesSplit = document.getElementById('tbc4')
    const tblStockReceived = document.getElementById('tbc5')
    const tblStockReceived2 = document.getElementById('tbc5b')
    const tblRemainder = document.getElementById('tbc7')
    const tblRemainder2 = document.getElementById('tbc7b')

    const tbl2Stocks = document.getElementById('tb2c1')
    const tbl2StockValue = document.getElementById('tb2c1b')
    const tbl2Dividends = document.getElementById('tb2c2')
    const tbl2DividendsValue = document.getElementById('tb2c2b')
    const tbl2Remainder = document.getElementById('tb2c3')

    const tblTotalValue = document.getElementById('totalValue')
    const tbl2Profit = document.getElementById('profitMade')

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
        mainContent.classList.remove("visually-hidden")

        data.shift()
        let currencySign = () => {
            if (rightHandCurrency.innerText === "USD") {
                return '$'
            }
            else if (rightHandCurrency.innerText === "EUR") {
                return '€'
            }
            else {
                return ''
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


    function showSplitWarning() {
        console.log('This stock has been split!')
        let splitErrMsg = document.createElement('div')
        splitErrMsg.classList = 'alert alert-dismissible alert-danger'
        splitErrMsg.innerHTML = `
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <h3 class="text-primary">Please Note</h3><p>This stock appears of been split inbetween the selected date and today. The Dividend Payments will not be accurate.</p>
        `
        document.getElementById('mainDataBody').prepend(splitErrMsg)
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
    
    const dividend = function(response, date, amount){
        let indexOfDate = Object.keys(response).indexOf(date)
        console.log(`indexOfDate: ${indexOfDate}`)
        
        let entireData = Object.entries(response)
        let data = entireData.filter(eachObj => {
            return entireData.indexOf(eachObj) <= indexOfDate
        })
        console.log(`Length of data is: ${data.length}`)
        console.log('Current Price is: ', data[0][1]['4. close'])
        const currentPrice = data[0][1]['4. close']
        const currentPriceA = data[0][1]['5. adjusted close']
        const volumeTradeNow = data[0][1]['6. volume']
        renderChart(data)
        
        const purchasePrice = Object.values(data[indexOfDate][1])[3]
        const purchasePriceA = Object.values(data[indexOfDate][1])[4]
        const volumeTradeThen = Object.values(data[indexOfDate][1])[5]

        console.log(`purchasePrice is ${purchasePrice}`)
        console.log(`purchasePriceA is ${purchasePriceA}`)
        
        let stockReceived = parseInt(amount / purchasePrice)
        let stockReceivedNow = parseInt(amount / currentPrice)
        let remainderReceivedThen = parseFloat(amount % purchasePrice).toFixed(2)
        let remainderReceivedNow = parseFloat(amount % currentPrice).toFixed(2)

        console.log(`stockReceived is ${stockReceived}`) 
        console.log(`remainderReceivedThen is ${remainderReceivedThen}`)
    
        let listOfDates = () => {
            let datesArray = []
            for (let item of data) {
                datesArray.push(item[0])
            }
            return datesArray
        }
    
        let todaysDate = listOfDates()[0]
    
        console.log(`todaysDate is ${todaysDate}`)

        let splits = data.filter(eachObj =>{
            return eachObj[1]['8. split coefficient'] != '1.0'
        })

        let datesDivsPaid = (array=data) => array.filter(eachObj => {
            return eachObj[1]['7. dividend amount'] != '0.0000'
        })

        let divPayments = (array, stockNum=stockReceived) => {
            let divArray = []
            for (let item of array) {
                divArray.push(item[1]['7. dividend amount'] * stockNum)
            }
            console.log(divArray)
            return divArray
        }
        
        let totalDivsPaid = divPayments(datesDivsPaid()).reduce((total, num) => {
            return total + num
        })
        
        if (splits.length > 0) {
            showSplitWarning()
            let splitIndexArray = []
            let splitAmounts = []
            for (let split of splits) {
                splitIndexArray.push(data.indexOf(split))
                splitAmounts.unshift(split[1]['8. split coefficient'])
            }
            console.log(splitAmounts)
            for (let i = 0; i < splitAmounts.length; i++) {
                // data.indexOf(splits[i])
                stockReceived = (stockReceived * parseInt(splitAmounts[i]))
                console.log(stockReceived)
            }
        }

        let currentStockWorth = stockReceived * currentPrice
        let totalValueAll = totalDivsPaid + currentStockWorth
        let profitMargin = totalValueAll - amount
        console.log(`totalDivsPaid is ${totalDivsPaid}`)

        function numberWithCommas(input) {
            return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }


        populateTable = function() {
            tblPos.innerText = parseFloat(purchasePrice).toFixed(2)
            tblPos2.innerText = parseFloat(currentPrice).toFixed(2)
            tblPosA.innerText = parseFloat(purchasePriceA).toFixed(2)
            tblPosA2.innerText = parseFloat(currentPriceA).toFixed(2)
            tblVol.innerText = volumeTradeThen
            tblVol2.innerText = volumeTradeNow
            tblTimesSplit.innerText = splits.length
            tblStockReceived.innerText = parseInt(amount / purchasePrice)
            tblStockReceived2.innerText = stockReceivedNow
            tblRemainder.innerText = remainderReceivedThen
            tblRemainder2.innerText = remainderReceivedNow

            tbl2Stocks.innerText = stockReceived
            tbl2StockValue.innerText = numberWithCommas(parseFloat(currentStockWorth).toFixed(2))
            tbl2Dividends.innerText = datesDivsPaid().length
            tbl2DividendsValue.innerText = numberWithCommas(parseFloat(totalDivsPaid).toFixed(2))
            tbl2Remainder.innerText = remainderReceivedThen
            tblTotalValue.innerText = numberWithCommas(parseFloat(totalValueAll).toFixed(2))
            tbl2Profit.innerText = numberWithCommas(parseFloat(profitMargin).toFixed(2))

        }
        populateTable()

    }

    //  TODO: Fix it not making a second chart if one already rendered.
    //let newCtx = document.createElement('canvas').getContext('2d')
    let renderChart = function (data, title, timeline) {
        let dates = []
        let values = []
        for (let date of data) {
            dates.unshift(date[0])
            values.unshift(date[1]['5. adjusted close'])
        }
        new Chart(chartToRender, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: title,
                    backgroundColor: 'rgb(255, 99, 255)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: values,
                }]
            },
            options: {
                plugins: {
                    zoom: {
                        // TODO: Fix Panning Issue
                        limits: {
                            x: { min: 'original', max: 'original' },
                            y: { min: 'original', max: 'original' },
                        },
                        pan: {
                            enabled: true,
                            modifierKey: 'ctrl',
                            mode: 'xy',
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
                    },
                    legend: {
                        display: false,
                    },
                }

            }
        });
    }



    return {
        renderChart: renderChart,
        summary: fillSummary,
        footer: fillFooter,
        displayError: displayError,
        dividendCalculation: dividend,
    }
    



})(document, window);