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
        username: $("#app").data("username"),
        apikey: $("#app").data("apikey"),
        currentDates: [],
        events: {
            'click #open_calendar_modal': 'openCalendar',
            'click #save_dates': 'saveDates',
            'click #close_calendar_modal': 'closeCalendar',
            'click #mark_task_for_today': 'markTaskForToday',
        },
        initialize: function() {
            _.bindAll(this, 'computeAndDisplayStreaks', 'updateLongestStreak');
            this.entries = new Entries();
            this.entries.username = this.username;
            this.entries.apikey = this.apikey;
            this.entries.bind('add', this.updateLongestStreak);
            this.entries.bind('remove', this.updateLongestStreak);
        },
        render: function(){
            var task = this.model.toJSON();
            $(this.el).html(_.template($("#task_template").html(), { title : task["title"], id : task["id"] }));
            this.fetchEntriesAndUpdateStreak();
            return this;
        },
        openCalendar: function() {
            var datepickerId = "#datepicker" + this.model.get("id");
            this.$(datepickerId).multiDatesPicker({ firstDay: 1, dateFormat: "yy-mm-dd"  });
            this.$(datepickerId).multiDatesPicker("resetDates");

            var setDatesInCalendar = function(collection) {
                var dates = _.map(collection.models, function(m) {
                    return m.toJSON()["date"];
                });
                currentDates = dates;
                if (dates.length > 0) {
                    this.$(datepickerId).multiDatesPicker('addDates', dates);
                }
            }

            this.entries.fetch({ data : { task: this.model.get("id") },
                                 success: setDatesInCalendar });

            this.$("#task_calendar_modal").modal("show");
        },
        markTaskForToday: function() {
            var today = moment().format("YYYY-MM-DD");
            var task = this.model;
            var view = this;
            var markTaskIfNotInList = function(collection) {
                var dateAlreadyMarked = _.any(collection.models, function(m) {
                    return m.toJSON()["date"] === today;
                });
                if (!dateAlreadyMarked) {
                    view.entries.create({ task: task.id, date: today });
                }
            }

            this.entries.fetch({ data : { task: task.get("id") },
                                 success: markTaskIfNotInList });
        },
        fetchEntriesAndUpdateStreak: function() {
            var task = this.model;
            var view = this;
            var computeAndDisplayStreaks = function(collection) {
                view.computeAndDisplayStreaks(collection);
            }

            this.entries.fetch({ data : { task: task.get("id") },
                                 success: computeAndDisplayStreaks });

        },
        computeAndDisplayStreaks: function(collection) {
            var dates = _.map(collection.models, function(m) {
                return m.toJSON()["date"];
            });
            var today = moment().format("YYYY-MM-DD");
            var longestStreak = DateUtil.computeConsecutiveDays(dates.sort());
            var currentStreak = DateUtil.computeCurrentStreak(today, dates.sort());
            var histogram = DateUtil.computeHistogram(today, dates, 10).reverse();

            $(this.el).find("#histogram").sparkline(histogram, { type: 'line', width:100});
            $(this.el).find("#longest").html("Longest streak: " + longestStreak);
            $(this.el).find("#current").html("Current streak: " + currentStreak);
        },
        updateLongestStreak: function(entry) {
            this.computeAndDisplayStreaks(entry.collection);
        },
        saveDates: function() {
            var datepickerId = "#datepicker" + this.model.get("id");
            var dates = this.$(datepickerId).multiDatesPicker('getDates');
            var sets = DateUtil.findSets(currentDates, dates);
            var datesToDelete = sets["onlyInA"];
            var datesToCreate = sets["onlyInB"];

            // Create the new dates (not in list from before)
            _.each(datesToCreate, function(d) {
                this.entries.create({ task: this.model.id, date: d });
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
        closeCalendar: function() {
            var datepickerId = "#datepicker" + this.model.get("id");
            this.$(datepickerId).multiDatesPicker("resetDates");
            this.$("#task_calendar_modal").modal("hide");
            currentDates = [];
        }
    });

    window.App = Backbone.View.extend({
        el: $('#app'),
        username: $("#app").data("username"),
        apikey: $("#app").data("apikey"),
        events: {
            'click .create_task': 'createTask',
        },
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll', 'render');
            this.tasks = new Tasks();
            this.tasks.username = this.username;
            this.tasks.apikey = this.apikey;

            this.tasks.bind('add', this.addOne);
            this.tasks.bind('reset', this.addAll);
            this.tasks.bind('all', this.render);
            this.tasks.fetch();
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
    });

    window.app = new App();
});