/**
 * Created by unglued on 08/04/16.
 */

var getUrl = require('_config').getUrl;

var gameID = 1491283,
    iterator = 0,
    loadTime = 6000,
    numTests = 6,
    screenshots = 'screenshots/',
    waitTime = 1000;

casper.options.viewportSize = {width: 1280, height: 640};
casper.options.verbose = true;
// casper.options.logLevel = 'debug';

function capture (name) {
    'use strict';
    casper.capture(screenshots + (++iterator) + '_' + name + '.png');
}

function failureReport(failure){
    //if error type undefined function
    if(failure.message.message){//or failure.message.stack.TypeError
        failure.message.message = "Message : " + failure.message.message + "\nLine : "+ failure.message.line;//in jenkins -> title
    }
    //else assert error
    else{failure.message = "Message : " + failure.message + "\nLine : "+ failure.line + "\nCode : " + failure.lineContents;}

    //console.log(JSON.stringify(failure,4,'\t')); //see parameters you can modify in the failure object
}

casper.test.begin('WW2 - Smoke test', numTests, function suite (test) {

    
    /*
    * Setup
    * */
    casper.start(getUrl(), function () {
        capture('login');
        this.fill('#func_loginbox_form', {
            user: 'unglued',
            pass: 'alfa22'
        });
        this.click('#loginbutton_cont .button_wrapper_dark_bg_button');
    });
    casper.waitUntilVisible('#ifm',
        null,
        function onTimeout () {
            capture('wuber_error');
            this.echo('Reached loading timeout game.php. Exiting...').exit();
        },
        loadTime
    );
    casper.thenOpen(getUrl()).thenEvaluate(function () {
        window.location.href = document.getElementById('ifm').getAttribute('src');
    });
    casper.waitUntilVisible('#func_resource-bar-expander',
        null,
        function onTimeout () {
            capture('game_error');
            this.echo('Reached loading timeout mapContainer. Exiting...').exit();
        },
        loadTime
    );

    
    
    
    
    
    
    
    
    
    /*
     * Test case start
     * */

    // 1 Mini profile
    casper.wait(waitTime).then(function () {
        capture('game');
        test.assertVisible('#miniProfileContainer', 'Mini profile box is visible ');
    });

    // 2 Newspaper
    casper.then(function () {
        this.click('#func_btn_newspaper');
        this.wait(waitTime, function () {
            capture('newspaper');
            test.assertVisible('#newspaper_overview', 'Newspaper is visible ');
            this.click('.newspaper_popup_container .func_close_button');
        });
    });

    // 3 Diplomacy
    casper.wait(waitTime).then(function () {
        this.click('#func_btn_diplomacy');
        this.wait(waitTime, function () {
            capture('diplomacy');
            test.assertVisible('#diplomacyContainer', 'Diplomacy is visible ')
            this.click('#diplomacyContainer .func_close_button');
        });
    });

    // 4 Chat
    casper.wait(waitTime).then(function () {
        var timestamp = Math.round(new Date().getTime() / 1000);

        this.click('[chat_tab="ingame_' + gameID + '"]');

        this.fillSelectors('#func_ie_workaround', {
            '#func_chat_input': 'Hello from Casper (' + timestamp + ')!'
        });
        this.sendKeys('#func_chat_input', this.page.event.key.Enter);
        this.wait(waitTime, function () {
            'use strict';
            capture('chat');
            test.assertTextExists('Hello1 from Casper (' + timestamp + ')!', 'Chat is working').on("fail",failureReport);;
        });

    });

    // 5 Provinces
    casper.wait(waitTime).then(function () {
        this.click('#provinceListContainer .func_fold_button');
        this.wait(waitTime, function () {
            capture('province_list');
            test.assertVisible('#func_province_list_wrapper', 'Province list is visible ');
            this.click('#provinceListContainer .func_fold_button');
        });
    });
    

    // 6 Choose random province
    casper.wait(waitTime).then(function () {
        var text = this.evaluate(function () {
            var map = hup.gameState.getMapState(),
                provinces = map.getPlayerProvinces(),
                randomProvince = provinces[Math.floor(Math.random() * provinces.length)];

            hup.provinceSelection.setSelected([randomProvince], false, true, false, true, false, true);

            return randomProvince.name;
        });

        this.wait(waitTime, function () {
            capture('province');
            test.assertSelectorHasText('.province_bar_title_cell h1', text, 'Province Selectable');
        });

    });

    // 7 Build random building
   /* casper.wait(waitTime).then(function () {
        var index;

        this.click('#province_bar .func_provconstr_toggle');

        this.wait(waitTime, function () {
            capture('building');
            index = this.evaluate(function () {
                var buttons = $('.func_prov_construct:not([disabled])');

                return $(buttons[0/!*Math.floor(
                    Math.random() * buttons.length
                )*!/].closest('tr')).index();
            });

            require('utils').dump(index);

            //this.click('#table_prov_popup .table_prov_popup tr:nth-child(' + (index - 1) + ')');
        });

        this.wait(waitTime, function () {
            capture('building');
            test.assertDoesntExist('.func_constructions .production_slot .no_production');
        });

    });*/

    casper.run(function () {
        test.done();
    });
});

