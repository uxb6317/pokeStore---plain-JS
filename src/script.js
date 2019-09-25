// catalog
const catalogEl = document.querySelector("#items-container");

// filters
const filterTypesEl = document.querySelector("#filter-types");
const selectedTypesEl = document.querySelector("#selected-types");
const minPriceSliderEl = document.querySelector("#min-price > input");
const maxPriceSliderEl = document.querySelector("#max-price > input");
const minPriceValueEl = document.querySelector("#min-price > span");
const maxPriceValueEl = document.querySelector("#max-price > span");
const filterBtn = document.querySelector(".filter-button");

// pagination
const paginationEl = document.querySelector("#pagination");
const paginationNextEl = document.querySelector(".pagination-next");
const paginationPreviousEl = document.querySelector(".pagination-previous");

// sale item
const featuredItemEl = document.querySelector(".featured");
const itemImage = document.querySelector(".item-image");
const fullItemDetails = document.querySelector(".item-full-details");

// modal item
const modalClose = document.querySelector(".modal .modal-close");
const modal = document.querySelector(".modal");

// moves
const movesClose = document.querySelector("#moves .modal-close");
const movesContainer = document.querySelector("#moves");

const filters = {
  types: [],
  price: "",
  pagesToRender: 0,
  itemsPerPage: 12,
  currentPage: 1
};

let featuredItem; // will hold the featured pokemon object

let pokemonsArray = [];
let paginatedItemsArray = [];

// initialize views
init(filters);

modalClose.addEventListener("click", function(e) {
  e.preventDefault();
  modal.classList.remove("show");
});

movesClose.addEventListener("click", function(e) {
  e.preventDefault();
  moves.classList.remove("show");
});

minPriceSliderEl.addEventListener("input", function(e) {
  minPriceValueEl.textContent = `$${this.value}`;
});

maxPriceSliderEl.addEventListener("input", function(e) {
  maxPriceValueEl.textContent = `$${this.value}`;
});

paginationPreviousEl.addEventListener("click", function(e) {
  if (filters.currentPage > 1) {
    // not currently on the first page
    filters.currentPage -= 1; // update current page
    const newActivePage = document.querySelector(
      // nth-child() starts counting at 0, so increment current page by 1 to get the correct element
      `#pagination span:nth-child(${filters.currentPage + 1})`
    );
    updatePagination(newActivePage, filters);
  }
});

paginationNextEl.addEventListener("click", function(e) {
  if (filters.currentPage < filters.pagesToRender) {
    // not currently on the last page
    filters.currentPage += 1;
    const newActivePage = document.querySelector(
      `#pagination span:nth-child(${filters.currentPage + 1})`
    );
    updatePagination(newActivePage, filters);
  }
});

filterBtn.addEventListener("click", function(e) {
  e.preventDefault();
  console.log("filter");
});

function init(filters) {
  // convert pokemon objects to array for access to array functions
  pokemonsArray = Object.keys(pokemons).map(key => ({
    [key]: pokemons[key]
  }));

  // calculate number of pages
  filters.pagesToRender = Math.ceil(
    pokemonsArray.length / filters.itemsPerPage
  );

  // get a random item from the pokemon array for the featured item of the day
  featuredItem =
    pokemonsArray[Math.floor(Math.random() * pokemonsArray.length)];

  for (const key in featuredItem) {
    if (featuredItem.hasOwnProperty(key)) {
      makeDetailedItemEl(featuredItem[key], featuredItemEl); // create the featured item element
    }
  }

  // render types for filtering
  renderFilters(filters, filterTypesEl, pokemonsArray);
  // renderFilterTypesEl(filterTypesEl, filters, selectedTypesEl);

  // list of items that will be displayed on the current page
  paginatedItemsArray = paginate(pokemonsArray, filters);

  // render catalog items
  displayCatalogItems(paginatedItemsArray);

  // render pagination
  renderPagination(filters);
}
