#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>

//WiFi Configaration
const char* ssid = "DSH HYDERABAD";
const char* password = "Draper@Hyderabad";

//Server Configaration
WiFiServer server(5000);

//DHT22 Configaration
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

//MQ135 Configaration
#define MQ135_PIN 34

//Status Variables
bool wifiConnected = false;
String waterLevelData = "0.0"; 
float temperature = 25.5;
float humidity = 60.0;
int airQuality = 500;

WiFiClient client;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println(" ESP32 Weather Station Starting...");
  Serial.println("===============================================");

  //DHT sensor
  dht.begin();
  Serial.println("DHT22 sensor initialized");

  //WiFi
  connectToWiFi();

  // Start server for receiving
  server.begin();
  Serial.println(" Wi-Fi receiver started on port 5000");

  Serial.println(" Setup complete - Starting main loop");
  Serial.println("===============================================");
}

//WiFi Connection Function
void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  Serial.print("Network: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(1000);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println();
    Serial.println("WiFi Connected Successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("WiFi connection failed!");
    wifiConnected = false;
  }
  Serial.println();
}

//Read All Sensors
void readAllSensorData() {
  Serial.println("Reading sensor data...");

  //DHT22 sensor
  float tempReading = dht.readTemperature();
  float humidityReading = dht.readHumidity();

  if (!isnan(tempReading) && !isnan(humidityReading)) {
    temperature = tempReading;
    humidity = humidityReading;
    Serial.println("   Temperature: " + String(temperature, 1) + "°C");
    Serial.println("   Humidity: " + String(humidity, 1) + "%");
  } else {
    Serial.println("   DHT22 reading failed - using previous values");
  }

  //MQ135 air quality sensor
  airQuality = analogRead(MQ135_PIN);
  Serial.println("   Air Quality: " + String(airQuality));

  // Wi-Fi water-level data from ESP8266
  if (server.hasClient()) {
    client = server.available();
    if (client.connected()) {
      String btData = client.readStringUntil('\n'); 
      btData.trim();
      if (btData.length() > 0) {
        waterLevelData = btData;
      }
    }
  }

  Serial.println("   Water Level: " + waterLevelData + " ft");
}

//JSON Payload
String buildJSON() {
  String json = "{";
  json += "\"device_id\":\"Node_Provider_1\",";
  json += "\"timestamp\":" + String(millis()) + ",";
  json += "\"sensors\":{";
  json += "\"temperature_c\":" + String(temperature, 1) + ",";
  json += "\"humidityPercent\":" + String(humidity, 1) + ",";
  json += "\"waterLevel_ft\":\"" + waterLevelData + "\",";
  json += "\"airQuality\":" + String(airQuality);
  json += "},";
  json += "\"location\":{";
  json += "\"lat\":17.384300,";
  json += "\"lon\":78.458298";
  json += "}";
  json += "}";
  return json;
}

//Send Data to Server
void sendDataToServer() {
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) {
    Serial.println(" WiFi not connected - cannot send data");
    return;
  }

  Serial.println("Sending data to server...");
  String jsonPayload = buildJSON();
  Serial.println("JSON Data:");
  Serial.println(jsonPayload);
  Serial.println("Size: " + String(jsonPayload.length()) + " bytes");

  WiFiClientSecure secureClient;
  secureClient.setInsecure(); 
  secureClient.setTimeout(15000);

  HTTPClient http;
  http.setTimeout(15000);

  if (http.begin(secureClient, "https://weathernet-beta.vercel.app/api/storedata")) {
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);
    Serial.print(" Response Code: ");
    Serial.println(httpResponseCode);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Server Response:");
      Serial.println(response);
    }
    http.end();
  } else {
    Serial.println("Failed to begin HTTP connection!");
  }

  secureClient.stop();
  Serial.println();
}

//Main Loop
void loop() {
  static int cycleCount = 0;
  cycleCount++;

  Serial.println(" Cycle #" + String(cycleCount) + " - Starting data collection...");
  Serial.println("===============================================");

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(" WiFi disconnected! Reconnecting...");
    connectToWiFi();
  }

  readAllSensorData();
  sendDataToServer();

  Serial.println("===============================================");
  Serial.println("Wait 10 secs for next cycle...");
  Serial.println();

  delay(10000);
}
