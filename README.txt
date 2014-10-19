A simple seed project using the following stack:

-web server: node
-packaging/dependency management: npm, gulp, bower
-style: sass
-client-side MVC: angular

Doing the protractor tests (no gulp task yet):
(Note: Have to run both server AND webdriver)

webdriver-manager update
node server.js
webdriver-manager start
protractor protractor.conf.js
