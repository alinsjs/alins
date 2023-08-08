(() => {
  // ../../packages/client-core/dist/alins.esm.min.js
  function _iterableToArrayLimit(e, t) {
    var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
    if (null != r) {
      var n, i, o, a, c = [], l = true, u = false;
      try {
        if (o = (r = r.call(e)).next, 0 === t) {
          if (Object(r) !== r)
            return;
          l = false;
        } else
          for (; !(l = (n = o.call(r)).done) && (c.push(n.value), c.length !== t); l = true)
            ;
      } catch (e2) {
        u = true, i = e2;
      } finally {
        try {
          if (!l && null != r.return && (a = r.return(), Object(a) !== a))
            return;
        } finally {
          if (u)
            throw i;
        }
      }
      return c;
    }
  }
  function _typeof(e) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
      return typeof e2;
    } : function(e2) {
      return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
    })(e);
  }
  function _defineProperty(e, t, r) {
    return (t = _toPropertyKey(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: true, configurable: true, writable: true }) : e[t] = r, e;
  }
  function _slicedToArray(e, t) {
    return _arrayWithHoles(e) || _iterableToArrayLimit(e, t) || _unsupportedIterableToArray(e, t) || _nonIterableRest();
  }
  function _toConsumableArray(e) {
    return _arrayWithoutHoles(e) || _iterableToArray(e) || _unsupportedIterableToArray(e) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(e) {
    if (Array.isArray(e))
      return _arrayLikeToArray(e);
  }
  function _arrayWithHoles(e) {
    if (Array.isArray(e))
      return e;
  }
  function _iterableToArray(e) {
    if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"])
      return Array.from(e);
  }
  function _unsupportedIterableToArray(e, t) {
    if (e) {
      if ("string" == typeof e)
        return _arrayLikeToArray(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      return "Map" === (r = "Object" === r && e.constructor ? e.constructor.name : r) || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? _arrayLikeToArray(e, t) : void 0;
    }
  }
  function _arrayLikeToArray(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, n = new Array(t); r < t; r++)
      n[r] = e[r];
    return n;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(e, t) {
    var r, n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
    if (!n) {
      if (Array.isArray(e) || (n = _unsupportedIterableToArray(e)) || t && e && "number" == typeof e.length)
        return n && (e = n), r = 0, { s: t = function() {
        }, n: function() {
          return r >= e.length ? { done: true } : { done: false, value: e[r++] };
        }, e: function(e2) {
          throw e2;
        }, f: t };
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var i, o = true, a = false;
    return { s: function() {
      n = n.call(e);
    }, n: function() {
      var e2 = n.next();
      return o = e2.done, e2;
    }, e: function(e2) {
      a = true, i = e2;
    }, f: function() {
      try {
        o || null == n.return || n.return();
      } finally {
        if (a)
          throw i;
      }
    } };
  }
  function _toPrimitive(e, t) {
    if ("object" != typeof e || null === e)
      return e;
    var r = e[Symbol.toPrimitive];
    if (void 0 === r)
      return ("string" === t ? String : Number)(e);
    r = r.call(e, t || "default");
    if ("object" != typeof r)
      return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  function _toPropertyKey(e) {
    e = _toPrimitive(e, "string");
    return "symbol" == typeof e ? e : String(e);
  }
  function isStringTemplateArray(e) {
    return e instanceof Array && e.raw instanceof Array;
  }
  var isSafari = function() {
    var e = navigator.userAgent;
    return /Safari/.test(e) && !/Chrome/.test(e);
  }();
  var AlinsType;
  var OprateType;
  var type = Symbol("t");
  var util = Symbol("u");
  var child = Symbol("c");
  var empty = Symbol("e");
  var trig = Symbol("t");
  var pureproxy = Symbol("pp");
  function proxyItem(r, e, n) {
    return r[util].shallow ? e : e.map(function(e2, t) {
      return e2 && "object" === _typeof(e2) ? createProxy(e2, { commonLns: r[util].commonLns, path: r[util].path, key: "".concat(n + t) }) : e2;
    });
  }
  function triggerOprationEvent(e, t, r, n, i, o) {
    null != (e = e[trig]) && e.forEach(function(e2) {
      e2({ type: t, data: n, index: r, count: i, fromAssign: o });
    });
  }
  function wrapArrayCall(e, t) {
    e[util].replaceLns = false;
    t = t();
    return delete e[util].replaceLns, t;
  }
  !function(e) {
    e[e.ElementBuilder = 1] = "ElementBuilder", e[e.Element = 2] = "Element", e[e.TextNode = 3] = "TextNode", e[e.Proxy = 4] = "Proxy", e[e.Ref = 5] = "Ref", e[e.BindResult = 6] = "BindResult", e[e.If = 7] = "If", e[e.Switch = 8] = "Switch";
  }(AlinsType = AlinsType || {}), function(e) {
    e[e.Replace = 0] = "Replace", e[e.Remove = 1] = "Remove", e[e.Insert = 2] = "Insert", e[e.Push = 3] = "Push", e[e.Sort = 4] = "Sort";
  }(OprateType = OprateType || {});
  var ArrayMap = { splice: function(e, t) {
    var r = this.target, n = this.origin;
    e >= r.length ? (e = r.length, t = 0) : (void 0 === t || e + t > r.length) && (t = r.length - e);
    for (var i = arguments.length, o = new Array(2 < i ? i - 2 : 0), a = 2; a < i; a++)
      o[a - 2] = arguments[a];
    var c = o.length, l = Math.min(t, c), u = e + l;
    t < c ? (l = proxyItem(r, o.slice(l), u), triggerOprationEvent(r, OprateType.Insert, u, l, l.length)) : (l = t - c, triggerOprationEvent(r, OprateType.Remove, u, r.slice(u, u + l), l));
    for (var f = e; f < u; f++) {
      var s = o[f - e];
      triggerOprationEvent(r, OprateType.Replace, f, [s, r[f]], 1);
    }
    var p = r[util].scopeItems, y = null == p ? void 0 : p.slice(e, e + o.length).map(function(e2) {
      return e2[p.key].v;
    });
    return wrapArrayCall(r, function() {
      return n.call.apply(n, [r[util].proxy, e, t].concat(_toConsumableArray(y)));
    });
  }, push: function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    var n = this.target, i = this.origin, t = proxyItem(n, t, n.length);
    return triggerOprationEvent(n, OprateType.Push, n.length, t, t.length), i.call.apply(i, [n[util].proxy].concat(_toConsumableArray(t)));
  }, pop: function() {
    var e = this.target, t = this.origin;
    return 0 < e.length && triggerOprationEvent(e, OprateType.Remove, e.length - 1, [e[e.length - 1]], 1), t.call(e[util].proxy);
  }, unshift: function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    var n = this.target, i = this.origin, t = proxyItem(n, t, 0);
    return triggerOprationEvent(n, OprateType.Insert, 0, t, t.length), wrapArrayCall(n, function() {
      return i.call.apply(i, [n[util].proxy].concat(_toConsumableArray(t)));
    });
  }, shift: function() {
    var e = this.target, t = this.origin;
    return 0 < e.length && triggerOprationEvent(e, OprateType.Remove, 0, e[0], 1), t.call(e[util].proxy);
  }, replace: function(e, t, r, n) {
    triggerOprationEvent(e, OprateType.Replace, t, [n, r], 1), e[t] = n;
  } };
  var mapFunc = {};
  function registArrayMap(e) {
    mapFunc.map = e;
  }
  function arrayFuncProxy(e, t, r) {
    return ArrayMap[t] && e[trig] && !e[t].hack ? (e[t] = ArrayMap[t].bind({ target: e, origin: e[t] }), e[t].hack = true, e[t]) : mapFunc[t] ? mapFunc[t].bind(e) : Reflect.get(e, t, r);
  }
  function replaceArrayItem(e, t, r) {
    return e[trig] ? (ArrayMap.replace(e, parseInt(t), e[t], r), true) : empty;
  }
  var currentFn = null;
  var depReactive = false;
  function isDepReactive() {
    return depReactive;
  }
  function observe(e) {
    currentFn = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : e, depReactive = false;
    var t = e();
    return currentFn = null, t;
  }
  function isRef(e) {
    return (null == e ? void 0 : e[type]) === AlinsType.Ref;
  }
  function isProxy(e) {
    e = null == e ? void 0 : e[type];
    return e === AlinsType.Proxy || e === AlinsType.Ref;
  }
  function wrapReactive(e) {
    return 1 < arguments.length && void 0 !== arguments[1] && arguments[1] || !e || "object" !== _typeof(e) ? _defineProperty({ v: e }, type, AlinsType.Ref) : e;
  }
  function createUtils(a, t, e) {
    function r(t2, r2, n, i, e2) {
      function o(e3) {
        e3(r2, n, "".concat(c.join("."), ".").concat(t2), t2, i);
      }
      e2 && null != (e2 = a[util].commonLns) && e2.forEach(o), null != (e2 = a[util].lns[t2]) && e2.forEach(o), null != (e2 = a[util].extraLns) && e2.forEach(function(e3) {
        null != (e3 = e3[t2]) && e3.forEach(o);
      });
    }
    var c = t ? [].concat(_toConsumableArray(e), [t]) : _toConsumableArray(e), e = Array.isArray(a);
    a[util].commonLns && (a[util].lns[t] = /* @__PURE__ */ new Set(), a[util].commonLns.forEach(function(e2) {
      a[util].lns[t].add(e2);
    })), Object.assign(a[util], { path: c, triggerChange: r, forceWrite: function(e2) {
      for (var t2 in e2)
        r(t2, e2[t2], a[t2]);
      Object.assign(a, e2);
    }, subscribe: function(e2) {
      var t2, r2, n, i = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
      for (n in null != (t2 = a[util].commonLns) && t2.add(e2) || (a[util].commonLns = /* @__PURE__ */ new Set([e2])), a)
        null != (r2 = a[util].lns[n]) && r2.add(e2) || (a[util].lns[n] = /* @__PURE__ */ new Set([e2])), i && isProxy(a[n]) && a[n][util].subscribe(e2, i);
    }, isArray: e, forceUpdate: function() {
      for (var e2 in a)
        r(e2, a[e2], a[e2]);
    } });
  }
  function createProxy(c) {
    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, t = e.commonLns, r = e.lns, i = void 0 === r ? {} : r, r = e.shallow, l = void 0 !== r && r, u = e.set, o = e.get, r = e.path, f = void 0 === r ? [] : r, r = e.key, e = void 0 === r ? "" : r;
    if (c[type] || (c[type] = AlinsType.Proxy), !l)
      for (var n in c) {
        var a = c[n];
        if (a && "object" === _typeof(a))
          try {
            c[n] = createProxy(a, { path: f, key: n });
          } catch (e2) {
          }
      }
    c[util] = { commonLns: t, lns: i, shallow: l }, createUtils(c, e, f);
    var r = c[util], s = r.triggerChange, p = r.isArray, t = new Proxy(c, { get: function(e2, t2, r2) {
      var n2 = "function" == typeof e2[t2];
      if (p && n2)
        return arrayFuncProxy(e2, t2, r2);
      if ("symbol" === _typeof(t2) || n2) {
        if (t2 === pureproxy)
          return true;
      } else {
        if (currentFn)
          return depReactive = depReactive || true, null != (n2 = i[t2]) && n2.add(currentFn) || (i[t2] = /* @__PURE__ */ new Set([currentFn])), Reflect.get(e2, t2, r2);
        if ("v" === t2 && o)
          return o();
      }
      return Reflect.get(e2, t2, r2);
    }, set: function(e2, t2, r2, n2) {
      if ("symbol" === _typeof(t2) || "function" == typeof e2[t2])
        return Reflect.set(e2, t2, r2, n2);
      var i2 = e2[t2];
      if (r2 === i2 && (null == (a2 = e2[util]) || !a2._map))
        return true;
      if (null === u)
        return console.warn("Computed \u4E0D\u53EF\u8BBE\u7F6E"), true;
      if ("v" === t2 && u)
        return u(r2, i2, "".concat(f.join("."), ".").concat(t2), t2), true;
      r2 && "object" === _typeof(r2) && !l && (isProxy(r2) ? (r2[pureproxy] || (r2 = r2[util].proxy), isProxy(i2) && false !== c[util].replaceLns && replaceLNS(r2, i2)) : (i2 && (i2[util].removed = true), r2 = createProxy(r2, { commonLns: e2[util].commonLns, lns: null == i2 ? void 0 : i2[util].lns, shallow: l, path: f, key: t2 })));
      var o2, a2 = empty;
      return p && /^\d+$/.test(t2) && ((o2 = replaceArrayItem(e2, t2, r2)) !== empty && (a2 = o2)), a2 === empty && (a2 = Reflect.set(e2, t2, r2, n2)), s(t2, r2, i2, false, void 0 === i2), a2;
    }, deleteProperty: function(e2, t2) {
      return s(t2, void 0, e2[t2], true), Reflect.deleteProperty(e2, t2);
    } });
    return c[util].proxy = t;
  }
  function replaceLNS(e, t) {
    var r, n, i = e[util], o = t[util];
    for (n in o.extraLns && o.extraLns.has(i.lns) ? (r = i.lns, i.lns = o.lns, o.lns = r, o.extraLns.delete(r)) : i.extraLns ? i.extraLns.add(o.lns) : i.extraLns = /* @__PURE__ */ new Set([o.lns]), e)
      isProxy(e[n]) && isProxy(t[n]) && replaceLNS(e[n], t[n]);
  }
  function computed(e) {
    var t, r = "function" == typeof e, n = r ? e : e.get, r = r ? null : e.set, e = observe(n, function() {
      t[util].forceWrite(wrapReactive(n(), true));
    });
    return isDepReactive() ? t = createProxy(wrapReactive(e, true), { set: r, get: n }) : { v: e };
  }
  function isValueEqual(e, t) {
    var r = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2], n = !(3 < arguments.length && void 0 !== arguments[3]) || arguments[3];
    if (e && t && "object" === _typeof(e) && "object" === _typeof(t) && (n || r)) {
      if (Array.isArray(e)) {
        if (e.length !== t.length)
          return false;
      } else if (Object.keys(e).length !== Object.keys(t).length)
        return false;
      for (var i in e)
        if (!isValueEqual(e[i], t[i], r, false))
          return false;
      return true;
    }
    return e === t;
  }
  function watch(e, t) {
    var r = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2];
    if ("function" == typeof e) {
      e = computed(e);
      var o = t;
      t = function(e2, t2, r2, n, i) {
        isValueEqual(e2, t2) || o(e2, t2, r2, n, i);
      };
    } else if (!isProxy(e))
      return e;
    return e[util] && e[util].subscribe(t, r), e;
  }
  function watchArray(e, t) {
    e[trig] ? e[trig].push(t) : e[trig] = [t];
  }
  var binding = Symbol("b");
  function createBinding(o, e) {
    for (var t = 0; t < e.length; t++) {
      var r = e[t];
      isRef(r) || "function" == typeof r || (o[t] = "".concat(o[t]).concat(r).concat(o[t + 1]), o.splice(t + 1, 1), e.splice(t, 1), t--);
    }
    if (0 === e.length)
      return o[0];
    function n(r2) {
      var n2 = e.map(function(e2) {
        return "function" == typeof e2 ? function() {
          return e2();
        } : function() {
          return e2.v;
        };
      }), i = n2.length;
      return watch(function() {
        for (var e2 = o[0], t2 = 0; t2 < i; t2++)
          e2 += n2[t2]() + o[t2 + 1];
        return e2;
      }, function(e2, t2) {
        r2(e2, t2);
      }, false).v;
    }
    return n[type] = AlinsType.BindResult, n;
  }
  function react(e) {
    if (isStringTemplateArray(e)) {
      for (var t = arguments.length, r = new Array(1 < t ? t - 1 : 0), n = 1; n < t; n++)
        r[n - 1] = arguments[n];
      return createBinding(e, r);
    }
    return createProxy(wrapReactive(e));
  }
  var SwitchResult;
  var Renderer = { createElement: function(e) {
    e = document.createElement(e);
    return e[type] = AlinsType.Element, e;
  }, createTextNode: function(e) {
    e = document.createTextNode(e);
    return e[type] = AlinsType.TextNode, e;
  }, createEmptyMountNode: function() {
    return document.createComment("");
  }, createDocumentFragment: function() {
    return document.createDocumentFragment();
  }, isFragment: function(e) {
    return e instanceof DocumentFragment;
  }, isOriginElement: function(e) {
    return e instanceof Node;
  }, isElement: function(e) {
    return this.isFragment(e) || this.isOriginElement(e);
  } };
  function getFirstElement(e) {
    return e ? Renderer.isFragment(e) ? e.firstChild : e : null;
  }
  function getParent(e) {
    return e.parentElement || e.parentNode || (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null);
  }
  function createAnchor(a) {
    function c() {
      var e = f;
      if (e !== u) {
        for (; e.nextSibling && e.nextSibling !== u; )
          try {
            e.nextSibling.remove();
          } catch (e2) {
            console.error(e2);
            break;
          }
        e.remove();
      }
      f = u;
    }
    var l, u = null, f = null;
    return { getNodes: function() {
      for (var e = [], t = f; t && t !== u; )
        e.push(t), t = t.nextSibling;
      return e;
    }, start: function() {
      return f;
    }, setStart: function(e) {
      e && (f = getFirstElement(e) || u);
    }, replaceStart: function(e, t) {
      getFirstElement(e) === f && (f = getFirstElement(t));
    }, replaceBranch: function(e) {
      var t = e.current(), r = a.call(e);
      return console.log("branch debug:dom", r), e.inited ? r ? e.isVisible(t) && (console.log("branch debug:replace 222"), this.replaceContent(r, e)) : (console.log("branch debug:clearDom"), c(), e.updateActiveCache()) : (e.inited = true, console.log("branch debug:replace 111"), this.replaceContent(r, e)), r;
    }, replaceContent: function(t, e) {
      if (!u || !f)
        return console.log("branch debug:replaceContent"), l = function(e2) {
          if (u = Renderer.createEmptyMountNode(), f = getFirstElement(e2) || u, Renderer.isFragment(e2))
            return e2.appendChild(u), e2;
          var t2 = Renderer.createDocumentFragment();
          return e2 && t2.appendChild(e2), t2.appendChild(u), t2;
        }(t);
      var r = getParent(u, l);
      if (r !== t) {
        if (c(), !t)
          return null != e && e.updateActiveCache(), t;
        for (var n = getFirstElement(t), i = n || u, o = null == e ? void 0 : e.parent; o && o.anchor.start() === f; )
          o.anchor.setStart(i), o.call && a.modifyCache(o, n), o = o.parent;
        f = i, console.log("branch debug:container insert", r, f, u);
        try {
          r.insertBefore(t, u), null != e && e.updateActiveCache();
        } catch (e2) {
          console.error(e2, r, t, u);
        }
      }
      return t;
    }, clearCache: function() {
    } };
  }
  function _if(e, t, i) {
    console.log("branch debug:enter if", t.toString());
    function o(e2) {
      if (l === e2)
        return true;
      var t2 = c[l = e2];
      return a.replaceBranch(t2), console.warn("switch node", e2), false !== t2.call.returned;
    }
    function r(e2) {
      console.warn("if onDataChange", e2);
      for (var t2, r2 = e2.length, n2 = 0; n2 < r2; n2++)
        if (e2[n2])
          return (t2 = o(n2)) || n2 === r2 - 1 ? t2 : o(r2 - 1);
    }
    function n(e2, t2) {
      var r2 = u, n2 = u++;
      c[n2] = i.branch.next(t2, a, 2 < arguments.length && void 0 !== arguments[2] && arguments[2]), s[n2] = e2, f === empty && ("function" == typeof e2 ? e2() : e2.v) && (n2 = i.cache.call(c[n2], a), false !== t2.returned && (l = r2, f = n2));
    }
    var a = createAnchor(i.cache), c = [], l = -1, u = 0, f = empty, s = [], p = (n(e, t, true), { elif: function(e2, t2) {
      return n(e2, t2), p;
    }, else: function(e2) {
      return n(function() {
        return true;
      }, e2), p;
    }, end: function() {
      return n(function() {
        return true;
      }, 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : function() {
      }), watch(function() {
        return s.map(function(e2) {
          return "function" == typeof e2 ? e2() : e2.v;
        });
      }, r, false), i.branch.back(), f !== empty ? a.replaceContent(f) : Renderer.createDocumentFragment();
    } });
    return p;
  }
  function _switch(o, c, l) {
    function u(e) {
      var t = e.call, e = e.brk;
      if (t) {
        t = y.get(t);
        if (!t)
          throw new Error("empty branch");
        t = p ? l.cache.call(t, s) : s.replaceBranch(t);
        if (t)
          return d = SwitchResult.Return, t;
      }
      return d = e ? SwitchResult.Break : SwitchResult.Continue, !!e;
    }
    function a(e) {
      var t, r, n = false, i = (d = SwitchResult.Init, null), o2 = _createForOfIteratorHelper(c);
      try {
        for (o2.s(); !(t = o2.n()).done; ) {
          var a2 = t.value;
          if (n) {
            if (i = u(a2))
              break;
          } else if ((a2.value === e || !("value" in a2)) && (n = true, i = u(a2)))
            break;
        }
      } catch (e2) {
        o2.e(e2);
      } finally {
        o2.f();
      }
      return d !== SwitchResult.Return && (r = y.get(f), i = p ? l.cache.call(r, s) : s.replaceBranch(r)), i;
    }
    var f, s = createAnchor(l.cache), p = true, y = /* @__PURE__ */ new WeakMap(), d = SwitchResult.Init;
    return { end: function() {
      f = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : function() {
      };
      var e, t = watch(o, function(e2) {
        a(e2);
      }), r = true, n = _createForOfIteratorHelper(c);
      try {
        for (n.s(); !(e = n.n()).done; ) {
          var i = e.value;
          i.call && (y.set(i.call, l.branch.next(i.call, s, r)), r = r && false);
        }
      } catch (e2) {
        n.e(e2);
      } finally {
        n.f();
      }
      y.set(f, l.branch.next(f, s, r)), l.branch.back();
      t = a(t.v);
      return p = false, Renderer.isElement(t) ? s.replaceContent(t) : Renderer.createDocumentFragment();
    } };
  }
  function map(a) {
    var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1], g = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "$item", m = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "", b = this;
    if (!e)
      return b.map(a);
    var A = Renderer.createDocumentFragment(), e = isProxy(b), t = b.length;
    if (e) {
      let x = function(e2, t2) {
        console.log("createChild", e2, t2);
        var r2, n2, e2 = _(e2, t2), i2 = a(e2[g], e2[m] || t2), o2 = i2;
        return i2 ? Renderer.isFragment(i2) ? 0 === (n2 = (r2 = i2.childNodes).length) ? (o2 = Renderer.createEmptyMountNode(), i2.appendChild(o2), 0 === t2 && (w = o2)) : (o2 = r2[n2 - 1], 0 === t2 && (w = r2[0])) : 0 === t2 && (w = i2) : (o2 = i2 = Renderer.createEmptyMountNode(), 0 === t2 && (w = i2)), console.log(w, t2), [i2, o2, e2];
      };
      for (var w, E = Renderer.createEmptyMountNode(), S = [], R = [], _ = (b[util].scopeItems = R, b[util]._map = true, R.key = g, function(e2, t2) {
        e2 = createProxy({ v: e2 }, { shallow: true });
        e2 = _defineProperty({}, g, e2);
        return m && (e2[m] = createProxy({ v: t2 }, { shallow: true })), e2;
      }), r = 0; r < t; r++) {
        var n = b[r], n = _slicedToArray(x(n, r), 3), i = n[0], o = n[1], n = n[2];
        R[r] = n, A.appendChild(i), S[r] = o;
      }
      watchArray(b, function(e2) {
        var t2, n2 = e2.index, r2 = e2.count, i2 = e2.data;
        switch (e2.type) {
          case OprateType.Push:
            for (var o2 = Renderer.createDocumentFragment(), a2 = b.length, c2 = 0; c2 < i2.length; c2++) {
              var l2 = _slicedToArray(x(i2[c2], a2 + c2), 3), u = l2[0], f = l2[1], l2 = l2[2];
              S.push(f), R.push(l2), o2.appendChild(u);
            }
            getParent(E, A).insertBefore(o2, E);
            break;
          case OprateType.Replace:
            R[n2] ? (console.warn("\u3010debug: watch array replace2", n2, JSON.stringify(i2)), i2[0] !== R[n2][g].v && (R[n2][g].v = i2[0]), m && (R[n2][m].v = n2)) : R[n2] = _(i2[0], n2);
            break;
          case OprateType.Remove:
            if (0 === r2)
              break;
            for (var s = n2 - 1, p = (null == (t2 = S[s + r2]) ? void 0 : t2.nextSibling) || E, y = s < 0 ? w || E : S[s]; y.nextSibling && y.nextSibling !== p; )
              y.nextSibling.remove();
            s < 0 && (y !== E ? (w = y.nextSibling, y.remove()) : w = E), S.splice(n2, r2), R.splice(n2, r2);
            break;
          case OprateType.Insert:
            var d = 0 === n2 ? w || E : S[n2 - 1].nextSibling, v = [], h = [];
            i2.forEach(function(e3, t3) {
              var e3 = _slicedToArray(x(e3, n2 + t3), 3), t3 = e3[0], r3 = e3[1], e3 = e3[2];
              getParent(d, A).insertBefore(t3, d), h.push(e3), v.push(r3);
            }), R.splice.apply(R, [n2, 0].concat(h)), S.splice.apply(S, [n2, 0].concat(v));
        }
      }), A.appendChild(E);
    } else
      for (var c = 0; c < t; c++) {
        var l = a(b[c], c);
        l && A.appendChild(l);
      }
    return A;
  }
  function isEventAttr(e, t, r) {
    return !!t.startsWith("on") && ((null === e[t] || "function" == typeof e[t]) && ("function" == typeof r || "function" == typeof (null == r ? void 0 : r.listener) || "string" == typeof (null == r ? void 0 : r.__deco)));
  }
  function addEvent(r, n, i) {
    if (n = n.substring(2), "function" == typeof i)
      r.addEventListener(n, i);
    else {
      if (i.__deco) {
        var e, t = i.__deco.split("-"), o = (i = { listener: i.v }, _createForOfIteratorHelper(t));
        try {
          for (o.s(); !(e = o.n()).done; ) {
            var a = e.value;
            i[a] = true;
          }
        } catch (e2) {
          o.e(e2);
        } finally {
          o.f();
        }
      }
      r.addEventListener(n, function e2(t2) {
        i.self && t2.target !== r || (i.stop && t2.stopPropagation(), i.prevent && t2.preventDefault(), i.once && r.removeEventListener(n, e2, i.capture), i.listener(t2));
      }, i.capture);
    }
  }
  function reactiveBindingEnable(e, i) {
    var t = "object" === _typeof(e) && !isProxy(e) && void 0 !== e.enable, r = t ? e.value : e, o = true, a = "", a = reactiveBinding(r, function(e2, t2, r2, n) {
      a = e2, o && i(e2, t2, r2, n);
    });
    return t && (o = watch(e.enable, function(e2) {
      i((o = e2) ? a : null, null, "", "");
    }).v), i(o ? a : null, void 0, "", ""), a;
  }
  function reactiveBindingValue(e, t) {
    t(reactiveBinding(e, t), void 0, "", "");
  }
  function reactiveClass(i, o) {
    if (isRef(i) || "object" !== _typeof(i))
      return reactiveBinding(i, function(e2) {
        o("", e2);
      });
    var e = function() {
      var e2, r, t, n = {};
      i.$value ? (e2 = reactiveBinding(i.$value, function(e3) {
        var t2, r2 = /* @__PURE__ */ new Set([]);
        for (t2 in n)
          true === n[t2] && r2.add(t2);
        e3.split(" ").forEach(function(e4) {
          false !== n[e4] && r2.add(e4);
        }), o("", Array.from(r2).join(" "));
      }), r = new Set(e2.split(" ")), delete i.$value) : r = /* @__PURE__ */ new Set([]);
      for (t in i)
        !function(t2) {
          r[(n[t2] = !!reactiveBinding(i[t2], function(e3) {
            n[t2] = e3, o(t2, e3);
          })) ? "add" : "delete"](t2);
        }(t);
      return { v: Array.from(r).join(" ") };
    }();
    return "object" === _typeof(e) ? e.v : void 0;
  }
  function reactiveBinding(e, t) {
    if ("function" == typeof e || isProxy(e) && void 0 !== e.v)
      return watch(e, t).v;
    try {
      return "string" == typeof e ? e : e.toString();
    } catch (e2) {
      throw new Error(e2);
    }
  }
  function parseStyle(c, e) {
    if (null == e)
      return false;
    if ("function" == typeof e || isProxy(e))
      reactiveBindingEnable(e, function(e2, t2, r, n, i) {
        if ("string" == typeof e2)
          n && "v" !== n ? c.style[n] = i ? "" : e2 : c.setAttribute("style", e2);
        else {
          for (var o in e2)
            c.style[o] = e2[o];
          for (var a in t2)
            void 0 === e2[a] && (c.style[a] = "");
        }
      });
    else {
      if ("object" !== _typeof(e))
        return false;
      for (var t in e)
        !function(t2) {
          reactiveBindingEnable(e[t2], function(e2) {
            c.style[t2] = null === e2 ? "" : e2;
          });
        }(t);
    }
    return true;
  }
  !function(e) {
    e[e.Init = 0] = "Init", e[e.Break = 1] = "Break", e[e.Return = 2] = "Return", e[e.Continue = 3] = "Continue";
  }(SwitchResult = SwitchResult || {}), registArrayMap(map);
  var ModelTag = { INPUT: 1, SELECT: 1, TEXTAREA: 1 };
  function parseModel(t, e, r) {
    if ("value" !== r && "checked" !== r)
      return false;
    if (!isProxy(e) && !e.__deco)
      return false;
    var n = t.tagName;
    if (!ModelTag[n])
      return false;
    var i = e.__deco || _typeof(e.v), o = (o = { boolean: function(e2) {
      return "true" === e2;
    }, number: function(e2) {
      return parseFloat(e2);
    }, string: function(e2) {
      return e2;
    } }[i]) || function(e2) {
      return e2;
    }, a = e.__deco ? e.v : e;
    return t.addEventListener("SELECT" === n ? "change" : "input", function() {
      var e2 = t[r];
      i !== _typeof(e2) && (e2 = o(e2)), a.v = Number.isNaN(e2) ? "" : e2;
    }), watch(a, function(e2) {
      t[r] = e2;
    }, false), t[r] = a.v, true;
  }
  function parseAttributes(y, e) {
    if (null == e)
      return false;
    if ("function" == typeof e || isProxy(e))
      reactiveBindingEnable(e, function(e2, t2, r, n, i) {
        if ("string" == typeof e2) {
          if (n && "v" !== n)
            return void (i ? y.removeAttribute(n) : y.setAttribute(n, e2));
          var o, i = e2.matchAll(/(.*?)=(.*?)(&|$)/g), a = (e2 = {}, _createForOfIteratorHelper(i));
          try {
            for (a.s(); !(o = a.n()).done; ) {
              var c = o.value;
              e2[c[1]] = c[2];
            }
          } catch (e3) {
            a.e(e3);
          } finally {
            a.f();
          }
          var l, n = t2.matchAll(/(.*?)=(.*?)(&|$)/g), u = (t2 = {}, _createForOfIteratorHelper(n));
          try {
            for (u.s(); !(l = u.n()).done; ) {
              var f = l.value;
              t2[f[1]] = f[2];
            }
          } catch (e3) {
            u.e(e3);
          } finally {
            u.f();
          }
        }
        for (var s in e2)
          y.setAttribute(s, e2[s]);
        for (var p in t2)
          void 0 === e2[p] && y.removeAttribute(p);
      });
    else {
      if ("object" !== _typeof(e))
        return false;
      for (var t in e)
        !function(t2) {
          reactiveBindingEnable(e[t2], function(e2) {
            null === e2 ? y.removeAttribute(e2) : y.setAttribute(t2, e2);
          });
        }(t);
    }
    return true;
  }
  function transformOptionsToElement(r) {
    if (r.isText)
      n = Renderer.createTextNode(""), "" !== r.text && reactiveBindingValue(r.text, function(e2) {
        n.textContent = e2;
      });
    else {
      var e = !!r.tag, n = e ? Renderer.createElement(r.tag) : Renderer.createDocumentFragment();
      if (r.children && appendChildren(n, r.children), e)
        for (var t in r.attributes)
          (function(t2) {
            var e2 = r.attributes[t2];
            if (isEventAttr(n, t2, e2))
              return addEvent(n, t2, e2);
            if ("$parent" === t2)
              e2.appendChild(n);
            else if ("$attributes" === t2)
              parseAttributes(n, e2);
            else if ("$show" === t2)
              reactiveBindingEnable(e2, function(e3) {
                n.style.display = e3 ? "" : "none";
              });
            else {
              if ("class" !== t2)
                return "style" === t2 && parseStyle(n, e2) || parseModel(n, e2, t2) || reactiveBindingEnable(e2, function(e3) {
                  null === e3 ? n.removeAttribute(t2) : n.setAttribute(t2, e3);
                });
              n.className = reactiveClass(e2, function(e3, t3) {
                e3 ? t3 ? n.classList.add(e3) : n.classList.remove(e3) : n.className = t3;
              });
            }
          })(t);
    }
    return n;
  }
  function appendChildren(e, t) {
    var r, n = _createForOfIteratorHelper(t);
    try {
      for (n.s(); !(r = n.n()).done; ) {
        var i, o = r.value;
        if (null != o) {
          if (Array.isArray(o))
            return void appendChildren(e, o);
          Renderer.isElement(o) ? e.appendChild(o) : (i = transformOptionsToElement(isJSXElement(o) ? o : { text: o, isText: true }), e.appendChild(i));
        }
      }
    } catch (e2) {
      n.e(e2);
    } finally {
      n.f();
    }
  }
  function isJSXElement(e) {
    return "object" === _typeof(e) && true === e.jsx;
  }
  var JSX = { createElement: function(e) {
    for (var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null, r = arguments.length, n = new Array(2 < r ? r - 2 : 0), i = 2; i < r; i++)
      n[i - 2] = arguments[i];
    if ("function" != typeof e)
      return transformOptionsToElement({ tag: e, attributes: t, children: n, jsx: true });
    var o, a = t.$parent;
    for (o in delete t.$parent, t) {
      var c = t[o];
      isProxy(c) || (t[o] = { v: c });
    }
    var l = transformAsyncDom(e(t, n));
    return a && a.appendChild(l), l;
  } };
  function transformAsyncDom(e) {
    var t = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1], r = 2 < arguments.length ? arguments[2] : void 0;
    if (e && e instanceof Promise) {
      if (false === t)
        return;
      var n = Renderer.createDocumentFragment(), i = Renderer.createEmptyMountNode();
      return n.appendChild(i), e.then(function(e2) {
        if (Renderer.isElement(e2)) {
          var t2 = getParent(i, n);
          try {
            t2.insertBefore(e2, i);
          } catch (e3) {
            console.log("node \u5DF2\u88AB\u9690\u85CF");
          } finally {
            null != r && r(e2), i.remove();
          }
        }
      }), n;
    }
    return e;
  }
  function transformElementToCache(e) {
    return e ? Renderer.isFragment(e) ? Array.from(e.childNodes) : Array.isArray(e) ? e : [e] : null;
  }
  function transformCacheToElement(e) {
    if (!e)
      return null;
    if (1 === e.length)
      return e[0];
    var t, r = Renderer.createDocumentFragment(), n = _createForOfIteratorHelper(e);
    try {
      for (n.s(); !(t = n.n()).done; ) {
        var i = t.value;
        r.appendChild(i);
      }
    } catch (e2) {
      n.e(e2);
    } finally {
      n.f();
    }
    return r;
  }
  function createCallCache() {
    var c = /* @__PURE__ */ new WeakMap();
    return { call: function(t, r) {
      var n = this, e = (t.visit(), t.call), i = c.get(e);
      if (console.log("branch debug:item", t.id, i), void 0 !== i)
        return transformCacheToElement(i);
      var o, a, i = e();
      if (false === e.returned ? o = transformAsyncDom(i, false) : a = getFirstElement(o = transformAsyncDom(i, !(a = null), function(e2) {
        n.modifyCache(t, e2), null != r && r.replaceStart(a, e2), a = null;
      })), Renderer.isElement(o) || void 0 === o)
        return this.modifyCache(t, o), o;
      throw new Error("\u52A8\u6001\u6761\u4EF6\u5206\u652F\u4E2D\u4E0D\u5141\u8BB8\u8FD4\u56DE\u975E\u5143\u7D20\u7C7B\u578B");
    }, modifyCache: function(e, t) {
      e.call && (t = transformElementToCache(t), console.log("branch debug: cacheMap set", e.id, t), c.set(e.call, t));
    }, setCache: function(e, t) {
      c.set(e, t);
    }, _get: function(e) {
      return c.get(e);
    } };
  }
  function createBranchLink(i, e) {
    console.log("createBranchLink");
    var o = [], a = 0, c = { anchor: e, parent: null }, l = null, u = null, f = false;
    return { next: function(e2, t) {
      var r = 2 < arguments.length && void 0 !== arguments[2] && arguments[2], n = function(e3, r2) {
        var t2 = 0 === o.length ? c : o[o.length - 1], t2 = 2 < arguments.length && void 0 !== arguments[2] && arguments[2] ? t2 : null == t2 ? void 0 : t2.parent;
        return { id: a++, call: e3, parent: t2, activeChild: null, anchor: r2, current: function() {
          return l;
        }, isVisible: function(e4) {
          if (!u) {
            u = /* @__PURE__ */ new WeakMap();
            for (var t3 = e4 || l, r3 = []; t3; )
              r3.push(t3.id), u.set(t3, 1), t3 = t3.parent;
            console.log("branch debug:branchpath", r3.toString());
          }
          if (!!u.get(this))
            return true;
          var n2 = this.parent;
          if (!n2 || u.get(n2))
            return true;
          for (; n2; ) {
            if (!!u.get(n2))
              break;
            n2 = n2.parent;
          }
          return false;
        }, visit: function() {
          l !== this && (f && (o = [this]), (l = this).parent && (this.parent.activeChild = this), u = null);
        }, updateCache: function() {
          var e4, t3 = r2.getNodes();
          console.log("branch debug: updateCache", this.id, t3), i.setCache(this.call, t3), null != (e4 = null == (t3 = this.parent) ? void 0 : t3.updateCache) && e4.call(t3);
        }, updateActiveCache: function() {
          var e4, t3;
          null != (t3 = null == (e4 = this.getBottomChild().parent) ? void 0 : e4.updateCache) && t3.call(e4);
        }, clearCache: function() {
        }, getBottomChild: function() {
          for (var e4 = this; e4.activeChild; )
            e4 = e4.activeChild;
          return e4;
        } };
      }(e2, t, r);
      return r ? o.push(n) : o[o.length - 1] = n, console.warn("branch debug:next:".concat(n.id, ":").concat(r), n.call.toString()), n;
    }, back: function() {
      console.warn("branch:back");
      var e2 = o.pop();
      return 0 === o.length && (f = true), e2;
    } };
  }
  function createContext() {
    var e = createCallCache(), t = createAnchor(e), r = { anchor: t, cache: e, branch: createBranchLink(e, t) };
    return { util: r, if: function(e2, t2) {
      return _if(e2, t2, r);
    }, switch: function(e2, t2) {
      return _switch(e2, t2, r);
    } };
  }
  var ContextTool = { ce: JSX.createElement, mnr: function(e) {
    return e.returned = false, e;
  }, r: react, c: computed, w: watch, cc: function(e, t) {
    return computed({ get: e, set: t });
  } };
  Object.assign(createContext, ContextTool);

  // src/alins.tsx
  window._$$ = createContext;
  var count = createContext.r({
    v: 1
  });
  /* @__PURE__ */ createContext.ce("button", {
    $parent: document.body,
    onclick: () => {
      count.v++;
    }
  }, "click:", count);
})();
