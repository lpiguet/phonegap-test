var EditView = function (data) {

    this.initialize = function () {
        this.el = $('<div/>');
    };

    this.render = function () {
        this.el.html(EditView.template(data));
        return this;
    };

    this.bindEvents = function () { };

    this.initialize();
}

new LoadTemplate(null, 'edit-tpl').createAndWait (function (compiled, el) {
    EditView.template = compiled;
});
