# Edison_artikcloud

Artik cloud's basic websocket data interchange with Intel Edison and android client application.

#Introduction 


# Hardware Requirements 

1) Intel Edison Board

2) Edison Arduino Breakout Board

3) Power supply 

4) Grove Kit : 

	1) Sound Sensor

	2) Temperature Sensor

	3) Piezo-vibration Sensor

	4) Light Sensor

	5) Base Shield

	6) Buzzer 

	7) Accelerometer Sensor

	8) RGB Lcd 

	9) Touch Sensor

# Hardware Connection 


# How to use the repo


Artik CLoud Steps :

	1) Create a new Device Type 				(under developer.artik.cloud)

	2) Create a new manifest for the New Device type 	(under developer.artik.cloud)

	3) Activate the manifest and device 			(under developer.artik.cloud)

	4) Create a new application 				(under developer.artik.cloud)

	5) Set the premission for the application		(under developer.artik.cloud)

	*Note : Note down the client ID and the client Secret

	6) Create a new Device 					(under artik.cloud/my)

	7) give the device a new name 				(under artik.cloud/my)

	*Note : Note down the Device ID and the Device Secret

Repo Steps  :

	1) Change the device ID and Device Secret in the /Edison_client/Edison_client.js file 

	2) Change the device ID and client ID in the /Android Client/android-simple-controller/app/src/main/java/cloud/artik/example/simplecontroller/ArtikCloudSession.java file 

	3) Run the nodejs Code on edison using "node Edison_client.js"

	4) build the android project in android sutdio and install the app on your phone

	
# References 


https://github.com/artikcloud/tutorial-iot-control-light

https://developer.artik.cloud/documentation/tutorials/your-first-android-app.html

https://developer.artik.cloud/documentation/tutorials/your-first-iot-device.html

https://developer.artik.cloud/documentation/tutorials/an-iot-remote-control.html

# License


The MIT License (MIT). See [License](https://github.com/scifiswapnil/edison_artikcloud/blob/master/LICENSE)

Copyright (c) 2016 swapnil kalhapure

