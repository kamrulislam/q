/**
 *  This is a q/promise library
 *
 *  This library mimics functionality of $q service of Angular.js
 *
 *
 */

function Q() {
  if ( !(this instanceof Q) ) {
    return new Q();
  }
  this.value = undefined;
  this.pending = [];
}

Q.prototype.promise = function() {
  var self = this;
  return {
    then: function(callback, errorBack) {
      var result = Q();
      function wrapperCallback(value){
        try{
          result.resolve(((typeof callback === 'function') ? callback : defaultCallback)(value));
        } catch (e) {
          result.reject(e);
        }
      }

      function wrapperErrorBack(error) {
        try {
          result.resolve(((typeof errorBack === 'function') ? errorBack : defaultErrback)(error));
        } catch (e) {
          result.reject(e);
        }
      }
      if (self.pending) {
        self.pending.push([wrapperCallback, wrapperErrorBack]);
      } else {
        self.value.then (wrapperCallback, wrapperErrorBack);
      }
      return result.promise();
    }
  }
};
// this is same as calling Q();
Q.prototype.defer = function() {
  return new Q();
};

/**
 * The method converts val to promise if it's already is not a promise
 * and resolves by resolving this promise. So it ensures all the cascaded promises have benn resolved
 * @param val
 */
Q.prototype.resolve = function(val) {
  if (this.pending) {
    var callbacks = this.pending;
    this.pending = undefined;
    this.value = closureRef(val);
    var self = this;

    if (callbacks.length) {
      setImmediate(function(){
        var callback;
        for (var i = 0, ii = callbacks.length; i < ii; i++) {
          callback = callbacks[i];
          self.value.then(callback[0], callback[1]);
        }
      });
    }
  }
};

Q.prototype.reject = function(error) {
  this.resolve(createInternalRejectedPromise(error));
};




Q.prototype.all = function(promises) {
  var count = 0, results, differed = Q();
  results =  isArray(promises) ? [] : {};
  var keys = Object.keys(promises);
  function runPromise(key) {
    count++;
    closureRef(promises[key] ).then(function(value){
      if (results.hasOwnProperty(key)) return;
      results[key] = value;
      if (!(--count)) differed.resolve(results);
    }, function (error) {
      if (results.hasOwnProperty(key)) return;
      differed.reject(error);
    });

  }
  for (var i = 0, ii = keys.length; i < ii; i++) {
    var key = keys[i];
    runPromise(key);
  }
  if (count === 0) {
    differed.resolve(results);
  }
  return differed.promise();
};


Q.prototype.when = function (value, callback, errorBack) {
  var result = Q(),
      done;
  function wrapperCallback(value){
    try{
      result.resolve(((typeof callback === 'function') ? callback : defaultCallback)(value));
    } catch (e) {
      result.reject(e);
    }
  }

  function wrapperErrorBack(error) {
    try {
      result.resolve(((typeof errorBack === 'function') ? errorBack : defaultErrback)(error));
    } catch (e) {
      result.reject(e);
    }
  }

  setImmediate(function(){
    closureRef(value).then(function(value){
      if (done) return;
      done = true;
      result.resolve(closureRef(value ).then(wrapperCallback, wrapperErrorBack));
    }, function(error) {
      if (done) return;
      done = true;
      result.resolve(wrapperErrorBack(error));
    })
  });

  return result.promise();
};

function closureRef(value) {
  if (value && typeof value.then === 'function') return value;
  return {
    then: function(callback) {
      var result = Q();
      setImmediate(function(){
        result.resolve(callback(value));
      });
      return result.promise();
    }
  }
}


function createInternalRejectedPromise(error) {
  return {
    then: function(callback, errorBack) {
      var result = Q();
      setImmediate(function() {
        try {
          result.resolve(((typeof errorBack === 'function') ? errorBack : defaultErrback)(error));
        } catch(e) {
          result.reject(e);
        }
      });
      return result.promise();
    }
  };
}

var reject = function(reason) {
  var result = Q();
  result.reject(reason);
  return result.promise();
};


function defaultCallback(value) {
  return value;
}


function defaultErrback(reason) {
  return reject(reason);
}

function isArray(arr) {
  return Array.isArray(arr);
}


module.exports = Q;