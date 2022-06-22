// Projects Item Modular code
class ProjectItem extends ItemModule {
    constructor(projects) {
        super(projects, 'task');
        
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

        if(!this.projects[0]) {
            projectsContainer.innerHTML = `<div class="text-section">
                We are currently working on curating a projects list for this ecoregion. 
                Mail us at <a href="mailto:hello@era-india.org">hello@era-india.org</a> to contribute to this list.
            </div>`
            return;
        }

        this.projects.forEach(project => {
            content += `<div class="card project-card" id="${project.id}" data-id="${project.id}">
                <img src="${project.featured_image}" alt="">
                <div class="fig-caption">
                    <div class="bold">${project.post_title}</div>
                    <div>${project.location}</div>
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

    getPopupContent(project) {    
        return `<div class="popup-content">
            <img src="${project.featured_image}" alt="">
            <div class="popup-body">
                <div class="bold title">${project.post_title}</div>
                <div class="">${project.location}</div>
    
                <div class="description">
                    ${project.post_content.substr(0, 100)} ...
                </div>
    
                <a href="${project.era_website}" class="btn-more bg-primary" target="_blank">KNOW MORE</a>
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

    projectInstance.items = data;

})
.catch(console.error);
