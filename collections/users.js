Meteor.startup(function() {
  if (Meteor.isServer && Meteor.users.find().count() === 0) {
    Meteor.call('pull_users', function(error, members) {
      if(members) {
        members.forEach(function (member, index) {
          Accounts.createUser({
            username: member.name,
            email: member.profile.email,
            password: 'eptikar360',
            profile: { slackId: member.id , fullname: member.real_name, isAdmin: member.is_admin }
          });
        });
      }
    });
  }
});