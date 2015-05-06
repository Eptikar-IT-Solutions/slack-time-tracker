Attendances = new Mongo.Collection('attendances');

AttendanceSchema = new SimpleSchema({
    userId: {
      type: String
    },

    text: {
      type: String,
    },

    time: {
      type: Date
    }
});

Attendances.attachSchema(AttendanceSchema);

// Methods //

Meteor.methods({
  addAttendance: function (slackUserId, text, time) {
    return Attendances.insert({
      userId: Meteor.users.findOne({ "profile.slackId": slackUserId})._id,
      text: text,
      time: time
    });
  }
});

// Seed

Meteor.startup(function() {
  if (Attendances.find().count() === 0) {
    Meteor.call('pull_times', function(error, messages) {
      messages.forEach(function(message, index) {
        if(!message.subtype) {
          Meteor.call('addAttendance', message.user, message.text, new Date(message.ts * 1000) );
        }
      });
    });
  }
});