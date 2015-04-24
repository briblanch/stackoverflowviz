function calculateTagPopularities(questionData) {
  var tagOccurrences = {};

  questionData.forEach(function(question) {
    question.tags.forEach(function(tag) {
      if (!(tag in tagOccurrences)) {
        tagOccurrences[tag] = 0;
      }
      ++tagOccurrences[tag];
    });
  });

  return d3.entries(tagOccurrences).map(function(tagPopularity) {
    return {
      name: tagPopularity.key,
      count: tagPopularity.value,
    };
  });
}

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

  /*getTagsForDates: function(from, to, callback) {
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
    });
  },*/

  getTagsForDates: function(from, to, callback) {
    var url = this.baseUrl + 'questions';
    var queryParams = {
      pagesize: 100,
      order: 'desc',
      sort: 'votes',
      fromdate: from.unix(),
      todate: to.unix(),
      site: 'stackoverflow',
      key: this.key,
      filter: '!--KJAUrxFwJI'
    };

    var pagesReceived = 0;
    var results = [];
    for (var page = 1; page <= 5; ++page) {
      queryParams.page = page;
      $.get(url, queryParams, function(result) {
        ++pagesReceived;
        results = results.concat(result.items);

        if (pagesReceived === 5) {
          callback(calculateTagPopularities(results));
        }
      });
    }
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
    });
  }
}
