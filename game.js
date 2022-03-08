var gold = 0;
var monster_spawn = 1;
var currentMonster = new Object;
var currentWeapon = new Object;
var currentArmor = new Object;

var isStatsOpen = false;
var isEqOpen = false;
var isShopOpen = false;
var isPlayerAlive = true;

var player = {
    lvl: 1,
    exp: 0,
    lvlup_exp: 15,
    hp: 100,
    maxhp: 100,
    dmg: 2
};

var monster1 = new Object;
var monster2 = new Object;
var monster3 = new Object;
var monster4 = new Object;
var monster5 = new Object;
var monsters = [monster1, monster2, monster3, monster4, monster5];

var weapon1 = new Object;
var weapon2 = new Object;
var weapon3 = new Object;
var weapon4 = new Object;
var weapon5 = new Object;
var noweapon = new Object;

var armor1 = new Object;
var armor2 = new Object;
var armor3 = new Object;
var armor4 = new Object;
var armor5 = new Object;
var noarmor = new Object;

var items = [weapon1, weapon2, weapon3, weapon4, weapon5, armor1, armor2, armor3, armor4, armor5, potion];

var potion = new Object;

function Initialize() {
    //Inicjalizacja przeciwnikow
    monster1.image = "assets/sprites/bat.png";
    monster1.lvl = 1;
    monster1.maxhp = 30;
    monster1.dmg = 5;
    monster1.loot = 40;
    monster1.exp = 5;

    monster2.image = "assets/sprites/s_warrior.png"
    monster2.lvl = 3;
    monster2.maxhp = 70;
    monster2.dmg = 10;
    monster2.loot = 100;
    monster2.exp = 15;

    monster3.image = "assets/sprites/s_mage.png"
    monster3.lvl = 8;
    monster3.maxhp = 200;
    monster3.dmg = 25;
    monster3.loot = 250;
    monster3.exp = 40;

    monster4.image = "assets/sprites/assassin.png"
    monster4.lvl = 15;
    monster4.maxhp = 450;
    monster4.dmg = 40;
    monster4.loot = 800;
    monster4.exp = 100;

    monster5.image = "assets/sprites/sun_goddess.png"
    monster5.lvl = 20;
    monster5.maxhp = 1000;
    monster5.dmg = 100;
    monster5.loot = 2500;
    monster5.exp = 500;

    //Inicjalizacja przedmiotow
    //Bronie
    weapon1.name = "Miecz";
    weapon1.dmg = 4;
    weapon1.cost = 300;
    weapon1.id = 1;

    weapon2.name = "Miecz";
    weapon2.dmg = 8;
    weapon2.cost = 1600;
    weapon2.id = 2;

    weapon3.name = "Miecz";
    weapon3.dmg = 15;
    weapon3.cost = 5500;
    weapon3.id = 3;

    weapon4.name = "Miecz";
    weapon4.dmg = 25;
    weapon4.cost = 14000;
    weapon4.id = 4;

    weapon5.name = "Miecz";
    weapon5.dmg = 50;
    weapon5.cost = 70000;
    weapon5.id = 5;

    noweapon.name = "";
    noweapon.dmg = 0;
    noweapon.cost = 0;
    noweapon.id = 0;

    //Zbroje
    armor1.name = "Zbroja";
    armor1.def = 2;
    armor1.cost = 700;
    armor1.id = 6;

    armor2.name = "Zbroja";
    armor2.def = 5;
    armor2.cost = 3500;
    armor2.id = 7;

    armor3.name = "Zbroja";
    armor3.def = 10;
    armor3.cost = 11000;
    armor3.id = 8;

    armor4.name = "Zbroja";
    armor4.def = 20;
    armor4.cost = 30000;
    armor4.id = 9;

    armor5.name = "Zbroja";
    armor5.def = 40;
    armor5.cost = 100000;
    armor5.id = 10;

    noarmor.name = "";
    noarmor.def = 0;
    noarmor.cost = 0;
    noarmor.id = 0;

    currentWeapon = noweapon;
    currentArmor = noarmor;

    potion.name = "Leczenie";
    potion.heal = 50;
    potion.cost = 100;
    potion.id = 11;

    SpawnMonster();
}

function SpawnMonster() {
    var randomMonster = Math.floor(Math.random() * monster_spawn);
    currentMonster = monsters[randomMonster];
    document.getElementById("level").textContent = currentMonster.lvl.toString();
    document.getElementById("monster_img").src = currentMonster.image;
    currentMonster.hp = currentMonster.maxhp;
    UpdateMonsterBar();

    if (player.hp > 0 && currentMonster.hp > 0) {
        MonsterAttack(true);
    }
}

function PlayerAttack() {
    if (isPlayerAlive) {
        currentMonster.hp -= player.dmg + currentWeapon.dmg;
        UpdateMonsterBar();

        if (currentMonster.hp <= 0) {
            OnMonsterDeath();
        }
    }
}

function MonsterAttack(init) {
    if (init) {
        init = false;
        attackDelay = Math.random() * 1500 + 500;
        mAttack = setTimeout(MonsterAttack, attackDelay);
    }
    else {
        player.hp -= currentMonster.dmg - currentArmor.def;
        UpdatePlayerBar();

        if (player.hp <= 0) {
            OnPlayerDeath();
        }

        else if (isPlayerAlive && currentMonster.hp > 0) {
            attackDelay = Math.random() * 1500 + 500;
            mAttack = setTimeout(MonsterAttack, attackDelay);
        }
    }
}

function OnMonsterDeath() {
    clearTimeout(mAttack);

    player.exp += currentMonster.exp;
    if (player.exp >= player.lvlup_exp) {
        LevelUp();
    }

    gold += currentMonster.loot;
    document.getElementById("gold").textContent = gold.toString();

    SpawnMonster();
}

function LevelUp() {
    player.lvl++;
    player.exp = 0;
    player.lvlup_exp *= 2;
    player.maxhp += 25;
    player.hp = player.maxhp;
    UpdatePlayerBar();
    player.dmg++;
    player.exp = 0;

    gold += (2 ^ (player.lvl - 1)) * 100;
    document.getElementById("gold").textContent = gold.toString();

    if (player.lvl == monsters[monster_spawn].lvl) {
        monster_spawn++;
    }
}

function ShowStatsBox() {
    if (isEqOpen) {
        document.getElementById("eq").style.visibility = "hidden";
        isEqOpen = false;
    }

    if (isShopOpen) {
        document.getElementById("shop").style.visibility = "hidden";
        isShopOpen = false;
    }

    if (!isStatsOpen && isPlayerAlive) {
        document.getElementById("stats").style.visibility = "visible";
        clearTimeout(mAttack);
        document.getElementById("player-lvl").textContent = player.lvl.toString();
        document.getElementById("player-exp").textContent = Math.floor((player.exp / player.lvlup_exp) * 100).toString() + "%";
        document.getElementById("player-dmg").textContent = (player.dmg + currentWeapon.dmg).toString();
        document.getElementById("player-def").textContent = currentArmor.def.toString();

        isStatsOpen = true;
    }
}

function CloseStatsBox() {
    document.getElementById("stats").style.visibility = "hidden";
    isStatsOpen = false;
    MonsterAttack();
}

function ShowShopBox() {
    if (isStatsOpen) {
        document.getElementById("stats").style.visibility = "hidden";
        isStatsOpen = false;
    }

    if (isEqOpen) {
        document.getElementById("eq").style.visibility = "hidden";
        isEqOpen = false;
    }

    if (!isShopOpen && isPlayerAlive) {
        document.getElementById("shop").style.visibility = "visible";
        clearTimeout(mAttack);

        document.getElementById("w1-name").textContent = weapon1.name.toString();
        document.getElementById("w1-dmg").textContent = "DMG: " + weapon1.dmg.toString();
        document.getElementById("w1-cost").textContent = weapon1.cost.toString();

        document.getElementById("w2-name").textContent = weapon2.name.toString();
        document.getElementById("w2-dmg").textContent = "DMG: " + weapon2.dmg.toString();
        document.getElementById("w2-cost").textContent = weapon2.cost.toString();

        document.getElementById("w3-name").textContent = weapon3.name.toString();
        document.getElementById("w3-dmg").textContent = "DMG: " + weapon3.dmg.toString();
        document.getElementById("w3-cost").textContent = weapon3.cost.toString();

        document.getElementById("w4-name").textContent = weapon4.name.toString();
        document.getElementById("w4-dmg").textContent = "DMG: " + weapon4.dmg.toString();
        document.getElementById("w4-cost").textContent = weapon4.cost.toString();

        document.getElementById("w5-name").textContent = weapon5.name.toString();
        document.getElementById("w5-dmg").textContent = "DMG: " + weapon5.dmg.toString();
        document.getElementById("w5-cost").textContent = weapon5.cost.toString();


        document.getElementById("a1-name").textContent = armor1.name.toString();
        document.getElementById("a1-dmg").textContent = "DEF: " + armor1.def.toString();
        document.getElementById("a1-cost").textContent = armor1.cost.toString();

        document.getElementById("a2-name").textContent = armor2.name.toString();
        document.getElementById("a2-dmg").textContent = "DEF: " + armor2.def.toString();
        document.getElementById("a2-cost").textContent = armor2.cost.toString();

        document.getElementById("a3-name").textContent = armor3.name.toString();
        document.getElementById("a3-dmg").textContent = "DEF: " + armor3.def.toString();
        document.getElementById("a3-cost").textContent = armor3.cost.toString();

        document.getElementById("a4-name").textContent = armor4.name.toString();
        document.getElementById("a4-dmg").textContent = "DEF: " + armor4.def.toString();
        document.getElementById("a4-cost").textContent = armor4.cost.toString();

        document.getElementById("a5-name").textContent = armor5.name.toString();
        document.getElementById("a5-dmg").textContent = "DEF: " + armor5.def.toString();
        document.getElementById("a5-cost").textContent = armor5.cost.toString();

        isShopOpen = true;
    }
}

function CloseShopBox() {
    document.getElementById("shop").style.visibility = "hidden";
    isShopOpen = false;
    MonsterAttack();
}

function BuyItem(choice) {
    if (items[choice-1].cost <= gold && currentWeapon.id != choice && currentArmor.id != choice) {
        if (choice >= 1 && choice <= 5) {
            currentWeapon = items[choice-1];
        }
        else if (choice >= 6 && choice <= 10) {
            currentArmor = items[choice-1];
        }
        else if (choice == 11) {
            HealPlayer();
        }

        gold -= items[choice-1].cost;
        document.getElementById("gold").textContent = gold.toString();
    }
}

function HealPlayer() {
    player.hp += potion.heal;

    if (player.hp > player.maxhp) {
        player.hp = player.maxhp;
    }

    UpdatePlayerBar();
}

function ShowEqBox() {
    if (isStatsOpen) {
        document.getElementById("stats").style.visibility = "hidden";
        isStatsOpen = false;
    }

    if (isShopOpen) {
        document.getElementById("shop").style.visibility = "hidden";
        isShopOpen = false;
    }

    if (!isEqOpen && isPlayerAlive) {
        document.getElementById("eq").style.visibility = "visible";
        clearTimeout(mAttack);

        document.getElementById("eq-w-name").textContent = currentWeapon.name.toString();
        document.getElementById("eq-w-dmg").textContent = "DMG: " + currentWeapon.dmg.toString();

        document.getElementById("eq-a-name").textContent = currentArmor.name.toString();
        document.getElementById("eq-a-dmg").textContent = "DEF: " + currentArmor.def.toString();

        potion.heal = player.maxhp / 2;
        potion.cost = 100 * player.lvl;
        items[10] = potion;

        document.getElementById("potion-name").textContent = potion.name.toString();
        document.getElementById("potion-heal").textContent = "HEAL: " + potion.heal.toString();
        document.getElementById("potion-cost").textContent = potion.cost.toString();

        isEqOpen = true;
    }
}

function CloseEqBox() {
    document.getElementById("eq").style.visibility = "hidden";
    isEqOpen = false;
    MonsterAttack();
}

function OnPlayerDeath() {
    isPlayerAlive = false;
    document.getElementById("on-death").style.visibility = "visible";
    document.getElementById("on-death").style.animationPlayState = "running";
    clearTimeout(mAttack);
}

function UpdatePlayerBar() {
    document.getElementById("player-hp").style.width = (300 * (player.hp / player.maxhp)).toString() + "px";
}

function UpdateMonsterBar() {
    document.getElementById("monster-hp").style.width = (250 * (currentMonster.hp / currentMonster.maxhp)).toString() + "px"
}