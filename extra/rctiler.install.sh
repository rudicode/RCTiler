#!/bin/bash
# install script used during development but can also be used to install
# the plugin.

# change to root of project
cd $(dirname "${BASH_SOURCE[0]}")
cd ..
source_dir=$(pwd)
echo "source_dir: $source_dir"

# older version
# plasmapkg2 --type kwinscript -u $source_dir

# newer versions
kpackagetool5 --type=KWin/Script -u $source_dir

# Disable plugin to take effect
kwriteconfig5 --file kwinrc --group Plugins --key RCTilerEnabled false
qdbus-qt5 org.kde.KWin /KWin reconfigure
# pause so that the reconfigure command takes effect
sleep 0.5

# Enable plugin to take effect
kwriteconfig5 --file kwinrc --group Plugins --key RCTilerEnabled true
qdbus-qt5 org.kde.KWin /KWin reconfigure

# if you changed the shortcut keys they may not take effect right away if the same keys were already defined.
# edit ~/.config/kglobalshortcutsrc and remove any conflicting entries.
# you may need to logout and then edit that above file and then log back in.
#
