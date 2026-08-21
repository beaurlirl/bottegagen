"use client";

import type { MaterialDefinition } from "@/configurator/types";

type Props = {
  material: MaterialDefinition;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function MaterialOption({ material, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(material.id)}
      title={material.name}
      className="group flex w-[5.4rem] shrink-0 flex-col gap-2 text-left sm:w-24"
    >
      <span
        className={[
          "relative block aspect-square w-full overflow-hidden border transition-colors",
          selected
            ? "border-[#CF162D]"
            : "border-black/15 group-hover:border-black/40",
        ].join(" ")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={material.thumbnail}
          alt=""
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
        />
        {selected ? (
          <span className="absolute top-1.5 left-1.5 h-1.5 w-1.5 bg-[#CF162D]" />
        ) : null}
      </span>
      <span
        className={[
          "font-sans text-[10px] leading-3 tracking-[0.14em] uppercase",
          selected ? "text-[#CF162D]" : "text-black/70 group-hover:text-black",
        ].join(" ")}
      >
        {material.name}
      </span>
    </button>
  );
}
