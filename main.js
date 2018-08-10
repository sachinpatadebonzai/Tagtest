'use strict';
const puppeteer = require('puppeteer');
const PubSub = require('pubsub-js');
require("./whitelisting");
var registry = require("./registry");
console.log(registry);

var totalChannels = registry.channels.length;
var tag_url = prompt("Enter the Tag URL");


(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', request => {
	for(var i = 0 ; i < totalChannels ; i++){
		PubSub.publish(registry.channels[i],request.url());
	}
	//PubSub.publish('CHECKFORWHITELISTING',request.url());
	request.continue();
  });
  await page.goto(tag_url);
  await browser.close();
})();

