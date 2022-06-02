let protectedAreas = [
    {
        name:"Kanha National Park",
        ecoregion:"Khathiar-Gir dry deciduous forests",
        coordinates:[75.20101802387347, 14.83846564030705]
    },
    {
        name:"Bandhavgarh National Park",
        ecoregion:"Central Deccan Plateau dry deciduous forests",
        coordinates:[76.12660179903742, 15.450388357743492]
    },
    {
        name:"Pench National Park",
        ecoregion:"Deccan thorn scrub forests",
        coordinates:[74.65821497491129, 17.158376144737247]
    }
];

// function renderProtectedAreasToMap(publications) {
//     let markers = publications.map(createProtectedAreaMarkers);
//     return markers;
// }

// function createProtectedAreaMarkers(pin) {
//     // marker
//     let divMarker = customMarkerIcon('pareas');
//     let marker = new mapboxgl.Marker({element:divMarker})
//         .setLngLat(pin.coordinates)
//         // .setPopup(popup)
//         .addTo(map);

//     return marker;
// }

// let pins = renderProtectedAreasToMap(protectedAreasPins);

// render the pins list
class ProtectedAreasItem {
    constructor(item) {
        this.items = item;
    }

    setItems(items) {
        this.areas = items;
    }

    renderItemsToMap() {}
    fireEventListeners() {}
    loadListItems() {
        console.log("Rendering Ecoregions");

        let container = document.getElementById("park-list");
        let content = "";

        this.areas.forEach(pin => {
            content += `<div>${pin.name}</div>`;
        });

        container.innerHTML = content;
    }
}

// renderPinList(protectedAreasPins);


