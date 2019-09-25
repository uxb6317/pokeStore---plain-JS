const statBarColors = {
  bad: "#F34444",
  medium: "#FFDD57",
  good: "#A0E515"
};

const toast = document.querySelector("#toast");
const modal = document.querySelector(".modal");
const modalItem = document.querySelector(".modal > .item-detailed");
const movesTableEl = document.querySelector(".moves-list table");
const movesContainer = document.querySelector("#moves");

const shitDoesntWorkYo = () => {
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
};

// takes a given type and optionally filters object and creates a type
const makeTypeEl = (type, filters) => {
  const typeEl = document.createElement("span");
  typeEl.textContent = type.type;
  typeEl.style.backgroundColor = type.color;
  typeEl.classList.add("type-label");

  if (filters) {
    typeEl.style.color = type.color;
    typeEl.style.backgroundColor = "white";
    typeEl.style.border = `1.5px solid ${type.color}`;
    // create a type element that allows the catalogue to be filtered
    typeEl.addEventListener("click", function() {
      /////// REMOVE THIS WHEN FILTERING TYPES WORKS////
      shitDoesntWorkYo(); //////////////////////////////
      //////////////////////////////////////////////////
      // get the index of a type in the filter list
      // if not found, it will return -1
      const typeIndex = filters.types.indexOf(this.textContent);

      if (typeIndex > -1) {
        // greater than -1, which means it's already one of the filtered types
        // so we will disable the "currently selected" look from the type
        this.style.color = this.style.backgroundColor;
        this.style.border = `1.5px solid ${this.style.backgroundColor}`;
        this.style.backgroundColor = "white";
        this.style.boxShadow = "none";

        // remove from the filtered types
        filters.types.splice(typeIndex, 1);
      } else {
        // not in the list of filtered types
        // highlight it to show it's currently selected
        this.style.backgroundColor = this.style.color;
        this.style.color = "white";
        this.style.borderColor = "1.5px solid white";
        this.style.boxShadow = "0px 1px 2px 0px rgba(100, 100, 100, 1)";

        // add it to the list of filtered types
        filters.types.push(this.textContent);
      }

      // update catalog items
      if (filters.types.length > 0) {
        // if there is something to filter
        console.log(pokemonsArray);
      }
    });
  }

  return typeEl;
};

// calculates the correct width to set each stat bar
const calculateStatBar = (statEl, stat) => {
  const statPercent = (stat / 150) * 100 * 0.7;
  if (stat / 150 < 0.33) {
    statEl.style.backgroundColor = statBarColors.bad;
  } else if (stat / 150 < 0.66) {
    statEl.style.backgroundColor = statBarColors.medium;
  } else {
    statEl.style.backgroundColor = statBarColors.good;
  }
  statEl.style.width = `${statPercent}%`;
};

// renders the stat bars for each stat
const updateStatBars = (statsEl, statsObj) => {
  calculateStatBar(statsEl.querySelector(`.stat-speed`), statsObj.speed);
  calculateStatBar(
    statsEl.querySelector(`.stat-specialDefense`),
    statsObj.specialDefense
  );
  calculateStatBar(
    statsEl.querySelector(`.stat-specialAttack`),
    statsObj.specialAttack
  );
  calculateStatBar(statsEl.querySelector(`.stat-attack`), statsObj.attack);
  calculateStatBar(statsEl.querySelector(`.stat-defense`), statsObj.defense);
  calculateStatBar(statsEl.querySelector(`.stat-hp`), statsObj.hp);
};

// moves positioning is fucked ... needs to be fixed
const updateMovesEl = (moves, movesEl) => {
  movesEl.innerHTML = ""; // clear previous list of moves
  let itemsInRow = 1;
  let row = document.createElement("tr");
  moves.forEach(function(move) {
    // go over each move
    const tableData = document.createElement("td"); // holds a single move
    tableData.textContent = move; // holds a single move
    if (itemsInRow < 6) {
      // if we haven't reach 5 items in a row, then
      // add the item to the row
      row.appendChild(tableData);
      itemsInRow++; // append items in row to keep track
    } else {
      // already have 5 items in a row
      // add the current row of elements to the dom
      movesEl.appendChild(row);
      // clear row for a new set of moves
      row = document.createElement("tr");
      // add the current move to the empty row
      row.appendChild(tableData);
      itemsInRow = 2; // reset the number of items in a row
    }
  });
};

// returns an element containing full information on an item
const makeDetailedItemEl = (pokemon, itemEl, isModal) => {
  const {
    name,
    pokedexNumber,
    description,
    types,
    stats,
    image,
    height,
    weight,
    habitat,
    moves
  } = pokemon;

  const itemImage = itemEl.querySelector(".item-image");
  const fullItemDetails = itemEl.querySelector(".item-full-details");

  // image
  itemImage.style.backgroundImage = `url(${image})`;
  itemImage.querySelector(".item-desc").textContent = description;

  if (isModal) {
    itemEl.querySelector(
      ".item-name > .name"
    ).innerHTML = `${name} <span class="poke-number">#${pokedexNumber}</span>`;
  } else {
    // name and pokedex number
    fullItemDetails.querySelector(
      ".item-name"
    ).innerHTML = `${name} <span class="poke-number">#${pokedexNumber}</span>`;
  }

  fullItemDetails.querySelector(".item-types").innerHTML = "";
  types.forEach(function(type) {
    const typeObj = typesList.find(obj => {
      return obj.type === type;
    });

    fullItemDetails
      .querySelector(".item-types")
      .appendChild(makeTypeEl(typeObj));
  });

  fullItemDetails.querySelector(
    ".height-weight"
  ).innerHTML = `<span class="number">Height: 
                  ${convertWeightHeight(height)}m
                 </span>
                 <span class="number">Weight: 
                  ${convertWeightHeight(weight)}kg
                 </span>`;

  updateStatBars(fullItemDetails.querySelector(".stat"), stats);

  const movesBtnEl = itemEl.querySelector(".sample-moves");
  movesBtnEl.addEventListener("click", function(e) {
    e.preventDefault();
    updateMovesEl(moves, movesTableEl);
    movesContainer.classList.add("show");
  });
};

// this breaks sometimes
const convertWeightHeight = function(number) {
  number = number.toString();
  return (number / Math.pow(10, 1)).toFixed(1);
};

const renderFilters = (filters, filtersEl, pokemonsArray) => {
  typesList.forEach(function(type) {
    const typeEl = makeTypeEl(type, filters);

    filtersEl.appendChild(typeEl);
  });
};

// creates an item for the catalog
const createItemEl = pokemon => {
  // container
  const item = document.createElement("div");
  item.classList.add("item");

  // image
  const image = document.createElement("div");
  image.classList.add("item-image");
  item.appendChild(image);
  image.style.backgroundImage = `url(${pokemon.image})`;

  // details container
  const details = document.createElement("div");
  details.classList.add("item-details");
  item.appendChild(details);

  // name
  const name = document.createElement("h3");
  name.classList.add("name", "header");
  details.appendChild(name);
  name.textContent = pokemon.name;

  // description
  const desc = document.createElement("p");
  desc.classList.add("desc");
  details.appendChild(desc);
  desc.textContent = pokemon.description;

  // show a modal with full details on the item
  item.addEventListener("click", function(e) {
    e.preventDefault();
    // update data in the modal to the currently clicked item
    modal.classList.add("show");
    makeDetailedItemEl(pokemon, modalItem, true);
  });

  return item;
};

// produces a new array of items to display based on settings in filters object
const paginate = (pokeArr, filters) =>
  // divides up the whole array into chunks depending on the itemsPerPage filter
  pokeArr.slice(
    (filters.currentPage - 1) * filters.itemsPerPage,
    filters.currentPage * filters.itemsPerPage
  );

// display current list of items in the paginated items array
const displayCatalogItems = paginatedItemsArray => {
  const catalogEl = document.querySelector("#items-container");
  catalogEl.innerHTML = ""; // clear current items on page

  // display items
  paginatedItemsArray.forEach(item => {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const pokemon = item[key];
        catalogEl.appendChild(createItemEl(pokemon));
      }
    }
  });
};

// activates/deactivates the pagination arrows based on current page
const paginationArrow = filters => {
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

const updatePagination = (newActivePage, filters) => {
  const oldPageLink = document.querySelector("span.pagination-active");

  oldPageLink.classList.remove("pagination-active"); // remove active css
  newActivePage.classList.add("pagination-active"); // add active css to new active page number
  paginationArrow(filters);

  displayCatalogItems(paginate(pokemonsArray, filters)); // display new items
};

// renders the pagination system
const renderPagination = filters => {
  for (let page = 1; page <= filters.pagesToRender; page++) {
    const pageNumber = document.createElement("span");
    pageNumber.classList.add("pagination-link", "pagination-number");
    if (page == filters.currentPage) {
      pageNumber.classList.add("pagination-active");
    }
    pageNumber.textContent = page;

    pageNumber.addEventListener("click", function(e) {
      e.preventDefault();
      if (filters.currentPage != this.textContent) {
        // if not already on the same page
        filters.currentPage = parseInt(this.textContent);
        updatePagination(this, filters);
      }
    });
    // append it before next page arrow element
    paginationNextEl.parentNode.insertBefore(pageNumber, paginationNextEl);
  }

  paginationArrow(filters);
};

// returns the highest stat number provided array of pokemons and a stat to search
const getLargestStat = function(pokemonArray, statToSearch) {
  // actually a useless method, turns out the highest for each stat is 150...
  let largest;

  // assign the first pokemon's stat as the largest...
  for (const key in pokemonArray[0]) {
    if (pokemonArray[0].hasOwnProperty(key)) {
      const pokemon = pokemonArray[0][key];
      largest = pokemon.stats[statToSearch];
    }
  }

  // compare the current largest with everyother other's stat
  for (let i = 1, size = pokemonArray.length; i < size; i++) {
    const pokemonObj = pokemonArray[i];
    for (const key in pokemonObj) {
      if (pokemonObj.hasOwnProperty(key)) {
        const pokemon = pokemonObj[key];
        if (pokemon.stats.speed > largest) {
          largest = pokemon.stats.speed;
        }
      }
    }
  }

  return largest;
};
