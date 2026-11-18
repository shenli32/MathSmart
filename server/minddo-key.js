// Server-only helper. Do not import this module into browser or app code.

const KEYGEN_URL = "KEYGEN_URL";
const KEYGEN_TOKEN = "KEYGEN_TOKEN";
const REQUEST_TIMEOUT_MS = 15_000;

let cachedKey = null;
let cachedExpiresAt = 0;

class MindDoError extends Error {
  constructor(message, fix, cause) {
    super(message);
    this.name = "MindDoError";
    this.fix = fix;
    this.cause = cause;
  }
}

function makeError(message, fix, cause) {
  return new MindDoError(message, fix, cause);
}

function getConfig() {
  const url = process.env[KEYGEN_URL];
  const token = process.env[KEYGEN_TOKEN];
  if (!url || !token || url === "paste-here" || token === "paste-here") {
    throw makeError(
      "The MindDo key service is not configured.",
      "Set KEYGEN_URL and KEYGEN_TOKEN in the server's .env file."
    );
  }
  return { url: url.replace(/\/+$/, ""), token };
}

function isUsableCache() {
  return cachedKey && cachedExpiresAt > Date.now();
}

function clearCachedKey() {
  cachedKey = null;
  cachedExpiresAt = 0;
}

async function requestKey() {
  const { url, token } = getConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${url}/api/lookup-key`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok) {
      throw makeError(
        body?.error?.message || "MindDo could not provide an AI key.",
        body?.error?.fix || "Check the MindDo URL and token, then try again."
      );
    }

    const apiKey = body?.apiKey;
    const expiresAt = Date.parse(body?.expiresAt || "");
    if (typeof apiKey !== "string" || !apiKey || !Number.isFinite(expiresAt)) {
      throw makeError(
        "MindDo returned an invalid key response.",
        "Make sure the key service returns apiKey and expiresAt."
      );
    }

    cachedKey = apiKey;
    cachedExpiresAt = expiresAt;
    return { apiKey: cachedKey, expiresAt: new Date(cachedExpiresAt).toISOString() };
  } catch (error) {
    if (error instanceof MindDoError) throw error;
    const message = error?.name === "AbortError"
      ? "The MindDo key request timed out."
      : "The MindDo key request failed.";
    throw makeError(message, "Check the MindDo service and your server connection.", error);
  } finally {
    clearTimeout(timeout);
  }
}

async function getKey() {
  if (isUsableCache()) {
    return { apiKey: cachedKey, expiresAt: new Date(cachedExpiresAt).toISOString() };
  }
  clearCachedKey();
  return requestKey();
}

// Call this when OpenAI reports that the current key is invalid, then call getKey().
function reportOpenAIKeyInvalid() {
  clearCachedKey();
}

// Use these helpers in a server route: show response.error.message to the user,
// and log response.error.fix on the server. Never log the key or token.
function toErrorResponse(error) {
  return {
    error: {
      message: error?.message || "The AI key request failed.",
      fix: error?.fix || "Try again later or contact the server administrator.",
    },
  };
}

function logErrorFix(error, logger = console.error) {
  if (error?.fix) logger(error.fix);
}

module.exports = {
  getKey,
  reportOpenAIKeyInvalid,
  toErrorResponse,
  logErrorFix,
  MindDoError,
};
