var app = require("../app");

var parse_cookies = function(sock_session_data){
    //io=nysPzQUQlbMeru1MAAAB; csrftoken=wWMRl0FbINVGYkV6xrGV9MCdiECg0OQP; 
    //sessionid=iuh022l85bsmqki9w4hxib6ag2pgvvar; 
    //session_cookie_name=s%3AdfRIosLwijblDwIxnx413MwA8pbPhX9j.7MALT8RIp33sciOU0ShZqK%2BhrpgFT2%2BoJXh7YTcurXo
    var parsed_data = {};
    var data_array = sock_session_data.split(";");
    for(var i = 0; i < data_array.length; i++)
    {
        var key_val = data_array[i].split("=");
        parsed_data[key_val[0].trim()] = key_val[1].trim();
    }
    return parsed_data;
};

var exports = module.exports = {
	parse_cookies: parse_cookies
};