// conf.js
exports.config = {
  // seleniumServerJar: './node_modules/protractor/node_modules/selenium-webdriver/selenium-server-standalone-2.39.0.jar',
  // seleniumServerJar: './node_modules/selenium/lib/runner/selenium-server-standalone-2.20.0.jar',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./test/functional/*.js']
}
