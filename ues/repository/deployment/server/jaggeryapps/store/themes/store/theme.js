var cache = false;

var engine = caramel.engine('handlebars', (function () {
    return {
        partials: function (Handlebars) {
            var theme = caramel.theme();
            var partials = function (file) {
                (function register(prefix, file) {
                    var i, length, name, files;
                    if (file.isDirectory()) {
                        files = file.listFiles();
                        length = files.length;
                        for (i = 0; i < length; i++) {
                            file = files[i];
                            register(prefix ? prefix + '.' + file.getName() : file.getName(), file);
                        }
                    } else {
                        name = file.getName();
                        if (name.substring(name.length - 4) !== '.hbs') {
                            return;
                        }
                        file.open('r');
                        Handlebars.registerPartial(prefix.substring(0, prefix.length - 4), file.readAll());
                        file.close();
                    }
                })('', file);
            };
            //TODO : we don't need to register all partials in the themes dir.
            //Rather register only not overridden partials
            partials(new File(theme.__proto__.resolve.call(theme, 'partials')));
            partials(new File(theme.resolve('partials')));
        },
        render: function (data, meta) {
        	//print(data);
            this.__proto__.render.call(this, data, meta);
            
        },
        globals: function (data, meta) {
            var store = require('/modules/store.js'),
                user = require('/modules/user.js').current();
            return 'var store = ' + stringify({
                user: user ? user.username : null
            });
        }
    };
}()));

var resolve = function (path) {
    var p,
        store = require('/modules/store.js'),
        asset = store.currentAsset();
    if (asset) {
        p = store.ASSETS_EXT_PATH + asset + '/themes/' + this.name + '/' + path;
        if (new File(p).isExists()) {
            return p;
        }
    }
    return this.__proto__.resolve.call(this, path);
};