import os
import json
import time
from datetime import datetime

today = datetime.today()

def store(data):
    today = datetime.today()
    fname = today.strftime('%Y-%m-%d') + ".json"

    if os.path.exists(fname):
        #read existing file and append new data
        with open(fname,"r") as f:
            loaded = json.load(f)
        loaded.append(data)
    else:
        #create new json
        loaded = [data]

    #overwrite/create file
    with open(fname,"w") as f:
        json.dump(loaded,f)
