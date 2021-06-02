from flask import Flask, request, jsonify
import scratch

app = Flask(__name__)


@app.route('/classify_image', methods=['GET', 'POST'])
def classify_image():
    image_data = request.form['image_data']
    response = jsonify(scratch.classify_image(image_data))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":  # Main function for flask server
    # print("Starting Python Flask Server For Bollywood Celebrity Image Classification")
    scratch.load_saved_artifacts()
    app.run()
