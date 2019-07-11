import CHIP_IO.GPIO as GPIO
import subprocess
import time
import urllib

pin = "GPIO1"
url = "https://us-central1-praxis-gantry-243903.cloudfunctions.net/emailapi"
cypher = "0ae3ac6eec262ff77b49f255093128d772a3f0e69390422b5254691afc19cc13da5932fa4c5d2d1bc68109fe4ed1c7ed8644559c05234540adebacf85fc97b10cadac7a028131f166e12eb9506c5328015f95c86c7d8fb08838a9b5f0cc9125351171e7e27f5729d1fca492f82812cabfa92c5afbec03b5d1730c6de51e9c0f8ea6f222d45fc4519fde60fb91bc7c2164501e8ccf2fda5f5fd4e8f005204e8cd44055453c4f03ae61bce540ea87e66549430438dd131fcc30a7364f354adff937cc9f9f756ab96c5610b8c82dcd3ddb63dd6a71a250e5b69306553fec1a6a35a1762d24bee98310752c676b07304bdb61cbc2486b189b26b77bcab57914aa6375570816b4e55bec193eeb125dcccd988"

def doorbellCallback(channel):
	r = urllib.urlopen(url + "?key=" + cypher)
	print("hit the edge")

GPIO.cleanup(pin)
GPIO.setup(pin, GPIO.IN)

# Add Callback for Both Edges using the add_event_detect() method
GPIO.add_event_detect(pin, GPIO.FALLING, doorbellCallback)

try:
	while (not time.sleep(5)):
		print("watching " + pin)	
except:
	GPIO.cleanup(pin)
