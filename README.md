RCTiler
=======

Script to handle tiling windows on large resolution screens. Developed on 50" monitor (3840x2160 4k)

The tiler currently has 2 modes (Tile4 and Tile6), which split the screen into 4 or 6 sections.

The shortcuts are all positioned around the numberpad.
You canswitch between modes anytime using Meta+Num+/ , Meta+Num+*

Tile4 mode
----------
```
( Meta+Num+/ ) to select Tile4 mode
Tile4 - place windows in one of 4 quarants

( Meta+Num+1 ,  Meta+Num+3 , Meta+Num+7 , Meta+Num+9 )
+-----+-----+
| 7   |   9 |
+-----+-----+
| 1   |   3 | split percentage of lower window (default 50%)
+-----+-----+

Focus1 - place window in center and cycle between resize Landscape and Portrait
( Meta+Num+5 )
+-----+-----+
|  +--|--+  |
+  |  5  |  +
|  +--|--+  |
+-----+-----+

( Meta+Num+8 ) resize to half_screen_height keep screen aspect ratio, place in x-center
               and y to top
( Meta+Num+2 ) resize to half_screen_height keep screen aspect ratio, place in x-center
               and y to bot
+--+-----+--+
|  |  8  |  |
|  +-----+  |
|  |  2  |  |
+--+-----+--+

Focus2 - resize (portrait) and place window left or right of center line
( Meta+Num+4 ,  Meta+Num+6 )
+-----+-----+
|  +--|--+  |
+  |4 | 6|  +
|  +--|--+  |
+-----+-----+

( Meta+Num+0 ) Center Window Only

```

Tile6 mode
----------
```
( Meta+Num+* ) to select Tile6 mode
Tile6 - place windows on 3x2 grid

( Meta+Num+1 ,  Meta+Num+2 , Meta+Num+3 , Meta+Num+7 , Meta+Num+8 , Meta+Num+9 )
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 1 | 2 | 3 | split percentage of lower window (default 55%)
+---+---+---+

Focus1 - place window in center and cycle resize Landscape and Portrait
( Meta+Num+5 )
+---+---+---+
|  +--|--+  |
+  |  5  |  +
|  +--|--+  |
+---+---+---+

Focus2 - resize (portrait) and place window left or right of center line
( Meta+Num+4 ,  Meta+Num+6 )
+-----+-----+
|  +--|--+  |
+  |4 | 6|  +
|  +--|--+  |
+-----+-----+

( Meta+Num+0 ) Center Window Only

```
