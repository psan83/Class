var Utils = {

    /** 
    * Checks if a object is null or undefined and returns a default value if it is. 
    * 
    * @param   {object}    obj           Object to check 
    * @param   {object}    defaultValue  Default value to return is object is null or undefined
    *
    * @returns {object}    obj if it's not null or empty, in that case it will return the default value 
    */
    getDefault: function (obj, defaultValue) {
        return (obj != null && obj != undefined) ? obj : defaultValue;
    },

    /** 
    * Checks if a value is present in a array
    * 
    * @param    {object}   value  Value to look for 
    * @param    {array}    array  Array to search for value in
    *
    * @returns  {bool}     true if the value is found in the array, otherwise false
    */
    inArray: function (value, array) {
        for (var key in array) {
            if (value === array[key]) {
                return true;
            }
        }

        return false;
    },

    /** 
    * Checks if a value is a array
    * 
    * @param    {object}  obj  Object to check
    *
    * @returns  {bool}    true if the value is a array, otherwise false
    */
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },

    /** 
    * Creates a array if it's not already a array
    *
    * @param    {object}  obj  Object to check
    *
    * @returns  {array}   The created array
    */
    createArray: function (obj) {
        if (Utils.isArray(obj)) {
            return obj;
        }

        return [obj];
    },

    /** 
    * Copies properties from one object to another.
    *
    * @todo     add support for arrays to and not only objects (accept)
    * 
    * @param    {object}    from        Copy from this object
    * @param    {object}    to          Copy to this object
    * @param    [object]    [accept]    The properties copied from "from" must exist in this object. If not used, the default value will be "from" (all).
    *
    * @returns  {object}     Copied items in a new object
    */
    copy: function (from, to, accept) {
        var copied = {}
        accept = accept ? accept : from;
        for (var key in from) {
            if (accept[key] !== undefined) {
                copied[key] = to[key] = from[key];
            }
        }
        return copied;
    },

    /** 
    * Merges the two objects. The first will overwrite the second.
    *
    * @todo     add support for arrays to and not only objects (accept)
    * 
    * @param    {object}    from        Copy from this object
    * @param    {object}    to          Copy to this object
    * @param    [object]    [accept]    The properties copied from "from" must exist in this object. If not used, the default value will be "from" (all).
    *
    * @returns  {object}     Copied items in a new object
    */
    copy: function (from, to, accept) {
        accept = accept ? accept : from;
        for (var key in from) {
            if (accept[key] !== undefined) {
                to[key] = from[key];
            }
        }
        return to;
    },

    /** 
    * Loads xml from the server from the url in the url-parameter
    *
    * @param   {object}    config  Configuration of ajax call. 
    *
    *                               {
    *                                   url: "",
    *                                   method: "POST",     
    *                                   callback: function(response) { }
    *                               }
    */
    ajax: function (config) {

        // default values
        config = Utils.copy(config, {
            url: "",
            method: "POST",
            callback: null
        });

        var xmlhttp;

        if (window.XMLHttpRequest) {

            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {

            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {

            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if (callback != null) {
                    callback({
                        text: xmlhttp.responseText,
                        xml: xmlhttp.responseXML
                    });
                }
            }
        }

        xmlhttp.open(config.method, config.url, true);
        xmlhttp.send();
    }
}