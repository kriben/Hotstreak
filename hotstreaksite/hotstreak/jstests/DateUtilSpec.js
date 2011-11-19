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

    it("can compute number of consecutive days empty input", function() {    
	expect(DateUtil.computeConsecutiveDays([])).toEqual(0);
    });

    it("can compute number of consecutive days on single date input", function() {    
	expect(DateUtil.computeConsecutiveDays(["1979-09-07"])).toEqual(1);
    });
});