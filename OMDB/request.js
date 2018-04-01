let request = require("request");
let fs = require('fs-extra');

// request("http://www.google.com", function(err, response, body){
//     if(err)
//         return console.log(err); 

//     console.log(body);

//     fs.writeFile("google.html", body);
// })

request("http://www.google.com")
	.then((response) => fs.writeFile("google.html", response))
	.catch(err => console.log(err));