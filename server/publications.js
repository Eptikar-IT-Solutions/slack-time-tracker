Meteor.publish("checkIns", function () {
  if(this.userId && Meteor.users.findOne(this.userId).profile.isAdmin)
    return CheckIns.find();
  else
    return CheckIns.find({userId: this.userId});
});

Meteor.publish("messages", function() {
  return Messages.find();
})