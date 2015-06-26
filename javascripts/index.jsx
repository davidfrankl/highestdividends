var React = require('react'),
    Dispatcher = require('./dispatcher'),
    Stocks = require('./stocks');

var Page = React.createClass({
  getDefaultProps: function () {
    return {
      store: new Stocks(data)
    };
  },

  getInitialState: function () {
    return {
      sortField: this.props.store.sortField,
      sortMultiplier: this.props.store.sortMultiplier
    }
  },

  componentDidMount: function () {
    this.props.store.on('change:emit', this.onStoreChanged, this);
  },

  onStoreChanged: function () {
    this.setState({
      sortField: this.props.store.sortField,
      sortMultiplier: this.props.store.sortMultiplier
    });
  },

  selectColumn: function (selectedColumn) {
    Dispatcher.dispatch({
      selectedColumn: selectedColumn
    });
  },

  render: function () {
    var rows = this.props.store.map(function (row) {
      return (
        <tr key={row.get('symbol')}>
          <td className='text'>{row.get('name')}</td>
          <td className='text'>{row.get('symbol')}</td>
          <td className='numeric'>{row.marketCap()}</td>
          <td className='numeric'>{row.get('dividend_yield')}</td>
        </tr>
      );
    });

    var classNames = {
      name: 'text',
      symbol: 'text',
      market_cap: 'numeric',
      dividend_yield: 'numeric'
    }
    var icons = {
      name: null,
      symbol: null,
      market_cap: null,
      dividend_yield: null
    }

    classNames[this.state.sortField] += ' selected';

    if (this.state.sortMultiplier === -1) {
      icons[this.state.sortField] = <i className='fa fa-long-arrow-up'/>;
    } else {
      icons[this.state.sortField] = <i className='fa fa-long-arrow-down'/>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th className={classNames.name} width='200px' onClick={this.selectColumn.bind(this, 'name')}>
              {icons.name}
              Company Name
            </th>
            <th className={classNames.symbol} width='100px' onClick={this.selectColumn.bind(this, 'symbol')}>
              {icons.symbol}
              Symbol
            </th>
            <th className={classNames.market_cap} width='175px' onClick={this.selectColumn.bind(this, 'market_cap')}>
              {icons.market_cap}
              Market Cap ($B)
            </th>
            <th className={classNames.dividend_yield} width='200px' onClick={this.selectColumn.bind(this, 'dividend_yield')}>
              {icons.dividend_yield}
              Dividend Yield (%)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

React.render(
  <Page/>,
  document.getElementById('page')
);
