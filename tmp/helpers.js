"use strict";

var statBarColors = {
  bad: "#F34444",
  medium: "#FFDD57",
  good: "#A0E515"
};
var toast = document.querySelector("#toast");
var modal = document.querySelector(".modal");
var modalItem = document.querySelector(".modal > .item-detailed");
var movesTableEl = document.querySelector(".moves-list table");
var movesContainer = document.querySelector("#moves");

var shitDoesntWorkYo = function shitDoesntWorkYo() {
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}; // takes a given type and optionally filters object and creates a type


var makeTypeEl = function makeTypeEl(type, filters) {
  var typeEl = document.createElement("span");
  typeEl.textContent = type.type;
  typeEl.style.backgroundColor = type.color;
  typeEl.classList.add("type-label");

  if (filters) {
    typeEl.style.color = type.color;
    typeEl.style.backgroundColor = "white";
    typeEl.style.border = "1.5px solid ".concat(type.color); // create a type element that allows the catalogue to be filtered

    typeEl.addEventListener("click", function () {
      /////// REMOVE THIS WHEN FILTERING TYPES WORKS////
      shitDoesntWorkYo(); //////////////////////////////
      //////////////////////////////////////////////////
      // get the index of a type in the filter list
      // if not found, it will return -1

      var typeIndex = filters.types.indexOf(this.textContent);

      if (typeIndex > -1) {
        // greater than -1, which means it's already one of the filtered types
        // so we will disable the "currently selected" look from the type
        this.style.color = this.style.backgroundColor;
        this.style.border = "1.5px solid ".concat(this.style.backgroundColor);
        this.style.backgroundColor = "white";
        this.style.boxShadow = "none"; // remove from the filtered types

        filters.types.splice(typeIndex, 1);
      } else {
        // not in the list of filtered types
        // highlight it to show it's currently selected
        this.style.backgroundColor = this.style.color;
        this.style.color = "white";
        this.style.borderColor = "1.5px solid white";
        this.style.boxShadow = "0px 1px 2px 0px rgba(100, 100, 100, 1)"; // add it to the list of filtered types

        filters.types.push(this.textContent);
      } // update catalog items


      if (filters.types.length > 0) {
        // if there is something to filter
        console.log(pokemonsArray);
      }
    });
  }

  return typeEl;
}; // calculates the correct width to set each stat bar


var calculateStatBar = function calculateStatBar(statEl, stat) {
  var statPercent = stat / 150 * 100 * 0.7;

  if (stat / 150 < 0.33) {
    statEl.style.backgroundColor = statBarColors.bad;
  } else if (stat / 150 < 0.66) {
    statEl.style.backgroundColor = statBarColors.medium;
  } else {
    statEl.style.backgroundColor = statBarColors.good;
  }

  statEl.style.width = "".concat(statPercent, "%");
}; // renders the stat bars for each stat


var updateStatBars = function updateStatBars(statsEl, statsObj) {
  calculateStatBar(statsEl.querySelector(".stat-speed"), statsObj.speed);
  calculateStatBar(statsEl.querySelector(".stat-specialDefense"), statsObj.specialDefense);
  calculateStatBar(statsEl.querySelector(".stat-specialAttack"), statsObj.specialAttack);
  calculateStatBar(statsEl.querySelector(".stat-attack"), statsObj.attack);
  calculateStatBar(statsEl.querySelector(".stat-defense"), statsObj.defense);
  calculateStatBar(statsEl.querySelector(".stat-hp"), statsObj.hp);
}; // moves positioning is fucked ... needs to be fixed


var updateMovesEl = function updateMovesEl(moves, movesEl) {
  movesEl.innerHTML = ""; // clear previous list of moves

  var itemsInRow = 1;
  var row = document.createElement("tr");
  moves.forEach(function (move) {
    // go over each move
    var tableData = document.createElement("td"); // holds a single move

    tableData.textContent = move; // holds a single move

    if (itemsInRow < 6) {
      // if we haven't reach 5 items in a row, then
      // add the item to the row
      row.appendChild(tableData);
      itemsInRow++; // append items in row to keep track
    } else {
      // already have 5 items in a row
      // add the current row of elements to the dom
      movesEl.appendChild(row); // clear row for a new set of moves

      row = document.createElement("tr"); // add the current move to the empty row

      row.appendChild(tableData);
      itemsInRow = 2; // reset the number of items in a row
    }
  });
}; // returns an element containing full information on an item


var makeDetailedItemEl = function makeDetailedItemEl(pokemon, itemEl, isModal) {
  var name = pokemon.name,
      pokedexNumber = pokemon.pokedexNumber,
      description = pokemon.description,
      types = pokemon.types,
      stats = pokemon.stats,
      image = pokemon.image,
      height = pokemon.height,
      weight = pokemon.weight,
      habitat = pokemon.habitat,
      moves = pokemon.moves;
  var itemImage = itemEl.querySelector(".item-image");
  var fullItemDetails = itemEl.querySelector(".item-full-details"); // image

  itemImage.style.backgroundImage = "url(".concat(image, ")");
  itemImage.querySelector(".item-desc").textContent = description;

  if (isModal) {
    itemEl.querySelector(".item-name > .name").innerHTML = "".concat(name, " <span class=\"poke-number\">#").concat(pokedexNumber, "</span>");
  } else {
    // name and pokedex number
    fullItemDetails.querySelector(".item-name").innerHTML = "".concat(name, " <span class=\"poke-number\">#").concat(pokedexNumber, "</span>");
  }

  fullItemDetails.querySelector(".item-types").innerHTML = "";
  types.forEach(function (type) {
    var typeObj = typesList.find(function (obj) {
      return obj.type === type;
    });
    fullItemDetails.querySelector(".item-types").appendChild(makeTypeEl(typeObj));
  });
  fullItemDetails.querySelector(".height-weight").innerHTML = "<span class=\"number\">Height: \n                  ".concat(convertWeightHeight(height), "m\n                 </span>\n                 <span class=\"number\">Weight: \n                  ").concat(convertWeightHeight(weight), "kg\n                 </span>");
  updateStatBars(fullItemDetails.querySelector(".stat"), stats);
  var movesBtnEl = itemEl.querySelector(".sample-moves");
  movesBtnEl.addEventListener("click", function (e) {
    e.preventDefault();
    updateMovesEl(moves, movesTableEl);
    movesContainer.classList.add("show");
  });
}; // this breaks sometimes


var convertWeightHeight = function convertWeightHeight(number) {
  number = number.toString();
  return (number / Math.pow(10, 1)).toFixed(1);
};

var renderFilters = function renderFilters(filters, filtersEl, pokemonsArray) {
  typesList.forEach(function (type) {
    var typeEl = makeTypeEl(type, filters);
    filtersEl.appendChild(typeEl);
  });
}; // creates an item for the catalog


var createItemEl = function createItemEl(pokemon) {
  // container
  var item = document.createElement("div");
  item.classList.add("item"); // image

  var image = document.createElement("div");
  image.classList.add("item-image");
  item.appendChild(image);
  image.style.backgroundImage = "url(".concat(pokemon.image, ")"); // details container

  var details = document.createElement("div");
  details.classList.add("item-details");
  item.appendChild(details); // name

  var name = document.createElement("h3");
  name.classList.add("name", "header");
  details.appendChild(name);
  name.textContent = pokemon.name; // description

  var desc = document.createElement("p");
  desc.classList.add("desc");
  details.appendChild(desc);
  desc.textContent = pokemon.description; // show a modal with full details on the item

  item.addEventListener("click", function (e) {
    e.preventDefault(); // update data in the modal to the currently clicked item

    modal.classList.add("show");
    makeDetailedItemEl(pokemon, modalItem, true);
  });
  return item;
}; // produces a new array of items to display based on settings in filters object


var paginate = function paginate(pokeArr, filters) {
  return (// divides up the whole array into chunks depending on the itemsPerPage filter
    pokeArr.slice((filters.currentPage - 1) * filters.itemsPerPage, filters.currentPage * filters.itemsPerPage)
  );
}; // display current list of items in the paginated items array


var displayCatalogItems = function displayCatalogItems(paginatedItemsArray) {
  var catalogEl = document.querySelector("#items-container");
  catalogEl.innerHTML = ""; // clear current items on page
  // display items

  paginatedItemsArray.forEach(function (item) {
    for (var key in item) {
      if (item.hasOwnProperty(key)) {
        var pokemon = item[key];
        catalogEl.appendChild(createItemEl(pokemon));
      }
    }
  });
}; // activates/deactivates the pagination arrows based on current page


var paginationArrow = function paginationArrow(filters) {
  if (filters.currentPage == 1) {
    paginationPreviousEl.classList.add("pagination-disabled");
    paginationNextEl.classList.remove("pagination-disabled");
  } else if (filters.currentPage == filters.pagesToRender) {
    paginationNextEl.classList.add("pagination-disabled");
    paginationPreviousEl.classList.remove("pagination-disabled");
  } else {
    paginationPreviousEl.classList.remove("pagination-disabled");
    paginationNextEl.classList.remove("pagination-disabled");
  }
};

var updatePagination = function updatePagination(newActivePage, filters) {
  var oldPageLink = document.querySelector("span.pagination-active");
  oldPageLink.classList.remove("pagination-active"); // remove active css

  newActivePage.classList.add("pagination-active"); // add active css to new active page number

  paginationArrow(filters);
  displayCatalogItems(paginate(pokemonsArray, filters)); // display new items
}; // renders the pagination system


var renderPagination = function renderPagination(filters) {
  for (var page = 1; page <= filters.pagesToRender; page++) {
    var pageNumber = document.createElement("span");
    pageNumber.classList.add("pagination-link", "pagination-number");

    if (page == filters.currentPage) {
      pageNumber.classList.add("pagination-active");
    }

    pageNumber.textContent = page;
    pageNumber.addEventListener("click", function (e) {
      e.preventDefault();

      if (filters.currentPage != this.textContent) {
        // if not already on the same page
        filters.currentPage = parseInt(this.textContent);
        updatePagination(this, filters);
      }
    }); // append it before next page arrow element

    paginationNextEl.parentNode.insertBefore(pageNumber, paginationNextEl);
  }

  paginationArrow(filters);
}; // returns the highest stat number provided array of pokemons and a stat to search


var getLargestStat = function getLargestStat(pokemonArray, statToSearch) {
  // actually a useless method, turns out the highest for each stat is 150...
  var largest; // assign the first pokemon's stat as the largest...

  for (var key in pokemonArray[0]) {
    if (pokemonArray[0].hasOwnProperty(key)) {
      var pokemon = pokemonArray[0][key];
      largest = pokemon.stats[statToSearch];
    }
  } // compare the current largest with everyother other's stat


  for (var i = 1, size = pokemonArray.length; i < size; i++) {
    var pokemonObj = pokemonArray[i];

    for (var _key in pokemonObj) {
      if (pokemonObj.hasOwnProperty(_key)) {
        var _pokemon = pokemonObj[_key];

        if (_pokemon.stats.speed > largest) {
          largest = _pokemon.stats.speed;
        }
      }
    }
  }

  return largest;
};