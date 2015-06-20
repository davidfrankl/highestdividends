var React = require('react'),
    DataStore = require('./data-store');

var Page = React.createClass({
  getDefaultProps: function () {
    return {
      dataStore: new DataStore(data)
    };
  },

  render: function () {
    var rows = this.props.dataStore.map(function (row) {
      return (
        <tr key={row.get('symbol')}>
          <td>{row.get('name')}</td>
          <td>{row.get('symbol')}</td>
          <td>{row.get('market_cap')}</td>
          <td>{row.get('yield')}</td>
        </tr>
      );
    });

    return (
      <div>
        <h1>High Dividends</h1>
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Symbol</th>
              <th>Market Cap</th>
              <th>Dividend Yield</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

React.render(
  <Page/>,
  document.getElementById('page')
);
