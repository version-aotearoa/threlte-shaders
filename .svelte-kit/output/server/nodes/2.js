

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.WDbKJE1G.js","_app/immutable/chunks/scheduler.DRJIIwch.js","_app/immutable/chunks/index.DcchKVHs.js","_app/immutable/chunks/index.DwaQWBLA.js"];
export const stylesheets = ["_app/immutable/assets/2.DAMpbBXL.css"];
export const fonts = [];
