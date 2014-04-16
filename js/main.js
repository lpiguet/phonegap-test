var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    registerEvents: function() {
        var self = this;

/*
        // Check of browser supports touch events...
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            console.log ('ontouchstart');
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('body').on('touchstart', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });

        } else {
            console.log ('onmousedown');
            // ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        }
*/
        $(window).on('hashchange', $.proxy(this.route, this));
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        alert ("[" + window.device.platform + "] [" + window.device.version + "]");
        if (window.device.platform == 'iOS' && window.device.version == '6') {
            // Move content a bit on iPhone 5 so the status bar does not overlap
            document.body.style.marginTop = "20px";
        }
    },

    route: function(store) {
        var self = this;

        if (!this.auth.getTicket()) {
            this.slidePage(this.auth.drawLogin());
            return;
        }

        var hash = window.location.hash;
        if (!hash) {
            if (!this.homePage) {
                this.homePage = new HomeView(this).render();
            }

            this.slidePage(this.homePage);
            return;
        }
        var match = hash.match(app.detailsURL);
        if (match) {
            var pidstr = $('#pid').val();

            this.store.findById(Number(match[1]), Number(pidstr), function(data) {
                self.slidePage(new ResultView(data).render());
            });
        }
    },

    slidePage: function(page) {
        
        var currentPageDest,
        self = this;
        
        // If there is no current page (app just started) -> No transition: Position new page in the view port
        if (!this.currentPage) {
            $(page.el).attr('class', 'page stage-center');
            $('body').append(page.el);
            $('#search-key').focus();
            this.currentPage = page;
            page.bindEvents();
            return;
        }
        
        // Cleaning up: remove old pages that were moved out of the viewport
        $('.stage-right, .stage-left').not('#homePage').remove();
        
        if (page === app.homePage) {
            // Always apply a Back transition (slide from left) when we go back to the search page
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";

        } else {
            // Forward transition (slide from right)
            $(page.el).attr('class', 'page stage-right');
            currentPageDest = "stage-left";
        }
        
        $('body').append(page.el);
        
        // Wait until the new page has been added to the DOM...
        setTimeout(function() {
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            self.currentPage = page;

            if (page == app.homePage) {
                $('#search-key').focus();
            } else {
                $('#search-key').blur();
            }
        });
    },

    initialize: function() {
        var self = this;
        this.detailsURL = /^#results\/(\d{1,})/;

        if (window.location.hostname == 'local-appstage.eks.com') {
            this.backend = 'http://local-appstage.eks.com/eps'; // local version
        } else {
            this.backend = 'https://appstage.eks.com/eps'; // deployed version
        }

        this.registerEvents();

        this.auth = new Auth (this.backend);
        this.store = new WebStore(this.backend, this.auth, function () { 
            self.route();
        });
    }
};

app.initialize();