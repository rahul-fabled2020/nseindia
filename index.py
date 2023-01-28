import flask
from api import bank_nifty, process_nifty
# from concurrent.futures import ThreadPoolExecutor
import datetime
# import schedule
import json
# import time
from interval import setInterval

app = flask.Flask(__name__)
app.config["DEBUG"] = False

# def job():
#     process_nifty()

# def scheduler():
#     schedule.every(120).seconds.do(job)
#     while True:
#         schedule.run_pending()
#         # time.sleep(5)

@app.route('/', methods=['GET'])
def home():
    return flask.render_template("index.html")

# @app.route('/api/nseindia', methods=['GET'])
# def banknifty():
#     return bank_nifty()

@app.route("/api/load-json/<file_name>", methods=["GET"])
def load_json(file_name):
    try:
        with open(file_name, "r") as f:
            data = json.load(f)
        return flask.jsonify(data)
    except:
        return flask.jsonify({})

if __name__ == '__main__':
    # executor = ThreadPoolExecutor(max_workers=1)
    # executor.submit(scheduler)
    setInterval(120, process_nifty)
    app.run(host="0.0.0.0")
