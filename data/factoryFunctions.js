function removeMarkers(markers) {
    markers.forEach(marker => marker.remove());
}

function createMarker(item, popupFunction, icon) {
    // popup content
    let popupContent = popupFunction(item);
    let popup = new mapboxgl.Popup({focusAfterOpen:false})
        .setHTML(popupContent);

    // marker
    let divMarker = customMarkerIcon(icon);
    let marker = new mapboxgl.Marker({element:divMarker, id:item.id})
        .setLngLat(item.coordinates)
        .setPopup(popup)
        // .addTo(map);

    marker.on("click", function(e) {
        console.log("Marker click");
        e.stopPropagation();

        console.log(e);
    });

    divMarker.onclick = function(e) {
        e.stopPropagation();

        marker.togglePopup();
    }

    marker.id = item.id;
    return marker;
}

function customMarkerIcon(icon) {
    let divMarker = document.createElement("div");

    // add attributes
    divMarker.classList.add("div-marker");
    divMarker.innerHTML = `<img src='icons/${icon}.png'  alt="${icon}" />`;

    return divMarker;
}