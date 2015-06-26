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
          <td className='text'>{row.get('name')}</td>
          <td className='text'>{row.get('symbol')}</td>
          <td className='numeric'>{row.marketCap()}</td>
          <td className='numeric'>{row.get('dividend_yield')}</td>
        </tr>
      );
    });

    return (
      <div>
        <h1>Highest Dividends</h1>
        <ul className='header-menu'>
          <li>Stocks</li>
          <li>Partners</li>
        </ul>
        <table>
          <thead>
            <tr>
              <th className='text' width='200px'>Company Name</th>
              <th className='text' width='100px'>Symbol</th>
              <th className='numeric' width='175px'>Market Cap ($B)</th>
              <th className='numeric' width='200px'>Dividend Yield (%)</th>
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
