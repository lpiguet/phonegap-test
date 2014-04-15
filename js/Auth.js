var Auth = function (backend) {

    this.initialize = function () {
        if (!this.getTicket()) {
            this.drawLogin();
        }
    }

    this.getTicket = function () {

        var ticket = localStorage.getItem ('ticket');
//        console.log ('Checked ticket:'+ticket);
        if (ticket) {
//            console.log ('Auth: success');
            return true;
        } else {
//            console.log ('Auth: no ticket');
            return false;
        }
    }

    this.logout = function () {
        localStorage.removeItem ('ticket');
        location.reload(); // reload the page
    }

    this.drawLogin = function () {

        var uuid;
        var name;
        var platform;
        var version;
        if (typeof device === 'undefined') {
            uuid = 'browser';
            name = navigator.appCodeName;
            platform = navigator.platform;
            version = navigator.appVersion;
        } else {
            uuid = device.uuid;
            name = device.name;
            platform = device.platform;
            version = device.version;
        }

        var txt = '<div class="row user form"><div id="login-error"></div><form accept-charset="utf-8" method="post" id="UserLoginForm" class="nice" action="';
        txt += this.backend+'/mobile/authenticate"><div style="display:none;">';
        txt += '<input type="hidden" value="POST" name="_method">';
        txt += '<input type="hidden" value="'+uuid+'" name="data[Device][uuid]" />';
        txt += '<input type="hidden" value="'+name+'" name="data[Device][name]" />';
        txt += '<input type="hidden" value="'+platform+'" name="data[Device][platform]" />';
        txt += '<input type="hidden" value="'+version+'" name="data[Device][version]" /></div>';
        txt += '<div id="login-form"><fieldset><legend>Please enter your username and password</legend>';
        txt += '<div class="form-field required"><label for="UserUsername">Username</label><input type="text" required="required" id="UserUsername" maxlength="100" class="input-text medium input-text" name="data[User][username]"></div><div class="form-field required"><label for="UserPassword">Password</label><input type="password" required="required" id="UserPassword" class="input-text medium input-text" name="data[User][password]"></div>';
        //    txt += '<div class="submit"><button>Submit</button></div></form></div>';
        txt += '<div class="go"><button class="small button">Submit</button></div></fieldset></form></div></div>';

        this.el = $('<div id="login-div"/>');
        this.el.html(Auth.template());
        this.el.append (txt);        
        return this;
    }

    this.bindEvents = function () {

        $('#UserUsername').focus();

        //callback handler for form submit
        $("#UserLoginForm").submit(function(e) {

            var postData = $(this).serializeArray();
            var formURL = $(this).attr("action");
            $.ajax({
                url : formURL,
                type: "POST",
                data : postData,
                context: this,
                success:function(data, textStatus, jqXHR) {
                    //data: return data from server
                    console.log ('Success: received: ' + data);
                    var result = jQuery.parseJSON (data);
                    if (result && result.status == 'OK') {
                        localStorage.setItem ('ticket', result.ticket);
                        console.log ('Success: stored: ' + localStorage.getItem ('ticket'));
                        $("#login-div").empty();
                        location.reload(); // reload the page
                    } else {
                        $('#login-error').html (result.message);
                        $('#UserPassword').val('');
                        console.log ('Login Error: ' + result.message);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    //if fails     
                    console.log ('Failure: ' + textStatus);
                }
            });
            e.preventDefault(); //STOP default action
        });
    }

    this.backend = backend;
    this.initialize();
}

Auth.template = Handlebars.compile($("#auth-tpl").html());
