Meteor.publish("attendances", function () {
  if(Meteor.user() && Meteor.user().profile.isAdmin)
    return Attendances.find();
  else
    return Attendances.find({userId: Meteor.user()._id});
});