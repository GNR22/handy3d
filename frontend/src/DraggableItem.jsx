import { useState, useMemo, useEffect } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';

export function DraggableItem({ 
    url, position, rotation, 
    isSelected, isEditMode, transformMode, 
    onClick, onUpdate 
}) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const [model, setModel] = useState(null);

  // OPTIONAL: If you want to force the Y position to 0 
  // every time the component mounts or position changes.
  const fixedY = 0; 

  return (
    <>
      {/* 1. THE GIZMO */}
      {isSelected && model && isEditMode && (
        <TransformControls 
          object={model} 
          mode={transformMode} 
          /* LOCKING THE Y-AXIS: Hide the vertical arrow during translation */
          showY={transformMode === 'translate' ? false : true}
          onMouseUp={() => {
            if (model) {
              const { x, z } = model.position;
              const { x: rx, y: ry, z: rz } = model.rotation;
              
              // We send back the current X and Z, but keep Y at our fixed floor level
              onUpdate({ 
                  position: [x, fixedY, z], 
                  rotation: [rx, ry, rz] 
              });
            }
          }}
        />
      )}

      {/* 2. THE OBJECT */}
      <primitive 
        object={clonedScene} 
        /* Ensure the initial render also respects the fixed floor height */
        position={[position[0], fixedY, position[2]]} 
        rotation={rotation} 
        onClick={onClick} 
        ref={setModel} 
      />
    </>
  );
}