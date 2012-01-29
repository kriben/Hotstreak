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
            return parseInt(moment(d).format("w"), 10); 
        }

        var convertToWeekNumber = function(d) {
            var w = parseInt(d.format("w"), 10);
            if (d.day() === 0) {
                // Our week start on monday!
                return w - 1;
            }

            return w;
        }

        var makeMomentDate = function(d) {
            return moment(d);
        }

        var counts = [];
        for (var i = 0; i < nWeeks; i++) {
            counts.push(0);
        }

        var mDate = makeMomentDate(date);
        var currentWeek = convertToWeekNumber(mDate);

        // Check of our range crosses new year.
        // Which gives week numbers like this: 51, 52, 1, 2, 3
        var offset = 0;
        var isCrossingNewYear = false;
        if (currentWeek - nWeeks < 0) {
            offset = Math.abs(currentWeek - nWeeks);        
            isCrossingNewYear = true;
        }

        // Exclude to old entries
        var mDates = _.map(dates, makeMomentDate);
        mDates = _.filter(mDates, function(w) {
            return mDate.diff(w, "weeks") < nWeeks + 1;
        });

        _.each(mDates, function(w) {
            var weekNum = convertToWeekNumber(w);
            var index = currentWeek - weekNum;
            if (isCrossingNewYear && weekNum - nWeeks >= 0) {    
                // last year
                index = 52 + index;
            }       
            counts[index] = counts[index] + 1;
        });
        
        return counts;
    };
};
