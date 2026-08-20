"use client";

import { materialsInCategory } from "@/configurator/materials";
import type { MaterialCategory } from "@/configurator/types";
import { MaterialOption } from "./MaterialOption";

type Props = {
  category: MaterialCategory;
  value: string | null;
  onSelect: (id: string) => void;
};

export function MaterialGrid({ category, value, onSelect }: Props) {
  const materials = materialsInCategory(category);

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {materials.map((material) => (
        <MaterialOption
          key={material.id}
          material={material}
          selected={material.id === value}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
