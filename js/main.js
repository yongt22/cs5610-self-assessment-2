//# means ID when used with a CSS selector. If nothing pass in, then listings as default
function MainModule(listingsID = "#listings") {
  //This creates an empty JavaScript object. This will contain data later
  const me = {};
  //Find the HTML element whose ID is listings and saves a reference to that DOM element
  const listingsElement = document.querySelector(listingsID);
  //Search element
  const searchElement = document.querySelector("#listing-search");
  //Set the object so we can reassign later
  let currentListings = [];

  //Add listener to search
  searchElement.addEventListener("input", function () {
    const searchText = searchElement.value.toLowerCase();
    //filter will create a new array containing only element that pass to the test
    //include will checks whether for the string contain in it
    //Using lower case to make sure entered search text can match with the listing name
    const filteredListings = currentListings.filter((listing) =>
      listing.name.toLowerCase().includes(searchText)
    );

    redraw(filteredListings);
  });

  // Add one click listener to the listings container
  listingsElement.addEventListener("click", function (event) {
    // clicking an image, description, host, etc does nothing. Clicking our button continues.
    if (!event.target.classList.contains("amenities-button")) {
      return;
    }

    // Find the listing card that contains the clicked button
    const card = event.target.closest(".listing");
    // Find the amenities section inside that card
    const amenitiesElement = card.querySelector(".amenities");
    // Switch between hidden and visible
    amenitiesElement.hidden = !amenitiesElement.hidden;
    // Change the button text
    event.target.textContent = amenitiesElement.hidden
      ? "Show Amenities"
      : "Hide Amenities";
  });

  //Function to create one Airbnb card, one listing object only
  function getListingCode(listing) {
    //Amenities is in 1 string, parse it to array
    const amenities = JSON.parse(listing.amenities);

    // Convert each amenity into an HTML span
    const amenitiesHTML = amenities
      .map((amenity) => `<span class="amenity">${amenity}</span>`)
      .join(" ");

    //Bootstrap column layout: small screen shows 1 card, medium shows 2 cards, large shows 3 cards
    return `<div class="col-12 col-md-6 col-lg-4">
      <div class="listing card">
        <img
          src="${listing.picture_url}"
          class="card-img-top thumbnail-pic"
          alt="${listing.name}"
        />
        <div class="card-body">
          <h2 class="card-title">${listing.name}</h2>
          <div class="listing-price">${listing.price}</div>
        <div class="host-info">
          <img
            src="${listing.host_picture_url}"
            class="host-photo"
            alt="Host ${listing.host_name}"
          />
          <div>Hosted by: ${listing.host_name}</div>
        </div>
          <button class="btn btn-outline-secondary btn-sm amenities-button" type="button">
            Hide Amenities
          </button>
          <div class="amenities">
            <strong>Amenities:</strong>
            ${amenitiesHTML}
          </div>
            <p class="card-text">
              ${listing.description}
            </p>
          <a href="#top" class="btn btn-primary">Back to Top</a>
        </div>
      </div>
      <!-- /card -->
      </div>

    `;
  }

  function redraw(listings) {
    // Convert each listing into HTML and display them in the listings container
    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
  }

  async function loadData() {
    //Request the JSON file, allows the asynchronous operation to complete before continuing with its result
    const res = await fetch("./airbnb_sf_listings_500.json");
    //reads/parses the JSON response
    const listings = await res.json();

    //Select 50 listings and send to redraw()
    currentListings = listings.slice(0, 50);
    me.redraw(currentListings);
  }

  //Started at the beginning with empty, now adding properties/function to it (redraw and load data)
  //so we can call these 2 from outside MainModule()
  me.redraw = redraw;
  me.loadData = loadData;

  return me;
}
//This start the calling of the main
const main = MainModule();
//Execute the loaddata function
main.loadData();
