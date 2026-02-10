import { useGLTF } from '@react-three/drei';

export function Model({ url }) {
  // This hook loads the GLB file from your Laravel URL
  const { scene } = useGLTF(url);
  
  // Returns the 3D object to be rendered
  return <primitive object={scene} />;
}