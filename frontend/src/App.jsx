import { useEffect, useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import api from './api';
import { DraggableItem } from './DraggableItem';

function App() {
  const [furnitureList, setFurnitureList] = useState([]);
  const [sceneObjects, setSceneObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [transformMode, setTransformMode] = useState('translate');
  const [hasStarted, setHasStarted] = useState(false);
  const [roomStats, setRoomStats] = useState({ width: '', length: '' });

  // --- NEW: HISTORY STATE FOR UNDO ---
  const [history, setHistory] = useState([]);

  // Helper to save state before a change
  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev, [...sceneObjects]]);
  }, [sceneObjects]);

  // UNDO Function
  const undo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1)); // Remove last from history
    setSceneObjects(previousState);
    setSelectedId(null);
  };

  // DELETE Function
  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    saveHistory(); // Save state before deleting
    setSceneObjects((prev) => prev.filter((obj) => obj.id !== selectedId));
    setSelectedId(null);
  }, [selectedId, saveHistory]);

  // Keyboard Shortcuts (Delete key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && isEditMode) {
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected, isEditMode]);

  useEffect(() => {
    api.get('/furniture').then(res => setFurnitureList(res.data));
  }, []);

  const addToScene = (item) => {
    if (!isEditMode) return;
    saveHistory(); // Save state before adding
    const newItem = {
      id: Date.now(),
      url: item.model_url,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    };
    setSceneObjects([...sceneObjects, newItem]);
    setSelectedId(newItem.id);
  };

  const handleItemUpdate = (id, newProps) => {
    // Save history only when the user RELEASES the mouse (onUpdate is called on mouseUp)
    saveHistory(); 
    setSceneObjects((prevObjects) =>
      prevObjects.map((obj) => obj.id === id ? { ...obj, ...newProps } : obj)
    );
  };

  const handleStart = () => {
    const finalWidth = Number(roomStats.width) || 5;
    const finalLength = Number(roomStats.length) || 5;
    setRoomStats({ width: finalWidth, length: finalLength });
    setHasStarted(true);
    setIsEditMode(true);
  };

  if (!hasStarted) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e0e0' }}>
        <div style={{ background: 'white', padding: '50px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', textAlign: 'center', width: '450px' }}>
          <h1 style={{margin: '0 0 10px 0', color: '#222'}}>New Project</h1>
          <div style={{display: 'flex', gap: '60px', marginBottom: '30px'}}>
            <div style={{flex: 1}}>
              <label style={{ color: '#222', fontWeight: 'bold' }}>Width (X)</label>
              <input type="number" placeholder="5" value={roomStats.width} onChange={(e) => setRoomStats({...roomStats, width: e.target.value})} style={{width: '100%', padding: '15px', fontSize: '20px', color: 'red'}} />
            </div>
            <div style={{flex: 1}}>
              <label style={{ color: '#222', fontWeight: 'bold' }}>Length (Z)</label>
              <input type="number" placeholder="8" value={roomStats.length} onChange={(e) => setRoomStats({...roomStats, length: e.target.value})} style={{width: '100%', padding: '15px', fontSize: '20px', color: 'red'}} />
            </div>
          </div>
          <button onClick={handleStart} style={{ background: '#007bff', color: 'white', padding: '18px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>Create Room</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* SIDEBAR */}
      <div style={{ width: '320px', background: '#0071e1', padding: '20px', overflowY: 'auto', color: 'white' }}>
        <h2 style={{marginTop: 0}}>Interior Planner</h2>

        {/* --- UNDO & DELETE TOOLBAR --- */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={undo} 
            disabled={history.length === 0}
            style={{ flex: 1, padding: '10px', background: history.length === 0 ? '#ccc' : '#fff', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Undo
          </button>
          <button 
            onClick={deleteSelected} 
            disabled={!selectedId}
            style={{ flex: 1, padding: '10px', background: !selectedId ? '#ccc' : '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>

        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: 'black' }}>
            <h4 style={{marginTop: 0}}>Room Settings</h4>
            <p style={{fontSize: '13px'}}>Size: {roomStats.width}m x {roomStats.length}m</p>
            <button onClick={() => setHasStarted(false)} style={{fontSize: '11px', cursor: 'pointer'}}>← Change Size</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setIsEditMode(!isEditMode)} style={{ width: '100%', padding: '12px', background: isEditMode ? '#ff4d4d' : '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isEditMode ? 'STOP EDITING' : 'RESUME EDITING'}
            </button>
            
            {isEditMode && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => setTransformMode('translate')} style={{flex: 1, padding: '8px', background: transformMode==='translate'?'#333':'#ccc'}}>MOVE</button>
                    <button onClick={() => setTransformMode('rotate')} style={{flex: 1, padding: '8px', background: transformMode==='rotate'?'#333':'#ccc'}}>ROTATE</button>
                </div>
            )}
        </div>

        <h3>Assets</h3>
        {furnitureList.map((item) => (
          <div key={item.id} onClick={() => addToScene(item)} style={{ padding: '10px', margin: '8px 0', cursor: isEditMode ? 'pointer' : 'not-allowed', background: 'white', borderRadius: '5px', color: "black" }}>
            <strong>{item.name}</strong>
          </div>
        ))}
        {isEditMode && <button onClick={() => { saveHistory(); setSceneObjects([]); }} style={{marginTop: '20px', color: 'white', background: 'none', border: '1px solid white', cursor: 'pointer'}}>Clear Room</button>}
      </div>

     {/* 3D CANVAS */}
      <div style={{ flex: 1, background: '#111' }}>
        <Canvas camera={{ position: [0, 10, 10], fov: 50 }} onPointerMissed={() => isEditMode && setSelectedId(null)} shadows>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
          
          <Suspense fallback={null}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                <planeGeometry args={[Number(roomStats.width), Number(roomStats.length)]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>

            <Grid 
                position={[0, 0, 0]}
                args={[Number(roomStats.width), Number(roomStats.length)]} 
                sectionSize={1} cellSize={1} cellColor="#444" sectionColor="#fff" infiniteGrid={false}
            />

            {sceneObjects.map((obj) => (
              <DraggableItem 
                key={obj.id}
                url={obj.url}
                position={obj.position}
                rotation={obj.rotation}
                isEditMode={isEditMode}
                isSelected={selectedId === obj.id}
                transformMode={transformMode}
                onUpdate={(newProps) => handleItemUpdate(obj.id, newProps)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditMode) setSelectedId(obj.id);
                }}
              />
            ))}
            <Environment preset="city" />
          </Suspense>
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}

export default App;