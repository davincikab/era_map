const bbox = [-180, -90, 180, 90];
const globalBoundary = turf.bboxPolygon(bbox);
const bFc = turf.featureCollection([globalBoundary]);
const spinnerContainer = document.getElementById("spinner-container");
const spinnerContainerSmall = document.getElementById("spinner-container-small");

// layers
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
    activeFeature:null,
    activeResource:'publications',
    projects:{
        instance: projectInstance,
        items:projects
    },
    nurseries:{
        instance: nurseryInstance,
        items:nurseries
    },
    publications:{
        instance: publicationInstance,
        items:publications
    },
    videos:{
        instance: videoInstance,
        items:videos
    },
    'key-species':{
        instance: speciesInstance,
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
    zoom: 5, // starting zoom,
    doubleClickZoom:false,
});

var dropPin = new mapboxgl.Marker();

// add navigation control
const navigationControl = new mapboxgl.NavigationControl();
map.addControl(navigationControl, 'bottom-right');

// geolocation
const geolocationControl = new mapboxgl.GeolocateControl({
    fitBoundsOptions:{ maxZoom:5 },
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: false,
    showAccuracyCircle:false,
    showUserLocation:false,
    showUserHeading: true
});

map.addControl(geolocationControl, 'top-left');

map.on("load", function(e) {
    console.log("Map is Loaded");

    geolocationControl.trigger();

    // add the ecoregions
     map.addSource("india_46_ecoregions", {
        type:'geojson',
        // data:'data/india_46_ecoregions.geojson'
        data:turf.featureCollection([])
    });

    map.addLayer({
        id:'ecoregions',
        type:'fill',
        source:'india_46_ecoregions',
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
        data:turf.featureCollection([])
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
        data:turf.featureCollection([])
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
    map.addSource("india_soils_ibp", {
        type:'geojson',
        data:turf.featureCollection([]),
        // data:'data/india_soils_ibp.geojson'
    });

    map.addLayer({
        id:'soil',
        type:'fill',
        source:'india_soils_ibp',
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
    map.addSource("india_rainfallzones_ibp", {
        type:'geojson',
        // data:'data/india_rainfallzones_ibp.geojson'
        data:turf.featureCollection([])
    });

    map.addLayer({
        id:'rainfall-zones',
        type:'fill',
        source:'india_rainfallzones_ibp',
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
    map.addSource("india_geology_ibp", {
        type:'geojson',
        // data:'data/india_geology_ibp.geojson'
        data:turf.featureCollection([])
    });

    map.addLayer({
        id:'geology',
        type:'fill',
        source:'india_geology_ibp',
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
    map.addSource("india_geomorphology_ibp", {
        type:'geojson',
        // data:'data/india_geomorphology_ibp.geojson'
        data:turf.featureCollection([])
    });

    map.addLayer({
        id:'geomorphology',
        type:'fill',
        source:'india_geomorphology_ibp',
        paint:{
            'fill-color':['get', 'color'],
            'fill-opacity':0.6,
            'fill-outline-color':'#ddd'
        },
        layout:{
            'visibility':'none'
        }
    });

    // mask layer
    map.addSource('mask', {
        type:'geojson',
        data:turf.featureCollection([])
    });

    map.addLayer({
        id:'layer-mask',
        source:'mask',
        type:'fill',
        paint:{
            'fill-color':'#222',
            'fill-opacity':1
        }
    });

    // ecoregions click event
    map.on("click", 'ecoregions', function(e) {
        let activeEcoregion = e.features[0];
        if(activeEcoregion.properties.ECO_NAME == layerStore.ECO_NAME) {
            return;
        } 

        handleEcoregionClick(activeEcoregion);     
        // display the click

        dropPin.remove();
        document.getElementById("park-list").innerHTML = "";
        document.getElementById("watershed-list").innerHTML = "";
    });

    map.on("dblclick", function(e) {
        spinnerContainerSmall.classList.remove('d-none');
        console.log("Double Click");

        // update the drop marker
        dropPin.setLngLat(e.lngLat).addTo(map);

        // update this
        updateWatershedList(
            Object.values(e.lngLat),
            layerStore.activeFeature
        );

        updateProtectedAreaList(layerStore.activeFeature, Object.values(e.lngLat));

    });

    map.on('close-popups', function() {
        console.log("Closing all popups");

        Object.keys(layerStore).slice(3,).forEach(key => {
            if(layerStore[key].instance.markers) {
                let popups = layerStore[key].instance.markers.map(marker => marker.getPopup());
                popups.forEach(popup => popup.remove());
            }
            

        });

    });

    map.on('mousemove', 'ecoregions', function(e) {
        map.getCanvas().style.cursor = "pointer";
        let region = e.features[0].properties;

        // add the opacity of the hovered feature
        map.setPaintProperty('ecoregions', 'fill-opacity', [
            'case',
            ['==', ['get', 'ECO_NAME'], `${layerStore.activeEcoregion}`],
            0.3,
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

    geolocationControl.on('geolocate', function(e) {
        map.setCenter({ lng: 73.29879658306868, lat: 18.575687042687875 });

        // find the ecoregion on the given coordinate;
        let { latitude, longitude } = e.coords;
        let coords = [longitude, latitude];

        dropPin.setLngLat(coords).addTo(map);

        console.log("User Location");

        console.log({ latitude, longitude });
        let timer = setInterval(function(e) {
            timerFunction(e);
        }, 1000);

        function timerFunction(e) {
            console.log("Running timer function");

            if(dataLayerInstance.layers[0]) {
                let data = dataLayerInstance.layers.find(layer => layer.name == 'india_46_ecoregions');
                map.getSource('india_46_ecoregions').setData(data);

                console.log("Layer loaded");
                // let coords =   [75.75879000084299, 18.83615708106636];
                
                let feature = dataLayerInstance.getEcoregionOn(coords);
                console.log(feature);

                window.clearInterval(timer);

                if(feature) {
                    layerStore.activeFeature = feature;
                    handleEcoregionClick(layerStore.activeFeature);
                    updateWatershedList(
                        coords,
                        layerStore.activeFeature
                    );
            
                    updateProtectedAreaList(layerStore.activeFeature, coords);
                } else {
                    let activeEcoregion = dataLayerInstance.getDefaultEcoregion();
                    layerStore.activeFeature = {...activeEcoregion};
                    handleEcoregionClick(layerStore.activeFeature);
                }

                                
            }
        }

        
    });

    geolocationControl.on('error', function(e) {
        console.log("Denied");
        handleDefaults();
    });

    // if(!layerStore.activeFeature) {
    //     handleDefaults();
    // }

    // update the 
    // let data = dataLayerInstance.layers.find(layer => layer.name == 'india_46_ecoregions');
    // map.getSource('india_46_ecoregions').setData(data);
});

function handleDefaults() {
    let timer = setInterval(() => {
        getData();
    }, 1000);

    function getData() {
        if(dataLayerInstance.layers[0]) {
            let activeEcoregion = dataLayerInstance.getDefaultEcoregion();
            layerStore.activeFeature = dataLayerInstance.getDefaultEcoregion();
            handleEcoregionClick(activeEcoregion);

            clearInterval(timer);
        }
    }
}

function handleEcoregionClick(activeEcoregion) {
    // getFeatureMaskLayer(activeEcoregion);

    // update ecoregion info
    updateEcoregionInfo(activeEcoregion);
    toggleActiveEcoregion(activeEcoregion.properties.ECO_NAME);
    fitMapToFeatureBounds(activeEcoregion);

    layerStore.activeEcoregion = activeEcoregion.properties.ECO_NAME;
    layerStore.activeFeature = activeEcoregion;

    // filter the point data: projects, key species, publication, videos
    handleLayerMarkers(layerStore, activeEcoregion);
    let activeGroup = document.querySelector(".side-tab .layer-group.active");
    console.log(activeGroup);

    if(activeGroup && activeGroup.id == 'resources') {
        activeGroup = document.getElementById(layerStore.activeResource);
    }

    activeGroup.click();

    // clip the layers
    let sourceIds = [ 
        'watershed', 'protected_areas', 'india_soils_ibp', 
        'india_rainfallzones_ibp', 
        'india_geology_ibp', 'india_geomorphology_ibp'
    ];

    console.log("Clipping the layers");
    sourceIds.forEach(layerId => {
        dataLayerInstance.clipLayer(
            layerId, 
            layerStore.activeFeature, 
            layerStore.activeEcoregion
        );
    });

    // timerFunction();
}

function handleLayerMarkers(layerStore, activeEcoregion) {
    let filterKeys = [ 'projects', 'publications', 'videos', 'key-species', 'nurseries', 'pareas'];

    filterKeys.forEach(key => {
        let points, activePoints, pnts;
        // if(key == 'nurseries') {
            pnts = layerStore[key].instance.items.filter(item => {
                let ecoName = layerStore.activeEcoregion.toLowerCase();
                let ecoregions = item.ecoregion.trim().split(",").map(lt => lt.toLowerCase().trim());

                if(ecoregions.indexOf(ecoName) !== -1) {
                    // console.log(ecoregions);
                    // console.log(key, ':', ecoName);

                    return true;
                }

                return false;
            });
        // } else if([ 'key-species', 'nurseries', 'pareas'].indexOf(key) != -1) {
        //     // filter by ecoregion name
        //     pnts = layerStore[key].instance.items.filter(item => item.ecoregion.toLowerCase() == layerStore.activeEcoregion.toLowerCase());
            

        // } else {
            // points = createGeojson(layerStore[key].instance.items);

            // activePoints = turf.pointsWithinPolygon(points, activeEcoregion);
            // pnts = activePoints.features.map(feature => feature.properties);

            // pnts = layerStore[key].instance.items.filter(item => item.ecoregion.toLowerCase() == layerStore.activeEcoregion.toLowerCase());
            // clip the layers
        // }

        layerStore[key].instance.setItems(pnts);

        if(layerStore[key].instance.markers) {
            removeMarkers(layerStore[key].instance.markers);

            layerStore[key].instance.markers = [];
        }

        layerStore[key].instance.renderItemsToMap();
        layerStore[key].instance.loadListItems();
        layerStore[key].instance.fireEventListeners();
    });
}

function toggleActiveEcoregion(regionName="Central Deccan Plateau dry deciduous forests") {
    console.log("Region", regionName);
    // display the active ecoregion
    map.setPaintProperty('ecoregions', 'fill-opacity', [
        'case',
        ['==', ['get', 'ECO_NAME'], `${regionName}`],
        0.3,
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
    let ecoInfo = ecoregion.properties;

    console.log("Eco", ecoregion);

    ecoregionElement.innerHTML = `<h3 class="section-title">
        ${ecoInfo['Name of the ecoregion']}
        </h3>

        <p class="text-white">${ecoInfo['To come under the title']}</p>
        <div class="text-white">
            ${ecoInfo['Write up']}
        </div>

        <a href="${ecoInfo['Know more link']}" class="btn-more" target="_blank">KNOW MORE</a>
        `
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

                // layer ids
                layerIds.forEach(layerId => {
                    if(layerId != id) {
                        let checkbox = document.getElementById(`${layerId}`);
                        checkbox.checked = false;
                        toggleCollapseSection(layerId, false);
                        map.setLayoutProperty(layerId, 'visibility', 'none');
                    }
                });

                map.setLayoutProperty(id, 'visibility', visibilityStatus);
                toggleCollapseSection(id, checked);

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
                } else {
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
function toggleMarkers(layerStore, activeId) {
    if(!layerStore[activeId]) {
        return;
    }

    console.log(activeId);

    let { instance } = layerStore[activeId];
    let filterKeys = [ 'projects', 'publications', 'videos', 'key-species', 'nurseries', 'pareas'];

    filterKeys.forEach(key => {
        let markers = layerStore[key].instance.markers;

        if(!markers || !markers[0]) {
            return key;
        }

        if(key !== activeId) {
            markers.forEach(marker => marker.remove())
        } else {
            console.log("Nurseries");

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

function getFeatureMaskLayer(feature) {
    let mask = turf.difference(bFc.features[0], feature);
    console.log(mask);

    // update the mask data source
    // map.getSource('mask').setData(mask);
}

// load all the data layers
let layers = [
    {
        id:'ecoregions',
        source:'/data/india_46_ecoregions.pbf'
    },
    {
        id:'watershed',
        source:'/data/watershed.pbf'
    },
    {
        id:'protected_areas',
        source:'/data/protected_areas.pbf'
    },
    {
        id:'soil',
        source:'/data/india_soils_ibp.pbf'
    },
    {
        id:'rainfallzones',
        source:'/data/india_rainfallzones_ibp.pbf'
    },
    {
        id:'geology',
        source:'/data/india_geology_ibp.pbf'
    },
    {
        id:'geomorphology',
        source:'/data/india_geomorphology_ibp.pbf'
    }
];

// data layers
const DataLayers = function(layers, map) {
    this.layers = layers;
    this.map = map;
    this.ecoregionClips = {
        'econame':{layerId:''}
    };

    this.setLayers = function(layers) {
        this.layers = layers;
    }

    this.getLayers = function() {
        return this.layers;
    }

    this.getLayerWithId = function(layerId) {
        return this.layers.features.find(layer => layer.name == layerId)
    }


    this.updateMapDataLayer = function() {
        this.layers.forEach(layer => {
            let { name } = layer;

            if(map.getSource(name)) {
                console.log(name);
            }
        });
    }

    // this function is slow.
    this.clipLayer = function(layerId, clipFeature, ecoName) {
        let targetLayer = this.layers.find(layer => layer.name == layerId);
        let features = targetLayer.features.filter(feature => feature.properties.ECO_NAME == ecoName);

        this.updateSourceWithId(layerId, turf.featureCollection(features));

        // update protected areas
        // if(layerId == 'watershed') {
        //     updateProtectedAreaList(clipFeature);
        // }
    }

    this.getEcoregionOn = function(coords) {
        let ecoregions = this.layers.find(layer => layer.name == 'india_46_ecoregions');

        let point = turf.point([...coords]);
        let ecoregionFeature = ecoregions.features.find(feature => {
            let isWithin = turf.booleanWithin(point, feature);

            if(isWithin) {
                return true;
            }

            return false;
        });
        return ecoregionFeature;
    }

    this.getDefaultEcoregion = function() {

        return this.layers.find(layer => layer.name == 'india_46_ecoregions').features.find(feature => {
            if(feature.properties.ECO_NAME == 'Central Deccan Plateau dry deciduous forests') {
                return feature;
            }

            return false;
        });
    }

    this.updateSourceWithId = function(layerId, geojson) {
        map.getSource(layerId).setData(geojson);
    }

    this.updateLegendSection = function () {
        this.layers.forEach(layer => {
            let colorsGroups = this.getClassColors(layer);

            if(layer.name.includes('ecoregions')) {
                return layer;
            }

            let collapseSection = document.getElementById(`${layer.name}`);

            collapseSection.innerHTML = colorsGroups.map(group => {
                return `<div class="legend-item">
                    <div class="color-bar" style="background-color:${group.color};"></div>
                    <div class="text-div"> ${group.name} </div>
                </div>`
            }).join("");

        });

    }

    this.getClassColors = function(layer) {
        let group;

        switch(layer.name) {
            case 'watershed':
                return [{name:'Watershed', color:'blue'}];
                
            case 'protected_area':
                return [{name:'Protected Area', color:'green'}];
            
            case'india_soils_ibp':
                group = layer.features.map(feature => {
                    return { 
                        name:feature.properties.major_type, 
                        color:feature.properties.color
                    }
                });

                group = reduceGroup(group);
                return group;

            case 'india_rainfallzones_ibp':
                group = layer.features.map(feature => {
                    let min = feature.properties.rain_range.split("-")[0];
                    min = parseInt(min);

                    return { 
                        name:feature.properties.rain_range, 
                        color:feature.properties.color,
                        min:min
                    }
                });

                group.sort((a, b) => a.min - b.min);

                group = reduceGroup(group);
                return group;  

            case 'india_geology_ibp':
                group = layer.features.map(feature => {
                    return { 
                        name:feature.properties.lithology, 
                        color:feature.properties.color
                    }
                });

                group = reduceGroup(group);
                return group; 

            case 'india_geomorphology_ibp':
                group = layer.features.map(feature => {
                    return { 
                        name:feature.properties.descriptio, 
                        color:feature.properties.color
                    }
                });

                group = reduceGroup(group);
                return group; 

            default:
                return [];
        }

        function reduceGroup(items) {
            return items.reduce((a, b) => {
                let item = a.find(ib => ib.name == b.name);

                if(!item) {
                    a.push(b);
                }

                return a;
            }, []);
        }
    }

}


let dataLayerInstance = new DataLayers([], map);


let requests = layers.map(layer => fetch(layer.source));

Promise.all(requests)
.then(responses => {
      // all responses are resolved successfully
    for(let response of responses) {
        // alert(`${response.url}: ${response.status}`); // shows 200 for every url
    }

    return responses;
})
.then(responses => {
    console.log("Responses to JSON");

    return Promise.all(responses.map(r => r.arrayBuffer()))
})
.then(layers => {
    console.log(layers);
    layers = layers.map(layer => {
        return geobuf.decode(new Pbf(layer));
    })

    // add the data to Layers objects
    dataLayerInstance.setLayers(layers);
    dataLayerInstance.updateMapDataLayer();
    dataLayerInstance.updateLegendSection();


    let ecoregions = layers.find(layer  => layer.name == 'india_46_ecoregions');
    return d3.csv('/point_data/ecoregions.csv').then(info => {
        return {data:ecoregions, info };
    });

}).then(({data, info}) => {
    // combine both datasets
    data.features = data.features.map(feature => {
        let infoObj = info.find(eco => {
            if(eco['Name of the ecoregion'].toLowerCase() == feature.properties.ECO_NAME.toLowerCase()) {
                return true;
            }
            return false;
        }) || {};

        feature.properties = {...feature.properties, ...infoObj}
        return feature;
    });

    console.log(data);

    setTimeout(() => {
        // if(map.getSource('india_46_ecoregions')) {
        //     map.getSource('india_46_ecoregions').setData(data);
        // }

        // handleDefaults();
        spinnerContainer.classList.add('d-none');
    }, 2000);
})
.catch(console.error); 


// toggler the dataLayer Toggler
let toggleBtn = document.getElementById("layer-toggler-btn");
let dataTab = document.getElementById("data-toggler");

toggleBtn.onclick = function(e) {
    e.stopPropagation();

    dataTab.classList.toggle('d-none');
}

// Drag the legend container
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("dropdown-toggler")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById("dropdown-toggler").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
}

dragElement(
    document.getElementById("data-toggler")
);

// worker instance
// var myWorker = new Worker('worker.js');
// myWorker.onmessage = function(oEvent) {
//   console.log(oEvent.data);
// };

// myWorker.onerror = function(error) {
//     console.log(error);
// };

// let options = {
//     feature:{},
//     coordinates:[0, 0]
// };

// myWorker.postMessage(options);


// toggle legend collapse section
let collapseTogglers = document.querySelectorAll(".dropdown .form-group");
function toggleCollapseSection(id, status) {
    let section = document.querySelector(`.collapse-section.${id}`);
    if (!status) {
        section.style.display = "none";
    } else {
        section.style.display = "block";
    }
}

function updateWatershedList(coordinates, activeFeature) {
    let items = JSON.parse(
        JSON.stringify(dataLayerInstance.layers.find(l => l.name == 'watershed'))
    );

    console.log(items);

    items.features = items.features.filter(ft => ft.properties.ECO_NAME == activeFeature.properties.ECO_NAME);
    let point = turf.point([...coordinates]);

    let basinsOnPoint = items.features.find(ft => turf.booleanPointInPolygon(point, ft));
    let basins = basinsOnPoint ? [basinsOnPoint] : [];

    console.log(basins);

    // update container
    let watershedContainer = document.getElementById("watershed-list");
    let content = basins.map(item => {
        return `<div>${item.properties.Sub_Basin}</div>`;
    }).join("");

    watershedContainer.innerHTML = content;

    spinnerContainerSmall.classList.add('d-none');
}

function updateProtectedAreaList(activeFeature, coord=[77.8119, 18.7472]) {
    // display the five closest protected areas
    let pareas = JSON.parse(
        JSON.stringify(dataLayerInstance.layers.find(l => l.name == 'protected_areas'))
    );

    pareas.features = pareas.features.filter(ft => ft.properties.ECO_NAME == activeFeature.properties.ECO_NAME);
    console.log(pareas);

    let points = pareas.features.map(feature => turf.centroid(feature, {properties:feature.properties}));
    let from = turf.point(coord);
    points = points.map(pnt => {
        let distance = turf.distance(pnt, from);

        return {name:`${pnt.properties.NAME} ${pnt.properties.DESIG_ENG}`, distance}
    });

    points.sort((a, b) => b.distance - a.distance);
    console.log(points);

    // find the pareas close to the clicked point
    let areas = points.slice(0, 5);
    let pAreaContainer = document.getElementById("park-list");

    let content = areas.map(item => {
        return `<div>${item.name}</div>`;
    }).join("");

    pAreaContainer.innerHTML = content;
}



// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});


// iterate
// function computeBounds() {
//     // [55.33333, 11.15833]
//     // [68.43959, 24.13676]

//     let [x0, y0] = [11.15833,55.3333];

//     let bounds = [];

//     for (let i = 0; i < 15; i+=0.25) {
//         let minX = x0 + i;
//         let maxX = minX + 0.25;
//         // bounds.push([minX, maxX]);

//         for (let j = 0; j < 13; j+=0.25) { 
//             console.log(j * i);
//             let minY = y0 + j;
//             let maxY = minY + 0.25;

//             minY = parseFloat(minY.toFixed(5));
//             maxY = parseFloat(maxY.toFixed(5));

//             bounds.push([[minY, minX], [maxY, maxX]]);
//         }        
//     }

//     return bounds;
// }

// let bds = computeBounds();
// let features = [];
// console.log(bds);


// function iterate() {
//     let i = 0;
//     let interval = setInterval(() => {
//         updateFeatures();
//     }, 5000);

//     function updateFeatures() {
//         console.log(bds[i]);

//         if(i < bds.length) {
//             let fts = mapjson.toGeoJSON().features;
//            fts.map(feature => {
//                 let isAdded = features.find(t => t.properties.name == feature.properties.name);

//                 if(!isAdded) {
//                     features.push(feature)
//                 }
//            });

//             mymap.flyToBounds(bds[i]);
//             i++;
//         } else {
//             console.log("Complete");
//             clearInterval(interval)
//         }
       
//     }
// }

// iterate();