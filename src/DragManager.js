"use strict";

let DragManager = new function() {
  let dragObj = {};
  let self = this;

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  function onMouseDown(e) {
    if (e.which != 1) return;
    let elem = e.target.closest(".draggable");
    if (!elem) {
      return;
    }

    dragObj.elem = elem;
    dragObj.downX = e.pageX;
    dragObj.downY = e.pageY;

    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!dragObj.elem) {
      return;
    }

    if (!dragObj.avatar) {
      let shiftX = e.clientX - dragObj.downX;
      let shiftY = e.clientY - dragObj.downY;

      if (Math.abs(shiftX) < 3 && Math.abs(shiftY) < 3) {
        return;
      }

      dragObj.avatar = createAvatar(e);

      if (!dragObj.avatar) {
        dragObj = {};
        return;
      }

      dragObj.shiftX = (dragObj.downX - dragObj.avatar.getBoundingClientRect().left);
      dragObj.shiftY = (dragObj.downY - dragObj.avatar.getBoundingClientRect().top);

      startDrag(e);
    }

    dragObj.avatar.style.left = e.pageX - dragObj.shiftX + "px";
    dragObj.avatar.style.top = e.pageY - dragObj.shiftY + "px";

    e.preventDefault();
  }

  function onMouseUp(e) {
    if (dragObj.avatar) {
      finishDrag(e);
    }

    dragObj = {};
  }

  function createAvatar(e) {
    let avatar = dragObj.elem;
    let old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.style.position || "",
      left: avatar.style.left || "",
      top: avatar.style.top || "",
      zIndex: avatar.style.zIndex || ""
    };

    avatar.rollback = function() {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex;
    };

    return avatar;
  }

  function startDrag(e) {
    if (dragObj.avatar.parentNode !== document.body) {
      document.body.appendChild(dragObj.avatar);
    }

    dragObj.avatar.style.position = "absolute";
    dragObj.avatar.style.zIndex = 9999;
  }

  function finishDrag(e) {
    let elemDrop = findDrop(e);

    if (!elemDrop) {
      self.onDragCancel(dragObj);
    } else {
      self.onDragEnd(dragObj, elemDrop);
    }
  }

  function findDrop(e) {
    dragObj.avatar.hidden = true;
    let elem = document.elementFromPoint(e.clientX, e.clientY);
    dragObj.avatar.hidden = false;

    if (elem === null) {
      return null;
    }
    console.log(elem);
    return elem.closest(".droppable");
  }

  this.onDragEnd = function(dragObject, dropElem) {};
  this.onDragCancel = function(dragObject) {};
};