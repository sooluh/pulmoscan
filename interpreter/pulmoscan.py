import cv2
import numpy as np
import sys
import os
import tensorflow as tf
import json

LABELS = ['COVID19', 'TUBERCULOSIS', 'PNEUMONIA', 'NORMAL']

def load_and_preprocess_image(image_path):
    uploaded_image = cv2.imread(image_path)

    uploaded_image_gray = cv2.cvtColor(uploaded_image, cv2.COLOR_BGR2GRAY)
    resized_image = cv2.resize(uploaded_image_gray, (150, 150))

    resized_image_normalized = resized_image / 255.0
    resized_image_normalized = resized_image_normalized.reshape(1, 150, 150, 1).astype(np.float32)

    return resized_image_normalized

def predict(image_path):
    interpreter = tf.lite.Interpreter(model_path='model/pulmoscan.tflite')
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    processed_image = load_and_preprocess_image(image_path)

    interpreter.set_tensor(input_details[0]['index'], processed_image)
    interpreter.invoke()

    predictions = interpreter.get_tensor(output_details[0]['index'])
    predicted_class_index = np.argmax(predictions, axis=1)[0]
    predicted_class = LABELS[predicted_class_index]
    predicted_score = predictions[0][predicted_class_index] * 100

    return predicted_class, predicted_score

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('PULMOSCAN: panic')
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        print("PULMOSCAN: panic")
        sys.exit(1)

    predicted_class, predicted_score = predict(image_path)

    output = {
        "class": predicted_class,
        "scores": round(predicted_score, 2)
    }

    print("PULMOSCAN:", json.dumps(output))
