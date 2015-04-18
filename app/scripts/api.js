module.exports = {
  baseUrl: 'https://api.stackexchange.com/2.2/',

  getTagsForDates: function(from, to, callback) {
    var url = this.baseUrl + 'tags';
    var queryParams = {
      pagesize: 100,
      order: 'desc',
      sort: 'popular',
      fromdate: from.unix(),
      todate: to.unix(),
      site: 'stackoverflow'
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
      site: 'stackoverflow'
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  },

  getQuestionsForTag: function(tag, callback) {
    var url = baseUrl + 'questions';
    var queryParams = {
      pagesize: 20,
      order: 'desc',
      sort: 'votes',
      site: 'stackoverflow',
      tagged: tag
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  },

  getUnansweredQuestions: function(callback) {
    var url = baseUrl + 'questions/no-answers';
    var queryParams = {
      pagesize: 10,
      order: 'desc',
      sort: 'votes',
      site: 'stackoverflow'
    };

    if (to && from) {
      queryParams.fromdate = from;
      queryParams.todate = to;
    }

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  },

  getTopUsers: function(callback) {
    var url = baseUrl + 'users';

    var queryParams = {
      pagesize: 10,
      order: 'desc',
      sort: 'reputation',
      site: 'stackoverflow'
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    });
  },

  getTopAskersForTag: function(tag, callback) {
    var url = baseUrl + 'tags/' + tag + '/top-askers/all_time';
    var queryParams = {
      site: 'stackoverflow',
      pagesize: 10
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  },

  getTopAnswerersForTag: function(tag, callback) {
    var url = baseUrl + 'tags/' + tag + '/top-answerers/all_time';
    var queryParams = {
      pagesize: 10,
      site: 'stackoverflow'
    };

    $.get(url, queryParams, function(result) {
      callback(result.items);
    })
  }
}
