var HomeView = function(app) {
    var mytimeout = null;
    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div id="homePage"/>');
        this.el.on('keyup', '.search-key', $.proxy(function(e) { this.autocomplete(e); }, this));
        this.el.on('change', '#pid', this.findByName);

        this.el.on('click', '#logout', function (event) {
            $.proxy(app.backend.auth.logout(), this);
        });

    };
 
    this.render = function() {
        console.log ('HomeView render');
        this.el.html(HomeView.template());
        return this;
    };

    this.bindEvents = function () { 
        // Populate projects menu
        var projectsStr = localStorage.getItem (app.backend.auth.localStoragePrefix+'-projects');
        if (projectsStr) {
            var projects = jQuery.parseJSON (projectsStr);
            if (projects) {
                var options = HomeView.projectOptionsTemplate(projects);
                $('#pid').html('<option value="0">All</option>'+options);
                // Set current project
                var current_pid = localStorage.getItem ('pid');
                if (current_pid) {
                    $('#pid option[value="'+current_pid+'"]').attr("selected", true);
                }
            }
        }
    };

    this.autocomplete = function (e) {

        if(e.keyCode == 27) {
            $('.search-key').val('');
            $('#result-list').html('');
            $('#status').html('');
            return;
        }

        if (mytimeout) { window.clearTimeout(mytimeout); }
        mytimeout = window.setTimeout($.proxy (function() { this.findByName()}, this), 500);
    }

    this.findByName = function() {
        var tstr = $('.search-key').val();
        var pidstr = $('#pid').val();
        if (tstr.length > 2) {
            app.store.findByName(tstr, pidstr, function(data) {
                if (data) {
                    $('#status').html(data.length + ' items found');
                    $('#result-list').html(HomeView.liTemplate(data));
                } else {
                    $('#status').html('0 items found');
                    $('#result-list').html('');
                }
            });
        } else {
            $('#status').html('');
            $('#result-list').html('');
        }
    };

    this.initialize();
}

new LoadTemplate('homeView', 'home-tpl').createAndWait (function (compiled, el) {
    HomeView.template = compiled;
    console.log ('HomeView template initialized');
});
new LoadTemplate('#result-list', 'result-li-tpl').createAndWait (function (compiled, el) {
    HomeView.liTemplate = compiled;
    console.log ('HomeView.liTemplate initialized');
});
new LoadTemplate(null, 'project-options-tpl').createAndWait (function (compiled, el) {
    HomeView.projectOptionsTemplate = compiled;
    console.log ('HomeView.projectOptionsTemplate initialized');
});

