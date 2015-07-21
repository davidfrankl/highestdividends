var Backbone = require('backbone'),
    Dispatcher = require('./dispatcher');

var Stocks = Backbone.Collection.extend({
  sortField: 'dividend_yield',
  sortMultiplier: 1,
  displayedExchanges: {
    'NASDAQ': true,
    'NYSE': true
  },

  textComparator: function (aVal, bVal) {
    aVal = aVal.toLowerCase();
    bVal = bVal.toLowerCase();

    if (bVal > aVal) {
      return this.sortMultiplier;
    } else if (bVal === aVal) {
      return 0;
    } else {
      return -1 * this.sortMultiplier;
    }
  },

  numericComparator: function (aVal, bVal) {
    if (aVal === bVal) {
      return 0;
    } else if (aVal === 'N/A') {
      return 1;
    } else if (bVal === 'N/A') {
      return -1;
    }

    return (bVal - aVal) * this.sortMultiplier;
  },

  comparator: function (a, b) {
    var aVal = a.get(this.sortField);
    var bVal = b.get(this.sortField);

    if (isNaN(aVal) && isNaN(bVal)) {
      return this.textComparator(aVal, bVal);
    } else {
      return this.numericComparator(aVal, bVal);
    }
  },

  initialize: function () {
    Dispatcher.register(this.onDispatch.bind(this));

    this.sort();
  },

  toggleExchange: function (exchangeName) {
    this.displayedExchanges[exchangeName] = !this.displayedExchanges[exchangeName];
    this.reset(data);
    this.reset(this.filter(function (e) {
      return this.displayedExchanges[e.get('exchange_name')];
    }, this));
  },

  sortBy: function (selectedColumn) {
    if (selectedColumn === this.sortField) {
      this.sortMultiplier *= -1;
    } else {
      this.sortMultiplier = 1;
    }

    this.sortField = selectedColumn;
    this.sort();
  },

  onDispatch: function (action) {
    if (action.actionType === 'toggleExchange') {
      this.toggleExchange(action.item);
    } else if (action.actionType === 'sort') {
      this.sortBy(action.item);
    }

    this.trigger('change:emit');
  }
});

module.exports = Stocks;
