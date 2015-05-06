Meteor.methods({
  pull_users: function() {
    var result = HTTP.call(
      "GET", 
      "https://slack.com/api/users.list", 
      { params: { token: process.env.EIT_SLACK_KEY } }
    );
    result = JSON.parse(result.content)
    return result.members;
  },

  pull_times: function() {
    var result = HTTP.call(
      "GET", 
      "https://slack.com/api/channels.history", 
      { params: { token: process.env.EIT_SLACK_KEY, channel: 'C04G51J09', count: 1000 } }
    );
    result = JSON.parse(result.content)
    return result.messages;
  }
});