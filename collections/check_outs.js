CheckOuts = new Mongo.Collection('checkOuts');

CheckOutSchema = new SimpleSchema({
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

CheckOuts.attachSchema(CheckOutSchema);

// Methods //

Meteor.methods({
  addCheckOut: function (messageId, userId, time) {
    return CheckOuts.insert({
      messageId: messageId,
      userId: userId,
      time: time
    });
  }
});