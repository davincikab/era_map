let publications = [
    {
        images:'https://picsum.photos/id/235/200/300',
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
        name:"Journal Article",
        address:"Valprai, Tamil Nadu",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[75.14442310371734, 17.83432311133646]
    },
    {
        images:'https://picsum.photos/id/230/200/300', 
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
        name:"Report",
        address:"Jodhpur, Rajasthan",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[73.01543378456319, 26.277730889745722]
    },

    {
        images: 'https://picsum.photos/200/300',
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
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
    let markers = publications.map(createPublicationMarker);
    return markers;
}

function createPublicationMarker(publication) {
    // popup content
    // let popupContent = getPopupContent(project);
    // let popup = new mapboxgl.Popup()
    //     .setHTML(popupContent);

    // marker
    let divMarker = customMarkerIcon('publication');
    let marker = new mapboxgl.Marker({element:divMarker})
        .setLngLat(publication.coordinates)
        // .setPopup(popup)
        // .addTo(map);

    return marker;
}

let publicationsMarkers = renderPublicationToMap(publications);
renderNuseryList(publications);


// Nurseries Section
let nurseries = [
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Iyerpadi nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        coordinates:[73.14442310371734, 16.83432311133646]
    },
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Parambikulam nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        coordinates:[76.14442310371734, 16.53432311133646]
    },
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Topslip nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        coordinates:[75.14442310371734, 16.33432311133646]
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

function renderNurseryToMap(nurseries) {
    let markers = nurseries.map(createNurseryMarker);
    return markers;
}

function createNurseryMarker(project) {
    // popup content
    // let popupContent = getPopupContent(project);
    // let popup = new mapboxgl.Popup()
    //     .setHTML(popupContent);

    // marker
    let divMarker = customMarkerIcon('nursery');
    let marker = new mapboxgl.Marker({element:divMarker})
        .setLngLat(project.coordinates)
        // .setPopup(popup)
        // .addTo(map);

    return marker;
}

let nurseryMarkers = renderNurseryToMap(nurseries);
renderNuseryList(nurseries);



// Videos Section
function renderVideos(publications) {
    let videosContainer = document.getElementById("videos-section");
    let content = "";

    publications.forEach(publication => {
        content += `<div class="video-section">
            <div class="video">
                <video src="${publication.video}"></video>
            </div>
            <div class="video-caption">
                ${publication.name}
            </div>
        </div>`;
    });

    videosContainer.innerHTML = content;
}

renderVideos(publications);