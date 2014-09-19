/**
 *  This is a q/promise library
 *
 *
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
Q.prototype.differ = function() {
  return this;
};

Q.prototype.resolve = function(val) {
  if (this.pending) {
    var callbacks = this.pending;
    this.pending = undefined;
    this.value = closureRef(val);
    var self = this;

    if (callbacks.length) {
      process.nextTick(function(){
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


function closureRef(value) {
  if (value && typeof value.then === 'function') return value;
  return {
    then: function(callback) {
      var result = Q();
      process.nextTick(function(){
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
      process.nextTick(function() {
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


module.exports = Q;