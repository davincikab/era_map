// Projects Item Modular code
class ProjectItem extends ItemModule {
    constructor(projects) {
        super(projects, 'projects');
        
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
                We're currently working on curating a projects list for this ecoregion. 
                Mail us at <a class="mail-link" href="mailto:hello@era-india.org">hello@era-india.org</a> to contribute to this list.
            </div>`
            return;
        }

        this.projects.forEach(project => {
            content += `<div class="card project-card" id="${project.id}" data-id="${project.id}">
                <img src="${project.featured_image}" alt="">
                <div class="fig-caption">
                    <div class="bold">
                        <a href="https://era-india.org/${project.post_name}/" class='mail-link' > ${project.post_title}</a>
                    </div>
                    <div>${project.location}</div>
                </div>
            </div>`;
    
        }); 
        // https://era-india.org/project/east-karbi-anglong-community-project/ 
    
        projectsContainer.innerHTML = content;
    }
    
    renderItemsToMap() {
        this.markers = this.projects.map(item => createMarker(item, this.getPopupContent, 'projects'));
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
    
                <a href="https://era-india.org/project/${project.post_name}/" class="btn-more btn-primary" target="_blank">KNOW MORE</a>
            </div>
        </div>`
    }
}

let projectInstance = new ProjectItem([]);

// factory functions
// creating marker
let projectUrl = 'https://era-india.org/wp-content/uploads/smack_uci_uploads/exports/projects_v2.csv'
//  resources_v2.csv, species_v2.csv';
let localProjectsUrl = window.location.hostname != 'era-india.org' ? './point_data/projects.csv' : projectUrl;
d3.csv(localProjectsUrl)
.then(data => {
    data = data.filter(l => l.post_title).reduce((a,b) =>{
        let coords = b.era_project_coordinates.split(';');

        if(coords.length > 1) {
            let items = coords.map(coord => {
                let itemsA = { ...b };
                itemsA.era_project_coordinates = coord;

                return itemsA;
            });

            a = [...a, ...items];

        } else {
            a.push(b);
        }

        return a;
    }, []);
    console.log(data);

    data = data.map((dt, index) => {
        let coord = dt.era_project_coordinates.split(",");
        dt.coordinates = coord.map(l => parseFloat(l)).reverse();
        dt.ecoregion = dt.era_project_ecoregion_new
        dt.id = `${index}-projects`;

        return dt;
    }).filter(pub => pub.coordinates[0] && pub.coordinates[1]);

    projectInstance.items = data;

})
.catch(console.error);
