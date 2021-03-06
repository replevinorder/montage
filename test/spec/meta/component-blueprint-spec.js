/* <copyright>
 </copyright> */
var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;
var Component = require("montage/ui/component").Component;
var Selector = require("montage/core/selector").Selector;
var Blueprint = require("montage/core/meta/blueprint").Blueprint;
var Promise = require("montage/core/promise").Promise;
var Serializer = require("montage/core/serialization/serializer/montage-serializer").MontageSerializer;

TestPageLoader.queueTest("component-blueprint-test/component-blueprint-test", function (testPage) {
    describe("meta/component-blueprint-spec", function () {
        var component1;
        var component2;
        var component3;


        beforeEach(function () {
            component1 = testPage.test.component1;
            component2 = testPage.test.component2;
            component3 = testPage.test.component3;
        });

        it("can create new blueprint", function (done) {
            var newBlueprint = new Blueprint().initWithName(component1.identifier);
            component1.blueprint = newBlueprint;
            var blueprintPromise = component1.blueprint;
            blueprintPromise.then(function (blueprint) {
                expect(newBlueprint).toBeDefined();
                expect(blueprint).toBe(newBlueprint);
            }).finally(function () {
                done();
            });
        });

        it("can create new property blueprint", function (done) {
            var newBlueprint = new Blueprint().initWithName(component1.identifier);
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty");
            component1.blueprint = newBlueprint;
            var blueprintPromise = component1.blueprint;
            blueprintPromise.then(function (blueprint) {
                var propertyBlueprint = blueprint.propertyDescriptorForName("bindableProperty");
                expect(propertyBlueprint).toBeDefined();
            }).finally(function () {
                done();
            });
        });

        it("can serialize the component blueprint", function (done) {
            var serializer = new Serializer().initWithRequire(require);

            var newBlueprint = new Blueprint().initWithName(component1.identifier);
            //
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty1");
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty2");
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty3");
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty4");
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty5");
            //
            newBlueprint.addEventDescriptorNamed("action");
            //
            newBlueprint.addPropertyDescriptorToGroupNamed(newBlueprint.addToOnePropertyDescriptorNamed("requiredBindableProperty1"), "required");
            newBlueprint.addPropertyDescriptorToGroupNamed(newBlueprint.addToOnePropertyDescriptorNamed("requiredBindableProperty2"), "required");
            newBlueprint.addPropertyDescriptorToGroupNamed(newBlueprint.addToOnePropertyDescriptorNamed("requiredBindableProperty3"), "required");
            component1.blueprint = newBlueprint;

            var blueprintPromise = component1.blueprint;
            blueprintPromise.then(function (blueprint) {
                var serializedDescription = serializer.serializeObject(blueprint);
                expect(serializedDescription).toBeTruthy();
            }).finally(function () {
                done();
            });
        });

        xit("can load the component blueprint from the reel", function (done) {
            var blueprintPromise = component2.blueprint;
            blueprintPromise.then(function (blueprint) {
                expect(blueprint).toBeTruthy();
                // TODO test look weird requiredBindableProperty1 vs bindableProperty1
                expect(blueprint.propertyDescriptorForName("bindableProperty1")).toBeTruthy();
                expect(blueprint.propertyDescriptorForName("required")).toBeTruthy();
            }).finally(function () {
                done();
            });
        });


        it("can create validation rules", function (done) {
            var serializer = new Serializer().initWithRequire(require);

            var newBlueprint = new Blueprint().initWithName(component3.identifier);
            expect(newBlueprint).toBeTruthy();
            //
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty1");
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty2");
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty3");
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty4");
            newBlueprint.addToOnePropertyDescriptorNamed("bindableProperty5");
            //
            newBlueprint.addPropertyDescriptorToGroupNamed(newBlueprint.addToOnePropertyDescriptorNamed("requiredBindableProperty1"), "required");
            newBlueprint.addPropertyDescriptorToGroupNamed(newBlueprint.addToOnePropertyDescriptorNamed("requiredBindableProperty2"), "required");
            newBlueprint.addPropertyDescriptorToGroupNamed(newBlueprint.addToOnePropertyDescriptorNamed("requiredBindableProperty3"), "required");

            newBlueprint.addPropertyValidationRule("rule1").validationSelector = null;
            //            newBlueprint.addPropertyValidationRule("rule1").validationSelector = Selector.property("requiredBindableProperty1").isBound;
            //            newBlueprint.addPropertyValidationRule("rule2").validationSelector = Selector.property("requiredBindableProperty2").isBound;
            //            newBlueprint.addPropertyValidationRule("rule3").validationSelector = Selector.property("requiredBindableProperty3").isBound;

            component3.blueprint = newBlueprint;

            var blueprintPromise = component3.blueprint;
            blueprintPromise.then(function (blueprint) {
                expect(blueprint).toBeTruthy();
                var serializedDescription = serializer.serializeObject(blueprint);
                expect(serializedDescription).toBeTruthy();
            }).finally(function () {
                done();
            });
        });

        describe("test converter blueprint", function () {
            var component = new Component();

            it("should exist", function (done) {
                var blueprintPromise = component.blueprint;
                blueprintPromise.then(function (blueprint) {
                    expect(blueprint).toBeTruthy();
                }).finally(function () {
                    done();
                });
            });

            it("should have element property blueprint", function (done) {
                var blueprintPromise = component.blueprint;
                blueprintPromise.then(function (blueprint) {
                    var propertyBlueprint = blueprint.propertyDescriptorForName("element");
                    expect(propertyBlueprint).toBeTruthy();
                    expect(propertyBlueprint.valueType).toBe("string");
                    expect(propertyBlueprint.readOnly).toBe(true);
                }).finally(function () {
                    done();
                });
            });

            it("should have identifier property blueprint", function (done) {
                var blueprintPromise = component.blueprint;
                blueprintPromise.then(function (blueprint) {
                    var propertyBlueprint = blueprint.propertyDescriptorForName("identifier");
                    expect(propertyBlueprint).toBeTruthy();
                    expect(propertyBlueprint.valueType).toBe("string");
                }).finally(function () {
                    done();
                });
            });

        });

    });

});
