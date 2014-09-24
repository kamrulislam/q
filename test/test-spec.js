var assert = require( "assert" );
var should = require( "should" );

var Q = require( "../lib" );


function promiseWithResolveValue( value ) {
  var deferred = Q.defer();
  deferred.resolve( value );
  return deferred.promise();
}

describe( "computing sum of integers using promises", function () {
  it( "should compute correct result without blowing stack", function ( done ) {
    var array = [];
    var iters = 1000;
    for ( var i = 1; i <= iters; i++ ) {
      array.push( i );
    }
    var pZero = promiseWithResolveValue( 0 );
    var result = array.reduce( function ( promise, nextVal ) {
      return promise.then( function ( currentVal ) {
        return currentVal + nextVal;
      } );
    }, pZero );
    result.then( function ( value ) {
      assert.equal( value, iters * (iters + 1) / 2 );
      done();
    } );
  } );
} );

describe( "Q function", function () {

  function promiseWithRejectReason( error ) {
    var deferred = Q.defer();
    deferred.reject( error );
    return deferred.promise();
  }

  function prmiseResolveWithPromise() {
    var deferred = Q.defer();
    deferred.resolve( promiseWithResolveValue( 7 ) );
    return deferred.promise();
  }

  it( "should pass the value to next promise when given a value", function ( done ) {
    promiseWithResolveValue( 5 )
      .then( function ( value ) {
        assert.equal( value, 5 );
        done();
      } )

  } );
  it( "should reject with error if promise rejected", function ( done ) {
    var error = new Error( "Opps!!" );
    promiseWithRejectReason( error )
      .then( null, function ( reason ) {
        reason.should.equal( error );
        done();
      } )

  } );

  it( "should resolve with another promise", function ( done ) {
    prmiseResolveWithPromise()
      .then( function ( value ) {
        value.should.equal( 7 );
        done();
      } );

  } );

} );

describe( "Multiple promises", function () {
  it( "cascading promises", function ( done ) {
    var string = '6 functions cascaded';
    promiseWithResolveValue(
      promiseWithResolveValue(
        promiseWithResolveValue(
          promiseWithResolveValue(
            promiseWithResolveValue(
              promiseWithResolveValue(
                string
              )
            )
          )
        )
      )
    )
      .then( function ( value ) {
        value.should.equal( string );
        done();
      } )
  } );

  it( "series of promises", function ( done ) {
    var initValue = 0;
    promiseWithResolveValue(
      initValue
    )
      .then( function ( value ) {
        return value + 1;
      } )
      .then( function ( value ) {
        return value + 1;
      } )
      .then( function ( value ) {
        return value + 1;
      } )
      .then( function ( value ) {
        value.should.equal( initValue + 3 );
        done();
      } );
  } );


} );
