$(function() {
  $.extend($.support, {
    touch: "ontouchend" in document
  });

  var lastTap = null,
    tapValid = false,
    tapTimeout = null,
    rightClickPending = false,
    rightClickEvent = null,
    holdTimeout = null,
    cancelMouseUp = false,
    leftMenuWidth = 0,
    cancelTap = function() {
      tapValid = false;
    },
    cancelHold = function() {
      if (rightClickPending) {
        window.clearTimeout(holdTimeout);
        rightClickPending = false;
        rightClickEvent = null;
      }
    },
    startHold = function(event) {
      if (rightClickPending) return;
      rightClickPending = true;
      rightClickEvent = (event.changedTouches)[0];
      holdTimeout = window.setTimeout(function() {
        rightClickPending = false;

        var simulatedEvent = document.createEvent("MouseEvent"),
          first = rightClickEvent;
        simulatedEvent.initMouseEvent("mouseup", true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
        first.target.dispatchEvent(simulatedEvent);

        simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent("mousedown", true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 2, null);
        first.target.dispatchEvent(simulatedEvent);

        simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent("contextmenu", true, true, window, 1, first.screenX + 50, first.screenY + 5, first.clientX + 50, first.clientY + 5, false, false, false, false, 2, null);
        first.target.dispatchEvent(simulatedEvent);

        cancelMouseUp = true;
        rightClickEvent = null;
      }, 800);
    },
    touchStart = function(event) {
      var touches = event.changedTouches,
        first = touches[0],
        type = "mouseover",
        simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
      first.target.dispatchEvent(simulatedEvent);

      type = "mousedown";
      simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
      first.target.dispatchEvent(simulatedEvent);

      if (!tapValid) {
        lastTap = first.target;
        tapValid = true;
        tapTimeout = window.setTimeout(cancelTap, 600);
        startHold(event);
      } else {
        window.clearTimeout(tapTimeout);
        if (first.target == lastTap) {
          lastTap = null;
          tapValid = false;

          type = "click";
          simulatedEvent = document.createEvent("MouseEvent");
          simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
          first.target.dispatchEvent(simulatedEvent);

          type = "dblclick";
          simulatedEvent = document.createEvent("MouseEvent");
          simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
          first.target.dispatchEvent(simulatedEvent);
        } else {
          lastTap = first.target;
          tapValid = true;
          tapTimeout = window.setTimeout(cancelTap, 600);
          startHold(event);
        }
      }
    },
    touchHandler = function(event) {
      var type = "",
        button = 0;
      if (event.touches.length > 1) return;

      switch (event.type) {
        case "touchstart":
          if ($(event.changedTouches[0].target).is("select")) return;
          touchStart(event);
          event.preventDefault();
          return false;
        case "touchmove":
          cancelHold();
          type = "mousemove";
          event.preventDefault();
          break;
        case "touchend":
          if (cancelMouseUp) {
            cancelMouseUp = false;
            event.preventDefault();
            return false;
          }
          cancelHold();
          type = "mouseup";
          break;
        default:
          return;
      }
      var touches = event.changedTouches,
        first = touches[0],
        simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, button, null);
      first.target.dispatchEvent(simulatedEvent);

      if (type == "mouseup" && tapValid && first.target == lastTap) {
        simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent("click", true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, button, null);
        first.target.dispatchEvent(simulatedEvent);
      }
    };
  $.fn.mouse2touch = function() {
    if ($.support.touch) this.each(function(x, e) {
      var eTouch = ["touchstart", "touchmove", "touchend", "touchcancel"];
      for (var i = 0; eTouch[i]; i++) e.addEventListener(eTouch[i], touchHandler, false);
    });
    return this;
  };
});