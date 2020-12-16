// Variables used for handling cookies
let trackId = '';
let tr = '';
let trackName = '';
let trackPrice = 0;
let totalPrice = 0;
let addedTracksNames = '';
let addedTracksIds = '';
let addedTracksPrices = '';

function setCookie(name, value, days) {
    // Encode value in order to escape semicolons, commas, and whitespace
    var cookie = name + '=' + encodeURIComponent(value);
    
    if(typeof days === 'number') {
        /* Sets the max-age attribute so that the cookie expires
        after the specified number of days */
        cookie += '; max-age=' + (days*24*60*60);
        
        document.cookie = cookie;
    }
}

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(';');
    
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i ++) {
        var cookiePair = cookieArr[i].split('=');
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}