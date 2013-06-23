module.exports = {
    apiHost: "http://gis.phila.gov"
    ,apiPath: "/arcgis/rest/services"
    ,services: {
        farmersMarkets: "/PhilaGov/Farmers_Markets/MapServer/0/query"
        ,cornerStores: "/PhilaGov/Healthy_Corner_Stores/MapServer/0/query"
    }
    ,params: {
        where: "1=1"
        ,outFields: "*"
        ,geometry: ""
        ,geometryType: "esriGeometryEnvelope"
        ,spatialRel: "esriSpatialRelContains"
        ,inSR: "4326"
        ,outSR: "4326"
        ,returnGeometryOnly: "True"
        ,returnIdsOnly: "False"
        ,f: "pjson"
    }
};
