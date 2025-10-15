import Room from "./Room";

export default function Building() {
  return (
    <group>
      {/* Main Hall */}
      <Room position={[0, 0, 0]} size={[16, 6, 12]} name="Hall" />

      {/* Office A on the right */}
      <Room position={[18, 0, 0]} size={[10, 6, 10]} name="Office A" />

      {/* Office B on the left */}
      <Room position={[-18, 0, 0]} size={[10, 6, 10]} name="Office B" />

      {/* Meeting Room behind */}
      <Room position={[0, 0, -14]} size={[12, 6, 10]} name="Meeting Room" />
    </group>
  );
}
