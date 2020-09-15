# InstaAx

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

InstaAx is instagram API's data getter and sender.

  - Upload Image.
  - Delete Image.
  - Get All Images From Tags.

### SETUP

InstaAx requires [Node.js](https://nodejs.org/) v12.18.0+ to run.

### Install the dependencies.

```sh
$ cd instaax
$ npm install
```

### .env doc edit and go.
```sh
###USER OPTIONS
COOKIE=PUT YOUR INSTAGRAM COOKIE
CAPTION=PUT YOUR CAPTION

###GET TAG IMAGES VARIABLES (API codes for extracting data from tags.)
QUERY_HASH=PUT YOUR QUERY HASH
TAG_NAME=PUT YOUR TAG NAME
CURSOR=PUT YOUR CURSOR

###LOCATION (CURRENT LOCATION : TURKEY/KONYA <3) (To add locations to posts.)
LAT=37.863
LNG=32.4811
FACEBOOK_PLACES_ID=110738488953456
```

### Start the InstaAx!

```sh
$ npm start
```

### Todos

 - Write more API's.
 - Edit callback problems.
 - Instagram login and cookie getter.

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
