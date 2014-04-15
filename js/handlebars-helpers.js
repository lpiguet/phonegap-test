/**
* {{ellipsis}}
* @author: Jon Schlinkert <http://github.com/jonschlinkert>
* Truncate the input string and removes all HTML tags
* @param {String} str The input string.
* @param {Number} limit The number of characters to limit the string.
* @param {String} append The string to append if charaters are omitted.
* @return {String} The truncated string.
*/

Handlebars.registerHelper('ellipsis', function (str, limit, append) {
    if (typeof(append)=='undefined') {
        append = '';
    }
    var sanitized = str.replace(/(<([^>]+)>)/g, '');
    if (sanitized.length > limit) {
        return new Handlebars.SafeString (sanitized.substr(0, limit - append.length) + append);
    } else {
        return new Handlebars.SafeString (sanitized);
    }
});