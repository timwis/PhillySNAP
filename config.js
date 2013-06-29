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
                    service: "http://gis.phila.gov/ArcGIS/rest/services/Streets/Bike_Racks/MapServer/0/query"
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
                        }
                        return replies;
                    }
                }
            ]
        }
    }
};