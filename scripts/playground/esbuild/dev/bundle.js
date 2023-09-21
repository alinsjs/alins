(() => {
  // node_modules/.pnpm/alins-utils@0.0.20-beta.1/node_modules/alins-utils/dist/alins-utils.esm.min.js
  function isStringTemplateArray(t) {
    return t instanceof Array && t.raw instanceof Array;
  }
  var isSafari = function() {
    var t = navigator.userAgent;
    return /Safari/.test(t) && !/Chrome/.test(t);
  }();
  var AlinsType;
  var type = Symbol("t");
  var util = Symbol("u");
  var child = Symbol("c");
  var empty = Symbol("e");
  var trig = Symbol("t");
  var pureproxy = Symbol("pp");
  !function(t) {
    t[t.ElementBuilder = 1] = "ElementBuilder", t[t.Element = 2] = "Element", t[t.TextNode = 3] = "TextNode", t[t.Proxy = 4] = "Proxy", t[t.Ref = 5] = "Ref", t[t.BindResult = 6] = "BindResult", t[t.If = 7] = "If", t[t.Switch = 8] = "Switch";
  }(AlinsType = AlinsType || {});

  // node_modules/.pnpm/alins-reactive@0.0.20-beta.1/node_modules/alins-reactive/dist/alins-reactive.esm.min.js
  function _typeof(t) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t2) {
      return typeof t2;
    } : function(t2) {
      return t2 && "function" == typeof Symbol && t2.constructor === Symbol && t2 !== Symbol.prototype ? "symbol" : typeof t2;
    })(t);
  }
  function _defineProperty(t, r, e) {
    return (r = _toPropertyKey(r)) in t ? Object.defineProperty(t, r, { value: e, enumerable: true, configurable: true, writable: true }) : t[r] = e, t;
  }
  function _toConsumableArray(t) {
    return _arrayWithoutHoles(t) || _iterableToArray(t) || _unsupportedIterableToArray(t) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(t) {
    if (Array.isArray(t))
      return _arrayLikeToArray(t);
  }
  function _iterableToArray(t) {
    if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
      return Array.from(t);
  }
  function _unsupportedIterableToArray(t, r) {
    if (t) {
      if ("string" == typeof t)
        return _arrayLikeToArray(t, r);
      var e = Object.prototype.toString.call(t).slice(8, -1);
      return "Map" === (e = "Object" === e && t.constructor ? t.constructor.name : e) || "Set" === e ? Array.from(t) : "Arguments" === e || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? _arrayLikeToArray(t, r) : void 0;
    }
  }
  function _arrayLikeToArray(t, r) {
    (null == r || r > t.length) && (r = t.length);
    for (var e = 0, n = new Array(r); e < r; e++)
      n[e] = t[e];
    return n;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || null === t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 === e)
      return ("string" === r ? String : Number)(t);
    e = e.call(t, r || "default");
    if ("object" != typeof e)
      return e;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  function _toPropertyKey(t) {
    t = _toPrimitive(t, "string");
    return "symbol" == typeof t ? t : String(t);
  }
  var OprateType;
  function proxyItem(e, t, n) {
    return e[util].shallow ? t : t.map(function(t2, r) {
      return t2 && "object" === _typeof(t2) ? createProxy(t2, { commonLns: e[util].commonLns, path: e[util].path, key: "".concat(n + r) }) : t2;
    });
  }
  function triggerOprationEvent(t, r, e, n, i, o) {
    null != (t = t[trig]) && t.forEach(function(t2) {
      t2({ type: r, data: n, index: e, count: i, fromAssign: o });
    });
  }
  function wrapArrayCall(t, r) {
    t[util].replaceLns = false;
    r = r();
    return delete t[util].replaceLns, r;
  }
  !function(t) {
    t[t.Replace = 0] = "Replace", t[t.Remove = 1] = "Remove", t[t.Insert = 2] = "Insert", t[t.Push = 3] = "Push", t[t.Sort = 4] = "Sort";
  }(OprateType = OprateType || {});
  var ArrayMap = { splice: function(t, r) {
    var e = this.target, n = this.origin;
    t >= e.length ? (t = e.length, r = 0) : (void 0 === r || t + r > e.length) && (r = e.length - t);
    for (var i = arguments.length, o = new Array(2 < i ? i - 2 : 0), a = 2; a < i; a++)
      o[a - 2] = arguments[a];
    var l = o.length, u = Math.min(r, l), c = t + u;
    r < l ? (u = proxyItem(e, o.slice(u), c), triggerOprationEvent(e, OprateType.Insert, c, u, u.length)) : (u = r - l, triggerOprationEvent(e, OprateType.Remove, c, e.slice(c, c + u), u));
    for (var p = t; p < c; p++) {
      var y = o[p - t];
      triggerOprationEvent(e, OprateType.Replace, p, [y, e[p]], 1);
    }
    var s = e[util].scopeItems, f = null == s ? void 0 : s.slice(t, t + o.length).map(function(t2) {
      return t2[s.key].v;
    });
    return wrapArrayCall(e, function() {
      return n.call.apply(n, [e[util].proxy, t, r].concat(_toConsumableArray(f)));
    });
  }, push: function() {
    for (var t = arguments.length, r = new Array(t), e = 0; e < t; e++)
      r[e] = arguments[e];
    var n = this.target, i = this.origin, r = proxyItem(n, r, n.length);
    return triggerOprationEvent(n, OprateType.Push, n.length, r, r.length), i.call.apply(i, [n[util].proxy].concat(_toConsumableArray(r)));
  }, pop: function() {
    var t = this.target, r = this.origin;
    return 0 < t.length && triggerOprationEvent(t, OprateType.Remove, t.length - 1, [t[t.length - 1]], 1), r.call(t[util].proxy);
  }, unshift: function() {
    for (var t = arguments.length, r = new Array(t), e = 0; e < t; e++)
      r[e] = arguments[e];
    var n = this.target, i = this.origin, r = proxyItem(n, r, 0);
    return triggerOprationEvent(n, OprateType.Insert, 0, r, r.length), wrapArrayCall(n, function() {
      return i.call.apply(i, [n[util].proxy].concat(_toConsumableArray(r)));
    });
  }, shift: function() {
    var t = this.target, r = this.origin;
    return 0 < t.length && triggerOprationEvent(t, OprateType.Remove, 0, t[0], 1), r.call(t[util].proxy);
  }, replace: function(t, r, e, n) {
    triggerOprationEvent(t, OprateType.Replace, r, [n, e], 1), t[r] = n;
  } };
  var mapFunc = {};
  function registArrayMap(t) {
    mapFunc.map = t;
  }
  function arrayFuncProxy(t, r, e) {
    return ArrayMap[r] && t[trig] && !t[r].hack ? (t[r] = ArrayMap[r].bind({ target: t, origin: t[r] }), t[r].hack = true, t[r]) : mapFunc[r] ? mapFunc[r].bind(t) : Reflect.get(t, r, e);
  }
  function replaceArrayItem(t, r, e) {
    return t[trig] ? (ArrayMap.replace(t, parseInt(r), t[r], e), true) : empty;
  }
  var currentFn = null;
  var depReactive = false;
  function isDepReactive() {
    return depReactive;
  }
  function observe(t) {
    currentFn = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : t, depReactive = false;
    var r = t();
    return currentFn = null, r;
  }
  function isRef(t) {
    return (null == t ? void 0 : t[type]) === AlinsType.Ref;
  }
  function isProxy(t) {
    t = null == t ? void 0 : t[type];
    return t === AlinsType.Proxy || t === AlinsType.Ref;
  }
  function wrapReactive(t) {
    return 1 < arguments.length && void 0 !== arguments[1] && arguments[1] || !t || "object" !== _typeof(t) ? _defineProperty({ v: t }, type, AlinsType.Ref) : t;
  }
  function createUtils(a, r, t) {
    function e(r2, e2, n, i, t2) {
      function o(t3) {
        t3(e2, n, "".concat(l.join("."), ".").concat(r2), r2, i);
      }
      t2 && null != (t2 = a[util].commonLns) && t2.forEach(o), null != (t2 = a[util].lns[r2]) && t2.forEach(o), null != (t2 = a[util].extraLns) && t2.forEach(function(t3) {
        null != (t3 = t3[r2]) && t3.forEach(o);
      });
    }
    var l = r ? [].concat(_toConsumableArray(t), [r]) : _toConsumableArray(t), t = Array.isArray(a);
    a[util].commonLns && (a[util].lns[r] = /* @__PURE__ */ new Set(), a[util].commonLns.forEach(function(t2) {
      a[util].lns[r].add(t2);
    })), Object.assign(a[util], { path: l, triggerChange: e, forceWrite: function(t2) {
      for (var r2 in t2)
        e(r2, t2[r2], a[r2]);
      Object.assign(a, t2);
    }, subscribe: function(t2) {
      var r2, e2, n, i = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
      for (n in null != (r2 = a[util].commonLns) && r2.add(t2) || (a[util].commonLns = /* @__PURE__ */ new Set([t2])), a)
        null != (e2 = a[util].lns[n]) && e2.add(t2) || (a[util].lns[n] = /* @__PURE__ */ new Set([t2])), i && isProxy(a[n]) && a[n][util].subscribe(t2, i);
    }, isArray: t, forceUpdate: function() {
      for (var t2 in a)
        e(t2, a[t2], a[t2]);
    } });
  }
  function createProxy(l) {
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, r = t.commonLns, e = t.lns, i = void 0 === e ? {} : e, e = t.shallow, u = void 0 !== e && e, c = t.set, o = t.get, e = t.path, p = void 0 === e ? [] : e, e = t.key, t = void 0 === e ? "" : e;
    if (l[type] || (l[type] = AlinsType.Proxy), !u)
      for (var n in l) {
        var a = l[n];
        if (a && "object" === _typeof(a))
          try {
            l[n] = createProxy(a, { path: p, key: n });
          } catch (t2) {
          }
      }
    l[util] = { commonLns: r, lns: i, shallow: u }, createUtils(l, t, p);
    var e = l[util], y = e.triggerChange, s = e.isArray, r = new Proxy(l, { get: function(t2, r2, e2) {
      var n2 = "function" == typeof t2[r2];
      if (s && n2)
        return arrayFuncProxy(t2, r2, e2);
      if ("symbol" === _typeof(r2) || n2) {
        if (r2 === pureproxy)
          return true;
      } else {
        if (currentFn)
          return depReactive = depReactive || true, null != (n2 = i[r2]) && n2.add(currentFn) || (i[r2] = /* @__PURE__ */ new Set([currentFn])), Reflect.get(t2, r2, e2);
        if ("v" === r2 && o)
          return o();
      }
      return Reflect.get(t2, r2, e2);
    }, set: function(t2, r2, e2, n2) {
      if ("symbol" === _typeof(r2) || "function" == typeof t2[r2])
        return Reflect.set(t2, r2, e2, n2);
      var i2 = t2[r2];
      if (e2 === i2 && (null == (a2 = t2[util]) || !a2._map))
        return true;
      if (null === c)
        return console.warn("Computed \u4E0D\u53EF\u8BBE\u7F6E"), true;
      if ("v" === r2 && c)
        return c(e2, i2, "".concat(p.join("."), ".").concat(r2), r2), true;
      e2 && "object" === _typeof(e2) && !u && (isProxy(e2) ? (e2[pureproxy] || (e2 = e2[util].proxy), isProxy(i2) && false !== l[util].replaceLns && replaceLNS(e2, i2)) : (i2 && (i2[util].removed = true), e2 = createProxy(e2, { commonLns: t2[util].commonLns, lns: null == i2 ? void 0 : i2[util].lns, shallow: u, path: p, key: r2 })));
      var o2, a2 = empty;
      return s && /^\d+$/.test(r2) && ((o2 = replaceArrayItem(t2, r2, e2)) !== empty && (a2 = o2)), a2 === empty && (a2 = Reflect.set(t2, r2, e2, n2)), y(r2, e2, i2, false, void 0 === i2), a2;
    }, deleteProperty: function(t2, r2) {
      return y(r2, void 0, t2[r2], true), Reflect.deleteProperty(t2, r2);
    } });
    return l[util].proxy = r;
  }
  function replaceLNS(t, r) {
    var e, n, i = t[util], o = r[util];
    for (n in o.extraLns && o.extraLns.has(i.lns) ? (e = i.lns, i.lns = o.lns, o.lns = e, o.extraLns.delete(e)) : i.extraLns ? i.extraLns.add(o.lns) : i.extraLns = /* @__PURE__ */ new Set([o.lns]), t)
      isProxy(t[n]) && isProxy(r[n]) && replaceLNS(t[n], r[n]);
  }
  function computed(t) {
    var r, e = "function" == typeof t, n = e ? t : t.get, e = e ? null : t.set, t = observe(n, function() {
      r[util].forceWrite(wrapReactive(n(), true));
    });
    return isDepReactive() ? r = createProxy(wrapReactive(t, true), { set: e, get: n }) : { v: t };
  }
  function isValueEqual(t, r) {
    var e = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2], n = !(3 < arguments.length && void 0 !== arguments[3]) || arguments[3];
    if (t && r && "object" === _typeof(t) && "object" === _typeof(r) && (n || e)) {
      if (Array.isArray(t)) {
        if (t.length !== r.length)
          return false;
      } else if (Object.keys(t).length !== Object.keys(r).length)
        return false;
      for (var i in t)
        if (!isValueEqual(t[i], r[i], e, false))
          return false;
      return true;
    }
    return t === r;
  }
  function watch(t, r) {
    var e = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2];
    if ("function" == typeof t) {
      t = computed(t);
      var o = r;
      r = function(t2, r2, e2, n, i) {
        isValueEqual(t2, r2) || o(t2, r2, e2, n, i);
      };
    } else if (!isProxy(t))
      return t;
    return t[util] && t[util].subscribe(r, e), t;
  }
  function watchArray(t, r) {
    t[trig] ? t[trig].push(r) : t[trig] = [r];
  }
  var binding = Symbol("b");
  function createBinding(o, t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      isRef(e) || "function" == typeof e || (o[r] = "".concat(o[r]).concat(e).concat(o[r + 1]), o.splice(r + 1, 1), t.splice(r, 1), r--);
    }
    if (0 === t.length)
      return o[0];
    function n(e2) {
      var n2 = t.map(function(t2) {
        return "function" == typeof t2 ? function() {
          return t2();
        } : function() {
          return t2.v;
        };
      }), i = n2.length;
      return watch(function() {
        for (var t2 = o[0], r2 = 0; r2 < i; r2++)
          t2 += n2[r2]() + o[r2 + 1];
        return t2;
      }, function(t2, r2) {
        e2(t2, r2);
      }, false).v;
    }
    return n[type] = AlinsType.BindResult, n;
  }
  function react(t) {
    if (isStringTemplateArray(t)) {
      for (var r = arguments.length, e = new Array(1 < r ? r - 1 : 0), n = 1; n < r; n++)
        e[n - 1] = arguments[n];
      return createBinding(t, e);
    }
    return createProxy(wrapReactive(t));
  }

  // node_modules/.pnpm/alins@0.0.20-beta.1/node_modules/alins/dist/alins.esm.min.js
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
  function createAnchor(o) {
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
      var t = e.current(), n = o.call(e);
      return console.log("branch debug:dom", n), e.inited ? n ? e.isVisible(t) && (console.log("branch debug:replace 222"), this.replaceContent(n, e)) : (console.log("branch debug:clearDom"), c(), e.updateActiveCache()) : (e.inited = true, console.log("branch debug:replace 111"), this.replaceContent(n, e)), n;
    }, replaceContent: function(t, e) {
      if (!u || !f)
        return console.log("branch debug:replaceContent"), l = function(e2) {
          if (u = Renderer.createEmptyMountNode(), f = getFirstElement(e2) || u, Renderer.isFragment(e2))
            return e2.appendChild(u), e2;
          var t2 = Renderer.createDocumentFragment();
          return e2 && t2.appendChild(e2), t2.appendChild(u), t2;
        }(t);
      var n = getParent(u, l);
      if (n !== t) {
        if (c(), !t)
          return null != e && e.updateActiveCache(), t;
        for (var r = getFirstElement(t), i = r || u, a = null == e ? void 0 : e.parent; a && a.anchor.start() === f; )
          a.anchor.setStart(i), a.call && o.modifyCache(a, r), a = a.parent;
        f = i, console.log("branch debug:container insert", n, f, u);
        try {
          n.insertBefore(t, u), null != e && e.updateActiveCache();
        } catch (e2) {
          console.error(e2, n, t, u);
        }
      }
      return t;
    }, clearCache: function() {
    } };
  }
  function _if(e, t, i) {
    console.log("branch debug:enter if", t.toString());
    function a(e2) {
      if (l === e2)
        return true;
      var t2 = c[l = e2];
      return o.replaceBranch(t2), console.warn("switch node", e2), false !== t2.call.returned;
    }
    function n(e2) {
      console.warn("if onDataChange", e2);
      for (var t2, n2 = e2.length, r2 = 0; r2 < n2; r2++)
        if (e2[r2])
          return (t2 = a(r2)) || r2 === n2 - 1 ? t2 : a(n2 - 1);
    }
    function r(e2, t2) {
      var n2 = u, r2 = u++;
      c[r2] = i.branch.next(t2, o, 2 < arguments.length && void 0 !== arguments[2] && arguments[2]), s[r2] = e2, f === empty && ("function" == typeof e2 ? e2() : e2.v) && (r2 = i.cache.call(c[r2], o), false !== t2.returned && (l = n2, f = r2));
    }
    var o = createAnchor(i.cache), c = [], l = -1, u = 0, f = empty, s = [], d = (r(e, t, true), { elif: function(e2, t2) {
      return r(e2, t2), d;
    }, else: function(e2) {
      return r(function() {
        return true;
      }, e2), d;
    }, end: function() {
      return r(function() {
        return true;
      }, 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : function() {
      }), watch(function() {
        return s.map(function(e2) {
          return "function" == typeof e2 ? e2() : e2.v;
        });
      }, n, false), i.branch.back(), f !== empty ? o.replaceContent(f) : Renderer.createDocumentFragment();
    } });
    return d;
  }
  function _iterableToArrayLimit(e, t) {
    var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
    if (null != n) {
      var r, i, a, o, c = [], l = true, u = false;
      try {
        if (a = (n = n.call(e)).next, 0 === t) {
          if (Object(n) !== n)
            return;
          l = false;
        } else
          for (; !(l = (r = a.call(n)).done) && (c.push(r.value), c.length !== t); l = true)
            ;
      } catch (e2) {
        u = true, i = e2;
      } finally {
        try {
          if (!l && null != n.return && (o = n.return(), Object(o) !== o))
            return;
        } finally {
          if (u)
            throw i;
        }
      }
      return c;
    }
  }
  function _typeof2(e) {
    return (_typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
      return typeof e2;
    } : function(e2) {
      return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
    })(e);
  }
  function _defineProperty2(e, t, n) {
    return (t = _toPropertyKey2(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: true, configurable: true, writable: true }) : e[t] = n, e;
  }
  function _slicedToArray(e, t) {
    return _arrayWithHoles(e) || _iterableToArrayLimit(e, t) || _unsupportedIterableToArray2(e, t) || _nonIterableRest();
  }
  function _arrayWithHoles(e) {
    if (Array.isArray(e))
      return e;
  }
  function _unsupportedIterableToArray2(e, t) {
    if (e) {
      if ("string" == typeof e)
        return _arrayLikeToArray2(e, t);
      var n = Object.prototype.toString.call(e).slice(8, -1);
      return "Map" === (n = "Object" === n && e.constructor ? e.constructor.name : n) || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _arrayLikeToArray2(e, t) : void 0;
    }
  }
  function _arrayLikeToArray2(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++)
      r[n] = e[n];
    return r;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(e, t) {
    var n, r = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
    if (!r) {
      if (Array.isArray(e) || (r = _unsupportedIterableToArray2(e)) || t && e && "number" == typeof e.length)
        return r && (e = r), n = 0, { s: t = function() {
        }, n: function() {
          return n >= e.length ? { done: true } : { done: false, value: e[n++] };
        }, e: function(e2) {
          throw e2;
        }, f: t };
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var i, a = true, o = false;
    return { s: function() {
      r = r.call(e);
    }, n: function() {
      var e2 = r.next();
      return a = e2.done, e2;
    }, e: function(e2) {
      o = true, i = e2;
    }, f: function() {
      try {
        a || null == r.return || r.return();
      } finally {
        if (o)
          throw i;
      }
    } };
  }
  function _toPrimitive2(e, t) {
    if ("object" != typeof e || null === e)
      return e;
    var n = e[Symbol.toPrimitive];
    if (void 0 === n)
      return ("string" === t ? String : Number)(e);
    n = n.call(e, t || "default");
    if ("object" != typeof n)
      return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  function _toPropertyKey2(e) {
    e = _toPrimitive2(e, "string");
    return "symbol" == typeof e ? e : String(e);
  }
  function _switch(a, c, l) {
    function u(e) {
      var t = e.call, e = e.brk;
      if (t) {
        t = p.get(t);
        if (!t)
          throw new Error("empty branch");
        t = d ? l.cache.call(t, s) : s.replaceBranch(t);
        if (t)
          return v = SwitchResult.Return, t;
      }
      return v = e ? SwitchResult.Break : SwitchResult.Continue, !!e;
    }
    function o(e) {
      var t, n, r = false, i = (v = SwitchResult.Init, null), a2 = _createForOfIteratorHelper(c);
      try {
        for (a2.s(); !(t = a2.n()).done; ) {
          var o2 = t.value;
          if (r) {
            if (i = u(o2))
              break;
          } else if ((o2.value === e || !("value" in o2)) && (r = true, i = u(o2)))
            break;
        }
      } catch (e2) {
        a2.e(e2);
      } finally {
        a2.f();
      }
      return v !== SwitchResult.Return && (n = p.get(f), i = d ? l.cache.call(n, s) : s.replaceBranch(n)), i;
    }
    var f, s = createAnchor(l.cache), d = true, p = /* @__PURE__ */ new WeakMap(), v = SwitchResult.Init;
    return { end: function() {
      f = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : function() {
      };
      var e, t = watch(a, function(e2) {
        o(e2);
      }), n = true, r = _createForOfIteratorHelper(c);
      try {
        for (r.s(); !(e = r.n()).done; ) {
          var i = e.value;
          i.call && (p.set(i.call, l.branch.next(i.call, s, n)), n = n && false);
        }
      } catch (e2) {
        r.e(e2);
      } finally {
        r.f();
      }
      p.set(f, l.branch.next(f, s, n)), l.branch.back();
      t = o(t.v);
      return d = false, Renderer.isElement(t) ? s.replaceContent(t) : Renderer.createDocumentFragment();
    } };
  }
  function map(o) {
    var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1], m = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "item", g = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "", b = this;
    if (!e)
      return b.map(o);
    var C = Renderer.createDocumentFragment(), e = isProxy(b), t = b.length;
    if (e) {
      let E = function(e2, t2) {
        console.log("createChild", e2, t2);
        var n2, r2, e2 = x(e2, t2), i2 = o(e2[m], e2[g] || t2), a2 = i2;
        return i2 ? Renderer.isFragment(i2) ? 0 === (r2 = (n2 = i2.childNodes).length) ? (a2 = Renderer.createEmptyMountNode(), i2.appendChild(a2), 0 === t2 && (A = a2)) : (a2 = n2[r2 - 1], 0 === t2 && (A = n2[0])) : 0 === t2 && (A = i2) : (a2 = i2 = Renderer.createEmptyMountNode(), 0 === t2 && (A = i2)), console.log(A, t2), [i2, a2, e2];
      };
      for (var A, _ = Renderer.createEmptyMountNode(), w = [], S = [], x = (b[util].scopeItems = S, b[util]._map = true, S.key = m, function(e2, t2) {
        e2 = createProxy({ v: e2 }, { shallow: true });
        e2 = _defineProperty2({}, m, e2);
        return g && (e2[g] = createProxy({ v: t2 }, { shallow: true })), e2;
      }), n = 0; n < t; n++) {
        var r = b[n], r = _slicedToArray(E(r, n), 3), i = r[0], a = r[1], r = r[2];
        S[n] = r, C.appendChild(i), w[n] = a;
      }
      watchArray(b, function(e2) {
        var t2, r2 = e2.index, n2 = e2.count, i2 = e2.data;
        switch (e2.type) {
          case OprateType.Push:
            for (var a2 = Renderer.createDocumentFragment(), o2 = b.length, c2 = 0; c2 < i2.length; c2++) {
              var l2 = _slicedToArray(E(i2[c2], o2 + c2), 3), u = l2[0], f = l2[1], l2 = l2[2];
              w.push(f), S.push(l2), a2.appendChild(u);
            }
            getParent(_, C).insertBefore(a2, _);
            break;
          case OprateType.Replace:
            S[r2] ? (console.warn("\u3010debug: watch array replace2", r2, JSON.stringify(i2)), i2[0] !== S[r2][m].v && (S[r2][m].v = i2[0]), g && (S[r2][g].v = r2)) : S[r2] = x(i2[0], r2);
            break;
          case OprateType.Remove:
            if (0 === n2)
              break;
            for (var s = r2 - 1, d = (null == (t2 = w[s + n2]) ? void 0 : t2.nextSibling) || _, p = s < 0 ? A || _ : w[s]; p.nextSibling && p.nextSibling !== d; )
              p.nextSibling.remove();
            s < 0 && (p !== _ ? (A = p.nextSibling, p.remove()) : A = _), w.splice(r2, n2), S.splice(r2, n2);
            break;
          case OprateType.Insert:
            var v = 0 === r2 ? A || _ : w[r2 - 1].nextSibling, h = [], y = [];
            i2.forEach(function(e3, t3) {
              var e3 = _slicedToArray(E(e3, r2 + t3), 3), t3 = e3[0], n3 = e3[1], e3 = e3[2];
              getParent(v, C).insertBefore(t3, v), y.push(e3), h.push(n3);
            }), S.splice.apply(S, [r2, 0].concat(y)), w.splice.apply(w, [r2, 0].concat(h));
        }
      }), C.appendChild(_);
    } else
      for (var c = 0; c < t; c++) {
        var l = o(b[c], c);
        l && C.appendChild(l);
      }
    return C;
  }
  function isEventAttr(e, t, n) {
    return !!t.startsWith("on") && ((null === e[t] || "function" == typeof e[t]) && ("function" == typeof n || "function" == typeof (null == n ? void 0 : n.listener) || "string" == typeof (null == n ? void 0 : n.__deco)));
  }
  function addEvent(n, r, i) {
    if (r = r.substring(2), "function" == typeof i)
      n.addEventListener(r, i);
    else {
      if (i.__deco) {
        var e, t = i.__deco.split("-"), a = (i = { listener: i.v }, _createForOfIteratorHelper(t));
        try {
          for (a.s(); !(e = a.n()).done; ) {
            var o = e.value;
            i[o] = true;
          }
        } catch (e2) {
          a.e(e2);
        } finally {
          a.f();
        }
      }
      n.addEventListener(r, function e2(t2) {
        i.self && t2.target !== n || (i.stop && t2.stopPropagation(), i.prevent && t2.preventDefault(), i.once && n.removeEventListener(r, e2, i.capture), i.listener(t2));
      }, i.capture);
    }
  }
  function reactiveBindingEnable(e, i) {
    var t = "object" === _typeof2(e) && !isProxy(e) && void 0 !== e.enable, n = t ? e.value : e, a = true, o = "", o = reactiveBinding(n, function(e2, t2, n2, r) {
      o = e2, a && i(e2, t2, n2, r);
    });
    return t && (a = watch(e.enable, function(e2) {
      i((a = e2) ? o : null, null, "", "");
    }).v), i(a ? o : null, void 0, "", ""), o;
  }
  function reactiveBindingValue(e, t) {
    t(reactiveBinding(e, t), void 0, "", "");
  }
  function reactiveClass(i, a) {
    if (isRef(i) || "object" !== _typeof2(i))
      return reactiveBinding(i, function(e2) {
        a("", e2);
      });
    var e = function() {
      var e2, n, t, r = {};
      i.$value ? (e2 = reactiveBinding(i.$value, function(e3) {
        var t2, n2 = /* @__PURE__ */ new Set([]);
        for (t2 in r)
          true === r[t2] && n2.add(t2);
        e3.split(" ").forEach(function(e4) {
          false !== r[e4] && n2.add(e4);
        }), a("", Array.from(n2).join(" "));
      }), n = new Set(e2.split(" ")), delete i.$value) : n = /* @__PURE__ */ new Set([]);
      for (t in i)
        !function(t2) {
          n[(r[t2] = !!reactiveBinding(i[t2], function(e3) {
            r[t2] = e3, a(t2, e3);
          })) ? "add" : "delete"](t2);
        }(t);
      return { v: Array.from(n).join(" ") };
    }();
    return "object" === _typeof2(e) ? e.v : void 0;
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
      reactiveBindingEnable(e, function(e2, t2, n, r, i) {
        if ("string" == typeof e2)
          r && "v" !== r ? c.style[r] = i ? "" : e2 : c.setAttribute("style", e2);
        else {
          for (var a in e2)
            c.style[a] = e2[a];
          for (var o in t2)
            void 0 === e2[o] && (c.style[o] = "");
        }
      });
    else {
      if ("object" !== _typeof2(e))
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
  function parseModel(t, e, n) {
    if ("value" !== n && "checked" !== n)
      return false;
    if (!isProxy(e) && !e.__deco)
      return false;
    var r = t.tagName;
    if (!ModelTag[r])
      return false;
    var i = e.__deco || _typeof2(e.v), a = (a = { boolean: function(e2) {
      return "true" === e2;
    }, number: function(e2) {
      return parseFloat(e2);
    }, string: function(e2) {
      return e2;
    } }[i]) || function(e2) {
      return e2;
    }, o = e.__deco ? e.v : e;
    return t.addEventListener("SELECT" === r ? "change" : "input", function() {
      var e2 = t[n];
      i !== _typeof2(e2) && (e2 = a(e2)), o.v = Number.isNaN(e2) ? "" : e2;
    }), watch(o, function(e2) {
      t[n] = e2;
    }, false), t[n] = o.v, true;
  }
  function parseAttributes(p, e) {
    if (null == e)
      return false;
    if ("function" == typeof e || isProxy(e))
      reactiveBindingEnable(e, function(e2, t2, n, r, i) {
        if ("string" == typeof e2) {
          if (r && "v" !== r)
            return void (i ? p.removeAttribute(r) : p.setAttribute(r, e2));
          var a, i = e2.matchAll(/(.*?)=(.*?)(&|$)/g), o = (e2 = {}, _createForOfIteratorHelper(i));
          try {
            for (o.s(); !(a = o.n()).done; ) {
              var c = a.value;
              e2[c[1]] = c[2];
            }
          } catch (e3) {
            o.e(e3);
          } finally {
            o.f();
          }
          var l, r = t2.matchAll(/(.*?)=(.*?)(&|$)/g), u = (t2 = {}, _createForOfIteratorHelper(r));
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
          p.setAttribute(s, e2[s]);
        for (var d in t2)
          void 0 === e2[d] && p.removeAttribute(d);
      });
    else {
      if ("object" !== _typeof2(e))
        return false;
      for (var t in e)
        !function(t2) {
          reactiveBindingEnable(e[t2], function(e2) {
            null === e2 ? p.removeAttribute(e2) : p.setAttribute(t2, e2);
          });
        }(t);
    }
    return true;
  }
  function transformOptionsToElement(n) {
    if (n.isText)
      r = Renderer.createTextNode(""), "" !== n.text && reactiveBindingValue(n.text, function(e2) {
        r.textContent = e2;
      });
    else {
      var e = !!n.tag, r = e ? Renderer.createElement(n.tag) : Renderer.createDocumentFragment();
      if (n.children && appendChildren(r, n.children), e)
        for (var t in n.attributes)
          (function(t2) {
            var e2 = n.attributes[t2];
            if (isEventAttr(r, t2, e2))
              return addEvent(r, t2, e2);
            if ("$mount" === t2)
              e2.appendChild(r);
            else if ("$attributes" === t2)
              parseAttributes(r, e2);
            else if ("$show" === t2)
              reactiveBindingEnable(e2, function(e3) {
                r.style.display = e3 ? "" : "none";
              });
            else {
              if ("class" !== t2)
                return "style" === t2 && parseStyle(r, e2) || parseModel(r, e2, t2) || reactiveBindingEnable(e2, function(e3) {
                  null === e3 ? r.removeAttribute(t2) : r.setAttribute(t2, e3);
                });
              r.className = reactiveClass(e2, function(e3, t3) {
                e3 ? t3 ? r.classList.add(e3) : r.classList.remove(e3) : r.className = t3;
              });
            }
          })(t);
    }
    return r;
  }
  function appendChildren(e, t) {
    var n, r = _createForOfIteratorHelper(t);
    try {
      for (r.s(); !(n = r.n()).done; ) {
        var i, a = n.value;
        if (null != a) {
          if (Array.isArray(a))
            return void appendChildren(e, a);
          Renderer.isElement(a) ? e.appendChild(a) : (i = transformOptionsToElement(isJSXElement(a) ? a : { text: a, isText: true }), e.appendChild(i));
        }
      }
    } catch (e2) {
      r.e(e2);
    } finally {
      r.f();
    }
  }
  function isJSXElement(e) {
    return "object" === _typeof2(e) && true === e.jsx;
  }
  var JSX = { createElement: function(e) {
    for (var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null, n = arguments.length, r = new Array(2 < n ? n - 2 : 0), i = 2; i < n; i++)
      r[i - 2] = arguments[i];
    if ("function" != typeof e)
      return transformOptionsToElement({ tag: e, attributes: t, children: r, jsx: true });
    var a, o = t.$mount;
    for (a in delete t.$mount, t) {
      var c = t[a];
      isProxy(c) || (t[a] = { v: c });
    }
    var l = transformAsyncDom(e(t, r));
    return o && o.appendChild(l), l;
  } };
  function transformAsyncDom(e) {
    var t = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1], n = 2 < arguments.length ? arguments[2] : void 0;
    if (e && e instanceof Promise) {
      if (false === t)
        return;
      var r = Renderer.createDocumentFragment(), i = Renderer.createEmptyMountNode();
      return r.appendChild(i), e.then(function(e2) {
        if (Renderer.isElement(e2)) {
          var t2 = getParent(i, r);
          try {
            t2.insertBefore(e2, i);
          } catch (e3) {
            console.log("node \u5DF2\u88AB\u9690\u85CF");
          } finally {
            null != n && n(e2), i.remove();
          }
        }
      }), r;
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
    var t, n = Renderer.createDocumentFragment(), r = _createForOfIteratorHelper(e);
    try {
      for (r.s(); !(t = r.n()).done; ) {
        var i = t.value;
        n.appendChild(i);
      }
    } catch (e2) {
      r.e(e2);
    } finally {
      r.f();
    }
    return n;
  }
  function createCallCache() {
    var c = /* @__PURE__ */ new WeakMap();
    return { call: function(t, n) {
      var r = this, e = (t.visit(), t.call), i = c.get(e);
      if (console.log("branch debug:item", t.id, i), void 0 !== i)
        return transformCacheToElement(i);
      var a, o, i = e();
      if (false === e.returned ? a = transformAsyncDom(i, false) : o = getFirstElement(a = transformAsyncDom(i, !(o = null), function(e2) {
        r.modifyCache(t, e2), null != n && n.replaceStart(o, e2), o = null;
      })), Renderer.isElement(a) || void 0 === a)
        return this.modifyCache(t, a), a;
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
    var a = [], o = 0, c = { anchor: e, parent: null }, l = null, u = null, f = false;
    return { next: function(e2, t) {
      var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2], r = function(e3, n2) {
        var t2 = 0 === a.length ? c : a[a.length - 1], t2 = 2 < arguments.length && void 0 !== arguments[2] && arguments[2] ? t2 : null == t2 ? void 0 : t2.parent;
        return { id: o++, call: e3, parent: t2, activeChild: null, anchor: n2, current: function() {
          return l;
        }, isVisible: function(e4) {
          if (!u) {
            u = /* @__PURE__ */ new WeakMap();
            for (var t3 = e4 || l, n3 = []; t3; )
              n3.push(t3.id), u.set(t3, 1), t3 = t3.parent;
            console.log("branch debug:branchpath", n3.toString());
          }
          if (!!u.get(this))
            return true;
          var r2 = this.parent;
          if (!r2 || u.get(r2))
            return true;
          for (; r2; ) {
            if (!!u.get(r2))
              break;
            r2 = r2.parent;
          }
          return false;
        }, visit: function() {
          l !== this && (f && (a = [this]), (l = this).parent && (this.parent.activeChild = this), u = null);
        }, updateCache: function() {
          var e4, t3 = n2.getNodes();
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
      }(e2, t, n);
      return n ? a.push(r) : a[a.length - 1] = r, console.warn("branch debug:next:".concat(r.id, ":").concat(n), r.call.toString()), r;
    }, back: function() {
      console.warn("branch:back");
      var e2 = a.pop();
      return 0 === a.length && (f = true), e2;
    } };
  }
  function createContext() {
    var e = createCallCache(), t = createAnchor(e), n = { anchor: t, cache: e, branch: createBranchLink(e, t) };
    return { util: n, if: function(e2, t2) {
      return _if(e2, t2, n);
    }, switch: function(e2, t2) {
      return _switch(e2, t2, n);
    } };
  }
  var ContextTool = { ce: JSX.createElement, mnr: function(e) {
    return e.returned = false, e;
  }, r: react, c: computed, w: watch, cc: function(e, t) {
    return computed({ get: e, set: t });
  } };
  var _$$ = (Object.assign(createContext, ContextTool), createContext);

  // src/alins.tsx
  var count = _$$.r({
    v: 1
  });
  _$$.ce("button", {
    $mount: document.body,
    onclick: () => {
      count.v++;
    }
  }, "click:", count);
})();
