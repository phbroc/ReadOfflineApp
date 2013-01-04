Read offline app
=========================================

This repository contains the code of the web app readOfflineApp.

The webapp readOfflineApp is written for HTML5 website. The purpose is to store 
the content of pages in localStorage and appcache of the mobile device, on demand.
When the user go offline, the website redirects to the offline page, where all cached
articles can be retrieved. All the code is client executed.

Demo site
---------

You can see it in action in this demo site : http://readofflineapp.phbroc.fr

Installation
------------

The files are meant to be run on a website, provided that manifest.appcache files are 
served with the following content type : text/cache-manifest

License
-------

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. This program
is a free software under license [LGPL v3][1].
    
Some pieces of javascript code were inspired by previous developpement 
of Adrian Kosmaczewski Copyright (c) 2012 Adrian Kosmaczewski. 
    
JQuery source code is under [MIT license][2].
	
[1]:http://www.gnu.org/licenses/lgpl.html
[2]:https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
    