module.exports = {
    admin: {
        user: "admin"
        ,pass: "test"
    }
    ,errors: {
        emptyMessage: "Please send a street address for results, ie. 1234 Market St"
        ,geocodeNoResults: "Unrecognized address. Please use only the street address, ie. 1234 Market St"
        ,geocodeError: "There was an error while locating that address"
    }
    ,modules: {
        phillysnap: {
            geocoder: "google"
            ,city: "Philadelphia"
            ,actions: [
                {
                    service: "http://gis.phila.gov/arcgis/rest/services/PhilaGov/Farmers_Markets/MapServer/0/query"
                    ,radius: 2
                    ,filter: {where: "ACCEPT_SNA = 'Yes'"}
                    ,parse: function(results) {
                        var replies = [];
                        if(results.length) {
                            replies.push([
                                "Farmers Market: "
                                ,results[0].attributes.NAME + ", "
                                ,results[0].attributes.ADDRESS + ", "
                                ,results[0].attributes.DAY_TIME + " ("
                                ,results[0].attributes.distance.toFixed(2) + "mi)"
                            ].join(""));
                        } else {
                            replies.push("No farmers markets found in a 2 mile radius");
                        }
                        return replies;
                    }
                }
                ,{
                    service: "http://gis.phila.gov/arcgis/rest/services/PhilaGov/Healthy_Corner_Stores/MapServer/0/query"
                    ,radius: 1
                    ,filter: {}
                    ,parse: function(results) {
                        var replies = [];
                        if(results.length) {
                            replies.push([
                                "Healthy Corner Store: "
                                ,results[0].attributes.OFFICIAL_S + ", "
                                ,results[0].attributes.STORE_ADDR + " ("
                                ,results[0].attributes.distance.toFixed(2) + "mi)"
                            ].join(""));
                        } else {
                            replies.push("No healthy corner stores found in a 1 mile radius");
                        }
                        return replies;
                    }
                }
            ]
        }
        ,bikeracks: {
            geocoder: "google"
            ,city: "Philadelphia"
            ,actions: [
                {
                    service: "http://gis.phila.gov/ArcGIS/rest/services/Streets/Bike_Racks/MapServer/1/query"
                    ,radius: 1
                    ,filter: {}
                    ,parse: function(results) {
                        var replies = [];
                        if(results.length) {
                            replies.push([
                                "Bike Rack: "
                                ,results[0].attributes.STAND_ADD + " ("
                                ,results[0].attributes.ADDRESS + ") ("
                                ,results[0].attributes.distance.toFixed(2) + "mi)"
                            ].join(""));
                        } else {
                            replies.push("No bike racks found in a 1 mile radius");
                        }
                        return replies;
                    }
                }
            ]
        }
        ,usdaretailers: {
            geocoder: "google"
            ,city: "" // This is a nation-wide data set
            ,actions: [
                {
                    service: "http://snap-load-balancer-244858692.us-east-1.elb.amazonaws.com/ArcGIS/rest/services/retailer/MapServer/0/query"
                    ,radius: 1
                    ,filter: {}
                    ,parse: function(results) {
                        var replies = [];
                        if(results.length) {
                            replies.push([
                                "SNAP Retailer: "
                                ,results[0].attributes.STORE_NAME + ", "
                                ,results[0].attributes.ADDRESS + " ("
                                ,results[0].attributes.distance.toFixed(2) + "mi)"
                            ].join(""));
                        } else {
                            replies.push("No SNAP-accepting retailers found in a 1 mile radius");
                        }
                        return replies;
                    }
                }
            ]
        }
        ,keyspots: {
            geocoder: "google"
            ,city: "Philadelphia" // This is a nation-wide data set
            ,actions: [
                {
                    service: "http://gis.phila.gov/ArcGIS/rest/services/PhilaGov/Keyspot_Locations/MapServer/0/query"
                    ,radius: 3
                    ,filter: {}
                    ,parse: function(results) {
                        var replies = [];
                        if(results.length) {
                            replies.push([
                                "KEYSPOT: "
                                ,results[0].attributes.NAME + ", "
                                ,results[0].attributes.MATCH_ADDR
                                ,(results[0].attributes.NOTES.trim() ? ", " + results[0].attributes.NOTES.trim() : "") + " ("
                                ,results[0].attributes.distance.toFixed(2) + "mi)"
                            ].join(""));
                        } else {
                            replies.push("No KEYSPOT found in a 3 mile radius");
                        }
                        return replies;
                    }
                }
            ]
        }
    }
};