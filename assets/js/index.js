const searchedEl = documeent.getElementById("searchc-cities");
function init() {
  const searchedLocalization = JSON.parse(localStorage.getItems("locations"));

  if (searchedLocalization.length === 0) {
    return;
  }

  for (const location of searchedLocations) {
  }
}

init();
