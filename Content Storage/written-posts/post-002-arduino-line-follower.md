# Arduino Line Follower Robot - Complete Build Guide

Building a line follower robot is one of the most exciting Arduino projects for beginners. In this comprehensive guide, I'll walk you through everything from components to code, with troubleshooting tips along the way.

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Components Required](#components-required)
3. [How It Works](#how-it-works)
4. [Circuit Diagram](#circuit-diagram)
5. [Arduino Code](#arduino-code)
6. [Assembly Instructions](#assembly-instructions)
7. [Calibration](#calibration)
8. [Troubleshooting](#troubleshooting)
9. [Improvements](#improvements)

## 🤖 Introduction

A line follower robot is an autonomous vehicle that follows a line (usually black on white surface or vice versa) using infrared sensors. This project teaches you:

- ✅ Sensor interfacing
- ✅ Motor control
- ✅ Logic implementation
- ✅ Real-world robotics concepts

**Difficulty Level:** Intermediate  
**Build Time:** 3-4 hours  
**Cost:** ~৳1500-2000 BDT

## 🛠️ Components Required

### Essential Components

| Component | Quantity | Price (approx) |
|-----------|----------|----------------|
| Arduino UNO | 1 | ৳450 |
| IR Sensor Module | 2-5 | ৳50 each |
| DC Motors (200 RPM) | 2 | ৳150 each |
| Motor Driver (L298N) | 1 | ৳250 |
| Robot Chassis | 1 | ৳200 |
| Wheels | 2 | ৳50 each |
| Castor Wheel | 1 | ৳30 |
| 7.4V Li-ion Battery | 1 | ৳400 |
| Jumper Wires | 20-30 | ৳50 |
| Breadboard (optional) | 1 | ৳80 |

### Optional But Recommended

- Battery holder with switch
- Double-sided tape or hot glue
- Cable ties for cable management
- LED indicators (for debugging)

## ⚙️ How It Works

### Basic Principle

1. **IR Sensors** emit infrared light
2. **White surfaces reflect** IR light → Sensor detects HIGH
3. **Black lines absorb** IR light → Sensor detects LOW
4. **Arduino reads** sensor values
5. **Motor driver controls** motors based on sensor input

### Logic Flow

```
If both sensors on white → Move Forward
If left sensor on black  → Turn Right
If right sensor on black → Turn Left
If both sensors on black → Stop (end of line) or sharp turn
```

## 🔌 Circuit Diagram

### Connections

**IR Sensors to Arduino:**
```
Left Sensor OUT  → Arduino Pin 2
Right Sensor OUT → Arduino Pin 3
Sensor VCC       → Arduino 5V
Sensor GND       → Arduino GND
```

**L298N Motor Driver to Arduino:**
```
IN1 → Arduino Pin 5
IN2 → Arduino Pin 6
IN3 → Arduino Pin 9
IN4 → Arduino Pin 10
ENA → Arduino Pin 11 (PWM)
ENB → Arduino Pin 12 (PWM)
```

**L298N to Motors:**
```
OUT1, OUT2 → Left Motor
OUT3, OUT4 → Right Motor
```

**Power Supply:**
```
L298N 12V  → Battery (+)
L298N GND  → Battery (-) and Arduino GND
Arduino VIN → 7.4V (from L298N 5V regulator or separate)
```

### ⚠️ Important Notes

- Use common ground for Arduino and motor driver
- Don't power motors directly from Arduino
- Check motor driver voltage ratings
- Use PWM pins for speed control

## 💻 Arduino Code

### Complete Code with Comments

```cpp
/*
 * Line Follower Robot
 * Author: Md Akhinoor Islam
 * Date: January 2026
 * Description: 2-sensor line follower with speed control
 */

// Pin Definitions
#define LEFT_SENSOR 2
#define RIGHT_SENSOR 3

#define IN1 5
#define IN2 6
#define IN3 9
#define IN4 10
#define ENA 11
#define ENB 12

// Speed Settings
const int NORMAL_SPEED = 150;  // 0-255
const int TURN_SPEED = 120;
const int FAST_SPEED = 200;

void setup() {
  // Initialize sensor pins
  pinMode(LEFT_SENSOR, INPUT);
  pinMode(RIGHT_SENSOR, INPUT);
  
  // Initialize motor pins
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  
  // Start serial for debugging
  Serial.begin(9600);
  Serial.println("Line Follower Started!");
  
  delay(2000);  // Wait 2 seconds before starting
}

void loop() {
  // Read sensor values
  int leftSensor = digitalRead(LEFT_SENSOR);
  int rightSensor = digitalRead(RIGHT_SENSOR);
  
  // Debug output
  Serial.print("Left: ");
  Serial.print(leftSensor);
  Serial.print(" | Right: ");
  Serial.println(rightSensor);
  
  // Decision Logic
  if (leftSensor == HIGH && rightSensor == HIGH) {
    // Both on white - Move Forward
    moveForward();
  }
  else if (leftSensor == LOW && rightSensor == HIGH) {
    // Left on black - Turn Right
    turnRight();
  }
  else if (leftSensor == HIGH && rightSensor == LOW) {
    // Right on black - Turn Left
    turnLeft();
  }
  else {
    // Both on black - Stop or sharp turn
    stopRobot();
  }
  
  delay(10);  // Small delay for stability
}

// Movement Functions
void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, NORMAL_SPEED);
  analogWrite(ENB, NORMAL_SPEED);
}

void turnLeft() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 0);
  analogWrite(ENB, TURN_SPEED);
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, TURN_SPEED);
  analogWrite(ENB, 0);
}

void stopRobot() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}
```

## 🔧 Assembly Instructions

### Step 1: Mount Components on Chassis
1. Attach motors to chassis
2. Mount Arduino on top with spacers
3. Place motor driver nearby
4. Install IR sensors at front (2-3cm above ground)

### Step 2: Wiring
1. Connect motors to L298N
2. Wire IR sensors to Arduino
3. Connect motor driver to Arduino
4. Add power connections
5. Use cable ties for neat wiring

### Step 3: Battery Placement
1. Mount battery at rear for balance
2. Add on/off switch
3. Secure with velcro or tape

## 🎯 Calibration

### Sensor Height
- Keep sensors **2-3cm** above the surface
- Too low → scratching, too high → poor detection

### Sensor Sensitivity
Most IR sensors have a potentiometer:
- Adjust until LED lights up on black, off on white
- Test on your actual track surface

### Speed Tuning
```cpp
// Adjust these values based on your track
const int NORMAL_SPEED = 150;  // Start with 150
const int TURN_SPEED = 120;     // Start with 120
```

Lower values = slower but more accurate  
Higher values = faster but may miss turns

## 🐛 Troubleshooting

### Problem: Robot doesn't move

**Solutions:**
- Check battery voltage (should be 7-9V)
- Verify motor driver connections
- Test motors separately
- Check if ENA/ENB are HIGH

### Problem: Robot moves but doesn't follow line

**Solutions:**
- Calibrate IR sensors
- Check sensor placement and height
- Reverse motor wires if going backwards
- Adjust sensor polarity in code

### Problem: Robot is too fast/slow

**Solutions:**
- Modify `NORMAL_SPEED` value
- Use PWM for better control
- Check battery voltage
- Add weight for stability

### Problem: Robot oscillates on line

**Solutions:**
- Add more sensors (3 or 5 is better)
- Implement PID control
- Reduce speed
- Smoother turning logic

## 🚀 Improvements & Next Steps

### Use 5 Sensors
More sensors = better line tracking
```cpp
// Center, Left, Far Left, Right, Far Right
```

### PID Control
For smooth, fast line following:
- P: Proportional to error
- I: Integral of error
- D: Derivative of error

### Add Speed Control
- Slow down on curves
- Speed up on straight lines
- Use encoder feedback

### Wireless Control
- Add Bluetooth module (HC-05)
- Smartphone app control
- Emergency stop feature

## 📹 Testing Your Robot

### Test Track Setup
1. Use **black electrical tape** (2-3cm wide)
2. **White surface** (paper, floor, poster board)
3. Start with **simple curves**
4. Add **sharp turns** gradually
5. Test **intersections** last

### Testing Checklist
- ✅ Moves forward on line
- ✅ Turns left correctly
- ✅ Turns right correctly
- ✅ Handles curves smoothly
- ✅ Doesn't fall off track
- ✅ Completes full circuit

## 💡 Pro Tips

1. **Always calibrate** sensors before testing
2. **Start slow**, increase speed gradually
3. **Common ground** is crucial
4. **Use fresh batteries** for consistent behavior
5. **Add LED indicators** for debugging
6. **Cable management** prevents shorts
7. **Test components** individually first

## 📚 Learn More

### Recommended Resources
- Arduino Official Documentation
- Robot Building for Beginners
- PID Control Tutorials
- Advanced Line Following Algorithms

### My Other Arduino Projects
- Obstacle Avoiding Robot
- Bluetooth Controlled Car
- Ultrasonic Distance Meter
- Temperature Monitoring System

## 🎓 Conclusion

Building a line follower robot is an excellent way to learn robotics fundamentals. You've learned about:

- ✅ Sensor integration
- ✅ Motor control
- ✅ Logic programming
- ✅ Hardware debugging

**Next Challenge:** Try implementing PID control for even smoother line following!

## 📬 Questions or Issues?

Feel free to reach out:
- 📧 mdakhinoor14@gmail.com
- 🐙 GitHub: [@Akhinoor14](https://github.com/Akhinoor14)

Happy Building! 🤖✨

---

*Published: January 12, 2026*  
*Category: Arduino Projects*  
*Reading Time: 12 minutes*  
*Tags: #arduino #robotics #tutorial #electronics*
