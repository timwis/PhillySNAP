var express = require("express")
    ,app = express()
    ,geocoder = require("timsgeocoder")
    ,arcnearby = require("arcnearby")
    ,_ = require("underscore")
    ,nodePromise = require("node-promise")
    ,twilio = require("twilio");
(function(app, express, geocoder, arcnearby, nodePromise, _, twilio) {
    
    var receiveSMS = function(body) {
        var promise = new nodePromise.Promise();
        body = body ? decodeURIComponent(body.trim()) : ""; // Trim message
        if(body) { // If message body (address) provided
            // Geocode address
            geocoder.geocode(body, "google", "Philadelphia, PA").then(function(coords) {
                if(typeof coords !== "object" || ! coords.length) return promise.reject("Failed to locate address provided");
                
                var replies = [];
                
                // Get nearby farmers markets
                var farmersMarkets = arcnearby.getNearby("farmersMarkets", coords, 2, {where: "ACCEPT_SNA = 'Yes'"}).then(function(results) {
                    if(results.length) {
                        // Build reply from response
                        replies.push([
                            "Farmers Market: "
                            ,results[0].attributes.NAME + ", "
                            ,results[0].attributes.ADDRESS + ", "
                            ,results[0].attributes.DAY_TIME + " ("
                            ,results[0].attributes.distance.toFixed(2) + "mi)"
                        ].join(""));
                        console.log(replies[replies.length-1]);
                    } else {
                        promise.reject("No farmers markets found");
                    }
                }, function(response, body) {
                    promise.reject("Error locating farmers markets");
                });
                
                // Get nearby corner stores
                var cornerStores = arcnearby.getNearby("cornerStores", coords, 1, {}).then(function(results) {
                    if(results.length) {
                        // Build reply from response
                        replies.push([
                            "Healthy Corner Store: "
                            ,results[0].attributes.OFFICIAL_S + ", "
                            ,results[0].attributes.STORE_ADDR + " ("
                            ,results[0].attributes.distance.toFixed(2) + "mi)"
                        ].join(""));
                        console.log(replies[replies.length-1]);
                    }
                }, function(code, url) {
                    promise.reject("Error locating nearest corner stores (" + code + ") " + url);
                });
                
                // When farmersMarkets & cornerStores resolve (requests complete), resolve promise
                nodePromise.all(farmersMarkets, cornerStores).then(function(promises) { promise.resolve(replies) });
            }, function(code) {
                promise.reject("Error " + code);
            });
        } else {
            promise.reject("No address provided");
        }
        return promise;
    };
    
    app.use(express.bodyParser());
    
    app.all("/api/lookup/:body", function(req, res) {
        var twiml = new twilio.TwimlResponse();
        receiveSMS(req.params.body || req.body.Body || req.query.Body).then(function(replies) {
            _.each(replies, function(reply) {
                twiml.sms(reply);
            });
            
            res.type("text/xml");
            res.send(twiml.toString());
        }, function(data) {
            twiml.sms("Error: " + data);
            
            res.type("text/xml");
            res.send(twiml.toString());
        });
    });
    
    app.use(express.static(__dirname + "/public"));
    
    app.listen(process.env.PORT || 4730);
    
})(app, express, geocoder, arcnearby, nodePromise, _, twilio);