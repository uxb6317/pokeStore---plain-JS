"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// catalog
var catalogEl = document.querySelector("#items-container"); // filters

var filterTypesEl = document.querySelector("#filter-types");
var selectedTypesEl = document.querySelector("#selected-types");
var minPriceSliderEl = document.querySelector("#min-price > input");
var maxPriceSliderEl = document.querySelector("#max-price > input");
var minPriceValueEl = document.querySelector("#min-price > span");
var maxPriceValueEl = document.querySelector("#max-price > span");
var filterBtn = document.querySelector(".filter-button"); // pagination

var paginationEl = document.querySelector("#pagination");
var paginationNextEl = document.querySelector(".pagination-next");
var paginationPreviousEl = document.querySelector(".pagination-previous"); // sale item

var featuredItemEl = document.querySelector(".featured");
var itemImage = document.querySelector(".item-image");
var fullItemDetails = document.querySelector(".item-full-details"); // modal item

var modalClose = document.querySelector(".modal .modal-close");
var modal = document.querySelector(".modal"); // moves

var movesClose = document.querySelector("#moves .modal-close");
var movesContainer = document.querySelector("#moves");
var filters = {
  types: [],
  price: "",
  pagesToRender: 0,
  itemsPerPage: 12,
  currentPage: 1
};
var featuredItem; // will hold the featured pokemon object

var pokemonsArray = [];
var paginatedItemsArray = []; // initialize views

init(filters);
modalClose.addEventListener("click", function (e) {
  e.preventDefault();
  modal.classList.remove("show");
});
movesClose.addEventListener("click", function (e) {
  e.preventDefault();
  moves.classList.remove("show");
});
minPriceSliderEl.addEventListener("input", function (e) {
  minPriceValueEl.textContent = "$".concat(this.value);
});
maxPriceSliderEl.addEventListener("input", function (e) {
  maxPriceValueEl.textContent = "$".concat(this.value);
});
paginationPreviousEl.addEventListener("click", function (e) {
  if (filters.currentPage > 1) {
    // not currently on the first page
    filters.currentPage -= 1; // update current page

    var newActivePage = document.querySelector( // nth-child() starts counting at 0, so increment current page by 1 to get the correct element
    "#pagination span:nth-child(".concat(filters.currentPage + 1, ")"));
    updatePagination(newActivePage, filters);
  }
});
paginationNextEl.addEventListener("click", function (e) {
  if (filters.currentPage < filters.pagesToRender) {
    // not currently on the last page
    filters.currentPage += 1;
    var newActivePage = document.querySelector("#pagination span:nth-child(".concat(filters.currentPage + 1, ")"));
    updatePagination(newActivePage, filters);
  }
});
filterBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("filter");
});

function init(filters) {
  // convert pokemon objects to array for access to array functions
  pokemonsArray = Object.keys(pokemons).map(function (key) {
    return _defineProperty({}, key, pokemons[key]);
  }); // calculate number of pages

  filters.pagesToRender = Math.ceil(pokemonsArray.length / filters.itemsPerPage); // get a random item from the pokemon array for the featured item of the day

  featuredItem = pokemonsArray[Math.floor(Math.random() * pokemonsArray.length)];

  for (var key in featuredItem) {
    if (featuredItem.hasOwnProperty(key)) {
      makeDetailedItemEl(featuredItem[key], featuredItemEl); // create the featured item element
    }
  } // render types for filtering


  renderFilters(filters, filterTypesEl, pokemonsArray); // renderFilterTypesEl(filterTypesEl, filters, selectedTypesEl);
  // list of items that will be displayed on the current page

  paginatedItemsArray = paginate(pokemonsArray, filters); // render catalog items

  displayCatalogItems(paginatedItemsArray); // render pagination

  renderPagination(filters);
}