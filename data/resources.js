let publications = [
    {
        id:0,
        images:'https://picsum.photos/id/235/200/300',
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
        name:"Video Article",
        address:"Valprai, Tamil Nadu",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[75.84442310371734, 17.83432311133646]
    },
    {
        id:1,
        images:'https://picsum.photos/id/230/200/300', 
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
        name:"Video Two",
        address:"Jodhpur, Rajasthan",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[73.31543378456319, 26.277730889745722]
    },

    {
        id:2,
        images: 'https://picsum.photos/200/300',
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
        name:"Video One",
        address:"Maharashtra",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[74.2824155, 17.719368]
    }
];

// let publicationsMarkers = renderPublicationToMap(publications);
// renderNuseryList(publications);

class PublicationItem {
    constructor(publications) {
        this.publications = publications;
        this.items = [];
    }

    setItems(items) {
        this.publications = items;
    }

    loadListItems() {
        let publicationContainer = document.getElementById("publications-section");
        let publicationContent = "";

        this.publications.forEach(publication => {

            publicationContent += `<div class="media-item" data-id="${publication.id}">
                <div class="img-section">
                    <img src="${publication.featured_image}" alt="${publication.id}" height="136px" />
                </div>
                <div class="media-body">
                    <div class="media-title">
                        <span class="">${publication.post_category}</span>
                    </div>

                    <div class="media-text">
                        ${publication.post_title}
                    </div>
                </div>
            </div>`;
        });

        publicationContainer.innerHTML = publicationContent;
    }
    
    renderItemsToMap() {
        this.markers = this.publications.map(item => createMarker(item, this.getPopupContent, 'publication'));
    }

    fireEventListeners() {
        this.cards = document.querySelectorAll(".media-item");
    
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
                popup.isOpen() ? "": marker.togglePopup();

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

    getPopupContent(publication) {
        // <div class="carousel-container"></div>
    
        return `<div class="popup-content">
            <img src="${publication.featured_image}" alt="">
            <div class="popup-body">
                <div class="bold title">${publication.Project}</div>
                <div class="">${publication.era_resource_state}</div>
    
                <div class="description">
                    ${publication.post_content.substr(0, 100)} ...
                </div>
    
                <div class="btn-more bg-primary">KNOW MORE</div>
            </div>
        </div>`;
    }
}

let publicationInstance = new PublicationItem([]);

// Videos section
let videos = [
    {
        id:0,
        images:'https://picsum.photos/id/235/200/300',
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
        name:"Journal Article",
        address:"Valprai, Tamil Nadu",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[75.14442310371734, 17.83432311133646]
    },
    {
        id:1,
        images:'https://picsum.photos/id/230/200/300', 
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
        name:"Report",
        address:"Jodhpur, Rajasthan",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[74.01543378456319, 24.277730889745722]
    },

    {
        id:2,
        images: 'https://picsum.photos/200/300',
        video:'https://ak.picdn.net/shutterstock/videos/1080319025/preview/stock-footage-abstract-tech-earth-globalization-in-d-motion-graphic-concept-transmit-ai-networking-on-fiber.webm',
        name:"Popular Article",
        address:"Maharashtra",
        description:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ",
        coordinates:[75.824155, 17.719368]
    }
];

class VideoItem {
    constructor(videos) {
        this.videos = videos;
        this.items = [];
    }

    setItems(items) {
        this.videos = items;
    }

    loadListItems() {
        let videosContainer = document.getElementById("videos-section");
        let content = "";

        this.videos.forEach(video => {
            content += `<div class="video-section" data-id="${video.id}">
                <div class="video">
                    <video controls="true">
                        <source src="${video.era_video_link}" type="video/mp4" />
                    </video>
                </div>
                <div class="video-caption">
                    ${video.title}
                </div>
            </div>`;
        });

        videosContainer.innerHTML = content;
    }
    
    renderItemsToMap() {
        this.markers = this.videos.map(item => createMarker(item, this.getPopupContent, 'video'));
    }

    fireEventListeners() {
        this.cards = document.querySelectorAll(".video-section");
    
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
                popup.isOpen() ? "": marker.togglePopup();

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

    getPopupContent(video) {
        // <div class="carousel-container"></div>
    
        return `<div class="popup-content">
            <img src="${video.featured_image}" alt="">
            <div class="popup-body">
                <div class="bold title">${video.title}</div>
                <div class="">${video.era_resource_state}</div>
    
                <div class="description">
                    ${video.post_content.substr(0, 100)} ...
                </div>
    
                <div class="btn-more bg-primary">KNOW MORE</div>
            </div>
        </div>`
    }
}

let videoInstance = new VideoItem([]);

// Nurseries Section
let nurseries = [
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Iyerpadi nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        ecoregion:"Deccan thorn scrub forests",
        coordinates:[73.14442310371734, 16.83432311133646]
    },
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Parambikulam nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        ecoregion:"Central Deccan Plateau dry deciduous forests",
        coordinates:[76.14442310371734, 16.53432311133646]
    },
    {
        images:'https://picsum.photos/id/232/200/300',
        name:"Topslip nursery",
        address:"Iyerpadi S.O, Coimbatore, Tamil Nadu, India (IN), Pin Code:-64210",
        website:"",
        contact_no:"",
        ecoregion:"Deccan thorn scrub forests",
        coordinates:[75.14442310371734, 16.33432311133646]
    },
];

// nursery
class NurseryItem {
    constructor(nurseries) {
        this.nurseries = nurseries;
        this.items = [];
    }

    setItems(items) {
        this.nurseries = items;
    }

    renderItemsToMap() {}
    fireEventListeners() {}

    loadListItems() {
        console.log("Rendering Nursery");

        let nurseyContainer = document.getElementById("nurseries-section");
        let nurseryContent = "";

        this.nurseries.forEach(nursery => {
            nurseryContent += `<div class="nursery-section">
                <div class="title bold">${nursery.name}</div>
                <div class="nursery-body">
                    <span class="bold">Address</span>: ${nursery.address} </br>
                    <span class="bold">Website: ${nursery.website}</span> </br>
                    <span class="bold">Contact no: ${nursery.contact_no}</span> </br>
                </div>
            </div>`;
        });

        // console.log(this.nurseries);
        nurseyContainer.innerHTML = nurseryContent;
    }
}


d3.csv('/point_data/resources.csv')
.then(data => {
    data = data.map((dt, index) => {
        let coord = dt.era_resource_coordinates.split(",");
        dt.coordinates = coord.map(l => parseFloat(l)).reverse();
        
        dt.id = `${index}-publication`;

        return dt;
    });

    // console.log([... new Set(data.map(l => l.post_category))]);            
    let publications = data.filter(entry => entry.post_category != 'Video').filter(pub => pub.coordinates[0]);
    
    // videos Webinars
    let videos = data.filter(entry => entry.post_category == 'Video');
    // let nurseries = data.filter(entry => entry.)

    // update the 
    publicationInstance.items = publications;
    videoInstance.items = videos;

})
.catch(console.error);


// function renderNuseryList(nurseries) {
    
// }

// function renderNurseryToMap(nurseries) {
//     let markers = nurseries.map(createNurseryMarker);
//     return markers;
// }

// function createNurseryMarker(nursery) {
//     // popup content
//     let content = popupContent(nursery);
//     let popup = new mapboxgl.Popup()
//         .setHTML(content);

//     // marker
//     let divMarker = customMarkerIcon('nursery');
//     let marker = new mapboxgl.Marker({element:divMarker})
//         .setLngLat(nursery.coordinates)
//         .setPopup(popup)
//         // .addTo(map);

//     return marker;
// }

// function popupContent(nursery) {
//     return `<div class="popup-content">
//         <div class="popup-body">
//             <div class="nursery-section">
//                 <div class="title bold">${nursery.name}</div>
//                 <div class="nursery-body">
//                     <span class="bold">Address</span>: ${nursery.address} </br>
//                     <span class="bold">Website: ${nursery.website}</span> </br>
//                     <span class="bold">Contact no: ${nursery.contact_no}</span> </br>
//                 </div>
//             </div>
//         </div>
//     </div>`
// }

// let nurseryMarkers = renderNurseryToMap(nurseries);
// renderNuseryList(nurseries);