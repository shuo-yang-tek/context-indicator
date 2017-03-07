# Info
`indicator.colors` equals [colors](https://www.npmjs.com/package/colors)
      
# Example
```javascript
let indicator = require('context-indicator');

function cb(data) {
    console.log(data);
}

let opts = {
    maxLine: 5,     // default: 15
    color: true     // default: false
};

// custom colors function
opts = {
    color: indicator.colors.red.underline
};

// use path
let file = './index.js';

// use stream
file = require('fs').createReadStream('./index.js');

indicator(
    file,           // file path or stream
    10,             // line number
    12,             // column number
    cb,             // callback
    opts            // (optional)
);
```
