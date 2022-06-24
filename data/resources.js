// let publicationsMarkers = renderPublicationToMap(publications);
class PublicationItem extends ItemModule {
    constructor(publications) {
        super(publications, 'publication');
        this.publications = publications;
    }

    setItems(items) {
        this.publications = items;
    }

    loadListItems() {
        let publicationContainer = document.getElementById("publications-section");
        let publicationContent = "";

        if(!this.publications[0]) {
            publicationContainer.innerHTML = `<div class="text-section">
                We're currently working on curating a publications for this ecoregion. 
                Mail us at <a href="mailto:hello@era-india.org">hello@era-india.org</a> to contribute to this list.
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScS993yItCLnVD-wexZIhrT9RSLIYorGWQ3Z2-nYBKMBcxtyg/viewform" class="btn-more bg-primary" target="_blank">ADD RESOURCE</a>
            </div>`
            return;
        }

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
        console.log("rendering Publications");

        this.markers = this.publications.map(item => createMarker(item, this.getPopupContent, 'publication'));
    }

    fireEventListeners() {
        this.cards = document.querySelectorAll(".media-item");
    
        this.cards.forEach(card => {
            // card.onmouseover = (e) => this.handleCardEvents(e);
            card.onclick = (e) => this.handleCardEvents(e);
        });
    }

    getPopupContent(publication) {
        // <div class="carousel-container"></div>
        let link = publication.post_name ? `https://era-india.org/resources/${publication.post_name}` : (publication.era_resource_external_link || publication.era_publication_file);

        return `<div class="popup-content">
            <img src="${publication.featured_image}" alt="">
            <div class="popup-body">
                <div class="bold title">${publication.post_title}</div>
                <div class="">${publication.era_resource_state}</div>
    
                <div class="description">
                    
                </div>
    
                <a href="${link}" class="btn-more bg-primary" target="_blank">KNOW MORE</a>
            </div>
        </div>`;
    }
}

let publicationInstance = new PublicationItem([]);

// Videos section
class VideoItem extends ItemModule {
    constructor(videos) {
        super([], 'video');

        this.videos = videos;
        this.items = [];
    }

    setItems(items) {
        this.videos = items;
    }

    loadListItems() {
        let videosContainer = document.getElementById("videos-section");
        let content = "";

        if(!this.videos[0]) {
            videosContainer.innerHTML = `<div class="text-section">
                We're currently working on curating a videos list for this ecoregion. 
                Mail us at <a href="mailto:hello@era-india.org">hello@era-india.org</a> to contribute to this list.
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScS993yItCLnVD-wexZIhrT9RSLIYorGWQ3Z2-nYBKMBcxtyg/viewform" class="btn-more bg-primary" target="_blank">ADD RESOURCE</a>
            </div>`
            return;
        }
        
        this.videos.forEach(video => {
            let videoId = video.era_video_link.split("/").slice(-1,)[0].split("?v=").slice(-1,)[0];
            videoId = videoId.replace(/&t=.+/g, "");
            console.log(videoId);
            //  <iframe width="300" height="150" src="http://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            // <video controls="true">
            //     <source src="http://www.youtube.com/watch?v=${videoId}" type="video/mp4" />
            // </video>

            content += `<div class="video-section" data-id="${video.id}">
                <div class="video">
                    <iframe width="300" height="150" src="http://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
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
            card.onmouseover = (e) => this.handleCardEvents(e);
            card.onclick = (e) => this.handleCardEvents(e);
        });
    }

    getPopupContent(video) {
        return `<div class="popup-content">
            <img src="${video.featured_image}" alt="">
            <div class="popup-body">
                <div class="bold title">${video.title}</div>
                <div class="">${video.era_resource_state}</div>
    
                <div class="description">
                    ${video.post_content.substr(0, 100)} ...
                </div>
    
                <a href="${video.era_video_link}" class="btn-more bg-primary" target="_blank">KNOW MORE</a>
            </div>
        </div>`
    }
}

let videoInstance = new VideoItem([]);

d3.csv('/point_data/resources.csv')
.then(data => {
    data = data.map((dt, index) => {
        let coord = dt.era_resource_coordinates.split(",");
        dt.coordinates = coord.map(l => parseFloat(l)).reverse();
        dt.ecoregion = dt.era_resource_ecoregion;
        
        dt.id = `${index}-publication`;

        return dt;
    });

    // console.log([... new Set(data.map(l => l.post_category))]);            
    let publications = data.filter(entry => ['Video', 'Webinars'].indexOf(entry.post_category) == -1).filter(pub => pub.coordinates[0]);
    
    // videos Webinars
    let videos = data.filter(entry => ['Video', 'Webinars'].indexOf(entry.post_category) !== -1);
    // let nurseries = data.filter(entry => entry.)

    // update the 
    publicationInstance.items = publications;
    videoInstance.items = videos;

})
.catch(console.error);


// Nursery: filter as per ecoregion names
// Don't list the nurseries without coordinates

class NurseryItem extends ItemModule {
    constructor(nurseries, icon) {
        super([], icon);

        this.nurseries = nurseries;
    }

    setItems(items) {
        this.nurseries = items;
    }

   renderItemsToMap() {
        this.markers = this.nurseries.map(item => createMarker(item, this.getPopupContent, 'nurseries'));
    }

    fireEventListeners() {
        this.cards = document.querySelectorAll(".nursery-section");
        console.log(this.cards);
    
        this.cards.forEach(card => {
            // card.onmouseover = (e) => this.handleCardEvents(e);
            card.onclick = (e) => this.handleCardEvents(e);
        });
    }

    loadListItems() {
        console.log("Rendering Nursery");

        let nurseyContainer = document.getElementById("nurseries-section");
        let nurseryContent = "";

        if(!this.nurseries[0]) {
            nurseyContainer.innerHTML = `<div class="text-section">
                We're currently working on curating a nursery list for this ecoregion. 
                Mail us at <a href="mailto:hello@era-india.org">hello@era-india.org</a> to contribute to this list.
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScS993yItCLnVD-wexZIhrT9RSLIYorGWQ3Z2-nYBKMBcxtyg/viewform" class="btn-more bg-primary" target="_blank">ADD RESOURCE</a>
            </div>`
            return;
        }

        this.nurseries.forEach(nursery => {
            nurseryContent += `<div class="nursery-section" id="${nursery.id}" data-id="${nursery.id}">
                <div class="title bold">${nursery['Name of the nursery']}</div>
                <div class="nursery-body">
                    <span class="bold">Address</span>: ${nursery.Address} </br>
                    <span class="bold">Website:</span> <a href="${nursery['Website Address']}">${nursery['Website Address']}</a> </br>
                    <span class="bold">Contact no: </span> ${nursery['Contact number']} </br>
                </div>
            </div>`;
        });

        // console.log(this.nurseries);
        nurseyContainer.innerHTML = nurseryContent;
    }

    getPopupContent(nursery) {    
        return `<div class="popup-content nursery">
            <div class="img">
                <img src="/icons/nurseries.png" alt="">
            </div>
            <div class="popup-body">
                <span class="bold">Address</span>: ${nursery.Address} </br>
                <span class="bold">Website: </span><a href="${nursery['Website Address']}">${nursery['Website Address']}</a></br>
                <span class="bold">Contact no:</span>  ${nursery['Contact number']} </br>
            </div>
        </div>`
    }
}

let nurseryInstance = new NurseryItem([], 'nurseries');

d3.csv("/point_data/nurseries.csv")
.then(data => {
    data = data.filter(dt => dt.Coordinates).map((item, i) => {
        item.id = i;
        item.ecoregion = item.Ecoregion;
        item.coordinates = item.Coordinates.trim().split(",").map(coord => parseFloat(coord)).reverse();
        return item;
    });

    console.log(data);

    nurseryInstance.items = data;
})
.catch(console.error);