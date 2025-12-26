import Editor,{ type OnMount } from "@monaco-editor/react";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useRef, useState } from "react";

type Props = {
    problemId?: string | number;
    defaultLang?: "javascript" | "python" | "cpp";
    defaultCode?: string;
}

const starterCode: Record<string, string> = {
    javascript: `// Javascript (Node.js)
    function solve(input) {
        const nums = input.trim().split(/\s+/).map(Number);
        console.log(nums.join(","));
    }
    const fs = require("fs");
    solve(fs.readFileSync(0, "utf-8"));`,
    
    python: `# Python 3
    import sys
    data = sys.stdin.read().strip()
    print(data)`,
    
    cpp: `#include <bits/stdc++.h>
    using namespace std;
    int main() {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);
        string s;
        // read all input
        string input;
        while(getline(cin, s)) { input += s + "\n";}
        cout << input;
        return 0;
    }`,
};

export default function CodeEditor({problemId, defaultLang = "javascript", defaultCode}: Props) {
    const [language, setLanguage] = useState<string>(defaultLang);
    const [code, setCode] = useState<string>(defaultCode ?? starterCode[defaultLang]);
    const [stdin, setStdin] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [running, setRunning] = useState<boolean>(false);
    const termRef = useRef<Terminal | null>(null);
    const termContainerRef = useRef<HTMLDivElement | null>(null);

    const onEditorMount: OnMount = (editor, monaco) => {
        editor.focus();
    }

    const initTerminal = () => {
        if (termRef.current) return;
        const term = new Terminal({ convertEol: true, cursorBlink: true, rows: 12});
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(termContainerRef.current!);
        fitAddon.fit();
        termRef.current = term;
    }

    async function runCode() {
        setOutput("");
        setRunning(true);
        initTerminal();
        termRef.current!.clear();
        termRef.current!.writeln("Running....");

        try {
            const res = await fetch("/api/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language, stdin }),
            });

            const data = await res.json();

            const text = `exitCode: ${data.exitCode}\n\nstdout:\n${data.stdout}\n\nstderr:\n${data.stderr}`;
            setOutput(text);
            termRef.current!.writeln(text);
        } catch(err: any) {
            const msg = "Run failed: " + (err?.message ?? String(err));
            setOutput(msg);
            termRef.current!.writeln(msg);
        } finally {
            setRunning(false);
        }
    }

    async function submitCode() {
        await runCode();
        // TODO: enqueue submission to backend judge
    }

    return (
        <div className="flex flex-col h-full min-h-[480pc] gap-4">
            <div className="flex items-center gap-3">
                <select
                    className="border rounded px-2 py-1"
                    value={language}
                    onChange={(e) => {
                        setLanguage(e.target.value);
                        if(!code || code == starterCode[language]) {
                            setCode(starterCode[e.target.value]);
                        }
                    }}
                >
                    <option value="javascript">Javascript (Node)</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++ (g++)</option>
                </select>

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
                    Submit
                </button>

                <div className="ml-auto text-sm text-muted forground">Problem: {problemId ?? "-"}</div>

                <div className="flex gap-4 flex-1">
                    {/* Monaco Editor */}
                    <div className="flex-1 border rounded overflow-hidden">
                        <Editor
                            height="60vh"
                            defaultLanguage={language}
                            language={language}
                            value={code}
                            onChange={(v) => v !== undefined && setCode(v)}
                            onMount={onEditorMount}
                            options={{
                                minimap: {enabled: false},
                                fontSize: 14,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Right Side: stdin + terminal */}
                    <div className="w-80 flex flex-col">
                        <div className="mb-2">
                            <label className="text-sm block mb-1">Custom Input</label>
                            <textarea className="w-full h-28 border rounded px-2 text-sm bg-[--card]" value={stdin} onChange={(e) => setStdin(e.target.value)} />
                        </div>

                        <div className="flex-1 border rounded p-2 bg-black/80 text-white text-xs overflow-auto">
                            <div ref={termContainerRef} style={{height: "100%", width: "100%"}} />
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                            Output shown above. For production, outputs should be streamed via WebSocket/
                        </div>
                    </div>
                </div>

                {/* Output area(text fallback) */}
                <pre className="bg-[#0b1220] text-white p-3 rounded text-sm overflow-auto max-h-40">
                    {output}
                </pre>
            </div>
        </div>
    );
}