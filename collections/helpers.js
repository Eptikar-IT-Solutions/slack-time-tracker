// MongoDb query helpers

startOfCurrentDay = function(time) {
  var localTime = new Date(time);  
  localTime.setHours(0,0,0,0);
  return localTime;
}

startOfNextDay = function(time) {
  var localTime = new Date(time);
  localTime.setDate(localTime.getDate()+1);
  localTime.setHours(0,0,0,0);
  return localTime;
}