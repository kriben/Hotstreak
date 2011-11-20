$(function() {
    window.Task = Backbone.Model.extend({});
    window.Entry = Backbone.Model.extend({});

    window.Tasks = Backbone.Collection.extend({
        urlRoot: "/api/v1/task/"
    });

    window.Entries = Backbone.Collection.extend({
        urlRoot: "/api/v1/entry/"
    });

    window.TaskView = Backbone.View.extend({
        tagName: 'li',
        className: 'task',

        render: function(){
            var task = this.model.toJSON();
            $(this.el).html("<strong>" + task["title"] + '</strong><img id="open_calendar_modal" data-taskid="' + task["id"] + '" src="/static/images/calendar.png"><div id="current"></div><div id="longest"></div>');
            return this;
        }
    });

    window.App = Backbone.View.extend({
        el: $('body'),
        username: $("#app").data("username"),
        apikey: $("#app").data("apikey"),
        currentId: undefined,
        currentDates: [],

        events: {
            'click .create_task': 'createTask',
            'click #save_dates': 'saveDates',
            'click #open_calendar_modal': 'openCalendar',
            'click #close_calendar_modal': 'closeCalendar'
        },

        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll', 'render', 'updateLongestStreak');
            this.tasks = new Tasks();
            this.tasks.username = this.username;
            this.tasks.apikey = this.apikey;

            this.tasks.bind('add', this.addOne);
            this.tasks.bind('reset', this.addAll);
            this.tasks.bind('all', this.render);
            this.tasks.fetch();

            this.entries = new Entries();
            this.entries.username = this.username;
            this.entries.apikey = this.apikey;
	    this.entries.bind('add', this.updateLongestStreak);
	    this.entries.bind('remove', this.updateLongestStreak);
        },
        addAll: function(){
            this.tasks.each(this.addOne);
        },

        addOne: function(task) {
            var view = new TaskView({model:task});
            this.$('#tasks').append(view.render().el);
        },
        createTask: function() {
            this.tasks.create({ title: $("#title").val(),
                                description: $("#description").val()
                              });

            $("#title").val("");
            $("#description").val("");
            $("#create_task_modal").modal("hide");
        },
	updateLongestStreak: function(entry) {
            var dates = _.map(entry.collection.models, function(m) {
                return m.toJSON()["date"];
            });
	    var longestStreak = DateUtil.computeConsecutiveDays(dates.sort());
	    var currentStreak = DateUtil.computeCurrentStreak(moment().format("YYYY-MM-DD"), dates.sort());

	    var taskId = entry.get("task").split("/")[4];
	    var taskElement = $('.task img').filter(function() {
		return (taskId == $(this).data('taskid'));
	    });
	    $(taskElement[0]).parent().find("#longest").html("Longest streak: " + longestStreak);
	    $(taskElement[0]).parent().find("#current").html("Current streak: " + currentStreak);
	},
        saveDates: function() {
            var dates = $("#datepicker").multiDatesPicker('getDates');
            var sets = DateUtil.findSets(currentDates, dates);
            var datesToDelete = sets["onlyInA"];
            var datesToCreate = sets["onlyInB"];

            // Create the new dates (not in list from before)
            _.each(datesToCreate, function(d) {
                this.entries.create({ task: "/api/v1/task/" + currentId + "/", date: d });
            }, this);

            // Find the dates deleted by the user (was in the old list, not in the new)
            var entriesToDelete = _.map(datesToDelete, function(date) {
                return _.find(this.entries.models, function(entry) {
                    return entry.get("date") === date;
                });
            }, this);

            // Delete the entries which the user unmarked
            _.each(entriesToDelete, function(d) {
                d.destroy();
            });

            this.closeCalendar();
        },
        openCalendar: function(event) {
            $("#datepicker").multiDatesPicker({ firstDay: 1, dateFormat: "yy-mm-dd"  });
            $("#datepicker").multiDatesPicker("resetDates");
            var taskId = $(event.currentTarget).data("taskid");
            currentId = taskId;

            this.entries.fetch({ data : { task: taskId },
                                 success: function(collection) {
                                     var dates = _.map(collection.models, function(m) {
                                         return m.toJSON()["date"];
                                     });
                                     currentDates = dates;
                                     if (dates.length > 0) {
                                         $("#datepicker").multiDatesPicker('addDates', dates);
                                     }
                                 }
                               });

            $("#task_calendar_modal").modal("show");
        },
        closeCalendar: function() {
            $("#task_calendar_modal").modal("hide");
            $("#datepicker").multiDatesPicker("resetDates");
            currentId = undefined;
            currentDates = [];
        }
    });

    window.app = new App();
});