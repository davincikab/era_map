class ProjectItem {
    constructor(projects) {
        this.projects = projects;
    }

    setItems(items) {
        this.projects = items;
    }

    // 
    loadListItems(containerClass) {
        let contentContainer = document.getElementById("projects-list");
        let content = "";

        this.projects.forEach(project => {
            content += `<div class="card project-card" id="${project.name}" data-id="${project.id}">
                <img src="${project.images[0]}" alt="">
                <div class="fig-caption">
                    <div class="bold">${project.name}</div>
                    <div>${project.address}</div>
                </div>
            </div>`;
    
        });
    
        contentContainer.innerHTML = content;
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
}