/*  JavaScript Classhelper
 *  By Andreas Petersson
 *  MIT Licensed.
 */

// Modyfied version of http://ejohn.org/blog/simple-javascript-inheritance/
(function () {
    var initializing = false;

    /** 
     * Checks if a object is null or undefined and returns a default value if it is. 
     * 
     * @param   {object}    obj           Object to check 
     * @param   {object}    defaultValue  Default value to return is object is null or undefined
     *
     * @returns {object}    obj if it's not null or empty, in that case it will return the default value 
     */
    function _default(obj, defaultValue) {
        return obj ? obj : defaultValue;
    }

    /** 
    * Checks if a value is present in a array
    * 
    * @param    {object}   value  Value to look for 
    * @param    {array}    arr    Array to search for value in
    *
    * @returns  {bool}     true if the value is found in the array, otherwise false
    */
    function _inArray(value, arr) {
        for (var key in arr) {
            if (value == key) {
                return true;
            }
        }

        return false;
    }

    /** 
    * Checks if a value is a array
    * 
    * @param    {object}  obj  Object to check
    *
    * @returns  {bool}    true if the value is a array, otherwise false
    */
    function _isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /** 
    * Creates a array if it's not already a array
    * 
    * @param    {object}  obj  Object to check
    *
    * @returns  {array}   The created array
    */
    function _createArray(obj) {
        if (_isArray(obj)) {
            return obj;
        }

        return [obj];
    }

    // copies objects from one object to another
    // accept: varibles to accept, defaults to from 
    /** 
    * Copies objects from one object to another
    * 
    * @param    {object}    from        Copy from this object
    * @param    {object}    to          Copy to this object
    * @param    [object]    [accept]    The properties copied from "from" must exist in this object. If not used, the default value will be "from" (all).
    */
    function _copy(from, to, accept) {
        accept = accept ? accept : from;
        for (var key in from) {
            if (accept[key] !== undefined) {
                to[key] = from[key];
            }
        }
    }

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
                        _copy(config.private, scope, config.private);
                        _copy(this, scope, config.public);

                        // add $super if parent has the same function
                        if (typeof _super[key] == "function") {
                            scope.$super = _super[key];
                        }

                        if (_super) {
                            scope.$class = Class;
                        }

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(scope, arguments);

                        // save changes that was made in scope (function)
                        _copy(scope, config.private, config.private);
                        _copy(scope, this, config.public);

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
        config = _default(config, {});
        config.init = _default(config.init, null);

        // default variables
        config.private = _default(config.private, {});
        config.public = _default(config.public, {});
        config.static = _default(config.static, {});

        // add init to the object
        Class.prototype.init = config.init;

        // add scope to config  (should only be "init" that is a function anyways)
        _applyScope(config);

        // set public properties (variables / functions)
        _copy(config.public, Class.prototype);
        _applyScope(Class.prototype);
        _copy(Class.prototype, config.public);

        // set static properties 
        for (var key in config.static) {
            Class[key] = config.static[key];
        }

        // set inherited static properties
        for (var key in this) {
            var isInArray = _inArray(key, ['$extend', 'prototype']);
            if (!isInArray) {
                Class[key] = this[key];
            }
        }

        // set scope to private functions 
        _applyScope(config.private);

        return Class;
    };
})();
