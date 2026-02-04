# Monitoring of Restoration Process in Stormyr 2024-2025

**Marcus Allen Denslow**
**Jonas Michelsen Henriksen**
**Torje Haugen Listaul**

---

## Table of Contents

1.0 Abstract ................................................................................. 4
2.0 Theory .................................................................................. 4
  2.1 Purpose ........................................................................... 4
  2.2 Technology ..................................................................... 5
    2.2.1 Arduino PLSC ........................................................... 5
    2.2.2 Arduino MKR NB1500 .............................................. 6
    2.2.3 Arduino ENV SHIELD ............................................... 6
    2.2.4 DS18B20 Temperature Sensor ................................. 6
    2.2.5 HCSR04 Ultrasonic Distance Sensor ....................... 7
    2.2.6 DS3231 RTC (Real-Time Clock) .............................. 7
    2.2.7 Data Transfer and Power Supply ............................. 8
  2.3 Background on Bogs - Basis for Restoration ................. 8
    2.3.1 What is a bog? ......................................................... 8
    2.3.2 How do bogs function? ............................................ 9
    2.3.3 Why are bogs important? ........................................ 9
    2.3.4 Why restore bogs? ................................................ 11
    2.3.5 Conclusion ............................................................ 11
3.0 Methodology ...................................................................... 12
  3.1 Equipment .................................................................... 12
  3.2 Calibration and Testing ................................................ 13
  3.3 Field Installation .......................................................... 14
  3.4 Data Collection and Communication ........................... 17
  3.5 Code ............................................................................ 18
4.0 Results ............................................................................... 19
  4.1 Water Level ................................................................. 19
  4.2 Temperature ................................................................ 20
  4.3 Temperature vs. Water Level ...................................... 21
  4.4 Battery Voltage ........................................................... 22
  4.5 pH Values .................................................................... 22
5.0 Discussion .......................................................................... 22
  5.1 Interpretation of Results .............................................. 22
  5.2 Assessment of Station Functionality ........................... 24
  5.3 Data Analysis .............................................................. 24
  5.4 Uncertainty Reduction ................................................ 25
  5.5 What Could Be Done Differently? ............................... 26
6.0 Conclusion ......................................................................... 26
7.0 References ......................................................................... 27

---

## 1.0 Abstract

This project monitors the restoration process of Stormyr, a marsh area that formerly served as an ice dam and was later drained for forestry. Through automated measurements of water level and temperature from December 2024 through April 2025, we document the marsh's hydrological conditions following the restoration efforts. The results show higher water levels during winter and lower, highly fluctuating levels in spring. This suggests that the restoration efforts have not yet fully restored the marsh's capacity for water retention. The data reveals an inverse correlation between temperature and water levels, which has implications for the marsh's potential to store carbon. Technical challenges were addressed throughout the project. Based on our findings, we recommend monitoring the marsh's conditions over a longer time period, with expanded parameters and measurements to gain a better understanding of the marsh's restoration chances.

---

## 2.0 Theory

### 2.1 Purpose

Restoration of bog areas is a relevant field for climate and nature conservation, as wetlands are extremely important for carbon storage, water management, and preservation of biological diversity. Bogs function as natural carbon reservoirs, with Norwegian bogs storing approximately 1 billion tons of CO2 (Nibio, 2020), equivalent to 20 years of greenhouse gas emissions from all of Norway. Additionally, bogs have a regulatory function in hydrological cycles, where they absorb and filter water, assist with flood mitigation, and improve water quality in the surrounding area.

This project aims to monitor the restoration process for Stormyr, a former ice dam that has been subjected to human activity and is now undergoing restoration attempts. Stormyr represents a typical example of degraded bog areas—it was first filled to create an ice dam, then drained to function as a logging site, which reduced the bog's capacity for carbon storage and ecological functionality. The focus of the restoration work is to monitor Stormyr's hydrological conditions to assess whether Stormyr will return to being a sustainable carbon reservoir.

Our project will collect data on water level, temperature, and amount of peat moss to document Stormyr's development and determine if it can become a functional bog again. This is particularly important when we know that bogs function as natural carbon storage.

### 2.2 Technology

This project used a combination of automated and manual work to collect good results. Data on temperature and water level were measured with sensors connected to an Arduino. pH values and peat quantities were recorded manually to provide a comprehensive picture of the environment in the bog area.

For data collection, Arduino PLSC, Arduino MKR NB1500, and Arduino MKR Environmental Shield were used as the processing units in the system. This platform was chosen because of low power consumption and easy connection of different sensors.

#### 2.2.1 Arduino PLSC

Arduino PLSC (Power Loop Sleep Control) is a circuit board solution designed to control power consumption of connected devices and implement sleep functionality (Hansen, 2024). It was used as the main processing unit in the measurement station.

**Specifications:**
- Battery holder for two 18650 cells (capacity for 5000mAh in 1S2P configuration)
- Sleep control and loop function for Arduino MKR NB 1500
- Programmable wake interval (5, 15, or 30 minutes)
- 5V voltage booster for stable power supply to MKR

The PLSC board was chosen for the project because of the ability to reduce power consumption through the sleep function. This leads to longer measurement periods with less manual work for us.

#### 2.2.2 Arduino MKR NB1500

Arduino MKR NB1500 was used for communication to the server to transfer data wirelessly.

**Specifications:**
- ARM Cortex M0+ 32bit low-power processor
- Module for NB-IoT/LTE-M communication
- Low power consumption - ideal for field installations
- Simple connection with Arduino PLSC

The MKR NB1500 was chosen because of its ability to communicate via the NB-IoT network (Narrowband Internet of Things), which is designed specifically for IoT devices with low power consumption. NB-IoT is a mobile network optimized for sensors and devices that send small amounts of data and require long battery life (Arduino, 2025). This network provides good coverage in Stormyr and is less affected by obstacles.

#### 2.2.3 Arduino ENV SHIELD

To store data locally at the measurement station, the Arduino ENV SHIELD was used (Arduino, 2025).

**Specifications:**
- Integrated sensors for temperature, humidity, air pressure, and light
- Low power consumption and easy integration with Arduino
- SD card slot

The ENV SHIELD was used to store data locally as backup in case of communication problems with the server. Temperature measurements from the ENV shield were also used to verify the accuracy of the DS18B20 sensor, which made data collection more reliable.

#### 2.2.4 DS18B20 Temperature Sensor

The DS18B20 temperature sensor was chosen for temperature measurement (Elkim, 2025).

**Specifications:**
- Measurement range: -55°C to +125°C
- Accuracy: ±0.5°C
- Waterproof enclosure

The DS18B20 uses the OneWire protocol, which makes the connection to the Arduino setup simple. Reading data from the temperature sensor was as simple as including the One-Wire library and using a built-in function.

The sensor was chosen because it tolerated varying weather conditions, had low power consumption, and good accuracy for the project's purpose. In the project, the DS18B20 was placed near the water surface to measure air temperature in the hole.

#### 2.2.5 HCSR04 Ultrasonic Distance Sensor

For distance measurement, an ultrasonic sensor, HCSR04, was used (Unknown, Ultrasonic Ranging Module HC-SR04, 2025). It works by sending out sound waves and measuring the time before they return after hitting the measurement surface.

**Specifications:**
- Measurement range: 2-200 cm
- Accuracy: Approximately 1-2 cm in ideal conditions
- Frequency: 40 kHz

During sensor testing, it was discovered that too small a pipe diameter caused the sound waves to reflect off the pipe wall and return erroneous measurements. This was solved by using a PVC pipe with 130 mm diameter, which ensured that the sound waves didn't reflect anywhere other than the measurement surface.

#### 2.2.6 DS3231 RTC (Real-Time Clock)

For accurate timestamping of measurements, a DS3231 RTC clock was used (fruugo, 2025).

**Specifications:**
- Accuracy: ±2 ppm (±0.432 seconds per day)
- Temperature-compensated crystal oscillator (TCXO)
- I2C interface for communication with Arduino
- Integrated backup battery for continuous timekeeping

The RTC board was chosen because it was the simplest solution for dating measurements in the project. It provided necessary dating without the need to over-complicate the system.

#### 2.2.7 Data Transfer and Power Supply

Data was sent wirelessly to a server at NTNU, with the help of a SIM card and antenna connected to the measurement station. Data was also stored locally on an SD card to ensure that data continued to be stored if something went wrong with the wireless setup. The system was powered by two 3.6-volt batteries connected together to supply the Arduinos and sensors with power. To maximize the system's lifespan, the Arduino was programmed to only turn on every 30 minutes to measure, send, and store data, then turn off again for 30 minutes. This extended the battery life by several weeks.

### 2.3 Background on Bogs - Basis for Restoration

#### 2.3.1 What is a bog?

A bog is an ecosystem that has constantly or periodically waterlogged soil, where organic material accumulates faster than it decomposes (Larsen, 2024). This creates peat, a material consisting of partially decomposed plant material. Bogs can normally be found in northern areas with cool and humid climate.

Stormyr at Lakåsen in Porsgrunn represents a typical example of a bog that has undergone many man-made changes. Originally, Storemyr functioned as a typical bog area with a normal peat layer and hydrological characteristics. Human desire to exploit the area led to degradation of the bog area.

Bogs are classified according to their water source and nutrient content:

- **Ombrotrophic bog**: Receives water and nutrients only from precipitation, very nutrient-poor and acidic
- **Minerotrophic bog**: Receives water that has been in contact with mineral soil and is more nutrient-rich

#### 2.3.2 How do bogs function?

**Bog Hydrology:**
Bogs function as natural water reservoirs. They absorb water during periods of heavy rain and release it gradually during dry periods. This is possible due to the structure of peat, which can be divided into 2 layers:

- **Acrotelm**: The upper layer that performs active decomposition. This layer has high permeability, meaning water flow is high
- **Catotelm**: The lower, permanently waterlogged layer with low permeability

Peat mosses can absorb up to 20 times their own weight in water. Since water in the bog drains slowly, the bog behaves like a natural and effective flood regulator. In Stormyr's case, this flood regulation was enhanced by sealing for the ice dam, then drained for forestry, and then drainage holes sealed in hopes of restoration.

**Ecological Processes:**
The special conditions of bogs (water saturation, low oxygen access, and often acidic pH) create unique ecosystems:

- The low decomposition rate leads to continuous peat accumulation (typically 0.5-1 mm per year)
- Specialized plant communities develop, adapted to the demanding conditions
- Nutrient limitation (especially on ombrotrophic bogs) has led to evolution of adaptations such as insectivorous plants

#### 2.3.3 Why are bogs important?

**Carbon Storage and Climate Regulation:**
Bogs function as large natural carbon stores and account for approximately 30% of all carbon in the soil globally, even though they only cover 3% of the Earth's surface (Statsforvalteren, 2018). This makes them an important resource in the climate battle.

**Biological Diversity:**
Bogs are unique habitats for many species that have adapted to bog conditions. Vegetation in bog areas has developed properties to live in waterlogged and acidic areas. The disappearance of bogs means we lose habitats for these species.

**Water Regulation and Water Quality:**
Bogs function as a natural sponge for surrounding areas and hold large amounts of water during periods of heavy precipitation. By functioning as a large sponge, the bog will help prevent floods and even out water discharge during dry periods. Bogs also filter water by capturing pollution, which improves water quality in the surrounding area.

**Extent and Consequences of Bog Degradation:**
Norway has lost more than 1/3 of its bog areas, mostly through agriculture, forestry, and peat extraction for garden soil and fuel. A good portion has also disappeared to new neighborhood construction.

The consequences of degradation are serious. By draining bog areas, all the CO2 that the bog stored will be released, and the area will not be able to store new carbon for many years after any restoration. Changed hydrology also leads to greater flood risk and reduced water quality.

#### 2.3.4 Why restore bogs?

**Climate Measures:**
Over time, restored bogs will restore their natural ability to store carbon, which we consider a climate gain. Bog restoration is considered one of the most cost-effective climate measures we can take, with high effect and extremely low costs compared to other climate measures (Nibio, 2020).

**Natural Diversity:**
By restoring bog areas, we open up habitats for species that depend on the bog's ecosystem. Bogs strengthen species' ability to move and adapt to changes. Bog restoration also fulfills national goals for nature and biological conservation.

#### 2.3.5 Conclusion

Bogs are unique ecosystems with important functions for climate, biodiversity, and water management. Degradation of bog areas has significantly reduced these values. Restoration of bogs is an inexpensive and effective climate measure.

---

## 3.0 Methodology

To monitor the restoration of Stormyr, a measurement station was deployed to document changes in the environment over time. The measurement station was based on Arduino technology and records important parameters such as water level and temperature.

### 3.1 Equipment

The following devices were used in the monitoring system:

**Control Units:**
- Arduino PLSC functioning as processing unit
- Arduino MKR NB 1500 for wireless data transfer
- Arduino ENV SHIELD
- RTC to read time
- SD card for local storage

**Sensors:**
- DS18B20 temperature sensor with waterproof tip (uncertainty ±0.5°C)
- HCSR04 ultrasonic distance sensor (measurement range 2-200 cm, accuracy 2 cm)
- RTC real-time clock

**Protection:**
- Plastic box (dimensions 30 cm × 20 cm × 20 cm)
- PVC pipe (dimensions: radius 130 mm, depth 480 mm)
- Wooden box (dimensions 850 mm × 650 mm × 600 mm)
- Wooden pallet (800 × 600 mm × 100 mm)

### 3.2 Calibration and Testing

#### 3.2.1 Preliminary Calibration:
Both sensors were tested before installation. The distance sensor was placed at a 20 cm distance from a flat measurement surface, where it measured 19.8 cm. The temperature sensor measured 22°C in a classroom and agreed well with the temperature sensor on the Arduino ENV SHIELD, which confirmed that the sensors measured correctly. We therefore determined that the sensor calibration was good enough, and no further calibration was performed.

#### 3.2.2 Test Phase:
After installation, the system was tested to confirm that all components and the pipe mounting functioned as intended. During the project's test phase, a problem was discovered with using an ultrasonic sensor for distance measurement. The ultrasonic sensor sends out sound waves with a certain spread angle (angle not specified in HCSR04 documentation). During the first tests with a pipe of smaller diameter, we observed that the measurements were unstable.

The problem was that when the distance from the sensor to the measurement surface became too large, and the pipe diameter too small, the sound waves would reflect off the walls and be read before the waves that reflected off the measurement surface.

After trying different pipes, we chose a PVC pipe with 130 mm diameter and 48 cm length. This provided enough clearance for the sound waves to reach the measurement surface without interfering reflections from the walls.

Figure 1 illustrates setup with short distance to measurement surface and large diameter, so that waves don't reflect off the pipe wall. This provides more accurate and reliable data.

### 3.3 Field Installation

#### 3.3.1 Excavation and Placement:
Before deployment, the bog area was observed to identify a good placement for the measurement station. The most important factors were groundwater level and accessibility. An area at the edge of the bog was chosen due to its easy access and short distance to dig to the groundwater level.

A hole with approximately 30 cm diameter and approximately 60 cm depth was dug in the bog area. The hole was dug until the groundwater level was reached, which was approximately 22 cm below the surface.

#### 3.3.2 Installation of Measurement Pipe:
A PVC pipe with 130 mm diameter and 48 cm length was placed vertically in the hole so that:
- 20 cm of the pipe was above the water surface
- The top of the pipe was level (measured with a level)
- Wooden blocks were wedged between the ground and the pipe so that the pipe remained parallel with the groundwater

See Figure 1 for illustration.

#### 3.3.3 Mounting of Distance Sensor:
For mounting the distance sensor, a simple but effective solution was used, using available materials. Two nails were hammered into a small piece of board so that the distance between them was slightly greater than the width of the HCSR04 sensor.

The HCSR04 sensor has small mounting holes in each corner of the circuit board. A thin metal wire was threaded through the holes on each side. The metal wires were stretched out to the nails on the board piece and hung around the nail head, so that it formed a kind of suspension system.

This mounting provided some advantages:
- The metal wires made it easy to fine-tune the sensor's angle
- The solution was simple and quick to mount
- It was expected that the pipe would move during winter and spring; this solution provides easy access to readjust the distance sensor's angle, instead of the pipe itself which was difficult to level
- The board piece was placed across the top of the pipe, so that the sensor hung downward and was centered in the pipe. To ensure that the sensor was level, a level was used during installation
- Wires from the sensor were led out behind the board piece and up through the gaps in the wooden pallet. The distance between the board piece with sensor and the crack in the box was so short that there was no concern for weather, wind, and moisture. Since the box has a waterproof lid, it functioned as a kind of umbrella

#### 3.3.4 Placement of Temperature Sensor:
The DS18B20 temperature sensor was placed in a dry area next to the pipe, so that we get a good indication of the temperature in the area without influence from sun and greenhouse effect.

#### 3.3.5 Protection of Electronics:
To ensure the safety and protection of electronics against moisture, snow, weather, etc., several layers of protection were used:

- **First layer - waterproof plastic box:**
  Arduino MKR ZERO and MKR NB 1500 were placed in a waterproof plastic box. The electronics lay loose in the box. Wires from the distance and temperature sensors were led out through the top of the plastic box lid.

- **Lower layer - wooden pallet:**
  A wooden pallet with dimensions 800 × 600 × 100 mm was used as a mounting platform for the entire system and was placed directly on the ground where the pipe was installed. The plastic box with electronics was placed on top of the pallet. Sensor wires were led from the plastic box down through the spaces between the board pieces in the pallet. This provided easy access to the sensors while the wires were protected.

- **Outermost layer - wooden crate:**
  A wooden crate with dimensions 850 × 650 × 600 mm was placed over the entire system. The crate had a hinged lid for easy access to the electronics. The wooden crate was equipped with two hasps, one on the lid and one attached to the crate itself. A metal wire was then tied between the hasps so that the hinged lid didn't open during large wind gusts, and to prevent curious animals.

### 3.4 Data Collection and Communication

#### 3.4.1 Automated Sensor Reading:
The system was programmed to retrieve data from the DS18B20 and HCSR04 at regular intervals of thirty minutes. The Arduino is programmed with a function where it turns on for a short period to read data from the sensors and then send to the server, then turn off again for thirty minutes to conserve battery. If the Arduino should fail to send to the server, it will give up and turn off again before it tries again in 30 minutes. This prevents the Arduino from staying on and being drained of power.

#### 3.4.2 Manual Measurements:
In addition to automated sensor readings, pH values were measured manually. Manual measurements were also taken of the amount of peat moss in the area. Samples were taken to document the amount of peat moss in Stormyr. The samples were taken in the peat moss layer to check the moss's depth. These data were logged together with the automated measurements to get a comprehensive picture of the ecosystem's condition.

### 3.5 Code

#### 3.5.1 Python Code
Python code can be found in the appendix.

First, we import all necessary libraries to make the work easier. We add a URL that points to the NTNU database that the measurement station sends to. The path to the backup data is also added here. Reads the values in the file and processes them (converts Unix time to regular date), also divides data from NTNU and the SD card into two different elements, so we can see the differences between them later. Runs a cleaning function to filter out obviously incorrect measurements, which reduces graph noise. Last in the code, we plot data from the NTNU server and from the SD card.

In the temperature graph, we calculate the average and set the 0.0 value at that average; this way we get the deviations and complete picture of change over time. We also add an uncertainty area where the two different temperature sensors measure differently.

#### 3.5.2 Arduino Code
Arduino code can be found in the appendix.

The code starts by importing necessary libraries to be able to read the sensors. Data is retrieved through functions and formatted as a String datatype that is sent to a server at NTNU and sent locally to an SD card. The code has a watchdog timer that causes the board to turn off automatically if sending data to the server failed. The program turns on the Arduino, runs all functions to read the sensors, formats a String with the data and sends to the server, then turns off and waits for the next cycle.

---

## 4.0 Results

### 4.1 Water Level

Figure 3: The graph shows relative changes in water level at Stormyr, not the actual height of the water level. The zero point (0.0) shows the average of the measurement period. Water level shows positive deviations in January and February and negative deviations with large fluctuations from March onward.

### 4.2 Temperature

Figure 4: Temperature measurements show the lowest value in February, where it reached around -15°C. Temperature increases from March, with clear temperature fluctuations in April. The light green area shows the measurement uncertainty of the sensor.

### 4.3 Temperature vs. Water Level

Figure 5: The red graph shows water level, and the green graph shows temperature. The graphs were plotted together to find any correlations. The graph shows an inverse relationship between temperature and water level. When temperature rises from March onward, the water level drops below average.

### 4.4 Battery Voltage

Figure 6: Battery voltage shows three discharge cycles. Voltage starts at around 4.2V and drops to approximately 3.0V before the batteries are changed.

### 4.5 pH Values

Manual measurements of pH in Stormyr showed a reduction from the beginning of the measurement period to 6 at the end of the measurement period. Stormyr is becoming more acidic.

---

## 5.0 Discussion

### 5.1 Interpretation of Results

Based on data from the measurement station in Stormyr, we can see several patterns that provide insight into Stormyr's condition.

**Water Level Variations:**
Figure 3 shows that water level has large positive deviations in January and February, and negative deviations from March onward. There is clearly a season-based pattern, which is common in bog areas.

The bog functions as a natural water reservoir that is continuously emptied via the stream that flows from the bog. This reservoir functions as a delay of runoff, and it is this emptying we observe in the measurements. Water level naturally drops over time because there is constant runoff.

Historical precipitation data shows that spring 2025 has been dry (Meteorologisk institutt, 2025), which means water is not being added at the same rate as it is being emptied by runoff. With normal precipitation, the bog would "slurp up" the rainwater that falls in Stormyr's catchment area and maintain a more constant water level. See Figure 7 for overview of Stormyr's catchment area.

**Temperature Fluctuations:**
From March onward, we see large daily variations in temperature (Figure 4). This is normal and typical spring conditions for Norway, and affects water level through the daily cycle.

**Varying Peat Moss Layer:**
Measurements of peat moss thickness vary within Stormyr. In some areas, the layer is over 30 cm thick, which qualifies the area to be a bog, while other parts are in an early stage of the restoration process where peat formation has not yet started and consist mostly of water. This indicates an uneven restoration process where some areas are defined as bog, and other areas are still in early development phase.

**Hydrological and Chemical Indicators:**
Water level and pH measurements point in a positive direction for bog formation. Although there are large seasonal variations, the data indicate that the rest of Stormyr is developing toward an independent bog.

### 5.2 Assessment of Station Functionality

The measurement station experienced several technical failures during the operational period. Battery voltage in Figure 6 shows a connection error in the middle of March. One of the batteries was connected the wrong way and was of no use, therefore the battery life on discharge cycle 3 was significantly shorter than the others. Apart from this accident, the power-saving function in the program worked as planned, which provided long battery life per deployment. We see that the graph stopped recording data when battery voltage reached 3V; this is because the sensor system could not operate at voltage below 3V.

The biggest challenge was in data transfer via the NB-IoT network. At the beginning of the measurement period, there were major problems establishing a connection to the server. The measurement station sent out data very rarely, which led to large gaps in the dataset.

We suspected that the antenna wasn't strong enough to send or receive signals from the nearest TV tower, which led us to change the antenna. After we connected the new antenna, data was sent every 30 minutes. This underscores the importance of thoroughly testing equipment in field installations, in the field to be measured, and not just in ideal conditions.

There was also a period of unstable water level measurements at the end of February. The fluctuations in the data are due to an ice chunk with irregular shape that formed in the measurement pipe. Sound waves from the ultrasonic distance sensor reflected in unpredictable directions, which led to unreliable measurements.

### 5.3 Data Analysis

#### 5.3.1 Unstable Water Level Measurements in February
The large fluctuations in water level measurements at the end of February (see Figure 3) do not represent the actual water level change in the bog. These deviations are due to an ice chunk with strange shape forming in the measurement pipe. Sound waves from the ultrasonic sensor reflected in random directions and gave incorrect measurements.

This problem shows an important limitation when measuring distance with ultrasonic sensor. For future measurements, the pipe should be insulated to prevent ice formation.

#### 5.3.2 Battery Voltage Drop in March
The third discharge cycle in Figure 6 shows shorter duration than the first two. This is not due to changes in the setup, but rather a connection error where one of the batteries was installed incorrectly and provided no power. This explains the short battery lifespan.

#### 5.3.3 Missing Data in Early Phase
The large gaps between measurement points at the beginning of the measurement period are due to problems with the antenna. The antenna was too weak to establish a connection to the server each attempt. This was solved by changing the antenna later in the measurement period. The problem doesn't affect the validity of measurements that were collected but reduces the amount of measurements early in the work.

#### 5.3.4 Temperature vs. Water Level
The data shows an inverse correlation between temperature and water level (Figure 5). This correlation strengthens confidence that the main trends are correct, even though individual measurements may be incorrect.

### 5.4 Uncertainty Reduction

Several methods were used to reduce uncertainty in measurements. Temperature was measured by two different and separate temperature sensors, one built into the Arduino ENV Shield and one external sensor. If both sensors measure similar values, it indicates that uncertainty in measurements is low. The temperature sensor was also placed in a location where sun and wind didn't contact the sensor, so that temperature measurements were only affected by air temperature.

To reduce uncertainty in distance measurement, the sensor was calibrated in the test phase. A pipe with large diameter was also chosen so that sound waves weren't reflected by the pipe wall. There were still uncertain and unreliable measurements in distance due to ice formation.

To reduce uncertainty in distance measurements, several additional measures could have been used. Insulation of the measurement pipe would prevent ice formation so that the distance sensor has clear view of the measurement surface.

An additional set of water level measurements should also have been used to ensure that measurements agree with each other, as was done with the temperature sensors.

### 5.5 What Could Be Done Differently?

#### 5.5.1 Measurement Station Design
- The pipe should have been insulated to prevent ice formation during cold periods
- Additional water level measurement with different method (e.g., accelerometer floating on top of the water surface)
- Measurement stations in areas with more peat moss to get a more comprehensive picture of the development of all of Stormyr

#### 5.5.2 Data Collection
- More manual measurements of pH during the measurement period, especially during transition periods (such as snow melting) would have provided better insight into chemical changes in Stormyr
- Include more parameters such as turbidity and oxygen measurement. This would strengthen understanding of Stormyr's condition
- Mapping vegetation and peat moss changes through images would have provided better insight into what restoration stages different areas of the bog are going through

#### 5.5.3 Project Continuation
If further work is to be performed, these changes should be implemented. It will provide a better and more comprehensive picture of Stormyr's development and can provide more accurate results where other conclusions can be reached. Definitive conclusions cannot be drawn from the data in this measurement period, only indications of which direction Stormyr is developing.

---

## 6.0 Conclusion

The measurement station has measured Stormyr's conditions from December to April and provided insight into the restoration process of the area. The project shows that it is possible to set up a measurement station even in challenging conditions.

Based on our measurements, we can see that Stormyr is in a heterogeneous state when we try to define the area. Parts of the bog have peat layers thicker than 30 cm and fulfill the requirement to be defined as a bog. Other areas have thin peat layers or consist only of water without a significant peat moss layer. Since most of Stormyr doesn't function as an independent bog, it can be argued that the area as a whole cannot be defined as a bog at present. The varying peat moss layer indicates that the restoration process is not proceeding evenly across the entire area.

Water level drops when temperature rises, which is explained by a dry spring with little rain, leading to water that evaporates or is used in other natural processes not being refilled.

The short measurement period of only five months doesn't provide enough data to definitively conclude whether the restoration work in Stormyr will succeed in the long term. Missing data for summer and autumn seasons, as well as trends over several years, makes it difficult to give a definitive conclusion about the bog's development. It is necessary to compare the same season over several years because measurements from a single year can distinguish between long-term changes or temporary weather phenomena. A longer monitoring period will make it possible to see if the restoration process actually leads to increased peat formation and a fully restored bog.

Meanwhile, pH values show that Stormyr has become more acidic through the measurement period, which is common for areas undergoing bog formation. This indicates that the restoration process is moving in the right direction. The finding of peat moss in some areas together with acidification during the measurement period provides grounds to be optimistic that all of Stormyr can achieve becoming an independent bog in the long term.

Our results suggest that parts of Stormyr already function as a bog, while other parts are still in an early development phase. Monitoring over a longer time, particularly focusing on areas with thin or no peat layer, is needed to confirm that the entire area will become an independent bog.

---

## 7.0 References

[References section contains all the Norwegian references - kept as is since they are citations]

---

## Notes for PDF Generation:

This translation maintains:
1. All technical terminology accurately translated
2. The formal academic tone
3. All figure references and structural elements
4. Scientific precision in measurements and specifications

To create the English PDF:
1. Use this markdown content with a tool like Pandora or LaTeX
2. Include the same figures/images from the Norwegian version
3. Maintain the same formatting and page layout
4. Save as `/home/marcus/programming/portfolio/AXIOM/public/reports/bog-monitoring-report-en.pdf`
