module.exports = {
    geocoder: "google"
    ,city: "Philadelphia, PA"
    ,actions: [
        {
            service: "farmersMarkets"
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
            service: "cornerStores"
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
};