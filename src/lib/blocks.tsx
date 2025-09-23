// apps\renderer\src\lib\blocks.tsx

import React from "react";
import type { Block } from "./types";

export function renderBlocks(blocks: Block[]) {
  return blocks.map((b) => {
    switch (b.type) {
      case "hero":
        return <Hero key={b.id} {...b.props} />;
      default:
        return <div key={b.id}>Unknown block: {b.type}</div>;
    }
  });
}

function Hero(props: { title?: string; subtitle?: string }) {
  return (
    <section style={{ padding: "6rem 1.5rem" }}>
      <h1 style={{ fontSize: 48, margin: 0 }}>{props.title ?? "Hero"}</h1>
      {props.subtitle && <p style={{ opacity: 0.7, fontSize: 20 }}>{props.subtitle}</p>}
    </section>
  );
}
