// pass the feature to clip: datalayer instance, clip mask layer
// import turf from 'https://unpkg.com/@turf/turf@6/turf.min.js';
importScripts('https://unpkg.com/@turf/turf@6/turf.min.js')
onmessage = function({ data }) {
    console.log(data);

    let { targetLayer, clipMask } = data;

    let features = targetLayer.features.map(ft => {
        let difference = turf.difference(clipMask, ft);

        if(difference) {
            difference.properties = {...ft.properties};
        }

        // return ft;
        return difference;
    });

    let fc = turf.featureCollection(features);

    // clip the layer
    postMessage(fc)
};

// this.clipLayer = function(layerId, clipFeature, ecoName, done) {
//     if(this.ecoregionClips[ecoName] && this.ecoregionClips[ecoName][layerId] ) {
//         return;
//     } else {
//         this.ecoregionClips[ecoName] = { ...this.ecoregionClips[ecoName]};
//     }

//     this.ecoregionClips[ecoName][layerId] = [];

//     let clipMask = {
//         type:'Feature',
//         properties:{...clipFeature.properties},
//         geometry:{...clipFeature.geometry}
//     };

//     // clip feature
//     let targetLayer = this.layers.find(layer => layer.name == layerId);
   

//     var myWorker = new Worker('worker.js');
//     myWorker.onmessage = (oEvent) => {
//         console.log(layerId);

//         let { data } = oEvent;
//         this.ecoregionClips[ecoName][layerId] = [...data.features];
//         this.updateSourceWithId(layerId, data);

//         done();
//     };

//     myWorker.onerror = (error) => {
//         console.log(error);
//     };

//     // clip option
//     let options = {
//         targetLayer,
//         clipMask,
//     };

//     myWorker.postMessage(options);
// }