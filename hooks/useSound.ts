// hooks/ useSound.ts
"use client";

export function useSound(src: string) {
  const play = () => {
    if (typeof window === "undefined") return;

    const audio = new Audio(src);
    audio.volume = 0.5;

    audio.play().catch((err) => {
      console.log("Sound blocked:", err);
    });
  };

  return play;
}