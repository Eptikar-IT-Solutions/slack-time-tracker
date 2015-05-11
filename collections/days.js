Days = new Mongo.Collection('days');

sprintSchema = new SimpleSchema({
  checkIn: {
    type: Date,
    optional: true
  },

  checkOut: {
    type: Date,
    optional: true
  },

  duration: {
    type: String,
    autoValue: function() {
      var checkIn = this.field("checkIn");
      var checkOut = this.field("checkOut");
      if (checkOut.isSet){
        return checkOut - checkIn;
      }
    },
    optional: true
  },

  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});

daySchema = new SimpleSchema({
  userId: {
    type: String
  },

  date: {
    type: Date
  },

  sprints: {
    type: [sprintSchema],
    optional: true
  }
});

Days.attachSchema(daySchema);

// Methods //
Meteor.methods({
  addCheckIn: function(userId, checkIn) {
    return Days.update(
      { userId: userId, date: checkIn.getDate() },
      {
        $addToSet: { "sprints.checkIn": checkIn },
        $setOnInsert: { userId: userId, date: checkIn.getDate() }
      },
      { upsert: true }
    ); 
  },

  addCheckOut: function(userId, checkOut) {
    return Days.update(
      { userId: userId, date: checkOut.getDate(), "sprints.$.checkIn": { $exists: true}, "sprints.$.checkOut": { $exists: false} },
      {
        $push: { "sprints.checkOut": checkOut }
      }
    );    
  }
});

// Seed //
Meteor.startup(function() {
  if (Meteor.isServer && Days.find().count() === 0) {
    Meteor.call('pull_times', function(error, messages) {
      if(error) { new Meteor.throw(error); return }
      messages.forEach(function(message, index) {
        if(!message.hasOwnProperty('subtype')) {
          var userId = Meteor.users.findOne({'profile.slackId': message.user})._id;
          var time = new Date(message.ts * 1000);

          if (message.text.trim() === '0') {
            console.log('DEBUGGING CHECKOUT', userId, time);
            Meteor.call('addCheckIn', userId, time);
          }

          if (message.text.trim() === '1') {
            console.log('DEBUGGING CHECKIN', userId, time);
            Meteor.call('addCheckOut', userId, time);
          }
        }
      });
    });
  };
});