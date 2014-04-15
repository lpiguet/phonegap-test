var WebStore = function(backend, ticket, successCallback, errorCallback) {

    // Used to simulate async calls. This is done to provide a consistent interface with stores (like WebSqlStore)
    // that use async data access APIs
    var callLater = function(callback, data) {
        if (callback) {
            setTimeout(function() {
                callback(data);
            });
        }
    }

    this.findByName = function(searchKey, pid, callback) {
        var ticket = localStorage.getItem('ticket');
        localStorage.setItem('pid', pid);
//        console.log ('Ticket: '+ticket);
        $.getJSON(
            this.backend+'/mobile/getdata/query/'+pid+'/'+searchKey+'.json?ticket='+ticket,
            function (res) {
                if (res) {
                    if (res.status == 'ERROR-AUTH') {
                        localStorage.removeItem ('ticket');
                        location.reload(); // reload the page
                    } else if (res.status == 'ERROR') {
                        app.showAlert (res.message);
                    } else {
                        callLater (callback, res);
                    }
                }
            }
        );
    };

    this.findById = function(id, pid, callback) {

        var ticket = localStorage.getItem('ticket');

        $.getJSON(
            this.backend+'/mobile/getdata/id/'+pid+'/'+id+'.json?ticket='+ticket,
            function (res) {
                if (res) {
//                    console.log ('getdata/id: Result: '+ res.length + ' items');
                }
                callLater(callback, res);
            }
        );
    };
    this.backend = backend;
    callLater(successCallback);
}