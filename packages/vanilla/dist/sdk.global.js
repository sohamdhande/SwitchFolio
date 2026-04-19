"use strict";
var Switchfolio = (() => {
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

  // src/sdk.ts
  var sdk_exports = {};
  __export(sdk_exports, {
    Switchfolio: () => Switchfolio,
    default: () => sdk_default
  });
  var Switchfolio = {
    load: async (options) => {
      var _a;
      const {
        apiKey,
        username,
        viewSlug,
        baseUrl = "https://switchfolio.app"
      } = options;
      const url = `${baseUrl}/api/v1/projects?user=${encodeURIComponent(username)}&view=${encodeURIComponent(viewSlug)}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error((_a = error.error) != null ? _a : `HTTP ${response.status}`);
      }
      const projects = await response.json();
      return { projects };
    }
  };
  var sdk_default = Switchfolio;
  return __toCommonJS(sdk_exports);
})();
