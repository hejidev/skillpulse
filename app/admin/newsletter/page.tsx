// app/admin/newsletter/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Send,
  Users,
  Mail,
  Activity,
  Info,
  History,
  FlaskConical,
} from "lucide-react";

type NewsletterMessage = {
  _id: string;
  title: string;
  createdAt: string;
  deliveryStats?: {
    sent: number;
    delivered: number;
    failed: number;
  };
};

export default function AdminNewsletterPage() {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [segment, setSegment] = useState<"all" | "confirmed">("confirmed");
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [history, setHistory] = useState<NewsletterMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const router = useRouter();

  const subjectStrength = Math.min(subject.length * 3, 100);
  const contentStrength = Math.min(
    html.replace(/<[^>]+>/g, "").length / 4,
    100
  );

  const handleSend = async () => {
    if (!subject.trim() || !html.trim()) {
      toast.error("Subject and content are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/admin/newsletter/send", {
        subject,
        html,
        segment,
      });

      toast.success(
        `Newsletter sent to ${res.data.sent} subscribers (${res.data.failed} failed).`
      );
      setSubject("");
      setHtml("");
      router.refresh();
      loadHistory();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send newsletter."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      toast.error("Enter a test email address.");
      return;
    }
    if (!subject.trim() || !html.trim()) {
      toast.error("Subject and content are required for test send.");
      return;
    }
    setTestLoading(true);
    try {
      await API.post("/admin/newsletter/send-test", {
        subject,
        html,
        to: testEmail,
      });
      toast.success(`Test newsletter sent to ${testEmail}.`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send test newsletter."
      );
    } finally {
      setTestLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await API.get("/admin/newsletter/history");
      setHistory(res.data.messages || []);
    } catch (err: any) {
      // history is a nice-to-have; just log toast quietly
      toast.error(
        err?.response?.data?.message || "Failed to load newsletter history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-10 mt-10">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Newsletter Control Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Craft, preview, test, and broadcast updates to your subscribers.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject + segment */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Compose Newsletter</h2>
                <p className="text-sm text-muted-foreground">
                  Subject line and audience segment.
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Broadcast
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="SkillPulse weekly update – new AI insights, goals & streak tools"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Audience</label>
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    variant={segment === "confirmed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSegment("confirmed")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Confirmed subscribers
                  </Button>
                  <Button
                    type="button"
                    variant={segment === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSegment("all")}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    All statuses
                  </Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  For production, prefer sending only to confirmed subscribers.
                </p>
              </div>
            </div>
          </Card>

          {/* HTML content */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Email Content (HTML)</h2>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Live preview compatible
              </Badge>
            </div>

            <Textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={14}
              placeholder={`<h2>Hey SkillPulse builders 👋</h2>
<p>Here’s what shipped this week...</p>`}
              className="font-mono text-xs bg-background/40"
            />

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  placeholder="Test email (optional)"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSendTest}
                  disabled={testLoading}
                  className="flex items-center gap-1"
                >
                  <FlaskConical className="h-4 w-4" />
                  {testLoading ? "Sending…" : "Send test"}
                </Button>
              </div>

              <Button
                onClick={handleSend}
                disabled={loading}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Send className="h-4 w-4" />
                {loading ? "Sending…" : "Send newsletter"}
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT: Insights / quality & history */}
        <div className="space-y-6">
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-primary" />
              <h2 className="text-lg font-semibold">Content Quality</h2>
            </div>

            <QualityBar label="Subject strength" value={subjectStrength} />
            <QualityBar label="Content depth" value={contentStrength} />

            <p className="text-xs text-muted-foreground mt-2">
              Aim for a clear subject and at least a few short paragraphs of
              content for better engagement.
            </p>
          </Card>

          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <History className="text-primary" />
              <h2 className="text-lg font-semibold">Recently sent</h2>
            </div>

            {historyLoading && (
              <p className="text-xs text-muted-foreground">Loading history…</p>
            )}

            {!historyLoading && history.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No broadcast newsletters sent yet.
              </p>
            )}

            {!historyLoading && history.length > 0 && (
              <ul className="space-y-2 text-xs">
                {history.slice(0, 5).map((msg) => (
                  <li
                    key={msg._id}
                    className="flex items-center justify-between border-b border-border/40 pb-1 last:border-b-0 last:pb-0"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-medium truncate">{msg.title}</p>
                      <p className="text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right text-muted-foreground">
                      <div className="text-[11px]">
                        Sent: {msg.deliveryStats?.delivered ?? 0}
                      </div>
                      <div className="text-[11px]">
                        Failed: {msg.deliveryStats?.failed ?? 0}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-primary" />
              <h2 className="text-lg font-semibold">Best practices</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Keep one main call‑to‑action per email.</li>
              <li>• Use short paragraphs; avoid walls of text.</li>
              <li>• Always include unsubscribe link (already appended).</li>
              <li>• Prefer sending to confirmed subscribers only.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QualityBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1 mb-3">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}