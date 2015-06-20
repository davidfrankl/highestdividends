from flask import Flask, render_template
app = Flask(__name__)


@app.route("/")
def hello():
    data = [
        {
            'name': 'Apple',
            'symbol': 'AAPL',
            'market_cap': '700',
            'yield': '1.3'
        },
        {
            'name': 'Boeing',
            'symbol': 'BA',
            'market_cap': '500',
            'yield': '5.3'
        }
    ]

    return render_template('index.html', data=data)


if __name__ == "__main__":
    app.debug = True
    app.run()
