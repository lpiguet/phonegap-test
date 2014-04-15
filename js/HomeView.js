var HomeView = function(app) {
    var mytimeout = null;
    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div id="homePage"/>');
        this.el.on('keyup', '.search-key', $.proxy(function() { this.autocomplete(); }, this));
        this.el.on('change', '#pid', this.findByName);

        this.el.on('click', '#logout', function (event) {
            $.proxy(app.auth.logout(), this);
        });

    };
 
    this.render = function() {
        this.el.html(HomeView.template());
        return this;
    };

    this.bindEvents = function () { };

    this.autocomplete = function () {
        if (mytimeout) { window.clearTimeout(mytimeout); }
        mytimeout = window.setTimeout($.proxy (function() { this.findByName()}, this), 500);
    }

    this.findByName = function() {
        var tstr = $('.search-key').val();
        var pidstr = $('#pid').val();
        if (tstr.length > 2) {
            app.store.findByName(tstr, pidstr, function(data) {
                if (data) {
                    $('.result-list').html(HomeView.liTemplate(data));
                } else {
                    $('.result-list').html('No results');
                }
            });
        } else {
            $('.result-list').html('');
        }
    };

    this.initialize();

}
 
HomeView.template = Handlebars.compile($("#home-tpl").html());
HomeView.liTemplate = Handlebars.compile($("#result-li-tpl").html());