"use client";

import { Component, type ReactNode } from "react";

/**
 * Keeps a failing 3D viewer from taking the page down with it.
 *
 * The viewer is an enhancement. The project's substance is its write-up, its
 * specs and its poster render, and all of that is plain HTML that cannot fail.
 * Before this existed, an exception anywhere in the three.js subtree unmounted
 * the whole route and a visitor got "Application error: a client-side exception
 * has occurred" instead of the project.
 *
 * That is a bad trade on any site. On one being read by an admissions tutor it
 * is a disaster, because the page that breaks is indistinguishable from a page
 * that was never built properly.
 *
 * A class component because React error boundaries have no hooks equivalent.
 */
export class ViewerBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFailure?: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    // Left in deliberately: if this ever fires in the wild, the browser console
    // is the only place the cause will be visible.
    console.error("[viewer] 3D viewer failed, falling back to the poster:", error);
    // Bring the poster back. If the model had already loaded, it has been faded
    // out, and without this the visitor is left looking at an empty plate.
    this.props.onFailure?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
