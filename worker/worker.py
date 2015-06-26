import requests
import csv
import json


def parse_number(string):
    if string == u'N/A':
        return string
    elif string[-1] == u'B':
        return float(string[:-1]) * pow(10, 9)
    elif string[-1] == u'M':
        return float(string[:-1]) * pow(10, 6)
    else:
        return float(string)


def get_nyse_components():
    url = 'http://www1.nyse.com/indexes/nyaindex.csv'
    res = requests.get(url)

    # data: Name, Symbol, Country, ICB, Industry, SUP SEC, SEC, SUB SEC
    lines = res.text.split('\n')[2:-1]

    name_index, ticker_index, country_index, industry_index = 0, 1, 2, 4

    qual_datas = list(csv.reader(lines, delimiter=',', quotechar='"'))
    symbols = [l[ticker_index] for l in qual_datas]

    # data: Last Price, Market Cap, Dividend Yield, Average Daily Volume
    url1 = 'http://finance.yahoo.com/d/quotes.csv?s=' + '+'.join(symbols[:1000]) + '&f=l1j1ya2'
    url2 = 'http://finance.yahoo.com/d/quotes.csv?s=' + '+'.join(symbols[1000:]) + '&f=l1j1ya2'
    res1 = requests.get(url1)
    res2 = requests.get(url2)
    lines = res1.text + res2.text

    quant_datas = map(lambda l: l.split(','), lines.split('\n'))

    collection_data = []
    for qual_data, quant_data in zip(qual_datas, quant_datas):
        collection_data.append({
            'name': qual_data[name_index],
            'symbol': qual_data[ticker_index],
            'country': qual_data[country_index],
            'industry': qual_data[industry_index],
            'price': parse_number(quant_data[0]),
            'market_cap': parse_number(quant_data[1]),
            'dividend_yield': parse_number(quant_data[2]),
            'avg_volume': parse_number(quant_data[3])
        })

    json.dump(collection_data, open('nyse.json', 'w'))

get_nyse_components()
