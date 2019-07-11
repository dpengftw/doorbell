import CHIP_IO.GPIO as GPIO
import subprocess
import time
import urllib

pin = "GPIO1"
url = "<your url>"
cypher = "<your cypher api key>"

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
