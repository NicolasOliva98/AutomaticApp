#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include <dht.h>

dht DHT;
#define DHT11_PIN 8

void setup(){
    Serial.begin(9600);
    pinMode(LED_BUILTIN, OUTPUT);
    pinMode(2,INPUT);
}

void loop()
{
  StaticJsonDocument<200> doc;
  DHT.read11(DHT11_PIN);
 
  float temp = DHT.temperature;
  float humedad = DHT.humidity;
  int val = analogRead(A0);


  doc["humedad"] =  humedad;
  doc["suelo"] =  val;
  doc["temperatura"] = temp;

  
  serializeJson(doc, Serial);
  Serial.println();
  delay(2000);
}
