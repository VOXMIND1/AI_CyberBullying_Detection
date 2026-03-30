"""
VoxMind - Telegram Alert System
Uses .env configuration for secure token handling.
"""

import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# 🔐 Load environment variables
load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID   = os.getenv("TELEGRAM_CHAT_ID")


def send_alert(message: str, sender: str, risk: str,
               category: str = "Unknown", toxicity: int = 0, room: str = "default"):
    """
    Send a Telegram alert when harmful content is detected.
    """

    # 🛑 Check config
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[TELEGRAM] ❌ Missing token or chat ID. Check .env file.")
        return

    risk = risk.upper()

    # 🎯 Emoji mapping
    risk_emoji = {
        "HIGH": "🔴",
        "MEDIUM": "🟠",
        "LOW": "🟡"
    }.get(risk, "⚠️")

    time_now = datetime.now().strftime("%d %b %Y, %I:%M %p")

    # ⚠️ Escape special characters for MarkdownV2
    def escape(text):
        escape_chars = r"_*[]()~`>#+-=|{}.!\\"
        for ch in escape_chars:
            text = text.replace(ch, f"\\{ch}")
        return text

    message_safe  = escape(message)
    sender_safe   = escape(sender)
    category_safe = escape(category)

    # 📨 Alert message
    alert_text = f"""
🚨 *VOXMIND DANGER ALERT* 🚨

👤 *Sender:* {sender_safe}
🏠 *Room:* {room}
📩 *Message:* _{message_safe}_

━━━━━━━━━━━━━━━━━━
☣️ *Category:* {category_safe}
📊 *Toxicity Score:* {toxicity}%
{risk_emoji} *Risk Level:* {risk}
━━━━━━━━━━━━━━━━━━
🕐 *Time:* {time_now}

_VoxMind Guardian Bot is protecting your chat\\._
_Tech\\-Athon 2026 — Team VoxMind_
"""

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

    data = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": alert_text,
        "parse_mode": "MarkdownV2"
    }

    try:
        response = requests.post(url, data=data, timeout=10)

        if response.status_code == 200:
            print("✅ [TELEGRAM] Alert sent successfully!")
        else:
            print(f"❌ [TELEGRAM] Failed: {response.status_code}")
            print(response.text)

    except requests.exceptions.RequestException as e:
        print(f"❌ [TELEGRAM] Connection error: {e}")
