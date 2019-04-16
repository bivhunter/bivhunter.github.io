'use strict';

describe("hoverIntent", function () {

    function mouse(eventType, x, y, options) {
        var eventOptions = Object.assign({
            bubbles: true,
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
            target: elem
        }, options || {});

        elem.dispatchEvent(new MouseEvent(eventType, eventOptions));
    }

    var isOver = void 0;
    var hoverIntent = void 0;

    before(function () {
        this.clock = sinon.useFakeTimers();
    });

    after(function () {
        this.clock.restore();
    });

    beforeEach(function () {
        isOver = false;

        hoverIntent = new HoverIntent({
            elem: elem,
            over: function over() {
                isOver = true;
            },
            out: function out() {
                isOver = false;
            }
        });
    });

    afterEach(function () {
        if (hoverIntent) {
            hoverIntent.destroy();
        }
    });

    it("mouseover -> immediately no tooltip", function () {
        mouse('mouseover', 10, 10);
        assert.isFalse(isOver);
    });

    it("mouseover -> pause shows tooltip", function () {
        mouse('mouseover', 10, 10);
        this.clock.tick(100);
        assert.isTrue(isOver);
    });

    it("mouseover -> fast mouseout no tooltip", function () {
        mouse('mouseover', 10, 10);
        setTimeout(function () {
            return mouse('mouseout', 300, 300, { relatedTarget: document.body });
        }, 30);
        this.clock.tick(100);
        assert.isFalse(isOver);
    });

    it("mouseover -> slow move -> tooltips", function () {
        mouse('mouseover', 10, 10);

        var _loop = function _loop(i) {
            setTimeout(function () {
                return mouse('mousemove', i / 5, 10);
            }, i);
        };

        for (var i = 10; i < 200; i += 10) {
            _loop(i);
        }
        this.clock.tick(200);
        assert.isTrue(isOver);
    });

    it("mouseover -> fast move -> no tooltip", function () {
        mouse('mouseover', 10, 10);

        var _loop2 = function _loop2(i) {
            setTimeout(function () {
                return mouse('mousemove', i, 10);
            }, i);
        };

        for (var i = 10; i < 200; i += 10) {
            _loop2(i);
        }
        this.clock.tick(200);
        assert.isFalse(isOver);
    });
});