var DateUtil = new function() {
    var getDaysSinceEpoch = function(day) {
	var epoch = moment("1970-1-1");
	return moment(day).diff(epoch, "days");
    };

    this.computeConsecutiveDays = function(days) {
	if (days.length === 0)
	    return 0;

	var ordinalDays = _.map(days, getDaysSinceEpoch);

	var longest = 0;
	var current = 0;
	for (var i = 0; i < ordinalDays.length - 1; i++) {
	    if (ordinalDays[i] - ordinalDays[i + 1] === -1) {
		current = current + 1;
	    }
	    else {
		current = 0;
	    }

	    if (current > longest)
		longest = current;
	}

	return longest + 1;
    };
};