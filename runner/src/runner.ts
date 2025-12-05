export function runCode(code: string) {
  return { output: `Received code ${code}`, success: true };
}

console.log(runCode('Hello World'));
