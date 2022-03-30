var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/jsx-runtime/babel-restore-jsx.ts
var babel_restore_jsx_exports = {};
__export(babel_restore_jsx_exports, {
  default: () => babel_restore_jsx_default
});
function babel_restore_jsx_default({ types: t }) {
  function getJSXNode(node) {
    if (!isReactCreateElement(node)) {
      return null;
    }
    const [nameNode, propsNode, ...childNodes] = node.arguments;
    const name = getJSXName(nameNode);
    if (name == null) {
      return null;
    }
    const props = getJSXProps(propsNode);
    if (props == null) {
      return null;
    }
    const children = getJSXChildren(childNodes);
    if (children == null) {
      return null;
    }
    if (t.isJSXMemberExpression(name) && t.isJSXIdentifier(name.object) && name.object.name === "React" && name.property.name === "Fragment") {
      return t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), children);
    }
    const selfClosing = children.length === 0;
    const startTag = t.jsxOpeningElement(name, props, selfClosing);
    startTag.loc = node.loc;
    const endTag = selfClosing ? null : t.jsxClosingElement(name);
    return t.jsxElement(startTag, endTag, children, selfClosing);
  }
  function getJSXName(node) {
    if (node == null) {
      return null;
    }
    const name = getJSXIdentifier(node);
    if (name != null) {
      return name;
    }
    if (!t.isMemberExpression(node)) {
      return null;
    }
    const object = getJSXName(node.object);
    const property = getJSXName(node.property);
    if (object == null || property == null) {
      return null;
    }
    return t.jsxMemberExpression(object, property);
  }
  function getJSXProps(node) {
    if (node == null || isNullLikeNode(node)) {
      return [];
    }
    if (t.isCallExpression(node) && t.isIdentifier(node.callee, { name: "_extends" })) {
      const props = node.arguments.map(getJSXProps);
      if (props.every((prop) => prop != null)) {
        return [].concat(...props);
      }
    }
    if (!t.isObjectExpression(node) && t.isExpression(node))
      return [t.jsxSpreadAttribute(node)];
    if (!isPlainObjectExpression(node)) {
      return null;
    }
    return node.properties.map((prop) => t.isObjectProperty(prop) ? t.jsxAttribute(getJSXIdentifier(prop.key), getJSXAttributeValue(prop.value)) : t.jsxSpreadAttribute(prop.argument));
  }
  function getJSXChild(node) {
    if (t.isStringLiteral(node)) {
      return t.jsxText(node.value);
    }
    if (isReactCreateElement(node)) {
      return getJSXNode(node);
    }
    if (t.isExpression(node)) {
      return t.jsxExpressionContainer(node);
    }
    return null;
  }
  function getJSXChildren(nodes) {
    const children = nodes.filter((node) => !isNullLikeNode(node)).map(getJSXChild);
    if (children.some((child) => child == null)) {
      return null;
    }
    return children;
  }
  function getJSXIdentifier(node) {
    if (t.isIdentifier(node)) {
      return t.jsxIdentifier(node.name);
    }
    if (t.isStringLiteral(node)) {
      return t.jsxIdentifier(node.value);
    }
    return null;
  }
  function getJSXAttributeValue(node) {
    if (t.isStringLiteral(node)) {
      return node;
    }
    if (t.isJSXElement(node)) {
      return node;
    }
    if (t.isExpression(node)) {
      return t.jsxExpressionContainer(node);
    }
    return null;
  }
  const isReactCreateElement = (node) => t.isCallExpression(node) && t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.object, { name: "React" }) && t.isIdentifier(node.callee.property, { name: "createElement" }) && !node.callee.computed;
  const isNullLikeNode = (node) => t.isNullLiteral(node) || t.isIdentifier(node, { name: "undefined" });
  const isPlainObjectExpression = (node) => t.isObjectExpression(node) && node.properties.every((property) => t.isSpreadElement(property) || t.isObjectProperty(property, { computed: false }) && getJSXIdentifier(property.key) != null && getJSXAttributeValue(property.value) != null);
  return {
    visitor: {
      CallExpression(path) {
        const node = getJSXNode(path.node);
        if (node == null) {
          return null;
        }
        path.replaceWith(node);
      }
    }
  };
}
var init_babel_restore_jsx = __esm({
  "src/jsx-runtime/babel-restore-jsx.ts"() {
  }
});

// src/index.ts
__export(exports, {
  default: () => viteReact
});
var babel = __toModule(require("@babel/core"));
var import_pluginutils = __toModule(require("@rollup/pluginutils"));
var import_resolve = __toModule(require("resolve"));

// src/fast-refresh.ts
var import_fs = __toModule(require("fs"));
var runtimePublicPath = "/@react-refresh";
var runtimeFilePath = require.resolve("react-refresh/cjs/react-refresh-runtime.development.js");
var runtimeCode = `
const exports = {}
${import_fs.default.readFileSync(runtimeFilePath, "utf-8")}
function debounce(fn, delay) {
  let handle
  return () => {
    clearTimeout(handle)
    handle = setTimeout(fn, delay)
  }
}
exports.performReactRefresh = debounce(exports.performReactRefresh, 16)
export default exports
`;
var preambleCode = `
import RefreshRuntime from "__BASE__${runtimePublicPath.slice(1)}"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;
var header = `
import RefreshRuntime from "${runtimePublicPath}";

let prevRefreshReg;
let prevRefreshSig;

if (!window.__vite_plugin_react_preamble_installed__) {
  throw new Error(
    "@vitejs/plugin-react can't detect preamble. Something is wrong. " +
    "See https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201"
  );
}

if (import.meta.hot) {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    RefreshRuntime.register(type, __SOURCE__ + " " + id)
  };
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}`.replace(/[\n]+/gm, "");
var footer = `
if (import.meta.hot) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;

  __ACCEPT__
  if (!window.__vite_plugin_react_timeout) {
    window.__vite_plugin_react_timeout = setTimeout(() => {
      window.__vite_plugin_react_timeout = 0;
      RefreshRuntime.performReactRefresh();
    }, 30);
  }
}`;
function addRefreshWrapper(code, id, accept) {
  return header.replace("__SOURCE__", JSON.stringify(id)) + code + footer.replace("__ACCEPT__", accept ? "import.meta.hot.accept();" : "");
}
function isRefreshBoundary(ast) {
  return ast.program.body.every((node) => {
    if (node.type !== "ExportNamedDeclaration") {
      return true;
    }
    const { declaration, specifiers } = node;
    if (declaration) {
      if (declaration.type === "VariableDeclaration") {
        return declaration.declarations.every((variable) => isComponentLikeIdentifier(variable.id));
      }
      if (declaration.type === "FunctionDeclaration") {
        return !!declaration.id && isComponentLikeIdentifier(declaration.id);
      }
    }
    return specifiers.every((spec) => {
      return isComponentLikeIdentifier(spec.exported);
    });
  });
}
function isComponentLikeIdentifier(node) {
  return node.type === "Identifier" && isComponentLikeName(node.name);
}
function isComponentLikeName(name) {
  return typeof name === "string" && name[0] >= "A" && name[0] <= "Z";
}

// src/jsx-runtime/babel-import-to-require.ts
function babelImportToRequire({
  types: t
}) {
  return {
    visitor: {
      ImportDeclaration(path) {
        const decl = path.node;
        const spec = decl.specifiers[0];
        path.replaceWith(t.variableDeclaration("var", [
          t.variableDeclarator(spec.local, t.memberExpression(t.callExpression(t.identifier("require"), [decl.source]), spec.imported))
        ]));
      }
    }
  };
}

// src/jsx-runtime/restore-jsx.ts
var babelRestoreJSX;
var jsxNotFound = [null, false];
async function restoreJSX(babel2, code, filename) {
  if (filename.includes("/.vite/react-dom.js")) {
    return jsxNotFound;
  }
  const [reactAlias, isCommonJS] = parseReactAlias(code);
  if (!reactAlias) {
    return jsxNotFound;
  }
  const reactJsxRE = new RegExp("\\b" + reactAlias + "\\.(createElement|Fragment)\\b", "g");
  let hasCompiledJsx = false;
  code = code.replace(reactJsxRE, (_, prop) => {
    hasCompiledJsx = true;
    return "React." + prop;
  });
  if (!hasCompiledJsx) {
    return jsxNotFound;
  }
  code = code.replace(/createElement\(Fragment,/g, "createElement(React.Fragment,");
  babelRestoreJSX || (babelRestoreJSX = Promise.resolve().then(() => (init_babel_restore_jsx(), babel_restore_jsx_exports)));
  const result = await babel2.transformAsync(code, {
    ast: true,
    code: false,
    filename,
    parserOpts: {
      plugins: ["jsx"]
    },
    plugins: [await babelRestoreJSX]
  });
  return [result == null ? void 0 : result.ast, isCommonJS];
}
function parseReactAlias(code) {
  let match = code.match(/\b(var|let|const) +(\w+) *= *require\(["']react["']\)/);
  if (match) {
    return [match[2], true];
  }
  match = code.match(/^import (\w+).+? from ["']react["']/m);
  if (match) {
    return [match[1], false];
  }
  return [void 0, false];
}

// src/index.ts
function viteReact(opts = {}) {
  var _a, _b, _c;
  let base = "/";
  let filter = (0, import_pluginutils.createFilter)(opts.include, opts.exclude);
  let isProduction = true;
  let projectRoot = process.cwd();
  let skipFastRefresh = opts.fastRefresh === false;
  let skipReactImport = false;
  const useAutomaticRuntime = opts.jsxRuntime !== "classic";
  const userPlugins = ((_a = opts.babel) == null ? void 0 : _a.plugins) || [];
  const userParserPlugins = opts.parserPlugins || ((_c = (_b = opts.babel) == null ? void 0 : _b.parserOpts) == null ? void 0 : _c.plugins) || [];
  const importReactRE = /(^|\n)import\s+(\*\s+as\s+)?React(,|\s+)/;
  const fileExtensionRE = /\.[^\/\s\?]+$/;
  const viteBabel = {
    name: "vite:react-babel",
    enforce: "pre",
    configResolved(config) {
      base = config.base;
      projectRoot = config.root;
      filter = (0, import_pluginutils.createFilter)(opts.include, opts.exclude, {
        resolve: projectRoot
      });
      isProduction = config.isProduction;
      skipFastRefresh || (skipFastRefresh = isProduction || config.command === "build");
      const jsxInject = config.esbuild && config.esbuild.jsxInject;
      if (jsxInject && importReactRE.test(jsxInject)) {
        skipReactImport = true;
        config.logger.warn("[@vitejs/plugin-react] This plugin imports React for you automatically, so you can stop using `esbuild.jsxInject` for that purpose.");
      }
      config.plugins.forEach((plugin) => (plugin.name === "react-refresh" || plugin !== viteReactJsx && plugin.name === "vite:react-jsx") && config.logger.warn(`[@vitejs/plugin-react] You should stop using "${plugin.name}" since this plugin conflicts with it.`));
    },
    async transform(code, id, options) {
      var _a2, _b2, _c2, _d;
      const ssr = typeof options === "boolean" ? options : (options == null ? void 0 : options.ssr) === true;
      const [filepath, querystring = ""] = id.split("?");
      const [extension = ""] = querystring.match(fileExtensionRE) || filepath.match(fileExtensionRE) || [];
      if (/\.(mjs|[tj]sx?)$/.test(extension)) {
        const isJSX = extension.endsWith("x");
        const isNodeModules = id.includes("/node_modules/");
        const isProjectFile = !isNodeModules && (id[0] === "\0" || id.startsWith(projectRoot + "/"));
        const plugins = isProjectFile ? [...userPlugins] : [];
        let useFastRefresh = false;
        if (!skipFastRefresh && !ssr && !isNodeModules) {
          const isReactModule = isJSX || code.includes("react");
          if (isReactModule && filter(id)) {
            useFastRefresh = true;
            plugins.push([
              await loadPlugin("react-refresh/babel.js"),
              { skipEnvCheck: true }
            ]);
          }
        }
        let ast;
        if (!isProjectFile || isJSX) {
          if (useAutomaticRuntime) {
            const [restoredAst, isCommonJS] = !isProjectFile && !isJSX ? await restoreJSX(babel, code, id) : [null, false];
            if (isJSX || (ast = restoredAst)) {
              plugins.push([
                await loadPlugin("@babel/plugin-transform-react-jsx" + (isProduction ? "" : "-development")),
                {
                  runtime: "automatic",
                  importSource: opts.jsxImportSource
                }
              ]);
              if (isCommonJS) {
                plugins.push(babelImportToRequire);
              }
            }
          } else if (isProjectFile) {
            if (!isProduction) {
              plugins.push(await loadPlugin("@babel/plugin-transform-react-jsx-self"), await loadPlugin("@babel/plugin-transform-react-jsx-source"));
            }
            if (!skipReactImport && !importReactRE.test(code)) {
              code = `import React from 'react'; ` + code;
            }
          }
        }
        const shouldSkip = !plugins.length && !((_a2 = opts.babel) == null ? void 0 : _a2.configFile) && !(isProjectFile && ((_b2 = opts.babel) == null ? void 0 : _b2.babelrc));
        if (shouldSkip) {
          return;
        }
        const parserPlugins = [
          ...userParserPlugins,
          "importMeta",
          "topLevelAwait",
          "classProperties",
          "classPrivateProperties",
          "classPrivateMethods"
        ];
        if (!extension.endsWith(".ts")) {
          parserPlugins.push("jsx");
        }
        if (/\.tsx?$/.test(extension)) {
          parserPlugins.push("typescript");
        }
        const isReasonReact = extension.endsWith(".bs.js");
        const babelOpts = __spreadProps(__spreadValues({
          babelrc: false,
          configFile: false
        }, opts.babel), {
          ast: !isReasonReact,
          root: projectRoot,
          filename: id,
          sourceFileName: filepath,
          parserOpts: __spreadProps(__spreadValues({}, (_c2 = opts.babel) == null ? void 0 : _c2.parserOpts), {
            sourceType: "module",
            allowAwaitOutsideFunction: true,
            plugins: parserPlugins
          }),
          generatorOpts: __spreadProps(__spreadValues({}, (_d = opts.babel) == null ? void 0 : _d.generatorOpts), {
            decoratorsBeforeExport: true
          }),
          plugins,
          sourceMaps: true,
          inputSourceMap: false
        });
        const result = ast ? await babel.transformFromAstAsync(ast, code, babelOpts) : await babel.transformAsync(code, babelOpts);
        if (result) {
          let code2 = result.code;
          if (useFastRefresh && /\$RefreshReg\$\(/.test(code2)) {
            const accept = isReasonReact || isRefreshBoundary(result.ast);
            code2 = addRefreshWrapper(code2, id, accept);
          }
          return {
            code: code2,
            map: result.map
          };
        }
      }
    }
  };
  const viteReactRefresh = {
    name: "vite:react-refresh",
    enforce: "pre",
    config: () => ({
      resolve: {
        dedupe: ["react", "react-dom"]
      }
    }),
    resolveId(id) {
      if (id === runtimePublicPath) {
        return id;
      }
    },
    load(id) {
      if (id === runtimePublicPath) {
        return runtimeCode;
      }
    },
    transformIndexHtml() {
      if (!skipFastRefresh)
        return [
          {
            tag: "script",
            attrs: { type: "module" },
            children: preambleCode.replace(`__BASE__`, base)
          }
        ];
    }
  };
  const runtimeId = "react/jsx-runtime";
  const viteReactJsx = {
    name: "vite:react-jsx",
    enforce: "pre",
    config() {
      return {
        optimizeDeps: {
          include: ["react/jsx-dev-runtime"]
        }
      };
    },
    resolveId(id) {
      return id === runtimeId ? id : null;
    },
    load(id) {
      if (id === runtimeId) {
        const runtimePath = import_resolve.default.sync(runtimeId, {
          basedir: projectRoot
        });
        const exports = ["jsx", "jsxs", "Fragment"];
        return [
          `import * as jsxRuntime from ${JSON.stringify(runtimePath)}`,
          ...exports.map((name) => `export const ${name} = jsxRuntime.${name}`)
        ].join("\n");
      }
    }
  };
  return [viteBabel, viteReactRefresh, useAutomaticRuntime && viteReactJsx];
}
viteReact.preambleCode = preambleCode;
function loadPlugin(path) {
  return Promise.resolve().then(() => __toModule(require(path))).then((module2) => module2.default || module2);
}
module.exports = viteReact;
viteReact["default"] = viteReact;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/**
 * https://github.com/flying-sheep/babel-plugin-transform-react-createelement-to-jsx
 * @license GNU General Public License v3.0
 */
