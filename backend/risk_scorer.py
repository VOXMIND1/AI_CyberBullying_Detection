"""
VoxMind - Risk Scorer Utility
Converts raw confidence score to 0-100 integer + label.
"""

def calculate_score(confidence: float, category: str = "") -> int:
    """Returns a risk score from 0 to 100."""
    return min(100, round(confidence * 100))


def get_risk_label(score: int) -> str:
    """Returns HIGH / MEDIUM / LOW based on score."""
    if score >= 70:
        return "HIGH"
    elif score >= 35:
        return "MEDIUM"
    return "LOW"


def calculate_risk_score(user_id: str, score: float) -> int:
    """Generate a risk score from the model confidence.

    user_id is kept for compatibility with existing calling code.
    """
    return calculate_score(score)
