from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

from detector import get_detector
from risk_scorer import calculate_risk_score, get_risk_label
from alert import send_alert

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)

socketio = SocketIO(app, cors_allowed_origins="*")

connected_users = {}

print("🚀 Starting VoxMind Backend...")

# Load model
detector = get_detector()
print("✅ Model ready.")


def get_room_users(room):
    return [u for u in connected_users.values() if u["room"] == room]


@app.route("/")
def home():
    return render_template("index.html")


@socketio.on("join")
def handle_join(data):
    name = data.get("name", "Anonymous")
    color = data.get("color", "#00a884")
    room = data.get("room", "default-room")
    sid = request.sid

    join_room(room)
    connected_users[sid] = {"name": name, "color": color, "room": room}

    emit("system", {
        "text": f"{name} joined the room.",
        "users": get_room_users(room)
    }, room=room)


@socketio.on("message")
def handle_message(data):
    try:
        text = data.get("text", "")
        sender = data.get("sender", "Anonymous")
        color = data.get("color", "#00a884")
        room = data.get("room", "default-room")

        print(f"\n📩 Message: {text}")

        result = detector.predict(text)
        print("🧠 MODEL OUTPUT:", result)

        risk_score = calculate_risk_score(sender, result["score"])
        risk_label = get_risk_label(risk_score)

        if result["risk"] == "high":
            send_alert(
                message=text,
                sender=sender,
                risk=risk_label,
                category=result["category"],
                toxicity=int(result["score"] * 100),
                room=room
            )

        response = {
            "text": text,
            "sender": sender,
            "color": color,
            "room": room,
            "flagged": result["flagged"],
            "cat": result["category"],
            "tox": int(result["score"] * 100),
            "risk": risk_label,
            "ts": __import__("datetime").datetime.now().strftime("%H:%M")
        }

        emit("message", response, room=room)

    except Exception as e:
        print("❌ ERROR:", str(e))
        emit("error", {"error": str(e)})


@socketio.on("disconnect")
def handle_disconnect():
    sid = request.sid
    user = connected_users.pop(sid, None)
    if user:
        leave_room(user["room"])
        emit("system", {
            "text": f"{user['name']} left the room.",
            "users": get_room_users(user["room"])
        }, room=user["room"])


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
