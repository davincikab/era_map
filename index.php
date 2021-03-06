<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Map - Ecoregions.</title>
<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
<link href="https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mulish&display=swap" rel="stylesheet">

<link rel="stylesheet" href="style.css">
</head>
<body>

<?php
  require('/home2/eraindia/public_html/wp-blog-header.php');
  get_header();
  ?>

<div class="map-container">
        <div class="spinner-container" id="spinner-container">
            <div class="spinner"></div>
            <p>Loading Data ...</p>
        </div>

        <div id="map">
            <div class="coord-input">
                <form id="coord-form">
                    <input 
                        type="text" name="coordinates" id="coordinates-input" placeholder="Enter Coordinates: Lat, Long" 
                        pattern="^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$"
                    >
                    <span class="d-none" id="text-warning">Invalid Coordinates: lat, lng</span>
                </form>
            </div>

            <div class="info-tab" id="info-tab">
                <div class="info-header">
                    Tips to use the map

                    <div class="close-btn" id="close-btn">
                        <i class="fa fa-times"></i>
                    </div>
                </div>
                <div class="info-body">
                    <div class="info-item">
                        <img src="icons/pointer.png" alt="">
                        <div class="text-section">
                            Double tap to drop a pin on the map, to get location specific details.
                        </div>
                    </div>
                    <div class="info-item">
                        <img src="icons/data_layer.png" alt="">
                        <div class="text-section">
                            Use data layers to get to know more information for each ecoregion.
                        </div>
                    </div>
                </div>

                <div class="info-footer">
                    <a href="#">Don???t show this message again</a>
                </div>
            </div>

            <div class="data-toggler d-none" id="data-toggler">
                <button class="dropdown-toggler" id="dropdown-toggler">
                    <div>
                        <img src="icons/data_layer.png" alt="" height="25px" width="25px">
                        Data Layers
                    </div>
    
                    <div class="caret-icons">
                        <i class="fa fa-caret-up"></i>
                        <i class="fa fa-caret-down"></i>
                    </div>
                    
                </button>
    
                <div class="dropdown d-none" id="dropdown">
                    <div class="form-group d-none">
                        <input class="layer-toggler" type="checkbox" name="data-layer" id="all-layers" checked>
                        <label for="all-layers">Hide All</label>
                    </div>

                    <div class="slider">
                        <label class="switch d-none" for="slider-toggler">
                            <input type="checkbox" id="slider-toggler">
                            <span class="switch-slider round"></span>
                        </label>

                        <img src="icons/opacity-icon.png" alt="" height="20px">

                        <input type="range" name="opacity" id="opacity" min="0" max="1" step="0.1">
                        <span id="opacity-value">60%</span>
                    </div>
    
                    <div class="form-group">
                        <label for="protected-areas">
                            <input class="layer-toggler" type="checkbox" name="data-layer" id="protected-areas">
                            Protected Areas
                        </label>
                    </div>
                    
                    <div class="collapse-section protected-areas" id="protected_areas"></div>
    
                    <div class="form-group">
                        <label for="watershed">
                            <input class="layer-toggler" type="checkbox" name="data-layer" id="watershed">
                            Watershed
                        </label>
                    </div>
                    <div class="collapse-section watershed" id="watershed"></div>
    
                    <div class="form-group">
                        <label for="soil">
                            <input class="layer-toggler" type="checkbox" name="data-layer" id="soil">
                            Soil
                        </label>
                    </div>
                    <div class="collapse-section soil" id="india_soils_ibp"></div>
    
                    <div class="form-group">
                        <label for="rainfall-zones">
                            <input class="layer-toggler" type="checkbox" name="data-layer" id="rainfall-zones">
                            Rainfall Zones
                        </label>
                    </div>
                    <div class="collapse-section rainfall-zones" id='india_rainfallzones_ibp'>
                        
                        </div>
    
                    <div class="form-group">
                        <label for="geology">
                            <input class="layer-toggler" type="checkbox" name="data-layer" id="geology">
                            Geology
                        </label>
                    </div>
                    <div class="collapse-section geology" id="india_geology_ibp"></div>
    
                    <div class="form-group">
                        <label for="geomorphology">
                            <input class="layer-toggler" type="checkbox" name="data-layer" id="geomorphology">
                            Geomorphology
                        </label>
                    </div>
                    <div class="collapse-section geomorphology" id="india_geomorphology_ibp"></div>
                    
                    <!-- configure the checkbox to work like radio buttons  -->
                </div>
            </div>
        </div>

        <div class="layer-toggler-btn" id="layer-toggler-btn">
            <img src="icons/data_layer.png" alt="">
        </div>

        <div class="thematic-loader" id="thematic-loader">
            <div>Loading Thematic Layers</div>

            <div class="meter red">
                <span style="width: 100%"></span>
            </div>
        </div>

        <div class="side-tab">
           <div class="layer-groups">
               <div class="layer-group active" id="ecoregion">Ecoregion</div>
               <div class="layer-group" id="projects">Projects</div>
               <div class="layer-group" id="key-species">Key Species</div>
               <div class="layer-group" id="resources">Resources</div>
           </div>

           <div class="tab-toggler" id="tab-toggler">
                <!-- Open Tab -->
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
           </div>

           <div class="layer-section">

                <div class="">
                    <h3 class="section-title" id="eco-title">
                       
                    </h3>
                </div>

                <div class="section-layer active" id="ecoregion-section">
                   <div class="section-header eco-section d-none">
                       <div class="header-item active" id="level-1">Level 1</div> |
                       <div class="header-item" id="level-2">Level 2</div> |
                       <div class="header-item" id="level-3">Level 3</div> 
                   </div> 

                   <div class="eco-section-body">
                        <div id="level-1-section" class="levels-section active">
                            <div id="ecoregion-info">
                            </div>
                            
                            
                            <div class="nearest-section">
                                <!-- <div class="btn-more">KNOW MORE</div> -->

                                <div class="spinner-container-small d-none" id="spinner-container-small">
                                    <div class="spinner"></div>
                                    <p class="">Getting the Nearest Datasets</p>
                                </div>

                                <div id="protected-areas">
                                    <div class="header">
                                        <img src="icons/pareas.png" alt="" height="40px" width="40pc">
                                        <div class="section-title item-title">Nearest Protected Areas </div>
                                    </div>

                                    <div class="items my-2" id="park-list">
                                    </div>
                                </div>

                                <!-- UVB4s78FwtK8iv -->
                                <div>
                                    <div class="header">
                                        <img src="icons/watershed.png" alt="" height="40px" width="40pc">
                                        <div class="section-title item-title">Watershed </div>
                                    </div>

                                    <div class="items my-2" id="watershed-list"></div>
                                </div>

                                <div>
                                    <div class="header">
                                        <img src="icons/rainfall.png" alt="" height="40px" width="40pc">
                                        <div class="section-title item-title">Rainfall Zones</div>
                                    </div>

                                    <div class="items my-2" id="rainfallzones-list"></div>
                                </div>
                            </div>
                        </div>


                        <div id="level-2-section" class="levels-section">
                            <div class="section-title">Level 2</div>
                        </div>

                        <div id="level-3-section" class="levels-section">
                            <div class="section-title">Level 3</div>
                        </div>

                   </div>
               </div>

               <div class="section-layer" id="projects-section">
                    <h3 class="section-title">
                        Restoration Projects in this ecoregion
                    </h3>

                    <div class="card-list" id="projects-list">
                    </div>
               </div>

               <div class="section-layer" id="key-species-section">
                    <h3 class="section-title">Key Species</h3>

                    <div class="item-list" id="species-list">
                    </div>

                    <div class="text-white my-2" id="active-species">
                    </div>

               </div>

               <div class="section-layer" id="resources-section">
                    <div class="section-header resources-section">
                        <div class="header-item active" id="publications" data-target="resources">Publications</div> 
                        <div class="header-item" id="videos" data-target="resources">Videos</div> 
                        <div class="header-item" id="nurseries" data-target="resources">Nurseries</div> 
                    </div> 

                    <div class="section-layer-body">
                        <div id="publications-section" class="resource-section active">
                        </div>

                        <div id="videos-section" class="resource-section">
                        </div>

                        <div id="nurseries-section" class="resource-section">
                        </div>

                    </div>
               </div>
           </div>
        </div>

        <div class="layer-groups mobile-view">
            <div class="layer-group active" id="ecoregion">Ecoregion</div>
            <div class="layer-group" id="projects">Projects</div>
            <div class="layer-group" id="key-species">Key Species</div>
            <div class="layer-group" id="resources">Resources</div>
        </div>

    </div>

    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://unpkg.com/pbf@3.0.5/dist/pbf.js"></script>
    <script src="https://unpkg.com/geobuf@3.0.2/dist/geobuf.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@8/swiper-bundle.min.css" />
    <script src="https://unpkg.com/swiper@8/swiper-bundle.min.js"></script>

    <script src="https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js"></script>
    <script src='https://unpkg.com/@turf/turf@6/turf.min.js'></script>
    <script src="data/itemModule.js"></script>
    <script src="data/factoryFunctions.js"></script>

    <script src="data/resources.js"></script>
    <script src="data/key_species.js"></script>
    <script src="data/projects.js"></script>
    
    <script src="data/ecoregions.js"></script>

    <script src="main.js"></script>
</body>
</html>