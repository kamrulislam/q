# q-ng [![Build Status](https://secure.travis-ci.org/kamrulislam/q.png?branch=master)](http://travis-ci.org/kamrulislam/q)

Inspired by angular's $q service, a q/promise library for node.

## Getting Started
Install the module with: `npm install q-ng`

```javascript
var Q = require('q-ng');

function testQ(value) {
	var deferred = Q.defer();
	setTimeout(function(){
      deferred.resolve(value);
	}, 1000);
	return deferred.promise();
}

testQ(5)
.then(function(value){
	console.log(value);
});

// this outputs: 5
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Md Kamrul Islam
Licensed under the MIT license.

