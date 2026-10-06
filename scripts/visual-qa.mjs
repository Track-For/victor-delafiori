import { mkdir, writeFile } from "node:fs/promises";

const endpoint = "http://127.0.0.1:9223";
const viewportWidth = Number(process.argv[2] || 1440);
const viewportHeight = Number(process.argv[3] || 720);
const outputPrefix = `${viewportWidth}x${viewportHeight}`;
const outputDir = new URL("../.qa/", import.meta.url);
await mkdir(outputDir, { recursive: true });

const target = await fetch(`${endpoint}/json/new?${encodeURIComponent("http://localhost:3000")}`, {
  method: "PUT",
}).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let sequence = 0;

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
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
await send("Emulation.setDeviceMetricsOverride", {
  width: viewportWidth,
  height: viewportHeight,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: "http://localhost:3000" });
await pause(2800);

await capture("00-hero");

const scrollToScene = async (selector, ratio = 0.5) => {
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
  await pause(1800);
  const settled = await evaluate(`(() => ({ scrollY, transform: getComputedStyle(document.querySelector('[data-home-track]')).transform }))()`);
  console.log(JSON.stringify({ requested, settled }));
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
  viewport: [innerWidth, innerHeight],
  scrollY,
  scrollHeight: document.documentElement.scrollHeight,
  horizontalEnabled: document.querySelector('[data-home-horizontal]')?.hasAttribute('data-horizontal-enabled'),
  trackWidth: document.querySelector('[data-home-track]')?.scrollWidth,
  bodyOverflowX: document.body.scrollWidth - innerWidth,
  errors: window.__QA_ERRORS__ || [],
}))()`);

console.log(JSON.stringify(diagnostics, null, 2));
socket.close();
