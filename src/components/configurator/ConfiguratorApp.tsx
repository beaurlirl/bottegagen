"use client";

import dynamic from "next/dynamic";

const ConfiguratorShell = dynamic(
  () => import("@/components/configurator/ConfiguratorShell"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-dvh items-end bg-[#CF162D] p-10">
        <p className="font-sans text-[13px] tracking-[0.5em] text-white uppercase">
          B o t t e g a
        </p>
      </div>
    ),
  },
);

export function ConfiguratorApp() {
  return <ConfiguratorShell />;
}
