import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import Card from "../../components/common/Card";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import { SkeletonTable } from "../../components/common/Skeleton";
import questionService from "../../services/question.service";
import { getErrorMessage } from "../../utils/formatters";

export default function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function load() {
    setLoading(true);
    try {
      const res = await questionService.getAll({});
      setQuestions(res.data.questions || res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(values) {
    try {
      await questionService.create({ ...values, isBankQuestion: true });
      toast.success("Question added to the bank.");
      reset();
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    try {
      await questionService.remove(id);
      toast.success("Question removed.");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const columns = [
    { key: "text", label: "Question", render: (r) => <span className="line-clamp-1 max-w-md block">{r.text}</span> },
    { key: "type", label: "Type", render: (r) => <Badge tone="violet">{r.type}</Badge> },
    { key: "difficulty", label: "Difficulty" },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <button onClick={() => handleDelete(r._id)} className="text-danger hover:text-danger">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-display text-xl font-semibold text-ink">Manage question bank</h2>
        <Button size="sm" icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>
          Add question
        </Button>
      </div>
      <Card className="p-2">
        {loading ? (
          <SkeletonTable rows={6} cols={4} />
        ) : (
          <DataTable
            columns={columns}
            rows={questions}
            emptyLabel="No bank questions yet — AI-generated ones don't appear here."
          />
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add a bank question">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input
            label="Question text"
            as="textarea"
            error={errors.text?.message}
            {...register("text", { required: "Required" })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-2 mb-1.5">Type</label>
              <select
                {...register("type")}
                className="w-full bg-surface border border-line rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="coding">Coding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-2 mb-1.5">Difficulty</label>
              <select
                {...register("difficulty")}
                className="w-full bg-surface border border-line rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <Input label="Topic" {...register("topic")} />
          <Button type="submit" className="w-full">
            Add to bank
          </Button>
        </form>
      </Modal>
    </div>
  );
}
