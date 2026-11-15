import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import resumeService from "../services/resume.service";
import { getErrorMessage } from "../utils/formatters";

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }, []);

  async function handleUpload() {
    if (!file) return toast.error("Choose a resume file first.");
    setUploading(true);
    try {
      await resumeService.upload(file, setProgress);
      toast.success("Resume uploaded and parsed.");
      navigate("/resume/analysis");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-xl font-semibold text-ink mb-1.5">Upload your resume</h2>
      <p className="text-sm text-ink-4 mb-6">We'll use it to tailor interview questions to your skills and target role.</p>

      <Card className="p-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl2 p-10 text-center transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-line"}`}
        >
          {file ? (
            <CheckCircle2 className="mx-auto text-success mb-4" size={32} />
          ) : (
            <UploadCloud className="mx-auto text-ink-4 mb-4" size={32} />
          )}
          <p className="text-sm text-ink-2 mb-1">{file ? file.name : "Drag and drop your resume here"}</p>
          <p className="text-xs text-ink-4 mb-5">PDF or DOCX, up to 5MB</p>
          <label className="inline-block cursor-pointer">
            <span className="px-4 py-2 rounded-lg glass text-sm text-ink hover:bg-ink/5">Browse files</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {uploading && (
          <div className="mt-5 h-1.5 rounded-full bg-line overflow-hidden">
            <div className="h-full bg-pulse-gradient transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <Button className="w-full mt-6" size="lg" isLoading={uploading} onClick={handleUpload} icon={<FileText size={16} />}>
          Upload &amp; analyze
        </Button>
      </Card>
    </div>
  );
}
