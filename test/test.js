/**
 * Created by kamrulislam on 19/09/2014.
 */



function doSomething() {
  var Q = require( "../lib" );
  var differed = Q();
  setTimeout( function () {
    var value = 1;
    console.log( value );
    differed.resolve( value );
  }, 1 );

  return differed.promise();
}

doSomething()
  .then( function ( value ) {
    value++;
    console.log( value );
    return JSON.parse("<div>uh oh, this is not JSON at all!</div>");
  }, function(reason) {
    console.log('error 1', reason);
  } )
  .then( function ( value ) {
    value++;
    console.log( value );
    return value;
  }, function(reason) {
    console.log('error 2', reason);
  } )
  .then(function(value){
    console.log('here', value);
  }, function(reason){
    console.log('error 3', reason);
  });
