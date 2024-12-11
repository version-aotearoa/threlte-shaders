export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","models/threlte.glb"]),
	mimeTypes: {".png":"image/png",".glb":"model/gltf-binary"},
	_: {
		client: {"start":"_app/immutable/entry/start.Cj3JfB7n.js","app":"_app/immutable/entry/app.DJwXzCXI.js","imports":["_app/immutable/entry/start.Cj3JfB7n.js","_app/immutable/chunks/entry.DKIPfEoS.js","_app/immutable/chunks/scheduler.DRJIIwch.js","_app/immutable/chunks/index.DwaQWBLA.js","_app/immutable/entry/app.DJwXzCXI.js","_app/immutable/chunks/scheduler.DRJIIwch.js","_app/immutable/chunks/index.DcchKVHs.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
