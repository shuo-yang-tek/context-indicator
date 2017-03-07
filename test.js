let index = require('./index.js'),
    fs = require('fs');

let rs = fs.createReadStream('./index.js');

index(rs, 3, 7, function(data) {
    console.log(data);
}, {
    color: true
});
