function customMarkerIcon(icon) {
    let divMarker = document.createElement("div");
    divMarker.classList.add("div-marker");

    divMarker.innerHTML = `<img src='icons/${icon}.png'  alt="${icon}" />`;

    return divMarker;
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: { lng: 77.4736012705689, lat: 17.6986988113093 }, // starting position [lng, lat]
    zoom: 5 // starting zoom
});


map.on("load", function(e) {
    // add the watershed
    map.addSource("watershed", {
        type:'geojson',
        data:'data/watershed.geojson'
    });

    map.addLayer({
        id:'watershed',
        type:'fill',
        source:'watershed',
        paint:{
            'fill-color':'brown',
            'fill-opacity':0.6,
            'fill-outline-color':'#ddd'
        },
        layout:{
            'visibility':'none'
        }
    });

    // add the protected areas
    map.addSource("protected_areas", {
        type:'geojson',
        data:'data/protected_areas.geojson'
    });

    map.addLayer({
        id:'protected-areas',
        type:'fill',
        source:'protected_areas',
        paint:{
            'fill-color':'green',
            'fill-opacity':0.6,
            'fill-outline-color':'#ddd'
        },
        layout:{
            'visibility':'visible'
        }
    });

    // ecoregions
    // 

    // click event
    map.on("click", function(e) {
        console.log(
            Object.values(e.lngLat)
        );

    });

    toggleMapLayers();
});

// map layer toggler
function toggleMapLayers() {
    let layerButtons = document.querySelectorAll(".layer-toggler");
    let layerIds = ['watershed', 'protected-areas'];

    layerButtons.forEach(toggler => {
        toggler.onclick = function(e) {
            let { checked, id } = e.target;

            console.log(id);
            layerIds.forEach(layerId => {
                let visibilityStatus = layerId === id ? 'visible' : 'none';

                console.log(visibilityStatus);
                map.setLayoutProperty(layerId, 'visibility', visibilityStatus);
            });
            
        }

    });
}


// section toggler
function LayerGroupToggler(togglerClass, sectionClass) {
    this.init = function() {
        this.layerGroups = document.querySelectorAll(`${togglerClass}`);
        this.activeGroup = document.querySelector(`${togglerClass}.active`);
        this.activeSection = document.querySelector(`.${sectionClass}.active`);
        this.activeId = "ecoregion";

        this.fireClickListener();
    }

    this.fireClickListener = function() {
        this.layerGroups.forEach(element => {
            element.onclick = (e) => {
                let { id } = e.target;

                this.activeId = id;

                if(element != this.activeGroup) {
                    this.setActiveGroup(element);
                    this.toggleActiveSection(`${id}-section`);

                    // toggle different markers classes
                    id = id == 'resources' ? 'publication' : id;
                    toggleMarkers(markerTypes, id);
                }
                
            }

        });
    }

    this.setActiveGroup = function (group) {
        this.activeGroup.classList.remove('active');

        group.classList.add("active");
        this.activeGroup = group;
    }

    this.toggleActiveSection = function (id) {
        let element = document.getElementById(id);
        element.classList.add("active");

        this.activeSection.classList.remove("active");
        this.activeSection = element;
    }
}


let groupToggler = new LayerGroupToggler('.layer-groups .layer-group', 'section-layer');
groupToggler.init();

// toggle the 


// map layer toggler
let DropDown = function() {
    this.init = function() {
        this.dropDown = document.getElementById("dropdown");
        
        this.togglerBtn = document.getElementById("dropdown-toggler");
        this.togglerBtn.onclick = (e) => {
            this.toggleDropdown();
        };

        this.layerItems = document.querySelectorAll(".form-group .input");
        this.layerItems.onchange = (e) => {
            let { id } = e.target;

            this.toggleLayer(id);
        }
    }

    this.toggleDropdown = function() {
        this.dropDown.classList.toggle('d-none');
        this.togglerBtn.classList.toggle('active');
    }

    this.toggleLayer = function(layerId) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
    }
}

let dropDown = new DropDown();
dropDown.init();

// subsections togglers
let levelToggler = new LayerGroupToggler('.eco-section .header-item', 'levels-section');
levelToggler.init();


let resourceToggler = new LayerGroupToggler('.resources-section .header-item', 'resource-section');
resourceToggler.init();


// side bar toggle button 
let tabToggler = document.getElementById("tab-toggler");
let sideTab = document.querySelector(".side-tab");

tabToggler.onclick = function(e) {
    sideTab.classList.toggle("open");
}

// toggle different markers
{/* <div class="layer-group active" id="ecoregion">Ecoregion</div>
<div class="layer-group" id="projects">Projects</div>
<div class="layer-group" id="key-species">Key Species</div>
<div class="layer-group" id="resources">Resources</div> */}
function toggleMarkers(markerTypes, activeId) {
    console.log(activeId);

    markerTypes.forEach(type => {
        
        if(type.id !== activeId) {
            type.markers.forEach(marker => marker.remove())
        } else {
            type.markers.forEach(marker => marker.addTo(map))
            type.markers[0].togglePopup();
        }
    });
}
