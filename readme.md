Installation Instructions
=========================

* install node [http://nodejs.org/download/]
* from the project directory, run `npm install`
* install grunt [http://gruntjs.com/installing-grunt]
* install  bower [http://bower.io/]
* install mongodb and start the server [http://docs.mongodb.org/manual/installation/]
   - Ensure that the current schema is `extradb`
* run `bower install`
* run grunt serve
* New Users can be added using Signup link.


Known Issues
============
* Angular $digest already in progress error printed in console:
  - Due to an issue in angular-strap library. Will be fixed in the next build. Please refer: https://github.com/mgcrea/angular-strap/pull/308
  - However, this error will not affect the functionality.