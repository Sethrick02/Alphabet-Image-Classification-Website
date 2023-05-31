from flask import Flask, jsonify, request, render_template
import tensorflow.keras as keras
from PIL import Image
import numpy as np
import os
import tempfile

app = Flask(__name__)


def load_model():
    model = keras.models.load_model('model/alphabet_model.h5')
    return model


def predict_image(filepath):
    model = load_model()
    img = Image.open(filepath).convert('L')
    img = img.resize((28, 28))
    # Rotate the image as it was done in training
    img = np.rot90(np.array(img), -1)
    img = img / 255.0
    img = img.reshape(1, 28, 28, 1)  # add the channels dimension
    prediction = model.predict(img).tolist()[0]
    return prediction.index(max(prediction))


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['file']
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp:
            file.save(temp.name)
            prediction = predict_image(temp.name)
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
