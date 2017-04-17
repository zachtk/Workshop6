// Import 'Foo'
var TestModule = require('./test_module');
var Foo = TestModule.Foo;
// Import the default export of './test_default_module.js' module.
var Bar = require('./test_default_module');

Foo(); // prints 'I'm Foo!'
Bar(); // prints 'I'm Bar!'
