import CodeEditor from '@/components/CodeEditor';
import { Badge } from '@/components/ui/badge';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProblemDetails() {
  const { id } = useParams();
  const [stdin, setStdin] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const problem = {
    id,
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: '48%',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10⁴',
      '-10⁹ <= nums[i] <= 10⁹',
      '-10⁹ <= target <= 10⁹',
      'Only one valid answer exists.',
    ],
  };

  return (
    <div className="h-[calc(100vh-3.5rem-3rem)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full overflow-auto p-4 space-y-6">
            {/* Title */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <Badge
                className={
                  problem.difficulty === 'Easy'
                    ? 'bg-green-600'
                    : problem.difficulty === 'Medium'
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
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
            {/* Code Editor */}
            <ResizablePanel defaultSize={70} minSize={40}>
              <CodeEditor
                problemId={id}
                defaultLang="javascript"
                stdin={stdin}
                setOutput={setOutput}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Custom Input (collapsible) */}
            <ResizablePanel defaultSize={30} minSize={10} collapsible>
              <Tabs
                defaultValue="input"
                className="h-full flex flex-col overflow-hidden pt-2"
              >
                <TabsList className="w-full justify-start shrink-0">
                  <TabsTrigger value="input">Input</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="flex-1 mt-2">
                  <textarea
                    className="w-full h-full resize-none rounded border p-2 bg-background text-foreground"
                    placeholder="Enter custom input here..."
                  />
                </TabsContent>

                <TabsContent
                  value="output"
                  className="flex-1 overflow-auto mt-2"
                >
                  <pre className="w-full h-full bg-black/80 text-white p-2 rounded text-sm">
                    Output will appear here...
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
