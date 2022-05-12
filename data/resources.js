let publications = [
    {
        images:'https://picsum.photos/id/235/200/300',
        name:"Journal Article",
        address:"Valprai, Tamil Nadu",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[75.14442310371734, 17.83432311133646]
    },
    {
        images:'https://picsum.photos/id/230/200/300', 
        name:"Report",
        address:"Jodhpur, Rajasthan",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[73.01543378456319, 26.277730889745722]
    },

    {
        images: 'https://picsum.photos/200/300',
        name:"Popular Article",
        address:"Maharashtra",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[73.824155, 17.719368]
    }
];

function renderPublicationList(publications) {
    let publicationContainer = document.getElementById("publication-section");
    let publicationContent = "";

    publications.forEach(publication => {
        publicationContent += `<div class="media-item">
            <div class="img-section">
                <img src="${publication.images}" alt="${publication.name}" height="136px"/>
            </div>
            <div class="media-body">
                <div class="media-title">
                    <span class="">${publication.name}</span>
                </div>

                <div class="media-text">
                    ${publication.description}
                </div>
            </div>
        </div>`;
    });

    publicationContainer.innerHTML = publicationContent;
}


renderPublicationList(publications);


function renderPublicationToMap(publications) {
    let markers = publications.map(createNurseryMarker);
    return markers;
}

function createPublicationMap(publication) {
    // popup content
    // let popupContent = getPopupContent(project);
    // let popup = new mapboxgl.Popup()
    //     .setHTML(popupContent);

    // marker
    let marker = new mapboxgl.Marker()
        .setLngLat(publication.coordinates)
        // .setPopup(popup)
        .addTo(map);

    return marker;
}

let publicationsMarkers = renderNurseryToMap(publications);
renderNuseryList(publications);


// Nurseries Section
let nurseries = [
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Iyerpadi nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        coordinates:[75.14442310371734, 17.83432311133646]
    },
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Parambikulam nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        coordinates:[75.14442310371734, 17.83432311133646]
    },
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Topslip nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        coordinates:[75.14442310371734, 17.83432311133646]
    },
];


function renderNuseryList(nurseries) {
    let nurseyContainer = document.getElementById("nurseries-section");
    let nurseryContent = "";

    nurseries.forEach(nursery => {
        nurseryContent += `<div class="nursery-section">
            <div class="title bold">${nursery.name}</div>
            <div class="nursery-body">
                <span class="bold">Address</span>: ${nursery.address} </br>
                <span class="bold">Website: ${nursery.website}</span> </br>
                <span class="bold">Contact no: ${nursery.contact_no}</span> </br>
            </div>
        </div>`;
    });

    nurseyContainer.innerHTML = nurseryContent;
}

function renderNurseryToMap(projects) {
    let markers = projects.map(createNurseryMarker);
    return markers;
}

function createNurseryMarker(project) {
    // popup content
    // let popupContent = getPopupContent(project);
    // let popup = new mapboxgl.Popup()
    //     .setHTML(popupContent);

    // marker
    let marker = new mapboxgl.Marker()
        .setLngLat(project.coordinates)
        // .setPopup(popup)
        .addTo(map);

    return marker;
}

let nurseryMarkers = renderNurseryToMap(nurseries);
renderNuseryList(nurseries);