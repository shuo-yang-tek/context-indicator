let colors = require('colors');

module.exports = function(file, line, column, callback, opts) {
    let isRS = require('is-stream').readable;
    file = isRS(file) ? file : require('fs').createReadStream(file);

    line = line || 0;
    column = column || 0;

    if( line <= 0 )
        throw 'line must >= 1';
    if( column <= 0 )
        throw 'column must >= 1';

    if( typeof callback !== 'function' )
        throw 'callback required';

    opts = opts || {};

    opts.maxLine = typeof opts.maxLine === 'number' ? opts.maxLine : 15;
    if( opts.maxLine <= 0 )
        throw 'opts.maxLine must >= 1';

    opts.color = opts.color || false;
    
    if( opts.color === true)
        opts.color = colors.black.bgYellow.bold;
    else if( opts.color === false )
        opts.color = function( str ) { return str; };

    let resultArr = [],
        lineCount = 1;

    let startLine = line - Math.floor( opts.maxLine / 2 );
    startLine = startLine < 1 ? 1 : startLine;
    let endLine = startLine + opts.maxLine - 1;

    function onLine(data) {
        if( lineCount <= endLine ) {
            resultArr.push({
                lineCount: lineCount,
                str: data
            });

            let killCount = resultArr.length - opts.maxLine;
            if(killCount > 0) {
                resultArr.splice(0, killCount);
            }

            if( lineCount === endLine )
                this.close();
        }

        lineCount += 1;
    }

    function onClose() {
        if( resultArr[0].lineCount + resultArr.length - 1 < line )
            throw 'line out of range';


        let leftLen = Math.floor(
            Math.log10(
                resultArr[resultArr.length - 1].lineCount
            )
        ) + 7;

        let underLine = Array(column).join(' ') + '^';

        let resultStr = '';

        for( let item of resultArr ) {
            let leftTmp = ' ' + item.lineCount.toString() + ' | ',
                bodyTmp = item.str;

            if( item.lineCount === line ) {
                leftTmp = ' >' + leftTmp;
                bodyTmp = opts.color(bodyTmp) + '\n' + 
                    Array(leftLen + 1).join(' ') + underLine;
            }

            leftTmp = Array(leftLen - leftTmp.length + 1).join(' ') + leftTmp;

            resultStr += leftTmp + bodyTmp + '\n';
        }

        callback( resultStr.replace( /\n$/g, '' ) );
    }

    require('readline').createInterface({
        input: file
    })
    .on('line', onLine)
    .on('close', onClose);
};

module.exports.colors = colors;
