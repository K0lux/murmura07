import { isServer as Dt, unsafeCSS as De, LitElement as io, html as g, nothing as G, svg as B } from "lit";
import { property as C, query as wt, customElement as V, state as re } from "lit/decorators.js";
import { ifDefined as St } from "lit/directives/if-defined.js";
import { when as P } from "lit/directives/when.js";
import { AsyncDirective as so } from "lit-html/async-directive.js";
import { directive as oo } from "lit-html/directive.js";
import { isServer as Nn } from "lit-html/is-server.js";
import { classMap as xa } from "lit/directives/class-map.js";
import { map as ht } from "lit/directives/map.js";
import { repeat as de } from "lit/directives/repeat.js";
import { unsafeHTML as lo } from "lit/directives/unsafe-html.js";
const co = "/";
function Ja(e, t, r) {
  const a = Object.keys(e), n = uo(a);
  return a.reduce((i, s) => {
    const o = Qa(s.startsWith(t) ? s.substr(t.length) : s);
    return i[Qa(s.substr(n.length))] = r(e[s], o), i;
  }, /* @__PURE__ */ Object.create(null));
}
function Qa(e) {
  return e.split(/\/|\\/).filter(Boolean).join("/");
}
function uo(e) {
  const t = e.map((a) => a.split(/\/|\\/).slice(0, -1));
  if (e.length)
    return t.reduce(r).join(co);
  return "";
  function r(a, n) {
    for (let i = 0; i < a.length; i++)
      if (a[i] !== n[i])
        return a.splice(0, i);
    return a;
  }
}
function ho(e, t) {
  const r = (a) => a.file ? `1${a.name}` : `0${a.name}`;
  return r(e).localeCompare(r(t));
}
function po(e) {
  return e != null;
}
const Fe = {
  maxAsciiCharacter: 127,
  lineFeed: 10,
  // \n
  carriageReturn: 13,
  // \r
  lineSeparator: 8232,
  paragraphSeparator: 8233
};
function fo(e) {
  return e === Fe.lineFeed || e === Fe.carriageReturn || e === Fe.lineSeparator || e === Fe.paragraphSeparator;
}
function go(e) {
  const t = [];
  let r = 0, a = 0;
  function n(i) {
    t.push(a), a = i;
  }
  for (n(0); r < e.length; ) {
    const i = e.charCodeAt(r);
    switch (r++, i) {
      case Fe.carriageReturn:
        e.charCodeAt(r) === Fe.lineFeed && r++, n(r);
        break;
      case Fe.lineFeed:
        n(r);
        break;
      default:
        i > Fe.maxAsciiCharacter && fo(i) && n(r);
        break;
    }
  }
  return t.push(a), t;
}
function mo(e, t) {
  return Object.groupBy ? Object.groupBy(e, t) : e.reduce((r, a) => {
    const n = t(a);
    return r[n] ??= [], r[n].push(a), r;
  }, /* @__PURE__ */ Object.create(null));
}
function xr(e) {
  if (e === void 0)
    throw new Error("mutant.sourceFile was not defined");
}
class vo {
  // MutantResult properties
  coveredBy;
  description;
  duration;
  id;
  killedBy;
  location;
  mutatorName;
  replacement;
  static;
  status;
  statusReason;
  testsCompleted;
  // New fields
  get coveredByTests() {
    if (this.#e.size)
      return Array.from(this.#e.values());
  }
  set coveredByTests(t) {
    this.#e = new Map(t.map((r) => [r.id, r]));
  }
  get killedByTests() {
    if (this.#t.size)
      return Array.from(this.#t.values());
  }
  set killedByTests(t) {
    this.#t = new Map(t.map((r) => [r.id, r]));
  }
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  constructor(t) {
    this.coveredBy = t.coveredBy, this.description = t.description, this.duration = t.duration, this.id = t.id, this.killedBy = t.killedBy, this.location = t.location, this.mutatorName = t.mutatorName, this.replacement = t.replacement, this.static = t.static, this.status = t.status, this.statusReason = t.statusReason, this.testsCompleted = t.testsCompleted;
  }
  addCoveredBy(t) {
    this.#e.set(t.id, t);
  }
  addKilledBy(t) {
    this.#t.set(t.id, t);
  }
  /**
   * Retrieves the lines of code with the mutant applied to it, to be shown in a diff view.
   */
  getMutatedLines() {
    return xr(this.sourceFile), this.sourceFile.getMutationLines(this);
  }
  /**
   * Retrieves the original source lines for this mutant, to be shown in a diff view.
   */
  getOriginalLines() {
    return xr(this.sourceFile), this.sourceFile.getLines(this.location);
  }
  /**
   * Helper property to retrieve the source file name
   * @throws When the `sourceFile` is not defined.
   */
  get fileName() {
    return xr(this.sourceFile), this.sourceFile.name;
  }
  // TODO: https://github.com/stryker-mutator/mutation-testing-elements/pull/2453#discussion_r1178769871
  update() {
    this.sourceFile?.result?.file && this.sourceFile.result.updateAllMetrics();
  }
}
function Xa(e) {
  if (e === void 0)
    throw new Error("sourceFile.source is undefined");
}
class Wn {
  #e;
  getLineMap() {
    return Xa(this.source), this.#e ?? (this.#e = go(this.source));
  }
  /**
   * Retrieves the source lines based on the `start.line` and `end.line` property.
   */
  getLines(t) {
    Xa(this.source);
    const r = this.getLineMap();
    return this.source.substring(r[t.start.line], r[(t.end ?? t.start).line + 1]);
  }
}
class bo extends Wn {
  name;
  /**
   * Programming language that is used. Used for code highlighting, see https://prismjs.com/#examples.
   */
  language;
  /**
   * Full source code of the mutated file, this is used for highlighting.
   */
  source;
  /**
   * The mutants inside this file.
   */
  mutants;
  /**
   * The associated MetricsResult of this file.
   */
  result;
  /**
   * @param input The file result content
   * @param name The file name
   */
  constructor(t, r) {
    super(), this.name = r, this.language = t.language, this.source = t.source, this.mutants = t.mutants.map((a) => {
      const n = new vo(a);
      return n.sourceFile = this, n;
    });
  }
  /**
   * Retrieves the lines of code with the mutant applied to it, to be shown in a diff view.
   */
  getMutationLines(t) {
    const r = this.getLineMap(), a = r[t.location.start.line], n = r[t.location.end.line], i = r[t.location.end.line + 1];
    return `${this.source.substr(a, t.location.start.column - 1)}${t.replacement ?? t.description ?? t.mutatorName}${this.source.substring(n + t.location.end.column - 1, i)}`;
  }
}
class qn {
  /**
   * The parent of this result (if it has one)
   */
  parent;
  /**
   * The name of this result
   */
  name;
  /**
   * The file belonging to this metric result (if it represents a single file)
   */
  file;
  /**
   * The the child results
   */
  childResults;
  /**
   * The actual metrics
   */
  metrics;
  constructor(t, r, a, n) {
    this.name = t, this.childResults = r, this.metrics = a, this.file = n;
  }
  updateParent(t) {
    this.parent = t, this.childResults.forEach((r) => r.updateParent(this));
  }
  updateAllMetrics() {
    if (this.parent !== void 0) {
      this.parent.updateAllMetrics();
      return;
    }
    this.updateMetrics();
  }
  updateMetrics() {
    if (this.file === void 0) {
      this.childResults.forEach((r) => {
        r.updateMetrics();
      });
      const t = this.#e(this.childResults);
      if (t.length === 0)
        return;
      t[0].tests ? this.metrics = Er(t) : this.metrics = ar(t);
      return;
    }
    this.file.tests ? this.metrics = Er([this.file]) : this.metrics = ar([this.file]);
  }
  #e(t) {
    const r = [];
    return t.length === 0 || t.forEach((a) => {
      if (a.file) {
        r.push(a.file);
        return;
      }
      r.push(...this.#e(a.childResults));
    }), r;
  }
}
function en(e) {
  if (e === void 0)
    throw new Error("test.sourceFile was not defined");
}
function wo(e) {
  if (e === void 0)
    throw new Error("test.location was not defined");
}
var N;
(function(e) {
  e.Killing = "Killing", e.Covering = "Covering", e.NotCovering = "NotCovering";
})(N || (N = {}));
class yo {
  id;
  name;
  location;
  get killedMutants() {
    if (this.#e.size)
      return Array.from(this.#e.values());
  }
  get coveredMutants() {
    if (this.#t.size)
      return Array.from(this.#t.values());
  }
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  addCovered(t) {
    this.#t.set(t.id, t);
  }
  addKilled(t) {
    this.#e.set(t.id, t);
  }
  constructor(t) {
    Object.entries(t).forEach(([r, a]) => {
      this[r] = a;
    });
  }
  /**
   * Retrieves the original source lines where this test is defined.
   * @throws if source file or location is not defined
   */
  getLines() {
    return en(this.sourceFile), wo(this.location), this.sourceFile.getLines(this.location);
  }
  /**
   * Helper property to retrieve the source file name
   * @throws When the `sourceFile` is not defined.
   */
  get fileName() {
    return en(this.sourceFile), this.sourceFile.name;
  }
  get status() {
    return this.#e.size ? N.Killing : this.#t.size ? N.Covering : N.NotCovering;
  }
  update() {
    this.sourceFile?.result?.file && this.sourceFile.result.updateAllMetrics();
  }
}
class Un extends Wn {
  name;
  tests;
  source;
  /**
   * The associated MetricsResult of this file.
   */
  result;
  /**
   * @param input the test file content
   * @param name the file name
   */
  constructor(t, r) {
    super(), this.name = r, this.source = t.source, this.tests = t.tests.map((a) => {
      const n = new yo(a);
      return n.sourceFile = this, n;
    });
  }
}
const tn = NaN, rn = "All files", ko = "All tests";
function xo(e) {
  const { files: t, testFiles: r, projectRoot: a = "" } = e, n = Ja(t, a, (i, s) => new bo(i, s));
  if (r && Object.keys(r).length) {
    const i = Ja(r, a, (s, o) => new Un(s, o));
    return $o(Object.values(n).flatMap((s) => s.mutants), Object.values(i).flatMap((s) => s.tests)), {
      systemUnderTestMetrics: _r(rn, n, ar),
      testMetrics: _r(ko, i, Er)
    };
  }
  return {
    systemUnderTestMetrics: _r(rn, n, ar),
    testMetrics: void 0
  };
}
function _r(e, t, r) {
  const a = Object.keys(t);
  return a.length === 1 && a[0] === "" ? Vn(e, t[a[0]], r) : Kn(e, t, r);
}
function Kn(e, t, r) {
  const a = r(Object.values(t)), n = _o(t, r);
  return new qn(e, n, a);
}
function Vn(e, t, r) {
  return new qn(e, [], r([t]), t);
}
function _o(e, t) {
  const r = mo(Object.entries(e), (a) => a[0].split("/")[0]);
  return Object.keys(r).map((a) => {
    if (r[a].length > 1 || r[a]?.[0][0] !== a) {
      const n = r[a].reduce((i, [s, o]) => (i[s.substr(a.length + 1)] = o, i), {});
      return Kn(a, n, t);
    } else {
      const [n, i] = r[a][0];
      return Vn(n, i, t);
    }
  }).sort(ho);
}
function $o(e, t) {
  const r = new Map(t.map((a) => [a.id, a]));
  for (const a of e) {
    const n = a.coveredBy ?? [];
    for (const s of n) {
      const o = r.get(s);
      o && (a.addCoveredBy(o), o.addCovered(a));
    }
    const i = a.killedBy ?? [];
    for (const s of i) {
      const o = r.get(s);
      o && (a.addKilledBy(o), o.addKilled(a));
    }
  }
}
function Er(e) {
  const t = e.flatMap((a) => a.tests), r = (a) => t.filter((n) => n.status === a).length;
  return {
    total: t.length,
    killing: r(N.Killing),
    covering: r(N.Covering),
    notCovering: r(N.NotCovering)
  };
}
function ar(e) {
  const t = e.flatMap((S) => S.mutants), r = (S) => t.filter((z) => z.status === S).length, a = r("Pending"), n = r("Killed"), i = r("Timeout"), s = r("Survived"), o = r("NoCoverage"), l = r("RuntimeError"), u = r("CompileError"), m = r("Ignored"), _ = i + n, x = s + o, v = _ + s, $ = x + _, w = l + u;
  return {
    pending: a,
    killed: n,
    timeout: i,
    survived: s,
    noCoverage: o,
    runtimeErrors: l,
    compileErrors: u,
    ignored: m,
    totalDetected: _,
    totalUndetected: x,
    totalCovered: v,
    totalValid: $,
    totalInvalid: w,
    mutationScore: $ > 0 ? _ / $ * 100 : tn,
    totalMutants: $ + w + m + a,
    mutationScoreBasedOnCoveredCode: $ > 0 ? _ / v * 100 || 0 : tn
  };
}
var Pr = function(e, t) {
  return Pr = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, a) {
    r.__proto__ = a;
  } || function(r, a) {
    for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (r[n] = a[n]);
  }, Pr(e, t);
};
function Be(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  Pr(e, t);
  function r() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r());
}
function So(e, t, r, a) {
  function n(i) {
    return i instanceof r ? i : new r(function(s) {
      s(i);
    });
  }
  return new (r || (r = Promise))(function(i, s) {
    function o(m) {
      try {
        u(a.next(m));
      } catch (_) {
        s(_);
      }
    }
    function l(m) {
      try {
        u(a.throw(m));
      } catch (_) {
        s(_);
      }
    }
    function u(m) {
      m.done ? i(m.value) : n(m.value).then(o, l);
    }
    u((a = a.apply(e, t || [])).next());
  });
}
function Zn(e, t) {
  var r = { label: 0, sent: function() {
    if (i[0] & 1) throw i[1];
    return i[1];
  }, trys: [], ops: [] }, a, n, i, s = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
  return s.next = o(0), s.throw = o(1), s.return = o(2), typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function o(u) {
    return function(m) {
      return l([u, m]);
    };
  }
  function l(u) {
    if (a) throw new TypeError("Generator is already executing.");
    for (; s && (s = 0, u[0] && (r = 0)), r; ) try {
      if (a = 1, n && (i = u[0] & 2 ? n.return : u[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, u[1])).done) return i;
      switch (n = 0, i && (u = [u[0] & 2, i.value]), u[0]) {
        case 0:
        case 1:
          i = u;
          break;
        case 4:
          return r.label++, { value: u[1], done: !1 };
        case 5:
          r.label++, n = u[1], u = [0];
          continue;
        case 7:
          u = r.ops.pop(), r.trys.pop();
          continue;
        default:
          if (i = r.trys, !(i = i.length > 0 && i[i.length - 1]) && (u[0] === 6 || u[0] === 2)) {
            r = 0;
            continue;
          }
          if (u[0] === 3 && (!i || u[1] > i[0] && u[1] < i[3])) {
            r.label = u[1];
            break;
          }
          if (u[0] === 6 && r.label < i[1]) {
            r.label = i[1], i = u;
            break;
          }
          if (i && r.label < i[2]) {
            r.label = i[2], r.ops.push(u);
            break;
          }
          i[2] && r.ops.pop(), r.trys.pop();
          continue;
      }
      u = t.call(e, r);
    } catch (m) {
      u = [6, m], n = 0;
    } finally {
      a = i = 0;
    }
    if (u[0] & 5) throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}
function pt(e) {
  var t = typeof Symbol == "function" && Symbol.iterator, r = t && e[t], a = 0;
  if (r) return r.call(e);
  if (e && typeof e.length == "number") return {
    next: function() {
      return e && a >= e.length && (e = void 0), { value: e && e[a++], done: !e };
    }
  };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function ft(e, t) {
  var r = typeof Symbol == "function" && e[Symbol.iterator];
  if (!r) return e;
  var a = r.call(e), n, i = [], s;
  try {
    for (; (t === void 0 || t-- > 0) && !(n = a.next()).done; ) i.push(n.value);
  } catch (o) {
    s = { error: o };
  } finally {
    try {
      n && !n.done && (r = a.return) && r.call(a);
    } finally {
      if (s) throw s.error;
    }
  }
  return i;
}
function zt(e, t, r) {
  if (r || arguments.length === 2) for (var a = 0, n = t.length, i; a < n; a++)
    (i || !(a in t)) && (i || (i = Array.prototype.slice.call(t, 0, a)), i[a] = t[a]);
  return e.concat(i || Array.prototype.slice.call(t));
}
function lt(e) {
  return this instanceof lt ? (this.v = e, this) : new lt(e);
}
function Co(e, t, r) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var a = r.apply(e, t || []), n, i = [];
  return n = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), o("next"), o("throw"), o("return", s), n[Symbol.asyncIterator] = function() {
    return this;
  }, n;
  function s(v) {
    return function($) {
      return Promise.resolve($).then(v, _);
    };
  }
  function o(v, $) {
    a[v] && (n[v] = function(w) {
      return new Promise(function(S, z) {
        i.push([v, w, S, z]) > 1 || l(v, w);
      });
    }, $ && (n[v] = $(n[v])));
  }
  function l(v, $) {
    try {
      u(a[v]($));
    } catch (w) {
      x(i[0][3], w);
    }
  }
  function u(v) {
    v.value instanceof lt ? Promise.resolve(v.value.v).then(m, _) : x(i[0][2], v);
  }
  function m(v) {
    l("next", v);
  }
  function _(v) {
    l("throw", v);
  }
  function x(v, $) {
    v($), i.shift(), i.length && l(i[0][0], i[0][1]);
  }
}
function Mo(e) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator], r;
  return t ? t.call(e) : (e = typeof pt == "function" ? pt(e) : e[Symbol.iterator](), r = {}, a("next"), a("throw"), a("return"), r[Symbol.asyncIterator] = function() {
    return this;
  }, r);
  function a(i) {
    r[i] = e[i] && function(s) {
      return new Promise(function(o, l) {
        s = e[i](s), n(o, l, s.done, s.value);
      });
    };
  }
  function n(i, s, o, l) {
    Promise.resolve(l).then(function(u) {
      i({ value: u, done: o });
    }, s);
  }
}
function F(e) {
  return typeof e == "function";
}
function Hn(e) {
  var t = function(a) {
    Error.call(a), a.stack = new Error().stack;
  }, r = e(t);
  return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
}
var $r = Hn(function(e) {
  return function(r) {
    e(this), this.message = r ? r.length + ` errors occurred during unsubscription:
` + r.map(function(a, n) {
      return n + 1 + ") " + a.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = r;
  };
});
function nr(e, t) {
  if (e) {
    var r = e.indexOf(t);
    0 <= r && e.splice(r, 1);
  }
}
var Ie = (function() {
  function e(t) {
    this.initialTeardown = t, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return e.prototype.unsubscribe = function() {
    var t, r, a, n, i;
    if (!this.closed) {
      this.closed = !0;
      var s = this._parentage;
      if (s)
        if (this._parentage = null, Array.isArray(s))
          try {
            for (var o = pt(s), l = o.next(); !l.done; l = o.next()) {
              var u = l.value;
              u.remove(this);
            }
          } catch (w) {
            t = { error: w };
          } finally {
            try {
              l && !l.done && (r = o.return) && r.call(o);
            } finally {
              if (t) throw t.error;
            }
          }
        else
          s.remove(this);
      var m = this.initialTeardown;
      if (F(m))
        try {
          m();
        } catch (w) {
          i = w instanceof $r ? w.errors : [w];
        }
      var _ = this._finalizers;
      if (_) {
        this._finalizers = null;
        try {
          for (var x = pt(_), v = x.next(); !v.done; v = x.next()) {
            var $ = v.value;
            try {
              an($);
            } catch (w) {
              i = i ?? [], w instanceof $r ? i = zt(zt([], ft(i)), ft(w.errors)) : i.push(w);
            }
          }
        } catch (w) {
          a = { error: w };
        } finally {
          try {
            v && !v.done && (n = x.return) && n.call(x);
          } finally {
            if (a) throw a.error;
          }
        }
      }
      if (i)
        throw new $r(i);
    }
  }, e.prototype.add = function(t) {
    var r;
    if (t && t !== this)
      if (this.closed)
        an(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this))
            return;
          t._addParent(this);
        }
        (this._finalizers = (r = this._finalizers) !== null && r !== void 0 ? r : []).push(t);
      }
  }, e.prototype._hasParent = function(t) {
    var r = this._parentage;
    return r === t || Array.isArray(r) && r.includes(t);
  }, e.prototype._addParent = function(t) {
    var r = this._parentage;
    this._parentage = Array.isArray(r) ? (r.push(t), r) : r ? [r, t] : t;
  }, e.prototype._removeParent = function(t) {
    var r = this._parentage;
    r === t ? this._parentage = null : Array.isArray(r) && nr(r, t);
  }, e.prototype.remove = function(t) {
    var r = this._finalizers;
    r && nr(r, t), t instanceof e && t._removeParent(this);
  }, e.EMPTY = (function() {
    var t = new e();
    return t.closed = !0, t;
  })(), e;
})(), Gn = Ie.EMPTY;
function Yn(e) {
  return e instanceof Ie || e && "closed" in e && F(e.remove) && F(e.add) && F(e.unsubscribe);
}
function an(e) {
  F(e) ? e() : e.unsubscribe();
}
var Ao = {
  Promise: void 0
}, To = {
  setTimeout: function(e, t) {
    for (var r = [], a = 2; a < arguments.length; a++)
      r[a - 2] = arguments[a];
    return setTimeout.apply(void 0, zt([e, t], ft(r)));
  },
  clearTimeout: function(e) {
    return clearTimeout(e);
  },
  delegate: void 0
};
function Jn(e) {
  To.setTimeout(function() {
    throw e;
  });
}
function zr() {
}
function Gt(e) {
  e();
}
var _a = (function(e) {
  Be(t, e);
  function t(r) {
    var a = e.call(this) || this;
    return a.isStopped = !1, r ? (a.destination = r, Yn(r) && r.add(a)) : a.destination = zo, a;
  }
  return t.create = function(r, a, n) {
    return new Fr(r, a, n);
  }, t.prototype.next = function(r) {
    this.isStopped || this._next(r);
  }, t.prototype.error = function(r) {
    this.isStopped || (this.isStopped = !0, this._error(r));
  }, t.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, t.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null);
  }, t.prototype._next = function(r) {
    this.destination.next(r);
  }, t.prototype._error = function(r) {
    try {
      this.destination.error(r);
    } finally {
      this.unsubscribe();
    }
  }, t.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, t;
})(Ie), Eo = (function() {
  function e(t) {
    this.partialObserver = t;
  }
  return e.prototype.next = function(t) {
    var r = this.partialObserver;
    if (r.next)
      try {
        r.next(t);
      } catch (a) {
        Ut(a);
      }
  }, e.prototype.error = function(t) {
    var r = this.partialObserver;
    if (r.error)
      try {
        r.error(t);
      } catch (a) {
        Ut(a);
      }
    else
      Ut(t);
  }, e.prototype.complete = function() {
    var t = this.partialObserver;
    if (t.complete)
      try {
        t.complete();
      } catch (r) {
        Ut(r);
      }
  }, e;
})(), Fr = (function(e) {
  Be(t, e);
  function t(r, a, n) {
    var i = e.call(this) || this, s;
    return F(r) || !r ? s = {
      next: r ?? void 0,
      error: a ?? void 0,
      complete: n ?? void 0
    } : s = r, i.destination = new Eo(s), i;
  }
  return t;
})(_a);
function Ut(e) {
  Jn(e);
}
function Po(e) {
  throw e;
}
var zo = {
  closed: !0,
  next: zr,
  error: Po,
  complete: zr
}, $a = (function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
})();
function Sa(e) {
  return e;
}
function Fo(e) {
  return e.length === 0 ? Sa : e.length === 1 ? e[0] : function(r) {
    return e.reduce(function(a, n) {
      return n(a);
    }, r);
  };
}
var te = (function() {
  function e(t) {
    t && (this._subscribe = t);
  }
  return e.prototype.lift = function(t) {
    var r = new e();
    return r.source = this, r.operator = t, r;
  }, e.prototype.subscribe = function(t, r, a) {
    var n = this, i = Io(t) ? t : new Fr(t, r, a);
    return Gt(function() {
      var s = n, o = s.operator, l = s.source;
      i.add(o ? o.call(i, l) : l ? n._subscribe(i) : n._trySubscribe(i));
    }), i;
  }, e.prototype._trySubscribe = function(t) {
    try {
      return this._subscribe(t);
    } catch (r) {
      t.error(r);
    }
  }, e.prototype.forEach = function(t, r) {
    var a = this;
    return r = nn(r), new r(function(n, i) {
      var s = new Fr({
        next: function(o) {
          try {
            t(o);
          } catch (l) {
            i(l), s.unsubscribe();
          }
        },
        error: i,
        complete: n
      });
      a.subscribe(s);
    });
  }, e.prototype._subscribe = function(t) {
    var r;
    return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(t);
  }, e.prototype[$a] = function() {
    return this;
  }, e.prototype.pipe = function() {
    for (var t = [], r = 0; r < arguments.length; r++)
      t[r] = arguments[r];
    return Fo(t)(this);
  }, e.prototype.toPromise = function(t) {
    var r = this;
    return t = nn(t), new t(function(a, n) {
      var i;
      r.subscribe(function(s) {
        return i = s;
      }, function(s) {
        return n(s);
      }, function() {
        return a(i);
      });
    });
  }, e.create = function(t) {
    return new e(t);
  }, e;
})();
function nn(e) {
  var t;
  return (t = e ?? Ao.Promise) !== null && t !== void 0 ? t : Promise;
}
function Oo(e) {
  return e && F(e.next) && F(e.error) && F(e.complete);
}
function Io(e) {
  return e && e instanceof _a || Oo(e) && Yn(e);
}
function Lo(e) {
  return F(e?.lift);
}
function yt(e) {
  return function(t) {
    if (Lo(t))
      return t.lift(function(r) {
        try {
          return e(r, this);
        } catch (a) {
          this.error(a);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function Je(e, t, r, a, n) {
  return new Do(e, t, r, a, n);
}
var Do = (function(e) {
  Be(t, e);
  function t(r, a, n, i, s, o) {
    var l = e.call(this, r) || this;
    return l.onFinalize = s, l.shouldUnsubscribe = o, l._next = a ? function(u) {
      try {
        a(u);
      } catch (m) {
        r.error(m);
      }
    } : e.prototype._next, l._error = i ? function(u) {
      try {
        i(u);
      } catch (m) {
        r.error(m);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._error, l._complete = n ? function() {
      try {
        n();
      } catch (u) {
        r.error(u);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._complete, l;
  }
  return t.prototype.unsubscribe = function() {
    var r;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var a = this.closed;
      e.prototype.unsubscribe.call(this), !a && ((r = this.onFinalize) === null || r === void 0 || r.call(this));
    }
  }, t;
})(_a), Bo = Hn(function(e) {
  return function() {
    e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), Qn = (function(e) {
  Be(t, e);
  function t() {
    var r = e.call(this) || this;
    return r.closed = !1, r.currentObservers = null, r.observers = [], r.isStopped = !1, r.hasError = !1, r.thrownError = null, r;
  }
  return t.prototype.lift = function(r) {
    var a = new sn(this, this);
    return a.operator = r, a;
  }, t.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new Bo();
  }, t.prototype.next = function(r) {
    var a = this;
    Gt(function() {
      var n, i;
      if (a._throwIfClosed(), !a.isStopped) {
        a.currentObservers || (a.currentObservers = Array.from(a.observers));
        try {
          for (var s = pt(a.currentObservers), o = s.next(); !o.done; o = s.next()) {
            var l = o.value;
            l.next(r);
          }
        } catch (u) {
          n = { error: u };
        } finally {
          try {
            o && !o.done && (i = s.return) && i.call(s);
          } finally {
            if (n) throw n.error;
          }
        }
      }
    });
  }, t.prototype.error = function(r) {
    var a = this;
    Gt(function() {
      if (a._throwIfClosed(), !a.isStopped) {
        a.hasError = a.isStopped = !0, a.thrownError = r;
        for (var n = a.observers; n.length; )
          n.shift().error(r);
      }
    });
  }, t.prototype.complete = function() {
    var r = this;
    Gt(function() {
      if (r._throwIfClosed(), !r.isStopped) {
        r.isStopped = !0;
        for (var a = r.observers; a.length; )
          a.shift().complete();
      }
    });
  }, t.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(t.prototype, "observed", {
    get: function() {
      var r;
      return ((r = this.observers) === null || r === void 0 ? void 0 : r.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype._trySubscribe = function(r) {
    return this._throwIfClosed(), e.prototype._trySubscribe.call(this, r);
  }, t.prototype._subscribe = function(r) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(r), this._innerSubscribe(r);
  }, t.prototype._innerSubscribe = function(r) {
    var a = this, n = this, i = n.hasError, s = n.isStopped, o = n.observers;
    return i || s ? Gn : (this.currentObservers = null, o.push(r), new Ie(function() {
      a.currentObservers = null, nr(o, r);
    }));
  }, t.prototype._checkFinalizedStatuses = function(r) {
    var a = this, n = a.hasError, i = a.thrownError, s = a.isStopped;
    n ? r.error(i) : s && r.complete();
  }, t.prototype.asObservable = function() {
    var r = new te();
    return r.source = this, r;
  }, t.create = function(r, a) {
    return new sn(r, a);
  }, t;
})(te), sn = (function(e) {
  Be(t, e);
  function t(r, a) {
    var n = e.call(this) || this;
    return n.destination = r, n.source = a, n;
  }
  return t.prototype.next = function(r) {
    var a, n;
    (n = (a = this.destination) === null || a === void 0 ? void 0 : a.next) === null || n === void 0 || n.call(a, r);
  }, t.prototype.error = function(r) {
    var a, n;
    (n = (a = this.destination) === null || a === void 0 ? void 0 : a.error) === null || n === void 0 || n.call(a, r);
  }, t.prototype.complete = function() {
    var r, a;
    (a = (r = this.destination) === null || r === void 0 ? void 0 : r.complete) === null || a === void 0 || a.call(r);
  }, t.prototype._subscribe = function(r) {
    var a, n;
    return (n = (a = this.source) === null || a === void 0 ? void 0 : a.subscribe(r)) !== null && n !== void 0 ? n : Gn;
  }, t;
})(Qn), Ro = {
  now: function() {
    return Date.now();
  }
}, jo = (function(e) {
  Be(t, e);
  function t(r, a) {
    return e.call(this) || this;
  }
  return t.prototype.schedule = function(r, a) {
    return this;
  }, t;
})(Ie), on = {
  setInterval: function(e, t) {
    for (var r = [], a = 2; a < arguments.length; a++)
      r[a - 2] = arguments[a];
    return setInterval.apply(void 0, zt([e, t], ft(r)));
  },
  clearInterval: function(e) {
    return clearInterval(e);
  },
  delegate: void 0
}, No = (function(e) {
  Be(t, e);
  function t(r, a) {
    var n = e.call(this, r, a) || this;
    return n.scheduler = r, n.work = a, n.pending = !1, n;
  }
  return t.prototype.schedule = function(r, a) {
    var n;
    if (a === void 0 && (a = 0), this.closed)
      return this;
    this.state = r;
    var i = this.id, s = this.scheduler;
    return i != null && (this.id = this.recycleAsyncId(s, i, a)), this.pending = !0, this.delay = a, this.id = (n = this.id) !== null && n !== void 0 ? n : this.requestAsyncId(s, this.id, a), this;
  }, t.prototype.requestAsyncId = function(r, a, n) {
    return n === void 0 && (n = 0), on.setInterval(r.flush.bind(r, this), n);
  }, t.prototype.recycleAsyncId = function(r, a, n) {
    if (n === void 0 && (n = 0), n != null && this.delay === n && this.pending === !1)
      return a;
    a != null && on.clearInterval(a);
  }, t.prototype.execute = function(r, a) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var n = this._execute(r, a);
    if (n)
      return n;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, t.prototype._execute = function(r, a) {
    var n = !1, i;
    try {
      this.work(r);
    } catch (s) {
      n = !0, i = s || new Error("Scheduled action threw falsy error");
    }
    if (n)
      return this.unsubscribe(), i;
  }, t.prototype.unsubscribe = function() {
    if (!this.closed) {
      var r = this, a = r.id, n = r.scheduler, i = n.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, nr(i, this), a != null && (this.id = this.recycleAsyncId(n, a, null)), this.delay = null, e.prototype.unsubscribe.call(this);
    }
  }, t;
})(jo), ln = (function() {
  function e(t, r) {
    r === void 0 && (r = e.now), this.schedulerActionCtor = t, this.now = r;
  }
  return e.prototype.schedule = function(t, r, a) {
    return r === void 0 && (r = 0), new this.schedulerActionCtor(this, t).schedule(a, r);
  }, e.now = Ro.now, e;
})(), Wo = (function(e) {
  Be(t, e);
  function t(r, a) {
    a === void 0 && (a = ln.now);
    var n = e.call(this, r, a) || this;
    return n.actions = [], n._active = !1, n;
  }
  return t.prototype.flush = function(r) {
    var a = this.actions;
    if (this._active) {
      a.push(r);
      return;
    }
    var n;
    this._active = !0;
    do
      if (n = r.execute(r.state, r.delay))
        break;
    while (r = a.shift());
    if (this._active = !1, n) {
      for (; r = a.shift(); )
        r.unsubscribe();
      throw n;
    }
  }, t;
})(ln), Ca = new Wo(No), qo = Ca, Xn = new te(function(e) {
  return e.complete();
});
function ei(e) {
  return e && F(e.schedule);
}
function ti(e) {
  return e[e.length - 1];
}
function ri(e) {
  return ei(ti(e)) ? e.pop() : void 0;
}
function Uo(e, t) {
  return typeof ti(e) == "number" ? e.pop() : t;
}
var Ma = (function(e) {
  return e && typeof e.length == "number" && typeof e != "function";
});
function ai(e) {
  return F(e?.then);
}
function ni(e) {
  return F(e[$a]);
}
function ii(e) {
  return Symbol.asyncIterator && F(e?.[Symbol.asyncIterator]);
}
function si(e) {
  return new TypeError("You provided " + (e !== null && typeof e == "object" ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function Ko() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var oi = Ko();
function li(e) {
  return F(e?.[oi]);
}
function ci(e) {
  return Co(this, arguments, function() {
    var r, a, n, i;
    return Zn(this, function(s) {
      switch (s.label) {
        case 0:
          r = e.getReader(), s.label = 1;
        case 1:
          s.trys.push([1, , 9, 10]), s.label = 2;
        case 2:
          return [4, lt(r.read())];
        case 3:
          return a = s.sent(), n = a.value, i = a.done, i ? [4, lt(void 0)] : [3, 5];
        case 4:
          return [2, s.sent()];
        case 5:
          return [4, lt(n)];
        case 6:
          return [4, s.sent()];
        case 7:
          return s.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return r.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function ui(e) {
  return F(e?.getReader);
}
function Re(e) {
  if (e instanceof te)
    return e;
  if (e != null) {
    if (ni(e))
      return Vo(e);
    if (Ma(e))
      return Zo(e);
    if (ai(e))
      return Ho(e);
    if (ii(e))
      return di(e);
    if (li(e))
      return Go(e);
    if (ui(e))
      return Yo(e);
  }
  throw si(e);
}
function Vo(e) {
  return new te(function(t) {
    var r = e[$a]();
    if (F(r.subscribe))
      return r.subscribe(t);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function Zo(e) {
  return new te(function(t) {
    for (var r = 0; r < e.length && !t.closed; r++)
      t.next(e[r]);
    t.complete();
  });
}
function Ho(e) {
  return new te(function(t) {
    e.then(function(r) {
      t.closed || (t.next(r), t.complete());
    }, function(r) {
      return t.error(r);
    }).then(null, Jn);
  });
}
function Go(e) {
  return new te(function(t) {
    var r, a;
    try {
      for (var n = pt(e), i = n.next(); !i.done; i = n.next()) {
        var s = i.value;
        if (t.next(s), t.closed)
          return;
      }
    } catch (o) {
      r = { error: o };
    } finally {
      try {
        i && !i.done && (a = n.return) && a.call(n);
      } finally {
        if (r) throw r.error;
      }
    }
    t.complete();
  });
}
function di(e) {
  return new te(function(t) {
    Jo(e, t).catch(function(r) {
      return t.error(r);
    });
  });
}
function Yo(e) {
  return di(ci(e));
}
function Jo(e, t) {
  var r, a, n, i;
  return So(this, void 0, void 0, function() {
    var s, o;
    return Zn(this, function(l) {
      switch (l.label) {
        case 0:
          l.trys.push([0, 5, 6, 11]), r = Mo(e), l.label = 1;
        case 1:
          return [4, r.next()];
        case 2:
          if (a = l.sent(), !!a.done) return [3, 4];
          if (s = a.value, t.next(s), t.closed)
            return [2];
          l.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return o = l.sent(), n = { error: o }, [3, 11];
        case 6:
          return l.trys.push([6, , 9, 10]), a && !a.done && (i = r.return) ? [4, i.call(r)] : [3, 8];
        case 7:
          l.sent(), l.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (n) throw n.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return t.complete(), [2];
      }
    });
  });
}
function Ge(e, t, r, a, n) {
  a === void 0 && (a = 0), n === void 0 && (n = !1);
  var i = t.schedule(function() {
    r(), n ? e.add(this.schedule(null, a)) : this.unsubscribe();
  }, a);
  if (e.add(i), !n)
    return i;
}
function hi(e, t) {
  return t === void 0 && (t = 0), yt(function(r, a) {
    r.subscribe(Je(a, function(n) {
      return Ge(a, e, function() {
        return a.next(n);
      }, t);
    }, function() {
      return Ge(a, e, function() {
        return a.complete();
      }, t);
    }, function(n) {
      return Ge(a, e, function() {
        return a.error(n);
      }, t);
    }));
  });
}
function pi(e, t) {
  return t === void 0 && (t = 0), yt(function(r, a) {
    a.add(e.schedule(function() {
      return r.subscribe(a);
    }, t));
  });
}
function Qo(e, t) {
  return Re(e).pipe(pi(t), hi(t));
}
function Xo(e, t) {
  return Re(e).pipe(pi(t), hi(t));
}
function el(e, t) {
  return new te(function(r) {
    var a = 0;
    return t.schedule(function() {
      a === e.length ? r.complete() : (r.next(e[a++]), r.closed || this.schedule());
    });
  });
}
function tl(e, t) {
  return new te(function(r) {
    var a;
    return Ge(r, t, function() {
      a = e[oi](), Ge(r, t, function() {
        var n, i, s;
        try {
          n = a.next(), i = n.value, s = n.done;
        } catch (o) {
          r.error(o);
          return;
        }
        s ? r.complete() : r.next(i);
      }, 0, !0);
    }), function() {
      return F(a?.return) && a.return();
    };
  });
}
function fi(e, t) {
  if (!e)
    throw new Error("Iterable cannot be null");
  return new te(function(r) {
    Ge(r, t, function() {
      var a = e[Symbol.asyncIterator]();
      Ge(r, t, function() {
        a.next().then(function(n) {
          n.done ? r.complete() : r.next(n.value);
        });
      }, 0, !0);
    });
  });
}
function rl(e, t) {
  return fi(ci(e), t);
}
function al(e, t) {
  if (e != null) {
    if (ni(e))
      return Qo(e, t);
    if (Ma(e))
      return el(e, t);
    if (ai(e))
      return Xo(e, t);
    if (ii(e))
      return fi(e, t);
    if (li(e))
      return tl(e, t);
    if (ui(e))
      return rl(e, t);
  }
  throw si(e);
}
function gi(e, t) {
  return t ? al(e, t) : Re(e);
}
function nl() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  var r = ri(e);
  return gi(e, r);
}
function il(e) {
  return e instanceof Date && !isNaN(e);
}
function Aa(e, t) {
  return yt(function(r, a) {
    var n = 0;
    r.subscribe(Je(a, function(i) {
      a.next(e.call(t, i, n++));
    }));
  });
}
var sl = Array.isArray;
function ol(e, t) {
  return sl(t) ? e.apply(void 0, zt([], ft(t))) : e(t);
}
function ll(e) {
  return Aa(function(t) {
    return ol(e, t);
  });
}
function cl(e, t, r, a, n, i, s, o) {
  var l = [], u = 0, m = 0, _ = !1, x = function() {
    _ && !l.length && !u && t.complete();
  }, v = function(w) {
    return u < a ? $(w) : l.push(w);
  }, $ = function(w) {
    u++;
    var S = !1;
    Re(r(w, m++)).subscribe(Je(t, function(z) {
      t.next(z);
    }, function() {
      S = !0;
    }, void 0, function() {
      if (S)
        try {
          u--;
          for (var z = function() {
            var p = l.shift();
            s || $(p);
          }; l.length && u < a; )
            z();
          x();
        } catch (p) {
          t.error(p);
        }
    }));
  };
  return e.subscribe(Je(t, v, function() {
    _ = !0, x();
  })), function() {
  };
}
function Ta(e, t, r) {
  return r === void 0 && (r = 1 / 0), F(t) ? Ta(function(a, n) {
    return Aa(function(i, s) {
      return t(a, i, n, s);
    })(Re(e(a, n)));
  }, r) : (typeof t == "number" && (r = t), yt(function(a, n) {
    return cl(a, n, e, r);
  }));
}
function ul(e) {
  return e === void 0 && (e = 1 / 0), Ta(Sa, e);
}
var dl = ["addListener", "removeListener"], hl = ["addEventListener", "removeEventListener"], pl = ["on", "off"];
function Ft(e, t, r, a) {
  if (F(r) && (a = r, r = void 0), a)
    return Ft(e, t, r).pipe(ll(a));
  var n = ft(ml(e) ? hl.map(function(o) {
    return function(l) {
      return e[o](t, l, r);
    };
  }) : fl(e) ? dl.map(cn(e, t)) : gl(e) ? pl.map(cn(e, t)) : [], 2), i = n[0], s = n[1];
  if (!i && Ma(e))
    return Ta(function(o) {
      return Ft(o, t, r);
    })(Re(e));
  if (!i)
    throw new TypeError("Invalid event target");
  return new te(function(o) {
    var l = function() {
      for (var u = [], m = 0; m < arguments.length; m++)
        u[m] = arguments[m];
      return o.next(1 < u.length ? u : u[0]);
    };
    return i(l), function() {
      return s(l);
    };
  });
}
function cn(e, t) {
  return function(r) {
    return function(a) {
      return e[r](t, a);
    };
  };
}
function fl(e) {
  return F(e.addListener) && F(e.removeListener);
}
function gl(e) {
  return F(e.on) && F(e.off);
}
function ml(e) {
  return F(e.addEventListener) && F(e.removeEventListener);
}
function vl(e, t, r) {
  r === void 0 && (r = qo);
  var a = -1;
  return ei(t) ? r = t : a = t, new te(function(n) {
    var i = il(e) ? +e - r.now() : e;
    i < 0 && (i = 0);
    var s = 0;
    return r.schedule(function() {
      n.closed || (n.next(s++), 0 <= a ? this.schedule(void 0, a) : n.complete());
    }, i);
  });
}
function bl(e, t) {
  return t === void 0 && (t = Ca), vl(e, e, t);
}
function wl() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  var r = ri(e), a = Uo(e, 1 / 0), n = e;
  return n.length ? n.length === 1 ? Re(n[0]) : ul(a)(gi(n, r)) : Xn;
}
function yl(e) {
  return yt(function(t, r) {
    var a = !1, n = null;
    t.subscribe(Je(r, function(i) {
      a = !0, n = i;
    })), Re(e).subscribe(Je(r, function() {
      if (a) {
        a = !1;
        var i = n;
        n = null, r.next(i);
      }
    }, zr));
  });
}
function kl(e, t) {
  return t === void 0 && (t = Ca), yl(bl(e, t));
}
function xl(e, t, r) {
  var a = F(e) || t || r ? { next: e, error: t, complete: r } : e;
  return a ? yt(function(n, i) {
    var s;
    (s = a.subscribe) === null || s === void 0 || s.call(a);
    var o = !0;
    n.subscribe(Je(i, function(l) {
      var u;
      (u = a.next) === null || u === void 0 || u.call(a, l), i.next(l);
    }, function() {
      var l;
      o = !1, (l = a.complete) === null || l === void 0 || l.call(a), i.complete();
    }, function(l) {
      var u;
      o = !1, (u = a.error) === null || u === void 0 || u.call(a, l), i.error(l);
    }, function() {
      var l, u;
      o && ((l = a.unsubscribe) === null || l === void 0 || l.call(a)), (u = a.finalize) === null || u === void 0 || u.call(a);
    }));
  }) : Sa;
}
function mi() {
  if (Dt) return !1;
  const e = "test";
  try {
    return localStorage.setItem(e, e), localStorage.removeItem(e), !0;
  } catch {
    return !1;
  }
}
function ge(e, t, r) {
  return new CustomEvent(e, { detail: t, ...r });
}
class _l {
  constructor(t, { target: r, config: a, callback: n, skipInitial: i }) {
    this.t = /* @__PURE__ */ new Set(), this.o = !1, this.i = !1, this.h = t, r !== null && this.t.add(r ?? t), this.l = a, this.o = i ?? this.o, this.callback = n, Nn || (window.ResizeObserver ? (this.u = new ResizeObserver((s) => {
      this.handleChanges(s), this.h.requestUpdate();
    }), t.addController(this)) : console.warn("ResizeController error: browser does not support ResizeObserver."));
  }
  handleChanges(t) {
    this.value = this.callback?.(t, this.u);
  }
  hostConnected() {
    for (const t of this.t) this.observe(t);
  }
  hostDisconnected() {
    this.disconnect();
  }
  async hostUpdated() {
    !this.o && this.i && this.handleChanges([]), this.i = !1;
  }
  observe(t) {
    this.t.add(t), this.u.observe(t, this.l), this.i = !0, this.h.requestUpdate();
  }
  unobserve(t) {
    this.t.delete(t), this.u.unobserve(t);
  }
  disconnect() {
    this.u.disconnect();
  }
  target(t) {
    return $l(this, t);
  }
}
const $l = oo(class extends so {
  constructor() {
    super(...arguments), this.observing = !1;
  }
  render(e, t) {
  }
  update(e, [t, r]) {
    this.controller = t, this.part = e, this.observe = r, r === !1 ? (t.unobserve(e.element), this.observing = !1) : this.observing === !1 && (t.observe(e.element), this.observing = !0);
  }
  disconnected() {
    this.controller?.unobserve(this.part.element), this.observing = !1;
  }
  reconnected() {
    this.observe !== !1 && this.observing === !1 && (this.controller?.observe(this.part.element), this.observing = !0);
  }
});
var un = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Sr = { exports: {} }, dn;
function Sl() {
  return dn || (dn = 1, (function(e) {
    var t = typeof window < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {};
    var r = (function(a) {
      var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, i = 0, s = {}, o = {
        /**
         * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
         * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
         * additional languages or plugins yourself.
         *
         * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
         *
         * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.manual = true;
         * // add a new <script> to load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        manual: a.Prism && a.Prism.manual,
        /**
         * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
         * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
         * own worker, you don't want it to do this.
         *
         * By setting this value to `true`, Prism will not add its own listeners to the worker.
         *
         * You obviously have to change this value before Prism executes. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.disableWorkerMessageHandler = true;
         * // Load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        disableWorkerMessageHandler: a.Prism && a.Prism.disableWorkerMessageHandler,
        /**
         * A namespace for utility methods.
         *
         * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
         * change or disappear at any time.
         *
         * @namespace
         * @memberof Prism
         */
        util: {
          encode: function p(c) {
            return c instanceof l ? new l(c.type, p(c.content), c.alias) : Array.isArray(c) ? c.map(p) : c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          },
          /**
           * Returns the name of the type of the given value.
           *
           * @param {any} o
           * @returns {string}
           * @example
           * type(null)      === 'Null'
           * type(undefined) === 'Undefined'
           * type(123)       === 'Number'
           * type('foo')     === 'String'
           * type(true)      === 'Boolean'
           * type([1, 2])    === 'Array'
           * type({})        === 'Object'
           * type(String)    === 'Function'
           * type(/abc+/)    === 'RegExp'
           */
          type: function(p) {
            return Object.prototype.toString.call(p).slice(8, -1);
          },
          /**
           * Returns a unique number for the given object. Later calls will still return the same number.
           *
           * @param {Object} obj
           * @returns {number}
           */
          objId: function(p) {
            return p.__id || Object.defineProperty(p, "__id", { value: ++i }), p.__id;
          },
          /**
           * Creates a deep clone of the given object.
           *
           * The main intended use of this function is to clone language definitions.
           *
           * @param {T} o
           * @param {Record<number, any>} [visited]
           * @returns {T}
           * @template T
           */
          clone: function p(c, f) {
            f = f || {};
            var d, h;
            switch (o.util.type(c)) {
              case "Object":
                if (h = o.util.objId(c), f[h])
                  return f[h];
                d = /** @type {Record<string, any>} */
                {}, f[h] = d;
                for (var b in c)
                  c.hasOwnProperty(b) && (d[b] = p(c[b], f));
                return (
                  /** @type {any} */
                  d
                );
              case "Array":
                return h = o.util.objId(c), f[h] ? f[h] : (d = [], f[h] = d, /** @type {Array} */
                /** @type {any} */
                c.forEach(function(y, k) {
                  d[k] = p(y, f);
                }), /** @type {any} */
                d);
              default:
                return c;
            }
          },
          /**
           * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
           *
           * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
           *
           * @param {Element} element
           * @returns {string}
           */
          getLanguage: function(p) {
            for (; p; ) {
              var c = n.exec(p.className);
              if (c)
                return c[1].toLowerCase();
              p = p.parentElement;
            }
            return "none";
          },
          /**
           * Sets the Prism `language-xxxx` class of the given element.
           *
           * @param {Element} element
           * @param {string} language
           * @returns {void}
           */
          setLanguage: function(p, c) {
            p.className = p.className.replace(RegExp(n, "gi"), ""), p.classList.add("language-" + c);
          },
          /**
           * Returns the script element that is currently executing.
           *
           * This does __not__ work for line script element.
           *
           * @returns {HTMLScriptElement | null}
           */
          currentScript: function() {
            if (typeof document > "u")
              return null;
            if (document.currentScript && document.currentScript.tagName === "SCRIPT")
              return (
                /** @type {any} */
                document.currentScript
              );
            try {
              throw new Error();
            } catch (d) {
              var p = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(d.stack) || [])[1];
              if (p) {
                var c = document.getElementsByTagName("script");
                for (var f in c)
                  if (c[f].src == p)
                    return c[f];
              }
              return null;
            }
          },
          /**
           * Returns whether a given class is active for `element`.
           *
           * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
           * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
           * given class is just the given class with a `no-` prefix.
           *
           * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
           * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
           * ancestors have the given class or the negated version of it, then the default activation will be returned.
           *
           * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
           * version of it, the class is considered active.
           *
           * @param {Element} element
           * @param {string} className
           * @param {boolean} [defaultActivation=false]
           * @returns {boolean}
           */
          isActive: function(p, c, f) {
            for (var d = "no-" + c; p; ) {
              var h = p.classList;
              if (h.contains(c))
                return !0;
              if (h.contains(d))
                return !1;
              p = p.parentElement;
            }
            return !!f;
          }
        },
        /**
         * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
         *
         * @namespace
         * @memberof Prism
         * @public
         */
        languages: {
          /**
           * The grammar for plain, unformatted text.
           */
          plain: s,
          plaintext: s,
          text: s,
          txt: s,
          /**
           * Creates a deep copy of the language with the given id and appends the given tokens.
           *
           * If a token in `redef` also appears in the copied language, then the existing token in the copied language
           * will be overwritten at its original position.
           *
           * ## Best practices
           *
           * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
           * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
           * understand the language definition because, normally, the order of tokens matters in Prism grammars.
           *
           * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
           * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
           *
           * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
           * @param {Grammar} redef The new tokens to append.
           * @returns {Grammar} The new language created.
           * @public
           * @example
           * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
           *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
           *     // at its original position
           *     'comment': { ... },
           *     // CSS doesn't have a 'color' token, so this token will be appended
           *     'color': /\b(?:red|green|blue)\b/
           * });
           */
          extend: function(p, c) {
            var f = o.util.clone(o.languages[p]);
            for (var d in c)
              f[d] = c[d];
            return f;
          },
          /**
           * Inserts tokens _before_ another token in a language definition or any other grammar.
           *
           * ## Usage
           *
           * This helper method makes it easy to modify existing languages. For example, the CSS language definition
           * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
           * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
           * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
           * this:
           *
           * ```js
           * Prism.languages.markup.style = {
           *     // token
           * };
           * ```
           *
           * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
           * before existing tokens. For the CSS example above, you would use it like this:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'cdata', {
           *     'style': {
           *         // token
           *     }
           * });
           * ```
           *
           * ## Special cases
           *
           * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
           * will be ignored.
           *
           * This behavior can be used to insert tokens after `before`:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'comment', {
           *     'comment': Prism.languages.markup.comment,
           *     // tokens after 'comment'
           * });
           * ```
           *
           * ## Limitations
           *
           * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
           * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
           * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
           * deleting properties which is necessary to insert at arbitrary positions.
           *
           * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
           * Instead, it will create a new object and replace all references to the target object with the new one. This
           * can be done without temporarily deleting properties, so the iteration order is well-defined.
           *
           * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
           * you hold the target object in a variable, then the value of the variable will not change.
           *
           * ```js
           * var oldMarkup = Prism.languages.markup;
           * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
           *
           * assert(oldMarkup !== Prism.languages.markup);
           * assert(newMarkup === Prism.languages.markup);
           * ```
           *
           * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
           * object to be modified.
           * @param {string} before The key to insert before.
           * @param {Grammar} insert An object containing the key-value pairs to be inserted.
           * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
           * object to be modified.
           *
           * Defaults to `Prism.languages`.
           * @returns {Grammar} The new grammar object.
           * @public
           */
          insertBefore: function(p, c, f, d) {
            d = d || /** @type {any} */
            o.languages;
            var h = d[p], b = {};
            for (var y in h)
              if (h.hasOwnProperty(y)) {
                if (y == c)
                  for (var k in f)
                    f.hasOwnProperty(k) && (b[k] = f[k]);
                f.hasOwnProperty(y) || (b[y] = h[y]);
              }
            var T = d[p];
            return d[p] = b, o.languages.DFS(o.languages, function(I, M) {
              M === T && I != p && (this[I] = b);
            }), b;
          },
          // Traverse a language definition with Depth First Search
          DFS: function p(c, f, d, h) {
            h = h || {};
            var b = o.util.objId;
            for (var y in c)
              if (c.hasOwnProperty(y)) {
                f.call(c, y, c[y], d || y);
                var k = c[y], T = o.util.type(k);
                T === "Object" && !h[b(k)] ? (h[b(k)] = !0, p(k, f, null, h)) : T === "Array" && !h[b(k)] && (h[b(k)] = !0, p(k, f, y, h));
              }
          }
        },
        plugins: {},
        /**
         * This is the most high-level function in Prism’s API.
         * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
         * each one of them.
         *
         * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
         *
         * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
         * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
         * @memberof Prism
         * @public
         */
        highlightAll: function(p, c) {
          o.highlightAllUnder(document, p, c);
        },
        /**
         * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
         * {@link Prism.highlightElement} on each one of them.
         *
         * The following hooks will be run:
         * 1. `before-highlightall`
         * 2. `before-all-elements-highlight`
         * 3. All hooks of {@link Prism.highlightElement} for each element.
         *
         * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
         * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
         * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
         * @memberof Prism
         * @public
         */
        highlightAllUnder: function(p, c, f) {
          var d = {
            callback: f,
            container: p,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          o.hooks.run("before-highlightall", d), d.elements = Array.prototype.slice.apply(d.container.querySelectorAll(d.selector)), o.hooks.run("before-all-elements-highlight", d);
          for (var h = 0, b; b = d.elements[h++]; )
            o.highlightElement(b, c === !0, d.callback);
        },
        /**
         * Highlights the code inside a single element.
         *
         * The following hooks will be run:
         * 1. `before-sanity-check`
         * 2. `before-highlight`
         * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
         * 4. `before-insert`
         * 5. `after-highlight`
         * 6. `complete`
         *
         * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
         * the element's language.
         *
         * @param {Element} element The element containing the code.
         * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
         * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
         * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
         * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
         *
         * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
         * asynchronous highlighting to work. You can build your own bundle on the
         * [Download page](https://prismjs.com/download.html).
         * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
         * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
         * @memberof Prism
         * @public
         */
        highlightElement: function(p, c, f) {
          var d = o.util.getLanguage(p), h = o.languages[d];
          o.util.setLanguage(p, d);
          var b = p.parentElement;
          b && b.nodeName.toLowerCase() === "pre" && o.util.setLanguage(b, d);
          var y = p.textContent, k = {
            element: p,
            language: d,
            grammar: h,
            code: y
          };
          function T(M) {
            k.highlightedCode = M, o.hooks.run("before-insert", k), k.element.innerHTML = k.highlightedCode, o.hooks.run("after-highlight", k), o.hooks.run("complete", k), f && f.call(k.element);
          }
          if (o.hooks.run("before-sanity-check", k), b = k.element.parentElement, b && b.nodeName.toLowerCase() === "pre" && !b.hasAttribute("tabindex") && b.setAttribute("tabindex", "0"), !k.code) {
            o.hooks.run("complete", k), f && f.call(k.element);
            return;
          }
          if (o.hooks.run("before-highlight", k), !k.grammar) {
            T(o.util.encode(k.code));
            return;
          }
          if (c && a.Worker) {
            var I = new Worker(o.filename);
            I.onmessage = function(M) {
              T(M.data);
            }, I.postMessage(JSON.stringify({
              language: k.language,
              code: k.code,
              immediateClose: !0
            }));
          } else
            T(o.highlight(k.code, k.grammar, k.language));
        },
        /**
         * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
         * and the language definitions to use, and returns a string with the HTML produced.
         *
         * The following hooks will be run:
         * 1. `before-tokenize`
         * 2. `after-tokenize`
         * 3. `wrap`: On each {@link Token}.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @param {string} language The name of the language definition passed to `grammar`.
         * @returns {string} The highlighted HTML.
         * @memberof Prism
         * @public
         * @example
         * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
         */
        highlight: function(p, c, f) {
          var d = {
            code: p,
            grammar: c,
            language: f
          };
          if (o.hooks.run("before-tokenize", d), !d.grammar)
            throw new Error('The language "' + d.language + '" has no grammar.');
          return d.tokens = o.tokenize(d.code, d.grammar), o.hooks.run("after-tokenize", d), l.stringify(o.util.encode(d.tokens), d.language);
        },
        /**
         * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
         * and the language definitions to use, and returns an array with the tokenized code.
         *
         * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
         *
         * This method could be useful in other contexts as well, as a very crude parser.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @returns {TokenStream} An array of strings and tokens, a token stream.
         * @memberof Prism
         * @public
         * @example
         * let code = `var foo = 0;`;
         * let tokens = Prism.tokenize(code, Prism.languages.javascript);
         * tokens.forEach(token => {
         *     if (token instanceof Prism.Token && token.type === 'number') {
         *         console.log(`Found numeric literal: ${token.content}`);
         *     }
         * });
         */
        tokenize: function(p, c) {
          var f = c.rest;
          if (f) {
            for (var d in f)
              c[d] = f[d];
            delete c.rest;
          }
          var h = new _();
          return x(h, h.head, p), m(p, h, c, h.head, 0), $(h);
        },
        /**
         * @namespace
         * @memberof Prism
         * @public
         */
        hooks: {
          all: {},
          /**
           * Adds the given callback to the list of callbacks for the given hook.
           *
           * The callback will be invoked when the hook it is registered for is run.
           * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
           *
           * One callback function can be registered to multiple hooks and the same hook multiple times.
           *
           * @param {string} name The name of the hook.
           * @param {HookCallback} callback The callback function which is given environment variables.
           * @public
           */
          add: function(p, c) {
            var f = o.hooks.all;
            f[p] = f[p] || [], f[p].push(c);
          },
          /**
           * Runs a hook invoking all registered callbacks with the given environment variables.
           *
           * Callbacks will be invoked synchronously and in the order in which they were registered.
           *
           * @param {string} name The name of the hook.
           * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
           * @public
           */
          run: function(p, c) {
            var f = o.hooks.all[p];
            if (!(!f || !f.length))
              for (var d = 0, h; h = f[d++]; )
                h(c);
          }
        },
        Token: l
      };
      a.Prism = o;
      function l(p, c, f, d) {
        this.type = p, this.content = c, this.alias = f, this.length = (d || "").length | 0;
      }
      l.stringify = function p(c, f) {
        if (typeof c == "string")
          return c;
        if (Array.isArray(c)) {
          var d = "";
          return c.forEach(function(T) {
            d += p(T, f);
          }), d;
        }
        var h = {
          type: c.type,
          content: p(c.content, f),
          tag: "span",
          classes: ["token", c.type],
          attributes: {},
          language: f
        }, b = c.alias;
        b && (Array.isArray(b) ? Array.prototype.push.apply(h.classes, b) : h.classes.push(b)), o.hooks.run("wrap", h);
        var y = "";
        for (var k in h.attributes)
          y += " " + k + '="' + (h.attributes[k] || "").replace(/"/g, "&quot;") + '"';
        return "<" + h.tag + ' class="' + h.classes.join(" ") + '"' + y + ">" + h.content + "</" + h.tag + ">";
      };
      function u(p, c, f, d) {
        p.lastIndex = c;
        var h = p.exec(f);
        if (h && d && h[1]) {
          var b = h[1].length;
          h.index += b, h[0] = h[0].slice(b);
        }
        return h;
      }
      function m(p, c, f, d, h, b) {
        for (var y in f)
          if (!(!f.hasOwnProperty(y) || !f[y])) {
            var k = f[y];
            k = Array.isArray(k) ? k : [k];
            for (var T = 0; T < k.length; ++T) {
              if (b && b.cause == y + "," + T)
                return;
              var I = k[T], M = I.inside, A = !!I.lookbehind, Me = !!I.greedy, J = I.alias;
              if (Me && !I.pattern.global) {
                var at = I.pattern.toString().match(/[imsuy]*$/)[0];
                I.pattern = RegExp(I.pattern.source, at + "g");
              }
              for (var ve = I.pattern || I, R = d.next, D = h; R !== c.tail && !(b && D >= b.reach); D += R.value.length, R = R.next) {
                var Q = R.value;
                if (c.length > p.length)
                  return;
                if (!(Q instanceof l)) {
                  var be = 1, ae;
                  if (Me) {
                    if (ae = u(ve, D, p, A), !ae || ae.index >= p.length)
                      break;
                    var Nt = ae.index, ao = ae.index + ae[0].length, Ae = D;
                    for (Ae += R.value.length; Nt >= Ae; )
                      R = R.next, Ae += R.value.length;
                    if (Ae -= R.value.length, D = Ae, R.value instanceof l)
                      continue;
                    for (var $t = R; $t !== c.tail && (Ae < ao || typeof $t.value == "string"); $t = $t.next)
                      be++, Ae += $t.value.length;
                    be--, Q = p.slice(D, Ae), ae.index -= D;
                  } else if (ae = u(ve, 0, Q, A), !ae)
                    continue;
                  var Nt = ae.index, Wt = ae[0], wr = Q.slice(0, Nt), Ya = Q.slice(Nt + Wt.length), yr = D + Q.length;
                  b && yr > b.reach && (b.reach = yr);
                  var qt = R.prev;
                  wr && (qt = x(c, qt, wr), D += wr.length), v(c, qt, be);
                  var no = new l(y, M ? o.tokenize(Wt, M) : Wt, J, Wt);
                  if (R = x(c, qt, no), Ya && x(c, R, Ya), be > 1) {
                    var kr = {
                      cause: y + "," + T,
                      reach: yr
                    };
                    m(p, c, f, R.prev, D, kr), b && kr.reach > b.reach && (b.reach = kr.reach);
                  }
                }
              }
            }
          }
      }
      function _() {
        var p = { value: null, prev: null, next: null }, c = { value: null, prev: p, next: null };
        p.next = c, this.head = p, this.tail = c, this.length = 0;
      }
      function x(p, c, f) {
        var d = c.next, h = { value: f, prev: c, next: d };
        return c.next = h, d.prev = h, p.length++, h;
      }
      function v(p, c, f) {
        for (var d = c.next, h = 0; h < f && d !== p.tail; h++)
          d = d.next;
        c.next = d, d.prev = c, p.length -= h;
      }
      function $(p) {
        for (var c = [], f = p.head.next; f !== p.tail; )
          c.push(f.value), f = f.next;
        return c;
      }
      if (!a.document)
        return a.addEventListener && (o.disableWorkerMessageHandler || a.addEventListener("message", function(p) {
          var c = JSON.parse(p.data), f = c.language, d = c.code, h = c.immediateClose;
          a.postMessage(o.highlight(d, o.languages[f], f)), h && a.close();
        }, !1)), o;
      var w = o.util.currentScript();
      w && (o.filename = w.src, w.hasAttribute("data-manual") && (o.manual = !0));
      function S() {
        o.manual || o.highlightAll();
      }
      if (!o.manual) {
        var z = document.readyState;
        z === "loading" || z === "interactive" && w && w.defer ? document.addEventListener("DOMContentLoaded", S) : window.requestAnimationFrame ? window.requestAnimationFrame(S) : window.setTimeout(S, 16);
      }
      return o;
    })(t);
    e.exports && (e.exports = r), typeof un < "u" && (un.Prism = r);
  })(Sr)), Sr.exports;
}
var hn = Sl();
Prism.languages.clike = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: !0,
      greedy: !0
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: !0,
      greedy: !0
    }
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: {
      punctuation: /[.\\]/
    }
  },
  keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  boolean: /\b(?:false|true)\b/,
  function: /\b\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: !0
    }
  ],
  keyword: [
    {
      pattern: /((?:^|\})\s*)catch\b/,
      lookbehind: !0
    },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0
    }
  ],
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number: {
    pattern: RegExp(
      /(^|[^\w$])/.source + "(?:" + // constant
      (/NaN|Infinity/.source + "|" + // binary integer
      /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
      /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
      /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
      /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
      /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
    ),
    lookbehind: !0
  },
  operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});
Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: RegExp(
      // lookbehind
      // eslint-disable-next-line regexp/no-dupe-characters-character-class
      /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
      // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
      // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
      // with the only syntax, so we have to define 2 different regex patterns.
      /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
      /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
      /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
    ),
    lookbehind: !0,
    greedy: !0,
    inside: {
      "regex-source": {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: !0,
        alias: "language-regex",
        inside: Prism.languages.regex
      },
      "regex-delimiter": /^\/|\/$/,
      "regex-flags": /^[a-z]+$/
    }
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  "function-variable": {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: "function"
  },
  parameter: [
    {
      pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
      lookbehind: !0,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    },
    {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    }
  ],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore("javascript", "string", {
  hashbang: {
    pattern: /^#!.*/,
    greedy: !0,
    alias: "comment"
  },
  "template-string": {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: !0,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  },
  "string-property": {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "property"
  }
});
Prism.languages.insertBefore("javascript", "operator", {
  "literal-property": {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: !0,
    alias: "property"
  }
});
Prism.languages.markup && (Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.markup.tag.addAttribute(
  /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
  "javascript"
));
Prism.languages.js = Prism.languages.javascript;
var pn = {}, fn;
function Cl() {
  return fn || (fn = 1, (function(e) {
    e.languages.typescript = e.languages.extend("javascript", {
      "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
        lookbehind: !0,
        greedy: !0,
        inside: null
        // see below
      },
      builtin: /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
    }), e.languages.typescript.keyword.push(
      /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
      // keywords that have to be followed by an identifier
      /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
      // This is for `import type *, {}`
      /\btype\b(?=\s*(?:[\{*]|$))/
    ), delete e.languages.typescript.parameter, delete e.languages.typescript["literal-property"];
    var t = e.languages.extend("typescript", {});
    delete t["class-name"], e.languages.typescript["class-name"].inside = t, e.languages.insertBefore("typescript", "function", {
      decorator: {
        pattern: /@[$\w\xA0-\uFFFF]+/,
        inside: {
          at: {
            pattern: /^@/,
            alias: "operator"
          },
          function: /^[\s\S]+/
        }
      },
      "generic-function": {
        // e.g. foo<T extends "bar" | "baz">( ...
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
        greedy: !0,
        inside: {
          function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
          generic: {
            pattern: /<[\s\S]+/,
            // everything after the first <
            alias: "class-name",
            inside: t
          }
        }
      }
    }), e.languages.ts = e.languages.typescript;
  })(Prism)), pn;
}
Cl();
var gn = {}, mn;
function Ml() {
  return mn || (mn = 1, (function(e) {
    function t(D, Q) {
      return D.replace(/<<(\d+)>>/g, function(be, ae) {
        return "(?:" + Q[+ae] + ")";
      });
    }
    function r(D, Q, be) {
      return RegExp(t(D, Q), "");
    }
    function a(D, Q) {
      for (var be = 0; be < Q; be++)
        D = D.replace(/<<self>>/g, function() {
          return "(?:" + D + ")";
        });
      return D.replace(/<<self>>/g, "[^\\s\\S]");
    }
    var n = {
      // keywords which represent a return or variable type
      type: "bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",
      // keywords which are used to declare a type
      typeDeclaration: "class enum interface record struct",
      // contextual keywords
      // ("var" and "dynamic" are missing because they are used like types)
      contextual: "add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",
      // all other keywords
      other: "abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield"
    };
    function i(D) {
      return "\\b(?:" + D.trim().replace(/ /g, "|") + ")\\b";
    }
    var s = i(n.typeDeclaration), o = RegExp(i(n.type + " " + n.typeDeclaration + " " + n.contextual + " " + n.other)), l = i(n.typeDeclaration + " " + n.contextual + " " + n.other), u = i(n.type + " " + n.typeDeclaration + " " + n.other), m = a(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2), _ = a(/\((?:[^()]|<<self>>)*\)/.source, 2), x = /@?\b[A-Za-z_]\w*\b/.source, v = t(/<<0>>(?:\s*<<1>>)?/.source, [x, m]), $ = t(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [l, v]), w = /\[\s*(?:,\s*)*\]/.source, S = t(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [$, w]), z = t(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [m, _, w]), p = t(/\(<<0>>+(?:,<<0>>+)+\)/.source, [z]), c = t(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [p, $, w]), f = {
      keyword: o,
      punctuation: /[<>()?,.:[\]]/
    }, d = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source, h = /"(?:\\.|[^\\"\r\n])*"/.source, b = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;
    e.languages.csharp = e.languages.extend("clike", {
      string: [
        {
          pattern: r(/(^|[^$\\])<<0>>/.source, [b]),
          lookbehind: !0,
          greedy: !0
        },
        {
          pattern: r(/(^|[^@$\\])<<0>>/.source, [h]),
          lookbehind: !0,
          greedy: !0
        }
      ],
      "class-name": [
        {
          // Using static
          // using static System.Math;
          pattern: r(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [$]),
          lookbehind: !0,
          inside: f
        },
        {
          // Using alias (type)
          // using Project = PC.MyCompany.Project;
          pattern: r(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [x, c]),
          lookbehind: !0,
          inside: f
        },
        {
          // Using alias (alias)
          // using Project = PC.MyCompany.Project;
          pattern: r(/(\busing\s+)<<0>>(?=\s*=)/.source, [x]),
          lookbehind: !0
        },
        {
          // Type declarations
          // class Foo<A, B>
          // interface Foo<out A, B>
          pattern: r(/(\b<<0>>\s+)<<1>>/.source, [s, v]),
          lookbehind: !0,
          inside: f
        },
        {
          // Single catch exception declaration
          // catch(Foo)
          // (things like catch(Foo e) is covered by variable declaration)
          pattern: r(/(\bcatch\s*\(\s*)<<0>>/.source, [$]),
          lookbehind: !0,
          inside: f
        },
        {
          // Name of the type parameter of generic constraints
          // where Foo : class
          pattern: r(/(\bwhere\s+)<<0>>/.source, [x]),
          lookbehind: !0
        },
        {
          // Casts and checks via as and is.
          // as Foo<A>, is Bar<B>
          // (things like if(a is Foo b) is covered by variable declaration)
          pattern: r(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [S]),
          lookbehind: !0,
          inside: f
        },
        {
          // Variable, field and parameter declaration
          // (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
          pattern: r(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source, [c, u, x]),
          inside: f
        }
      ],
      keyword: o,
      // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
      number: /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
      operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
      punctuation: /\?\.?|::|[{}[\];(),.:]/
    }), e.languages.insertBefore("csharp", "number", {
      range: {
        pattern: /\.\./,
        alias: "operator"
      }
    }), e.languages.insertBefore("csharp", "punctuation", {
      "named-parameter": {
        pattern: r(/([(,]\s*)<<0>>(?=\s*:)/.source, [x]),
        lookbehind: !0,
        alias: "punctuation"
      }
    }), e.languages.insertBefore("csharp", "class-name", {
      namespace: {
        // namespace Foo.Bar {}
        // using Foo.Bar;
        pattern: r(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source, [x]),
        lookbehind: !0,
        inside: {
          punctuation: /\./
        }
      },
      "type-expression": {
        // default(Foo), typeof(Foo<Bar>), sizeof(int)
        pattern: r(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source, [_]),
        lookbehind: !0,
        alias: "class-name",
        inside: f
      },
      "return-type": {
        // Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
        // int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
        // int Foo => 0; int Foo { get; set } = 0;
        pattern: r(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source, [c, $]),
        inside: f,
        alias: "class-name"
      },
      "constructor-invocation": {
        // new List<Foo<Bar[]>> { }
        pattern: r(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [c]),
        lookbehind: !0,
        inside: f,
        alias: "class-name"
      },
      /*'explicit-implementation': {
      	// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
      	pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
      	inside: classNameInside,
      	alias: 'class-name'
      },*/
      "generic-method": {
        // foo<Bar>()
        pattern: r(/<<0>>\s*<<1>>(?=\s*\()/.source, [x, m]),
        inside: {
          function: r(/^<<0>>/.source, [x]),
          generic: {
            pattern: RegExp(m),
            alias: "class-name",
            inside: f
          }
        }
      },
      "type-list": {
        // The list of types inherited or of generic constraints
        // class Foo<F> : Bar, IList<FooBar>
        // where F : Bar, IList<int>
        pattern: r(
          /\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,
          [s, v, x, c, o.source, _, /\bnew\s*\(\s*\)/.source]
        ),
        lookbehind: !0,
        inside: {
          "record-arguments": {
            pattern: r(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source, [v, _]),
            lookbehind: !0,
            greedy: !0,
            inside: e.languages.csharp
          },
          keyword: o,
          "class-name": {
            pattern: RegExp(c),
            greedy: !0,
            inside: f
          },
          punctuation: /[,()]/
        }
      },
      preprocessor: {
        pattern: /(^[\t ]*)#.*/m,
        lookbehind: !0,
        alias: "property",
        inside: {
          // highlight preprocessor directives as keywords
          directive: {
            pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
            lookbehind: !0,
            alias: "keyword"
          }
        }
      }
    });
    var y = h + "|" + d, k = t(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source, [y]), T = a(t(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [k]), 2), I = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source, M = t(/<<0>>(?:\s*\(<<1>>*\))?/.source, [$, T]);
    e.languages.insertBefore("csharp", "class-name", {
      attribute: {
        // Attributes
        // [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
        pattern: r(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source, [I, M]),
        lookbehind: !0,
        greedy: !0,
        inside: {
          target: {
            pattern: r(/^<<0>>(?=\s*:)/.source, [I]),
            alias: "keyword"
          },
          "attribute-arguments": {
            pattern: r(/\(<<0>>*\)/.source, [T]),
            inside: e.languages.csharp
          },
          "class-name": {
            pattern: RegExp($),
            inside: {
              punctuation: /\./
            }
          },
          punctuation: /[:,]/
        }
      }
    });
    var A = /:[^}\r\n]+/.source, Me = a(t(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [k]), 2), J = t(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [Me, A]), at = a(t(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source, [y]), 2), ve = t(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [at, A]);
    function R(D, Q) {
      return {
        interpolation: {
          pattern: r(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [D]),
          lookbehind: !0,
          inside: {
            "format-string": {
              pattern: r(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [Q, A]),
              lookbehind: !0,
              inside: {
                punctuation: /^:/
              }
            },
            punctuation: /^\{|\}$/,
            expression: {
              pattern: /[\s\S]+/,
              alias: "language-csharp",
              inside: e.languages.csharp
            }
          }
        },
        string: /[\s\S]+/
      };
    }
    e.languages.insertBefore("csharp", "string", {
      "interpolation-string": [
        {
          pattern: r(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source, [J]),
          lookbehind: !0,
          greedy: !0,
          inside: R(J, Me)
        },
        {
          pattern: r(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [ve]),
          lookbehind: !0,
          greedy: !0,
          inside: R(ve, at)
        }
      ],
      char: {
        pattern: RegExp(d),
        greedy: !0
      }
    }), e.languages.dotnet = e.languages.cs = e.languages.csharp;
  })(Prism)), gn;
}
Ml();
var vn = {}, bn;
function Al() {
  return bn || (bn = 1, (function(e) {
    var t = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/, r = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source, a = {
      pattern: RegExp(/(^|[^\w.])/.source + r + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
      lookbehind: !0,
      inside: {
        namespace: {
          pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
          inside: {
            punctuation: /\./
          }
        },
        punctuation: /\./
      }
    };
    e.languages.java = e.languages.extend("clike", {
      string: {
        pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
        lookbehind: !0,
        greedy: !0
      },
      "class-name": [
        a,
        {
          // variables, parameters, and constructor references
          // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
          pattern: RegExp(/(^|[^\w.])/.source + r + /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),
          lookbehind: !0,
          inside: a.inside
        },
        {
          // class names based on keyword
          // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
          pattern: RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source + r + /[A-Z]\w*\b/.source),
          lookbehind: !0,
          inside: a.inside
        }
      ],
      keyword: t,
      function: [
        e.languages.clike.function,
        {
          pattern: /(::\s*)[a-z_]\w*/,
          lookbehind: !0
        }
      ],
      number: /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
      operator: {
        pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
        lookbehind: !0
      },
      constant: /\b[A-Z][A-Z_\d]+\b/
    }), e.languages.insertBefore("java", "string", {
      "triple-quoted-string": {
        // http://openjdk.java.net/jeps/355#Description
        pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
        greedy: !0,
        alias: "string"
      },
      char: {
        pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
        greedy: !0
      }
    }), e.languages.insertBefore("java", "class-name", {
      annotation: {
        pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
        lookbehind: !0,
        alias: "punctuation"
      },
      generics: {
        pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
        inside: {
          "class-name": a,
          keyword: t,
          punctuation: /[<>(),.:]/,
          operator: /[?&|]/
        }
      },
      import: [
        {
          pattern: RegExp(/(\bimport\s+)/.source + r + /(?:[A-Z]\w*|\*)(?=\s*;)/.source),
          lookbehind: !0,
          inside: {
            namespace: a.inside.namespace,
            punctuation: /\./,
            operator: /\*/,
            "class-name": /\w+/
          }
        },
        {
          pattern: RegExp(/(\bimport\s+static\s+)/.source + r + /(?:\w+|\*)(?=\s*;)/.source),
          lookbehind: !0,
          alias: "static",
          inside: {
            namespace: a.inside.namespace,
            static: /\b\w+$/,
            punctuation: /\./,
            operator: /\*/,
            "class-name": /\w+/
          }
        }
      ],
      namespace: {
        pattern: RegExp(
          /(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g, function() {
            return t.source;
          })
        ),
        lookbehind: !0,
        inside: {
          punctuation: /\./
        }
      }
    });
  })(Prism)), vn;
}
Al();
Prism.languages.scala = Prism.languages.extend("java", {
  "triple-quoted-string": {
    pattern: /"""[\s\S]*?"""/,
    greedy: !0,
    alias: "string"
  },
  string: {
    pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  keyword: /<-|=>|\b(?:abstract|case|catch|class|def|derives|do|else|enum|extends|extension|final|finally|for|forSome|given|if|implicit|import|infix|inline|lazy|match|new|null|object|opaque|open|override|package|private|protected|return|sealed|self|super|this|throw|trait|transparent|try|type|using|val|var|while|with|yield)\b/,
  number: /\b0x(?:[\da-f]*\.)?[\da-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e\d+)?[dfl]?/i,
  builtin: /\b(?:Any|AnyRef|AnyVal|Boolean|Byte|Char|Double|Float|Int|Long|Nothing|Short|String|Unit)\b/,
  symbol: /'[^\d\s\\]\w*/
});
Prism.languages.insertBefore("scala", "triple-quoted-string", {
  "string-interpolation": {
    pattern: /\b[a-z]\w*(?:"""(?:[^$]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*?"""|"(?:[^$"\r\n]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*")/i,
    greedy: !0,
    inside: {
      id: {
        pattern: /^\w+/,
        greedy: !0,
        alias: "function"
      },
      escape: {
        pattern: /\\\$"|\$[$"]/,
        greedy: !0,
        alias: "symbol"
      },
      interpolation: {
        pattern: /\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
        greedy: !0,
        inside: {
          punctuation: /^\$\{?|\}$/,
          expression: {
            pattern: /[\s\S]+/,
            inside: Prism.languages.scala
          }
        }
      },
      string: /[\s\S]+/
    }
  }
});
delete Prism.languages.scala["class-name"];
delete Prism.languages.scala.function;
delete Prism.languages.scala.constant;
(function(e) {
  var t = /(?:\r?\n|\r)[ \t]*\|.+\|(?:(?!\|).)*/.source;
  e.languages.gherkin = {
    pystring: {
      pattern: /("""|''')[\s\S]+?\1/,
      alias: "string"
    },
    comment: {
      pattern: /(^[ \t]*)#.*/m,
      lookbehind: !0
    },
    tag: {
      pattern: /(^[ \t]*)@\S*/m,
      lookbehind: !0
    },
    feature: {
      pattern: /((?:^|\r?\n|\r)[ \t]*)(?:Ability|Ahoy matey!|Arwedd|Aspekt|Besigheid Behoefte|Business Need|Caracteristica|Característica|Egenskab|Egenskap|Eiginleiki|Feature|Fīča|Fitur|Fonctionnalité|Fonksyonalite|Funcionalidade|Funcionalitat|Functionalitate|Funcţionalitate|Funcționalitate|Functionaliteit|Fungsi|Funkcia|Funkcija|Funkcionalitāte|Funkcionalnost|Funkcja|Funksie|Funktionalität|Funktionalitéit|Funzionalità|Hwaet|Hwæt|Jellemző|Karakteristik|Lastnost|Mak|Mogucnost|laH|Mogućnost|Moznosti|Možnosti|OH HAI|Omadus|Ominaisuus|Osobina|Özellik|Potrzeba biznesowa|perbogh|poQbogh malja'|Požadavek|Požiadavka|Pretty much|Qap|Qu'meH 'ut|Savybė|Tính năng|Trajto|Vermoë|Vlastnosť|Właściwość|Značilnost|Δυνατότητα|Λειτουργία|Могућност|Мөмкинлек|Особина|Свойство|Үзенчәлеклелек|Функционал|Функционалност|Функция|Функціонал|תכונה|خاصية|خصوصیت|صلاحیت|کاروبار کی ضرورت|وِیژگی|रूप लेख|ਖਾਸੀਅਤ|ਨਕਸ਼ ਨੁਹਾਰ|ਮੁਹਾਂਦਰਾ|గుణము|ಹೆಚ್ಚಳ|ความต้องการทางธุรกิจ|ความสามารถ|โครงหลัก|기능|フィーチャ|功能|機能):(?:[^:\r\n]+(?:\r?\n|\r|$))*/,
      lookbehind: !0,
      inside: {
        important: {
          pattern: /(:)[^\r\n]+/,
          lookbehind: !0
        },
        keyword: /[^:\r\n]+:/
      }
    },
    scenario: {
      pattern: /(^[ \t]*)(?:Abstract Scenario|Abstrakt Scenario|Achtergrond|Aer|Ær|Agtergrond|All y'all|Antecedentes|Antecedents|Atburðarás|Atburðarásir|Awww, look mate|B4|Background|Baggrund|Bakgrund|Bakgrunn|Bakgrunnur|Beispiele|Beispiller|Bối cảnh|Cefndir|Cenario|Cenário|Cenario de Fundo|Cenário de Fundo|Cenarios|Cenários|Contesto|Context|Contexte|Contexto|Conto|Contoh|Contone|Dæmi|Dasar|Dead men tell no tales|Delineacao do Cenario|Delineação do Cenário|Dis is what went down|Dữ liệu|Dyagram Senaryo|Dyagram senaryo|Egzanp|Ejemplos|Eksempler|Ekzemploj|Enghreifftiau|Esbozo do escenario|Escenari|Escenario|Esempi|Esquema de l'escenari|Esquema del escenario|Esquema do Cenario|Esquema do Cenário|EXAMPLZ|Examples|Exempel|Exemple|Exemples|Exemplos|First off|Fono|Forgatókönyv|Forgatókönyv vázlat|Fundo|Geçmiş|Grundlage|Hannergrond|ghantoH|Háttér|Heave to|Istorik|Juhtumid|Keadaan|Khung kịch bản|Khung tình huống|Kịch bản|Koncept|Konsep skenario|Kontèks|Kontekst|Kontekstas|Konteksts|Kontext|Konturo de la scenaro|Latar Belakang|lut chovnatlh|lut|lutmey|Lýsing Atburðarásar|Lýsing Dæma|MISHUN SRSLY|MISHUN|Menggariskan Senario|mo'|Náčrt Scenára|Náčrt Scénáře|Náčrt Scenáru|Oris scenarija|Örnekler|Osnova|Osnova Scenára|Osnova scénáře|Osnutek|Ozadje|Paraugs|Pavyzdžiai|Példák|Piemēri|Plan du scénario|Plan du Scénario|Plan Senaryo|Plan senaryo|Plang vum Szenario|Pozadí|Pozadie|Pozadina|Príklady|Příklady|Primer|Primeri|Primjeri|Przykłady|Raamstsenaarium|Reckon it's like|Rerefons|Scenár|Scénář|Scenarie|Scenarij|Scenarijai|Scenarijaus šablonas|Scenariji|Scenārijs|Scenārijs pēc parauga|Scenarijus|Scenario|Scénario|Scenario Amlinellol|Scenario Outline|Scenario Template|Scenariomal|Scenariomall|Scenarios|Scenariu|Scenariusz|Scenaro|Schema dello scenario|Se ðe|Se the|Se þe|Senario|Senaryo Deskripsyon|Senaryo deskripsyon|Senaryo|Senaryo taslağı|Shiver me timbers|Situācija|Situai|Situasie Uiteensetting|Situasie|Skenario konsep|Skenario|Skica|Structura scenariu|Structură scenariu|Struktura scenarija|Stsenaarium|Swa hwaer swa|Swa|Swa hwær swa|Szablon scenariusza|Szenario|Szenariogrundriss|Tapaukset|Tapaus|Tapausaihio|Taust|Tausta|Template Keadaan|Template Senario|Template Situai|The thing of it is|Tình huống|Variantai|Voorbeelde|Voorbeelden|Wharrimean is|Yo-ho-ho|You'll wanna|Założenia|Παραδείγματα|Περιγραφή Σεναρίου|Σενάρια|Σενάριο|Υπόβαθρο|Кереш|Контекст|Концепт|Мисаллар|Мисоллар|Основа|Передумова|Позадина|Предистория|Предыстория|Приклади|Пример|Примери|Примеры|Рамка на сценарий|Скица|Структура сценарија|Структура сценария|Структура сценарію|Сценарий|Сценарий структураси|Сценарийның төзелеше|Сценарији|Сценарио|Сценарій|Тарих|Үрнәкләр|דוגמאות|רקע|תבנית תרחיש|תרחיש|الخلفية|الگوی سناریو|امثلة|پس منظر|زمینه|سناریو|سيناريو|سيناريو مخطط|مثالیں|منظر نامے کا خاکہ|منظرنامہ|نمونه ها|उदाहरण|परिदृश्य|परिदृश्य रूपरेखा|पृष्ठभूमि|ਉਦਾਹਰਨਾਂ|ਪਟਕਥਾ|ਪਟਕਥਾ ਢਾਂਚਾ|ਪਟਕਥਾ ਰੂਪ ਰੇਖਾ|ਪਿਛੋਕੜ|ఉదాహరణలు|కథనం|నేపథ్యం|సన్నివేశం|ಉದಾಹರಣೆಗಳು|ಕಥಾಸಾರಾಂಶ|ವಿವರಣೆ|ಹಿನ್ನೆಲೆ|โครงสร้างของเหตุการณ์|ชุดของตัวอย่าง|ชุดของเหตุการณ์|แนวคิด|สรุปเหตุการณ์|เหตุการณ์|배경|시나리오|시나리오 개요|예|サンプル|シナリオ|シナリオアウトライン|シナリオテンプレ|シナリオテンプレート|テンプレ|例|例子|剧本|剧本大纲|劇本|劇本大綱|场景|场景大纲|場景|場景大綱|背景):[^:\r\n]*/m,
      lookbehind: !0,
      inside: {
        important: {
          pattern: /(:)[^\r\n]*/,
          lookbehind: !0
        },
        keyword: /[^:\r\n]+:/
      }
    },
    "table-body": {
      // Look-behind is used to skip the table head, which has the same format as any table row
      pattern: RegExp("(" + t + ")(?:" + t + ")+"),
      lookbehind: !0,
      inside: {
        outline: {
          pattern: /<[^>]+>/,
          alias: "variable"
        },
        td: {
          pattern: /\s*[^\s|][^|]*/,
          alias: "string"
        },
        punctuation: /\|/
      }
    },
    "table-head": {
      pattern: RegExp(t),
      inside: {
        th: {
          pattern: /\s*[^\s|][^|]*/,
          alias: "variable"
        },
        punctuation: /\|/
      }
    },
    atrule: {
      pattern: /(^[ \t]+)(?:'a|'ach|'ej|7|a|A také|A taktiež|A tiež|A zároveň|Aber|Ac|Adott|Akkor|Ak|Aleshores|Ale|Ali|Allora|Alors|Als|Ama|Amennyiben|Amikor|Ampak|an|AN|Ananging|And y'all|And|Angenommen|Anrhegedig a|An|Apabila|Atès|Atesa|Atunci|Avast!|Aye|A|awer|Bagi|Banjur|Bet|Biết|Blimey!|Buh|But at the end of the day I reckon|But y'all|But|BUT|Cal|Când|Cand|Cando|Ce|Cuando|Če|Ða ðe|Ða|Dadas|Dada|Dados|Dado|DaH ghu' bejlu'|dann|Dann|Dano|Dan|Dar|Dat fiind|Data|Date fiind|Date|Dati fiind|Dati|Daţi fiind|Dați fiind|DEN|Dato|De|Den youse gotta|Dengan|Diberi|Diyelim ki|Donada|Donat|Donitaĵo|Do|Dun|Duota|Ðurh|Eeldades|Ef|Eğer ki|Entao|Então|Entón|E|En|Entonces|Epi|És|Etant donnée|Etant donné|Et|Étant données|Étant donnée|Étant donné|Etant données|Etant donnés|Étant donnés|Fakat|Gangway!|Gdy|Gegeben seien|Gegeben sei|Gegeven|Gegewe|ghu' noblu'|Gitt|Given y'all|Given|Givet|Givun|Ha|Cho|I CAN HAZ|In|Ir|It's just unbelievable|I|Ja|Jeśli|Jeżeli|Kad|Kada|Kadar|Kai|Kaj|Když|Keď|Kemudian|Ketika|Khi|Kiedy|Ko|Kuid|Kui|Kun|Lan|latlh|Le sa a|Let go and haul|Le|Lè sa a|Lè|Logo|Lorsqu'<|Lorsque|mä|Maar|Mais|Mając|Ma|Majd|Maka|Manawa|Mas|Men|Menawa|Mutta|Nalika|Nalikaning|Nanging|Når|När|Nato|Nhưng|Niin|Njuk|O zaman|Och|Og|Oletetaan|Ond|Onda|Oraz|Pak|Pero|Però|Podano|Pokiaľ|Pokud|Potem|Potom|Privzeto|Pryd|Quan|Quand|Quando|qaSDI'|Så|Sed|Se|Siis|Sipoze ke|Sipoze Ke|Sipoze|Si|Şi|Și|Soit|Stel|Tada|Tad|Takrat|Tak|Tapi|Ter|Tetapi|Tha the|Tha|Then y'all|Then|Thì|Thurh|Toda|Too right|Un|Und|ugeholl|Và|vaj|Vendar|Ve|wann|Wanneer|WEN|Wenn|When y'all|When|Wtedy|Wun|Y'know|Yeah nah|Yna|Youse know like when|Youse know when youse got|Y|Za predpokladu|Za předpokladu|Zadan|Zadani|Zadano|Zadate|Zadato|Zakładając|Zaradi|Zatati|Þa þe|Þa|Þá|Þegar|Þurh|Αλλά|Δεδομένου|Και|Όταν|Τότε|А також|Агар|Але|Али|Аммо|А|Әгәр|Әйтик|Әмма|Бирок|Ва|Вә|Дадено|Дано|Допустим|Если|Задате|Задати|Задато|И|І|К тому же|Када|Кад|Когато|Когда|Коли|Ләкин|Лекин|Нәтиҗәдә|Нехай|Но|Онда|Припустимо, що|Припустимо|Пусть|Также|Та|Тогда|Тоді|То|Унда|Һәм|Якщо|אבל|אזי|אז|בהינתן|וגם|כאשר|آنگاه|اذاً|اگر|اما|اور|با فرض|بالفرض|بفرض|پھر|تب|ثم|جب|عندما|فرض کیا|لكن|لیکن|متى|هنگامی|و|अगर|और|कदा|किन्तु|चूंकि|जब|तथा|तदा|तब|परन्तु|पर|यदि|ਅਤੇ|ਜਦੋਂ|ਜਿਵੇਂ ਕਿ|ਜੇਕਰ|ਤਦ|ਪਰ|అప్పుడు|ఈ పరిస్థితిలో|కాని|చెప్పబడినది|మరియు|ಆದರೆ|ನಂತರ|ನೀಡಿದ|ಮತ್ತು|ಸ್ಥಿತಿಯನ್ನು|กำหนดให้|ดังนั้น|แต่|เมื่อ|และ|그러면<|그리고<|단<|만약<|만일<|먼저<|조건<|하지만<|かつ<|しかし<|ただし<|ならば<|もし<|並且<|但し<|但是<|假如<|假定<|假設<|假设<|前提<|同时<|同時<|并且<|当<|當<|而且<|那么<|那麼<)(?=[ \t])/m,
      lookbehind: !0
    },
    string: {
      pattern: /"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/,
      inside: {
        outline: {
          pattern: /<[^>]+>/,
          alias: "variable"
        }
      }
    },
    outline: {
      pattern: /<[^>]+>/,
      alias: "variable"
    }
  };
})(Prism);
var wn = {}, yn;
function Tl() {
  return yn || (yn = 1, (function(e) {
    for (var t = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source, r = 0; r < 2; r++)
      t = t.replace(/<self>/g, function() {
        return t;
      });
    t = t.replace(/<self>/g, function() {
      return /[^\s\S]/.source;
    }), e.languages.rust = {
      comment: [
        {
          pattern: RegExp(/(^|[^\\])/.source + t),
          lookbehind: !0,
          greedy: !0
        },
        {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: !0,
          greedy: !0
        }
      ],
      string: {
        pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
        greedy: !0
      },
      char: {
        pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
        greedy: !0
      },
      attribute: {
        pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
        greedy: !0,
        alias: "attr-name",
        inside: {
          string: null
          // see below
        }
      },
      // Closure params should not be confused with bitwise OR |
      "closure-params": {
        pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          "closure-punctuation": {
            pattern: /^\||\|$/,
            alias: "punctuation"
          },
          rest: null
          // see below
        }
      },
      "lifetime-annotation": {
        pattern: /'\w+/,
        alias: "symbol"
      },
      "fragment-specifier": {
        pattern: /(\$\w+:)[a-z]+/,
        lookbehind: !0,
        alias: "punctuation"
      },
      variable: /\$\w+/,
      "function-definition": {
        pattern: /(\bfn\s+)\w+/,
        lookbehind: !0,
        alias: "function"
      },
      "type-definition": {
        pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
        lookbehind: !0,
        alias: "class-name"
      },
      "module-declaration": [
        {
          pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
          lookbehind: !0,
          alias: "namespace"
        },
        {
          pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
          lookbehind: !0,
          alias: "namespace",
          inside: {
            punctuation: /::/
          }
        }
      ],
      keyword: [
        // https://github.com/rust-lang/reference/blob/master/src/keywords.md
        /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
        // primitives and str
        // https://doc.rust-lang.org/stable/rust-by-example/primitives.html
        /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/
      ],
      // functions can technically start with an upper-case letter, but this will introduce a lot of false positives
      // and Rust's naming conventions recommend snake_case anyway.
      // https://doc.rust-lang.org/1.0.0/style/style/naming/README.html
      function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
      macro: {
        pattern: /\b\w+!/,
        alias: "property"
      },
      constant: /\b[A-Z_][A-Z_\d]+\b/,
      "class-name": /\b[A-Z]\w*\b/,
      namespace: {
        pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
        inside: {
          punctuation: /::/
        }
      },
      // Hex, oct, bin, dec numbers with visual separators and type suffix
      number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
      boolean: /\b(?:false|true)\b/,
      punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
      operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
    }, e.languages.rust["closure-params"].inside.rest = e.languages.rust, e.languages.rust.attribute.inside.string = e.languages.rust.string;
  })(Prism)), wn;
}
Tl();
var kn = {}, xn;
function El() {
  return xn || (xn = 1, Prism.languages.python = {
    comment: {
      pattern: /(^|[^\\])#.*/,
      lookbehind: !0,
      greedy: !0
    },
    "string-interpolation": {
      pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
      greedy: !0,
      inside: {
        interpolation: {
          // "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
          pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
          lookbehind: !0,
          inside: {
            "format-spec": {
              pattern: /(:)[^:(){}]+(?=\}$)/,
              lookbehind: !0
            },
            "conversion-option": {
              pattern: /![sra](?=[:}]$)/,
              alias: "punctuation"
            },
            rest: null
          }
        },
        string: /[\s\S]+/
      }
    },
    "triple-quoted-string": {
      pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
      greedy: !0,
      alias: "string"
    },
    string: {
      pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
      greedy: !0
    },
    function: {
      pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
      lookbehind: !0
    },
    "class-name": {
      pattern: /(\bclass\s+)\w+/i,
      lookbehind: !0
    },
    decorator: {
      pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
      lookbehind: !0,
      alias: ["annotation", "punctuation"],
      inside: {
        punctuation: /\./
      }
    },
    keyword: /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:False|None|True)\b/,
    number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
    operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/
  }, Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python, Prism.languages.py = Prism.languages.python), kn;
}
El();
Prism.languages.markup = {
  comment: {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: !0
  },
  prolog: {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: !0
  },
  doctype: {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null
        // see below
      },
      string: {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: !0
      },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/i,
      name: /[^\s<>'"]+/
    }
  },
  cdata: {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: !0
  },
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/
        }
      },
      "special-attr": [],
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [
            {
              pattern: /^=/,
              alias: "attr-equals"
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: !0
            }
          ]
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/
        }
      }
    }
  },
  entity: [
    {
      pattern: /&[\da-z]{1,8};/i,
      alias: "named-entity"
    },
    /&#x?[\da-f]{1,8};/i
  ]
};
Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity;
Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup;
Prism.hooks.add("wrap", function(e) {
  e.type === "entity" && (e.attributes.title = e.content.replace(/&amp;/, "&"));
});
Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function(t, r) {
    var a = {};
    a["language-" + r] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: !0,
      inside: Prism.languages[r]
    }, a.cdata = /^<!\[CDATA\[|\]\]>$/i;
    var n = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: a
      }
    };
    n["language-" + r] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[r]
    };
    var i = {};
    i[t] = {
      pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
        return t;
      }), "i"),
      lookbehind: !0,
      greedy: !0,
      inside: n
    }, Prism.languages.insertBefore("markup", "cdata", i);
  }
});
Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
  /**
   * Adds an pattern to highlight languages embedded in HTML attributes.
   *
   * An example of an inlined language is CSS with `style` attributes.
   *
   * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addAttribute('style', 'css');
   */
  value: function(e, t) {
    Prism.languages.markup.tag.inside["special-attr"].push({
      pattern: RegExp(
        /(^|["'\s])/.source + "(?:" + e + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
        "i"
      ),
      lookbehind: !0,
      inside: {
        "attr-name": /^[^\s=]+/,
        "attr-value": {
          pattern: /=[\s\S]+/,
          inside: {
            value: {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: !0,
              alias: [t, "language-" + t],
              inside: Prism.languages[t]
            },
            punctuation: [
              {
                pattern: /^=/,
                alias: "attr-equals"
              },
              /"|'/
            ]
          }
        }
      }
    });
  }
});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;
Prism.languages.xml = Prism.languages.extend("markup", {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;
(function(e) {
  function t(r, a) {
    return "___" + r.toUpperCase() + a + "___";
  }
  Object.defineProperties(e.languages["markup-templating"] = {}, {
    buildPlaceholders: {
      /**
       * Tokenize all inline templating expressions matching `placeholderPattern`.
       *
       * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
       * `true` will be replaced.
       *
       * @param {object} env The environment of the `before-tokenize` hook.
       * @param {string} language The language id.
       * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
       * @param {(match: string) => boolean} [replaceFilter]
       */
      value: function(r, a, n, i) {
        if (r.language === a) {
          var s = r.tokenStack = [];
          r.code = r.code.replace(n, function(o) {
            if (typeof i == "function" && !i(o))
              return o;
            for (var l = s.length, u; r.code.indexOf(u = t(a, l)) !== -1; )
              ++l;
            return s[l] = o, u;
          }), r.grammar = e.languages.markup;
        }
      }
    },
    tokenizePlaceholders: {
      /**
       * Replace placeholders with proper tokens after tokenizing.
       *
       * @param {object} env The environment of the `after-tokenize` hook.
       * @param {string} language The language id.
       */
      value: function(r, a) {
        if (r.language !== a || !r.tokenStack)
          return;
        r.grammar = e.languages[a];
        var n = 0, i = Object.keys(r.tokenStack);
        function s(o) {
          for (var l = 0; l < o.length && !(n >= i.length); l++) {
            var u = o[l];
            if (typeof u == "string" || u.content && typeof u.content == "string") {
              var m = i[n], _ = r.tokenStack[m], x = typeof u == "string" ? u : u.content, v = t(a, m), $ = x.indexOf(v);
              if ($ > -1) {
                ++n;
                var w = x.substring(0, $), S = new e.Token(a, e.tokenize(_, r.grammar), "language-" + a, _), z = x.substring($ + v.length), p = [];
                w && p.push.apply(p, s([w])), p.push(S), z && p.push.apply(p, s([z])), typeof u == "string" ? o.splice.apply(o, [l, 1].concat(p)) : u.content = p;
              }
            } else u.content && s(u.content);
          }
          return o;
        }
        s(r.tokens);
      }
    }
  });
})(Prism);
var _n = {}, $n;
function Pl() {
  return $n || ($n = 1, (function(e) {
    var t = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/, r = [
      {
        pattern: /\b(?:false|true)\b/i,
        alias: "boolean"
      },
      {
        pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
        greedy: !0,
        lookbehind: !0
      },
      {
        pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
        greedy: !0,
        lookbehind: !0
      },
      /\b(?:null)\b/i,
      /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/
    ], a = /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i, n = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/, i = /[{}\[\](),:;]/;
    e.languages.php = {
      delimiter: {
        pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
        alias: "important"
      },
      comment: t,
      variable: /\$+(?:\w+\b|(?=\{))/,
      package: {
        pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
        lookbehind: !0,
        inside: {
          punctuation: /\\/
        }
      },
      "class-name-definition": {
        pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
        lookbehind: !0,
        alias: "class-name"
      },
      "function-definition": {
        pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
        lookbehind: !0,
        alias: "function"
      },
      keyword: [
        {
          pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
          alias: "type-casting",
          greedy: !0,
          lookbehind: !0
        },
        {
          pattern: /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
          alias: "type-hint",
          greedy: !0,
          lookbehind: !0
        },
        {
          pattern: /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
          alias: "return-type",
          greedy: !0,
          lookbehind: !0
        },
        {
          pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
          alias: "type-declaration",
          greedy: !0
        },
        {
          pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
          alias: "type-declaration",
          greedy: !0,
          lookbehind: !0
        },
        {
          pattern: /\b(?:parent|self|static)(?=\s*::)/i,
          alias: "static-context",
          greedy: !0
        },
        {
          // yield from
          pattern: /(\byield\s+)from\b/i,
          lookbehind: !0
        },
        // `class` is always a keyword unlike other keywords
        /\bclass\b/i,
        {
          // https://www.php.net/manual/en/reserved.keywords.php
          //
          // keywords cannot be preceded by "->"
          // the complex lookbehind means `(?<!(?:->|::)\s*)`
          pattern: /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
          lookbehind: !0
        }
      ],
      "argument-name": {
        pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
        lookbehind: !0
      },
      "class-name": [
        {
          pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
          greedy: !0,
          lookbehind: !0
        },
        {
          pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
          greedy: !0,
          lookbehind: !0
        },
        {
          pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i,
          greedy: !0
        },
        {
          pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
          alias: "class-name-fully-qualified",
          greedy: !0,
          lookbehind: !0,
          inside: {
            punctuation: /\\/
          }
        },
        {
          pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
          alias: "class-name-fully-qualified",
          greedy: !0,
          inside: {
            punctuation: /\\/
          }
        },
        {
          pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
          alias: "class-name-fully-qualified",
          greedy: !0,
          lookbehind: !0,
          inside: {
            punctuation: /\\/
          }
        },
        {
          pattern: /\b[a-z_]\w*(?=\s*\$)/i,
          alias: "type-declaration",
          greedy: !0
        },
        {
          pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
          alias: ["class-name-fully-qualified", "type-declaration"],
          greedy: !0,
          inside: {
            punctuation: /\\/
          }
        },
        {
          pattern: /\b[a-z_]\w*(?=\s*::)/i,
          alias: "static-context",
          greedy: !0
        },
        {
          pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
          alias: ["class-name-fully-qualified", "static-context"],
          greedy: !0,
          inside: {
            punctuation: /\\/
          }
        },
        {
          pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
          alias: "type-hint",
          greedy: !0,
          lookbehind: !0
        },
        {
          pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
          alias: ["class-name-fully-qualified", "type-hint"],
          greedy: !0,
          lookbehind: !0,
          inside: {
            punctuation: /\\/
          }
        },
        {
          pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
          alias: "return-type",
          greedy: !0,
          lookbehind: !0
        },
        {
          pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
          alias: ["class-name-fully-qualified", "return-type"],
          greedy: !0,
          lookbehind: !0,
          inside: {
            punctuation: /\\/
          }
        }
      ],
      constant: r,
      function: {
        pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
        lookbehind: !0,
        inside: {
          punctuation: /\\/
        }
      },
      property: {
        pattern: /(->\s*)\w+/,
        lookbehind: !0
      },
      number: a,
      operator: n,
      punctuation: i
    };
    var s = {
      pattern: /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
      lookbehind: !0,
      inside: e.languages.php
    }, o = [
      {
        pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
        alias: "nowdoc-string",
        greedy: !0,
        inside: {
          delimiter: {
            pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
            alias: "symbol",
            inside: {
              punctuation: /^<<<'?|[';]$/
            }
          }
        }
      },
      {
        pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
        alias: "heredoc-string",
        greedy: !0,
        inside: {
          delimiter: {
            pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
            alias: "symbol",
            inside: {
              punctuation: /^<<<"?|[";]$/
            }
          },
          interpolation: s
        }
      },
      {
        pattern: /`(?:\\[\s\S]|[^\\`])*`/,
        alias: "backtick-quoted-string",
        greedy: !0
      },
      {
        pattern: /'(?:\\[\s\S]|[^\\'])*'/,
        alias: "single-quoted-string",
        greedy: !0
      },
      {
        pattern: /"(?:\\[\s\S]|[^\\"])*"/,
        alias: "double-quoted-string",
        greedy: !0,
        inside: {
          interpolation: s
        }
      }
    ];
    e.languages.insertBefore("php", "variable", {
      string: o,
      attribute: {
        pattern: /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
        greedy: !0,
        inside: {
          "attribute-content": {
            pattern: /^(#\[)[\s\S]+(?=\]$)/,
            lookbehind: !0,
            // inside can appear subset of php
            inside: {
              comment: t,
              string: o,
              "attribute-class-name": [
                {
                  pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
                  alias: "class-name",
                  greedy: !0,
                  lookbehind: !0
                },
                {
                  pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
                  alias: [
                    "class-name",
                    "class-name-fully-qualified"
                  ],
                  greedy: !0,
                  lookbehind: !0,
                  inside: {
                    punctuation: /\\/
                  }
                }
              ],
              constant: r,
              number: a,
              operator: n,
              punctuation: i
            }
          },
          delimiter: {
            pattern: /^#\[|\]$/,
            alias: "punctuation"
          }
        }
      }
    }), e.hooks.add("before-tokenize", function(l) {
      if (/<\?/.test(l.code)) {
        var u = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g;
        e.languages["markup-templating"].buildPlaceholders(l, "php", u);
      }
    }), e.hooks.add("after-tokenize", function(l) {
      e.languages["markup-templating"].tokenizePlaceholders(l, "php");
    });
  })(Prism)), _n;
}
Pl();
const Sn = "(if|else if|await|then|catch|each|html|debug)";
Prism.languages.svelte = Prism.languages.extend("markup", {
  each: {
    pattern: new RegExp(
      "{[#/]each(?:(?:\\{(?:(?:\\{(?:[^{}])*\\})|(?:[^{}]))*\\})|(?:[^{}]))*}"
    ),
    inside: {
      "language-javascript": [
        {
          pattern: /(as[\s\S]*)\([\s\S]*\)(?=\s*\})/,
          lookbehind: !0,
          inside: Prism.languages.javascript
        },
        {
          pattern: /(as[\s]*)[\s\S]*(?=\s*)/,
          lookbehind: !0,
          inside: Prism.languages.javascript
        },
        {
          pattern: /(#each[\s]*)[\s\S]*(?=as)/,
          lookbehind: !0,
          inside: Prism.languages.javascript
        }
      ],
      keyword: /[#/]each|as/,
      punctuation: /{|}/
    }
  },
  block: {
    pattern: new RegExp(
      "{[#:/@]/s" + Sn + "(?:(?:\\{(?:(?:\\{(?:[^{}])*\\})|(?:[^{}]))*\\})|(?:[^{}]))*}"
    ),
    inside: {
      punctuation: /^{|}$/,
      keyword: [new RegExp("[#:/@]" + Sn + "( )*"), /as/, /then/],
      "language-javascript": {
        pattern: /[\s\S]*/,
        inside: Prism.languages.javascript
      }
    }
  },
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?:"[^"]*"|'[^']*'|{[\s\S]+?}(?=[\s/>])))|(?=[\s/>])))+)?\s*\/?>/i,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/
        }
      },
      "language-javascript": {
        pattern: /\{(?:(?:\{(?:(?:\{(?:[^{}])*\})|(?:[^{}]))*\})|(?:[^{}]))*\}/,
        inside: Prism.languages.javascript
      },
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
        inside: {
          punctuation: [
            /^=/,
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: !0
            }
          ],
          "language-javascript": {
            pattern: /{[\s\S]+}/,
            inside: Prism.languages.javascript
          }
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/
        }
      }
    }
  },
  "language-javascript": {
    pattern: /\{(?:(?:\{(?:(?:\{(?:[^{}])*\})|(?:[^{}]))*\})|(?:[^{}]))*\}/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }
});
Prism.languages.svelte.tag.inside["attr-value"].inside.entity = Prism.languages.svelte.entity;
Prism.hooks.add("wrap", (e) => {
  e.type === "entity" && (e.attributes.title = e.content.replace(/&amp;/, "&"));
});
Object.defineProperty(Prism.languages.svelte.tag, "addInlined", {
  value: function(t, r) {
    const a = {};
    a["language-" + r] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: !0,
      inside: Prism.languages[r]
    }, a.cdata = /^<!\[CDATA\[|\]\]>$/i;
    const n = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: a
      }
    };
    n["language-" + r] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[r]
    };
    const i = {};
    i[t] = {
      pattern: RegExp(
        /(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(
          /__/g,
          t
        ),
        "i"
      ),
      lookbehind: !0,
      greedy: !0,
      inside: n
    }, Prism.languages.insertBefore("svelte", "cdata", i);
  }
});
Prism.languages.svelte.tag.addInlined("style", "css");
Prism.languages.svelte.tag.addInlined("script", "javascript");
(function() {
  typeof Prism > "u" || typeof document > "u" || !document.createRange || (Prism.plugins.KeepMarkup = !0, Prism.hooks.add("before-highlight", function(e) {
    if (!e.element.children.length || !Prism.util.isActive(e.element, "keep-markup", !0))
      return;
    var t = Prism.util.isActive(e.element, "drop-tokens", !1);
    function r(o) {
      return !(t && o.nodeName.toLowerCase() === "span" && o.classList.contains("token"));
    }
    var a = 0, n = [];
    function i(o) {
      if (!r(o)) {
        s(o);
        return;
      }
      var l = {
        // Store original element so we can restore it after highlighting
        element: o,
        posOpen: a
      };
      n.push(l), s(o), l.posClose = a;
    }
    function s(o) {
      for (var l = 0, u = o.childNodes.length; l < u; l++) {
        var m = o.childNodes[l];
        m.nodeType === 1 ? i(m) : m.nodeType === 3 && (a += m.data.length);
      }
    }
    s(e.element), n.length && (e.keepMarkup = n);
  }), Prism.hooks.add("after-highlight", function(e) {
    if (e.keepMarkup && e.keepMarkup.length) {
      var t = function(r, a) {
        for (var n = 0, i = r.childNodes.length; n < i; n++) {
          var s = r.childNodes[n];
          if (s.nodeType === 1) {
            if (!t(s, a))
              return !1;
          } else s.nodeType === 3 && (!a.nodeStart && a.pos + s.data.length > a.node.posOpen && (a.nodeStart = s, a.nodeStartPos = a.node.posOpen - a.pos), a.nodeStart && a.pos + s.data.length >= a.node.posClose && (a.nodeEnd = s, a.nodeEndPos = a.node.posClose - a.pos), a.pos += s.data.length);
          if (a.nodeStart && a.nodeEnd) {
            var o = document.createRange();
            return o.setStart(a.nodeStart, a.nodeStartPos), o.setEnd(a.nodeEnd, a.nodeEndPos), a.node.element.innerHTML = "", a.node.element.appendChild(o.extractContents()), o.insertNode(a.node.element), o.detach(), !1;
          }
        }
        return !0;
      };
      e.keepMarkup.forEach(function(r) {
        t(e.element, {
          node: r,
          pos: 0
        });
      }), e.highlightedCode = e.element.innerHTML;
    }
  }));
})();
const zl = "code[class*=language-],pre[class*=language-]{color:var(--prism-maintext);text-align:left;white-space:pre;word-spacing:normal;word-break:normal;tab-size:4;-webkit-hyphens:none;hyphens:none;direction:ltr;font-size:1em;line-height:1.5}pre>code[class*=language-]{font-size:1em}pre[class*=language-]{border:1px solid var(--prism-border);border-radius:.25rem;margin:.5em 0;padding:1em;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:var(--prism-background)}.token.comment,.token.prolog,.token.doctype,.token.italic,.token.cdata{font-style:italic}.token.important,.token.function,.token.bold{font-weight:700}.token.namespace{opacity:.7}.token.atrule{color:var(--prism-atrule)}.token.attr{color:var(--prism-attr)}.token.attr-name{color:var(--prism-attr-name)}.token.boolean{color:var(--prism-boolean)}.token.builtin{color:var(--prism-builtin)}.token.cdata{color:var(--prism-cdata)}.token.changed{color:var(--prism-changed)}.token.char{color:var(--prism-char)}.token.comment{color:var(--prism-comment)}.token.constant{color:var(--prism-constant)}.token.deleted{color:var(--prism-deleted)}.token.doctype{color:var(--prism-doctype)}.token.entity{color:var(--prism-entity);cursor:help}.token.function{color:var(--prism-function)}.token.function-variable{color:var(--prism-function-variable,var(--prism-function))}.token.inserted{color:var(--prism-inserted)}.token.keyword{color:var(--prism-keyword)}.token.number{color:var(--prism-number)}.token.operator{color:var(--prism-operator)}.token.prolog{color:var(--prism-prolog)}.token.property{color:var(--prism-property)}.token.punctuation{color:var(--prism-punctuation)}.token.regex{color:var(--prism-regex)}.token.selector{color:var(--prism-selector)}.token.string{color:var(--prism-string)}.token.symbol{color:var(--prism-symbol)}.token.tag{color:var(--prism-tag)}.token.url{color:var(--prism-url)}.token.variable{color:var(--prism-variable)}.token.placeholder{color:var(--prism-placeholder)}.token.statement{color:var(--prism-statement)}.token.attr-value{color:var(--prism-attr-value)}.token.control{color:var(--prism-control)}.token.directive{color:var(--prism-directive)}.token.unit{color:var(--prism-unit)}.token.important{color:var(--prism-important)}.token.class-name{color:var(--prism-class-name)}", Fl = `/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */
@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-scroll-snap-strictness:proximity;--tw-space-y-reverse:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-content:"";--tw-duration:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-100:#ffe2e2;--color-red-300:#ffa3a3;--color-red-500:#fb2c36;--color-red-600:#e40014;--color-red-700:#bf000f;--color-red-800:#9f0712;--color-orange-100:#ffedd5;--color-orange-500:#fe6e00;--color-orange-800:#9f2d00;--color-amber-400:#fcbb00;--color-yellow-100:#fef9c2;--color-yellow-400:#fac800;--color-yellow-600:#cd8900;--color-yellow-800:#874b00;--color-green-100:#dcfce7;--color-green-300:#7bf1a8;--color-green-600:#00a544;--color-green-700:#008138;--color-green-800:#016630;--color-cyan-600:#0092b5;--color-sky-50:#f0f9ff;--color-sky-100:#dff2fe;--color-sky-200:#b8e6fe;--color-sky-300:#77d4ff;--color-sky-400:#00bcfe;--color-sky-500:#00a5ef;--color-sky-600:#0084cc;--color-sky-700:#0069a4;--color-sky-800:#005986;--color-sky-900:#024a70;--color-sky-950:#052f4a;--color-gray-50:var(--mut-gray-50,var(--color-zinc-50));--color-gray-200:var(--mut-gray-200,var(--color-zinc-200));--color-gray-400:var(--mut-gray-400,var(--color-zinc-400));--color-gray-600:var(--mut-gray-600,var(--color-zinc-600));--color-gray-700:var(--mut-gray-700,var(--color-zinc-700));--color-zinc-50:#fafafa;--color-zinc-100:#f4f4f5;--color-zinc-200:#e4e4e7;--color-zinc-300:#d4d4d8;--color-zinc-400:#9f9fa9;--color-zinc-500:#71717b;--color-zinc-600:#52525c;--color-zinc-700:#3f3f46;--color-zinc-800:#27272a;--color-zinc-900:#18181b;--color-zinc-950:#09090b;--color-neutral-400:#a1a1a1;--color-white:var(--mut-white,#fff);--spacing:.25rem;--container-6xl:72rem;--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--text-5xl:3rem;--text-5xl--line-height:1;--font-weight-light:300;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--tracking-tight:-.025em;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-3xl:1.5rem;--blur-lg:16px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--transition-property-max-width:max-width;--transition-property-width:width;--transition-property-stroke-opacity:stroke-opacity;--spacing-drawer-half-open:var(--mte-drawer-height-half-open,120px);--color-primary-500:var(--mut-primary-500,var(--color-sky-500));--color-primary-600:var(--mut-primary-600,var(--color-sky-600))}@supports (color:lab(0% 0 0)){:root,:host{--color-red-100:lab(92.243% 10.2865 3.83865);--color-red-300:lab(76.5514% 36.422 15.5335);--color-red-500:lab(55.4814% 75.0732 48.8528);--color-red-600:lab(48.4493% 77.4328 61.5452);--color-red-700:lab(40.4273% 67.2623 53.7441);--color-red-800:lab(33.7174% 55.8993 41.0293);--color-orange-100:lab(94.7127% 3.58394 14.3151);--color-orange-500:lab(64.272% 57.1788 90.3583);--color-orange-800:lab(37.1566% 46.6433 50.5562);--color-amber-400:lab(80.1641% 16.6016 99.2089);--color-yellow-100:lab(97.3564% -4.51407 27.344);--color-yellow-400:lab(83.2664% 8.65132 106.895);--color-yellow-600:lab(62.7799% 22.4197 86.1544);--color-yellow-800:lab(38.7484% 23.5833 51.4916);--color-green-100:lab(96.1861% -13.8464 6.52365);--color-green-300:lab(86.9953% -47.2691 25.0054);--color-green-600:lab(59.0978% -58.6621 41.2579);--color-green-700:lab(47.0329% -47.0239 31.4788);--color-green-800:lab(37.4616% -36.7971 22.9692);--color-cyan-600:lab(55.1767% -26.7496 -30.5139);--color-sky-50:lab(97.3623% -2.33802 -4.13098);--color-sky-100:lab(94.3709% -4.56053 -8.23453);--color-sky-200:lab(88.6983% -11.3978 -16.8488);--color-sky-300:lab(80.3307% -20.2945 -31.385);--color-sky-400:lab(70.687% -23.6078 -45.9483);--color-sky-500:lab(63.3038% -18.433 -51.0407);--color-sky-600:lab(51.7754% -11.4712 -49.8349);--color-sky-700:lab(41.6013% -9.10804 -42.5647);--color-sky-800:lab(35.164% -9.57692 -34.4068);--color-sky-900:lab(29.1959% -8.34689 -28.2453);--color-sky-950:lab(17.8299% -5.31271 -21.1584);--color-zinc-50:lab(98.26% 0 0);--color-zinc-100:lab(96.1634% .0993311 -.364041);--color-zinc-200:lab(90.6853% .399232 -1.45452);--color-zinc-300:lab(84.9837% .601262 -2.17986);--color-zinc-400:lab(65.6464% 1.53497 -5.42429);--color-zinc-500:lab(47.8878% 1.65477 -5.77283);--color-zinc-600:lab(35.1166% 1.78212 -6.1173);--color-zinc-700:lab(26.8019% 1.35387 -4.68303);--color-zinc-800:lab(15.7305% .613764 -2.16959);--color-zinc-900:lab(8.30603% .618205 -2.16572);--color-zinc-950:lab(2.51107% .242703 -.886115);--color-neutral-400:lab(66.128% -.0000298023 .0000119209)}}:host{--mte-drawer-height-half-open:120px}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}input:where([type=text]),input:where(:not([type])),input:where([type=email]),input:where([type=url]),input:where([type=password]),input:where([type=number]),input:where([type=date]),input:where([type=datetime-local]),input:where([type=month]),input:where([type=search]),input:where([type=tel]),input:where([type=time]),input:where([type=week]),select:where([multiple]),textarea,select{appearance:none;border-color:var(--mut-gray-500,var(--color-zinc-500));--tw-shadow:0 0 #0000;background-color:#fff;border-width:1px;border-radius:0;padding:.5rem .75rem;font-size:1rem;line-height:1.5rem}:is(input:where([type=text]),input:where(:not([type])),input:where([type=email]),input:where([type=url]),input:where([type=password]),input:where([type=number]),input:where([type=date]),input:where([type=datetime-local]),input:where([type=month]),input:where([type=search]),input:where([type=tel]),input:where([type=time]),input:where([type=week]),select:where([multiple]),textarea,select):focus{outline-offset:2px;--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#155dfc;--tw-ring-offset-shadow:var(--tw-ring-inset)0 0 0 var(--tw-ring-offset-width)var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);border-color:#155dfc;border-color:lab(44.0605% 29.0279 -86.0352);outline:2px solid #0000}@supports (color:lab(0% 0 0)){:is(input:where([type=text]),input:where(:not([type])),input:where([type=email]),input:where([type=url]),input:where([type=password]),input:where([type=number]),input:where([type=date]),input:where([type=datetime-local]),input:where([type=month]),input:where([type=search]),input:where([type=tel]),input:where([type=time]),input:where([type=week]),select:where([multiple]),textarea,select):focus{--tw-ring-color:lab(44.0605% 29.0279 -86.0352)}}input::placeholder,textarea::placeholder{color:var(--mut-gray-500,var(--color-zinc-500));opacity:1}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-date-and-time-value{min-height:1.5em}::-webkit-date-and-time-value{text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit{padding-top:0;padding-bottom:0}::-webkit-datetime-edit-year-field{padding-top:0;padding-bottom:0}::-webkit-datetime-edit-month-field{padding-top:0;padding-bottom:0}::-webkit-datetime-edit-day-field{padding-top:0;padding-bottom:0}::-webkit-datetime-edit-hour-field{padding-top:0;padding-bottom:0}::-webkit-datetime-edit-minute-field{padding-top:0;padding-bottom:0}::-webkit-datetime-edit-second-field{padding-top:0;padding-bottom:0}::-webkit-datetime-edit-millisecond-field{padding-top:0;padding-bottom:0}::-webkit-datetime-edit-meridiem-field{padding-top:0;padding-bottom:0}select{-webkit-print-color-adjust:exact;print-color-adjust:exact;background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='oklch(55.1%25 0.027 264.364)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");background-position:right .5rem center;background-repeat:no-repeat;background-size:1.5em 1.5em;padding-right:2.5rem}select:where([multiple]),select:where([size]:not([size="1"])){background-image:initial;background-position:initial;background-repeat:unset;background-size:initial;print-color-adjust:unset;padding-right:.75rem}input:where([type=checkbox]),input:where([type=radio]){appearance:none;-webkit-print-color-adjust:exact;print-color-adjust:exact;vertical-align:middle;-webkit-user-select:none;user-select:none;color:#155dfc;color:lab(44.0605% 29.0279 -86.0352);border-color:var(--mut-gray-500,var(--color-zinc-500));--tw-shadow:0 0 #0000;background-color:#fff;background-origin:border-box;border-width:1px;flex-shrink:0;width:1rem;height:1rem;padding:0;display:inline-block}input:where([type=checkbox]){border-radius:0}input:where([type=radio]){border-radius:100%}input:where([type=checkbox]):focus,input:where([type=radio]):focus{outline-offset:2px;--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:2px;--tw-ring-offset-color:#fff;--tw-ring-color:#155dfc;--tw-ring-offset-shadow:var(--tw-ring-inset)0 0 0 var(--tw-ring-offset-width)var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);outline:2px solid #0000}@supports (color:lab(0% 0 0)){input:where([type=checkbox]):focus,input:where([type=radio]):focus{--tw-ring-color:lab(44.0605% 29.0279 -86.0352)}}input:where([type=checkbox]):checked,input:where([type=radio]):checked{background-color:currentColor;background-position:50%;background-repeat:no-repeat;background-size:100% 100%;border-color:#0000}input:where([type=checkbox]):checked{background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")}@media (forced-colors:active){input:where([type=checkbox]):checked{appearance:auto}}input:where([type=radio]):checked{background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e")}@media (forced-colors:active){input:where([type=radio]):checked{appearance:auto}}input:where([type=checkbox]):checked:hover,input:where([type=checkbox]):checked:focus,input:where([type=radio]):checked:hover,input:where([type=radio]):checked:focus{background-color:currentColor;border-color:#0000}input:where([type=checkbox]):indeterminate{background-color:currentColor;background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");background-position:50%;background-repeat:no-repeat;background-size:100% 100%;border-color:#0000}@media (forced-colors:active){input:where([type=checkbox]):indeterminate{appearance:auto}}input:where([type=checkbox]):indeterminate:hover,input:where([type=checkbox]):indeterminate:focus{background-color:currentColor;border-color:#0000}input:where([type=file]){background:unset;border-color:inherit;font-size:unset;line-height:inherit;border-width:0;border-radius:0;padding:0}input:where([type=file]):focus{outline:1px solid buttontext;outline:1px auto -webkit-focus-ring-color}}@layer components;@layer utilities{.pointer-events-none{pointer-events:none}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.top-offset{top:var(--top-offset,0)}.bottom-0{bottom:calc(var(--spacing)*0)}.left-0{left:calc(var(--spacing)*0)}.z-10{z-index:10}.z-20{z-index:20}.float-right{float:right}.container{width:100%}@media (min-width:2000px){.container{max-width:2000px}}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.container{margin-inline:auto}.mx-0\\.5{margin-inline:calc(var(--spacing)*.5)}.mx-1{margin-inline:calc(var(--spacing)*1)}.mx-2{margin-inline:calc(var(--spacing)*2)}.mx-auto{margin-inline:auto}.my-3{margin-block:calc(var(--spacing)*3)}.my-4{margin-block:calc(var(--spacing)*4)}.ms-1{margin-inline-start:calc(var(--spacing)*1)}.ms-3{margin-inline-start:calc(var(--spacing)*3)}.me-1{margin-inline-end:calc(var(--spacing)*1)}.me-2{margin-inline-end:calc(var(--spacing)*2)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-4{margin-top:calc(var(--spacing)*4)}.mr-2{margin-right:calc(var(--spacing)*2)}.mr-4{margin-right:calc(var(--spacing)*4)}.mr-6{margin-right:calc(var(--spacing)*6)}.mr-auto{margin-right:auto}.-mb-px{margin-bottom:-1px}.mb-0{margin-bottom:calc(var(--spacing)*0)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-6{margin-bottom:calc(var(--spacing)*6)}.ml-1{margin-left:calc(var(--spacing)*1)}.ml-2{margin-left:calc(var(--spacing)*2)}.ml-4{margin-left:calc(var(--spacing)*4)}.ml-6{margin-left:calc(var(--spacing)*6)}.ml-auto{margin-left:auto}.block{display:block}.contents{display:contents}.flex{display:flex}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.table{display:table}.h-2{height:calc(var(--spacing)*2)}.h-3{height:calc(var(--spacing)*3)}.h-4{height:calc(var(--spacing)*4)}.h-5{height:calc(var(--spacing)*5)}.h-8{height:calc(var(--spacing)*8)}.h-100{height:calc(var(--spacing)*100)}.h-fit{height:fit-content}.h-full{height:100%}.max-h-132{max-height:calc(var(--spacing)*132)}.w-4{width:calc(var(--spacing)*4)}.w-5{width:calc(var(--spacing)*5)}.w-12{width:calc(var(--spacing)*12)}.w-24{width:calc(var(--spacing)*24)}.w-full{width:100%}.max-w-6xl{max-width:var(--container-6xl)}.max-w-160{max-width:calc(var(--spacing)*160)}.min-w-\\[24px\\]{min-width:24px}.shrink-0{flex-shrink:0}.grow{flex-grow:1}.table-auto{table-layout:auto}.rotate-180{rotate:180deg}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.cursor-help{cursor:help}.cursor-pointer{cursor:pointer}.resize{resize:both}.snap-y{scroll-snap-type:y var(--tw-scroll-snap-strictness)}.snap-start{scroll-snap-align:start}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.justify-around{justify-content:space-around}.justify-center{justify-content:center}.justify-start{justify-content:flex-start}.gap-2{gap:calc(var(--spacing)*2)}.gap-4{gap:calc(var(--spacing)*4)}.gap-5{gap:calc(var(--spacing)*5)}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*4)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*4)*calc(1 - var(--tw-space-y-reverse)))}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-gray-200>:not(:last-child)){border-color:var(--mut-gray-200,var(--color-zinc-200))}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-sm{border-radius:var(--radius-sm)}.rounded-t-3xl{border-top-left-radius:var(--radius-3xl);border-top-right-radius:var(--radius-3xl)}.rounded-t-lg{border-top-left-radius:var(--radius-lg);border-top-right-radius:var(--radius-lg)}.border{border-style:var(--tw-border-style);border-width:1px}.border-0{border-style:var(--tw-border-style);border-width:0}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-b-2{border-bottom-style:var(--tw-border-style);border-bottom-width:2px}.border-none{--tw-border-style:none;border-style:none}.border-gray-200{border-color:var(--mut-gray-200,var(--color-zinc-200))}.border-transparent{border-color:#0000}.bg-cyan-600{background-color:var(--color-cyan-600)}.bg-gray-100{background-color:var(--mut-gray-100,var(--color-zinc-100))}.bg-gray-200{background-color:var(--mut-gray-200,var(--color-zinc-200))}.bg-gray-200\\/60{background-color:var(--mut-gray-200,#e4e4e7)}@supports (color:lab(0% 0 0)){.bg-gray-200\\/60{background-color:var(--mut-gray-200,lab(90.6853% .399232 -1.45452))}}@supports (color:color-mix(in lab, red, red)){.bg-gray-200\\/60{background-color:color-mix(in oklab,var(--mut-gray-200,var(--color-zinc-200))60%,transparent)}}.bg-gray-300{background-color:var(--mut-gray-300,var(--color-zinc-300))}.bg-green-100{background-color:var(--color-green-100)}.bg-green-600{background-color:var(--color-green-600)}.bg-inherit{background-color:inherit}.bg-orange-100{background-color:var(--color-orange-100)}.bg-primary-100{background-color:var(--mut-primary-100,var(--color-sky-100))}.bg-primary-600{background-color:var(--mut-primary-600,var(--color-sky-600))}.bg-red-100{background-color:var(--color-red-100)}.bg-red-600{background-color:var(--color-red-600)}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--mut-white,#fff)}.bg-yellow-100{background-color:var(--color-yellow-100)}.bg-yellow-400{background-color:var(--color-yellow-400)}.bg-yellow-600{background-color:var(--color-yellow-600)}.stroke-gray-800{stroke:var(--mut-gray-800,var(--color-zinc-800))}.p-1{padding:calc(var(--spacing)*1)}.p-2{padding:calc(var(--spacing)*2)}.p-3{padding:calc(var(--spacing)*3)}.p-4{padding:calc(var(--spacing)*4)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-2\\.5{padding-inline:calc(var(--spacing)*2.5)}.px-4{padding-inline:calc(var(--spacing)*4)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-3{padding-block:calc(var(--spacing)*3)}.py-4{padding-block:calc(var(--spacing)*4)}.py-6{padding-block:calc(var(--spacing)*6)}.pe-4{padding-inline-end:calc(var(--spacing)*4)}.pt-7{padding-top:calc(var(--spacing)*7)}.pr-2{padding-right:calc(var(--spacing)*2)}.pb-4{padding-bottom:calc(var(--spacing)*4)}.pb-drawer-half-open{padding-bottom:var(--mte-drawer-height-half-open,120px)}.pl-1{padding-left:calc(var(--spacing)*1)}.text-center{text-align:center}.text-left{text-align:left}.align-middle{vertical-align:middle}.font-sans{font-family:var(--font-sans)}.text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-light{--tw-font-weight:var(--font-weight-light);font-weight:var(--font-weight-light)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.whitespace-pre-wrap{white-space:pre-wrap}.text-gray-200{color:var(--mut-gray-200,var(--color-zinc-200))}.text-gray-400{color:var(--mut-gray-400,var(--color-zinc-400))}.text-gray-600{color:var(--mut-gray-600,var(--color-zinc-600))}.text-gray-700{color:var(--mut-gray-700,var(--color-zinc-700))}.text-gray-800{color:var(--mut-gray-800,var(--color-zinc-800))}.text-gray-900{color:var(--mut-gray-900,var(--color-zinc-900))}.text-green-700{color:var(--color-green-700)}.text-green-800{color:var(--color-green-800)}.text-orange-800{color:var(--color-orange-800)}.text-primary-500{color:var(--mut-primary-500,var(--color-sky-500))}.text-primary-800{color:var(--mut-primary-800,var(--color-sky-800))}.text-red-700{color:var(--color-red-700)}.text-red-800{color:var(--color-red-800)}.text-white{color:var(--mut-white,#fff)}.text-yellow-600{color:var(--color-yellow-600)}.text-yellow-800{color:var(--color-yellow-800)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.underline{text-decoration-line:underline}.decoration-dotted{text-decoration-style:dotted}.opacity-0{opacity:0}.opacity-100{opacity:1}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a),0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-offset-gray-200\\!{--tw-ring-offset-color:var(--mut-gray-200,var(--color-zinc-200))!important}.outline-hidden{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.outline-hidden{outline-offset:2px;outline:2px solid #0000}}.filter{filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.backdrop-blur-lg{--tw-backdrop-blur:blur(var(--blur-lg));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-shadow{transition-property:box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-stroke-opacity{transition-property:var(--transition-property-stroke-opacity);transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.\\[httparchive\\:summary_pages\\.2018_12_15_desktop\\]{httparchive:summary pages.2018 12 15 desktop}@media (hover:hover){.group-hover\\:bg-gray-200\\!:is(:where(.group):hover *){background-color:var(--mut-gray-200,var(--color-zinc-200))!important}}.group-aria-selected\\:text-gray-200:is(:where(.group)[aria-selected=true] *){color:var(--mut-gray-200,var(--color-zinc-200))}.group-aria-selected\\:text-primary-50:is(:where(.group)[aria-selected=true] *){color:var(--mut-primary-50,var(--color-sky-50))}.group-aria-selected\\:underline:is(:where(.group)[aria-selected=true] *){text-decoration-line:underline}.backdrop\\:bg-gray-950\\/50::backdrop{background-color:var(--mut-gray-950,#09090b)}@supports (color:lab(0% 0 0)){.backdrop\\:bg-gray-950\\/50::backdrop{background-color:var(--mut-gray-950,lab(2.51107% .242703 -.886115))}}@supports (color:color-mix(in lab, red, red)){.backdrop\\:bg-gray-950\\/50::backdrop{background-color:color-mix(in oklab,var(--mut-gray-950,var(--color-zinc-950))50%,transparent)}}.backdrop\\:backdrop-blur-lg::backdrop{--tw-backdrop-blur:blur(var(--blur-lg));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.after\\:text-gray-800:after{content:var(--tw-content);color:var(--mut-gray-800,var(--color-zinc-800))}.after\\:content-\\[\\'\\/\\'\\]:after{--tw-content:"/";content:var(--tw-content)}.last\\:mr-12:last-child{margin-right:calc(var(--spacing)*12)}.odd\\:bg-gray-100:nth-child(odd),.even\\:bg-gray-100:nth-child(2n){background-color:var(--mut-gray-100,var(--color-zinc-100))}.checked\\:bg-primary-600:checked{background-color:var(--mut-primary-600,var(--color-sky-600))}@media (hover:hover){.hover\\:cursor-pointer:hover{cursor:pointer}.hover\\:border-gray-300:hover{border-color:var(--mut-gray-300,var(--color-zinc-300))}.hover\\:bg-gray-100:hover{background-color:var(--mut-gray-100,var(--color-zinc-100))}.hover\\:bg-gray-200:hover{background-color:var(--mut-gray-200,var(--color-zinc-200))}.hover\\:bg-primary-700:hover{background-color:var(--mut-primary-700,var(--color-sky-700))}.hover\\:text-gray-700:hover{color:var(--mut-gray-700,var(--color-zinc-700))}.hover\\:text-gray-900:hover{color:var(--mut-gray-900,var(--color-zinc-900))}.hover\\:text-primary-on:hover{color:var(--mut-primary-on,var(--color-sky-700))}.hover\\:underline:hover{text-decoration-line:underline}}.focus\\:shadow-none:focus{--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-2:focus{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-primary-500:focus{--tw-ring-color:var(--mut-primary-500,var(--color-sky-500))}.focus\\:outline-hidden:focus{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.focus\\:outline-hidden:focus{outline-offset:2px;outline:2px solid #0000}}.active\\:bg-gray-200:active{background-color:var(--mut-gray-200,var(--color-zinc-200))}.aria-selected\\:border-b-\\[3px\\][aria-selected=true]{border-bottom-style:var(--tw-border-style);border-bottom-width:3px}.aria-selected\\:border-solid[aria-selected=true]{--tw-border-style:solid;border-style:solid}.aria-selected\\:border-primary-700[aria-selected=true]{border-color:var(--mut-primary-700,var(--color-sky-700))}.aria-selected\\:bg-primary-500[aria-selected=true]{background-color:var(--mut-primary-500,var(--color-sky-500))}.aria-selected\\:text-gray-50[aria-selected=true]{color:var(--mut-gray-50,var(--color-zinc-50))}.aria-selected\\:text-primary-on[aria-selected=true]{color:var(--mut-primary-on,var(--color-sky-700))}.aria-selected\\:shadow-lg[aria-selected=true]{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}@media (prefers-reduced-motion:no-preference){.motion-safe\\:transition-\\[height\\,max-width\\]{transition-property:height,max-width;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.motion-safe\\:transition-max-width{transition-property:var(--transition-property-max-width);transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.motion-safe\\:transition-width{transition-property:var(--transition-property-width);transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.motion-safe\\:duration-200{--tw-duration:.2s;transition-duration:.2s}}@media (min-width:48rem){.md\\:ml-2{margin-left:calc(var(--spacing)*2)}.md\\:w-1\\/2{width:50%}.md\\:after\\:pl-1:after{content:var(--tw-content);padding-left:calc(var(--spacing)*1)}}@media (min-width:96rem){.\\32 xl\\:w-28{width:calc(var(--spacing)*28)}}}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-scroll-snap-strictness{syntax:"*";inherits:false;initial-value:proximity}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-content{syntax:"*";inherits:false;initial-value:""}@property --tw-duration{syntax:"*";inherits:false}`, _e = De(Fl), vi = De(zl);
if (_e.styleSheet && document?.adoptedStyleSheets && !document.adoptedStyleSheets.some((e) => e.cssRules[0]?.cssText === _e.styleSheet.cssRules[0].cssText)) {
  const e = new CSSStyleSheet();
  let t = _e.cssText;
  t = t.replaceAll("inherits: false", "inherits: true").substring(t.indexOf("@property")), e.replaceSync(t), document.adoptedStyleSheets.push(e);
}
class je extends io {
  static styles = [_e];
}
const ir = (e, t) => g`<li title=${e.trim() || G} class="my-3 rounded-sm bg-white px-2 py-3 shadow-sm">${t}</li>`, Ve = (e, t) => g`<p title=${t?.trim() || G}>${e}</p>`, bi = (e) => g`<div class="mt-2 mr-6 mb-6 flex flex-col gap-4">${e}</div>`, L = (e, t) => g`<span role="img" aria-label=${t}>${e}</span>`, Ol = ":host([mode=closed]){height:0}:host([mode=half]){height:var(--spacing-drawer-half-open)}:host([mode=open]){height:50%}";
var wi = Object.defineProperty, Il = Object.getOwnPropertyDescriptor, yi = (e) => {
  throw TypeError(e);
}, Ll = (e, t, r) => t in e ? wi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Bt = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? Il(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && wi(t, r, n), n;
}, ki = (e, t, r) => Ll(e, typeof t != "symbol" ? t + "" : t, r), xi = (e, t, r) => t.has(e) || yi("Cannot " + r), Kt = (e, t, r) => (xi(e, t, "read from private field"), t.get(e)), Cr = (e, t, r) => t.has(e) ? yi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Cn = (e, t, r, a) => (xi(e, t, "write to private field"), t.set(e, r), r), Yt, Ct, Or;
const Dl = 120;
let Qe = class extends je {
  constructor() {
    super(), Cr(this, Yt), Cr(this, Ct), ki(this, "toggleReadMore", (e) => {
      this.mode === "open" ? this.mode = "half" : this.mode = "open", e.preventDefault(), e.stopImmediatePropagation();
    }), Cr(this, Or, (e) => {
      e.key === "Escape" && (this.mode = "closed");
    }), this.mode = "closed", this.hasDetail = !1, Cn(this, Ct, new AbortController()), Cn(this, Yt, new _l(this, {
      callback: (e) => {
        const t = e[0]?.contentRect.height ?? 0, r = this.header?.clientHeight ?? 0;
        return t - r;
      }
    }));
  }
  get toggleMoreLabel() {
    switch (this.mode) {
      case "half":
        return g`${L("🔼", "up arrow")} More`;
      case "open":
        return g`${L("🔽", "down arrow")} Less`;
      case "closed":
        return G;
    }
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", Kt(this, Or), { signal: Kt(this, Ct).signal });
  }
  disconnectedCallback() {
    Kt(this, Ct).abort(), super.disconnectedCallback();
  }
  render() {
    const e = this.mode === "open", t = Kt(this, Yt).value;
    return g`<aside @click=${(r) => r.stopPropagation()} class="mr-4 ml-6">
      <header class="w-full py-4">
        <h2>
          <slot name="header"></slot>
          ${P(
      this.hasDetail,
      () => g`<button data-testId="btnReadMoreToggle" class="ml-2 cursor-pointer align-middle" @click=${this.toggleReadMore}>
                ${this.toggleMoreLabel}
              </button>`
    )}
        </h2>
      </header>
      <div
        style=${t && e ? `height: ${t}px;` : G}
        class=${xa({ "mb-4 motion-safe:transition-max-width": !0, "overflow-y-auto": e })}
      >
        <slot name="summary"></slot>
        ${P(this.hasDetail && this.mode === "open", () => g`<slot name="detail"></slot>`)}
      </div>
    </aside>`;
  }
};
Yt = /* @__PURE__ */ new WeakMap();
Ct = /* @__PURE__ */ new WeakMap();
Or = /* @__PURE__ */ new WeakMap();
ki(Qe, "styles", [De(Ol), _e]);
Bt([
  C({ reflect: !0 })
], Qe.prototype, "mode", 2);
Bt([
  C({ reflect: !0, type: Boolean, attribute: "has-detail" })
], Qe.prototype, "hasDetail", 2);
Bt([
  C({ attribute: !1 })
], Qe.prototype, "toggleMoreLabel", 1);
Bt([
  wt("header")
], Qe.prototype, "header", 2);
Qe = Bt([
  V("mte-drawer")
], Qe);
function Bl(e) {
  switch (e) {
    case "Killed":
      return "success";
    case "NoCoverage":
      return "caution";
    case "Survived":
      return "danger";
    case "Timeout":
      return "warning";
    case "Ignored":
    case "RuntimeError":
    case "Pending":
    case "CompileError":
      return "secondary";
  }
}
function Rl(e) {
  switch (e) {
    case N.Killing:
      return "success";
    case N.Covering:
      return "warning";
    case N.NotCovering:
      return "caution";
  }
}
function Ea(e) {
  switch (e) {
    case N.Killing:
      return L("✅", e);
    case N.Covering:
      return L("☂", e);
    case N.NotCovering:
      return L("🌧", e);
  }
}
function _i(e) {
  switch (e) {
    case "Killed":
      return L("✅", e);
    case "NoCoverage":
      return L("🙈", e);
    case "Ignored":
      return L("🤥", e);
    case "Survived":
      return L("👽", e);
    case "Timeout":
      return L("⏰", e);
    case "Pending":
      return L("⌛", e);
    case "RuntimeError":
    case "CompileError":
      return L("💥", e);
  }
}
function Mr(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function kt(...e) {
  const t = e.filter(Boolean).join("/");
  if (Dt)
    return `#${t}`;
  {
    const r = new URL(window.location.href);
    return new URL(`#${t}`, r).href;
  }
}
function $i(e) {
  return e.length > 1 ? "s" : "";
}
function Si({ fileName: e, location: t }) {
  return e ? `${e}${t ? `:${t.start.line}:${t.start.column}` : ""}` : "";
}
function Ci(e) {
  e && !jl(e) && e.scrollIntoView({
    block: "center",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
  });
}
function jl(e) {
  const { top: t, bottom: r } = e.getBoundingClientRect();
  return t >= 0 && r <= (window.innerHeight || document.documentElement.clientHeight) - Dl;
}
const Mi = new Qn(), Nl = Dt ? Xn : wl(nl(1), Ft(window, "hashchange").pipe(xl((e) => e.preventDefault()))).pipe(
  Aa(() => window.location.hash.substr(1).split("/").filter(Boolean).map(decodeURIComponent))
), ce = {
  mutant: "mutant",
  test: "test"
};
class Ce extends je {
  shouldReactivate() {
    return !0;
  }
  reactivate() {
    this.requestUpdate();
  }
  #e = new Ie();
  connectedCallback() {
    super.connectedCallback(), this.#e.add(Mi.subscribe(() => this.shouldReactivate() && this.reactivate()));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.#e.unsubscribe();
  }
}
const Wl = `:host(:not([theme=dark])){--prism-maintext:var(--color-gray-700);--prism-background:var(--color-gray-50);--prism-border:var(--color-gray-200);--prism-cdata:#998;--prism-comment:var(--prism-cdata);--prism-doctype:var(--prism-cdata);--prism-prolog:var(--prism-cdata);--prism-attr-value:#e3116c;--prism-string:var(--prism-attr-value);--prism-boolean:#36acaa;--prism-entity:var(--prism-boolean);--prism-url:var(--prism-boolean);--prism-constant:var(--prism-boolean);--prism-inserted:var(--prism-boolean);--prism-number:var(--prism-boolean);--prism-property:var(--prism-boolean);--prism-regex:var(--prism-boolean);--prism-symbol:var(--prism-boolean);--prism-variable:var(--prism-boolean);--prism-atrule:#00a4db;--prism-attr-name:var(--prism-atrule);--prism-attr:var(--prism-atrule);--prism-operator:var(--prism-maintext);--prism-punctuation:var(--prism-maintext);--prism-deleted:#9a050f;--prism-function:var(--prism-deleted);--prism-function-variable:#6f42c1;--prism-selector:#00009f;--prism-tag:var(--prism-selector);--prism-keyword:var(--prism-selector)}:host([theme=dark]){--prism-maintext:var(--mut-gray-700);--prism-background:var(--mut-gray-50);--prism-border:var(--mut-gray-200);--prism-cdata:#7c7c7c;--prism-comment:var(--prism-cdata);--prism-doctype:var(--prism-cdata);--prism-prolog:var(--prism-cdata);--prism-punctuation:#c5c8c6;--prism-tag:#96cbfe;--prism-property:var(--prism-tag);--prism-keyword:var(--prism-tag);--prism-class-name:#ffffb6;--prism-boolean:#9c9;--prism-constant:var(--prism-boolean);--prism-symbol:#f92672;--prism-deleted:var(--prism-symbol);--prism-number:#ff73fd;--prism-inserted:#a8ff60;--prism-selector:var(--prism-inserted);--prism-attr-name:var(--prism-inserted);--prism-string:var(--prism-inserted);--prism-char:var(--prism-inserted);--prism-builtin:var(--prism-inserted);--prism-variable:#c6c5fe;--prism-operator:#ededed;--prism-entity:#ffffb6;--prism-url:#96cbfe;--prism-attr-value:#f9ee98;--prism-atrule:var(--prism-attr-value);--prism-function:#dad085;--prism-regex:#e9c062;--prism-important:#fd971f}:host(:not([theme=dark])){--mut-file-ts-color:#498ba7;--mut-file-ts-test-color:#cc6d2e;--mut-file-scala-color:#b8383d;--mut-file-java-color:#b8383d;--mut-file-js-color:#b7b73b;--mut-file-js-test-color:#cc6d2e;--mut-file-php-color:#9068b0;--mut-file-html-color:#cc6d2e;--mut-file-csharp-color:#498ba7;--mut-file-vue-color:#7fae42;--mut-file-gherkin-color:#00a818;--mut-file-svelte-color:#b8383d;--mut-file-rust-color:#627379;--mut-file-python-color:#498ba7}:host([theme=dark]){--mut-file-ts-color:#519aba;--mut-file-ts-test-color:#e37933;--mut-file-scala-color:#cc3e44;--mut-file-java-color:#cc3e44;--mut-file-js-color:#cbcb41;--mut-file-js-test-color:#e37933;--mut-file-php-color:#a074c4;--mut-file-html-color:#e37933;--mut-file-csharp-color:#519aba;--mut-file-vue-color:#8dc149;--mut-file-gherkin-color:#10b828;--mut-file-svelte-color:#cc3e44;--mut-file-rust-color:#6d8086;--mut-file-python-color:#519aba}:host{--mut-squiggly-Survived:url("data:image/svg+xml;charset=UTF8,<svg xmlns='http://www.w3.org/2000/svg' height='3' width='6'><g fill='oklch(0.637 0.237 25.331)'><path d='m5.5 0-3 3H1.1l3-3z'/><path d='m4 0 2 2V.6L5.4 0zM0 2l1 1h1.4L0 .6z'/></g></svg>");--mut-squiggly-NoCoverage:url("data:image/svg+xml;charset=UTF8,<svg xmlns='http://www.w3.org/2000/svg' height='3' width='6'><g fill='oklch(0.75 0.183 55.934)'><path d='m5.5 0-3 3H1.1l3-3z'/><path d='m4 0 2 2V.6L5.4 0zM0 2l1 1h1.4L0 .6z'/></g></svg>");color:var(--c)}:host(:not([theme=dark])){--mut-octicon-icon-color:var(--color-primary-600);--mut-line-number:var(--color-gray-400);--mut-diff-add-bg:oklch(from var(--color-green-300) l c h / .3);--mut-diff-add-bg-line-number:oklch(from var(--color-green-300) l c h / .5);--mut-diff-add-line-number:var(--color-gray-600);--mut-diff-del-bg:oklch(from var(--color-red-300) l c h / .3);--mut-diff-del-bg-line-number:oklch(from var(--color-red-300) l c h / .5);--mut-diff-del-line-number:var(--mut-diff-add-line-number)}:host([theme=dark]){--lightningcss-light: ;--lightningcss-dark:initial;--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark;--mut-octicon-icon-color:var(--color-primary-500);--mut-line-number:var(--color-gray-400);--mut-diff-add-bg:oklch(from var(--color-green-600) l c h / .15);--mut-diff-add-bg-line-number:oklch(from var(--color-green-600) l c h / .3);--mut-diff-add-line-number:var(--color-gray-700);--mut-diff-del-bg:oklch(from var(--color-red-600) l c h / .15);--mut-diff-del-bg-line-number:oklch(from var(--color-red-600) l c h / .3);--mut-diff-del-line-number:var(--mut-diff-add-line-number);--mut-white:var(--color-zinc-900);--mut-gray-50:var(--color-zinc-900);--mut-gray-100:var(--color-zinc-800);--mut-gray-200:var(--color-zinc-700);--mut-gray-300:var(--color-zinc-600);--mut-gray-400:var(--color-zinc-500);--mut-gray-500:var(--color-zinc-400);--mut-gray-600:var(--color-zinc-300);--mut-gray-700:var(--color-zinc-200);--mut-gray-800:var(--color-zinc-100);--mut-gray-900:var(--color-zinc-50);--mut-primary-100:var(--color-sky-800);--mut-primary-200:var(--color-sky-700);--mut-primary-800:var(--color-sky-100);--mut-primary-900:var(--color-sky-50);--mut-primary-on:var(--color-sky-500)}`;
var Ai = Object.defineProperty, ql = Object.getOwnPropertyDescriptor, Ti = (e) => {
  throw TypeError(e);
}, Ul = (e, t, r) => t in e ? Ai(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, se = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? ql(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Ai(t, r, n), n;
}, Ei = (e, t, r) => Ul(e, typeof t != "symbol" ? t + "" : t, r), Pa = (e, t, r) => t.has(e) || Ti("Cannot " + r), E = (e, t, r) => (Pa(e, t, "read from private field"), r ? r.call(e) : t.get(e)), he = (e, t, r) => t.has(e) ? Ti("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), ot = (e, t, r, a) => (Pa(e, t, "write to private field"), t.set(e, r), r), oe = (e, t, r) => (Pa(e, t, "access private method"), r), Et, X, Pi, br, Ot, Ir, Lr, zi, Fi, Oi, ze, it, Ye, ke, It, Ii, Dr, Li, Di, Bi;
const Kl = 100;
let Y = class extends Ce {
  constructor() {
    super(), he(this, X), he(this, Et, new AbortController()), he(this, br, /* @__PURE__ */ new Map()), he(this, Ot, /* @__PURE__ */ new Map()), he(this, Ir, () => {
      this.theme = oe(this, X, Lr).call(this);
    }), Ei(this, "themeSwitch", (e) => {
      this.theme = e.detail, mi() && localStorage.setItem("mutation-testing-elements-theme", this.theme);
    }), he(this, ze), he(this, it), he(this, Ye), he(this, ke), he(this, It), this.context = { view: ce.mutant, path: [] }, this.path = [], ot(this, it, new Ie()), ot(this, Ye, new Ie()), E(this, it).add(E(this, Ye));
  }
  get themeBackgroundColor() {
    return getComputedStyle(this).getPropertyValue("--color-white");
  }
  get title() {
    return this.context.result ? this.titlePostfix ? `${this.context.result.name} - ${this.titlePostfix}` : this.context.result.name : "";
  }
  firstUpdated() {
    (this.path.length === 0 || this.path[0] !== ce.mutant && this.path[0] !== ce.test) && window.location.replace(kt(`${ce.mutant}`));
  }
  willUpdate(e) {
    this.report && (this.theme ??= oe(this, X, Lr).call(this), e.has("report") && oe(this, X, zi).call(this, this.report), (e.has("path") || e.has("report")) && (oe(this, X, Fi).call(this), oe(this, X, Oi).call(this))), e.has("src") && oe(this, X, Pi).call(this);
  }
  updated(e) {
    e.has("theme") && this.theme && this.dispatchEvent(
      ge("theme-changed", {
        theme: this.theme,
        themeBackgroundColor: this.themeBackgroundColor
      })
    );
  }
  connectedCallback() {
    super.connectedCallback(), window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", E(this, Ir), { signal: E(this, Et).signal }), E(this, it).add(Nl.subscribe((e) => this.path = e)), oe(this, X, Ii).call(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), E(this, Et).abort(), E(this, it).unsubscribe(), E(this, ze)?.close();
  }
  render() {
    return P(
      this.context.result ?? this.errorMessage,
      () => g`<mte-file-picker .rootModel=${this.rootModel}></mte-file-picker>
          <div class="container space-y-4 bg-white pb-4 font-sans text-gray-800 transition-colors motion-safe:transition-max-width">
            ${oe(this, X, Di).call(this)}
            <mte-theme-switch @theme-switch=${this.themeSwitch} class="sticky top-offset z-20 float-right mb-0 pt-7" .theme=${this.theme}>
            </mte-theme-switch>
            ${oe(this, X, Li).call(this)} ${oe(this, X, Bi).call(this)}
            <mte-breadcrumb
              @mte-file-picker-open=${() => this.filePicker.open()}
              .view=${this.context.view}
              .path=${this.context.path}
            ></mte-breadcrumb>
            <mte-result-status-bar
              detected=${St(this.rootModel?.systemUnderTestMetrics.metrics.totalDetected)}
              no-coverage=${St(this.rootModel?.systemUnderTestMetrics.metrics.noCoverage)}
              pending=${St(this.rootModel?.systemUnderTestMetrics.metrics.pending)}
              survived=${St(this.rootModel?.systemUnderTestMetrics.metrics.survived)}
              total=${St(this.rootModel?.systemUnderTestMetrics.metrics.totalValid)}
            ></mte-result-status-bar>
            ${P(
        this.context.view === "mutant" && this.context.result,
        () => g`<mte-mutant-view
                  id="mte-mutant-view"
                  .result=${this.context.result}
                  .thresholds=${this.report.thresholds}
                  .path=${this.path}
                ></mte-mutant-view>`
      )}
            ${P(
        this.context.view === "test" && this.context.result,
        () => g`<mte-test-view id="mte-test-view" .result=${this.context.result} .path=${this.path}></mte-test-view>`
      )}
          </div>`
    );
  }
};
Et = /* @__PURE__ */ new WeakMap();
X = /* @__PURE__ */ new WeakSet();
Pi = async function() {
  if (this.src)
    try {
      const e = await fetch(this.src);
      this.report = await e.json();
    } catch (e) {
      const t = String(e);
      this.errorMessage = t;
    }
};
br = /* @__PURE__ */ new WeakMap();
Ot = /* @__PURE__ */ new WeakMap();
Ir = /* @__PURE__ */ new WeakMap();
Lr = function() {
  const e = mi() && localStorage.getItem("mutation-testing-elements-theme");
  return e || (Dt || window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light");
};
zi = function(e) {
  this.rootModel = xo(e), t((r, a) => {
    r.result = a, r.mutants.forEach((n) => E(this, br).set(n.id, n));
  })(this.rootModel?.systemUnderTestMetrics), t((r, a) => {
    r.result = a, r.tests.forEach((n) => E(this, Ot).set(n.id, n));
  })(this.rootModel?.testMetrics), this.rootModel.systemUnderTestMetrics.updateParent(), this.rootModel.testMetrics?.updateParent();
  function t(r) {
    return function a(n) {
      n?.file && r(n.file, n), n?.childResults.forEach((i) => {
        a(i);
      });
    };
  }
};
Fi = function() {
  if (this.rootModel) {
    const e = (r, a) => a.reduce(
      (n, i) => n?.childResults.find((s) => s.name === i),
      r
    ), t = this.path.slice(1);
    this.path[0] === ce.test && this.rootModel.testMetrics ? this.context = {
      view: ce.test,
      path: t,
      result: e(this.rootModel.testMetrics, this.path.slice(1))
    } : this.context = {
      view: ce.mutant,
      path: t,
      result: e(this.rootModel.systemUnderTestMetrics, this.path.slice(1))
    };
  }
};
Oi = function() {
  Dt || (document.title = this.title);
};
ze = /* @__PURE__ */ new WeakMap();
it = /* @__PURE__ */ new WeakMap();
Ye = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakMap();
It = /* @__PURE__ */ new WeakMap();
Ii = function() {
  if (!this.sse)
    return;
  ot(this, ze, new EventSource(this.sse));
  const e = Ft(E(this, ze), "mutant-tested").subscribe((r) => {
    const a = JSON.parse(r.data);
    if (!this.report)
      return;
    const n = E(this, br).get(a.id);
    if (n !== void 0) {
      ot(this, ke, n);
      for (const [i, s] of Object.entries(a))
        E(this, ke)[i] = s;
      a.killedBy && a.killedBy.forEach((i) => {
        const s = E(this, Ot).get(i);
        s !== void 0 && (ot(this, It, s), s.addKilled(E(this, ke)), E(this, ke).addKilledBy(s));
      }), a.coveredBy && a.coveredBy.forEach((i) => {
        const s = E(this, Ot).get(i);
        s !== void 0 && (ot(this, It, s), s.addCovered(E(this, ke)), E(this, ke).addCoveredBy(s));
      });
    }
  }), t = Ft(E(this, ze), "mutant-tested").pipe(kl(Kl)).subscribe(() => {
    oe(this, X, Dr).call(this);
  });
  E(this, Ye).add(e), E(this, Ye).add(t), E(this, ze).addEventListener(
    "finished",
    () => {
      E(this, ze)?.close(), oe(this, X, Dr).call(this), E(this, Ye).unsubscribe();
    },
    { signal: E(this, Et).signal }
  );
};
Dr = function() {
  E(this, ke)?.update(), E(this, It)?.update(), Mi.next();
};
Li = function() {
  return P(
    this.context.result,
    (e) => g`<h1 class="mt-4 text-5xl font-bold tracking-tight">
          ${e.name}${P(this.titlePostfix, (t) => g`<small class="text-light-muted ml-4 font-light">${t}</small>`)}
        </h1>`
  );
};
Di = function() {
  return P(
    this.errorMessage,
    (e) => g`<div class="my-4 rounded-lg bg-red-100 p-4 text-sm text-red-700" role="alert">${e}</div>`
  );
};
Bi = function() {
  return P(this.rootModel?.testMetrics, () => {
    const e = this.context.view === "mutant", t = this.context.view === "test";
    return g`<nav class="border-b border-gray-200 text-center text-sm font-medium text-gray-600">
        <ul class="-mb-px flex flex-wrap" role="tablist">
          ${[
      { type: "mutant", isActive: e, text: "👽 Mutants" },
      { type: "test", isActive: t, text: "🧪 Tests" }
    ].map(
      ({ type: r, isActive: a, text: n }) => g`<li class="mr-2" role="presentation">
                <a
                  class="inline-block rounded-t-lg border-b-2 border-transparent p-4 transition-colors hover:border-gray-300 hover:bg-gray-200 hover:text-gray-700 aria-selected:border-b-[3px] aria-selected:border-solid aria-selected:border-primary-700 aria-selected:text-primary-on"
                  role="tab"
                  href=${kt(r)}
                  aria-selected=${a}
                  aria-controls="mte-${r}-view"
                  >${n}</a
                >
              </li>`
    )}
        </ul>
      </nav>`;
  });
};
Ei(Y, "styles", [De(Wl), _e]);
se([
  C({ attribute: !1 })
], Y.prototype, "report", 2);
se([
  C({ attribute: !1 })
], Y.prototype, "rootModel", 2);
se([
  C()
], Y.prototype, "src", 2);
se([
  C()
], Y.prototype, "sse", 2);
se([
  C({ attribute: !1 })
], Y.prototype, "errorMessage", 2);
se([
  C({ attribute: !1 })
], Y.prototype, "context", 2);
se([
  C({ type: Array })
], Y.prototype, "path", 2);
se([
  C({ attribute: "title-postfix" })
], Y.prototype, "titlePostfix", 2);
se([
  C({ reflect: !0 })
], Y.prototype, "theme", 2);
se([
  C({ attribute: !1 })
], Y.prototype, "themeBackgroundColor", 1);
se([
  wt("mte-file-picker")
], Y.prototype, "filePicker", 2);
se([
  C()
], Y.prototype, "title", 1);
Y = se([
  V("mutation-test-report-app")
], Y);
const O = {
  csharp: "cs",
  java: "java",
  javascript: "javascript",
  html: "html",
  php: "php",
  scala: "scala",
  typescript: "typescript",
  vue: "vue",
  gherkin: "gherkin",
  svelte: "svelte",
  rust: "rust",
  python: "python"
};
function Vl(e) {
  return e.substr(e.lastIndexOf(".") + 1).toLocaleLowerCase();
}
function za(e) {
  switch (Vl(e)) {
    case "cs":
      return O.csharp;
    case "html":
      return O.html;
    case "java":
      return O.java;
    case "js":
    case "cjs":
    case "mjs":
      return O.javascript;
    case "ts":
    case "tsx":
    case "cts":
    // New file extensions
    case "mts":
      return O.typescript;
    case "sc":
    case "sbt":
    case "scala":
      return O.scala;
    case "php":
      return O.php;
    case "vue":
      return O.vue;
    case "feature":
      return O.gherkin;
    case "svelte":
      return O.svelte;
    case "rs":
      return O.rust;
    case "py":
      return O.python;
    default:
      return;
  }
}
function Fa(e, t) {
  const r = za(t) ?? "plain";
  let a = r;
  return r === O.vue && (a = O.html), hn.highlight(e, hn.languages[a], a);
}
function Oa(e, t) {
  let r = [];
  const a = [], n = {
    column: 0,
    // incremented to 1 before first visitation
    line: 1,
    offset: -1
    // incremented to 0 before first visitation
  }, i = [];
  let s = !1, o = 0;
  for (; o < e.length; ) {
    switch (s && !Jt(e[o]) && (u(), s = !1), e[o]) {
      case pe.CarriageReturn:
        n.offset++;
        break;
      case pe.NewLine:
        x(), n.offset++, n.line++, n.column = 0, s = !0;
        break;
      case pe.LT: {
        const d = $();
        d.isClosing ? S(d) : w(d);
        break;
      }
      case pe.Amp:
        v(f());
        break;
      default:
        v(e[o]);
        break;
    }
    o++;
  }
  return x(), a;
  function l(...d) {
    r.push(...d);
  }
  function u() {
    i.forEach((d) => l(_(d)));
  }
  function m() {
    i.forEach((d) => l(_({ ...d, isClosing: !0 })));
  }
  function _({ attributes: d, elementName: h, isClosing: b }) {
    return b ? `</${h}>` : `<${h}${Object.entries(d ?? {}).reduce(
      (y, [k, T]) => T === void 0 ? `${y} ${k}` : `${y} ${k}="${T}"`,
      ""
    )}>`;
  }
  function x() {
    m(), a.push(r.join("")), r = [];
  }
  function v(d) {
    if (n.column++, n.offset++, t)
      for (const h of t(n))
        h.isClosing ? S(h) : (l(_(h)), i.push(h));
    l(d);
  }
  function $() {
    o++;
    const d = e[o] === "/" ? !0 : void 0;
    d && o++;
    const h = o;
    for (; !Jt(e[o]) && e[o] !== pe.GT; )
      o++;
    const b = e.substring(h, o), y = z();
    return { elementName: b, attributes: y, isClosing: d };
  }
  function w(d) {
    i.push(d), l(_(d));
  }
  function S(d) {
    let h;
    for (h = i.length - 1; h >= 0; h--) {
      const b = i[h];
      if (d.elementName === b.elementName && b.id === d.id) {
        l(_(d)), i.splice(h, 1);
        for (let y = h; y < i.length; y++)
          l(_(i[y]));
        break;
      }
      l(_({ ...b, isClosing: !0 }));
    }
    if (h === -1)
      throw new Error(`Cannot find corresponding opening tag for ${_(d)}`);
  }
  function z() {
    const d = /* @__PURE__ */ Object.create(null);
    for (; o < e.length; ) {
      const h = e[o];
      if (h === pe.GT)
        return d;
      if (!Jt(h)) {
        const { name: b, value: y } = p();
        d[b] = y;
      }
      o++;
    }
    throw new Error(`Missing closing tag near ${e.substr(o - 10)}`);
  }
  function p() {
    const d = o;
    for (; e[o] !== "="; )
      o++;
    const h = e.substring(d, o);
    o++;
    const b = c();
    return { name: h, value: b };
  }
  function c() {
    e[o] === '"' && o++;
    const d = o;
    for (; e[o] !== '"'; )
      o++;
    return e.substring(d, o);
  }
  function f() {
    const d = o;
    for (; e[o] !== pe.Semicolon; )
      o++;
    return e.substring(d, o + 1);
  }
}
function Jt(e) {
  return e === pe.NewLine || e === pe.Space || e === pe.Tab;
}
const pe = {
  CarriageReturn: "\r",
  NewLine: `
`,
  Space: " ",
  Amp: "&",
  Semicolon: ";",
  LT: "<",
  GT: ">",
  Tab: "	"
};
function Zl(e, t) {
  let r = 0, a = t.length - 1;
  for (; e[r] === t[r] && r < t.length; )
    r++;
  const n = e.length - t.length;
  for (; e[a + n] === t[a] && a > r; )
    a--;
  a === r && (Jt(t[r - 1]) || r--), a++;
  const i = t.substring(r, a);
  return ["true", "false"].forEach((s) => {
    i === s.substr(0, s.length - 1) && s.endsWith(t[a]) && a++, i === s.substr(1, s.length) && s.startsWith(t[r - 1]) && r--;
  }), [r, a];
}
function sr(e, t) {
  return e.line > t.line || e.line === t.line && e.column >= t.column;
}
const Hl = '#report-code-block{background:var(--prism-background);border:1px solid var(--prism-border);overflow:auto visible}.line-numbers{counter-reset:mte-line-number}.line .line-number{text-align:right;color:var(--mut-line-number);counter-increment:mte-line-number;padding:0 10px 0 15px}.line .line-number:before{content:counter(mte-line-number)}.line-marker:before{content:" ";padding:0 5px}.NoCoverage{--mut-status-color:var(--color-orange-500);--mut-squiggly-line:var(--mut-squiggly-NoCoverage)}.Survived{--mut-status-color:var(--color-red-500);--mut-squiggly-line:var(--mut-squiggly-Survived)}.Pending{--mut-status-color:var(--color-neutral-400)}.Killed{--mut-status-color:var(--color-green-600)}.Timeout{--mut-status-color:var(--color-amber-400)}.CompileError,.RuntimeError,.Ignored{--mut-status-color:var(--color-neutral-400)}svg.mutant-dot{fill:var(--mut-status-color)}.mte-selected-Pending .mutant.Pending,.mte-selected-Killed .mutant.Killed,.mte-selected-Timeout .mutant.Timeout,.mte-selected-CompileError .mutant.CompileError,.mte-selected-RuntimeError .mutant.RuntimeError,.mte-selected-Ignored .mutant.Ignored{-webkit-text-decoration:solid underline var(--mut-status-color) 2px;-webkit-text-decoration:solid underline var(--mut-status-color) 2px;text-decoration:solid underline var(--mut-status-color) 2px;text-decoration-skip-ink:none;text-underline-offset:3px;cursor:pointer}.mte-selected-Survived .mutant.Survived,.mte-selected-NoCoverage .mutant.NoCoverage{border-bottom-style:solid;border-image-slice:0 0 4;border-image-width:4px;border-image-outset:6px;border-image-repeat:repeat;border-image-source:var(--mut-squiggly-line);cursor:pointer}:is(.mte-selected-Survived .mutant.Survived,.mte-selected-NoCoverage .mutant.NoCoverage) .mutant.Survived,:is(.mte-selected-Survived .mutant.Survived,.mte-selected-NoCoverage .mutant.NoCoverage) .mutant.NoCoverage{border-bottom-style:none;border-image-source:none;text-decoration-line:none}.diff-old{background-color:var(--mut-diff-del-bg)}.diff-focus{background-color:var(--mut-diff-add-bg-line-number)}.diff-old .line-number{background-color:var(--mut-diff-del-bg-line-number);color:var(--mut-diff-del-line-number)}.diff-old .line-marker:before{content:"-"}.diff-new{background-color:var(--mut-diff-add-bg)}.diff-new .empty-line-number{background-color:var(--mut-diff-add-bg-line-number);color:var(--mut-diff-add-line-number)}.diff-new .line-marker:before{content:"+"}';
function Ri(e, t) {
  return e === G && t === G ? G : g`<span class="ml-1 flex flex-row items-center">${e}${t}</span>`;
}
function ji(e, t) {
  return g`<tr class="line"
    ><td class="line-number"></td><td class="line-marker"></td><td class="code flex"><span>${lo(e)}</span>${t}</td></tr
  >`;
}
const Ni = "M 0,5 C 0,-1.66 10,-1.66 10,5 10,7.76 7.76,10 5,10 2.24,10 0,7.76 0,5 Z", Wi = "M 0,0 C 0,0 10,0 10,0 10,0 5,10 5,10 5,10 0,0 0,0 Z", Gl = "0.4 0 0.2 1", qi = (e, t, r) => B`<path stroke-opacity="${r}" class="stroke-gray-800 transition-stroke-opacity" d="${t}">
    <animate values="${e};${t}" attributeName="d" dur="0.2s" begin="indefinite" calcMode="spline" keySplines="${Gl}" />
  </path>`, Ui = qi(Ni, Wi, 1), Ki = qi(Wi, Ni, 0);
function Vi(e, t, r) {
  e?.querySelector(`[${t}="${encodeURIComponent(r)}"] path animate`)?.beginElement();
}
var Zi = Object.defineProperty, Yl = Object.getOwnPropertyDescriptor, Hi = (e) => {
  throw TypeError(e);
}, Jl = (e, t, r) => t in e ? Zi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Ne = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? Yl(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Zi(t, r, n), n;
}, Ql = (e, t, r) => Jl(e, t + "", r), Ia = (e, t, r) => t.has(e) || Hi("Cannot " + r), We = (e, t, r) => (Ia(e, t, "read from private field"), t.get(e)), qe = (e, t, r) => t.has(e) ? Hi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Xl = (e, t, r, a) => (Ia(e, t, "write to private field"), t.set(e, r), r), Z = (e, t, r) => (Ia(e, t, "access private method"), r), Mt, Br, Rr, jr, Nr, Wr, W, qr, Ke, Gi, Ur, Yi, Ji, Kr;
const Vr = "diff-old", Qi = "diff-new";
let me = class extends Ce {
  constructor() {
    super(), qe(this, W), qe(this, Mt), qe(this, Br, (e) => {
      e.key === "Escape" && this.selectedMutant && Z(this, W, Ke).call(this, this.selectedMutant);
    }), qe(this, Rr, (e) => {
      this.selectedMutantStates = e.detail.concat(["Pending"]);
    }), qe(this, jr, (e) => {
      if (e.stopPropagation(), e.target instanceof Element) {
        let t = e.target;
        const r = [];
        for (; t instanceof Element; t = t.parentElement) {
          const n = t.getAttribute("data-mutant-id"), i = this.mutants.find(({ id: s }) => s.toString() === n);
          i && r.push(i);
        }
        const a = (this.selectedMutant ? r.indexOf(this.selectedMutant) : -1) + 1;
        r[a] ? (Z(this, W, Ke).call(this, r[a]), Mn()) : this.selectedMutant && (Z(this, W, Ke).call(this, this.selectedMutant), Mn());
      }
    }), qe(this, Nr, () => {
      const e = this.selectedMutant ? (this.mutants.indexOf(this.selectedMutant) + 1) % this.mutants.length : 0;
      this.mutants[e] && Z(this, W, Ke).call(this, this.mutants[e]);
    }), qe(this, Wr, () => {
      const e = this.selectedMutant ? (this.mutants.indexOf(this.selectedMutant) + this.mutants.length - 1) % this.mutants.length : this.mutants.length - 1;
      this.mutants[e] && Z(this, W, Ke).call(this, this.mutants[e]);
    }), this.filters = [], this.selectedMutantStates = [], this.lines = [], this.mutants = [], Xl(this, Mt, new AbortController());
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", We(this, Br), { signal: We(this, Mt).signal });
  }
  disconnectedCallback() {
    We(this, Mt).abort(), super.disconnectedCallback();
  }
  render() {
    const e = Map.groupBy(this.mutants, (r) => r.location.start.line), t = Z(this, W, qr).call(this, Array.from(e.entries()).filter(([r]) => r > this.lines.length).flatMap(([, r]) => r));
    return g`<mte-state-filter
        allow-toggle-all
        .filters=${this.filters}
        @filters-changed=${We(this, Rr)}
        @next=${We(this, Nr)}
        @previous=${We(this, Wr)}
      ></mte-state-filter>
      <pre
        @click=${We(this, jr)}
        id="report-code-block"
        class="line-numbers ${this.selectedMutantStates.map((r) => `mte-selected-${r}`).join(" ")} flex rounded-md py-4"
      >
        <code class="flex language-${this.model.language}">
          <table>${ht(this.lines, (r, a) => {
      const n = a + 1, i = Z(this, W, qr).call(this, e.get(n));
      return ji(r, Ri(i, this.lines.length === n ? t : G));
    })}</table>
          </code>
          </pre>`;
  }
  reactivate() {
    super.reactivate(), Z(this, W, Ur).call(this);
  }
  update(e) {
    e.has("model") && this.model && Z(this, W, Ur).call(this), (e.has("model") && this.model || e.has("selectedMutantStates")) && (this.mutants = this.model.mutants.filter((t) => this.selectedMutantStates.includes(t.status)).sort((t, r) => sr(t.location.start, r.location.start) ? 1 : -1), this.selectedMutant && !this.mutants.includes(this.selectedMutant) && e.has("selectedMutantStates") && // This extra check is to allow mutants that have been opened before, to stay open when a realtime update comes through
    Z(this, W, Yi).call(this, e.get("selectedMutantStates") ?? []) && Z(this, W, Ke).call(this, this.selectedMutant)), super.update(e);
  }
};
Mt = /* @__PURE__ */ new WeakMap();
Br = /* @__PURE__ */ new WeakMap();
Rr = /* @__PURE__ */ new WeakMap();
jr = /* @__PURE__ */ new WeakMap();
Nr = /* @__PURE__ */ new WeakMap();
Wr = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakSet();
qr = function(e) {
  return P(
    e?.length,
    () => de(
      e,
      (t) => t.id,
      (t) => B`<svg
              data-mutant-id="${t.id}"
              class="mutant-dot ${this.selectedMutant?.id === t.id ? "selected" : ""} ${t.status} mx-0.5 cursor-pointer"
              height="11"
              width="11"
            >
              <title>${Xi(t)}</title>
              ${this.selectedMutant?.id === t.id ? Ui : Ki}
            </svg>`
    ),
    () => G
  );
};
Ke = function(e) {
  if (Z(this, W, Gi).call(this), Z(this, W, Kr).call(this, e), this.selectedMutant === e) {
    this.selectedMutant = void 0, this.dispatchEvent(ge("mutant-selected", { selected: !1, mutant: e }));
    return;
  } else this.selectedMutant && Z(this, W, Kr).call(this, this.selectedMutant);
  this.selectedMutant = e;
  const t = this.code.querySelectorAll("tr.line");
  for (let n = e.location.start.line - 1; n < e.location.end.line; n++)
    t.item(n).classList.add(Vr);
  const r = Z(this, W, Ji).call(this, e), a = t.item(e.location.end.line - 1);
  a.insertAdjacentHTML("afterend", r), Ci(a), this.dispatchEvent(ge("mutant-selected", { selected: !0, mutant: e }));
};
Gi = function() {
  const e = this.code;
  e.querySelectorAll(`.${Vr}`).forEach((a) => a.classList.remove(Vr)), e.querySelectorAll(`.${Qi}`).forEach((a) => a.remove());
};
Ur = function() {
  this.filters = ["Killed", "Survived", "NoCoverage", "Ignored", "Timeout", "CompileError", "RuntimeError"].filter((a) => this.model.mutants.some((n) => n.status === a)).map((a) => ({
    enabled: [...this.selectedMutantStates, "Survived", "NoCoverage", "Timeout"].includes(a),
    count: this.model.mutants.filter((n) => n.status === a).length,
    status: a,
    label: g`${_i(a)} ${a}`,
    context: Bl(a)
  }));
  const e = Fa(this.model.source, this.model.name), t = /* @__PURE__ */ new Set(), r = new Set(this.model.mutants);
  this.lines = Oa(e, function* (a) {
    for (const n of t)
      sr(a, n.location.end) && (t.delete(n), yield { elementName: "span", id: n.id, isClosing: !0 });
    for (const n of r)
      sr(a, n.location.start) && (t.add(n), r.delete(n), yield {
        elementName: "span",
        id: n.id,
        attributes: {
          class: Mr(`mutant border-none ${n.status}`),
          title: Mr(Xi(n)),
          "data-mutant-id": Mr(n.id.toString())
        }
      });
  });
};
Yi = function(e) {
  return e.length !== this.selectedMutantStates.length ? !0 : !e.every((t, r) => this.selectedMutantStates[r] === t);
};
Ji = function(e) {
  const t = e.getMutatedLines().trimEnd(), r = e.getOriginalLines().trimEnd(), [a, n] = Zl(r, t), i = Oa(Fa(t, this.model.name), function* ({ offset: l }) {
    l === a ? yield { elementName: "span", id: "diff-focus", attributes: { class: "diff-focus" } } : l === n && (yield { elementName: "span", id: "diff-focus", isClosing: !0 });
  }), s = `<tr class="${Qi}"><td class="empty-line-number"></td><td class="line-marker"></td><td class="code">`, o = "</td></tr>";
  return i.map((l) => `${s}${l}${o}`).join("");
};
Kr = function(e) {
  Vi(this.code, "data-mutant-id", e.id);
};
Ql(me, "styles", [vi, _e, De(Hl)]);
Ne([
  re()
], me.prototype, "filters", 2);
Ne([
  C({ attribute: !1 })
], me.prototype, "model", 2);
Ne([
  re()
], me.prototype, "selectedMutantStates", 2);
Ne([
  re()
], me.prototype, "selectedMutant", 2);
Ne([
  re()
], me.prototype, "lines", 2);
Ne([
  re()
], me.prototype, "mutants", 2);
Ne([
  wt("code")
], me.prototype, "code", 2);
me = Ne([
  V("mte-file")
], me);
function Xi(e) {
  return `${e.mutatorName} ${e.status}`;
}
function Mn() {
  window.getSelection()?.removeAllRanges();
}
const ec = (e, t, r) => {
  if (!e) return r?.all ? nc(t, r) : Yr;
  var a = ac(e), n = a.bitflags, i = a.containsSpace, s = lr(r?.threshold || 0), o = r?.limit || La, l = 0, u = 0, m = t.length;
  function _(T) {
    l < o ? (Ht.add(T), ++l) : (++u, T._score > Ht.peek()._score && Ht.replaceTop(T));
  }
  if (r?.key)
    for (var x = r.key, v = 0; v < m; ++v) {
      var $ = t[v], w = cr($, x);
      if (w && (ut(w) || (w = ct(w)), (n & w._bitflags) === n)) {
        var S = Pt(a, w);
        S !== K && (S._score < s || (S.obj = $, _(S)));
      }
    }
  else if (r?.keys) {
    var z = r.keys, p = z.length;
    e: for (var v = 0; v < m; ++v) {
      for (var $ = t[v], c = 0, f = 0; f < p; ++f) {
        var x = z[f], w = cr($, x);
        if (!w) {
          Ar[f] = At;
          continue;
        }
        ut(w) || (w = ct(w)), Ar[f] = w, c |= w._bitflags;
      }
      if ((n & c) === n) {
        if (i) for (let M = 0; M < a.spaceSearches.length; M++) ye[M] = ie;
        for (var f = 0; f < p; ++f) {
          if (w = Ar[f], w === At) {
            nt[f] = At;
            continue;
          }
          if (nt[f] = Pt(a, w, !1, i), nt[f] === K) {
            nt[f] = At;
            continue;
          }
          if (i) for (let A = 0; A < a.spaceSearches.length; A++) {
            if (Ze[A] > -1e3 && ye[A] > ie) {
              var d = (ye[A] + Ze[A]) / 4;
              d > ye[A] && (ye[A] = d);
            }
            Ze[A] > ye[A] && (ye[A] = Ze[A]);
          }
        }
        if (i) {
          for (let M = 0; M < a.spaceSearches.length; M++) if (ye[M] === ie) continue e;
        } else {
          var h = !1;
          for (let M = 0; M < p; M++) if (nt[M]._score !== ie) {
            h = !0;
            break;
          }
          if (!h) continue;
        }
        var b = new ts(p);
        for (let M = 0; M < p; M++) b[M] = nt[M];
        if (i) {
          var y = 0;
          for (let M = 0; M < a.spaceSearches.length; M++) y += ye[M];
        } else {
          var y = ie;
          for (let A = 0; A < p; A++) {
            var S = b[A];
            if (S._score > -1e3 && y > ie) {
              var d = (y + S._score) / 4;
              d > y && (y = d);
            }
            S._score > y && (y = S._score);
          }
        }
        if (b.obj = $, b._score = y, r?.scoreFn) {
          if (y = r.scoreFn(b), !y) continue;
          y = lr(y), b._score = y;
        }
        y < s || _(b);
      }
    }
  } else for (var v = 0; v < m; ++v) {
    var w = t[v];
    if (w && (ut(w) || (w = ct(w)), (n & w._bitflags) === n)) {
      var S = Pt(a, w);
      S !== K && (S._score < s || _(S));
    }
  }
  if (l === 0) return Yr;
  for (var k = new Array(l), v = l - 1; v >= 0; --v) k[v] = Ht.poll();
  return k.total = l + u, k;
}, tc = (e, t = "<b>", r = "</b>") => {
  for (var a = typeof t == "function" ? t : void 0, n = e.target, i = n.length, s = e.indexes, o = "", l = 0, u = 0, m = !1, _ = [], x = 0; x < i; ++x) {
    var v = n[x];
    if (s[u] === x) {
      if (++u, m || (m = !0, a ? (_.push(o), o = "") : o += t), u === s.length) {
        a ? (o += v, _.push(a(o, l++)), o = "", _.push(n.substr(x + 1))) : o += v + r + n.substr(x + 1);
        break;
      }
    } else m && (m = !1, a ? (_.push(a(o, l++)), o = "") : o += r);
    o += v;
  }
  return a ? _ : o;
}, or = (e) => {
  typeof e == "number" ? e = "" + e : typeof e != "string" && (e = "");
  var t = Zr(e);
  return rs(e, {
    _targetLower: t._lower,
    _targetLowerCodes: t.lowerCodes,
    _bitflags: t.bitflags
  });
}, rc = () => {
  Hr.clear(), Gr.clear();
};
var es = class {
  get indexes() {
    return this._indexes.slice(0, this._indexes.len).sort((e, t) => e - t);
  }
  set indexes(e) {
    return this._indexes = e;
  }
  highlight(e, t) {
    return tc(this, e, t);
  }
  get score() {
    return as(this._score);
  }
  set score(e) {
    this._score = lr(e);
  }
}, ts = class extends Array {
  get score() {
    return as(this._score);
  }
  set score(e) {
    this._score = lr(e);
  }
};
const rs = (e, t) => {
  const r = new es();
  return r.target = e, r.obj = t.obj ?? K, r._score = t._score ?? ie, r._indexes = t._indexes ?? [], r._targetLower = t._targetLower ?? "", r._targetLowerCodes = t._targetLowerCodes ?? K, r._nextBeginningIndexes = t._nextBeginningIndexes ?? K, r._bitflags = t._bitflags ?? 0, r;
}, as = (e) => e === ie ? 0 : e > 1 ? e : Math.E ** (((-e + 1) ** 0.04307 - 1) * -2), lr = (e) => e === 0 ? ie : e > 1 ? e : 1 - Math.pow(Math.log(e) / -2 + 1, 1 / 0.04307), An = (e) => {
  typeof e == "number" ? e = "" + e : typeof e != "string" && (e = ""), e = e.trim();
  var t = Zr(e), r = [];
  if (t.containsSpace) {
    var a = e.split(/\s+/);
    a = [...new Set(a)];
    for (var n = 0; n < a.length; n++)
      if (a[n] !== "") {
        var i = Zr(a[n]);
        r.push({
          lowerCodes: i.lowerCodes,
          _lower: a[n].toLowerCase(),
          containsSpace: !1
        });
      }
  }
  return {
    lowerCodes: t.lowerCodes,
    _lower: t._lower,
    containsSpace: t.containsSpace,
    bitflags: t.bitflags,
    spaceSearches: r
  };
}, ct = (e) => {
  if (e.length > 999) return or(e);
  var t = Hr.get(e);
  return t !== void 0 || (t = or(e), Hr.set(e, t)), t;
}, ac = (e) => {
  if (e.length > 999) return An(e);
  var t = Gr.get(e);
  return t !== void 0 || (t = An(e), Gr.set(e, t)), t;
}, nc = (e, t) => {
  var r = [];
  r.total = e.length;
  var a = t?.limit || La;
  if (t?.key) for (var n = 0; n < e.length; n++) {
    var i = e[n], s = cr(i, t.key);
    if (s != K) {
      ut(s) || (s = ct(s));
      var o = rs(s.target, {
        _score: s._score,
        obj: i
      });
      if (r.push(o), r.length >= a) return r;
    }
  }
  else if (t?.keys) for (var n = 0; n < e.length; n++) {
    for (var i = e[n], l = new ts(t.keys.length), u = t.keys.length - 1; u >= 0; --u) {
      var s = cr(i, t.keys[u]);
      if (!s) {
        l[u] = At;
        continue;
      }
      ut(s) || (s = ct(s)), s._score = ie, s._indexes.len = 0, l[u] = s;
    }
    if (l.obj = i, l._score = ie, r.push(l), r.length >= a) return r;
  }
  else for (var n = 0; n < e.length; n++) {
    var s = e[n];
    if (s != K && (ut(s) || (s = ct(s)), s._score = ie, s._indexes.len = 0, r.push(s), r.length >= a))
      return r;
  }
  return r;
}, Pt = (e, t, r = !1, a = !1) => {
  if (r === !1 && e.containsSpace) return ic(e, t, a);
  for (var n = e._lower, i = e.lowerCodes, s = i[0], o = t._targetLowerCodes, l = i.length, u = o.length, v = 0, m = 0, _ = 0; ; ) {
    var x = s === o[m];
    if (x) {
      if (we[_++] = m, ++v, v === l) break;
      s = i[v];
    }
    if (++m, m >= u) return K;
  }
  var v = 0, $ = !1, w = 0, S = t._nextBeginningIndexes;
  S === K && (S = t._nextBeginningIndexes = oc(t.target)), m = we[0] === 0 ? 0 : S[we[0] - 1];
  var z = 0;
  if (m !== u) for (; ; ) if (m >= u) {
    if (v <= 0 || (++z, z > 200)) break;
    --v;
    var p = Vt[--w];
    m = S[p];
  } else {
    var x = i[v] === o[m];
    if (x) {
      if (Vt[w++] = m, ++v, v === l) {
        $ = !0;
        break;
      }
      ++m;
    } else m = S[m];
  }
  var c = l <= 1 ? -1 : t._targetLower.indexOf(n, we[0]), f = !!~c, d = f ? c === 0 || t._nextBeginningIndexes[c - 1] === c : !1;
  if (f && !d) {
    for (var h = 0; h < S.length; h = S[h])
      if (!(h <= c)) {
        for (var b = 0; b < l && i[b] === t._targetLowerCodes[h + b]; b++) ;
        if (b === l) {
          c = h, d = !0;
          break;
        }
      }
  }
  var y = (M) => {
    for (var A = 0, Me = 0, J = 1; J < l; ++J) M[J] - M[J - 1] !== 1 && (A -= M[J], ++Me);
    var at = M[l - 1] - M[0] - (l - 1);
    if (A -= (12 + at) * Me, M[0] !== 0 && (A -= M[0] * M[0] * 0.2), !$) A *= 1e3;
    else {
      for (var ve = 1, J = S[0]; J < u; J = S[J]) ++ve;
      ve > 24 && (A *= (ve - 24) * 10);
    }
    return A -= (u - l) / 2, f && (A /= 1 + l * l * 1), d && (A /= 1 + l * l * 1), A -= (u - l) / 2, A;
  };
  if ($)
    if (d) {
      for (var h = 0; h < l; ++h) we[h] = c + h;
      var k = we, T = y(we);
    } else
      var k = Vt, T = y(Vt);
  else {
    if (f) for (var h = 0; h < l; ++h) we[h] = c + h;
    var k = we, T = y(k);
  }
  t._score = T;
  for (var h = 0; h < l; ++h) t._indexes[h] = k[h];
  t._indexes.len = l;
  const I = new es();
  return I.target = t.target, I._score = t._score, I._indexes = t._indexes, I;
}, ic = (e, t, r) => {
  for (var a = /* @__PURE__ */ new Set(), n = 0, i = K, s = 0, o = e.spaceSearches, l = o.length, u = 0, m = () => {
    for (let f = u - 1; f >= 0; f--) t._nextBeginningIndexes[Zt[f * 2 + 0]] = Zt[f * 2 + 1];
  }, _ = !1, c = 0; c < l; ++c) {
    Ze[c] = ie;
    var x = o[c];
    if (i = Pt(x, t), r) {
      if (i === K) continue;
      _ = !0;
    } else if (i === K)
      return m(), K;
    if (c !== l - 1) {
      var v = i._indexes, $ = !0;
      for (let d = 0; d < v.len - 1; d++) if (v[d + 1] - v[d] !== 1) {
        $ = !1;
        break;
      }
      if ($) {
        var w = v[v.len - 1] + 1, S = t._nextBeginningIndexes[w - 1];
        for (let d = w - 1; d >= 0 && S === t._nextBeginningIndexes[d]; d--)
          t._nextBeginningIndexes[d] = w, Zt[u * 2 + 0] = d, Zt[u * 2 + 1] = S, u++;
      }
    }
    n += i._score / l, Ze[c] = i._score / l, i._indexes[0] < s && (n -= (s - i._indexes[0]) * 2), s = i._indexes[0];
    for (var z = 0; z < i._indexes.len; ++z) a.add(i._indexes[z]);
  }
  if (r && !_) return K;
  m();
  var p = Pt(e, t, !0);
  if (p !== K && p._score > n) {
    if (r) for (var c = 0; c < l; ++c) Ze[c] = p._score / l;
    return p;
  }
  r && (i = t), i._score = n;
  var c = 0;
  for (let f of a) i._indexes[c++] = f;
  return i._indexes.len = c, i;
}, ns = (e) => e.replace(new RegExp("\\p{Script=Latin}+", "gu"), (t) => t.normalize("NFD")).replace(/[\u0300-\u036f]/g, ""), Zr = (e) => {
  e = ns(e);
  for (var t = e.length, r = e.toLowerCase(), a = [], n = 0, i = !1, s = 0; s < t; ++s) {
    var o = a[s] = r.charCodeAt(s);
    if (o === 32) {
      i = !0;
      continue;
    }
    var l = o >= 97 && o <= 122 ? o - 97 : o >= 48 && o <= 57 ? 26 : o <= 127 ? 30 : 31;
    n |= 1 << l;
  }
  return {
    lowerCodes: a,
    bitflags: n,
    containsSpace: i,
    _lower: r
  };
}, sc = (e) => {
  for (var t = e.length, r = [], a = 0, n = !1, i = !1, s = 0; s < t; ++s) {
    var o = e.charCodeAt(s), l = o >= 65 && o <= 90, u = l || o >= 97 && o <= 122 || o >= 48 && o <= 57, m = l && !n || !i || !u;
    n = l, i = u, m && (r[a++] = s);
  }
  return r;
}, oc = (e) => {
  e = ns(e);
  for (var t = e.length, r = sc(e), a = [], n = r[0], i = 0, s = 0; s < t; ++s) n > s ? a[s] = n : (n = r[++i], a[s] = n === void 0 ? t : n);
  return a;
}, Hr = /* @__PURE__ */ new Map(), Gr = /* @__PURE__ */ new Map();
var we = [], Vt = [], Zt = [], ye = [], Ze = [], Ar = [], nt = [];
const cr = (e, t) => {
  var r = e[t];
  if (r !== void 0) return r;
  if (typeof t == "function") return t(e);
  var a = t;
  Array.isArray(t) || (a = t.split("."));
  for (var n = a.length, i = -1; e && ++i < n; ) e = e[a[i]];
  return e;
}, ut = (e) => typeof e == "object" && typeof e._bitflags == "number", La = 1 / 0, ie = -La, Yr = [];
Yr.total = 0;
const K = null, At = or(""), lc = (e) => {
  var t = [], r = 0, a = {}, n = (i) => {
    for (var s = 0, o = t[s], l = 1; l < r; ) {
      var u = l + 1;
      s = l, u < r && t[u]._score < t[l]._score && (s = u), t[s - 1 >> 1] = t[s], l = 1 + (s << 1);
    }
    for (var m = s - 1 >> 1; s > 0 && o._score < t[m]._score; m = (s = m) - 1 >> 1) t[s] = t[m];
    t[s] = o;
  };
  return a.add = ((i) => {
    var s = r;
    t[r++] = i;
    for (var o = s - 1 >> 1; s > 0 && i._score < t[o]._score; o = (s = o) - 1 >> 1) t[s] = t[o];
    t[s] = i;
  }), a.poll = ((i) => {
    if (r !== 0) {
      var s = t[0];
      return t[0] = t[--r], n(), s;
    }
  }), a.peek = ((i) => {
    if (r !== 0) return t[0];
  }), a.replaceTop = ((i) => {
    t[0] = i, n();
  }), a;
}, Ht = lc(), cc = B`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-label="directory" class="octicon octicon-file-directory"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1z"/></svg>`, uc = B`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-label="file" class="octicon octicon-file"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914z"/></svg>`, is = B`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><path d="M10.25 2a8.25 8.25 0 0 1 6.34 13.53l5.69 5.69a.749.749 0 0 1-.326 1.275.75.75 0 0 1-.734-.215l-5.69-5.69A8.25 8.25 0 1 1 10.25 2M3.5 10.25a6.75 6.75 0 1 0 13.5 0 6.75 6.75 0 0 0-13.5 0"/></svg>`, dc = B`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 15h-9a.75.75 0 0 1 0-1.5h9a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 10 4.25V1.5H5.75a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0Zm1.72 4.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.749.749 0 0 1-1.275-.326.75.75 0 0 1 .215-.734l1.47-1.47-1.47-1.47a.75.75 0 0 1 0-1.06M3.28 7.78 1.81 9.25l1.47 1.47a.75.75 0 0 1-.018 1.042.75.75 0 0 1-1.042.018l-2-2a.75.75 0 0 1 0-1.06l2-2a.75.75 0 0 1 1.042.018.75.75 0 0 1 .018 1.042m8.22-6.218V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914z"/></svg>`, hc = B`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M10.336 0c.464 0 .91.184 1.237.513l2.914 2.914c.33.328.513.773.513 1.237v3.587c0 .199-.079.39-.22.53a.747.747 0 0 1-1.06 0 .75.75 0 0 1-.22-.53V6h-2.75c-.464 0-.909-.184-1.237-.513A1.75 1.75 0 0 1 9 4.25V1.5H3.75a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H7c.199 0 .39.079.53.22a.747.747 0 0 1 0 1.06A.75.75 0 0 1 7 16H3.75c-.464 0-.909-.184-1.237-.513A1.75 1.75 0 0 1 2 14.25V1.75C2 .784 2.784 0 3.75 0Zm.164 4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"/><path d="M15.259 10a.75.75 0 0 1 .686.472.75.75 0 0 1-.171.815l-4.557 4.45a.75.75 0 0 1-1.055-.01L8.22 13.778a.754.754 0 0 1 .04-1.02.75.75 0 0 1 1.02-.038l1.42 1.425 4.025-3.932a.75.75 0 0 1 .534-.213"/></svg>`, ss = (e) => B`<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" aria-hidden="true" class="${e} h-4 w-4" viewBox="0 0 16 16"><path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.042-.018.75.75 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06"/></svg>`, pc = ss("rotate-180"), fc = ss();
var os = Object.defineProperty, gc = Object.getOwnPropertyDescriptor, ls = (e) => {
  throw TypeError(e);
}, mc = (e, t, r) => t in e ? os(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, tt = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? gc(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && os(t, r, n), n;
}, Tn = (e, t, r) => mc(e, typeof t != "symbol" ? t + "" : t, r), Da = (e, t, r) => t.has(e) || ls("Cannot " + r), fe = (e, t, r) => (Da(e, t, "read from private field"), t.get(e)), Te = (e, t, r) => t.has(e) ? ls("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), cs = (e, t, r, a) => (Da(e, t, "write to private field"), t.set(e, r), r), le = (e, t, r) => (Da(e, t, "access private method"), r), Qt, gt, Xt, ee, us, ds, hs, Jr, ps, fs, gs, ms, Qr, Xr, ea, er, Ba;
let Le = class extends je {
  constructor() {
    super(), Te(this, ee), Te(this, Qt, new AbortController()), Te(this, gt, []), Te(this, Xt, ""), Tn(this, "open", () => {
      this.dialog.showModal();
    }), Tn(this, "close", () => {
      this.dialog.close();
    }), Te(this, Jr, (e) => {
      ((e.ctrlKey || e.metaKey) && e.key === "k" || !this.isOpen && e.key === "/") && fe(this, Qr).call(this, e), this.isOpen && (e.key === "ArrowUp" ? le(this, ee, gs).call(this) : e.key === "ArrowDown" && le(this, ee, fs).call(this), e.key === "Enter" && le(this, ee, ms).call(this));
    }), Te(this, Qr, (e = null) => {
      e?.preventDefault(), e?.stopPropagation(), this.isOpen ? this.close() : this.open();
    }), Te(this, Xr, (e) => {
      e.newState === "closed" ? (le(this, ee, er).call(this, ""), this.filePickerInput.value = "", document.body.style.overflow = fe(this, Xt)) : e.newState === "open" ? document.body.style.overflow = "hidden" : console.warn("Unknown toggle state in file-picker:", e.newState);
    }), Te(this, ea, (e) => {
      this.isOpen && le(this, ee, er).call(this, e.target.value);
    }), this.fileIndex = 0, this.filteredFiles = [];
  }
  get isOpen() {
    return this.dialog.open;
  }
  connectedCallback() {
    super.connectedCallback(), cs(this, Xt, document.body.style.overflow), window.addEventListener("keydown", fe(this, Jr), { signal: fe(this, Qt).signal });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), rc(), fe(this, Qt).abort();
  }
  willUpdate(e) {
    e.has("rootModel") && (le(this, ee, hs).call(this), le(this, ee, er).call(this, ""));
  }
  updated(e) {
    (e.has("fileIndex") || e.has("filteredFiles")) && le(this, ee, ps).call(this);
  }
  render() {
    return g`<dialog
      @click=${this.close}
      @toggle=${fe(this, Xr)}
      aria-labelledby="file-picker-label"
      class="mx-auto my-4 max-w-160 bg-transparent backdrop:bg-gray-950/50 backdrop:backdrop-blur-lg md:w-1/2"
    >
      <div @click=${(e) => e.stopPropagation()} class="flex h-fit max-h-132 flex-col rounded-lg bg-gray-200/60 p-4 backdrop-blur-lg">
        <div class="mb-3 flex items-center rounded-sm bg-gray-200/60 p-2 text-gray-800 shadow-lg">
          <div class="mx-2 flex items-center">${is}</div>
          <label id="file-picker-label" for="file-picker-input" class="sr-only">Search for a file</label>
          <input
            autocomplete="off"
            id="file-picker-input"
            @input=${fe(this, ea)}
            type="search"
            style="box-shadow: none"
            class="mr-2 w-full border-0 border-transparent bg-transparent focus:shadow-none"
            placeholder="Search for a file (Ctrl-K)"
            aria-controls="files"
          />
        </div>
        ${le(this, ee, us).call(this)}
      </div>
    </dialog>`;
  }
};
Qt = /* @__PURE__ */ new WeakMap();
gt = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
ee = /* @__PURE__ */ new WeakSet();
us = function() {
  return g`<ul id="files" tabindex="-1" class="flex snap-y flex-col gap-2 overflow-auto" role="listbox" aria-labelledby="file-picker-label">
      ${this.filteredFiles.length === 0 ? g`<li class="text-gray-800">No files found</li>` : de(
    this.filteredFiles,
    (e) => e.name,
    ({ name: e, file: t, template: r }, a) => {
      const n = le(this, ee, Ba).call(this, t);
      return g`<li
                class="group snap-start rounded-sm bg-gray-200 text-gray-900 transition-shadow aria-selected:bg-primary-500 aria-selected:text-gray-50 aria-selected:shadow-lg"
                role="option"
                aria-selected=${a === this.fileIndex}
              >
                <a
                  tabindex=${a === this.fileIndex ? 0 : -1}
                  @click=${this.close}
                  class="flex h-full flex-wrap items-center p-2 outline-hidden"
                  @mousemove=${() => this.fileIndex = a}
                  href=${kt(n, e)}
                >
                  <span class="inline-flex" title="File with ${n}s">${le(this, ee, ds).call(this, n)}</span>
                  <span class="ms-1">${t.result?.name}</span>
                  <span class="mx-2">•</span>
                  <span class="text-gray-400 group-aria-selected:text-gray-200">${r ?? e}</span>
                </a>
              </li>`;
    }
  )}
    </ul>`;
};
ds = function(e) {
  return e === ce.mutant ? dc : hc;
};
hs = function() {
  if (!this.rootModel)
    return;
  cs(this, gt, []);
  const e = (t, r = null, a) => {
    if (t) {
      if (t.file && t.name !== a) {
        const n = r ? `${r}/${t.name}` : t.name;
        fe(this, gt).push({ name: n, file: t.file, prepared: or(n) });
      }
      t.childResults.forEach((n) => {
        r !== a && r && t.name ? e(n, `${r}/${t.name}`, a) : (r === a || !r) && t.name !== a ? e(n, t.name, a) : e(n, null, a);
      });
    }
  };
  e(this.rootModel.systemUnderTestMetrics, null, "All files"), e(this.rootModel.testMetrics, null, "All tests");
};
Jr = /* @__PURE__ */ new WeakMap();
ps = function() {
  this.activeLink?.scrollIntoView({ block: "nearest" });
};
fs = function() {
  if (this.fileIndex === this.filteredFiles.length - 1) {
    this.fileIndex = 0;
    return;
  }
  this.fileIndex = Math.min(this.filteredFiles.length - 1, this.fileIndex + 1);
};
gs = function() {
  if (this.fileIndex === 0) {
    this.fileIndex = this.filteredFiles.length - 1;
    return;
  }
  this.fileIndex = Math.max(0, this.fileIndex - 1);
};
ms = function() {
  if (this.filteredFiles.length === 0)
    return;
  const e = this.filteredFiles[this.fileIndex];
  window.location.href = kt(le(this, ee, Ba).call(this, e.file), e.name), this.close();
};
Qr = /* @__PURE__ */ new WeakMap();
Xr = /* @__PURE__ */ new WeakMap();
ea = /* @__PURE__ */ new WeakMap();
er = function(e) {
  e ? this.filteredFiles = ec(e, fe(this, gt), { key: "prepared", threshold: 0.3, limit: 500 }).map((t) => ({
    file: t.obj.file,
    name: t.obj.name,
    template: t.highlight(
      (r) => g`<mark class="bg-inherit text-primary-500 group-aria-selected:text-primary-50 group-aria-selected:underline">${r}</mark>`
    )
  })) : this.filteredFiles = fe(this, gt), this.fileIndex = 0;
};
Ba = function(e) {
  return e instanceof Un ? ce.test : ce.mutant;
};
tt([
  C({ attribute: !1 })
], Le.prototype, "rootModel", 2);
tt([
  re()
], Le.prototype, "filteredFiles", 2);
tt([
  re()
], Le.prototype, "fileIndex", 2);
tt([
  wt("dialog", !0)
], Le.prototype, "dialog", 2);
tt([
  wt("#file-picker-input", !0)
], Le.prototype, "filePickerInput", 2);
tt([
  wt('[aria-selected="true"] a')
], Le.prototype, "activeLink", 2);
Le = tt([
  V("mte-file-picker")
], Le);
var vc = Object.defineProperty, bc = Object.getOwnPropertyDescriptor, vs = (e) => {
  throw TypeError(e);
}, Ra = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? bc(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && vc(t, r, n), n;
}, wc = (e, t, r) => t.has(e) || vs("Cannot " + r), yc = (e, t, r) => t.has(e) ? vs("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), He = (e, t, r) => (wc(e, t, "access private method"), r), xe, bs, ja, Na, ws, ys;
let ur = class extends je {
  constructor() {
    super(...arguments), yc(this, xe);
  }
  get rootName() {
    switch (this.view) {
      case ce.mutant:
        return "All files";
      case ce.test:
        return "All tests";
    }
  }
  render() {
    return g`<nav class="my-4 flex rounded-md bg-primary-100 p-3 text-gray-700" aria-label="Breadcrumb">
      <ol class="inline-flex items-center">
        ${this.path && this.path.length > 0 ? He(this, xe, Na).call(this, this.rootName, []) : He(this, xe, ja).call(this, this.rootName)}
        ${He(this, xe, bs).call(this)}
      </ol>
      ${He(this, xe, ws).call(this)}
    </nav>`;
  }
};
xe = /* @__PURE__ */ new WeakSet();
bs = function() {
  if (this.path) {
    const e = this.path;
    return de(
      e,
      (t) => t,
      (t, r) => r === e.length - 1 ? He(this, xe, ja).call(this, t) : He(this, xe, Na).call(this, t, e.slice(0, r + 1))
    );
  }
};
ja = function(e) {
  return g`<li aria-current="page">
      <span class="ml-1 text-sm font-medium text-gray-800 md:ml-2">${e}</span>
    </li>`;
};
Na = function(e, t) {
  return g`<li class="after:text-gray-800 after:content-['/'] md:after:pl-1">
      <a
        href=${kt(this.view, ...t)}
        class="ml-1 text-sm font-medium text-primary-800 underline hover:text-gray-900 hover:underline md:ml-2"
        >${e}</a
      >
    </li>`;
};
ws = function() {
  return g`<button @click=${() => He(this, xe, ys).call(this)} class="ml-auto cursor-pointer" title="Open file picker (Ctrl-K)"
      >${is}</button
    >`;
};
ys = function() {
  this.blur(), this.renderRoot.querySelector("button")?.blur(), this.dispatchEvent(ge("mte-file-picker-open", void 0));
};
Ra([
  C({ type: Array, attribute: !1 })
], ur.prototype, "path", 2);
Ra([
  C()
], ur.prototype, "view", 2);
ur = Ra([
  V("mte-breadcrumb")
], ur);
var kc = Object.defineProperty, xc = Object.getOwnPropertyDescriptor, ks = (e) => {
  throw TypeError(e);
}, xs = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? xc(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && kc(t, r, n), n;
}, _s = (e, t, r) => t.has(e) || ks("Cannot " + r), En = (e, t, r) => (_s(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Tr = (e, t, r) => t.has(e) ? ks("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), st = (e, t, r) => (_s(e, t, "access private method"), r), Pe, $s, Wa, ta, ra, aa, Ss;
let na = class extends Ce {
  constructor() {
    super(...arguments), Tr(this, Pe), Tr(this, ta, (e) => {
      e.stopPropagation(), this.dispatchEvent(ge("next", void 0, { bubbles: !0, composed: !0 }));
    }), Tr(this, ra, (e) => {
      e.stopPropagation(), this.dispatchEvent(ge("previous", void 0, { bubbles: !0, composed: !0 }));
    });
  }
  updated(e) {
    e.has("filters") && st(this, Pe, Wa).call(this);
  }
  render() {
    return g`<div class="sticky top-offset z-10 mb-1 flex flex-row gap-5 bg-white py-6 pt-7">
      <div class="flex items-center gap-2">
        ${st(this, Pe, aa).call(this, En(this, ra), pc, "Previous", "Select previous mutant")}
        ${st(this, Pe, aa).call(this, En(this, ta), fc, "Next", "Select next mutant")}
      </div>

      ${de(
      this.filters ?? [],
      // Key function. I super duper want that all properties are weighed here,
      // see https://lit-html.polymer-project.org/guide/writing-templates#repeating-templates-with-the-repeat-directive
      (e) => e.status,
      (e) => g`<div class="flex items-center gap-2 last:mr-12" data-status=${e.status.toString()}>
            <input
              ?checked=${e.enabled}
              id="filter-${e.status}"
              aria-describedby="status-description"
              type="checkbox"
              .value=${e.status.toString()}
              @input=${(t) => st(this, Pe, $s).call(this, e, t.target.checked)}
              class="h-5 w-5 shrink-0 rounded-sm bg-gray-100 ring-offset-gray-200! transition-colors checked:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
            />

            <label
              for="filter-${e.status}"
              class="${st(this, Pe, Ss).call(this, e.context)} rounded-md px-2.5 py-0.5 text-sm font-medium hover:cursor-pointer"
            >
              ${e.label} (${e.count})
            </label>
          </div>`
    )}
    </div>`;
  }
};
Pe = /* @__PURE__ */ new WeakSet();
$s = function(e, t) {
  e.enabled = t, st(this, Pe, Wa).call(this);
};
Wa = function() {
  this.dispatchEvent(
    ge(
      "filters-changed",
      this.filters.filter(({ enabled: e }) => e).map(({ status: e }) => e)
    )
  );
};
ta = /* @__PURE__ */ new WeakMap();
ra = /* @__PURE__ */ new WeakMap();
aa = function(e, t, r, a) {
  return g`<button
      title=${r}
      @click=${e}
      type="button"
      class="inline-flex items-center rounded-sm bg-primary-600 p-1 text-center text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
      >${t}
      <span class="sr-only">${a}</span>
    </button>`;
};
Ss = function(e) {
  switch (e) {
    case "success":
      return "bg-green-100 text-green-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "danger":
      return "bg-red-100 text-red-800";
    case "caution":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
xs([
  C({ type: Array })
], na.prototype, "filters", 2);
na = xs([
  V("mte-state-filter")
], na);
const _c = ':host{--theme-d:1.5em;--theme-s:1.2em;--theme-p:.15em;--theme-g:.06em;--theme-width:2.9em;--poly:polygon(44.1337% 12.9617%, 50% 0%, 55.8663% 12.9617%, 59.7057% 13.7778%, 63.4388% 14.9907%, 67.0246% 16.5873%, 79.3893% 9.54915%, 76.5165% 23.4835%, 79.143% 26.4005%, 81.4502% 29.576%, 83.4127% 32.9754%, 97.5528% 34.5492%, 87.0383% 44.1337%, 87.4486% 48.0374%, 87.4486% 51.9626%, 87.0383% 55.8663%, 97.5528% 65.4508%, 83.4127% 67.0246%, 81.4502% 70.424%, 79.143% 73.5995%, 76.5165% 76.5165%, 79.3893% 90.4508%, 67.0246% 83.4127%, 63.4388% 85.0093%, 59.7057% 86.2222%, 55.8663% 87.0383%, 50% 100%, 44.1337% 87.0383%, 40.2943% 86.2222%, 36.5612% 85.0093%, 32.9754% 83.4127%, 20.6107% 90.4508%, 23.4835% 76.5165%, 20.857% 73.5995%, 18.5499% 70.424%, 16.5873% 67.0246%, 2.44717% 65.4508%, 12.9617% 55.8663%, 12.5514% 51.9626%, 12.5514% 48.0374%, 12.9617% 44.1337%, 2.44717% 34.5492%, 16.5873% 32.9754%, 18.5499% 29.576%, 20.857% 26.4005%, 23.4835% 23.4835%, 20.6107% 9.54915%, 32.9754% 16.5873%, 36.5612% 14.9907%, 40.2943% 13.7778%)}#darkTheme{position:absolute;right:100vw}#darkTheme+label{--i:0;--j:calc(1 - var(--i));grid-gap:var(--theme-p) var(--theme-g);padding:var(--theme-p);height:var(--theme-d);border-radius:calc(.5 * var(--theme-s) + var(--theme-p));background:hsl(199, 98%, calc(var(--j) * 48%));color:#0000;-webkit-user-select:none;user-select:none;cursor:pointer;transition:all .3s;display:grid;overflow:hidden}#darkTheme+label:before,#darkTheme+label:after{width:var(--theme-s);height:var(--theme-s);content:"";transition:inherit}#darkTheme+label:before{transform-origin:20% 20%;transform:translate(calc(var(--i) * (100% + var(--theme-g)))) scale(calc(1 - var(--i) * .8));-webkit-clip-path:var(--poly);clip-path:var(--poly);background:#ff0}#darkTheme+label:after{transform:translatey(calc(var(--i) * (-130% - var(--theme-p))));background:radial-gradient(circle at 19% 19%,#0000 41%,#fff 43%);border-radius:50%;grid-column:2}#darkTheme:checked+label{--i:1}.check-box-container{width:var(--theme-width)}';
var Cs = Object.defineProperty, $c = Object.getOwnPropertyDescriptor, Ms = (e) => {
  throw TypeError(e);
}, Sc = (e, t, r) => t in e ? Cs(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, As = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? $c(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Cs(t, r, n), n;
}, Cc = (e, t, r) => Sc(e, t + "", r), Mc = (e, t, r) => t.has(e) || Ms("Cannot " + r), Ac = (e, t, r) => (Mc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Tc = (e, t, r) => t.has(e) ? Ms("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), ia;
let dr = class extends je {
  constructor() {
    super(...arguments), Tc(this, ia, (t) => {
      const r = t.target.checked;
      this.dispatchEvent(ge("theme-switch", r ? "dark" : "light"));
    });
  }
  render() {
    return g`<div class="check-box-container" @click=${(t) => t.stopPropagation()}>
      <input type="checkbox" @click=${Ac(this, ia)} ?checked=${this.theme === "dark"} id="darkTheme" />
      <label for="darkTheme">Dark</label>
    </div>`;
  }
};
ia = /* @__PURE__ */ new WeakMap();
Cc(dr, "styles", [_e, De(_c)]);
As([
  C()
], dr.prototype, "theme", 2);
dr = As([
  V("mte-theme-switch")
], dr);
const Ts = ({ hasDetail: e, mode: t }, r) => g`<mte-drawer
    class="fixed bottom-0 z-10 container rounded-t-3xl bg-gray-200/60 shadow-xl backdrop-blur-lg motion-safe:transition-[height,max-width] motion-safe:duration-200"
    ?has-detail=${e}
    mode=${t}
  >
    ${r}
  </mte-drawer>`;
var Ec = Object.defineProperty, Pc = Object.getOwnPropertyDescriptor, Es = (e) => {
  throw TypeError(e);
}, qa = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? Pc(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Ec(t, r, n), n;
}, zc = (e, t, r) => t.has(e) || Es("Cannot " + r), Fc = (e, t, r) => t.has(e) ? Es("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Pn = (e, t, r) => (zc(e, t, "access private method"), r), tr, Ps, zs;
const zn = (e) => `${e.name}${e.sourceFile && e.location ? ` (${Si(e)})` : ""}`, Fn = (e) => g`<span class="whitespace-pre-wrap">${e}</span>`;
let hr = class extends Ce {
  constructor() {
    super(), Fc(this, tr), this.mode = "closed";
  }
  render() {
    return Ts(
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- we want to coalesce on length 0
      { hasDetail: !!(this.mutant?.killedByTests?.length || this.mutant?.coveredByTests?.length || this.mutant?.statusReason), mode: this.mode },
      P(
        this.mutant,
        (e) => g`<span class="align-middle text-lg" slot="header"
              >${_i(e.status)} ${e.mutatorName} ${e.status}
              (${e.location.start.line}:${e.location.start.column})</span
            >
            <span slot="summary">${Pn(this, tr, Ps).call(this)}</span>
            <span slot="detail" class="block">${Pn(this, tr, zs).call(this)}</span>`
      )
    );
  }
};
tr = /* @__PURE__ */ new WeakSet();
Ps = function() {
  return bi(
    g`${P(
      this.mutant?.killedByTests?.[0],
      (e) => Ve(
        g`${L("🎯", "killed")} Killed by:
          ${e.name}${this.mutant.killedByTests.length > 1 ? `(and ${this.mutant.killedByTests.length - 1} more)` : ""}`
      )
    )}
      ${P(this.mutant?.static, () => Ve(g`${L("🗿", "static")} Static mutant`))}
      ${P(
      this.mutant?.coveredByTests,
      (e) => Ve(
        g`${L("☂️", "umbrella")} Covered by ${e.length}
          test${$i(e)}${this.mutant?.status === "Survived" ? " (yet still survived)" : ""}`
      )
    )}
      ${P(
      this.mutant?.statusReason?.trim(),
      (e) => Ve(g`${L("🕵️", "spy")} ${Fn(e)}`, `Reason for the ${this.mutant.status} status`)
    )}
      ${P(this.mutant?.description, (e) => Ve(g`${L("📖", "book")} ${Fn(e)}`))}`
  );
};
zs = function() {
  return g`<ul class="mr-2 mb-6">
      ${ht(
    this.mutant?.killedByTests,
    (e) => ir("This mutant was killed by this test", g`${L("🎯", "killed")} ${zn(e)}`)
  )}
      ${ht(
    this.mutant?.coveredByTests?.filter((e) => !this.mutant?.killedByTests?.includes(e)),
    (e) => ir("This mutant was covered by this test", g`${L("☂️", "umbrella")} ${zn(e)}`)
  )}
    </ul>`;
};
qa([
  C({ attribute: !1 })
], hr.prototype, "mutant", 2);
qa([
  C({ reflect: !0 })
], hr.prototype, "mode", 2);
hr = qa([
  V("mte-drawer-mutant")
], hr);
var Oc = Object.defineProperty, Ic = Object.getOwnPropertyDescriptor, Fs = (e) => {
  throw TypeError(e);
}, xt = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? Ic(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Oc(t, r, n), n;
}, Lc = (e, t, r) => t.has(e) || Fs("Cannot " + r), On = (e, t, r) => (Lc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), In = (e, t, r) => t.has(e) ? Fs("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), sa, oa;
let Xe = class extends Ce {
  constructor() {
    super(), In(this, sa, () => {
      this.drawerMode = "closed";
    }), In(this, oa, (e) => {
      this.selectedMutant = e.detail.mutant, this.drawerMode = e.detail.selected ? "half" : "closed";
    }), this.drawerMode = "closed";
  }
  updated(e) {
    e.has("result") && !this.result.file && (this.drawerMode = "closed");
  }
  render() {
    return g`<main class="pb-drawer-half-open" @click=${On(this, sa)}>
        <mte-metrics-table .columns=${Dc} .currentPath=${this.path} .thresholds=${this.thresholds} .model=${this.result}> </mte-metrics-table>
        ${P(this.result.file, (e) => g`<mte-file @mutant-selected=${On(this, oa)} .model=${e}></mte-file>`)}
      </main>
      <mte-drawer-mutant mode=${this.drawerMode} .mutant=${this.selectedMutant}></mte-drawer-mutant>`;
  }
};
sa = /* @__PURE__ */ new WeakMap();
oa = /* @__PURE__ */ new WeakMap();
xt([
  re()
], Xe.prototype, "drawerMode", 2);
xt([
  C({ attribute: !1 })
], Xe.prototype, "selectedMutant", 2);
xt([
  C({ attribute: !1 })
], Xe.prototype, "result", 2);
xt([
  C({ attribute: !1, reflect: !1 })
], Xe.prototype, "thresholds", 2);
xt([
  C({ attribute: !1, reflect: !1 })
], Xe.prototype, "path", 2);
Xe = xt([
  V("mte-mutant-view")
], Xe);
const Dc = [
  {
    key: "mutationScore",
    label: "Of total",
    tooltip: "The percentage of mutants that were detected. The higher, the better!",
    category: "percentage",
    group: "Mutation score"
  },
  {
    key: "mutationScoreBasedOnCoveredCode",
    label: "Of covered",
    tooltip: "Mutation score based on only the code covered by tests",
    category: "percentage",
    group: "Mutation score"
  },
  {
    key: "killed",
    label: "Killed",
    tooltip: "At least one test failed while these mutants were active. This is what you want!",
    category: "number"
  },
  {
    key: "survived",
    label: "Survived",
    tooltip: "All tests passed while these mutants were active. You're missing a test for them.",
    category: "number"
  },
  {
    key: "timeout",
    label: "Timeout",
    tooltip: "Running the tests while these mutants were active resulted in a timeout. For example, an infinite loop.",
    category: "number"
  },
  {
    key: "noCoverage",
    label: "No coverage",
    tooltip: "These mutants aren't covered by one of your tests and survived as a result.",
    category: "number"
  },
  {
    key: "ignored",
    label: "Ignored",
    tooltip: "These mutants weren't tested because they are ignored. Either by user action, or for another reason.",
    category: "number"
  },
  {
    key: "runtimeErrors",
    label: "Runtime errors",
    tooltip: "Running tests when these mutants are active resulted in an error (rather than a failed test). For example: an out of memory error.",
    category: "number"
  },
  { key: "compileErrors", label: "Compile errors", tooltip: "Mutants that caused a compile error.", category: "number" },
  {
    key: "totalDetected",
    label: "Detected",
    tooltip: "The number of mutants detected by your tests (killed + timeout).",
    category: "number",
    width: "large",
    isBold: !0
  },
  {
    key: "totalUndetected",
    label: "Undetected",
    tooltip: "The number of mutants that are not detected by your tests (survived + no coverage).",
    category: "number",
    width: "large",
    isBold: !0
  },
  {
    key: "totalMutants",
    label: "Total",
    tooltip: "All mutants (except runtimeErrors + compileErrors)",
    category: "number",
    width: "large",
    isBold: !0
  }
];
var Bc = Object.defineProperty, Rc = Object.getOwnPropertyDescriptor, Os = (e) => {
  throw TypeError(e);
}, Rt = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? Rc(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Bc(t, r, n), n;
}, jc = (e, t, r) => t.has(e) || Os("Cannot " + r), Ln = (e, t, r) => (jc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Dn = (e, t, r) => t.has(e) ? Os("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), la, ca;
let mt = class extends Ce {
  constructor() {
    super(), Dn(this, la, () => {
      this.drawerMode = "closed";
    }), Dn(this, ca, (e) => {
      this.selectedTest = e.detail.test, this.drawerMode = e.detail.selected ? "half" : "closed";
    }), this.drawerMode = "closed";
  }
  updated(e) {
    e.has("result") && !this.result.file && (this.drawerMode = "closed");
  }
  render() {
    return g`<main class="pb-drawer-half-open" @click=${Ln(this, la)}>
        <mte-metrics-table .columns=${Nc} .currentPath=${this.path} .model=${this.result}> </mte-metrics-table>
        ${P(this.result.file, (e) => g`<mte-test-file @test-selected=${Ln(this, ca)} .model=${e}></mte-test-file>`)}
      </main>
      <mte-drawer-test mode=${this.drawerMode} .test=${this.selectedTest}></mte-drawer-test>`;
  }
};
la = /* @__PURE__ */ new WeakMap();
ca = /* @__PURE__ */ new WeakMap();
Rt([
  re()
], mt.prototype, "drawerMode", 2);
Rt([
  C({ attribute: !1 })
], mt.prototype, "result", 2);
Rt([
  C({ attribute: !1, reflect: !1 })
], mt.prototype, "path", 2);
Rt([
  C({ attribute: !1 })
], mt.prototype, "selectedTest", 2);
mt = Rt([
  V("mte-test-view")
], mt);
const Nc = [
  { key: "killing", label: "Killing", tooltip: "These tests killed at least one mutant", width: "normal", category: "number" },
  {
    key: "covering",
    label: "Covering",
    tooltip: "These tests are covering at least one mutant, but not killing any of them.",
    width: "normal",
    category: "number"
  },
  {
    key: "notCovering",
    label: "Not Covering",
    tooltip: "These tests were not covering a mutant (and thus not killing any of them).",
    width: "normal",
    category: "number"
  },
  { key: "total", label: "Total tests", width: "large", category: "number", isBold: !0 }
];
var Wc = Object.defineProperty, qc = Object.getOwnPropertyDescriptor, Is = (e) => {
  throw TypeError(e);
}, jt = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? qc(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Wc(t, r, n), n;
}, Ua = (e, t, r) => t.has(e) || Is("Cannot " + r), Uc = (e, t, r) => (Ua(e, t, "read from private field"), t.get(e)), Bn = (e, t, r) => t.has(e) ? Is("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Kc = (e, t, r, a) => (Ua(e, t, "write to private field"), t.set(e, r), r), $e = (e, t, r) => (Ua(e, t, "access private method"), r), pr, ue, Ls, ua, Ds, da, Bs, Rs, js;
let vt = class extends Ce {
  constructor() {
    super(), Bn(this, ue), Bn(this, pr, !1), this.currentPath = [], this.thresholds = {
      high: 80,
      low: 60
    };
  }
  willUpdate(e) {
    e.has("columns") && Kc(this, pr, this.columns.some((t) => t.category === "percentage"));
  }
  render() {
    return P(
      this.model,
      (e) => g`<div class="overflow-x-auto rounded-md border border-gray-200">
          <table class="w-full table-auto text-left text-sm">${$e(this, ue, Ls).call(this)}${$e(this, ue, Ds).call(this, e)} </table>
        </div>`
    );
  }
};
pr = /* @__PURE__ */ new WeakMap();
ue = /* @__PURE__ */ new WeakSet();
Ls = function() {
  const e = this.columns.filter((r) => r.group !== "Mutation score"), t = this.columns.filter((r) => r.group === "Mutation score");
  return g`<thead class="border-b border-gray-200 text-center text-sm">
      <tr>
        <th rowspan="2" scope="col" class="px-4 py-4">
          <div class="flex items-center justify-around">
            <span>File / Directory</span
            ><a
              href="https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics"
              target="_blank"
              class="info-icon float-right"
              title="What does this all mean?"
              >${L("ℹ", "info icon")}</a
            >
          </div>
        </th>
        ${t.length > 0 ? g`<th colspan="4" class="px-2 even:bg-gray-100">Mutation Score</th>` : ""}
        ${de(
    e,
    (r) => r.key,
    (r) => $e(this, ue, ua).call(this, r)
  )}
      </tr>
      <tr>
        ${de(
    t,
    (r) => r.key,
    (r) => $e(this, ue, ua).call(this, r)
  )}
      </tr>
    </thead>`;
};
ua = function(e) {
  const t = `tooltip-${e.key.toString()}`, r = e.tooltip ? g`<mte-tooltip title=${e.tooltip} id=${t}>${e.label}</mte-tooltip>` : g`<span id=${t}>${e.label}</span>`;
  return e.group ? g`<th colspan="2" class="bg-gray-200 px-2"> ${r} </th>` : g`<th rowspan="2" class="w-24 px-2 even:bg-gray-100 2xl:w-28">
      <div class="inline-block">${r}</div>
    </th>`;
};
Ds = function(e) {
  const t = () => P(
    !e.file,
    () => de(
      e.childResults,
      (r) => r.name,
      (r) => {
        const a = [r.name];
        for (; !r.file && r.childResults.length === 1; )
          r = r.childResults[0], a.push(r.name);
        return $e(this, ue, da).call(this, a.join("/"), r, ...this.currentPath, ...a);
      }
    )
  );
  return g`<tbody class="divide-y divide-gray-200">${$e(this, ue, da).call(this, e.name, e)} ${t()}</tbody>`;
};
da = function(e, t, ...r) {
  return g`<tr title=${t.name} class="group hover:bg-gray-200">
      <td class="font-semibold">
        <div class="flex items-center justify-start">
          <mte-file-icon file-name=${t.name} ?file=${t.file} class="mx-1 flex items-center"></mte-file-icon> ${r.length > 0 ? g`<a class="mr-auto inline-block w-full py-4 pr-2 hover:text-primary-on hover:underline" href=${kt(...r)}>${e}</a>` : g`<span class="py-4">${t.name}</span>`}
        </div>
      </td>
      ${de(
    this.columns,
    (a) => a.key,
    (a) => $e(this, ue, Bs).call(this, a, t.metrics)
  )}
    </tr>`;
};
Bs = function(e, t) {
  const r = t[e.key], a = Uc(this, pr) ? "odd:bg-gray-100" : "even:bg-gray-100";
  if (e.category === "percentage") {
    const n = !isNaN(r), i = $e(this, ue, Rs).call(this, r), s = $e(this, ue, js).call(this, r), o = r.toFixed(2), l = `width: ${r}%`;
    return g`<td class="bg-gray-100 px-4 py-4 group-hover:bg-gray-200!">
          ${n ? g`<div class="h-3 w-full min-w-[24px] rounded-full bg-gray-300">
                <div
                  class="${i} h-3 rounded-full pl-1 transition-all"
                  role="progressbar"
                  aria-valuenow=${o}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-describedby="tooltip-mutationScore"
                  title=${e.label}
                  style=${l}
                ></div>
              </div>` : g`<span class="text-light-muted font-bold">N/A</span>`}
        </td>
        <td class="${s} ${a} w-12 pr-2 text-center font-bold group-hover:bg-gray-200!"
          >${P(n, () => g`<span class="transition-colors">${o}</span>`)}</td
        >`;
  }
  return g`<td
      class="${xa({ "font-bold": e.isBold ?? !1, [a]: !0 })} py-4 text-center group-hover:bg-gray-200!"
      aria-describedby=${`tooltip-${e.key.toString()}`}
      >${r}</td
    >`;
};
Rs = function(e) {
  return !isNaN(e) && this.thresholds ? e < this.thresholds.low ? "bg-red-600 text-gray-200" : e < this.thresholds.high ? "bg-yellow-400" : "bg-green-600 text-gray-200" : "bg-cyan-600";
};
js = function(e) {
  return !isNaN(e) && this.thresholds ? e < this.thresholds.low ? "text-red-700" : e < this.thresholds.high ? "text-yellow-600" : "text-green-700" : "";
};
jt([
  C({ attribute: !1 })
], vt.prototype, "model", 2);
jt([
  C({ attribute: !1 })
], vt.prototype, "currentPath", 2);
jt([
  C({ type: Array })
], vt.prototype, "columns", 2);
jt([
  C({ attribute: !1 })
], vt.prototype, "thresholds", 2);
vt = jt([
  V("mte-metrics-table")
], vt);
const Vc = '#report-code-block{background:var(--prism-background);border:1px solid var(--prism-border);overflow:auto visible}.line-numbers{counter-reset:mte-line-number}.line .line-number{text-align:right;color:var(--mut-line-number);counter-increment:mte-line-number;padding:0 10px 0 15px}.line .line-number:before{content:counter(mte-line-number)}.line-marker:before{content:" ";padding:0 5px}.Killing{--mut-test-dot-color:var(--color-green-700)}.Covering{--mut-test-dot-color:var(--color-amber-400)}.NotCovering{--mut-test-dot-color:var(--color-orange-500)}svg.test-dot{fill:var(--mut-test-dot-color)}';
var Ns = Object.defineProperty, Zc = Object.getOwnPropertyDescriptor, Ws = (e) => {
  throw TypeError(e);
}, Hc = (e, t, r) => t in e ? Ns(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, rt = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? Zc(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Ns(t, r, n), n;
}, Gc = (e, t, r) => Hc(e, t + "", r), Ka = (e, t, r) => t.has(e) || Ws("Cannot " + r), Ee = (e, t, r) => (Ka(e, t, "read from private field"), t.get(e)), Ue = (e, t, r) => t.has(e) ? Ws("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Yc = (e, t, r, a) => (Ka(e, t, "write to private field"), t.set(e, r), r), H = (e, t, r) => (Ka(e, t, "access private method"), r), Tt, ha, pa, q, bt, fa, ga, ma, qs, Us, fr, va, ba, wa;
let Se = class extends Ce {
  constructor() {
    super(), Ue(this, q), Ue(this, Tt), Ue(this, ha, (e) => {
      e.key === "Escape" && Ee(this, fr).call(this);
    }), Ue(this, pa, (e) => {
      this.enabledStates = e.detail, this.selectedTest && !this.enabledStates.includes(this.selectedTest.status) && H(this, q, bt).call(this, this.selectedTest);
    }), Ue(this, fa, () => {
      const e = this.selectedTest ? (this.tests.findIndex(({ id: t }) => t === this.selectedTest.id) + 1) % this.tests.length : 0;
      H(this, q, ma).call(this, this.tests[e]);
    }), Ue(this, ga, () => {
      const e = this.selectedTest ? (this.tests.findIndex(({ id: t }) => t === this.selectedTest.id) + this.tests.length - 1) % this.tests.length : this.tests.length - 1;
      H(this, q, ma).call(this, this.tests[e]);
    }), Ue(this, fr, () => {
      this.selectedTest && H(this, q, bt).call(this, this.selectedTest);
    }), this.filters = [], this.lines = [], this.enabledStates = [], this.tests = [], Yc(this, Tt, new AbortController());
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", Ee(this, ha), { signal: Ee(this, Tt).signal });
  }
  disconnectedCallback() {
    Ee(this, Tt).abort(), super.disconnectedCallback();
  }
  render() {
    return g`<mte-state-filter
        @next=${Ee(this, fa)}
        @previous=${Ee(this, ga)}
        .filters=${this.filters}
        @filters-changed=${Ee(this, pa)}
      ></mte-state-filter>
      ${H(this, q, qs).call(this)} ${H(this, q, Us).call(this)}`;
  }
  reactivate() {
    super.reactivate(), H(this, q, ba).call(this);
  }
  willUpdate(e) {
    e.has("model") && H(this, q, ba).call(this), (e.has("model") || e.has("enabledStates")) && this.model && (this.tests = this.model.tests.filter((t) => this.enabledStates.includes(t.status)).sort((t, r) => t.location && r.location ? sr(t.location.start, r.location.start) ? 1 : -1 : this.model.tests.indexOf(t) - this.model.tests.indexOf(r)));
  }
};
Tt = /* @__PURE__ */ new WeakMap();
ha = /* @__PURE__ */ new WeakMap();
pa = /* @__PURE__ */ new WeakMap();
q = /* @__PURE__ */ new WeakSet();
bt = function(e) {
  H(this, q, wa).call(this, e), this.selectedTest === e ? (this.selectedTest = void 0, this.dispatchEvent(ge("test-selected", { selected: !1, test: e }))) : (this.selectedTest && H(this, q, wa).call(this, this.selectedTest), this.selectedTest = e, this.dispatchEvent(ge("test-selected", { selected: !0, test: e })), Ci(this.renderRoot.querySelector(`[data-test-id="${e.id}"]`)));
};
fa = /* @__PURE__ */ new WeakMap();
ga = /* @__PURE__ */ new WeakMap();
ma = function(e) {
  e && H(this, q, bt).call(this, e);
};
qs = function() {
  const e = this.tests.filter((t) => !t.location);
  return P(
    e.length,
    () => g`<ul class="max-w-6xl">
          ${de(
      e,
      (t) => t.id,
      (t) => g`<li class="my-3">
                <button
                  class="w-full rounded-sm p-3 text-left hover:bg-gray-100 active:bg-gray-200"
                  type="button"
                  data-active=${this.selectedTest === t}
                  data-test-id=${t.id}
                  @click=${(r) => {
        r.stopPropagation(), H(this, q, bt).call(this, t);
      }}
                  >${Ea(t.status)} ${t.name} [${t.status}]
                </button>
              </li>`
    )}
        </ul>`,
    () => G
  );
};
Us = function() {
  return P(
    this.model?.source,
    () => {
      const e = Map.groupBy(
        this.tests.filter((r) => po(r.location)),
        (r) => r.location.start.line
      ), t = H(this, q, va).call(this, Array.from(e.entries()).filter(([r]) => r > this.lines.length).flatMap(([, r]) => r));
      return g`<pre
          id="report-code-block"
          @click=${Ee(this, fr)}
          class="line-numbers flex rounded-md p-1"
        ><code class="flex language-${za(this.model.name)}">
      <table>
        ${ht(this.lines, (r, a) => {
        const n = a + 1, i = H(this, q, va).call(this, e.get(n));
        return ji(r, Ri(i, this.lines.length === n ? t : G));
      })}</table></code></pre>`;
    },
    () => G
  );
};
fr = /* @__PURE__ */ new WeakMap();
va = function(e) {
  return P(
    e?.length,
    () => de(
      e,
      (t) => t.id,
      (t) => B`<svg
              data-test-id="${t.id}"
              class="test-dot ${this.selectedTest?.id === t.id ? "selected" : ""} ${t.status} mx-0.5 cursor-pointer"
              @click="${(r) => {
        r.stopPropagation(), H(this, q, bt).call(this, t);
      }}"
              height="11"
              width="11"
            >
              <title>${Jc(t)}</title>
              ${this.selectedTest === t ? Ui : Ki}
            </svg>`
    ),
    () => G
  );
};
ba = function() {
  if (!this.model)
    return;
  const e = this.model;
  this.filters = [N.Killing, N.Covering, N.NotCovering].filter((t) => e.tests.some((r) => r.status === t)).map((t) => ({
    enabled: !0,
    count: e.tests.filter((r) => r.status === t).length,
    status: t,
    label: g`${Ea(t)} ${t}`,
    context: Rl(t)
  })), this.model.source && (this.lines = Oa(Fa(this.model.source, this.model.name)));
};
wa = function(e) {
  Vi(this.renderRoot, "data-test-id", e.id);
};
Gc(Se, "styles", [vi, _e, De(Vc)]);
rt([
  C({ attribute: !1 })
], Se.prototype, "model", 2);
rt([
  re()
], Se.prototype, "filters", 2);
rt([
  re()
], Se.prototype, "lines", 2);
rt([
  re()
], Se.prototype, "enabledStates", 2);
rt([
  re()
], Se.prototype, "selectedTest", 2);
rt([
  re()
], Se.prototype, "tests", 2);
Se = rt([
  V("mte-test-file")
], Se);
function Jc(e) {
  return `${e.name} (${e.status})`;
}
var Qc = Object.defineProperty, Xc = Object.getOwnPropertyDescriptor, Ks = (e) => {
  throw TypeError(e);
}, Va = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? Xc(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Qc(t, r, n), n;
}, eu = (e, t, r) => t.has(e) || Ks("Cannot " + r), tu = (e, t, r) => t.has(e) ? Ks("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Rn = (e, t, r) => (eu(e, t, "access private method"), r), rr, Vs, Zs;
const ya = (e) => g`<code>${e.getMutatedLines()}</code> (${Si(e)})`;
let gr = class extends Ce {
  constructor() {
    super(), tu(this, rr), this.mode = "closed";
  }
  render() {
    return Ts(
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- we want to coalesce on length 0
      { hasDetail: !!(this.test?.killedMutants?.length || this.test?.coveredMutants?.length), mode: this.mode },
      P(
        this.test,
        (e) => g`<span class="align-middle text-lg" slot="header"
              >${Ea(e.status)} ${e.name} [${e.status}]
              ${P(e.location, (t) => g`(${t.start.line}:${t.start.column})`)}</span
            >
            <span slot="summary">${Rn(this, rr, Vs).call(this)}</span>
            <span class="block" slot="detail">${Rn(this, rr, Zs).call(this)}</span>`
      )
    );
  }
};
rr = /* @__PURE__ */ new WeakSet();
Vs = function() {
  return bi(
    g`${P(
      this.test?.killedMutants?.[0],
      (e) => Ve(
        g`${L("🎯", "killed")} Killed:
          ${ya(e)}${this.test.killedMutants.length > 1 ? g` (and ${this.test.killedMutants.length - 1} more)` : ""}`
      )
    )}
      ${P(
      this.test?.coveredMutants,
      (e) => Ve(
        g`${L("☂️", "umbrella")} Covered ${e.length}
          mutant${$i(e)}${this.test?.status === N.Covering ? " (yet didn't kill any of them)" : ""}`
      )
    )}`
  );
};
Zs = function() {
  return g`<ul class="mr-2 mb-6">
      ${ht(
    this.test?.killedMutants,
    (e) => ir("This test killed this mutant", g`${L("🎯", "killed")} ${ya(e)}`)
  )}
      ${ht(
    this.test?.coveredMutants?.filter((e) => !this.test?.killedMutants?.includes(e)),
    (e) => ir("This test covered this mutant", g`${L("☂️", "umbrella")} ${ya(e)}`)
  )}
    </ul>`;
};
Va([
  C({ attribute: !1 })
], gr.prototype, "test", 2);
Va([
  C({ reflect: !0 })
], gr.prototype, "mode", 2);
gr = Va([
  V("mte-drawer-test")
], gr);
const ru = "svg{width:20px}svg.cs{fill:var(--mut-file-csharp-color)}svg.html{fill:var(--mut-file-html-color)}svg.java{fill:var(--mut-file-java-color)}svg.javascript{fill:var(--mut-file-js-color)}svg.scala{fill:var(--mut-file-scala-color)}svg.typescript{fill:var(--mut-file-ts-color)}svg.php{fill:var(--mut-file-php-color)}svg.vue{fill:var(--mut-file-vue-color)}svg.octicon{fill:var(--mut-octicon-icon-color)}svg.javascript.test{fill:var(--mut-file-js-test-color)}svg.typescript.test{fill:var(--mut-file-ts-test-color)}svg.gherkin{fill:var(--mut-file-gherkin-color)}svg.svelte{fill:var(--mut-file-svelte-color)}svg.rust{fill:var(--mut-file-rust-color)}svg.python{fill:var(--mut-file-python-color)}";
var Hs = Object.defineProperty, au = Object.getOwnPropertyDescriptor, Gs = (e) => {
  throw TypeError(e);
}, nu = (e, t, r) => t in e ? Hs(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Za = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? au(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && Hs(t, r, n), n;
}, iu = (e, t, r) => nu(e, t + "", r), su = (e, t, r) => t.has(e) || Gs("Cannot " + r), U = (e, t, r) => (su(e, t, "read from private field"), r ? r.call(e) : t.get(e)), ou = (e, t, r) => t.has(e) ? Gs("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), j, mr, Ys, ne;
let Lt = class extends je {
  constructor() {
    super(...arguments), ou(this, j);
  }
  render() {
    if (!this.file)
      return cc;
    if (!U(this, j, mr))
      return uc;
    switch (U(this, j, mr)) {
      case O.csharp:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="cs" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M7.1 15.9c0-1.3.2-2.4.6-3.4s.9-1.8 1.6-2.5 1.5-1.2 2.4-1.6 1.9-.5 2.9-.5 1.9.2 2.7.6 1.5.9 2 1.4l-2.2 2.5c-.4-.3-.7-.6-1.1-.7s-.8-.3-1.4-.3c-.5 0-.9.1-1.3.3s-.8.5-1.1.9-.5.8-.7 1.4-.3 1.2-.3 1.9c0 1.5.3 2.6 1 3.3.7.8 1.5 1.2 2.6 1.2.5 0 1-.1 1.4-.3s.8-.5 1.1-.9l2.2 2.5c-.7.8-1.4 1.3-2.2 1.7q-1.2.6-2.7.6c-1.5 0-2-.2-2.9-.5S10 22.7 9.3 22s-1.1-1.7-1.5-2.7c-.5-.9-.7-2.1-.7-3.4"/><path d="M21.8 17.1h-1l-.4 2.4h-1.2l.4-2.4h-1.2V16h1.5l.2-1.6h-1.3v-1.1h1.5l.4-2.4h1.2l-.4 2.4h1l.4-2.4h1.2l-.4 2.4H25v1.1h-1.6l-.2 1.6h1.3v1.1h-1.6l-.4 2.4h-1.2c0 .1.5-2.4.5-2.4m-.8-1h1l.2-1.6h-1z"/></svg>`;
      case O.html:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="html" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="m8 15 6-5.6V12l-4.5 4 4.5 4v2.6L8 17zm16 2.1-6 5.6V20l4.6-4-4.6-4V9.3l6 5.6z"/></svg>`;
      case O.java:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="java" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M22.003 18.236c-.023.764.018 1.78-.282 2.64a5.76 5.76 0 0 1-1.348 2.304 6.6 6.6 0 0 1-2.19 1.46c-.825.3-1.453.36-2.585.36s-2.135-.116-3.146-.528a6.9 6.9 0 0 1-2.472-1.91l2.022-2.584a4.4 4.4 0 0 0 1.517 1.236q.9.45 1.967.449 1.404 0 2.19-.899.787-.955.787-2.809V7h3.54z"/></svg>`;
      case O.javascript:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="js" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M11.4 10h2.7v7.6c0 3.4-1.6 4.6-4.3 4.6-.6 0-1.5-.1-2-.3l.3-2.2c.4.2.9.3 1.4.3 1.1 0 1.9-.5 1.9-2.4zm5.1 9.2c.7.4 1.9.8 3 .8 1.3 0 1.9-.5 1.9-1.3s-.6-1.2-2-1.7c-2-.7-3.3-1.8-3.3-3.6 0-2.1 1.7-3.6 4.6-3.6 1.4 0 2.4.3 3.1.6l-.6 2.2c-.5-.2-1.3-.6-2.5-.6s-1.8.5-1.8 1.2c0 .8.7 1.1 2.2 1.7 2.1.8 3.1 1.9 3.1 3.6 0 2-1.6 3.7-4.9 3.7-1.4 0-2.7-.4-3.4-.7z"/></svg>`;
      case O.typescript:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="ts" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M15.6 11.8h-3.4V22H9.7V11.8H6.3V10h9.2v1.8zm7.7 7.1c0-.5-.2-.8-.5-1.1s-.9-.5-1.7-.8q-2.1-.6-3.3-1.5c-.7-.6-1.1-1.3-1.1-2.3s.4-1.8 1.3-2.4c.8-.6 1.9-.9 3.2-.9s2.4.4 3.2 1.1 1.2 1.6 1.2 2.6h-2.3c0-.6-.2-1-.6-1.4-.4-.3-.9-.5-1.6-.5-.6 0-1.1.1-1.5.4s-.5.7-.5 1.1.2.7.6 1 1 .5 2 .8q1.95.6 3 1.5c.7.6 1 1.4 1 2.4s-.4 1.9-1.2 2.4c-.8.6-1.9.9-3.2.9s-2.5-.3-3.4-1-1.5-1.6-1.4-2.9h2.4c0 .7.2 1.2.7 1.6.4.3 1.1.5 1.8.5s1.2-.1 1.5-.4c.2-.3.4-.7.4-1.1"/></svg>`;
      case O.scala:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="scala" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M21.6 7v4.2c-.1.1-.1.2-.2.2-.3.3-.7.5-1.1.6-.9.3-1.9.5-2.8.7-1.6.3-3.1.5-4.7.7-.8.1-1.6.2-2.4.4V9.6c.1-.1.2-.1.4-.1 1.2-.2 2.5-.4 3.8-.5 1.9-.3 3.8-.5 5.6-1.1.5-.2 1.1-.4 1.4-.9m0 5.6v4.2l-.2.2c-.5.4-1.1.6-1.6.8-.8.2-1.6.4-2.4.5-1 .2-1.9.3-2.9.5-1.4.2-2.7.3-4.1.6v-4.2c.1-.1.2-.1.3-.1 1.7-.2 3.4-.5 5.1-.7 1.4-.2 2.9-.5 4.3-.9.6-.2 1.1-.4 1.5-.9M10.5 25h-.1v-4.2c.1-.1.2-.1.3-.1 1.2-.2 2.3-.3 3.5-.5 2-.3 3.9-.5 5.8-1.1.6-.2 1.2-.4 1.6-.9v4.2c-.1.2-.3.3-.5.5-.6.3-1.2.5-1.9.7-1.2.3-2.5.5-3.7.7-1.3.2-2.6.4-3.9.5-.4 0-.7.1-1.1.2"/></svg>`;
      case O.php:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="php" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M12.7 19.7c-.1-.6-.4-1.1-1-1.3-.2-.1-.5-.3-.7-.4-.3-.1-.6-.2-.8-.3s-.4 0-.6.2c-.1.2 0 .4.1.5.1.2.2.3.4.5.2.3.4.5.7.8.2.3.4.5.3.9-.1.7-.4 1.4-.9 1.9-.1.1-.2.1-.2.1-.3 0-.7-.2-.9-.4-.3-.3-.2-.6.1-.8.1 0 .2-.1.2-.2.2-.2.3-.4.2-.7-.1-.1-.1-.2-.2-.3-.4-.4-.9-.8-1.4-1.2-1.3-1-1.9-2.2-2-3.6-.1-1.6.3-3.1 1.1-4.5.3-.5.7-1 1.3-1.3.4-.2.8-.3 1.2-.4 1.1-.3 2.3-.5 3.5-.3 1 .2 1.8.7 2.1 1.7.2.7.3 1.3.2 2-.1 1.4-1.2 2.6-2.5 3-.6.2-.9.1-1.2-.4-.2-.3-.5-.7-.7-1.1V14c0-.1-.1-.1-.1-.2.1.6.2 1.2.5 1.7.2.3.4.5.8.5 1.3.1 2.3-.3 3.1-1.3.8-1.1 1-2.4.8-3.8 0-.3-.1-.5-.2-.8 0-.2 0-.3.2-.4.1 0 .2 0 .2-.1 1-.2 2.1-.3 3.1-.2 1.2.1 2.3.4 3.3 1.1 1.6 1 2.6 2.5 3.1 4.3.1.3.1.5.1.8 0 .2-.1.2-.3.1s-.3-.3-.4-.4-.2-.3-.3-.4-.2-.1-.2 0-.1.2-.1.3c-.3 1-.7 1.9-1.4 2.6-.1.1-.2.3-.2.4 0 .4-.1.8 0 1.2.1.8.2 1.7.3 2.5.1.5-.1.7-.5.9-.3.1-.6.2-1 .2h-1.6c0-.6 0-1.2-.5-1.5.1-.4.2-.8.3-1.3.1-.4 0-.7-.2-1s-.5-.3-.8-.2c-.8.5-1.6.5-2.5.2-.4-.1-.7-.1-.9.3q-.3.6-.3 1.2c0 .5.1 1.1.2 1.6 0 .3 0 .4-.3.5-.7.2-1.4.2-2 .1h-.1c0-.6 0-1.2-.7-1.5.4-.4.4-1.1.3-1.7m-4.1-2.3c.1-.1.2-.2.2-.4.1-.3-.2-.8-.5-.9-.2-.1-.3 0-.4.1-.3.3-.5.6-.8.9 0 .1-.1.1-.1.2-.1.2 0 .4.2.4.1 0 .3 0 .4.1.4 0 .7-.1 1-.4m0-3.3c0-.2-.2-.4-.4-.4s-.5.2-.4.5c0 .2.2.4.5.4.1-.1.3-.3.3-.5"/></svg>`;
      case O.vue:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="vue" class="${U(this, j, ne)}" viewBox="0 0 1200 1000"><path d="m600 495.9 159.1-275.4h-84.4L600 349.7l-74.6-129.2h-84.5z"/><path d="M793.7 220.5 600 555.9 406.3 220.5H277l323 559 323-559z"/></svg>`;
      case O.gherkin:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="gherkin" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M16.129 2a12.348 12.348 0 0 0-2.35 24.465V30c7.371-1.114 13.9-6.982 14.384-14.684a12.8 12.8 0 0 0-5.9-11.667 10 10 0 0 0-1.411-.707q-.117-.048-.235-.094c-.216-.08-.435-.17-.658-.236A12.2 12.2 0 0 0 16.129 2" style="fill:var(--mut-file-gherkin-color)"/><path d="M18.68 6.563a1.35 1.35 0 0 0-1.178.472 5.5 5.5 0 0 0-.518.9 2.9 2.9 0 0 0 .377 3.023A3.32 3.32 0 0 0 19.763 9 2.4 2.4 0 0 0 20 8a1.41 1.41 0 0 0-1.32-1.437m-5.488.071A1.44 1.44 0 0 0 11.85 8a2.4 2.4 0 0 0 .235 1 3.43 3.43 0 0 0 2.473 1.96 3.14 3.14 0 0 0-.212-3.85 1.32 1.32 0 0 0-1.154-.472Zm-3.7 3.637a1.3 1.3 0 0 0-.73 2.338 5.7 5.7 0 0 0 .895.543 3.39 3.39 0 0 0 3.179-.307 3.5 3.5 0 0 0-2.049-2.338 2.7 2.7 0 0 0-1.06-.236 1.4 1.4 0 0 0-.236 0Zm11.611 4.582a3.44 3.44 0 0 0-1.955.567 3.5 3.5 0 0 0 2.052 2.338 2.7 2.7 0 0 0 1.06.236 1.329 1.329 0 0 0 .966-2.362 5.5 5.5 0 0 0-.895-.52 3.3 3.3 0 0 0-1.225-.26Zm-10.292.071a3.3 3.3 0 0 0-1.225.26 2.6 2.6 0 0 0-.895.543 1.34 1.34 0 0 0 1.039 2.338 2.4 2.4 0 0 0 1.06-.236 3.19 3.19 0 0 0 1.955-2.338 3.37 3.37 0 0 0-1.931-.567Zm3.815 2.314a3.32 3.32 0 0 0-2.4 1.96 2.3 2.3 0 0 0-.236.968 1.4 1.4 0 0 0 2.426.992 5.5 5.5 0 0 0 .518-.9 3.11 3.11 0 0 0-.306-3.023Zm2.8.071a3.14 3.14 0 0 0 .212 3.85 1.47 1.47 0 0 0 2.5-.9 2.4 2.4 0 0 0-.236-.992 3.43 3.43 0 0 0-2.473-1.96Z" style="fill:#fff"/></svg>`;
      case O.svelte:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="svelte" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M10.617 10.473 14.809 7.8c2.387-1.52 5.688-.812 7.359 1.58a5.12 5.12 0 0 1 .876 3.876 4.8 4.8 0 0 1-.72 1.798c.524.998.7 2.142.5 3.251a4.8 4.8 0 0 1-1.963 3.081l-.21.14-4.192 2.672c-2.386 1.52-5.688.812-7.36-1.58a5.13 5.13 0 0 1-.875-3.876c.116-.642.36-1.253.72-1.798a5.07 5.07 0 0 1-.5-3.251 4.8 4.8 0 0 1 1.962-3.081zL14.81 7.8l-4.192 2.672zm9.825.008a3.33 3.33 0 0 0-3.573-1.324q-.34.09-.65.256l-.202.118-4.192 2.671a2.9 2.9 0 0 0-1.306 1.937 3.08 3.08 0 0 0 .526 2.33 3.33 3.33 0 0 0 3.574 1.326q.34-.091.65-.256l.201-.118 1.6-1.02a1 1 0 0 1 .257-.113c.407-.105.837.054 1.077.4a.93.93 0 0 1 .158.702.87.87 0 0 1-.295.512l-.099.072-4.192 2.671a1 1 0 0 1-.257.113 1 1 0 0 1-1.076-.4.94.94 0 0 1-.171-.49l.002-.132.014-.156-.156-.047a5.4 5.4 0 0 1-1.387-.645l-.252-.174-.215-.158-.08.24a3 3 0 0 0-.1.392 3.08 3.08 0 0 0 .527 2.33 3.33 3.33 0 0 0 3.38 1.37l.194-.045q.34-.09.65-.256l.202-.118 4.192-2.671a2.9 2.9 0 0 0 1.306-1.937 3.08 3.08 0 0 0-.526-2.331 3.33 3.33 0 0 0-3.574-1.325 3 3 0 0 0-.65.257l-.201.117-1.6 1.02a1 1 0 0 1-.257.113 1 1 0 0 1-1.077-.4.93.93 0 0 1-.158-.702.87.87 0 0 1 .295-.512l.098-.072 4.192-2.671a1 1 0 0 1 .258-.113c.407-.106.836.053 1.076.399a.94.94 0 0 1 .171.49l-.002.133-.014.156.155.047c.492.148.959.365 1.388.645l.252.175.215.157.079-.24q.064-.194.1-.392a3.08 3.08 0 0 0-.526-2.33z"/></svg>`;
      case O.rust:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="rust" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M21.7 8.4V9l.1.1h.1c.3-.1.6-.1.9-.2.2-.1.4.1.3.3-.1.3-.1.6-.2.9v.1l.1.1c0 .1.1.1.2.1h.9q.3 0 .3.3v.2c-.1.3-.3.6-.4.8v.1s.1.1.1.2h.1c.3.1.6.1.9.2.2 0 .3.3.2.5-.2.3-.4.5-.5.7v.2c0 .1.1.1.2.2.3.1.5.2.8.3.2.1.3.3.1.5s-.4.4-.7.6v.3s.1.1.2.1c.2.1.4.3.7.4.2.1.2.4 0 .5-.3.2-.5.3-.8.5v.1c0 .2 0 .2.1.3.2.2.4.4.6.5.2.2.1.4-.1.5-.3.1-.6.2-.8.3 0 0-.1 0-.1.1-.1.1 0 .2 0 .3.2.2.3.4.5.7.1.1.1.3-.1.4-.1 0-.1 0-.2.1-.3 0-.5.1-.8.1h-.1c0 .1-.1.1-.1.2s0 .1.1.2c.1.2.2.5.3.7.1.1 0 .3-.1.4h-1.2c-.1.1-.1.2-.1.3.1.3.1.5.2.8.1.2-.1.4-.4.4-.3-.1-.6-.1-.9-.2H22l-.1.1s-.1.1 0 .1v.9q0 .3-.3.3h-.2c-.3-.1-.5-.2-.8-.4h-.1c-.1 0-.2.1-.2.2 0 .3-.1.5-.1.8 0 .2-.3.3-.5.2-.2-.2-.5-.4-.7-.5h-.1c-.1 0-.2.1-.2.2-.1.3-.2.5-.3.8-.1.2-.2.2-.3.2S18 26 18 26c-.2-.2-.4-.4-.6-.7h-.2c-.1 0-.2.1-.2.2-.1.2-.3.5-.4.7s-.4.2-.5 0c-.2-.3-.3-.5-.5-.8h-.2c-.1 0-.1 0-.2.1l-.6.6c-.1.1-.2.1-.4.1-.1 0-.1-.1-.1-.2l-.3-.9s0-.1-.1-.1h-.3c-.2.2-.4.3-.7.5-.4-.2-.7-.3-.7-.5-.1-.3-.1-.6-.1-.9 0 0 0-.1-.1-.1s-.1-.1-.2-.1-.1 0-.2.1c-.2.1-.5.2-.7.3s-.4 0-.4-.2V23l-.1-.1h-.1c-.3.1-.6.1-.9.2-.2.1-.4-.1-.3-.3.1-.3.1-.6.2-.9v-.1l-.1-.1H8q-.3 0-.3-.3v-.2c.1-.3.3-.6.4-.8v-.1s0-.1-.1-.1c0-.1-.1-.1-.1-.1-.3 0-.6-.1-.9-.1-.2 0-.3-.3-.2-.5.2-.2.4-.5.5-.7v-.1c0-.1 0-.1-.1-.2 0 0-.1-.1-.2-.1-.2-.1-.5-.2-.7-.3s-.3-.3-.1-.5c.3-.1.5-.4.8-.6v-.2c0-.1 0-.2-.1-.2-.2-.1-.5-.3-.7-.4s-.2-.4 0-.5c.3-.2.5-.3.8-.5V15l-.1-.1-.6-.6c-.1-.1-.1-.3 0-.4 0 0 .1 0 .1-.1l.9-.3v-.1c.1-.1 0-.2 0-.3-.2-.2-.3-.4-.5-.6-.1-.2 0-.5.2-.5.3-.1.6-.1.9-.2H8c0-.1.1-.1.1-.2s0-.1-.1-.2c-.1-.2-.2-.5-.3-.7s0-.4.2-.4H9s0-.1.1-.1v-.1c-.1-.3-.2-.6-.2-.9-.1-.2.1-.4.3-.3.3 0 .6.1.9.2h.1l.1-.1s.1-.1 0-.1V8q0-.3.3-.3h.2c.3.1.6.3.8.4h.1s.1 0 .1-.1c.1 0 .1-.1.1-.1 0-.3.1-.6.1-.9 0-.2.3-.3.5-.2.2.2.5.4.7.5h.1c.1 0 .1 0 .2-.1 0 0 0-.1.1-.2.1-.2.2-.5.3-.7s.2-.2.4-.2l.1.1c.1.3.4.5.6.8h.1c.1 0 .2-.1.2-.1.1-.2.3-.5.4-.7.2-.2.4-.2.5-.1l.1.1c.2.3.3.5.5.8h.3c.1 0 .1-.1.1-.1.2-.2.4-.4.5-.6.1-.1.3-.1.4 0v.1c.1.3.2.6.3.8l.1.1h.2c.3-.1.6-.3.8-.5.2-.1.5 0 .5.2 0 .3.1.6.1.9 0 0 0 .1.1.1h.1c.1.1.2.1.2 0 .2-.1.5-.2.8-.3.2-.1.4 0 .4.3zm-11.1 2.7h7.6c.3 0 .6 0 .9.1.6.2 1.1.5 1.4.9.3.3.5.7.5 1.2q0 .6-.3 1.2c-.2.3-.5.6-.8.8-.1.1-.2.2-.3.2.1.1.2.1.3.2.2.2.5.4.6.7.2.3.3.7.3 1 0 .1.1.2.2.3.2.2.5.2.8.2.2 0 .4-.1.5-.2.2-.2.2-.4.3-.6v-.5c0-.1 0-.1.1-.1h.7v-1.3c-.3-.1-.6-.3-.9-.4-.1-.1-.3-.1-.4-.2-.3-.1-.4-.4-.3-.8.2-.5.4-1 .7-1.5v-.1c-.4-.6-.8-1.2-1.4-1.7q-1.5-1.35-3.6-1.8h-.1c-.3.3-.6.6-1 .9-.2.2-.6.2-.8 0l-.9-.9h-.1c-.4.1-.7.2-1 .3-1.1.4-2 1-2.8 1.8-.1.1-.2.2-.2.3m11.3 9.2h-3c-.2 0-.3 0-.4-.1-.4-.2-.6-.6-.7-1s-.2-.7-.2-1.1c0-.2-.1-.4-.2-.6-.2-.5-.6-.8-1.1-.8h-1.8V18h1.8c.1 0 .1 0 .1.1v2c0 .1 0 .1-.1.1h-6c.2.3.4.5.6.7h.1c.4-.1.8-.2 1.2-.2.3-.1.6.1.7.4.1.4.2.9.3 1.3v.1c.8.3 1.6.6 2.4.6.7.1 1.4 0 2.1-.1.5-.1 1-.3 1.5-.5v-.1c.1-.4.2-.9.3-1.3.1-.3.3-.5.7-.4l1.2.3h.1c0-.2.2-.5.4-.7m-11.9-7 .3.6c0 .1.1.2 0 .3 0 .2-.2.3-.3.4-.4.2-.8.4-1.2.5 0 0-.1 0-.1.1v.5c0 .7.1 1.4.3 2.2 0 0 0 .1.1.1h2.1v-4.7zm4.3 1.4q.15 0 0 0h2.3c.2 0 .4 0 .6-.1.1-.1.2-.1.3-.3s.1-.5-.1-.7-.5-.3-.7-.3h-2.5c.1.5.1.9.1 1.4m-6-1c0 .3.3.6.6.6s.6-.3.6-.6-.3-.6-.6-.6-.6.3-.6.6M21 22.1c0-.3-.3-.6-.6-.6s-.6.3-.6.6.3.6.6.6.6-.2.6-.6m-9.4-.6c-.3 0-.6.3-.6.6s.3.6.6.6.6-.3.6-.6-.3-.6-.6-.6m5-13.1c0-.3-.2-.6-.6-.6-.3 0-.6.2-.6.6 0 .3.2.6.6.6.3 0 .5-.3.6-.6m6.5 6c.3 0 .6-.3.6-.6s-.3-.6-.6-.6-.6.3-.6.6.2.6.6.6"/></svg>`;
      case O.python:
        return B`<svg xmlns="http://www.w3.org/2000/svg" aria-label="python" class="${U(this, j, ne)}" viewBox="0 0 32 32"><path d="M15.6 15.5h-2c-1.4 0-2.3.9-2.3 2.3v1.8q0 .3-.3.3h-.9c-.9 0-1.6-.4-2-1.2-.3-.6-.5-1.2-.5-1.8-.1-1.1-.1-2.2.3-3.3.3-.9.9-1.6 1.9-1.8h5.8c.1 0 .3 0 .3-.1v-.5s-.2-.1-.3-.1h-3.4c-.3 0-.4-.1-.4-.4V9.4c0-.7.3-1.2.9-1.4.5-.2 1-.4 1.5-.5 1.2-.2 2.4-.2 3.6.1.5.1 1 .3 1.4.6.4.4.7.8.6 1.4v3.6c0 1.4-.8 2.2-2.2 2.2-.7.1-1.4.1-2 .1m-2.8-6c0 .4.3.8.8.8.4 0 .8-.4.8-.8s-.4-.7-.8-.8c-.5 0-.8.4-.8.8m3.6 7h2c1.4 0 2.3-.9 2.3-2.3v-1.8q0-.3.3-.3h.9c.9 0 1.6.4 2 1.2.3.6.5 1.2.5 1.8.1 1.1.1 2.2-.3 3.3-.3.9-.9 1.6-1.9 1.8h-5.8c-.1 0-.3 0-.3.1v.5s.2.1.3.1h3.4c.3 0 .4.1.4.4v1.3c0 .7-.3 1.2-.9 1.4-.5.2-1 .4-1.5.5-1.2.2-2.4.2-3.6-.1-.5-.1-1-.3-1.4-.6-.4-.4-.7-.8-.6-1.4v-3.6c0-1.4.8-2.2 2.2-2.2.7-.1 1.4-.1 2-.1m2.8 6c0-.4-.3-.8-.8-.8-.4 0-.8.4-.8.8s.4.7.8.8c.5 0 .8-.4.8-.8"/></svg>`;
    }
  }
};
j = /* @__PURE__ */ new WeakSet();
mr = function() {
  return za(this.fileName);
};
Ys = function() {
  const e = this.fileName.substr(0, this.fileName.lastIndexOf(".")).toLowerCase();
  return e.endsWith("spec") || e.endsWith("test") || e.endsWith("unit");
};
ne = function() {
  return xa({ [U(this, j, mr)?.toString() ?? "unknown"]: this.file, test: U(this, j, Ys) });
};
iu(Lt, "styles", [De(ru)]);
Za([
  C({ attribute: "file-name" })
], Lt.prototype, "fileName", 2);
Za([
  C({ type: Boolean })
], Lt.prototype, "file", 2);
Lt = Za([
  V("mte-file-icon")
], Lt);
var lu = Object.defineProperty, cu = Object.getOwnPropertyDescriptor, Js = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? cu(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && lu(t, r, n), n;
};
let ka = class extends je {
  render() {
    return g`<span class="cursor-help underline decoration-dotted" title=${this.title}><slot></slot></span>`;
  }
};
Js([
  C({ attribute: !0 })
], ka.prototype, "title", 2);
ka = Js([
  V("mte-tooltip")
], ka);
class uu {
  constructor(t, { target: r, config: a, callback: n, skipInitial: i }) {
    this.t = /* @__PURE__ */ new Set(), this.o = !1, this.i = !1, this.h = t, r !== null && this.t.add(r ?? t), this.o = i ?? this.o, this.callback = n, Nn || (window.IntersectionObserver ? (this.u = new IntersectionObserver((s) => {
      const o = this.i;
      this.i = !1, this.o && o || (this.handleChanges(s), this.h.requestUpdate());
    }, a), t.addController(this)) : console.warn("IntersectionController error: browser does not support IntersectionObserver."));
  }
  handleChanges(t) {
    this.value = this.callback?.(t, this.u);
  }
  hostConnected() {
    for (const t of this.t) this.observe(t);
  }
  hostDisconnected() {
    this.disconnect();
  }
  async hostUpdated() {
    const t = this.u.takeRecords();
    t.length && this.handleChanges(t);
  }
  observe(t) {
    this.t.add(t), this.u.observe(t), this.i = !0;
  }
  unobserve(t) {
    this.t.delete(t), this.u.unobserve(t);
  }
  disconnect() {
    this.u.disconnect();
  }
}
var du = Object.defineProperty, hu = Object.getOwnPropertyDescriptor, Qs = (e) => {
  throw TypeError(e);
}, _t = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? hu(t, r) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && du(t, r, n), n;
}, Ha = (e, t, r) => t.has(e) || Qs("Cannot " + r), pu = (e, t, r) => (Ha(e, t, "read from private field"), r ? r.call(e) : t.get(e)), jn = (e, t, r) => t.has(e) ? Qs("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), fu = (e, t, r, a) => (Ha(e, t, "write to private field"), t.set(e, r), r), dt = (e, t, r) => (Ha(e, t, "access private method"), r), vr, Oe, Xs, Ga, eo, to, ro;
let et = class extends je {
  constructor() {
    super(), jn(this, Oe), jn(this, vr), this.detected = 0, this.noCoverage = 0, this.pending = 0, this.survived = 0, this.total = 0, fu(this, vr, new uu(this, {
      callback: ([e]) => !e.isIntersecting
    }));
  }
  render() {
    return g`${dt(this, Oe, Xs).call(this)}
      <div data-test-id="progress-bar" class="my-4 rounded-md bg-white transition-all">
        <div class="parts flex h-8 w-full overflow-hidden rounded-sm bg-gray-200">${dt(this, Oe, Ga).call(this, !1)}</div>
      </div>`;
  }
};
vr = /* @__PURE__ */ new WeakMap();
Oe = /* @__PURE__ */ new WeakSet();
Xs = function() {
  return g`<div
      data-test-id="small-progress-bar"
      class="${pu(this, vr).value ? "opacity-100" : "opacity-0"} pointer-events-none fixed top-offset left-0 z-20 flex w-full justify-center transition-all"
    >
      <div class="container w-full bg-white py-2">
        <div class="flex h-2 overflow-hidden rounded-sm bg-gray-200">${dt(this, Oe, Ga).call(this, !0)}</div>
      </div>
    </div>`;
};
Ga = function(e) {
  return de(
    dt(this, Oe, eo).call(this),
    (t) => t.type,
    (t) => g`<div
          title=${e ? G : t.tooltip}
          style="width: ${dt(this, Oe, ro).call(this, t.amount)}%"
          class="${dt(this, Oe, to).call(this, t.type)} ${t.amount === 0 ? "opacity-0" : "opacity-100"} relative flex items-center overflow-hidden motion-safe:transition-width"
          >${e ? G : g`<span class="ms-3 font-bold text-gray-800">${t.amount}</span>`}
        </div>`
  );
};
eo = function() {
  return [
    { type: "detected", amount: this.detected, tooltip: `killed + timeout (${this.detected})` },
    { type: "survived", amount: this.survived, tooltip: `survived (${this.survived})` },
    { type: "no coverage", amount: this.noCoverage, tooltip: `no coverage (${this.noCoverage})` },
    { type: "pending", amount: this.pending, tooltip: "pending" }
  ];
};
to = function(e) {
  switch (e) {
    case "detected":
      return "bg-green-600";
    case "survived":
      return "bg-red-600";
    case "no coverage":
      return "bg-yellow-600";
    default:
      return "bg-gray-200";
  }
};
ro = function(e) {
  return this.total !== 0 ? 100 * e / this.total : 0;
};
_t([
  C({ type: Number })
], et.prototype, "detected", 2);
_t([
  C({ type: Number, attribute: "no-coverage" })
], et.prototype, "noCoverage", 2);
_t([
  C({ type: Number })
], et.prototype, "pending", 2);
_t([
  C({ type: Number })
], et.prototype, "survived", 2);
_t([
  C({ type: Number })
], et.prototype, "total", 2);
et = _t([
  V("mte-result-status-bar")
], et);
export {
  Y as MutationTestReportAppComponent
};
