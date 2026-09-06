"use client";

import {
  BotIcon,
  CalendarPlusIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const workflowSteps = [
  {
    icon: BotIcon,
    title: "Create Agent",
    description: "Define an AI agent with its own instructions.",
  },
  {
    icon: CalendarPlusIcon,
    title: "Create Meeting",
    description: "Set up a meeting and assign your agent.",
  },
  {
    icon: VideoIcon,
    title: "Join Session",
    description: "Talk with your agent live on the call.",
  },
  {
    icon: CircleCheckIcon,
    title: "Completed",
    description: "End the call and processing starts.",
  },
  {
    icon: SparklesIcon,
    title: "Summary Created",
    description: "Get summaries, transcripts and chat.",
  },
];

export const HomeView = () => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        {/* Hero */}
        <h1 className="bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-800 bg-clip-text text-center text-5xl font-bold tracking-tighter text-transparent leading-tight pb-3 sm:text-6xl lg:text-7xl">
          Welcome to Meetingly
        </h1>
        <p className="mt-8 max-w-xl sm:mt-10 text-center text-sm text-muted-foreground sm:text-base">
          AI-powered video meetings with real-time agents, automated summaries,
          searchable transcripts and contextual post-call chat.
        </p>

        {/* Workflow */}
        <p className="mt-12 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          How it works
        </p>

        <div className="mt-6 flex w-full flex-col items-center justify-center gap-2 xl:flex-row xl:items-stretch xl:gap-3">
          {workflowSteps.map((step, index) => (
            <div
              key={step.title}
              className="flex w-full flex-col items-center xl:w-auto xl:flex-1 xl:flex-row"
            >
              <Card
                className={cn(
                  "w-full max-w-sm gap-0 border-border/60 px-4 py-5 shadow-sm transition-colors xl:max-w-none",
                  "hover:border-teal-700/40 hover:bg-teal-50/50",
                )}
              >
                <div className="flex items-center gap-3 xl:flex-col xl:items-start xl:gap-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-800 to-teal-900 text-white xl:mb-3">
                    <step.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Connector */}
              {index < workflowSteps.length - 1 && (
                <ChevronRightIcon
                  aria-hidden
                  className="my-1 size-5 shrink-0 rotate-90 text-muted-foreground/50 xl:mx-1 xl:my-0 xl:rotate-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
