let protectedAreasPins = [
    {
        name:"Kanha National Park",
        coordinates:[75.20101802387347, 14.83846564030705]
    },
    {
        name:"Bandhavgarh National Park",
        coordinates:[76.12660179903742, 15.450388357743492]
    },
    {
        name:"Pench National Park",
        coordinates:[74.65821497491129, 17.158376144737247]
    }
];

function renderProtectedAreasToMap(publications) {
    let markers = publications.map(createProtectedAreaMarkers);
    return markers;
}

function createProtectedAreaMarkers(pin) {
    // marker
    let divMarker = customMarkerIcon('pareas');
    let marker = new mapboxgl.Marker({element:divMarker})
        .setLngLat(pin.coordinates)
        // .setPopup(popup)
        .addTo(map);

    return marker;
}

let pins = renderProtectedAreasToMap(protectedAreasPins);

// render the pins list
function renderPinList(protectedAreasPins) {
    let container = document.getElementById("park-list");
    let content = "";

    protectedAreasPins.forEach(pin => {
        container += `<div>${pin.name}</div>`;
    });

    container.innerHTML += content;
}


renderPinList(protectedAreasPins);


