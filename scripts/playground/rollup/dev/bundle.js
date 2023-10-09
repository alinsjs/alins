(function () {
    'use strict';

    function isStringTemplateArray(t){return t instanceof Array&&t.raw instanceof Array}var AlinsType,type=Symbol("t"),util=Symbol("u"),empty=Symbol("e"),trig=Symbol("t"),pureproxy=Symbol("pp");!function(t){t[t.ElementBuilder=1]="ElementBuilder",t[t.Element=2]="Element",t[t.TextNode=3]="TextNode",t[t.Proxy=4]="Proxy",t[t.Ref=5]="Ref",t[t.BindResult=6]="BindResult",t[t.If=7]="If",t[t.Switch=8]="Switch";}(AlinsType=AlinsType||{});

    function _typeof$1(t){return (_typeof$1="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperty$1(t,r,e){return (r=_toPropertyKey$1(r))in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray$1(t)||_nonIterableSpread()}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray$1(t)}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _unsupportedIterableToArray$1(t,r){if(t){if("string"==typeof t)return _arrayLikeToArray$1(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);return "Map"===(e="Object"===e&&t.constructor?t.constructor.name:e)||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray$1(t,r):void 0}}function _arrayLikeToArray$1(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _toPrimitive$1(t,r){if("object"!=typeof t||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0===e)return ("string"===r?String:Number)(t);e=e.call(t,r||"default");if("object"!=typeof e)return e;throw new TypeError("@@toPrimitive must return a primitive value.")}function _toPropertyKey$1(t){t=_toPrimitive$1(t,"string");return "symbol"==typeof t?t:String(t)}var OprateType;function proxyItem(e,t,n){return e[util].shallow?t:t.map(function(t,r){return t&&"object"===_typeof$1(t)?createProxy(t,{commonLns:e[util].commonLns,path:e[util].path,key:"".concat(n+r)}):t})}function triggerOprationEvent(t,r,e,n,i,o){null!=(t=t[trig])&&t.forEach(function(t){t({type:r,data:n,index:e,count:i,fromAssign:o});});}function wrapArrayCall(t,r){t[util].replaceLns=!1;r=r();return delete t[util].replaceLns,r}!function(t){t[t.Replace=0]="Replace",t[t.Remove=1]="Remove",t[t.Insert=2]="Insert",t[t.Push=3]="Push",t[t.Sort=4]="Sort";}(OprateType=OprateType||{});var ArrayMap={splice:function(t,r){var e=this.target,n=this.origin;t>=e.length?(t=e.length,r=0):(void 0===r||t+r>e.length)&&(r=e.length-t);for(var i=arguments.length,o=new Array(2<i?i-2:0),a=2;a<i;a++)o[a-2]=arguments[a];var l=o.length,u=Math.min(r,l),c=t+u;r<l?(u=proxyItem(e,o.slice(u),c),triggerOprationEvent(e,OprateType.Insert,c,u,u.length)):(u=r-l,triggerOprationEvent(e,OprateType.Remove,c,e.slice(c,c+u),u));for(var p=t;p<c;p++){var y=o[p-t];triggerOprationEvent(e,OprateType.Replace,p,[y,e[p]],1);}var s=e[util].scopeItems,f=null==s?void 0:s.slice(t,t+o.length).map(function(t){return t[s.key].v});return wrapArrayCall(e,function(){return n.call.apply(n,[e[util].proxy,t,r].concat(_toConsumableArray(f)))})},push:function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];var n=this.target,i=this.origin,r=proxyItem(n,r,n.length);return triggerOprationEvent(n,OprateType.Push,n.length,r,r.length),i.call.apply(i,[n[util].proxy].concat(_toConsumableArray(r)))},pop:function(){var t=this.target,r=this.origin;return 0<t.length&&triggerOprationEvent(t,OprateType.Remove,t.length-1,[t[t.length-1]],1),r.call(t[util].proxy)},unshift:function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];var n=this.target,i=this.origin,r=proxyItem(n,r,0);return triggerOprationEvent(n,OprateType.Insert,0,r,r.length),wrapArrayCall(n,function(){return i.call.apply(i,[n[util].proxy].concat(_toConsumableArray(r)))})},shift:function(){var t=this.target,r=this.origin;return 0<t.length&&triggerOprationEvent(t,OprateType.Remove,0,t[0],1),r.call(t[util].proxy)},replace:function(t,r,e,n){triggerOprationEvent(t,OprateType.Replace,r,[n,e],1),t[r]=n;}},mapFunc={};function registArrayMap(t){mapFunc.map=t;}function arrayFuncProxy(t,r,e){return ArrayMap[r]&&t[trig]&&!t[r].hack?(t[r]=ArrayMap[r].bind({target:t,origin:t[r]}),t[r].hack=!0,t[r]):mapFunc[r]?mapFunc[r].bind(t):Reflect.get(t,r,e)}function replaceArrayItem(t,r,e){return t[trig]?(ArrayMap.replace(t,parseInt(r),t[r],e),!0):empty}var currentFn=null,depReactive=!1;function isDepReactive(){return depReactive}function observe(t){currentFn=1<arguments.length&&void 0!==arguments[1]?arguments[1]:t,depReactive=!1;var r=t();return currentFn=null,r}function isRef(t){return (null==t?void 0:t[type])===AlinsType.Ref}function isProxy(t){t=null==t?void 0:t[type];return t===AlinsType.Proxy||t===AlinsType.Ref}function wrapReactive(t){return 1<arguments.length&&void 0!==arguments[1]&&arguments[1]||!t||"object"!==_typeof$1(t)?_defineProperty$1({v:t},type,AlinsType.Ref):t}function createUtils(a,r,t){function e(r,e,n,i,t){function o(t){t(e,n,"".concat(l.join("."),".").concat(r),r,i);}t&&null!=(t=a[util].commonLns)&&t.forEach(o),null!=(t=a[util].lns[r])&&t.forEach(o),null!=(t=a[util].extraLns)&&t.forEach(function(t){null!=(t=t[r])&&t.forEach(o);});}var l=r?[].concat(_toConsumableArray(t),[r]):_toConsumableArray(t),t=Array.isArray(a);a[util].commonLns&&(a[util].lns[r]=new Set,a[util].commonLns.forEach(function(t){a[util].lns[r].add(t);})),Object.assign(a[util],{path:l,triggerChange:e,forceWrite:function(t){for(var r in t)e(r,t[r],a[r]);Object.assign(a,t);},subscribe:function(t){var r,e,n,i=!(1<arguments.length&&void 0!==arguments[1])||arguments[1];for(n in null!=(r=a[util].commonLns)&&r.add(t)||(a[util].commonLns=new Set([t])),a)null!=(e=a[util].lns[n])&&e.add(t)||(a[util].lns[n]=new Set([t])),i&&isProxy(a[n])&&a[n][util].subscribe(t,i);},isArray:t,forceUpdate:function(){for(var t in a)e(t,a[t],a[t]);}});}function createProxy(l){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},r=t.commonLns,e=t.lns,i=void 0===e?{}:e,e=t.shallow,u=void 0!==e&&e,c=t.set,o=t.get,e=t.path,p=void 0===e?[]:e,e=t.key,t=void 0===e?"":e;if(l[type]||(l[type]=AlinsType.Proxy),!u)for(var n in l){var a=l[n];if(a&&"object"===_typeof$1(a))try{l[n]=createProxy(a,{path:p,key:n});}catch(t){}}l[util]={commonLns:r,lns:i,shallow:u},createUtils(l,t,p);var e=l[util],y=e.triggerChange,s=e.isArray,r=new Proxy(l,{get:function(t,r,e){var n="function"==typeof t[r];if(s&&n)return arrayFuncProxy(t,r,e);if("symbol"===_typeof$1(r)||n){if(r===pureproxy)return !0}else {if(currentFn)return depReactive=depReactive||!0,null!=(n=i[r])&&n.add(currentFn)||(i[r]=new Set([currentFn])),Reflect.get(t,r,e);if("v"===r&&o)return o()}return Reflect.get(t,r,e)},set:function(t,r,e,n){if("symbol"===_typeof$1(r)||"function"==typeof t[r])return Reflect.set(t,r,e,n);var i=t[r];if(e===i&&(null==(a=t[util])||!a._map))return !0;if(null===c)return console.warn("Computed 不可设置"),!0;if("v"===r&&c)return c(e,i,"".concat(p.join("."),".").concat(r),r),!0;e&&"object"===_typeof$1(e)&&!u&&(isProxy(e)?(e[pureproxy]||(e=e[util].proxy),isProxy(i)&&!1!==l[util].replaceLns&&replaceLNS(e,i)):(i&&(i[util].removed=!0),e=createProxy(e,{commonLns:t[util].commonLns,lns:null==i?void 0:i[util].lns,shallow:u,path:p,key:r})));var o,a=empty;return s&&/^\d+$/.test(r)&&((o=replaceArrayItem(t,r,e))!==empty&&(a=o)),a===empty&&(a=Reflect.set(t,r,e,n)),y(r,e,i,!1,void 0===i),a},deleteProperty:function(t,r){return y(r,void 0,t[r],!0),Reflect.deleteProperty(t,r)}});return l[util].proxy=r}function replaceLNS(t,r){var e,n,i=t[util],o=r[util];for(n in o.extraLns&&o.extraLns.has(i.lns)?(e=i.lns,i.lns=o.lns,o.lns=e,o.extraLns.delete(e)):i.extraLns?i.extraLns.add(o.lns):i.extraLns=new Set([o.lns]),t)isProxy(t[n])&&isProxy(r[n])&&replaceLNS(t[n],r[n]);}function computed(t){var r,e="function"==typeof t,n=e?t:t.get,e=e?null:t.set,t=observe(n,function(){r[util].forceWrite(wrapReactive(n(),!0));});return isDepReactive()?r=createProxy(wrapReactive(t,!0),{set:e,get:n}):{v:t}}function isValueEqual(t,r){var e=!(2<arguments.length&&void 0!==arguments[2])||arguments[2],n=!(3<arguments.length&&void 0!==arguments[3])||arguments[3];if(t&&r&&"object"===_typeof$1(t)&&"object"===_typeof$1(r)&&(n||e)){if(Array.isArray(t)){if(t.length!==r.length)return !1}else if(Object.keys(t).length!==Object.keys(r).length)return !1;for(var i in t)if(!isValueEqual(t[i],r[i],e,!1))return !1;return !0}return t===r}function watch(t,r){var e=!(2<arguments.length&&void 0!==arguments[2])||arguments[2];if("function"==typeof t){t=computed(t);var o=r;r=function(t,r,e,n,i){isValueEqual(t,r)||o(t,r,e,n,i);};}else if(!isProxy(t))return t;return t[util]&&t[util].subscribe(r,e),t}function watchArray(t,r){t[trig]?t[trig].push(r):t[trig]=[r];}function createBinding(o,t){for(var r=0;r<t.length;r++){var e=t[r];isRef(e)||"function"==typeof e||(o[r]="".concat(o[r]).concat(e).concat(o[r+1]),o.splice(r+1,1),t.splice(r,1),r--);}if(0===t.length)return o[0];function n(e){var n=t.map(function(t){return "function"==typeof t?function(){return t()}:function(){return t.v}}),i=n.length;return watch(function(){for(var t=o[0],r=0;r<i;r++)t+=n[r]()+o[r+1];return t},function(t,r){e(t,r);},!1).v}return n[type]=AlinsType.BindResult,n}function react(t){if(isStringTemplateArray(t)){for(var r=arguments.length,e=new Array(1<r?r-1:0),n=1;n<r;n++)e[n-1]=arguments[n];return createBinding(t,e)}return createProxy(wrapReactive(t))}

    var SwitchResult,Renderer={createElement:function(e){e=document.createElement(e);return e[type]=AlinsType.Element,e},createTextNode:function(e){e=document.createTextNode(e);return e[type]=AlinsType.TextNode,e},createEmptyMountNode:function(){return document.createComment("")},createDocumentFragment:function(){return document.createDocumentFragment()},isFragment:function(e){return e instanceof DocumentFragment},isOriginElement:function(e){return e instanceof Node},isElement:function(e){return this.isFragment(e)||this.isOriginElement(e)}};function getFirstElement(e){return e?Renderer.isFragment(e)?e.firstChild:e:null}function getParent(e){return e.parentElement||e.parentNode||(1<arguments.length&&void 0!==arguments[1]?arguments[1]:null)}function createAnchor(o){function c(){var e=f;if(e!==u){for(;e.nextSibling&&e.nextSibling!==u;)try{e.nextSibling.remove();}catch(e){console.error(e);break}e.remove();}f=u;}var l,u=null,f=null;return {getNodes:function(){for(var e=[],t=f;t&&t!==u;)e.push(t),t=t.nextSibling;return e},start:function(){return f},setStart:function(e){e&&(f=getFirstElement(e)||u);},replaceStart:function(e,t){getFirstElement(e)===f&&(f=getFirstElement(t));},replaceBranch:function(e){var t=e.current(),n=o.call(e);return console.log("branch debug:dom",n),e.inited?n?e.isVisible(t)&&(console.log("branch debug:replace 222"),this.replaceContent(n,e)):(console.log("branch debug:clearDom"),c(),e.updateActiveCache()):(e.inited=!0,console.log("branch debug:replace 111"),this.replaceContent(n,e)),n},replaceContent:function(t,e){if(!u||!f)return console.log("branch debug:replaceContent"),l=function(e){if(u=Renderer.createEmptyMountNode(),f=getFirstElement(e)||u,Renderer.isFragment(e))return e.appendChild(u),e;var t=Renderer.createDocumentFragment();return e&&t.appendChild(e),t.appendChild(u),t}(t);var n=getParent(u,l);if(n!==t){if(c(),!t)return null!=e&&e.updateActiveCache(),t;for(var r=getFirstElement(t),i=r||u,a=null==e?void 0:e.parent;a&&a.anchor.start()===f;)a.anchor.setStart(i),a.call&&o.modifyCache(a,r),a=a.parent;f=i,console.log("branch debug:container insert",n,f,u);try{n.insertBefore(t,u),null!=e&&e.updateActiveCache();}catch(e){console.error(e,n,t,u);}}return t},clearCache:function(){}}}function _if(e,t,i){console.log("branch debug:enter if",t.toString());function a(e){if(l===e)return !0;var t=c[l=e];return o.replaceBranch(t),console.warn("switch node",e),!1!==t.call.returned}function n(e){console.warn("if onDataChange",e);for(var t,n=e.length,r=0;r<n;r++)if(e[r])return (t=a(r))||r===n-1?t:a(n-1)}function r(e,t){var n=u,r=u++;c[r]=i.branch.next(t,o,2<arguments.length&&void 0!==arguments[2]&&arguments[2]),s[r]=e,f===empty&&("function"==typeof e?e():e.v)&&(r=i.cache.call(c[r],o),!1!==t.returned&&(l=n,f=r));}var o=createAnchor(i.cache),c=[],l=-1,u=0,f=empty,s=[],d=(r(e,t,!0),{elif:function(e,t){return r(e,t),d},else:function(e){return r(function(){return !0},e),d},end:function(){return r(function(){return !0},0<arguments.length&&void 0!==arguments[0]?arguments[0]:function(){}),watch(function(){return s.map(function(e){return "function"==typeof e?e():e.v})},n,!1),i.branch.back(),f!==empty?o.replaceContent(f):Renderer.createDocumentFragment()}});return d}function _iterableToArrayLimit(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,a,o,c=[],l=!0,u=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;l=!1;}else for(;!(l=(r=a.call(n)).done)&&(c.push(r.value),c.length!==t);l=!0);}catch(e){u=!0,i=e;}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(u)throw i}}return c}}function _typeof(e){return (_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _defineProperty(e,t,n){return (t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _arrayWithHoles(e){if(Array.isArray(e))return e}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return "Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(e,t){var n,r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length)return r&&(e=r),n=0,{s:t=function(){},n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:t};throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,o=!1;return {s:function(){r=r.call(e);},n:function(){var e=r.next();return a=e.done,e},e:function(e){o=!0,i=e;},f:function(){try{a||null==r.return||r.return();}finally{if(o)throw i}}}}function _toPrimitive(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0===n)return ("string"===t?String:Number)(e);n=n.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}function _toPropertyKey(e){e=_toPrimitive(e,"string");return "symbol"==typeof e?e:String(e)}function _switch(a,c,l){function u(e){var t=e.call,e=e.brk;if(t){t=p.get(t);if(!t)throw new Error("empty branch");t=d?l.cache.call(t,s):s.replaceBranch(t);if(t)return v=SwitchResult.Return,t}return v=e?SwitchResult.Break:SwitchResult.Continue,!!e}function o(e){var t,n,r=!1,i=(v=SwitchResult.Init,null),a=_createForOfIteratorHelper(c);try{for(a.s();!(t=a.n()).done;){var o=t.value;if(r){if(i=u(o))break}else if((o.value===e||!("value"in o))&&(r=!0,i=u(o)))break}}catch(e){a.e(e);}finally{a.f();}return v!==SwitchResult.Return&&(n=p.get(f),i=d?l.cache.call(n,s):s.replaceBranch(n)),i}var f,s=createAnchor(l.cache),d=!0,p=new WeakMap,v=SwitchResult.Init;return {end:function(){f=0<arguments.length&&void 0!==arguments[0]?arguments[0]:function(){};var e,t=watch(a,function(e){o(e);}),n=!0,r=_createForOfIteratorHelper(c);try{for(r.s();!(e=r.n()).done;){var i=e.value;i.call&&(p.set(i.call,l.branch.next(i.call,s,n)),n=n&&!1);}}catch(e){r.e(e);}finally{r.f();}p.set(f,l.branch.next(f,s,n)),l.branch.back();t=o(t.v);return d=!1,Renderer.isElement(t)?s.replaceContent(t):Renderer.createDocumentFragment()}}}function map(o){var e=1<arguments.length&&void 0!==arguments[1]&&arguments[1],m=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"item",g=3<arguments.length&&void 0!==arguments[3]?arguments[3]:"",b=this;if(!e)return b.map(o);var C=Renderer.createDocumentFragment(),e=isProxy(b),t=b.length;if(e){function E(e,t){console.log("createChild",e,t);var n,r,e=x(e,t),i=o(e[m],e[g]||t),a=i;return i?Renderer.isFragment(i)?0===(r=(n=i.childNodes).length)?(a=Renderer.createEmptyMountNode(),i.appendChild(a),0===t&&(A=a)):(a=n[r-1],0===t&&(A=n[0])):0===t&&(A=i):(a=i=Renderer.createEmptyMountNode(),0===t&&(A=i)),console.log(A,t),[i,a,e]}for(var A,_=Renderer.createEmptyMountNode(),w=[],S=[],x=(b[util].scopeItems=S,b[util]._map=!0,S.key=m,function(e,t){e=createProxy({v:e},{shallow:!0});e=_defineProperty({},m,e);return g&&(e[g]=createProxy({v:t},{shallow:!0})),e}),n=0;n<t;n++){var r=b[n],r=_slicedToArray(E(r,n),3),i=r[0],a=r[1],r=r[2];S[n]=r,C.appendChild(i),w[n]=a;}watchArray(b,function(e){var t,r=e.index,n=e.count,i=e.data;switch(e.type){case OprateType.Push:for(var a=Renderer.createDocumentFragment(),o=b.length,c=0;c<i.length;c++){var l=_slicedToArray(E(i[c],o+c),3),u=l[0],f=l[1],l=l[2];w.push(f),S.push(l),a.appendChild(u);}getParent(_,C).insertBefore(a,_);break;case OprateType.Replace:S[r]?(console.warn("【debug: watch array replace2",r,JSON.stringify(i)),i[0]!==S[r][m].v&&(S[r][m].v=i[0]),g&&(S[r][g].v=r)):S[r]=x(i[0],r);break;case OprateType.Remove:if(0===n)break;for(var s=r-1,d=(null==(t=w[s+n])?void 0:t.nextSibling)||_,p=s<0?A||_:w[s];p.nextSibling&&p.nextSibling!==d;)p.nextSibling.remove();s<0&&(p!==_?(A=p.nextSibling,p.remove()):A=_),w.splice(r,n),S.splice(r,n);break;case OprateType.Insert:var v=0===r?A||_:w[r-1].nextSibling,h=[],y=[];i.forEach(function(e,t){var e=_slicedToArray(E(e,r+t),3),t=e[0],n=e[1],e=e[2];getParent(v,C).insertBefore(t,v),y.push(e),h.push(n);}),S.splice.apply(S,[r,0].concat(y)),w.splice.apply(w,[r,0].concat(h));}}),C.appendChild(_);}else for(var c=0;c<t;c++){var l=o(b[c],c);l&&C.appendChild(l);}return C}function isEventAttr(e,t,n){return !!t.startsWith("on")&&((null===e[t]||"function"==typeof e[t])&&("function"==typeof n||"function"==typeof(null==n?void 0:n.listener)||"string"==typeof(null==n?void 0:n.__deco)))}function addEvent(n,r,i){if(r=r.substring(2),"function"==typeof i)n.addEventListener(r,i);else {if(i.__deco){var e,t=i.__deco.split("-"),a=(i={listener:i.v},_createForOfIteratorHelper(t));try{for(a.s();!(e=a.n()).done;){var o=e.value;i[o]=!0;}}catch(e){a.e(e);}finally{a.f();}}n.addEventListener(r,function e(t){i.self&&t.target!==n||(i.stop&&t.stopPropagation(),i.prevent&&t.preventDefault(),i.once&&n.removeEventListener(r,e,i.capture),i.listener(t));},i.capture);}}function reactiveBindingEnable(e,i){var t="object"===_typeof(e)&&!isProxy(e)&&void 0!==e.enable,n=t?e.value:e,a=!0,o="",o=reactiveBinding(n,function(e,t,n,r){o=e,a&&i(e,t,n,r);});return t&&(a=watch(e.enable,function(e){i((a=e)?o:null,null,"","");}).v),i(a?o:null,void 0,"",""),o}function reactiveBindingValue(e,t){t(reactiveBinding(e,t),void 0,"","");}function reactiveClass(i,a){if(isRef(i)||"object"!==_typeof(i))return reactiveBinding(i,function(e){a("",e);});var e=function(){var e,n,t,r={};i.$value?(e=reactiveBinding(i.$value,function(e){var t,n=new Set([]);for(t in r)!0===r[t]&&n.add(t);e.split(" ").forEach(function(e){!1!==r[e]&&n.add(e);}),a("",Array.from(n).join(" "));}),n=new Set(e.split(" ")),delete i.$value):n=new Set([]);for(t in i)!function(t){n[(r[t]=!!reactiveBinding(i[t],function(e){r[t]=e,a(t,e);}))?"add":"delete"](t);}(t);return {v:Array.from(n).join(" ")}}();return "object"===_typeof(e)?e.v:void 0}function reactiveBinding(e,t){if("function"==typeof e||isProxy(e)&&void 0!==e.v)return watch(e,t).v;try{return "string"==typeof e?e:e.toString()}catch(e){throw new Error(e)}}function parseStyle(c,e){if(null==e)return !1;if("function"==typeof e||isProxy(e))reactiveBindingEnable(e,function(e,t,n,r,i){if("string"==typeof e)r&&"v"!==r?c.style[r]=i?"":e:c.setAttribute("style",e);else {for(var a in e)c.style[a]=e[a];for(var o in t)void 0===e[o]&&(c.style[o]="");}});else {if("object"!==_typeof(e))return !1;for(var t in e)!function(t){reactiveBindingEnable(e[t],function(e){c.style[t]=null===e?"":e;});}(t);}return !0}!function(e){e[e.Init=0]="Init",e[e.Break=1]="Break",e[e.Return=2]="Return",e[e.Continue=3]="Continue";}(SwitchResult=SwitchResult||{}),registArrayMap(map);var ModelTag={INPUT:1,SELECT:1,TEXTAREA:1};function parseModel(t,e,n){if("value"!==n&&"checked"!==n)return !1;if(!isProxy(e)&&!e.__deco)return !1;var r=t.tagName;if(!ModelTag[r])return !1;var i=e.__deco||_typeof(e.v),a=(a={boolean:function(e){return "true"===e},number:function(e){return parseFloat(e)},string:function(e){return e}}[i])||function(e){return e},o=e.__deco?e.v:e;return t.addEventListener("SELECT"===r?"change":"input",function(){var e=t[n];i!==_typeof(e)&&(e=a(e)),o.v=Number.isNaN(e)?"":e;}),watch(o,function(e){t[n]=e;},!1),t[n]=o.v,!0}function parseAttributes(p,e){if(null==e)return !1;if("function"==typeof e||isProxy(e))reactiveBindingEnable(e,function(e,t,n,r,i){if("string"==typeof e){if(r&&"v"!==r)return void(i?p.removeAttribute(r):p.setAttribute(r,e));var a,i=e.matchAll(/(.*?)=(.*?)(&|$)/g),o=(e={},_createForOfIteratorHelper(i));try{for(o.s();!(a=o.n()).done;){var c=a.value;e[c[1]]=c[2];}}catch(e){o.e(e);}finally{o.f();}var l,r=t.matchAll(/(.*?)=(.*?)(&|$)/g),u=(t={},_createForOfIteratorHelper(r));try{for(u.s();!(l=u.n()).done;){var f=l.value;t[f[1]]=f[2];}}catch(e){u.e(e);}finally{u.f();}}for(var s in e)p.setAttribute(s,e[s]);for(var d in t)void 0===e[d]&&p.removeAttribute(d);});else {if("object"!==_typeof(e))return !1;for(var t in e)!function(t){reactiveBindingEnable(e[t],function(e){null===e?p.removeAttribute(e):p.setAttribute(t,e);});}(t);}return !0}function transformOptionsToElement(n){if(n.isText)r=Renderer.createTextNode(""),""!==n.text&&reactiveBindingValue(n.text,function(e){r.textContent=e;});else {var e=!!n.tag,r=e?Renderer.createElement(n.tag):Renderer.createDocumentFragment();if(n.children&&appendChildren(r,n.children),e)for(var t in n.attributes)(function(t){var e=n.attributes[t];if(isEventAttr(r,t,e))return addEvent(r,t,e);if("$mount"===t)e.appendChild(r);else if("$attributes"===t)parseAttributes(r,e);else if("$show"===t)reactiveBindingEnable(e,function(e){r.style.display=e?"":"none";});else {if("class"!==t)return "style"===t&&parseStyle(r,e)||parseModel(r,e,t)||reactiveBindingEnable(e,function(e){null===e?r.removeAttribute(t):r.setAttribute(t,e);});r.className=reactiveClass(e,function(e,t){e?t?r.classList.add(e):r.classList.remove(e):r.className=t;});}})(t);}return r}function appendChildren(e,t){var n,r=_createForOfIteratorHelper(t);try{for(r.s();!(n=r.n()).done;){var i,a=n.value;if(null!=a){if(Array.isArray(a))return void appendChildren(e,a);Renderer.isElement(a)?e.appendChild(a):(i=transformOptionsToElement(isJSXElement(a)?a:{text:a,isText:!0}),e.appendChild(i));}}}catch(e){r.e(e);}finally{r.f();}}function isJSXElement(e){return "object"===_typeof(e)&&!0===e.jsx}var JSX={createElement:function(e){for(var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length,r=new Array(2<n?n-2:0),i=2;i<n;i++)r[i-2]=arguments[i];if("function"!=typeof e)return transformOptionsToElement({tag:e,attributes:t,children:r,jsx:!0});var a,o=t.$mount;for(a in delete t.$mount,t){var c=t[a];isProxy(c)||(t[a]={v:c});}var l=transformAsyncDom(e(t,r));return o&&o.appendChild(l),l}};function transformAsyncDom(e){var t=!(1<arguments.length&&void 0!==arguments[1])||arguments[1],n=2<arguments.length?arguments[2]:void 0;if(e&&e instanceof Promise){if(!1===t)return;var r=Renderer.createDocumentFragment(),i=Renderer.createEmptyMountNode();return r.appendChild(i),e.then(function(e){if(Renderer.isElement(e)){var t=getParent(i,r);try{t.insertBefore(e,i);}catch(e){console.log("node 已被隐藏");}finally{null!=n&&n(e),i.remove();}}}),r}return e}function transformElementToCache(e){return e?Renderer.isFragment(e)?Array.from(e.childNodes):Array.isArray(e)?e:[e]:null}function transformCacheToElement(e){if(!e)return null;if(1===e.length)return e[0];var t,n=Renderer.createDocumentFragment(),r=_createForOfIteratorHelper(e);try{for(r.s();!(t=r.n()).done;){var i=t.value;n.appendChild(i);}}catch(e){r.e(e);}finally{r.f();}return n}function createCallCache(){var c=new WeakMap;return {call:function(t,n){var r=this,e=(t.visit(),t.call),i=c.get(e);if(console.log("branch debug:item",t.id,i),void 0!==i)return transformCacheToElement(i);var a,o,i=e();if(!1===e.returned?a=transformAsyncDom(i,!1):o=getFirstElement(a=transformAsyncDom(i,!(o=null),function(e){r.modifyCache(t,e),null!=n&&n.replaceStart(o,e),o=null;})),Renderer.isElement(a)||void 0===a)return this.modifyCache(t,a),a;throw new Error("动态条件分支中不允许返回非元素类型")},modifyCache:function(e,t){e.call&&(t=transformElementToCache(t),console.log("branch debug: cacheMap set",e.id,t),c.set(e.call,t));},setCache:function(e,t){c.set(e,t);},_get:function(e){return c.get(e)}}}function createBranchLink(i,e){console.log("createBranchLink");var a=[],o=0,c={anchor:e,parent:null},l=null,u=null,f=!1;return {next:function(e,t){var n=2<arguments.length&&void 0!==arguments[2]&&arguments[2],r=function(e,n){var t=0===a.length?c:a[a.length-1],t=2<arguments.length&&void 0!==arguments[2]&&arguments[2]?t:null==t?void 0:t.parent;return {id:o++,call:e,parent:t,activeChild:null,anchor:n,current:function(){return l},isVisible:function(e){if(!u){u=new WeakMap;for(var t=e||l,n=[];t;)n.push(t.id),u.set(t,1),t=t.parent;console.log("branch debug:branchpath",n.toString());}if(!!u.get(this))return !0;var r=this.parent;if(!r||u.get(r))return !0;for(;r;){if(!!u.get(r))break;r=r.parent;}return !1},visit:function(){l!==this&&(f&&(a=[this]),(l=this).parent&&(this.parent.activeChild=this),u=null);},updateCache:function(){var e,t=n.getNodes();console.log("branch debug: updateCache",this.id,t),i.setCache(this.call,t),null!=(e=null==(t=this.parent)?void 0:t.updateCache)&&e.call(t);},updateActiveCache:function(){var e,t;null!=(t=null==(e=this.getBottomChild().parent)?void 0:e.updateCache)&&t.call(e);},clearCache:function(){},getBottomChild:function(){for(var e=this;e.activeChild;)e=e.activeChild;return e}}}(e,t,n);return n?a.push(r):a[a.length-1]=r,console.warn("branch debug:next:".concat(r.id,":").concat(n),r.call.toString()),r},back:function(){console.warn("branch:back");var e=a.pop();return 0===a.length&&(f=!0),e}}}function createContext(){var e=createCallCache(),t=createAnchor(e),n={anchor:t,cache:e,branch:createBranchLink(e,t)};return {util:n,if:function(e,t){return _if(e,t,n)},switch:function(e,t){return _switch(e,t,n)}}}var ContextTool={ce:JSX.createElement,mnr:function(e){return e.returned=!1,e},r:react,c:computed,w:watch,cc:function(e,t){return computed({get:e,set:t})}},_$$=(Object.assign(createContext,ContextTool),createContext);

    let count = _$$.r({
      v: 1
    });
    _$$.ce("button", {
      $mount: document.body,
      onclick: () => {
        count.v++;
      }
    }, "click:", count);

})();