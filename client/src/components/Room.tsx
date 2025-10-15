import { Text, useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

type DoorConfig = {
  wall: "front" | "back" | "left" | "right";
  width?: number;
  height?: number;
  offset?: number;
};

type RoomProps = {
  position?: [number, number, number];
  size?: [number, number, number];
  name?: string;
  showPillar?: boolean;
  door?: DoorConfig;
};

const WALL_THICKNESS = 0.2;

function createWallGeometry(
  width: number,
  height: number,
  door?: DoorConfig
) {
  if (!door) {
    return new THREE.BoxGeometry(width, height, WALL_THICKNESS);
  }

  const doorWidth = door.width ?? 2;
  const doorHeight = door.height ?? 2.5;
  const offset = door.offset ?? 0;

  const wallShape = new THREE.Shape();
  wallShape.moveTo(0, 0);
  wallShape.lineTo(width, 0);
  wallShape.lineTo(width, height);
  wallShape.lineTo(0, height);
  wallShape.lineTo(0, 0);

  const doorLeft = width / 2 + offset - doorWidth / 2;
  const doorPath = new THREE.Path();
  doorPath.moveTo(doorLeft, 0);
  doorPath.lineTo(doorLeft + doorWidth, 0);
  doorPath.lineTo(doorLeft + doorWidth, doorHeight);
  doorPath.lineTo(doorLeft, doorHeight);
  doorPath.lineTo(doorLeft, 0);
  wallShape.holes.push(doorPath);

  const geometry = new THREE.ExtrudeGeometry(wallShape, {
    depth: WALL_THICKNESS,
    bevelEnabled: false,
  });

  geometry.translate(-width / 2, -height / 2, -WALL_THICKNESS / 2);
  return geometry;
}

export default function Room({
  position = [0, 0, 0],
  size = [16, 6, 12],
  name,
  showPillar = true,
  door,
}: RoomProps) {
  const [width, height, depth] = size;
  const floorTexture = useTexture("/textures/asphalt.png");
  const wallTexture = useTexture("/textures/wood.jpg");

  // Configure texture repeating
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(width / 4, depth / 4);

  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(width / 8, height / 6);

  const frontWallGeometry = useMemo(
    () => createWallGeometry(width, height, door?.wall === "front" ? door : undefined),
    [door, height, width]
  );

  const backWallGeometry = useMemo(
    () => createWallGeometry(width, height, door?.wall === "back" ? door : undefined),
    [door, height, width]
  );

  const sideWallGeometry = useMemo(() => {
    if (!door || (door.wall !== "left" && door.wall !== "right")) {
      return undefined;
    }

    return createWallGeometry(depth, height, { ...door, width: door.width ?? 2 });
  }, [depth, door, height]);

  const solidSideWallGeometry = useMemo(
    () => createWallGeometry(depth, height),
    [depth, height]
  );

  useEffect(() => () => frontWallGeometry.dispose(), [frontWallGeometry]);
  useEffect(() => () => backWallGeometry.dispose(), [backWallGeometry]);
  useEffect(() => {
    if (!sideWallGeometry) {
      return;
    }

    return () => sideWallGeometry.dispose();
  }, [sideWallGeometry]);
  useEffect(() => () => solidSideWallGeometry.dispose(), [solidSideWallGeometry]);

  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshLambertMaterial map={floorTexture} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <primitive object={backWallGeometry} attach="geometry" />
        <meshLambertMaterial map={wallTexture} color="#6b7280" />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, height / 2, depth / 2]}>
        <primitive object={frontWallGeometry} attach="geometry" />
        <meshLambertMaterial map={wallTexture} color="#6b7280" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <primitive
          object={door?.wall === "left" && sideWallGeometry ? sideWallGeometry : solidSideWallGeometry}
          attach="geometry"
        />
        <meshLambertMaterial map={wallTexture} color="#6b7280" />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <primitive
          object={door?.wall === "right" && sideWallGeometry ? sideWallGeometry : solidSideWallGeometry}
          attach="geometry"
        />
        <meshLambertMaterial map={wallTexture} color="#6b7280" />
      </mesh>

      {/* Optional pillar */}
      {showPillar && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[0.4, height, 0.4]} />
          <meshLambertMaterial color="#1f2937" />
        </mesh>
      )}

      {/* Optional room label */}
      {name && (
        <Text
          position={[0, 0.2, depth / 2 + 0.3]}
          fontSize={0.6}
          color="#f3f4f6"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
}
