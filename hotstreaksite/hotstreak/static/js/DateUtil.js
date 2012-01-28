var DateUtil = new function() {
    "use strict";
    var getDaysSinceEpoch = function(day) {
        var epoch = moment("1970-01-01");
        return moment(day).diff(epoch, "days");
    };

    this.computeConsecutiveDays = function(days) {
        if (days.length === 0) {
            return 0;
        }

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

            if (current > longest) {
                longest = current;
            }
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
        if (dates.length === 0) {
            return 0;
        }

        var ordinalDays = _.map(dates, getDaysSinceEpoch).reverse();
        var targetDate = getDaysSinceEpoch(date);

        // Exclude dates new than the target date
        var beforeToday = function(day) { return day <= this; };
        ordinalDays = _.filter(ordinalDays, beforeToday, targetDate);

        // Check if we have a streak at all
        var diff = targetDate - ordinalDays[0];
        if (diff !== 1 && diff !== 0) {
            return 0;
        }

        var current = 1;
        for (var i = 0; i < ordinalDays.length - 1; i++) {
            if (ordinalDays[i] - ordinalDays[i + 1] === 1) {
                current++;
            }
            else {
                break;
            }
        }

        return current;
    };

    this.computeHistogram = function(date, dates, nWeeks) {
        var findWeekNumber = function(d) {
            return parseInt(moment(d).format("w"), 10) 
        }

        var counts = [];
        for (var i = 0; i < nWeeks; i++) {
            counts.push(0);
        }
        
        var currentWeek = findWeekNumber(date);
        var weekNumbers = _.map(dates, findWeekNumber);
        _.each(weekNumbers, function(w) {
            var index = currentWeek - w; 
            counts[index] = counts[index] + 1;
        });
        
        return counts;
    };
};
