import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Grid } from '@react-three/drei';
import api from './api';
import { DraggableItem } from './DraggableItem';

function App() {
  const [furnitureList, setFurnitureList] = useState([]);
  const [sceneObjects, setSceneObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [transformMode, setTransformMode] = useState('translate');
  
  const [hasStarted, setHasStarted] = useState(false);
  
  // FIX 1: Initialize as empty strings ('') so the boxes start empty, not "0" or "5"
  const [roomStats, setRoomStats] = useState({ width: '', length: '' });

  useEffect(() => {
    api.get('/furniture').then(res => setFurnitureList(res.data));
  }, []);

  const addToScene = (item) => {
    if (!isEditMode) return;
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
    setSceneObjects((prevObjects) =>
      prevObjects.map((obj) => obj.id === id ? { ...obj, ...newProps } : obj)
    );
  };

  // Helper function to safely handle the Start Button
  const handleStart = () => {
    // If user leaves it empty, default to 5
    const finalWidth = Number(roomStats.width) || 5;
    const finalLength = Number(roomStats.length) || 5;
    
    // Update state with real numbers and start
    setRoomStats({ width: finalWidth, length: finalLength });
    setHasStarted(true);
    setIsEditMode(true);
  };

  // --- SCREEN 1: WELCOME SCREEN ---
  if (!hasStarted) {
    return (
      <div style={{ 
        height: '100vh', width: '100vw', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        background: '#e0e0e0' 
      }}>
        {/* CSS TO REMOVE ARROWS */}
        <style>{`
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}</style>

        <div style={{ 
          background: 'white', padding: '50px', borderRadius: '15px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)', textAlign: 'center', width: '450px'
        }}>
          <h1 style={{margin: '0 0 10px 0', color: '#222', fontSize: '32px'}}>New Project</h1>
          <p style={{color: '#666', marginBottom: '40px'}}>Enter room dimensions (Meters)</p>
          
          {/* INCREASED GAP HERE (gap: '30px') */}
          <div style={{display: 'flex', gap: '60px', marginBottom: '30px'}}>
            
            {/* WIDTH INPUT */}
            <div style={{flex: 1}}>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#444'}}>Width (X)</label>
              <input 
                type="number"
                placeholder="5" 
                value={roomStats.width} 
                onChange={(e) => setRoomStats({...roomStats, width: e.target.value})}
                style={{
                    width: '100%', padding: '15px', fontSize: '20px', 
                    border: '2px solid #ddd', borderRadius: '8px', textAlign: 'center',
                    background: '#fff', color: '#333' // Force White Background
                }}
              />
            </div>

            {/* LENGTH INPUT */}
            <div style={{flex: 1}}>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#444'}}>Length (Z)</label>
              <input 
                type="number" 
                placeholder="8"
                value={roomStats.length} 
                onChange={(e) => setRoomStats({...roomStats, length: e.target.value})}
                style={{
                    width: '100%', padding: '15px', fontSize: '20px', 
                    border: '2px solid #ddd', borderRadius: '8px', textAlign: 'center',
                    background: '#fff', color: '#333' // Force White Background
                }}
              />
            </div>
          </div>

          <button 
            onClick={handleStart}
            style={{
                background: '#007bff', color: 'white', border: 'none', 
                padding: '18px', fontSize: '18px', borderRadius: '8px', 
                cursor: 'pointer', width: '100%', fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,123,255,0.2)'
            }}
          >
            Create Room
          </button>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: MAIN APP ---
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '320px', background: '#0071e1', borderRight: '1px solid #000000', padding: '20px', overflowY: 'auto' }}>
        <h2 style={{marginTop: 0}}>Interior Planner</h2>

        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
            <h4 style={{marginTop: 0, marginBottom: '5px', color: '#000000'}}>Room Settings</h4>
            <p style={{fontSize: '13px', color: '#666', margin: 0}}>
                Size: {roomStats.width}m x {roomStats.length}m <br/>
                Area: {roomStats.width * roomStats.length} sqm
            </p>
            <button 
                onClick={() => setHasStarted(false)}
                style={{marginTop: '10px', fontSize: '11px', padding: '5px 10px', background: '#eee', border: 'none', cursor: 'pointer', borderRadius: '4px'}}
            >
                ← Change Size
            </button>
        </div>

        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ccc' }}>
            <button 
                onClick={() => setIsEditMode(!isEditMode)}
                style={{
                    width: '100%', padding: '12px',
                    background: isEditMode ? '#ff4d4d' : '#4CAF50',
                    color: 'white', border: 'none', borderRadius: '5px',
                    cursor: 'pointer', fontWeight: 'bold'
                }}
            >
                {isEditMode ? 'STOP EDITING' : 'RESUME EDITING'}
            </button>
            
            {isEditMode && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => setTransformMode('translate')} style={{flex: 1, padding: '8px', background: transformMode==='translate'?'#333':'#ccc', color:'white', border:'none', borderRadius: '4px'}}>MOVE</button>
                    <button onClick={() => setTransformMode('rotate')} style={{flex: 1, padding: '8px', background: transformMode==='rotate'?'#333':'#ccc', color:'white', border:'none', borderRadius: '4px'}}>ROTATE</button>
                </div>
            )}
        </div>

        <h3>Assets</h3>
        {furnitureList.map((item) => (
          <div 
            key={item.id} 
            onClick={() => addToScene(item)}
            style={{ 
              padding: '10px', margin: '8px 0', cursor: isEditMode ? 'pointer' : 'not-allowed', 
              background: 'white', border: '1px solid #ac0000', opacity: isEditMode ? 1 : 0.6, borderRadius: '5px', color: "black"
            }}
          >
            <strong>{item.name}</strong>
          </div>
        ))}
        {isEditMode && <button onClick={() => setSceneObjects([])} style={{marginTop: '20px', color: 'red'}}>Clear Room</button>}
      </div>

     {/* 3D CANVAS */}
      <div style={{ flex: 1, background: '#111' }}> {/* Dark Background */}
        <Canvas 
          camera={{ position: [0, 10, 10], fov: 50 }} 
          onPointerMissed={() => isEditMode && setSelectedId(null)}
          shadows // Enable standard shadows instead of ContactShadows
        >
          <ambientLight intensity={0.7} />
          {/* Main Light that casts shadows */}
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]} // Higher quality shadows
          />
          
          <Suspense fallback={null}>
            
            {/* 1. DARK FLOOR (The "Old Look") */}
            <mesh 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -0.05, 0]} // Slightly lower to stop flickering
                receiveShadow
            >
                <planeGeometry args={[Number(roomStats.width), Number(roomStats.length)]} />
                {/* Dark Grey Material */}
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>

            {/* 2. BRIGHT GRID (Visible on Dark Floor) */}
            <Grid 
                position={[0, 0, 0]}
                args={[Number(roomStats.width), Number(roomStats.length)]} 
                sectionSize={1} 
                cellSize={1} 
                cellColor="#444"      // Subtle Grey lines
                sectionColor="#fff"   // White major lines
                infiniteGrid={false}  // Keep it inside the room
                fadeDistance={500}
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
            
            {/* 3. FIX FOR SHAKING: Removed <ContactShadows> */}
            {/* Replaced with standard Environment lighting which is smoother */}
            <Environment preset="city" />
            
          </Suspense>
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}

export default App;