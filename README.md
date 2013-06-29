PhillySNAP
==========
Find nearby farmers markets and SNAP-accepting retailers via text message.

While the default configuration is farmers markets and retailers in Philadelphia, you can modify `config.js` to pull data from any ArcGIS service, such as crime, permits, etc.

To install,

1. Clone this repo
2. Modify `config.js` to suit your needs
3. Deploy to heroku
4. Point a twilio phone number to `http://<yourapp>.herokuapp.com/api/<module>?format=twiml`