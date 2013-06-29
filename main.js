var config = require("./config")
    ,express = require("express")
    ,app = express()
    ,geocoder = require("timsgeocoder")
    ,arcnearby = require("arcnearby")
    ,_ = require("underscore")
    ,nodePromise = require("node-promise")
    ,twilio = require("twilio");
(function(config, app, express, geocoder, arcnearby, nodePromise, _, twilio) {
    
    var receiveSMS = function(configModule, body) {
        var promise = new nodePromise.Promise();
        body = body ? decodeURIComponent(body.trim()) : ""; // Trim message
        
        // If module (from URL) not defined in config file, exit with no response
        if(config.modules[configModule] === undefined) {
            promise.reject();
            console.error("Unknown module `" + configModule + "`");
        }
        // If message body (address) not provided, exit with error response
        else if( ! body) {
            promise.reject(config.errors.emptyMessage);
        }
        // Otherwise we're in business
        else {
            // Geocode address
            geocoder.geocode(body, config.modules[configModule].geocoder, config.modules[configModule].city)
            .then(function(coords) {
                // If geocode worked (200) but got no results, exit with error response
                if(typeof coords !== "object" || ! coords.length) return promise.reject(config.errors.geocodeNoResults);
                
                var actions = [], replies = [];
                
                // For each action in config file, execute arcnearby lookup and accumulate replies
                _.each(config.modules[configModule].actions, function(action) {
                    actions.push(arcnearby.getNearby(action.service, coords, action.radius, action.filter)
                    .then(function(results) {
                        replies = replies.concat(action.parse(results));
                    }));
                });
                
                // When all actions are complete (promises resolved), resolve the overall promise for receiveSMS so replies will be sent
                nodePromise.all(actions).then(function(promises) {
                    promise.resolve(replies);
                });
            }, function(response, body) {
                // If there was an error geocoding, exit with error response
                promise.reject(config.errors.geocodeError);
            });
        }
        return promise;
    };
    
    app.use(express.bodyParser());
    
    app.all("/api/:configModule/:body?", function(req, res) {
        var twiml = new twilio.TwimlResponse();
        receiveSMS(req.params.configModule, req.params.body || req.body.Body || req.query.Body).then(function(replies) {
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
                if(data) twiml.sms(data);            
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