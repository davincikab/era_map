const layerStatus = {
    "watershed":false,
    "protected-areas":false,
    "soils":false,
    "rainfallzones":false,
    "geology":false,
    "geomorpholgy":false
};

const layerStore = {
    activeEcoregion:'Central Deccan Plateau dry deciduous forests',
    activeResource:'publications',
    projects:{
        instance: new ProjectItem([]),
        items:projects
    },
    nurseries:{
        instance: new NurseryItem([]),
        items:nurseries
    },
    publications:{
        instance: new PublicationItem([]),
        items:publications
    },
    videos:{
        instance: new VideoItem([]),
        items:videos
    },
    'key-species':{
        instance: new KeySpeciesItem([]),
        items:keySpecies
    },
    pareas:{
        instance: new ProtectedAreasItem([]),
        items:protectedAreas
    },
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: { lng: 73.29879658306868, lat: 18.575687042687875 }, // starting position [lng, lat]
    zoom: 5 // starting zoom
});


map.on("load", function(e) {
    // add the ecoregions
    map.addSource("ecoregions", {
        type:'geojson',
        data:'data/india_46_ecoregions.geojson'
    });

    map.addLayer({
        id:'ecoregions',
        type:'fill',
        source:'ecoregions',
        paint:{
            'fill-color':['get', 'COLOR'],
            'fill-opacity':0.01,
            'fill-outline-color':'#000'
        },
        layout:{
            'visibility':'visible'
        }
    });

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
            'fill-color':'lightblue',
            'fill-opacity':0.1,
            'fill-outline-color':'blue'
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
            'visibility':'none'
        }
    });

    // soils layer
    map.addSource("soil", {
        type:'geojson',
        data:'data/india_soils_ibp.geojson'
    });

    map.addLayer({
        id:'soil',
        type:'fill',
        source:'soil',
        paint:{
            'fill-color':['get', 'color'],
            'fill-opacity':0.6,
            'fill-outline-color':'#ddd'
        },
        layout:{
            'visibility':'none'
        }
    });

    // Rainfall zones
    map.addSource("rainfall-zones", {
        type:'geojson',
        data:'data/india_rainfallzones_ibp.geojson'
    });

    map.addLayer({
        id:'rainfall-zones',
        type:'fill',
        source:'rainfall-zones',
        paint:{
            'fill-color':['get', 'color'],
            'fill-opacity':0.6,
            'fill-outline-color':'#ddd'
        },
        layout:{
            'visibility':'none'
        }
    });

    // Geology
    map.addSource("geology", {
        type:'geojson',
        data:'data/india_geology_ibp.geojson'
    });

    map.addLayer({
        id:'geology',
        type:'fill',
        source:'geology',
        paint:{
            'fill-color':['get', 'color'],
            'fill-opacity':0.6,
            'fill-outline-color':'#ddd'
        },
        layout:{
            'visibility':'none'
        }
    });

    // Geomorphology
    map.addSource("geomorphology", {
        type:'geojson',
        data:'data/india_geomorphology_ibp.geojson'
    });

    map.addLayer({
        id:'geomorphology',
        type:'fill',
        source:'geomorphology',
        paint:{
            'fill-color':['get', 'color'],
            'fill-opacity':0.6,
            'fill-outline-color':'#ddd'
        },
        layout:{
            'visibility':'none'
        }
    });

    // ecoregions click event
    map.on("click", 'ecoregions', function(e) {
        let activeEcoregion = e.features[0];
        if(activeEcoregion.properties.ECO_NAME == layerStore.ECO_NAME) {
            return;
        }

        // update ecoregion info
        updateEcoregionInfo(activeEcoregion);
        toggleActiveEcoregion(activeEcoregion.properties.ECO_NAME);
        fitMapToFeatureBounds(activeEcoregion);

        layerStore.activeEcoregion = activeEcoregion.properties.ECO_NAME;

        // filter the point data: projects, key species, publication, videos
        let filterKeys = [ 'projects', 'publications', 'videos', 'key-species', 'nurseries', 'pareas'];

        filterKeys.forEach(key => {
            let points, activePoints, pnts;

            if([ 'key-species', 'nurseries', 'pareas'].indexOf(key) != -1) {
                // filter by ecoregion name
                pnts = layerStore[key].items.filter(item => item.ecoregion == layerStore.activeEcoregion);
                console.log(`${key}: ${pnts}`);
                
            } else {
                points = createGeojson(layerStore[key].items);
                activePoints = turf.pointsWithinPolygon(points, activeEcoregion);
                pnts = activePoints.features.map(feature => feature.properties);
            }

            layerStore[key].instance.setItems(pnts);

            if(layerStore[key].instance.markers) {
                removeMarkers(layerStore[key].instance.markers);

                layerStore[key].instance.markers = [];
            }

            layerStore[key].instance.renderItemsToMap();
            layerStore[key].instance.loadListItems();
            layerStore[key].instance.fireEventListeners();

            console.log(pnts);
        });
        
        
    });

    map.on('mousemove', 'ecoregions', function(e) {
        map.getCanvas().style.cursor = "pointer";
        let region = e.features[0].properties;

        // add the opacity of the hovered feature
        map.setPaintProperty('ecoregions', 'fill-opacity', [
            'case',
            ['==', ['get', 'ECO_NAME'], `${layerStore.activeEcoregion}`],
            0.4,
            ['==', ['get', 'ECO_NAME'], `${region.ECO_NAME}`],
            0.1,
            0.01
        ]);
    });

    map.on('mouseleave', 'ecoregions', function(e) {
        map.getCanvas().style.cursor = "";
        // toggleActiveEcoregion(layerStore.activeEcoregion);
    });

    toggleMapLayers();
    toggleActiveEcoregion();
});

function toggleActiveEcoregion(regionName="Central Deccan Plateau dry deciduous forests") {
    // display the active ecoregion
    map.setPaintProperty('ecoregions', 'fill-opacity', [
        'case',
        ['==', ['get', 'ECO_NAME'], `${regionName}`],
        0.4,
        0.01
    ]);
}

function fitMapToFeatureBounds(feature) {
    let bbox = turf.bbox(feature);
    console.log(bbox);

    map.fitBounds(bbox, { padding:50 });
}

function updateEcoregionInfo(ecoregion) {
    let ecoregionElement = document.getElementById("ecoregion-info");

    ecoregionElement.innerHTML = `<h3 class="section-title">
        ${ecoregion.properties.ECO_NAME}
        </h3>

        <div class="text-white">
            Lorem ipsum dolor sit amet, consectetuer 
            adipiscing elit, sed diam nonummy nibh 
            euismod tincidunt ut laoreet dolore magna 
            aliquam erat volutpat. Ut wisi enim ad 
            minim veniam, quis nostrud exerci tation 
            ullamcorper suscipit lobortis nisl ut aliquip 
            ex ea commodo consequat. 

        <p></p>

            Duis autem vel eum iriure dolor in hendrerit 
            in vulputate velit esse molestie consequat, 
            vel illum dolore eu feugiat nulla facilisis at 
            vero eros et accumsan et iusto odio dignissim qui blandit praesent 
            luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
        </div>`
}

// map layer toggler
function toggleMapLayers() {
    let layerButtons = document.querySelectorAll(".layer-toggler");
    let layerIds = ['watershed', 'protected-areas', 'soil', 'rainfall-zones', 'geology', 'geomorphology'];

    layerButtons.forEach(toggler => {
        toggler.onclick = function(e) {
            e.stopPropagation();

            let { checked, id } = e.target;
            let visibilityStatus = checked ? 'visible' : 'none';

            if(id !== 'all-layers') {
                console.log(visibilityStatus);
                map.setLayoutProperty(id, 'visibility', visibilityStatus);

                return;
            }

            // hide all the layers
            layerIds.forEach(layerId => {
                console.log(layerId);

                let checkbox = document.getElementById(`${layerId}`);
                checkbox.checked = !checked;

                let visibilityStatus = !checked ? 'visible' : 'none'; 
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
                let { id, dataset } = e.target;

                this.activeId = id;

                if(element != this.activeGroup) {
                    this.setActiveGroup(element);
                    this.toggleActiveSection(`${id}-section`);

                    // toggle different markers classes
                    console.log("Toggler");

                    
                    if(dataset.target == 'resources') {
                        console.log(id);
                        layerStore.activeResource = id;
                    } 

                    id = id == 'resources' ? layerStore.activeResource : id;

                    toggleMarkers(layerStore, id);
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
    tabToggler.classList.toggle("open");
}

// toggle different markers
{/* <div class="layer-group active" id="ecoregion">Ecoregion</div>
<div class="layer-group" id="projects">Projects</div>
<div class="layer-group" id="key-species">Key Species</div>
<div class="layer-group" id="resources">Resources</div> */}
function toggleMarkers(layerStore, activeId) {
    console.log("Toggling Markers");
    console.log(activeId);

    let { instance } = layerStore[activeId];
    console.log(instance.markers);
    // console.log(instance.markers);

    let filterKeys = [ 'projects', 'publications', 'videos', 'key-species', 'nurseries', 'pareas'];

    filterKeys.forEach(key => {
        let markers = layerStore[key].instance.markers;

        if(!markers || !markers[0]) {
            return key;
        }

        if(key !== activeId) {
            markers.forEach(marker => marker.remove())
        } else {
            markers.forEach(marker => marker.addTo(map))
            markers[0].togglePopup();
        }
    });
}


function createGeojson(points) {
    let features = points.map(point => {
        return turf.point([...point.coordinates], {...point})
    });

    return turf.featureCollection(features);
}


// manage child headers


// layers
// Rainfall zones
// Geomorphology
// 
