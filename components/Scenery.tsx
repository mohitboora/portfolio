import { IsoScene, campfireScene, treeBoxes } from "@/lib/voxel";

const treeA = treeBoxes(11, 13);
const treeB = treeBoxes(42, 11);
const camp = campfireScene();

/** Cropped voxel tree in a screen corner. */
export function Tree({ side, variant = "a", className = "" }: { side: "left" | "right"; variant?: "a" | "b"; className?: string }) {
  return (
    <IsoScene
      boxes={variant === "a" ? treeA : treeB}
      className={`pointer-events-none absolute select-none ${
        side === "left" ? "-left-[22vw] md:-left-[9vw]" : "-right-[24vw] md:-right-[10vw]"
      } ${className}`}
    />
  );
}

export function Campfire({ className = "" }: { className?: string }) {
  return <IsoScene boxes={camp.boxes} under={camp.under} over={camp.over} className={`pointer-events-none absolute select-none ${className}`} />;
}
