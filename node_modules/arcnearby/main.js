/**
 * Example usage of arcnearby
 */
var arcnearby = require("./arcnearby")
    ,_ = require("underscore");

var coords = [39.9365,-75.1661];
arcnearby.getNearby("cornerStores", coords, 0.25, {where: "STORE_LEVEL = 'Enhanced Healthy Corner Store'"}, function(results) {
    _.each(results, function(result) {
        console.log(result.attributes);
    });
}, function(response, body) {
    console.log("Error");
});