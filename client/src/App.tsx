import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import SecurityCenter from "./components/SecurityCenter";
import GameUI from "./components/GameUI";

// Define control keys for the game
enum Controls {
  forward = 'forward',
  backward = 'backward', 
  leftward = 'leftward',
  rightward = 'rightward',
  select = 'select',
  cancel = 'cancel'
}

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.select, keys: ["Space", "Enter"] },
  { name: Controls.cancel, keys: ["Escape"] },
];

// Check if WebGL is available
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

function WebGLFallback() {
  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        textAlign: 'center',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ 
          color: '#fff',
          fontSize: '2rem',
          marginBottom: '20px',
          fontFamily: 'Inter, sans-serif'
        }}>🎮 Security Center Management</h1>
        
        <p style={{ 
          color: '#a0a0a0',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '30px',
          fontFamily: 'Inter, sans-serif'
        }}>
          This 3D isometric game requires WebGL to run. The preview environment doesn't support GPU acceleration.
        </p>

        <button
          onClick={openInNewTab}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            padding: '15px 40px',
            fontSize: '1.1rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          🚀 Open Game in New Tab
        </button>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <h3 style={{ color: '#4ade80', marginBottom: '10px', fontSize: '1rem' }}>Game Features:</h3>
          <ul style={{ color: '#d1d5db', textAlign: 'left', lineHeight: '1.8', fontSize: '0.9rem' }}>
            <li>✓ Isometric 3D control room with 8 workstations</li>
            <li>✓ Manage 8 operators with different skills</li>
            <li>✓ Handle emergencies: Fire, Medical, Security, Technical</li>
            <li>✓ Click-to-assign operator management</li>
            <li>✓ Real-time stats and performance tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());
  }, []);

  // Show loading while checking
  if (webGLSupported === null) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Inter, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  // Show fallback if WebGL is not supported
  if (!webGLSupported) {
    return <WebGLFallback />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <KeyboardControls map={controls}>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{
            position: [10, 15, 10],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
        >
          <color attach="background" args={["#1a1a2e"]} />
          
          {/* Isometric-style lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 5]} intensity={1} />
          <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#4a9eff" />

          <Suspense fallback={null}>
            <SecurityCenter />
          </Suspense>
        </Canvas>
        
        <GameUI />
      </KeyboardControls>
    </div>
  );
}

export default App;
