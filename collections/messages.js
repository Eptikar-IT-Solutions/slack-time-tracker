Messages = new Mongo.Collection('messages');

MessageSchema = new SimpleSchema({
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

Messages.attachSchema(MessageSchema);

// Methods //

Meteor.methods({
  AddMessage: function (slackUserId, text, time) {
    return Messages.insert({
      userId: Meteor.users.findOne({ "profile.slackId": slackUserId})._id,
      text: text,
      time: time
    });
  }
});

// Hooks //

Messages.after.insert(function (userId, doc) {
  if(doc.text.trim() == '1')
    Meteor.call('addCheckIn', this._id, doc.userId, doc.time);
  if(doc.text.trim() == '0')
    Meteor.call('addCheckOut', this._id, doc.userId, doc.time);
});

// Seed //

Meteor.startup(function() {
  if (Meteor.isServer && Messages.find().count() === 0) {

    if (Meteor.users.find().count() === 0) {
      Meteor.call('pull_users', function(error, members) {
        if(members) {
          members.forEach(function (member, index) {
            Accounts.createUser({
              username: member.name,
              email: member.profile.email,
              password: 'eptikar360',
              profile: { slackId: member.id , fullname: member.real_name, isAdmin: member.is_admin }
            });

            if(members.length == index+1){
              Meteor.call('pull_times', function(error, messages) {
                messages.forEach(function(message, index) {
                  if( typeof message.subtype == 'undefined' ) {
                    Meteor.call('AddMessage', message.user, message.text, new Date(message.ts * 1000) );
                  }
                });
              });
            }
          });
        }
      });
    }
    else {
      Meteor.call('pull_times', function(error, messages) {
        messages.forEach(function(message, index) {
          if( typeof message.subtype == 'undefined' ) {
            Meteor.call('AddMessage', message.user, message.text, new Date(message.ts * 1000) );
          }
        });
      });
    }


  }
});