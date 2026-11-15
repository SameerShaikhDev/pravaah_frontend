import React from "react";
import { ChevronLeft } from "lucide-react";
import Button from "./Button";

/** Previous / progress / primary-action row shared by the aptitude test and the drill session.
 *  The primary action (Next, Finish, Submit...) is passed as children. */
export default function QuizFooter({ index, onPrev, answeredCount, total, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="secondary" icon={<ChevronLeft size={16} />} disabled={index === 0} onClick={onPrev}>
        Previous
      </Button>
      <span className="hidden sm:block text-xs text-ink-4">
        {answeredCount} of {total} answered
      </span>
      {children}
    </div>
  );
}
