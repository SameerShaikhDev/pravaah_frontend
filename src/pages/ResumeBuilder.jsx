import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, Save, Download, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { SkeletonCard } from "../components/common/Skeleton";
import resumeService from "../services/resume.service";
import { getErrorMessage } from "../utils/formatters";
import { useFileDownload } from "../utils/useFileDownload";

const EMPTY_DRAFT = {
  contact: { name: "", email: "", phone: "", location: "" },
  summary: "",
  experience: [{ role: "", company: "", duration: "", bullets: [""] }],
  education: [{ degree: "", institution: "", year: "" }],
  projects: [{ name: "", description: "" }],
  skills: [],
};

/** Form-driven builder with a live preview pane, following the same react-hook-form pattern
 * used in Onboarding.jsx / Register.jsx. Export is gated server-side (resume_builder feature
 * flag) - see resume.service.exportBuilder - so a locked user can still fill in the form and
 * save drafts, they just can't export until they upgrade. */
export default function ResumeBuilder() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { run: runDownload, busyKey } = useFileDownload();
  const exporting = busyKey === "resume";
  const [locked, setLocked] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  const { register, control, watch, handleSubmit, reset } = useForm({ defaultValues: EMPTY_DRAFT });
  const experience = useFieldArray({ control, name: "experience" });
  const education = useFieldArray({ control, name: "education" });
  const projects = useFieldArray({ control, name: "projects" });
  const draft = watch();

  useEffect(() => {
    async function load() {
      try {
        const res = await resumeService.getLatest();
        const fetched = res.data.resume || res.data;
        setResume(fetched);
        if (fetched?.builderDraft) reset({ ...EMPTY_DRAFT, ...fetched.builderDraft });
        if (fetched?._id) {
          const atsRes = await resumeService.getAts(fetched._id);
          setLocked(Boolean(atsRes.data.locked));
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSave(values) {
    if (!resume) return;
    setSaving(true);
    try {
      await resumeService.saveBuilderDraft(resume._id, values, "classic");
      toast.success("Draft saved.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const handleExport = () => resume && runDownload("resume", () => resumeService.exportBuilder(resume._id), "resume.pdf");

  function addSkill(e) {
    e.preventDefault();
    const value = skillsInput.trim();
    if (!value) return;
    reset({ ...draft, skills: [...(draft.skills || []), value] }, { keepDefaultValues: false });
    setSkillsInput("");
  }

  if (loading) return <SkeletonCard />;
  if (!resume) {
    return (
      <Card className="p-10 text-center max-w-lg">
        <p className="text-ink-3 mb-5">Upload a resume first to start the builder.</p>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit(onSave)} className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Resume builder</h2>
          <div className="flex gap-2">
            <Button type="submit" size="sm" variant="secondary" icon={<Save size={15} />} isLoading={saving}>
              Save draft
            </Button>
            {locked ? (
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-lg font-medium bg-action text-white shadow-glow hover:opacity-90"
              >
                <Lock size={15} /> Unlock export
              </Link>
            ) : (
              <Button type="button" size="sm" icon={<Download size={15} />} isLoading={exporting} onClick={handleExport}>
                Export PDF
              </Button>
            )}
          </div>
        </div>

        <Card className="p-5 space-y-4">
          <p className="text-sm font-medium text-ink">Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full name" {...register("contact.name")} />
            <Input label="Email" {...register("contact.email")} />
            <Input label="Phone" {...register("contact.phone")} />
            <Input label="Location" {...register("contact.location")} />
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-ink">Summary</p>
          <textarea
            {...register("summary")}
            rows={3}
            className="w-full bg-surface/60 border border-line rounded-lg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="A short professional summary…"
          />
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Experience</p>
            <button
              type="button"
              onClick={() => experience.append({ role: "", company: "", duration: "", bullets: [""] })}
              className="text-xs text-accent-hi hover:text-accent-hi flex items-center gap-1"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {experience.fields.map((field, i) => (
            <div key={field.id} className="border border-line rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Role" {...register(`experience.${i}.role`)} />
                <Input placeholder="Company" {...register(`experience.${i}.company`)} />
              </div>
              <Input placeholder="Duration (e.g. Jun 2023 - Present)" {...register(`experience.${i}.duration`)} />
              <textarea
                {...register(`experience.${i}.bullets.0`)}
                rows={2}
                placeholder="Key achievement or responsibility…"
                className="w-full bg-surface/60 border border-line rounded-lg py-2 px-3 text-sm text-ink outline-none focus:border-accent"
              />
              <button type="button" onClick={() => experience.remove(i)} className="text-xs text-danger flex items-center gap-1">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Projects</p>
            <button
              type="button"
              onClick={() => projects.append({ name: "", description: "" })}
              className="text-xs text-accent-hi hover:text-accent-hi flex items-center gap-1"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {projects.fields.map((field, i) => (
            <div key={field.id} className="border border-line rounded-lg p-3 space-y-2">
              <Input placeholder="Project name" {...register(`projects.${i}.name`)} />
              <textarea
                {...register(`projects.${i}.description`)}
                rows={2}
                placeholder="What it does, tech used, impact…"
                className="w-full bg-surface/60 border border-line rounded-lg py-2 px-3 text-sm text-ink outline-none focus:border-accent"
              />
              <button type="button" onClick={() => projects.remove(i)} className="text-xs text-danger flex items-center gap-1">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Education</p>
            <button
              type="button"
              onClick={() => education.append({ degree: "", institution: "", year: "" })}
              className="text-xs text-accent-hi hover:text-accent-hi flex items-center gap-1"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {education.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:items-end">
              <Input placeholder="Degree" {...register(`education.${i}.degree`)} />
              <Input placeholder="Institution" {...register(`education.${i}.institution`)} />
              <div className="flex gap-2">
                <Input placeholder="Year" {...register(`education.${i}.year`)} />
                <button type="button" onClick={() => education.remove(i)} className="text-danger shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-ink">Skills</p>
          <div className="flex flex-wrap gap-2">
            {(draft.skills || []).map((s, i) => (
              <span
                key={i}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent-hi border border-accent/30"
              >
                {s}
                <button type="button" onClick={() => reset({ ...draft, skills: draft.skills.filter((_, idx) => idx !== i) })}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill and press Enter"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill(e)}
            />
            <Button type="button" size="sm" variant="secondary" onClick={addSkill}>
              Add
            </Button>
          </div>
        </Card>
      </form>

      {/* Live preview */}
      <div className="lg:sticky lg:top-6 h-fit">
        <Card className="p-8 bg-white text-slate-900">
          <h1 className="font-display text-2xl font-bold">{draft.contact?.name || "Your name"}</h1>
          <p className="text-xs text-slate-600 mb-4">
            {[draft.contact?.email, draft.contact?.phone, draft.contact?.location].filter(Boolean).join(" · ")}
          </p>
          {draft.summary && (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700 mt-4 mb-1">Summary</p>
              <p className="text-sm text-slate-700">{draft.summary}</p>
            </>
          )}
          {(draft.experience || []).some((e) => e.role || e.company) && (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700 mt-4 mb-1">Experience</p>
              {draft.experience.map(
                (e, i) =>
                  (e.role || e.company) && (
                    <div key={i} className="mb-2">
                      <p className="text-sm font-medium">
                        {e.role} {e.company && `- ${e.company}`}
                      </p>
                      <p className="text-xs text-slate-500">{e.duration}</p>
                      {e.bullets?.[0] && <p className="text-xs text-slate-700 mt-0.5">• {e.bullets[0]}</p>}
                    </div>
                  ),
              )}
            </>
          )}
          {(draft.projects || []).some((p) => p.name) && (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700 mt-4 mb-1">Projects</p>
              {draft.projects.map(
                (p, i) =>
                  p.name && (
                    <p key={i} className="text-sm text-slate-700 mb-1">
                      <span className="font-medium">{p.name}:</span> {p.description}
                    </p>
                  ),
              )}
            </>
          )}
          {(draft.education || []).some((e) => e.degree || e.institution) && (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700 mt-4 mb-1">Education</p>
              {draft.education.map(
                (e, i) =>
                  (e.degree || e.institution) && (
                    <p key={i} className="text-sm text-slate-700">
                      {e.degree} - {e.institution} {e.year && `(${e.year})`}
                    </p>
                  ),
              )}
            </>
          )}
          {(draft.skills || []).length > 0 && (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700 mt-4 mb-1">Skills</p>
              <p className="text-sm text-slate-700">{draft.skills.join(", ")}</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
