let projects = [
    {
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

function loadProjectsList(projects) {
    let projectsContainer = document.getElementById("projects-list");
    let content = "";
    projects.forEach(project => {
        content += `<div class="card project-card" id="${project.name}">
            <img src="${project.images[0]}" alt="">
            <div class="fig-caption">
                <div class="bold">${project.name}</div>
                <div>${project.address}</div>
            </div>
        </div>`;

    });

    projectsContainer.innerHTML = content;
}

function renderProjectsToMap(projects) {
    let markers = projects.map(createMarker);
    return markers;
}

function createMarker(project) {
    // popup content
    let popupContent = getPopupContent(project);
    let popup = new mapboxgl.Popup()
        .setHTML(popupContent);

    // marker
    let marker = new mapboxgl.Marker()
        .setLngLat(project.coordinates)
        .setPopup(popup)
        .addTo(map);

    return marker;
}


function getPopupContent(project) {
    
    // <div class="carousel-container"></div>

    return `<div class="popup-content">
        <img src="${project.images[0]}" alt="">
        <div class="popup-body">
            <div class="bold title">${project.name}</div>
            <div class="">${project.address}</div>

            <div class="description">
                ${project.description}
            </div>

            <div class="btn-more bg-primary">KNOW MORE</div>
        </div>
    </div>`
}

let projectMarkers = loadProjectsList(projects);
renderProjectsToMap(projects);

// interactivity