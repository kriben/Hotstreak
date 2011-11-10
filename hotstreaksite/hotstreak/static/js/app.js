$(function() {
    window.Task = Backbone.Model.extend({});

    window.Tasks = Backbone.Collection.extend({
        urlRoot: "/api/v1/task/"
    });

    window.TaskView = Backbone.View.extend({
        tagName: 'li',
        className: 'task',

        render: function(){
            $(this.el).html("<strong>" + this.model.toJSON()["title"] + '</strong><img src="/static/images/accept.png"><img data-controls-modal="task_calendar_modal" data-backdrop="static" src="/static/images/calendar.png">');

            return this;
        }
    });

    window.App = Backbone.View.extend({
        el: $('body'),
        username: $("#app").data("username"),
        apikey: $("#app").data("apikey"),

        events: {
            'click .create_task': 'createTask'
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

        addOne: function(task){
            var view = new TaskView({model:task});
            this.$('#tasks').append(view.render().el);
        },
        createTask: function(){
            this.tasks.create({ title: $("#title").val(),
                                description: $("#description").val()
                              });

            $("#title").val("");
            $("#description").val("");
	    $("#create_task_modal").modal("hide");
        }
    });

    window.app = new App();
});