import { Check, X, Clock, LogOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OutingStatus } from "@/types";

const steps = [
  { key: "pending-parent", label: "Pending Parent", icon: Clock },
  { key: "parent-decision", label: "Parent Decision", icon: Check },
  { key: "pending-warden", label: "Pending Warden", icon: Clock },
  { key: "approved", label: "Approved", icon: Check },
  { key: "out", label: "Out", icon: LogOut },
  { key: "returned", label: "Returned", icon: RotateCcw },
];

function getStepState(stepKey: string, status: OutingStatus): "completed" | "current" | "declined" | "upcoming" {
  const order: OutingStatus[] = ["pending-parent", "parent-approved", "pending-warden", "approved", "out", "returned"];
  const statusIndex = order.indexOf(status);

  if (status === "parent-declined") {
    if (stepKey === "pending-parent") return "completed";
    if (stepKey === "parent-decision") return "declined";
    return "upcoming";
  }

  const stepMap: Record<string, number> = {
    "pending-parent": 0,
    "parent-decision": 1,
    "pending-warden": 2,
    approved: 3,
    out: 4,
    returned: 5,
  };

  const stepIndex = stepMap[stepKey];
  if (stepIndex < statusIndex) return "completed";
  if (stepIndex === statusIndex) return "current";
  return "upcoming";
}

export function StatusTimeline({ status }: { status: OutingStatus }) {
  return (
    <div className="w-full py-2">
      <div className="grid grid-cols-3 gap-y-8 sm:flex sm:items-start sm:w-full">
        {steps.map((step, index) => {
          const state = getStepState(step.key, status);
          const Icon = state === "declined" ? X : step.icon;

          return (
            <div
              key={step.key}
              className={cn(
                "flex flex-col items-center relative group",
                // On desktop, all items except last grow to fill space
                "sm:flex-1",
                // On desktop, last item shouldn't grow aggressively but needs to be consistent
                index === steps.length - 1 && "sm:flex-none"
              )}
            >
              <div className="flex flex-col items-center gap-2 relative z-10 w-full px-2">
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-[3px] transition-all duration-300 z-10 bg-white shadow-sm",
                    state === "completed" && "border-green-500 bg-green-500 text-white shadow-green-200",
                    state === "current" && "border-green-500 bg-white text-green-500 ring-4 ring-green-100",
                    state === "declined" && "border-red-500 bg-red-500 text-white",
                    state === "upcoming" && "border-slate-200 bg-slate-50 text-slate-300"
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span
                  className={cn(
                    "text-[11px] sm:text-xs font-semibold text-center mt-2 w-24 leading-snug tracking-tight",
                    state === "upcoming" ? "text-slate-400" : "text-slate-700"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Desktop Connector */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "hidden sm:block absolute top-[1.25rem] left-[50%] w-full h-[3px] transition-colors duration-300 -z-0",
                    state === "completed" ? "bg-green-500" : "bg-slate-200"
                  )}
                />
              )}

              {/* Mobile Connector */}
              {index % 3 !== 2 && index < steps.length - 1 && (
                <div
                  className={cn(
                    "sm:hidden absolute top-[1rem] left-[50%] w-[100%] h-[3px] -z-0",
                    state === "completed" ? "bg-green-500" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
