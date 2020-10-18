import React, { useCallback, useEffect, useRef, useState } from "react";

const Draggable = () => {
  // Component Position
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // Component Dragging state
  const [dragging, setDragging] = useState<boolean>(false);
  // Mouse position relative to the component
  const [relPos, setRelPos] = useState<{ x: number; y: number }>({x: 0, y: 0,});
  // Reference to the component DOM element
  const selfRef = useRef<any>(null);

  const onMouseMove = useCallback((event: MouseEvent) => {
    setPos({
      x: event.pageX - relPos.x,
      y: event.pageY - relPos.y,
    });
  },[relPos]);

  const onMouseDown = (event: any) => {
    if (event.button !== 0) return;
    if (selfRef.current) {
      const dimensions = selfRef.current.getBoundingClientRect();
      setDragging(true);
      setRelPos({
        x: event.pageX - dimensions.left,
        y: event.pageY - dimensions.top,
      });
    }
    event.stopPropagation();
    event.preventDefault();
  };

  const onMouseUp = (event: MouseEvent) => {
    setDragging(false);
    event.stopPropagation();
    event.preventDefault();
  };

  useEffect(() => {
    const isSupported = document && document.addEventListener;
    if (!isSupported) return;

    if (dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove]);

  return (
    <div ref={selfRef} style={{ left: pos.x, top: pos.y, background: "red", position: "absolute", height: 100, width: 100, }} onMouseDown={(e) => onMouseDown(e)} />
  );
};

export default Draggable;
