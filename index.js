// index.js
const { ServiceBroker } = require("moleculer");
let api = require("./services/api.service");
let flickr = require("./services/flickr.service");
let gallery = require("./services/gallery.service");
let attendance = require("./services/attendance.service");
let config = require("./moleculer.config");

const weddingBroker = new ServiceBroker(config);

weddingBroker.createService(api);
weddingBroker.createService(flickr);
weddingBroker.createService(gallery);
weddingBroker.createService(attendance);

weddingBroker.start();
