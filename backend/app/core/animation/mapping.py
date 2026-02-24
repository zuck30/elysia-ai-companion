EMOTION_ANIMATIONS = {
    "happy": {
        "color": "#FFD700", # Gold/Yellow
        "scale": 1.1,
        "speed": 1.5,
        "particle_count": 20
    },
    "sad": {
        "color": "#4682B4", # Steel Blue
        "scale": 0.9,
        "speed": 0.5,
        "particle_count": 5
    },
    "angry": {
        "color": "#FF4500", # Orange Red
        "scale": 1.2,
        "speed": 2.0,
        "particle_count": 30
    },
    "neutral": {
        "color": "#E6E6FA", # Lavender
        "scale": 1.0,
        "speed": 1.0,
        "particle_count": 10
    },
    "loving": {
        "color": "#FF69B4", # Hot Pink
        "scale": 1.05,
        "speed": 1.2,
        "particle_count": 25
    },
    "curious": {
        "color": "#98FB98", # Pale Green
        "scale": 1.0,
        "speed": 1.3,
        "particle_count": 15
    }
}

def get_animation_params(emotion):
    return EMOTION_ANIMATIONS.get(emotion, EMOTION_ANIMATIONS["neutral"])
