// Service worker: makes the browser build a real offline app.
//
// On first load every file the game needs (this list, plus the compiled
// core) is copied into the browser's cache. From then on the page is served
// from that cache, so once it's on the home screen it runs with no network
// at all -- the phone never talks to the host again until a new version is
// deployed. Nothing the user picks (sprites, cries, dex text) goes through
// here: those live in IndexedDB, loaded from the local file picker, and are
// never fetched from anywhere.
//
// VERSION is replaced with the commit id by the deploy workflow, so every
// deploy gets a fresh cache name; the old one is deleted on activate. While
// developing locally it stays "dev".

const VERSION = "__BUILD__";
const CACHE = `itamapoke-${VERSION}`;

const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.png",
  "./tp_core.js",
  "./tp_core.wasm",
  "./sprites.js",
  "./thumbs.js",
  "./icons.js",
  "./scene.js",
  "./behaviour.js",
  "./audio.js",
  "./de-ui.js",
  "./mini-progress.js",
  "./minigames.js",
  "./battle-training.js",
  "./dexentry.js",
  "./cry.js",
  "./dex-meta.js",
  "./dex-tools.js",
  "./comfort.js",
  "./dex.js",
  "./battle.js",
  "./arena-kanto.js",
  "./arena.js",
  "./league-kanto-data.js",
  "./league-kanto.js",
  "./league-hall.js",
  "./card.js",
  "./expedition.js",
  "./ceremony.js",
  "./storage-tools.js",
  "./collection-model.js",
  "./collection-persistence.js",
  "./collection-capture.js",
  "./collection-lifecycle.js",
  "./collection-boxes.js",
  "./collection-boxes.css",
  "./management.js",
  "./egg-planning.js",
  "./expedition-planning.js",
  "./trainer-art.js",
  "./badge-ui.js",
  "./rights-data.js",
  "./rights.js",
  "./rights.css",
  "./app-menu.js",
  "./mega.js",
  "./app-menu.css",
  "./app-theme.css",
  "./performance-metrics.js",
  "./diagnostics.js",
  "./main.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    // One file at a time rather than addAll: a local dev checkout has no
    // icon.png (the deploy workflow copies it in), and a single 404 must
    // not veto the whole install.
    //
    // `cache: "reload"` on each fetch skips the browser's *HTTP* cache.
    // Without it a new worker can precache files the HTTP layer still has
    // from the previous deploy -- a new cache name full of old files, which
    // looks exactly like the update never happened.
    caches.open(CACHE)
      .then((cache) => Promise.all(FILES.map((f) =>
        fetch(new Request(f, { cache: "reload" }))
          .then((res) => (res.ok ? cache.put(f, res) : null))
          .catch(() => {})
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache first: the whole app is precached, so a hit is the normal path. A
// miss (a file added after this worker was installed) falls through to the
// network and is cached for next time.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(event.request).then((res) => {
        if (res.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return res;
      });
    })
  );
});

// Read-only D2 manifest response: no network access or cache mutation.
self.addEventListener("message",event=>{if(event.data?.type==="TP_DIAGNOSTICS"&&event.ports?.[0])event.ports[0].postMessage({version:VERSION,files:FILES});});
