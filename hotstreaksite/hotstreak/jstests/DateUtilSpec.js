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
});