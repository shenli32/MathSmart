// Vercel serverless function. The browser never receives the AI key or MindDo token.
const { askMath, safeError, logErrorFix } = require("../server/ai");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: { message: "That action is not available.", fix: "Use the MathSmart buttons." } });
  }

  try {
    const answer = await askMath(request.body?.question);
    return response.status(200).json({ answer });
  } catch (error) {
    logErrorFix(error);
    return response.status(400).json({ error: safeError(error) });
  }
};
