var DateUtil = new function() {
    var getDaysSinceEpoch = function(day) {
	var epoch = moment("1970-01-01");
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

    this.findSets = function(a, b) {
	var inBoth = _.intersection(a, b);
	var onlyInA = _.difference(a, b);
	var onlyInB = _.difference(b, a);
	return { inBoth: inBoth, onlyInA: onlyInA, onlyInB: onlyInB };    
    };

    this.computeCurrentStreak = function(date, dates) {
	if (dates.length === 0)
	    return 0;

	var ordinalDays = _.map(dates, getDaysSinceEpoch).reverse();;
	var targetDate = getDaysSinceEpoch(date);

	// Check if we have a streak at all
	var diff = targetDate - ordinalDays[0];
	if (diff  !== 1 && diff !== 0)
	    return 0;

	var currentStreak = 1;
	for (var i = 0; i < ordinalDays.length - 1; i++) {
	    if (ordinalDays[i] - ordinalDays[i + 1] === 1)
		currentStreak++;
	    else 
		break;
	}

	return currentStreak;	
    };
};