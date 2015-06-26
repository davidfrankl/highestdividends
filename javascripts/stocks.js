var Backbone = require('backbone'),
    jQuery = require('jquery'),
    Dispatcher = require('./dispatcher');

Backbone.$ = jQuery;

var Stock = Backbone.Model.extend({
  marketCap: function () {
    if (isNaN(this.get('market_cap'))) {
      return this.get('market_cap');
    } else {
      return Math.floor(this.get('market_cap') / Math.pow(10, 9) * 100) / 100;
    }
  }
});

var Stocks = Backbone.Collection.extend({
  model: Stock,
  sortField: 'dividend_yield',
  sortMultiplier: 1,

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

  onDispatch: function (action) {
    if (action.selectedColumn === this.sortField) {
      this.sortMultiplier *= -1;
    } else {
      this.sortMultiplier = 1;
    }

    this.sortField = action.selectedColumn;
    this.sort();
    this.trigger('change:emit');
  }
});

module.exports = Stocks;
