////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declarations and init.

var webSocketUrl = "wss://api.artik.cloud/v1.1/websocket?ack=true";
var device_id = "4905342071274a7790f2f4481ff437ae";
var device_token = "5bec860d465e40e48dd8cebc9fdd1234";

var WebSocket = require('ws');
var isWebSocketReady = false;
var ws = null;

var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
  io: new Edison()
});

var lcd = new five.LCD({
controller: "JHD1313M1"
});

var acceleration = new five.Accelerometer({
controller: "MMA7660"
});

var temperature;
var touch;
var Buzzer;
var button;
var lcd_str;
var vibration;
var Light;
var microphone;
var xaxis;
var yaxis;
var zaxis;

board.digitalRead("4", function(data) {   touch = data ;  if(data ==1 ) {console.log("buuton pressed"); board.digitalWrite(7,0); }	});
board.digitalRead("7", function(data) {   Buzzer = data ;	});
board.digitalRead("8", function(data) {   button = data ; if(data ==1 ) {console.log("buuton pressed"); sendData();}	});
board.analogRead("A0", function(data) {   vibration = data ;	});
board.analogRead("A1", function(data) {   Light = data ;	});
board.analogRead("A2", function(data) {   temperature = data;	});
board.analogRead("A3", function(data) {   microphone = data ;	});
xaxis = acceleration.x;
yaxis = acceleration.y;
zaxis = acceleration.z;
lcd_str="";
display("",255,255);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Artik cloud send and receive 
/*

   Example of the received message with Action type:

   {
   "type":"action","cts":1451436813630,"ts":1451436813631,
   "mid":"37e1d61b61b74a3ba962726cb3ef62f1",
   "sdid”:”xxxx”,
   "ddid”:”xxxx”,
   "data":{	
	"actions":[{
		"name":"buzzor",
		"parameters":{"intensity":14}},
		{
		"name":"displaylcd",
		"parameters":{"string":"Lorem ipsum "
		}
		}]
}
   "ddtid":"dtf3cdb9880d2e418f915fb9252e267051","uid":"650xxxx”,”mv":1
   }

//status message

{
	"sensor":{
		"Light":729,
		"accelarometer":{
			"xaxis":6.7,
			"yaxis":902.851,
			"zaxis":365.873},
		"mircophone":8,
		"temperature":920,
		"vibration":480
		},
	"status":{
		"Buzzer":true,
		"button":456,
		"lcd":"bGEHyQP4yPxvWZOpaCqY6GoaP",
		"touch":377
		}
}

//action message

{	
	"actions":[{
		"name":"buzzor",
		"parameters":{"intensity":14}},
		{
		"name":"displaylcd",
		"parameters":{"string":"Lorem ipsum "
		}
		}]
}

*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Functions

function getTimeMillis(){
    return parseInt(Date.now().toString());
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function display(temp,a,b)
{
lcd.clear();
var r = a;var g = b;var b = 0;
lcd.bgColor(r, g, b);
lcd.cursor(0,0);	
lcd.print("Artik Data");
lcd.cursor(1,0);	
lcd.print(temp);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function start() {
    isWebSocketReady = false;
    ws = new WebSocket(webSocketUrl);
    ws.on('open', function() {
        console.log("WebSocket connection is open ....");
        register();
	sendData();
    });
    ws.on('message', function(data) {
         handleRcvMsg(data);
    });
    ws.on('close', function() {
        console.log("WebSocket connection is closed ....");
	exitClosePins();
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendData(){
    try{
        ts = ', "ts": '+getTimeMillis();
    var data = {
	"sensor":{
		"Light":Light,
		"accelarometer":{
			"xaxis":xaxis,
			"yaxis":yaxis,
			"zaxis":zaxis},
		"mircophone":microphone,
		"temperature":temperature,
		"vibration":vibration
		},
	"status":{
		"Buzzer":Buzzer,
		"button":button,
		"lcd":lcd_str,
		"touch":touch
		}
		};
        var payload = '{"sdid":"'+device_id+'"'+ts+', "data": '+JSON.stringify(data)+', "cid":"'+getTimeMillis()+'"}';
        console.log('Sending payload ' + payload);
        ws.send(payload, {mask: true});
    } catch (e) {
        console.error('Error in sending a message: ' + e.toString());
    }   
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function register(){
    console.log("Registering device on the WebSocket connection");
    try{
        var registerMessage = '{"type":"register", "sdid":"'+device_id+'", "Authorization":"bearer '+device_token+'", "cid":"'+getTimeMillis()+'"}';
        console.log('Sending register message ' + registerMessage + '\n');
        ws.send(registerMessage, {mask: true});
        isWebSocketReady = true;
    }
    catch (e) {
        console.error('Failed to register messages. Error in registering message: ' + e.toString());
    }    
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleRcvMsg(msg){
    var msgObj = JSON.parse(msg);
    if (msgObj.type != "action") return; //Early return;

    var actions = msgObj.data.actions;
    var actionName0 = actions[0].parameters.intensity; //assume that there is only one action in actions
    var actionName1 = actions[1].parameters.string; //assume that there is only one action in actions

    console.log("The received action is " + actionName0);
    console.log("The received action is " + actionName1);	
    display(actionName1,0,255);

    if (actionName0 == 1) {
        console.log("The buzzer is on");
	board.digitalWrite(7,1);
    }
    else if (actionName0 == 0) {
        console.log("The buzzer is off");
	board.digitalWrite(7,0);
    } else {
        console.log('Do nothing since receiving unrecognized action ' + actionName0);
        return;
    }

if(actionName1=="send")
{
console.log("sending data");
display("Data Sent",255,255);
sendData();
}

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendStateToArtikCloud(){
    try{
        ts = ', "ts": '+getTimeMillis();
        var data = {
              "state": myLEDState
            };
        var payload = '{"sdid":"'+device_id+'"'+ts+', "data": '+JSON.stringify(data)+', "cid":"'+getTimeMillis()+'"}';
        console.log('Sending payload ' + payload + '\n');
        ws.send(payload, {mask: true});
    } catch (e) {
        console.error('Error in sending a message: ' + e.toString() +'\n');
    }    
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

start();

//process.on('SIGINT', exitClosePins);

