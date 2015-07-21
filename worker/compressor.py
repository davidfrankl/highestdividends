import json
from math import floor
from subprocess import check_output

industry_to_int_map = {
    "Finance": 0,
    "Consumer Services": 1,
    "Technology": 2,
    "Public Utilities": 3,
    "Capital Goods": 4,
    "Basic Industries": 5,
    "Health Care": 6,
    "Energy": 7,
    "Miscellaneous": 8,
    "n/a": 9,
    "Transportation": 10,
    "Consumer Non-Durables": 11,
    "Consumer Durables": 12
}


exchange_to_int_map = {
    "NYSE": 0,
    "NASDAQ": 1,
    "n/a": 2
}


def industry_to_int(industry):
    return industry_to_int_map.get(industry, 9)


def exchange_to_int(exchange):
    return exchange_to_int_map.get(exchange, 2)


def compress(line):
    as_array = line.values()
    as_array[2] = industry_to_int(as_array[2])
    as_array[6] = exchange_to_int(as_array[6])

    if isinstance(as_array[0], (int, float)):
        as_array[0] = floor(as_array[0] / 10000000) / 100

    if isinstance(as_array[7], (int, float)):
        as_array[7] = int(floor(as_array[7] / 1000))

    return as_array


def compress_data():
    data = open('all.json', 'r').readlines()
    lines = json.loads(data[0])

    compressed = map(compress, lines)
    f = open('compressed.js', 'w')
    f.write('var compressed = ')
    f.write(json.dumps(compressed))
    f.write(';')

    f.write('var industryList=["Finance","Consumer Services","Technology",')
    f.write('"Public Utilities","Capital Goods","Basic Industries",')
    f.write('"Health Care","Energy","Miscellaneous","n/a","Transportation",')
    f.write('"Consumer Non-Durables","Consumer Durables"];')

    f.write('var exchangeList=["NYSE","NASDAQ"];')

    f.write('data=compressed.map(function(e){return{market_cap:e[0],name:e[1],')
    f.write('industry:industryList[e[2]],symbol:e[3],price:e[4],')
    f.write('dividend_yield:e[5],exchange_name:exchangeList[e[6]],')
    f.write('avg_volume:e[7]}});')

    f.close()

    compressed_string = check_output(['uglifyjs', 'compressed.js'])
    open('compressed.js', 'w').write(compressed_string)

compress_data()
