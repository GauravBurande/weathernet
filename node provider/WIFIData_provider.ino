#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define TRIG_PIN D5
#define ECHO_PIN D6

const char* ssid = "YOUR_WIFI_SSID";          // replace with your Wi-Fi SSID
const char* password = "YOUR_WIFI_PASSWORD";  // replace with your Wi-Fi password
const char* server = "http://ESP32_IP:5000/data"; // replace with ESP32 IP + endpoint

long duration;
float distance;

float getDistanceCM() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2; // distance in cm
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);

  int wifi_attempts = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    wifi_attempts++;
    if (wifi_attempts > 20) { // wait max 10 seconds
      Serial.println("\nFailed to connect to Wi-Fi. Check credentials!");
      break;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi connected!");
    Serial.print("ESP8266 IP: ");
    Serial.println(WiFi.localIP());
  }
}

void loop() {
  distance = getDistanceCM();
  float distanceFeet = distance / 30.48;
  float waterLevel = 3.0 - distanceFeet;
  if (waterLevel < 0) waterLevel = 0;

  // Print debug info
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.print(" cm | ");
  Serial.print(distanceFeet, 2);
  Serial.print(" ft | Water Level: ");
  Serial.print(waterLevel, 2);
  Serial.println(" ft");

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, server);   // Use WiFiClient + URL
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"water_level_ft\": " + String(waterLevel, 2) + "}";
    int responseCode = http.POST(payload);

    if (responseCode > 0) {
      Serial.print("Data sent! Response code: ");
      Serial.println(responseCode);
    } else {
      Serial.print("Error sending data: ");
      Serial.println(http.errorToString(responseCode));
    }

    http.end();
  } else {
    Serial.println("Wi-Fi disconnected. Retrying...");
  }

  delay(15000); // send every 15 seconds
}
