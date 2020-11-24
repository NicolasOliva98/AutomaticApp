#include <ArduinoJson.h>
#include <dht.h>
#include <SoftwareSerial.h>
dht DHT;
SoftwareSerial BTSerial(0, 1);

#define DHT11_PIN 8
int flag = 0;
void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  pinMode(2, INPUT);
  BTSerial.begin(9600);
}

void loop(){
  if (BTSerial.available() > 0) {
    char data(BTSerial.read());
    //Serial.println(data);
    if (data == 'T') {
      if (flag == 0) {
       digitalWrite(13,HIGH);
        flag = 1;
      } else {
         digitalWrite(13,LOW);
        flag = 0;
      }
    }
 }
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
    delay(1000);
}
