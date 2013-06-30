PhillySNAP
==========
This platform lets you connect people to ArcGIS Services via text message.
By modifying a basic [config file](https://github.com/timwis/PhillySNAP/blob/master/config.js), you can setup a twilio endpoint for any ArcGIS Service, creating a custom reply.
Included are some examples from [gis.phila.gov](http://gis.phila.gov/arcgis/rest/services) and [snapretailerlocator.com](http://www.snapretailerlocator.com).

To install,

1. Clone this repo
2. Modify `config.js` to suit your needs
3. Deploy to heroku
4. Point a twilio phone number to `http://<yourapp>.herokuapp.com/api/<module>?format=twiml`