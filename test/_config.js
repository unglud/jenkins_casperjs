exports.getUrl = function () {
    'use strict';

    return 'http://www.callofwar.com/play.php?uid=5417123&gameID=1491283';
    
    var game = casper.cli.has('game') ? casper.cli.get('game') : 'ww2',
        gameID = casper.cli.has('id') ? casper.cli.get('id') : 511,
        port = casper.cli.has('p') ? casper.cli.get('p') : 8181,
        smoke = casper.cli.has('smoke'),
        userID = casper.cli.has('user') ? casper.cli.get('user') : 63;

    if (smoke) {
        return 'http://www.callofwar.com/play.php?uid=5417123&gameID=1491283';
    }

    return 'http://bytro.dev/' + game + '-client/src/main/index_local.html?static=localhost&noAds=1&port=' + port + '&betaUser=1&userID=' + userID + '&gameID=' + gameID + '&adminLevel=3';
};
