import requests
import csv
import json
from math import ceil


def parse_number(string):
    if string == u'N/A' or string == u'n/a':
        return 'N/A'
    elif string[-1] == u'B':
        return float(string[:-1]) * pow(10, 9)
    elif string[-1] == u'M':
        return float(string[:-1]) * pow(10, 6)
    else:
        return float(string)


def get_qual_datas(exchange_name):
    url = 'http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange='
    url += exchange_name
    url += '&render=download'

    res = requests.get(url)

    # Symbol, Name, Price, -, -, -, Industry
    lines = list(csv.reader(res.text.split('\n'), delimiter=',', quotechar='"'))[1:-1]
    return map(lambda l: l + [exchange_name], lines)


def get_quant_datas(symbols, batch_idx):
    start_idx = batch_idx * 1000
    end_idx = (batch_idx + 1) * 1000

    url = 'http://finance.yahoo.com/d/quotes.csv?s='
    url += '+'.join(symbols[start_idx:end_idx])
    url += '&f=j1ya2'

    res = requests.get(url)
    return map(lambda l: l.split(','), res.text.split('\n')[:-1])


def get_data():
    qual_datas = []

    qual_datas += get_qual_datas('NASDAQ')
    qual_datas += get_qual_datas('NYSE')

    symbol_idx, name_idx, price_idx, industry_idx, exchange_name_idx = 0, 1, 2, 6, 10

    symbols = map(lambda qual_data: qual_data[symbol_idx], qual_datas)
    quant_datas = []
    for batch_idx in range(int(ceil(len(symbols) / 1000.))):
        quant_datas += get_quant_datas(symbols, batch_idx)

    market_cap_idx, dividend_yield_idx, avg_volume_idx = 0, 1, 2

    collection_data = []
    for qual_data, quant_data in zip(qual_datas, quant_datas):
        collection_data.append({
            'symbol': qual_data[symbol_idx],
            'name': qual_data[name_idx],
            'price': parse_number(qual_data[price_idx]),
            'industry': qual_data[industry_idx],
            'exchange_name': qual_data[exchange_name_idx],
            'market_cap': parse_number(quant_data[market_cap_idx]),
            'dividend_yield': parse_number(quant_data[dividend_yield_idx]),
            'avg_volume': parse_number(quant_data[avg_volume_idx])
        })

    json.dump(collection_data, open('all.json', 'w'))

get_data()
