import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "bert_toxicity")


class BertToxicityDetector:
    def __init__(self):
        print("🔄 [Detector] Initializing BERT toxicity model...")

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"❌ BERT model directory not found at: {MODEL_PATH}"
            )

        try:
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
            self.model.eval()

            self.labels = [
                "toxic",
                "severe_toxic",
                "obscene",
                "threat",
                "insult",
                "identity_hate"
            ]

            print("✅ [Detector] BERT model loaded successfully.")

        except Exception as e:
            raise RuntimeError(f"❌ Failed to load BERT model: {str(e)}")

    def predict(self, text):
        if not text or not text.strip():
            return {
                "toxicity": "neutral",
                "risk": "low",
                "category": "none",
                "flagged": False,
                "score": 0.0,
                "labels": []
            }

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=256
        )

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.sigmoid(outputs.logits)

        probs_list = probs[0].tolist()
        score = max(probs_list)

        detected_labels = [
            self.labels[i] for i, p in enumerate(probs_list) if p > 0.3
        ]

        # 🔥 LOWERED THRESHOLDS (IMPORTANT FIX)
        if score >= 0.7:
            toxicity = "toxic"
            risk = "high"
            flagged = True
            category = "severe toxicity"
        elif score >= 0.3:
            toxicity = "moderate"
            risk = "medium"
            flagged = True
            category = "offensive"
        else:
            toxicity = "clean"
            risk = "low"
            flagged = False
            category = "safe"

        return {
            "toxicity": toxicity,
            "risk": risk,
            "category": category,
            "flagged": flagged,
            "score": round(score, 4),
            "labels": detected_labels
        }


detector_instance = None


def get_detector():
    global detector_instance
    if detector_instance is None:
        detector_instance = BertToxicityDetector()
    return detector_instance
