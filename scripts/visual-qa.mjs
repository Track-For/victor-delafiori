import { mkdir, writeFile } from "node:fs/promises";

const endpoint = "http://127.0.0.1:9223";
const viewportWidth = Number(process.argv[2] || 1440);
const viewportHeight = Number(process.argv[3] || 720);
const targetUrl = process.argv[4] || "http://localhost:3000";
const flags = new Set(process.argv.slice(5));
const emulateMobile = flags.has("mobile");
const emulateLegacyMediaQuery = flags.has("legacy-media");
const reduceMotion = flags.has("reduced-motion");
const scenePause = emulateMobile ? 650 : 1800;
const outputPrefix = `${viewportWidth}x${viewportHeight}${emulateMobile ? "-mobile" : ""}`;
const outputDir = new URL("../.qa/", import.meta.url);
await mkdir(outputDir, { recursive: true });

const target = await fetch(`${endpoint}/json/new?${encodeURIComponent("about:blank")}`, {
  method: "PUT",
}).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const browserEvents = [];
let sequence = 0;

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") {
    browserEvents.push({
      type: "exception",
      text: message.params.exceptionDetails?.text,
      description: message.params.exceptionDetails?.exception?.description,
      url: message.params.exceptionDetails?.url,
      lineNumber: message.params.exceptionDetails?.lineNumber,
      columnNumber: message.params.exceptionDetails?.columnNumber,
    });
  }
  if (message.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(message.params.type)) {
    browserEvents.push({
      type: `console.${message.params.type}`,
      values: message.params.args.map((argument) => argument.value ?? argument.description),
    });
  }
  if (message.method === "Network.loadingFailed" && !message.params.canceled) {
    browserEvents.push({
      type: "network.failure",
      errorText: message.params.errorText,
      blockedReason: message.params.blockedReason,
    });
  }
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  const id = ++sequence;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const pause = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return result.result.value;
}

async function capture(name) {
  const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile(new URL(`${outputPrefix}-${name}.png`, outputDir), Buffer.from(result.data, "base64"));
}

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: viewportWidth,
  height: viewportHeight,
  deviceScaleFactor: emulateMobile ? 3 : 1,
  mobile: emulateMobile,
});
await send("Emulation.setTouchEmulationEnabled", {
  enabled: emulateMobile,
  maxTouchPoints: emulateMobile ? 5 : 0,
});
if (reduceMotion) {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
}
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `
    ${emulateLegacyMediaQuery ? `
      MediaQueryList.prototype.addEventListener = undefined;
      MediaQueryList.prototype.removeEventListener = undefined;
    ` : ""}
    window.__QA_ERRORS__ = [];
    window.addEventListener("error", (event) => {
      window.__QA_ERRORS__.push({ type: "error", message: event.message, source: event.filename, line: event.lineno, column: event.colno });
    });
    window.addEventListener("unhandledrejection", (event) => {
      window.__QA_ERRORS__.push({ type: "unhandledrejection", reason: String(event.reason?.stack || event.reason) });
    });
  `,
});
await send("Page.navigate", { url: targetUrl });
await pause(emulateMobile ? 1800 : 2800);

await capture("00-hero");

const scrollToScene = async (selector, ratio = 0.5) => {
  const before = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    const style = getComputedStyle(element);
    const frame = element.querySelector?.('.identity-preview__frame');
    const image = element.querySelector?.('.identity-preview__image');
    return {
      opacity: style.opacity,
      transform: style.transform,
      clipPath: frame ? getComputedStyle(frame).clipPath : null,
      imageTransform: image ? getComputedStyle(image).transform : null,
    };
  })()`);
  const requested = await evaluate(`(() => {
    const track = document.querySelector('[data-home-track]');
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!track || !element) return false;
    const layoutOffset = (node) => {
      let value = 0;
      while (node) { value += node.offsetLeft || 0; node = node.offsetParent; }
      return value;
    };
    if (innerWidth <= 900) {
      element.scrollIntoView({ block: 'center', behavior: 'instant' });
      return { selector: ${JSON.stringify(selector)}, mobile: true, scrollY };
    }
    const distance = Math.max(1, track.scrollWidth - innerWidth);
    const target = layoutOffset(element) - layoutOffset(track) + element.offsetWidth * ${ratio} - innerWidth / 2;
    window.scrollTo({ top: Math.max(0, Math.min(distance, target)), behavior: 'instant' });
    return { selector: ${JSON.stringify(selector)}, target, distance, scrollY, trackWidth: track.scrollWidth, offset: layoutOffset(element) - layoutOffset(track), width: element.offsetWidth };
  })()`);
  await pause(scenePause);
  const settled = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    const style = element ? getComputedStyle(element) : null;
    const frame = element?.querySelector?.('.identity-preview__frame');
    const image = element?.querySelector?.('.identity-preview__image');
    return {
      scrollY,
      trackTransform: getComputedStyle(document.querySelector('[data-home-track]')).transform,
      element: style ? {
        opacity: style.opacity,
        transform: style.transform,
        clipPath: frame ? getComputedStyle(frame).clipPath : null,
        imageTransform: image ? getComputedStyle(image).transform : null,
      } : null,
    };
  })()`);
  console.log(JSON.stringify({ before, requested, settled }));
};

await scrollToScene("[data-identity-preview]:nth-child(1)");
await capture("01-identity-first");
await scrollToScene("[data-identity-preview]:nth-child(2)");
await capture("02-identity-second");
await scrollToScene("[data-identity-editorial]");
await capture("03-identity-editorial");
await scrollToScene(".symbol-story__stage");
await capture("04-symbol");
await scrollToScene(".services__title");
await capture("05-services");
await evaluate("window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })");
await pause(1400);
await capture("06-footer-hero");

const diagnostics = await evaluate(`(() => ({
  url: location.href,
  readyState: document.readyState,
  viewport: [innerWidth, innerHeight],
  scrollY,
  scrollHeight: document.documentElement.scrollHeight,
  prefersReducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  coarsePointer: matchMedia('(pointer: coarse)').matches,
  horizontalEnabled: document.querySelector('[data-home-horizontal]')?.hasAttribute('data-horizontal-enabled'),
  trackWidth: document.querySelector('[data-home-track]')?.scrollWidth,
  bodyOverflowX: document.body.scrollWidth - innerWidth,
  pageLoadingPresent: Boolean(document.querySelector('.page-loading')),
  heroTitle: (() => {
    const element = document.querySelector('[data-hero-title]');
    if (!element) return null;
    const style = getComputedStyle(element);
    return { opacity: style.opacity, visibility: style.visibility, transform: style.transform, words: element.querySelectorAll('.hero-word').length };
  })(),
  revealSamples: Array.from(document.querySelectorAll('[data-reveal]')).slice(0, 6).map((element) => {
    const style = getComputedStyle(element);
    return { tag: element.tagName, opacity: style.opacity, visibility: style.visibility, transform: style.transform };
  }),
  errors: window.__QA_ERRORS__ || [],
}))()`);

console.log(JSON.stringify({ ...diagnostics, browserEvents }, null, 2));
socket.close();
