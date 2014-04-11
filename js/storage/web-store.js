var WebStore = function(successCallback, errorCallback) {

    this.backend = 'http://localhost/eps_search';

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

        $.getJSON(
            this.backend+'/search/getdata/query/'+pid+'/'+searchKey+'.json',
            function (res) {
                if (res) {
                    console.log ('getdata/query: Result: '+ res.length + ' items');
                }
                callLater (callback, res);
            }
        );
    };

    this.findById = function(id, pid, callback) {

        $.getJSON(
            this.backend+'/search/getdata/id/'+pid+'/'+id+'.json',
            function (res) {
                if (res) {
                    console.log ('getdata/id: Result: '+ res.length + ' items');
                }
                callLater(callback, res);
            }
        );
    };

    callLater(successCallback);
}