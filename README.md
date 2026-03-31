🚀 VoxMind — AI Cyberbullying Detection System

Tech-Athon 2026 · Team VoxMind

## 🎥 Demo Video

👉 Watch full demo here:
🔗 https://drive.google.com/file/d/1n5-MAGPC_13_uSCxDLw63mVya7IBap82/view?usp=drivesdk


📌 Overview

VoxMind is a real-time AI-powered chat monitoring system that detects, analyzes, and prevents cyberbullying using a BERT-based toxicity detection model.

It integrates:

💬 Live chat system (Socket.IO)
🧠 AI toxicity detection (BERT)
⚠️ Risk scoring engine
📲 Real-time Telegram alerts
📊 Dashboard visualization

🎯 Key Features

🧠 AI Toxicity Detection
Uses fine-tuned BERT model
Detects:
Toxic
Severe Toxic
Obscene
Threat
Insult
Identity Hate

⚡ Real-Time Chat Monitoring
Built with Flask + Socket.IO
Instant message analysis
Multi-user chat rooms

📊 Risk Scoring System
Converts model confidence → 0–100 score
Categorizes:
🔴 HIGH
🟠 MEDIUM
🟡 LOW

🚨 Telegram Alert System
Sends alerts for harmful messages
Includes:
Sender
Message
Risk Level
Category
Timestamp

🎨 Interactive Frontend
Chat UI with user colors
Dashboard with charts
Real-time updates

🏗️ Project Structure
## 🏗️ Project Structure

```
VOXMIND/
│
├── backend/
│   ├── app.py              # Main Flask + SocketIO server
│   ├── detector.py         # BERT toxicity model logic
│   ├── risk_scorer.py      # Risk calculation logic
│   ├── alert.py            # Telegram alert system
│   └── user_history.json   # User tracking (future use)
│
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── main.js
│   │       └── charts.js
│   │
│   └── templates/
│       ├── index.html      # Chat UI
│       └── dashboard.html  # Admin dashboard
│
├── models/
│   └── bert_toxicity/      # Pretrained BERT model
│
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables (Telegram config)
```


⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/voxmind.git
cd voxmind

2️⃣ Install Dependencies

pip install -r requirements.txt

3️⃣ Setup Environment Variables

Create a .env file in root:

TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

▶️ Running the Application

python backend/app.py

Open in browser:

💬 Chat UI → http://localhost:5000
📊 Dashboard → http://localhost:5000/dashboard

🌐 Multi-User Testing (Same WiFi)

Laptop 1 → http://localhost:5000
Laptop 2 → http://YOUR_IP:5000

➡️ Both users must enter the same Room ID

🧠 AI Model Details

Model: BERT (Transformers)
Framework: transformers, torch
Input: Chat message

Output:

{
"toxicity": "toxic/moderate/clean",
"risk": "high/medium/low",
"category": "offensive/severe toxicity/safe",
"score": 0.0 - 1.0,
"labels": []
}

⚙️ Threshold Logic

> = 0.7 → HIGH risk
> = 0.3 → MEDIUM risk
> < 0.3 → LOW risk

🚨 Telegram Alert Workflow

Triggered when:

Risk level = HIGH

Includes:

👤 Sender
💬 Message
☣️ Category
📊 Toxicity %
🕐 Timestamp

🔄 System Workflow

User sends message
Message → BERT model
Model returns toxicity score
Risk score calculated
If HIGH → Telegram alert sent
Message broadcasted to room

📊 Future Enhancements (Mentor-Level Ideas)

📈 Real-time analytics dashboard (charts per user)
🧑‍💻 User behavior tracking (repeat offenders)
🔐 Admin moderation panel
🧠 Context-aware NLP (conversation-based detection)
🌍 Multi-language toxicity detection
📱 Mobile app (React Native / Flutter)
🔊 Voice chat toxicity detection
🧾 Report generation (PDF logs)


🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript
Backend: Flask, Flask-SocketIO
AI Model: BERT (Transformers, PyTorch)
Alerts: Telegram Bot API
Visualization: Chart.js

👨‍💻 Authors

Team VoxMind — Tech-Athon 2026
