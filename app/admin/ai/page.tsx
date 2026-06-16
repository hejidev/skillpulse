"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

/* ================= MOCK PROMPTS ================= */
const prompts = [
  {
    id: 1,
    name: "Support Reply Engine",
    version: "v3.1",
    category: "tickets",
    prompt:
      "You are a support agent. Reply politely, solve user issues clearly, and escalate if needed.",
  },
  {
    id: 2,
    name: "Billing Assistant",
    version: "v2.4",
    category: "billing",
    prompt:
      "Assist users with payment issues. Prioritize failed transactions and refund requests.",
  },
];

export default function AIAssistantPage() {
  const [selected, setSelected] = useState(prompts[0]);
  const [testInput, setTestInput] = useState("");
  const [result, setResult] = useState("");

  const runAI = () => {
    setResult(
      `🤖 AI RESPONSE:\n\nBased on prompt "${selected.name}", I suggest:\n\n"Please restart your session and try again. If issue persists, our team will assist immediately."`
    );
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[90vh]">

      {/* ================= PROMPT LIBRARY ================= */}
      <Card className="lg:col-span-4 p-4 bg-card/40 backdrop-blur-xl flex flex-col">

        <div className="flex items-center gap-2 mb-4">
          <Bot />
          <h2 className="font-semibold">AI Prompt Library</h2>
        </div>

        <div className="space-y-3 overflow-auto">

          {prompts.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className={`p-3 border rounded-xl cursor-pointer transition hover:bg-accent
                ${selected.id === p.id ? "border-primary bg-primary/10" : ""}`}
            >

              <div className="flex justify-between">
                <p className="font-medium text-sm">{p.name}</p>
                <Badge variant="outline">{p.version}</Badge>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {p.category}
              </p>

            </div>
          ))}

        </div>

        <Button className="mt-4 w-full" variant="outline">
          + Create New Prompt
        </Button>

      </Card>

      {/* ================= PROMPT EDITOR ================= */}
      <Card className="lg:col-span-5 p-5 bg-card/40 backdrop-blur-xl flex flex-col">

        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Wand2 size={18} />
            Prompt Editor
          </h2>

          <Badge>{selected.version}</Badge>
        </div>

        <Input className="mt-4" value={selected.name} />

        <Textarea
          className="mt-4 flex-1"
          value={selected.prompt}
        />

        <div className="flex gap-2 mt-4">

          <Button className="flex-1">
            Save Prompt
          </Button>

          <Button variant="outline" className="flex-1">
            Deploy
          </Button>

        </div>

      </Card>

      {/* ================= AI TEST + AUTOPILOT ================= */}
      <div className="lg:col-span-3 space-y-4">

        {/* TEST AI */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl">

          <div className="flex items-center gap-2">
            <Sparkles />
            <h3 className="font-semibold">AI Test Lab</h3>
          </div>

          <Textarea
            className="mt-3"
            placeholder="Test user message..."
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
          />

          <Button onClick={runAI} className="w-full mt-3">
            Run AI Simulation
          </Button>

          {result && (
            <div className="mt-3 p-3 bg-background border rounded-xl text-sm whitespace-pre-line">
              {result}
            </div>
          )}

        </Card>

        {/* AUTOPILOT STATUS */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl">

          <div className="flex items-center gap-2 text-green-400">
            <Zap size={16} />
            <h3 className="font-semibold text-white">
              Ticket Autopilot Active
            </h3>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            AI is auto-suggesting replies for incoming tickets
          </p>

        </Card>

        {/* AI METRICS */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl space-y-3">

          <h3 className="font-semibold">AI Performance</h3>

          <Metric label="Tickets handled" value="1,284" />
          <Metric label="Auto replies sent" value="842" />
          <Metric label="Accuracy rate" value="93%" />
          <Metric label="Time saved" value="42 hrs" />

        </Card>

      </div>

    </div>
  );
}

/* ================= METRIC ================= */
function Metric({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}