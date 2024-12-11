import { b as set_current_component, r as run_all, d as current_component, o as onDestroy, s as setContext, g as getContext, c as create_ssr_component, a as subscribe, v as validate_component, f as add_attribute, h as get_current_component, i as compute_rest_props, j as each, k as add_styles, l as createEventDispatcher, n as set_store_value } from "../../chunks/ssr.js";
import { d as derived, w as writable, r as readable } from "../../chunks/index.js";
import * as THREE from "three";
import { PerspectiveCamera, Scene as Scene$1, REVISION, ColorManagement, PCFSoftShadowMap, WebGLRenderer, ACESFilmicToneMapping, Vector3 as Vector3$1, MathUtils, ShaderMaterial, OrthographicCamera, MeshBasicMaterial, WebGLRenderTarget, PlaneGeometry, Mesh, MeshDepthMaterial, Color, Plane, DoubleSide, Matrix4, ShaderChunk, Vector2, BufferGeometry, Float32BufferAttribute } from "three";
import mitt from "mitt";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";
import { OrbitControls as OrbitControls$1 } from "three/examples/jsm/controls/OrbitControls.js";
import { shaderStructs, shaderIntersectFunction } from "three-mesh-bvh";
import { getWindowDocument, isRgbaColorObject, isRgbColorObject, createPlugin, parseRecord, ValueMap, ClassName, createValue, createNumberFormatter, LabeledValueBladeController, initializeBuffer, createNumberTextInputParamsParser, TpError, createNumberTextPropsObject, findConstraint, DefiniteRangeConstraint, parseNumber, PointNdTextController, BladeApi, Emitter, ButtonController, ViewProps, PlainView, BladeController, LabelController, TpChangeEvent, isEmpty, mapRange, constrainRange, Foldable, TextController, PopupController, bindValue, connectValues, bindFoldable, forceCast, findNextTarget, supportsTouch, PointNdConstraint, RangeConstraint, TpEvent, GraphLogController, createPushedBuffer, ManualTicker, IntervalTicker, Constants, createRangeConstraint, createStepConstraint, CompositeConstraint, numberFromUnknown, writePrimitive, stringFromUnknown, boolFromUnknown, bindValueMap, valueToClassName, SVG_NS, PointerHandler, isArrowKey, getStepForKey, getHorizontalStepKeys, getVerticalStepKeys, NumberTextController, getDecimalDigits, removeElement, parsePickerLayout, parsePointDimensionParams, StepConstraint } from "@tweakpane/core";
import "tweakpane";
import copy from "fast-copy";
import { shallowEqual } from "fast-equals";
import "@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js";
import "@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js";
import "@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js";
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
class DAG {
  allVertices = {};
  /** Nodes that are fully unlinked */
  isolatedVertices = {};
  connectedVertices = {};
  sortedConnectedValues = [];
  needsSort = false;
  emitter = mitt();
  emit = this.emitter.emit.bind(this.emitter);
  on = this.emitter.on.bind(this.emitter);
  off = this.emitter.off.bind(this.emitter);
  get sortedVertices() {
    return this.mapNodes((value) => value);
  }
  moveToIsolated(key2) {
    const vertex = this.connectedVertices[key2];
    if (!vertex)
      return;
    this.isolatedVertices[key2] = vertex;
    delete this.connectedVertices[key2];
  }
  moveToConnected(key2) {
    const vertex = this.isolatedVertices[key2];
    if (!vertex)
      return;
    this.connectedVertices[key2] = vertex;
    delete this.isolatedVertices[key2];
  }
  getKey = (v) => {
    if (typeof v === "object") {
      return v.key;
    }
    return v;
  };
  add(key2, value, options) {
    if (this.allVertices[key2] && this.allVertices[key2].value !== void 0) {
      throw new Error(`A node with the key ${key2.toString()} already exists`);
    }
    let vertex = this.allVertices[key2];
    if (!vertex) {
      vertex = {
        value,
        previous: /* @__PURE__ */ new Set(),
        next: /* @__PURE__ */ new Set()
      };
      this.allVertices[key2] = vertex;
    } else if (vertex.value === void 0) {
      vertex.value = value;
    }
    const hasEdges = vertex.next.size > 0 || vertex.previous.size > 0;
    if (!options?.after && !options?.before && !hasEdges) {
      this.isolatedVertices[key2] = vertex;
      this.emit("node:added", {
        key: key2,
        type: "isolated",
        value
      });
      return;
    } else {
      this.connectedVertices[key2] = vertex;
    }
    if (options?.after) {
      const afterArr = Array.isArray(options.after) ? options.after : [options.after];
      afterArr.forEach((after) => {
        vertex.previous.add(this.getKey(after));
      });
      afterArr.forEach((after) => {
        const afterKey = this.getKey(after);
        const linkedAfter = this.allVertices[afterKey];
        if (!linkedAfter) {
          this.allVertices[afterKey] = {
            value: void 0,
            previous: /* @__PURE__ */ new Set(),
            next: /* @__PURE__ */ new Set([key2])
          };
          this.connectedVertices[afterKey] = this.allVertices[afterKey];
        } else {
          linkedAfter.next.add(key2);
          this.moveToConnected(afterKey);
        }
      });
    }
    if (options?.before) {
      const beforeArr = Array.isArray(options.before) ? options.before : [options.before];
      beforeArr.forEach((before) => {
        vertex.next.add(this.getKey(before));
      });
      beforeArr.forEach((before) => {
        const beforeKey = this.getKey(before);
        const linkedBefore = this.allVertices[beforeKey];
        if (!linkedBefore) {
          this.allVertices[beforeKey] = {
            value: void 0,
            previous: /* @__PURE__ */ new Set([key2]),
            next: /* @__PURE__ */ new Set()
          };
          this.connectedVertices[beforeKey] = this.allVertices[beforeKey];
        } else {
          linkedBefore.previous.add(key2);
          this.moveToConnected(beforeKey);
        }
      });
    }
    this.emit("node:added", {
      key: key2,
      type: "connected",
      value
    });
    this.needsSort = true;
  }
  remove(key2) {
    const removeKey = this.getKey(key2);
    const unlinkedVertex = this.isolatedVertices[removeKey];
    if (unlinkedVertex) {
      delete this.isolatedVertices[removeKey];
      delete this.allVertices[removeKey];
      this.emit("node:removed", {
        key: removeKey,
        type: "isolated"
      });
      return;
    }
    const linkedVertex = this.connectedVertices[removeKey];
    if (!linkedVertex) {
      return;
    }
    linkedVertex.next.forEach((nextKey) => {
      const nextVertex = this.connectedVertices[nextKey];
      if (nextVertex) {
        nextVertex.previous.delete(removeKey);
        if (nextVertex.previous.size === 0 && nextVertex.next.size === 0) {
          this.moveToIsolated(nextKey);
        }
      }
    });
    linkedVertex.previous.forEach((prevKey) => {
      const prevVertex = this.connectedVertices[prevKey];
      if (prevVertex) {
        prevVertex.next.delete(removeKey);
        if (prevVertex.previous.size === 0 && prevVertex.next.size === 0) {
          this.moveToIsolated(prevKey);
        }
      }
    });
    delete this.connectedVertices[removeKey];
    delete this.allVertices[removeKey];
    this.emit("node:removed", {
      key: removeKey,
      type: "connected"
    });
    this.needsSort = true;
  }
  mapNodes(callback) {
    if (this.needsSort) {
      this.sort();
    }
    const result = [];
    this.forEachNode((value, index) => {
      result.push(callback(value, index));
    });
    return result;
  }
  forEachNode(callback) {
    if (this.needsSort) {
      this.sort();
    }
    let index = 0;
    for (; index < this.sortedConnectedValues.length; index++) {
      callback(this.sortedConnectedValues[index], index);
    }
    Reflect.ownKeys(this.isolatedVertices).forEach((key2) => {
      const vertex = this.isolatedVertices[key2];
      if (vertex.value !== void 0)
        callback(vertex.value, index++);
    });
  }
  getValueByKey(key2) {
    return this.allVertices[key2]?.value;
  }
  getKeyByValue(value) {
    return Reflect.ownKeys(this.connectedVertices).find((key2) => this.connectedVertices[key2].value === value) ?? Reflect.ownKeys(this.isolatedVertices).find((key2) => this.isolatedVertices[key2].value === value);
  }
  sort() {
    const inDegree = /* @__PURE__ */ new Map();
    const zeroInDegreeQueue = [];
    const result = [];
    const connectedVertexKeysWithValues = Reflect.ownKeys(this.connectedVertices).filter((key2) => {
      const vertex = this.connectedVertices[key2];
      return vertex.value !== void 0;
    });
    connectedVertexKeysWithValues.forEach((vertex) => {
      inDegree.set(vertex, 0);
    });
    connectedVertexKeysWithValues.forEach((vertexKey) => {
      const vertex = this.connectedVertices[vertexKey];
      vertex.next.forEach((next) => {
        const nextVertex = this.connectedVertices[next];
        if (!nextVertex)
          return;
        inDegree.set(next, (inDegree.get(next) || 0) + 1);
      });
    });
    inDegree.forEach((degree, value) => {
      if (degree === 0) {
        zeroInDegreeQueue.push(value);
      }
    });
    while (zeroInDegreeQueue.length > 0) {
      const vertexKey = zeroInDegreeQueue.shift();
      result.push(vertexKey);
      const v = connectedVertexKeysWithValues.find((key2) => key2 === vertexKey);
      if (v) {
        this.connectedVertices[v]?.next.forEach((adjVertex) => {
          const adjVertexInDegree = (inDegree.get(adjVertex) || 0) - 1;
          inDegree.set(adjVertex, adjVertexInDegree);
          if (adjVertexInDegree === 0) {
            zeroInDegreeQueue.push(adjVertex);
          }
        });
      }
    }
    if (result.length !== connectedVertexKeysWithValues.length) {
      throw new Error("The graph contains a cycle, and thus can not be sorted topologically.");
    }
    const filterUndefined = (value) => value !== void 0;
    this.sortedConnectedValues = result.map((key2) => this.connectedVertices[key2].value).filter(filterUndefined);
    this.needsSort = false;
  }
  clear() {
    this.allVertices = {};
    this.isolatedVertices = {};
    this.connectedVertices = {};
    this.sortedConnectedValues = [];
    this.needsSort = false;
  }
  static isKey(value) {
    return typeof value === "string" || typeof value === "symbol";
  }
  static isValue(value) {
    return typeof value === "object" && "key" in value;
  }
}
class Task {
  key;
  stage;
  callback;
  runTask = true;
  stop() {
    this.runTask = false;
  }
  start() {
    this.runTask = true;
  }
  constructor(stage, key2, callback) {
    this.stage = stage;
    this.key = key2;
    this.callback = callback;
  }
  run(delta) {
    if (!this.runTask)
      return;
    this.callback(delta);
  }
}
class Stage extends DAG {
  key;
  scheduler;
  get tasks() {
    return this.sortedVertices;
  }
  callback = (_, r) => r();
  constructor(scheduler, key2, callback) {
    super();
    this.scheduler = scheduler;
    this.key = key2;
    if (callback)
      this.callback = callback.bind(this);
  }
  createTask(key2, callback, options) {
    const task = new Task(this, key2, callback);
    this.add(key2, task, options);
    return task;
  }
  getTask(key2) {
    return this.getValueByKey(key2);
  }
  removeTask = this.remove.bind(this);
  run(delta) {
    this.callback(delta, (deltaOverride) => {
      this.forEachNode((task) => {
        task.run(deltaOverride ?? delta);
      });
    });
  }
  runWithTiming(delta) {
    const taskTimings = {};
    this.callback(delta, (deltaOverride) => {
      this.forEachNode((task) => {
        const start = performance.now();
        task.run(deltaOverride ?? delta);
        const duration = performance.now() - start;
        taskTimings[task.key] = duration;
      });
    });
    return taskTimings;
  }
  getSchedule() {
    return this.mapNodes((l) => l.key.toString());
  }
}
class Scheduler extends DAG {
  lastTime = performance.now();
  clampDeltaTo = 0.1;
  get stages() {
    return this.sortedVertices;
  }
  constructor(options) {
    super();
    if (options?.clampDeltaTo)
      this.clampDeltaTo = options.clampDeltaTo;
    this.run = this.run.bind(this);
  }
  createStage(key2, options) {
    const stage = new Stage(this, key2, options?.callback);
    this.add(key2, stage, {
      after: options?.after,
      before: options?.before
    });
    return stage;
  }
  getStage(key2) {
    return this.getValueByKey(key2);
  }
  removeStage = this.remove.bind(this);
  /**
   * Runs all the stages in the scheduler.
   *
   * @param time The time in milliseconds since the start of the program.
   */
  run(time) {
    const delta = time - this.lastTime;
    this.forEachNode((stage) => {
      stage.run(Math.min(delta / 1e3, this.clampDeltaTo));
    });
    this.lastTime = time;
  }
  runWithTiming(time) {
    const delta = time - this.lastTime;
    const stageTimings = {};
    const start = performance.now();
    this.forEachNode((stage) => {
      const start2 = performance.now();
      const taskTimings = stage.runWithTiming(Math.min(delta / 1e3, this.clampDeltaTo));
      const duration = performance.now() - start2;
      stageTimings[stage.key.toString()] = {
        duration,
        tasks: taskTimings
      };
    });
    return {
      total: performance.now() - start,
      stages: stageTimings
    };
  }
  getSchedule(include = {
    tasks: true
  }) {
    return {
      stages: this.mapNodes((stage) => {
        if (stage === void 0)
          throw new Error("Stage not found");
        return {
          key: stage.key.toString(),
          ...{ tasks: include.tasks ? stage.getSchedule() : void 0 }
        };
      })
    };
  }
  dispose() {
    this.clear();
  }
}
const watch = (stores, callback) => {
  const d = derived(stores, (values) => {
    return values;
  });
  let cleanupFn;
  const unsubscribe = d.subscribe(async (values) => {
    if (cleanupFn)
      cleanupFn();
    const fn = await callback(values);
    if (fn)
      cleanupFn = fn;
  });
  onDestroy(() => {
    unsubscribe();
    if (cleanupFn)
      cleanupFn();
  });
};
const currentWritable = (value) => {
  const store = writable(value);
  const extendedWritable = {
    set: (value2) => {
      extendedWritable.current = value2;
      store.set(value2);
    },
    subscribe: store.subscribe,
    update: (fn) => {
      const newValue = fn(extendedWritable.current);
      extendedWritable.current = newValue;
      store.set(newValue);
    },
    current: value
  };
  return extendedWritable;
};
const defaultCamera = new PerspectiveCamera(75, 0, 0.1, 1e3);
defaultCamera.position.z = 5;
defaultCamera.lookAt(0, 0, 0);
const getDefaultCamera = () => defaultCamera;
const setDefaultCameraAspectOnSizeChange = (ctx) => {
  watch(ctx.size, (size) => {
    if (ctx.camera.current === defaultCamera) {
      const cam = ctx.camera.current;
      cam.aspect = size.width / size.height;
      cam.updateProjectionMatrix();
      ctx.invalidate();
    }
  });
};
const useLegacyFrameCompatibilityContextKey = Symbol("use-legacy-frame-compatibility-context");
const injectLegacyFrameCompatibilityContext = () => {
  const ctx = {
    useFrameOrders: [],
    useRenderOrders: []
  };
  setContext(useLegacyFrameCompatibilityContextKey, ctx);
  return ctx;
};
const createThrelteContext = (options) => {
  const internalCtx = {
    frameInvalidated: true,
    advance: false,
    autoInvalidations: /* @__PURE__ */ new Set(),
    resetFrameInvalidation: () => {
      internalCtx.frameInvalidated = false;
      internalCtx.advance = false;
    },
    dispose: async (force = false) => {
      await tick();
      if (!internalCtx.shouldDispose && !force)
        return;
      internalCtx.disposableObjects.forEach((mounted, object) => {
        if (mounted === 0 || force) {
          object?.dispose?.();
          internalCtx.disposableObjects.delete(object);
        }
      });
      internalCtx.shouldDispose = false;
    },
    collectDisposableObjects: (object, objects) => {
      const disposables = objects ?? [];
      if (!object)
        return disposables;
      if (object?.dispose && typeof object.dispose === "function" && object.type !== "Scene") {
        disposables.push(object);
      }
      Object.entries(object).forEach(([propKey, propValue]) => {
        if (propKey === "parent" || propKey === "children" || typeof propValue !== "object")
          return;
        const value = propValue;
        if (value?.dispose) {
          internalCtx.collectDisposableObjects(value, disposables);
        }
      });
      return disposables;
    },
    addDisposableObjects: (objects) => {
      objects.forEach((obj) => {
        const currentValue = internalCtx.disposableObjects.get(obj);
        if (currentValue) {
          internalCtx.disposableObjects.set(obj, currentValue + 1);
        } else {
          internalCtx.disposableObjects.set(obj, 1);
        }
      });
    },
    removeDisposableObjects: (objects) => {
      if (objects.length === 0)
        return;
      objects.forEach((obj) => {
        const currentValue = internalCtx.disposableObjects.get(obj);
        if (currentValue && currentValue > 0) {
          internalCtx.disposableObjects.set(obj, currentValue - 1);
        }
      });
      internalCtx.shouldDispose = true;
    },
    disposableObjects: /* @__PURE__ */ new Map(),
    shouldDispose: false
  };
  const { useRenderOrders } = injectLegacyFrameCompatibilityContext();
  const scheduler = new Scheduler();
  const mainStage = scheduler.createStage(Symbol("threlte-main-stage"));
  const renderStage = scheduler.createStage(Symbol("threlte-render-stage"), {
    after: mainStage,
    callback(_, runTasks) {
      if (ctx.shouldRender())
        runTasks();
    }
  });
  const autoRenderTask = renderStage.createTask(Symbol("threlte-auto-render-task"), (_) => {
    if (useRenderOrders.length > 0)
      return;
    ctx.renderer.render(ctx.scene, ctx.camera.current);
  });
  const ctx = {
    size: derived([options.userSize, options.parentSize], ([uSize, pSize]) => {
      return uSize ? uSize : pSize;
    }),
    camera: currentWritable(getDefaultCamera()),
    scene: new Scene$1(),
    renderer: void 0,
    invalidate: () => {
      internalCtx.frameInvalidated = true;
    },
    advance: () => {
      internalCtx.advance = true;
    },
    colorSpace: currentWritable(options.colorSpace),
    toneMapping: currentWritable(options.toneMapping),
    dpr: currentWritable(options.dpr),
    useLegacyLights: currentWritable(options.useLegacyLights),
    shadows: currentWritable(options.shadows),
    colorManagementEnabled: currentWritable(options.colorManagementEnabled),
    renderMode: currentWritable(options.renderMode),
    autoRender: currentWritable(options.autoRender),
    scheduler,
    mainStage,
    renderStage,
    autoRenderTask,
    shouldRender: () => {
      const shouldRender = ctx.renderMode.current === "always" || ctx.renderMode.current === "on-demand" && (internalCtx.frameInvalidated || internalCtx.autoInvalidations.size > 0) || ctx.renderMode.current === "manual" && internalCtx.advance;
      return shouldRender;
    }
  };
  setDefaultCameraAspectOnSizeChange(ctx);
  const userCtx = currentWritable({});
  setContext("threlte", ctx);
  setContext("threlte-internal-context", internalCtx);
  setContext("threlte-user-context", userCtx);
  return ctx;
};
const browser = typeof window !== "undefined";
const useParentSize = () => {
  const parentSize = currentWritable({ width: 0, height: 0 });
  if (!browser) {
    return {
      parentSize,
      parentSizeAction: () => {
      }
    };
  }
  const mutationOptions = { childList: true, subtree: false, attributes: false };
  let el;
  const observeParent = (parent) => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    resizeObserver.observe(parent);
    mutationObserver.observe(parent, mutationOptions);
  };
  const resizeObserver = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width === parentSize.current.width && height === parentSize.current.height)
      return;
    parentSize.set({ width, height });
  });
  const mutationObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const node of mutation.removedNodes) {
        if (el === node && el.parentElement) {
          observeParent(el.parentElement);
          return;
        }
      }
    }
  });
  const parentSizeAction = (node) => {
    el = node;
    const parent = el.parentElement;
    if (!parent)
      return;
    parentSize.set({
      width: parent.clientWidth,
      height: parent.clientHeight
    });
    observeParent(parent);
  };
  onDestroy(() => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
  });
  return {
    parentSize,
    parentSizeAction
  };
};
function createObjectStore(object, onChange) {
  const objectStore = writable(object);
  let unwrappedObject = object;
  const unsubscribeObjectStore = objectStore.subscribe((o) => unwrappedObject = o);
  onDestroy(unsubscribeObjectStore);
  const set = (newObject) => {
    if (newObject?.uuid === unwrappedObject?.uuid)
      return;
    const oldObject = unwrappedObject;
    objectStore.set(newObject);
    onChange?.(newObject, oldObject);
  };
  const update2 = (callback) => {
    const newObject = callback(unwrappedObject);
    if (newObject?.uuid === unwrappedObject?.uuid)
      return;
    const oldObject = unwrappedObject;
    objectStore.set(newObject);
    onChange?.(newObject, oldObject);
  };
  return {
    ...objectStore,
    set,
    update: update2
  };
}
const useThrelte = () => {
  const context = getContext("threlte");
  if (context === void 0) {
    throw new Error("No Threlte context found, are you using this hook inside of <Canvas>?");
  }
  return context;
};
const key = Symbol("threlte-hierarchical-parent-context");
const useParent = () => {
  return getContext(key);
};
const setParent = (context) => {
  return setContext(key, context);
};
const createParentContext = (ref) => {
  const context = createObjectStore(ref);
  setContext(key, context);
  return context;
};
const useHierarchicalObject = () => {
  return {
    onChildMount: getContext("threlte-hierarchical-object-on-mount"),
    onChildDestroy: getContext("threlte-hierarchical-object-on-destroy")
  };
};
const HierarchicalObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $parentStore, $$unsubscribe_parentStore;
  let { object = void 0 } = $$props;
  let { onChildMount = void 0 } = $$props;
  const onChildMountProxy = (child) => {
    onChildMount?.(child);
  };
  let { onChildDestroy = void 0 } = $$props;
  const onChildDestroyProxy = (child) => {
    onChildDestroy?.(child);
  };
  const { invalidate } = useThrelte();
  const parentStore = useParent();
  $$unsubscribe_parentStore = subscribe(parentStore, (value) => $parentStore = value);
  let { parent = $parentStore } = $$props;
  const parentCallbacks = useHierarchicalObject();
  if (object) {
    parentCallbacks.onChildMount?.(object);
    invalidate();
  }
  const objectStore = createObjectStore(object, (newObject, oldObject) => {
    if (oldObject) {
      parentCallbacks.onChildDestroy?.(oldObject);
      invalidate();
    }
    if (newObject) {
      parentCallbacks.onChildMount?.(newObject);
      invalidate();
    }
  });
  onDestroy(() => {
    if (object) {
      parentCallbacks.onChildDestroy?.(object);
      invalidate();
    }
  });
  setContext("threlte-hierarchical-object-on-mount", onChildMountProxy);
  setContext("threlte-hierarchical-object-on-destroy", onChildDestroyProxy);
  setParent(objectStore);
  if ($$props.object === void 0 && $$bindings.object && object !== void 0) $$bindings.object(object);
  if ($$props.onChildMount === void 0 && $$bindings.onChildMount && onChildMount !== void 0) $$bindings.onChildMount(onChildMount);
  if ($$props.onChildDestroy === void 0 && $$bindings.onChildDestroy && onChildDestroy !== void 0) $$bindings.onChildDestroy(onChildDestroy);
  if ($$props.parent === void 0 && $$bindings.parent && parent !== void 0) $$bindings.parent(parent);
  parent = $parentStore;
  {
    objectStore.set(object);
  }
  $$unsubscribe_parentStore();
  return `   ${slots.default ? slots.default({}) : ``}`;
});
const SceneGraphObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { object } = $$props;
  if ($$props.object === void 0 && $$bindings.object && object !== void 0) $$bindings.object(object);
  return `${validate_component(HierarchicalObject, "HierarchicalObject").$$render(
    $$result,
    {
      object,
      onChildMount: (child) => object.add(child),
      onChildDestroy: (child) => object.remove(child)
    },
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const createCache = () => {
  setContext("threlte-cache", []);
};
const normalizedRevision = REVISION.replace("dev", "");
const revision$1 = Number.parseInt(normalizedRevision);
const useRenderer = (ctx) => {
  const renderer = writable(void 0);
  const createRenderer = (canvas, rendererParameters) => {
    ctx.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      canvas,
      antialias: true,
      alpha: true,
      ...rendererParameters
    });
    renderer.set(ctx.renderer);
  };
  watch([ctx.colorManagementEnabled], ([colorManagementEnabled]) => {
    ColorManagement.enabled = colorManagementEnabled;
  });
  watch([renderer, ctx.colorSpace], ([renderer2, colorSpace]) => {
    if (!renderer2)
      return;
    renderer2.outputColorSpace = colorSpace;
  });
  watch([renderer, ctx.dpr], ([renderer2, dpr]) => {
    renderer2?.setPixelRatio(dpr);
  });
  watch([renderer, ctx.size], ([renderer2, size]) => {
    if (renderer2?.xr?.isPresenting)
      return;
    renderer2?.setSize(size.width, size.height);
  });
  watch([renderer, ctx.shadows], ([renderer2, shadows]) => {
    if (!renderer2)
      return;
    renderer2.shadowMap.enabled = !!shadows;
    if (shadows && shadows !== true) {
      renderer2.shadowMap.type = shadows;
    } else if (shadows === true) {
      renderer2.shadowMap.type = PCFSoftShadowMap;
    }
  });
  watch([renderer, ctx.toneMapping], ([renderer2, toneMapping]) => {
    if (!renderer2)
      return;
    renderer2.toneMapping = toneMapping;
  });
  watch([renderer, ctx.useLegacyLights], ([renderer2, useLegacyLights]) => {
    if (!renderer2)
      return;
    if (useLegacyLights) {
      renderer2.useLegacyLights = useLegacyLights;
    }
  });
  return {
    createRenderer
  };
};
const useThrelteInternal = () => {
  return getContext("threlte-internal-context");
};
const css$3 = {
  code: "canvas.svelte-o3oskp{display:block}",
  map: `{"version":3,"file":"Canvas.svelte","sources":["Canvas.svelte"],"sourcesContent":["<script>import { onDestroy, onMount } from 'svelte';\\nimport { writable } from 'svelte/store';\\nimport { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';\\nimport { createThrelteContext } from './lib/contexts';\\nimport { useParentSize } from './hooks/useParentSize';\\nimport SceneGraphObject from './internal/SceneGraphObject.svelte';\\nimport { browser } from './lib/browser';\\nimport { createCache } from './lib/cache';\\nimport { revision } from './lib/revision';\\nimport { watch } from './lib/storeUtils';\\nimport { useRenderer } from './lib/useRenderer';\\nimport { useThrelteInternal } from './hooks/useThrelteInternal';\\n/**\\n * Colors supplied to three.js — from color pickers, textures, 3D models, and other sources —\\n * each have an associated color space. Those not already in the Linear-sRGB working color\\n * space must be converted, and textures be given the correct texture.colorSpace assignment.\\n *\\n * Set to true for certain conversions (for hexadecimal and CSS colors in sRGB) to be made automatically.\\n *\\n * This property is not reactive and must be enabled before initializing colors.\\n *\\n * @default true\\n */\\nexport let colorManagementEnabled = true;\\n/**\\n * @default 'srgb'\\n */\\nexport let colorSpace = 'srgb';\\n/**\\n * @default window.devicePixelRatio\\n */\\nexport let dpr = browser ? window.devicePixelRatio : 1;\\n/**\\n * @default 'on-demand'\\n */\\nexport let renderMode = 'on-demand';\\n/**\\n * Parameters sent to the WebGLRenderer when created.\\n *\\n * This property can only be set when creating a \`<Canvas>\` and is not reactive.\\n */\\nexport let rendererParameters = undefined;\\n/**\\n * @default PCFSoftShadowMap\\n */\\nexport let shadows = PCFSoftShadowMap;\\nexport let size = undefined;\\n/**\\n * @default ACESFilmicToneMapping\\n */\\nexport let toneMapping = ACESFilmicToneMapping;\\n/**\\n * This property is not reactive and must be set at initialization.\\n *\\n * @default false if greater than or equal to r155, true if less than 155\\n * @see https://github.com/mrdoob/three.js/pull/26392\\n */\\nexport let useLegacyLights = revision >= 155 ? false : true;\\n/**\\n * By default, Threlte will automatically render the scene. To implement\\n * custom render pipelines, set this to \`false\`.\\n *\\n * @default true\\n */\\nexport let autoRender = true;\\nlet canvas;\\nlet initialized = writable(false);\\n// user size as a store\\nconst userSize = writable(size);\\n$: userSize.set(size);\\n// in case the user didn't define a fixed size, use the parent elements size\\nconst { parentSize, parentSizeAction } = useParentSize();\\nconst context = createThrelteContext({\\n    colorManagementEnabled,\\n    colorSpace,\\n    dpr,\\n    renderMode,\\n    parentSize,\\n    autoRender,\\n    shadows,\\n    toneMapping,\\n    useLegacyLights,\\n    userSize\\n});\\nconst internalCtx = useThrelteInternal();\\n// context bindings\\nexport const ctx = context;\\n$: ctx.colorSpace.set(colorSpace);\\n$: ctx.dpr.set(dpr);\\n$: ctx.renderMode.set(renderMode);\\n$: ctx.autoRender.set(autoRender);\\n$: ctx.shadows.set(shadows);\\n$: ctx.toneMapping.set(toneMapping);\\nwatch([initialized, ctx.autoRender], ([initialized, autoRender]) => {\\n    if (initialized && autoRender) {\\n        ctx.autoRenderTask.start();\\n    }\\n    else {\\n        ctx.autoRenderTask.stop();\\n    }\\n    return () => {\\n        ctx.autoRenderTask.stop();\\n    };\\n});\\n// create cache context for caching assets\\ncreateCache();\\n// the hook useRenderer is managing the renderer.\\nconst { createRenderer } = useRenderer(ctx);\\nonMount(() => {\\n    createRenderer(canvas, rendererParameters);\\n    ctx.renderer.setAnimationLoop((time) => {\\n        internalCtx.dispose();\\n        ctx.scheduler.run(time);\\n        internalCtx.resetFrameInvalidation();\\n    });\\n    initialized.set(true);\\n});\\nonDestroy(() => {\\n    internalCtx.dispose(true);\\n    ctx.scheduler.dispose();\\n    // Renderer is marked as optional because it is never defined in SSR\\n    ctx.renderer?.dispose();\\n});\\n<\/script>\\n\\n<canvas\\n  use:parentSizeAction\\n  bind:this={canvas}\\n>\\n  {#if $initialized}\\n    <SceneGraphObject object={ctx.scene}>\\n      <slot />\\n    </SceneGraphObject>\\n  {/if}\\n</canvas>\\n\\n<style>\\n  canvas {\\n    display: block;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAyIE,oBAAO,CACL,OAAO,CAAE,KACX"}`
};
const Canvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $initialized, $$unsubscribe_initialized;
  let { colorManagementEnabled = true } = $$props;
  let { colorSpace = "srgb" } = $$props;
  let { dpr = browser ? window.devicePixelRatio : 1 } = $$props;
  let { renderMode = "on-demand" } = $$props;
  let { rendererParameters = void 0 } = $$props;
  let { shadows = PCFSoftShadowMap } = $$props;
  let { size = void 0 } = $$props;
  let { toneMapping = ACESFilmicToneMapping } = $$props;
  let { useLegacyLights = revision$1 >= 155 ? false : true } = $$props;
  let { autoRender = true } = $$props;
  let initialized = writable(false);
  $$unsubscribe_initialized = subscribe(initialized, (value) => $initialized = value);
  const userSize = writable(size);
  const { parentSize, parentSizeAction } = useParentSize();
  const context = createThrelteContext({
    colorManagementEnabled,
    colorSpace,
    dpr,
    renderMode,
    parentSize,
    autoRender,
    shadows,
    toneMapping,
    useLegacyLights,
    userSize
  });
  const internalCtx = useThrelteInternal();
  const ctx = context;
  watch([initialized, ctx.autoRender], ([initialized2, autoRender2]) => {
    if (initialized2 && autoRender2) {
      ctx.autoRenderTask.start();
    } else {
      ctx.autoRenderTask.stop();
    }
    return () => {
      ctx.autoRenderTask.stop();
    };
  });
  createCache();
  useRenderer(ctx);
  onDestroy(() => {
    internalCtx.dispose(true);
    ctx.scheduler.dispose();
    ctx.renderer?.dispose();
  });
  if ($$props.colorManagementEnabled === void 0 && $$bindings.colorManagementEnabled && colorManagementEnabled !== void 0) $$bindings.colorManagementEnabled(colorManagementEnabled);
  if ($$props.colorSpace === void 0 && $$bindings.colorSpace && colorSpace !== void 0) $$bindings.colorSpace(colorSpace);
  if ($$props.dpr === void 0 && $$bindings.dpr && dpr !== void 0) $$bindings.dpr(dpr);
  if ($$props.renderMode === void 0 && $$bindings.renderMode && renderMode !== void 0) $$bindings.renderMode(renderMode);
  if ($$props.rendererParameters === void 0 && $$bindings.rendererParameters && rendererParameters !== void 0) $$bindings.rendererParameters(rendererParameters);
  if ($$props.shadows === void 0 && $$bindings.shadows && shadows !== void 0) $$bindings.shadows(shadows);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.toneMapping === void 0 && $$bindings.toneMapping && toneMapping !== void 0) $$bindings.toneMapping(toneMapping);
  if ($$props.useLegacyLights === void 0 && $$bindings.useLegacyLights && useLegacyLights !== void 0) $$bindings.useLegacyLights(useLegacyLights);
  if ($$props.autoRender === void 0 && $$bindings.autoRender && autoRender !== void 0) $$bindings.autoRender(autoRender);
  if ($$props.ctx === void 0 && $$bindings.ctx && ctx !== void 0) $$bindings.ctx(ctx);
  $$result.css.add(css$3);
  {
    userSize.set(size);
  }
  {
    ctx.colorSpace.set(colorSpace);
  }
  {
    ctx.dpr.set(dpr);
  }
  {
    ctx.renderMode.set(renderMode);
  }
  {
    ctx.autoRender.set(autoRender);
  }
  {
    ctx.shadows.set(shadows);
  }
  {
    ctx.toneMapping.set(toneMapping);
  }
  $$unsubscribe_initialized();
  return `<canvas class="svelte-o3oskp"${add_attribute()}>${$initialized ? `${validate_component(SceneGraphObject, "SceneGraphObject").$$render($$result, { object: ctx.scene }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}` : ``} </canvas>`;
});
const contextName = "threlte-disposable-object-context";
const DisposableObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mergedDispose, $$unsubscribe_mergedDispose;
  let $parentDispose, $$unsubscribe_parentDispose;
  const { collectDisposableObjects, addDisposableObjects, removeDisposableObjects } = useThrelteInternal();
  let { object = void 0 } = $$props;
  let previousObject = object;
  let { dispose = void 0 } = $$props;
  const parentDispose = getContext(contextName);
  $$unsubscribe_parentDispose = subscribe(parentDispose, (value) => $parentDispose = value);
  const mergedDispose = writable(dispose ?? $parentDispose ?? true);
  $$unsubscribe_mergedDispose = subscribe(mergedDispose, (value) => $mergedDispose = value);
  setContext(contextName, mergedDispose);
  let disposables = $mergedDispose ? collectDisposableObjects(object) : [];
  addDisposableObjects(disposables);
  onDestroy(() => {
    removeDisposableObjects(disposables);
  });
  if ($$props.object === void 0 && $$bindings.object && object !== void 0) $$bindings.object(object);
  if ($$props.dispose === void 0 && $$bindings.dispose && dispose !== void 0) $$bindings.dispose(dispose);
  {
    mergedDispose.set(dispose ?? $parentDispose ?? true);
  }
  {
    {
      if (object !== previousObject) {
        removeDisposableObjects(disposables);
        disposables = $mergedDispose ? collectDisposableObjects(object) : [];
        addDisposableObjects(disposables);
        previousObject = object;
      }
    }
  }
  $$unsubscribe_mergedDispose();
  $$unsubscribe_parentDispose();
  return `${slots.default ? slots.default({}) : ``}`;
});
const classRegex = /^\s*class\s+/;
const isClass = (input) => {
  if (typeof input !== "function") {
    return false;
  }
  return classRegex.test(input.toString());
};
const argsIsConstructorParameters = (args) => {
  return Array.isArray(args);
};
const determineRef = (is, args) => {
  if (isClass(is)) {
    if (argsIsConstructorParameters(args)) {
      return new is(...args);
    } else {
      return new is();
    }
  }
  return is;
};
const extendsObject3D = (object) => {
  return "isObject3D" in object;
};
const isDisposableObject = (object) => {
  return "dispose" in object;
};
const resolvePropertyPath = (target, propertyPath) => {
  if (propertyPath.includes(".")) {
    const path = propertyPath.split(".");
    const key2 = path.pop();
    for (let i = 0; i < path.length; i += 1) {
      target = target[path[i]];
    }
    return {
      target,
      key: key2
    };
  } else {
    return {
      target,
      key: propertyPath
    };
  }
};
const initialValueBeforeAttach = Symbol("initialValueBeforeAttach");
const useAttach = () => {
  const { invalidate } = useThrelte();
  let isAttached = false;
  let valueBeforeAttach = initialValueBeforeAttach;
  let detachFn;
  let attachedTo;
  let attachedKey;
  const update2 = (instance, parent, attach) => {
    detach();
    if (!attach) {
      const i = instance;
      const isMaterial = i?.isMaterial || false;
      if (isMaterial) {
        attach = "material";
      }
      const isGeometry = i?.isBufferGeometry || i?.isGeometry || false;
      if (isGeometry) {
        attach = "geometry";
      }
    }
    if (!attach)
      return;
    if (typeof attach === "function") {
      detachFn = attach(parent, instance);
    } else {
      const { target, key: key2 } = resolvePropertyPath(parent, attach);
      valueBeforeAttach = target[key2];
      target[key2] = instance;
      attachedTo = target;
      attachedKey = key2;
    }
    isAttached = true;
    invalidate();
  };
  const detach = () => {
    if (!isAttached)
      return;
    if (detachFn) {
      detachFn();
      detachFn = void 0;
    } else if (attachedTo && attachedKey && valueBeforeAttach !== initialValueBeforeAttach) {
      attachedTo[attachedKey] = valueBeforeAttach;
      valueBeforeAttach = initialValueBeforeAttach;
      attachedTo = void 0;
      attachedKey = void 0;
    }
    isAttached = false;
    invalidate();
  };
  onDestroy(() => {
    detach();
  });
  return {
    update: update2
  };
};
const isCamera = (value) => {
  return value && value.isCamera;
};
const isOrthographicCamera = (value) => {
  return value && value.isOrthographicCamera;
};
const isPerspectiveCamera = (value) => {
  return value && value.isPerspectiveCamera;
};
const isPerspectiveCameraOrOrthographicCamera = (value) => {
  return isPerspectiveCamera(value) || isOrthographicCamera(value);
};
const useCamera = () => {
  const { invalidate, size, camera } = useThrelte();
  let currentInstance;
  let unsubscribe = void 0;
  onDestroy(() => {
    unsubscribe?.();
  });
  const subscriber = (size2) => {
    if (!currentInstance)
      return;
    if (isOrthographicCamera(currentInstance)) {
      currentInstance.left = size2.width / -2;
      currentInstance.right = size2.width / 2;
      currentInstance.top = size2.height / 2;
      currentInstance.bottom = size2.height / -2;
      currentInstance.updateProjectionMatrix();
      currentInstance.updateMatrixWorld();
      invalidate();
    } else if (isPerspectiveCamera(currentInstance)) {
      currentInstance.aspect = size2.width / size2.height;
      currentInstance.updateProjectionMatrix();
      currentInstance.updateMatrixWorld();
      invalidate();
    }
  };
  const update2 = (instance, manual) => {
    unsubscribe?.();
    if (manual || !isPerspectiveCameraOrOrthographicCamera(instance)) {
      currentInstance = void 0;
      return;
    }
    currentInstance = instance;
    unsubscribe = size.subscribe(subscriber);
  };
  const makeDefaultCamera = (instance, makeDefault) => {
    if (!isCamera(instance) || !makeDefault)
      return;
    camera.set(instance);
    invalidate();
  };
  return {
    update: update2,
    makeDefaultCamera
  };
};
const createRawEventDispatcher = () => {
  const component = get_current_component();
  const dispatchRawEvent = (type, value) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      callbacks.forEach((fn) => {
        fn(value);
      });
    }
  };
  const hasEventListener = (type) => {
    return Boolean(component.$$.callbacks[type]);
  };
  Object.defineProperty(dispatchRawEvent, "hasEventListener", {
    value: hasEventListener,
    enumerable: true
  });
  return dispatchRawEvent;
};
const useCreateEvent = () => {
  createRawEventDispatcher();
  const cleanupFunctions = [];
  const updateRef = (newRef) => {
    return;
  };
  onDestroy(() => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  });
  return {
    updateRef
  };
};
const isEventDispatcher = (value) => {
  return !!value?.addEventListener;
};
const useEvents = () => {
  const dispatch = createRawEventDispatcher();
  get_current_component();
  const eventHandlerProxy = (event) => {
    if (event?.type) {
      dispatch(event.type, event);
    }
  };
  const cleanupEventListeners = (ref2, events) => {
    if (isEventDispatcher(ref2)) {
      events.forEach((eventName) => {
        ref2.removeEventListener(eventName, eventHandlerProxy);
      });
    }
  };
  const addEventListeners = (ref2, events) => {
    if (isEventDispatcher(ref2)) {
      events.forEach((eventName) => {
        ref2.addEventListener(eventName, eventHandlerProxy);
      });
    }
  };
  const ref = writable();
  const eventNames = writable([]);
  watch([ref, eventNames], ([$ref, $eventNames]) => {
    addEventListeners($ref, $eventNames);
    return () => cleanupEventListeners($ref, $eventNames);
  });
  const updateRef = (newRef) => {
    ref.set(newRef);
  };
  return {
    updateRef
  };
};
const usePlugins = (params) => {
  const pluginContextName = "threlte-plugin-context";
  const plugins = getContext(pluginContextName);
  if (!plugins)
    return;
  const pluginsReturns = Object.values(plugins).map((plugin) => plugin(params)).filter(Boolean);
  const pluginsProps = pluginsReturns.flatMap((callback) => callback.pluginProps ?? []);
  let refCleanupCallbacks = [];
  onDestroy(() => {
    refCleanupCallbacks.forEach((callback) => callback());
  });
  const updateRef = (ref) => {
    refCleanupCallbacks.forEach((callback) => callback());
    refCleanupCallbacks = [];
    pluginsReturns.forEach((callback) => {
      const cleanupCallback = callback.onRefChange?.(ref);
      if (cleanupCallback) {
        refCleanupCallbacks.push(cleanupCallback);
      }
    });
  };
  const updateProps = (props) => {
    pluginsReturns.forEach((callback) => {
      callback.onPropsChange?.(props);
    });
  };
  const updateRestProps = (restProps) => {
    pluginsReturns.forEach((callback) => {
      callback.onRestPropsChange?.(restProps);
    });
  };
  return {
    updateRef,
    updateProps,
    updateRestProps,
    pluginsProps
  };
};
const ignoredProps = /* @__PURE__ */ new Set(["$$scope", "$$slots", "type", "args", "attach", "instance"]);
const updateProjectionMatrixKeys = /* @__PURE__ */ new Set([
  "fov",
  "aspect",
  "near",
  "far",
  "left",
  "right",
  "top",
  "bottom",
  "zoom"
]);
const memoizeProp = (value) => {
  if (typeof value === "string")
    return true;
  if (typeof value === "number")
    return true;
  if (typeof value === "boolean")
    return true;
  if (typeof value === "undefined")
    return true;
  if (value === null)
    return true;
  return false;
};
const createSetter = (target, key2, value) => {
  if (!Array.isArray(value) && typeof value === "number" && typeof target[key2]?.setScalar === "function" && // colors do have a setScalar function, but we don't want to use it, because
  // the hex notation (i.e. 0xff0000) is very popular and matches the number
  // type. So we exclude colors here.
  !target[key2]?.isColor) {
    return (target2, key3, value2) => {
      target2[key3].setScalar(value2);
    };
  } else {
    if (typeof target[key2]?.set === "function") {
      if (Array.isArray(value)) {
        return (target2, key3, value2) => {
          target2[key3].set(...value2);
        };
      } else {
        return (target2, key3, value2) => {
          target2[key3].set(value2);
        };
      }
    } else {
      return (target2, key3, value2) => {
        target2[key3] = value2;
      };
    }
  }
};
const useProps = () => {
  const { invalidate } = useThrelte();
  const memoizedProps = /* @__PURE__ */ new Map();
  const memoizedSetters = /* @__PURE__ */ new Map();
  const setProp = (instance, propertyPath, value, options) => {
    if (memoizeProp(value)) {
      const memoizedProp = memoizedProps.get(propertyPath);
      if (memoizedProp && memoizedProp.instance === instance && memoizedProp.value === value) {
        return;
      }
      memoizedProps.set(propertyPath, {
        instance,
        value
      });
    }
    const { key: key2, target } = resolvePropertyPath(instance, propertyPath);
    if (value !== void 0 && value !== null) {
      const memoizedSetter = memoizedSetters.get(propertyPath);
      if (memoizedSetter) {
        memoizedSetter(target, key2, value);
      } else {
        const setter = createSetter(target, key2, value);
        memoizedSetters.set(propertyPath, setter);
        setter(target, key2, value);
      }
    } else {
      createSetter(target, key2, value)(target, key2, value);
    }
    if (options.manualCamera)
      return;
    if (updateProjectionMatrixKeys.has(key2) && (target.isPerspectiveCamera || target.isOrthographicCamera)) {
      target.updateProjectionMatrix();
    }
  };
  const updateProps = (instance, props, options) => {
    for (const key2 in props) {
      if (!ignoredProps.has(key2) && !options.pluginsProps?.includes(key2)) {
        setProp(instance, key2, props[key2], options);
      }
      invalidate();
    }
  };
  return {
    updateProps
  };
};
const T$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["is", "args", "attach", "manual", "makeDefault", "dispose", "ref"]);
  let $parent, $$unsubscribe_parent;
  let { is } = $$props;
  let { args = void 0 } = $$props;
  let { attach = void 0 } = $$props;
  let { manual = void 0 } = $$props;
  let { makeDefault = void 0 } = $$props;
  let { dispose = void 0 } = $$props;
  const parent = useParent();
  $$unsubscribe_parent = subscribe(parent, (value) => $parent = value);
  const createEvent = useCreateEvent();
  let ref = determineRef(is, args);
  createEvent.updateRef(ref);
  let initialized = false;
  const maybeSetRef = () => {
    if (!initialized) {
      initialized = true;
      return;
    }
    ref = determineRef(is, args);
    createEvent.updateRef(ref);
  };
  let { ref: publicRef = ref } = $$props;
  const parentContext = createParentContext(ref);
  const plugins = usePlugins({ ref, props: $$props });
  const pluginsProps = plugins?.pluginsProps ?? [];
  const props = useProps();
  const camera = useCamera();
  const attachment = useAttach();
  const events = useEvents();
  if ($$props.is === void 0 && $$bindings.is && is !== void 0) $$bindings.is(is);
  if ($$props.args === void 0 && $$bindings.args && args !== void 0) $$bindings.args(args);
  if ($$props.attach === void 0 && $$bindings.attach && attach !== void 0) $$bindings.attach(attach);
  if ($$props.manual === void 0 && $$bindings.manual && manual !== void 0) $$bindings.manual(manual);
  if ($$props.makeDefault === void 0 && $$bindings.makeDefault && makeDefault !== void 0) $$bindings.makeDefault(makeDefault);
  if ($$props.dispose === void 0 && $$bindings.dispose && dispose !== void 0) $$bindings.dispose(dispose);
  if ($$props.ref === void 0 && $$bindings.ref && publicRef !== void 0) $$bindings.ref(publicRef);
  {
    maybeSetRef();
  }
  publicRef = ref;
  {
    parentContext.set(ref);
  }
  {
    props.updateProps(ref, $$restProps, { manualCamera: manual, pluginsProps });
  }
  {
    camera.update(ref, manual);
  }
  {
    camera.makeDefaultCamera(ref, makeDefault);
  }
  {
    attachment.update(ref, $parent, attach);
  }
  {
    events.updateRef(ref);
  }
  {
    plugins?.updateRef(ref);
  }
  {
    plugins?.updateProps($$props);
  }
  {
    plugins?.updateRestProps($$restProps);
  }
  $$unsubscribe_parent();
  return `${isDisposableObject(ref) ? `${validate_component(DisposableObject, "DisposableObject").$$render($$result, { object: ref, dispose }, {}, {})}` : ``} ${extendsObject3D(ref) ? `${validate_component(SceneGraphObject, "SceneGraphObject").$$render($$result, { object: ref }, {}, {
    default: () => {
      return `${slots.default ? slots.default({ ref }) : ``}`;
    }
  })}` : `${slots.default ? slots.default({ ref }) : ``}`}`;
});
const catalogue = {};
const augmentConstructorArgs = (args, is) => {
  const module = catalogue[is] || THREE[is];
  if (!module) {
    throw new Error(`No Three.js module found for ${is}. Did you forget to extend the catalogue?`);
  }
  return {
    ...args,
    props: {
      ...args.props,
      is: module
    }
  };
};
const proxyTConstructor = (is) => {
  return new Proxy(class {
  }, {
    construct(_, [args]) {
      const castedArgs = args;
      return new T$2(augmentConstructorArgs(castedArgs, is));
    }
  });
};
const T$1 = new Proxy(class {
}, {
  construct(_, [args]) {
    const castedArgs = args;
    return new T$2(castedArgs);
  },
  get(_, is) {
    return proxyTConstructor(is);
  }
});
function useTask(keyOrFn, fnOrOptions, options) {
  if (!browser) {
    return {
      task: void 0,
      start: () => void 0,
      stop: () => void 0,
      started: readable(false)
    };
  }
  let key2;
  let fn;
  let opts;
  if (DAG.isKey(keyOrFn)) {
    key2 = keyOrFn;
    fn = fnOrOptions;
    opts = options;
  } else {
    key2 = Symbol("useTask");
    fn = keyOrFn;
    opts = fnOrOptions;
  }
  const ctx = useThrelte();
  let stage = ctx.mainStage;
  if (opts) {
    if (opts.stage) {
      if (DAG.isValue(opts.stage)) {
        stage = opts.stage;
      } else {
        const maybeStage = ctx.scheduler.getStage(opts.stage);
        if (!maybeStage) {
          throw new Error(`No stage found with key ${opts.stage.toString()}`);
        }
        stage = maybeStage;
      }
    } else if (opts.after) {
      if (Array.isArray(opts.after)) {
        for (let index = 0; index < opts.after.length; index++) {
          const element = opts.after[index];
          if (DAG.isValue(element)) {
            stage = element.stage;
            break;
          }
        }
      } else if (DAG.isValue(opts.after)) {
        stage = opts.after.stage;
      }
    } else if (opts.before) {
      if (Array.isArray(opts.before)) {
        for (let index = 0; index < opts.before.length; index++) {
          const element = opts.before[index];
          if (DAG.isValue(element)) {
            stage = element.stage;
            break;
          }
        }
      } else if (DAG.isValue(opts.before)) {
        stage = opts.before.stage;
      }
    }
  }
  const { autoInvalidations } = getContext("threlte-internal-context");
  const started = writable(false);
  const task = stage.createTask(key2, fn, opts);
  const start = () => {
    started.set(true);
    if (opts?.autoInvalidate ?? true) {
      autoInvalidations.add(fn);
    }
    task.start();
  };
  const stop = () => {
    started.set(true);
    if (opts?.autoInvalidate ?? true) {
      autoInvalidations.delete(fn);
    }
    task.stop();
  };
  if (opts?.autoStart ?? true) {
    start();
  } else {
    stop();
  }
  onDestroy(() => {
    if (!stage)
      return;
    stage.removeTask(key2);
  });
  return {
    task,
    start,
    stop,
    started: {
      subscribe: started.subscribe
    }
  };
}
function useThrelteUserContext(namespace, value, options) {
  const userCtxStore = getContext("threlte-user-context");
  if (!userCtxStore) {
    throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");
  }
  if (!value) {
    return derived(userCtxStore, (ctx) => ctx[namespace]);
  }
  userCtxStore.update((ctx) => {
    if (namespace in ctx) {
      return ctx;
    }
    ctx[namespace] = value;
    return ctx;
  });
  return userCtxStore.current[namespace];
}
const forwardEventHandlers = () => {
  const component = get_current_component();
  const dispatchingComponent = writable(void 0);
  watch(dispatchingComponent, (dispatchingComponent2) => {
    if (!dispatchingComponent2)
      return;
    Object.entries(component.$$.callbacks).forEach((callback) => {
      const [key2, value] = callback;
      if (key2 in dispatchingComponent2.$$.callbacks && Array.isArray(dispatchingComponent2.$$.callbacks[key2])) {
        dispatchingComponent2.$$.callbacks[key2].push(...value);
      } else {
        dispatchingComponent2.$$.callbacks[key2] = value;
      }
    });
  });
  return dispatchingComponent;
};
new Vector3$1();
new Vector3$1();
new Vector3$1();
const Float = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "position",
    "rotation",
    "speed",
    "floatIntensity",
    "floatingRange",
    "rotationSpeed",
    "rotationIntensity",
    "seed"
  ]);
  let { position = 0 } = $$props;
  let { rotation = 0 } = $$props;
  let { speed = 1 } = $$props;
  let { floatIntensity = 1 } = $$props;
  let { floatingRange = [-0.1, 0.1] } = $$props;
  let { rotationSpeed = 0 } = $$props;
  let { rotationIntensity = 0 } = $$props;
  let { seed = Math.random() * 1e4 } = $$props;
  let t = seed;
  let floatPosition = Array.isArray(position) ? position : [position, position, position];
  const map = MathUtils.mapLinear;
  let floatRotation = Array.isArray(rotation) ? rotation : [rotation, rotation, rotation];
  useTask((delta) => {
    t += delta;
    const fSpeed = Array.isArray(speed) ? speed : [speed, speed, speed];
    const fIntensity = Array.isArray(floatIntensity) ? floatIntensity : [floatIntensity, floatIntensity, floatIntensity];
    const fRange = floatingRange.length == 3 ? floatingRange : [[0, 0], floatingRange, [0, 0]];
    floatPosition = Array.isArray(position) ? position : [position, position, position];
    floatPosition[0] = floatPosition[0] + map(Math.sin(t / 4 * fSpeed[0]) / 10, -0.1, 0.1, ...fRange[0]) * fIntensity[0];
    floatPosition[1] = floatPosition[1] + map(Math.sin(t / 4 * fSpeed[1]) / 10, -0.1, 0.1, ...fRange[1]) * fIntensity[1];
    floatPosition[2] = floatPosition[2] + map(Math.sin(t / 4 * fSpeed[2]) / 10, -0.1, 0.1, ...fRange[2]) * fIntensity[2];
    floatPosition = floatPosition;
    const rSpeed = Array.isArray(rotationSpeed) ? rotationSpeed : [rotationSpeed, rotationSpeed, rotationSpeed];
    const rIntensity = Array.isArray(rotationIntensity) ? rotationIntensity : [rotationIntensity, rotationIntensity, rotationIntensity];
    floatRotation = Array.isArray(rotation) ? rotation : [rotation, rotation, rotation];
    floatRotation[0] += Math.cos(t / 4 * rSpeed[0]) / 8 * rIntensity[0];
    floatRotation[1] += Math.cos(t / 4 * rSpeed[1]) / 8 * rIntensity[1];
    floatRotation[2] += Math.cos(t / 4 * rSpeed[2]) / 8 * rIntensity[2];
  });
  if ($$props.position === void 0 && $$bindings.position && position !== void 0) $$bindings.position(position);
  if ($$props.rotation === void 0 && $$bindings.rotation && rotation !== void 0) $$bindings.rotation(rotation);
  if ($$props.speed === void 0 && $$bindings.speed && speed !== void 0) $$bindings.speed(speed);
  if ($$props.floatIntensity === void 0 && $$bindings.floatIntensity && floatIntensity !== void 0) $$bindings.floatIntensity(floatIntensity);
  if ($$props.floatingRange === void 0 && $$bindings.floatingRange && floatingRange !== void 0) $$bindings.floatingRange(floatingRange);
  if ($$props.rotationSpeed === void 0 && $$bindings.rotationSpeed && rotationSpeed !== void 0) $$bindings.rotationSpeed(rotationSpeed);
  if ($$props.rotationIntensity === void 0 && $$bindings.rotationIntensity && rotationIntensity !== void 0) $$bindings.rotationIntensity(rotationIntensity);
  if ($$props.seed === void 0 && $$bindings.seed && seed !== void 0) $$bindings.seed(seed);
  return `${validate_component(T$1.Group, "T.Group").$$render($$result, Object.assign({}, { position: floatPosition }, { rotation: floatRotation }, $$restProps), {}, {
    default: ({ ref }) => {
      return `${slots.default ? slots.default({ ref }) : ``}`;
    }
  })}`;
});
const useMemo = (callback) => {
  let initialCallDone = false;
  const memoized = writable(callback());
  const memoize = (..._args) => {
    if (!initialCallDone) {
      initialCallDone = true;
      return;
    }
    memoized.set(callback());
  };
  return {
    ...memoized,
    memoize
  };
};
const ContactShadows = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "opacity",
    "width",
    "height",
    "blur",
    "far",
    "smooth",
    "resolution",
    "frames",
    "scale",
    "color",
    "depthWrite",
    "refresh"
  ]);
  let $depthMaterial, $$unsubscribe_depthMaterial;
  let $planeGeometry, $$unsubscribe_planeGeometry;
  let $renderTargetBlur, $$unsubscribe_renderTargetBlur;
  let $renderTarget, $$unsubscribe_renderTarget;
  let $blurPlane, $$unsubscribe_blurPlane;
  let $scaledHeight, $$unsubscribe_scaledHeight;
  let $scaledWidth, $$unsubscribe_scaledWidth;
  let $components, $$unsubscribe_components;
  let { opacity = 1 } = $$props;
  let { width = 1 } = $$props;
  let { height = 1 } = $$props;
  let { blur = 1 } = $$props;
  let { far = 10 } = $$props;
  let { smooth = true } = $$props;
  let { resolution = 512 } = $$props;
  let { frames = Infinity } = $$props;
  let { scale = 10 } = $$props;
  let { color = "#000000" } = $$props;
  let { depthWrite = false } = $$props;
  const { scene: scene2, renderer } = useThrelte();
  const scaledWidth = useMemo(() => {
    return width * (Array.isArray(scale) ? scale[0] : scale || 1);
  });
  $$unsubscribe_scaledWidth = subscribe(scaledWidth, (value) => $scaledWidth = value);
  const scaledHeight = useMemo(() => {
    return height * (Array.isArray(scale) ? scale[1] : scale || 1);
  });
  $$unsubscribe_scaledHeight = subscribe(scaledHeight, (value) => $scaledHeight = value);
  const renderTarget = useMemo(() => {
    const rt = new WebGLRenderTarget(resolution, resolution);
    rt.texture.generateMipmaps = false;
    rt.texture.colorSpace = renderer.outputColorSpace;
    return rt;
  });
  $$unsubscribe_renderTarget = subscribe(renderTarget, (value) => $renderTarget = value);
  const renderTargetBlur = useMemo(() => {
    const rt = new WebGLRenderTarget(resolution, resolution);
    rt.texture.generateMipmaps = false;
    return rt;
  });
  $$unsubscribe_renderTargetBlur = subscribe(renderTargetBlur, (value) => $renderTargetBlur = value);
  const planeGeometry = useMemo(() => {
    return new PlaneGeometry($scaledWidth, $scaledHeight).rotateX(Math.PI / 2);
  });
  $$unsubscribe_planeGeometry = subscribe(planeGeometry, (value) => $planeGeometry = value);
  const blurPlane = useMemo(() => {
    return new Mesh($planeGeometry);
  });
  $$unsubscribe_blurPlane = subscribe(blurPlane, (value) => $blurPlane = value);
  const depthMaterial = useMemo(() => {
    const dm = new MeshDepthMaterial({ depthTest: false, depthWrite: false });
    dm.onBeforeCompile = (shader) => {
      shader.uniforms = {
        ...shader.uniforms,
        uColor: {
          value: new Color(color).convertSRGBToLinear()
        }
      };
      shader.fragmentShader = "uniform vec3 uColor;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );", "vec4( uColor, ( 1.0 - fragCoordZ ) * 1.0 );");
      shader.fragmentShader = shader.fragmentShader.replace("vec4(vec3(1.0-fragCoordZ),opacity);", "vec4(uColor,(1.0-fragCoordZ)*1.0);");
    };
    return dm;
  });
  $$unsubscribe_depthMaterial = subscribe(depthMaterial, (value) => $depthMaterial = value);
  const horizontalBlurMaterial = new ShaderMaterial({
    ...HorizontalBlurShader,
    depthTest: false
  });
  const verticalBlurMaterial = new ShaderMaterial({ ...VerticalBlurShader, depthTest: false });
  const shadowCamera = new OrthographicCamera(-$scaledWidth / 2, $scaledWidth / 2, $scaledHeight / 2, -$scaledHeight / 2, 0, far);
  shadowCamera.updateProjectionMatrix();
  const shadowMaterial = new MeshBasicMaterial({
    map: $renderTarget.texture,
    transparent: true,
    opacity,
    depthWrite
  });
  const blurShadows = (blur2) => {
    const bp = $blurPlane;
    bp.visible = true;
    bp.material = horizontalBlurMaterial;
    horizontalBlurMaterial.uniforms.tDiffuse.value = $renderTarget.texture;
    horizontalBlurMaterial.uniforms.h.value = blur2 * 1 / 256;
    renderer.setRenderTarget($renderTargetBlur);
    renderer.render(bp, shadowCamera);
    bp.material = verticalBlurMaterial;
    verticalBlurMaterial.uniforms.tDiffuse.value = $renderTargetBlur.texture;
    verticalBlurMaterial.uniforms.v.value = blur2 * 1 / 256;
    renderer.setRenderTarget($renderTarget);
    renderer.render(bp, shadowCamera);
    bp.visible = false;
  };
  const renderShadows = () => {
    const initialBackground = scene2.background;
    scene2.background = null;
    const initialOverrideMaterial = scene2.overrideMaterial;
    scene2.overrideMaterial = $depthMaterial;
    const initialClearAlpha = renderer.getClearAlpha();
    renderer.setClearAlpha(0);
    renderer.setRenderTarget($renderTarget);
    renderer.render(scene2, shadowCamera);
    scene2.overrideMaterial = initialOverrideMaterial;
    blurShadows(blur);
    if (smooth) blurShadows(blur * 0.4);
    renderer.setRenderTarget(null);
    scene2.background = initialBackground;
    renderer.setClearAlpha(initialClearAlpha);
  };
  const refresh = () => {
    renderShadows();
  };
  let count = 0;
  useTask(() => {
    if (frames === Infinity || count < frames) {
      renderShadows();
      count += 1;
    }
  });
  onDestroy(() => {
    $renderTarget.dispose();
    $renderTargetBlur.dispose();
    $planeGeometry.dispose();
    $depthMaterial.dispose();
    horizontalBlurMaterial.dispose();
    verticalBlurMaterial.dispose();
    shadowMaterial.dispose();
  });
  const components = forwardEventHandlers();
  $$unsubscribe_components = subscribe(components, (value) => $components = value);
  if ($$props.opacity === void 0 && $$bindings.opacity && opacity !== void 0) $$bindings.opacity(opacity);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
  if ($$props.blur === void 0 && $$bindings.blur && blur !== void 0) $$bindings.blur(blur);
  if ($$props.far === void 0 && $$bindings.far && far !== void 0) $$bindings.far(far);
  if ($$props.smooth === void 0 && $$bindings.smooth && smooth !== void 0) $$bindings.smooth(smooth);
  if ($$props.resolution === void 0 && $$bindings.resolution && resolution !== void 0) $$bindings.resolution(resolution);
  if ($$props.frames === void 0 && $$bindings.frames && frames !== void 0) $$bindings.frames(frames);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0) $$bindings.scale(scale);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
  if ($$props.depthWrite === void 0 && $$bindings.depthWrite && depthWrite !== void 0) $$bindings.depthWrite(depthWrite);
  if ($$props.refresh === void 0 && $$bindings.refresh && refresh !== void 0) $$bindings.refresh(refresh);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      scaledWidth.memoize([width, scale]);
    }
    {
      scaledHeight.memoize(height, scale);
    }
    {
      renderTarget.memoize(resolution);
    }
    {
      renderTargetBlur.memoize(resolution);
    }
    {
      planeGeometry.memoize($scaledWidth, $scaledHeight);
    }
    {
      blurPlane.memoize($planeGeometry);
    }
    {
      depthMaterial.memoize(color);
    }
    $$rendered = `${validate_component(T$1.Group, "T.Group").$$render(
      $$result,
      Object.assign({}, $$restProps, { this: $components }),
      {
        this: ($$value) => {
          $components = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ ref }) => {
          return `${validate_component(T$1.Group, "T.Group").$$render($$result, { "rotation.x": Math.PI / 2 }, {}, {
            default: () => {
              return `${validate_component(T$1.Mesh, "T.Mesh").$$render(
                $$result,
                {
                  "scale.y": -1,
                  "rotation.x": -Math.PI / 2,
                  material: shadowMaterial,
                  geometry: $planeGeometry
                },
                {},
                {}
              )} ${validate_component(T$1, "T").$$render($$result, { is: shadowCamera, manual: true }, {}, {})} ${slots.default ? slots.default({ ref }) : ``}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_depthMaterial();
  $$unsubscribe_planeGeometry();
  $$unsubscribe_renderTargetBlur();
  $$unsubscribe_renderTarget();
  $$unsubscribe_blurPlane();
  $$unsubscribe_scaledHeight();
  $$unsubscribe_scaledWidth();
  $$unsubscribe_components();
  return $$rendered;
});
const revision = Number.parseInt(REVISION.replace("dev", ""));
const vertexShader = (
  /*glsl*/
  `
  varying vec3 localPosition;
  varying vec4 worldPosition;

  uniform vec3 worldCamProjPosition;
	uniform vec3 worldPlanePosition;
	uniform float fadeDistance;
	uniform bool infiniteGrid;
	uniform bool followCamera;

	uniform int coord0;
	uniform int coord1;
	uniform int coord2;

	void main() {
		localPosition = vec3(
		  position[coord0],
			position[coord1],
			position[coord2]
		);

		if (infiniteGrid) {
		  localPosition *= 1.0 + fadeDistance;
		}

		worldPosition = modelMatrix * vec4(localPosition, 1.0);
		if (followCamera) {
		  worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
      localPosition = (inverse(modelMatrix) * worldPosition).xyz;
		}

		gl_Position = projectionMatrix * viewMatrix * worldPosition;
	}
`
);
const fragmentShader = (
  /*glsl*/
  `
  #define PI 3.141592653589793

	varying vec3 localPosition;
	varying vec4 worldPosition;

	uniform vec3 worldCamProjPosition;
	uniform float cellSize;
	uniform float sectionSize;
	uniform vec3 cellColor;
	uniform vec3 sectionColor;
	uniform float fadeDistance;
	uniform float fadeStrength;
	uniform float cellThickness;
	uniform float sectionThickness;
	uniform vec3 backgroundColor;
	uniform float backgroundOpacity;

	uniform bool infiniteGrid;

	uniform int coord0;
	uniform int coord1;
	uniform int coord2;

	// 0 - default; 1 - lines; 2 - circles; 3 - polar
	uniform int gridType;

  // lineGrid coord for lines
	uniform int lineGridCoord;

	// circlegrid max radius
	uniform float circleGridMaxRadius;

	// polar grid dividers
	uniform float polarCellDividers;
	uniform float polarSectionDividers;

	float getSquareGrid(float size, float thickness, vec3 localPos) {
		vec2 coord = localPos.xy / size;

		vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
		float line = min(grid.x, grid.y) + 1.0 - thickness;

		return 1.0 - min(line, 1.0);
	}

	float getLinesGrid(float size, float thickness, vec3 localPos) {
		float coord = localPos[lineGridCoord] / size;
		float line = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) - thickness * 0.2;

		return 1.0 - min(line, 1.0);
	}

	float getCirclesGrid(float size, float thickness, vec3 localPos) {
		float coord = length(localPos.xy) / size;
		float line = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) - thickness * 0.2;

		if (!infiniteGrid && circleGridMaxRadius > 0. && coord > circleGridMaxRadius + thickness * 0.05) {
		  discard;
		}

		return 1.0 - min(line, 1.0);
	}

	float getPolarGrid(float size, float thickness, float polarDividers, vec3 localPos) {
		float rad = length(localPos.xy) / size;
		vec2 coord = vec2(rad, atan(localPos.x, localPos.y) * polarDividers / PI) ;

		vec2 wrapped = vec2(coord.x, fract(coord.y / (2.0 * polarDividers)) * (2.0 * polarDividers));
		vec2 coordWidth = fwidth(coord);
		vec2 wrappedWidth = fwidth(wrapped);
		vec2 width = (coord.y < -polarDividers * 0.5 || coord.y > polarDividers * 0.5 ? wrappedWidth : coordWidth) * (1.+thickness*0.25);

		// Compute anti-aliased world-space grid lines
		vec2 grid = abs(fract(coord - 0.5) - 0.5) / width;
		float line = min(grid.x, grid.y);

if (!infiniteGrid && circleGridMaxRadius > 0.0 && rad > circleGridMaxRadius + thickness * 0.05) {
		  discard;
		}

		return 1.0 - min(line, 1.0);
	}

	void main() {
		float g1 = 0.0;
		float g2 = 0.0;

		vec3 localPos = vec3(localPosition[coord0], localPosition[coord1], localPosition[coord2]);

		if (gridType == 0) {
			g1 = getSquareGrid(cellSize, cellThickness, localPos);
			g2 = getSquareGrid(sectionSize, sectionThickness, localPos);

		} else if (gridType == 1) {
			g1 = getLinesGrid(cellSize, cellThickness, localPos);
			g2 = getLinesGrid(sectionSize, sectionThickness, localPos);

		} else if (gridType == 2) {
			g1 = getCirclesGrid(cellSize, cellThickness, localPos);
			g2 = getCirclesGrid(sectionSize, sectionThickness, localPos);

		} else if (gridType == 3) {
			g1 = getPolarGrid(cellSize, cellThickness, polarCellDividers, localPos);
			g2 = getPolarGrid(sectionSize, sectionThickness, polarSectionDividers, localPos);
		}

		float dist = distance(worldCamProjPosition, worldPosition.xyz);
		float d = 1.0 - min(dist / fadeDistance, 1.0);
		float fadeFactor = pow(d, fadeStrength) * 0.95;

		vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

		if (backgroundOpacity > 0.0) {
			float linesAlpha = clamp((g1 + g2) * fadeFactor, 0.0,1.0);
			vec3 finalColor = mix(backgroundColor, color, linesAlpha);
			float blendedAlpha = max(linesAlpha, backgroundOpacity * fadeFactor);
			gl_FragColor = vec4(finalColor, blendedAlpha);

		} else {
			gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
			gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
		}

		if (gl_FragColor.a <= 0.0) {
		  discard;
		}

		#include <tonemapping_fragment>
		#include <${revision < 154 ? "encodings_fragment" : "colorspace_fragment"}>
	}
`
);
const Grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "cellColor",
    "sectionColor",
    "cellSize",
    "backgroundColor",
    "backgroundOpacity",
    "sectionSize",
    "plane",
    "gridSize",
    "followCamera",
    "infiniteGrid",
    "fadeDistance",
    "fadeStrength",
    "cellThickness",
    "sectionThickness",
    "side",
    "type",
    "axis",
    "maxRadius",
    "cellDividers",
    "sectionDividers",
    "ref"
  ]);
  let $component, $$unsubscribe_component;
  let { cellColor = "#000000" } = $$props;
  let { sectionColor = "#0000ee" } = $$props;
  let { cellSize = 1 } = $$props;
  let { backgroundColor = "#dadada" } = $$props;
  let { backgroundOpacity = 0 } = $$props;
  let { sectionSize = 10 } = $$props;
  let { plane = "xz" } = $$props;
  let { gridSize = [20, 20] } = $$props;
  let { followCamera = false } = $$props;
  let { infiniteGrid = false } = $$props;
  let { fadeDistance = 100 } = $$props;
  let { fadeStrength = 1 } = $$props;
  let { cellThickness = 1 } = $$props;
  let { sectionThickness = 2 } = $$props;
  let { side = DoubleSide } = $$props;
  let { type = "grid" } = $$props;
  let { axis = "x" } = $$props;
  let { maxRadius = 0 } = $$props;
  let { cellDividers = 6 } = $$props;
  let { sectionDividers = 2 } = $$props;
  let { ref } = $$props;
  const { invalidate, camera } = useThrelte();
  const gridPlane = new Plane();
  const upVector = new Vector3$1(0, 1, 0);
  const zeroVector = new Vector3$1(0, 0, 0);
  const axisToInt = { x: 0, y: 1, z: 2 };
  const planeToAxes = { xz: "xzy", xy: "xyz", zy: "zyx" };
  const gridType = { grid: 0, lines: 1, circular: 2, polar: 3 };
  const uniforms = {
    cellSize: { value: cellSize },
    sectionSize: { value: sectionSize },
    cellColor: { value: new Color(cellColor) },
    sectionColor: { value: new Color(sectionColor) },
    backgroundColor: { value: new Color(backgroundColor) },
    backgroundOpacity: { value: backgroundOpacity },
    fadeDistance: { value: fadeDistance },
    fadeStrength: { value: fadeStrength },
    cellThickness: { value: cellThickness },
    sectionThickness: { value: sectionThickness },
    infiniteGrid: { value: infiniteGrid },
    followCamera: { value: followCamera },
    coord0: { value: 0 },
    coord1: { value: 2 },
    coord2: { value: 1 },
    gridType: { value: gridType.grid },
    lineGridCoord: { value: axisToInt[axis] },
    circleGridMaxRadius: { value: maxRadius },
    polarCellDividers: { value: cellDividers },
    polarSectionDividers: { value: sectionDividers },
    worldCamProjPosition: { value: new Vector3$1() },
    worldPlanePosition: { value: new Vector3$1() }
  };
  useTask(() => {
    gridPlane.setFromNormalAndCoplanarPoint(upVector, zeroVector).applyMatrix4(ref.matrixWorld);
    const material = ref.material;
    const worldCamProjPosition = material.uniforms.worldCamProjPosition;
    const worldPlanePosition = material.uniforms.worldPlanePosition;
    gridPlane.projectPoint(camera.current.position, worldCamProjPosition.value);
    worldPlanePosition.value.set(0, 0, 0).applyMatrix4(ref.matrixWorld);
    invalidate();
  });
  const component = forwardEventHandlers();
  $$unsubscribe_component = subscribe(component, (value) => $component = value);
  if ($$props.cellColor === void 0 && $$bindings.cellColor && cellColor !== void 0) $$bindings.cellColor(cellColor);
  if ($$props.sectionColor === void 0 && $$bindings.sectionColor && sectionColor !== void 0) $$bindings.sectionColor(sectionColor);
  if ($$props.cellSize === void 0 && $$bindings.cellSize && cellSize !== void 0) $$bindings.cellSize(cellSize);
  if ($$props.backgroundColor === void 0 && $$bindings.backgroundColor && backgroundColor !== void 0) $$bindings.backgroundColor(backgroundColor);
  if ($$props.backgroundOpacity === void 0 && $$bindings.backgroundOpacity && backgroundOpacity !== void 0) $$bindings.backgroundOpacity(backgroundOpacity);
  if ($$props.sectionSize === void 0 && $$bindings.sectionSize && sectionSize !== void 0) $$bindings.sectionSize(sectionSize);
  if ($$props.plane === void 0 && $$bindings.plane && plane !== void 0) $$bindings.plane(plane);
  if ($$props.gridSize === void 0 && $$bindings.gridSize && gridSize !== void 0) $$bindings.gridSize(gridSize);
  if ($$props.followCamera === void 0 && $$bindings.followCamera && followCamera !== void 0) $$bindings.followCamera(followCamera);
  if ($$props.infiniteGrid === void 0 && $$bindings.infiniteGrid && infiniteGrid !== void 0) $$bindings.infiniteGrid(infiniteGrid);
  if ($$props.fadeDistance === void 0 && $$bindings.fadeDistance && fadeDistance !== void 0) $$bindings.fadeDistance(fadeDistance);
  if ($$props.fadeStrength === void 0 && $$bindings.fadeStrength && fadeStrength !== void 0) $$bindings.fadeStrength(fadeStrength);
  if ($$props.cellThickness === void 0 && $$bindings.cellThickness && cellThickness !== void 0) $$bindings.cellThickness(cellThickness);
  if ($$props.sectionThickness === void 0 && $$bindings.sectionThickness && sectionThickness !== void 0) $$bindings.sectionThickness(sectionThickness);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0) $$bindings.side(side);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.axis === void 0 && $$bindings.axis && axis !== void 0) $$bindings.axis(axis);
  if ($$props.maxRadius === void 0 && $$bindings.maxRadius && maxRadius !== void 0) $$bindings.maxRadius(maxRadius);
  if ($$props.cellDividers === void 0 && $$bindings.cellDividers && cellDividers !== void 0) $$bindings.cellDividers(cellDividers);
  if ($$props.sectionDividers === void 0 && $$bindings.sectionDividers && sectionDividers !== void 0) $$bindings.sectionDividers(sectionDividers);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        const axes = planeToAxes[plane];
        const c0 = axes.charAt(0);
        const c1 = axes.charAt(1);
        const c2 = axes.charAt(2);
        uniforms.coord0.value = axisToInt[c0];
        uniforms.coord1.value = axisToInt[c1];
        uniforms.coord2.value = axisToInt[c2];
      }
    }
    uniforms.cellSize.value = cellSize;
    uniforms.sectionSize.value = sectionSize;
    uniforms.backgroundOpacity.value = backgroundOpacity;
    uniforms.fadeDistance.value = fadeDistance;
    uniforms.fadeStrength.value = fadeStrength;
    uniforms.cellThickness.value = cellThickness;
    uniforms.sectionThickness.value = sectionThickness;
    uniforms.followCamera.value = followCamera;
    uniforms.infiniteGrid.value = infiniteGrid;
    {
      {
        switch (type) {
          case "grid": {
            uniforms.gridType.value = gridType.grid;
            break;
          }
          case "lines": {
            uniforms.gridType.value = gridType.lines;
            uniforms.lineGridCoord.value = axisToInt[axis];
            break;
          }
          case "circular": {
            uniforms.gridType.value = gridType.circular;
            uniforms.circleGridMaxRadius.value = maxRadius;
            break;
          }
          case "polar": {
            uniforms.gridType.value = gridType.polar;
            uniforms.circleGridMaxRadius.value = maxRadius;
            uniforms.polarCellDividers.value = cellDividers;
            uniforms.polarSectionDividers.value = sectionDividers;
            break;
          }
        }
        invalidate();
      }
    }
    {
      uniforms.cellColor.value.set(cellColor);
    }
    {
      uniforms.sectionColor.value.set(sectionColor);
    }
    {
      uniforms.backgroundColor.value.set(backgroundColor);
    }
    $$rendered = `  ${validate_component(T$1.Mesh, "T.Mesh").$$render(
      $$result,
      Object.assign({}, { frustumCulled: false }, $$restProps, { this: $component }, { ref }),
      {
        this: ($$value) => {
          $component = $$value;
          $$settled = false;
        },
        ref: ($$value) => {
          ref = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ ref: ref2 }) => {
          return `${validate_component(T$1.ShaderMaterial, "T.ShaderMaterial").$$render(
            $$result,
            {
              fragmentShader,
              vertexShader,
              uniforms,
              transparent: true,
              side
            },
            {},
            {}
          )} ${slots.default ? slots.default({ ref: ref2 }) : ` ${validate_component(T$1.PlaneGeometry, "T.PlaneGeometry").$$render(
            $$result,
            {
              args: typeof gridSize == "number" ? [gridSize, gridSize] : gridSize
            },
            {},
            {}
          )} `}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_component();
  return $$rendered;
});
const useControlsContext = () => {
  return useThrelteUserContext("threlte-controls", {
    orbitControls: writable(void 0),
    trackballControls: writable(void 0)
  });
};
const OrbitControls = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["ref"]);
  let $parent, $$unsubscribe_parent;
  let $component, $$unsubscribe_component;
  const parent = useParent();
  $$unsubscribe_parent = subscribe(parent, (value) => $parent = value);
  const isCamera2 = (p) => {
    return p.isCamera;
  };
  const { renderer, invalidate } = useThrelte();
  if (!isCamera2($parent)) {
    throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");
  }
  const ref = new OrbitControls$1($parent, renderer.domElement);
  const { start, stop } = useTask(() => ref.update(), { autoStart: false, autoInvalidate: false });
  const component = forwardEventHandlers();
  $$unsubscribe_component = subscribe(component, (value) => $component = value);
  const { orbitControls } = useControlsContext();
  orbitControls.set(ref);
  onDestroy(() => orbitControls.set(void 0));
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        if ($$restProps.autoRotate || $$restProps.enableDamping) start();
        else stop();
      }
    }
    $$rendered = `${validate_component(T$1, "T").$$render(
      $$result,
      Object.assign({}, { is: ref }, $$restProps, { this: $component }),
      {
        this: ($$value) => {
          $component = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ ref: ref2 }) => {
          return `${slots.default ? slots.default({ ref: ref2 }) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_parent();
  $$unsubscribe_component();
  return $$rendered;
});
new Matrix4();
new Matrix4();
new Mesh();
`
	  #include <common>
    ${ShaderChunk.logdepthbuf_pars_vertex}
    ${ShaderChunk.fog_pars_vertex}

    attribute vec3 previous;
    attribute vec3 next;
    attribute float side;
    attribute float width;
    attribute float counters;

    uniform vec2 resolution;
    uniform float lineWidth;
    uniform vec3 color;
    uniform float opacity;
    uniform float sizeAttenuation;
    uniform float scaleDown;

    varying vec2 vUV;
    varying vec4 vColor;
    varying float vCounters;

    vec2 intoScreen(vec4 i) {
        return resolution * (0.5 * i.xy / i.w + 0.5);
    }

    void main() {
        float aspect = resolution.y / resolution.x;

        mat4 m = projectionMatrix * modelViewMatrix;

        vec4 currentClip = m * vec4( position, 1.0 );
        vec4 prevClip = m * vec4( previous, 1.0 );
        vec4 nextClip = m * vec4( next, 1.0 );

        vec4 currentNormed = currentClip / currentClip.w;
        vec4 prevNormed = prevClip / prevClip.w;
        vec4 nextNormed = nextClip / nextClip.w;

        vec2 currentScreen = intoScreen(currentNormed);
        vec2 prevScreen = intoScreen(prevNormed);
        vec2 nextScreen = intoScreen(nextNormed);

        float actualWidth = lineWidth * width;

        vec2 dir;
        if(nextScreen == currentScreen) {
            dir = normalize( currentScreen - prevScreen );
        } else if(prevScreen == currentScreen) {
            dir = normalize( nextScreen - currentScreen );
        } else {
            vec2 inDir = currentScreen - prevScreen;
            vec2 outDir = nextScreen - currentScreen;
            vec2 fullDir = nextScreen - prevScreen;

            if(length(fullDir) > 0.0) {
                dir = normalize(fullDir);
            } else if(length(inDir) > 0.0){
                dir = normalize(inDir);
            } else {
                dir = normalize(outDir);
            }
        }

        vec2 normal = vec2(-dir.y, dir.x);

        if(sizeAttenuation != 0.0) {
            normal /= currentClip.w;
            normal *= min(resolution.x, resolution.y);
        }

        if (scaleDown > 0.0) {
            float dist = length(nextNormed - prevNormed);
            normal *= smoothstep(0.0, scaleDown, dist);
        }

        vec2 offsetInScreen = actualWidth * normal * side * 0.5;

        vec2 withOffsetScreen = currentScreen + offsetInScreen;
        vec3 withOffsetNormed = vec3((2.0 * withOffsetScreen/resolution - 1.0), currentNormed.z);

        vCounters = counters;
        vColor = vec4( color, opacity );
        vUV = uv;

        gl_Position = currentClip.w * vec4(withOffsetNormed, 1.0);

        ${ShaderChunk.logdepthbuf_vertex}
        ${ShaderChunk.fog_vertex}
    }
`;
`
uniform vec3 glowColor;
uniform float falloffAmount;
uniform float glowSharpness;
uniform float glowInternalRadius;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
	// Normal
	vec3 normal = normalize(vNormal);
	if(!gl_FrontFacing)
			normal *= - 1.0;
	vec3 viewDirection = normalize(cameraPosition - vPosition);
	float fresnel = dot(viewDirection, normal);
	fresnel = pow(fresnel, glowInternalRadius + 0.1);
	float falloff = smoothstep(0., falloffAmount, fresnel);
	float fakeGlow = fresnel;
	fakeGlow += fresnel * glowSharpness;
	fakeGlow *= falloff;
	gl_FragColor = vec4(clamp(glowColor * fresnel, 0., 1.0), clamp(fakeGlow, 0., 1.0));

	${ShaderChunk.tonemapping_fragment}
	${ShaderChunk.colorspace_fragment}
}`;
`
uniform sampler2D pointTexture;
uniform float fade;
uniform float opacity;

varying vec3 vColor;
void main() {
	float pointOpacity = 1.0;
	if (fade == 1.0) {
		float d = distance(gl_PointCoord, vec2(0.5, 0.5));
		pointOpacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
	}
	gl_FragColor = vec4(vColor, pointOpacity * opacity);

	${ShaderChunk.tonemapping_fragment}
	${ShaderChunk.colorspace_fragment}
}`;
`#define ENVMAP_TYPE_CUBE_UV
precision highp isampler2D;
precision highp usampler2D;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying mat4 vModelMatrixInverse;

#ifdef USE_INSTANCING_COLOR
	varying vec3 vInstanceColor;
#endif

#ifdef ENVMAP_TYPE_CUBEM
	uniform samplerCube envMap;
#else
	uniform sampler2D envMap;
#endif

uniform float bounces;
${shaderStructs}
${shaderIntersectFunction}
uniform BVH bvh;
uniform float ior;
uniform bool correctMips;
uniform vec2 resolution;
uniform float fresnel;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrixInverse;
uniform mat4 viewMatrixInverse;
uniform float aberrationStrength;
uniform vec3 color;

float fresnelFunc(vec3 viewDirection, vec3 worldNormal) {
	return pow( 1.0 + dot( viewDirection, worldNormal), 10.0 );
}

vec3 totalInternalReflection(vec3 ro, vec3 rd, vec3 normal, float ior, mat4 modelMatrixInverse) {
	vec3 rayOrigin = ro;
	vec3 rayDirection = rd;
	rayDirection = refract(rayDirection, normal, 1.0 / ior);
	rayOrigin = vWorldPosition + rayDirection * 0.001;
	rayOrigin = (modelMatrixInverse * vec4(rayOrigin, 1.0)).xyz;
	rayDirection = normalize((modelMatrixInverse * vec4(rayDirection, 0.0)).xyz);
	for(float i = 0.0; i < bounces; i++) {
		uvec4 faceIndices = uvec4( 0u );
		vec3 faceNormal = vec3( 0.0, 0.0, 1.0 );
		vec3 barycoord = vec3( 0.0 );
		float side = 1.0;
		float dist = 0.0;
		bvhIntersectFirstHit( bvh, rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist );
		vec3 hitPos = rayOrigin + rayDirection * max(dist - 0.001, 0.0);
		vec3 tempDir = refract(rayDirection, faceNormal, ior);
		if (length(tempDir) != 0.0) {
			rayDirection = tempDir;
			break;
		}
		rayDirection = reflect(rayDirection, faceNormal);
		rayOrigin = hitPos + rayDirection * 0.01;
	}
	rayDirection = normalize((modelMatrix * vec4(rayDirection, 0.0)).xyz);
	return rayDirection;
}

#include <common>
#include <cube_uv_reflection_fragment>

#ifdef ENVMAP_TYPE_CUBEM
	vec4 textureGradient(samplerCube envMap, vec3 rayDirection, vec3 directionCamPerfect) {
		return textureGrad(envMap, rayDirection, dFdx(correctMips ? directionCamPerfect: rayDirection), dFdy(correctMips ? directionCamPerfect: rayDirection));
	}
#else
	vec4 textureGradient(sampler2D envMap, vec3 rayDirection, vec3 directionCamPerfect) {
		vec2 uvv = equirectUv( rayDirection );
		vec2 smoothUv = equirectUv( directionCamPerfect );
		return textureGrad(envMap, uvv, dFdx(correctMips ? smoothUv : uvv), dFdy(correctMips ? smoothUv : uvv));
	}
#endif

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 directionCamPerfect = (projectionMatrixInverse * vec4(uv * 2.0 - 1.0, 0.0, 1.0)).xyz;
	directionCamPerfect = (viewMatrixInverse * vec4(directionCamPerfect, 0.0)).xyz;
	directionCamPerfect = normalize(directionCamPerfect);
	vec3 normal = vNormal;
	vec3 rayOrigin = cameraPosition;
	vec3 rayDirection = normalize(vWorldPosition - cameraPosition);
	vec3 finalColor;
	#ifdef CHROMATIC_ABERRATIONS
		vec3 rayDirectionG = totalInternalReflection(rayOrigin, rayDirection, normal, max(ior, 1.0), vModelMatrixInverse);
		#ifdef FAST_CHROMA
			vec3 rayDirectionR = normalize(rayDirectionG + 1.0 * vec3(aberrationStrength / 2.0));
			vec3 rayDirectionB = normalize(rayDirectionG - 1.0 * vec3(aberrationStrength / 2.0));
		#else
			vec3 rayDirectionR = totalInternalReflection(rayOrigin, rayDirection, normal, max(ior * (1.0 - aberrationStrength), 1.0), vModelMatrixInverse);
			vec3 rayDirectionB = totalInternalReflection(rayOrigin, rayDirection, normal, max(ior * (1.0 + aberrationStrength), 1.0), vModelMatrixInverse);
		#endif
		float finalColorR = textureGradient(envMap, rayDirectionR, directionCamPerfect).r;
		float finalColorG = textureGradient(envMap, rayDirectionG, directionCamPerfect).g;
		float finalColorB = textureGradient(envMap, rayDirectionB, directionCamPerfect).b;
		finalColor = vec3(finalColorR, finalColorG, finalColorB);
	#else
		rayDirection = totalInternalReflection(rayOrigin, rayDirection, normal, max(ior, 1.0), vModelMatrixInverse);
		finalColor = textureGradient(envMap, rayDirection, directionCamPerfect).rgb;
	#endif

	finalColor *= color;
	#ifdef USE_INSTANCING_COLOR
		finalColor *= vInstanceColor;
	#endif

	vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
	float nFresnel = fresnelFunc(viewDirection, normal) * fresnel;
	gl_FragColor = vec4(mix(finalColor, vec3(1.0), nFresnel), 1.0);
	${ShaderChunk.tonemapping_fragment}
	${ShaderChunk.colorspace_fragment}
}`;
for (let t = 0; t < 256; t++)
  (t < 16 ? "0" : "") + t.toString(16);
new OrthographicCamera(-1, 1, 1, -1, 0, 1);
class tt extends BufferGeometry {
  constructor() {
    super(), this.setAttribute("position", new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));
  }
}
new tt();
var te = { exports: {} };
te.exports = G;
te.exports.default = G;
function G(t, i, e) {
  e = e || 2;
  var n = i && i.length, r = n ? i[0] * e : t.length, s = de(t, 0, r, e, true), a = [];
  if (!s || s.next === s.prev)
    return a;
  var l, u, o, h, g, c, f;
  if (n && (s = gt(t, i, s, e)), t.length > 80 * e) {
    l = o = t[0], u = h = t[1];
    for (var m = e; m < r; m += e)
      g = t[m], c = t[m + 1], g < l && (l = g), c < u && (u = c), g > o && (o = g), c > h && (h = c);
    f = Math.max(o - l, h - u), f = f !== 0 ? 32767 / f : 0;
  }
  return I(s, a, e, l, u, f, 0), a;
}
function de(t, i, e, n, r) {
  var s, a;
  if (r === X(t, i, e, n) > 0)
    for (s = i; s < e; s += n)
      a = me(s, t[s], t[s + 1], a);
  else
    for (s = e - n; s >= i; s -= n)
      a = me(s, t[s], t[s + 1], a);
  return a && Z(a, a.next) && (E(a), a = a.next), a;
}
function F(t, i) {
  if (!t)
    return t;
  i || (i = t);
  var e = t, n;
  do
    if (n = false, !e.steiner && (Z(e, e.next) || T(e.prev, e, e.next) === 0)) {
      if (E(e), e = i = e.prev, e === e.next)
        break;
      n = true;
    } else
      e = e.next;
  while (n || e !== i);
  return i;
}
function I(t, i, e, n, r, s, a) {
  if (t) {
    !a && s && _t(t, n, r, s);
    for (var l = t, u, o; t.prev !== t.next; ) {
      if (u = t.prev, o = t.next, s ? ht(t, n, r, s) : mt(t)) {
        i.push(u.i / e | 0), i.push(t.i / e | 0), i.push(o.i / e | 0), E(t), t = o.next, l = o.next;
        continue;
      }
      if (t = o, t === l) {
        a ? a === 1 ? (t = pt(F(t), i, e), I(t, i, e, n, r, s, 2)) : a === 2 && dt(t, i, e, n, r, s) : I(F(t), i, e, n, r, s, 1);
        break;
      }
    }
  }
}
function mt(t) {
  var i = t.prev, e = t, n = t.next;
  if (T(i, e, n) >= 0)
    return false;
  for (var r = i.x, s = e.x, a = n.x, l = i.y, u = e.y, o = n.y, h = r < s ? r < a ? r : a : s < a ? s : a, g = l < u ? l < o ? l : o : u < o ? u : o, c = r > s ? r > a ? r : a : s > a ? s : a, f = l > u ? l > o ? l : o : u > o ? u : o, m = n.next; m !== i; ) {
    if (m.x >= h && m.x <= c && m.y >= g && m.y <= f && V(r, l, s, u, a, o, m.x, m.y) && T(m.prev, m, m.next) >= 0)
      return false;
    m = m.next;
  }
  return true;
}
function ht(t, i, e, n) {
  var r = t.prev, s = t, a = t.next;
  if (T(r, s, a) >= 0)
    return false;
  for (var l = r.x, u = s.x, o = a.x, h = r.y, g = s.y, c = a.y, f = l < u ? l < o ? l : o : u < o ? u : o, m = h < g ? h < c ? h : c : g < c ? g : c, p = l > u ? l > o ? l : o : u > o ? u : o, d = h > g ? h > c ? h : c : g > c ? g : c, w = W(f, m, i, e, n), _ = W(p, d, i, e, n), x = t.prevZ, v = t.nextZ; x && x.z >= w && v && v.z <= _; ) {
    if (x.x >= f && x.x <= p && x.y >= m && x.y <= d && x !== r && x !== a && V(l, h, u, g, o, c, x.x, x.y) && T(x.prev, x, x.next) >= 0 || (x = x.prevZ, v.x >= f && v.x <= p && v.y >= m && v.y <= d && v !== r && v !== a && V(l, h, u, g, o, c, v.x, v.y) && T(v.prev, v, v.next) >= 0))
      return false;
    v = v.nextZ;
  }
  for (; x && x.z >= w; ) {
    if (x.x >= f && x.x <= p && x.y >= m && x.y <= d && x !== r && x !== a && V(l, h, u, g, o, c, x.x, x.y) && T(x.prev, x, x.next) >= 0)
      return false;
    x = x.prevZ;
  }
  for (; v && v.z <= _; ) {
    if (v.x >= f && v.x <= p && v.y >= m && v.y <= d && v !== r && v !== a && V(l, h, u, g, o, c, v.x, v.y) && T(v.prev, v, v.next) >= 0)
      return false;
    v = v.nextZ;
  }
  return true;
}
function pt(t, i, e) {
  var n = t;
  do {
    var r = n.prev, s = n.next.next;
    !Z(r, s) && ge(r, n, n.next, s) && O(r, s) && O(s, r) && (i.push(r.i / e | 0), i.push(n.i / e | 0), i.push(s.i / e | 0), E(n), E(n.next), n = t = s), n = n.next;
  } while (n !== t);
  return F(n);
}
function dt(t, i, e, n, r, s) {
  var a = t;
  do {
    for (var l = a.next.next; l !== a.prev; ) {
      if (a.i !== l.i && Dt(a, l)) {
        var u = xe(a, l);
        a = F(a, a.next), u = F(u, u.next), I(a, i, e, n, r, s, 0), I(u, i, e, n, r, s, 0);
        return;
      }
      l = l.next;
    }
    a = a.next;
  } while (a !== t);
}
function gt(t, i, e, n) {
  var r = [], s, a, l, u, o;
  for (s = 0, a = i.length; s < a; s++)
    l = i[s] * n, u = s < a - 1 ? i[s + 1] * n : t.length, o = de(t, l, u, n, false), o === o.next && (o.steiner = true), r.push(Mt(o));
  for (r.sort(xt), s = 0; s < r.length; s++)
    e = vt(r[s], e);
  return e;
}
function xt(t, i) {
  return t.x - i.x;
}
function vt(t, i) {
  var e = yt(t, i);
  if (!e)
    return i;
  var n = xe(e, t);
  return F(n, n.next), F(e, e.next);
}
function yt(t, i) {
  var e = i, n = t.x, r = t.y, s = -1 / 0, a;
  do {
    if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
      var l = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (l <= n && l > s && (s = l, a = e.x < e.next.x ? e : e.next, l === n))
        return a;
    }
    e = e.next;
  } while (e !== i);
  if (!a)
    return null;
  var u = a, o = a.x, h = a.y, g = 1 / 0, c;
  e = a;
  do
    n >= e.x && e.x >= o && n !== e.x && V(r < h ? n : s, r, o, h, r < h ? s : n, r, e.x, e.y) && (c = Math.abs(r - e.y) / (n - e.x), O(e, t) && (c < g || c === g && (e.x > a.x || e.x === a.x && wt(a, e))) && (a = e, g = c)), e = e.next;
  while (e !== u);
  return a;
}
function wt(t, i) {
  return T(t.prev, t, i.prev) < 0 && T(i.next, t, t.next) < 0;
}
function _t(t, i, e, n) {
  var r = t;
  do
    r.z === 0 && (r.z = W(r.x, r.y, i, e, n)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
  while (r !== t);
  r.prevZ.nextZ = null, r.prevZ = null, Tt(r);
}
function Tt(t) {
  var i, e, n, r, s, a, l, u, o = 1;
  do {
    for (e = t, t = null, s = null, a = 0; e; ) {
      for (a++, n = e, l = 0, i = 0; i < o && (l++, n = n.nextZ, !!n); i++)
        ;
      for (u = o; l > 0 || u > 0 && n; )
        l !== 0 && (u === 0 || !n || e.z <= n.z) ? (r = e, e = e.nextZ, l--) : (r = n, n = n.nextZ, u--), s ? s.nextZ = r : t = r, r.prevZ = s, s = r;
      e = n;
    }
    s.nextZ = null, o *= 2;
  } while (a > 1);
  return t;
}
function W(t, i, e, n, r) {
  return t = (t - e) * r | 0, i = (i - n) * r | 0, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t | i << 1;
}
function Mt(t) {
  var i = t, e = t;
  do
    (i.x < e.x || i.x === e.x && i.y < e.y) && (e = i), i = i.next;
  while (i !== t);
  return e;
}
function V(t, i, e, n, r, s, a, l) {
  return (r - a) * (i - l) >= (t - a) * (s - l) && (t - a) * (n - l) >= (e - a) * (i - l) && (e - a) * (s - l) >= (r - a) * (n - l);
}
function Dt(t, i) {
  return t.next.i !== i.i && t.prev.i !== i.i && !At(t, i) && // dones't intersect other edges
  (O(t, i) && O(i, t) && bt(t, i) && // locally visible
  (T(t.prev, t, i.prev) || T(t, i.prev, i)) || // does not create opposite-facing sectors
  Z(t, i) && T(t.prev, t, t.next) > 0 && T(i.prev, i, i.next) > 0);
}
function T(t, i, e) {
  return (i.y - t.y) * (e.x - i.x) - (i.x - t.x) * (e.y - i.y);
}
function Z(t, i) {
  return t.x === i.x && t.y === i.y;
}
function ge(t, i, e, n) {
  var r = H(T(t, i, e)), s = H(T(t, i, n)), a = H(T(e, n, t)), l = H(T(e, n, i));
  return !!(r !== s && a !== l || r === 0 && z(t, e, i) || s === 0 && z(t, n, i) || a === 0 && z(e, t, n) || l === 0 && z(e, i, n));
}
function z(t, i, e) {
  return i.x <= Math.max(t.x, e.x) && i.x >= Math.min(t.x, e.x) && i.y <= Math.max(t.y, e.y) && i.y >= Math.min(t.y, e.y);
}
function H(t) {
  return t > 0 ? 1 : t < 0 ? -1 : 0;
}
function At(t, i) {
  var e = t;
  do {
    if (e.i !== t.i && e.next.i !== t.i && e.i !== i.i && e.next.i !== i.i && ge(e, e.next, t, i))
      return true;
    e = e.next;
  } while (e !== t);
  return false;
}
function O(t, i) {
  return T(t.prev, t, t.next) < 0 ? T(t, i, t.next) >= 0 && T(t, t.prev, i) >= 0 : T(t, i, t.prev) < 0 || T(t, t.next, i) < 0;
}
function bt(t, i) {
  var e = t, n = false, r = (t.x + i.x) / 2, s = (t.y + i.y) / 2;
  do
    e.y > s != e.next.y > s && e.next.y !== e.y && r < (e.next.x - e.x) * (s - e.y) / (e.next.y - e.y) + e.x && (n = !n), e = e.next;
  while (e !== t);
  return n;
}
function xe(t, i) {
  var e = new Y(t.i, t.x, t.y), n = new Y(i.i, i.x, i.y), r = t.next, s = i.prev;
  return t.next = i, i.prev = t, e.next = r, r.prev = e, n.next = e, e.prev = n, s.next = n, n.prev = s, n;
}
function me(t, i, e, n) {
  var r = new Y(t, i, e);
  return n ? (r.next = n.next, r.prev = n, n.next.prev = r, n.next = r) : (r.prev = r, r.next = r), r;
}
function E(t) {
  t.next.prev = t.prev, t.prev.next = t.next, t.prevZ && (t.prevZ.nextZ = t.nextZ), t.nextZ && (t.nextZ.prevZ = t.prevZ);
}
function Y(t, i, e) {
  this.i = t, this.x = i, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = false;
}
G.deviation = function(t, i, e, n) {
  var r = i && i.length, s = r ? i[0] * e : t.length, a = Math.abs(X(t, 0, s, e));
  if (r)
    for (var l = 0, u = i.length; l < u; l++) {
      var o = i[l] * e, h = l < u - 1 ? i[l + 1] * e : t.length;
      a -= Math.abs(X(t, o, h, e));
    }
  var g = 0;
  for (l = 0; l < n.length; l += 3) {
    var c = n[l] * e, f = n[l + 1] * e, m = n[l + 2] * e;
    g += Math.abs(
      (t[c] - t[m]) * (t[f + 1] - t[c + 1]) - (t[c] - t[f]) * (t[m + 1] - t[c + 1])
    );
  }
  return a === 0 && g === 0 ? 0 : Math.abs((g - a) / a);
};
function X(t, i, e, n) {
  for (var r = 0, s = i, a = e - n; s < e; s += n)
    r += (t[a] - t[s]) * (t[s + 1] + t[a + 1]), a = s;
  return r;
}
G.flatten = function(t) {
  for (var i = t[0][0].length, e = { vertices: [], holes: [], dimensions: i }, n = 0, r = 0; r < t.length; r++) {
    for (var s = 0; s < t[r].length; s++)
      for (var a = 0; a < i; a++)
        e.vertices.push(t[r][s][a]);
    r > 0 && (n += t[r - 1].length, e.holes.push(n));
  }
  return e;
};
new Vector2();
new Vector2();
var J;
((t) => {
  function i(r) {
    let s = r.slice();
    return s.sort(t.POINT_COMPARATOR), t.makeHullPresorted(s);
  }
  t.makeHull = i;
  function e(r) {
    if (r.length <= 1)
      return r.slice();
    let s = [];
    for (let l = 0; l < r.length; l++) {
      const u = r[l];
      for (; s.length >= 2; ) {
        const o = s[s.length - 1], h = s[s.length - 2];
        if ((o.x - h.x) * (u.y - h.y) >= (o.y - h.y) * (u.x - h.x))
          s.pop();
        else
          break;
      }
      s.push(u);
    }
    s.pop();
    let a = [];
    for (let l = r.length - 1; l >= 0; l--) {
      const u = r[l];
      for (; a.length >= 2; ) {
        const o = a[a.length - 1], h = a[a.length - 2];
        if ((o.x - h.x) * (u.y - h.y) >= (o.y - h.y) * (u.x - h.x))
          a.pop();
        else
          break;
      }
      a.push(u);
    }
    return a.pop(), s.length == 1 && a.length == 1 && s[0].x == a[0].x && s[0].y == a[0].y ? s : s.concat(a);
  }
  t.makeHullPresorted = e;
  function n(r, s) {
    return r.x < s.x ? -1 : r.x > s.x ? 1 : r.y < s.y ? -1 : r.y > s.y ? 1 : 0;
  }
  t.POINT_COMPARATOR = n;
})(J || (J = {}));
const ShaderPlane = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { rotation = 0 } = $$props;
  let { scale = 1 } = $$props;
  let { pointSize = 2 } = $$props;
  let { waveFreq1 = 1 } = $$props;
  let { waveAmp1 = 1 } = $$props;
  let { waveSpeed1 = 1 } = $$props;
  let { waveFreq2 = 1 } = $$props;
  let { waveAmp2 = 1 } = $$props;
  let { waveSpeed2 = 1 } = $$props;
  new THREE.Clock();
  let uniforms = {
    u_time: { value: 0 },
    u_pointsize: { value: pointSize },
    u_noise_amp_1: { value: waveAmp1 },
    u_noise_freq_1: { value: waveFreq1 },
    u_spd_modifier_1: { value: waveSpeed1 },
    u_noise_amp_2: { value: waveAmp2 },
    u_noise_freq_2: { value: waveFreq2 },
    u_spd_modifier_2: { value: waveSpeed2 },
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }
  };
  const vertexShader2 = `
    #define PI 3.14159265359

    uniform float u_time;
    uniform float u_pointsize;
    uniform float u_noise_amp_1;
    uniform float u_noise_freq_1;
    uniform float u_spd_modifier_1;
    uniform float u_noise_amp_2;
    uniform float u_noise_freq_2;
    uniform float u_spd_modifier_2;

    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))
                    * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation

        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);

        // Mix 4 corners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    mat2 rotate2d(float angle){
        return mat2(cos(angle),-sin(angle),
                  sin(angle),cos(angle));
    }

    void main() {
      gl_PointSize = u_pointsize;

      vec3 pos = position;
      pos.z += noise(pos.xy * u_noise_freq_1 + u_time * u_spd_modifier_1) * u_noise_amp_1;
      pos.z += noise(rotate2d(PI / 4.) * pos.yx * u_noise_freq_2 - u_time * u_spd_modifier_2 * 0.6) * u_noise_amp_2;

      vec4 mvm = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvm;
    }
  `;
  const fragmentShader2 = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    
    uniform vec2 u_resolution;

    void main() {
      vec2 st = gl_FragCoord.xy/u_resolution.xy;
      gl_FragColor = vec4(vec3(0.0, st),1.0);
    }
  `;
  let material;
  if ($$props.rotation === void 0 && $$bindings.rotation && rotation !== void 0) $$bindings.rotation(rotation);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0) $$bindings.scale(scale);
  if ($$props.pointSize === void 0 && $$bindings.pointSize && pointSize !== void 0) $$bindings.pointSize(pointSize);
  if ($$props.waveFreq1 === void 0 && $$bindings.waveFreq1 && waveFreq1 !== void 0) $$bindings.waveFreq1(waveFreq1);
  if ($$props.waveAmp1 === void 0 && $$bindings.waveAmp1 && waveAmp1 !== void 0) $$bindings.waveAmp1(waveAmp1);
  if ($$props.waveSpeed1 === void 0 && $$bindings.waveSpeed1 && waveSpeed1 !== void 0) $$bindings.waveSpeed1(waveSpeed1);
  if ($$props.waveFreq2 === void 0 && $$bindings.waveFreq2 && waveFreq2 !== void 0) $$bindings.waveFreq2(waveFreq2);
  if ($$props.waveAmp2 === void 0 && $$bindings.waveAmp2 && waveAmp2 !== void 0) $$bindings.waveAmp2(waveAmp2);
  if ($$props.waveSpeed2 === void 0 && $$bindings.waveSpeed2 && waveSpeed2 !== void 0) $$bindings.waveSpeed2(waveSpeed2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        uniforms.u_pointsize.value = pointSize;
        uniforms.u_noise_amp_1.value = waveAmp1;
        uniforms.u_noise_freq_1.value = waveFreq1;
        uniforms.u_spd_modifier_1.value = waveSpeed1;
        uniforms.u_noise_amp_2.value = waveAmp2;
        uniforms.u_noise_freq_2.value = waveFreq2;
        uniforms.u_spd_modifier_2.value = waveSpeed2;
      }
    }
    $$rendered = `${validate_component(T$1.Points, "T.Points").$$render(
      $$result,
      {
        rotation: [-Math.PI / 2, rotation * Math.PI / 180, 0],
        position: [0, 0, 0],
        scale: [scale, scale, scale]
      },
      {},
      {
        default: () => {
          return `${validate_component(T$1.PlaneGeometry, "T.PlaneGeometry").$$render($$result, { args: [5, 5, 64, 64] }, {}, {})} ${validate_component(T$1.ShaderMaterial, "T.ShaderMaterial").$$render(
            $$result,
            {
              vertexShader: vertexShader2,
              fragmentShader: fragmentShader2,
              uniforms,
              transparent: true,
              depthWrite: false,
              sizeAttenuation: true,
              ref: material
            },
            {
              ref: ($$value) => {
                material = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const sceneScale = writable(1);
const sceneNumber = writable(1);
const planes = writable([]);
const Scene = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $planes, $$unsubscribe_planes;
  $$unsubscribe_planes = subscribe(planes, (value) => $planes = value);
  let { scale } = $$props;
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0) $$bindings.scale(scale);
  {
    console.log(scale);
  }
  $$unsubscribe_planes();
  return `${validate_component(T$1.PerspectiveCamera, "T.PerspectiveCamera").$$render(
    $$result,
    {
      makeDefault: true,
      position: [-10, 10, 10],
      fov: 15
    },
    {},
    {
      default: () => {
        return `${validate_component(OrbitControls, "OrbitControls").$$render(
          $$result,
          {
            autoRotate: true,
            enableZoom: false,
            enableDamping: true,
            autoRotateSpeed: 0.5,
            "target.y": 1.5
          },
          {},
          {}
        )}`;
      }
    }
  )} ${validate_component(T$1.DirectionalLight, "T.DirectionalLight").$$render(
    $$result,
    {
      intensity: 0.8,
      "position.x": 5,
      "position.y": 10
    },
    {},
    {}
  )} ${validate_component(T$1.AmbientLight, "T.AmbientLight").$$render($$result, { intensity: 0.2 }, {}, {})} ${validate_component(Grid, "Grid").$$render(
    $$result,
    {
      "position.y": -1e-3,
      cellColor: "#ffffff",
      sectionColor: "#ffffff",
      sectionThickness: 0,
      fadeDistance: 25,
      cellSize: 2,
      scale: 1
    },
    {},
    {}
  )} ${validate_component(ContactShadows, "ContactShadows").$$render(
    $$result,
    {
      scale: 10,
      blur: 2,
      far: 2.5,
      opacity: 0.5
    },
    {},
    {}
  )} ${validate_component(Float, "Float").$$render($$result, { floatIntensity: 1, floatingRange: [0, 1] }, {}, {
    default: () => {
      return `${validate_component(T$1.Group, "T.Group").$$render($$result, { scale }, {}, {
        default: () => {
          return `${validate_component(T$1.Mesh, "T.Mesh").$$render($$result, { "position.y": 1.2 }, {}, {
            default: () => {
              return `${validate_component(T$1.BoxGeometry, "T.BoxGeometry").$$render($$result, {}, {}, {})} ${validate_component(T$1.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "#0059BA" }, {}, {})}`;
            }
          })} ${validate_component(T$1.Mesh, "T.Mesh").$$render(
            $$result,
            {
              position: [1.2, 1.5, 0.75],
              "rotation.x": 5,
              "rotation.y": 71
            },
            {},
            {
              default: () => {
                return `${validate_component(T$1.TorusKnotGeometry, "T.TorusKnotGeometry").$$render($$result, { args: [0.5, 0.15, 100, 12, 2, 3] }, {}, {})} ${validate_component(T$1.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "#F85122" }, {}, {})}`;
              }
            }
          )} ${validate_component(T$1.Mesh, "T.Mesh").$$render(
            $$result,
            {
              position: [-1.4, 1.5, 0.75],
              rotation: [-5, 128, 10]
            },
            {},
            {
              default: () => {
                return `${validate_component(T$1.IcosahedronGeometry, "T.IcosahedronGeometry").$$render($$result, {}, {}, {})} ${validate_component(T$1.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "#F8EBCE" }, {}, {})}`;
              }
            }
          )}`;
        }
      })}`;
    }
  })} ${each($planes, (plane) => {
    return `${validate_component(ShaderPlane, "ShaderPlane").$$render(
      $$result,
      {
        rotation: plane.rotation,
        scale: plane.scale,
        pointSize: plane.pointSize,
        waveFreq1: plane.waveFreq1,
        waveAmp1: plane.waveAmp1,
        waveSpeed1: plane.waveSpeed1,
        waveFreq2: plane.waveFreq2,
        waveAmp2: plane.waveAmp2,
        waveSpeed2: plane.waveSpeed2
      },
      {},
      {}
    )}`;
  })}`;
});
const standard = {
  baseBackgroundColor: "hsl(230, 7%, 17%)",
  baseBorderRadius: "6px",
  baseFontFamily: "Roboto Mono, Source Code Pro, Menlo, Courier, monospace",
  baseShadowColor: "rgba(0, 0, 0, 0.2)",
  bladeBorderRadius: "2px",
  bladeHorizontalPadding: "4px",
  bladeValueWidth: "160px",
  buttonBackgroundColor: "hsl(230, 7%, 70%)",
  buttonBackgroundColorActive: "#d6d7db",
  buttonBackgroundColorFocus: "#c8cad0",
  buttonBackgroundColorHover: "#bbbcc4",
  buttonForegroundColor: "hsl(230, 7%, 17%)",
  containerBackgroundColor: "rgba(187, 188, 196, 0.1)",
  containerBackgroundColorActive: "rgba(187, 188, 196, 0.25)",
  containerBackgroundColorFocus: "rgba(187, 188, 196, 0.2)",
  containerBackgroundColorHover: "rgba(187, 188, 196, 0.15)",
  containerForegroundColor: "hsl(230, 7%, 75%)",
  containerHorizontalPadding: "4px",
  containerUnitSize: "20px",
  containerUnitSpacing: "4px",
  containerVerticalPadding: "4px",
  grooveForegroundColor: "rgba(187, 188, 196, 0.1)",
  inputBackgroundColor: "rgba(187, 188, 196, 0.1)",
  inputBackgroundColorActive: "rgba(187, 188, 196, 0.25)",
  inputBackgroundColorFocus: "rgba(187, 188, 196, 0.2)",
  inputBackgroundColorHover: "rgba(187, 188, 196, 0.15)",
  inputForegroundColor: "hsl(230, 7%, 75%)",
  labelForegroundColor: "rgba(187, 188, 196, 0.7)",
  monitorBackgroundColor: "rgba(0, 0, 0, 0.2)",
  monitorForegroundColor: "rgba(187, 188, 196, 0.7)",
  pluginImageDraggingColor: "hsla(230, 100%, 66%, 1)"
  // PluginThumbnailListHeight: '400px', pluginThumbnailListThumbSize: '20px',
  // pluginThumbnailListWidth: '200px'
};
Object.keys(standard).reduce((acc, key2) => {
  acc[key2] = key2;
  return acc;
}, {});
const keyToCssVariableMap = /* @__PURE__ */ new Map([
  // Tweakpane
  ["baseBackgroundColor", "--tp-base-background-color"],
  ["baseBorderRadius", "--tp-base-border-radius"],
  ["baseFontFamily", "--tp-base-font-family"],
  ["baseShadowColor", "--tp-base-shadow-color"],
  ["bladeBorderRadius", "--tp-blade-border-radius"],
  ["bladeHorizontalPadding", "--tp-blade-horizontal-padding"],
  ["bladeValueWidth", "--tp-blade-value-width"],
  ["buttonBackgroundColor", "--tp-button-background-color"],
  ["buttonBackgroundColorActive", "--tp-button-background-color-active"],
  ["buttonBackgroundColorFocus", "--tp-button-background-color-focus"],
  ["buttonBackgroundColorHover", "--tp-button-background-color-hover"],
  ["buttonForegroundColor", "--tp-button-foreground-color"],
  ["containerBackgroundColor", "--tp-container-background-color"],
  ["containerBackgroundColorActive", "--tp-container-background-color-active"],
  ["containerBackgroundColorFocus", "--tp-container-background-color-focus"],
  ["containerBackgroundColorHover", "--tp-container-background-color-hover"],
  ["containerForegroundColor", "--tp-container-foreground-color"],
  ["containerHorizontalPadding", "--tp-container-horizontal-padding"],
  ["containerUnitSize", "--tp-container-unit-size"],
  ["containerUnitSpacing", "--tp-container-unit-spacing"],
  ["containerVerticalPadding", "--tp-container-vertical-padding"],
  ["grooveForegroundColor", "--tp-groove-foreground-color"],
  ["inputBackgroundColor", "--tp-input-background-color"],
  ["inputBackgroundColorActive", "--tp-input-background-color-active"],
  ["inputBackgroundColorFocus", "--tp-input-background-color-focus"],
  ["inputBackgroundColorHover", "--tp-input-background-color-hover"],
  ["inputForegroundColor", "--tp-input-foreground-color"],
  ["labelForegroundColor", "--tp-label-foreground-color"],
  ["monitorBackgroundColor", "--tp-monitor-background-color"],
  ["monitorForegroundColor", "--tp-monitor-foreground-color"],
  // Plugins
  ["pluginImageDraggingColor", "--tp-plugin-image-dragging-color"]
  // ['pluginThumbnailListHeight', '--tp-plugin-thumbnail-list-height'],
  // ['pluginThumbnailListThumbSize', '--tp-plugin-thumbnail-list-thumb-size'],
  // ['pluginThumbnailListWidth', '--tp-plugin-thumbnail-list-width']
]);
function stringToCssValue(v) {
  if (v === void 0) {
    return void 0;
  }
  if (typeof v === "string") {
    return v;
  }
  if (isRgbaColorObject(v)) {
    return `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`;
  }
  if (isRgbColorObject(v)) {
    return `rgb(${v.r}, ${v.g}, ${v.b})`;
  }
}
function expandVariableKey(name) {
  if (name.startsWith("--tp-")) {
    return name;
  }
  const variableName = keyToCssVariableMap.get(name);
  if (variableName) {
    return variableName;
  }
  throw new Error(`Unknown Tweakpane CSS theme map variable key: "${name}"`);
}
function getValueOrFallback(theme, key2) {
  return theme?.[key2] === void 0 ? stringToCssValue(standard[key2]) : stringToCssValue(theme[key2]);
}
function applyTheme(element, theme) {
  const rootDocument = getWindowDocument().documentElement;
  if (theme === void 0) {
    for (const k of Object.keys(standard)) {
      const key2 = expandVariableKey(k);
      if (element.style.getPropertyValue(key2).length > 0) {
        element.style.removeProperty(key2);
      }
    }
  } else {
    for (const [k, v] of Object.entries(theme)) {
      const key2 = expandVariableKey(k);
      const value = stringToCssValue(v);
      const standardValue = standard[k] || void 0;
      const rootValue = rootDocument.style.getPropertyValue(key2) || void 0;
      const isDeviationFromRoot = (rootValue && value !== rootValue) ?? false;
      const isDeviationFromStandard = (standardValue && value !== standardValue) ?? false;
      if (theme !== void 0 && value !== void 0 && (isDeviationFromRoot || !rootValue && isDeviationFromStandard)) {
        element.style.setProperty(key2, value);
      } else if (element.style.getPropertyValue(key2).length > 0) {
        element.style.removeProperty(key2);
      }
    }
  }
}
function getPixelValue(s) {
  return Number.parseFloat(s.replace("px", ""));
}
const ClsPad = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let total;
  let { theme = void 0 } = $$props;
  let { keysAdd = [] } = $$props;
  let { keysSubtract = [] } = $$props;
  let { extra = void 0 } = $$props;
  function getTotal(add, sub, extra2 = 0) {
    return add.reduce((acc, key2) => acc += getPixelValue(getValueOrFallback(theme, key2)), 0) - sub.reduce((acc, key2) => acc += getPixelValue(getValueOrFallback(theme, key2)), 0) + extra2;
  }
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
  if ($$props.keysAdd === void 0 && $$bindings.keysAdd && keysAdd !== void 0) $$bindings.keysAdd(keysAdd);
  if ($$props.keysSubtract === void 0 && $$bindings.keysSubtract && keysSubtract !== void 0) $$bindings.keysSubtract(keysSubtract);
  if ($$props.extra === void 0 && $$bindings.extra && extra !== void 0) $$bindings.extra(extra);
  total = getTotal(keysAdd, keysSubtract, extra);
  return `${total > 0 ? `<div${add_styles({
    "background": null,
    "height": `${total}px`
  })}></div>` : ``}`;
});
function isRootPane(container) {
  return container.constructor.name === "Pane";
}
function removeKeys(object, ...keys) {
  for (const key2 of keys) {
    if (key2 in object) {
      delete object[key2];
    }
  }
  return object;
}
function clickBlocker(event) {
  if (event.isTrusted) event.stopPropagation();
}
function updateCollapsibility(isUserExpandableEnabled, element, titleBarClass, iconClass) {
  if (element) {
    const titleBarElement = element.querySelector(`.${titleBarClass}`);
    if (titleBarElement) {
      const iconElement = iconClass ? element.querySelector(`.${iconClass}`) : void 0;
      if (isUserExpandableEnabled) {
        titleBarElement.removeEventListener("click", clickBlocker, { capture: true });
        titleBarElement.style.cursor = "pointer";
        if (iconElement) iconElement.style.display = "block";
      } else {
        titleBarElement.addEventListener("click", clickBlocker, { capture: true });
        titleBarElement.style.cursor = "default";
        if (iconElement) iconElement.style.display = "none";
      }
    }
  } else {
    console.warn(`Title bar element not found with class "${titleBarClass}"`);
  }
}
const css$2 = {
  code: "div.svelte-tweakpane-ui div.tp-lblv_l{overflow:hidden;padding-right:var(--cnt-hp);text-overflow:ellipsis}div.svelte-tweakpane-ui div.tp-rotv_t{overflow:hidden;text-overflow:ellipsis}",
  map: `{"version":3,"file":"GenericPane.svelte","sources":["GenericPane.svelte"],"sourcesContent":["<script>\\n\\timport ClsPad from './ClsPad.svelte';\\n\\timport { applyTheme } from '../theme.js';\\n\\timport { updateCollapsibility } from '../utils.js';\\n\\timport { BROWSER } from 'esm-env';\\n\\timport { getContext, onDestroy, setContext, tick } from 'svelte';\\n\\timport { writable } from 'svelte/store';\\n\\timport { Pane as TpPane } from 'tweakpane';\\n\\texport let title = void 0;\\n\\texport let userExpandable = true;\\n\\texport let expanded = true;\\n\\texport let theme = void 0;\\n\\texport let scale = 1;\\n\\texport let userCreatedPane = true;\\n\\texport let tpPane = void 0;\\n\\tconst parentStore = writable();\\n\\tconst existingParentStore = getContext('parentStore');\\n\\tlet pluginsRegistered = [];\\n\\tconst registerPlugin = (plugin) => {\\n\\t\\tif (tpPane === void 0) {\\n\\t\\t\\tconsole.warn(\`tpPane is undefined, failed to register plugin \\"\${plugin.id}\\"\`);\\n\\t\\t} else if (!pluginsRegistered.includes(plugin.id)) {\\n\\t\\t\\ttpPane?.registerPlugin(plugin);\\n\\t\\t\\tpluginsRegistered.push(plugin.id);\\n\\t\\t}\\n\\t};\\n\\tsetContext('registerPlugin', registerPlugin);\\n\\tsetContext('userCreatedPane', userCreatedPane);\\n\\tif ($existingParentStore !== void 0) {\\n\\t\\tconsole.warn('<Panes> must not be nested');\\n\\t}\\n\\tif (BROWSER) {\\n\\t\\t$parentStore = new TpPane({ expanded, title });\\n\\t\\t$parentStore.on('fold', () => {\\n\\t\\t\\tif ($parentStore.expanded !== void 0 && expanded !== $parentStore.expanded) {\\n\\t\\t\\t\\texpanded = $parentStore.expanded;\\n\\t\\t\\t}\\n\\t\\t});\\n\\t\\ttpPane = $parentStore;\\n\\t\\tsetContext('parentStore', parentStore);\\n\\t\\tonDestroy(() => {\\n\\t\\t\\t$parentStore.dispose();\\n\\t\\t});\\n\\t} else {\\n\\t\\tsetContext('parentStore', writable(true));\\n\\t}\\n\\tfunction setScale(scale2) {\\n\\t\\tif (tpPane) {\\n\\t\\t\\tif (scale2 === 1) {\\n\\t\\t\\t\\ttpPane.element.style.removeProperty('transform-origin');\\n\\t\\t\\t\\ttpPane.element.style.removeProperty('transform');\\n\\t\\t\\t\\ttpPane.element.style.removeProperty('width');\\n\\t\\t\\t} else {\\n\\t\\t\\t\\tconst clampedScale = Math.max(0, scale2);\\n\\t\\t\\t\\ttpPane.element.style.transformOrigin = '0 0';\\n\\t\\t\\t\\ttpPane.element.style.transform = \`scale(\${clampedScale})\`;\\n\\t\\t\\t\\ttpPane.element.style.width = \`\${100 / clampedScale}%\`;\\n\\t\\t\\t}\\n\\t\\t}\\n\\t}\\n\\tfunction updateExpanded(expanded2) {\\n\\t\\tvoid tick().then(() => {\\n\\t\\t\\tif (tpPane?.expanded !== void 0 && expanded2 !== void 0 && tpPane.expanded !== expanded2) {\\n\\t\\t\\t\\ttpPane.expanded = expanded2;\\n\\t\\t\\t}\\n\\t\\t});\\n\\t}\\n\\t$: tpPane?.element && tpPane?.element.classList.add('svelte-tweakpane-ui');\\n\\t$: tpPane && setScale(scale);\\n\\t$: tpPane && updateCollapsibility(userExpandable, tpPane.element, 'tp-rotv_b', 'tp-rotv_m');\\n\\t$: tpPane && title !== void 0 && (tpPane.title = title.length > 0 ? title : ' ');\\n\\t$: tpPane && applyTheme(tpPane.element, theme);\\n\\t$: tpPane && updateExpanded(expanded);\\n<\/script>\\n\\n{#if BROWSER}\\n\\t<slot />\\n{:else if expanded}\\n\\t{#if title === undefined}\\n\\t\\t<ClsPad keysAdd={['containerVerticalPadding']} {theme} />\\n\\t{:else}\\n\\t\\t<ClsPad\\n\\t\\t\\tkeysAdd={[\\n\\t\\t\\t\\t'containerVerticalPadding',\\n\\t\\t\\t\\t'containerVerticalPadding',\\n\\t\\t\\t\\t'containerVerticalPadding',\\n\\t\\t\\t\\t'containerUnitSize'\\n\\t\\t\\t]}\\n\\t\\t\\t{theme}\\n\\t\\t/>\\n\\t{/if}\\n\\t<slot />\\n{:else if title === undefined}\\n\\t<!-- Nothing renders -->\\n{:else}\\n\\t<ClsPad keysAdd={['containerVerticalPadding', 'containerUnitSize']} {theme} />\\n{/if}\\n\\n<style>\\n\\t/* Blade labels */\\n\\t:global(div.svelte-tweakpane-ui div.tp-lblv_l) {\\n\\t\\toverflow: hidden;\\n\\t\\tpadding-right: var(--cnt-hp);\\n\\t\\ttext-overflow: ellipsis;\\n\\t}\\n\\n\\t/* Pane title label */\\n\\t:global(div.svelte-tweakpane-ui div.tp-rotv_t) {\\n\\t\\toverflow: hidden;\\n\\t\\ttext-overflow: ellipsis;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAoGS,qCAAuC,CAC9C,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,IAAI,QAAQ,CAAC,CAC5B,aAAa,CAAE,QAChB,CAGQ,qCAAuC,CAC9C,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAChB"}`
};
const GenericPane = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_parentStore;
  let $existingParentStore, $$unsubscribe_existingParentStore;
  let { title = void 0 } = $$props;
  let { userExpandable = true } = $$props;
  let { expanded = true } = $$props;
  let { theme = void 0 } = $$props;
  let { scale = 1 } = $$props;
  let { userCreatedPane = true } = $$props;
  let { tpPane = void 0 } = $$props;
  const parentStore = writable();
  $$unsubscribe_parentStore = subscribe(parentStore, (value) => value);
  const existingParentStore = getContext("parentStore");
  $$unsubscribe_existingParentStore = subscribe(existingParentStore, (value) => $existingParentStore = value);
  let pluginsRegistered = [];
  const registerPlugin = (plugin) => {
    if (tpPane === void 0) {
      console.warn(`tpPane is undefined, failed to register plugin "${plugin.id}"`);
    } else if (!pluginsRegistered.includes(plugin.id)) {
      tpPane?.registerPlugin(plugin);
      pluginsRegistered.push(plugin.id);
    }
  };
  setContext("registerPlugin", registerPlugin);
  setContext("userCreatedPane", userCreatedPane);
  if ($existingParentStore !== void 0) {
    console.warn("<Panes> must not be nested");
  }
  {
    setContext("parentStore", writable(true));
  }
  function setScale(scale2) {
    if (tpPane) {
      if (scale2 === 1) {
        tpPane.element.style.removeProperty("transform-origin");
        tpPane.element.style.removeProperty("transform");
        tpPane.element.style.removeProperty("width");
      } else {
        const clampedScale = Math.max(0, scale2);
        tpPane.element.style.transformOrigin = "0 0";
        tpPane.element.style.transform = `scale(${clampedScale})`;
        tpPane.element.style.width = `${100 / clampedScale}%`;
      }
    }
  }
  function updateExpanded(expanded2) {
    void tick().then(() => {
      if (tpPane?.expanded !== void 0 && expanded2 !== void 0 && tpPane.expanded !== expanded2) {
        tpPane.expanded = expanded2;
      }
    });
  }
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.userExpandable === void 0 && $$bindings.userExpandable && userExpandable !== void 0) $$bindings.userExpandable(userExpandable);
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded !== void 0) $$bindings.expanded(expanded);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0) $$bindings.scale(scale);
  if ($$props.userCreatedPane === void 0 && $$bindings.userCreatedPane && userCreatedPane !== void 0) $$bindings.userCreatedPane(userCreatedPane);
  if ($$props.tpPane === void 0 && $$bindings.tpPane && tpPane !== void 0) $$bindings.tpPane(tpPane);
  $$result.css.add(css$2);
  tpPane && title !== void 0 && (tpPane.title = title.length > 0 ? title : " ");
  tpPane?.element && tpPane?.element.classList.add("svelte-tweakpane-ui");
  tpPane && setScale(scale);
  tpPane && updateCollapsibility(userExpandable, tpPane.element, "tp-rotv_b", "tp-rotv_m");
  tpPane && applyTheme(tpPane.element, theme);
  tpPane && updateExpanded(expanded);
  $$unsubscribe_parentStore();
  $$unsubscribe_existingParentStore();
  return `${`${expanded ? `${title === void 0 ? `${validate_component(ClsPad, "ClsPad").$$render(
    $$result,
    {
      keysAdd: ["containerVerticalPadding"],
      theme
    },
    {},
    {}
  )}` : `${validate_component(ClsPad, "ClsPad").$$render(
    $$result,
    {
      keysAdd: [
        "containerVerticalPadding",
        "containerVerticalPadding",
        "containerVerticalPadding",
        "containerUnitSize"
      ],
      theme
    },
    {},
    {}
  )}`} ${slots.default ? slots.default({}) : ``}` : `${title === void 0 ? `` : `${validate_component(ClsPad, "ClsPad").$$render(
    $$result,
    {
      keysAdd: ["containerVerticalPadding", "containerUnitSize"],
      theme
    },
    {},
    {}
  )}`}`}`}`;
});
const InternalPaneInline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["expanded", "width", "tpPane", "theme"]);
  let { expanded = void 0 } = $$props;
  let { width = void 0 } = $$props;
  let { tpPane = void 0 } = $$props;
  let { theme = {
    baseBorderRadius: "0px",
    baseShadowColor: "hsla(0, 0%, 0%, 0)"
  } } = $$props;
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded !== void 0) $$bindings.expanded(expanded);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
  if ($$props.tpPane === void 0 && $$bindings.tpPane && tpPane !== void 0) $$bindings.tpPane(tpPane);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div${add_styles({
      "width": width === void 0 ? null : `${width}px`
    })}${add_attribute()}>${validate_component(GenericPane, "GenericPane").$$render(
      $$result,
      Object.assign({}, { theme }, removeKeys($$restProps, "position"), { expanded }, { tpPane }),
      {
        expanded: ($$value) => {
          expanded = $$value;
          $$settled = false;
        },
        tpPane: ($$value) => {
          tpPane = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $parentStore, $$unsubscribe_parentStore;
  let { title = "Button" } = $$props;
  let { label = void 0 } = $$props;
  let { disabled = false } = $$props;
  let { theme = void 0 } = $$props;
  const parentStore = getContext("parentStore");
  $$unsubscribe_parentStore = subscribe(parentStore, (value) => $parentStore = value);
  const userCreatedPane = getContext("userCreatedPane");
  createEventDispatcher();
  onDestroy(() => {
  });
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
  theme && $parentStore && (userCreatedPane || !isRootPane($parentStore)) && console.warn("Set theme on the <Pane> component, not on its children! (Check nested <Button> components for a theme prop.)");
  $$unsubscribe_parentStore();
  return `${parentStore ? `${`${validate_component(ClsPad, "ClsPad").$$render(
    $$result,
    {
      keysAdd: ["containerUnitSize", "containerVerticalPadding"],
      theme
    },
    {},
    {}
  )}`}` : `${validate_component(InternalPaneInline, "InternalPaneInline").$$render($$result, { theme, userCreatedPane: false }, {}, {
    default: () => {
      return `${validate_component(Button, "svelte:self").$$render($$result, { disabled, label, title }, {}, {})}`;
    }
  })}`}`;
});
class ButtonCellApi {
  constructor(controller) {
    this.controller_ = controller;
  }
  get disabled() {
    return this.controller_.viewProps.get("disabled");
  }
  set disabled(disabled) {
    this.controller_.viewProps.set("disabled", disabled);
  }
  get title() {
    var _a;
    return (_a = this.controller_.props.get("title")) !== null && _a !== void 0 ? _a : "";
  }
  set title(title) {
    this.controller_.props.set("title", title);
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    const emitter = this.controller_.emitter;
    emitter.on(eventName, () => {
      bh(new TpEvent(this));
    });
    return this;
  }
}
class TpButtonGridEvent extends TpEvent {
  constructor(target, cell, index) {
    super(target);
    this.cell = cell;
    this.index = index;
  }
}
class ButtonGridApi extends BladeApi {
  constructor(controller) {
    super(controller);
    this.cellToApiMap_ = /* @__PURE__ */ new Map();
    this.emitter_ = new Emitter();
    const gc = this.controller.valueController;
    gc.cellControllers.forEach((cc, i) => {
      const api = new ButtonCellApi(cc);
      this.cellToApiMap_.set(cc, api);
      cc.emitter.on("click", () => {
        const x = i % gc.size[0];
        const y2 = Math.floor(i / gc.size[0]);
        this.emitter_.emit("click", {
          event: new TpButtonGridEvent(this, api, [x, y2])
        });
      });
    });
  }
  cell(x, y2) {
    const gc = this.controller.valueController;
    const cc = gc.cellControllers[y2 * gc.size[0] + x];
    return this.cellToApiMap_.get(cc);
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.emitter_.on(eventName, (ev) => {
      bh(ev.event);
    });
    return this;
  }
}
class ButtonGridController {
  constructor(doc, config) {
    this.size = config.size;
    const [w, h] = this.size;
    const bcs = [];
    for (let y2 = 0; y2 < h; y2++) {
      for (let x = 0; x < w; x++) {
        const bc = new ButtonController(doc, {
          props: ValueMap.fromObject(Object.assign({}, config.cellConfig(x, y2))),
          viewProps: ViewProps.create()
        });
        bcs.push(bc);
      }
    }
    this.cellCs_ = bcs;
    this.viewProps = ViewProps.create();
    this.viewProps.handleDispose(() => {
      this.cellCs_.forEach((c) => {
        c.viewProps.set("disposed", true);
      });
    });
    this.view = new PlainView(doc, {
      viewProps: this.viewProps,
      viewName: "btngrid"
    });
    this.view.element.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    this.cellCs_.forEach((bc) => {
      this.view.element.appendChild(bc.view.element);
    });
  }
  get cellControllers() {
    return this.cellCs_;
  }
}
class ButtonGridBladeController extends BladeController {
  constructor(doc, config) {
    const bc = config.valueController;
    const lc = new LabelController(doc, {
      blade: config.blade,
      props: config.labelProps,
      valueController: bc
    });
    super({
      blade: config.blade,
      view: lc.view,
      viewProps: bc.viewProps
    });
    this.valueController = bc;
    this.labelController = lc;
  }
}
createPlugin({
  id: "buttongrid",
  type: "blade",
  accept(params) {
    const result = parseRecord(params, (p) => ({
      cells: p.required.function,
      size: p.required.array(p.required.number),
      view: p.required.constant("buttongrid"),
      label: p.optional.string
    }));
    return result ? { params: result } : null;
  },
  controller(args) {
    return new ButtonGridBladeController(args.document, {
      blade: args.blade,
      labelProps: ValueMap.fromObject({
        label: args.params.label
      }),
      valueController: new ButtonGridController(args.document, {
        cellConfig: args.params.cells,
        size: args.params.size
      })
    });
  },
  api(args) {
    if (args.controller instanceof ButtonGridBladeController) {
      return new ButtonGridApi(args.controller);
    }
    return null;
  }
});
class CubicBezierApi extends BladeApi {
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(label) {
    this.controller.labelController.props.set("label", label);
  }
  get value() {
    return this.controller.valueController.value.rawValue;
  }
  set value(value) {
    this.controller.valueController.value.rawValue = value;
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.controller.valueController.value.emitter.on(eventName, (ev) => {
      bh(new TpChangeEvent(this, ev.rawValue, ev.options.last));
    });
    return this;
  }
}
function interpolate(x1, x2, t) {
  return x1 * (1 - t) + x2 * t;
}
const MAX_ITERATION = 20;
const X_DELTA = 1e-3;
const CACHE_RESOLUTION = 100;
function y(cb, x) {
  let dt2 = 0.25;
  let t = 0.5;
  let y2 = -1;
  for (let i = 0; i < MAX_ITERATION; i++) {
    const [tx, ty] = cb.curve(t);
    t += dt2 * (tx < x ? 1 : -1);
    y2 = ty;
    dt2 *= 0.5;
    if (Math.abs(x - tx) < X_DELTA) {
      break;
    }
  }
  return y2;
}
class CubicBezier {
  constructor(x1 = 0, y1 = 0, x2 = 1, y2 = 1) {
    this.cache_ = [];
    this.comps_ = [x1, y1, x2, y2];
  }
  get x1() {
    return this.comps_[0];
  }
  get y1() {
    return this.comps_[1];
  }
  get x2() {
    return this.comps_[2];
  }
  get y2() {
    return this.comps_[3];
  }
  static isObject(obj) {
    if (isEmpty(obj)) {
      return false;
    }
    if (!Array.isArray(obj)) {
      return false;
    }
    return typeof obj[0] === "number" && typeof obj[1] === "number" && typeof obj[2] === "number" && typeof obj[3] === "number";
  }
  static equals(v1, v2) {
    return v1.x1 === v2.x1 && v1.y1 === v2.y1 && v1.x2 === v2.x2 && v1.y2 === v2.y2;
  }
  curve(t) {
    const x01 = interpolate(0, this.x1, t);
    const y01 = interpolate(0, this.y1, t);
    const x12 = interpolate(this.x1, this.x2, t);
    const y12 = interpolate(this.y1, this.y2, t);
    const x23 = interpolate(this.x2, 1, t);
    const y23 = interpolate(this.y2, 1, t);
    const xr0 = interpolate(x01, x12, t);
    const yr0 = interpolate(y01, y12, t);
    const xr1 = interpolate(x12, x23, t);
    const yr1 = interpolate(y12, y23, t);
    return [interpolate(xr0, xr1, t), interpolate(yr0, yr1, t)];
  }
  y(x) {
    if (this.cache_.length === 0) {
      const cache = [];
      for (let i = 0; i < CACHE_RESOLUTION; i++) {
        cache.push(y(this, mapRange(i, 0, CACHE_RESOLUTION - 1, 0, 1)));
      }
      this.cache_ = cache;
    }
    return this.cache_[Math.round(mapRange(constrainRange(x, 0, 1), 0, 1, 0, CACHE_RESOLUTION - 1))];
  }
  toObject() {
    return [this.comps_[0], this.comps_[1], this.comps_[2], this.comps_[3]];
  }
}
const CubicBezierAssembly = {
  toComponents: (p) => p.toObject(),
  fromComponents: (comps) => new CubicBezier(...comps)
};
function cubicBezierToString(cb) {
  const formatter = createNumberFormatter(2);
  const comps = cb.toObject().map((c) => formatter(c));
  return `cubic-bezier(${comps.join(", ")})`;
}
const COMPS_EMPTY = [0, 0.5, 0.5, 1];
function cubicBezierFromString(text) {
  const m = text.match(/^cubic-bezier\s*\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)$/);
  if (!m) {
    return new CubicBezier(...COMPS_EMPTY);
  }
  const comps = [m[1], m[2], m[3], m[4]].reduce((comps2, comp) => {
    if (!comps2) {
      return null;
    }
    const n = Number(comp);
    if (isNaN(n)) {
      return null;
    }
    return [...comps2, n];
  }, []);
  return new CubicBezier(...comps !== null && comps !== void 0 ? comps : COMPS_EMPTY);
}
const className$7 = ClassName("cbz");
class CubicBezierView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$7());
    config.viewProps.bindClassModifiers(this.element);
    config.foldable.bindExpandedClass(this.element, className$7(void 0, "expanded"));
    bindValueMap(config.foldable, "completed", valueToClassName(this.element, className$7(void 0, "cpl")));
    const headElem = doc.createElement("div");
    headElem.classList.add(className$7("h"));
    this.element.appendChild(headElem);
    const buttonElem = doc.createElement("button");
    buttonElem.classList.add(className$7("b"));
    config.viewProps.bindDisabled(buttonElem);
    const iconElem = doc.createElementNS(SVG_NS, "svg");
    iconElem.innerHTML = '<path d="M2 13C8 13 8 3 14 3"/>';
    buttonElem.appendChild(iconElem);
    headElem.appendChild(buttonElem);
    this.buttonElement = buttonElem;
    const textElem = doc.createElement("div");
    textElem.classList.add(className$7("t"));
    headElem.appendChild(textElem);
    this.textElement = textElem;
    if (config.pickerLayout === "inline") {
      const pickerElem = doc.createElement("div");
      pickerElem.classList.add(className$7("p"));
      this.element.appendChild(pickerElem);
      this.pickerElement = pickerElem;
    } else {
      this.pickerElement = null;
    }
  }
}
const className$6$1 = ClassName("cbzp");
class CubicBezierPickerView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$6$1());
    config.viewProps.bindClassModifiers(this.element);
    const graphElem = doc.createElement("div");
    graphElem.classList.add(className$6$1("g"));
    this.element.appendChild(graphElem);
    this.graphElement = graphElem;
    const textElem = doc.createElement("div");
    textElem.classList.add(className$6$1("t"));
    this.element.appendChild(textElem);
    this.textElement = textElem;
  }
}
function waitToBeAddedToDom(elem, callback) {
  const ob = new MutationObserver((ml) => {
    for (const m of ml) {
      if (m.type !== "childList") {
        continue;
      }
      m.addedNodes.forEach((elem2) => {
        if (!elem2.contains(elem2)) {
          return;
        }
        callback();
        ob.disconnect();
      });
    }
  });
  const doc = elem.ownerDocument;
  ob.observe(doc.body, {
    attributes: true,
    childList: true,
    subtree: true
  });
}
const className$5$1 = ClassName("cbzg");
function compose(h1, h2) {
  return (input) => h2(h1(input));
}
class CubicBezierGraphView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$5$1());
    config.viewProps.bindClassModifiers(this.element);
    config.viewProps.bindTabIndex(this.element);
    const previewElem = doc.createElement("div");
    previewElem.classList.add(className$5$1("p"));
    this.element.appendChild(previewElem);
    this.previewElement = previewElem;
    const svgElem = doc.createElementNS(SVG_NS, "svg");
    svgElem.classList.add(className$5$1("g"));
    this.element.appendChild(svgElem);
    this.svgElem_ = svgElem;
    const guideElem = doc.createElementNS(SVG_NS, "path");
    guideElem.classList.add(className$5$1("u"));
    this.svgElem_.appendChild(guideElem);
    this.guideElem_ = guideElem;
    const lineElem = doc.createElementNS(SVG_NS, "polyline");
    lineElem.classList.add(className$5$1("l"));
    this.svgElem_.appendChild(lineElem);
    this.lineElem_ = lineElem;
    this.handleElems_ = [doc.createElement("div"), doc.createElement("div")];
    this.handleElems_.forEach((elem) => {
      elem.classList.add(className$5$1("h"));
      this.element.appendChild(elem);
    });
    this.vectorElems_ = [
      doc.createElementNS(SVG_NS, "line"),
      doc.createElementNS(SVG_NS, "line")
    ];
    this.vectorElems_.forEach((elem) => {
      elem.classList.add(className$5$1("v"));
      this.svgElem_.appendChild(elem);
    });
    this.value_ = config.value;
    this.value_.emitter.on("change", this.onValueChange_.bind(this));
    this.sel_ = config.selection;
    this.handleElems_.forEach((elem, index) => {
      bindValue(this.sel_, compose((selection) => selection === index, valueToClassName(elem, className$5$1("h", "sel"))));
    });
    waitToBeAddedToDom(this.element, () => {
      this.refresh();
    });
  }
  getVertMargin_(h) {
    return h * 0.25;
  }
  valueToPosition(x, y2) {
    const { clientWidth: w, clientHeight: h } = this.element;
    const vm = this.getVertMargin_(h);
    return {
      x: mapRange(x, 0, 1, 0, w),
      y: mapRange(y2, 0, 1, h - vm, vm)
    };
  }
  positionToValue(x, y2) {
    const bounds = this.element.getBoundingClientRect();
    const w = bounds.width;
    const h = bounds.height;
    const vm = this.getVertMargin_(h);
    return {
      x: constrainRange(mapRange(x, 0, w, 0, 1), 0, 1),
      y: mapRange(y2, h - vm, vm, 0, 1)
    };
  }
  refresh() {
    this.guideElem_.setAttributeNS(null, "d", [0, 1].map((index) => {
      const p1 = this.valueToPosition(0, index);
      const p2 = this.valueToPosition(1, index);
      return [`M ${p1.x},${p1.y}`, `L ${p2.x},${p2.y}`].join(" ");
    }).join(" "));
    const bezier = this.value_.rawValue;
    const points = [];
    let t = 0;
    for (; ; ) {
      const p = this.valueToPosition(...bezier.curve(t));
      points.push([p.x, p.y].join(","));
      if (t >= 1) {
        break;
      }
      t = Math.min(t + 0.05, 1);
    }
    this.lineElem_.setAttributeNS(null, "points", points.join(" "));
    const obj = bezier.toObject();
    [0, 1].forEach((index) => {
      const p1 = this.valueToPosition(index, index);
      const p2 = this.valueToPosition(obj[index * 2], obj[index * 2 + 1]);
      const vElem = this.vectorElems_[index];
      vElem.setAttributeNS(null, "x1", String(p1.x));
      vElem.setAttributeNS(null, "y1", String(p1.y));
      vElem.setAttributeNS(null, "x2", String(p2.x));
      vElem.setAttributeNS(null, "y2", String(p2.y));
      const hElem = this.handleElems_[index];
      hElem.style.left = `${p2.x}px`;
      hElem.style.top = `${p2.y}px`;
    });
  }
  onValueChange_() {
    this.refresh();
  }
}
const TICK_COUNT = 24;
const PREVIEW_DELAY = 400;
const PREVIEW_DURATION = 1e3;
const className$4$1 = ClassName("cbzprv");
class CubicBezierPreviewView {
  constructor(doc, config) {
    this.stopped_ = true;
    this.startTime_ = -1;
    this.requestId_ = -1;
    this.onDispose_ = this.onDispose_.bind(this);
    this.onTimer_ = this.onTimer_.bind(this);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.element = doc.createElement("div");
    this.element.classList.add(className$4$1());
    config.viewProps.bindClassModifiers(this.element);
    const svgElem = doc.createElementNS(SVG_NS, "svg");
    svgElem.classList.add(className$4$1("g"));
    this.element.appendChild(svgElem);
    this.svgElem_ = svgElem;
    const ticksElem = doc.createElementNS(SVG_NS, "path");
    ticksElem.classList.add(className$4$1("t"));
    this.svgElem_.appendChild(ticksElem);
    this.ticksElem_ = ticksElem;
    const markerElem = doc.createElement("div");
    markerElem.classList.add(className$4$1("m"));
    this.element.appendChild(markerElem);
    this.markerElem_ = markerElem;
    this.value_ = config.value;
    this.value_.emitter.on("change", this.onValueChange_);
    config.viewProps.handleDispose(this.onDispose_);
    waitToBeAddedToDom(this.element, () => {
      this.refresh();
    });
  }
  play() {
    this.stop();
    this.updateMarker_(0);
    this.markerElem_.classList.add(className$4$1("m", "a"));
    this.startTime_ = (/* @__PURE__ */ new Date()).getTime() + PREVIEW_DELAY;
    this.stopped_ = false;
    this.requestId_ = requestAnimationFrame(this.onTimer_);
  }
  stop() {
    cancelAnimationFrame(this.requestId_);
    this.stopped_ = true;
    this.markerElem_.classList.remove(className$4$1("m", "a"));
  }
  onDispose_() {
    this.stop();
  }
  updateMarker_(progress) {
    const p = this.value_.rawValue.y(constrainRange(progress, 0, 1));
    this.markerElem_.style.left = `${p * 100}%`;
  }
  refresh() {
    const { clientWidth: w, clientHeight: h } = this.svgElem_;
    const ds = [];
    const bezier = this.value_.rawValue;
    for (let i = 0; i < TICK_COUNT; i++) {
      const px = mapRange(i, 0, TICK_COUNT - 1, 0, 1);
      const x = mapRange(bezier.y(px), 0, 1, 0, w);
      ds.push(`M ${x},0 v${h}`);
    }
    this.ticksElem_.setAttributeNS(null, "d", ds.join(" "));
  }
  onTimer_() {
    if (this.startTime_ === null) {
      return;
    }
    const dt2 = (/* @__PURE__ */ new Date()).getTime() - this.startTime_;
    const p = dt2 / PREVIEW_DURATION;
    this.updateMarker_(p);
    if (dt2 > PREVIEW_DURATION + PREVIEW_DELAY) {
      this.stop();
    }
    if (!this.stopped_) {
      this.requestId_ = requestAnimationFrame(this.onTimer_);
    }
  }
  onValueChange_() {
    this.refresh();
    this.play();
  }
}
function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
function lockAngle(x1, y1, x2, y2) {
  const d = getDistance(x1, y1, x2, y2);
  const a = Math.atan2(y2 - y1, x2 - x1);
  const la = Math.round(a / (Math.PI / 4)) * Math.PI / 4;
  return {
    x: x1 + Math.cos(la) * d,
    y: y1 + Math.sin(la) * d
  };
}
class CubicBezierGraphController {
  constructor(doc, config) {
    this.onKeyDown_ = this.onKeyDown_.bind(this);
    this.onKeyUp_ = this.onKeyUp_.bind(this);
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.keyScale_ = config.keyScale;
    this.value = config.value;
    this.sel_ = createValue(0);
    this.viewProps = config.viewProps;
    this.view = new CubicBezierGraphView(doc, {
      selection: this.sel_,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view.element.addEventListener("keydown", this.onKeyDown_);
    this.view.element.addEventListener("keyup", this.onKeyUp_);
    this.prevView_ = new CubicBezierPreviewView(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    this.prevView_.element.addEventListener("mousedown", (ev) => {
      ev.stopImmediatePropagation();
      ev.preventDefault();
      this.prevView_.play();
    });
    this.view.previewElement.appendChild(this.prevView_.element);
    const ptHandler = new PointerHandler(this.view.element);
    ptHandler.emitter.on("down", this.onPointerDown_);
    ptHandler.emitter.on("move", this.onPointerMove_);
    ptHandler.emitter.on("up", this.onPointerUp_);
  }
  refresh() {
    this.view.refresh();
    this.prevView_.refresh();
    this.prevView_.play();
  }
  updateValue_(point, locksAngle, opts) {
    const index = this.sel_.rawValue;
    const comps = this.value.rawValue.toObject();
    const vp = this.view.positionToValue(point.x, point.y);
    const v = locksAngle ? lockAngle(index, index, vp.x, vp.y) : vp;
    comps[index * 2] = v.x;
    comps[index * 2 + 1] = v.y;
    this.value.setRawValue(new CubicBezier(...comps), opts);
  }
  onPointerDown_(ev) {
    const data = ev.data;
    if (!data.point) {
      return;
    }
    const bezier = this.value.rawValue;
    const p1 = this.view.valueToPosition(bezier.x1, bezier.y1);
    const d1 = getDistance(data.point.x, data.point.y, p1.x, p1.y);
    const p2 = this.view.valueToPosition(bezier.x2, bezier.y2);
    const d2 = getDistance(data.point.x, data.point.y, p2.x, p2.y);
    this.sel_.rawValue = d1 <= d2 ? 0 : 1;
    this.updateValue_(data.point, ev.shiftKey, {
      forceEmit: false,
      last: false
    });
  }
  onPointerMove_(ev) {
    const data = ev.data;
    if (!data.point) {
      return;
    }
    this.updateValue_(data.point, ev.shiftKey, {
      forceEmit: false,
      last: false
    });
  }
  onPointerUp_(ev) {
    const data = ev.data;
    if (!data.point) {
      return;
    }
    this.updateValue_(data.point, ev.shiftKey, {
      forceEmit: true,
      last: true
    });
  }
  onKeyDown_(ev) {
    if (isArrowKey(ev.key)) {
      ev.preventDefault();
    }
    const index = this.sel_.rawValue;
    const comps = this.value.rawValue.toObject();
    const keyScale = this.keyScale_.rawValue;
    comps[index * 2] += getStepForKey(keyScale, getHorizontalStepKeys(ev));
    comps[index * 2 + 1] += getStepForKey(keyScale, getVerticalStepKeys(ev));
    this.value.setRawValue(new CubicBezier(...comps), {
      forceEmit: false,
      last: false
    });
  }
  onKeyUp_(ev) {
    if (isArrowKey(ev.key)) {
      ev.preventDefault();
    }
    const keyScale = this.keyScale_.rawValue;
    const xStep = getStepForKey(keyScale, getHorizontalStepKeys(ev));
    const yStep = getStepForKey(keyScale, getVerticalStepKeys(ev));
    if (xStep === 0 && yStep === 0) {
      return;
    }
    this.value.setRawValue(this.value.rawValue, {
      forceEmit: true,
      last: true
    });
  }
}
class CubicBezierPickerController {
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new CubicBezierPickerView(doc, {
      viewProps: this.viewProps
    });
    this.gc_ = new CubicBezierGraphController(doc, {
      keyScale: config.axis.textProps.value("keyScale"),
      value: this.value,
      viewProps: this.viewProps
    });
    this.view.graphElement.appendChild(this.gc_.view.element);
    const xAxis = Object.assign(Object.assign({}, config.axis), { constraint: new RangeConstraint({ max: 1, min: 0 }) });
    const yAxis = Object.assign(Object.assign({}, config.axis), { constraint: void 0 });
    this.tc_ = new PointNdTextController(doc, {
      assembly: CubicBezierAssembly,
      axes: [xAxis, yAxis, xAxis, yAxis],
      parser: parseNumber,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view.textElement.appendChild(this.tc_.view.element);
  }
  get allFocusableElements() {
    return [
      this.gc_.view.element,
      ...this.tc_.view.textViews.map((v) => v.inputElement)
    ];
  }
  refresh() {
    this.gc_.refresh();
  }
}
class CubicBezierController {
  constructor(doc, config) {
    this.onButtonBlur_ = this.onButtonBlur_.bind(this);
    this.onButtonClick_ = this.onButtonClick_.bind(this);
    this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
    this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.foldable_ = Foldable.create(config.expanded);
    this.view = new CubicBezierView(doc, {
      foldable: this.foldable_,
      pickerLayout: config.pickerLayout,
      viewProps: this.viewProps
    });
    this.view.buttonElement.addEventListener("blur", this.onButtonBlur_);
    this.view.buttonElement.addEventListener("click", this.onButtonClick_);
    this.tc_ = new TextController(doc, {
      parser: cubicBezierFromString,
      props: ValueMap.fromObject({
        formatter: cubicBezierToString
      }),
      value: this.value,
      viewProps: this.viewProps
    });
    this.view.textElement.appendChild(this.tc_.view.element);
    this.popC_ = config.pickerLayout === "popup" ? new PopupController(doc, {
      viewProps: this.viewProps
    }) : null;
    const pickerC = new CubicBezierPickerController(doc, {
      axis: config.axis,
      value: this.value,
      viewProps: this.viewProps
    });
    pickerC.allFocusableElements.forEach((elem) => {
      elem.addEventListener("blur", this.onPopupChildBlur_);
      elem.addEventListener("keydown", this.onPopupChildKeydown_);
    });
    this.pickerC_ = pickerC;
    if (this.popC_) {
      this.view.element.appendChild(this.popC_.view.element);
      this.popC_.view.element.appendChild(this.pickerC_.view.element);
      bindValue(this.popC_.shows, (shows) => {
        if (shows) {
          pickerC.refresh();
        }
      });
      connectValues({
        primary: this.foldable_.value("expanded"),
        secondary: this.popC_.shows,
        forward: (p) => p,
        backward: (_, s) => s
      });
    } else if (this.view.pickerElement) {
      this.view.pickerElement.appendChild(this.pickerC_.view.element);
      bindFoldable(this.foldable_, this.view.pickerElement);
    }
  }
  onButtonBlur_(ev) {
    if (!this.popC_) {
      return;
    }
    const nextTarget = forceCast(ev.relatedTarget);
    if (!nextTarget || !this.popC_.view.element.contains(nextTarget)) {
      this.popC_.shows.rawValue = false;
    }
  }
  onButtonClick_() {
    this.foldable_.set("expanded", !this.foldable_.get("expanded"));
    if (this.foldable_.get("expanded")) {
      this.pickerC_.allFocusableElements[0].focus();
    }
  }
  onPopupChildBlur_(ev) {
    if (!this.popC_) {
      return;
    }
    const elem = this.popC_.view.element;
    const nextTarget = findNextTarget(ev);
    if (nextTarget && elem.contains(nextTarget)) {
      return;
    }
    if (nextTarget && nextTarget === this.view.buttonElement && !supportsTouch(elem.ownerDocument)) {
      return;
    }
    this.popC_.shows.rawValue = false;
  }
  onPopupChildKeydown_(ev) {
    if (!this.popC_) {
      return;
    }
    if (ev.key === "Escape") {
      this.popC_.shows.rawValue = false;
    }
  }
}
function createConstraint$1() {
  return new PointNdConstraint({
    assembly: CubicBezierAssembly,
    components: [0, 1, 2, 3].map((index) => index % 2 === 0 ? new RangeConstraint({
      min: 0,
      max: 1
    }) : void 0)
  });
}
createPlugin({
  id: "cubicbezier",
  type: "blade",
  accept(params) {
    const result = parseRecord(params, (p) => ({
      value: p.required.array(p.required.number),
      view: p.required.constant("cubicbezier"),
      expanded: p.optional.boolean,
      label: p.optional.string,
      picker: p.optional.custom((v) => {
        return v === "inline" || v === "popup" ? v : void 0;
      })
    }));
    return result ? { params: result } : null;
  },
  controller(args) {
    var _a, _b;
    const rv = new CubicBezier(...args.params.value);
    const v = createValue(rv, {
      constraint: createConstraint$1(),
      equals: CubicBezier.equals
    });
    const vc = new CubicBezierController(args.document, {
      axis: {
        textProps: ValueMap.fromObject({
          keyScale: 0.1,
          pointerScale: 0.01,
          formatter: createNumberFormatter(2)
        })
      },
      expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
      pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
      value: v,
      viewProps: args.viewProps
    });
    return new LabeledValueBladeController(args.document, {
      blade: args.blade,
      props: ValueMap.fromObject({
        label: args.params.label
      }),
      value: v,
      valueController: vc
    });
  },
  api(args) {
    if (!(args.controller instanceof LabeledValueBladeController)) {
      return null;
    }
    if (!(args.controller.valueController instanceof CubicBezierController)) {
      return null;
    }
    return new CubicBezierApi(args.controller);
  }
});
class FpsGraphBladeApi extends BladeApi {
  get fps() {
    return this.controller.valueController.fps;
  }
  get max() {
    return this.controller.valueController.props.get("max");
  }
  set max(max) {
    this.controller.valueController.props.set("max", max);
  }
  get min() {
    return this.controller.valueController.props.get("min");
  }
  set min(min) {
    this.controller.valueController.props.set("min", min);
  }
  begin() {
    this.controller.valueController.begin();
  }
  end() {
    this.controller.valueController.end();
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    const emitter = this.controller.valueController.ticker.emitter;
    emitter.on(eventName, () => {
      bh(new TpEvent(this));
    });
    return this;
  }
}
const MAX_TIMESTAMPS = 20;
class Fpswatch {
  constructor() {
    this.start_ = null;
    this.duration_ = 0;
    this.fps_ = null;
    this.frameCount_ = 0;
    this.timestamps_ = [];
  }
  get duration() {
    return this.duration_;
  }
  get fps() {
    return this.fps_;
  }
  begin(now) {
    this.start_ = now.getTime();
  }
  calculateFps_(nowTime) {
    if (this.timestamps_.length === 0) {
      return null;
    }
    const ts = this.timestamps_[0];
    return 1e3 * (this.frameCount_ - ts.frameCount) / (nowTime - ts.time);
  }
  compactTimestamps_() {
    if (this.timestamps_.length <= MAX_TIMESTAMPS) {
      return;
    }
    const len = this.timestamps_.length - MAX_TIMESTAMPS;
    this.timestamps_.splice(0, len);
    const df = this.timestamps_[0].frameCount;
    this.timestamps_.forEach((ts) => {
      ts.frameCount -= df;
    });
    this.frameCount_ -= df;
  }
  end(now) {
    if (this.start_ === null) {
      return;
    }
    const t = now.getTime();
    this.duration_ = t - this.start_;
    this.start_ = null;
    this.fps_ = this.calculateFps_(t);
    this.timestamps_.push({
      frameCount: this.frameCount_,
      time: t
    });
    ++this.frameCount_;
    this.compactTimestamps_();
  }
}
const className$3$1 = ClassName("fps");
class FpsView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$3$1());
    config.viewProps.bindClassModifiers(this.element);
    this.graphElement = doc.createElement("div");
    this.graphElement.classList.add(className$3$1("g"));
    this.element.appendChild(this.graphElement);
    const labelElement = doc.createElement("div");
    labelElement.classList.add(className$3$1("l"));
    this.element.appendChild(labelElement);
    const valueElement = doc.createElement("span");
    valueElement.classList.add(className$3$1("v"));
    valueElement.textContent = "--";
    labelElement.appendChild(valueElement);
    this.valueElement = valueElement;
    const unitElement = doc.createElement("span");
    unitElement.classList.add(className$3$1("u"));
    unitElement.textContent = "FPS";
    labelElement.appendChild(unitElement);
  }
}
class FpsGraphController {
  constructor(doc, config) {
    this.stopwatch_ = new Fpswatch();
    this.onTick_ = this.onTick_.bind(this);
    this.ticker = config.ticker;
    this.ticker.emitter.on("tick", this.onTick_);
    this.props = config.props;
    this.value_ = config.value;
    this.viewProps = config.viewProps;
    this.view = new FpsView(doc, {
      viewProps: this.viewProps
    });
    this.graphC_ = new GraphLogController(doc, {
      formatter: createNumberFormatter(0),
      props: this.props,
      rows: config.rows,
      value: this.value_,
      viewProps: this.viewProps
    });
    this.view.graphElement.appendChild(this.graphC_.view.element);
    this.viewProps.handleDispose(() => {
      this.graphC_.viewProps.set("disposed", true);
      this.ticker.dispose();
    });
  }
  get fps() {
    return this.stopwatch_.fps;
  }
  begin() {
    this.stopwatch_.begin(/* @__PURE__ */ new Date());
  }
  end() {
    this.stopwatch_.end(/* @__PURE__ */ new Date());
  }
  onTick_() {
    const fps = this.fps;
    if (fps !== null) {
      const buffer = this.value_.rawValue;
      this.value_.rawValue = createPushedBuffer(buffer, fps);
      this.view.valueElement.textContent = fps.toFixed(0);
    }
  }
}
class FpsGraphBladeController extends BladeController {
  constructor(doc, config) {
    const fc = config.valueController;
    const lc = new LabelController(doc, {
      blade: config.blade,
      props: config.labelProps,
      valueController: fc
    });
    super({
      blade: config.blade,
      view: lc.view,
      viewProps: fc.viewProps
    });
    this.valueController = fc;
    this.labelController = lc;
  }
}
function createTicker$1(document2, interval) {
  return interval === 0 ? new ManualTicker() : new IntervalTicker(document2, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
}
createPlugin({
  id: "fpsgraph",
  type: "blade",
  accept(params) {
    const result = parseRecord(params, (p) => ({
      view: p.required.constant("fpsgraph"),
      interval: p.optional.number,
      label: p.optional.string,
      rows: p.optional.number,
      max: p.optional.number,
      min: p.optional.number
    }));
    return result ? { params: result } : null;
  },
  controller(args) {
    var _a, _b, _c, _d;
    const interval = (_a = args.params.interval) !== null && _a !== void 0 ? _a : 500;
    return new FpsGraphBladeController(args.document, {
      blade: args.blade,
      labelProps: ValueMap.fromObject({
        label: args.params.label
      }),
      valueController: new FpsGraphController(args.document, {
        props: ValueMap.fromObject({
          max: (_b = args.params.max) !== null && _b !== void 0 ? _b : 90,
          min: (_c = args.params.min) !== null && _c !== void 0 ? _c : 0
        }),
        rows: (_d = args.params.rows) !== null && _d !== void 0 ? _d : 2,
        ticker: createTicker$1(args.document, interval),
        value: createValue(initializeBuffer(80)),
        viewProps: args.viewProps
      })
    });
  },
  api(args) {
    if (!(args.controller instanceof FpsGraphBladeController)) {
      return null;
    }
    return new FpsGraphBladeApi(args.controller);
  }
});
class Interval {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }
  static isObject(obj) {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const min = obj.min;
    const max = obj.max;
    if (typeof min !== "number" || typeof max !== "number") {
      return false;
    }
    return true;
  }
  static equals(v1, v2) {
    return v1.min === v2.min && v1.max === v2.max;
  }
  get length() {
    return this.max - this.min;
  }
  toObject() {
    return {
      min: this.min,
      max: this.max
    };
  }
}
const IntervalAssembly = {
  fromComponents: (comps) => new Interval(comps[0], comps[1]),
  toComponents: (p) => [p.min, p.max]
};
class IntervalConstraint {
  constructor(edge) {
    this.edge = edge;
  }
  constrain(value) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (value.min <= value.max) {
      return new Interval((_b = (_a = this.edge) === null || _a === void 0 ? void 0 : _a.constrain(value.min)) !== null && _b !== void 0 ? _b : value.min, (_d = (_c = this.edge) === null || _c === void 0 ? void 0 : _c.constrain(value.max)) !== null && _d !== void 0 ? _d : value.max);
    }
    const c = (value.min + value.max) / 2;
    return new Interval((_f = (_e = this.edge) === null || _e === void 0 ? void 0 : _e.constrain(c)) !== null && _f !== void 0 ? _f : c, (_h = (_g = this.edge) === null || _g === void 0 ? void 0 : _g.constrain(c)) !== null && _h !== void 0 ? _h : c);
  }
}
const className$2$2 = ClassName("rsltxt");
class RangeSliderTextView {
  constructor(doc, config) {
    this.sliderView_ = config.sliderView;
    this.textView_ = config.textView;
    this.element = doc.createElement("div");
    this.element.classList.add(className$2$2());
    const sliderElem = doc.createElement("div");
    sliderElem.classList.add(className$2$2("s"));
    sliderElem.appendChild(this.sliderView_.element);
    this.element.appendChild(sliderElem);
    const textElem = doc.createElement("div");
    textElem.classList.add(className$2$2("t"));
    textElem.appendChild(this.textView_.element);
    this.element.appendChild(textElem);
  }
}
const className$1$4 = ClassName("rsl");
class RangeSliderView {
  constructor(doc, config) {
    this.onSliderPropsChange_ = this.onSliderPropsChange_.bind(this);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.sliderProps_ = config.sliderProps;
    this.sliderProps_.emitter.on("change", this.onSliderPropsChange_);
    this.element = doc.createElement("div");
    this.element.classList.add(className$1$4());
    config.viewProps.bindClassModifiers(this.element);
    this.value_ = config.value;
    this.value_.emitter.on("change", this.onValueChange_);
    const trackElem = doc.createElement("div");
    trackElem.classList.add(className$1$4("t"));
    this.element.appendChild(trackElem);
    this.trackElement = trackElem;
    const barElem = doc.createElement("div");
    barElem.classList.add(className$1$4("b"));
    trackElem.appendChild(barElem);
    this.barElement = barElem;
    const knobElems = ["min", "max"].map((modifier) => {
      const elem = doc.createElement("div");
      elem.classList.add(className$1$4("k"), className$1$4("k", modifier));
      trackElem.appendChild(elem);
      return elem;
    });
    this.knobElements = [knobElems[0], knobElems[1]];
    this.update_();
  }
  valueToX_(value) {
    const min = this.sliderProps_.get("min");
    const max = this.sliderProps_.get("max");
    return constrainRange(mapRange(value, min, max, 0, 1), 0, 1) * 100;
  }
  update_() {
    const v = this.value_.rawValue;
    if (v.length === 0) {
      this.element.classList.add(className$1$4(void 0, "zero"));
    } else {
      this.element.classList.remove(className$1$4(void 0, "zero"));
    }
    const xs = [this.valueToX_(v.min), this.valueToX_(v.max)];
    this.barElement.style.left = `${xs[0]}%`;
    this.barElement.style.right = `${100 - xs[1]}%`;
    this.knobElements.forEach((elem, index) => {
      elem.style.left = `${xs[index]}%`;
    });
  }
  onSliderPropsChange_() {
    this.update_();
  }
  onValueChange_() {
    this.update_();
  }
}
class RangeSliderController {
  constructor(doc, config) {
    this.grabbing_ = null;
    this.grabOffset_ = 0;
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.sliderProps = config.sliderProps;
    this.viewProps = config.viewProps;
    this.value = config.value;
    this.view = new RangeSliderView(doc, {
      sliderProps: this.sliderProps,
      value: this.value,
      viewProps: config.viewProps
    });
    const ptHandler = new PointerHandler(this.view.trackElement);
    ptHandler.emitter.on("down", this.onPointerDown_);
    ptHandler.emitter.on("move", this.onPointerMove_);
    ptHandler.emitter.on("up", this.onPointerUp_);
  }
  ofs_() {
    if (this.grabbing_ === "min") {
      return this.view.knobElements[0].getBoundingClientRect().width / 2;
    }
    if (this.grabbing_ === "max") {
      return -this.view.knobElements[1].getBoundingClientRect().width / 2;
    }
    return 0;
  }
  valueFromData_(data) {
    if (!data.point) {
      return null;
    }
    const p = (data.point.x + this.ofs_()) / data.bounds.width;
    const min = this.sliderProps.get("min");
    const max = this.sliderProps.get("max");
    return mapRange(p, 0, 1, min, max);
  }
  onPointerDown_(ev) {
    if (!ev.data.point) {
      return;
    }
    const p = ev.data.point.x / ev.data.bounds.width;
    const v = this.value.rawValue;
    const min = this.sliderProps.get("min");
    const max = this.sliderProps.get("max");
    const pmin = mapRange(v.min, min, max, 0, 1);
    const pmax = mapRange(v.max, min, max, 0, 1);
    if (Math.abs(pmax - p) <= 0.025) {
      this.grabbing_ = "max";
    } else if (Math.abs(pmin - p) <= 0.025) {
      this.grabbing_ = "min";
    } else if (p >= pmin && p <= pmax) {
      this.grabbing_ = "length";
      this.grabOffset_ = mapRange(p - pmin, 0, 1, 0, max - min);
    } else if (p < pmin) {
      this.grabbing_ = "min";
      this.onPointerMove_(ev);
    } else if (p > pmax) {
      this.grabbing_ = "max";
      this.onPointerMove_(ev);
    }
  }
  applyPointToValue_(data, opts) {
    const v = this.valueFromData_(data);
    if (v === null) {
      return;
    }
    const rmin = this.sliderProps.get("min");
    const rmax = this.sliderProps.get("max");
    if (this.grabbing_ === "min") {
      this.value.setRawValue(new Interval(v, this.value.rawValue.max), opts);
    } else if (this.grabbing_ === "max") {
      this.value.setRawValue(new Interval(this.value.rawValue.min, v), opts);
    } else if (this.grabbing_ === "length") {
      const len = this.value.rawValue.length;
      let min = v - this.grabOffset_;
      let max = min + len;
      if (min < rmin) {
        min = rmin;
        max = rmin + len;
      } else if (max > rmax) {
        min = rmax - len;
        max = rmax;
      }
      this.value.setRawValue(new Interval(min, max), opts);
    }
  }
  onPointerMove_(ev) {
    this.applyPointToValue_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerUp_(ev) {
    this.applyPointToValue_(ev.data, {
      forceEmit: true,
      last: true
    });
    this.grabbing_ = null;
  }
}
class RangeSliderTextController {
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.sc_ = new RangeSliderController(doc, config);
    const axis = {
      constraint: config.constraint,
      textProps: config.textProps
    };
    this.tc_ = new PointNdTextController(doc, {
      assembly: IntervalAssembly,
      axes: [axis, axis],
      parser: config.parser,
      value: this.value,
      viewProps: config.viewProps
    });
    this.view = new RangeSliderTextView(doc, {
      sliderView: this.sc_.view,
      textView: this.tc_.view
    });
  }
  get textController() {
    return this.tc_;
  }
}
function intervalFromUnknown(value) {
  return Interval.isObject(value) ? new Interval(value.min, value.max) : new Interval(0, 0);
}
function writeInterval(target, value) {
  target.writeProperty("max", value.max);
  target.writeProperty("min", value.min);
}
function createConstraint$2(params) {
  const constraints = [];
  const rc = createRangeConstraint(params);
  if (rc) {
    constraints.push(rc);
  }
  const sc = createStepConstraint(params);
  if (sc) {
    constraints.push(sc);
  }
  return new IntervalConstraint(new CompositeConstraint(constraints));
}
createPlugin({
  id: "input-interval",
  type: "input",
  accept: (exValue, params) => {
    if (!Interval.isObject(exValue)) {
      return null;
    }
    const result = parseRecord(params, (p) => Object.assign(Object.assign({}, createNumberTextInputParamsParser(p)), { readonly: p.optional.constant(false) }));
    return result ? {
      initialValue: new Interval(exValue.min, exValue.max),
      params: result
    } : null;
  },
  binding: {
    reader: (_args) => intervalFromUnknown,
    constraint: (args) => createConstraint$2(args.params),
    equals: Interval.equals,
    writer: (_args) => writeInterval
  },
  controller(args) {
    const v = args.value;
    const c = args.constraint;
    if (!(c instanceof IntervalConstraint)) {
      throw TpError.shouldNeverHappen();
    }
    const midValue = (v.rawValue.min + v.rawValue.max) / 2;
    const textProps = ValueMap.fromObject(createNumberTextPropsObject(args.params, midValue));
    const drc = c.edge && findConstraint(c.edge, DefiniteRangeConstraint);
    if (drc) {
      return new RangeSliderTextController(args.document, {
        constraint: c.edge,
        parser: parseNumber,
        sliderProps: new ValueMap({
          keyScale: textProps.value("keyScale"),
          max: drc.values.value("max"),
          min: drc.values.value("min")
        }),
        textProps,
        value: v,
        viewProps: args.viewProps
      });
    }
    const axis = {
      constraint: c.edge,
      textProps
    };
    return new PointNdTextController(args.document, {
      assembly: IntervalAssembly,
      axes: [axis, axis],
      parser: parseNumber,
      value: v,
      viewProps: args.viewProps
    });
  }
});
class RadioCellApi {
  constructor(controller) {
    this.controller_ = controller;
  }
  get disabled() {
    return this.controller_.viewProps.get("disabled");
  }
  set disabled(disabled) {
    this.controller_.viewProps.set("disabled", disabled);
  }
  get title() {
    var _a;
    return (_a = this.controller_.props.get("title")) !== null && _a !== void 0 ? _a : "";
  }
  set title(title) {
    this.controller_.props.set("title", title);
  }
}
class TpRadioGridChangeEvent extends TpChangeEvent {
  constructor(target, cell, index, value, last) {
    super(target, value, last);
    this.cell = cell;
    this.index = index;
  }
}
class RadioGridApi extends BladeApi {
  constructor(controller) {
    super(controller);
    this.cellToApiMap_ = /* @__PURE__ */ new Map();
    const gc = this.controller.valueController;
    gc.cellControllers.forEach((cc) => {
      const api = new RadioCellApi(cc);
      this.cellToApiMap_.set(cc, api);
    });
  }
  get value() {
    return this.controller.value;
  }
  cell(x, y2) {
    const gc = this.controller.valueController;
    const cc = gc.cellControllers[y2 * gc.size[0] + x];
    return this.cellToApiMap_.get(cc);
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.controller.value.emitter.on(eventName, (ev) => {
      const gc = this.controller.valueController;
      const cc = gc.findCellByValue(ev.rawValue);
      if (!cc) {
        return;
      }
      const capi = this.cellToApiMap_.get(cc);
      if (!capi) {
        return;
      }
      const i = gc.cellControllers.indexOf(cc);
      bh(new TpRadioGridChangeEvent(this, capi, [i % gc.size[0], Math.floor(i / gc.size[0])], ev.rawValue));
    });
  }
}
const className$8 = ClassName("rad");
class RadioView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$8());
    config.viewProps.bindClassModifiers(this.element);
    const labelElem = doc.createElement("label");
    labelElem.classList.add(className$8("l"));
    this.element.appendChild(labelElem);
    const inputElem = doc.createElement("input");
    inputElem.classList.add(className$8("i"));
    inputElem.name = config.name;
    inputElem.type = "radio";
    config.viewProps.bindDisabled(inputElem);
    labelElem.appendChild(inputElem);
    this.inputElement = inputElem;
    const bodyElem = doc.createElement("div");
    bodyElem.classList.add(className$8("b"));
    labelElem.appendChild(bodyElem);
    const titleElem = doc.createElement("div");
    titleElem.classList.add(className$8("t"));
    bodyElem.appendChild(titleElem);
    bindValueMap(config.props, "title", (title) => {
      titleElem.textContent = title;
    });
  }
}
class RadioController {
  constructor(doc, config) {
    this.props = config.props;
    this.viewProps = config.viewProps;
    this.view = new RadioView(doc, {
      name: config.name,
      props: this.props,
      viewProps: this.viewProps
    });
  }
}
class RadioGridController {
  constructor(doc, config) {
    this.cellCs_ = [];
    this.cellValues_ = [];
    this.onCellInputChange_ = this.onCellInputChange_.bind(this);
    this.size = config.size;
    const [w, h] = this.size;
    for (let y2 = 0; y2 < h; y2++) {
      for (let x = 0; x < w; x++) {
        const bc = new RadioController(doc, {
          name: config.groupName,
          props: ValueMap.fromObject(Object.assign({}, config.cellConfig(x, y2))),
          viewProps: ViewProps.create()
        });
        this.cellCs_.push(bc);
        this.cellValues_.push(config.cellConfig(x, y2).value);
      }
    }
    this.value = config.value;
    bindValue(this.value, (value) => {
      const cc = this.findCellByValue(value);
      if (!cc) {
        return;
      }
      cc.view.inputElement.checked = true;
    });
    this.viewProps = ViewProps.create();
    this.view = new PlainView(doc, {
      viewProps: this.viewProps,
      viewName: "radgrid"
    });
    this.view.element.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    this.cellCs_.forEach((bc) => {
      bc.view.inputElement.addEventListener("change", this.onCellInputChange_);
      this.view.element.appendChild(bc.view.element);
    });
  }
  get cellControllers() {
    return this.cellCs_;
  }
  findCellByValue(value) {
    const index = this.cellValues_.findIndex((v) => v === value);
    if (index < 0) {
      return null;
    }
    return this.cellCs_[index];
  }
  onCellInputChange_(ev) {
    const inputElem = ev.currentTarget;
    const index = this.cellCs_.findIndex((c) => c.view.inputElement === inputElem);
    if (index < 0) {
      return;
    }
    this.value.rawValue = this.cellValues_[index];
  }
}
(function() {
  return createPlugin({
    id: "radiogrid",
    type: "blade",
    accept(params) {
      const result = parseRecord(params, (p) => ({
        cells: p.required.function,
        groupName: p.required.string,
        size: p.required.array(p.required.number),
        value: p.required.raw,
        view: p.required.constant("radiogrid"),
        label: p.optional.string
      }));
      return result ? { params: result } : null;
    },
    controller(args) {
      const value = createValue(args.params.value);
      return new LabeledValueBladeController(args.document, {
        blade: args.blade,
        props: ValueMap.fromObject({
          label: args.params.label
        }),
        value,
        valueController: new RadioGridController(args.document, {
          groupName: args.params.groupName,
          cellConfig: args.params.cells,
          size: args.params.size,
          value
        })
      });
    },
    api(args) {
      if (!(args.controller instanceof LabeledValueBladeController)) {
        return null;
      }
      if (!(args.controller.valueController instanceof RadioGridController)) {
        return null;
      }
      return new RadioGridApi(args.controller);
    }
  });
})();
function createRadioGridInputPlugin(config) {
  return createPlugin({
    id: "input-radiogrid",
    type: "input",
    accept(value, params) {
      if (!config.isType(value)) {
        return null;
      }
      const result = parseRecord(params, (p) => ({
        cells: p.required.function,
        groupName: p.required.string,
        size: p.required.array(p.required.number),
        view: p.required.constant("radiogrid")
      }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: config.binding,
    controller: (args) => {
      return new RadioGridController(args.document, {
        cellConfig: args.params.cells,
        groupName: args.params.groupName,
        size: args.params.size,
        value: args.value
      });
    }
  });
}
createRadioGridInputPlugin({
  isType: (value) => {
    return typeof value === "number";
  },
  binding: {
    reader: (_args) => numberFromUnknown,
    writer: (_args) => writePrimitive
  }
});
createRadioGridInputPlugin({
  isType: (value) => {
    return typeof value === "string";
  },
  binding: {
    reader: (_args) => stringFromUnknown,
    writer: (_args) => writePrimitive
  }
});
createRadioGridInputPlugin({
  isType: (value) => {
    return typeof value === "boolean";
  },
  binding: {
    reader: (_args) => boolFromUnknown,
    writer: (_args) => writePrimitive
  }
});
const Binding = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $parentStore, $$unsubscribe_parentStore;
  let { object } = $$props;
  let { key: key2 } = $$props;
  let { disabled = false } = $$props;
  let { label = void 0 } = $$props;
  let { options = void 0 } = $$props;
  let { theme = void 0 } = $$props;
  let { ref = void 0 } = $$props;
  let { plugin = void 0 } = $$props;
  const registerPlugin = getContext("registerPlugin");
  const parentStore = getContext("parentStore");
  $$unsubscribe_parentStore = subscribe(parentStore, (value) => $parentStore = value);
  const userCreatedPane = getContext("userCreatedPane");
  let _ref;
  let index;
  function create() {
    if (_ref) _ref.dispose();
    if (plugin !== void 0) {
      registerPlugin(plugin);
    }
    _ref = $parentStore.addBinding(object, key2, { index, label, ...options, disabled });
    ref = _ref;
    _ref.on("change", onTweakpaneChange);
  }
  onDestroy(() => {
    _ref?.dispose();
  });
  const dispatch = createEventDispatcher();
  function safeCopy(value) {
    if (value instanceof File) {
      return new File(
        [value],
        value.name,
        {
          lastModified: value.lastModified,
          type: value.type
        }
      );
    }
    return copy(value);
  }
  let lastObject = object;
  let lastValue = safeCopy(object[key2]);
  let internalChange = false;
  function onBoundValueChange(object2) {
    if (lastObject !== object2) {
      internalChange = false;
    }
    if (!shallowEqual(object2[key2], lastValue)) {
      lastValue = safeCopy(object2[key2]);
      dispatch("change", {
        value: safeCopy(object2[key2]),
        origin: internalChange ? "internal" : "external"
      });
      if (!internalChange && _ref) {
        _ref.off("change", onTweakpaneChange);
        _ref.refresh();
        _ref.on("change", onTweakpaneChange);
      }
    }
    internalChange = false;
    if (lastObject !== object2) {
      lastObject = object2;
      create();
    }
  }
  function onTweakpaneChange() {
    internalChange = true;
    object[key2] = safeCopy(object[key2]);
  }
  if ($$props.object === void 0 && $$bindings.object && object !== void 0) $$bindings.object(object);
  if ($$props.key === void 0 && $$bindings.key && key2 !== void 0) $$bindings.key(key2);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0) $$bindings.options(options);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
  if ($$props.plugin === void 0 && $$bindings.plugin && plugin !== void 0) $$bindings.plugin(plugin);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    _ref !== void 0 && (_ref.disabled = disabled);
    _ref !== void 0 && (_ref.label = label);
    {
      $parentStore !== void 0 && index !== void 0 && create();
    }
    $parentStore !== void 0 && onBoundValueChange(object);
    theme && $parentStore !== void 0 && (userCreatedPane || !isRootPane($parentStore)) && console.warn("Set theme on the <Pane> component, not on its children! (Check nested <Binding> components for a theme prop.)");
    $$rendered = `${parentStore ? `${`${validate_component(ClsPad, "ClsPad").$$render(
      $$result,
      {
        keysAdd: ["containerVerticalPadding", "containerUnitSize"],
        theme
      },
      {},
      {}
    )}`}` : `${validate_component(InternalPaneInline, "InternalPaneInline").$$render($$result, { theme, userCreatedPane: false }, {}, {
      default: () => {
        return `${validate_component(Binding, "svelte:self").$$render(
          $$result,
          {
            disabled,
            key: key2,
            label,
            object,
            options,
            plugin,
            ref
          },
          {
            disabled: ($$value) => {
              disabled = $$value;
              $$settled = false;
            },
            key: ($$value) => {
              key2 = $$value;
              $$settled = false;
            },
            label: ($$value) => {
              label = $$value;
              $$settled = false;
            },
            object: ($$value) => {
              object = $$value;
              $$settled = false;
            },
            options: ($$value) => {
              options = $$value;
              $$settled = false;
            },
            plugin: ($$value) => {
              plugin = $$value;
              $$settled = false;
            },
            ref: ($$value) => {
              ref = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      }
    })}`}`;
  } while (!$$settled);
  $$unsubscribe_parentStore();
  return $$rendered;
});
const GenericBinding = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let object;
  let $$restProps = compute_rest_props($$props, ["value", "ref", "options"]);
  let { value } = $$props;
  let { ref = void 0 } = $$props;
  let { options = void 0 } = $$props;
  const key2 = Symbol("key");
  function getValue() {
    return value;
  }
  function setValue() {
    if (!shallowEqual(value, object[key2])) {
      object[key2] = value;
    }
  }
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0) $$bindings.options(options);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    object = { [key2]: getValue() };
    value = object[key2];
    {
      setValue();
    }
    $$rendered = `${validate_component(Binding, "Binding").$$render(
      $$result,
      Object.assign({}, { key: key2 }, { options }, $$restProps, { object }, { ref }),
      {
        object: ($$value) => {
          object = $$value;
          $$settled = false;
        },
        ref: ($$value) => {
          ref = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const GenericInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["options", "ref", "value"]);
  let { options = void 0 } = $$props;
  let { ref = void 0 } = $$props;
  let { value } = $$props;
  let optionsInternal;
  if ($$props.options === void 0 && $$bindings.options && options !== void 0) $$bindings.options(options);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    optionsInternal = { ...options, readonly: false };
    $$rendered = `${validate_component(GenericBinding, "GenericBinding").$$render(
      $$result,
      Object.assign({}, { options: optionsInternal }, $$restProps, { value }, { ref }),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        ref: ($$value) => {
          ref = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const containerClassName = ClassName("ctn");
const inputClassName = ClassName("input");
const deleteButtonClassName = ClassName("btn");
class FilePluginView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.container = doc.createElement("div");
    this.container.classList.add(containerClassName());
    config.viewProps.bindClassModifiers(this.container);
    this.input = doc.createElement("input");
    this.input.classList.add(inputClassName());
    this.input.setAttribute("type", "file");
    this.input.setAttribute("accept", config.filetypes ? config.filetypes.join(",") : "*");
    this.input.style.height = `calc(20px * ${config.lineCount})`;
    this.fileIcon = doc.createElement("div");
    this.fileIcon.classList.add(containerClassName("icon"));
    this.text = doc.createElement("span");
    this.text.classList.add(containerClassName("text"));
    this.warning = doc.createElement("span");
    this.warning.classList.add(containerClassName("warning"));
    this.warning.innerHTML = config.invalidFiletypeMessage;
    this.warning.style.display = "none";
    this.deleteButton = doc.createElement("button");
    this.deleteButton.classList.add(deleteButtonClassName("b"));
    this.deleteButton.innerHTML = "Delete";
    this.deleteButton.style.display = "none";
    this.container.appendChild(this.input);
    this.container.appendChild(this.fileIcon);
    this.element.appendChild(this.container);
    this.element.appendChild(this.warning);
    this.element.appendChild(this.deleteButton);
  }
  /**
   * Changes the style of the container based on whether the user is dragging or not.
   * @param state if the user is dragging or not.
   */
  changeDraggingState(state) {
    var _a, _b;
    if (state) {
      (_a = this.container) === null || _a === void 0 ? void 0 : _a.classList.add(containerClassName("input_area_dragging"));
    } else {
      (_b = this.container) === null || _b === void 0 ? void 0 : _b.classList.remove(containerClassName("input_area_dragging"));
    }
  }
}
class FilePluginController {
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new FilePluginView(doc, {
      viewProps: this.viewProps,
      value: config.value,
      invalidFiletypeMessage: config.invalidFiletypeMessage,
      lineCount: config.lineCount,
      filetypes: config.filetypes
    });
    this.config = config;
    this.onFile = this.onFile.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.view.input.addEventListener("change", this.onFile);
    this.view.element.addEventListener("drop", this.onDrop);
    this.view.element.addEventListener("dragover", this.onDragOver);
    this.view.element.addEventListener("dragleave", this.onDragLeave);
    this.view.deleteButton.addEventListener("click", this.onDeleteClick);
    this.value.emitter.on("change", () => this.handleValueChange());
    this.viewProps.handleDispose(() => {
      this.view.input.removeEventListener("change", this.onFile);
      this.view.element.removeEventListener("drop", this.onDrop);
      this.view.element.removeEventListener("dragover", this.onDragOver);
      this.view.element.removeEventListener("dragleave", this.onDragLeave);
      this.view.deleteButton.removeEventListener("click", this.onDeleteClick);
    });
  }
  /**
   * Called when the value of the input changes.
   * @param event change event.
   */
  onFile(_event) {
    const input = this.view.input;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!this.isFileValid(file)) {
        this.showWarning();
      } else {
        this.value.setRawValue(file);
      }
    }
  }
  /**
   * Shows warning text for 5 seconds.
   */
  showWarning() {
    this.view.warning.style.display = "block";
    setTimeout(() => {
      this.view.warning.style.display = "none";
    }, 5e3);
  }
  /**
   * Checks if the file is valid with the given filetypes.
   * @param file File object
   * @returns true if the file is valid.
   */
  isFileValid(file) {
    var _a;
    const filetypes = this.config.filetypes;
    const fileExtension = "." + ((_a = file.name.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase());
    return !(filetypes && filetypes.length > 0 && !filetypes.includes(fileExtension) && fileExtension);
  }
  /**
   * Event handler when the delete HTML button is clicked.
   * It resets the `rawValue` of the controller.
   */
  onDeleteClick() {
    const file = this.value.rawValue;
    if (file) {
      this.value.setRawValue(null);
      this.view.input.value = "";
      this.view.warning.style.display = "none";
    }
  }
  /**
   * Called when the user drags over a file.
   * Updates the style of the container.
   * @param event drag event.
   */
  onDragOver(event) {
    event.preventDefault();
    this.view.changeDraggingState(true);
  }
  /**
   * Called when the user leaves the container while dragging.
   * Updates the style of the container.
   */
  onDragLeave() {
    this.view.changeDraggingState(false);
  }
  /**
   * Called when the user drops a file in the container.
   * Either shows a warning if it's invalid or updates the value if it's valid.
   * @param ev drag event.
   */
  onDrop(ev) {
    if (ev instanceof DragEvent) {
      ev.preventDefault();
      if (ev.dataTransfer) {
        if (ev.dataTransfer.files) {
          const filesArray = [ev.dataTransfer.files][0];
          if (filesArray.length == 1) {
            const file = filesArray.item(0);
            if (file) {
              if (!this.isFileValid(file)) {
                this.showWarning();
              } else {
                this.value.setRawValue(file);
              }
            }
          }
        }
      }
    }
    this.view.changeDraggingState(false);
  }
  /**
   * Called when the value (bound to the controller) changes (e.g. when the file is selected).
   */
  handleValueChange() {
    const fileObj = this.value.rawValue;
    const containerEl = this.view.container;
    const textEl = this.view.text;
    const fileIconEl = this.view.fileIcon;
    const deleteButton = this.view.deleteButton;
    if (fileObj) {
      textEl.textContent = fileObj.name;
      containerEl.appendChild(textEl);
      if (containerEl.contains(fileIconEl)) {
        containerEl.removeChild(fileIconEl);
      }
      this.view.warning.style.display = "none";
      deleteButton.style.display = "block";
      containerEl.style.border = "unset";
    } else {
      textEl.textContent = "";
      containerEl.appendChild(fileIconEl);
      containerEl.removeChild(textEl);
      this.view.warning.style.display = "none";
      deleteButton.style.display = "none";
      containerEl.style.border = "1px dashed #717070";
    }
  }
}
createPlugin({
  id: "file-input",
  // type: The plugin type.
  type: "input",
  accept(exValue, params) {
    if (typeof exValue !== "string") {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      // `view` option may be useful to provide a custom control for primitive values
      view: p.required.constant("file-input"),
      invalidFiletypeMessage: p.optional.string,
      lineCount: p.optional.number,
      filetypes: p.optional.array(p.required.string)
    }));
    if (!result) {
      return null;
    }
    return {
      initialValue: exValue,
      params: result
    };
  },
  binding: {
    reader(_args) {
      return (exValue) => {
        return exValue instanceof File ? exValue : null;
      };
    },
    constraint(_args) {
      return new CompositeConstraint([]);
    },
    writer(_args) {
      return (target, inValue) => {
        target.write(inValue);
      };
    }
  },
  controller(args) {
    var _a, _b;
    const defaultNumberOfLines = 3;
    const defaultFiletypeWarningText = "Unaccepted file type.";
    return new FilePluginController(args.document, {
      value: args.value,
      viewProps: args.viewProps,
      invalidFiletypeMessage: (_a = args.params.invalidFiletypeMessage) !== null && _a !== void 0 ? _a : defaultFiletypeWarningText,
      lineCount: (_b = args.params.lineCount) !== null && _b !== void 0 ? _b : defaultNumberOfLines,
      filetypes: args.params.filetypes
    });
  }
});
function createPlaceholderImage() {
  const svg = `
	<svg width="320" height="50" xmlns="http://www.w3.org/2000/svg">
  <style>
    text {
      font-family: "Menlo", monospace;
      font-size: 12px;
			fill: gray;
    }
  </style>
  <text x="50%" y="55%" text-anchor="middle">
    No Image
  </text>
</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const image = new Image();
  image.src = URL.createObjectURL(blob);
  return image;
}
function loadImage(src) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = src;
  return image;
}
const className$6 = ClassName("img");
class PluginView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$6());
    config.viewProps.bindClassModifiers(this.element);
    this.input = doc.createElement("input");
    this.input.classList.add(className$6("input"));
    this.input.setAttribute("type", "file");
    this.input.setAttribute("accept", config.extensions.join(","));
    this.image_ = doc.createElement("img");
    this.image_.id = "tpimg_" + Math.random().toString(36).slice(2);
    this.image_.classList.add(className$6("image"));
    this.image_.classList.add(className$6(`image_${config.imageFit}`));
    this.image_.crossOrigin = "anonymous";
    this.image_.onclick = (event) => {
      return config.clickCallback ? config.clickCallback(event, this.input) : this.input.click();
    };
    this.element.classList.add(className$6("area_root"));
    this.element.appendChild(this.image_);
    this.element.appendChild(this.input);
  }
  changeImage(src) {
    this.image_.src = src;
  }
  changeDraggingState(state) {
    const el = this.element;
    if (state) {
      el === null || el === void 0 ? void 0 : el.classList.add(className$6("area_dragging"));
    } else {
      el === null || el === void 0 ? void 0 : el.classList.remove(className$6("area_dragging"));
    }
  }
}
let placeholderImage = null;
class PluginController {
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new PluginView(doc, {
      viewProps: this.viewProps,
      extensions: config.extensions,
      imageFit: config.imageFit,
      clickCallback: config.clickCallback
    });
    this.onFile = this.onFile.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.view.input.addEventListener("change", this.onFile);
    this.view.element.addEventListener("drop", this.onDrop);
    this.view.element.addEventListener("dragstart", this.onDragStart);
    this.view.element.addEventListener("dragover", this.onDragOver);
    this.view.element.addEventListener("dragleave", this.onDragLeave);
    this.viewProps.handleDispose(() => {
      this.view.input.removeEventListener("change", this.onFile);
      this.view.element.removeEventListener("drop", this.onDrop);
      this.view.element.removeEventListener("dragstart", this.onDragStart);
      this.view.element.removeEventListener("dragover", this.onDragOver);
      this.view.element.removeEventListener("dragleave", this.onDragLeave);
    });
    this.value.emitter.on("change", () => this.handleValueChange());
    this.handleValueChange();
  }
  onFile(event) {
    const files = (event === null || event === void 0 ? void 0 : event.target).files;
    if (!files || !files.length)
      return;
    const file = files[0];
    this.setValue(file);
  }
  onDrop(event) {
    event.preventDefault();
    try {
      const { dataTransfer } = event;
      const file = dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.files[0];
      if (file) {
        this.setValue(file);
      } else {
        const imgId = dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.getData("img-id");
        if (imgId) {
          const img = document.getElementById(imgId);
          this.setValue(img);
        } else {
          const url = dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.getData("url");
          if (!url)
            throw new Error("No url");
          this.setValue(url);
        }
      }
    } catch (e) {
      console.error("Could not parse the dropped image", e);
    } finally {
      this.view.changeDraggingState(false);
    }
  }
  onDragStart(event) {
    var _a, _b;
    (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("img-id", this.view.image_.id);
    (_b = event.dataTransfer) === null || _b === void 0 ? void 0 : _b.setDragImage(this.view.image_, 0, 0);
  }
  onDragOver(event) {
    event.preventDefault();
    this.view.changeDraggingState(true);
  }
  onDragLeave() {
    this.view.changeDraggingState(false);
  }
  handleImage(image) {
    if (image instanceof HTMLImageElement) {
      this.updateImage(image.src);
    } else if (typeof image === "string" || !image) {
      if (image === "placeholder" || !image) {
        image = this.handlePlaceholderImage().src;
      }
      this.updateImage(image);
    } else {
      this.setValue(image);
    }
  }
  updateImage(src) {
    this.view.changeImage(src);
  }
  setValue(src) {
    if (src instanceof HTMLImageElement) {
      this.value.setRawValue(src);
    } else if (src instanceof File) {
      const url = URL.createObjectURL(src) + "#" + src.name;
      src.src = url;
      const img = loadImage(url);
      this.value.setRawValue(img || src);
    } else if (src) {
      this.value.setRawValue(loadImage(src));
    } else {
      this.value.setRawValue(this.handlePlaceholderImage());
    }
  }
  handleValueChange() {
    this.handleImage(this.value.rawValue);
  }
  handlePlaceholderImage() {
    if (!placeholderImage) {
      placeholderImage = createPlaceholderImage();
    }
    return placeholderImage;
  }
}
const DEFAULT_EXTENSIONS = [".jpg", ".png", ".gif"];
createPlugin({
  id: "input-image",
  type: "input",
  accept(exValue, params) {
    if (!(exValue instanceof HTMLImageElement || typeof exValue === "string")) {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      view: p.required.constant("input-image"),
      acceptUrl: p.optional.boolean,
      clickCallback: p.optional.function,
      imageFit: p.optional.custom((v) => v === "contain" || v === "cover" ? v : void 0),
      extensions: p.optional.array(p.required.string)
    }));
    if (!result) {
      return null;
    }
    return {
      initialValue: exValue,
      params: result
    };
  },
  binding: {
    reader(_args) {
      return (exValue) => {
        if (exValue.src !== void 0) {
          return exValue.src === "" ? "placeholder" : exValue.src;
        } else {
          return typeof exValue === "string" ? exValue : exValue;
        }
      };
    },
    writer(_args) {
      return (target, inValue) => {
        target.write(inValue);
      };
    }
  },
  controller(args) {
    var _a, _b;
    return new PluginController(args.document, {
      value: args.value,
      imageFit: (_a = args.params.imageFit) !== null && _a !== void 0 ? _a : "cover",
      clickCallback: args.params.clickCallback,
      viewProps: args.viewProps,
      extensions: (_b = args.params.extensions) !== null && _b !== void 0 ? _b : DEFAULT_EXTENSIONS
    });
  }
});
const GenericSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "options", "min", "max", "step", "pointerScale", "keyScale", "format", "ref"]);
  let { value } = $$props;
  let { options = void 0 } = $$props;
  let { min = void 0 } = $$props;
  let { max = void 0 } = $$props;
  let { step = void 0 } = $$props;
  let { pointerScale = void 0 } = $$props;
  let { keyScale = void 0 } = $$props;
  let { format = void 0 } = $$props;
  let { ref = void 0 } = $$props;
  let formatProxy = format;
  let optionsInternal;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0) $$bindings.options(options);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0) $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0) $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0) $$bindings.step(step);
  if ($$props.pointerScale === void 0 && $$bindings.pointerScale && pointerScale !== void 0) $$bindings.pointerScale(pointerScale);
  if ($$props.keyScale === void 0 && $$bindings.keyScale && keyScale !== void 0) $$bindings.keyScale(keyScale);
  if ($$props.format === void 0 && $$bindings.format && format !== void 0) $$bindings.format(format);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    formatProxy !== format && (formatProxy = format);
    optionsInternal = {
      min,
      max,
      format: formatProxy,
      keyScale,
      pointerScale,
      step,
      ...options
    };
    $$rendered = `${validate_component(GenericInput, "GenericInput").$$render(
      $$result,
      Object.assign({}, { options: optionsInternal }, $$restProps, { value }, { ref }),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        ref: ($$value) => {
          ref = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const className$1$3 = ClassName("ckr");
class RingView {
  constructor(doc, config) {
    this.tickElems_ = [];
    this.labelElems_ = [];
    this.boundsWidth_ = -1;
    this.onShowsTooltipChange_ = this.onShowsTooltipChange_.bind(this);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.formatters_ = config.formatters;
    this.unit_ = config.unit;
    this.element = doc.createElement("div");
    this.element.classList.add(className$1$3(), className$1$3(void 0, `m${config.seriesId}`));
    config.viewProps.bindClassModifiers(this.element);
    this.value_ = config.value;
    this.value_.emitter.on("change", this.onValueChange_);
    config.showsTooltip.emitter.on("change", this.onShowsTooltipChange_);
    const wrapperElem = doc.createElement("div");
    wrapperElem.classList.add(className$1$3("w"));
    this.element.appendChild(wrapperElem);
    this.offsetElem_ = doc.createElement("div");
    this.offsetElem_.classList.add(className$1$3("o"));
    wrapperElem.appendChild(this.offsetElem_);
    this.svgElem_ = doc.createElementNS(SVG_NS, "svg");
    this.svgElem_.classList.add(className$1$3("g"));
    this.offsetElem_.appendChild(this.svgElem_);
    this.tooltipElem_ = doc.createElement("div");
    this.tooltipElem_.classList.add(ClassName("tt")(), className$1$3("tt"));
    this.element.appendChild(this.tooltipElem_);
    this.waitToBeAdded_();
  }
  // Waits to be added to DOM tree to build initial scale elements
  waitToBeAdded_() {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target !== this.element || entry.intersectionRatio === 0) {
          return;
        }
        this.update();
        ob.disconnect();
      });
    }, {
      root: null
    });
    ob.observe(this.element);
  }
  rebuildScaleIfNeeded_(bw) {
    if (this.boundsWidth_ === bw) {
      return;
    }
    this.boundsWidth_ = bw;
    this.tickElems_.forEach((elem) => {
      removeElement(elem);
    });
    this.tickElems_ = [];
    this.labelElems_.forEach((elem) => {
      removeElement(elem);
    });
    this.labelElems_ = [];
    const doc = this.element.ownerDocument;
    const tpu = this.unit_.ticks;
    const uw = this.unit_.pixels;
    const halfUnitCount = Math.ceil(bw / 2 / uw) + 1;
    const unitCount = halfUnitCount * 2 + 1;
    const tickCount = unitCount * tpu;
    const tickWidth = uw / tpu;
    for (let i = 0; i < tickCount; i++) {
      const x = i * tickWidth;
      if (i % tpu === 0) {
        const lineElem = doc.createElementNS(SVG_NS, "line");
        lineElem.classList.add(className$1$3("mjt"));
        lineElem.setAttributeNS(null, "x1", String(x));
        lineElem.setAttributeNS(null, "y1", "0");
        lineElem.setAttributeNS(null, "x2", String(x));
        lineElem.setAttributeNS(null, "y2", "2");
        this.svgElem_.appendChild(lineElem);
        this.tickElems_.push(lineElem);
        const labelElem = doc.createElement("div");
        labelElem.classList.add(className$1$3("l"));
        labelElem.style.left = `${x}px`;
        this.offsetElem_.appendChild(labelElem);
        this.labelElems_.push(labelElem);
      } else {
        const lineElem = doc.createElementNS(SVG_NS, "line");
        lineElem.classList.add(className$1$3("mnt"));
        lineElem.setAttributeNS(null, "x1", String(x));
        lineElem.setAttributeNS(null, "y1", "0");
        lineElem.setAttributeNS(null, "x2", String(x));
        lineElem.setAttributeNS(null, "y2", "2");
        this.svgElem_.appendChild(lineElem);
        this.tickElems_.push(lineElem);
      }
    }
  }
  updateScale_(bw) {
    const uv = this.unit_.value;
    const uw = this.unit_.pixels;
    const v = this.value_.rawValue;
    const halfUnitCount = Math.ceil(bw / 2 / uw) + 1;
    const ov = v - v % uv - uv * halfUnitCount;
    const opacity = (tv) => {
      return 1 - Math.pow(constrainRange(Math.abs(v - tv) / (bw / 2 * (uv / uw)), 0, 1), 10);
    };
    this.labelElems_.forEach((elem, i) => {
      const lv = ov + i * uv;
      elem.textContent = this.formatters_.ring(lv);
      elem.style.opacity = String(opacity(lv));
    });
    const tpu = this.unit_.ticks;
    this.tickElems_.forEach((elem, i) => {
      const lv = ov + i / tpu * uv;
      elem.style.opacity = String(opacity(lv));
    });
  }
  update() {
    const bw = this.element.getBoundingClientRect().width;
    const uv = this.unit_.value;
    const uw = this.unit_.pixels;
    const v = this.value_.rawValue;
    const halfUnitCount = Math.ceil(bw / 2 / uw) + 1;
    const offsetFromCenter = (v % uv + uv * halfUnitCount) * (uw / uv);
    const offset = bw / 2 - offsetFromCenter;
    this.offsetElem_.style.transform = `translateX(${offset}px)`;
    this.tooltipElem_.textContent = this.formatters_.text(v);
    this.rebuildScaleIfNeeded_(bw);
    this.updateScale_(bw);
  }
  onValueChange_() {
    this.update();
  }
  onShowsTooltipChange_(ev) {
    if (ev.rawValue) {
      this.element.classList.add(className$1$3(void 0, "tt"));
    } else {
      this.element.classList.remove(className$1$3(void 0, "tt"));
    }
  }
}
class RingController {
  constructor(doc, config) {
    this.ox_ = 0;
    this.ov_ = 0;
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.tooltipEnabled_ = config.tooltipEnabled;
    this.unit_ = config.unit;
    this.showsTooltip_ = createValue(false);
    this.view = new RingView(doc, {
      formatters: config.formatters,
      seriesId: config.seriesId,
      showsTooltip: this.showsTooltip_,
      unit: config.unit,
      value: this.value,
      viewProps: this.viewProps
    });
    const ptHandler = new PointerHandler(this.view.element);
    ptHandler.emitter.on("down", this.onPointerDown_);
    ptHandler.emitter.on("move", this.onPointerMove_);
    ptHandler.emitter.on("up", this.onPointerUp_);
  }
  onPointerDown_(ev) {
    const data = ev.data;
    if (!data.point) {
      return;
    }
    this.ox_ = data.point.x;
    this.ov_ = this.value.rawValue;
    if (this.tooltipEnabled_) {
      this.showsTooltip_.rawValue = true;
    }
  }
  onPointerMove_(ev) {
    const data = ev.data;
    if (!data.point) {
      return;
    }
    const dx = data.point.x - this.ox_;
    const uw = this.unit_.pixels;
    const uv = this.unit_.value;
    this.value.setRawValue(this.ov_ - dx / uw * uv, {
      forceEmit: false,
      last: false
    });
  }
  onPointerUp_() {
    this.value.setRawValue(this.value.rawValue, {
      forceEmit: true,
      last: true
    });
    this.showsTooltip_.rawValue = false;
  }
}
const className$5 = ClassName("ckrtxt");
class RingTextView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$5());
    const ringElem = doc.createElement("div");
    ringElem.classList.add(className$5("r"));
    ringElem.appendChild(config.ringView.element);
    this.element.appendChild(ringElem);
    const textElem = doc.createElement("div");
    textElem.classList.add(className$5("t"));
    textElem.appendChild(config.textView.element);
    this.element.appendChild(textElem);
  }
}
class RingTextController {
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.rc_ = new RingController(doc, {
      formatters: {
        ring: config.ringFormatter,
        text: config.textProps.get("formatter")
      },
      seriesId: config.seriesId,
      tooltipEnabled: false,
      unit: config.ringUnit,
      value: this.value,
      viewProps: this.viewProps
    });
    this.tc_ = new NumberTextController(doc, {
      parser: config.parser,
      props: config.textProps,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view = new RingTextView(doc, {
      ringView: this.rc_.view,
      textView: this.tc_.view
    });
  }
}
function createConstraint(params) {
  const constraints = [];
  const cr = createRangeConstraint(params);
  if (cr) {
    constraints.push(cr);
  }
  const cs = createStepConstraint(params);
  if (cs) {
    constraints.push(cs);
  }
  return new CompositeConstraint(constraints);
}
function parseSeries(value) {
  return value === 0 || value === 1 || value === 2 ? value : void 0;
}
function getRingSeries(series) {
  return series !== void 0 ? String(series) : "0";
}
function createRingFormatter(ringUnit) {
  const f = createNumberFormatter(getDecimalDigits(ringUnit.value));
  return (value) => {
    const text = f(value);
    const ch = text.substr(0, 1);
    const hasSign = ch === "-" || ch === "+";
    return text + (hasSign ? " " : "");
  };
}
createPlugin({
  id: "input-ring",
  type: "input",
  accept(exValue, params) {
    if (typeof exValue !== "number") {
      return null;
    }
    const result = parseRecord(params, (p) => Object.assign(Object.assign({}, createNumberTextInputParamsParser(p)), { series: p.optional.custom(parseSeries), unit: p.optional.object({
      pixels: p.required.number,
      ticks: p.required.number,
      value: p.required.number
    }), view: p.required.constant("cameraring"), wide: p.optional.boolean }));
    return result ? {
      initialValue: exValue,
      params: result
    } : null;
  },
  binding: {
    reader: (_args) => numberFromUnknown,
    constraint: (args) => createConstraint(args.params),
    writer: (_args) => writePrimitive
  },
  controller(args) {
    var _a, _b, _c;
    const ringUnit = (_a = args.params.unit) !== null && _a !== void 0 ? _a : {
      ticks: 5,
      pixels: 40,
      value: 10
    };
    const ringFormatter = createRingFormatter(ringUnit);
    const textPropsObj = createNumberTextPropsObject(args.params, args.initialValue);
    if (args.params.wide) {
      return new RingController(args.document, {
        formatters: {
          ring: ringFormatter,
          text: textPropsObj.formatter
        },
        seriesId: (_b = getRingSeries(args.params.series)) !== null && _b !== void 0 ? _b : "0",
        tooltipEnabled: true,
        unit: ringUnit,
        value: args.value,
        viewProps: args.viewProps
      });
    }
    const textProps = ValueMap.fromObject(textPropsObj);
    return new RingTextController(args.document, {
      parser: parseNumber,
      ringFormatter,
      ringUnit,
      seriesId: (_c = getRingSeries(args.params.series)) !== null && _c !== void 0 ? _c : "0",
      textProps,
      value: args.value,
      viewProps: args.viewProps
    });
  }
});
createPlugin({
  id: "input-wheel",
  type: "input",
  accept(exValue, params) {
    if (typeof exValue !== "number") {
      return null;
    }
    const result = parseRecord(params, (p) => Object.assign(Object.assign({}, createNumberTextInputParamsParser(p)), { amount: p.optional.number, view: p.required.constant("camerawheel"), wide: p.optional.boolean }));
    return result ? {
      initialValue: exValue,
      params: result
    } : null;
  },
  binding: {
    reader: (_args) => numberFromUnknown,
    constraint: (args) => createConstraint(args.params),
    writer: (_args) => writePrimitive
  },
  controller(args) {
    var _a, _b;
    const ringFormatter = createNumberFormatter(0);
    const textPropsObj = createNumberTextPropsObject(args.params, args.initialValue);
    if (args.params.wide) {
      return new RingController(args.document, {
        formatters: {
          ring: ringFormatter,
          text: textPropsObj.formatter
        },
        seriesId: "w",
        tooltipEnabled: true,
        unit: {
          ticks: 10,
          pixels: 40,
          value: ((_a = args.params.amount) !== null && _a !== void 0 ? _a : textPropsObj.pointerScale) * 40
        },
        value: args.value,
        viewProps: args.viewProps
      });
    }
    return new RingTextController(args.document, {
      parser: parseNumber,
      ringFormatter,
      ringUnit: {
        ticks: 10,
        pixels: 40,
        value: ((_b = args.params.amount) !== null && _b !== void 0 ? _b : textPropsObj.pointerScale) * 40
      },
      seriesId: "w",
      textProps: ValueMap.fromObject(textPropsObj),
      value: args.value,
      viewProps: args.viewProps
    });
  }
});
class Rotation {
  multiply(b) {
    return this.format(this.quat.multiply(b.quat));
  }
  premultiply(a) {
    return this.format(a.multiply(this));
  }
  slerp(b, t) {
    return this.format(this.quat.slerp(b.quat, t));
  }
}
function clamp(x, l, h) {
  return Math.min(Math.max(x, l), h);
}
function lofi(x, d) {
  return Math.floor(x / d) * d;
}
function mod(x, d) {
  return x - lofi(x, d);
}
function sanitizeAngle(angle) {
  return mod(angle + Math.PI, Math.PI * 2) - Math.PI;
}
class Euler extends Rotation {
  static fromQuaternion(quat, order, unit) {
    const m = quat.toMat3();
    const [i, j, k, sign] = order === "XYZ" ? [0, 1, 2, 1] : order === "XZY" ? [0, 2, 1, -1] : order === "YXZ" ? [1, 0, 2, -1] : order === "YZX" ? [1, 2, 0, 1] : order === "ZXY" ? [2, 0, 1, 1] : [2, 1, 0, -1];
    const result = [0, 0, 0];
    const c = m[k + i * 3];
    result[j] = -sign * Math.asin(clamp(c, -1, 1));
    if (Math.abs(c) < 0.999999) {
      result[i] = sign * Math.atan2(m[k + j * 3], m[k * 4]);
      result[k] = sign * Math.atan2(m[j + i * 3], m[i * 4]);
    } else {
      result[i] = sign * Math.atan2(-m[j + k * 3], m[j * 4]);
    }
    if (Math.abs(result[i]) + Math.abs(result[k]) > Math.PI) {
      result[i] = sanitizeAngle(result[i] + Math.PI);
      result[j] = sanitizeAngle(Math.PI - result[j]);
      result[k] = sanitizeAngle(result[k] + Math.PI);
    }
    return new Euler(...result, order).reunit(unit);
  }
  constructor(x, y2, z2, order, unit) {
    super();
    this.x = x !== null && x !== void 0 ? x : 0;
    this.y = y2 !== null && y2 !== void 0 ? y2 : 0;
    this.z = z2 !== null && z2 !== void 0 ? z2 : 0;
    this.order = order !== null && order !== void 0 ? order : "XYZ";
    this.unit = unit !== null && unit !== void 0 ? unit : "rad";
  }
  get quat() {
    return Quaternion.fromEuler(this);
  }
  getComponents() {
    return [this.x, this.y, this.z];
  }
  toEuler(order, unit) {
    return this.reorder(order).reunit(unit);
  }
  format(r) {
    if (r instanceof Euler) {
      return r.reorder(this.order);
    }
    return r.toEuler(this.order, this.unit);
  }
  reorder(order) {
    if (order === this.order) {
      return this;
    }
    return this.quat.toEuler(order, this.unit);
  }
  reunit(unit) {
    const prev2Rad = {
      deg: Math.PI / 180,
      rad: 1,
      turn: 2 * Math.PI
    }[this.unit];
    const rad2Next = {
      deg: 180 / Math.PI,
      rad: 1,
      turn: 0.5 / Math.PI
    }[unit];
    const prev2Next = prev2Rad * rad2Next;
    return new Euler(prev2Next * this.x, prev2Next * this.y, prev2Next * this.z, this.order, unit);
  }
}
class Quaternion extends Rotation {
  static fromAxisAngle(axis, angle) {
    const halfAngle = angle / 2;
    const sinHalfAngle = Math.sin(halfAngle);
    return new Quaternion(axis.x * sinHalfAngle, axis.y * sinHalfAngle, axis.z * sinHalfAngle, Math.cos(halfAngle));
  }
  static fromEuler(eulerr) {
    const euler = eulerr.reunit("rad");
    const [i, j, k, sign] = euler.order === "XYZ" ? [0, 1, 2, 1] : euler.order === "XZY" ? [0, 2, 1, -1] : euler.order === "YXZ" ? [1, 0, 2, -1] : euler.order === "YZX" ? [1, 2, 0, 1] : euler.order === "ZXY" ? [2, 0, 1, 1] : [2, 1, 0, -1];
    const compo = euler.getComponents();
    const ti = 0.5 * compo[i];
    const tj = 0.5 * sign * compo[j];
    const tk = 0.5 * compo[k];
    const ci = Math.cos(ti);
    const cj = Math.cos(tj);
    const ck = Math.cos(tk);
    const si = Math.sin(ti);
    const sj = Math.sin(tj);
    const sk = Math.sin(tk);
    const result = [
      0,
      0,
      0,
      ck * cj * ci + sk * sj * si
    ];
    result[i] = ck * cj * si - sk * sj * ci;
    result[j] = sign * (ck * sj * ci + sk * cj * si);
    result[k] = sk * cj * ci - ck * sj * si;
    return new Quaternion(...result);
  }
  static lookRotation(look, up) {
    const { normal, tangent, binormal } = look.orthoNormalize(up);
    const m11 = binormal.x;
    const m12 = tangent.x;
    const m13 = normal.x;
    const m21 = binormal.y;
    const m22 = tangent.y;
    const m23 = normal.y;
    const m31 = binormal.z;
    const m32 = tangent.z;
    const m33 = normal.z;
    const trace = m11 + m22 + m33;
    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1);
      return new Quaternion((m32 - m23) * s, (m13 - m31) * s, (m21 - m12) * s, 0.25 / s);
    } else if (m11 > m22 && m11 > m33) {
      const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      return new Quaternion(0.25 * s, (m12 + m21) / s, (m13 + m31) / s, (m32 - m23) / s);
    } else if (m22 > m33) {
      const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      return new Quaternion((m12 + m21) / s, 0.25 * s, (m23 + m32) / s, (m13 - m31) / s);
    } else {
      const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      return new Quaternion((m13 + m31) / s, (m23 + m32) / s, 0.25 * s, (m21 - m12) / s);
    }
  }
  constructor(x, y2, z2, w) {
    super();
    this.x = x !== null && x !== void 0 ? x : 0;
    this.y = y2 !== null && y2 !== void 0 ? y2 : 0;
    this.z = z2 !== null && z2 !== void 0 ? z2 : 0;
    this.w = w !== null && w !== void 0 ? w : 1;
  }
  get quat() {
    return this;
  }
  getComponents() {
    return [this.x, this.y, this.z, this.w];
  }
  toEuler(order, unit) {
    return Euler.fromQuaternion(this, order, unit);
  }
  get lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  get length() {
    return Math.sqrt(this.lengthSq);
  }
  get normalized() {
    const l = this.length;
    if (l === 0) {
      return new Quaternion();
    }
    return new Quaternion(this.x / l, this.y / l, this.z / l, this.w / l);
  }
  get negated() {
    return new Quaternion(-this.x, -this.y, -this.z, -this.w);
  }
  get ban360s() {
    return this.w < 0 ? this.negated : this;
  }
  multiply(br) {
    const b = br.quat;
    return new Quaternion(this.w * b.x + this.x * b.w + this.y * b.z - this.z * b.y, this.w * b.y - this.x * b.z + this.y * b.w + this.z * b.x, this.w * b.z + this.x * b.y - this.y * b.x + this.z * b.w, this.w * b.w - this.x * b.x - this.y * b.y - this.z * b.z);
  }
  format(r) {
    return r.quat;
  }
  slerp(br, t) {
    let b = br.quat;
    if (t === 0) {
      return this;
    }
    if (t === 1) {
      return b;
    }
    const a = this.ban360s;
    b = b.ban360s;
    let cosHalfTheta = a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
    if (cosHalfTheta < 0) {
      b = b.negated;
      cosHalfTheta = -cosHalfTheta;
    }
    if (cosHalfTheta >= 1) {
      return a;
    }
    const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;
      return new Quaternion(s * a.x + t * b.x, s * a.y + t * b.y, s * a.z + t * b.z, s * a.w + t * b.w).normalized;
    }
    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    return new Quaternion(a.x * ratioA + b.x * ratioB, a.y * ratioA + b.y * ratioB, a.z * ratioA + b.z * ratioB, a.w * ratioA + b.w * ratioB);
  }
  toMat3() {
    const { x, y: y2, z: z2, w } = this;
    return [
      1 - 2 * y2 * y2 - 2 * z2 * z2,
      2 * x * y2 + 2 * z2 * w,
      2 * x * z2 - 2 * y2 * w,
      2 * x * y2 - 2 * z2 * w,
      1 - 2 * x * x - 2 * z2 * z2,
      2 * y2 * z2 + 2 * x * w,
      2 * x * z2 + 2 * y2 * w,
      2 * y2 * z2 - 2 * x * w,
      1 - 2 * x * x - 2 * y2 * y2
    ];
  }
}
class PointProjector {
  constructor() {
    this.offset = [0, 0, -5];
    this.fov = 30;
    this.aspect = 1;
    this.viewport = [0, 0, 1, 1];
  }
  project(v) {
    const vcx = (this.viewport[0] + this.viewport[2]) * 0.5;
    const vcy = (this.viewport[1] + this.viewport[3]) * 0.5;
    const vw = this.viewport[2] - this.viewport[0];
    const vh = this.viewport[3] - this.viewport[1];
    const p = 1 / Math.tan(this.fov * Math.PI / 360);
    const sz = -(v.z + this.offset[2]);
    const sx = vcx + (v.x + this.offset[0]) / sz * p * vw * 0.5 / this.aspect;
    const sy = vcy - (v.y + this.offset[1]) / sz * p * vh * 0.5;
    return [sx, sy];
  }
}
class SVGLineStrip {
  constructor(doc, vertices, projector) {
    this.element = doc.createElementNS(SVG_NS, "path");
    this.vertices = vertices;
    this.projector = projector;
  }
  /**
   * Make sure rotation is normalized!
   */
  setRotation(rotation) {
    let pathStr = "";
    this.vertices.forEach((vertex, iVertex) => {
      const transformed = vertex.applyQuaternion(rotation);
      const [sx, sy] = this.projector.project(transformed);
      const cmd = iVertex === 0 ? "M" : "L";
      pathStr += `${cmd}${sx} ${sy}`;
    });
    this.element.setAttributeNS(null, "d", pathStr);
    return this;
  }
}
class Vector3 {
  constructor(x, y2, z2) {
    this.x = x !== null && x !== void 0 ? x : 0;
    this.y = y2 !== null && y2 !== void 0 ? y2 : 0;
    this.z = z2 !== null && z2 !== void 0 ? z2 : 0;
  }
  getComponents() {
    return [this.x, this.y, this.z];
  }
  get lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  get length() {
    return Math.sqrt(this.lengthSq);
  }
  get normalized() {
    const l = this.length;
    if (l === 0) {
      return new Vector3();
    }
    return new Vector3(this.x / l, this.y / l, this.z / l);
  }
  get negated() {
    return new Vector3(-this.x, -this.y, -this.z);
  }
  add(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  sub(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  scale(s) {
    return new Vector3(this.x * s, this.y * s, this.z * s);
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  cross(v) {
    return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
  }
  orthoNormalize(tangent) {
    const normal = this.normalized;
    tangent = tangent.normalized;
    let dotNT = normal.dot(tangent);
    if (dotNT === 1) {
      if (Math.abs(normal.y) > Math.abs(normal.z)) {
        tangent = new Vector3(0, 0, 1);
      } else {
        tangent = new Vector3(0, 1, 0);
      }
      dotNT = normal.dot(tangent);
    }
    tangent = tangent.sub(normal.scale(dotNT)).normalized;
    const binormal = tangent.cross(normal);
    return {
      normal,
      tangent,
      binormal
    };
  }
  applyQuaternion(q) {
    const ix = q.w * this.x + q.y * this.z - q.z * this.y;
    const iy = q.w * this.y + q.z * this.x - q.x * this.z;
    const iz = q.w * this.z + q.x * this.y - q.y * this.x;
    const iw = -q.x * this.x - q.y * this.y - q.z * this.z;
    return new Vector3(ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y, iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z, iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x);
  }
}
function createArcRotation(axis, front) {
  const b = front.z > 0 ? new Quaternion(0, 0, 0, 1) : new Quaternion(0, 0, 1, 0);
  if (Math.abs(axis.z) > 0.9999) {
    return b;
  }
  return Quaternion.lookRotation(axis, front);
}
function createArcVerticesArray(thetaStart, thetaLength, segments, cosAxis, sinAxis, radius = 1) {
  const vertices = [];
  for (let i = 0; i < segments; i++) {
    const t = thetaStart + thetaLength * i / (segments - 1);
    const vector = new Vector3();
    vector[cosAxis] = radius * Math.cos(t);
    vector[sinAxis] = radius * Math.sin(t);
    vertices.push(vector);
  }
  return vertices;
}
const className$2$1 = ClassName("rotationgizmo");
const VEC3_ZERO = new Vector3(0, 0, 0);
const VEC3_XP$2 = new Vector3(1, 0, 0);
const VEC3_YP$2 = new Vector3(0, 1, 0);
const VEC3_ZP$2 = new Vector3(0, 0, 1);
const VEC3_ZN = new Vector3(0, 0, -1);
const VEC3_XP70 = new Vector3(0.7, 0, 0);
const VEC3_YP70 = new Vector3(0, 0.7, 0);
const VEC3_ZP70 = new Vector3(0, 0, 0.7);
const VEC3_XN70 = new Vector3(-0.7, 0, 0);
const VEC3_YN70 = new Vector3(0, -0.7, 0);
const VEC3_ZN70 = new Vector3(0, 0, -0.7);
const QUAT_IDENTITY$2 = new Quaternion(0, 0, 0, 1);
function createLabel(doc, circleClass, labelText) {
  const label = doc.createElementNS(SVG_NS, "g");
  const circle = doc.createElementNS(SVG_NS, "circle");
  circle.classList.add(className$2$1(circleClass));
  circle.setAttributeNS(null, "cx", "0");
  circle.setAttributeNS(null, "cy", "0");
  circle.setAttributeNS(null, "r", "8");
  label.appendChild(circle);
  const text = doc.createElementNS(SVG_NS, "text");
  text.classList.add(className$2$1("labeltext"));
  text.setAttributeNS(null, "y", "4");
  text.setAttributeNS(null, "text-anchor", "middle");
  text.setAttributeNS(null, "font-size", "10");
  text.textContent = labelText;
  label.appendChild(text);
  return label;
}
class RotationInputGizmoView {
  get xArcBElement() {
    return this.xArcBC_.element;
  }
  get yArcBElement() {
    return this.yArcBC_.element;
  }
  get zArcBElement() {
    return this.zArcBC_.element;
  }
  get xArcFElement() {
    return this.xArcFC_.element;
  }
  get yArcFElement() {
    return this.yArcFC_.element;
  }
  get zArcFElement() {
    return this.zArcFC_.element;
  }
  get rArcElement() {
    return this.rArcC_.element;
  }
  constructor(doc, config) {
    this.onFoldableChange_ = this.onFoldableChange_.bind(this);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.onModeChange_ = this.onModeChange_.bind(this);
    this.element = doc.createElement("div");
    this.element.classList.add(className$2$1());
    if (config.pickerLayout === "popup") {
      this.element.classList.add(className$2$1(void 0, "p"));
    }
    const padElem = doc.createElement("div");
    padElem.classList.add(className$2$1("p"));
    config.viewProps.bindTabIndex(padElem);
    this.element.appendChild(padElem);
    this.padElement = padElem;
    const svgElem = doc.createElementNS(SVG_NS, "svg");
    svgElem.classList.add(className$2$1("g"));
    this.padElement.appendChild(svgElem);
    this.svgElem_ = svgElem;
    this.projector_ = new PointProjector();
    this.projector_.viewport = [0, 0, 136, 136];
    const arcArray = createArcVerticesArray(0, Math.PI, 33, "x", "y");
    const arcArrayR = createArcVerticesArray(0, 2 * Math.PI, 65, "x", "y", 1.1);
    this.xArcB_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.xArcB_.element.classList.add(className$2$1("arcx"));
    this.svgElem_.appendChild(this.xArcB_.element);
    this.yArcB_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.yArcB_.element.classList.add(className$2$1("arcy"));
    this.svgElem_.appendChild(this.yArcB_.element);
    this.zArcB_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.zArcB_.element.classList.add(className$2$1("arcz"));
    this.svgElem_.appendChild(this.zArcB_.element);
    this.xArcBC_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.xArcBC_.element.classList.add(className$2$1("arcc"));
    this.svgElem_.appendChild(this.xArcBC_.element);
    this.yArcBC_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.yArcBC_.element.classList.add(className$2$1("arcc"));
    this.svgElem_.appendChild(this.yArcBC_.element);
    this.zArcBC_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.zArcBC_.element.classList.add(className$2$1("arcc"));
    this.svgElem_.appendChild(this.zArcBC_.element);
    const axesElem = doc.createElementNS(SVG_NS, "g");
    svgElem.classList.add(className$2$1("axes"));
    this.svgElem_.appendChild(axesElem);
    this.axesElem_ = axesElem;
    this.xAxis_ = new SVGLineStrip(doc, [VEC3_ZERO, VEC3_XP70], this.projector_);
    this.xAxis_.element.classList.add(className$2$1("axisx"));
    this.axesElem_.appendChild(this.xAxis_.element);
    this.yAxis_ = new SVGLineStrip(doc, [VEC3_ZERO, VEC3_YP70], this.projector_);
    this.yAxis_.element.classList.add(className$2$1("axisy"));
    this.axesElem_.appendChild(this.yAxis_.element);
    this.zAxis_ = new SVGLineStrip(doc, [VEC3_ZERO, VEC3_ZP70], this.projector_);
    this.zAxis_.element.classList.add(className$2$1("axisz"));
    this.axesElem_.appendChild(this.zAxis_.element);
    this.xnAxis_ = new SVGLineStrip(doc, [VEC3_ZERO, VEC3_XN70], this.projector_);
    this.xnAxis_.element.classList.add(className$2$1("axisn"));
    this.axesElem_.appendChild(this.xnAxis_.element);
    this.ynAxis_ = new SVGLineStrip(doc, [VEC3_ZERO, VEC3_YN70], this.projector_);
    this.ynAxis_.element.classList.add(className$2$1("axisn"));
    this.axesElem_.appendChild(this.ynAxis_.element);
    this.znAxis_ = new SVGLineStrip(doc, [VEC3_ZERO, VEC3_ZN70], this.projector_);
    this.znAxis_.element.classList.add(className$2$1("axisn"));
    this.axesElem_.appendChild(this.znAxis_.element);
    this.xArcF_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.xArcF_.element.classList.add(className$2$1("arcx"));
    this.svgElem_.appendChild(this.xArcF_.element);
    this.yArcF_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.yArcF_.element.classList.add(className$2$1("arcy"));
    this.svgElem_.appendChild(this.yArcF_.element);
    this.zArcF_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.zArcF_.element.classList.add(className$2$1("arcz"));
    this.svgElem_.appendChild(this.zArcF_.element);
    this.xArcFC_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.xArcFC_.element.classList.add(className$2$1("arcc"));
    this.svgElem_.appendChild(this.xArcFC_.element);
    this.yArcFC_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.yArcFC_.element.classList.add(className$2$1("arcc"));
    this.svgElem_.appendChild(this.yArcFC_.element);
    this.zArcFC_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.zArcFC_.element.classList.add(className$2$1("arcc"));
    this.svgElem_.appendChild(this.zArcFC_.element);
    this.rArc_ = new SVGLineStrip(doc, arcArrayR, this.projector_);
    this.rArc_.element.classList.add(className$2$1("arcr"));
    this.rArc_.setRotation(QUAT_IDENTITY$2);
    this.svgElem_.appendChild(this.rArc_.element);
    this.rArcC_ = new SVGLineStrip(doc, arcArrayR, this.projector_);
    this.rArcC_.element.classList.add(className$2$1("arcc"));
    this.rArcC_.setRotation(QUAT_IDENTITY$2);
    this.svgElem_.appendChild(this.rArcC_.element);
    const labelsElem = doc.createElementNS(SVG_NS, "g");
    svgElem.classList.add(className$2$1("labels"));
    this.svgElem_.appendChild(labelsElem);
    this.labelsElem_ = labelsElem;
    this.xLabel = createLabel(doc, "labelcirclex", "X");
    this.labelsElem_.appendChild(this.xLabel);
    this.yLabel = createLabel(doc, "labelcircley", "Y");
    this.labelsElem_.appendChild(this.yLabel);
    this.zLabel = createLabel(doc, "labelcirclez", "Z");
    this.labelsElem_.appendChild(this.zLabel);
    this.xnLabel = createLabel(doc, "labelcirclen", "-X");
    this.labelsElem_.appendChild(this.xnLabel);
    this.ynLabel = createLabel(doc, "labelcirclen", "-Y");
    this.labelsElem_.appendChild(this.ynLabel);
    this.znLabel = createLabel(doc, "labelcirclen", "-Z");
    this.labelsElem_.appendChild(this.znLabel);
    const onHoverXArc = () => {
      this.xArcB_.element.classList.add(className$2$1("arcx_hover"));
      this.xArcF_.element.classList.add(className$2$1("arcx_hover"));
    };
    const onLeaveXArc = () => {
      this.xArcB_.element.classList.remove(className$2$1("arcx_hover"));
      this.xArcF_.element.classList.remove(className$2$1("arcx_hover"));
    };
    this.xArcBC_.element.addEventListener("mouseenter", onHoverXArc);
    this.xArcBC_.element.addEventListener("mouseleave", onLeaveXArc);
    this.xArcFC_.element.addEventListener("mouseenter", onHoverXArc);
    this.xArcFC_.element.addEventListener("mouseleave", onLeaveXArc);
    const onHoverYArc = () => {
      this.yArcB_.element.classList.add(className$2$1("arcy_hover"));
      this.yArcF_.element.classList.add(className$2$1("arcy_hover"));
    };
    const onLeaveYArc = () => {
      this.yArcB_.element.classList.remove(className$2$1("arcy_hover"));
      this.yArcF_.element.classList.remove(className$2$1("arcy_hover"));
    };
    this.yArcBC_.element.addEventListener("mouseenter", onHoverYArc);
    this.yArcBC_.element.addEventListener("mouseleave", onLeaveYArc);
    this.yArcFC_.element.addEventListener("mouseenter", onHoverYArc);
    this.yArcFC_.element.addEventListener("mouseleave", onLeaveYArc);
    const onHoverZArc = () => {
      this.zArcB_.element.classList.add(className$2$1("arcz_hover"));
      this.zArcF_.element.classList.add(className$2$1("arcz_hover"));
    };
    const onLeaveZArc = () => {
      this.zArcB_.element.classList.remove(className$2$1("arcz_hover"));
      this.zArcF_.element.classList.remove(className$2$1("arcz_hover"));
    };
    this.zArcBC_.element.addEventListener("mouseenter", onHoverZArc);
    this.zArcBC_.element.addEventListener("mouseleave", onLeaveZArc);
    this.zArcFC_.element.addEventListener("mouseenter", onHoverZArc);
    this.zArcFC_.element.addEventListener("mouseleave", onLeaveZArc);
    const onHoverRArc = () => {
      this.rArc_.element.classList.add(className$2$1("arcr_hover"));
    };
    const onLeaveRArc = () => {
      this.rArc_.element.classList.remove(className$2$1("arcr_hover"));
    };
    this.rArcC_.element.addEventListener("mouseenter", onHoverRArc);
    this.rArcC_.element.addEventListener("mouseleave", onLeaveRArc);
    config.value.emitter.on("change", this.onValueChange_);
    this.value = config.value;
    config.mode.emitter.on("change", this.onModeChange_);
    this.mode_ = config.mode;
    this.update_();
  }
  get allFocusableElements() {
    return [this.padElement];
  }
  update_() {
    const q = this.value.rawValue.quat.normalized;
    this.xAxis_.setRotation(q);
    this.yAxis_.setRotation(q);
    this.zAxis_.setRotation(q);
    this.xnAxis_.setRotation(q);
    this.ynAxis_.setRotation(q);
    this.znAxis_.setRotation(q);
    const xp = VEC3_XP$2.applyQuaternion(q);
    const yp = VEC3_YP$2.applyQuaternion(q);
    const zp = VEC3_ZP$2.applyQuaternion(q);
    const xn = xp.negated;
    const yn = yp.negated;
    const zn = zp.negated;
    [
      { el: this.xAxis_.element, v: xp },
      { el: this.yAxis_.element, v: yp },
      { el: this.zAxis_.element, v: zp },
      { el: this.xnAxis_.element, v: xn },
      { el: this.ynAxis_.element, v: yn },
      { el: this.znAxis_.element, v: zn }
    ].map(({ el, v }) => {
      this.axesElem_.removeChild(el);
      return { el, v };
    }).sort((a, b) => a.v.z - b.v.z).forEach(({ el }) => {
      this.axesElem_.appendChild(el);
    });
    this.xArcB_.setRotation(createArcRotation(xp, VEC3_ZN));
    this.yArcB_.setRotation(createArcRotation(yp, VEC3_ZN));
    this.zArcB_.setRotation(createArcRotation(zp, VEC3_ZN));
    this.xArcBC_.setRotation(createArcRotation(xp, VEC3_ZN));
    this.yArcBC_.setRotation(createArcRotation(yp, VEC3_ZN));
    this.zArcBC_.setRotation(createArcRotation(zp, VEC3_ZN));
    this.xArcF_.setRotation(createArcRotation(xp, VEC3_ZP$2));
    this.yArcF_.setRotation(createArcRotation(yp, VEC3_ZP$2));
    this.zArcF_.setRotation(createArcRotation(zp, VEC3_ZP$2));
    this.xArcFC_.setRotation(createArcRotation(xp, VEC3_ZP$2));
    this.yArcFC_.setRotation(createArcRotation(yp, VEC3_ZP$2));
    this.zArcFC_.setRotation(createArcRotation(zp, VEC3_ZP$2));
    [
      { el: this.xLabel, v: VEC3_XP70 },
      { el: this.yLabel, v: VEC3_YP70 },
      { el: this.zLabel, v: VEC3_ZP70 },
      { el: this.xnLabel, v: VEC3_XN70 },
      { el: this.ynLabel, v: VEC3_YN70 },
      { el: this.znLabel, v: VEC3_ZN70 }
    ].forEach(({ el, v }) => {
      const [x, y2] = this.projector_.project(v.applyQuaternion(q));
      el.setAttributeNS(null, "transform", `translate( ${x}, ${y2} )`);
    });
    [
      { el: this.xLabel, v: xp },
      { el: this.yLabel, v: yp },
      { el: this.zLabel, v: zp },
      { el: this.xnLabel, v: xn },
      { el: this.ynLabel, v: yn },
      { el: this.znLabel, v: zn }
    ].map(({ el, v }) => {
      this.labelsElem_.removeChild(el);
      return { el, v };
    }).sort((a, b) => a.v.z - b.v.z).forEach(({ el }) => {
      this.labelsElem_.appendChild(el);
    });
  }
  onValueChange_() {
    this.update_();
  }
  onFoldableChange_() {
    this.update_();
  }
  onModeChange_() {
    const mode = this.mode_.rawValue;
    const x = mode === "angle-x" ? "add" : "remove";
    const y2 = mode === "angle-y" ? "add" : "remove";
    const z2 = mode === "angle-z" ? "add" : "remove";
    const r = mode === "angle-r" ? "add" : "remove";
    this.xArcB_.element.classList[x](className$2$1("arcx_active"));
    this.yArcB_.element.classList[y2](className$2$1("arcy_active"));
    this.zArcB_.element.classList[z2](className$2$1("arcz_active"));
    this.xArcF_.element.classList[x](className$2$1("arcx_active"));
    this.yArcF_.element.classList[y2](className$2$1("arcy_active"));
    this.zArcF_.element.classList[z2](className$2$1("arcz_active"));
    this.rArc_.element.classList[r](className$2$1("arcr_active"));
  }
}
function saturate$1(x) {
  return clamp(x, 0, 1);
}
function iikanjiEaseout(x) {
  if (x <= 0) {
    return 0;
  }
  if (x >= 1) {
    return 1;
  }
  const xt2 = 1 - x;
  const y2 = xt2 * (xt2 * (xt2 * (xt2 * (xt2 * (xt2 * (xt2 * -6 + 7))))));
  return saturate$1(1 - y2);
}
function linearstep(a, b, x) {
  return saturate$1((x - a) / (b - a));
}
const INV_SQRT2 = 1 / Math.sqrt(2);
const VEC3_XP$1 = new Vector3(1, 0, 0);
const VEC3_YP$1 = new Vector3(0, 1, 0);
const VEC3_ZP$1 = new Vector3(0, 0, 1);
const QUAT_IDENTITY$1 = new Quaternion(0, 0, 0, 1);
const QUAT_TOP = new Quaternion(INV_SQRT2, 0, 0, INV_SQRT2);
const QUAT_RIGHT = new Quaternion(0, -INV_SQRT2, 0, INV_SQRT2);
const QUAT_BOTTOM = new Quaternion(-INV_SQRT2, 0, 0, INV_SQRT2);
const QUAT_LEFT = new Quaternion(0, INV_SQRT2, 0, INV_SQRT2);
const QUAT_BACK = new Quaternion(0, 1, 0, 0);
class RotationInputGizmoController {
  constructor(doc, config) {
    this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.mode_ = createValue("free");
    this.view = new RotationInputGizmoView(doc, {
      value: this.value,
      mode: this.mode_,
      viewProps: this.viewProps,
      pickerLayout: config.pickerLayout
    });
    this.ptHandler_ = new PointerHandler(this.view.padElement);
    this.ptHandler_.emitter.on("down", this.onPointerDown_);
    this.ptHandler_.emitter.on("move", this.onPointerMove_);
    this.ptHandler_.emitter.on("up", this.onPointerUp_);
    this.view.padElement.addEventListener("keydown", this.onPadKeyDown_);
    const ptHandlerXArcB = new PointerHandler(this.view.xArcBElement);
    ptHandlerXArcB.emitter.on("down", () => this.changeModeIfNotAuto_("angle-x"));
    ptHandlerXArcB.emitter.on("up", () => this.changeModeIfNotAuto_("free"));
    const ptHandlerXArcF = new PointerHandler(this.view.xArcFElement);
    ptHandlerXArcF.emitter.on("down", () => this.changeModeIfNotAuto_("angle-x"));
    ptHandlerXArcF.emitter.on("up", () => this.changeModeIfNotAuto_("free"));
    const ptHandlerYArcB = new PointerHandler(this.view.yArcBElement);
    ptHandlerYArcB.emitter.on("down", () => this.changeModeIfNotAuto_("angle-y"));
    ptHandlerYArcB.emitter.on("up", () => this.changeModeIfNotAuto_("free"));
    const ptHandlerYArcF = new PointerHandler(this.view.yArcFElement);
    ptHandlerYArcF.emitter.on("down", () => this.changeModeIfNotAuto_("angle-y"));
    ptHandlerYArcF.emitter.on("up", () => this.changeModeIfNotAuto_("free"));
    const ptHandlerZArcB = new PointerHandler(this.view.zArcBElement);
    ptHandlerZArcB.emitter.on("down", () => this.changeModeIfNotAuto_("angle-z"));
    ptHandlerZArcB.emitter.on("up", () => this.changeModeIfNotAuto_("free"));
    const ptHandlerZArcF = new PointerHandler(this.view.zArcFElement);
    ptHandlerZArcF.emitter.on("down", () => this.changeModeIfNotAuto_("angle-z"));
    ptHandlerZArcF.emitter.on("up", () => this.changeModeIfNotAuto_("free"));
    const ptHandlerRArc = new PointerHandler(this.view.rArcElement);
    ptHandlerRArc.emitter.on("down", () => this.changeModeIfNotAuto_("angle-r"));
    ptHandlerRArc.emitter.on("up", () => this.changeModeIfNotAuto_("free"));
    [
      { el: this.view.xLabel, q: QUAT_RIGHT },
      { el: this.view.yLabel, q: QUAT_TOP },
      { el: this.view.zLabel, q: QUAT_IDENTITY$1 },
      { el: this.view.xnLabel, q: QUAT_LEFT },
      { el: this.view.ynLabel, q: QUAT_BOTTOM },
      { el: this.view.znLabel, q: QUAT_BACK }
    ].forEach(({ el, q }) => {
      const ptHandler = new PointerHandler(el);
      ptHandler.emitter.on("down", () => this.autoRotate_(q));
    });
    this.px_ = null;
    this.py_ = null;
    this.angleState_ = null;
  }
  handlePointerEvent_(d) {
    if (!d.point) {
      return;
    }
    const mode = this.mode_.rawValue;
    const x = d.point.x;
    const y2 = d.point.y;
    if (mode === "auto") ;
    else if (mode === "free") {
      if (this.px_ != null && this.py_ != null) {
        const dx = x - this.px_;
        const dy = y2 - this.py_;
        const l = Math.sqrt(dx * dx + dy * dy);
        if (l === 0) {
          return;
        }
        const axis = new Vector3(dy / l, dx / l, 0);
        const quat = Quaternion.fromAxisAngle(axis, l / 68);
        this.value.rawValue = this.value.rawValue.premultiply(quat);
      }
      this.px_ = x;
      this.py_ = y2;
    } else if (mode === "angle-r") {
      const cx = d.bounds.width / 2;
      const cy = d.bounds.height / 2;
      const angle = Math.atan2(y2 - cy, x - cx);
      if (this.angleState_ == null) {
        const axis = new Vector3(0, 0, 1);
        this.angleState_ = {
          initialRotation: this.value.rawValue,
          initialAngle: angle,
          axis,
          reverseAngle: true
        };
      } else {
        const { initialRotation, initialAngle, axis } = this.angleState_;
        const angleDiff = -sanitizeAngle(angle - initialAngle);
        const quat = Quaternion.fromAxisAngle(axis, angleDiff);
        this.value.rawValue = initialRotation.premultiply(quat);
      }
    } else {
      const cx = d.bounds.width / 2;
      const cy = d.bounds.height / 2;
      const angle = Math.atan2(y2 - cy, x - cx);
      if (this.angleState_ == null) {
        const axis = mode === "angle-x" ? VEC3_XP$1 : mode === "angle-y" ? VEC3_YP$1 : VEC3_ZP$1;
        const reverseAngle = axis.applyQuaternion(this.value.rawValue.quat).z > 0;
        this.angleState_ = {
          initialRotation: this.value.rawValue,
          initialAngle: angle,
          axis,
          reverseAngle
        };
      } else {
        const { initialRotation, initialAngle, axis, reverseAngle } = this.angleState_;
        let angleDiff = sanitizeAngle(angle - initialAngle);
        angleDiff = reverseAngle ? -angleDiff : angleDiff;
        const quat = Quaternion.fromAxisAngle(axis, angleDiff);
        this.value.rawValue = initialRotation.multiply(quat);
      }
    }
  }
  onPointerDown_(ev) {
    this.handlePointerEvent_(ev.data);
  }
  onPointerMove_(ev) {
    this.handlePointerEvent_(ev.data);
  }
  onPointerUp_() {
    this.px_ = null;
    this.py_ = null;
    this.angleState_ = null;
  }
  onPadKeyDown_(ev) {
    if (isArrowKey(ev.key)) {
      ev.preventDefault();
    }
    const x = getStepForKey(1, getHorizontalStepKeys(ev));
    const y2 = getStepForKey(1, getVerticalStepKeys(ev));
    if (x !== 0 || y2 !== 0) {
      const axis = new Vector3(-y2, x, 0);
      const quat = Quaternion.fromAxisAngle(axis, Math.PI / 16);
      this.value.rawValue = this.value.rawValue.premultiply(quat);
    }
  }
  changeModeIfNotAuto_(mode) {
    if (this.mode_.rawValue !== "auto") {
      this.mode_.rawValue = mode;
    }
  }
  autoRotate_(to) {
    this.mode_.rawValue = "auto";
    const from = this.value.rawValue;
    const beginTime = Date.now();
    const update2 = () => {
      const now = Date.now();
      const t = iikanjiEaseout(linearstep(0, 300, now - beginTime));
      this.value.rawValue = from.slerp(to, t);
      if (t === 1) {
        this.mode_.rawValue = "free";
        return;
      }
      requestAnimationFrame(update2);
    };
    requestAnimationFrame(update2);
  }
}
const className$1$2 = ClassName("rotationswatch");
const VEC3_XP = new Vector3(1, 0, 0);
const VEC3_YP = new Vector3(0, 1, 0);
const VEC3_ZP = new Vector3(0, 0, 1);
const QUAT_IDENTITY = new Quaternion(0, 0, 0, 1);
class RotationInputSwatchView {
  constructor(doc, config) {
    this.onValueChange_ = this.onValueChange_.bind(this);
    config.value.emitter.on("change", this.onValueChange_);
    this.value = config.value;
    this.element = doc.createElement("div");
    this.element.classList.add(className$1$2());
    config.viewProps.bindClassModifiers(this.element);
    const buttonElem = doc.createElement("button");
    buttonElem.classList.add(className$1$2("b"));
    config.viewProps.bindDisabled(buttonElem);
    this.element.appendChild(buttonElem);
    this.buttonElement = buttonElem;
    const svgElem = doc.createElementNS(SVG_NS, "svg");
    svgElem.classList.add(className$1$2("g"));
    buttonElem.appendChild(svgElem);
    this.svgElem_ = svgElem;
    this.projector_ = new PointProjector();
    this.projector_.viewport = [0, 0, 20, 20];
    const arcArray = createArcVerticesArray(0, Math.PI, 33, "x", "y");
    const arcArrayR = createArcVerticesArray(0, 2 * Math.PI, 65, "x", "y");
    this.rArc_ = new SVGLineStrip(doc, arcArrayR, this.projector_);
    this.rArc_.element.classList.add(className$1$2("arcr"));
    svgElem.appendChild(this.rArc_.element);
    this.rArc_.setRotation(QUAT_IDENTITY);
    this.xArc_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.xArc_.element.classList.add(className$1$2("arc"));
    svgElem.appendChild(this.xArc_.element);
    this.yArc_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.yArc_.element.classList.add(className$1$2("arc"));
    svgElem.appendChild(this.yArc_.element);
    this.zArc_ = new SVGLineStrip(doc, arcArray, this.projector_);
    this.zArc_.element.classList.add(className$1$2("arc"));
    svgElem.appendChild(this.zArc_.element);
    this.update_();
  }
  update_() {
    const q = this.value.rawValue.quat.normalized;
    const xp = VEC3_XP.applyQuaternion(q);
    const yp = VEC3_YP.applyQuaternion(q);
    const zp = VEC3_ZP.applyQuaternion(q);
    this.xArc_.setRotation(createArcRotation(xp, VEC3_ZP));
    this.yArc_.setRotation(createArcRotation(yp, VEC3_ZP));
    this.zArc_.setRotation(createArcRotation(zp, VEC3_ZP));
  }
  onValueChange_() {
    this.update_();
  }
}
class RotationInputSwatchController {
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new RotationInputSwatchView(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
  }
}
const className$4 = ClassName("rotation");
class RotationInputView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$4());
    config.foldable.bindExpandedClass(this.element, className$4(void 0, "expanded"));
    bindValueMap(config.foldable, "completed", valueToClassName(this.element, className$4(void 0, "cpl")));
    if (config.rotationMode === "quaternion") {
      this.element.classList.add(className$4("quat"));
    }
    const headElem = doc.createElement("div");
    headElem.classList.add(className$4("h"));
    this.element.appendChild(headElem);
    const swatchElem = doc.createElement("div");
    swatchElem.classList.add(className$4("s"));
    headElem.appendChild(swatchElem);
    this.swatchElement = swatchElem;
    const textElem = doc.createElement("div");
    textElem.classList.add(className$4("t"));
    headElem.appendChild(textElem);
    this.textElement = textElem;
    if (config.pickerLayout === "inline") {
      const pickerElem = doc.createElement("div");
      pickerElem.classList.add(className$4("g"));
      this.element.appendChild(pickerElem);
      this.pickerElement = pickerElem;
    } else {
      this.pickerElement = null;
    }
  }
}
class RotationInputController {
  constructor(doc, config) {
    this.onButtonBlur_ = this.onButtonBlur_.bind(this);
    this.onButtonClick_ = this.onButtonClick_.bind(this);
    this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
    this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.foldable_ = Foldable.create(config.expanded);
    this.swatchC_ = new RotationInputSwatchController(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    const buttonElem = this.swatchC_.view.buttonElement;
    buttonElem.addEventListener("blur", this.onButtonBlur_);
    buttonElem.addEventListener("click", this.onButtonClick_);
    this.textC_ = new PointNdTextController(doc, {
      assembly: config.assembly,
      // TODO: resolve type puzzle
      axes: config.axes,
      parser: config.parser,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view = new RotationInputView(doc, {
      rotationMode: config.rotationMode,
      foldable: this.foldable_,
      pickerLayout: config.pickerLayout
    });
    this.view.swatchElement.appendChild(this.swatchC_.view.element);
    this.view.textElement.appendChild(this.textC_.view.element);
    this.popC_ = config.pickerLayout === "popup" ? new PopupController(doc, {
      viewProps: this.viewProps
    }) : null;
    const gizmoC = new RotationInputGizmoController(doc, {
      value: this.value,
      viewProps: this.viewProps,
      pickerLayout: config.pickerLayout
    });
    gizmoC.view.allFocusableElements.forEach((elem) => {
      elem.addEventListener("blur", this.onPopupChildBlur_);
      elem.addEventListener("keydown", this.onPopupChildKeydown_);
    });
    this.gizmoC_ = gizmoC;
    if (this.popC_) {
      this.view.element.appendChild(this.popC_.view.element);
      this.popC_.view.element.appendChild(gizmoC.view.element);
      connectValues({
        primary: this.foldable_.value("expanded"),
        secondary: this.popC_.shows,
        forward: (p) => p,
        backward: (_, s) => s
      });
    } else if (this.view.pickerElement) {
      this.view.pickerElement.appendChild(this.gizmoC_.view.element);
      bindFoldable(this.foldable_, this.view.pickerElement);
    }
  }
  onButtonBlur_(e) {
    if (!this.popC_) {
      return;
    }
    const elem = this.view.element;
    const nextTarget = forceCast(e.relatedTarget);
    if (!nextTarget || !elem.contains(nextTarget)) {
      this.popC_.shows.rawValue = false;
    }
  }
  onButtonClick_() {
    this.foldable_.set("expanded", !this.foldable_.get("expanded"));
    if (this.foldable_.get("expanded")) {
      this.gizmoC_.view.allFocusableElements[0].focus();
    }
  }
  onPopupChildBlur_(ev) {
    if (!this.popC_) {
      return;
    }
    const elem = this.popC_.view.element;
    const nextTarget = findNextTarget(ev);
    if (nextTarget && elem.contains(nextTarget)) {
      return;
    }
    if (nextTarget && nextTarget === this.swatchC_.view.buttonElement && !supportsTouch(elem.ownerDocument)) {
      return;
    }
    this.popC_.shows.rawValue = false;
  }
  onPopupChildKeydown_(ev) {
    if (this.popC_) {
      if (ev.key === "Escape") {
        this.popC_.shows.rawValue = false;
      }
    } else if (this.view.pickerElement) {
      if (ev.key === "Escape") {
        this.swatchC_.view.buttonElement.focus();
      }
    }
  }
}
function createAxisEuler(digits, constraint) {
  const step = Math.pow(0.1, digits);
  return {
    baseStep: step,
    constraint,
    textProps: ValueMap.fromObject({
      formatter: createNumberFormatter(digits),
      keyScale: step,
      pointerScale: step
    })
  };
}
function createDimensionConstraint(params) {
  if (!params) {
    return void 0;
  }
  const constraints = [];
  if (!isEmpty(params.step)) {
    constraints.push(new StepConstraint(params.step));
  }
  if (!isEmpty(params.max) || !isEmpty(params.min)) {
    constraints.push(new RangeConstraint({
      max: params.max,
      min: params.min
    }));
  }
  return new CompositeConstraint(constraints);
}
function createEulerAssembly(order, unit) {
  return {
    toComponents: (r) => r.getComponents(),
    fromComponents: (c) => new Euler(c[0], c[1], c[2], order, unit)
  };
}
function parseEuler(exValue, order, unit) {
  if (typeof (exValue === null || exValue === void 0 ? void 0 : exValue.x) === "number" && typeof (exValue === null || exValue === void 0 ? void 0 : exValue.y) === "number" && typeof (exValue === null || exValue === void 0 ? void 0 : exValue.z) === "number") {
    return new Euler(exValue.x, exValue.y, exValue.z, order, unit);
  } else {
    return new Euler(0, 0, 0, order, unit);
  }
}
function parseEulerOrder(value) {
  switch (value) {
    case "XYZ":
    case "XZY":
    case "YXZ":
    case "YZX":
    case "ZXY":
    case "ZYX":
      return value;
    default:
      return void 0;
  }
}
function parseEulerUnit(value) {
  switch (value) {
    case "rad":
    case "deg":
    case "turn":
      return value;
    default:
      return void 0;
  }
}
createPlugin({
  id: "rotation",
  type: "input",
  accept(exValue, params) {
    var _a, _b;
    const result = parseRecord(params, (p) => ({
      view: p.required.constant("rotation"),
      label: p.optional.string,
      picker: p.optional.custom(parsePickerLayout),
      expanded: p.optional.boolean,
      rotationMode: p.required.constant("euler"),
      x: p.optional.custom(parsePointDimensionParams),
      y: p.optional.custom(parsePointDimensionParams),
      z: p.optional.custom(parsePointDimensionParams),
      order: p.optional.custom(parseEulerOrder),
      unit: p.optional.custom(parseEulerUnit)
    }));
    return result ? {
      initialValue: parseEuler(exValue, (_a = result.order) !== null && _a !== void 0 ? _a : "XYZ", (_b = result.unit) !== null && _b !== void 0 ? _b : "rad"),
      params: result
    } : null;
  },
  binding: {
    reader({ params }) {
      return (exValue) => {
        var _a, _b;
        return parseEuler(exValue, (_a = params.order) !== null && _a !== void 0 ? _a : "XYZ", (_b = params.unit) !== null && _b !== void 0 ? _b : "rad");
      };
    },
    constraint({ params }) {
      var _a, _b;
      return new PointNdConstraint({
        assembly: createEulerAssembly((_a = params.order) !== null && _a !== void 0 ? _a : "XYZ", (_b = params.unit) !== null && _b !== void 0 ? _b : "rad"),
        components: [
          createDimensionConstraint("x" in params ? params.x : void 0),
          createDimensionConstraint("y" in params ? params.y : void 0),
          createDimensionConstraint("z" in params ? params.z : void 0)
        ]
      });
    },
    writer(_args) {
      return (target, inValue) => {
        target.writeProperty("x", inValue.x);
        target.writeProperty("y", inValue.y);
        target.writeProperty("z", inValue.z);
      };
    }
  },
  controller({ document: document2, value, constraint, params, viewProps }) {
    var _a, _b;
    if (!(constraint instanceof PointNdConstraint)) {
      throw TpError.shouldNeverHappen();
    }
    const expanded = "expanded" in params ? params.expanded : void 0;
    const picker = "picker" in params ? params.picker : void 0;
    const unit = (_a = params.unit) !== null && _a !== void 0 ? _a : "rad";
    const digits = {
      rad: 2,
      deg: 0,
      turn: 2
    }[unit];
    return new RotationInputController(document2, {
      axes: [
        createAxisEuler(digits, constraint.components[0]),
        createAxisEuler(digits, constraint.components[1]),
        createAxisEuler(digits, constraint.components[2])
      ],
      assembly: createEulerAssembly((_b = params.order) !== null && _b !== void 0 ? _b : "XYZ", unit),
      rotationMode: "euler",
      expanded: expanded !== null && expanded !== void 0 ? expanded : false,
      parser: parseNumber,
      pickerLayout: picker !== null && picker !== void 0 ? picker : "popup",
      value,
      viewProps
    });
  }
});
const QuaternionAssembly = {
  toComponents: (r) => [
    r.x,
    r.y,
    r.z,
    r.w
  ],
  fromComponents: (c) => new Quaternion(c[0], c[1], c[2], c[3])
};
function createAxisQuaternion(constraint) {
  return {
    baseStep: 0.01,
    constraint,
    textProps: ValueMap.fromObject({
      formatter: (value) => {
        if (Math.abs(value) < 0.995) {
          return value.toFixed(2).replace("0.", ".");
        } else {
          return value.toFixed(1);
        }
      },
      keyScale: 0.01,
      pointerScale: 0.01
    })
  };
}
function parseQuaternion(exValue) {
  if (typeof (exValue === null || exValue === void 0 ? void 0 : exValue.x) === "number" && typeof (exValue === null || exValue === void 0 ? void 0 : exValue.y) === "number" && typeof (exValue === null || exValue === void 0 ? void 0 : exValue.z) === "number" && typeof (exValue === null || exValue === void 0 ? void 0 : exValue.w) === "number") {
    return new Quaternion(exValue.x, exValue.y, exValue.z, exValue.w);
  } else {
    return new Quaternion(0, 0, 0, 1);
  }
}
createPlugin({
  id: "rotation",
  type: "input",
  accept(exValue, params) {
    const result = parseRecord(params, (p) => ({
      view: p.required.constant("rotation"),
      label: p.optional.string,
      picker: p.optional.custom(parsePickerLayout),
      expanded: p.optional.boolean,
      rotationMode: p.optional.constant("quaternion"),
      x: p.optional.custom(parsePointDimensionParams),
      y: p.optional.custom(parsePointDimensionParams),
      z: p.optional.custom(parsePointDimensionParams),
      w: p.optional.custom(parsePointDimensionParams)
    }));
    return result ? {
      initialValue: parseQuaternion(exValue),
      params: result
    } : null;
  },
  binding: {
    reader(_args) {
      return (exValue) => {
        return parseQuaternion(exValue);
      };
    },
    constraint({ params }) {
      return new PointNdConstraint({
        assembly: QuaternionAssembly,
        components: [
          createDimensionConstraint("x" in params ? params.x : void 0),
          createDimensionConstraint("y" in params ? params.y : void 0),
          createDimensionConstraint("z" in params ? params.z : void 0),
          createDimensionConstraint("w" in params ? params.w : void 0)
        ]
      });
    },
    writer(_args) {
      return (target, inValue) => {
        target.writeProperty("x", inValue.x);
        target.writeProperty("y", inValue.y);
        target.writeProperty("z", inValue.z);
        target.writeProperty("w", inValue.w);
      };
    }
  },
  controller({ document: document2, value, constraint, params, viewProps }) {
    if (!(constraint instanceof PointNdConstraint)) {
      throw TpError.shouldNeverHappen();
    }
    const expanded = "expanded" in params ? params.expanded : void 0;
    const picker = "picker" in params ? params.picker : void 0;
    return new RotationInputController(document2, {
      axes: [
        createAxisQuaternion(constraint.components[0]),
        createAxisQuaternion(constraint.components[1]),
        createAxisQuaternion(constraint.components[2]),
        createAxisQuaternion(constraint.components[3])
      ],
      assembly: QuaternionAssembly,
      rotationMode: "quaternion",
      expanded: expanded !== null && expanded !== void 0 ? expanded : false,
      parser: parseNumber,
      pickerLayout: picker !== null && picker !== void 0 ? picker : "popup",
      value,
      viewProps
    });
  }
});
const Slider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "wide"]);
  let { value } = $$props;
  let { wide = void 0 } = $$props;
  let ref;
  function updateWide(wide2) {
    const inputField = ref?.element.querySelector("div.tp-sldtxtv_t");
    if (wide2) {
      inputField?.style.setProperty("display", "none");
    } else {
      inputField?.style.removeProperty("display");
    }
  }
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.wide === void 0 && $$bindings.wide && wide !== void 0) $$bindings.wide(wide);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ref && wide !== void 0 && updateWide(wide);
    $$rendered = `${validate_component(GenericSlider, "GenericSlider").$$render(
      $$result,
      Object.assign({}, $$restProps, { value }, { ref }),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        ref: ($$value) => {
          ref = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
class StepperConstraint {
  constructor(step, edge) {
    this.step = step;
    this.edge = edge;
  }
  constrain(value) {
    var _a, _b;
    return (_b = (_a = this.edge) === null || _a === void 0 ? void 0 : _a.constrain(value)) !== null && _b !== void 0 ? _b : value;
  }
}
const StepperAssembly = {
  fromComponents: (comps) => comps[0],
  toComponents: (p) => [p]
};
const className$1$1 = ClassName("step");
class StepperTextView {
  constructor(doc, config) {
    this.buttonsView_ = config.buttonsView;
    this.textView_ = config.textView;
    this.element = doc.createElement("div");
    this.element.classList.add(className$1$1());
    const buttonsElem = doc.createElement("div");
    buttonsElem.classList.add(className$1$1("s"));
    buttonsElem.appendChild(this.buttonsView_.element);
    this.element.appendChild(buttonsElem);
    const textElem = doc.createElement("div");
    textElem.classList.add(className$1$1("t"));
    textElem.appendChild(this.textView_.element);
    this.element.appendChild(textElem);
  }
}
const className$3 = ClassName("step");
class StepperButtonsView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className$3());
    config.viewProps.bindClassModifiers(this.element);
    const btnMinus = doc.createElement("button");
    btnMinus.textContent = "-";
    btnMinus.classList.add(className$3("b"));
    config.viewProps.bindDisabled(btnMinus);
    this.element.appendChild(btnMinus);
    this.btnMinus = btnMinus;
    const btnPlus = doc.createElement("button");
    btnPlus.textContent = "+";
    btnPlus.classList.add(className$3("b"));
    config.viewProps.bindDisabled(btnPlus);
    this.element.appendChild(btnPlus);
    this.btnPlus = btnPlus;
  }
}
class StepperButtonsController {
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.step = config.constraint ? config.constraint.step : 1;
    this.view = new StepperButtonsView(doc, {
      value: this.value,
      viewProps: config.viewProps
    });
    this.view.btnMinus.addEventListener("click", () => {
      var _a;
      const v = (_a = this.value.rawValue) !== null && _a !== void 0 ? _a : 0;
      this.value.setRawValue(v - this.step, {
        forceEmit: true,
        last: true
      });
    });
    this.view.btnPlus.addEventListener("click", () => {
      var _a;
      const v = (_a = this.value.rawValue) !== null && _a !== void 0 ? _a : 0;
      this.value.setRawValue(v + this.step, {
        forceEmit: true,
        last: true
      });
    });
  }
}
class StepperTextController {
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.sc_ = new StepperButtonsController(doc, config);
    const axis = {
      constraint: config.constraint.edge,
      textProps: config.textProps
    };
    this.tc_ = new PointNdTextController(doc, {
      assembly: StepperAssembly,
      axes: [axis],
      parser: config.parser,
      value: this.value,
      viewProps: config.viewProps
    });
    this.view = new StepperTextView(doc, {
      buttonsView: this.sc_.view,
      textView: this.tc_.view
    });
  }
  get textController() {
    return this.tc_;
  }
}
createPlugin({
  id: "input-stepper",
  type: "input",
  accept: (exValue, params) => {
    if (typeof exValue !== "number") {
      return null;
    }
    const result = parseRecord(params, (p) => {
      var _a;
      return {
        // `view` option may be useful to provide a custom control for primitive values
        view: p.required.constant("stepper"),
        max: p.optional.number,
        min: p.optional.number,
        step: (_a = p.optional.number) !== null && _a !== void 0 ? _a : 1
      };
    });
    return result ? {
      initialValue: exValue,
      params: result
    } : null;
  },
  binding: {
    //reader: (_args) => stepperFromUnknown,
    //writer: (_args) => writeStepper,
    reader(_args) {
      return (exValue) => {
        return typeof exValue === "number" ? exValue : 0;
      };
    },
    writer(_args) {
      return (target, inValue) => {
        target.write(inValue);
      };
    },
    constraint(args) {
      const constraints = [];
      const cr = createRangeConstraint(args.params);
      if (cr) {
        constraints.push(cr);
      }
      const cs = createStepConstraint(args.params);
      if (cs) {
        constraints.push(cs);
      }
      return new StepperConstraint(args.params.step ? args.params.step : 1, new CompositeConstraint(constraints));
    }
  },
  controller(args) {
    const v = args.value;
    const c = args.constraint;
    if (!(c instanceof StepperConstraint)) {
      throw TpError.shouldNeverHappen();
    }
    const textProps = ValueMap.fromObject(createNumberTextPropsObject(args.params, v.rawValue));
    return new StepperTextController(args.document, {
      constraint: c,
      parser: parseNumber,
      textProps,
      value: v,
      viewProps: args.viewProps
    });
  }
});
const className$2 = ClassName("txtr");
class TextAreaView {
  constructor(doc, config) {
    this.onChange_ = this.onChange_.bind(this);
    this.element = doc.createElement("div");
    this.element.classList.add(className$2());
    config.viewProps.bindClassModifiers(this.element);
    const inputElem = doc.createElement("textarea");
    inputElem.rows = config.rows;
    inputElem.cols = 22;
    inputElem.placeholder = config.placeholder;
    inputElem.classList.add(className$2("i"));
    config.viewProps.bindDisabled(inputElem);
    this.element.appendChild(inputElem);
    this.inputElement = inputElem;
    config.value.emitter.on("change", this.onChange_);
    this.value_ = config.value;
    this.refresh();
  }
  refresh() {
    this.inputElement.value = this.value_.rawValue;
  }
  onChange_() {
    this.refresh();
  }
}
class TextAreaController {
  constructor(doc, config) {
    this.onInputChange_ = this.onInputChange_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.rows = config.rows;
    this.placeholder = config.placeholder;
    this.view = new TextAreaView(doc, {
      value: this.value,
      viewProps: this.viewProps,
      rows: this.rows,
      placeholder: this.placeholder
    });
    this.view.inputElement.addEventListener("keyup", this.onInputChange_);
  }
  onInputChange_(e) {
    const inputElem = forceCast(e.currentTarget);
    const value = inputElem.value;
    this.value.rawValue = value;
    this.view.refresh();
  }
}
createPlugin({
  id: "input-template",
  type: "input",
  accept(exValue, params) {
    if (typeof exValue !== "string") {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      // `view` option may be useful to provide a custom control for primitive values
      view: p.required.constant("textarea"),
      rows: p.optional.number,
      placeholder: p.optional.string
    }));
    if (!result) {
      return null;
    }
    return {
      initialValue: exValue,
      params: result
    };
  },
  binding: {
    reader(_args) {
      return (exValue) => {
        return typeof exValue === "string" ? exValue : "";
      };
    },
    writer(_args) {
      return (target, inValue) => {
        target.write(inValue);
      };
    }
  },
  controller(args) {
    var _a, _b;
    return new TextAreaController(args.document, {
      value: args.value,
      rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : 3,
      placeholder: (_b = args.params.placeholder) !== null && _b !== void 0 ? _b : "Enter text here",
      viewProps: args.viewProps
    });
  }
});
const Folder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $parentStore, $$unsubscribe_parentStore;
  let $folderStore, $$unsubscribe_folderStore;
  let { title = "Folder" } = $$props;
  let { disabled = false } = $$props;
  let { expanded = true } = $$props;
  let { userExpandable = true } = $$props;
  let { theme = void 0 } = $$props;
  const parentStore = getContext("parentStore");
  $$unsubscribe_parentStore = subscribe(parentStore, (value) => $parentStore = value);
  const folderStore = writable();
  $$unsubscribe_folderStore = subscribe(folderStore, (value) => $folderStore = value);
  const userCreatedPane = getContext("userCreatedPane");
  let index;
  let folderRef = void 0;
  setContext("parentStore", folderStore);
  function create() {
    set_store_value(folderStore, $folderStore = $parentStore.addFolder({ disabled, expanded, index, title }), $folderStore);
    $folderStore.on("fold", () => {
      expanded = $folderStore.expanded;
    });
    folderRef = $folderStore;
  }
  onDestroy(() => {
    $folderStore?.dispose();
  });
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded !== void 0) $$bindings.expanded(expanded);
  if ($$props.userExpandable === void 0 && $$bindings.userExpandable && userExpandable !== void 0) $$bindings.userExpandable(userExpandable);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    folderRef && (folderRef.title = title);
    folderRef && (folderRef.disabled = disabled);
    folderRef && expanded !== void 0 && (folderRef.expanded = expanded);
    $parentStore && !folderRef && index !== void 0 && create();
    folderRef && updateCollapsibility(userExpandable, folderRef.element, "tp-fldv_b", "tp-fldv_m");
    theme && $parentStore && (userCreatedPane || !isRootPane($parentStore)) && console.warn("Set theme on the <Pane> component, not on its children! (Check nested <Folder> components for a theme prop.)");
    $$rendered = `${parentStore ? `${`${validate_component(ClsPad, "ClsPad").$$render($$result, { keysAdd: ["containerUnitSize"], theme }, {}, {})} ${expanded ? `${validate_component(ClsPad, "ClsPad").$$render(
      $$result,
      {
        keysAdd: ["containerVerticalPadding", "containerVerticalPadding"],
        theme
      },
      {},
      {}
    )} ${slots.default ? slots.default({}) : ``}` : ``}`}` : `${validate_component(InternalPaneInline, "InternalPaneInline").$$render($$result, { theme, userCreatedPane: false }, {}, {
      default: () => {
        return `${validate_component(Folder, "svelte:self").$$render(
          $$result,
          {
            disabled,
            title,
            userExpandable,
            expanded
          },
          {
            expanded: ($$value) => {
              expanded = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `${slots.default ? slots.default({}) : ``}`;
            }
          }
        )}`;
      }
    })}`}`;
  } while (!$$settled);
  $$unsubscribe_parentStore();
  $$unsubscribe_folderStore();
  return $$rendered;
});
class ProfilerBladeApi extends BladeApi {
  measureStart(name) {
    this.controller.valueController.measureStart(name);
  }
  measureEnd() {
    return this.controller.valueController.measureEnd();
  }
  measure(name, fn) {
    this.controller.valueController.measure(name, fn);
  }
  measureAsync(name, fn) {
    return this.controller.valueController.measureAsync(name, fn);
  }
  get measureHandler() {
    return this.controller.valueController.measureHandler;
  }
  set measureHandler(measureHandler) {
    this.controller.valueController.measureHandler = measureHandler;
  }
}
class ProfilerBladeController extends BladeController {
  constructor(doc, config) {
    const bc = config.valueController;
    const lc = new LabelController(doc, {
      blade: config.blade,
      props: config.labelProps,
      valueController: bc
    });
    super({
      blade: config.blade,
      view: lc.view,
      viewProps: bc.viewProps
    });
    this.valueController = bc;
    this.labelController = lc;
  }
}
class ProfilerBladeDefaultMeasureHandler {
  measureStart() {
    const begin = performance.now();
    return () => performance.now() - begin;
  }
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
class ConsecutiveCacheMap {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
    this.keySet = /* @__PURE__ */ new Set();
  }
  get(key2) {
    return this.map.get(key2);
  }
  getOrCreate(key2, create) {
    if (!this.keySet.has(key2)) {
      this.keySet.add(key2);
    }
    let value = this.map.get(key2);
    if (value == null) {
      value = create();
      this.map.set(key2, value);
    }
    return value;
  }
  set(key2, value) {
    if (!this.keySet.has(key2)) {
      this.keySet.add(key2);
    }
    this.map.set(key2, value);
  }
  resetUsedSet() {
    this.keySet.clear();
  }
  vaporize(onVaporize) {
    for (const [key2, value] of this.map.entries()) {
      if (!this.keySet.has(key2)) {
        this.map.delete(key2);
        onVaporize === null || onVaporize === void 0 ? void 0 : onVaporize([key2, value]);
      }
    }
  }
}
function arrayClear(array) {
  array.splice(0, array.length);
}
function arraySum(array) {
  let sum = 0;
  array.forEach((v) => sum += v);
  return sum;
}
class HistoryMeanCalculator {
  constructor(length) {
    this.__recalcForEach = 0;
    this.__countUntilRecalc = 0;
    this.__history = [];
    this.__index = 0;
    this.__count = 0;
    this.__cache = 0;
    this.__length = length;
    this.__recalcForEach = length;
    for (let i = 0; i < length; i++) {
      this.__history[i] = 0;
    }
  }
  get mean() {
    const count = Math.min(this.__count, this.__length);
    return count === 0 ? 0 : this.__cache / count;
  }
  get recalcForEach() {
    return this.__recalcForEach;
  }
  set recalcForEach(value) {
    const delta = value - this.__recalcForEach;
    this.__recalcForEach = value;
    this.__countUntilRecalc = Math.max(0, this.__countUntilRecalc + delta);
  }
  reset() {
    this.__index = 0;
    this.__count = 0;
    this.__cache = 0;
    this.__countUntilRecalc = 0;
    for (let i = 0; i < this.__length; i++) {
      this.__history[i] = 0;
    }
  }
  push(value) {
    const prev = this.__history[this.__index];
    this.__history[this.__index] = value;
    this.__count++;
    this.__index = (this.__index + 1) % this.__length;
    if (this.__countUntilRecalc === 0) {
      this.recalc();
    } else {
      this.__countUntilRecalc--;
      this.__cache -= prev;
      this.__cache += value;
    }
  }
  recalc() {
    this.__countUntilRecalc = this.__recalcForEach;
    const sum = this.__history.slice(0, Math.min(this.__count, this.__length)).reduce((sum2, v) => sum2 + v, 0);
    this.__cache = sum;
  }
}
function binarySearch(array, elementOrCompare) {
  if (typeof elementOrCompare !== "function") {
    return binarySearch(array, (element) => element < elementOrCompare);
  }
  const compare = elementOrCompare;
  let start = 0;
  let end = array.length;
  while (start < end) {
    const center = start + end >> 1;
    const centerElement = array[center];
    const compareResult = compare(centerElement);
    if (compareResult) {
      start = center + 1;
    } else {
      end = center;
    }
  }
  return start;
}
class HistoryPercentileCalculator {
  constructor(length) {
    this.__history = [];
    this.__sorted = [];
    this.__index = 0;
    this.__length = length;
  }
  get median() {
    return this.percentile(50);
  }
  percentile(percentile) {
    if (this.__history.length === 0) {
      return 0;
    }
    return this.__sorted[Math.round(percentile * 0.01 * (this.__history.length - 1))];
  }
  reset() {
    this.__index = 0;
    this.__history = [];
    this.__sorted = [];
  }
  push(value) {
    const prev = this.__history[this.__index];
    this.__history[this.__index] = value;
    this.__index = (this.__index + 1) % this.__length;
    if (this.__sorted.length === this.__length) {
      const prevIndex = binarySearch(this.__sorted, prev);
      this.__sorted.splice(prevIndex, 1);
    }
    const index = binarySearch(this.__sorted, value);
    this.__sorted.splice(index, 0, value);
  }
}
function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}
function saturate(x) {
  return Math.min(Math.max(x, 0), 1);
}
function rgbArrayToCssString(array) {
  const arrayPrepared = array.map((v) => saturate(v) * 256);
  return `rgb( ${arrayPrepared.join(", ")} )`;
}
function genTurboColormap(x) {
  const v4KRed = [0.13572138, 4.6153926, -42.66032258, 132.13108234];
  const v4KGreen = [0.09140261, 2.19418839, 4.84296658, -14.18503333];
  const v4KBlue = [0.1066733, 12.64194608, -60.58204836, 110.36276771];
  const v2KRed = [-152.94239396, 59.28637943];
  const v2KGreen = [4.27729857, 2.82956604];
  const v2KBlue = [-89.90310912, 27.34824973];
  x = saturate(x);
  const v4 = [1, x, x * x, x * x * x];
  const v2 = [v4[2], v4[3]].map((v) => v * v4[2]);
  const color = [
    dot(v4, v4KRed) + dot(v2, v2KRed),
    dot(v4, v4KGreen) + dot(v2, v2KGreen),
    dot(v4, v4KBlue) + dot(v2, v2KBlue)
  ];
  return rgbArrayToCssString(color);
}
const className$1 = ClassName("profiler");
class ProfilerView {
  constructor(doc, config) {
    this.targetDelta = config.targetDelta;
    this.deltaUnit = config.deltaUnit;
    this.fractionDigits = config.fractionDigits;
    this.calcMode = config.calcMode;
    this.element = doc.createElement("div");
    this.element.classList.add(className$1());
    config.viewProps.bindClassModifiers(this.element);
    this.svgRootElement_ = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svgRootElement_.classList.add(className$1("root"));
    this.element.appendChild(this.svgRootElement_);
    this.entryContainerElement_ = doc.createElementNS("http://www.w3.org/2000/svg", "g");
    this.entryContainerElement_.classList.add(className$1("container"));
    this.entryContainerElement_.setAttribute("transform", "translate( 1, 1 )");
    this.svgRootElement_.appendChild(this.entryContainerElement_);
    this.tooltipElement_ = doc.createElement("div");
    this.tooltipElement_.classList.add(className$1("tooltip"));
    this.tooltipElement_.style.display = "none";
    this.element.appendChild(this.tooltipElement_);
    this.tooltipInsideElement_ = doc.createElement("div");
    this.tooltipInsideElement_.classList.add(className$1("tooltipinside"));
    this.tooltipElement_.appendChild(this.tooltipInsideElement_);
    this.labelElement_ = doc.createElement("div");
    this.labelElement_.classList.add(className$1("label"));
    this.labelElement_.textContent = this.deltaToDisplayDelta_(0);
    this.element.appendChild(this.labelElement_);
    this.entryElementCacheMap_ = new ConsecutiveCacheMap();
    this.hoveringEntry_ = null;
  }
  update(rootEntry) {
    const rootEntryDelta = this.entryToDelta_(rootEntry);
    this.labelElement_.textContent = this.deltaToDisplayDelta_(rootEntryDelta);
    this.entryElementCacheMap_.resetUsedSet();
    const unit = 160 / Math.max(this.targetDelta, rootEntryDelta);
    let x = 0;
    for (const child of rootEntry.children) {
      const childElement = this.addEntry_(child, "", this.entryContainerElement_, unit);
      childElement.setAttribute("transform", `translate( ${x}, ${0} )`);
      x += this.entryToDelta_(child) * unit;
    }
    this.entryElementCacheMap_.vaporize(([path, element]) => {
      element.remove();
      if (this.hoveringEntry_ === path) {
        this.hoveringEntry_ = null;
      }
    });
    this.updateTooltip_();
  }
  updateTooltip_() {
    const path = this.hoveringEntry_;
    if (path) {
      const element = this.entryElementCacheMap_.get(path);
      const dataDelta = element === null || element === void 0 ? void 0 : element.getAttribute("data-delta");
      const displayDelta = this.deltaToDisplayDelta_(parseFloat(dataDelta !== null && dataDelta !== void 0 ? dataDelta : "0.0"));
      const text = `${path}
${displayDelta}`;
      this.tooltipElement_.style.display = "block";
      this.tooltipInsideElement_.textContent = text;
    } else {
      this.tooltipElement_.style.display = "none";
    }
  }
  addEntry_(entry, parentPath, parent, unit) {
    const path = `${parentPath}/${entry.name}`;
    const g = this.entryElementCacheMap_.getOrCreate(path, () => {
      const newG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      newG.classList.add(className$1("entry"));
      parent.appendChild(newG);
      this.entryElementCacheMap_.set(path, newG);
      const rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect2.classList.add(className$1("entryrect"));
      newG.appendChild(rect2);
      rect2.addEventListener("mouseenter", () => {
        this.hoveringEntry_ = path;
        this.updateTooltip_();
      });
      rect2.addEventListener("mouseleave", () => {
        this.hoveringEntry_ = null;
        this.updateTooltip_();
      });
      return newG;
    });
    const delta = this.entryToDelta_(entry);
    g.setAttribute("data-delta", `${delta}`);
    const rect = g.childNodes[0];
    rect.setAttribute("width", `${Math.max(0.01, delta * unit - 1)}px`);
    rect.setAttribute("height", `${9}px`);
    const turboX = 0.15 + 0.7 * saturate(delta / this.targetDelta);
    rect.setAttribute("fill", genTurboColormap(turboX));
    if (entry.children.length > 0) {
      let x = 0;
      entry.children.forEach((child) => {
        const childElement = this.addEntry_(child, path, g, unit);
        childElement.setAttribute("transform", `translate( ${x}, ${10} )`);
        x += this.entryToDelta_(child) * unit;
      });
    }
    return g;
  }
  entryToDelta_(entry) {
    if (this.calcMode === "frame") {
      return entry.delta;
    } else if (this.calcMode === "mean") {
      return entry.deltaMean;
    } else if (this.calcMode === "median") {
      return entry.deltaMedian;
    } else {
      throw new Error('Unreachable! calcMode must be one of "frame", "mean", or "median"');
    }
  }
  deltaToDisplayDelta_(delta) {
    return `${delta.toFixed(this.fractionDigits)} ${this.deltaUnit}`;
  }
}
class ProfilerController {
  constructor(doc, config) {
    this.targetDelta = config.targetDelta;
    this.bufferSize = config.bufferSize;
    this.onTick_ = this.onTick_.bind(this);
    this.ticker_ = config.ticker;
    this.ticker_.emitter.on("tick", this.onTick_);
    this.viewProps = config.viewProps;
    this.view = new ProfilerView(doc, {
      targetDelta: this.targetDelta,
      deltaUnit: config.deltaUnit,
      fractionDigits: config.fractionDigits,
      calcMode: config.calcMode,
      viewProps: this.viewProps
    });
    this.viewProps.handleDispose(() => {
      this.ticker_.dispose();
    });
    this.measureHandler = config.measureHandler;
    this.rootCalcCacheStack_ = [this.createNewEntryCalcCache_()];
  }
  measureStart(name) {
    const parentCalcCache = this.rootCalcCacheStack_[this.rootCalcCacheStack_.length - 1];
    const calcCache = parentCalcCache.childrenCacheMap.getOrCreate(name, () => this.createNewEntryCalcCache_());
    calcCache.childrenCacheMap.resetUsedSet();
    arrayClear(calcCache.childrenPromiseDelta);
    this.rootCalcCacheStack_.push(calcCache);
    calcCache.measureEnd = this.measureHandler.measureStart();
  }
  measureEnd() {
    return __awaiter(this, void 0, void 0, function* () {
      const calcCache = this.rootCalcCacheStack_[this.rootCalcCacheStack_.length - 1];
      const parentCalcCache = this.rootCalcCacheStack_[this.rootCalcCacheStack_.length - 2];
      const promiseDelta = Promise.resolve(calcCache.measureEnd());
      calcCache.measureEnd = null;
      parentCalcCache.childrenPromiseDelta.push(promiseDelta);
      this.rootCalcCacheStack_.pop();
      calcCache.childrenCacheMap.vaporize();
      const children = yield Promise.all(calcCache.childrenPromiseDelta);
      const sumChildrenDelta = arraySum(children);
      const selfDelta = (yield promiseDelta) - sumChildrenDelta;
      calcCache.meanCalc.push(selfDelta);
      calcCache.medianCalc.push(selfDelta);
      calcCache.latest = selfDelta;
    });
  }
  measure(name, fn) {
    this.measureStart(name);
    fn();
    this.measureEnd();
  }
  measureAsync(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
      this.measureStart(name);
      yield fn();
      this.measureEnd();
    });
  }
  renderEntry() {
    return this.renderEntryFromCalcCache_("", this.rootCalcCacheStack_[0]);
  }
  renderEntryFromCalcCache_(name, calcCache) {
    const children = [];
    for (const childName of calcCache.childrenCacheMap.keySet) {
      const child = calcCache.childrenCacheMap.get(childName);
      children.push(this.renderEntryFromCalcCache_(childName, child));
    }
    const selfDelta = calcCache.latest;
    const selfDeltaMean = calcCache.meanCalc.mean;
    const selfDeltaMedian = calcCache.medianCalc.median;
    const childrenDeltaSum = arraySum(children.map((child) => child.delta));
    const childrenDeltaMeanSum = arraySum(children.map((child) => child.deltaMean));
    const childrenDeltaMedianSum = arraySum(children.map((child) => child.deltaMedian));
    const delta = selfDelta + childrenDeltaSum;
    const deltaMean = selfDeltaMean + childrenDeltaMeanSum;
    const deltaMedian = selfDeltaMedian + childrenDeltaMedianSum;
    return {
      name,
      delta,
      deltaMean,
      deltaMedian,
      selfDelta,
      selfDeltaMean,
      selfDeltaMedian,
      children
    };
  }
  onTick_() {
    this.view.update(this.renderEntry());
  }
  createNewEntryCalcCache_() {
    return {
      meanCalc: new HistoryMeanCalculator(this.bufferSize),
      medianCalc: new HistoryPercentileCalculator(this.bufferSize),
      latest: 0,
      measureEnd: null,
      childrenCacheMap: new ConsecutiveCacheMap(),
      childrenPromiseDelta: []
    };
  }
}
function createTicker(document2, interval) {
  return interval === 0 ? new ManualTicker() : new IntervalTicker(document2, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
}
function parseCalcMode(value) {
  switch (value) {
    case "frame":
    case "mean":
    case "median":
      return value;
    default:
      return void 0;
  }
}
function parseMeasureHandler(value) {
  if (typeof value === "object" && value != null && "measureStart" in value) {
    return value;
  } else {
    if (typeof value === "object" && value != null && "measure" in value) {
      console.warn("The API of `ProfilerBladeDefaultMeasureHandler` has been changed in v0.4.0! Please define `measureStart` instead of `measure`. Fallback to the default measure handler.");
    }
    return void 0;
  }
}
createPlugin({
  id: "profiler",
  type: "blade",
  accept(params) {
    const result = parseRecord(params, (p) => ({
      view: p.required.constant("profiler"),
      targetDelta: p.optional.number,
      bufferSize: p.optional.number,
      deltaUnit: p.optional.string,
      fractionDigits: p.optional.number,
      calcMode: p.optional.custom(parseCalcMode),
      label: p.optional.string,
      interval: p.optional.number,
      measureHandler: p.optional.custom(parseMeasureHandler)
    }));
    return result ? { params: result } : null;
  },
  controller(args) {
    var _a, _b, _c, _d, _e, _f, _g;
    const interval = (_a = args.params.interval) !== null && _a !== void 0 ? _a : 500;
    const targetDelta = (_b = args.params.targetDelta) !== null && _b !== void 0 ? _b : 16.67;
    const bufferSize = (_c = args.params.bufferSize) !== null && _c !== void 0 ? _c : 30;
    const deltaUnit = (_d = args.params.deltaUnit) !== null && _d !== void 0 ? _d : "ms";
    const fractionDigits = (_e = args.params.fractionDigits) !== null && _e !== void 0 ? _e : 2;
    const calcMode = (_f = args.params.calcMode) !== null && _f !== void 0 ? _f : "mean";
    const measureHandler = (_g = args.params.measureHandler) !== null && _g !== void 0 ? _g : new ProfilerBladeDefaultMeasureHandler();
    return new ProfilerBladeController(args.document, {
      blade: args.blade,
      labelProps: ValueMap.fromObject({
        label: args.params.label
      }),
      valueController: new ProfilerController(args.document, {
        ticker: createTicker(args.document, interval),
        targetDelta,
        bufferSize,
        deltaUnit,
        fractionDigits,
        calcMode,
        viewProps: args.viewProps,
        measureHandler
      })
    });
  },
  api(args) {
    if (!(args.controller instanceof ProfilerBladeController)) {
      return null;
    }
    return new ProfilerBladeApi(args.controller);
  }
});
class LinearDrawerProvider {
  constructor() {
    this.drawer = (point) => `L ${point[0]} ${point[1]}`;
  }
}
class CubicBézierDrawerProvider {
  constructor() {
    this.drawer = (point, index, points) => {
      const [cpsX, cpsY] = this.controlPoint(points[index - 1], points[index - 2], point);
      const [cpeX, cpeY] = this.controlPoint(point, points[index - 1], points[index + 1], true);
      return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    };
  }
  controlPoint(current, previous, next, reverse) {
    const a = previous || current;
    const b = next || current;
    const smoothing = 0.2;
    const lenX = b[0] - a[0];
    const lenY = b[1] - a[1];
    const length = Math.sqrt(Math.pow(lenX, 2) + Math.pow(lenY, 2)) * smoothing;
    const angle = Math.atan2(lenY, lenX) + (reverse ? Math.PI : 0);
    const x = current[0] + Math.cos(angle) * length;
    const y2 = current[1] + Math.sin(angle) * length;
    return [x, y2];
  }
}
const className = ClassName("wfm");
class WaveformView {
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(className());
    config.viewProps.bindClassModifiers(this.element);
    this.svgElem = doc.createElementNS(SVG_NS, "svg");
    this.svgElem.classList.add(className("g"));
    this.element.appendChild(this.svgElem);
    this.pathElem = doc.createElementNS(SVG_NS, "path");
    this.svgElem.appendChild(this.pathElem);
    this.props = config.props;
    this.value = config.value;
    this.value.emitter.on("change", this.onValueChange_.bind(this));
    switch (this.props.get("lineStyle")) {
      case "linear":
        this.lineDrawerProvider = new LinearDrawerProvider();
        break;
      case "bezier":
        this.lineDrawerProvider = new CubicBézierDrawerProvider();
        break;
      default:
        this.lineDrawerProvider = new LinearDrawerProvider();
        break;
    }
    this.refresh();
    config.viewProps.handleDispose(() => {
      this.value.emitter.off("change", this.onValueChange_);
    });
  }
  svgPath(points, drawer) {
    const d = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${drawer(point, i, a)}`, "");
    return d;
  }
  refresh() {
    var _a, _b;
    const bounds = this.svgElem.getBoundingClientRect();
    const latestValue = this.value.rawValue[0];
    if (latestValue) {
      const min = (_a = this.props.get("min")) !== null && _a !== void 0 ? _a : Math.min(...latestValue) - 1;
      const max = (_b = this.props.get("max")) !== null && _b !== void 0 ? _b : Math.max(...latestValue) + 1;
      const range = max - min;
      const points = [];
      const maxIndex = latestValue.length - 1;
      const gridWidth = latestValue.length > 32 ? 0 : bounds.width / (latestValue.length - 1);
      const gridHeight = range > 50 ? 0 : bounds.height / range;
      this.element.style.backgroundSize = `${gridWidth}px ${gridHeight}px`;
      latestValue.forEach((v, index) => {
        if (v === void 0) {
          return;
        }
        const x = mapRange(index, 0, maxIndex, 0, bounds.width);
        const y2 = mapRange(v, min, max, bounds.height, 0);
        points.push([Math.floor(x), Math.floor(y2)]);
      });
      const d = this.svgPath(points, this.lineDrawerProvider.drawer);
      this.pathElem.setAttributeNS(null, "d", d);
    }
  }
  onValueChange_() {
    this.refresh();
  }
}
class WaveformController {
  constructor(doc, config) {
    this.value = config.value;
    this.props = config.props;
    this.viewProps = config.viewProps;
    this.viewProps.handleDispose(() => {
    });
    this.view = new WaveformView(doc, {
      value: this.value,
      viewProps: this.viewProps,
      props: this.props
    });
  }
}
function shouldShowWaveform(params) {
  return "view" in params && params.view === "waveform";
}
function isWaveformType(value) {
  if (typeof value === "object") {
    return "length" in value;
  }
  return false;
}
createPlugin({
  id: "monitor-waveform",
  type: "monitor",
  accept: (value, params) => {
    if (!isWaveformType(value)) {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      max: p.optional.number,
      min: p.optional.number,
      style: p.optional.custom((value2) => value2 === "linear" || value2 === "bezier" ? value2 : void 0),
      view: p.optional.string
    }));
    return result ? { initialValue: value, params: result } : null;
  },
  binding: {
    defaultBufferSize: (params) => shouldShowWaveform(params) ? 64 : 1,
    reader: (_args) => (exValue) => {
      if (isWaveformType(exValue)) {
        return exValue;
      }
      return [];
    }
  },
  controller: (args) => {
    var _a, _b, _c;
    return new WaveformController(args.document, {
      props: ValueMap.fromObject({
        max: (_a = "max" in args.params ? args.params.max : null) !== null && _a !== void 0 ? _a : null,
        min: (_b = "min" in args.params ? args.params.min : null) !== null && _b !== void 0 ? _b : null,
        lineStyle: (_c = "style" in args.params ? args.params.style : null) !== null && _c !== void 0 ? _c : "linear"
      }),
      value: args.value,
      viewProps: args.viewProps
    });
  }
});
const css$1 = {
  code: ".container.svelte-gl4ojj{display:flex;flex-direction:row;position:absolute;width:100%;top:0;left:0;z-index:10;padding:0.5rem}.controls.svelte-gl4ojj{width:30%}",
  map: '{"version":3,"file":"App.svelte","sources":["App.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { Canvas } from \\"@threlte/core\\";\\nimport Scene from \\"./Scene.svelte\\";\\nimport { Button, Folder, Slider, Stepper } from \\"svelte-tweakpane-ui\\";\\nimport { sceneScale, sceneNumber, planes } from \\"../stores/sceneStore\\";\\nlet scene = 1;\\nlet scale = 1;\\n$: $sceneScale = scale;\\n$: $sceneNumber = scene;\\nconst handleClick = () => {\\n  planes.update((ps) => [...ps, {\\n    rotation: 0,\\n    scale: 1,\\n    pointSize: 2,\\n    waveFreq1: 1,\\n    waveAmp1: 1,\\n    waveSpeed1: 1,\\n    waveFreq2: 1,\\n    waveAmp2: 1,\\n    waveSpeed2: 1\\n  }]);\\n  console.log(\\"Wave plane added to scene\\");\\n};\\n<\/script>\\n\\n<div class=\\"container\\">\\n  <div class=\\"controls col\\">\\n    <Slider\\n      bind:value={scale}\\n      min={-1}\\n      max={1}\\n      format={(v) => v.toFixed(2)}\\n      label=\\"Scale\\"\\n    />\\n  </div>\\n\\n  <div class=\\"controls col\\">\\n    <Button on:click={handleClick} label=\\"Shader\\" title=\\"Add\\" />\\n  </div>\\n\\n  {#each $planes as plane, index}\\n    <div class=\\"controls col\\">\\n      <Folder title=\\"Wave {index + 1}\\">\\n      <Slider bind:value={plane.rotation} label=\\"Rotation\\" min={0} max={360} step={1} />\\n      <Slider bind:value={plane.scale} label=\\"Scale\\" min={0.1} max={5} step={0.1} />\\n      <Slider bind:value={plane.pointSize} label=\\"Point Size\\" min={0.1} max={10} step={0.1} />\\n      <Slider bind:value={plane.waveFreq1} label=\\"Wave 1 Frequency\\" min={1} max={20} step={0.1} />\\n      <Slider bind:value={plane.waveAmp1} label=\\"Wave 1 Amplitude\\" min={0.1} max={2} step={0.1} />\\n      <Slider bind:value={plane.waveSpeed1} label=\\"Wave 1 Speed\\" min={0.1} max={5} step={0.1} />\\n      <Slider bind:value={plane.waveFreq2} label=\\"Wave 2 Frequency\\" min={1} max={20} step={0.1} />\\n      <Slider bind:value={plane.waveAmp2} label=\\"Wave 2 Amplitude\\" min={0.1} max={2} step={0.1} />\\n      <Slider bind:value={plane.waveSpeed2} label=\\"Wave 2 Speed\\" min={0.1} max={5} step={0.1} />\\n      </Folder>\\n    </div>\\n  {/each}\\n</div>\\n\\n<Canvas>\\n  <Scene {scale} />\\n</Canvas>\\n\\n<style>\\n  .container {\\n    display: flex;\\n    flex-direction: row;\\n    position: absolute;\\n    width: 100%;\\n    top: 0;\\n    left: 0;\\n    z-index: 10;\\n    padding: 0.5rem;\\n  }\\n  .controls {\\n    width: 30%;\\n  }\\n</style>"],"names":[],"mappings":"AA6DE,wBAAW,CACT,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,EAAE,CACX,OAAO,CAAE,MACX,CACA,uBAAU,CACR,KAAK,CAAE,GACT"}'
};
let scene = 1;
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $sceneNumber, $$unsubscribe_sceneNumber;
  let $sceneScale, $$unsubscribe_sceneScale;
  let $planes, $$unsubscribe_planes;
  $$unsubscribe_sceneNumber = subscribe(sceneNumber, (value) => $sceneNumber = value);
  $$unsubscribe_sceneScale = subscribe(sceneScale, (value) => $sceneScale = value);
  $$unsubscribe_planes = subscribe(planes, (value) => $planes = value);
  let scale = 1;
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    set_store_value(sceneScale, $sceneScale = scale, $sceneScale);
    set_store_value(sceneNumber, $sceneNumber = scene, $sceneNumber);
    $$rendered = `<div class="container svelte-gl4ojj"><div class="controls col svelte-gl4ojj">${validate_component(Slider, "Slider").$$render(
      $$result,
      {
        min: -1,
        max: 1,
        format: (v) => v.toFixed(2),
        label: "Scale",
        value: scale
      },
      {
        value: ($$value) => {
          scale = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="controls col svelte-gl4ojj">${validate_component(Button, "Button").$$render($$result, { label: "Shader", title: "Add" }, {}, {})}</div> ${each($planes, (plane, index) => {
      return `<div class="controls col svelte-gl4ojj">${validate_component(Folder, "Folder").$$render($$result, { title: "Wave " + (index + 1) }, {}, {
        default: () => {
          return `${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Rotation",
              min: 0,
              max: 360,
              step: 1,
              value: plane.rotation
            },
            {
              value: ($$value) => {
                plane.rotation = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Scale",
              min: 0.1,
              max: 5,
              step: 0.1,
              value: plane.scale
            },
            {
              value: ($$value) => {
                plane.scale = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Point Size",
              min: 0.1,
              max: 10,
              step: 0.1,
              value: plane.pointSize
            },
            {
              value: ($$value) => {
                plane.pointSize = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Wave 1 Frequency",
              min: 1,
              max: 20,
              step: 0.1,
              value: plane.waveFreq1
            },
            {
              value: ($$value) => {
                plane.waveFreq1 = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Wave 1 Amplitude",
              min: 0.1,
              max: 2,
              step: 0.1,
              value: plane.waveAmp1
            },
            {
              value: ($$value) => {
                plane.waveAmp1 = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Wave 1 Speed",
              min: 0.1,
              max: 5,
              step: 0.1,
              value: plane.waveSpeed1
            },
            {
              value: ($$value) => {
                plane.waveSpeed1 = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Wave 2 Frequency",
              min: 1,
              max: 20,
              step: 0.1,
              value: plane.waveFreq2
            },
            {
              value: ($$value) => {
                plane.waveFreq2 = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Wave 2 Amplitude",
              min: 0.1,
              max: 2,
              step: 0.1,
              value: plane.waveAmp2
            },
            {
              value: ($$value) => {
                plane.waveAmp2 = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Slider, "Slider").$$render(
            $$result,
            {
              label: "Wave 2 Speed",
              min: 0.1,
              max: 5,
              step: 0.1,
              value: plane.waveSpeed2
            },
            {
              value: ($$value) => {
                plane.waveSpeed2 = $$value;
                $$settled = false;
              }
            },
            {}
          )} `;
        }
      })} </div>`;
    })}</div> ${validate_component(Canvas, "Canvas").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Scene, "Scene").$$render($$result, { scale }, {}, {})}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_sceneNumber();
  $$unsubscribe_sceneScale();
  $$unsubscribe_planes();
  return $$rendered;
});
const css = {
  code: "body{margin:0}div.svelte-xjrkhs{width:100vw;height:100vh;background:rgb(13, 19, 32);background:linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%)}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import App from \\"$lib/components/App.svelte\\";\\n<\/script>\\n\\n<div>\\n  <App />\\n</div>\\n\\n<style>\\n  :global(body) {\\n    margin: 0;\\n  }\\n\\n  div {\\n    width: 100vw;\\n    height: 100vh;\\n    background: rgb(13, 19, 32);\\n    background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);\\n  }\\n</style>\\n"],"names":[],"mappings":"AAQU,IAAM,CACZ,MAAM,CAAE,CACV,CAEA,iBAAI,CACF,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,UAAU,CAAE,IAAI,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAC3B,UAAU,CAAE,gBAAgB,MAAM,CAAC,CAAC,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CACrF"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="svelte-xjrkhs">${validate_component(App, "App").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Page as default
};
