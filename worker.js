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