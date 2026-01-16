# Arduino Line Follower Robot - Complete Beginner's Guide

একটা **Line Follower Robot** বানানো robotics এর সবচেয়ে interesting এবং educational projects এর একটি। এই tutorial তে আমি step-by-step দেখাব কিভাবে Arduino UNO দিয়ে একটা complete line follower robot বানাতে হয়।

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [How It Works](#how-it-works)
3. [Required Components](#required-components)
4. [Circuit Diagram](#circuit-diagram)
5. [Code Explanation](#code-explanation)
6. [Assembly Guide](#assembly-guide)
7. [Calibration](#calibration)
8. [Troubleshooting](#troubleshooting)
9. [Improvements](#improvements)

---

## 🤖 Introduction

Line follower robot একটা autonomous robot যা একটা line follow করে চলে। এটা IR (Infrared) sensors use করে black line detect করে white surface এ।

### Real-World Applications

- **Warehouse Automation** - Automated material transport
- **Manufacturing** - Assembly line systems
- **Hospital Systems** - Medicine delivery robots
- **AGVs (Automated Guided Vehicles)** - Industrial logistics

---

## 🧠 How It Works?

### Basic Principle

1. **IR Sensors** emit infrared light
2. **White surface** reflects বেশি light → High sensor reading
3. **Black line** absorbs বেশি light → Low sensor reading
4. **Microcontroller** decides motor direction based on sensor data

### Logic Flow

```
IF (Left sensor on black) THEN
    Turn LEFT
ELSE IF (Right sensor on black) THEN
    Turn RIGHT
ELSE IF (Both on white) THEN
    Move FORWARD
ELSE IF (Both on black) THEN
    STOP or Move FORWARD
```

---

## 🛠️ Required Components

### Electronics Components

| Component | Quantity | Specifications | Price (BDT) |
|-----------|----------|----------------|-------------|
| Arduino UNO | 1 | ATmega328P | 450-600 |
| IR Sensor Module | 2 | Digital output | 30-50 each |
| L298N Motor Driver | 1 | Dual H-Bridge | 250-350 |
| DC Motors | 2 | 6V, 200 RPM | 120-150 each |
| Wheels | 2 | 65mm diameter | 30-50 each |
| Caster Wheel | 1 | Ball bearing type | 50-80 |
| Battery Holder | 1 | 4 x AA size | 30-50 |
| AA Batteries | 4 | 1.5V each | 20 each |
| Jumper Wires | 10-15 | Male-Male, Male-Female | 50-100 |
| Chassis | 1 | Acrylic or Plastic | 150-250 |

### Tools Required

- Soldering iron
- Hot glue gun
- Screwdriver set
- Wire stripper
- Multimeter (optional)

**Total Cost:** Approximately **1,500 - 2,000 BDT**

---

## 🔌 Circuit Diagram

### Pin Connections

#### IR Sensors → Arduino
```
Left IR Sensor:
  VCC → 5V
  GND → GND
  OUT → Digital Pin 2

Right IR Sensor:
  VCC → 5V
  GND → GND
  OUT → Digital Pin 3
```

#### L298N Motor Driver → Arduino
```
Motor Driver Control Pins:
  IN1 → Digital Pin 4
  IN2 → Digital Pin 5
  IN3 → Digital Pin 6
  IN4 → Digital Pin 7
  ENA → Digital Pin 9 (PWM)
  ENB → Digital Pin 10 (PWM)

Power Connections:
  12V → Battery Positive (+6V)
  GND → Battery Negative & Arduino GND
  5V Output → Arduino VIN (optional)
```

#### Motors → L298N
```
Left Motor:
  OUT1 → Motor Terminal 1
  OUT2 → Motor Terminal 2

Right Motor:
  OUT3 → Motor Terminal 1
  OUT4 → Motor Terminal 2
```

### Circuit Diagram (ASCII Art)

```
        [Battery 6V]
             |
             ├──────┐
             |      |
        [L298N Driver]
         |  |  |  |
         |  |  |  └──→ Motor 2
         |  |  └─────→ Motor 2
         |  └────────→ Motor 1
         └───────────→ Motor 1
             |
        [Arduino UNO]
         /        \
    [IR Left]  [IR Right]
```

---

## 💻 Arduino Code

### Complete Code with Comments

```cpp
// Line Follower Robot Code
// Author: Md Akhinoor Islam
// A3KM Studio

// Define pins for IR sensors
#define LEFT_SENSOR 2
#define RIGHT_SENSOR 3

// Define pins for L298N Motor Driver
#define MOTOR_A_IN1 4
#define MOTOR_A_IN2 5
#define MOTOR_B_IN3 6
#define MOTOR_B_IN4 7
#define MOTOR_A_EN 9   // PWM pin
#define MOTOR_B_EN 10  // PWM pin

// Motor speed (0-255)
#define SPEED 150
#define TURN_SPEED 100

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(9600);
  
  // Set IR sensor pins as INPUT
  pinMode(LEFT_SENSOR, INPUT);
  pinMode(RIGHT_SENSOR, INPUT);
  
  // Set motor control pins as OUTPUT
  pinMode(MOTOR_A_IN1, OUTPUT);
  pinMode(MOTOR_A_IN2, OUTPUT);
  pinMode(MOTOR_B_IN3, OUTPUT);
  pinMode(MOTOR_B_IN4, OUTPUT);
  pinMode(MOTOR_A_EN, OUTPUT);
  pinMode(MOTOR_B_EN, OUTPUT);
  
  // Initial motor speed
  analogWrite(MOTOR_A_EN, SPEED);
  analogWrite(MOTOR_B_EN, SPEED);
  
  Serial.println("Line Follower Robot Started!");
}

void loop() {
  // Read sensor values
  int leftSensor = digitalRead(LEFT_SENSOR);
  int rightSensor = digitalRead(RIGHT_SENSOR);
  
  // Debug: Print sensor values
  Serial.print("Left: ");
  Serial.print(leftSensor);
  Serial.print(" | Right: ");
  Serial.println(rightSensor);
  
  // Decision making based on sensor readings
  if (leftSensor == LOW && rightSensor == LOW) {
    // Both sensors on white - Move forward
    moveForward();
    Serial.println("Moving Forward");
  }
  else if (leftSensor == HIGH && rightSensor == LOW) {
    // Left sensor on black - Turn left
    turnLeft();
    Serial.println("Turning Left");
  }
  else if (leftSensor == LOW && rightSensor == HIGH) {
    // Right sensor on black - Turn right
    turnRight();
    Serial.println("Turning Right");
  }
  else if (leftSensor == HIGH && rightSensor == HIGH) {
    // Both sensors on black - Stop
    stopMotors();
    Serial.println("Stopped - End of line");
  }
  
  delay(10); // Small delay for stability
}

// Function to move forward
void moveForward() {
  analogWrite(MOTOR_A_EN, SPEED);
  analogWrite(MOTOR_B_EN, SPEED);
  
  digitalWrite(MOTOR_A_IN1, HIGH);
  digitalWrite(MOTOR_A_IN2, LOW);
  digitalWrite(MOTOR_B_IN3, HIGH);
  digitalWrite(MOTOR_B_IN4, LOW);
}

// Function to turn left
void turnLeft() {
  analogWrite(MOTOR_A_EN, TURN_SPEED);
  analogWrite(MOTOR_B_EN, TURN_SPEED);
  
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, HIGH);  // Left motor backward
  digitalWrite(MOTOR_B_IN3, HIGH);
  digitalWrite(MOTOR_B_IN4, LOW);   // Right motor forward
}

// Function to turn right
void turnRight() {
  analogWrite(MOTOR_A_EN, TURN_SPEED);
  analogWrite(MOTOR_B_EN, TURN_SPEED);
  
  digitalWrite(MOTOR_A_IN1, HIGH);
  digitalWrite(MOTOR_A_IN2, LOW);   // Left motor forward
  digitalWrite(MOTOR_B_IN3, LOW);
  digitalWrite(MOTOR_B_IN4, HIGH);  // Right motor backward
}

// Function to stop motors
void stopMotors() {
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, LOW);
  digitalWrite(MOTOR_B_IN3, LOW);
  digitalWrite(MOTOR_B_IN4, LOW);
}
```

### Code Explanation

#### 1. Pin Definitions
- আমরা প্রথমে সব pins define করেছি constants হিসেবে। এতে code readable হয় এবং পরে modify করা সহজ হয়।

#### 2. Motor Speed Variables
- `SPEED` = Normal forward speed
- `TURN_SPEED` = Speed during turns (সাধারণত কম রাখা হয়)

#### 3. Setup Function
- Sensor pins কে INPUT mode এ set করা
- Motor pins কে OUTPUT mode এ set করা
- Serial communication চালু করা debugging এর জন্য

#### 4. Main Loop Logic
```
1. Sensor values read করা
2. Conditions check করা
3. Appropriate function call করা
4. Debug info print করা
```

---

## 🔧 Assembly Guide

### Step 1: Chassis Preparation
1. Acrylic/plastic chassis নাও
2. Motor mounting holes drill করো (if needed)
3. Smooth করে নাও rough edges

### Step 2: Motor Mounting
1. Motors কে chassis এর দুই পাশে fix করো
2. Wheels motors এ attach করো
3. Caster wheel সামনে বা পেছনে লাগাও

### Step 3: Electronics Mounting
1. Arduino board chassis এর উপরে mount করো (double-sided tape বা screws দিয়ে)
2. Motor driver board securely fix করো
3. Battery holder chassis এর নিচে বা পেছনে রাখো

### Step 4: IR Sensor Placement
1. Sensors chassis এর সামনে রাখো
2. Height: Surface থেকে **5-10mm** উপরে
3. Distance: Line width এর সমান বা একটু বেশি apart
4. Angle: Slightly downward (15-20 degrees)

### Step 5: Wiring
1. সব connections circuit diagram অনুযায়ী করো
2. Wires organize করো zip ties দিয়ে
3. Short circuit avoid করার জন্য insulation check করো

### Step 6: Power Connection
1. Battery holder এ batteries insert করো
2. Switch যুক্ত করো easy ON/OFF এর জন্য
3. Power connections double-check করো

---

## ⚙️ Calibration

### Sensor Calibration

1. **Testing IR Sensors:**
   ```cpp
   void testSensors() {
     Serial.print("Left: ");
     Serial.print(digitalRead(LEFT_SENSOR));
     Serial.print(" | Right: ");
     Serial.println(digitalRead(RIGHT_SENSOR));
     delay(500);
   }
   ```

2. **Adjusting Potentiometer:**
   - White surface এ sensor রেখে adjust করো যাতে LED OFF থাকে
   - Black line এ রাখলে LED ON হওয়া উচিত
   - Threshold ঠিক মত set করো

3. **Height Adjustment:**
   - Sensors খুব কাছে হলে = Too sensitive
   - Sensors দূরে হলে = Not sensitive enough
   - Ideal: 5-8mm distance

### Motor Calibration

যদি robot সোজা না চলে:

```cpp
// Adjust motor speeds individually
#define LEFT_MOTOR_SPEED 145
#define RIGHT_MOTOR_SPEED 150
```

---

## 🐛 Troubleshooting

### Problem 1: Robot Not Moving
**Solutions:**
- ✅ Battery voltage check করো (minimum 5V needed)
- ✅ Motor connections check করো
- ✅ L298N driver power LED on আছে কিনা দেখো
- ✅ Code upload হয়েছে কিনা verify করো

### Problem 2: Motors Running in Wrong Direction
**Solutions:**
- ✅ Motor wires swap করো OUT1 ↔ OUT2
- ✅ Code এ IN1/IN2 logic reverse করো

### Problem 3: Sensors Not Detecting Line
**Solutions:**
- ✅ IR sensor potentiometer adjust করো
- ✅ Sensor height check করো (5-10mm optimal)
- ✅ Line surface contrast যথেষ্ট আছে কিনা দেখো
- ✅ Ambient light sensor performance affect করছে কিনা check করো

### Problem 4: Robot Keeps Turning
**Solutions:**
- ✅ Sensor readings serial monitor এ check করো
- ✅ Both sensors properly working কিনা verify করো
- ✅ Turn speed reduce করো (`TURN_SPEED` কম করো)

### Problem 5: Robot Too Slow/Fast
**Solutions:**
```cpp
// Increase speed
#define SPEED 200  // From 150

// Or use PWM for gradual control
analogWrite(MOTOR_A_EN, 180);
```

---

## 🚀 Improvements & Advanced Features

### 1. PID Control Implementation

Basic line follower irregular movements করে। PID control smooth করে:

```cpp
// PID constants
float Kp = 1.0;
float Ki = 0.0;
float Kd = 0.5;

float error = 0;
float lastError = 0;
float integral = 0;
float derivative = 0;

void pidControl() {
  // Calculate error based on sensor readings
  // Implement PID algorithm
  // Adjust motor speeds accordingly
}
```

### 2. Add More Sensors

- 3 বা 5 IR sensors use করলে better accuracy পাওয়া যায়
- Sharp turns handle করা সহজ হয়

### 3. Speed Control

```cpp
// Variable speed based on line detection
if (onStraightLine) {
  speed = 200;  // Fast
} else if (onCurve) {
  speed = 120;  // Slow
}
```

### 4. LCD Display

Real-time data display করার জন্য:

```cpp
#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

lcd.print("Speed: ");
lcd.print(currentSpeed);
```

### 5. Bluetooth Control

- HC-05 module যুক্ত করো
- Mobile app দিয়ে control করো
- Parameters adjust করো wirelessly

---

## 📊 Performance Optimization

### Track Design Tips

1. **Line Width:** 2-3 cm (optimal)
2. **Curve Radius:** Minimum 15 cm
3. **Surface:** Matte finish (avoid glossy)
4. **Contrast:** High contrast (black on white)

### Best Practices

1. ✅ Code comment করো clearly
2. ✅ Wiring neat এবং organized রাখো
3. ✅ Components securely mount করো
4. ✅ Regular testing করো during development
5. ✅ Power switch রাখো safety এর জন্য

---

## 🎓 Learning Outcomes

এই project complete করলে তুমি শিখবে:

- ✅ Arduino programming basics
- ✅ Motor control using H-Bridge
- ✅ Digital sensor interfacing
- ✅ PWM (Pulse Width Modulation)
- ✅ Basic robotics concepts
- ✅ Debugging এবং troubleshooting
- ✅ Circuit design এবং assembly

---

## 📚 Additional Resources

### Recommended Reading
- Arduino Official Documentation
- L298N Datasheet
- IR Sensor Working Principle

### Video Tutorials
- Check my YouTube channel for detailed video guide
- Step-by-step assembly video
- Troubleshooting common issues

### Community
- Join robotics forums
- Share your projects
- Help other beginners

---

## 🎯 Conclusion

Line follower robot একটা excellent project beginners এর জন্য। এটা দিয়ে তুমি robotics এর fundamental concepts শিখতে পারবে।

**Next Steps:**
1. এই basic robot বানাও
2. Improvements implement করো
3. Competition এ participate করো
4. আরো complex projects এ move করো

**Remember:** Every expert was once a beginner. Keep experimenting! 🚀

---

**Happy Building! 🤖**

*Questions? Comments? এই post এ comment করো বা আমার সাথে যোগাযোগ করো!*

---

**Tags:** #Arduino #LineFollower #Robotics #Tutorial #Bangla #DIY #L298N #IRSensor

**Published:** January 12, 2026  
**Reading Time:** 12 minutes  
**Difficulty:** Beginner to Intermediate
