import os
import sys
import cv2
import numpy as np
import tensorflow as tf

IMG_SIZE = 150

def is_xray_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    if img is None:
        return "PULMOSCAN: panic"

    img_resized = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img_normalized = img_resized / 255.0
    img_reshaped = img_normalized.reshape(1, IMG_SIZE, IMG_SIZE, 1).astype(np.float32)

    interpreter.set_tensor(input_details[0]['index'], img_reshaped)
    interpreter.invoke()

    prediction = interpreter.get_tensor(output_details[0]['index'])[0][0]
    return "PULMOSCAN: true" if prediction >= 0.5 else "PULMOSCAN: false"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('PULMOSCAN: panic')
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        print("PULMOSCAN: panic")
        sys.exit(1)

    interpreter = tf.lite.Interpreter(model_path='model/isxray.tflite')
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    result = is_xray_image(image_path)
    print(result)
