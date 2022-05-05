mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: { lng: 77.4736012705689, lat: 17.6986988113093 }, // starting position [lng, lat]
    zoom: 5 // starting zoom
});


// section toggler
function LayerGroupToggler() {
    this.init = function() {
        this.layerGroups = document.querySelectorAll(".layer-group");
        this.activeGroup = document.querySelector(".layer-group.active");
        this.activeSection = document.querySelector(".section-layer.active");

        this.fireClickListener();
    }

    this.fireClickListener = function() {
        this.layerGroups.forEach(element => {
            element.onclick = (e) => {
                let { id } = e.target;

                this.setActiveGroup(element);
                this.toggleActiveSection(`${id}-section`);
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


let groupToggler = new LayerGroupToggler();
groupToggler.init();


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
    }

    this.toggleLayer = function(layerId) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
    }
}

let dropDown = new DropDown();
dropDown.init();