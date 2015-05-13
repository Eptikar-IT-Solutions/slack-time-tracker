Router.configure({
   layoutTemplate: 'layout',
 });

Router.map(function() {
  this.route('/', {
    name: 'main'
  });

  this.route('/listing', {
    name: 'timeTable'
  });
});
