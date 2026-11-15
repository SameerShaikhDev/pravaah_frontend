import React from "react";
import { Terminal, CheckCircle2, XCircle } from "lucide-react";
export default function ConsoleOutput({ output, testResults }) {
  return (
    <div className="bg-black/40 border border-line rounded-xl p-4 font-mono text-xs h-40 overflow-y-auto">
      <div className="flex items-center gap-2 text-ink-4 mb-2">
        <Terminal size={13} /> Output
      </div>
      {output ? (
        <pre className="text-ink-2 whitespace-pre-wrap">{output}</pre>
      ) : (
        <p className="text-ink-4">Run your code to see output here.</p>
      )}
      {testResults?.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {testResults.map((t, i) => (
            <div key={i} className={`flex items-center gap-2 ${t.passed ? "text-success" : "text-danger"}`}>
              {t.passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />} Test case {i + 1}: {t.passed ? "Passed" : "Failed"}
              {!t.passed && t.actualOutput !== undefined && (
                <span className="text-ink-4 truncate">
                  {" "}— expected {String(t.expectedOutput)}, got {String(t.actualOutput)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
