// Copyright (C) 2023 Rudi Luzar <rudi@rudicode.com>
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
// DOCS
//
// https://develop.kde.org/docs/plasma/kwin/
// https://develop.kde.org/docs/plasma/kwin/api
//
//
// DEBUGGING NOTES
//
// Output
// see: https://develop.kde.org/docs/plasma/kwin/#output
// if it does not work properly
//
// You can use print(QVariant...) it's Comparable to console.log()
// The print output of Plasma and KWin scripts can be read from the journal:
//
// journalctl -f QT_CATEGORY=js QT_CATEGORY=kwin_scripting
//
// example:
// print(screenGeometry.width, newX, newWidth, " newY:", newY)
//
//

//
// vars
//

var client;                         // active window
var screenGeometry;                 // screen sizes
var xMargin = 5;                    // margin in pixels left and right
var tile6bottomHeightRatio = 0.55;  // y percentage size of bottom windows
var tile6centerWidthRatio = 0.40;   // % of width of screen for center zone
var windowStateList = {};           // keep state for every window


//
// Utility Functions
//

function getGeometry() {
    client = workspace.activeClient;
    screenGeometry = workspace.clientArea(KWin.MaximizeArea, client);
}

function move(newX, newY) {
    if (!client.moveable) {
        // print('Not movable.')
        return;
    }
    // client.move = true;
    client.frameGeometry = {
        x: newX,
        y: newY,
        width: client.frameGeometry.width,
        height: client.frameGeometry.height
    };
    // client.move = false;
}

function resize(newWidth, newHeight) {
    if (!client.resizeable) {
        return;
    }
    // client.resize = true;
    client.frameGeometry = {
        x: client.frameGeometry.x,
        y: client.frameGeometry.y,
        width: newWidth,
        height: newHeight
    };
    // client.resize = false;
}

//
// Tiling Functions
//

function tile4(placement) {
    // valid placement values botleft, botright, topleft, topright
    placement = placement || "botleft"; // default
    var largeCenterWidthRatio = 0.75;

    // NOTE: screenGeometry.x and screenGeometry.y are usually 0
    // NOTE: screenGeometry.width and screenGeometry.height is usually the total size
    //       of the screen (eg. 1920x1080)
    getGeometry();
    var newWidth = (screenGeometry.width / 2) - xMargin;
    var newHeight = screenGeometry.height / 2;
    var screenCenterX = screenGeometry.width /2 ; // NOTE: does not take into account screenGeometry.x

    var newX;
    var newY;

    switch (placement) {
        case "botleft":
            newX = screenGeometry.x + xMargin;
            newY = screenGeometry.y + newHeight;
            break;
        case "botright":
            newX = screenCenterX;
            newY = screenGeometry.y + newHeight;
            break;
        case "topleft":
            newX = screenGeometry.x + xMargin;
            newY = screenGeometry.y;
            break;
        case "topright":
            newX = screenCenterX;
            newY = screenGeometry.y;
            break;
        case "botcenter":
            newX = Math.trunc(screenGeometry.x + (newWidth / 2));
            newY = Math.trunc(screenGeometry.y + newHeight);

            // if new position is same as current position then make it extra wide
            if ( newX == client.frameGeometry.x && newY == client.frameGeometry.y) {
                newWidth = (screenGeometry.width * largeCenterWidthRatio);
                newX = screenGeometry.x + (screenGeometry.width / 2) - (newWidth / 2);
            }
            break;
        case "topcenter":
            newX = Math.trunc(screenGeometry.x + (newWidth / 2));
            newY = screenGeometry.y;

            // if new position is same as current position then make it extra wide
            if ( newX == client.frameGeometry.x && newY == client.frameGeometry.y) {
                newWidth = (screenGeometry.width * largeCenterWidthRatio);
                newX = screenGeometry.x + (screenGeometry.width / 2) - (newWidth / 2);
            }
            break;
        default:
            // this position should indicate 'placement' error on screen
            print("RCTiler:tile4() unknown placement name: ", placement)
            newX = 20;
            newY = 20;
            break;
    }
    move(newX, newY);
    resize(newWidth, newHeight);
}

function tile6(placement) {
    // valid placement values botleft, botcenter, botright, topleft, topcenter, topright
    placement = placement || "botcenter"; // default
    var largeCenterWidthRatio = 0.75

    getGeometry();
    // calculate window width
    var newWidth = (screenGeometry.width - xMargin * 2);
    if ( placement == "topleft" || placement == "botleft" || placement == "topright" || placement == "botright" ) {
        var widthRatio = (1.0 - tile6centerWidthRatio) / 2;
        newWidth *= widthRatio;
    } else {
        newWidth *= tile6centerWidthRatio;
    }

    // calculate window height
    var newHeight = screenGeometry.height * tile6bottomHeightRatio;
    if (placement == "topleft" || placement == "topcenter" || placement == "topright") {
        newHeight = screenGeometry.height - newHeight;
    }

    var referenceX = (screenGeometry.width - newWidth) / 2;
    var newX = screenGeometry.x + referenceX;
    var newY = screenGeometry.y + (screenGeometry.height - newHeight);

    if (placement == "topleft" || placement == "topcenter" || placement == "topright") {
        newY = screenGeometry.y;
    }

    newX = Math.trunc(newX);
    newY = Math.trunc(newY);

    switch (placement) {
        case "botleft":
        case "topleft":
            newX = screenGeometry.x + xMargin;
            break;
        case "botright":
        case "topright":
            newX = screenGeometry.width - newWidth - xMargin;
            break;
        case "topcenter":
        case "botcenter":
            // if new position is same as current position then make it extra wide
            if ( newX == client.frameGeometry.x && newY == client.frameGeometry.y) {
                newWidth = (screenGeometry.width * largeCenterWidthRatio);
                newX = Math.trunc( screenGeometry.x + (screenGeometry.width / 2) - (newWidth / 2) );
            }
            break;
        default:
            // this position should indicate 'placement' error on screen
            print("RCTiler:tile6() unknown placement name: ", placement)
            newX = 70;
            newY = 20;
            break;
    }
    move(newX, newY);
    resize(newWidth, newHeight);
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
    placement = placement || "left"; // default
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
    // center window
    getGeometry();
    var newY = screenGeometry.y + (screenGeometry.height - client.height) / 2;
    var newX = screenGeometry.x + (screenGeometry.width - client.width) / 2;
    move(newX, newY);
}

//
// Register Shortcuts
//

registerShortcut("RCTiler4Center", "RCTiler4(0) Center", "Meta+Ctrl+Num+0", function () { focus3("centeronly"); });
registerShortcut("RCTiler4BotLeft1", "RCTiler4(1) Bot Left", "Meta+Ctrl+Num+1", function () { tile4("botleft"); });
registerShortcut("RCTiler4Top2", "RCTiler4(2) Bot", "Meta+Ctrl+Num+2", function () { tile4("botcenter"); });
registerShortcut("RCTiler4BotRight3", "RCTiler4(3) Bot Right", "Meta+Ctrl+Num+3", function () { tile4("botright"); });
registerShortcut("RCTiler4Left4", "RCTiler4(4) Left", "Meta+Ctrl+Num+4", function () { focus2("left"); });
registerShortcut("RCTiler4Center5", "RCTiler4(5) Center", "Meta+Ctrl+Num+5", function () { focus1(); });
registerShortcut("RCTiler4Right6", "RCTiler4(6) Right", "Meta+Ctrl+Num+6", function () { focus2("right"); });
registerShortcut("RCTiler4TopLeft7", "RCTiler4(7) Top Left", "Meta+Ctrl+Num+7", function () { tile4("topleft"); });
registerShortcut("RCTiler4TopLeft8", "RCTiler4(8) Top", "Meta+Ctrl+Num+8", function () { tile4("topcenter"); });
registerShortcut("RCTiler4TopRight9", "RCTiler4(9) Top Right", "Meta+Ctrl+Num+9", function () { tile4("topright"); });

registerShortcut("RCTiler6Center", "RCTiler6(0) Center", "Meta+Num+0", function () { focus3("centeronly"); });
registerShortcut("RCTiler6BotLeft1", "RCTiler6(1) Bot Left", "Meta+Num+1", function () { tile6("botleft"); });
registerShortcut("RCTiler6Top2", "RCTiler6(2) Bot", "Meta+Num+2", function () { tile6("botcenter"); });
registerShortcut("RCTiler6BotRight3", "RCTiler6(3) Bot Right", "Meta+Num+3", function () { tile6("botright"); });
registerShortcut("RCTiler6Left4", "RCTiler6(4) Left", "Meta+Num+4", function () { focus2("left"); });
registerShortcut("RCTiler6Center5", "RCTiler6(5) Center", "Meta+Num+5", function () { focus1(); });
registerShortcut("RCTiler6Right6", "RCTiler6(6) Right", "Meta+Num+6", function () { focus2("right"); });
registerShortcut("RCTiler6TopLeft7", "RCTiler6(7) Top Left", "Meta+Num+7", function () { tile6("topleft"); });
registerShortcut("RCTiler6TopLeft8", "RCTiler6(8) Top", "Meta+Num+8", function () { tile6("topcenter"); });
registerShortcut("RCTiler6TopRight9", "RCTiler6(9) Top Right", "Meta+Num+9", function () { tile6("topright"); });
