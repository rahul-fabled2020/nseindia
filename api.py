import requests
import json
from file import store
from datetime import datetime
import time

import constant


def bank_nifty(symbol='BANKNIFTY'):
  headers = \
      {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8'}
  url = "https://www.nseindia.com/api/option-chain-indices?symbol="+symbol

  if symbol != constant.symbols.get("BANKNIFTY"):
    url = "https://www.nseindia.com/api/"+ "option-chain-equities?symbol="+symbol

  print(url)

  json_obj = requests.get(url, headers=headers).json()

  return json_obj

def process_nifty(symbol='BANKNIFTY', range = 300):
  records = bank_nifty(symbol)
  data = records["filtered"]["data"]
  expiryDate = data[0]["CE"]["expiryDate"]
  underlying = records["records"]["data"][0]["CE"]["underlying"]
  underlyingValue = records["records"]["data"][0]["CE"]["underlyingValue"]

  ceChangeInOpenInterests = list(filter(lambda x: x or 0, [stock["CE"]["changeinOpenInterest"] for stock in filter(lambda x: x["strikePrice"] >= underlyingValue - range, data)]))
  peChangeInOpenInterests = list(filter(lambda x: x or 0, [stock["PE"]["changeinOpenInterest"] for stock in filter(lambda x: x["strikePrice"] <= underlyingValue + range, data)]))
  ceCOITotal = sum(ceChangeInOpenInterests) if ceChangeInOpenInterests else 0
  peCOITotal = sum(peChangeInOpenInterests) if peChangeInOpenInterests else 0

  data = {}
  data["timestamp"] = int(datetime.now().timestamp() * 1000)
  data["expiryDate"] = expiryDate
  data["underlying"] = underlying
  data["underlyingValue"] = underlyingValue
  data["ceCOITotal"] = ceCOITotal
  data["peCOITotal"] = peCOITotal
  data["symbol"] = symbol

  print(data)
  store(data)

def fetchAndStoreNiftyData():
  for symbol in constant.symbols.values():
    try:
      process_nifty(symbol, 100)
    except:
      pass
    # time.sleep(10)
