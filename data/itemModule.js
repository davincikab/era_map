class ItemModule {
    constructor(projects, icon) {
        // this.projects = projects;
        this.items = [];
        this.icon = icon;
    }

    // setItems(items) {
    //     this.projects = items;
    // }
    
    // renderItemsToMap() {
    //     this.markers = this.projects.map(item => createMarker(item, this.getPopupContent, this.icon));
    // }

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
}