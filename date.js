
exports.getDate = function() {
var today = new Date();

var options = {
    weekday:"long",
    month:"long",
    day:"numeric"
};

return today.toLocaleDateString("hi-IN" , options);
}




// or we can use it like this , the above way is just trying to make more short

// module.exports.getDate = getDate;

// function getDate() {
// var today = new Date();

// var options = {
//     weekday:"long",
//     month:"long",
//     day:"numeric"
// };

// return today.toLocaleDateString("hi-IN" , options);

// }




//or we can use (module.exports.getDay;) instead of (exports.getDay) ,the both referss to same thing.

exports.getDay = function() {
    var today = new Date();
    
    var options = {
        weekday:"long",
    };
    
    var currentDay = today.toLocaleDateString("hi-IN" , options);
    
    return currentDay;
    
    }
    console.log(module.exports);