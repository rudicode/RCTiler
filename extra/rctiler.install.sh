#!/bin/bash
# update script
# older version
# plasmapkg2 --type kwinscript -u ~/code/kwin-scripts/RCTiler/
kpackagetool5 --type=KWin/Script -u ~/code/kwin-scripts/RCTiler/

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
