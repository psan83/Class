/*  JavaScript Classhelper
 *  By Andreas Petersson
 *  MIT Licensed.
 */

// Modyfied version of http://ejohn.org/blog/simple-javascript-inheritance/
(function () {
    var initializing = false;

    // The base Class implementation (does nothing)
    this.Class = function () { };

    // Create a new Class that inherits from this class
    Class.$extend = function (config) {

        // reference to parent object
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        // obj: add scope to all functions here 
        function _applyScope(obj) {
            for (var key in obj) {

                // Check if we're overwriting an existing function
                obj[key] = typeof obj[key] == "function" ?
                (function (key, fn) {
                    return function () {

                        // setup scope 
                        var scope = {};
                        Utils.copy(config.private, scope);
                        Utils.copy(this, scope);

                        // add $super if parent has the same function
                        if (typeof _super[key] == "function") {
                            scope.$super = _super[key];
                        }

                        // add reference to parent class
                        if (_super) {
                            scope.$class = Class;
                        }

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(scope, arguments);

                        // save changes that was made in scope (function)
                        Utils.copy(scope, config.private, config.private);
                        Utils.copy(scope, this, config.public);

                        return ret;
                    };
                })(key, obj[key]) :
                obj[key];
            }
        }

        // The dummy class constructor
        function Class() {

            // All construction is actually done in the init method
            if (!initializing && config.init) {
                config.init.apply(this, arguments);
            }

            // add referende to class  
            this.$class = Class;
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.$extend = arguments.callee;

        // default 
        /*config = Utils.copy(config, {
        init: function () { },
        private: {},
        public: {},
        static: {}
        });*/
        config = Utils.getDefault(config, {});

        // constructor
        config.init = Utils.getDefault(config.init, null);

        if (config.init == null) {

            // inherit if null
            config.init = _super.init;
        }

        // default variables
        config.private = Utils.getDefault(config.private, {});
        config.public = Utils.getDefault(config.public, {});
        config.static = Utils.getDefault(config.static, {});

        // add mixins
        if (config.mixins) {

            // create array if it's not already an array
            var mixins = Utils.createArray(config.mixins);

            // go though all mixins 
            for (var index in mixins) {

                // copy mixin-values to config
                var mixin = mixins[index];
                for (var key in mixins[index]) {
                    Utils.copy(mixin[key], config[key]);
                }
            }
        }

        // add init to the object
        Class.prototype.init = config.init;

        // add scope to config  (should only be "init" that is a function anyways)
        _applyScope(config);

        // set public properties (variables / functions)
        Utils.copy(config.public, Class.prototype);
        _applyScope(Class.prototype);
        Utils.copy(Class.prototype, config.public);

        // set static properties 
        for (var key in config.static) {
            Class[key] = config.static[key];
        }

        // set inherited static properties
        // todo: use _copy ? 
        for (var key in this) {

            // don't copy these properties 
            var isInArray = Utils.inArray(key, ['$extend', 'prototype']);

            // copy properties that are allowed to be copied
            if (!isInArray) {
                Class[key] = this[key];
            }
        }

        // set scope to private functions 
        _applyScope(config.private);

        return Class;
    };
})();
