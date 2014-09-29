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
_(example of 'all' function)_

```javascript
var promiseA = function () {
    var differed = Q.defer();
    setTimeout(function () {
        console.log('promiseA');
        differed.resolve(1);
    }, 2);

    return differed.promise();
};


var promiseB = function () {
    var differed = Q.defer();
    setTimeout(function () {
        console.log('promiseB');
        differed.resolve(2);
    }, 1);

    return differed.promise();
};

Q.all([promiseA(), promiseB()])
    .then(function (results) {
        console.log('all resolved', results);
    });

// output: all resolved [ 1, 2 ]
```

_(example of 'when' function)_

```javascript
function justAValue() {
	var a = 10;
    // do something and return a value
	return a;
}

// value available at the same promise
Q.when(justAValue(), function (value){
	console.log('resolved with the value ', value);
	//output: resolved with the value  10
});
    
// or in the next promise
Q.when(justAValue())
.then(function (value){
	console.log('resolved with the value in next promise', value);
	resolved with the value in next promise 10
});

//same goes with promises
// value available at the same promise
Q.when(promiseA(), function (value){
	console.log('resolved with the value ', value);
	//output: resolved with the value  1
});
    
// or in the next promise
Q.when(promiseA())
.then(function (value){
	console.log('resolved with the value in next promise', value);
	//resolved with the value in next promise 1
});



```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Md Kamrul Islam
Licensed under the MIT license.

