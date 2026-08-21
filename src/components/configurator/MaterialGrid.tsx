"use client";

import { getMaterial, materialsInCategory } from "@/configurator/materials";
import type { MaterialCategory } from "@/configurator/types";
import { MaterialOption } from "./MaterialOption";

type Props = {
  category: MaterialCategory;
  value: string | null;
  onSelect: (id: string) => void;
};

export function MaterialGrid({ category, value, onSelect }: Props) {
  const materials = materialsInCategory(category);
  const selected = getMaterial(value);

  return (
    <div>
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
      <div className="mt-3 min-h-[2.5rem] border-t border-black/10 pt-2">
        {selected ? (
          <>
            <p className="font-sans text-[11px] tracking-[0.14em] text-black uppercase">
              {selected.name}
            </p>
            <p className="mt-0.5 font-sans text-[11px] leading-snug tracking-[0.02em] text-black/50 normal-case">
              {selected.description}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
