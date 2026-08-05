import { useEffect, useMemo, useState } from "react";
import type { OrgTask, RunRecord } from "../../api/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../../components/ui/command";
import type { RosterEntry } from "../../lib/types";
import { isTaskStatusCompleted } from "../status";

export function CommandDeck({
  roster,
  tasks,
  runs = [],
  onSelectSeat,
  onSelectRun,
  onSelectTaskContext,
  showTrigger = true,
}: {
  roster: RosterEntry[];
  tasks: OrgTask[];
  runs?: Pick<RunRecord, "runId" | "position">[];
  onSelectSeat: (slug: string) => void;
  onSelectRun: (runId: string) => void;
  onSelectTaskContext?: (task: OrgTask) => void;
  showTrigger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const activeTasks = useMemo(
    () => tasks.filter((task) => !isTaskStatusCompleted(task.status)),
    [tasks],
  );
  const runPositionById = useMemo(
    () => new Map(runs.map((run) => [run.runId, run.position])),
    [runs],
  );
  const shortcut = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
    ? "⌘K"
    : "Ctrl K";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.key.toLowerCase() !== "k" ||
        (!event.metaKey && !event.ctrlKey)
      ) {
        return;
      }
      event.preventDefault();
      setOpen((current) => !current);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function selectTask(task: OrgTask) {
    const slug = task.slug ?? (task.runId ? runPositionById.get(task.runId) : undefined);
    if (slug) onSelectSeat(slug);
    if (task.runId) onSelectRun(task.runId);
    if (!slug && !task.runId) onSelectTaskContext?.(task);
    setOpen(false);
  }

  return (
    <>
      {showTrigger ? (
        <button
          type="button"
          className="j-btn j-command-trigger"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <span>Command deck</span>
          <kbd className="j-command-kbd">{shortcut}</kbd>
        </button>
      ) : null}
      <CommandDialog open={open} onOpenChange={setOpen} title="Command deck">
        <CommandInput
          aria-label="Search command deck"
          placeholder="Search seats and active tasks…"
        />
        <CommandList>
          <CommandEmpty>No seats or active tasks found.</CommandEmpty>
          <CommandGroup heading="Seats">
            {roster.map((seat) => (
              <CommandItem
                key={seat.slug}
                value={`${seat.title} ${seat.slug} ${seat.dept}`}
                onSelect={() => {
                  onSelectSeat(seat.slug);
                  setOpen(false);
                }}
              >
                <span>
                  <strong>{seat.title}</strong>
                  <small className="j-command-meta">
                    {seat.slug} · {seat.dept}
                  </small>
                </span>
                <CommandShortcut>Focus seat</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Active tasks">
            {activeTasks.map((task) => (
              <CommandItem
                key={task.id}
                value={`${task.title} ${task.slug ?? ""} ${task.status} ${task.source}`}
                onSelect={() => selectTask(task)}
              >
                <span>
                  <strong>{task.title}</strong>
                  <small className="j-command-meta">
                    {task.status} · {task.source}
                  </small>
                </span>
                <CommandShortcut>{task.runId ? "Open run" : "Focus task"}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
