CheckIns = new Mongo.Collection('checkIns');

CheckInSchema = new SimpleSchema({
    messageId: {
      type: String
    },

    userId: {
      type: String
    },

    time: {
      type: Date
    }
});

CheckIns.attachSchema(CheckInSchema);

// Methods //

Meteor.methods({
  addCheckIn: function (messageId, userId, time) {
    return CheckIns.insert({
      messageId: messageId,
      userId: userId,
      time: time
    });
  }
});