let map, marker

function initMap() {
  var irv = { lat: 33.6449, lng: -117.8348 };
  map = new google.maps.Map(document.getElementById('map'), { zoom: 4, center: irv });
  marker = new google.maps.Marker({ position: irv, map: map });
}

//pull address into function