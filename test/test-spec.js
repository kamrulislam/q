var assert = require("assert");
var should = require("should");

var Q = require("../lib");


function promiseWithResolveValue(value) {
    var deferred = Q.defer();
    setTimeout(function () {
        deferred.resolve(value);
    }, 10);
    return deferred.promise();
}

describe("computing sum of integers using promises", function () {
    it("should compute correct result without blowing stack", function (done) {
        var array = [];
        var iters = 1000;
        for (var i = 1; i <= iters; i++) {
            array.push(i);
        }
        var pZero = promiseWithResolveValue(0);
        var result = array.reduce(function (promise, nextVal) {
            return promise.then(function (currentVal) {
                return currentVal + nextVal;
            });
        }, pZero);
        result.then(function (value) {
            assert.equal(value, iters * (iters + 1) / 2);
            done();
        });
    });
});

describe("Q function", function () {

    function promiseWithRejectReason(error) {
        var deferred = Q.defer();
        deferred.reject(error);
        return deferred.promise();
    }

    function prmiseResolveWithPromise() {
        var deferred = Q.defer();
        deferred.resolve(promiseWithResolveValue(7));
        return deferred.promise();
    }

    it("should pass the value to next promise when given a value", function (done) {
        promiseWithResolveValue(5)
            .then(function (value) {
                assert.equal(value, 5);
                done();
            })

    });
    it("should reject with error if promise rejected", function (done) {
        var error = new Error("Opps!!");
        promiseWithRejectReason(error)
            .then(null, function (reason) {
                reason.should.equal(error);
                done();
            })

    });

    it("should resolve with another promise", function (done) {
        prmiseResolveWithPromise()
            .then(function (value) {
                value.should.equal(7);
                done();
            });

    });

});

describe("Multiple promises", function () {
    it("cascading promises", function (done) {
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
            .then(function (value) {
                value.should.equal(string);
                done();
            })
    });

    it("series of promises", function (done) {
        var initValue = 0;
        promiseWithResolveValue(
            initValue
        )
            .then(function (value) {
                return value + 1;
            })
            .then(function (value) {
                return value + 1;
            })
            .then(function (value) {
                return value + 1;
            })
            .then(function (value) {
                value.should.equal(initValue + 3);
                done();
            });
    });


});


describe("Test 'all' function", function () {
    it("resolve multiple promises", function (done) {
        // count 1...1000 in every millisecond
        function promiseA() {
            var deferred = Q.defer(), count = 1;

            function increaseCount() {
                count++;
                if (count == 1000) {
                    deferred.resolve(count);
                }
                callDelayedOperation();
            }

            function callDelayedOperation() {
                setTimeout(increaseCount, 1);
            }

            callDelayedOperation();
            return deferred.promise();
        }

        // count 1...100 in every 10 millisecond
        function promiseB() {
            var deferred = Q.defer(), count = 1, value = 1;

            function increaseCount() {
                count++;
                value += count;
                if (count == 100) {
                    deferred.resolve(value);
                }
                callDelayedOperation();
            }

            function callDelayedOperation() {
                setTimeout(increaseCount, 10);
            }

            callDelayedOperation();
            return deferred.promise();
        }


        Q.all([promiseA(), promiseB()])
            .then(function (values) {
                values.length.should.equal(2);
                values[0].should.equal(1000);
                values[1].should.equal(50 * 101);
                done();
            });
    });

    it("resolve multiple promises with nested promises", function (done) {
        // count 1...1000 in every millisecond
        this.timeout(4000);
        function promiseA() {
            var deferred = Q.defer(), count = 1;

            function increaseCount() {
                count++;
                if (count == 1000) {
                    deferred.resolve(count);
                }
                callDelayedOperation();
            }

            function callDelayedOperation() {
                setTimeout(increaseCount, 1);
            }

            callDelayedOperation();
            return deferred.promise();
        }

        // count 1...100 in every 10 millisecond
        function promiseB() {
            var deferred = Q.defer(), count = 1, value = 1;

            function increaseCount() {
                count++;
                value += count;
                if (count == 100) {
                    deferred.resolve(value);
                }
                callDelayedOperation();
            }

            function callDelayedOperation() {
                setTimeout(increaseCount, 10);
            }

            callDelayedOperation();
            return deferred.promise();
        }


        var promiseC = promiseA()
            .then(function (valueA) {
                return promiseB()
                    .then(function (valueB) {
                        return valueA + valueB;
                    });
            });

        Q.all([promiseA(), promiseB(), promiseC])
            .then(function (values) {
                values.length.should.equal(3);
                values[0].should.equal(1000);
                values[1].should.equal(50 * 101);
                values[2].should.equal(1000 + 50 * 101);
                done();
            });
    });


});

describe("Test 'when' function", function () {
    it("test when with undefined variable", function (done) {
        var a;
        Q.when(a)
            .then(function (value) {
                (typeof value).should.equal('undefined');
                a = 5;
                return 100;
            })
            .then(function (value) {
                value.should.equal(100);
                a.should.equal(5);
                done();
            });
    });

    it("test when with promise", function (done) {
        Q.when(promiseWithResolveValue(7))
            .then(function (value) {
                value.should.equal(7);
                done();
            });
    });

    it("test when with immediate callback", function(done) {
        var a = 10;
        Q.when(a, function(value){
            value.should.equal(10);
            done();
        });
    });

    var err = new Error('Opps!!');
    function throwError(){
        var deferred = Q.defer();
        deferred.reject(err);
        return deferred.promise();
    }

    it("test when with immediate error", function(done) {
        Q.when(err, function(value){
            console.log('right', value);
            value.should.equal(err);
            done();
        });


    });

    it("test when with propagated error", function(done) {
        Q.when(throwError(), function(){
            console.log('I am unreachable!');
        })
            .then(null, function(reason){
                reason.should.equal(err);
                done();
            });


    });

});
