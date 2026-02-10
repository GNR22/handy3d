import { useState, useMemo } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';

export function DraggableItem({ 
    url, position, rotation, 
    isSelected, isEditMode, transformMode, 
    onClick, onUpdate 
}) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const [model, setModel] = useState(null);

  return (
    <>
      {/* 1. THE GIZMO */}
      {/* Accepts 'mode' to switch between arrows and circles */}
      {isSelected && model && isEditMode && (
        <TransformControls 
          object={model} 
          mode={transformMode} // 'translate' or 'rotate'
          onMouseUp={() => {
            if (model) {
              // Read BOTH position and rotation from the 3D model
              const { x, y, z } = model.position;
              const { x: rx, y: ry, z: rz } = model.rotation;
              
              // Send both back to App.jsx
              onUpdate({ 
                  position: [x, y, z], 
                  rotation: [rx, ry, rz] 
              });
            }
          }}
        />
      )}

      {/* 2. THE OBJECT */}
      <primitive 
        object={clonedScene} 
        position={position} 
        rotation={rotation} // Apply the saved rotation
        onClick={onClick} 
        ref={setModel} 
      />
    </>
  );
}