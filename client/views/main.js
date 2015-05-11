Template.main.helpers({
  username: function() {
    if(Meteor.user())
      return Meteor.user().username;
  },

  day: function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[ new Date().getDay() ];
  },

  checkInTime: function() {
    var time = CheckIns.findOne({}, {sort: {time: -1}, limit: 1}).time;
    return time.getHours() + ':' + time.getMinutes();
  },

  checkOutTime: function() {
    var time = CheckOuts.findOne({}, {sort: {time: -1}, limit: 1}).time;
    return time.getHours() + ':' + time.getMinutes();
  }
})