window.onload = function (e) {
    let loader = document.querySelector('#loader');
    loader.parentNode.removeChild(loader);
}

window.onscroll = function () {
    navbar.toggleBackgroundColor();
}

const navbar = new Vue({
    delimiters: ['[[', ']]'],
    el: '#navbar',
    data: {
        background: false,
    },
    methods: {
        toggleBackgroundColor: function (e) {
            if (window.scrollY > 5) {
                this.background = true;
            }
            else {
                this.background = false;
            }
        }
    },
    computed: {
        classes: function () {
            return {
            "navbar": true,
            "fixed-top": true,
            "navbar-expand-md": true,
            "navbar-dark": true,
            "bg-brand-color-1": this.background,
            "bg-transparent": !this.background,
            }
        }
    }

})

const urlShortener = new Vue({
    delimiters: ['[[', ']]'],
    el: '#urlShortener',
    data: {
        url: '',
        urlIsShortened: false,
        errors: [],
        errorCodes: {
            URL_IS_INVALID: 'The URL is invalid. Try starting with http://, https:// or ftp://',
            URL_IS_SHORT: '',
        }
    },
    methods: {
        urlIsValid: function (url) {
            let isValid = false;
            if (!url) return false;
            if (!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('ftp://')) {
                return false;
            }
            return true;
        },
        shortenURL: function (e) {
            if (this.urlIsValid(this.url)) {
                let api = 'http://localhost:8000/api/short-url/';
                axios.post(api, { url: this.url })
                    .then(response => {
                        this.url = response.data.url;
                        this.urlIsShortened = true
                    })
                    .catch(err => {
                        this.errors.push(this.errorCodes.URL_IS_INVALID);
                    });
            }
            else {
                this.errors.push(this.errorCodes.URL_IS_INVALID);
            }
        },
        shortenURLOnEnter: function (e) {
            if (e.keyCode === 13) {
                this.shortenURL();
                e.preventDefault();
            }
        },
        copy: function (e) {
            copy(this.url);
        },
        showShortenButton: function (e) {
            this.urlIsShortened = false;
        }
    },
    mounted: function () {
        new ClipboardJS('#copyURLButton');
    }
})