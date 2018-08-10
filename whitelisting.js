const PubSub = require('pubsub-js');
var url = require('url');
var http = require('http');
var https = require('https');
var fs = require('fs');
var htmlparser = require("htmlparser");
var os = require('os-utils');
var stringSearcher = require('string-search');
var TextSearch = require('rx-text-search');
var file = fs.createWriteStream("file.txt");
var request = require('request');
var Table = require('easy-table');
const {table} = require('table');
var Table = require('tty-table')('automattic-cli-table');
var colors = require('colors');
const WebPageTest = require('webpagetest');
const wpt = new WebPageTest('www.webpagetest.org','A.2ea45727f4990bf3c73fd402200164ea');
var cpu_Usage,c_url1,m_url1,w_url1;
var count_pre_pre_imp = 0;
var count_imp = 0;
var count_preimp = 0;
var invokeresponsetime = 0 ;
var tracker_count_1 = 0;
var tracker_count_2 = 0;
var massetcount = 0 ;
var collectorcount = 0;
var httpProtocol = 0;
var talentica = 0;
var objs = [];
var webpage_data;
var tag_url = process.argv[2];
const tag_url1 = process.argv[2];
var whitelistedurl = [];
var masseturl = [];
var collectorurl = [];
var jsonString ;
var webpage ;
let ev_output, Domain_output ;

const whitelistedDomains = ["invoke.bonzai.co","massets.bonzai.co","collector.bonzai.co","massets.bonzai.ad","c.bonzai.co","s3-ap-southeast-1.amazonaws.com"];
var checkForwhiteListing = function (msg,requestUrl){
let data,config;

// Parse Request URL
	urlParams = url.parse(requestUrl,true)
	hostName = urlParams.host

// CPU Utilization
  os.cpuUsage(function(v){
    cpu_Usage = v;
        objs.push({CPU_Usage: cpu_Usage});
});

// Webpage Test
wpt.runTest(tag_url1,{location: 'ec2-ap-southeast-2:Firefox'}, (err, webpage_data) => {
webpage =  JSON.stringify(webpage_data);
});

// Check for invoke bonzai.co response time
  if (hostName.match("invoke.bonzai.co"))
    request.get({ url: requestUrl, time: true }, function (err, response) {
    invokeresponsetime  = response.elapsedTime;
    objs.push({invoke_response_time: invokeresponsetime});
  });

// Validate for WhiteListed Domains
  if (hostName.match("collector.bonzai.co"))
  {
    if(collectorcount < 1)
    {
    objs.push({collectorurl: requestUrl});
    }
    collectorurl.push(requestUrl);
    collectorcount++;
  }

  if(hostName.match("massets.bonzai.ad"))
  {
  if(massetcount < 1)
  {
    objs.push({massets: requestUrl});
  }
    massetcount++;
    masseturl.push(requestUrl);
  }

  if(hostName.match("talentica-mizu-adcreator.s3-ap-southeast-1.amazonaws.com"))
  {
  if(talentica < 1) {
    objs.push({hostName: talentica++});
    }
    talentica++;
  }
  else
  {
  if(talentica < 1) {
  objs.push({hostName: "No Talentica URL Found"});
  }
  talentica++;
  }
  
if(whitelistedDomains.indexOf(hostName) < 0){
      whitelistedurl.push(requestUrl);
	}

// Validate for http Protocol
  protocol =  url.parse(requestUrl,true).protocol
   if(protocol.match("http:")){
    httpProtocol++;
      if(httpProtocol < 1) {
    objs.push({http_Request: requestUrl});
   }
   }
   else {
         if(httpProtocol < 1) {
       objs.push({http_Request: "Not Found"});
       }
   }

    if(talentica == 0) {
      talentica = 'None' .green;
    }

    if(httpProtocol == 0){
      httpProtocol = 'None' .green;
    }

 collectorurl.forEach(function (c_url) {
  c_url1 = c_url;
});

masseturl.forEach(function (m_url) {
  m_url1 = m_url;
  //  console.log("Masset URL"+m_url);
});
whitelistedurl.forEach(function (w_url) {
  w_url1 = w_url;
  if (w_url1.match('')){
    w_url = 'None' .green;
  }
  });

 var data1 = [
     ['Whitelistied Domains' ,'Invoke Response Time in (ms)','Talentica URL Found','Http Request Found','CPU Usage (%)','Ad Latency','Collector Count','Masset Count'],
     [w_url1 ,invokeresponsetime ,talentica ,httpProtocol, cpu_Usage,jsonString ,collectorcount ,  massetcount]
];

Domain_output = table(data1, {
  columns: {
        0: {
            width: 10
        },
        1: {
            width: 13
        },
        2: {
            width: 13
        },
        3: {
            width: 15
        },
        4: {
            width: 10
        },
        5: {
            width: 10
        },
        6: {
            width: 10
        },
        7: {
            width: 10
        }
    },
    columnDefault: {
        paddingLeft: 0,
        paddingRight: 1
    },
    drawHorizontalLine: () => {
        return true
      }
    });
 //   return output;
  return Domain_output;
}


const eventsFired = ["?ev=preimp","?ev=pre-preimp","?ev=imp"];

var checkForeventsFired = function (msg,requestUrl){
 urlParams =  url.parse(requestUrl,true)

 var query_tag =  JSON.stringify(urlParams);
 var query = JSON.parse(query_tag);
 var url_event = JSON.stringify(query.query);

if (query.hasOwnProperty('query'))
{
if ( url_event == "{}"){
}
}
else {
        var url_event1 = JSON.parse(url_event);
        var url_ev1 = JSON.stringify(url_event1);
        var url_ev3 = JSON.parse(url_ev1);
        var url_ev4 = JSON.stringify(url_ev3.ev);

if (url_ev3.hasOwnProperty('ev'))
{
        if (url_ev4.match("imp"))
        {
        count_imp++;
         if(count_imp < 1 ) {
           objs.push({Impression: count_imp});
          }
        }
        if (url_ev4.match("preimp"))
        {
        count_preimp++;
        if(count_preimp < 1 ) {
                   objs.push({ Pre_Impression: count_preimp});
          }
        }
        if (url_ev4.match("pre-preimp"))
        {
        count_pre_pre_imp++;
        if(count_pre_pre_imp < 1 ) {
                     objs.push({ Pre_Pre_Impression: count_pre_pre_imp});
           }
        }
     }
   }

var count_imp_status="";
    if (count_imp > 0)
    {
        count_imp_status = "Found -- Passed";
    }
    else{
        count_imp_status = "Not Found -- Failed";
        }


var ppimp_status="" ;
    if (count_pre_pre_imp > 0)
    {
        ppimp_status = "Found -- Passed";
    }
    else {
        ppimp_status = "Not Found -- Failed";
    }

var count_preimp_status = "";

    if (count_preimp > 0)
    {
        count_preimp_status = "Found -- Passed";
    }
    else {
         count_preimp_status = "Not Found -- Failed";
    }

var data1 = [
     ['Render Impression',' Download Impression','Served','Click Tracker'],
     [ count_imp_status, count_preimp_status, String(ppimp_status), 'TBD']
];


ev_output = table(data1, {
  columns: {
             0: {
                  width: 20
              },
              1: {
                  width: 20
              },
              2: {
                  width: 20
              },
              3: {
                  width: 20,
              }
    },
    columnDefault: {
        paddingLeft: 0,
        paddingRight: 1
    },
    drawHorizontalLine: () => {
        return true
      }
    });
   // return output;
   // console.log(output);
    console.log(JSON.stringify(objs));
}


var request1 = https.get(tag_url, function(response) {
  response.pipe(file);
 handler = new htmlparser.DefaultHandler(function (error, dom) {
    if (error)
      console.log("Failed to parse json");
    else
var parser = new htmlparser.Parser(handler);
parser.parseComplete(tag_url);
sys.puts(sys.inspect(handler.dom, false, null));
});
});


// Find .txt files containing "sometext" in test/doc and all its sub-directories
var checkForTagEventsFired = function (msg,requestUrl){

 TextSearch.find('bonzai_data =', 'file.txt')
  .subscribe(
    function (result) {
    var object = result.text;
    var arr = object.split("= ");
    var arr2 = arr[1].split(";");
	var t=arr2[0].length;
	var imp__trk= "";
	var trackers = [];
	if (arr2[0].charAt(0)=="'")
	{
	    arr2[0]=arr2[0].substring(1,t--);
	}
	if (arr2[0].charAt(t-1)=="'")
	{
	    arr2[0]=arr2[0].substring(0,t-1);
	}
	var  jsonString1 = JSON.parse(arr2[0]);
	var Add_tracker = jsonString1.network.macros.addiTr.cachbust;

    if ((jsonString1.network.macros.addiTr.cachbust).startsWith("%%")){
   //         console.log("\n Ad Tracker Not Listed: "+jsonString1.network.macros.addiTr.cachbust);
    }
    else {
        trackers.push(jsonString1.network.macros.addiTr.cachbust);
    //    console.log("\n Ad Tracker  Listed: "+jsonString1.network.macros.addiTr.cachbust);
    }
     var engtrack = JSON.stringify(jsonString1.network.macros.engmTr);

     if (engtrack == "{}"){
     //         console.log("\n Engagement Tracker Not Listed: "+JSON.stringify(jsonString1.network.macros.engmTr));
     }
     else {
           var jsaonemgTrck = JSON.stringify(jsonString1.network.macros.engmTr);
           var jsaonemgTrck1 = JSON.parse(jsaonemgTrck);
           var jsaonemgTrck2 = JSON.stringify(jsaonemgTrck1.tracker01);
           var jsaonemgTrck3 = JSON.parse(jsaonemgTrck2);
           var jsaonemgTrck4 = JSON.stringify(jsaonemgTrck3.url);
      //     console.log("\n Engagement Tracker  Listed: "+jsaonemgTrck4);
           objs.push({ Engagement_Tracker  : engtrack});

          }

var rend_track = String(jsonString1.network.macros.rendTr.img);
     if (rend_track == ""){
                    console.log("\n Rendered Impression Tracker Not Listed: "+jsonString1.network.macros.rendTr.img);
      }else {
                    trackers.push(jsonString1.network.macros.rendTr.imgr);
                    objs.push({ Rendered_Impression : rend_track});

         //           console.log("\n Rendered Impression Tracker Listed: "+jsonString1.network.macros.rendTr.img);
      }

      imp__trk = JSON.stringify(jsonString1.network.macros.imprTr.img);
       if (((imp__trk)).startsWith("%%")){
     //            console.log("\n Impression Tracker Not Listed: "+jsonString1.network.macros.imprTr.img);
       }else {
        //          console.log("\n Impression Tracker  Listed: "+jsonString1.network.macros.imprTr.img);
                  trackers.push(jsonString1.network.macros.imprTr.img);
                  objs.push({  Impression : imp__trk});


       }
     var clktrk = JSON.stringify(jsonString1.network.macros.clkTr.img);
       if ((clktrk).startsWith("%%")){
      //             console.log("\n Click  Tracker Not Listed: "+jsonString1.network.macros.clkTr.img);
       }else {
        //           console.log("\n Click  Tracker  Listed: "+jsonString1.network.macros.clkTr.img);
            //       trackers.push(clktrk);
                              objs.push({ Click_Tracker : clktrk});

       }

     var clkthrough1 = JSON.stringify(jsonString1.network.macros);
     var jsaonemgTrck2 = JSON.parse(clkthrough1);
if (jsaonemgTrck2.hasOwnProperty('clkThru'))
{
  var clkthrough = JSON.stringify(jsonString1.network.macros.clkThru.landingUrl);
       if ((clkthrough) == ""){
      //             console.log("\n Click  Through empty: "+clkthrough);
       }else {
       //            console.log("\n Click  Through  Listed: "+clkthrough);
          //         trackers.push(clkthrough);
          objs.push({ Click_Through : clkthrough});

       }
       }
       else{
                  //        console.log("\n Click Through  Not Listed: ");
       }

protocol =  url.parse(requestUrl,true).protocol
   if(protocol == "http:")
   {
    httpProtocol++;
   }
// console.log("Trackers Count "+trackers.length);

urlParams = url.parse(requestUrl,true)
// console.log("URL Parameter"+JSON.stringify(urlParams));

var tracker = JSON.stringify(urlParams);
// console.log("tracker "+tracker);

var Ad_tracker = JSON.parse(tracker);

var tracker_value = JSON.stringify(Ad_tracker.href);

var imp_arr = [];
var imp_arr1 = [];

imp_arr =  imp__trk.split(",");

imp_tag = imp_arr[0];
imp_arr1  = imp_tag.split("[");

var  imp_tag1 = imp_arr1[1];


if (imp_tag1 == tracker_value)
{
tracker_count_1++;
}

tracker_value = tracker_value.replace(/^"(.*)"$/, '$1');

if (rend_track == tracker_value)
{
tracker_count_2 = tracker_count_2 + 1;
}

  var data1 = [
       ["Served Impression Tracker ",'Rendered Imp Tracker Fired ','Ad Tracker ' ,'Engagement Tracker ' ,'Click Tracker ','Click  Through ','http Served Count'],
       [tracker_count_1, tracker_count_2, 'TBD', 'TBD', 'TBD', 'TBD', httpProtocol]
  ];

  output = table(data1, {
    columns: {
          0: {
              width: 10
          },
          1: {
              width: 13
          },
          2: {
              width: 13
          },
          3: {
              width: 15,
          },
          4: {
              width: 13
              },
          5: {
              width: 13
             },
          6: {
              width: 15,
             }
      },
      columnDefault: {
          paddingLeft: 0,
          paddingRight: 1
      },
      drawHorizontalLine: () => {
          return true
        }
      });
    //  console.log("Served Impression Tracker :: "+ imp_tag1 +"\n"+'Rendered Imp Tracker Fired ::'+rend_track+"\n" +'Ad Tracker :: '+Add_tracker+"\n"+'Engagement Tracker ::'+engtrack+"\n"+'Click Tracker :: '+ clktrk+"\n"+'Click  Through :: '+clkthrough)
    //  return output;

   //  console.log(output);

});
}



var token = PubSub.subscribe('CHECKFORWHITELISTING', checkForwhiteListing)
var token2 = PubSub.subscribe('CHECKFFOEVENTSFIRED', checkForeventsFired);
var token3 = PubSub.subscribe('CHECKforTagEVENTSFIRED', checkForTagEventsFired);

