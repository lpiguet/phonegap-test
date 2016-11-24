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

new LoadTemplate(null, 'view-tpl').createAndWait (function (compiled, el) {
    ResultView.template = compiled;
});
