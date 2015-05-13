Template.main.helpers({
  username: function() {
    var user = Meteor.user();
    if(user)
      return user.username;
    else
      return 'John Doe'
  },

  currentDay: function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[ new Date().getDay() ];
  },

  checkInTime: function() {
    var lastCheckIn = Days.lastCheckIn();
    
    if(lastCheckIn)
      return lastCheckIn.getHours() + ':' + lastCheckIn.getMinutes();
    else
      return 'N/A';
  },

  checkOutTime: function() {
    var lastCheckOut = Days.lastCheckOut();

    if (lastCheckOut)
      return lastCheckOut.getHours() + ':' + lastCheckOut.getMinutes();
    else
      return 'N/A'
  }
})