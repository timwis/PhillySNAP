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
                if(typeof coords !== "object" || ! coords.length) return promise.reject(config.errors.geocodeNoResults);
                
                var actions = [], replies = [];
                
                // For each action in config file, execute arcnearby lookup and accumulate replies
                _.each(config.actions, function(action) {
                    actions.push(arcnearby.getNearby(action.service, coords, action.radius, action.filter).then(function(results) {
                        replies = replies.concat(action.parse(results));
                    }));
                });
                
                nodePromise.all(actions).then(function(promises) { promise.resolve(replies); });
            }, function(code) {
                promise.reject(config.errors.geocodeError);
            });
        } else {
            promise.reject(config.errors.emptyMessage);
        }
        return promise;
    };
    
    app.use(express.bodyParser());
    
    app.all("/api/lookup/:body?", function(req, res) {
        var twiml = new twilio.TwimlResponse();
        receiveSMS(req.params.body || req.body.Body || req.query.Body).then(function(replies) {
            if(req.query.format === "twiml") {
                _.each(replies, function(reply) {
                    twiml.sms(reply);
                });
                
                res.type("text/xml");
                res.send(twiml.toString());
            } else {
                res.json({data: replies});
            }
        }, function(data) {
            if(req.query.format === "twiml") {
                twiml.sms(data);            
                res.type("text/xml");
                res.send(twiml.toString());
            } else {
                res.json(500, {error: data});
            }
        });
    });
    
    app.use(express.static(__dirname + "/public"));
    
    app.get(/^\/admin.*/, express.basicAuth(config.admin.user, config.admin.pass)); // TODO: Use htpasswd
    
    app.listen(process.env.PORT || 4730, function() { console.log("Server Running..."); });
    
})(config, app, express, geocoder, arcnearby, nodePromise, _, twilio);