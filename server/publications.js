// Meteor.publish("checkIns", function () {
//   if(this.userId && Meteor.users.findOne(this.userId).profile.isAdmin)
//     return CheckIns.find();
//   else
//     return CheckIns.find({userId: this.userId});
// });

// Meteor.publish("checkOuts", function () {
//   if(this.userId && Meteor.users.findOne(this.userId).profile.isAdmin)
//     return CheckOuts.find();
//   else
//     return CheckOuts.find({userId: this.userId});
// });

Meteor.publish("days", function() {
  return Days.find();
})

Meteor.publish("messages", function() {
  return Messages.find();
})