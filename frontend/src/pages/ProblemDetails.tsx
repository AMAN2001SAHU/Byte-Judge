import CodeEditor, { type CodeEditorHandle } from "@/components/CodeEditor";
import { Badge } from "@/components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

type OutputTab = "input" | "output";

type SubmissionResult = {
  submissionId: string;
  status: "ACCEPTED" | "WRONG" | "TLE" | "RUNTIME_ERROR";
  timeMs: number;
  memoryKb: number;
  stdout?: string;
  stderr?: string;
};

export default function ProblemDetails() {
  const { id } = useParams();
  const editorRef = useRef<CodeEditorHandle>(null);
  const [stdin, setStdin] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);
  const [submiting, setsubmiting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<OutputTab>("input");
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  function isOutputTab(v: string): v is OutputTab {
    return v === "input" || v === "output";
  }

  async function runCode() {
    if (!editorRef.current) return;

    setOutput("");
    setRunning(true);

    const code = editorRef.current.getCode();
    const language = editorRef.current.getLanguage();

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();

      const text = `exitCode: ${data.exitCode}\n\nstdout:\n${data.stdout}\n\nstderr:\n${data.stderr}`;

      setOutput(text);
      setActiveTab("output");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setOutput(msg);
      setActiveTab("output");
    } finally {
      setRunning(false);
    }
  }

  async function submitCode() {
    // await runCode();
    if (!editorRef.current) return;

    setRunning(true);
    setSubmission(null);
    setsubmiting(true);

    const code = editorRef.current.getCode();
    const language = editorRef.current.getLanguage();

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: id,
          code,
          language,
          stdin,
        }),
      });

      if (!res.ok) {
        throw new Error(`Submit failed: ${res.status}`);
      }

      const data: SubmissionResult = await res.json();
      setSubmission(data);
      setActiveTab("output");
    } catch (err) {
      setSubmission({
        submissionId: "error",
        status: "RUNTIME_ERROR",
        timeMs: 0,
        memoryKb: 0,
        stderr: err instanceof Error ? err.message : "Unknown submission error",
      });
      setActiveTab("output");
    } finally {
      setRunning(false);
      setsubmiting(false);
    }
  }
  // async function submitCode() {
  //   setsubmiting(true);
  //   setTimeout(() => {
  //     setSubmission({
  //       submissionId: "mock_1",
  //       status: "ACCEPTED",
  //       timeMs: 28,
  //       memoryKb: 12288,
  //     });
  //     setRunning(false);
  //     setsubmiting(false);
  //     setActiveTab("output");
  //   }, 800);
  // }

  const problem = {
    id,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "48%",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Only one valid answer exists.",
    ],
  };

  return (
    <div className="h-[calc(100vh-3.5rem-3rem)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={30}>
          <div className="h-full overflow-auto p-4 space-y-6">
            {/* Title */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <Badge
                className={
                  problem.difficulty === "Easy"
                    ? "bg-green-600"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }
              >
                {problem.difficulty}
              </Badge>
            </div>

            {/* Meta info */}
            <p className="text-sm text-muted-foreground">
              Acceptance: {problem.acceptance}
            </p>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p>{problem.description}</p>
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Examples</h2>

              {problem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 bg-secondary/30 space-y-2"
                >
                  <p>
                    <span className="font-semibold">Input: </span>
                    {ex.input}
                  </p>
                  <p>
                    <span className="font-semibold">Output: </span>
                    {ex.output}
                  </p>

                  {ex.explanation && (
                    <p>
                      <span className="font-semibold">Explanation: </span>
                      {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Constraints</h2>
              <ul className="list-disc pl-6 text-muted-foreground">
                {problem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={50}
          minSize={30}
          className="overflow-hidden"
        >
          <ResizablePanelGroup direction="vertical">
            <div className="flex items-center gap-3 m-2">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                onClick={runCode}
                disabled={running}
              >
                {running ? "Running..." : "Run"}
              </button>

              <button
                className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                onClick={submitCode}
                disabled={running}
              >
                {submiting ? "Submit..." : "Submit"}
              </button>
              {submission && (
                <div
                  className={`rounded-md p-3 text-sm border ${
                    submission.status === "ACCEPTED"
                      ? "bg-green-600/10 border-green-600 text-green-500"
                      : "bg-red-600/10 border-red-600 text-red-500"
                  }`}
                >
                  <div className="font-semibold">
                    {" "}
                    {submission.status.replace("_", " ")}{" "}
                  </div>
                  <div className="mt-1 text-xs">
                    Time: {submission.timeMs} ms · Memory: {submission.memoryKb}{" "}
                    KB
                  </div>
                </div>
              )}
            </div>
            {/* Code Editor */}
            <ResizablePanel defaultSize={70} minSize={40}>
              <CodeEditor defaultLang="cpp" ref={editorRef} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Custom Input (collapsible) */}
            <ResizablePanel defaultSize={30} minSize={10} collapsible>
              <Tabs
                defaultValue="input"
                className="h-full flex flex-col overflow-hidden pt-2"
                value={activeTab}
                onValueChange={(v) => {
                  if (isOutputTab(v)) {
                    setActiveTab(v);
                  }
                }}
              >
                <TabsList className="w-full justify-start shrink-0">
                  <TabsTrigger value="input">Input</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="flex-1 mt-2">
                  <textarea
                    className="w-full h-full resize-none rounded border p-2 bg-background text-foreground"
                    placeholder="Enter custom input here..."
                    value={stdin}
                    onChange={(e) => {
                      setStdin(e.target.value);
                    }}
                  />
                </TabsContent>

                <TabsContent
                  value="output"
                  className="flex-1 overflow-auto mt-2"
                >
                  <pre className="w-full h-full bg-black/80 text-white p-2 rounded text-sm">
                    {output || "Run code to the output"}
                  </pre>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
