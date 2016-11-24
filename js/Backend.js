function Backend (name, addr, endpoint, auth_endpoint) {

    this.getAddr = function () {
        return this.addr;
    }

    this.getTicket = function () {
        return this.auth.getTicket();
    }

    if (window.location.hostname == 'local-'+addr) {
        this.addr = 'http://local-'+addr+'/'+endpoint; // local version
    } else if (window.location.hostname == 'local.'+addr) {
        this.addr = 'http://local.'+addr+'/'+endpoint; // local version
    } else {
        this.addr = 'https://'+addr+'/'+endpoint; // deployed version
    }

    this.auth = new Auth (name, this.addr+auth_endpoint);

//    console.log ('new '+ this.constructor.name + ': '+ JSON.stringify(this));

}
