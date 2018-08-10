'use strict';
const puppeteer = require('puppeteer');
const PubSub = require('pubsub-js');
const WebPageTest = require('webpagetest');
const wpt = new WebPageTest('www.webpagetest.org','A.2ea45727f4990bf3c73fd402200164ea');
var https = require('https');
var fs = require('fs');
// const jsdom = require("jsdom").jsdom;
// Define global.window and global.document.
// global.document = jsdom();
// global.window = global.document.parentWindow;
// var domready = require('domready');
var htmlparser = require("htmlparser");
var os = require('os-utils');
require("./whitelisting");
var registry = require("./registry");
var os = require('os-utils');
var stringSearcher = require('string-search');
// var TextSearch = require('rx-text-search');
var file = fs.createWriteStream("file.txt");
var rawHtml = "https://s3-ap-southeast-1.amazonaws.com/bonzaiqa/Analytics/networkcalls.html";
var handler;
console.log(registry);
var totalChannels = registry.channels.length;
var stdin = process.openStdin();
var tag_url = process.argv[2];

/*
const DEFAULT_HTML = '<html><body></body></html>';
 jsdom = new JSDOM(DEFAULT_HTML, {
    url: tag_url,
    referrer: tag_url,
    contentType: "text/html",
    userAgent: "node.js",
    includeNodeLocations: true
});

var window = jsdom.createWindow();
*/
//var temp = window.document.querySelectorAll("[data-knd]");

//console.log("Elements "+temp);

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
   page.on('request', request => {
  for(var i = 0 ; i < totalChannels ; i++){
         PubSub.publish(registry.channels[i],request.url());

  }

  	request.continue();
  });

    await   page.goto(tag_url);


   await page.close();

})();