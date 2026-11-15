import React from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-canvas px-6">
          <div className="glass-strong border-gradient rounded-xl3 p-10 max-w-md w-full text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-danger/15 ring-8 ring-danger/5 flex items-center justify-center mb-5">
              <AlertTriangle className="text-danger" size={28} />
            </div>
            <h1 className="font-display text-xl font-semibold text-ink mb-2">Something broke on our end</h1>
            <p className="text-ink-3 text-sm mb-6">
              The interface hit an unexpected error. Your progress on the server is safe &mdash; reloading will get you back on
              track.
            </p>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-xl bg-action text-white font-medium shadow-glow hover:brightness-110 active:scale-[0.97] transition"
            >
              Back to home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
