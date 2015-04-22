module.exports = {
  baseUrl: 'https://api.stackexchange.com/2.2/',

  key: 'JRYkoF0Yf1oSTLoC37194Q((',

  formatStackExchangeTagObj: function(tagObj) {
    return {
      name: tagObj.name,
      size: tagObj.count
    }
  },

  getRelatedTags: function(tag, callback) {
    var url = this.baseUrl + 'tags/' + escape(tag.name) + '/related';
    var queryParams = {
      pagesize: 10,
      site: 'stackoverflow',
      key: this.key
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    });
  },

  getDataForAllTime: function(callback) {
    this.getAllTimeTags(function(tags) {
      callback(tags);
    });

  },

  getDataForDates: function(from, to, callback) {
    this.getTagsForDates(from, to, function(tags) {
      callback(tags);
    });
  },

  getTagsForDates: function(from, to, callback) {
    var url = this.baseUrl + 'tags';
    var queryParams = {
      pagesize: 100,
      order: 'desc',
      sort: 'popular',
      fromdate: from.unix(),
      todate: to.unix(),
      site: 'stackoverflow',
      key: this.key,
      filter: '!-.G.68phH_FI'
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  },

  getAllTimeTags: function(callback) {
    var url = this.baseUrl + 'tags';
    var queryParams = {
      pagesize: 100,
      order: 'desc',
      sort: 'popular',
      site: 'stackoverflow',
      key: this.key,
      filter: '!-.G.68phH_FI'
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  }
}
