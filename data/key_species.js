let keySpecies = [
    {
        id:0,
        name:"Hoopa",
        scientific_name:"Canarium strictum",
        ecoregion:"",
        image:"https://picsum.photos/id/237/200/300",
        coordinates:[71.14442310371734, 15.83432311133646]
    },
    {
        id:1,
        name:"Dhropar",
        scientific_name:"Canarium strictum",
        ecoregion:"Deccan thorn scrub forests",
        image:"https://picsum.photos/id/233/200/300",
        coordinates:[72.14442310371734, 17.83432311133646]
    },
    {
        id:2,
        name:"Dhopa",
        scientific_name:"Canarium strictum",
        ecoregion:"Khathiar-Gir dry deciduous forests",
        image:"https://picsum.photos/id/235/200/300",
        coordinates:[73.14442310371734, 15.83432311133646]
    },
    {
        id:3,
        name:"Dhoopara",
        scientific_name:"Canarium strictum",
        ecoregion:"Khathiar-Gir dry deciduous forests",
        image:"https://picsum.photos/id/203/200/300",
        coordinates:[78.14442310371734, 17.03432311133646]
    },
];


class KeySpeciesItem {
    constructor(keySpecies) {
        this.keySpecies = keySpecies;
    }

    setItems(items) {
        this.publications = items;
    }

    renderItemsToMap() {}
    fireEventListeners() {}
    loadListItems() {
        let speciesContainer = document.getElementById("species-list");
        let content = "";
    
        this.keySpecies.forEach(spec => {
            let className = spec.id == 0 ? 'species-item active' : 'species-item';
    
            content += `<div class="${className}" id="${spec.id}" >
                <img src="${spec.image}" alt="${spec.name}" />
            </div>`;
    
        });
    
        speciesContainer.innerHTML = content;
    }
}
// function renderSpeciesToMap(projects) {
//     let markers = projects.map(createSpeciesMarker);
//     return markers;
// }

// function createSpeciesMarker(project) {
//     // popup content
//     let popupContent = getContent(project);
//     let popup = new mapboxgl.Popup()
//         .setHTML(popupContent);

//     // marker
//     let divMarker = customMarkerIcon('species');
//     let marker = new mapboxgl.Marker({element:divMarker})
//         .setLngLat(project.coordinates)
//         .setPopup(popup)
//         // .addTo(map);

//     return marker;
// }


// function getContent(species) {
//     // <div class="carousel-container"></div>

//     return `<div class="popup-content">
//         <img src="${species.image}" alt="">
//         <div class="popup-body">
//             <div class="bold title">${species.name}</div>
//             <div class="">
//                 <i>
//                     ${species.scientific_name}
//                 </i>
//             </div>            
//         </div>
//     </div>`
// }

// function renderActiveItem(species) {
//     let activeContainer = document.getElementById("active-species");

//     activeContainer.innerHTML = `<div class="bold">${species.name}</div>
//         <div>
//             <i>${species.scientific_name}</i>
//         </div>`;
// }


// loadSpeciesList(keySpecies);
// // let speciesMarker = renderSpeciesToMap(keySpecies);


// // update list interactivity
// function handleMapList() {
//     let items = document.querySelectorAll(".species-item");
//     let activeItem = document.querySelector(".species-item.active")

//     items.forEach(item => {
//         item.onclick = function(e) {
//             let { id } = e.target;

//             console.log(id);

//             let kSpecies =  keySpecies.find(item => item.id == id);
//             renderActiveItem(kSpecies);

//             if(e.target !== activeItem) {
//                 activeItem.classList.toggle("active");
//                 e.target.classList.toggle("active");

//                 toggleMarkerId(id);
//             }

//             activeItem = e.target
            
           
//         }
//     });
// }

// function toggleMarkerId(id) {
//     speciesMarker.forEach((marker, index) => {
//         let popup = marker.getPopup();

//         if(index != id) {
//             popup.remove();
//         } else {
//             marker.togglePopup();
//         }
//     });
// }


// handleMapList();


// don't tag key species