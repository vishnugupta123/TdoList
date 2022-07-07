// jshint esversion:6
exports.getdate=function(){
    let today = new Date();
    let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    };
    let day = today.toLocaleDateString("en-us", options);
    return day;
};
exports.getday= function()
{
    let today = new Date();
    let options = {
      weekday: "long",
    };
    let day = today.toLocaleDateString("en-us", options);
    return day;
};