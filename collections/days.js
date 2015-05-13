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
  addCheckIn: function(userId, checkInTimeStamp) {
    var checkIn = new Date(checkInTimeStamp * 1000);
    return Days.update(
      { 
        userId: userId, 
        date: { $gte: startOfCurrentDay(checkIn), $lt: startOfNextDay(checkIn) } 
      },
      {
        $addToSet: { sprints: { checkIn: checkIn } },
        $setOnInsert: { userId: userId, date: startOfCurrentDay(checkIn), $push: {sprints: { checkIn: checkIn }} }
      },
      { upsert: true }
    ); 
  },

  addCheckOut: function(userId, checkOutTimeStamp) {
    var checkOut = new Date(checkOutTimeStamp * 1000);
    return Days.update(
      { 
        userId: userId, 
        date: { $gte: startOfCurrentDay(checkOut), $lt: startOfNextDay(checkOut) }, 
        sprints: { $elemMatch: { checkIn: { $exists: true}, checkOut: { $exists: false} } } 
      },
      { 
        $set: { 'sprints.$.checkOut': checkOut } 
      } 
    );    
  }
});

// Helpers //

Days.lastCheckIn = function() {
  return Days.findOne(
    { 
      userId: Meteor.userId(),
      date: { $gte: startOfCurrentDay(new Date), $lt: startOfNextDay(new Date) } 
    }, 
    { 
      sort: { 'sprints.checkIn': -1 }
    }
  ).sprints[0].checkIn;
}

Days.lastCheckOut = function() {
  return Days.findOne(
    { 
      userId: Meteor.userId(),
      date: { $gte: startOfCurrentDay(new Date), $lt: startOfNextDay(new Date) } 
    }, 
    { 
      sort: { 'sprints.checkOut': -1 }
    }
  ).sprints[0].checkOut;
}

// Seed //
Meteor.startup(function() {
  if (Meteor.isServer && Days.find().count() === 0) {
    Meteor.call('pull_times', function(error, messages) {
      if(error) { new Meteor.throw(error); return }
      // CHECKIN
      messages.forEach(function(message, index) {
        if(!message.hasOwnProperty('subtype')) {
          var userId = Meteor.users.findOne({'profile.slackId': message.user})._id;

          if (message.text.trim() === '1') {
            console.log('CHECKIN#' , index,': ', userId);
            Meteor.call('addCheckIn', userId, message.ts);
          }
        }
      });

      // CHECKOUT
      messages.forEach(function(message, index) {
        if(!message.hasOwnProperty('subtype')) {
          var userId = Meteor.users.findOne({'profile.slackId': message.user})._id;

          if (message.text.trim() === '0') {
            console.log('CHECKOUT#' , index,': ', userId);
            Meteor.call('addCheckOut', userId, message.ts);
          }
        }
      });
    });
  };
});

