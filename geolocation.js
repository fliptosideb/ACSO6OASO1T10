//geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    yourLocation.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  yourLocation = document.querySelector('#yourlocation')
  // console.log(position.coords.latitude)
  // console.log(position.coords.longitude)
  
  //reverse geocode
  fetch(`http://www.mapquestapi.com/geocoding/v1/reverse?key=zlMKNlqjyFv79AvMHSCLunzQE5O7u7Ak&location=${position.coords.latitude},${position.coords.longitude}`)
    .then(r => r.json())
    .then(({ results }) => {
      // console.log(results)
      // console.log(results[0].locations[0].street)
      let curLocation = results[0].locations[0].street
      yourLocation.value = curLocation
    })
    .catch(e => console.error(e))
}