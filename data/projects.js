let projects = [
    {
        id:0,
        images:[
            'https://picsum.photos/id/232/200/300', 'https://picsum.photos/200/300', 
            'https://picsum.photos/200/300', 'https://picsum.photos/200/300'
        ],
        name:"Reviving the rainforest",
        address:"Valprai, Tamil Nadu",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[75.14442310371734, 17.83432311133646]
    },

    {
        id:1,
        images:[
            'https://picsum.photos/id/231/200/300', 'https://picsum.photos/200/300', 
            'https://picsum.photos/200/300', 'https://picsum.photos/200/300'
        ],
        name:"Restoring Rao Jodha Park",
        address:"Jodhpur, Rajasthan",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[73.01543378456319, 26.277730889745722]
    },

    {
        id:2,
        images:[
            'https://picsum.photos/id/234/200/300', 'https://picsum.photos/200/300', 
            'https://picsum.photos/200/300', 'https://picsum.photos/200/300'
        ],
        name:"Kaas plateau",
        address:"Maharashtra",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[73.824155, 17.719368]
    },

    {
        id:3,
        images:[
            'https://picsum.photos/id/235/200/300', 'https://picsum.photos/200/300', 
            'https://picsum.photos/200/300', 'https://picsum.photos/200/300'
        ],
        name:"Bringing back the forest",
        address:"Tamil Nadu",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[79.317105, 11.270806]
    }
];

// zoom in/ click or hover

// Modular code
class ProjectItem {
    constructor(projects) {
        this.projects = projects;
        this.items = [];
    }

    loadItems() {
        d3.csv('/point_data/projects.csv')
        .then(data => {
            data = data.map(dt => {
                let coord = dt.era_resource_coordinates.split(",");
                dt.coordinates = coord.map(l => parseFloat(l));

                return dt;
            });

            console.log(
                [...new Set(data.map(l => l.post_category))]
            )

            this.items = [ ...data ];
        })
        .catch(console.error)

        return this;
    }

    setItems(items) {
        this.projects = items;
    }

    loadListItems() {
        let projectsContainer = document.getElementById("projects-list");
        let content = "";

        this.projects.forEach(project => {
            content += `<div class="card project-card" id="${project.id}" data-id="${project.id}">
                <img src="${project.featured_image}" alt="">
                <div class="fig-caption">
                    <div class="bold">${project.post_title}</div>
                    <div>${project.era_address}</div>
                </div>
            </div>`;
    
        });
    
        projectsContainer.innerHTML = content;
    }
    
    renderItemsToMap() {
        this.markers = this.projects.map(item => createMarker(item, this.getPopupContent, 'task'));
    }

    fireEventListeners() {
        this.cards = document.querySelectorAll(".project-card");
        console.log(this.cards);
    
        this.cards.forEach(card => {
            // card.onmouseover = (e) => this.handleCardEvents(e);
            card.onclick = (e) => this.handleCardEvents(e);
        });
    }

    handleCardEvents(e) {
        let { dataset: { id } } = e.target;

        this.markers.forEach((marker, index) => {
            let popup = marker.getPopup();
    
            if(marker.id != id) {
                popup.remove();
            } else {
                marker.togglePopup();

                // zoom to the feature
                let { lat, lng} = marker.getLngLat();
                lat = lat - 0.1
                map.flyTo({
                    center:{lat, lng},
                    zoom:10
                });

            }
        });
    }

    getPopupContent(project) {
        // <div class="carousel-container"></div>
    
        return `<div class="popup-content">
            <img src="${project.featured_image}" alt="">
            <div class="popup-body">
                <div class="bold title">${project.post_title}</div>
                <div class="">${project.address}</div>
    
                <div class="description">
                    ${project.post_content.substr(0, 100)} ...
                </div>
    
                <div class="btn-more bg-primary">KNOW MORE</div>
            </div>
        </div>`
    }
}

let projectInstance = new ProjectItem([]);

// factory functions
// creating marker
d3.csv('/point_data/projects.csv')
.then(data => {
    data = data.filter(l => l.post_title).map((dt, index) => {
        let coord = dt.era_project_coordinates.split(",");
        dt.coordinates = coord.map(l => parseFloat(l)).reverse();
        
        dt.id = `${index}-projects`;

        return dt;
    }).filter(pub => pub.coordinates[0] && pub.coordinates[1]);


    console.log(data);
    projectInstance.items = data;

})
.catch(console.error);
