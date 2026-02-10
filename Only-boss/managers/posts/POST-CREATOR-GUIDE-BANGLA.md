# 📱 A3KM Studio - Blog Post Creator ব্যবহার গাইড

## 🎯 এটা কি?

এটা Facebook এর মতো একটা simple post creator! তুমি এখানে simply লিখবে, image/video add করবে, আর "Publish" button এ click করবে। ব্যস! তোমার post publish হয়ে যাবে!

---

## 🚀 কিভাবে Post লিখবে?

### Step 1: Page Open করো
Browser এ এই file টা open করো:
```
Only-boss/managers/posts/create-post.html
```

### Step 2: Title লিখো
প্রথম box এ তোমার post এর title লিখো:
```
উদাহরণ: "আমার প্রথম Arduino Project - LED Blink"
```

### Step 3: Category Select করো
Dropdown থেকে category বেছে নাও:
- Arduino Projects
- SolidWorks & CAD
- Electronics
- Programming
- Tutorial & How-To
- Project Showcase
- Campus Life
- Personal Stories
- Career Advice

### Step 4: তোমার কথা লিখো (Main Content)
বড় text box এ যা খুশি লিখো! ঠিক Facebook এর মতো:

```
উদাহরণ:

আজকে আমি Arduino দিয়ে LED blink করানো শিখেছি! 💡

প্রথমে circuit টা setup করলাম:
- Arduino UNO board নিলাম
- একটা LED আর 220Ω resistor
- Breadboard এ connect করলাম

তারপর code লিখলাম...
```

**Tips:**
- Enter press করলে নতুন line হবে
- Bangla/English দুইটাই লিখতে পারবে
- Emoji use করতে পারবে! 😊🎉
- যত বড় খুশি লিখতে পারবে

### Step 5: Image/Video Add করো (Optional)

#### 📷 Photo Upload করতে:
1. "Photo" button এ click করো
2. তোমার computer থেকে image select করো
3. একসাথে multiple images select করতে পারবে!
4. Preview দেখতে পাবে

#### 🎥 YouTube Video Add করতে:
1. "Video" button এ click করো
2. YouTube video এর link paste করো
   ```
   Example: https://youtube.com/watch?v=abc123
   ```
3. "Add Video" বাটনে click করো

#### 🖼️ Image Gallery বানাতে:
1. "Gallery" button এ click করো
2. অনেকগুলো photos একসাথে select করো
3. সব photos একটা gallery হিসেবে show হবে

### Step 6: Tags Add করো (Optional)
Tags box এ tag লিখে Enter press করো:
```
উদাহরণ:
- arduino (Enter)
- led (Enter)
- tutorial (Enter)
- bengali (Enter)
```

### Step 7: Short Summary লিখো
একটা short description লিখো (optional):
```
"এই post এ আমি Arduino দিয়ে LED blink করানো শিখাচ্ছি"
```

### Step 8: Publish করো!
1. "Preview" button এ click করে দেখো সব ঠিক আছে কিনা
2. "Publish Post" button এ click করো
3. সবুজ success message দেখতে পাবে! ✅

---

## 🎨 Example Post

### Title:
```
আমার Arduino Line Follower Robot
```

### Category:
```
Arduino Projects
```

### Content:
```
আসসালামু আলাইকুম! 👋

আজকে আমি একটা line follower robot বানালাম Arduino দিয়ে। এটা অনেক interesting একটা project ছিল!

## যা যা লাগবে:
- Arduino UNO
- 2x IR sensors
- 2x DC motors
- Motor driver (L298N)
- Battery
- Chassis

## Circuit Setup:
প্রথমে IR sensors দুইটা সামনে লাগালাম। এরা black line detect করবে।

তারপর motors গুলো motor driver এর সাথে connect করলাম। Arduino থেকে motor driver কে control করব।

## Code:
আমি একটা simple logic use করলাম:
- যদি left sensor black line দেখে, right motor তে power বেশি
- যদি right sensor black line দেখে, left motor তে power বেশি
- দুইটা sensor white দেখলে, straight যাবে

## Result:
Robot টা perfect কাজ করছে! 🎉
```

### Tags:
```
arduino, robotics, line-follower, electronics, tutorial
```

### Summary:
```
Arduino দিয়ে line follower robot বানানোর complete guide। Circuit, code, এবং troubleshooting tips সহ!
```

### Media:
- Upload circuit এর photo
- Upload final robot এর photo
- Add YouTube video link (যদি video বানিয়ে থাকো)

---

## 💡 Tips & Tricks

### ✅ Do's:
- Clear এবং descriptive title লিখো
- ভালো photos use করো (600px+ width best)
- Code থাকলে সেটা properly লিখো
- Bangla আর English mix করতে পারো
- Emoji use করো মজার করার জন্য! 😊

### ❌ Don'ts:
- খুব ছোট title দিও না
- Very low quality image avoid করো
- Blank content publish করো না
- Spam tags দিও না

---

## 🔄 Post Edit করতে চাইলে?

এখনই edit feature নেই, but আসছে শীঘ্রই! 
এখনকার জন্য:
1. নতুন post create করো
2. পুরানো post টা delete করো (manually)

---

## 📂 তোমার Posts কোথায় Save হয়?

এখন temporarily **localStorage** এ save হচ্ছে (browser এ)।

পরে আমরা add করব:
- ✅ GitHub integration (automatic save)
- ✅ Online database
- ✅ Cloud storage for images

---

## 🐛 সমস্যা হলে?

### Image upload হচ্ছে না?
- File size 5MB এর কম রাখো
- JPG, PNG format use করো
- Browser refresh করে try করো

### Video show হচ্ছে না?
- YouTube link সঠিক আছে কিনা check করো
- Format: `https://youtube.com/watch?v=VIDEO_ID`

### Post publish হচ্ছে না?
- Title আর Content দুইটাই লিখেছো কিনা check করো
- Category select করেছো কিনা check করো
- Browser console এ error আছে কিনা দেখো (F12 press করো)

---

## 🎉 সফলতার গল্প!

এই simple system দিয়ে তুমি এখন:
✅ Facebook এর মতো সহজে post লিখতে পারবে
✅ কোনো coding জানা লাগবে না
✅ Image, video, gallery সব add করতে পারবে
✅ Professional looking blog posts বানাতে পারবে
✅ Bangla তে লিখতে পারবে freely

---

## 📞 Questions?

কোনো প্রশ্ন বা সাহায্য লাগলে:
- GitHub Issue খোলো
- Email করো: [your-email]
- Or just ask me! 😊

---

**Happy Blogging! ✍️🎉**

**Made with ❤️ by Md Akhinoor Islam**  
**A3KM Studio - 2026**
