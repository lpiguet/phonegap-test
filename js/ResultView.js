var ResultView = function (data) {

    this.initialize = function () {
        this.el = $('<div/>');
    };

    this.render = function () {
        this.el.html(ResultView.template(data));
        return this;
    };

    this.bindEvents = function () { };

    this.initialize();
}

ResultView.template = Handlebars.compile($("#result-tpl").html());