var config = require("./config")
    ,express = require("express")
    ,app = express()
    ,geocoder = require("timsgeocoder")
    ,arcnearby = require("arcnearby")
    ,_ = require("underscore")
    ,nodePromise = require("node-promise")
    ,twilio = require("twilio");
(function(config, app, express, geocoder, arcnearby, nodePromise, _, twilio) {
    
    var receiveSMS = function(body) {
        var promise = new nodePromise.Promise();
        body = body ? decodeURIComponent(body.trim()) : ""; // Trim message
        if(body) { // If message body (address) provided
            // Geocode address
            geocoder.geocode(body, config.geocoder, config.city).then(function(coords) {
                if(typeof coords !== "object" || ! coords.length) return promise.reject("Failed to locate address provided");
                
                var actions = [], replies = [];
                
                // For each action in config file, execute arcnearby lookup and accumulate replies
                _.each(config.actions, function(action) {
                    actions.push(arcnearby.getNearby(action.service, coords, action.radius, action.filter).then(function(results) {
                        replies = replies.concat(action.parse(results));
                    }));
                });
                
                nodePromise.all(actions).then(function(promises) { promise.resolve(replies); });
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
    
})(config, app, express, geocoder, arcnearby, nodePromise, _, twilio);