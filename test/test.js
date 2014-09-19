/**
 * Created by kamrulislam on 19/09/2014.
 */

var Q = require( "../lib" );


function doSomething(which) {
  var differed = Q().differ();
  setTimeout( function () {
    var value = 1;
    console.log( which, value );
    differed.resolve( {which: which, value:value} );
  }, 1 );

  return differed.promise();
}

doSomething('A')
  .then( function ( result ) {
    result.value++;
    console.log(result.which, result.value );
    return result;
  }, function(reason) {
    console.log('error 1', reason);
  } )
  .then( function ( result ) {
    result.value++;
    console.log(result.which, result.value );
    return result;
  }, function(reason) {
    console.log('error 2', reason);
  } )
  .then(function(result){
    console.log('again', result.which, result.value);
  }, function(reason){
    console.log('error 3', reason);
  });


doSomething('B')
  .then( function ( result ) {
    result.value++;
    console.log( result.which, result.value );
    return JSON.parse("<div>uh oh, this is not JSON at all!</div>");
  }, function(reason) {
    console.log('error 1', reason);
  } )
  .then( function ( result ) {
    if (result) {
      result.value++;
      console.log( result.which, result.value );
    }

    return result;
  }, function(reason) {
    console.log('error 2', reason);
  } )
  .then(function(result){
    console.log("B 3");
    if (result) {
      console.log('here', result.value);
    }

  }, function(reason){
    console.log('error 3', reason);
  });


var promiseA = function() {
  var differed = Q();
  setTimeout(function(){
    console.log('promiseA');
    differed.resolve(1);
  }, 2);

  return differed.promise();
};


var promiseB = function() {
  var differed = Q();
  setTimeout(function(){
    console.log('promiseB');
    differed.resolve(2);
  }, 1);

  return differed.promise();
};

Q().all([promiseA(), promiseB()])
  .then(function(results){
     console.log('all resolved', results);
  });