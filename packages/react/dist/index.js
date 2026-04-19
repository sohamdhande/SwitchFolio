"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  useSwitchfolio: () => useSwitchfolio
});
module.exports = __toCommonJS(index_exports);

// src/useSwitchfolio.ts
var import_react = require("react");
function useSwitchfolio(options) {
  const { apiKey, username, viewSlug, baseUrl = "https://switchfolio.app" } = options;
  const [data, setData] = (0, import_react.useState)([]);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  const [fetchCount, setFetchCount] = (0, import_react.useState)(0);
  const refetch = (0, import_react.useCallback)(() => {
    setFetchCount((c) => c + 1);
  }, []);
  (0, import_react.useEffect)(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${baseUrl}/api/v1/projects?user=${encodeURIComponent(username)}&view=${encodeURIComponent(viewSlug)}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${response.status}`);
        }
        const projects = await response.json();
        if (!cancelled) {
          setData(projects);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [apiKey, username, viewSlug, baseUrl, fetchCount]);
  return { data, loading, error, refetch };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSwitchfolio
});
