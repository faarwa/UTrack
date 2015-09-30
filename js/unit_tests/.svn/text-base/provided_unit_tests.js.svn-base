'use strict';

var expect = chai.expect;
describe('First unit test', function() {

    it('Some tests', function() {
        /*
         We're using Mocha and Chai to do unit testing.

         Mocha is what sets up the tests (the "describe" and "it" portions), while
         Chai does the assertion/expectation checking.

         Links:
         Mocha: http://mochajs.org
         Chai: http://chaijs.com

         Note: This is a bunch of tests in one it; you'll probably want to separate them
         out into separate groups to make debugging easier. It's also more satisfying
         to see a bunch of unit tests pass on the results page :)
        */

        // Here is the most basic test you could think of:
        expect(1==1, '1==1').to.be.ok;

        // You can also for equality:
        expect(1, '1 should equal 1').to.equal(1);

        // JavaScript can be tricky with equality tests
        expect(1=='1', "1 should == '1'").to.be.true;

        // Make sure you understand the differences between == and ===
        expect(1==='1', "1 shouldn't === '1'").to.be.false;

        // Use eql for deep comparisons
        expect([1] == [1], "[1] == [1] should be false because they are different objects").to.be.false;

        expect([1], "[1] eqls [1] should be true").to.eql([1]);
    });

    it('Callback demo unit test', function() {
        /*
        Suppose you have a function or object that accepts a callback function,
        which should be called at some point in time (like, for example, a model
        that will notify listeners when an event occurs). Here's how you can test
        whether the callback is ever called.
         */

        // First, we'll create a function that takes a callback, which the function will
        // later call with a single argument. In tests below, we'll use models that
        // take listeners that will be later called
        var functionThatTakesCallback = function(callbackFn) {
            return function(arg) {
                callbackFn(arg);
            };
        };

        // Now we want to test if the function will ever call the callbackFn when called.
        // To do so, we'll use Sinon's spy capability (http://sinonjs.org/)
        var spyCallbackFn = sinon.spy();

        // Now we'll create the function with the callback
        var instantiatedFn = functionThatTakesCallback(spyCallbackFn);

        // This instantiated function should take a single argument and call the callbackFn with it:
        instantiatedFn("foo");

        // Now we can check that it was called:
        expect(spyCallbackFn.called, 'Callback function should be called').to.be.ok;

        // We can check the number of times called:
        expect(spyCallbackFn.callCount, 'Number of times called').to.equal(1);

        // And we can check that it got its argument correctly:
        expect(spyCallbackFn.calledWith('foo'), 'Argument verification').to.be.true;

        // Or, equivalently, get the first argument of the first call:
        expect(spyCallbackFn.args[0][0], 'Argument verification 2').to.equal('foo');

        // This should help you understand the listener testing code below
    });

    it('Listener unit test for GraphModel', function() {
        var graphModel = new GraphModel();
        var firstListener = sinon.spy();

        graphModel.addListener(firstListener);
        graphModel.selectGraph("MyGraph");

        expect(firstListener.called, 'GraphModel listener should be called').to.be.ok;
        expect(firstListener.calledWith('MyGraph'), 'GraphModel argument verification').to.be.true;

        var secondListener = sinon.spy();
        graphModel.addListener(secondListener);
        graphModel.selectGraph("OtherGraph");
        expect(firstListener.callCount, 'GraphModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "GraphModel second listener should have been called").to.be.ok;
    });

    it('Adding data point test listener for ActivityStoreModel', function() {
        var dataModel = new ActivityStoreModel();
        var firstListener = sinon.spy();
        var dataPoint = new ActivityData("Writing Code", {"stress":5}, 10);
        dataModel.addListener(firstListener);
        dataModel.addActivityDataPoint(dataPoint);

        expect(firstListener.called, 'DataModel first listener should have been called').to.be.ok;
    });

    it('Adding data point to data model and check test', function() {
        var dataModel = new ActivityStoreModel();
        var dataPoint = new ActivityData("Writing Code", {"stress":5}, 10);

        expect(dataModel.dataPoints.length, "There shouldn't be any data points in the data model").to.equal(0);

        dataModel.addActivityDataPoint(dataPoint);
        expect(dataModel.dataPoints.length, "There should be one data point").to.be.equal(1);
    });

    it('Removing data point should inform listener', function() {
        var dataModel = new ActivityStoreModel();
        var dataPoint = new ActivityData("Writing Code", {"stress":5}, 10);
        var listener = sinon.spy();

        dataModel.addListener(listener);
        dataModel.addActivityDataPoint(dataPoint);
        dataModel.removeActivityDataPoint(dataPoint);

        expect(listener.called, 'ActivityDataModel listener should have been called').to.be.ok;
        expect(listener.callCount, 'ActivityStoreModel listener should have been called twice').to.equal(2);
    });

    it('Removing non-existing data point should not inform listener', function() {
        var dataModel = new ActivityStoreModel();
        var dataPoint = new ActivityData("Writing Code", {"stress":5}, 10);
        var dataPoint2 = new ActivityData("Writing Code", {"energy":5}, 10);
        var listener = sinon.spy();

        dataModel.addListener(listener);
        dataModel.addActivityDataPoint(dataPoint);
        dataModel.removeActivityDataPoint(dataPoint2);

        expect(listener.called, 'ActivityDataModel listener should have been called').to.be.ok;
        expect(listener.callCount, 'ActivityStoreModel listener should have been called once when added, but not a second time').to.equal(1);
    });

    it('Get correct number of data points in getter method', function() {
        var dataModel = new ActivityStoreModel();
        var dataPoint = new ActivityData("Writing Code", {"stress":5}, 10);
        var dataPoint2 = new ActivityData("Writing Code", {"happiness":5}, 10);
        var dataPoint3 = new ActivityData("Writing Code", {"energy":5}, 10);

        dataModel.addActivityDataPoint(dataPoint);
        dataModel.addActivityDataPoint(dataPoint2);
        dataModel.addActivityDataPoint(dataPoint3);
        var points = dataModel.getActivityDataPoints();

        expect(points.length, 'ActivityDataModel should have returned 3 points').to.equal(3);
    });

    
});
