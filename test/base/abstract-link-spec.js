var Montage = require("montage").Montage,
    AbstractLink = require("montage/ui/base/abstract-link").AbstractLink,
    MockDOM = require("mocks/dom");

describe("test/base/abstract-link-spec", function () {

    describe("creation", function () {
        it("cannot be instantiated directly", function () {
            expect(function () {
                AbstractLink.create();
            }).toThrow();
        });

        it("can be instantiated as a subtype", function () {
            var LinkSubtype = Montage.create(AbstractLink, {});
            var aLinkSubtype = null;
            expect(function () {
                aLinkSubtype = LinkSubtype.create();
            }).not.toThrow();
            expect(aLinkSubtype).toBeDefined();
        });
    });

    describe("properties", function () {
        var Link = Montage.create(AbstractLink, {}),
            aLink;

        beforeEach(function () {
            aLink = Link.create();
            aLink.element = MockDOM.element();
        });

        describe("enabled", function () {
            beforeEach(function () {
                aLink = Link.create();
                aLink.element = MockDOM.element();
                aLink.checked = false;
                aLink.prepareForActivationEvents();
            });

            it("should not dispatch an action event when enabled is false and PressComposer fires a press", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.type).toEqual("action");
                });
                aLink.addEventListener("action", callback, false);
                aLink.enabled = false;

                aLink._pressComposer.dispatchEventNamed("pressStart");
                aLink._pressComposer.dispatchEventNamed("press");

                expect(callback).not.toHaveBeenCalled();
            });

            it("should add the corresponding class name to classList when enabled is false", function() {
                aLink.enabled = false;

                expect(aLink.classList.contains("montage--disabled")).toBe(true);
            });
        });

        describe("active", function () {
            beforeEach(function () {
                aLink = Link.create();
                aLink.element = MockDOM.element();
                aLink.checked = false;
                aLink.prepareForActivationEvents();
            });

            it("should be true when the PressComposer fires a pressStart", function() {
                aLink._pressComposer.dispatchEventNamed("pressStart");
                expect(aLink.active).toBe(true);
            });

            it("should be false when the PressComposer fires a pressStart + press", function() {
                aLink._pressComposer.dispatchEventNamed("pressStart");
                aLink._pressComposer.dispatchEventNamed("press");
                expect(aLink.active).toBe(false);
            });

            it("should be false when the PressComposer fires a pressStart + press while checked", function() {
                aLink.checked = true;

                aLink._pressComposer.dispatchEventNamed("pressStart");
                aLink._pressComposer.dispatchEventNamed("press");

                expect(aLink.active).toBe(false);
            });

            it("should be false when the PressComposer fires a pressStart + pressCancel", function() {
                aLink._pressComposer.dispatchEventNamed("pressStart");
                aLink._pressComposer.dispatchEventNamed("pressCancel");
                expect(aLink.active).toBe(false);
            });

            it("should add the corresponding class name to classList when active", function() {
                aLink.active = true;

                expect(aLink.classList.contains("montage--active")).toBe(true);
            });
        });
    });

    describe("draw", function () {
        var Link = Montage.create(AbstractLink, {}),
            aLink;

        beforeEach(function () {
            aLink = Link.create();
            aLink.element = MockDOM.element();
        });

        it("should be requested after enabled state is changed", function () {
            aLink.enabled = ! aLink.enabled;
            expect(aLink.needsDraw).toBeTruthy();
        });

        it("should be requested after active is changed", function () {
            aLink.active = true;
            expect(aLink.needsDraw).toBeTruthy();
        });

        it("should be requested when src is changed", function() {
            aLink.src = "http://montagejs.org/";
            expect(aLink.needsDraw).toBeTruthy();
        });

        it("should be requested when label is changed", function() {
            aLink.label = "MontageJS";
            expect(aLink.needsDraw).toBeTruthy();
        });
    });

    describe("events", function () {
        var Link = Montage.create(AbstractLink, {}),
            aLink, anElement, listener;

        beforeEach(function () {
            aLink = Link.create();
            anElement = MockDOM.element();
            listener = {
                handleEvent: function() {}
            };
        });

        it("should listen for press only after prepareForActivationEvents", function() {
            var listeners,
                em = aLink.eventManager;

            listeners = em.registeredEventListenersForEventType_onTarget_("press", aLink);

            expect(listeners).toBeNull();

            aLink.prepareForActivationEvents();

            listeners = em.registeredEventListenersForEventType_onTarget_("press", aLink._pressComposer);
            expect(listeners[aLink.uuid].listener).toBe(aLink);
        });

        describe("once prepareForActivationEvents is called", function () {
            beforeEach(function () {
                aLink.prepareForActivationEvents();
            });
            it("should fire an 'action' event when the PressComposer fires a pressStart + press", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.type).toEqual("action");
                });
                aLink.addEventListener("action", callback, false);

                aLink._pressComposer.dispatchEventNamed("pressStart");
                aLink._pressComposer.dispatchEventNamed("press");

                expect(callback).toHaveBeenCalled();
            });

            it("should not fire an 'action' event when the PressComposer fires a pressStart + pressCancel", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.type).toEqual("action");
                });
                aLink.addEventListener("action", callback, false);

                aLink._pressComposer.dispatchEventNamed("pressStart");
                aLink._pressComposer.dispatchEventNamed("pressCancel");

                expect(callback).not.toHaveBeenCalled();
            });

            it("should fire an 'action' event with the contents of the detail property", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.detail.get("foo")).toEqual("bar");
                });
                aLink.addEventListener("action", callback, false);
                aLink.detail.set("foo", "bar");

                aLink._pressComposer.dispatchEventNamed("pressStart");
                aLink._pressComposer.dispatchEventNamed("press");

                expect(callback).toHaveBeenCalled();
            });
        });
    });

});