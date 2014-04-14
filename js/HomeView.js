var HomeView = function(store) {

    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div id="homePage"/>');
        this.el.on('keyup', '.search-key', this.findByName);
        this.el.on('change', '#pid', this.findByName);
    };
 
    this.render = function() {
        this.el.html(HomeView.template());
        return this;
    };

    this.bindEvents = function () { };

    this.findByName = function() {
        var tstr = $('.search-key').val();
        var pidstr = $('#pid').val();
        if (tstr.length > 2) {
            store.findByName(tstr, pidstr, function(data) {
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