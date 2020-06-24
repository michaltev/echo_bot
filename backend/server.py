from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)


@app.route('/talk/<string:text>')
def show_word(text):
    print(text)
    return jsonify(text)


@app.route('/talk', methods=['POST', 'GET'])
def talk():
    if request.method == 'POST':
        req_data = request.get_json()
        return jsonify(req_data['text'])
    else:
        return jsonify('An Error')
