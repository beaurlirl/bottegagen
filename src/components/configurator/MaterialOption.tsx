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
      className="group flex w-[4.6rem] shrink-0 flex-col gap-2 text-left sm:w-20"
    >
      <span
        className={[
          "relative block aspect-square w-full overflow-hidden border",
          selected ? "border-[#CF162D]" : "border-black/15",
        ].join(" ")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={material.thumbnail}
          alt=""
          className="h-full w-full object-cover"
        />
        {selected ? (
          <span className="absolute top-1.5 left-1.5 h-1.5 w-1.5 bg-[#CF162D]" />
        ) : null}
      </span>
      <span
        className={[
          "font-sans text-[10px] leading-3 tracking-[0.14em] uppercase",
          selected ? "text-[#CF162D]" : "text-black/70",
        ].join(" ")}
      >
        {material.name}
      </span>
    </button>
  );
}
