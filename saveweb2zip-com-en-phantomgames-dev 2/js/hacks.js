let currentFunction = null;  // to keep track of which function is currently active

function showHackScreen() {
    document.querySelector('.gameHackScreen').style.display = 'flex';
}

document.getElementById('hackButton').addEventListener('click', function() {
    let newValue = document.getElementById('coinInput').value;

    try {
        if (currentFunction === vexSix) {
            let vex6_sg = JSON.parse(localStorage.getItem('vex6_sg'));

            if(!vex6_sg || !vex6_sg.stats) {
                throw new Error("Invalid game data");
            }

            vex6_sg.stats.tm = Number(newValue);
            localStorage.setItem('vex6_sg', JSON.stringify(vex6_sg));
            closeControls(event)
            play('vexsix', './game/vex6/index.html', 'Vex 6', 'Vex 6 is an awesome online game where you need to pass all the dangerous obstacles!')
        } else if (currentFunction === monkeyMart) {
            let vex6_sg = JSON.parse(localStorage.getItem('monkeymart_config'));

            vex6_sg.coins = Number(newValue);
            localStorage.setItem('monkeymart_config', JSON.stringify(vex6_sg));
            closeControls(event)
            play('monkeymart', './game/monkey-mart/index.html', 'Monkey Mart', 'Swing into action in Monkey Mart, a challenging platformer where youre a monkey collecting fruits while avoiding jungle dangers.')
        } else if (currentFunction === retroBowl) {
            function updateLocalStorage(key, newCoins) { 
                let savedata = localStorage.getItem('RetroBowl.0.savedata.ini'); 
                let lines = savedata.split('\n'); 
                for (let i = 0; i < lines.length; i++) { 
                    let line = lines[i]; 
                    if (line.startsWith(key + '=')) { 
                        lines[i] = key + '=' + `"${newCoins}"`; 
                        break; 
                    } 
                } 
                savedata = lines.join('\n'); 
                localStorage.setItem('RetroBowl.0.savedata.ini', savedata); 
            } 
            updateLocalStorage('coach_credit', newValue);

            closeControls(event)
            play('retrobowl', './game/retro-bowl/index.html', 'Retrobowl', 'Retro Bowl is an American style football game. Are you ready to manage your dream team into victory?')
        } else if (currentFunction === templeRunTwo) {
            let storage = JSON.parse(localStorage.getItem('TR2_GAME_STATE'));

            storage.statsData.totalCoins = Number(newValue);

            localStorage.setItem('TR2_GAME_STATE', JSON.stringify(storage));
            closeControls(event)
            play('templeruntwo', './game/temple-run/index.html', 'Temple Run', 'Test your reflexes as you race down ancient temple walls and along sheer cliffs.')

        } else if (currentFunction === bobTheRobberTwo) {
            localStorage.setItem('totalMoneyBOB2Robb3r', newValue)
            closeControls(event)
            play('bobtherobbertwo', './game/bob-the-robber-2/index.html', 'Bob The Robber 2', 'Enter locations around the town and loot them, picking locks, avoiding traps, lasers, and guards in this cute action adventure.')
        } else if (currentFunction === jetPackJoyride) {
            let storage = JSON.parse(localStorage.getItem('data'));
            storage.coin = Number(newValue);
            localStorage.setItem('data', JSON.stringify(storage));
            closeControls(event)
            play('jetpackjoyride', './game/jetpack-joyride', 'Jetpack Joyride', 'Strap on a bullet-powered jetpack to dodge lasers, electric fields and all the missiles that come your way.')
        } else if (currentFunction === eggyCar) {
            const openRequest = indexedDB.open('localforage');

            openRequest.onupgradeneeded = function() {
                const db = openRequest.result;
                if (!db.objectStoreNames.contains('keyvaluepairs')) {
                    db.createObjectStore('keyvaluepairs');
                }
            };

            openRequest.onerror = function() {
                console.error("Error", openRequest.error);
            };

            openRequest.onsuccess = function() {
                const db = openRequest.result;

                const transaction = db.transaction('keyvaluepairs', 'readwrite');
                const store = transaction.objectStore('keyvaluepairs');
                store.put(newValue, 'eggcar_coins');

                transaction.oncomplete = function() {
                    console.log("refresh PhantomGames");
                };

                transaction.onerror = function() {
                    alert('Transaction not opened due to error:', transaction.error);
                };
            };
            closeControls(event)
            play('eggycar', './game/eggy-car/index.html', 'Eggy Car', 'Eggy Car is a very hard driving game in which you must transport eggs while driving over rough roads.')
        }
    } catch (error) {
        alert("Please play the game for a short amount of time and try again.");
    }

    document.querySelector('.gameHackScreen').style.display = 'none';
});

function vexSix() {
    currentFunction = vexSix;
    showHackScreen();
}

function monkeyMart() {
    currentFunction = monkeyMart;
    showHackScreen();
}

function retroBowl() {
    currentFunction = retroBowl;
    showHackScreen();
}

function templeRunTwo() {
    currentFunction = templeRunTwo;
    showHackScreen();
}

function bobTheRobberTwo() {
    currentFunction = bobTheRobberTwo;
    showHackScreen();
}

function cookieClicker() {
    alert("Click somewhere on the screen and then press the 'h' key to open the hack menu!")
}

function jetPackJoyride() {
    currentFunction = jetPackJoyride;
    showHackScreen();
}

function eggyCar() {
    currentFunction = eggyCar;
    showHackScreen();
}