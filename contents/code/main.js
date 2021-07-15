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



//
// Tiling Functions
//

function tileBotLeft() {
    getGeometry();

    if (!client.moveable) { return; }

    var newWidth = screenGeometry.width / 2;
    var newHeight = screenGeometry.height / 2;

    if (client.resizeable) {
        client.geometry = {
            x: screenGeometry.x + xMargin,
            y: screenGeometry.y + newHeight,
            width: newWidth - xMargin,
            height: newHeight
        };
    } else {
        client.geometry = {
            x: screenGeometry.x + xMargin,
            y: screenGeometry.y + newHeight,
            width: client.width,
            height: client.height
        };
    }
}

function tileBotRight() {
    getGeometry();

    if (!client.moveable) { return; }

    var newWidth = screenGeometry.width / 2;
    var newHeight = screenGeometry.height / 2;

    if (client.resizeable) {
        client.geometry = {
            x: screenGeometry.x + newWidth,
            y: screenGeometry.y + newHeight,
            width: newWidth - xMargin,
            height: newHeight
        };
    } else {
        client.geometry = {
            x: screenGeometry.x + newWidth,
            y: screenGeometry.y + newHeight,
            width: client.width,
            height: client.height
        };
    }
}

function tileTopLeft() {
    getGeometry();

    if (!client.moveable) { return; }

    var newWidth = screenGeometry.width / 2;
    var newHeight = screenGeometry.height / 2;

    if (client.resizeable) {
        client.geometry = {
            x: screenGeometry.x + xMargin,
            y: screenGeometry.y,
            width: newWidth - xMargin,
            height: newHeight
        };
    } else {
        client.geometry = {
            x: screenGeometry.x + xMargin,
            y: screenGeometry.y,
            width: client.width,
            height: client.height
        };
    }
}

function tileTopRight() {
    getGeometry();

    if (!client.moveable) { return; }

    var newWidth = screenGeometry.width / 2;
    var newHeight = screenGeometry.height / 2;

    if (client.resizeable) {
        client.geometry = {
            x: screenGeometry.x + newWidth,
            y: screenGeometry.y,
            width: newWidth - xMargin,
            height: newHeight
        };
    } else {
        client.geometry = {
            x: screenGeometry.x + newWidth,
            y: screenGeometry.y,
            width: client.width,
            height: client.height
        };
    }
}

function tileCenterLandscape() {
    getGeometry();

    if (!client.moveable) { return; }

    if (client.resizeable) {
        // center window and scale to % of screenGeometry
        var clientScaleX = 0.6;
        var clientScaleY = 0.6;
        client.geometry = {
          x: screenGeometry.x + (screenGeometry.width - screenGeometry.width * clientScaleX) / 2,
          y: screenGeometry.y + (screenGeometry.height - screenGeometry.height * clientScaleY) / 2,
          width: screenGeometry.width * clientScaleX,
          height: screenGeometry.height * clientScaleY
        };
      } else {
        // only center window
        client.geometry = {
          x: screenGeometry.x + (screenGeometry.width - client.width) / 2,
          y: screenGeometry.y + (screenGeometry.height - client.height) / 2,
          width: client.width,
          height: client.height
        };
      }
}

function tileCenterPortrait() {
    getGeometry();

    if (!client.moveable) { return; }

    if (client.resizeable) {
      // center window and scale to % of screenGeometry
      var clientScaleX = 0.30;
      var clientScaleY = 0.70;
      client.geometry = {
        x: screenGeometry.x + (screenGeometry.width - screenGeometry.width * clientScaleX) / 2,
        y: screenGeometry.y + (screenGeometry.height - screenGeometry.height * clientScaleY) / 2,
        width: screenGeometry.width * clientScaleX,
        height: screenGeometry.height * clientScaleY
      };
    } else {
      // only center window
      client.geometry = {
        x: screenGeometry.x + (screenGeometry.width - client.width) / 2,
        y: screenGeometry.y + (screenGeometry.height - client.height) / 2,
        width: client.width,
        height: client.height
      };
    }
}

function tileRightOfCenter() {
    getGeometry();

    if (!client.moveable) { return; }

    if (client.resizeable) {
      var clientScaleX = 0.30;
      var clientScaleY = 0.70;
      var newX = screenGeometry.x + screenGeometry.width / 2;
      if (newX == client.geometry.x) {
        newX = screenGeometry.width - client.width;
      }
      client.geometry = {
        x: newX,
        y: screenGeometry.y + (screenGeometry.height - screenGeometry.height * clientScaleY) / 2,
        width: screenGeometry.width * clientScaleX,
        height: screenGeometry.height * clientScaleY
      };
    } else {
      // only Right of Center window
      client.geometry = {
        x: screenGeometry.x + screenGeometry.width / 2,
        y: screenGeometry.y + (screenGeometry.height - client.height) / 2,
        width: client.width,
        height: client.height
      };
    }
}

function tileLeftOfCenter() {
    getGeometry();

    if (!client.moveable) { return; }

    if (client.resizeable) {
      var clientScaleX = 0.30;
      var clientScaleY = 0.70;
      var newX = (screenGeometry.x + (screenGeometry.width / 2)) - client.width;
      if (newX == client.geometry.x) {
        newX = screenGeometry.x;
      }
      client.geometry = {
        x: newX,
        y: screenGeometry.y + (screenGeometry.height - screenGeometry.height * clientScaleY) / 2,
        width: screenGeometry.width * clientScaleX,
        height: screenGeometry.height * clientScaleY
      };
    } else {
      // only Left of Center window
      client.geometry = {
        x: screenGeometry.x + (screenGeometry.width / 2) - client.width,
        y: screenGeometry.y + (screenGeometry.height - client.height) / 2,
        width: client.width,
        height: client.height
      };
    }
}



// Register Shortcuts

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

registerShortcut("RCTilerCenterPortrait5", "RCTiler Center Portrait", "Meta+Num+5", function () {
    tileCenterPortrait();
});

registerShortcut("RCTilerCenterLandscape2", "RCTiler Center Landscape", "Meta+Num+2", function () {
    tileCenterLandscape();
});

registerShortcut("RCTilerRightOfCenter6", "RCTiler Right of Center", "Meta+Num+6", function () {
    tileRightOfCenter();
});

registerShortcut("RCTilerLeftOfCenter4", "RCTiler Left of Center", "Meta+Num+4", function () {
    tileLeftOfCenter();
});
