import React, { useCallback, useEffect, useRef, useState } from "react";

const Draggable = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 }); // Component Position
  const [dragging, setDragging] = useState<boolean>(false); // Component Dragging state
  const [relPos, setRelPos] = useState<{ x: number; y: number }>({x: 0, y: 0,});// Mouse position relative to the component 
  const selfRef = useRef<HTMLDivElement>(null); // Reference to the component DOM element

  const onMouseMove = useCallback((event: MouseEvent) => {
    setPos({
      x: event.pageX - relPos.x,
      y: event.pageY - relPos.y,
    });
  },[relPos]);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button !== 0) return;
    if (selfRef.current) {
      const dimensions:{left:number; top:number} = selfRef.current.getBoundingClientRect();
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
    } 
    else {
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
