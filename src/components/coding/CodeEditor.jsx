import React from "react";
import Editor from "@monaco-editor/react";
import { CODING_LANGUAGES } from "../../constants";
export default function CodeEditor({ language, value, onChange, height = "60vh" }) {
  const monacoLang = CODING_LANGUAGES.find((l) => l.value === language)?.monaco || "javascript";
  return (
    <div className="monaco-editor-wrapper border border-line min-w-0">
      <Editor
        height={height}
        language={monacoLang}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
