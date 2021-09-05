const APIKey = "K6W03DLD7N6KHG1G";

function debounce(fuction, wait, immediate) {
	var timeout;
	return function () {
		var context = this, args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) fuction.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) fuction.apply(context, args);
	};
};



let searchResults = function(input) {
	fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input.value}&apikey=${APIKey}`)
	.then(Response => Response.json())
	.then(data => {
		console.log(data)
		if (!("Information" in data)) {
			let results = data.bestMatches
			console.log(results)
			let searchList = document.createElement("div");
			searchList.setAttribute("id", "search" + "autocomplete-list");
			searchList.setAttribute("class", "autocomplete-items");
			searchBar.parentNode.appendChild(searchList)
			populateSearch(results, searchList, input)
		}
		else {
			console.log('Api Exceeded')
			let displayedError = document.createElement('div')
			displayedError.classList = 'alert alert-dismissible alert-danger';
			displayedError.innerHTML = `
			<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
			<strong>Oh snap!</strong>
			<p>${data.Information}</p>`
			document.getElementsByClassName('container')[0].appendChild(displayedError)
		}
	})
	.catch(error => {
		console.log(error)
	})
}

let populateSearch = function (bestMatches, searchList, userInput) {
	for (let bestMatch of bestMatches) {
		if (!bestMatch['1. symbol'].includes('.')) {
		searchItem = document.createElement("DIV");
		searchItem.setAttribute('id', bestMatch['1. symbol'])
		searchItem.innerHTML = `<p>${bestMatch['2. name']}</p>`
		searchItem.innerHTML += `<p style="text-align:right">${bestMatch['1. symbol']}</p><p style="text-align:right;color:#7a8288">${bestMatch['8. currency']}/${bestMatch['4. region']}</p>`
		searchItem.setAttribute('class', 'searchresult')
		searchItem.addEventListener("click", function (e) {
			console.log('User Clicked: ', this.getAttribute('id'))
			userInput.value = this.getAttribute('id');
			userInput.classList.add('is-valid')
			userInput.dispatchEvent(new CustomEvent('startSearch', {
				'key': 'Enter',
				'code': 'Enter',
			  }));
			});
		searchList.appendChild(searchItem);
		}
	}
}

function autocomplete(input) {
	let currentFocus = -1
	input.addEventListener("input", debounce(function (e) {
		var val = this.value
		closeAllLists()
		if (!val || val.length < 2) {
			return false
		}
		searchResults(input)
	}, 450))

	input.addEventListener("keydown", function (e) {
		//console.log('keydown: ', e)
		var x = document.getElementById("search" + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			currentFocus++;
			console.log(currentFocus)
			addActive(x);
		} else if (e.keyCode == 38) {
			currentFocus--;
			addActive(x);
		} else if (e.keyCode == 13) {
			console.log(e)
			if (currentFocus > -1) {
				if (x) {
					console.log('Clicking number: ', currentFocus)
					x[currentFocus].click()
					console.log(x[currentFocus])
				}
			}
		}
	});
	function addActive(x) {
		if (!x) return false;
		removeActive(x);
		if (currentFocus >= x.length) {
			currentFocus = 0;
		}
		if (currentFocus < 0) {
			currentFocus = (x.length - 1);
		}
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != input) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}

autocomplete(document.getElementById("searchBar"))