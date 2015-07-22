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
      sortMultiplier: this.props.store.sortMultiplier,
      page: 0,
      itemsPerPage: 50,
      displayedExchanges: this.props.store.displayedExchanges
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
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    Dispatcher.dispatch({
      actionType: 'sort',
      item: selectedColumn
    });
  },

  first: function () {
    return this.state.page*this.state.itemsPerPage;
  },

  last: function () {
    var last = (this.state.page+1)*this.state.itemsPerPage;
    if (last > this.props.store.size()) {
      return this.props.store.size();
    } else {
      return last;
    }
  },

  getPaginationString: function () {
    return (this.first()+1) + '-' + this.last() + ' of ' + this.props.store.size();
  },

  changePage: function (inc) {
    if (this.state.page + inc >= 0 && this.last() !== this.props.store.size()) {
      this.setState({
        page: this.state.page + inc
      });
    }
  },

  toggleExchange: function (exchangeName) {
    Dispatcher.dispatch({
      actionType: 'toggleExchange',
      item: exchangeName
    });
  },

  filterBySearch: function (elem) {
    if (!this.state.searchString) {
      return true;
    }

    var name = elem.get('name').toLowerCase();
    return name.indexOf(this.state.searchString) !== -1;
  },

  search: function () {
    this.setState({searchString: event.target.value.toLowerCase()});
  },

  render: function () {
    var rows = this.props.store.filter(this.filterBySearch)
                               .slice(this.first(), this.last())
                               .map(function (row) {
      return (
        <tr key={row.get('symbol')}>
          <td className='text'>{row.get('name')}</td>
          <td className='text'>{row.get('symbol')}</td>
          <td className='numeric'>{row.get('market_cap')}</td>
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
      <div>
        <div className='filters'>
          <div className='filter'>
            <label>NASDAQ</label>
            <input type="checkbox" checked={this.state.displayedExchanges.NASDAQ} onChange={this.toggleExchange.bind(this, 'NASDAQ')}/>
          </div>
          <div className='filter'>
            <label>NYSE</label>
            <input type="checkbox" checked={this.state.displayedExchanges.NYSE} onChange={this.toggleExchange.bind(this, 'NYSE')}/>
          </div>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th className={classNames.name} width='500px' onClick={this.selectColumn.bind(this, 'name')}>
                  {icons.name}
                  Company Name
                  <div className='search'>
                    <input type='text' placeholder='Search...' onChange={this.search}/>
                  </div>
                </th>
                <th className={classNames.symbol} width='100px' onClick={this.selectColumn.bind(this, 'symbol')}>
                  {icons.symbol}
                  Symbol
                </th>
                <th className={classNames.market_cap} width='200px' onClick={this.selectColumn.bind(this, 'market_cap')}>
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
          <div className='pagination'>
            {this.getPaginationString()}
            <i className='fa fa-chevron-left' onClick={this.changePage.bind(this, -1)}/>
            <i className='fa fa-chevron-right' onClick={this.changePage.bind(this, 1)}/>
          </div>
        </div>
      </div>
    );
  }
});

React.render(
  <Page/>,
  document.getElementById('page')
);
