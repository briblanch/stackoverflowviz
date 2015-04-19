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

  buildData: function(tags, result, callback) {
    tags.map(function(tag) {
      this.getRelatedTags(tag, function(relatedTags) {
        result.children.push({
          name: tag.name,
          children: relatedTags.map(function(tagObj) {
            return {
              name: tagObj.name,
              size: tagObj.count
            }
          })
        });

        if (result.children.length == tags.length) {
          callback(result);
        }
      });
    }.bind(this));
  },

  getDataForAllTime: function(callback) {
    var result = {
      name: 'root',
      children: []
    };

    this.getAllTimeTags(function(tags) {
      this.buildData(tags, result, callback);
    }.bind(this));

  },

  getDataForDates: function(from, to, callback) {
    var result = {
      name: 'root',
      children: []
    };

    this.getTagsForDates(from, to, function(tags) {
      this.buildData(tags, result, callback);
    }.bind(this));
  },

  getTagsForDates: function(from, to, callback) {
    var url = this.baseUrl + 'tags';
    var queryParams = {
      pagesize: 25,
      order: 'desc',
      sort: 'popular',
      fromdate: from.unix(),
      todate: to.unix(),
      site: 'stackoverflow',
      key: this.key
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  },

  getAllTimeTags: function(callback) {
    var url = this.baseUrl + 'tags';
    var queryParams = {
      pagesize: 25,
      order: 'desc',
      sort: 'popular',
      site: 'stackoverflow',
      key: this.key
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  }
}
