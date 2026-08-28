"use client";

import { useEffect, useState } from "react";
import { site } from "./site";

/**
 * A lightweight human check, and the email obfuscation it protects.
 *
 * WHAT THIS ACTUALLY DEFENDS AGAINST, honestly:
 *
 * The overwhelming majority of address harvesting is done by crawlers that
 * fetch HTML and run a regular expression over it. They do not execute
 * JavaScript and they do not click anything. Two things defeat them
 * completely:
 *
 *   1. The address never appears in the markup. It is stored ROT13-encoded, so
 *      even a scrape of the JavaScript bundle finds no string matching an
 *      email pattern.
 *   2. It is only assembled after a genuine interaction.
 *
 * WHAT IT DOES NOT DEFEND AGAINST: a determined person who reads the source.
 * A challenge answered entirely in the browser can always be bypassed by
 * someone willing to look, because the answer has to be here to be checked.
 * A wall would need server-side verification, which would mean a serverless
 * function, which is exactly what docs/COST-CONTROLS.md rules out.
 *
 * This is a speed bump that stops the automated traffic, not a wall. That is
 * the right trade for a personal portfolio.
 */

const KEY = "jh-human-verified";
const EVENT = "jh-human-verified-change";

/** ROT13 is its own inverse, which is the entire reason it is used here. */
function rot13(input: string): string {
  return input.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

/** The real address. Only ever called after the check has passed. */
export function decodeEmail(): string {
  return rot13(site.emailEncoded);
}

/** Builds a mailto with a pre-filled subject and body. */
export function buildMailto(subject: string, body: string): string {
  return `mailto:${decodeEmail()}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

function read(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Verification is shared across the page: pass the check once and every
 * protected link unlocks, rather than asking again per link.
 */
export function markVerified() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* blocked storage still unlocks for this render */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useHumanVerified(): boolean {
  // Always false on the server and on first paint, so the markup a crawler
  // receives never contains the address.
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setVerified(read());
    const sync = () => setVerified(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return verified;
}

// ── The challenge itself ────────────────────────────────────────────────────
// Deliberately answerable by anyone, including a visitor using a screen reader:
// plain text questions with plain text options, no images, no audio, no
// distorted letters. An inaccessible CAPTCHA would lose more real people than
// the bots it stops.

export type Challenge = {
  question: string;
  options: string[];
  answer: string;
};

const POOL: Challenge[] = [
  { question: "How many sides does a quad have?", options: ["3", "4", "6"], answer: "4" },
  { question: "How many vertices does a triangle have?", options: ["2", "3", "4"], answer: "3" },
  { question: "Which of these is 3D software?", options: ["Blender", "Blunder", "Blanket"], answer: "Blender" },
  { question: "How many faces does a cube have?", options: ["4", "6", "8"], answer: "6" },
  { question: "Which one is a file format for 3D models?", options: [".glb", ".gbl", ".blg"], answer: ".glb" },
];

/** Picked in the browser, so the rendered HTML is identical every time. */
export function pickChallenge(): Challenge {
  const chosen = POOL[Math.floor(Math.random() * POOL.length)];
  const options = [...chosen.options].sort(() => Math.random() - 0.5);
  return { ...chosen, options };
}
