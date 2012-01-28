describe("DateUtil", function() {
    it("can compute number of consecutive days", function() {
        var days = [ "2011-11-16", "2011-11-17", "2011-11-18", "2011-11-19" ]
        var consecutive = DateUtil.computeConsecutiveDays(days);
        expect(consecutive).toEqual(4);
    });

    it("can compute number of consecutive days on skipping dates", function() {
        var days = [ "1979-09-07", "2011-11-16", "2011-11-18", "2011-11-19" ]
        var consecutive = DateUtil.computeConsecutiveDays(days);
        expect(consecutive).toEqual(2);
    });

    it("can compute number of consecutive days empty input", function() {
        expect(DateUtil.computeConsecutiveDays([])).toEqual(0);
    });

    it("can compute number of consecutive days on single date input", function() {
        expect(DateUtil.computeConsecutiveDays(["1979-09-07"])).toEqual(1);
    });

    it("can find difference between two arrays of dates", function() {
        var a = [ "1979-09-07", "2011-11-18" ];
        var b = [ "1980-02-08", "2011-11-18" ];

        var sets = DateUtil.findSets(a, b);
        expect(sets["inBoth"]).toEqual(["2011-11-18"]);
        expect(sets["onlyInA"]).toEqual(["1979-09-07"]);
        expect(sets["onlyInB"]).toEqual(["1980-02-08"]);
    });

    it("can find difference between two empty arrays of dates", function() {
        var sets = DateUtil.findSets([], []);
        expect(sets["inBoth"]).toEqual([]);
        expect(sets["onlyInA"]).toEqual([]);
        expect(sets["onlyInB"]).toEqual([]);
    });

    it("should compute current streak", function() {
        var today = "2011-11-22";
        var dates = [ "1980-02-08", "2011-11-19", "2011-11-20", "2011-11-21" ];
        var currentStreak = DateUtil.computeCurrentStreak(today, dates);
        expect(currentStreak).toEqual(3);
    });

    it("should compute current streak for one date", function() {
        var today = "2011-11-22";
        var dates = [ "2011-11-21" ];
        expect(DateUtil.computeCurrentStreak(today, dates)).toEqual(1);
    });

    it("should compute current streak when user has added dates in the future", function() {
        var today = "2011-11-22";
        var dates = [ "2011-11-20", "2011-11-21", "2011-11-22", "2011-11-23", "2011-11-24" ];
        expect(DateUtil.computeCurrentStreak(today, dates)).toEqual(3);
    });

    it("should compute current streak of zero when user has added only dates in the future", function() {
        var today = "2011-11-20";
        var dates = [ "2011-11-23", "2011-11-24" ];
        expect(DateUtil.computeCurrentStreak(today, dates)).toEqual(0);
    });

    it("should compute current streak for empty list", function() {
        expect(DateUtil.computeCurrentStreak("2011-11-20", [])).toEqual(0);
    });

    it("should compute current streak for single date in the future", function() {
        expect(DateUtil.computeCurrentStreak("2011-11-20", [ "2011-11-24" ])).toEqual(0);
    });

    it("should make a histogram of dates per week", function() {
        expect(DateUtil.computeHistogram("2012-01-28", [ "2012-01-25", "2012-01-19", "2012-01-18" ], 2)).toEqual([ 1, 2 ]);
    });

    it("should make a histogram of dates per week with some weeks without entries", function() {
        expect(DateUtil.computeHistogram("2012-01-28", [ "2012-01-25", "2012-01-19", "2012-01-18" ], 4)).toEqual([ 1, 2, 0, 0 ]);
    });

    it("should make a histogram of dates per week for no dates", function() {
        expect(DateUtil.computeHistogram("2012-01-28", [], 3)).toEqual([ 0, 0, 0 ]);
    });
});
