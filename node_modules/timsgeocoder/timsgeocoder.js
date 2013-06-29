var config = require("./config")
    ,request = require("request")
    ,Promise = require("node-promise").Promise;
(function(app, config, request, Promise) {
    
    /**
     * Geocode using particular provider and optional city
     * @param {String} address The address to geocode
     * @param {String} provider The provider from config.js
     * @param {String} [city] Optional City to narrow results
     * @param {Function} [successCallback]
     * @param {Function} [errorCallback]
     * @returns {Promise}
     */
    app.geocode = function(address, provider, city, successCallback, errorCallback) {
        var promise = new Promise();
        if(config.providers[provider] === undefined) {
            promise.reject("Invalid provider");
        }
        var url = config.providers[provider].url(address, city);
        request(url, function(error, response, body) {
            if(error || response.statusCode !== 200) {
                promise.reject(response, body);
                if(errorCallback) errorCallback(response, body);
            } else {
                var data = config.providers[provider].parse(JSON.parse(body));
                promise.resolve(data);
                if(successCallback) successCallback(data);
            }
        });
        return promise;
    };
    
})(module.exports, config, request, Promise);