// The only file that asks OpenAI for an answer. Server-only code.
const fs = require("node:fs");
const path = require("node:path");
const { getKey, reportOpenAIKeyInvalid, toErrorResponse, logErrorFix } = require("./minddo-key");

const MODEL = "gpt-5.6-luna";
const BRIEF_PATH = path.join(__dirname, "..", "BRIEF.md");

function getAiInstructions() {
  const brief = fs.readFileSync(BRIEF_PATH, "utf8");
  const start = brief.indexOf("## My AI’s instructions");
  if (start < 0) throw new Error("The AI instructions are missing from BRIEF.md.");
  const rest = brief.slice(start);
  const nextSection = rest.indexOf("\n## ", "## My AI’s instructions".length);
  return nextSection < 0 ? rest : rest.slice(0, nextSection);
}

function safeError(error) {
  return toErrorResponse(error).error;
}

async function askOpenAI(question) {
  const { apiKey } = await getKey();
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: getAiInstructions(),
      input: question,
      max_output_tokens: 700,
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) reportOpenAIKeyInvalid();
    const error = new Error(body?.error?.message || "The AI could not answer right now.");
    error.fix = body?.error?.fix || "Check the internet connection and your AI key.";
    throw error;
  }

  const answer = body.output_text || (body.output || [])
    .flatMap(item => item.content || [])
    .map(item => item.text || "")
    .join("\n")
    .trim();
  if (!answer) {
    const error = new Error("The AI returned an empty answer.");
    error.fix = "Try asking the math question again.";
    throw error;
  }
  return answer;
}

async function askMath(question) {
  if (typeof question !== "string" || !question.trim()) {
    const error = new Error("Please say a math question first.");
    error.fix = "Use the microphone button and ask one math question.";
    throw error;
  }
  if (question.length > 500) {
    const error = new Error("That question is too long.");
    error.fix = "Ask a shorter math question.";
    throw error;
  }
  return askOpenAI(question.trim());
}

module.exports = { askMath, safeError, logErrorFix };
