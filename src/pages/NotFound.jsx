import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { LogoMark } from "../components/common/Logo";
import FlowField from "../components/visual/FlowField";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-dvh flex items-center justify-center bg-canvas px-6 text-center">
      <FlowField lines={12} />
      <div className="relative">
        <LogoMark size={56} className="mx-auto mb-6 animate-float" />
        <h1 className="font-display text-8xl font-semibold text-gradient mb-3">404</h1>
        <p className="text-ink-3 mb-8">This page didn't make it past the first round.</p>
        <Link to="/">
          <Button size="lg">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
