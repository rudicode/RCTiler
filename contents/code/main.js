// Copyright (C) 2021 Rudi Luzar <rudi@rudicode.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//


//
// vars
//

var client;             // active window
var screenGeometry;     // screen sizes
var xMargin = 5;        // margin in pixels left and right
var mode = 2;           // starting mode
var tile6SplitPercentageY = 0.55; // y percentage size of bottom windows
var windowStateList = {};// keep state for every window


//
// Utility Functions
//

function getGeometry() {
    client = workspace.activeClient;
    screenGeometry = workspace.clientArea(KWin.MaximizeArea, client);
}

function move(newX, newY) {
    if (!client.moveable) {
        return;
    }
    client.move = true;
    client.geometry = {
        x: newX,
        y: newY,
        width: client.geometry.width,
        height: client.geometry.height
    };
    client.move = false;
}

function resize(newWidth, newHeight) {
    if (!client.resizeable) {
        return;
    }
    client.resize = true;
    client.geometry = {
        x: client.geometry.x,
        y: client.geometry.y,
        width: newWidth,
        height: newHeight
    };
    client.resize = false;
}

//
// Tiling Functions
//

function tile4(placement) {
    // valid placement values botleft, botright, topleft, topright
    placement = placement || "botleft"; //default

    getGeometry();
    var newWidth = (screenGeometry.width / 2) - xMargin;
    var newHeight = screenGeometry.height / 2;
    resize(newWidth, newHeight);

    var newX;
    var newY;

    switch (placement) {
        case "botleft":
            newX = screenGeometry.x + xMargin;
            newY = screenGeometry.y + newHeight;
            break;
        case "botright":
            newX = screenGeometry.x + newWidth;
            newY = screenGeometry.y + newHeight;
            break;
        case "topleft":
            newX = screenGeometry.x + xMargin;
            newY = screenGeometry.y;
            break;
        case "topright":
            newX = screenGeometry.x + newWidth
            newY = screenGeometry.y;
            break;
        default:
            // this position should indicate error on screen
            newX = 20;
            newY = 20;
            break;
    }
    move(newX, newY);
}

function tile6(placement) {
    // valid placement values botleft, botcenter, botright, topleft, topcenter, topright
    placement = placement || "botcenter"; //default

    getGeometry();
    var newWidth = (screenGeometry.width - xMargin * 2) / 3; // 3 equal widths
    var newHeight = screenGeometry.height * tile6SplitPercentageY;
    if (placement == "topleft" || placement == "topcenter" || placement == "topright") {
        newHeight = screenGeometry.height - newHeight
    }
    resize(newWidth, newHeight);

    var referenceX = (screenGeometry.width - client.width) / 2;
    var newX = screenGeometry.x + referenceX;
    var newY = screenGeometry.y + (screenGeometry.height - client.height);

    if (placement == "topleft" || placement == "topcenter" || placement == "topright") {
        newY = screenGeometry.y
    }

    switch (placement) {
        case "botleft":
        case "topleft":
            newX -= client.width;
            break;
        case "botright":
        case "topright":
            newX += client.width;
            break;
        case "topcenter":
        case "botcenter":
            //do nothing
            break;
        default:
            // this position should indicate error on screen
            newX = 70;
            newY = 20;
            break;
    }
    move(newX, newY);
}

function focus1(style) {
    style = style || "none"; //default
    // bring to center, first landscape and then portrait
    getGeometry();
    var newWidth;
    var newHeight;

    if (style == "portrait") { windowStateList[client.windowId] = 1; }
    if (style == "landscape") { windowStateList[client.windowId] = 0; }


    // windowStateList keeps the state for each windowId encountered.
    switch (windowStateList[client.windowId]) {
        case 1:
            // Portrait
            newWidth = screenGeometry.width * 0.35;
            newHeight = screenGeometry.height * 0.70;
            windowStateList[client.windowId] = 0
            break;
        case 0:
        default:
            // Landscape
            newWidth = screenGeometry.width * 0.60;
            newHeight = screenGeometry.height * 0.60;
            windowStateList[client.windowId] = 1
            break;
    }
    resize(newWidth, newHeight);

    var newX = screenGeometry.x + (screenGeometry.width - client.width) / 2;
    var newY = screenGeometry.y + (screenGeometry.height - client.height) / 2;
    move(newX, newY);
}

function focus2(placement) {
    // Place left or right of center 
    placement = placement || "left"; //default
    getGeometry();
    var newWidth = screenGeometry.width * 0.35;
    var newHeight = screenGeometry.height * 0.70;
    resize(newWidth, newHeight);

    var newY = screenGeometry.y + (screenGeometry.height - client.height) / 2;
    var newX = screenGeometry.x + (screenGeometry.width - client.width) / 2;

    if (placement == "right") {
        newX += client.width / 2;
    } else {
        newX -= client.width / 2;
    }
    move(newX, newY);
}

function focus3() {
    //  center window
    getGeometry();
    var newY = screenGeometry.y + (screenGeometry.height - client.height) / 2;
    var newX = screenGeometry.x + (screenGeometry.width - client.width) / 2;
    move(newX, newY);
}

//
// Register Shortcuts
//

registerShortcut("RCTilerCenter", "RCTiler(0) Center", "Meta+Num+0", function () {
    switch (mode) {
        case 2:
            focus3("centeronly");
            break;
        default:
            focus3("centeronly");
    }
});

registerShortcut("RCTilerBotLeft1", "RCTiler(1) Bot Left", "Meta+Num+1", function () {
    switch (mode) {
        case 2:
            tile6("botleft");
            break;
        default:
            tile4("botleft");
    }
});

registerShortcut("RCTilerTop2", "RCTiler(2) Bot", "Meta+Num+2", function () {
    switch (mode) {
        case 2:
            tile6("botcenter");
            break;
        default:
            focus1("landscape");
    }
});

registerShortcut("RCTilerBotRight3", "RCTiler(3) Bot Right", "Meta+Num+3", function () {
    switch (mode) {
        case 2:
            tile6("botright");
            break;
        default:
            tile4("botright");
        // tileBotRight();
    }
});

registerShortcut("RCTilerLeft4", "RCTiler(4) Left", "Meta+Num+4", function () {
    switch (mode) {
        case 2:
            focus2("left");
            break;
        default:
            focus2("left");
    }
});

registerShortcut("RCTilerCenter5", "RCTiler(5) Center", "Meta+Num+5", function () {
    switch (mode) {
        case 2:
            focus1();
            break;
        default:
            focus1();
    }
});

registerShortcut("RCTilerRight6", "RCTiler(6) Right", "Meta+Num+6", function () {
    switch (mode) {
        case 2:
            focus2("right");
            break;
        default:
            focus2("right");
    }
});

registerShortcut("RCTilerTopLeft7", "RCTiler(7) Top Left", "Meta+Num+7", function () {
    switch (mode) {
        case 2:
            tile6("topleft");
            break;
        default:
            tile4("topleft");
        // tileTopLeft();
    }
});

registerShortcut("RCTilerTopLeft8", "RCTiler(8) Top", "Meta+Num+8", function () {
    switch (mode) {
        case 2:
            tile6("topcenter");
            break;
        default:
            focus1("portrait");
    }
});

registerShortcut("RCTilerTopRight9", "RCTiler(9) Top Right", "Meta+Num+9", function () {
    switch (mode) {
        case 2:
            tile6("topright");
            break;
        default:
            tile4("topright");
        // tileTopRight();
    }
});

registerShortcut("RCTilerMode1", "RCTiler(m1) Mode 1", "Meta+Num+/", function () {
    mode = 1; //default mode
});

registerShortcut("RCTilerMode2", "RCTiler(m2) Mode 2", "Meta+Num+*", function () {
    mode = 2;
});
