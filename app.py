from flask import Flask, render_template
app = Flask(__name__)


@app.route("/")
def index():
    data_json = open('all.json', 'r').read()

    return render_template('index.html', data_json=data_json)


if __name__ == "__main__":
    app.debug = True
    app.run()
