var cssQueue = [
    "html, body { color: rgb(255, 255, 255); width: 100%; height: 100%; margin: 0px; padding: 0px; font-size: 12pt; text-align: center; font-family: arial, helvetica, sans-serif; overflow: hidden; background-color: rgb(0, 0, 0); }",
    "html, body { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }",
    "#canvas { position: absolute; left: 0px; right: 0px; top: 0px; margin: auto; z-index: 1; width: 1px;min-width: 100%;*width: 100%; height: 100%; transform: scale3d(1, 1, 1); }"
],
    sheet = (function () {
        var b = document.createElement("style");
        b.setAttribute("type", "text/css");
        b.appendChild(document.createTextNode(""));
        document.head.appendChild(b);
        return b.sheet;
    })();
if (((sheet && "undefined" === typeof ig) || (ig && !ig.global.wm)) && cssQueue && cssQueue.length) for (var cssIndex = 0; cssIndex < cssQueue.length; cssIndex++) sheet.insertRule(cssQueue[cssIndex], sheet.cssRules.length);
var spriteSheets = {
    customCloseButton: {
        frames: { "button-close.png": { frame: { x: 0, y: 0, w: 30, h: 30, ox: 0, oy: 0 }, size: { w: 30, h: 30 }, scale: 1 } },
        meta: {
            image:
                "cross.png",
            size: { w: 32, h: 32 },
        },
    },
},
    imagePath = {

        //add image path here
        bg: "Resources/bg.png",

        //dragon frames
        dragon1: "Resources/dragon_anim/dragon0.png",
        dragon2: "Resources/dragon_anim/dragon1.png",
        dragon3: "Resources/dragon_anim/dragon2.png",
        dragon4: "Resources/dragon_anim/dragon3.png",
        dragon5: "Resources/dragon_anim/dragon4.png",
        dragon6: "Resources/dragon_anim/dragon5.png",

        //enemy frames
        enemy1: "Resources/dragon_anim/enemy0.png",
        enemy2: "Resources/dragon_anim/enemy1.png",
        enemy3: "Resources/dragon_anim/enemy2.png",
        enemy4: "Resources/dragon_anim/enemy3.png",
        enemy5: "Resources/dragon_anim/enemy4.png",
        enemy6: "Resources/dragon_anim/enemy5.png",

        logo: "Resources/logo-pvt.png",
        installNow: "Resources/installerbutton.png",
        blackLayer: "Resources/black-layer.png",
        tutorialHand: "Resources/tutorialhand.png",
        tutorialArrow: "Resources/tutorialarrow.png",
        gameOverText: "Resources/game-over-txt.png",

    };

//game control variables
var gameStart = 0;  //signals game start

//Dragon Co-ordintates
    //Portrait
var playerX = 70;
var playerY = 450;

    //Landscape
var playerLX = 100;
var playerLY = 200;


//Enemy Co-ordinates
    //Portrait
var enemyX = 1000;
var enemyY = 350;

    //Landscape
var enemyLX = 2000;
var enemyLY = 300;

//Triggers
var playerTrigger = 0;
var deathTrigger = 0;

//Animation Controllers
var dragonAnim = 0;
var enemyAnim = 0;

//controls state of the game
var gameState = 0;

//Score
var displayScore = 0;
var totalScore = 0;

var scoreTrigger = 0;
var scoreUpdate;

var Vector2 = function (b, c) {
    this.x = b;
    this.y = c;
    this.vallType = "number";
};
Vector2.prototype = {
    neg: function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    },
    row: function (b) {
        typeof b === this.valType && (this.y = b);
        return this.y;
    },
    col: function (b) {
        typeof b === this.valType && (this.x = b);
        return this.x;
    },
    add: function (b) {
        b instanceof Vector2 ? ((this.x += b.x), (this.y += b.y)) : ((this.x += b), (this.y += b));
        return this;
    },
    sub: function (b) {
        b instanceof Vector2 ? ((this.x -= b.x), (this.y -= b.y)) : ((this.x -= b), (this.y -= b));
        return this;
    },
    mul: function (b) {
        b instanceof Vector2 ? ((this.x *= b.x), (this.y *= b.y)) : ((this.x *= b), (this.y *= b));
        return this;
    },
    div: function (b) {
        b instanceof Vector2 ? (0 != b.x && (this.x /= b.x), 0 != b.y && (this.y /= b.y)) : 0 != b && ((this.x /= b), (this.y /= b));
        return this;
    },
    equals: function (b) {
        return this.x == b.x && this.y == b.y;
    },
    dot: function (b) {
        return this.x * b.x + this.y * b.y;
    },
    cross: function (b) {
        return this.x * b.y - this.y * b.x;
    },
    length: function () {
        return Math.sqrt(this.dot(this));
    },
    norm: function () {
        return this.divide(this.length());
    },
    min: function () {
        return Math.min(this.x, this.y);
    },
    max: function () {
        return Math.max(this.x, this.y);
    },
    toAngles: function () {
        return -Math.atan2(-this.y, this.x);
    },
    angleTo: function (b) {
        return Math.acos(this.dot(b) / (this.length() * b.length()));
    },
    toArray: function (b) {
        return [this.x, this.y].slice(0, b || 2);
    },
    set: function (b, c) {
        this.x = b;
        this.y = c;
        return this;
    },
    unit: function () {
        var b = this.length();
        if (0 < b) return new Vector2(this.x / b, this.y / b);
        throw "Divide by 0 error in unitVector function of vector:" + this;
    },
    turnRight: function () {
        var b = this.x;
        this.x = -this.y;
        this.y = b;
        return this;
    },
    turnLeft: function () {
        var b = this.x;
        this.x = this.y;
        this.y = -b;
        return this;
    },
    rotate: function (b) {
        var c = this.clone();
        this.x = c.x * Math.cos(b) - c.y * Math.sin(b);
        this.y = c.x * Math.sin(b) + c.y * Math.cos(b);
        return this;
    },
    clone: function () {
        var b = new Vector2(this.x, this.y),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Vector2.prototype.constructor = Vector2;
var Vector3 = function (b, c, d) {
    this.vallType = "number";
    this.x = b;
    this.y = c;
    this.z = d;
};
Vector3.prototype = {
    neg: function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    },
    add: function (b) {
        if (b instanceof Vector3) (this.x += b.x), (this.y += b.y), (this.z += b.z);
        else if (typeof b === TYPEOFS.NUMBER) (this.x += b), (this.y += b), (this.z += b);
        else throw "Error:Not a valid type" + b;
        return this;
    },
    sub: function (b) {
        b instanceof Vector3 ? ((this.x -= b.x), (this.y -= b.y)) : ((this.x -= b), (this.y -= b));
        return this;
    },
    mul: function (b) {
        b instanceof Vector3 ? ((this.x *= b.x), (this.y *= b.y)) : ((this.x *= b), (this.y *= b));
        return this;
    },
    div: function (b) {
        b instanceof Vector3 ? (0 != b.x && (this.x /= b.x), 0 != b.y && (this.y /= b.y)) : 0 != b && ((this.x /= b), (this.y /= b));
        return this;
    },
    equals: function (b) {
        return this.x == b.x && this.y == b.y;
    },
    dot: function (b) {
        return this.x * b.x + this.y * b.y;
    },
    cross: function (b) {
        return this.x * b.y - this.y * b.x;
    },
    length: function () {
        return Math.sqrt(this.dot(this));
    },
    norm: function () {
        return this.divide(this.length());
    },
    min: function () {
        return Math.min(this.x, this.y);
    },
    max: function () {
        return Math.max(this.x, this.y);
    },
    toAngles: function () {
        return -Math.atan2(-this.y, this.x);
    },
    angleTo: function (b) {
        return Math.acos(this.dot(b) / (this.length() * b.length()));
    },
    toArray: function (b) {
        return [this.x, this.y, this.z].slice(0, b || 3);
    },
    set: function (b, c) {
        this.x = b;
        this.y = c;
        return this;
    },
    unit: function () {
        var b = this.length();
        if (0 < b) return new Vector3(this.x / b, this.y / b, this.z / b);
        throw "Divide by 0 error in unitVector function of vector:" + this;
    },
    rotate: function (b) {
        var c = this.clone();
        this.x = c.x * Math.cos(b) - c.y * Math.sin(b);
        this.y = c.x * Math.sin(b) + c.y * Math.cos(b);
        return this;
    },
    clone: function () {
        var b = new Vector3(this.x, this.y, this.z),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Vector3.prototype.constructor = Vector3;
var Color = function (b, c, d, f) {
    this.r = b;
    this.g = c;
    this.b = d;
    this.a = f;
};
Color.prototype = {
    toHex: function () { },
    toRGBA: function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    },
    clone: function () {
        var b = new Color(this.r, this.g, this.b, this.a),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Color.prototype.constructor = Color;
var Angle = function (b, c) {
    this.angleType = c;
    this.value = b;
};
Angle.prototype = {
    toDegree: function () {
        return this.angleType === mjs.math.ANGLE.RAD ? (180 * this.value) / Math.PI : this.angleType === mjs.math.ANGLE.DEG ? this.value : (180 * this.value) / Math.PI;
    },
    toRadian: function () {
        return this.angleType === mjs.math.ANGLE.RAD ? this.value : this.angleType === mjs.math.ANGLE.DEG ? (this.value * Math.PI) / 180 : this.value;
    },
    clone: function () {
        var b = new Angle(this.value),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Angle.prototype.constructor = Angle;
var Circle = function (b, c) {
    this.x = b.x;
    this.y = b.y;
    this.r = c;
    this.d = 2 * c;
};
Circle.prototype = {
    clone: function () {
        var b = new Circle(this.x, this.y, this.r),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Circle.prototype.constructor = Circle;
var Rect = function (b, c) {
    this.lp = b.clone();
    this.size = c.clone();
    this.x = this.lp.x;
    this.y = this.lp.y;
    this.w = this.size.w;
    this.h = this.size.h;
};
Rect.prototype = {
    clone: function () {
        var b = new Rect(this.lp, this.size),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Rect.prototype.constructor = Rect;
var Cylinder = function (b, c, d) {
    this.x = b.x;
    this.y = b.y;
    this.r = c;
    this.d = 2 * c;
    this.h = d;
};
Cylinder.prototype = {
    clone: function () {
        var b = new Cylinder(this.x, this.y, this.r),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Cylinder.prototype.constructor = Cylinder;
var Line = function (b, c) {
    this.p1 = b.clone();
    this.p2 = c.clone();
};
Line.prototype = {
    clone: function () {
        var b = new Line(this.p1, this.p2),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Line.prototype.constructor = Line;
var File = function (b, c) {
    this.fileName = b;
    this.filePath = c;
};
File.prototype = {
    clone: function () {
        var b = new File(this.p1, this.p2),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
File.prototype.constructor = File;
var CONSTANTS = { GAMEBOX: "gamebox", CANVAS: "canvas" },
    DELIMITERS = { DASH: "-" };
var EventTracker = function () { };
EventTracker.prototype = {
    clone: function () {
        var b = new EventTracker(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
EventTracker.prototype.constructor = EventTracker;
var AdHelper = function () { };
AdHelper.prototype = {
    openURL: function (b) {
        MJS.settings.getSSP() === MJS.CONST.MOPUB ? this.openUrlMopub(b) : this.openURLNative(b);
    },
    openURLNative: function (b) {
        window.mraid ? window.mraid.open(b) : window.open(b, MJS.CONST._SELF);
    },
    openURLMopubWebView: function (b) {
        b = "mopubnativebrowser://navigate?url=" + encodeURIComponent(MJS.settings.getDestURL());
        this.openURLNative(b);
    },
    openClickUrl: function () {
        console.log("open click url");
        this.openURL(MJS.settings.getDestURL());
    },
    close: function () {
        window.mraid ? window.mraid.close() : window.close();
    },
    setupCloseButton: function () {
        "on" === MJS.settings.preloaderStartCountdown && this.initCloseButton();
    },
    initCloseButton: function () {
        if (!window.closeButtonInitialized) {
            window.closeButtonInitialized = !0;
            window._AD_CLOSE_DIV || (this.createCustomCloseButtonDiv(), this.hideCustomCloseButton());
            window._AD_CLOSE_COUNT_DOWN_DIV || this.createCountDownButtonDiv();
            var b = MJS.settings.hideCloseButtonTime;
            if (0 < b) {
                var c = (1e3 * MJS.settings.closeButtonTimer) / b,
                    b = b.ceil();
                this.showCustomCloseButtonCountDown(b);
                window._CLOSE_COUNTDOWN = window.setInterval(function () {
                    b--;
                    0 < b ? (this.hideCustomCloseButton(), this.showCustomCloseButtonCountDown(b)) : (this.hideCustomCloseButtonCountDown(b), this.showCustomCloseButton());
                }, c);
            } else this.showCustomCloseButton();
        }
    },
    createCountDownButtonDiv: function () {
        var b = document.getElementById("gamebox");
        window._AD_CLOSE_COUNT_DOWN_DIV = ig.$new("div");
        window._AD_CLOSE_COUNT_DOWN_DIV.setAttribute("id", "_COUNT_DOWN");
        var c =
            "cursor: pointer;background-size: 30px;background-repeat: no-repeat;background-position: center center;line-height: 36px;height: 28px;width: 28px;position: absolute;text-indent: -9999px;display: block;visibility: hidden;border: 1px solid white;border-radius: 15px;line-height: 29px;font-size: 19px;text-indent: 0;color: white;z-index: 16777216;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;";
        switch (MJS.settings.Property3) {
            default:
            case 1:
                c += "top: 8px;right: 8px;";
                break;
            case 2:
                c += "top: 8px;";
                c += "left: 8px;";
                break;
            case 3:
                c += "bottom: 8px;";
                c += "right: 8px;";
                break;
            case 4:
                (c += "bottom: 8px;"), (c += "left: 8px;");
        }
        window._AD_CLOSE_COUNT_DOWN_DIV.setAttribute("style", c);
        this.updateCountDownButtonDiv();
        b.appendChild(window._AD_CLOSE_COUNT_DOWN_DIV);
    },
    createCustomCloseButtonDiv: function () {
        var b = document.getElementById("gamebox");
        window._AD_CLOSE_DIV_HITBOX = ig.$new("div");
        window._AD_CLOSE_DIV = ig.$new("div");
        window._AD_CLOSE_DIV_HITBOX.setAttribute("id", "_CLOSE_AD_HITBOX");
        window._AD_CLOSE_DIV.setAttribute("id", "_CLOSE_AD");
        var c =
            "background-size: 30px;background-repeat: no-repeat;background-position: center center;background-image: url('" +
            spriteSheets.customCloseButton.meta.image +
            "');line-height: 36px;height: 30px;width: 30px;border-radius: 15px;position: relative;text-indent: -9999px;z-index: 16777887;webkit-transform: translate3d(0,0,0);-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;",
            d =
                "padding:8px;cursor: pointer;display: block;visibility: hidden;position:absolute;z-index: 16777888;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;";
        switch (MJS.settings.data.Property3) {
            default:
            case 1:
                d += "top: 0px;right: 0px;";
                break;
            case 2:
                d += "top: 0px;";
                d += "left: 0px;";
                break;
            case 3:
                d += "bottom: 0px;";
                d += "right: 0px;";
                break;
            case 4:
                (d += "bottom: 0px;"), (d += "left: 0px;");
        }
        window._AD_CLOSE_DIV_HITBOX.setAttribute("style", d);
        window._AD_CLOSE_DIV.setAttribute("style", c);
        this.updateCustomCloseButtonDiv();
        window._AD_CLOSE_DIV_HITBOX.appendChild(window._AD_CLOSE_DIV);
        b.appendChild(window._AD_CLOSE_DIV_HITBOX);
    },
    showCustomCloseButtonCountDown: function (b) {
        (b = Math.max(0, Math.ceil(b))) && "on" === igh.settings.countDownCloseButton
            ? ((window._AD_CLOSE_COUNT_DOWN_DIV.style.visibility = "visible"), (window._AD_CLOSE_COUNT_DOWN_DIV.innerText = b))
            : window._AD_CLOSE_COUNT_DOWN_DIV && ((window._AD_CLOSE_COUNT_DOWN_DIV.style.visibility = "hidden"), (window._AD_CLOSE_COUNT_DOWN_DIV.innerText = ""));
    },
    showCustomCloseButton: function () {
        window._AD_CLOSE_DIV.style.visibility = "visible";
        window._AD_CLOSE_DIV_HITBOX.style.visibility = "visible";
        window._AD_CLOSE_DIV_HITBOX.onclick = function () {
            window.mraid ? window.mraid.close() : window.close();
        };
    },
    hideCustomCloseButtonCountDown: function () {
        window._CLOSE_COUNTDOWN && window.clearInterval(window._CLOSE_COUNTDOWN);
        this.showCustomCloseButtonCountDown("");
        window._AD_CLOSE_COUNT_DOWN_DIV && (window._AD_CLOSE_COUNT_DOWN_DIV.style.visibility = "hidden");
    },
    hideCustomCloseButton: function () {
        window._AD_CLOSE_DIV && ((window._AD_CLOSE_DIV.style.visibility = "hidden"), (window._AD_CLOSE_DIV_HITBOX.style.visibility = "hidden"));
    },
    disableCloseButton: function () {
        this.hideCustomCloseButtonCountDown();
        this.hideCustomCloseButton();
    },
    updateCountDownButtonDiv: function () {
        if (window._AD_CLOSE_COUNT_DOWN_DIV) {
            var b = "";
            !0 === MJS.view.viewport.orientation.portrait
                ? MJS.settings.data.closeButtonBackgroundPortrait && (b = MJS.settings.data.closeButtonBackgroundPortrait)
                : MJS.settings.data.closeButtonBackgroundLandscape && (b = MJS.settings.data.closeButtonBackgroundLandscape);
            window._AD_CLOSE_COUNT_DOWN_DIV.style.background = b;
        }
    },
    updateCustomCloseButtonDiv: function () {
        if (window._AD_CLOSE_DIV) {
            var b = "";
            !0 === MJS.view.viewport.orientation.portrait
                ? MJS.settings.data.closeButtonBackgroundPortrait && (b = MJS.settings.data.closeButtonBackgroundPortrait)
                : MJS.settings.data.closeButtonBackgroundLandscape && (b = MJS.settings.data.closeButtonBackgroundLandscape);
            window._AD_CLOSE_DIV.style.backgroundColor = b;
        }
    },
    clone: function () {
        var b = new AdHelper(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
AdHelper.prototype.constructor = AdHelper;
var GameHelper = function () { };
GameHelper.prototype = {
    startGame: function (b, c) {
        window.setTimeout(b, c);
    },
    initSound: function () { },
    triggerUserAction: function () {
        ig.game.userAction++;
        1 === ig.game.userAction ? ig.game.triggerFirstUserAction() : 2 === ig.game.userAction && ig.game.triggerSecondUserAction();
    },
    triggerFirstUserAction: function () {
        "on" === igh.settings.Property1 && igh.disableCloseButton();
        "on" === igh.settings.Property4 && window.setTimeout(igh.disableCloseButton, 1e4);
    },
    triggerSecondUserAction: function () {
        "on" === igh.settings.Property2 && igh.disableCloseButton();
    },
    clone: function () {
        var b = new GameHelper(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
GameHelper.prototype.constructor = GameHelper;
var MathHelper = function () {
    this.ANGLE = { RAD: "radian", DEG: "degree", PIRAD: Math.PI, PIDEG: 180, PIRADTODEG: 180 / Math.PI, PIDEGTORAD: Math.PI / 180 };
};
MathHelper.prototype = {
    radToDegree: function (b) {
        return b * this.ANGLE.PIRADTODEG;
    },
    degreeToRad: function (b) {
        return b * this.ANGLE.PIDEGTORAD;
    },
    clone: function () {
        var b = new MathHelper(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
MathHelper.prototype.constructor = MathHelper;
var SystemHelper = function () {
    this.gameSetting = {};
    this.EVENTS = { CLOSE_BUTTON_INIT: "closeButtonInit", ORIENTATION_CHANGE: "orientationchange", RESIZE: "resize", MRAID_STATE_CHANGE: "MRAIDStateChange", ERROR: "error" };
    this.callbacks = { onCloseButtonInit: [], onOrientationChange: [], onSizeChange: [], MRAIDStateChange: [] };
};
SystemHelper.prototype = {
    registerCallback: function (b, c) {
        switch (b) {
            case this.EVENTS.CLOSE_BUTTON_INIT:
                this.callbacks.onCloseButtonInit.push(c);
                break;
            case this.EVENTS.ORIENTATION_CHANGE:
                this.callbacks.onOrientationChange.push(c);
                window.addEventListener(this.EVENTS.ORIENTATION_CHANGE, c);
                break;
            case this.EVENTS.RESIZE:
                this.callbacks.onSizeChange.push(c);
                window.addEventListener(this.EVENTS.RESIZE, c);
                break;
            case this.EVENTS.MRAID_STATE_CHANGE:
                this.callbacks.MRAIDStateChange.push(c);
                break;
            case "error":
                break;
            default:
                console.error("registerCallback failed: `" + e + "` is not a valid eventName.");
        }
    },
    clone: function () {
        var b = new SystemHelper(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
SystemHelper.prototype.constructor = SystemHelper;
var LocationHelper = function () {
    this.text = { prompt: { en: "Designed By MarketJS. \nPlease visit us if you need a HTML Web Game Developer at https://www.marketjs.com/" } };
    this.COUNTRYCODE = { US: "us", KO: "ko", KR: "kr" };
    this.country = this.COUNTRYCODE.US;
    this.REGIONCODES = { US: {} };
    this.LANGCODE = {
        AR: "ar",
        EN: "en",
        DE: "de",
        ES: "es",
        FR: "fr",
        FRCA: "fr-ca",
        PT: "pt",
        RU: "ru",
        IT: "it",
        PL: "pl",
        TR: "tr",
        JP: "jp",
        KO: "ko",
        DA: "da",
        FI: "fi",
        NB: "nb",
        NL: "nl",
        SV: "sv",
        ZHTW: "zh-tw",
        ZHCN: "zh-cn",
        EL: "el",
        ID: "id",
        MS: "ms",
        TH: "th",
        VI: "vi",
        CS: "cs",
        SK: "sk",
        UK: "uk",
        BG: "bg",
        HU: "hu",
        AR: "ar",
        HR: "hr",
        CA: "ca",
    };
    this.language = navigator.language;
    this.lang = navigator.language.split("-")[0];
};
LocationHelper.prototype = {
    getRegion: function () {
        if (adDetails.region) return (this.region = adDetails.region);
        throw MJS.sys.EVENTS.ERROR;
    },
    getCountry: function () {
        if (adDetails.country) return (this.country = adDetails.country.toLowerCase());
        throw MJS.sys.EVENTS.ERROR;
    },
    getLanguage: function () {
        return adDetails.language ? (this.language = adDetails.language) : navigator.language ? (this.language = navigator.language) : "en-US";
    },
    getMainLanguage: function () {
        return this.language.split(DELIMITERS.DASH)[0];
    },
    getCountryCode: function () {
        return this.language.split(DELIMITERS.DASH)[1];
    },
    clone: function () {
        var b = new LocationHelper(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
    getText: function (b) {
        return this.text[b][this.lang];
    },
};
LocationHelper.prototype.constructor = LocationHelper;
var SettingsHelper = function () {
    this.data = {};
    this.data.settings = {};
    this.setupSettings();
};
SettingsHelper.prototype = {
    setupSettings: function () {
        var b = {
            preloader: this.detailGet("preloader") || "on",
            language: this.detailGet("language") || "en",
            install: { textID: parseInt(this.detailGet("endCardInstallButtonTextID") || 1), text: ["", "Install Now*", "Get App*"] },
            installBanner: { fontFamily: "arial", fontSize: 20, textFillColor: "rgba(255,255,255,1)", boxFillColor: "rgba(0,0,0,1)", textID: 0, text: ["", "Tutorial", ""] },
        },
            c;
        for (c in b) this.data.settings[c] = b[c];
        this.updateSettings();
        this.data.portrait = { orientation: "portrait", gamePlayLogoConfig: { pos: { x: 250, y: 600 }, scale: 0.7 } };
        this.data.landscape = { orientation: "landscape", gamePlayLogoConfig: { pos: { x: 550, y: 120 }, scale: 0.7 } };
    },
    detailGet: function (b) {
        return adDetails.settings && adDetails.settings[b] ? adDetails.settings[b] : !1;
    },
    getSSP: function () {
        return this.data && this.data.ssp ? this.data.ssp : "";
    },
    get: function (b, c) {
        console.log(b + " " + c);
        if (c) {
            var d = typeof this.data.settings[b][c];
            if (this.data.settings[b][c] || "number" === d) return this.data.settings[b][c];
        } else if (this.data.settings[b]) return this.data.settings[b];
        return !1;
    },
    getBool: function (b) {
        var c = this.data.settings[b],
            d = typeof c;
        if (d === MJS.TYPEOFS.STR) return c === MJS.CONST.TRUE || c === MJS.CONST.ON ? !0 : !1;
        if (d === MJS.sys.TYPEOFS.BOOL) return c;
        throw b + MJS.CONST.ISMISSINGB;
    },
    getInt: function () { },
    getDestURL: function () {
        if (this.data.destUrl) return this.data.destUrl;
        var b = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(b)) return adDetails.settings.playStoreUrl;
        /iPad|iPhone|iPod/.test(b);
        return adDetails.settings.itunesUrl;
    },
    createBlankAdDetails: function () {
        adDetails = { settings: {} };
    },
    addSetting: function (b, c) {
        this.data[b] = c;
    },
    updateSettings: function () {
        ("undefined" === typeof adDetails || null === adDetails) && this.createBlankAdDetails();
        for (var b in adDetails) {
            console.log(typeof adDetails[b]);
            if ("object" === typeof adDetails[b]) for (var c in adDetails[b]) this.data[b][c] = adDetails[b][c];
            else this.data[b] = adDetails[b];
            console.log(b);
        }
    },
    clone: function () {
        var b = new SettingsHelper(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
SettingsHelper.prototype.constructor = SettingsHelper;
var DrawHelper = function () { };
DrawHelper.prototype = {
    setFillText: function () { },
    drawSprite: function (b, c, d, f, g, j, h) {
        var k = spriteSheets[d].frames[f].frame;
        d = spriteSheets[d].frames[f].size;
        h = MJS.view.mergeSettings({ pivot: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 }, flip: { x: !1, y: !1 }, fill: { x: 1, y: 1 }, alpha: 1, angle: 0 }, h);
        f = h.scale.x * (h.flip.x ? -1 : 1);
        var l = h.scale.y * (h.flip.y ? -1 : 1),
            m = d.w - k.ox - k.w,
            n = d.h - k.oy - k.h;
        b.globalAlpha = h.alpha.limit(0, 1);
        b.translate(g, j);
        h.angle && b.rotate(h.angle);
        (h.scale.x || h.scale.y || h.flip.x || h.flip.y) && b.scale(f, l);
        b.drawImage(c.data, k.x, k.y, k.w * h.fill.x, k.h * h.fill.y, -h.pivot.x * d.w + (h.flip.x ? -k.w - m : k.ox), -h.pivot.y * d.h + (h.flip.y ? -k.w - n : k.oy), k.w * h.fill.x, k.h * h.fill.y);
        (h.scale.x || h.scale.y || h.flip.x || h.flip.y) && b.scale(1 / f, 1 / l);
        h.angle && b.rotate(-h.angle);
        b.translate(-g, -j);
        b.globalAlpha = 1;
    },
    clone: function () {
        var b = new DrawHelper(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
DrawHelper.prototype.constructor = DrawHelper;
var ViewHelper = function () {
    this.portraitWidth = 540;
    this.landscapeWidth = this.portraitHeight = 960;
    this.landscapeHeight = 540;
    this.forceOrientation = "";
    this.disableStretch = !adDetails.settings.enableStretch;
    this.changeSize = 0;
    this.changeSize = 480;
    this.viewportSettings = {};
    this.gameBox = document.getElementById(CONSTANTS.GAMEBOX);
    this.canvas = document.getElementById(CONSTANTS.CANVAS);
};
ViewHelper.prototype = {
    initViewport: function () {
        this.viewportSettings = this.viewport = {
            forceOrientation: this.forceOrientation,
            portraitWidth: this.portraitWidth,
            portraitHeight: this.portraitHeight,
            landscapeWidth: this.landscapeWidth,
            landscapeHeight: this.landscapeHeight,
            widthRatio: 1,
            heightRatio: 1,
            orientation: { portrait: !1, landscape: !1, degree: 0 },
            screenWidth: this.getBrowserWidth(),
            screenHeight: this.getBrowserHeight(),
        };
    },
    globalizeHandlers: function () {
        window.orientationDelayHandler = this.orientationDelayHandler.bind(this);
        window.orientationHandler = this.orientationHandler.bind(this);
        window.setupCloseButton = MJS.ad.setupCloseButton.bind(this);
        window.initViewport = MJS.viewinitViewport;
        window.updateViewport = MJS.viewupdateViewport;
    },
    applovinSupport: function () {
        "function" == typeof al_updateViewportOverride && (window.updateViewport = al_updateViewportOverride);
        MJS.viewupdateViewport = window.updateViewport;
    },
    updateCanvasDirection: function () {
        var b = document.getElementById("canvas");
        switch (MJS.settings.data.language) {
            case "ar":
                b.setAttribute("dir", "rtl");
                break;
            default:
                b.setAttribute("dir", "ltr");
        }
    },
    updateViewport: function () {
        if (!MJS.view.viewport) return !1;
        if (window.mraid) {
            var b = MJS.view.viewport.screenWidth,
                c = MJS.view.viewport.screenHeight;
            (1 < b && 1 < c) || ((b = MJS.view.getBrowserWidth()), (c = MJS.view.getBrowserHeight()));
            MJS.view.getBrowserWidth() <= MJS.view.getBrowserHeight()
                ? (MJS.view.isiOS() && ((b = window.screen.width), (c = window.screen.height)),
                    ig.ua.android && ((b = window.screen.width), (c = window.screen.height)),
                    (MJS.view.viewport.screenWidth = Math.min(b, c)),
                    (MJS.view.viewport.screenHeight = Math.max(b, c)))
                : (MJS.view.isiOS() && ((b = window.screen.height), (c = window.screen.width)),
                    ig.ua.android && ((b = window.screen.width), (c = window.screen.height)),
                    (MJS.view.viewport.screenWidth = Math.max(b, c)),
                    (MJS.view.viewport.screenHeight = Math.min(b, c)));
        } else (MJS.view.viewport.screenWidth = MJS.view.getBrowserWidth()), (MJS.view.viewport.screenHeight = MJS.view.getBrowserHeight());
        switch (MJS.view.viewport.forceOrientation) {
            case "portrait":
                MJS.view.viewport.desktopWidth = MJS.view.viewport.portraitWidth;
                MJS.view.viewport.desktopHeight = MJS.view.viewport.portraitHeight;
                MJS.view.viewport.mobileWidth = MJS.view.viewport.portraitWidth;
                MJS.view.viewport.mobileHeight = MJS.view.viewport.portraitHeight;
                break;
            case "landscape":
                MJS.view.viewport.desktopWidth = MJS.view.viewport.landscapeWidth;
                MJS.view.viewport.desktopHeight = MJS.view.viewport.landscapeHeight;
                MJS.view.viewport.mobileWidth = MJS.view.viewport.landscapeWidth;
                MJS.view.viewport.mobileHeight = MJS.view.viewport.landscapeHeight;
                break;
            default:
                MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight
                    ? ((MJS.view.viewport.desktopWidth = MJS.view.viewport.portraitWidth),
                        (MJS.view.viewport.desktopHeight = MJS.view.viewport.portraitHeight),
                        (MJS.view.viewport.mobileWidth = MJS.view.viewport.portraitWidth),
                        (MJS.view.viewport.mobileHeight = MJS.view.viewport.portraitHeight))
                    : ((MJS.view.viewport.desktopWidth = MJS.view.viewport.landscapeWidth),
                        (MJS.view.viewport.desktopHeight = MJS.view.viewport.landscapeHeight),
                        (MJS.view.viewport.mobileWidth = MJS.view.viewport.landscapeWidth),
                        (MJS.view.viewport.mobileHeight = MJS.view.viewport.landscapeHeight));
        }
    },
    setupPage: function () {
        var b = document.getElementById("gamebox");
        b.style.position = "absolute";
        b.style.top = "0px";
        b.style.left = "0px";
        this.updateCanvasDirection();
        ig.ua.iOS
            ? (MJS.sys.registerCallback(MJS.sys.EVENTS.ORIENTATION_CHANGE, this.orientationDelayHandler), MJS.sys.registerCallback(MJS.sys.EVENTS.RESIZE, this.orientationDelayHandler))
            : (MJS.sys.registerCallback(MJS.sys.EVENTS.ORIENTATION_CHANGE, this.orientationHandler), MJS.sys.registerCallback(MJS.sys.EVENTS.RESIZE, this.orientationHandler));
        MJS.sys.registerCallback(MJS.sys.EVENTS.CLOSE_BUTTON_INIT, MJS.ad.setupCloseButton);
        document.ontouchmove = function (b) {
            window.scrollTo(0, 0);
            b.preventDefault();
        };
    },
    orientationHandler: function () {
        MJS.view.changeSize !== MJS.view.getBrowserWidth() && ((MJS.view.changeSize = MJS.view.getBrowserWidth()), MJS.view.clearAllIntervals());
        if (!MJS.view.viewport) return !1;
        MJS.view.updateViewport();
        document.getElementById("gamebox");
        document.getElementById("canvas");
        var b = 0,
            c = !1;
        "portrait" == MJS.view.viewport.forceOrientation
            ? window.screen
                ? window.screen.orientation
                    ? isNaN(window.screen.orientation.degree)
                        ? isNaN(window.screen.orientation.angle) || (b = -window.screen.orientation.angle)
                        : (b = -window.screen.orientation.degree)
                    : isNaN(window.orientation) || (b = -window.orientation)
                : isNaN(window.orientation) || (b = -window.orientation)
            : window.screen
                ? window.screen.orientation
                    ? isNaN(window.screen.orientation.degree)
                        ? isNaN(window.screen.orientation.angle) || (b = window.screen.orientation.angle)
                        : (b = window.screen.orientation.degree)
                    : isNaN(window.orientation) || (b = window.orientation)
                : isNaN(window.orientation) || (b = window.orientation);
        switch (MJS.view.viewport.forceOrientation) {
            case "portrait":
                if (MJS.view.viewport.orientation)
                    if (MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.portrait) {
                        if (0 !== Math.abs(b) % 180 || !b) b = 0;
                        isNaN(b) || (MJS.view.viewport.orientation.degree = b % 180);
                        c = !0;
                    } else if (MJS.view.viewport.screenWidth > MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.landscape) {
                        if (0 !== Math.abs(b) % 90 || !b) b = -90;
                        isNaN(b) || (MJS.view.viewport.orientation.degree = b % 180);
                        c = !0;
                    }
                break;
            case "landscape":
                if (MJS.view.viewport.orientation)
                    if (MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.portrait) {
                        if (0 !== Math.abs(b) % 90 || !b) b = 90;
                        isNaN(b) || (MJS.view.viewport.orientation.degree = b % 180);
                        c = !0;
                    } else if (MJS.view.viewport.screenWidth > MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.landscape) {
                        if (0 !== Math.abs(b) % 180 || !b) b = 0;
                        isNaN(b) || (MJS.view.viewport.orientation.degree = b % 180);
                        c = !0;
                    }
                break;
            default:
                MJS.view.viewport.orientation &&
                    (MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.portrait
                        ? (ig.system && ig.system.resize(MJS.view.viewport.portraitWidth, MJS.view.viewport.portraitHeight), (c = !0))
                        : MJS.view.viewport.screenWidth > MJS.view.viewport.screenHeight &&
                        !MJS.view.viewport.orientation.landscape &&
                        (ig.system && ig.system.resize(MJS.view.viewport.landscapeWidth, MJS.view.viewport.landscapeHeight), (c = !0)));
        }
        MJS.view.viewport.orientation.portrait = MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight;
        MJS.view.viewport.orientation.landscape = MJS.view.viewport.screenWidth > MJS.view.viewport.screenHeight;
        MJS.ad.updateCustomCloseButtonDiv();
        MJS.ad.updateCountDownButtonDiv();
        if (ig.game && (MJS.view.updateSettings(), c)) {
            ig.input.clearPressed();
            for (b = 0; b < ig.game.entities.length; b++) "function" === typeof ig.game.entities[b].updateOnOrientationChange && ig.game.entities[b].updateOnOrientationChange();
            ig.game.pointer.update();
        }
        MJS.view.sizeHandler();
    },
    reorient: function () {
        MJS.view.changeSize !== this.getBrowserWidth() && ((MJS.view.changeSize = MJS.view.getBrowserWidth()), MJS.view.clearAllIntervals());
        if (!MJS.view.viewport) return !1;
        MJS.view.updateViewport();
        document.getElementById("gamebox");
        document.getElementById("canvas");
        var b = 0,
            c = !1;
        "portrait" == MJS.view.viewport.forceOrientation
            ? window.screen
                ? window.screen.orientation
                    ? isNaN(window.screen.orientation.degree) || (b = -window.screen.orientation.degree)
                    : isNaN(window.orientation) || (b = -window.orientation)
                : isNaN(window.orientation) || (b = -window.orientation)
            : window.screen
                ? window.screen.orientation
                    ? isNaN(window.screen.orientation.degree) || (b = window.screen.orientation.degree)
                    : isNaN(window.orientation) || (b = window.orientation)
                : isNaN(window.orientation) || (b = window.orientation);
        switch (MJS.view.viewport.forceOrientation) {
            case "portrait":
                if (MJS.view.viewport.orientation)
                    if (MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.portrait) {
                        if (0 !== Math.abs(b) % 180 || !b) b = 0;
                        isNaN(b) || (MJS.view.viewport.orientation.degree = b % 180);
                        c = !0;
                    } else if (MJS.view.viewport.screenWidth > MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.landscape) {
                        if (0 !== Math.abs(b) % 90 || !b) b = -90;
                        isNaN(b) || (MJS.view.viewport.orientation.degree = b % 180);
                        c = !0;
                    }
                break;
            case "landscape":
                if (MJS.view.viewport.orientation)
                    if (MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.portrait) {
                        if (0 !== Math.abs(b) % 90 || !b) b = 90;
                        isNaN(b) || (MJS.view.viewport.orientation.degree = b % 180);
                        c = !0;
                    } else if (MJS.view.viewport.screenWidth > MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.landscape) {
                        if (0 !== Math.abs(b) % 180 || !b) b = 0;
                        isNaN(b) || (MJS.view.viewport.orientation.degree = b % 180);
                        c = !0;
                    }
                break;
            default:
                MJS.view.viewport.orientation &&
                    (MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight && !MJS.view.viewport.orientation.portrait
                        ? (ig.system && ig.system.resize(MJS.view.viewport.portraitWidth, MJS.view.viewport.portraitHeight), (c = !0))
                        : MJS.view.viewport.screenWidth > MJS.view.viewport.screenHeight &&
                        !MJS.view.viewport.orientation.landscape &&
                        (ig.system && ig.system.resize(MJS.view.viewport.landscapeWidth, MJS.view.viewport.landscapeHeight), (c = !0)));
        }
        MJS.view.viewport.orientation.portrait = MJS.view.viewport.screenWidth <= MJS.view.viewport.screenHeight;
        MJS.view.viewport.orientation.landscape = MJS.view.viewport.screenWidth > MJS.view.viewport.screenHeight;
        MJS.ad.updateCustomCloseButtonDiv();
        MJS.ad.updateCountDownButtonDiv();
        if (ig.game && (MJS.view.updateSettings(), c)) {
            ig.input.clearPressed();
            for (b = 0; b < ig.game.entities.length; b++) "function" === typeof ig.game.entities[b].updateOnOrientationChange && ig.game.entities[b].updateOnOrientationChange();
            ig.game.pointer.update();
        }
        this.sizeHandler();
    },
    mergeSettings: function (b, c) {
        for (var d in c) {
            var f = c[d];
            if ("object" != typeof f || f instanceof HTMLElement || null === f) b[d] = f;
            else {
                if (!b[d] || "object" != typeof b[d]) b[d] = f instanceof Array ? [] : {};
                MJS.view.mergeSettings(b[d], f);
            }
        }
        return b;
    },
    clearAllIntervals: function () {
        window.clearInterval(this.orientationInterval);
        this.orientationInterval = null;
        window.clearTimeout(this.orientationTimeout);
        this.orientationTimeout = null;
    },
    orientationInterval: null,
    orientationTimeout: null,
    orientationDelayHandler: function () {
        null == this.orientationInterval && (this.orientationInterval = window.setInterval(MJS.view.orientationHandler, 100));
        null == this.orientationTimeout &&
            (this.orientationTimeout = window.setTimeout(function () {
                MJS.view.clearAllIntervals();
            }, 1200));
    },
    sizeHandler: function () {
        if (!MJS.view.viewport) return !1;
        var b = document.getElementById("gamebox");
        document.getElementById("canvas");
        var c = "0px, 0px",
            d = 0.461 < screen.width / screen.height && 0.463 > screen.width / screen.height,
            c = MJS.view.getBrowserWidth(),
            f = MJS.view.getBrowserHeight(),
            g = /iPhone/i.test(navigator.userAgent),
            j = /iPad/i.test(navigator.userAgent);
        (g || j) && !this.disableStretch
            ? d
                ? ((d = MJS.view.viewport.orientation.portrait ? 175 : 80),
                    c <= f
                        ? ((MJS.view.viewport.screenWidth = MJS.view.getBrowserWidth()), (MJS.view.viewport.screenHeight = f))
                        : ((MJS.view.viewport.screenWidth = MJS.view.getBrowserWidth), (MJS.view.viewport.screenHeight = MJS.view.getBrowserHeight())))
                : ((MJS.view.viewport.screenWidth = MJS.view.getBrowserWidth()), (MJS.view.viewport.screenHeight = MJS.view.getBrowserHeight()))
            : ((MJS.view.viewport.screenWidth = MJS.view.getBrowserWidth()), (MJS.view.viewport.screenHeight = MJS.view.getBrowserHeight()));
        switch (MJS.view.viewport.forceOrientation) {
            case "portrait":
                if (ig.ua.mobile || window.mraid) {
                    MJS.view.viewport.orientation.portrait
                        ? ((MJS.view.viewport.widthRatio = MJS.view.viewport.screenWidth / MJS.view.viewport.mobileWidth), (MJS.view.viewport.heightRatio = MJS.view.viewport.screenHeight / MJS.view.viewport.mobileHeight))
                        : ((MJS.view.viewport.widthRatio = MJS.view.viewport.screenHeight / MJS.view.viewport.mobileWidth), (MJS.view.viewport.heightRatio = MJS.view.viewport.screenWidth / MJS.view.viewport.mobileHeight));
                    if (this.disableStretch) {
                        var h = Math.min(MJS.view.viewport.widthRatio, MJS.view.viewport.heightRatio);
                        MJS.view.viewport.widthRatio = h;
                        MJS.view.viewport.heightRatio = h;
                    }
                    b.style.width = MJS.view.viewport.mobileWidth * MJS.view.viewport.widthRatio + "px";
                    b.style.height = MJS.view.viewport.mobileHeight * MJS.view.viewport.heightRatio + "px";
                    c = 0.5 * (MJS.view.viewport.screenWidth - parseFloat(b.style.width)) + "px, " + 0.5 * (MJS.view.viewport.screenHeight - parseFloat(b.style.height)) + "px";
                } else
                    MJS.view.viewport.orientation.portrait
                        ? ((MJS.view.viewport.widthRatio = Math.min(MJS.view.viewport.screenHeight / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenWidth / MJS.view.viewport.desktopWidth)),
                            (MJS.view.viewport.heightRatio = Math.min(MJS.view.viewport.screenHeight / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenWidth / MJS.view.viewport.desktopWidth)))
                        : ((MJS.view.viewport.widthRatio = Math.min(MJS.view.viewport.screenWidth / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenHeight / MJS.view.viewport.desktopWidth)),
                            (MJS.view.viewport.heightRatio = Math.min(MJS.view.viewport.screenWidth / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenHeight / MJS.view.viewport.desktopWidth))),
                        this.disableStretch && ((h = Math.min(MJS.view.viewport.widthRatio, MJS.view.viewport.heightRatio)), (MJS.view.viewport.widthRatio = h), (MJS.view.viewport.heightRatio = h)),
                        (b.style.width = MJS.view.viewport.desktopWidth * MJS.view.viewport.widthRatio + "px"),
                        (b.style.height = MJS.view.viewport.desktopHeight * MJS.view.viewport.heightRatio + "px"),
                        (c = 0.5 * (MJS.view.viewport.screenWidth - parseFloat(b.style.width)) + "px, 0px"),
                        90 === Math.abs(MJS.view.viewport.orientation.degree) && (c = 0.5 * (MJS.view.viewport.screenWidth - parseFloat(b.style.width)) + "px, " + 0.5 * (MJS.view.viewport.screenHeight - parseFloat(b.style.height)) + "px");
                break;
            case "landscape":
                ig.ua.mobile || window.mraid
                    ? (MJS.view.viewport.orientation.portrait
                        ? ((MJS.view.viewport.widthRatio = MJS.view.viewport.screenHeight / MJS.view.viewport.mobileWidth), (MJS.view.viewport.heightRatio = MJS.view.viewport.screenWidth / MJS.view.viewport.mobileHeight))
                        : ((MJS.view.viewport.widthRatio = MJS.view.viewport.screenWidth / MJS.view.viewport.mobileWidth), (MJS.view.viewport.heightRatio = MJS.view.viewport.screenHeight / MJS.view.viewport.mobileHeight)),
                        this.disableStretch && ((h = Math.min(MJS.view.viewport.widthRatio, MJS.view.viewport.heightRatio)), (MJS.view.viewport.widthRatio = h), (MJS.view.viewport.heightRatio = h)),
                        (b.style.width = MJS.view.viewport.desktopWidth * MJS.view.viewport.widthRatio + "px"),
                        (b.style.height = MJS.view.viewport.desktopHeight * MJS.view.viewport.heightRatio + "px"),
                        (c = 0.5 * (MJS.view.viewport.screenWidth - parseFloat(b.style.width)) + "px, " + 0.5 * (MJS.view.viewport.screenHeight - parseFloat(b.style.height)) + "px"))
                    : (MJS.view.viewport.orientation.portrait
                        ? ((MJS.view.viewport.widthRatio = Math.min(MJS.view.viewport.screenWidth / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenHeight / MJS.view.viewport.desktopWidth)),
                            (MJS.view.viewport.heightRatio = Math.min(MJS.view.viewport.screenWidth / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenHeight / MJS.view.viewport.desktopWidth)))
                        : ((MJS.view.viewport.widthRatio = Math.min(MJS.view.viewport.screenHeight / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenWidth / MJS.view.viewport.desktopWidth)),
                            (MJS.view.viewport.heightRatio = Math.min(MJS.view.viewport.screenHeight / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenWidth / MJS.view.viewport.desktopWidth))),
                        this.disableStretch && ((h = Math.min(MJS.view.viewport.widthRatio, MJS.view.viewport.heightRatio)), (MJS.view.viewport.widthRatio = h), (MJS.view.viewport.heightRatio = h)),
                        (b.style.width = MJS.view.viewport.desktopWidth * h + "px"),
                        (b.style.height = MJS.view.viewport.desktopHeight * h + "px"),
                        (c = 0.5 * (MJS.view.viewport.screenWidth - parseFloat(b.style.width)) + "px, 0px"),
                        90 === Math.abs(MJS.view.viewport.orientation.degree) && (c = 0.5 * (MJS.view.viewport.screenWidth - parseFloat(b.style.width)) + "px, " + 0.5 * (MJS.view.viewport.screenHeight - parseFloat(b.style.height)) + "px"));
                break;
            default:
                ig.ua.mobile || window.mraid
                    ? ((MJS.view.viewport.widthRatio = MJS.view.viewport.screenWidth / MJS.view.viewport.mobileWidth),
                        (MJS.view.viewport.heightRatio = MJS.view.viewport.screenHeight / MJS.view.viewport.mobileHeight),
                        (b.style.width = MJS.view.viewport.mobileWidth * MJS.view.viewport.widthRatio + "px"),
                        (b.style.height = MJS.view.viewport.mobileHeight * MJS.view.viewport.heightRatio + "px"),
                        this.disableStretch && ((h = Math.min(MJS.view.viewport.widthRatio, MJS.view.viewport.heightRatio)), (MJS.view.viewport.widthRatio = h), (MJS.view.viewport.heightRatio = h)),
                        (b.style.width = MJS.view.viewport.desktopWidth * MJS.view.viewport.widthRatio + "px"),
                        (b.style.height = MJS.view.viewport.desktopHeight * MJS.view.viewport.heightRatio + "px"),
                        (c = this.disableStretch ? 0.5 * (MJS.view.viewport.screenWidth - parseFloat(b.style.width)) + "px, " + 0.5 * (MJS.view.viewport.screenHeight - parseFloat(b.style.height)) + "px" : "0px, 0px"))
                    : ((MJS.view.viewport.widthRatio = Math.min(MJS.view.viewport.screenHeight / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenWidth / MJS.view.viewport.desktopWidth)),
                        (MJS.view.viewport.heightRatio = Math.min(MJS.view.viewport.screenHeight / MJS.view.viewport.desktopHeight, MJS.view.viewport.screenWidth / MJS.view.viewport.desktopWidth)),
                        (b.style.width = MJS.view.viewport.desktopWidth * MJS.view.viewport.widthRatio + "px"),
                        (b.style.height = MJS.view.viewport.desktopHeight * MJS.view.viewport.heightRatio + "px"),
                        (c = 0.5 * (MJS.view.viewport.screenWidth - parseFloat(b.style.width)) + "px, 0px"));
        }
        b.style["-o-transform"] = "translate(" + c + ") rotate(" + MJS.view.viewport.orientation.degree + "deg)";
        b.style["-moz-transform"] = "translate(" + c + ") rotate(" + MJS.view.viewport.orientation.degree + "deg)";
        b.style["-ms-transform"] = "translate(" + c + ") rotate(" + MJS.view.viewport.orientation.degree + "deg)";
        b.style["-webkit-transform"] = "translate(" + c + ") rotate(" + MJS.view.viewport.orientation.degree + "deg)";
        b.style.transform = "translate(" + c + ") rotate(" + MJS.view.viewport.orientation.degree + "deg)";
        if (ig && ig.game) for (b = 0; b < ig.game.entities.length; b++) "function" === typeof ig.game.entities[b].updateOnSizeChange && ig.game.entities[b].updateOnSizeChange();
        window.scrollTo(0, 0);
    },
    updateCanvasDirection: function () {
        var b = document.getElementById("canvas");
        switch (MJS.loc.getLanguage()) {
            case MJS.loc.language.AR:
                b.setAttribute("dir", "rtl");
                break;
            default:
                b.setAttribute("dir", "ltr");
        }
    },
    getBrowserWidth: function () {

        if (window.innerWidth >= 810) {
            if (window.innerWidth > window.innerHeight) {
                //landscape
                return 810;
            } else {
                return 400;
            }
        } else {
            return this.isiOS() && screen && screen.width
                ? void 0 === window.orientation || null === window.orientation
                    ? screen.width
                    : 0 === window.orientation % 180
                        ? screen.width
                        : screen.height
                : window.innerWidth
                    ? window.innerWidth
                    : document.documentElement && 0 != document.documentElement.clientWidth
                        ? document.documentElement.clientWidth
                        : document.body
                            ? document.body.clientWidth
                            : 0;
        }
    },
    getBrowserHeight: function () {

        if (window.innerHeight >= 810) {
            if (window.innerWidth > window.innerHeight) {
                //landscape
                return 400;
            } else {
                return 810;
            }
        } else {
            return this.isiOS() && screen && screen.height
                ? void 0 === window.orientation || null === window.orientation
                    ? window.innerHeight < screen.height
                        ? window.innerHeight
                        : screen.height
                    : 0 === window.orientation % 180
                        ? window.innerHeight < screen.height
                            ? window.innerHeight
                            : screen.height
                        : window.innerHeight < screen.width
                            ? window.innerHeight
                            : screen.width
                : window.innerHeight
                    ? window.innerHeight
                    : document.documentElement && 0 != document.documentElement.clientHeight
                        ? document.documentElement.clientHeight
                        : document.body
                            ? document.body.clientHeight
                            : 0;
        }
    },
    isiOS: function () {
        var b = /iPhone/i.test(navigator.userAgent),
            c = /iPad/i.test(navigator.userAgent);
        return b || c;
    },
    updateSettings: function () { },
    clone: function () {
        var b = new ViewHelper(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
ViewHelper.prototype.constructor = ViewHelper;
var Logger = function () { };
Logger.prototype = {
    console: function (b) {
        console.trace(b);
    },
    clone: function () {
        var b = new Logger(),
            c;
        for (c in this) this.hasOwnProperty(c) && (b[c] = this[c]);
        return b;
    },
};
Logger.prototype.constructor = Logger;
window.MJS = {
    sys: new SystemHelper(),
    ad: new AdHelper(),
    view: new ViewHelper(),
    math: new MathHelper(),
    game: new GameHelper(),
    event: new EventTracker(),
    settings: new SettingsHelper(),
    loc: new LocationHelper(),
    drawHelp: new DrawHelper(),
    log: new Logger(),
    TYPEOFS: { STR: "string", UNDEF: "UNDEFINED", NULL: null, NUM: "number", BOOL: "boolean" },
    CONST: { TRUE: "true", FALSE: "false", ON: "on", OFF: "off", ISMISSINGA: " is missing", ISMISSINGB: " is missing or incorrect type", URL: "https://www.marketjs.com", MOPUB: "mopub", _SELF: "_self" },
};
var gameSettingsGlobal = { installBanner: { fontFamily: "arial", fontSize: 20, textFillColor: "rgba(255,255,255,1)", boxFillColor: "rgba(0,0,0,1)", textID: 0, text: ["", "Tutorial", ""] } };
console.log(gameSettingsGlobal);
var gameSettingsPortrait = { orientation: "portrait", gamePlayLogoConfig: { pos: { x: 250, y: 600 }, scale: 0.7 } },
    gameSettingsLandscape = { orientation: "landscape", gamePlayLogoConfig: { pos: { x: 550, y: 120 }, scale: 0.7 } };
var localisedStrings = {};
(function (b) {
    Number.prototype.map = function (b, c, d, f) {
        return d + (f - d) * ((this - b) / (c - b));
    };
    Number.prototype.limit = function (b, c) {
        return Math.min(c, Math.max(b, this));
    };
    Number.prototype.round = function (b) {
        b = Math.pow(10, b || 0);
        return Math.round(this * b) / b;
    };
    Number.prototype.floor = function () {
        return Math.floor(this);
    };
    Number.prototype.ceil = function () {
        return Math.ceil(this);
    };
    Number.prototype.toInt = function () {
        return this | 0;
    };
    Number.prototype.toRad = function () {
        return (this / 180) * Math.PI;
    };
    Number.prototype.toDeg = function () {
        return (180 * this) / Math.PI;
    };
    Object.defineProperty(Array.prototype, "erase", {
        value: function (b) {
            for (var c = this.length; c--;) this[c] === b && this.splice(c, 1);
            return this;
        },
    });
    Object.defineProperty(Array.prototype, "random", {
        value: function () {
            return this[Math.floor(Math.random() * this.length)];
        },
    });
    Function.prototype.bind =
        Function.prototype.bind ||
        function (b) {
            if ("function" !== typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            var c = Array.prototype.slice.call(arguments, 1),
                d = this,
                f = function () { },
                g = function () {
                    return d.apply(this instanceof f && b ? this : b, c.concat(Array.prototype.slice.call(arguments)));
                };
            f.prototype = this.prototype;
            g.prototype = new f();
            return g;
        };
    b.ig = {
        game: null,
        debug: null,
        version: "1.24",
        global: b,
        modules: {},
        resources: [],
        ready: !1,
        baked: !1,
        nocache: "",
        ua: {},
        prefix: b.ImpactPrefix || "",
        lib: "lib/",
        _current: null,
        _loadQueue: [],
        _waitForOnload: 0,
        $: function (b) {
            return "#" == b.charAt(0) ? document.getElementById(b.substr(1)) : document.getElementsByTagName(b);
        },
        $new: function (b) {
            return document.createElement(b);
        },
        copy: function (b) {
            if (!b || "object" != typeof b || b instanceof HTMLElement || b instanceof ig.Class) return b;
            if (b instanceof Array) for (var c = [], d = 0, f = b.length; d < f; d++) c[d] = ig.copy(b[d]);
            else for (d in ((c = {}), b)) c[d] = ig.copy(b[d]);
            return c;
        },
        merge: function (b, c) {
            for (var d in c) {
                var f = c[d];
                if ("object" != typeof f || f instanceof HTMLElement || f instanceof ig.Class || null === f) b[d] = f;
                else {
                    if (!b[d] || "object" != typeof b[d]) b[d] = f instanceof Array ? [] : {};
                    ig.merge(b[d], f);
                }
            }
            return b;
        },
        ksort: function (b) {
            if (!b || "object" != typeof b) return [];
            var c = [],
                d = [],
                f;
            for (f in b) c.push(f);
            c.sort();
            for (f = 0; f < c.length; f++) d.push(b[c[f]]);
            return d;
        },
        setVendorAttribute: function (b, c, d) {
            var f = c.charAt(0).toUpperCase() + c.substr(1);
            b[c] = "undefined" !== typeof b.imageSmoothingEnabled ? (b["ms" + f] = b["moz" + f] = b["o" + f] = d) : (b["ms" + f] = b["moz" + f] = b["webkit" + f] = b["o" + f] = d);
        },
        getVendorAttribute: function (b, c) {
            var d = c.charAt(0).toUpperCase() + c.substr(1);
            return "undefined" !== typeof b.imageSmoothingEnabled ? b[c] || b["ms" + d] || b["moz" + d] || b["o" + d] : b[c] || b["ms" + d] || b["moz" + d] || b["webkit" + d] || b["o" + d];
        },
        normalizeVendorAttribute: function (b, c) {
            var d = ig.getVendorAttribute(b, c);
            !b[c] && d && (b[c] = d);
        },
        module: function (b) {
            if (ig._current) throw "Module '" + ig._current.name + "' defines nothing";
            if (ig.modules[b] && ig.modules[b].body) throw "Module '" + b + "' is already defined";
            ig._current = { name: b, requires: [], loaded: !1, body: null };
            ig.modules[b] = ig._current;
            ig._loadQueue.push(ig._current);
            return ig;
        },
        requires: function () {
            ig._current.requires = Array.prototype.slice.call(arguments);
            return ig;
        },
        defines: function (b) {
            ig._current.body = b;
            ig._current = null;
            ig._initDOMReady();
        },
        addResource: function (b) {
            ig.resources.push(b);
        },
        setNocache: function (b) {
            ig.nocache = b ? "?" + Date.now() : "";
        },
        log: function () { },
        assert: function () { },
        show: function () { },
        mark: function () { },
        _loadScript: function (b, c) {
            ig.modules[b] = { name: b, requires: [], loaded: !1, body: null };
            ig._waitForOnload++;
            var d = ig.prefix + ig.lib + b.replace(/\./g, "/") + ".js" + ig.nocache,
                f = ig.$new("script");
            f.type = "text/javascript";
            f.src = d;
            f.onload = function () {
                ig._waitForOnload--;
                ig._execModules();
            };
            f.onerror = function () {
                throw "Failed to load module " + b + " at " + d + " required from " + c;
            };
            ig.$("head")[0].appendChild(f);
        },
        _execModules: function () {
            for (var b = !1, c = 0; c < ig._loadQueue.length; c++) {
                for (var d = ig._loadQueue[c], f = !0, g = 0; g < d.requires.length; g++) {
                    var h = d.requires[g];
                    ig.modules[h] ? ig.modules[h].loaded || (f = !1) : ((f = !1), ig._loadScript(h, d.name));
                }
                f && d.body && (ig._loadQueue.splice(c, 1), (d.loaded = !0), d.body(), (b = !0), c--);
            }
            if (b) ig._execModules();
            else if (!ig.baked && 0 == ig._waitForOnload && 0 != ig._loadQueue.length) {
                b = [];
                for (c = 0; c < ig._loadQueue.length; c++) {
                    f = [];
                    h = ig._loadQueue[c].requires;
                    for (g = 0; g < h.length; g++) (d = ig.modules[h[g]]), (!d || !d.loaded) && f.push(h[g]);
                    b.push(ig._loadQueue[c].name + " (requires: " + f.join(", ") + ")");
                }
                throw "Unresolved (or circular?) dependencies. Most likely there's a name/path mismatch for one of the listed modules or a previous syntax error prevents a module from loading:\n" + b.join("\n");
            }
        },
        _DOMReady: function () {
            if (!ig.modules["dom.ready"].loaded) {
                if (!document.body) return setTimeout(ig._DOMReady, 13);
                ig.modules["dom.ready"].loaded = !0;
                ig._waitForOnload--;
                ig._execModules();
            }
            return 0;
        },
        _boot: function () {
            document.location.href.match(/\?nocache/) && ig.setNocache(!0);
            ig.ua.pixelRatio = b.devicePixelRatio || 1;
            ig.ua.viewport = { width: b.innerWidth, height: b.innerHeight };
            ig.ua.screen = { width: b.screen.availWidth * ig.ua.pixelRatio, height: b.screen.availHeight * ig.ua.pixelRatio };
            ig.ua.iPhone = /iPhone/i.test(navigator.userAgent);
            ig.ua.iPhone4 = ig.ua.iPhone && 2 == ig.ua.pixelRatio;
            ig.ua.iPad = /iPad/i.test(navigator.userAgent);
            ig.ua.android = /android/i.test(navigator.userAgent);
            ig.ua.winPhone = /Windows Phone/i.test(navigator.userAgent);
            ig.ua.iOS = ig.ua.iPhone || ig.ua.iPad;
            ig.ua.mobile = ig.ua.iOS || ig.ua.android || ig.ua.winPhone || /mobile/i.test(navigator.userAgent);
            ig.ua.touchDevice = "ontouchstart" in b || b.navigator.msMaxTouchPoints;
        },
        _initDOMReady: function () {
            ig.modules["dom.ready"]
                ? ig._execModules()
                : (ig._boot(),
                    (ig.modules["dom.ready"] = { requires: [], loaded: !1, body: null }),
                    ig._waitForOnload++,
                    "complete" === document.readyState ? ig._DOMReady() : (document.addEventListener("DOMContentLoaded", ig._DOMReady, !1), b.addEventListener("load", ig._DOMReady, !1)));
        },
    };
    ig.normalizeVendorAttribute(b, "requestAnimationFrame");
    if (b.requestAnimationFrame) {
        var c = 1,
            d = {};
        b.ig.setAnimation = function (f, g) {
            var h = c++;
            d[h] = !0;
            var j = function () {
                d[h] && (b.requestAnimationFrame(j, g), f());
            };
            b.requestAnimationFrame(j, g);
            return h;
        };
        b.ig.clearAnimation = function (b) {
            delete d[b];
        };
    } else
        (b.ig.setAnimation = function (c) {
            return b.setInterval(c, 1e3 / 60);
        }),
            (b.ig.clearAnimation = function (c) {
                b.clearInterval(c);
            });
    var f = !1,
        g = /xyz/.test(function () {
            xyz;
        })
            ? /\bparent\b/
            : /.*/,
        j = 0;
    b.ig.Class = function () { };
    var h = function (b) {
        var c = this.prototype,
            d = {},
            f;
        for (f in b)
            "function" == typeof b[f] && "function" == typeof c[f] && g.test(b[f])
                ? ((d[f] = c[f]),
                    (c[f] = (function (b, c) {
                        return function () {
                            var f = this.parent;
                            this.parent = d[b];
                            var g = c.apply(this, arguments);
                            this.parent = f;
                            return g;
                        };
                    })(f, b[f])))
                : (c[f] = b[f]);
    };
    b.ig.Class.extend = function (c) {
        function d() {
            if (!f) {
                if (this.staticInstantiate) {
                    var b = this.staticInstantiate.apply(this, arguments);
                    if (b) return b;
                }
                for (var c in this) "object" == typeof this[c] && (this[c] = ig.copy(this[c]));
                this.init && this.init.apply(this, arguments);
            }
            return this;
        }
        var m = this.prototype;
        f = !0;
        var n = new this();
        f = !1;
        for (var q in c)
            n[q] =
                "function" == typeof c[q] && "function" == typeof m[q] && g.test(c[q])
                    ? (function (b, c) {
                        return function () {
                            var d = this.parent;
                            this.parent = m[b];
                            var f = c.apply(this, arguments);
                            this.parent = d;
                            return f;
                        };
                    })(q, c[q])
                    : c[q];
        d.prototype = n;
        d.prototype.constructor = d;
        d.extend = b.ig.Class.extend;
        d.inject = h;
        d.classId = n.classId = ++j;
        return d;
    };
    b.ImpactMixin && ig.merge(ig, b.ImpactMixin);
})(window);
ig.baked = !0;
ig.module("impact.image").defines(function () {
    ig.Image = ig.Class.extend({
        data: null,
        width: 0,
        height: 0,
        loaded: !1,
        failed: !1,
        loadCallback: null,
        path: "",
        staticInstantiate: function (b) {
            return ig.Image.cache[b] || null;
        },
        init: function (b) {
            this.path = b;
            this.load();
        },
        load: function (b) {
            this.loaded
                ? b && b(this.path, !0)
                : (!this.loaded && ig.ready
                    ? ((this.loadCallback = b || null), (this.data = new Image()), (this.data.onload = this.onload.bind(this)), (this.data.onerror = this.onerror.bind(this)), (this.data.src = this.path))
                    : ig.addResource(this),
                    (ig.Image.cache[this.path] = this));
        },
        reload: function () {
            this.loaded = !1;
            this.data = new Image();
            this.data.onload = this.onload.bind(this);
            this.data.src = this.path;
        },
        onload: function () {
            this.width = this.data.width;
            this.height = this.data.height;
            this.loaded = !0;
            1 != ig.system.scale && this.resize(ig.system.scale);
            this.loadCallback && this.loadCallback(this.path, !0);
        },
        onerror: function () {
            this.failed = !0;
            this.loadCallback && this.loadCallback(this.path, !1);
        },
        resize: function (b) {
            var c = ig.getImagePixels(this.data, 0, 0, this.width, this.height),
                d = this.width * b,
                f = this.height * b,
                g = ig.$new("canvas");
            g.width = d;
            g.height = f;
            for (var j = g.getContext("2d"), h = j.getImageData(0, 0, d, f), k = 0; k < f; k++)
                for (var l = 0; l < d; l++) {
                    var m = 4 * (Math.floor(k / b) * this.width + Math.floor(l / b)),
                        n = 4 * (k * d + l);
                    h.data[n] = c.data[m];
                    h.data[n + 1] = c.data[m + 1];
                    h.data[n + 2] = c.data[m + 2];
                    h.data[n + 3] = c.data[m + 3];
                }
            j.putImageData(h, 0, 0);
            this.data = g;
        },
        draw: function (b, c, d, f, g, j) {
            if (this.loaded) {
                var h = ig.system.scale;
                g = (g ? g : this.width) * h;
                j = (j ? j : this.height) * h;
                ig.system.context.drawImage(this.data, d ? d * h : 0, f ? f * h : 0, g, j, ig.system.getDrawPos(b), ig.system.getDrawPos(c), g, j);
                ig.Image.drawCount++;
            }
        },
        drawTile: function (b, c, d, f, g, j, h) {
            g = g ? g : f;
            if (this.loaded && !(f > this.width || g > this.height)) {
                var k = ig.system.scale,
                    l = Math.floor(f * k),
                    m = Math.floor(g * k),
                    n = j ? -1 : 1,
                    q = h ? -1 : 1;
                if (j || h) ig.system.context.save(), ig.system.context.scale(n, q);
                ig.system.context.drawImage(this.data, (Math.floor(d * f) % this.width) * k, Math.floor((d * f) / this.width) * g * k, l, m, ig.system.getDrawPos(b) * n - (j ? l : 0), ig.system.getDrawPos(c) * q - (h ? m : 0), l, m);
                (j || h) && ig.system.context.restore();
                ig.Image.drawCount++;
            }
        },
    });
    ig.Image.drawCount = 0;
    ig.Image.cache = {};
    ig.Image.reloadCache = function () {
        for (var b in ig.Image.cache) ig.Image.cache[b].reload();
    };
});
ig.baked = !0;
ig.module("impact.loader")
    .requires("impact.image")
    .defines(function () {
        ig.Loader = ig.Class.extend({
            resources: [],
            gameClass: null,
            status: 0,
            done: !1,
            _unloaded: [],
            _drawStatus: 0,
            _intervalId: 0,
            _loadCallbackBound: null,
            errorMessage: "",
            init: function (b, c) {
                this.gameClass = b;
                this.resources = c;
                this._loadCallbackBound = this._loadCallback.bind(this);
                for (var d = 0; d < this.resources.length; d++) this._unloaded.push(this.resources[d].path);
            },
            load: function () {
                ig.system.clear("#000");
                if (this.resources.length) {
                    for (var b = 0; b < this.resources.length; b++) (this.currentPath = this.resources[b].path), this.loadResource(this.resources[b]);
                    this._intervalId = setInterval(this.draw.bind(this), 16);
                } else this.end();
            },
            loadResource: function (b) {
                b.load(this._loadCallbackBound);
            },
            end: function () {
                this.done || ((this.done = !0), clearInterval(this._intervalId), ig.system.setGame(this.gameClass));
            },
            draw: function () {
                this._drawStatus += (this.status - this._drawStatus) / 5;
            },
            _loadCallback: function (b, c) {
                console.log("inside loadcallback");
                console.log(b);
                //console.log(c);
                if (c) this._unloaded.erase(b);
                else throw ((this.errorMessage = "Failed to load resource: " + b), "Failed to load resource: " + b);
                this.status = 1 - this._unloaded.length / this.resources.length;
                0 == this._unloaded.length && setTimeout(this.end.bind(this), 250);
            },
        });
    });
ig.baked = !0;
ig.module("impact.timer").defines(function () {
    ig.Timer = ig.Class.extend({
        target: 0,
        base: 0,
        last: 0,
        pausedAt: 0,
        init: function (b) {
            this.last = this.base = ig.Timer.time;
            this.target = b || 0;
        },
        set: function (b) {
            this.target = b || 0;
            this.base = ig.Timer.time;
            this.pausedAt = 0;
        },
        reset: function () {
            this.base = ig.Timer.time;
            this.pausedAt = 0;
        },
        tick: function () {
            var b = ig.Timer.time - this.last;
            this.last = ig.Timer.time;
            return this.pausedAt ? 0 : b;
        },
        delta: function () {
            return (this.pausedAt || ig.Timer.time) - this.base - this.target;
        },
        pause: function () {
            this.pausedAt || (this.pausedAt = ig.Timer.time);
        },
        unpause: function () {
            this.pausedAt && ((this.base += ig.Timer.time - this.pausedAt), (this.pausedAt = 0));
        },
    });
    ig.Timer._last = 0;
    ig.Timer.time = Number.MIN_VALUE;
    ig.Timer.timeScale = 1;
    ig.Timer.maxStep = 0.05;
    ig.Timer.step = function () {
        var b = Date.now();
        ig.Timer.time += Math.min((b - ig.Timer._last) / 1e3, ig.Timer.maxStep) * ig.Timer.timeScale;
        ig.Timer._last = b;
    };
});
ig.baked = !0;
ig.module("impact.system")
    .requires("impact.timer", "impact.image")
    .defines(function () {
        ig.System = ig.Class.extend({
            fps: 30,
            width: 320,
            height: 240,
            realWidth: 320,
            realHeight: 240,
            scale: 1,
            rotation: 0,
            tick: 0,
            animationId: 0,
            newGameClass: null,
            running: !1,
            delegate: null,
            clock: null,
            canvas: null,
            context: null,
            init: function (b, c, d, f, g) {
                this.fps = c;
                this.clock = new ig.Timer();
                this.canvas = ig.$(b);
                this.resize(d, f, g);
                this.context = this.canvas.getContext("2d");
                this.getDrawPos = ig.System.drawMode;
                1 != this.scale && (ig.System.scaleMode = ig.System.SCALE.CRISP);
                ig.System.scaleMode(this.canvas, this.context);
            },
            resize: function (b, c, d) {
                this.width = b;
                this.height = c;
                this.scale = d || this.scale;
                this.realWidth = this.width * this.scale;
                this.realHeight = this.height * this.scale;
                this.canvas.width = this.realWidth;
                this.canvas.height = this.realHeight;
            },
            setGame: function (b) {
                this.running ? (this.newGameClass = b) : this.setGameNow(b);
            },
            setGameNow: function (b) {
                ig.game = new b();
                ig.system.setDelegate(ig.game);
            },
            setDelegate: function (b) {
                if ("function" == typeof b.run) (this.delegate = b), this.startRunLoop();
                else throw "System.setDelegate: No run() function in object";
            },
            stopRunLoop: function () {
                ig.clearAnimation(this.animationId);
                this.running = !1;
            },
            startRunLoop: function () {
                this.stopRunLoop();
                this.animationId = ig.setAnimation(this.run.bind(this), this.canvas);
                this.running = !0;
            },
            clear: function (b) {
                this.context.fillStyle = b;
                this.context.fillRect(0, 0, this.realWidth, this.realHeight);
            },
            run: function () {
                ig.Timer.step();
                this.tick = this.clock.tick();
                this.delegate.run();
                ig.input.clearPressed();
                this.newGameClass && (this.setGameNow(this.newGameClass), (this.newGameClass = null));
            },
            getDrawPos: null,
        });
        ig.System.DRAW = {
            AUTHENTIC: function (b) {
                return Math.round(b) * this.scale;
            },
            SMOOTH: function (b) {
                return Math.round(b * this.scale);
            },
            SUBPIXEL: function (b) {
                return b * this.scale;
            },
        };
        ig.System.drawMode = ig.System.DRAW.SMOOTH;
        ig.System.SCALE = {
            CRISP: function (b, c) {
                ig.setVendorAttribute(c, "imageSmoothingEnabled", !1);
                b.style.imageRendering = "-moz-crisp-edges";
                b.style.imageRendering = "-o-crisp-edges";
                b.style.imageRendering = "-webkit-optimize-contrast";
                b.style.imageRendering = "crisp-edges";
                b.style.msInterpolationMode = "nearest-neighbor";
            },
            SMOOTH: function (b, c) {
                ig.setVendorAttribute(c, "imageSmoothingEnabled", !0);
                b.style.imageRendering = "";
                b.style.msInterpolationMode = "";
            },
        };
        ig.System.scaleMode = ig.System.SCALE.SMOOTH;
    });
ig.baked = !0;
ig.module("impact.input").defines(function () {
    ig.KEY = { MOUSE1: -1, MOUSE2: -3, MWHEEL_UP: -4, MWHEEL_DOWN: -5 };
    ig.Input = ig.Class.extend({
        bindings: {},
        actions: {},
        presses: {},
        locks: {},
        delayedKeyup: {},
        isUsingMouse: !1,
        isUsingKeyboard: !1,
        isUsingAccelerometer: !1,
        mouse: { x: 0, y: 0 },
        accel: { x: 0, y: 0, z: 0 },
        initMouse: function () {
            if (!this.isUsingMouse) {
                this.isUsingMouse = !0;
                var b = this.mousewheel.bind(this);
                ig.system.canvas.addEventListener("mousewheel", b, !1);
                ig.system.canvas.addEventListener("DOMMouseScroll", b, !1);
                ig.system.canvas.addEventListener("contextmenu", this.contextmenu.bind(this), !1);
                ig.system.canvas.addEventListener("mousedown", this.keydown.bind(this), !1);
                ig.system.canvas.addEventListener("mouseup", this.keyup.bind(this), !1);
                ig.system.canvas.addEventListener("mousemove", this.mousemove.bind(this), !1);
                ig.ua.touchDevice &&
                    (ig.system.canvas.addEventListener("touchstart", this.keydown.bind(this), !1),
                        ig.system.canvas.addEventListener("touchend", this.keyup.bind(this), !1),
                        ig.system.canvas.addEventListener("touchmove", this.mousemove.bind(this), !1),
                        ig.system.canvas.addEventListener("MSPointerDown", this.keydown.bind(this), !1),
                        ig.system.canvas.addEventListener("MSPointerUp", this.keyup.bind(this), !1),
                        ig.system.canvas.addEventListener("MSPointerMove", this.mousemove.bind(this), !1),
                        (ig.system.canvas.style.msTouchAction = "none"));
            }
        },
        mousewheel: function (b) {
            var c = this.bindings[0 < (b.wheelDelta ? b.wheelDelta : -1 * b.detail) ? ig.KEY.MWHEEL_UP : ig.KEY.MWHEEL_DOWN];
            c && ((this.actions[c] = !0), (this.presses[c] = !0), (this.delayedKeyup[c] = !0), b.stopPropagation(), b.preventDefault());
        },
        mousemove: function (b) {
            parseInt(ig.system.canvas.offsetWidth);
            var c = { left: 0, top: 0 };
            ig.system.canvas.getBoundingClientRect && (c = ig.system.canvas.getBoundingClientRect());
            b = b.touches ? b.touches[0] : b;
            this.mouse.x = b.clientX - c.left;
            this.mouse.y = b.clientY - c.top;
        },
        contextmenu: function (b) {
            this.bindings[ig.KEY.MOUSE2] && (b.stopPropagation(), b.preventDefault());
        },
        keydown: function (b) {
            var c = b.target.tagName;
            if (!("INPUT" == c || "textAREA" == c))
                if (
                    ((c = "keydown" == b.type ? b.keyCode : 2 == b.button ? ig.KEY.MOUSE2 : ig.KEY.MOUSE1),
                        0 > c && !ig.ua.mobile && window.focus(),
                        ("touchstart" == b.type || "mousedown" == b.type) && this.mousemove(b),
                        (c = this.bindings[c]))
                )
                    (this.actions[c] = !0), this.locks[c] || ((this.presses[c] = !0), (this.locks[c] = !0)), b.preventDefault();
        },
        keyup: function (b) {
            var c = b.target.tagName;
            if (!("INPUT" == c || "textAREA" == c)) if ((c = this.bindings["keyup" == b.type ? b.keyCode : 2 == b.button ? ig.KEY.MOUSE2 : ig.KEY.MOUSE1])) (this.delayedKeyup[c] = !0), b.preventDefault();
        },
        bind: function (b, c) {
            0 > b ? this.initMouse() : 0 < b && this.initKeyboard();
            this.bindings[b] = c;
        },
        bindTouch: function (b, c) {
            var d = ig.$(b),
                f = this;
            d.addEventListener(
                "touchstart",
                function (b) {
                    f.touchStart(b, c);
                },
                !1
            );
            d.addEventListener(
                "touchend",
                function (b) {
                    f.touchEnd(b, c);
                },
                !1
            );
            d.addEventListener(
                "MSPointerDown",
                function (b) {
                    f.touchStart(b, c);
                },
                !1
            );
            d.addEventListener(
                "MSPointerUp",
                function (b) {
                    f.touchEnd(b, c);
                },
                !1
            );
        },
        unbind: function (b) {
            this.delayedKeyup[this.bindings[b]] = !0;
            this.bindings[b] = null;
        },
        unbindAll: function () {
            this.bindings = {};
            this.actions = {};
            this.presses = {};
            this.locks = {};
            this.delayedKeyup = {};
        },
        state: function (b) {
            return this.actions[b];
        },
        pressed: function (b) {
            return this.presses[b];
        },
        released: function (b) {
            return !!this.delayedKeyup[b];
        },
        clearPressed: function () {
            for (var b in this.delayedKeyup) (this.actions[b] = !1), (this.locks[b] = !1);
            this.delayedKeyup = {};
            this.presses = {};
        },
        touchStart: function (b, c) {
            this.actions[c] = !0;
            this.presses[c] = !0;
            b.stopPropagation();
            b.preventDefault();
            return !1;
        },
        touchEnd: function (b, c) {
            this.delayedKeyup[c] = !0;
            b.stopPropagation();
            b.preventDefault();
            return !1;
        },
    });
});
ig.baked = !0;
ig.module("impact.impact")
    .requires("dom.ready", "impact.loader", "impact.system", "impact.input")
    .defines(function () {
        ig.main = function (b, c, d, f, g, j, h) {
            ig.system = new ig.System(b, d, f, g, j || 1);
            ig.input = new ig.Input();
            ig.ready = !0;
            new (h || ig.Loader)(c, ig.resources).load();
        };
    });
ig.baked = !0;
ig.module("impact.animation")
    .requires("impact.timer", "impact.image")
    .defines(function () {
        ig.AnimationSheet = ig.Class.extend({
            width: 8,
            height: 8,
            image: null,
            init: function (b, c, d) {
                this.width = c;
                this.height = d;
                this.image = new ig.Image(b);
            },
        });
        ig.Animation = ig.Class.extend({
            sheet: null,
            timer: null,
            sequence: [],
            flip: { x: !1, y: !1 },
            pivot: { x: 0, y: 0 },
            frame: 0,
            tile: 0,
            loopCount: 0,
            alpha: 1,
            angle: 0,
            init: function (b, c, d, f) {
                this.sheet = b;
                this.pivot = { x: b.width / 2, y: b.height / 2 };
                this.timer = new ig.Timer();
                this.frameTime = c;
                this.sequence = d;
                this.stop = !!f;
                this.tile = this.sequence[0];
            },
            rewind: function () {
                this.timer.set();
                this.frame = this.loopCount = 0;
                this.tile = this.sequence[0];
                return this;
            },
            gotoFrame: function (b) {
                this.timer.set(this.frameTime * -b - 1e-4);
                this.update();
            },
            gotoRandomFrame: function () {
                this.gotoFrame(Math.floor(Math.random() * this.sequence.length));
            },
            update: function () {
                var b = Math.floor(this.timer.delta() / this.frameTime);
                this.loopCount = Math.floor(b / this.sequence.length);
                this.frame = this.stop && 0 < this.loopCount ? this.sequence.length - 1 : b % this.sequence.length;
                this.tile = this.sequence[this.frame];
            },
            draw: function (b, c) {
                var d = Math.max(this.sheet.width, this.sheet.height);
                b > ig.system.width ||
                    c > ig.system.height ||
                    0 > b + d ||
                    0 > c + d ||
                    (1 != this.alpha && (ig.system.context.globalAlpha = this.alpha),
                        0 == this.angle
                            ? this.sheet.image.drawTile(b, c, this.tile, this.sheet.width, this.sheet.height, this.flip.x, this.flip.y)
                            : (ig.system.context.save(),
                                ig.system.context.translate(ig.system.getDrawPos(b + this.pivot.x), ig.system.getDrawPos(c + this.pivot.y)),
                                ig.system.context.rotate(this.angle),
                                this.sheet.image.drawTile(-this.pivot.x, -this.pivot.y, this.tile, this.sheet.width, this.sheet.height, this.flip.x, this.flip.y),
                                ig.system.context.restore()),
                        1 != this.alpha && (ig.system.context.globalAlpha = 1));
            },
        });
    });
ig.baked = !0;
ig.module("impact.entity")
    .requires("impact.animation", "impact.impact")
    .defines(function () {
        ig.Entity = ig.Class.extend({
            id: 0,
            settings: {},
            alpha: 1,
            anchor: { x: 0.5, y: 0.5 },
            size: { x: 16, y: 16 },
            offset: { x: 0, y: 0 },
            pos: { x: 0, y: 0 },
            last: { x: 0, y: 0 },
            vel: { x: 0, y: 0 },
            accel: { x: 0, y: 0 },
            friction: { x: 0, y: 0 },
            maxVel: { x: 100, y: 100 },
            zIndex: 0,
            gravityFactor: 1,
            standing: !1,
            bounciness: 0,
            minBounceVelocity: 40,
            anims: {},
            animSheet: null,
            currentAnim: null,
            health: 10,
            type: 0,
            checkAgainst: 0,
            collides: 0,
            _killed: !1,
            slopeStanding: { min: (44).toRad(), max: (136).toRad() },
            init: function (b, c, d) {
                this.id = ++ig.Entity._lastId;
                this.pos.x = this.last.x = b;
                this.pos.y = this.last.y = c;
                ig.merge(this, d);
            },
            reset: function (b, c, d) {
                var f = this.constructor.prototype;
                this.pos.x = b;
                this.pos.y = c;
                this.last.x = b;
                this.last.y = c;
                this.vel.x = f.vel.x;
                this.vel.y = f.vel.y;
                this.accel.x = f.accel.x;
                this.accel.y = f.accel.y;
                this.health = f.health;
                this._killed = f._killed;
                this.standing = f.standing;
                this.type = f.type;
                this.checkAgainst = f.checkAgainst;
                this.collides = f.collides;
                ig.merge(this, d);
            },
            addAnim: function (b, c, d, f) {
                if (!this.animSheet) throw "No animSheet to add the animation " + b + " to.";
                c = new ig.Animation(this.animSheet, c, d, f);
                this.anims[b] = c;
                this.currentAnim || (this.currentAnim = c);
                return c;
            },
            update: function () {
                this.last.x = this.pos.x;
                this.last.y = this.pos.y;
                this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
                this.vel.x = this.getNewVelocity(this.vel.x, this.accel.x, this.friction.x, this.maxVel.x);
                this.vel.y = this.getNewVelocity(this.vel.y, this.accel.y, this.friction.y, this.maxVel.y);
                var b = ig.game.collisionMap.trace(this.pos.x, this.pos.y, this.vel.x * ig.system.tick, this.vel.y * ig.system.tick, this.size.x, this.size.y);
                this.handleMovementTrace(b);
                this.currentAnim && this.currentAnim.update();
            },
            getNewVelocity: function (b, c, d, f) {
                return c ? (b + c * ig.system.tick).limit(-f, f) : d ? ((c = d * ig.system.tick), 0 < b - c ? b - c : 0 > b + c ? b + c : 0) : b.limit(-f, f);
            },
            handleMovementTrace: function (b) {
                this.standing = !1;
                b.collision.y && (0 < this.bounciness && Math.abs(this.vel.y) > this.minBounceVelocity ? (this.vel.y *= -this.bounciness) : (0 < this.vel.y && (this.standing = !0), (this.vel.y = 0)));
                b.collision.x && (this.vel.x = 0 < this.bounciness && Math.abs(this.vel.x) > this.minBounceVelocity ? this.vel.x * -this.bounciness : 0);
                if (b.collision.slope) {
                    var c = b.collision.slope;
                    if (0 < this.bounciness) {
                        var d = this.vel.x * c.nx + this.vel.y * c.ny;
                        this.vel.x = (this.vel.x - 2 * c.nx * d) * this.bounciness;
                        this.vel.y = (this.vel.y - 2 * c.ny * d) * this.bounciness;
                    } else
                        (d = (this.vel.x * c.x + this.vel.y * c.y) / (c.x * c.x + c.y * c.y)),
                            (this.vel.x = c.x * d),
                            (this.vel.y = c.y * d),
                            (c = Math.atan2(c.x, c.y)),
                            c > this.slopeStanding.min && c < this.slopeStanding.max && (this.standing = !0);
                }
                this.pos = b.pos;
            },
            draw: function () {
                this.currentAnim && this.currentAnim.draw(this.pos.x - this.offset.x - ig.game._rscreen.x, this.pos.y - this.offset.y - ig.game._rscreen.y);
            },
            kill: function () {
                ig.game.removeEntity(this);
            },
            receiveDamage: function (b) {
                this.health = Math.max(0, this.health - b);
                0 >= this.health && this.kill();
            },
            touches: function (b) {
                return !(this.pos.x >= b.pos.x + b.size.x || this.pos.x + this.size.x <= b.pos.x || this.pos.y >= b.pos.y + b.size.y || this.pos.y + this.size.y <= b.pos.y);
            },
            distanceTo: function (b) {
                var c = this.pos.x + this.size.x * this.anchor.x - (b.pos.x + b.size.x * b.anchor.x);
                b = this.pos.y + this.size.y * this.anchor.y - (b.pos.y + b.size.y * b.anchor.y);
                return Math.sqrt(c * c + b * b);
            },
            angleTo: function (b) {
                return Math.atan2(b.pos.y + b.size.y * b.anchor.y - (this.pos.y + this.size.y * this.anchor.y), b.pos.x + b.size.x * b.anchor.x - (this.pos.x + this.size.x * this.anchor.x));
            },
            textSet: function (b, c, d) {
                var f = ig.system.context;
                f.font = b + "px " + d;
                f.fillStyle = c;
            },
            textDraw: function (b, c, d, f) {
                var g = ig.system.context;
                g.save();
                g.textAlign = f;
                g.fillText(b, c, d);
                g.restore();
            },
            textStrokeDraw: function (b, c, d, f) {
                var g = ig.system.context;
                g.save();
                g.textAlign = f;
                g.lineWidth = 3;
                g.strokeStyle = "#000000";
                g.strokeText(b, c, d);
                g.restore();
            },
            wrapText: function (b, c, d, f, g, j) {
                c = c.toString().split("\n");
                for (var h = "", k = 0; k < c.length; k++) h = h + c[k] + " breakLine ";
                c = h.split(" ");
                h = "";
                for (k = 0; k < c.length; k++)
                    if ("breakLine" != c[k]) {
                        var l = h + c[k] + " ";
                        b.measureText(l).width > g && 0 < k ? (b.fillText(h, d, f), (h = c[k] + " "), (f += j)) : (h = l);
                    } else b.fillText(h, d, f), (h = ""), (f += j);
                b.fillText(h, d, f);
            },
            mirrorImage: function (b, c, d, f, g, j) {
                b.save();
                b.setTransform(g ? -1 : 1, 0, 0, j ? -1 : 1, d + g ? c.width : 0, f + j ? c.height : 0);
                b.drawImage(c, 0, 0);
                b.restore();
            },
            check: function () { },
            collideWith: function () { },
            ready: function () { },
            erase: function () { },
        });
        ig.Entity._lastId = 0;
        ig.Entity.COLLIDES = { NEVER: 0, LITE: 1, PASSIVE: 2, ACTIVE: 4, FIXED: 8 };
        ig.Entity.TYPE = { NONE: 0, A: 1, B: 2, BOTH: 3 };
        ig.Entity.checkPair = function (b, c) {
            b.checkAgainst & c.type && b.check(c);
            c.checkAgainst & b.type && c.check(b);
            b.collides && c.collides && b.collides + c.collides > ig.Entity.COLLIDES.ACTIVE && ig.Entity.solveCollision(b, c);
        };
        ig.Entity.solveCollision = function (b, c) {
            var d = null;
            if (b.collides == ig.Entity.COLLIDES.LITE || c.collides == ig.Entity.COLLIDES.FIXED) d = b;
            else if (c.collides == ig.Entity.COLLIDES.LITE || b.collides == ig.Entity.COLLIDES.FIXED) d = c;
            b.last.x + b.size.x > c.last.x && b.last.x < c.last.x + c.size.x
                ? (b.last.y < c.last.y ? ig.Entity.seperateOnYAxis(b, c, d) : ig.Entity.seperateOnYAxis(c, b, d), b.collideWith(c, "y"), c.collideWith(b, "y"))
                : b.last.y + b.size.y > c.last.y && b.last.y < c.last.y + c.size.y && (b.last.x < c.last.x ? ig.Entity.seperateOnXAxis(b, c, d) : ig.Entity.seperateOnXAxis(c, b, d), b.collideWith(c, "x"), c.collideWith(b, "x"));
        };
        ig.Entity.seperateOnXAxis = function (b, c, d) {
            var f = b.pos.x + b.size.x - c.pos.x;
            d
                ? ((d.vel.x = -d.vel.x * d.bounciness + (b === d ? c : b).vel.x), (c = ig.game.collisionMap.trace(d.pos.x, d.pos.y, d == b ? -f : f, 0, d.size.x, d.size.y)), (d.pos.x = c.pos.x))
                : ((d = (b.vel.x - c.vel.x) / 2),
                    (b.vel.x = -d),
                    (c.vel.x = d),
                    (d = ig.game.collisionMap.trace(b.pos.x, b.pos.y, -f / 2, 0, b.size.x, b.size.y)),
                    (b.pos.x = Math.floor(d.pos.x)),
                    (b = ig.game.collisionMap.trace(c.pos.x, c.pos.y, f / 2, 0, c.size.x, c.size.y)),
                    (c.pos.x = Math.ceil(b.pos.x)));
        };
        ig.Entity.seperateOnYAxis = function (b, c, d) {
            var f = b.pos.y + b.size.y - c.pos.y;
            if (d) {
                c = b === d ? c : b;
                d.vel.y = -d.vel.y * d.bounciness + c.vel.y;
                var g = 0;
                d == b && Math.abs(d.vel.y - c.vel.y) < d.minBounceVelocity && ((d.standing = !0), (g = c.vel.x * ig.system.tick));
                b = ig.game.collisionMap.trace(d.pos.x, d.pos.y, g, d == b ? -f : f, d.size.x, d.size.y);
                d.pos.y = b.pos.y;
                d.pos.x = b.pos.x;
            } else
                ig.game.gravity && (c.standing || 0 < b.vel.y)
                    ? ((d = ig.game.collisionMap.trace(b.pos.x, b.pos.y, 0, -(b.pos.y + b.size.y - c.pos.y), b.size.x, b.size.y)),
                        (b.pos.y = d.pos.y),
                        0 < b.bounciness && b.vel.y > b.minBounceVelocity ? (b.vel.y *= -b.bounciness) : ((b.standing = !0), (b.vel.y = 0)))
                    : ((d = (b.vel.y - c.vel.y) / 2),
                        (b.vel.y = -d),
                        (c.vel.y = d),
                        (g = c.vel.x * ig.system.tick),
                        (d = ig.game.collisionMap.trace(b.pos.x, b.pos.y, g, -f / 2, b.size.x, b.size.y)),
                        (b.pos.y = d.pos.y),
                        (b = ig.game.collisionMap.trace(c.pos.x, c.pos.y, 0, f / 2, c.size.x, c.size.y)),
                        (c.pos.y = b.pos.y));
        };
    });
ig.baked = !0;
ig.module("impact.map").defines(function () {
    ig.Map = ig.Class.extend({
        tilesize: 8,
        width: 1,
        height: 1,
        data: [[]],
        name: null,
        init: function (b, c) {
            this.tilesize = b;
            this.data = c;
            this.height = c.length;
            this.width = c[0].length;
            this.pxWidth = this.width * this.tilesize;
            this.pxHeight = this.height * this.tilesize;
        },
        getTile: function (b, c) {
            var d = Math.floor(b / this.tilesize),
                f = Math.floor(c / this.tilesize);
            return 0 <= d && d < this.width && 0 <= f && f < this.height ? this.data[f][d] : 0;
        },
        setTile: function (b, c, d) {
            b = Math.floor(b / this.tilesize);
            c = Math.floor(c / this.tilesize);
            0 <= b && b < this.width && 0 <= c && c < this.height && (this.data[c][b] = d);
        },
    });
});
ig.baked = !0;
ig.module("impact.collision-map")
    .requires("impact.map")
    .defines(function () {
        ig.CollisionMap = ig.Map.extend({
            lastSlope: 1,
            tiledef: null,
            init: function (b, c, g) {
                this.parent(b, c);
                this.tiledef = g || ig.CollisionMap.defaultTileDef;
                for (var j in this.tiledef) j | (0 > this.lastSlope) && (this.lastSlope = j | 0);
            },
            trace: function (b, c, g, j, h, k) {
                var l = { collision: { x: !1, y: !1, slope: !1 }, pos: { x: b, y: c }, tile: { x: 0, y: 0 } },
                    m = Math.ceil(Math.max(Math.abs(g), Math.abs(j)) / this.tilesize);
                if (1 < m)
                    for (
                        var n = g / m, q = j / m, p = 0;
                        p < m && (n || q) && !(this._traceStep(l, b, c, n, q, h, k, g, j, p), (b = l.pos.x), (c = l.pos.y), l.collision.x && (g = n = 0), l.collision.y && (j = q = 0), l.collision.slope);
                        p++
                    );
                else this._traceStep(l, b, c, g, j, h, k, g, j, 0);
                return l;
            },
            _traceStep: function (b, c, g, j, h, k, l, m, n, q) {
                b.pos.x += j;
                b.pos.y += h;
                var p = 0;
                if (j) {
                    var r = 0 < j ? k : 0,
                        v = 0 > j ? this.tilesize : 0,
                        p = Math.max(Math.floor(g / this.tilesize), 0),
                        s = Math.min(Math.ceil((g + l) / this.tilesize), this.height);
                    j = Math.floor((b.pos.x + r) / this.tilesize);
                    var u = Math.floor((c + r) / this.tilesize);
                    if (0 < q || j == u || 0 > u || u >= this.width) u = -1;
                    if (0 <= j && j < this.width)
                        for (var t = p; t < s && !(-1 != u && ((p = this.data[t][u]), 1 < p && p <= this.lastSlope && this._checkTileDef(b, p, c, g, m, n, k, l, u, t))); t++)
                            if (((p = this.data[t][j]), 1 == p || p > this.lastSlope || (1 < p && this._checkTileDef(b, p, c, g, m, n, k, l, j, t)))) {
                                if (1 < p && p <= this.lastSlope && b.collision.slope) break;
                                b.collision.x = !0;
                                b.tile.x = p;
                                c = b.pos.x = j * this.tilesize - r + v;
                                m = 0;
                                break;
                            }
                }
                if (h) {
                    r = 0 < h ? l : 0;
                    h = 0 > h ? this.tilesize : 0;
                    p = Math.max(Math.floor(b.pos.x / this.tilesize), 0);
                    v = Math.min(Math.ceil((b.pos.x + k) / this.tilesize), this.width);
                    t = Math.floor((b.pos.y + r) / this.tilesize);
                    s = Math.floor((g + r) / this.tilesize);
                    if (0 < q || t == s || 0 > s || s >= this.height) s = -1;
                    if (0 <= t && t < this.height)
                        for (j = p; j < v && !(-1 != s && ((p = this.data[s][j]), 1 < p && p <= this.lastSlope && this._checkTileDef(b, p, c, g, m, n, k, l, j, s))); j++)
                            if (((p = this.data[t][j]), 1 == p || p > this.lastSlope || (1 < p && this._checkTileDef(b, p, c, g, m, n, k, l, j, t)))) {
                                if (1 < p && p <= this.lastSlope && b.collision.slope) break;
                                b.collision.y = !0;
                                b.tile.y = p;
                                b.pos.y = t * this.tilesize - r + h;
                                break;
                            }
                }
            },
            _checkTileDef: function (b, c, g, j, h, k, l, m, n, q) {
                var p = this.tiledef[c];
                if (!p) return !1;
                c = (p[2] - p[0]) * this.tilesize;
                var r = (p[3] - p[1]) * this.tilesize,
                    v = p[4];
                l = g + h + (0 > r ? l : 0) - (n + p[0]) * this.tilesize;
                m = j + k + (0 < c ? m : 0) - (q + p[1]) * this.tilesize;
                if (0 < c * m - r * l) {
                    if (0 > h * -r + k * c) return v;
                    n = Math.sqrt(c * c + r * r);
                    q = r / n;
                    n = -c / n;
                    var s = l * q + m * n,
                        p = q * s,
                        s = n * s;
                    if (p * p + s * s >= h * h + k * k) return v || 0.5 > c * (m - k) - r * (l - h);
                    b.pos.x = g + h - p;
                    b.pos.y = j + k - s;
                    b.collision.slope = { x: c, y: r, nx: q, ny: n };
                    return !0;
                }
                return !1;
            },
        });
        var b = 1 / 3,
            c = 2 / 3;
        ig.CollisionMap.defaultTileDef = {
            5: [0, 1, 1, c, !0],
            6: [0, c, 1, b, !0],
            7: [0, b, 1, 0, !0],
            3: [0, 1, 1, 0.5, !0],
            4: [0, 0.5, 1, 0, !0],
            2: [0, 1, 1, 0, !0],
            10: [0.5, 1, 1, 0, !0],
            21: [0, 1, 0.5, 0, !0],
            32: [c, 1, 1, 0, !0],
            43: [b, 1, c, 0, !0],
            54: [0, 1, b, 0, !0],
            27: [0, 0, 1, b, !0],
            28: [0, b, 1, c, !0],
            29: [0, c, 1, 1, !0],
            25: [0, 0, 1, 0.5, !0],
            26: [0, 0.5, 1, 1, !0],
            24: [0, 0, 1, 1, !0],
            11: [0, 0, 0.5, 1, !0],
            22: [0.5, 0, 1, 1, !0],
            33: [0, 0, b, 1, !0],
            44: [b, 0, c, 1, !0],
            55: [c, 0, 1, 1, !0],
            16: [1, b, 0, 0, !0],
            17: [1, c, 0, b, !0],
            18: [1, 1, 0, c, !0],
            14: [1, 0.5, 0, 0, !0],
            15: [1, 1, 0, 0.5, !0],
            13: [1, 1, 0, 0, !0],
            8: [0.5, 1, 0, 0, !0],
            19: [1, 1, 0.5, 0, !0],
            30: [b, 1, 0, 0, !0],
            41: [c, 1, b, 0, !0],
            52: [1, 1, c, 0, !0],
            38: [1, c, 0, 1, !0],
            39: [1, b, 0, c, !0],
            40: [1, 0, 0, b, !0],
            36: [1, 0.5, 0, 1, !0],
            37: [1, 0, 0, 0.5, !0],
            35: [1, 0, 0, 1, !0],
            9: [1, 0, 0.5, 1, !0],
            20: [0.5, 0, 0, 1, !0],
            31: [1, 0, c, 1, !0],
            42: [c, 0, b, 1, !0],
            53: [b, 0, 0, 1, !0],
            12: [0, 0, 1, 0, !1],
            23: [1, 1, 0, 1, !1],
            34: [1, 0, 1, 1, !1],
            45: [0, 1, 0, 0, !1],
        };
        ig.CollisionMap.staticNoCollision = {
            trace: function (b, c, g, j) {
                return { collision: { x: !1, y: !1, slope: !1 }, pos: { x: b + g, y: c + j }, tile: { x: 0, y: 0 } };
            },
        };
    });
ig.baked = !0;
ig.module("impact.background-map")
    .requires("impact.map", "impact.image")
    .defines(function () {
        ig.BackgroundMap = ig.Map.extend({
            tiles: null,
            scroll: { x: 0, y: 0 },
            distance: 1,
            repeat: !1,
            tilesetName: "",
            foreground: !1,
            enabled: !0,
            preRender: !1,
            preRenderedChunks: null,
            chunkSize: 512,
            debugChunks: !1,
            anims: {},
            init: function (b, c, d) {
                this.parent(b, c);
                this.setTileset(d);
            },
            setTileset: function (b) {
                this.tilesetName = b instanceof ig.Image ? b.path : b;
                this.tiles = new ig.Image(this.tilesetName);
                this.preRenderedChunks = null;
            },
            setScreenPos: function (b, c) {
                this.scroll.x = b / this.distance;
                this.scroll.y = c / this.distance;
            },
            preRenderMapToChunks: function () {
                var b = this.width * this.tilesize * ig.system.scale,
                    c = this.height * this.tilesize * ig.system.scale;
                this.chunkSize = Math.min(Math.max(b, c), this.chunkSize);
                var d = Math.ceil(b / this.chunkSize),
                    f = Math.ceil(c / this.chunkSize);
                this.preRenderedChunks = [];
                for (var g = 0; g < f; g++) {
                    this.preRenderedChunks[g] = [];
                    for (var j = 0; j < d; j++) this.preRenderedChunks[g][j] = this.preRenderChunk(j, g, j == d - 1 ? b - j * this.chunkSize : this.chunkSize, g == f - 1 ? c - g * this.chunkSize : this.chunkSize);
                }
            },
            preRenderChunk: function (b, c, d, f) {
                var g = d / this.tilesize / ig.system.scale + 1,
                    j = f / this.tilesize / ig.system.scale + 1,
                    h = ((b * this.chunkSize) / ig.system.scale) % this.tilesize,
                    k = ((c * this.chunkSize) / ig.system.scale) % this.tilesize;
                b = Math.floor((b * this.chunkSize) / this.tilesize / ig.system.scale);
                c = Math.floor((c * this.chunkSize) / this.tilesize / ig.system.scale);
                var l = ig.$new("canvas");
                l.width = d;
                l.height = f;
                l.retinaResolutionEnabled = !1;
                f = l.getContext("2d");
                ig.System.scaleMode(l, f);
                d = ig.system.context;
                ig.system.context = f;
                for (f = 0; f < g; f++)
                    for (var m = 0; m < j; m++)
                        if (f + b < this.width && m + c < this.height) {
                            var n = this.data[m + c][f + b];
                            n && this.tiles.drawTile(f * this.tilesize - h, m * this.tilesize - k, n - 1, this.tilesize);
                        }
                ig.system.context = d;
                return l;
            },
            draw: function () {
                this.tiles.loaded && this.enabled && (this.preRender ? this.drawPreRendered() : this.drawTiled());
            },
            drawPreRendered: function () {
                this.preRenderedChunks || this.preRenderMapToChunks();
                var b = ig.system.getDrawPos(this.scroll.x),
                    c = ig.system.getDrawPos(this.scroll.y);
                if (this.repeat)
                    var d = this.width * this.tilesize * ig.system.scale,
                        b = ((b % d) + d) % d,
                        d = this.height * this.tilesize * ig.system.scale,
                        c = ((c % d) + d) % d;
                var d = Math.max(Math.floor(b / this.chunkSize), 0),
                    f = Math.max(Math.floor(c / this.chunkSize), 0),
                    g = Math.ceil((b + ig.system.realWidth) / this.chunkSize),
                    j = Math.ceil((c + ig.system.realHeight) / this.chunkSize),
                    h = this.preRenderedChunks[0].length,
                    k = this.preRenderedChunks.length;
                this.repeat || ((g = Math.min(g, h)), (j = Math.min(j, k)));
                for (var l = 0; f < j; f++) {
                    for (var m = 0, n = d; n < g; n++) {
                        var q = this.preRenderedChunks[f % k][n % h],
                            p = -b + n * this.chunkSize - m,
                            r = -c + f * this.chunkSize - l;
                        ig.system.context.drawImage(q, p, r);
                        ig.Image.drawCount++;
                        this.debugChunks && ((ig.system.context.strokeStyle = "#f0f"), ig.system.context.strokeRect(p, r, this.chunkSize, this.chunkSize));
                        this.repeat && q.width < this.chunkSize && p + q.width < ig.system.realWidth && ((m += this.chunkSize - q.width), g++);
                    }
                    this.repeat && q.height < this.chunkSize && r + q.height < ig.system.realHeight && ((l += this.chunkSize - q.height), j++);
                }
            },
            drawTiled: function () {
                for (
                    var b = 0,
                    c = null,
                    d = (this.scroll.x / this.tilesize).toInt(),
                    f = (this.scroll.y / this.tilesize).toInt(),
                    g = this.scroll.x % this.tilesize,
                    j = this.scroll.y % this.tilesize,
                    h = -g - this.tilesize,
                    g = ig.system.width + this.tilesize - g,
                    k = ig.system.height + this.tilesize - j,
                    l = -1,
                    j = -j - this.tilesize;
                    j < k;
                    l++, j += this.tilesize
                ) {
                    var m = l + f;
                    if (m >= this.height || 0 > m) {
                        if (!this.repeat) continue;
                        m = ((m % this.height) + this.height) % this.height;
                    }
                    for (var n = -1, q = h; q < g; n++, q += this.tilesize) {
                        b = n + d;
                        if (b >= this.width || 0 > b) {
                            if (!this.repeat) continue;
                            b = ((b % this.width) + this.width) % this.width;
                        }
                        if ((b = this.data[m][b])) (c = this.anims[b - 1]) ? c.draw(q, j) : this.tiles.drawTile(q, j, b - 1, this.tilesize);
                    }
                }
            },
        });
    });
ig.baked = !0;
ig.module("impact.game")
    .requires("impact.impact", "impact.entity", "impact.collision-map", "impact.background-map")
    .defines(function () {
        ig.Game = ig.Class.extend({
            clearColor: "#000000",
            gravity: 0,
            screen: { x: 0, y: 0 },
            _rscreen: { x: 0, y: 0 },
            entities: [],
            namedEntities: {},
            collisionMap: ig.CollisionMap.staticNoCollision,
            backgroundMaps: [],
            backgroundAnims: {},
            autoSort: !1,
            sortBy: null,
            cellSize: 64,
            _deferredKill: [],
            _levelToLoad: null,
            _doSortEntities: !1,
            staticInstantiate: function () {
                this.sortBy = this.sortBy || ig.Game.SORT.Z_INDEX;
                ig.game = this;
                return null;
            },
            loadLevel: function (b) {
                this.screen = { x: 0, y: 0 };
                this.entities = [];
                this.namedEntities = {};
                for (var c = 0; c < b.entities.length; c++) {
                    var d = b.entities[c];
                    this.spawnEntity(d.type, d.x, d.y, d.settings);
                }
                this.sortEntities();
                this.collisionMap = ig.CollisionMap.staticNoCollision;
                this.backgroundMaps = [];
                for (c = 0; c < b.layer.length; c++)
                    if (((d = b.layer[c]), "collision" == d.name)) this.collisionMap = new ig.CollisionMap(d.tilesize, d.data);
                    else {
                        var f = new ig.BackgroundMap(d.tilesize, d.data, d.tilesetName);
                        f.anims = this.backgroundAnims[d.tilesetName] || {};
                        f.repeat = d.repeat;
                        f.distance = d.distance;
                        f.foreground = !!d.foreground;
                        f.preRender = !!d.preRender;
                        f.name = d.name;
                        this.backgroundMaps.push(f);
                    }
                for (c = 0; c < this.entities.length; c++) this.entities[c].ready();
            },
            loadLevelDeferred: function (b) {
                this._levelToLoad = b;
            },
            getMapByName: function (b) {
                if ("collision" == b) return this.collisionMap;
                for (var c = 0; c < this.backgroundMaps.length; c++) if (this.backgroundMaps[c].name == b) return this.backgroundMaps[c];
                return null;
            },
            getEntityByName: function (b) {
                return this.namedEntities[b];
            },
            getEntitiesByType: function (b) {
                b = "string" === typeof b ? ig.global[b] : b;
                for (var c = [], d = 0; d < this.entities.length; d++) {
                    var f = this.entities[d];
                    f instanceof b && !f._killed && c.push(f);
                }
                return c;
            },
            spawnEntity: function (b, c, d, f) {
                var g = "string" === typeof b ? ig.global[b] : b;
                if (!g) throw "Can't spawn entity of type " + b;
                b = new g(c, d, f || {});
                this.entities.push(b);
                b.name && (this.namedEntities[b.name] = b);
                return b;
            },
            sortEntities: function () {
                this.entities.sort(this.sortBy);
            },
            sortEntitiesDeferred: function () {
                this._doSortEntities = !0;
            },
            removeEntity: function (b) {
                b.name && delete this.namedEntities[b.name];
                b._killed = !0;
                b.type = ig.Entity.TYPE.NONE;
                b.checkAgainst = ig.Entity.TYPE.NONE;
                b.collides = ig.Entity.COLLIDES.NEVER;
                this._deferredKill.push(b);
            },
            run: function () {
                this.update();
                this.draw();
            },
            update: function () {
                this._levelToLoad && (this.loadLevel(this._levelToLoad), (this._levelToLoad = null));
                this.updateEntities();
                this.checkEntities();
                for (var b = 0; b < this._deferredKill.length; b++) this._deferredKill[b].erase(), this.entities.erase(this._deferredKill[b]);
                this._deferredKill = [];
                if (this._doSortEntities || this.autoSort) this.sortEntities(), (this._doSortEntities = !1);
                for (var c in this.backgroundAnims) {
                    var b = this.backgroundAnims[c],
                        d;
                    for (d in b) b[d].update();
                }
            },
            updateEntities: function () {
                for (var b = 0; b < this.entities.length; b++) {
                    var c = this.entities[b];
                    c._killed || c.update();
                }
            },
            draw: function () {
                this.clearColor && ig.system.clear(this.clearColor);
                this._rscreen.x = ig.system.getDrawPos(this.screen.x) / ig.system.scale;
                this._rscreen.y = ig.system.getDrawPos(this.screen.y) / ig.system.scale;
                var b;
                for (b = 0; b < this.backgroundMaps.length; b++) {
                    var c = this.backgroundMaps[b];
                    if (c.foreground) break;
                    c.setScreenPos(this.screen.x, this.screen.y);
                    c.draw();
                }
                this.drawEntities();
                for (b; b < this.backgroundMaps.length; b++) (c = this.backgroundMaps[b]), c.setScreenPos(this.screen.x, this.screen.y), c.draw();
            },
            drawEntities: function () {
                for (var b = 0; b < this.entities.length; b++) this.entities[b].draw();
            },
            checkEntities: function () {
                for (var b = {}, c = 0; c < this.entities.length; c++) {
                    var d = this.entities[c];
                    if (!(d.type == ig.Entity.TYPE.NONE && d.checkAgainst == ig.Entity.TYPE.NONE && d.collides == ig.Entity.COLLIDES.NEVER))
                        for (
                            var f = {}, g = Math.floor(d.pos.y / this.cellSize), j = Math.floor((d.pos.x + d.size.x) / this.cellSize) + 1, h = Math.floor((d.pos.y + d.size.y) / this.cellSize) + 1, k = Math.floor(d.pos.x / this.cellSize);
                            k < j;
                            k++
                        )
                            for (var l = g; l < h; l++)
                                if (b[k])
                                    if (b[k][l]) {
                                        for (var m = b[k][l], n = 0; n < m.length; n++) d.touches(m[n]) && !f[m[n].id] && ((f[m[n].id] = !0), ig.Entity.checkPair(d, m[n]));
                                        m.push(d);
                                    } else b[k][l] = [d];
                                else (b[k] = {}), (b[k][l] = [d]);
                }
            },
        });
        ig.Game.SORT = {
            Z_INDEX: function (b, c) {
                return b.zIndex - c.zIndex;
            },
            POS_X: function (b, c) {
                return b.pos.x + b.size.x - (c.pos.x + c.size.x);
            },
            POS_Y: function (b, c) {
                return b.pos.y + b.size.y - (c.pos.y + c.size.y);
            },
        };
    });
ig.baked = !0;
ig.module("plugins.helper.director")
    .requires("impact.impact")
    .defines(function () {
        ig.Director = ig.Class.extend({
            init: function (b, c) {
                this.game = b;
                this.levels = [];
                this.currentLevel = 0;
                this.append(c);
            },
            loadLevel: function (b) {
                this.currentLevel = b;
                this.game.loadLevel(this.levels[b]);
                return !0;
            },
            append: function (b) {
                newLevels = [];
                return "object" === typeof b ? (b.constructor === [].constructor ? (newLevels = b) : (newLevels[0] = b), (this.levels = this.levels.concat(newLevels)), !0) : !1;
            },
            jumpTo: function (b) {
                var c = null;
                for (i = 0; i < this.levels.length; i++) this.levels[i] == b && (c = i);
                return 0 <= c ? this.loadLevel(c) : !1;
            },
        });
    });
ig.baked = !0;
ig.module("plugins.helper.tween")
    .requires("impact.entity")
    .defines(function () {
        Array.prototype.indexOf ||
            (Array.prototype.indexOf = function (b) {
                for (var c = 0; c < this.length; ++c) if (this[c] === b) return c;
                return -1;
            });
        ig.Entity.prototype.tweens = [];
        ig.Entity.prototype._preTweenUpdate = ig.Entity.prototype.update;
        ig.Entity.prototype.update = function () {
            this._preTweenUpdate();
            if (0 < this.tweens.length) {
                for (var b = [], c = 0; c < this.tweens.length; c++) this.tweens[c].update(), this.tweens[c].complete || b.push(this.tweens[c]);
                this.tweens = b;
            }
        };
        ig.Entity.prototype.tween = function (b, c, d) {
            b = new ig.Tween(this, b, c, d);
            this.tweens.push(b);
            return b;
        };
        ig.Entity.prototype.pauseTweens = function () {
            for (var b = 0; b < this.tweens.length; b++) this.tweens[b].pause();
        };
        ig.Entity.prototype.resumeTweens = function () {
            for (var b = 0; b < this.tweens.length; b++) this.tweens[b].resume();
        };
        ig.Entity.prototype.stopTweens = function (b) {
            for (var c = 0; c < this.tweens.length; c++) this.tweens[c].stop(b);
        };
        ig.Tween = function (b, c, d, f) {
            var g = {},
                j = {},
                h = {},
                k = 0,
                l = !1,
                m = !1,
                n = !1;
            this.duration = d;
            this.paused = this.complete = !1;
            this.easing = ig.Tween.Easing.Linear.EaseNone;
            this.onComplete = !1;
            this.loop = this.delay = 0;
            this.loopCount = -1;
            ig.merge(this, f);
            this.loopNum = this.loopCount;
            this.chain = function (b) {
                n = b;
            };
            this.initEnd = function (b, c, d) {
                if ("object" !== typeof c[b]) d[b] = c[b];
                else for (subprop in c[b]) d[b] || (d[b] = {}), this.initEnd(subprop, c[b], d[b]);
            };
            this.initStart = function (b, c, d, f) {
                if ("object" !== typeof d[b]) "undefined" !== typeof c[b] && (f[b] = d[b]);
                else for (subprop in d[b]) f[b] || (f[b] = {}), "undefined" !== typeof c[b] && this.initStart(subprop, c[b], d[b], f[b]);
            };
            this.start = function () {
                this.paused = this.complete = !1;
                this.loopNum = this.loopCount;
                k = 0;
                -1 == b.tweens.indexOf(this) && b.tweens.push(this);
                m = !0;
                l = new ig.Timer();
                for (var d in c) this.initEnd(d, c, j);
                for (d in j) this.initStart(d, j, b, g), this.initDelta(d, h, b, j);
            };
            this.initDelta = function (b, c, d, f) {
                if ("object" !== typeof f[b]) c[b] = f[b] - d[b];
                else for (subprop in f[b]) c[b] || (c[b] = {}), this.initDelta(subprop, c[b], d[b], f[b]);
            };
            this.propUpdate = function (b, c, d, f, g) {
                if ("object" !== typeof d[b]) c[b] = "undefined" != typeof d[b] ? d[b] + f[b] * g : c[b];
                else for (subprop in d[b]) this.propUpdate(subprop, c[b], d[b], f[b], g);
            };
            this.propSet = function (b, c, d) {
                if ("object" !== typeof c[b]) d[b] = c[b];
                else for (subprop in c[b]) d[b] || (d[b] = {}), this.propSet(subprop, c[b], d[b]);
            };
            this.update = function () {
                if (!m) return !1;
                if (this.delay) {
                    if (l.delta() < this.delay) return;
                    this.delay = 0;
                    l.reset();
                }
                if (this.paused || this.complete) return !1;
                var c = (l.delta() + k) / this.duration,
                    c = 1 < c ? 1 : c,
                    d = this.easing(c);
                for (property in h) this.propUpdate(property, b, g, h, d);
                if (1 <= c) {
                    if (0 == this.loopNum || !this.loop) {
                        this.complete = !0;
                        if (this.onComplete) this.onComplete();
                        n && n.start();
                        return !1;
                    }
                    if (this.loop == ig.Tween.Loop.Revert) {
                        for (property in g) this.propSet(property, g, b);
                        k = 0;
                        l.reset();
                        -1 != this.loopNum && this.loopNum--;
                    } else if (this.loop == ig.Tween.Loop.Reverse) {
                        c = {};
                        d = {};
                        ig.merge(c, j);
                        ig.merge(d, g);
                        ig.merge(g, c);
                        ig.merge(j, d);
                        for (property in j) this.initDelta(property, h, b, j);
                        k = 0;
                        l.reset();
                        -1 != this.loopNum && this.loopNum--;
                    }
                }
            };
            this.pause = function () {
                this.paused = !0;
                k += l.delta();
            };
            this.resume = function () {
                this.paused = !1;
                l.reset();
            };
            this.stop = function (b) {
                b && ((this.loop = this.complete = this.paused = !1), (k += d), this.update());
                this.complete = !0;
            };
        };
        ig.Tween.Loop = { Revert: 1, Reverse: 2 };
        ig.Tween.Easing = { Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {} };
        ig.Tween.Easing.Linear.EaseNone = function (b) {
            return b;
        };
        ig.Tween.Easing.Quadratic.EaseIn = function (b) {
            return b * b;
        };
        ig.Tween.Easing.Quadratic.EaseOut = function (b) {
            return -b * (b - 2);
        };
        ig.Tween.Easing.Quadratic.EaseInOut = function (b) {
            return 1 > (b *= 2) ? 0.5 * b * b : -0.5 * (--b * (b - 2) - 1);
        };
        ig.Tween.Easing.Cubic.EaseIn = function (b) {
            return b * b * b;
        };
        ig.Tween.Easing.Cubic.EaseOut = function (b) {
            return --b * b * b + 1;
        };
        ig.Tween.Easing.Cubic.EaseInOut = function (b) {
            return 1 > (b *= 2) ? 0.5 * b * b * b : 0.5 * ((b -= 2) * b * b + 2);
        };
        ig.Tween.Easing.Quartic.EaseIn = function (b) {
            return b * b * b * b;
        };
        ig.Tween.Easing.Quartic.EaseOut = function (b) {
            return -(--b * b * b * b - 1);
        };
        ig.Tween.Easing.Quartic.EaseInOut = function (b) {
            return 1 > (b *= 2) ? 0.5 * b * b * b * b : -0.5 * ((b -= 2) * b * b * b - 2);
        };
        ig.Tween.Easing.Quintic.EaseIn = function (b) {
            return b * b * b * b * b;
        };
        ig.Tween.Easing.Quintic.EaseOut = function (b) {
            return (b -= 1) * b * b * b * b + 1;
        };
        ig.Tween.Easing.Quintic.EaseInOut = function (b) {
            return 1 > (b *= 2) ? 0.5 * b * b * b * b * b : 0.5 * ((b -= 2) * b * b * b * b + 2);
        };
        ig.Tween.Easing.Sinusoidal.EaseIn = function (b) {
            return -Math.cos((b * Math.PI) / 2) + 1;
        };
        ig.Tween.Easing.Sinusoidal.EaseOut = function (b) {
            return Math.sin((b * Math.PI) / 2);
        };
        ig.Tween.Easing.Sinusoidal.EaseInOut = function (b) {
            return -0.5 * (Math.cos(Math.PI * b) - 1);
        };
        ig.Tween.Easing.Exponential.EaseIn = function (b) {
            return 0 == b ? 0 : Math.pow(2, 10 * (b - 1));
        };
        ig.Tween.Easing.Exponential.EaseOut = function (b) {
            return 1 == b ? 1 : -Math.pow(2, -10 * b) + 1;
        };
        ig.Tween.Easing.Exponential.EaseInOut = function (b) {
            return 0 == b ? 0 : 1 == b ? 1 : 1 > (b *= 2) ? 0.5 * Math.pow(2, 10 * (b - 1)) : 0.5 * (-Math.pow(2, -10 * (b - 1)) + 2);
        };
        ig.Tween.Easing.Circular.EaseIn = function (b) {
            return -(Math.sqrt(1 - b * b) - 1);
        };
        ig.Tween.Easing.Circular.EaseOut = function (b) {
            return Math.sqrt(1 - --b * b);
        };
        ig.Tween.Easing.Circular.EaseInOut = function (b) {
            return 1 > (b /= 0.5) ? -0.5 * (Math.sqrt(1 - b * b) - 1) : 0.5 * (Math.sqrt(1 - (b -= 2) * b) + 1);
        };
        ig.Tween.Easing.Elastic.EaseIn = function (b) {
            var c,
                d = 0.1,
                f = 0.4;
            if (0 == b) return 0;
            if (1 == b) return 1;
            f || (f = 0.3);
            !d || 1 > d ? ((d = 1), (c = f / 4)) : (c = (f / (2 * Math.PI)) * Math.asin(1 / d));
            return -(d * Math.pow(2, 10 * (b -= 1)) * Math.sin((2 * (b - c) * Math.PI) / f));
        };
        ig.Tween.Easing.Elastic.EaseOut = function (b) {
            var c,
                d = 0.1,
                f = 0.4;
            if (0 == b) return 0;
            if (1 == b) return 1;
            f || (f = 0.3);
            !d || 1 > d ? ((d = 1), (c = f / 4)) : (c = (f / (2 * Math.PI)) * Math.asin(1 / d));
            return d * Math.pow(2, -10 * b) * Math.sin((2 * (b - c) * Math.PI) / f) + 1;
        };
        ig.Tween.Easing.Elastic.EaseInOut = function (b) {
            var c,
                d = 0.1,
                f = 0.4;
            if (0 == b) return 0;
            if (1 == b) return 1;
            f || (f = 0.3);
            !d || 1 > d ? ((d = 1), (c = f / 4)) : (c = (f / (2 * Math.PI)) * Math.asin(1 / d));
            return 1 > (b *= 2) ? -0.5 * d * Math.pow(2, 10 * (b -= 1)) * Math.sin((2 * (b - c) * Math.PI) / f) : 0.5 * d * Math.pow(2, -10 * (b -= 1)) * Math.sin((2 * (b - c) * Math.PI) / f) + 1;
        };
        ig.Tween.Easing.Back.EaseIn = function (b) {
            return b * b * (2.70158 * b - 1.70158);
        };
        ig.Tween.Easing.Back.EaseOut = function (b) {
            return (b -= 1) * b * (2.70158 * b + 1.70158) + 1;
        };
        ig.Tween.Easing.Back.EaseInOut = function (b) {
            return 1 > (b *= 2) ? 0.5 * b * b * (3.5949095 * b - 2.5949095) : 0.5 * ((b -= 2) * b * (3.5949095 * b + 2.5949095) + 2);
        };
        ig.Tween.Easing.Bounce.EaseIn = function (b) {
            return 1 - ig.Tween.Easing.Bounce.EaseOut(1 - b);
        };
        ig.Tween.Easing.Bounce.EaseOut = function (b) {
            return (b /= 1) < 1 / 2.75 ? 7.5625 * b * b : b < 2 / 2.75 ? 7.5625 * (b -= 1.5 / 2.75) * b + 0.75 : b < 2.5 / 2.75 ? 7.5625 * (b -= 2.25 / 2.75) * b + 0.9375 : 7.5625 * (b -= 2.625 / 2.75) * b + 0.984375;
        };
        ig.Tween.Easing.Bounce.EaseInOut = function (b) {
            return 0.5 > b ? 0.5 * ig.Tween.Easing.Bounce.EaseIn(2 * b) : 0.5 * ig.Tween.Easing.Bounce.EaseOut(2 * b - 1) + 0.5;
        };
    });
ig.baked = !0;
ig.module("plugins.helper.splash-loader")
    .requires("impact.loader", "impact.animation")
    .defines(function () {
        ig.SplashLoader = ig.Loader.extend({
            _drawStatus: 0,
            status: 0,
            endTime: { MRAID: 250, NON_MRAID: 250 },
            endThreshold: 0.999,
            isEnded: !1,
            logo: new ig.Image(imagePath.logo),
            init: function (b, c) {
                console.log("inside splash loader");
                this.parent(b, c);
            },
            end: function () {
                if (!this.isEnded) {
                    if ("on" === MJS.settings.data.preloader) {
                        if (this._drawStatus >= this.endThreshold) {
                            this._drawStatus = 1;
                            var b = window.mraid ? this.endTime.MRAID : this.endTime.NON_MRAID;
                            0 < b
                                ? window.setTimeout(
                                    function () {
                                        this.endTime.MRAID = 0;
                                        this.endTime.NON_MRAID = 0;
                                    }.bind(this),
                                    b
                                )
                                : (this.isEnded = !0);
                        }
                    } else this.isEnded = !0;
                    !0 === this.isEnded && this.parent();
                }
            },
            updateStatus: function () {
                this._drawStatus += (this.status - this._drawStatus) / 12;
                this._drawStatus >= this.endThreshold && this.end();
            },
            readyOnce: !1,
            preloadUseCustomClose: function () {
                if (null !== typeof mraid && "undefined" !== typeof mraid && window.MJS.settings.getBool("disableCustomClose"))
                    if ("loading" === mraid.getState()) this.readyOnce || (mraid.addEventListener("ready", this.preloadUseCustomClose), mraid.addEventListener("ready", window.MJS.view.orientationHandler()), (this.readyOnce = !0));
                    else
                        try {
                            mraid.useCustomClose(!0);
                        } catch (b) {
                            console.log("Mraid missing");
                        }
            },
            draw: function () {
                window.MJS.view.orientationHandler();
                this.preloadUseCustomClose();
                this.drawBackground();
                this.updateStatus();
                this.drawLogo();
                this.drawLoadingBar();
            },
            drawBackground: function () {
                var b = ig.system.context;
                b.fillStyle = "#010303";
                b.fillRect(0, 0, ig.system.width, ig.system.height);
            },
            drawConnectingInfo: function () {
                var b = ig.system.context,
                    c = 0.5 * ig.system.width;
                b.fillStyle = "#FFFFFF";
                b.textAlign = "center";
                b.textBaseline = "top";
                b.font = "12px arial";
                b.fillText("Connecting to Game Server...", c, 0);
            },
            drawLogo: function () {
                var b = ig.system.context;
                b.save();
                b.translate(0.5 * ig.system.width, 0.5 * ig.system.height - 50);
                b.drawImage(this.logo.data, 0, 0, this.logo.width, this.logo.height, -0.5 * this.logo.width * 0.5, -0.5 * this.logo.height * 0.5, this.logo.width * 0.5, this.logo.height * 0.5);
                b.restore();
            },
            drawLoadingBar: function () {
                var b = ig.system.context,
                    c = 0.1 * ig.system.width,
                    d = 0.85 * ig.system.height,
                    f = 0.8 * ig.system.width,
                    g = 0.01 * ig.system.height;
                b.save();
                b.fillStyle = "#ffffff";
                b.fillRect(c, d, f, g);
                b.fillStyle = "#82bd48";
                b.fillRect(c, d, f * this._drawStatus, g);
                b.strokeStyle = "#666666";
                b.lineWidth = 3;
                b.strokeRect(c, d, f, g);
                b.restore();
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.vfx.vfx")
    .requires("impact.entity")
    .defines(function () {
        VFX = ig.Entity.extend({
            duration: -1,
            arrayContainer: null,
            visible: !0,
            target: null,
            moveable: !0,
            init: function (b, c, d) {
                this.parent(b, c, d);
                this.duration = d.duration;
                this.arrayContainer = d.arrayContainer;
                this.target = d.target;
            },
            activated: !1,
            update: function () {
                this.parent();
                this.target && ((this.activated = !0), (this.pos.x = this.target.pos.x), (this.pos.y = this.target.pos.y - 75));
                this.activated && this.target._killed && (this.duration = 0);
                0 < this.duration && this.duration--;
                if (0 == this.duration && (this.kill(), this.arrayContainer)) {
                    var b = this.arrayContainer.indexOf(this);
                    this.arrayContainer.splice(b, 1);
                }
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.vfx.spark-object")
    .requires("impact.entity", "game.entities.vfx.vfx")
    .defines(function () {
        SparkObject = VFX.extend({
            animation: null,
            radianDirection: 0,
            distanceCounter: 0,
            distanceFactor: 2,
            alphaCounter: 1,
            alphaFactor: 0.03,
            scaleCounter: 0,
            scaleFactor: 0.006,
            posX: 0,
            posY: 0,
            movement: "",
            speedUp: 5,
            init: function (b, c, d) {
                this.parent(b, c, d);
                d.movement && (this.movement = d.movement);
                this.radianDirection = (360 * Math.random() * Math.PI) / 180;
                switch (this.movement) {
                    case SPARK_SPARK:
                        this.alphaCounter = 1;
                        this.alphaFactor = 0.03;
                        this.scaleCounter = 0;
                        this.scaleFactor = 0.006;
                        this.distanceFactor = 2;
                        break;
                    case SPARK_UP:
                        (this.alphaCounter = 1), (this.alphaFactor = 0.02 * Math.random() + 0.02), (this.scaleCounter = 0.2), (this.scaleFactor = 0.02 * Math.random() + 0.02), (this.distanceFactor = 3), (this.posY = -100 * Math.random());
                }
            },
            update: function () {
                this.movement == SPARK_UP
                    ? (this.posY -= Math.random() * this.distanceFactor + this.distanceFactor)
                    : ((this.distanceCounter += this.distanceFactor), (this.posX = this.distanceCounter * Math.cos(this.radianDirection)), (this.posY = this.distanceCounter));
                this.alphaCounter -= this.alphaFactor;
                this.scaleCounter += this.scaleFactor;
                0 >= this.alphaCounter && this.kill();
            },
            draw: function () {
            },
        });
    });
var SPARK_SPARK = "spark-spark",
    SPARK_UP = "spark-up";
ig.baked = !0;
ig.module("game.entities.vfx.spark")
    .requires("impact.entity", "game.entities.vfx.vfx", "game.entities.vfx.spark-object")
    .defines(function () {
        Spark = VFX.extend({
            zIndex: 1e3,
            sparkCounter: 3,
            sparkMax: 5,
            movement: "",
            init: function (b, c, d) {
                this.parent(b, c, d);
                d.movement && (this.movement = d.movement);
                d.sparkMax && (this.sparkCounter = this.sparkMax = d.sparkMax);
            },
            update: function () {
                this.visible &&
                    (this.parent(),
                        0 < this.sparkCounter && this.sparkCounter--,
                        0 == this.sparkCounter &&
                        ((this.sparkCounter = this.sparkMax), ig.game.spawnEntity(SparkObject, this.pos.x + 100 * Math.random() - 50, this.pos.y, { zIndex: this.zIndex, movement: this.movement }), ig.game.sortEntitiesDeferred()));
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.ui.clickable-div-layer")
    .requires("impact.entity")
    .defines(function () {
        EntityClickableDivLayer = ig.Entity.extend({
            zIndex: 8888,
            type: ig.Entity.TYPE.B,
            pos: { x: 0, y: 0 },
            size: { x: 0, y: 0 },
            lastSize: { x: 0, y: 0 },
            div_layer_name: "install-now",
            onClickFunction: null,
            ignorePause: !0,
            cssZIndex: 3,
            init: function (b, c, d) {
                this.parent(b, c, d);
                this.createClickableLayer();
            },
            createClickableLayer: function () {
                this.elem = document.getElementById(this.div_layer_name);
                (!this.elem || "undefined" === typeof this.elem) && this.createClickableOutboundLayer();
                this.setupEvent();
                this.updateCSS();
                this.show();
            },
            idle: function () {
                ig.game.pointer.hoveringItem === this && (ig.game.pointer.hoveringItem = !1);
                ig.game.pointer.firstClick === this && (ig.game.pointer.firstClick = !1);
                this.isClicking = !1;
            },
            clicking: function () {
                return this.idle();
            },
            clicked: function () {
                return this.idle();
            },
            released: function () {
                this.onClickFunction();
                return this.idle();
            },
            createClickableOutboundLayer: function () {
                this.elem = ig.$new("div");
                this.elem.setAttribute("id", this.div_layer_name);
                document.getElementById("gamebox").appendChild(this.elem);
            },
            kill: function () {
                this.parent();
                document.getElementById("gamebox").removeChild(this.elem);
            },
            setupEvent: function () {
                this.elem.onclick = this.onClickFunction.bind(this);
                this.elem.onmousemove = ig.input.mousemove.bind(ig.input);
                ig.ua.touchDevice && ((this.elem.ontouchmove = ig.input.mousemove.bind(ig.input)), (this.elem.onmspointermove = ig.input.mousemove.bind(ig.input)), (this.elem.style.msTouchAction = "none"));
            },
            show: function () {
                this.elem && (this.elem.style.visibility = "visible");
            },
            hide: function () {
                this.elem && (this.elem.style.visibility = "hidden");
            },
            updateCSS: function () {
                if (this.elem) {
                    var b = this.pos.x * MJS.view.viewport.widthRatio - parseFloat(ig.system.canvas.offsetLeft) + "px",
                        c = this.pos.y * MJS.view.viewport.heightRatio - parseFloat(ig.system.canvas.offsetTop) + "px";
                    this.elem.setAttribute(
                        "style",
                        "float: left;position: absolute;left: " +
                        b +
                        ";top: " +
                        c +
                        ";width: " +
                        (this.size.x * MJS.view.viewport.widthRatio + "px") +
                        ";height: " +
                        (this.size.y * MJS.view.viewport.heightRatio + "px") +
                        ";z-index: " +
                        this.cssZIndex +
                        "; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;"
                    );
                }
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.ui.banner")
    .requires("impact.entity", "game.entities.ui.clickable-div-layer")
    .defines(function () {
        EntityBanner = ig.Entity.extend({
            zIndex: 99999,
            type: ig.Entity.TYPE.B,
            gravityFactor: 0,
            scale: { x: 1, y: 1 },
            alpha: 1,
            anchor: { x: 0.5, y: 0.5 },
            locked: !1,
            showText: !1,
            ignorePause: !0,
            text: "",
            displayText: "",
            size: { x: 480, y: 66 },
            init: function (b, c, d) {
                this.parent(b, c, d);
                ig.global.wm || (this.reset(b, c, d), this.createClickableDivLayer(), this.spawnButton());
            },
            createClickableDivLayer: function () {
                this.clickableDiv = ig.game.spawnEntity(EntityClickableDivLayer, 0, 0, { cssZIndex: 99, size: { x: ig.system.width, y: this.size.y }, div_layer_name: "install-now-banner", onClickFunction: this.released.bind(this) });
            },
            getDisplayText: function () {
                return (this.displayText = localisedStrings[this.text][igh.settings.language]);
            },
            changeText: function (b) {
                b in localisedStrings ? ((this.text = b), this.getDisplayText(), (this.showText = !0)) : ((this.displayText = this.text = ""), (this.showText = !1));
            },
            spawnButton: function () { },
            kill: function () {
                this.clickableDiv && this.clickableDiv.kill();
                this.buttonInstallNow && this.buttonInstallNow.kill();
                this.parent();
            },
            reset: function () {
                this.setupEvent();
                this.updateOnOrientationChange();
                var b = MJS.settings.get("installBanner", "textID"),
                    b = MJS.settings.get("installBanner", "text")[b] || "";
                this.changeText(b);
            },
            setupEvent: function () {
                this.clickableDiv &&
                    ((this.clickableDiv.onclick = this.released.bind(this)),
                        this.clickableDiv.addEventListener(
                            "mousemove",
                            function () {
                                ig.input.mousemove.bind(ig.input);
                            }.bind(this),
                            !1
                        ),
                        ig.ua.touchDevice &&
                        (this.clickableDiv.addEventListener(
                            "touchmove",
                            function () {
                                ig.input.mousemove.bind(ig.input);
                            }.bind(this),
                            !1
                        ),
                            this.clickableDiv.addEventListener(
                                "MSPointerMove",
                                function () {
                                    ig.input.mousemove.bind(ig.input);
                                }.bind(this),
                                !1
                            ),
                            (this.clickableDiv.style.msTouchAction = "none")));
            },
            hide: function () {
                this.div && (this.div.style.visibility = "hidden");
                this.visible = !1;
            },
            show: function () {
                this.div && (this.div.style.visibility = "visible");
                this.visible = !0;
            },
            updateOnSizeChange: function () {
                this.clickableDiv && ((this.clickableDiv.pos = { x: this.pos.x, y: this.pos.y }), (this.clickableDiv.size = { x: this.size.x, y: this.size.y }), this.clickableDiv.updateCSS());
            },
            updateOnOrientationChange: function () {
                this.pos.x = this.pos.x;
                this.pos.y = this.pos.y;
                this.size.x = ig.system.width;
                this.size.y = this.size.y;
                ("on" === MJS.settings.data.bannerTogglePortrait && MJS.view.viewport.orientation.portrait) || ("on" === MJS.settings.data.bannerToggleLandscape && MJS.view.viewport.orientation.landscape) ? this.show() : this.hide();
                this.updateOnSizeChange();
            },
            released: function () {
                this.visible && ("on" === igh.settings.bannerClickableOnShow ? PlayableSdk.openClickUrl("toolbar") : this.buttonInstallNow && !0 === this.buttonInstallNow.visible && PlayableSdk.openClickUrl("toolbar"));
                this.isClicking = !1;
            },
            getOptimumFontSize: function (b, c, d, f) {
                c = c || 21;
                var g = ig.system.context,
                    j = g.measureText(f);
                g.font = c + "px " + d;
                j = g.measureText(f);
                if (6 < c && (j.width > b.w || c > b.h)) return this.getOptimumFontSize(b, c - 0.25, d, f);
                6 > c && (c = 6);
                return c;
            },
            draw: function () {
                this.parent();
                if (
                    !ig.global.wm &&
                    (this.visible && ((ig.system.context.fillStyle = igh.settings.installBanner.boxFillColor), ig.system.context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y)), this.showText && this.getDisplayText())
                ) {
                    var b = this.getDisplayText(),
                        c = igh.settings.installBanner.fontSize,
                        c = this.getOptimumFontSize({ w: 0.725 * this.size.x, h: 0.9 * this.size.y }, c, igh.settings.installBanner.fontFamily, b);
                    ig.system.context.font = c + "px " + igh.settings.installBanner.fontFamily;
                    ig.system.context.fillStyle = igh.settings.installBanner.textFillColor;
                    ig.system.context.textAlign = "center";
                    ig.system.context.textBaseline = "middle";
                    ig.system.context.fillText(b, this.pos.x + 0.5 * this.size.x, this.pos.y + 0.5 * this.size.y);
                }
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.ui.finger")
    .requires("impact.entity")
    .defines(function () {
        EntityFinger = ig.Entity.extend({
            zIndex: 5e3,
            finger: { spriteSheet: "gameScreen", spriteID: "tutorial-hand.png" },
            target: null,
            scale: { x: 1, y: 1 },
            alpha: 0,
            angle: 0,
            init: function (b, c, d) {
                this.parent(b, c, d);
                this.reset();
                this.startTween();
                ig.game.sortEntitiesDeferred();
            },
            reset: function () {
                var b = spriteSheets[this.finger.spriteSheet].frames[this.finger.spriteID].frame;
                this.size = { x: this.scale.x * b.w, y: this.scale.y * b.h };
                this._POS = { x: this.pos.x, y: this.pos.y };
            },
            updateOnOrientationChange: function () {
                this.stopTween();
                this.alpha = 0.01;
                this.target && ((this._POS = { x: this.target._POS.x, y: this.target._POS.y }), (this.pos.x = this._POS.x), (this.pos.y = this._POS.y), this.startTween());
            },
            stopTween: function () {
                if (this.tweens && this.tweens.length) for (var b = 0; b < this.tweens.length; b++) this.tweens[b] && this.tweens[b].stop();
            },
            startTween: function () {
                var b = this.tween({ pos: { x: this._POS.x, y: this._POS.y }, alpha: 1 }, 0.01, { delay: 0.5 }),
                    c = this.tween({ pos: { x: this._POS.x, y: this._POS.y } }, 0.3),
                    d = this.tween({ pos: { x: this._POS.x, y: this._POS.y - 9 } }, 0.25),
                    f = this.tween({ pos: { x: this._POS.x, y: this._POS.y } }, 0.125),
                    g = this.tween({ alpha: 0.01 }, 0.25),
                    j = this.tween({}, 0.25),
                    h = this.tween({}, 0.25),
                    k = this.tween({}, 0.75);
                b.chain(j);
                j.chain(c);
                c.chain(d);
                d.chain(f);
                f.chain(h);
                h.chain(g);
                g.chain(k);
                k.chain(b);
                b.start();
            },
            update: function () {
                this.parent();
            },
            draw: function () {
                this.parent();
                this.drawFinger();
            },
            drawFinger: function () {
                var b = ig.system.context;
                this.finger &&
                    this.finger.spriteImage &&
                    this.finger.spriteSheet &&
                    this.finger.spriteID &&
                    igh.drawSprite(b, this.finger.spriteImage, this.finger.spriteSheet, this.finger.spriteID, this.pos.x, this.pos.y, { pivot: { x: 0.02, y: 0.15 }, flip: { x: !0 } });
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.ui.hud")
    .requires("impact.entity")
    .defines(function () {
        EntityHud = ig.Entity.extend({
            zIndex: 1e3,
            gravityFactor: 0,
            appNameLogo: { spriteSheet: "app-name-logo", spriteID: "gow-logo-flat.png" },
            init: function (b, c, d) {
                this.parent(b, c, d);
                ig.global.wm || this.reset(b, c, d);
            },
            update: function () {
                this.parent();
            },
            draw: function () {
                this.parent();
                ig.global.wm || this.drawAppNameLogo();
            },
            drawAppNameLogo: function () {
                "on" == MJS.settings.data.gamePlayLogo &&
                    igh.drawSprite(ig.system.context, this.appNameLogo.spriteImage, this.appNameLogo.spriteSheet, this.appNameLogo.spriteID, MJS.settings.data.gamePlayLogoConfig.pos.x, MJS.settings.data.gamePlayLogoConfig.pos.y, {
                        scale: { x: MJS.settings.data.gamePlayLogoConfig.scale, y: MJS.settings.data.gamePlayLogoConfig.scale },
                    });
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.ui.pointer")
    .requires("impact.entity")
    .defines(function () {
        EntityPointer = ig.Entity.extend({
            zIndex: 16777216,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            isFirstPressed: !1,
            isPressed: !1,
            isReleased: !1,
            isHovering: !1,
            hoveringItem: null,
            objectArray: [],
            clickedObjectList: [],
            clickCount: 0,
            ignorePause: !0,
            init: function (b, c, d) {
                if (!ig.global.wm) {
                    for (; ig.game.getEntitiesByType(EntityPointer).length;) ig.game.getEntitiesByType(EntityPointer)[0].kill();
                    this.parent(b, c, d);
                    ig.game.pointer = this;
                    this.control = ig.game.getEntitiesByType(EntityGameControl)[0];
                    this.size = { x: 1, y: 1 };
                }
            },
            updateOnOrientationChange: function () {
                ig.input.delayedKeyup.click = !0;
                ig.input.clearPressed();
                this.update();
                clickedObjectList = [];
                this.isPressed = this.isFirstPressed = !1;
            },
            check: function (b) {
                this.objectArray.push(b);
            },
            clickObject: function (b) {
                this.isFirstPressed && "function" == typeof b.clicked && (b.clicked(), this.addToClickedObjectList(b), (this.firstClick = b));
                this.isPressed && !this.isReleased && "function" == typeof b.clicking && b.clicking();
                this.isReleased && "function" == typeof b.released && (b.released(), this.removeFromClickedObjectList(b), (this.firstClick = null));
            },
            getTransformedCoords: function (b) {
                if (MJS.view.viewport.forceOrientation && window.mraid && window.mraid.getVersion() && 2 <= parseFloat(window.mraid.getVersion(), 10))
                    return (
                        (MJS.view.viewport.orientation.degree = 0),
                        { x: ig.input.mouse.x / MJS.view.viewport.widthRatio - this.size.x / 2 + ig.game.screen.x, y: ig.input.mouse.y / MJS.view.viewport.heightRatio - this.size.y / 2 + ig.game.screen.y }
                    );
                var c = 0.5 * ig.system.width,
                    d = 0.5 * ig.system.height,
                    f = -d + b.x / MJS.view.viewport.heightRatio + ig.game.screen.x;
                b = -c + b.y / MJS.view.viewport.widthRatio + ig.game.screen.y;
                var g = MJS.view.viewport.orientation.degree.toRad(),
                    j = Math.cos(-1 * g),
                    g = Math.sin(-1 * g);
                return { x: f * j - b * g + c - 0.5 * this.size.x, y: f * g + b * j + d - 0.5 * this.size.y };
            },
            updatePosition: function () {
                90 === Math.abs(MJS.view.viewport.orientation.degree)
                    ? (this.pos = this.getTransformedCoords(ig.input.mouse))
                    : ((this.pos.x = ig.input.mouse.x / MJS.view.viewport.widthRatio - this.size.x / 2 + ig.game.screen.x), (this.pos.y = ig.input.mouse.y / MJS.view.viewport.heightRatio - this.size.y / 2 + ig.game.screen.y));
            },
            update: function () {
                this.updatePosition();
                this.parent();
                var b = null,
                    c = -1;
                for (a = this.objectArray.length - 1; -1 < a; a--) this.objectArray[a].zIndex > c && ((c = this.objectArray[a].zIndex), (b = this.objectArray[a]));
                if (null != b)
                    null != this.hoveringItem ? this.hoveringItem != b && ("function" == typeof this.hoveringItem.leave && this.hoveringItem.leave(), "function" == typeof b.over && b.over()) : "function" == typeof b.over && b.over(),
                        (this.hoveringItem = b),
                        this.clickObject(b),
                        (this.objectArray = []);
                else if ((null != this.hoveringItem && "function" == typeof this.hoveringItem.leave && (this.hoveringItem.leave(), (this.hoveringItem = null)), this.isReleased)) {
                    for (b = 0; b < this.clickedObjectList.length; b++) (c = this.clickedObjectList[b]), "function" == typeof c.releasedOutside && c.releasedOutside();
                    this.clickedObjectList = [];
                }
                this.isFirstPressed = ig.input.pressed("click");
                this.isReleased = ig.input.released("click");
                this.isPressed = ig.input.state("click");
                this.isFirstPressed && (this.clickCount || (this.clickCount = 0), this.clickCount++);
            },
            addToClickedObjectList: function (b) {
                this.clickedObjectList.push(b);
            },
            removeFromClickedObjectList: function (b) {
                for (var c = [], d = 0; d < this.clickedObjectList.length; d++) {
                    var f = this.clickedObjectList[d];
                    f != b && c.push(f);
                }
                this.clickedObjectList = c;
            },
        });
    });

var itemLength,
    dist = [],
    distRepos = [],
    itemDist,
    minDistItem = 0,
    count = 0;

ig.baked = !0;
ig.module("game.entities.buttons.button")
    .requires("impact.entity")
    .defines(function () {
        EntityButton = ig.Entity.extend({
            zIndex: 2500,
            type: ig.Entity.TYPE.B,
            gravityFactor: 0,
            alpha: 1,
            offset: { x: 0, y: 0 },
            scale: { x: 1, y: 1 },
            anchor: { x: 0, y: 0 },
            spriteSheet: "gameScreen",
            spriteID: "button-black",
            init: function (b, c, d) {
                this.parent(b, c, d);
                ig.global.wm || (this.reset(), this.updateEntityBox(), ig.game.sortEntitiesDeferred());
            },
            updateOnOrientationChange: function () {
                this._POS = { x: this.pos.x, y: this.pos.y };
                this._SIZE = { x: this.size.x, y: this.size.y };
            },
            reset: function () {
                ig.global.wm || this.updateOnOrientationChange();
            },
            updateEntityBox: function () {
                this.size.x = this.scale.x * this._SIZE.x;
                this.size.y = this.scale.y * this._SIZE.y;
                this.pos.x = this._POS.x - this.anchor.x * this.size.x;
                this.pos.y = this._POS.y - this.anchor.y * this.size.y;
            },
            clicked: function () { },
            clicking: function () { },
            released: function () { },
            releasedOutside: function () { },
            leave: function () { },
            over: function () { },
            update: function () {
                this.parent();
                ig.global.wm || this.updateEntityBox();
            },
            draw: function () {
                this.parent();
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.buttons.button-card")
    .requires("impact.entity", "game.entities.buttons.button")
    .defines(function () {
        ButtonCard = EntityButton.extend({
            image: null,
            cbClicked: null,
            cbReleased: null,
            cbReleasedOutside: null,
            index: 0,
            control: null,
            visible: !0,
            shake: !1,
            zIndex: 10,
            scaleFactor: 1,
            hitBox: !1,
            adjustY: 0,
            isAnimating: !1,
            init: function (b, c, d) {
                this.parent(b, c, d);
                d.image && ((this.image = d.image), (this.size.x = this.image.width), (this.size.y = this.image.height));
                d.index && (this.index = d.index);
                d.control && (this.control = d.control);
                d.cbClicked && (this.cbClicked = d.cbClicked);
                d.cbReleased && (this.cbReleased = d.cbReleased);
                d.cbReleasedOutside && (this.cbReleasedOutside = d.cbReleasedOutside);
                this.scaleFactor = 0;
                this.updateOnOrientationChange();
            },
            clicked: function () {
                //console.log("click");
                this.visible && ((this.scaleFactor = 0.1), this.cbClicked && this.cbClicked(this.index));
            },
            released: function () {
                //console.log("RELEASE ME 2");
                this.visible && this.cbReleased && this.cbReleased(this.index);
            },
            releasedOutside: function () {
                //console.log("released outside");
                this.visible && this.cbReleasedOutside && this.cbReleasedOutside(this.index);
            },
            factorY: 1,
            factorMax: 10,
            update: function () {
                //console.log("UPDATE?");
                this.visible &&
                    (this.parent(),
                        (this.scaleFactor = 0 < this.scaleFactor ? this.scaleFactor - 0.01 : 0),
                        this.isAnimating &&
                        ((this.adjustY += this.factorY),
                            this.adjustY > this.factorMax
                                ? ((this.adjustY = this.factorMax), (this.factorY = -1 * Math.abs(this.factorY)), (this.adjustY += this.factorY))
                                : 0 > this.adjustY && ((this.adjustY = 0), (this.factorY = Math.abs(this.factorY)), (this.adjustY += this.factorY))));
            },
            draw: function () {
                this.visible && (this.parent(), this.drawHitBox(), this.drawImage());
            },
            drawHitBox: function () {
                if (this.hitBox) {
                    var b = ig.system.context;
                    b.save();
                    b.globalAlpha = 0.5;
                    b.translate(this.pos.x, this.pos.y);
                    b.fillRect(0, 0, this.image.width * this.scale.x, this.image.height * this.scale.y - this.adjustY);
                    b.restore();
                }
            },
            drawImage: function () {
                var b = ig.system.context;
                b.save();
                b.translate(this.pos.x + 0.5 * this.image.width * this.scale.x, this.pos.y + 0.5 * this.image.height * this.scale.y - this.adjustY);
                b.scale(this.scale.x * 1.05 - this.scaleFactor, this.scale.y * 0.90 - this.scaleFactor);
                this.image && this.image.draw(-0.5 * this.image.width, -0.5 * this.image.height);
                b.restore();
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.buttons.button-card2")
    .requires("impact.entity", "game.entities.buttons.button")
    .defines(function () {
        ButtonCard2 = EntityButton.extend({
            image: null,
            cbClicked: null,
            cbReleased: null,
            cbReleasedOutside: null,
            index: 0,
            control: null,
            visible: !0,
            shake: !1,
            zIndex: 1,
            scaleFactor: 0.65,
            hitBox: !1,
            adjustY: 0,
            isAnimating: !1,
            init: function (b, c, d) {
                this.parent(b, c, d);
                d.image && ((this.image = d.image), (this.size.x = this.image.width), (this.size.y = this.image.height));
                d.index && (this.index = d.index);
                d.control && (this.control = d.control);
                d.cbClicked && (this.cbClicked = d.cbClicked);
                d.cbReleased && (this.cbReleased = d.cbReleased);
                d.cbReleasedOutside && (this.cbReleasedOutside = d.cbReleasedOutside);
                this.scaleFactor = 0;
                this.updateOnOrientationChange();
            },
            clicked: function () {
                this.visible && ((this.scaleFactor = 0.1), this.cbClicked && this.cbClicked(this.index));
            },
            released: function () {
                this.visible && this.cbReleased && this.cbReleased(this.index);
            },
            releasedOutside: function () {
                this.visible && this.cbReleasedOutside && this.cbReleasedOutside(this.index);
            },
            factorY: 1,
            factorMax: 10,
            update: function () {
                this.visible &&
                    (this.parent(),
                        (this.scaleFactor = 0 < this.scaleFactor ? this.scaleFactor - 0.01 : 0),
                        this.isAnimating &&
                        ((this.adjustY += this.factorY),
                            this.adjustY > this.factorMax
                                ? ((this.adjustY = this.factorMax), (this.factorY = -1 * Math.abs(this.factorY)), (this.adjustY += this.factorY))
                                : 0 > this.adjustY && ((this.adjustY = 0), (this.factorY = Math.abs(this.factorY)), (this.adjustY += this.factorY))));
            },
            draw: function () {
                this.visible && (this.parent(), this.drawHitBox(), this.drawImage());
            },
            drawHitBox: function () {
                if (this.hitBox) {
                    var b = ig.system.context;
                    b.save();
                    b.globalAlpha = 0.5;
                    b.translate(this.pos.x, this.pos.y);
                    b.fillRect(0, 0, this.image.width * this.scale.x, this.image.height * this.scale.y - this.adjustY);
                    b.restore();
                }
            },
            drawImage: function () {
                var b = ig.system.context;
                b.save();
                b.translate(this.pos.x + 0.5 * this.image.width * this.scale.x, this.pos.y + 0.5 * this.image.height * this.scale.y - this.adjustY);
                b.scale(this.scale.x * 0.75 - this.scaleFactor, this.scale.y * 0.75 - this.scaleFactor);
                this.image && this.image.draw(-0.5 * this.image.width, -0.5 * this.image.height);
                b.restore();
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.buttons.button-monster")
    .requires("impact.entity", "game.entities.buttons.button")
    .defines(function () {
        ButtonMonster = EntityButton.extend({
            imageReal: null,
            image: null,
            cbClicked: null,
            cbReleased: null,
            cbReleasedOutside: null,
            index: 0,
            control: null,
            visible: !1,
            shake: !1,
            zIndex: 3e3,
            hitBox: !1,
            init: function (b, c, d) {
                this.parent(b, c, d);
                d.image && ((this.image = d.image), (this.size.x = this.image.width), (this.size.y = this.image.height));
                d.imageReal && (this.imageReal = d.imageReal);
                d.index && (this.index = d.index);
                d.control && (this.control = d.control);
                d.cbClicked && (this.cbClicked = d.cbClicked);
                d.cbReleased && (this.cbReleased = d.cbReleased);
                d.cbReleasedOutside && (this.cbReleasedOutside = d.cbReleasedOutside);
                this.updateOnOrientationChange();
            },
            clicked: function () {
                this.cbClicked && this.cbClicked(this.index);
            },
            released: function () {
                this.cbReleased && this.cbReleased(this.index);
            },
            releasedOutside: function () {
                this.cbReleasedOutside && this.cbReleasedOutside(this.index);
            },
            update: function () {
                this.parent();
            },
            draw: function () {
                this.parent();
                this.visible && (this.drawHitBox(), this.drawImage());
            },
            drawHitBox: function () {
                if (this.hitBox) {
                    var b = ig.system.context;
                    b.save();
                    b.globalAlpha = 0.5;
                    b.translate(this.pos.x, this.pos.y);
                    b.fillRect(0, 0, this.image.width * this.scale.x, this.image.height * this.scale.y);
                    b.restore();
                }
            },
            drawImage: function () {
                var b = ig.system.context;
                b.save();
                b.translate(this.pos.x + 0.5 * this.image.width * this.scale.x, this.pos.y + 0.5 * this.image.height * this.scale.y);
                b.scale(this.scale.x, this.scale.y);
                this.imageReal && this.imageReal.draw(-0.5 * this.imageReal.width, -0.5 * this.imageReal.height);
                b.restore();
            },
        });
    });
ig.baked = !0;
ig.module("game.entities.buttons.button-install-now")
    .requires("game.entities.buttons.button", "game.entities.ui.clickable-div-layer")
    .defines(function () {
        ButtonInstallNow = EntityButton.extend({
            image: new ig.Image(imagePath.installNow),
            type: ig.Entity.TYPE.B,
            gravityFactor: 0,
            translate: { x: 0, y: 0 },
            scale: { x: 1, y: 1 },
            anchor: { x: 0, y: 0 },
            anchorPos: { x: 0.5, y: 0.5 },
            angle: 0,
            alpha: 1,
            visible: !0,
            endMode: !1,
            DIV_ID: "button-download",
            fontSize: 50,
            reduceYPos: 0,
            title: "",
            isLink: !1,
            isLog: "",
            latestWidthRatio: 0,
            init: function (b, c, d) {
                this.parent(b, c, d);
                this.context = ig.system.context;
                d.title && (this.title = d.title);
                d.isLink && (this.isLink = d.isLink);
                d.isLog && (this.isLog = d.isLog);
                ig.game.sortEntitiesDeferred();
                this.updateSize();
                this.updatePos();
                this.clickableDiv || this.createClickableDivLayer();
            },
            createClickableDivLayer: function () {
                this.clickableDiv = ig.game.spawnEntity(EntityClickableDivLayer, this.pos.x + 0.5 * (1 - this.scale.x) * this.image.width, this.pos.y + 0.5 * (1 - this.scale.y) * this.image.height, {
                    cssZIndex: 101,
                    size: { x: this.image.width * this.scale.x, y: this.image.height * this.scale.y },
                    div_layer_name: this.DIV_ID,
                    onClickFunction: this.released.bind(this),
                    isLog: this.isLog,
                });
            },
            updateSize: function () {
                this.size.x = this.image.width;
                this.size.y = this.image.height;
            },
            updatePos: function () {
                this.stopAnimation();
                this.pos.x -= this.size.x * this.anchor.x;
                this.pos.y -= this.size.y * this.anchor.y;
                this.anchorPos.x = -this.size.x / 2;
                this.anchorPos.y = -this.size.y / 2;
                this.translate.x = this.pos.x + this.size.x / 2;
                this.translate.y = this.pos.y + this.size.y / 2;
                this.startAnimation();
            },
            updateClickableDiv: function () {
                this.clickableDiv && !this.endMode && ((this.latestWidthRatio = MJS.view.viewport.widthRatio), this.clickableDiv.kill(), this.createClickableDivLayer());
            },
            updateOnOrientationChangeManual: function () {
                this.updateOnOrientationChange();
                this.endMode || (this.updateSize(), this.updatePos(), this.updateClickableDiv());
            },
            show: function () {
                this.visible = !0;
                this.clickableDiv && this.clickableDiv.show();
            },
            hide: function () {
                this.visible = !1;
                this.clickableDiv && this.clickableDiv.hide();
            },
            clicked: function () {
                this.parent();
            },
            clicking: function () {
                this.parent();
            },
            released: function () {
                this.parent();
                MJS.ad.openClickUrl();
                this.isClicking = !1;
            },
            releasedOutside: function () {
                this.parent();
            },
            leave: function () {
                this.parent();
            },
            over: function () {
                this.parent();
            },
            update: function () {
                this.parent();
                this.latestWidthRatio != MJS.view.viewport.widthRatio && this.updateOnOrientationChangeManual();
            },
            draw: function () {
                this.parent();
                if (this.visible) {
                    this.drawImage();
                    var b = ig.system.context;
                    b.save();
                    this.textSet(this.fontSize, "rgba(255, 255, 255, 1)", "arial");
                    this.textDraw(this.title, this.translate.x, this.translate.y + 18 - this.reduceYPos, "center");
                    b.restore();
                }
            },
            drawImage: function () {
                this.context.save();
                this.context.translate(this.translate.x, this.translate.y);
                this.context.rotate(this.angle);
                this.context.scale(this.scale.x, this.scale.y);
                this.context.drawImage(this.image.data, this.anchorPos.x, this.anchorPos.y);
                this.context.restore();
            },
            setScale: function (b, c) {
                this.scale.x = b;
                this.scale.y = c;
            },
            setAnchor: function (b, c) {
                this.anchor.x = b;
                this.anchor.y = c;
            },
            setPosition: function (b, c) {
                this.pos.x = b;
                this.pos.y = c;
                this.updatePos();
                this.updateClickableDiv();
            },
            startAnimation: function () {
                this._tween = this.tween({ translate: { y: this.translate.y - 5 } }, 0.25, { easing: ig.Tween.Easing.Quadratic.EaseOut, loop: ig.Tween.Loop.Reverse, onComplete: this.onAnimationStopped.bind(this) });
                this._tween.start();
            },
            stopAnimation: function () {
                this.stopTweens(!0);
            },
            onAnimationStopped: function () { },
            setEnd: function () {
                this.endMode = !0;
            },
            getActualSize: function () {
                return { x: this.size.x * this.scale.x, y: this.size.y * this.scale.y };
            },
            getActualPosition: function () {
                return { x: this.translate.x, y: this.translate.y };
            },
        });
    });

ig.baked = !0;
ig.module("game.entities.dagame")
    .requires(
        "impact.entity",
        "impact.image"
    )
    .defines(function () {

        DAEntity = ig.Entity.extend({
            init: function () {

            },
            update: function () {
                // Update all entities and backgroundMaps
                this.parent();

                // Add your own, additional update code here
            },

            draw: function () {
                // Draw all entities and backgroundMaps
                this.parent();
                // Load an image
                //var roaddraw = new ig.Image(imagePath.road);

                // Draw the whole image
                roadraw.draw(0, 0);

            }
        });


    });

ig.baked = !0;
ig.module("game.entities.game-control")
    .requires(
        "impact.entity",
        "game.entities.vfx.spark",
        "game.entities.ui.banner",
        "game.entities.ui.finger",
        "game.entities.ui.hud",
        "game.entities.ui.pointer",
        "game.entities.buttons.button-card",
        "game.entities.buttons.button-card2",
        "game.entities.buttons.button-monster",
        "game.entities.buttons.button-install-now"
    )
    .defines(function () {
        EntityGameControl = ig.Entity.extend({
            imageBG: new ig.Image(imagePath.bg),

            //dragon frames
            imgDragon1: new ig.Image(imagePath.dragon1),
            imgDragon2: new ig.Image(imagePath.dragon2),
            imgDragon3: new ig.Image(imagePath.dragon3),
            imgDragon4: new ig.Image(imagePath.dragon4),
            imgDragon5: new ig.Image(imagePath.dragon5),
            imgDragon6: new ig.Image(imagePath.dragon6),

            //enemy frames
            imgEnemy1: new ig.Image(imagePath.enemy1),
            imgEnemy2: new ig.Image(imagePath.enemy2),
            imgEnemy3: new ig.Image(imagePath.enemy3),
            imgEnemy4: new ig.Image(imagePath.enemy4),
            imgEnemy5: new ig.Image(imagePath.enemy5),
            imgEnemy6: new ig.Image(imagePath.enemy6),

            imgBlackLayer: new ig.Image(imagePath.blackLayer),
            imageInstall: new ig.Image(imagePath.installNow),
            imgArrow: new ig.Image(imagePath.tutorialArrow),
            imgTutorialHand: new ig.Image(imagePath.tutorialHand),
            imgGameOverText: new ig.Image(imagePath.gameOverText),
            imgLogo: new ig.Image(imagePath.logo),

            imgCounterIdleCurrent: 3,
            imgCounterIdleMax: 3,
            imgArrayCloudImage: [
            ],
            arrayCard: [
            ],
            arrayMonster: [
            ],
            arrayLevel2: [
            ],
            arrayLevel3: [
            ],
            arrayLevel4: [
            ],
            pointer: null,
            buttonFeed: null,
            buttonPlay: null,
            scaleMonster1: null,
            scaleMonster2: null,
            scaleMonster3: null,
            matingFactorX: 0,
            alphaStateDrag: 0,
            alphaRay: 0,
            currentIndex: -1,
            monsterIndex: -1,
            state: "",
            posDragon: null,
            tomatoCounter: 0,
            tomatoMax: 5,
            feedCounter: 0,
            feedMax: 10,

            playertrackcount: 1,


            playerpos: null,
            score: 0,
            playerlife: 3,
            gamepause: 0,
            orientationcheck: -1,





            init: function (b, c, d) {
                this.parent(b, c, d);
                ig.global.wm || (this.initVFX(), this.initVar(), this.initTween(), this.showStateDrag(), this.updateOnOrientationChange(), ig.game.sortEntitiesDeferred());

            },
            initTween: function () {
                this.tween({ scaleMonster1: { y: 0.95 } }, 0.55, { loop: ig.Tween.Loop.Reverse }).start();
                this.tween({ scaleMonster2: { y: 0.95 } }, 0.5, { loop: ig.Tween.Loop.Reverse }).start();
                this.tween({ scaleMonster3: { y: 0.03 } }, 0.5, { loop: ig.Tween.Loop.Reverse }).start();
            },
            buttonPlayClicked: function () {
                this.buttonPlay.visible && ig.game.director.loadLevel(0);
            },
            buttonFeedClicked: function () {
                // this.isTutorialShown && (this.hideTutorial(), this.hideTutorialFeed(), this.hideButtonFeed(), this.killHand());
                // this.isIdle = !1;
                // this.multipleTomato();
                window.location = "https://play.google.com/store/apps/details?id=com.tappocket.dragonvillage&hl=en&gl=US";
                var locURL = "https://play.google.com/store/apps/details?id=com.tappocket.dragonvillage&hl=en&gl=US";
                var b = navigator.userAgent || navigator.vendor || window.opera;
                if (/android/i.test(b)) locURL = adDetails.settings.playStoreUrl;
                else if (/iPad|iPhone|iPod/.test(b)) locURL = adDetails.settings.itunesUrl;
                console.log("redifr");
                window.location.href = clickTag;
                // window.open(clickTag);
            },
            multipleTomato: function () {
            },
            initVFX: function () {
                this.loveVFX = ig.game.spawnEntity(Spark, 0.5 * ig.system.width, 0.5 * ig.system.height, { movement: SPARK_UP });
                this.loveVFX.visible = !1;
                
            },
            initVar: function () {
                this.counterIdleCurrent = this.counterIdleMax = 2;
                this.scaleMonster1 = { x: 1, y: 1 };
                this.scaleMonster2 = { x: 1, y: 1 };
                this.scaleMonster3 = { x: 0, y: 0 };
                enemyY = this.getRandomIntInclusive(-10, 750);
                enemyLY = this.getRandomIntInclusive(-10, 350);
                this.buttonFeed = ig.game.spawnEntity(ButtonCard, 100, 100, {
                    image: this.imageInstall, cbClicked: this.buttonFeedClicked.bind(this),
                    isAnimating: !0,
                    visible: !1,
                    zIndex: 1,
                });

                this.addHandPointerPortrait = ig.game.spawnEntity(ButtonCard, 120, 550, {
                    image: this.imgTutorialHand,
                    visible: 0,
                    isAnimating: !0,
                    zIndex: 1
                });
                this.addHandPointerLandscape = ig.game.spawnEntity(ButtonCard, 620, 250, {
                    image: this.imgTutorialHand,
                    visible: 0,
                    isAnimating: !0,
                    zIndex: 1
                });

                

            },
            updateOnOrientationChange: function () {
                if (MJS.view.viewport.orientation.portrait) {
                    this.monsterAllFactorY = -50;
                    this.buttonFeed.pos = { x: 0.5 * (ig.system.width - this.imageInstall.width), y: 500 };
                    this.posTutorialFeed = { x: 0.5 * ig.system.width, y: ig.system.height - 200 };
                    this.posTutorial = { x: 0.5 * ig.system.width, y: ig.system.height - 100 };
                    this.posthif = { x: 0.5 * ig.system.width, y: ig.system.height / 2 };
                    this.posRay = { x: 0.5 * ig.system.width, y: 0.5 * ig.system.height - 50 };
                    this.posAmazing = { x: 0.5 * ig.system.width, y: 60 };
                    this.posLogo = { x: 0.5 * (ig.system.width - 0.8 * this.imgLogo.width), y: 10 };
                    this.loveVFX.pos.x = 0.5 * ig.system.width;
                    this.loveVFX.pos.y = 0.5 * ig.system.height;
                    if (this.orientationcheck != 0) {
                        //this.ChangePlayerTrack();
                        this.track = 530;
                        this.Ytrack = 450;
                        this.Ptrack = 530;
                        this.strack = 430;
                        this.orientationcheck = 0;
                    }

                    // this.hand.pos = { x: 0.5 * ig.system.width-20, y: ig.system.height -140-150 };
                    this.buttonFeed.updateOnOrientationChange();
                    // this.hand.updateOnOrientationChange();
                    // for (var b = 0.5 * ig.system.width, c = 1, d = 0; d < this.arrayLevel1.length; d++) {
                    //     var f = this.arrayLevel1[d];
                    //     if (f.button) {
                    //         var g = f.button;
                    //         g.scale = { x: c, y: c };
                    //         g.pos = { x: 0.5 * ig.system.width, y: ig.system.height - f.image.height * c - 10 };
                    //         g.updateOnOrientationChange();
                    //     }
                    // }
                    // for (d = 0; d < this.arrayMonster.length; d++) (f = this.arrayMonster[d]), f.button && ((b = this.arrayCard[d]), (g = f.button), (g.scale = { x: c, y: c }), (g.pos = b.button.pos), g.updateOnOrientationChange());
                    // b = 650;
                    // for (d = 0; d < this.arrayLevel1.length; d++)
                    //     (this.arrayLevel1[d].pos = { x: 0.5 * ig.system.width, y: ig.system.height - 140 }),
                    //         (this.arrayLevel2[d].pos = this.arrayLevel1[d].pos),
                    //         (this.arrayLevel3[d].pos = { x: 0.5 * ig.system.width, y: b }),
                    //         (this.arrayLevel4[d].pos = { x: 0.5 * ig.system.width, y: b });
                    this.updateLayer();
                    //this.updateHand();
                    this.buttonPlay && ((this.buttonPlay.pos = { x: 0.5 * (ig.system.width - this.buttonPlay.image.width), y: ig.system.height - 140 }), this.buttonPlay.updateOnOrientationChangeManual());
                } else { // landscape
                    this.monsterAllFactorY = -150;
                    d = ig.system.width - this.imageBG.width;
                    b = this.imageBG.width;
                    this.buttonFeed.pos = { x: 0.5 * (ig.system.width - this.imageInstall.width), y: ig.system.height - 150 };
                    this.posTutorialFeed = { x: 0.5 * d + b, y: ig.system.height - 200 };
                    this.posTutorial = { x: 0.5 * d + b - 20, y: ig.system.height - 100 };
                    this.posthif = { x: 0.5 * ig.system.width, y: ig.system.height / 2 };
                    this.posAmazing = { x: 0.5 * d + b, y: 110 };
                    this.posLogo = { x: 20, y: -10 };
                    this.posRay = { x: 0.5 * this.imageBG.width, y: 0.5 * ig.system.height };
                    this.loveVFX.pos.x = 0.5 * this.imageBG.width;
                    this.loveVFX.pos.y = 0.5 * ig.system.height;
                    this.buttonFeed.updateOnOrientationChange();

                    if (this.orientationcheck != 1) {
                        //this.ChangePlayerTrack();
                        this.track = 330;
                        this.Ytrack = 260;
                        this.Ptrack = 330;
                        this.strack = 245;
                        this.orientationcheck = 1;
                    }
                    // this.hand.pos = { x:  0.5 * ig.system.width, y: ig.system.width*0.5+ 50-300 };
                    // this.hand.updateOnOrientationChange();
                    c = 0.84;
                    // for (d = 0; d < this.arrayCard.length; d++)
                    //     (f = this.arrayCard[d]),
                    //         f.button && ((g = f.button), (g.scale = { x: c, y: c }), (g.pos = { x: b + 10 + d * this.arrayCard[0].image.width * c, y: ig.system.height - f.image.height * c - 10 }), g.updateOnOrientationChange());
                    // for (d = 0; d < this.arrayMonster.length; d++) (f = this.arrayMonster[d]), f.button && ((b = this.arrayCard[d]), (g = f.button), (g.scale = { x: c, y: c }), (g.pos = b.button.pos), g.updateOnOrientationChange());
                    // b = 650;
                    // for (d = 0; d < this.arrayLevel1.length; d++)
                    // 	(f = this.arrayLevel1[d]),
                    //     (this.arrayLevel1[d].pos = { x: 0.5 * (d + f.image.width*2) + b, y: ig.system.width*0.5+ 50 }),
                    //         (this.arrayLevel2[d].pos = { x: this.arrayLevel1[d].pos.x, y:this.arrayLevel1[d].pos.y+50 }),
                    //         (this.arrayLevel3[d].pos = { x: 0.5 * ig.system.width, y: b }),
                    //         (this.arrayLevel4[d].pos = { x: 0.5 * ig.system.width, y: b });
                    this.updateLayer();
                    //this.updateHand();
                    this.buttonPlay &&
                        ((d = ig.system.width - this.imageBG.width),
                            (b = this.imageBG.width),
                            (this.buttonPlay.pos = { x: 0.5 * (d - this.buttonPlay.image.width) + b, y: ig.system.height - 140 }),
                            this.buttonPlay.updateOnOrientationChangeManual());
                }
            },
            updateLayer: function () {
                if (this.cardlayer)
                    switch ((this.killLayer(), this.state)) {
                        case STATE_DRAG:
                            this.showLayer(0.5 * ig.system.width);
                            break;
                    }
            },

            //MASTER DRAW CLASS
            draw: function () {
                if (this.gamepause == 0) { //if game is NOT paused
                    this.parent();
                    this.drawBG();
                    //this.anim1.draw(playerX, playerY);
                    this.drawDragon();
                    if (gameState == 2) {
                        this.drawGameOver();
                        this.drawLogoEnd();
                    }

                    if (gameState == 0) {
                        this.drawTapInstruction();
                        if (MJS.view.viewport.orientation.portrait) {
                            this.addHandPointerPortrait.visible = 1;
                        } else {
                            this.addHandPointerLandscape.visible = 1;
                        }
                    } else {
                        this.addHandPointerPortrait.visible = 0;
                        this.addHandPointerLandscape.visible = 0;
                        if(gameState !== 2){
                            this.drawEnemyDragon();
                            this.drawScore();
                        }
                    }


                } else {
                    //things to show when game is paused
                    this.parent();
                    //drawSkyBG();
                }

            },

            //Portrait
            BGP1X: 0,
            BGP2X: 1380,
            BGP3X: 2760,

            //Landscape

            BGL1X: 0,
            BGL2X: 1080,
            BGL3X: 2160,
            drawBG: function () {
                if (MJS.view.viewport.orientation.portrait) {
                    // var b = ig.system.context;
                    // b.save();
                    // b.scale(0.275, 0.375);
                    // this.imageBG.draw(0, 0);
                    // b.restore();
                    if (this.BGP1X > -1380) {
                        this.BGP1X -= 5;
                    } else {
                        this.BGP1X = 2760;
                    }
                    var b = ig.system.context;
                    b.save();
                    b.translate(this.BGP1X, 0);
                    b.scale(0.35, 0.52);
                    this.imageBG.draw(0, 0);
                    b.restore();

                    if (this.BGP2X > -1380) {
                        this.BGP2X -= 5;
                    } else {
                        this.BGP2X = 2760;
                    }
                    var b = ig.system.context;
                    b.save();
                    b.translate(this.BGP2X, 0);
                    b.scale(0.35, 0.52);
                    this.imageBG.draw(0, 0);
                    b.restore();

                    if (this.BGP3X > -1380) {
                        this.BGP3X -= 5;
                    } else {
                        this.BGP3X = 2760;
                    }
                    var b = ig.system.context;
                    b.save();
                    b.translate(this.BGP3X, 0);
                    b.scale(0.35, 0.52);
                    this.imageBG.draw(0, 0);
                    b.restore();



                } else {
                    // var b = ig.system.context;
                    // b.save();
                    // b.scale(0.275, 0.275);
                    // this.imageBG.draw(0, 0);
                    // b.restore();
                    if (this.BGL1X > -1080) {
                        this.BGL1X -= 5;
                    } else {
                        this.BGL1X = 2160;
                    }
                    var b = ig.system.context;
                    b.save();
                    b.translate(this.BGL1X, 0);
                    b.scale(0.275, 0.275);
                    this.imageBG.draw(0, 0);
                    b.restore();

                    if (this.BGL2X > -1080) {
                        this.BGL2X -= 5;
                    } else {
                        this.BGL2X = 2160;
                    }
                    var b = ig.system.context;
                    b.save();
                    b.translate(this.BGL2X, 0);
                    b.scale(0.275, 0.275);
                    this.imageBG.draw(0, 0);
                    b.restore();

                    if (this.BGL3X > -1080) {
                        this.BGL3X -= 5;
                    } else {
                        this.BGL3X = 2160;
                    }
                    var b = ig.system.context;
                    b.save();
                    b.translate(this.BGL3X, 0);
                    b.scale(0.275, 0.275);
                    this.imageBG.draw(0, 0);
                    b.restore();

                }

            },

            drawScore: function() {
                var b = ig.system.context;
                b.save();
                b.textAlign = "center";
                b.textBaseline = "top";
                b.font = "bold 28px arial";
                b.fillStyle = "#FFFFFF";
                if (MJS.view.viewport.orientation.portrait){
                    b.fillText(`Score: ${totalScore} `, 450, 20);
                } else {
                    b.fillText(`Score: ${totalScore}`, 850, 20 );
                }
            },

            drawTapInstruction: function () {
                var b = ig.system.context;
                b.save();
                //b.translate(100, 100);
                
                b.textAlign = "center";
                b.textBaseline = "top";
                if (MJS.view.viewport.orientation.portrait) {
                    b.font = "bold 45px arial";
                    if(deathTrigger == 0){
                        b.fillStyle = "#FFFFFF";
                        b.fillText("TAP TO FLY!", 280, 300);
                    } else {
                        b.fillStyle = "#c72020";
                        b.fillText("TAP TO TRY AGAIN", 280, 300);
                    }
                } else {
                    b.font = "bold 45px arial";
                    if(deathTrigger == 0){
                        b.fillStyle = "#FFFFFF";
                        b.fillText("TAP TO FLY!", 450, 200);
                    } else {
                        b.fillStyle = "#c72020";
                        b.fillText("TAP TO TRY AGAIN", 450, 200);
                    }
                }
            },


            drawDragon: function () {
                if (MJS.view.viewport.orientation.portrait) {
                    var b = ig.system.context;
                    b.save();
                    b.translate(playerX, playerY);
                    b.scale(0.45, 0.45);
                    if (dragonAnim == 0) {
                        this.imgDragon1.draw(0, 0);
                        setTimeout(() => { dragonAnim = 1 }, 100);
                    } else if (dragonAnim == 1) {
                        this.imgDragon2.draw(0, 0);
                        setTimeout(() => { dragonAnim = 2 }, 100);
                    } else if (dragonAnim == 2) {
                        this.imgDragon3.draw(0, 0);
                        setTimeout(() => { dragonAnim = 3 }, 100);
                    } else if (dragonAnim == 3) {
                        this.imgDragon4.draw(0, 0);
                        setTimeout(() => { dragonAnim = 4 }, 100);
                    } else if (dragonAnim == 4) {
                        this.imgDragon5.draw(0, 0);
                        setTimeout(() => { dragonAnim = 5 }, 100);
                    } else {
                        this.imgDragon6.draw(0, 0);
                        setTimeout(() => { dragonAnim = 0 }, 100);
                    }
                    b.restore();


                } else {
                    var b = ig.system.context;
                    b.save();
                    b.translate(playerLX, playerLY);
                    b.scale(0.4, 0.4);
                    if (dragonAnim == 0) {
                        this.imgDragon1.draw(0, 0);
                        setTimeout(() => { dragonAnim = 1 }, 100);
                    } else if (dragonAnim == 1) {
                        this.imgDragon2.draw(0, 0);
                        setTimeout(() => { dragonAnim = 2 }, 100);
                    } else if (dragonAnim == 2) {
                        this.imgDragon3.draw(0, 0);
                        setTimeout(() => { dragonAnim = 3 }, 100);
                    } else if (dragonAnim == 3) {
                        this.imgDragon4.draw(0, 0);
                        setTimeout(() => { dragonAnim = 4 }, 100);
                    } else if (dragonAnim == 4) {
                        this.imgDragon5.draw(0, 0);
                        setTimeout(() => { dragonAnim = 5 }, 100);
                    } else {
                        this.imgDragon6.draw(0, 0);
                        setTimeout(() => { dragonAnim = 0 }, 100);
                    }
                    b.restore();
                }
            },
            

            drawEnemyDragon: function () {
                if (MJS.view.viewport.orientation.portrait) {
                    
                    var b = ig.system.context;
                    b.save();
                    b.translate(enemyX, enemyY);
                    b.scale(0.55, 0.55);
                    if (enemyAnim == 0) {
                        this.imgEnemy1.draw(0, 0);
                        setTimeout(() => { enemyAnim = 1 }, 100);
                    } else if (enemyAnim == 1) {
                        this.imgEnemy2.draw(0, 0);
                        setTimeout(() => { enemyAnim = 2 }, 100);
                    } else if (enemyAnim == 2) {
                        this.imgEnemy3.draw(0, 0);
                        setTimeout(() => { enemyAnim = 3 }, 100);
                    } else if (enemyAnim == 3) {
                        this.imgEnemy4.draw(0, 0);
                        setTimeout(() => { enemyAnim = 4 }, 100);
                    } else if (enemyAnim == 4) {
                        this.imgEnemy5.draw(0, 0);
                        setTimeout(() => { enemyAnim = 5 }, 100);
                    } else {
                        this.imgEnemy6.draw(0, 0);
                        setTimeout(() => { enemyAnim = 0 }, 100);
                    }
                    b.restore();
                } else {
                    var b = ig.system.context;
                    b.save();
                    b.translate(enemyLX, enemyLY);
                    b.scale(0.55, 0.55);
                    if (enemyAnim == 0) {
                        this.imgEnemy1.draw(0, 0);
                        setTimeout(() => { enemyAnim = 1 }, 100);
                    } else if (enemyAnim == 1) {
                        this.imgEnemy2.draw(0, 0);
                        setTimeout(() => { enemyAnim = 2 }, 100);
                    } else if (enemyAnim == 2) {
                        this.imgEnemy3.draw(0, 0);
                        setTimeout(() => { enemyAnim = 3 }, 100);
                    } else if (enemyAnim == 3) {
                        this.imgEnemy4.draw(0, 0);
                        setTimeout(() => { enemyAnim = 4 }, 100);
                    } else if (enemyAnim == 4) {
                        this.imgEnemy5.draw(0, 0);
                        setTimeout(() => { enemyAnim = 5 }, 100);
                    } else {
                        this.imgEnemy6.draw(0, 0);
                        setTimeout(() => { enemyAnim = 0 }, 100);
                    }
                    b.restore();
                }

            },

            drawLogoEnd: function () {
                if (MJS.view.viewport.orientation.portrait) {
                    var b = ig.system.context;
                    b.save();
                    b.translate(225, 225);
                    b.scale(0.55, 0.55);
                    this.imgLogo.draw(0, 0);
                    b.restore();
                } else {

                    var b = ig.system.context;
                    b.save();
                    b.translate(440, 70);
                    b.scale(0.45, 0.45);
                    this.imgLogo.draw(0, 0);
                    b.restore();
                }
            },
            drawHandPointer: function () {
                var b = ig.system.context;
                b.save();
                b.translate(this.handPointerX, this.handPointerY);
                b.scale(0.85, 0.85);
                this.imgHandPointer.draw(0, 0);
                b.restore();
            },
            drawGameOver: function () {
                var b = ig.system.context;
                b.save();
                b.translate(-150, 0);
                b.scale(5, 7);
                this.imgBlackLayer.draw(0, 0);
                b.restore();

                if (MJS.view.viewport.orientation.portrait) {
                    var b = ig.system.context;
                    b.save();
                    b.translate(130, 290);
                    b.scale(1, 1);
                    this.imgGameOverText.draw(0, 0);
                    b.restore();

                    b = ig.system.context;
                    b.save();
                    b.textAlign = "center";
                    b.textBaseline = "top";
                    b.font = "bold 45px arial";
                    b.fillStyle = "#e8a915"
                    b.fillText(`Score: ${displayScore}`, 270, 150);

                } else {
                    var b = ig.system.context;
                    b.save();
                    b.translate(320, 120);
                    b.scale(1, 1);
                    this.imgGameOverText.draw(0, 0);
                    b.restore();

                    b = ig.system.context;
                    b.save();
                    b.textAlign = "center";
                    b.textBaseline = "top";
                    b.font = "bold 45px arial";
                    b.fillStyle = "#e8a915"
                    b.fillText(`Score: ${displayScore}`, 470, 300);
                }
                if (!this.buttonFeed.visible) {
                    this.showButtonFeed();
                }
            },

            showButtonFeed: function () {
                this.buttonFeed.visible = !0;
            },
            setIdle: function (b) {
                this.isIdle = !1;
                this.tween({ alpha: 1 }, b, {
                    onComplete: function () {
                        this.counterIdleCurrent = this.counterIdleMax;
                        this.isIdle = !0;
                    }.bind(this),
                }).start();
            },
            showStateDrag: function () {
                this.setIdle(2);
                this.state = STATE_DRAG;
                this.alphaStateDrag = 1;
                // MJS.view.viewport.orientation.landscape ? this.showHandFeedLandscape():this.showHandDragPortrait();
                // this.showStateBreeding();
            },

            update: function () { // master update function 
                if (this.gamepause == 0) {
                    this.parent();
                    //this.updatePointer();
                    // this.collision();
                    //this.dragonCollider();
                    
                    this.detectPointer();
                    this.checkTap();
                    if (gameState == 1) {
                        this.dragonGravity();
                        this.jumpTap();
                        this.spawnEnemy();
                        this.collisionCheck();
                        //this.updateScore();
                    }




                    // if (MJS.view.viewport.orientation.portrait){
                    //     //playerY += 2.5; //falling
                    //     //playerX -= 0.25;
                    // } else {
                    //     playerLY += 2.5;
                    // }


                }

            },

            detectPointer: function () {
                this.pointer || (this.pointer = ig.game.getEntitiesByType(EntityPointer)[0]);
            },
            updatePointer: function () {
                if (this.pointer)
                    this.checkTap();
            },

            updateScore: function () {
                
                if(scoreTrigger == 1) {
                    scoreUpdate = setInterval (() => { totalScore += 1, displayScore += 1 }, 1000);
                }
                if (scoreTrigger == 2) {
                    clearInterval(scoreUpdate);
                    totalScore = 0;
                }
                
            },

            //Fall function
            dragonGravity: function () {
                if (deathTrigger == 0) {
                    if (MJS.view.viewport.orientation.portrait) {
                        playerY += 3.5;
                        playerX -= 0.15;
                    } else {
                        playerLY += 2.5;
                        playerLX -= 0.15;
                    }
                }
            },


            //Enemy spawn function
            spawnEnemy: function () {
                if (MJS.view.viewport.orientation.portrait) {
                    enemyX -= 10; // Dragon coming from the right
                    if (enemyX <= 0) {
                        var newY = this.getRandomIntInclusive(-10, 750);

                        setTimeout(() => { enemyX = 1000, enemyY = newY }, this.getRandomIntInclusive(250, 1050));
                    }
                } else {
                    enemyLX -= 12; // Dragon coming from the right
                    if (enemyLX <= 0) {
                        var newLY = this.getRandomIntInclusive(-10, 350);

                        setTimeout(() => { enemyLX = 2000, enemyLY = newLY }, this.getRandomIntInclusive(250, 1050));
                    }
                }

            },

            //Randomise enemy co-oridnates
            getRandomIntInclusive: function (min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
            },


            checkTap: function () {
                if (this.pointer.isFirstPressed && gameState == 0) {
                    gameState = 1;
                    if(deathTrigger !== 1){
                        scoreTrigger = 1;
                        this.updateScore();
                    }
                    //setTimeout(() => {totalScore += 1}, 1000);
                    // scoreCount = setInterval(()=> {totalScore += 1}, 1000);
                    
                }
                if (this.pointer.isFirstPressed && (gameState == 1) && (deathTrigger == 1)) {
                    gameState = 2;
                    //clearInterval(scoreCount);
                }
            },

            //Jump function
            jumpTap: function () {
                if (MJS.view.viewport.orientation.portrait) {
                    if (this.pointer.isFirstPressed && deathTrigger == 0) {
                        // console.log("JUMP TAP");
                        // console.log(ig.input.mouse.y);

                        //jump
                        playerX += 7;
                        if(playerY >= 150){
                            playerY -= 150;
                        } else {
                            playerY -= (playerY + playerY/6);
                        }
                        

                    }
                } else {
                    if (this.pointer.isFirstPressed && deathTrigger == 0) {
                        //jump
                        // console.log(ig.input.mouse.y);
                        playerLX += 7;
                        if(playerLY >= 120){
                            playerLY -= 120;
                        } else {
                            playerLY -= (playerLY + playerY/6);
                        }
                    }
                }
            },




            // dragonCollider: function () {

            //     if (MJS.view.viewport.orientation.portrait) {
            //         //falling
            //         if (deathTrigger == 0) {
            //             // playerY += 2.5;
            //             // playerX -= 0.15;
            //             if (((ig.input.mouse.x >= playerX - 50) && (ig.input.mouse.x <= playerX + 50)) && ((ig.input.mouse.y >= (playerY - (160 / 500 * playerY)) * window.innerHeight / 667)) && (ig.input.mouse.y <= (playerY - (160 / 500 * playerY) + 90) * window.innerHeight / 667)) {
            //                 if (this.pointer.isPressed) {
            //                     console.log(ig.input.mouse.y);
            //                     console.log(playerY);
            //                     //jump
            //                     playerY -= 100;
            //                     playerX += 7;
            //                     // if( playerTrigger == 0){
            //                     //     playerTrigger = 1;   
            //                     // }

            //                     console.log("DRAGON CLICKED");
            //                 }
            //             }
            //         } else {
            //             // playerY += 10;
            //             // playerX -= 3;
            //             // playerLY += 10;
            //             // playerLX -= 3;
            //         }



            //     } else {
            //         //falling
            //         if (deathTrigger == 0) {
            //             // playerLY += 2.5;
            //             // playerLX -= 0.15;
            //             if (((ig.input.mouse.x >= playerLX - 30) && (ig.input.mouse.x <= playerLX + 50)) && ((ig.input.mouse.y >= playerLY - ((90 / 300 * playerLY)))) && (ig.input.mouse.y <= playerLY - ((90 / 300 * playerLY)) + 80)) {
            //                 if (this.pointer.isPressed) {
            //                     //jump
            //                     playerLY -= 120;
            //                     playerLX += 7;
            //                     console.log(ig.input.mouse.y);
            //                     console.log("DRAGON CLICKED");
            //                 }
            //             }

            //         } else {
            //             // playerY += 10;
            //             // playerX -= 3;
            //             // playerLY += 10;
            //             // playerLX -= 3;
            //         }

            //     }

            // },

            resetGame: function () {
                gameState = 0;

                //Reset positions

                //Dragon Co-ordintates
                playerX = 70;
                playerY = 450;

                playerLX = 100;
                playerLY = 200;


                //Enemy Co-ordinates
                enemyX = 300;
                enemyY = 400;

                enemyLX = 500;
                enemyLY = 200;
            },

            //collision check function
            collisionCheck: function () {
                if (MJS.view.viewport.orientation.portrait) {
                    //----------------PORTRAIT---------------------

                    //enemy box
                    var enemyX1 = (enemyX - (70 / 300 * enemyX)) * window.innerWidth / 375;
                    var enemyX2 = (enemyX1 + 80) * window.innerWidth / 375;
                    var enemyY1 = ((enemyY + (150 / 550 * (enemyY + 150))) - (200 / 400 * enemyY)) * window.innerHeight / 667;
                    var enemyY2 = (enemyY1 + 60) * window.innerHeight / 667;

                    //player box
                    var playerX1 = playerX - 50;
                    var playerX2 = playerX + 50;
                    var playerY1 = (playerY - (160 / 500 * playerY)) * window.innerHeight / 667;
                    var playerY2 = (playerY - (160 / 500 * playerY) + 90) * window.innerHeight / 667;

                    //mountain
                    var mHeight = 600 * (window.innerHeight / 667);

                    //checking for mountain collision
                    if (playerY2 >= mHeight) {
                        deathTrigger = 1;
                        this.resetGame();
                        scoreTrigger = 2;
                        this.updateScore();
                        console.log("Mountain Collision");
                    }

                    //----------ENEMY COLLIDER BOX-------------

                    // if ((ig.input.mouse.x >= enemyX1) && (ig.input.mouse.x <= enemyX2) && (ig.input.mouse.y >= enemyY1) && (ig.input.mouse.y <= enemyY2)) {
                    //     if (this.pointer.isPressed) {
                    //         console.log("ENEMY CLICKED");
                    //         console.log(ig.input.mouse.y);
                    //     }
                    // }

                    //checking for enemy dragon collision
                    if (((playerX2 >= enemyX1) && (playerX2 <= enemyX2)) || ((playerX1 >= enemyX1) && (playerX1 <= enemyX2))) {
                        if (((playerY1 <= enemyY2) && (playerY1 >= enemyY1)) || ((playerY2 >= enemyY1) && (playerY2 <= enemyY2))) {
                            console.log("COLLISION DETECTED");
                            deathTrigger = 1;
                            this.resetGame();
                            scoreTrigger = 2;
                            this.updateScore();
                        }
                    }
                } else {
                    //----------------LANDSCAPE---------------------

                    //enemy box
                    var enemyX1 = (enemyLX - 70 / 300 * enemyLX) * window.innerWidth / 667;
                    var enemyX2 = (enemyX1 + 80) * window.innerWidth / 667;
                    var enemyY1 = (enemyLY + (150 / 350 * (enemyLY + 150))) - (140 / 200 * enemyLY);
                    var enemyY2 = enemyY1 + 50;

                    //player box
                    var playerX1 = playerLX - 30;
                    var playerX2 = playerLX + 50;
                    var playerY1 = (playerLY - (90 / 300 * playerLY));
                    var playerY2 = (playerLY - (90 / 300 * playerLY) + 80);

                    //mountain

                    var mHeight = 330

                    //checking for mountain collision
                    if (playerY2 >= mHeight) {
                        deathTrigger = 1;
                        this.resetGame();
                        console.log("Mountain Collision");
                        scoreTrigger = 2;
                        this.updateScore();
                    }


                    //----------ENEMY COLLIDER BOX-------------
                    // if ((ig.input.mouse.x >= enemyX1) && (ig.input.mouse.x <= enemyX2) && (ig.input.mouse.y >= enemyY1) && (ig.input.mouse.y <= enemyY2)) {
                    //     if (this.pointer.isPressed) {
                    //         console.log("ENEMY CLICKED");
                    //         console.log(ig.input.mouse.y);
                    //     }
                    // }

                    //checking for enemy collision
                    if (((playerX2 >= enemyX1) && (playerX2 <= enemyX2)) || ((playerX1 >= enemyX1) && (playerX1 <= enemyX2))) {
                        if (((playerY1 <= enemyY2) && (playerY1 >= enemyY1)) || ((playerY2 >= enemyY1) && (playerY2 <= enemyY2))) {
                            console.log("COLLISION DETECTED");
                            deathTrigger = 1;
                            this.resetGame();
                            scoreTrigger = 2;
                            this.updateScore();
                        }
                    }

                }
            },


        })

    });


var STATE_DRAG = "drag",
    STATE_BREEDING = "mating",
    STATE_LEVEL_1 = "level-1",
    STATE_LEVEL_2 = "level-2",
    STATE_LEVEL_3 = "level-3",
    STATE_LEVEL_4 = "level-4";
var midCharIndex = -1, draggin = -1;

ig.baked = !0;
ig.module("game.levels.game")
    .requires("impact.image", "game.entities.game-control", "game.entities.ui.pointer")
    .defines(function () {
        LevelGame = {
            entities: [
                { type: "EntityGameControl", x: -50, y: -50 },
                { type: "EntityPointer", x: 0, y: 0 },
            ],
            layer: [],
        };
    });
ig.baked = !0;
ig.module("game.main")
    .requires("impact.game", "plugins.helper.director", "plugins.helper.tween", "plugins.helper.splash-loader", "game.levels.game")
    .defines(function () {
        MyGame = ig.Game.extend({
            BUILD_TIMESTAMP: "11-Dec-2019",
            drawCloseButton: !1,
            userAction: 0,
            init: function () {
                console.log("inside game main");
                this.setupControls();
                this.setupDirector();
                MJS.view.orientationHandler();
                MJS.view.viewport.forceOrientation &&
                    window.mraid &&
                    window.mraid.getVersion() &&
                    2 <= parseFloat(window.mraid.getVersion(), 10) &&
                    ((orientationHandler = function () {
                        MJS.view.viewport.orientation.degree = 0;
                    }),
                        (sizeHandler = function () { }));
            },
            setupTimer: function (b) {
                window.totalSeconds = 0;
                window.secondsInterval = window.setInterval(
                    function () {
                        window.totalSeconds++;
                        "on" === MJS.settings.data.didInteractTimeLimitEnabled && window.totalSeconds === MJS.settings.data.didInteractTimeLimit && 0 >= ig.game.pointer.clickCount && b.endGame();
                        MJS.settings.data.milestone && MJS.settings.data.milestone.length && MJS.settings.data.milestone.indexOf(window.totalSeconds);
                    }.bind(this),
                    1e3
                );
            },
            setupControls: function () {
                ig.input.unbindAll();
                ig.input.initMouse();
                ig.input.bind(ig.KEY.MOUSE1, "click");
            },
            setupDirector: function () {
                this.director = new ig.Director(this, [LevelGame]);
                this.director.loadLevel(this.director.currentLevel);
            },
            checkCustomClose: function () {
                if (null !== typeof mraid && "undefined" !== typeof mraid && window.MJS.settings.getBool("disableCustomClose"))
                    try {
                        mraid.useCustomClose(!0);
                    } catch (b) {
                        console.log("Mraid missing");
                    }
            },
            update: function () {
                this.checkCustomClose();
                if (this.paused) {
                    for (var b = 0; b < this.entities.length; b++) this.entities[b].ignorePause && this.entities[b].update();
                    this.checkEntities();
                    if (this._doSortEntities || this.autoSort) this.sortEntities(), (this._doSortEntities = !1);
                    
                } else {
                    this.parent();

                }
            },



            drawFPS: function () {
                var b = 0;
                ig.debug &&
                    ((b = Math.round(1e3 / ig.debug.debugTickAvg)),
                        (ig.system.context.font = "24px arial"),
                        (ig.system.context.fillStyle = "rgba(255,255,255,1)"),
                        (ig.system.context.textAlign = "left"),
                        (ig.system.context.textBaseline = "bottom"),
                        ig.system.context.fillText("FPS: " + b, 0.15 * ig.system.width, 0.55 * ig.system.height));
            },
            draw: function () {
                this.parent();
                ig.game.drawFPS();
            },
        });
        ig.gameStarted = !1;
        ig.startGame = function () {
            console.log("start");
            MJS.view.initViewport();
            MJS.view.updateViewport();
            MJS.view.setupPage();
            MJS.view.viewport.forceOrientation &&
                window.mraid &&
                window.mraid.getVersion() &&
                (2 <= parseFloat(window.mraid.getVersion(), 10) && window.mraid.setOrientationProperties({ allowOrientationChange: !1, forceOrientation: MJS.view.viewport.forceOrientation }), window.mraid.expand());
            ig.gameStarted ||
                (ig.ua.mobile
                    ? ig.main("#canvas", MyGame, 60, MJS.view.viewport.mobileWidth, MJS.view.viewport.mobileHeight, 1, ig.SplashLoader)
                    : ig.main("#canvas", MyGame, 60, MJS.view.viewport.desktopWidth, MJS.view.viewport.desktopHeight, 1, ig.SplashLoader),
                    (ig.gameStarted = !0),
                    MJS.view.orientationHandler());
        };
        MJS.settings.updateSettings();
        if (window.mraid) {
            var b = function () {
                MJS.game.startGame(ig.startGame, 25);
            };
            "loading" === window.mraid.getState() ? (window.mraid.addEventListener("ready", b), console.log("loading mraid")) : (b(), console.log("ready mraid"));
        } else MJS.game.startGame(ig.startGame, 25), console.log("no mraid");
    });