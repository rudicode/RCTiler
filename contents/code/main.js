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
// Utility Functions
//

var client;
var screenGeometry;
var xMargin = 5;

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

function tileBotLeft() {
    getGeometry();

    var newWidth = screenGeometry.width / 2;
    var newHeight = screenGeometry.height / 2;

    move(screenGeometry.x + xMargin, screenGeometry.y + newHeight);
    resize(newWidth - xMargin, newHeight);
}

function tileBotRight() {
    getGeometry();

    var newWidth = screenGeometry.width / 2;
    var newHeight = screenGeometry.height / 2;

    move(screenGeometry.x + newWidth, screenGeometry.y + newHeight);
    resize(newWidth - xMargin, newHeight);
}

function tileTopLeft() {
    getGeometry();

    var newWidth = screenGeometry.width / 2;
    var newHeight = screenGeometry.height / 2;

    move(screenGeometry.x + xMargin, screenGeometry.y);
    resize(newWidth - xMargin, newHeight);
}

function tileTopRight() {
    getGeometry();

    var newWidth = screenGeometry.width / 2;
    var newHeight = screenGeometry.height / 2;

    move(screenGeometry.x + newWidth, screenGeometry.y);
    resize(newWidth - xMargin, newHeight);
}

function tileCenterLandscape() {
    getGeometry();

    var clientScaleX = 0.6;
    var clientScaleY = 0.70;
    resize(screenGeometry.width * clientScaleX, screenGeometry.height * clientScaleY);

    var newX = screenGeometry.x + (screenGeometry.width - client.width) / 2;
    var newY = screenGeometry.y + (screenGeometry.height - client.height) / 2;
    move(newX, newY);
}

function tileCenterPortrait() {
    getGeometry();
    // var clientScaleX = 0.34;
    // var clientScaleY = 0.60;
    var newWidth = (screenGeometry.width - xMargin * 2) / 3;
    var newHeight = screenGeometry.height * 0.60;
    // resize(screenGeometry.width * clientScaleX, screenGeometry.height * clientScaleY);
    resize(newWidth, newHeight);

    var newX = screenGeometry.x + (screenGeometry.width - client.width) / 2;
    var newY = screenGeometry.y + (screenGeometry.height - client.height) / 2;
    move(newX, newY);
}

function tileRightOfCenter() {
    getGeometry();
    var clientScaleX = 0.34;
    var clientScaleY = 0.60;
    var newWidth = screenGeometry.width * clientScaleX;
    resize(newWidth, screenGeometry.height * clientScaleY);

    var centerX = screenGeometry.x + (screenGeometry.width - client.width) / 2;
    var newX = centerX + client.width
    var newY = screenGeometry.y + (screenGeometry.height - client.height) / 2;
    if ((newX == client.geometry.x) ) {
            newX = screenGeometry.width - client.width - xMargin;
    }
    move(newX, newY);
}

function tileLeftOfCenter() {
    getGeometry();
    var clientScaleX = 0.34;
    var clientScaleY = 0.60;
    var newWidth = screenGeometry.width * clientScaleX;
    resize(newWidth, screenGeometry.height * clientScaleY);

    var centerX = screenGeometry.x + (screenGeometry.width - client.width) / 2;
    var newX = centerX - client.width;
    var newY = screenGeometry.y + (screenGeometry.height - client.height) / 2;
    if (newX == client.geometry.x) {
        newX = screenGeometry.x + xMargin;
    }
    move(newX, newY);
}


//
// Register Shortcuts
//

registerShortcut("RCTilerBotLeft1", "RCTiler Bot Left", "Meta+Num+1", function () {
    tileBotLeft();
});

registerShortcut("RCTilerBotRight3", "RCTiler Bot Right", "Meta+Num+3", function () {
    tileBotRight();
});

registerShortcut("RCTilerTopLeft7", "RCTiler Top Left", "Meta+Num+7", function () {
    tileTopLeft();
});

registerShortcut("RCTilerTopRight9", "RCTiler Top Right", "Meta+Num+9", function () {
    tileTopRight();
});

registerShortcut("RCTilerCenterPortrait5", "RCTiler Center-Portrait", "Meta+Num+5", function () {
    tileCenterPortrait();
});

registerShortcut("RCTilerCenterLandscape2", "RCTiler Center-Landscape", "Meta+Num+2", function () {
    tileCenterLandscape();
});

registerShortcut("RCTilerRightOfCenter6", "RCTiler Right of Center", "Meta+Num+6", function () {
    tileRightOfCenter();
});

registerShortcut("RCTilerLeftOfCenter4", "RCTiler Left of Center", "Meta+Num+4", function () {
    tileLeftOfCenter();
});
