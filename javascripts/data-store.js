var Backbone = require('backbone'),
    jQuery = require('jquery');

Backbone.$ = jQuery;

var Stock = Backbone.Model.extend({
  marketCap: function () {
    if (isNaN(this.get('market_cap'))) {
      return this.get('market_cap');
    } else {
      return this.get('market_cap') / Math.pow(10, 9);
    }
  }
});

var DataStore = Backbone.Collection.extend({
  model: Stock
});

module.exports = DataStore;
