"use client";

import Intro from "./Intro";

export default function IntroPage({ onFinish }: { onFinish: () => void }) {
  return <Intro onFinish={onFinish} />;
}
