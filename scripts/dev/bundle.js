// packages/utils/src/utils.ts
function split(str, s) {
  const index2 = str.indexOf(s);
  if (index2 === -1 || !s)
    return [str, ""];
  return [str.substring(0, index2), str.substring(index2 + 1)];
}
function join(array, fn) {
  let str = "";
  for (let i2 = 0; i2 < array.length - 1; i2++) {
    str += `${array[i2]}${typeof fn === "function" ? fn(i2) : fn[i2]}`;
  }
  return str + array[array.length - 1];
}
function isStringTemplateArray(data) {
  return data instanceof Array && data.raw instanceof Array;
}
function splitTwoPart(str, sep) {
  const index2 = str.indexOf(sep);
  if (index2 === -1)
    return [str, ""];
  return [str.substring(0, index2).trim(), str.substring(index2 + 1).trim()];
}

// packages/utils/src/types/symbol.ts
var subscribe = Symbol();
var forceUpdate = Symbol();
var index = Symbol();
var value = Symbol();
var reactValue = Symbol();
var getListeners = Symbol();
var updateFirstLevel = Symbol();
var json = Symbol();

// packages/reactive/src/proxy.ts
function createProxy(originData, firstLevel = true, changeList = []) {
  const data = originData;
  if (typeof data === "object") {
    for (const key in data) {
      if (key === "toJSON")
        break;
      data[key] = reactiveProxyValue(data[key]);
    }
  }
  const triggerChange = (newValue, oldValue, index2) => {
    console.log(newValue, oldValue);
    for (let i2 = 0; i2 < changeList.length; i2++) {
      changeList[i2](newValue, oldValue, index2);
    }
  };
  Object.assign(data, {
    [subscribe](fn) {
      changeList.push(fn);
      return data;
    },
    [forceUpdate]() {
      triggerChange(data, data);
    },
    [reactValue]: false,
    [updateFirstLevel]: () => {
      firstLevel = false;
    },
    [getListeners]: () => changeList,
    get [json]() {
      return getReactionPureValue(data);
    }
  });
  return new Proxy(data, {
    get(target, property, receiver) {
      if (property === value)
        return data;
      const type = typeof data[property];
      if (!(Array.isArray(target) && (property === "length" || type === "function"))) {
        if (type === "undefined" && property !== "toJSON") {
          data[property] = reactiveValue("", true);
        }
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, v, receiver) {
      const isArray = target instanceof Array;
      const isSymbol = typeof property === "symbol";
      const parseIndex = () => isArray && !isSymbol && /^\d+$/.test(property) ? parseInt(property) : -1;
      const set = () => {
        return Reflect.set(target, property, v, receiver);
      };
      if (isArray) {
        if (property === "length")
          return set();
        if (target.includes(v)) {
          const index2 = parseIndex();
          triggerChange(v, target[index2], index2);
          return set();
        }
      }
      if (isSymbol) {
        if (property === value) {
          if (firstLevel) {
            console.warn("\u4E0D\u80FD\u5BF9\u4E00\u7EA7\u5BF9\u8C61\u8BBE\u7F6Evalue\u5C5E\u6027");
            return true;
          }
        }
        return set();
      }
      const oldValue = target[property];
      if (isReaction(v)) {
        v[updateFirstLevel]();
        triggerChange(v, oldValue);
        return set();
      }
      const isOldValueUnd = typeof oldValue === "undefined";
      if (isOldValueUnd) {
        v = reactiveProxyValue(v);
        triggerChange(v, oldValue, parseIndex());
      } else {
        if (oldValue[reactValue]) {
          target = oldValue;
          property = "value";
        } else {
          v = reactiveProxyValue(v);
          if (isArray) {
            const index2 = parseIndex();
            triggerChange(v, target[index2], index2);
          } else {
            mergeReact(oldValue, v);
          }
        }
      }
      return set();
    },
    deleteProperty(target, property) {
      if (target instanceof Array) {
        const index2 = typeof property === "string" && /^\d+$/.test(property) ? parseInt(property) : -1;
        triggerChange(void 0, target[index2], index2);
      } else {
        triggerChange(void 0, target[property]);
      }
      return Reflect.deleteProperty(target, property);
    }
  });
}

// packages/reactive/src/react.ts
function bindReactive({
  template,
  reactions
}) {
  return {
    templateValue() {
      return template.join("");
    },
    isEmpty() {
      return reactions.length === 0;
    },
    exe(context) {
      return { template, reactions, context };
    },
    modTemplate(mod, i2 = template.length - 1) {
      template[i2] = mod(template[i2]);
    },
    type: "react"
  };
}
function createReactive(data) {
  if (isSimpleValue(data)) {
    return reactiveValue(data);
  }
  if (typeof data === "object") {
    return createProxy(data);
  }
  throw new Error("createReactive error");
}
function reactiveValue(value2, isUndefined = false) {
  const changeList = [];
  return {
    isUndefined() {
      return typeof value2 === "undefined" || isUndefined;
    },
    get value() {
      var _a, _b;
      (_b = (_a = Compute).add) == null ? void 0 : _b.call(_a, this);
      return value2;
    },
    set value(v) {
      if (isUndefined)
        isUndefined = false;
      if (v instanceof Array)
        v = v.join("\n");
      if (v === value2)
        return;
      const old = value2;
      value2 = v;
      changeList.forEach((fn) => {
        fn(v, old);
      });
    },
    [reactValue]: true,
    [subscribe](fn) {
      changeList.push(fn);
      return this.value;
    },
    [forceUpdate]() {
      changeList.forEach((fn) => {
        fn(value2, value2);
      });
    },
    toJSON() {
      return isUndefined ? void 0 : this.value;
    },
    [getListeners]: () => {
      return changeList;
    }
  };
}
function react(data, ...reactions) {
  if (isStringTemplateArray(data)) {
    return bindReactive({
      template: data,
      reactions
    });
  } else if (typeof data === "string" && reactions.length > 0) {
    return bindReactive(transArgsToTemplate(data, reactions));
  } else {
    return createReactive(data);
  }
}
function transArgsToTemplate(data, reactions) {
  const template = [data];
  let isLastString = true;
  for (let i2 = 0; i2 < reactions.length; i2++) {
    const reaction = reactions[i2];
    const isString = typeof reaction === "string";
    if (isString) {
      isLastString ? template[template.length - 1] += reaction : template.push(reaction);
      reactions.splice(i2, 1);
      i2--;
    }
    if (!isLastString && !isString) {
      template.push("");
    }
    isLastString = isString;
    ;
  }
  if (!isLastString)
    template.push("");
  return {
    template,
    reactions
  };
}
function transformToReaction(item) {
  return typeof item === "function" ? computed(item) : item;
}
function countReaction(item) {
  return typeof item === "function" ? item() : item.value;
}
function countBindingValue(binding) {
  return join(binding.template, binding.reactions.map((r) => countReaction(r)));
}
function isSimpleValue(v) {
  return typeof v !== "object" || v === null;
}
function isReactSimpleValue(v) {
  return v[reactValue] === true;
}
function mergeReact(oldReact, newValue) {
  if (typeof newValue === "function")
    return;
  if (isReactSimpleValue(newValue)) {
    mergeListeners(oldReact, newValue);
  } else {
    const newKeys = Object.keys(newValue);
    const oldTarget = oldReact;
    for (const k in oldReact) {
      const oldItem = oldTarget[k];
      const index2 = newKeys.indexOf(k);
      if (index2 !== -1) {
        mergeReact(oldItem, newValue[k]);
        newKeys.splice(index2, 1);
      } else {
        delete oldTarget[k];
      }
    }
    for (let i2 = 0; i2 < newKeys.length; i2++) {
      const key = newKeys[i2];
      oldTarget[key] = reactiveProxyValue(newValue[key]);
    }
  }
}
function mergeListeners(oldReact, newReact) {
  const arr = oldReact[getListeners]();
  if (arr.length > 0) {
    newReact[getListeners]().push(...arr);
    newReact[forceUpdate]();
  }
}
function isReaction(v) {
  return !!(v == null ? void 0 : v[subscribe]);
}
function getReactionPureValue(data) {
  return isReaction(data) ? JSON.parse(JSON.stringify(data)) : data;
}
function reactiveProxyValue(v) {
  if (isReaction(v))
    return v;
  if (!isSimpleValue(v))
    return createProxy(v, false);
  return reactiveValue(v);
}
window.react = react;

// packages/reactive/src/computed.ts
var Compute = {
  add: null
};
var computed = (target) => {
  const isFunc = typeof target === "function";
  const get = isFunc ? target : target.get;
  const set = isFunc ? null : target.set;
  const reacts = [];
  Compute.add = (item) => {
    reacts.push(item);
  };
  const value2 = get();
  Compute.add = null;
  const react2 = reactiveComputed(get, set, value2);
  reacts.forEach((item) => item[subscribe](() => {
    react2[forceUpdate]();
  }));
  return react2;
};
function reactiveComputed(get, set, value2) {
  const changeList = [];
  return {
    isUndefined: () => typeof value2 === "undefined",
    get value() {
      var _a;
      (_a = Compute.add) == null ? void 0 : _a.call(Compute, this);
      value2 = get();
      return value2;
    },
    set value(v) {
      if (!set) {
        console.warn("\u5BF9\u53EA\u8BFBcomputed\u8BBE\u7F6E\u503C\u65E0\u6548");
        return;
      }
      set(v, this.value);
    },
    [subscribe](fn) {
      changeList.push(fn);
      return this.value;
    },
    [forceUpdate]() {
      const old = value2;
      const v = this.value;
      changeList.forEach((fn) => {
        fn(v, old);
      });
    },
    [reactValue]: isSimpleValue(value2),
    [getListeners]: () => changeList,
    toJSON: () => value2
  };
}
function computedReactBuilder(builder, type = "computed") {
  if (!builder.isEmpty()) {
    return computed(() => countBindingValue(builder.exe({ type })));
  }
  return null;
}
function subscribeReactBuilder(builder, onchange, type = "computed") {
  const compute = computedReactBuilder(builder, type);
  return compute ? compute[subscribe](onchange) : builder.templateValue();
}
window.computedReactBuilder = computedReactBuilder;

// packages/reactive/src/binding.ts
var ReplaceExp = /\$\$\d+\$\$/;
var ReplaceExpG = /\$\$\d+\$\$/g;
var ReplacementMap = [];
var ReplacementMapReverse = {};
function createReplacement(i2) {
  if (ReplacementMap[i2])
    return ReplacementMap[i2];
  const str = `$$${i2}$$`;
  ReplacementMap[i2] = str;
  ReplacementMapReverse[str] = i2;
  return str;
}
function parseReplacementToNumber(replacement) {
  return ReplacementMapReverse[replacement] || parseInt(replacement.replace(/\$\$/g, ""));
}
function extractReplacement(str) {
  const results = str.match(ReplaceExpG);
  if (!results)
    return null;
  return results;
}
function createTemplateReplacement(template, start = 0) {
  return join(template, (i2) => createReplacement(i2 + start));
}
function reactiveTemplate(templateRep, reactions, callback, needOldContent = false) {
  if (reactions.length === 0)
    return templateRep;
  const results = extractReplacement(templateRep);
  if (results) {
    const texts = templateRep.split(ReplaceExp);
    const filler = results.map((item, i2) => {
      const index2 = parseReplacementToNumber(item);
      const reaction = transformToReaction(reactions[index2]);
      return reaction[subscribe]((value2) => {
        const oldContent = needOldContent ? join(texts, filler) : "";
        filler[i2] = value2;
        const newContent = join(texts, filler);
        callback(newContent, oldContent);
      });
    });
    return join(texts, filler);
  }
  return templateRep;
}

// packages/core/src/parser/info-parser.ts
window.parseCount = 0;
function parseDomInfo(info) {
  window.parseCount++;
  if (!"./#[:".includes(info[0]))
    info = `:${info}`;
  const result = { textContent: "" };
  let scope = "";
  let lastIndex = 0;
  const modScope = (index2, newScope) => {
    scope = newScope;
    lastIndex = index2;
  };
  const appendInfo = (index2, newScope) => {
    if (scope === "attributes" && newScope !== "")
      return;
    if (!scope)
      return modScope(index2, newScope);
    const value2 = info.substring(lastIndex + 1, index2);
    switch (scope) {
      case "className":
        {
          if (!result.className)
            result.className = [];
          result.className.push(value2);
        }
        ;
        break;
      case "id":
        result.id = value2;
        break;
      case "attributes":
        {
          if (!result.attributes)
            result.attributes = {};
          const [key, kv] = split(value2, "=");
          result.attributes[key] = kv;
        }
        ;
        break;
      case "textContent":
        {
          result.textContent += value2;
        }
        ;
        break;
      case "tagName":
        {
          result.tagName = value2;
        }
        ;
        break;
    }
    modScope(index2, newScope);
  };
  const len = info.length;
  for (let i2 = 0; i2 < len; i2++) {
    switch (info[i2]) {
      case ".":
        appendInfo(i2, "className");
        break;
      case "#":
        appendInfo(i2, "id");
        break;
      case "[":
        appendInfo(i2, "attributes");
        break;
      case "]":
        appendInfo(i2, "");
        break;
      case "/":
        appendInfo(i2, "tagName");
        break;
      case ":":
        if (scope !== "textContent") {
          appendInfo(i2, "textContent");
        }
        break;
    }
  }
  appendInfo(info.length, "");
  return result;
}

// packages/core/src/element/transform.ts
function mergeDomInfo(config, domInfo) {
  if (domInfo.className)
    config.className.push(...domInfo.className);
  if (domInfo.attributes)
    Object.assign(config.attributes, domInfo.attributes);
  if (domInfo.id)
    config.id = domInfo.id;
  if (domInfo.textContent)
    config.textContent += domInfo.textContent;
}
function transformBuilderToDom(builder) {
  const config = builder.exe();
  const dom2 = document.createElement(config.tag);
  for (let i2 = 0; i2 < config.binding.length; i2++) {
    const binding = config.binding[i2];
    switch (binding.context.type) {
      case "dom-info":
        {
          const domInfo = applyDomInfoReaction(dom2, binding);
          mergeDomInfo(config, domInfo);
        }
        ;
        break;
    }
  }
  if (config.domInfo)
    mergeDomInfo(config, parseDomInfo(config.domInfo));
  if (config.textContent) {
    setNodeText(dom2, config.textContent);
  }
  if (config.className.length > 0)
    dom2.className = config.className.join(" ");
  if (config.attributes) {
    for (const k in config.attributes) {
      dom2.setAttribute(k, config.attributes[k]);
    }
  }
  if (config.id)
    dom2.id = config.id;
  if (config.children && config.children.length > 0) {
    mountChildrenDoms(dom2, config.children);
  }
  for (let i2 = 0; i2 < config.event.length; i2++) {
    config.event[i2].exe(dom2);
  }
  ;
  config.styles.forEach((style2) => style2.exe(dom2));
  return dom2;
}
function mountChildrenDoms(parent, children) {
  const frag = document.createDocumentFragment();
  for (const item of children) {
    mountSingleChild(parent, frag, item);
  }
  parent.appendChild(frag);
}
function mountSingleChild(parent, frag, item) {
  if (item instanceof Array) {
    for (const child of item) {
      mountSingleChild(parent, frag, child);
    }
  } else if (item instanceof HTMLElement) {
    frag.appendChild(item);
  } else if (item) {
    switch (item.type) {
      case "comp":
        mountSingleChild(parent, frag, item.exe());
        break;
      case "builder":
        frag.appendChild(transformBuilderToDom(item));
        break;
      case "if":
      case "switch":
        frag.appendChild(item.exe(parent));
        break;
      case "for":
      case "show":
      case "model":
        frag.appendChild(item.exe());
        break;
    }
  }
}
function setNodeText(node, v) {
  if (isInputNode(node))
    node.value = v;
  else
    node.textContent = v;
}
function isInputNode(node) {
  return typeof node.value !== "undefined" && node.tagName !== "BUTTON";
}
function applyDomInfoReaction(dom2, binding) {
  const { template, reactions } = binding;
  const replacement = join(template, createReplacement);
  const info = parseDomInfo(replacement);
  const data = {};
  if (info.textContent) {
    const textContent = info.textContent;
    const results = extractReplacement(textContent);
    if (results) {
      if (isInputNode(dom2)) {
        dom2.value = reactiveTemplate(textContent, reactions, (content) => {
          dom2.value = content;
        }, false);
      } else {
        const texts = textContent.split(ReplaceExp);
        texts.forEach((text2, i2) => {
          if (text2)
            dom2.appendChild(document.createTextNode(text2));
          if (!results[i2])
            return;
          const index2 = parseReplacementToNumber(results[i2]);
          const reactionItem = reactions[index2];
          if (!reactionItem)
            return;
          const reaction = transformToReaction(reactionItem);
          const node = document.createTextNode(reaction[subscribe]((v) => {
            node.textContent = v;
          }));
          dom2.appendChild(node);
        });
      }
    } else {
      data.textContent = textContent;
    }
  }
  if (info.className) {
    info.className.forEach((name) => {
      if (!data.className)
        data.className = [];
      data.className.push(reactiveTemplate(name, reactions, (content, oldContent) => {
        dom2.classList.replace(oldContent, content);
      }, true));
    });
  }
  if (info.attributes) {
    for (const k in info.attributes) {
      let value2 = "";
      let key = reactiveTemplate(k, reactions, (content, oldContent) => {
        dom2.removeAttribute(oldContent);
        dom2.setAttribute(content, value2);
        key = content;
      }, true);
      value2 = reactiveTemplate(info.attributes[k], reactions, (content) => {
        dom2.setAttribute(key, content);
        value2 = content;
      });
      if (!data.attributes)
        data.attributes = {};
      data.attributes[key] = value2;
    }
  }
  if (info.id) {
    const id = reactiveTemplate(info.id, reactions, (content) => {
      dom2.id = content;
    });
    dom2.id = id;
  }
  return data;
}
function createElement({
  tag = "",
  className = [],
  id = "",
  textContent = "",
  attributes = {},
  children,
  binding = [],
  domInfo = "",
  event: event2 = [],
  _if,
  styles = []
}) {
  return {
    tag,
    className,
    id,
    textContent,
    attributes,
    children,
    binding,
    domInfo,
    event: event2,
    _if,
    styles
  };
}

// packages/core/src/mount.ts
function mount(...builders) {
  let parent = builders[0];
  if (typeof parent === "string") {
    parent = document.querySelector(parent);
    if (!(parent instanceof Element))
      throw new Error("Parent is not defined");
  }
  if (parent instanceof HTMLElement) {
    builders.shift();
  } else
    parent = document.body;
  mountChildrenDoms(parent, builders);
}

// packages/core/src/controller/model.ts
var modelController = function(value2, ...decorators) {
  const react2 = transformToReaction(value2);
  const constructor = this;
  return (...args) => {
    return {
      exe() {
        let isInput = false;
        const builder = constructor.apply(null, args);
        const dom2 = transformBuilderToDom(builder);
        const isCEDom = dom2.contentEditable === "true";
        const getValue = isCEDom ? () => dom2.textContent || "" : () => dom2.value || "";
        const setValue = isCEDom ? (v) => {
          dom2.textContent = v;
        } : (v) => {
          dom2.value = v;
        };
        setValue(react2[subscribe]((v) => {
          if (isInput) {
            isInput = false;
            return;
          }
          setValue(v);
        }));
        const triggerChange = (v) => {
          isInput = true;
          if (decorators.length !== 0) {
            if (decorators.includes("number")) {
              v = parseFloat(v);
            } else if (decorators.includes("camel")) {
              v = v.toLowerCase();
            }
          }
          react2.value = v;
        };
        let isComposite = false;
        dom2.addEventListener("compositionstart", () => {
          isComposite = true;
        });
        dom2.addEventListener("compositionend", () => {
          isComposite = false;
          triggerChange(getValue());
        });
        dom2.addEventListener("input", () => {
          if (!isComposite)
            triggerChange(getValue());
        });
        return dom2;
      },
      type: "model"
    };
  };
};

// packages/core/src/controller/for.ts
var forController = function(list) {
  return (callback) => {
    const mount2 = document.createComment("");
    const doms = [];
    const builders = [];
    const makeBuilder = callback.length === 2 ? (i2, item) => {
      const indexReactive = createReactive(i2);
      if (typeof item === "undefined")
        item = list[i2];
      item[index] = indexReactive;
      return callback(item, indexReactive);
    } : (i2, item) => {
      if (typeof item === "undefined")
        item = list[i2];
      return callback(item, void 0);
    };
    for (let i2 = 0; i2 < list.length; i2++) {
      const builder = makeBuilder(i2);
      builders.push(this.apply(null, builder));
    }
    const p = list;
    p[subscribe]((newValue, oldValue, i2) => {
      var _a, _b;
      console.log(newValue, oldValue, i2);
      const oldIndex = list.indexOf(newValue);
      if (oldIndex !== -1) {
        const oldDom = doms[i2];
        doms[i2] = doms[oldIndex];
        doms[oldIndex] = oldDom;
        newValue[index].value = i2;
      } else {
        if (typeof newValue === "undefined") {
          (_a = doms[i2]) == null ? void 0 : _a.remove();
          doms.splice(i2, 1);
        } else {
          const builder = this.apply(null, makeBuilder(i2, newValue));
          const oldDom = doms[i2];
          if (oldDom) {
            mergeReact(oldValue, newValue);
          } else {
            const dom2 = transformBuilderToDom(builder);
            const after = doms[i2 + 1];
            (_b = mount2.parentElement) == null ? void 0 : _b.insertBefore(dom2, after || mount2);
            doms[i2] = dom2;
          }
        }
      }
    });
    return {
      exe() {
        const frag = document.createDocumentFragment();
        for (const child of builders) {
          const dom2 = transformBuilderToDom(child);
          doms.push(dom2);
          frag.appendChild(dom2);
        }
        frag.append(mount2);
        return frag;
      },
      type: "for"
    };
  };
};

// packages/core/src/controller/if.ts
var ifController = function(bool) {
  const changeList = [];
  const node = document.createComment("");
  let elseBuilder = null;
  const builders = [];
  const pushBuilder = (args, isElse = false) => {
    const builder = this.apply(null, args);
    if (isElse)
      elseBuilder = builder;
    else
      builders.push(builder);
  };
  let activeIndex = 0;
  const doms = [];
  const getDom = (builder) => {
    if (!builder)
      return node;
    let dom2 = doms[activeIndex];
    if (dom2)
      return dom2;
    dom2 = transformBuilderToDom(builder);
    doms[activeIndex] = dom2;
    return dom2;
  };
  const exe = (start = 0) => {
    for (let i2 = start; i2 < reactList.length; i2++) {
      if (reactList[i2].value === true) {
        activeIndex = i2;
        return getDom(builders[i2]);
      }
    }
    if (elseBuilder) {
      activeIndex = reactList.length;
      return getDom(elseBuilder);
    }
    activeIndex = -1;
    return getDom();
  };
  const reactList = [];
  const pushReact = (bool2) => {
    const i2 = reactList.length;
    const react2 = transformToReaction(bool2);
    react2[subscribe]((v) => {
      let dom2 = null;
      if (v) {
        if (i2 < activeIndex || activeIndex === -1) {
          activeIndex = i2;
          dom2 = transformBuilderToDom(builders[i2]);
        }
      } else {
        dom2 = exe(activeIndex);
      }
      if (dom2)
        changeList.forEach((fn) => fn(dom2));
    });
    reactList.push(react2);
  };
  pushReact(bool);
  return (...args) => {
    pushBuilder(args);
    return {
      exe(parent) {
        let node2 = exe();
        changeList.push((d) => {
          if (d === node2)
            return;
          parent.insertBefore(d, node2);
          parent.removeChild(node2);
          node2 = d;
        });
        return node2;
      },
      elif(bool2) {
        pushReact(bool2);
        return (...args2) => {
          pushBuilder(args2);
          return this;
        };
      },
      else(...args2) {
        pushBuilder(args2, true);
        return this;
      },
      type: "if"
    };
  };
};

// packages/core/src/controller/show.ts
var showController = function(bool) {
  const react2 = transformToReaction(bool);
  const constructor = this;
  return (...args) => {
    return {
      exe() {
        const builder = constructor.apply(null, args);
        const dom2 = transformBuilderToDom(builder);
        react2[subscribe]((v) => {
          dom2.style.display = v ? "" : "none";
        });
        return dom2;
      },
      type: "show"
    };
  };
};

// packages/core/src/controller/switch.ts
var switchController = function(value2) {
  const defaultValue = Symbol("def");
  const node = document.createComment("");
  const builders = /* @__PURE__ */ new Map();
  const doms = /* @__PURE__ */ new Map();
  const getDom = (value3) => {
    const builder = builders.get(value3) || builders.get(defaultValue);
    if (!builder) {
      return node;
    }
    let dom2 = doms.get(builder);
    if (dom2)
      return dom2;
    dom2 = transformBuilderToDom(builder);
    doms.set(builder, dom2);
    return dom2;
  };
  const addBuilder = (args, value3) => {
    const builder = this.apply(null, args);
    builders.set(value3, builder);
  };
  const react2 = transformToReaction(value2);
  return {
    exe(parent) {
      let node2 = getDom(react2.value);
      react2[subscribe]((v) => {
        const dom2 = getDom(v);
        if (dom2 === node2)
          return;
        parent.insertBefore(dom2, node2);
        parent.removeChild(node2);
        node2 = dom2;
      });
      return node2;
    },
    case(value3) {
      return (...args) => {
        addBuilder(args, value3);
        return this;
      };
    },
    default(...args) {
      addBuilder(args, defaultValue);
      return this;
    },
    type: "switch"
  };
};

// packages/core/src/controller/controller.ts
var controllers = {
  for: forController,
  if: ifController,
  show: showController,
  model: modelController,
  switch: switchController
};

// packages/core/src/builder/builder.ts
function getTagNameFromDomInfo(domInfo) {
  if (domInfo[0] !== "/")
    return "";
  for (let i2 = 1; i2 < domInfo.length; i2++) {
    if (".#[:".includes(domInfo[i2]))
      return domInfo.substring(1, i2);
  }
  return domInfo.substring(1);
}
function elementBuilder(tag, data) {
  var _a, _b;
  const elementOptions = {
    tag,
    children: [],
    event: [],
    binding: [],
    styles: [],
    domInfo: ""
  };
  for (let i2 = 0; i2 < data.length; i2++) {
    const item = data[i2];
    if (typeof item === "string") {
      const tagName = getTagNameFromDomInfo(item);
      if (tagName)
        elementOptions.tag = tagName;
      elementOptions.domInfo += item;
    } else if (item instanceof Array) {
      elementOptions.children.push(item);
    } else if (typeof item === "object" && item) {
      switch (item.type) {
        case "react":
          const binding = item.exe({ type: "dom-info" });
          if (binding.template[0][0] === "/") {
            const domInfo = countBindingValue(binding);
            elementOptions.tag = getTagNameFromDomInfo(domInfo);
          }
          elementOptions.binding.push(binding);
          break;
        case "builder":
        case "if":
        case "show":
        case "model":
        case "switch":
        case "for":
        case "comp":
          elementOptions.children.push(item);
          break;
        case "on":
          (_a = elementOptions.event) == null ? void 0 : _a.push(item);
          break;
        case "style":
          (_b = elementOptions.styles) == null ? void 0 : _b.push(item);
          break;
        default:
          console.warn("unkonwn builder", item);
          break;
      }
    } else if (typeof item === "function") {
      data.push(...item());
    }
  }
  return createElement(elementOptions);
}
function buildFactory(tag) {
  return Object.assign((...data) => {
    return createBaseBuilder(() => {
      return elementBuilder(tag, data);
    });
  }, controllers);
}
var div = buildFactory("div");
var span = buildFactory("span");
var input = buildFactory("input");
var button = buildFactory("button");
var img = buildFactory("img");
var a = buildFactory("a");
var i = buildFactory("i");
var text = (v) => ":" + v;
function createBaseBuilder(exe) {
  return {
    exe,
    type: "builder"
  };
}

// packages/core/src/comp/comp.ts
var comp = (...args) => {
  return {
    exe() {
      const options = {
        prop: {},
        event: {},
        slot: {}
      };
      let component = null;
      for (let i2 = 0; i2 < args.length; i2++) {
        const item = args[i2];
        if (typeof item === "function") {
          if (i2 === 0) {
            component = item;
          } else {
            args.push(...item());
          }
        } else if (item) {
          switch (item.type) {
            case "prop":
              options.prop = item.exe();
              break;
            case "event":
              options.event = item.exe();
              break;
            case "slot":
              options.slot = item.exe();
              break;
          }
        }
      }
      if (!component)
        throw new Error("Component not found");
      return component(options);
    },
    type: "comp"
  };
};

// packages/core/src/comp/prop.ts
var prop = (prop2) => {
  return {
    type: "prop",
    exe() {
      const data = {};
      for (const k in prop2) {
        const item = prop2[k];
        window.item = item;
        const computeTarget = typeof item === "function" ? item : isReaction(item) ? () => item.value : () => item;
        data[k] = computed(computeTarget);
      }
      return data;
    }
  };
};

// packages/core/src/comp/event.ts
var event = (event2) => {
  return {
    type: "event",
    exe() {
      return event2;
    }
  };
};

// packages/core/src/comp/slot.ts
var slot = (slot2) => {
  return {
    type: "slot",
    exe: () => slot2
  };
};

// packages/core/src/event/on.ts
function on(name, listener, ...decorators) {
  const eventArgs = [];
  return {
    args(...args) {
      eventArgs.push(...args);
      return this;
    },
    exe(dom2) {
      if (decorators.length === 0) {
        dom2.addEventListener(name, (e) => {
          listener.apply(dom2, [...eventArgs, e]);
        });
      } else {
        const is = (name2) => decorators.includes(name2);
        const useCapture = is("capture");
        const handle = (e) => {
          if (is("self") && e.target !== dom2)
            return;
          if (is("stop"))
            e.stopPropagation();
          if (is("prevent"))
            e.preventDefault();
          listener.apply(dom2, [...eventArgs, e]);
          if (is("once"))
            dom2.removeEventListener(name, handle, useCapture);
        };
        dom2.addEventListener(name, handle, useCapture);
      }
    },
    type: "on",
    name
  };
}
var [
  click,
  mousedown,
  mouseup,
  mousemove
] = [
  "click",
  "mousedown",
  "mouseup",
  "mousemove"
].map((name) => {
  return (listener) => on(name, listener);
});

// packages/style/src/css.ts
var css = (selector) => {
  return (...args) => {
    const style2 = document.createElement("style");
    const { template, reactions } = buildCssFragment(selector, args);
    let content = "";
    if (reactions.length > 0) {
      content = reactiveTemplate(template, reactions, (content2) => {
        style2.innerText = content2;
      });
    } else {
      content = template;
    }
    style2.innerText = content;
    return {
      style: style2,
      mount(selector2 = "head") {
        let parent;
        if (typeof selector2 === "string") {
          parent = document.querySelector(selector2);
        } else {
          parent = selector2;
        }
        if (!parent)
          throw new Error("Invalid mount target");
        parent.appendChild(style2);
      }
    };
  };
};
function buildCssFragment(selector, args, path = "", reactions = []) {
  const selectorPath = concatSelectorPath(path, selector);
  let childStyles = "";
  let currentStyle = "";
  for (const item of args) {
    if (typeof item === "string") {
      currentStyle += item + ";";
    } else if (item instanceof Array) {
      const result = buildCssFragment(item[0], item.slice(1), selectorPath);
      childStyles += result.template;
      reactions.push(...result.reactions);
    } else if (typeof item === "object") {
      const { scopeReactions, scopeTemplate } = item.generate(reactions.length);
      currentStyle += scopeTemplate;
      reactions.push(...scopeReactions);
    }
  }
  return {
    template: `${selectorPath}{${currentStyle}}${childStyles}`,
    reactions
  };
}
function concatSelectorPath(path, name) {
  if (name[0] === "&") {
    return `${path}${name.substring(1)}`;
  } else {
    return `${path} ${name}`;
  }
}

// packages/style/src/style-atom.ts
var IMP = "i";
var DefaultUint = "px";
var StyleAtoms = {
  borderBottom(v, unit, i2) {
    return createAtomChild({}).borderBottom(v, unit, i2);
  },
  width(v, unit, i2) {
    return createAtomChild({}).width(v, unit, i2);
  }
};
function createAtomChild(result = {}) {
  window.xx = result;
  return {
    result,
    borderBottom(v, unit, i2) {
      result.borderBottom = transformAtomStyleValue("borderBottom", v, unit, i2);
      console.log(result);
      return this;
    },
    width(v, unit, i2) {
      result.width = transformAtomStyleValue("width", v, unit, i2);
      console.log(result);
      return this;
    },
    exe(dom2) {
      return style(this.result).exe(dom2);
    },
    type: "style"
  };
}
function transformAtomStyleValue(key, v, unit, i2) {
  if (unit === IMP) {
    i2 = IMP;
    unit = "";
  }
  const tail = `${unit || ""}${createCssITail(i2)}`;
  const iu = !!unit || OnlyNumberAttrs.includes(key);
  if (typeof v === "number" || typeof v === "string") {
    return concatValue(iu, v, tail);
  } else if (v.type === "react") {
    return () => concatValue(iu, countBindingValue(v.exe({ type: "style" })), tail);
  } else if (typeof v === "function") {
    return () => concatValue(iu, v(), tail);
  } else {
    return () => concatValue(iu, v.value, tail);
  }
}
function concatValue(iu, v, tail) {
  if (iu || typeof v === "string")
    return v + tail;
  return typeof v === "number" ? `${v}${DefaultUint}${tail}` : v + tail;
}
function createCssITail(i2) {
  return i2 === IMP ? "!important" : "";
}

// packages/style/src/style.ts
var OnlyNumberAttrs = ["lineHeight", "zIndex", "opacity", "flex"];
var style = Object.assign((a1, ...reactions) => {
  return {
    generate(start = 0) {
      let scopeTemplate = "";
      const scopeReactions = [];
      if (typeof a1 === "string") {
        scopeTemplate += a1;
      } else if (isStringTemplateArray(a1)) {
        const template = a1;
        if (reactions.length === 0)
          scopeTemplate += template[0];
        else {
          scopeTemplate += createTemplateReplacement(template, start);
          scopeReactions.push(...reactions);
        }
      } else if (typeof a1 === "object" || a1 !== null) {
        for (const key in a1) {
          const value2 = a1[key];
          let styleValue = "";
          if (typeof value2 === "string") {
            styleValue = transformStyleValue(key, value2);
          } else if (value2.type === "react") {
            const { template, reactions: reactions2 } = value2.exe({
              type: "style"
            });
            if (reactions2.length > 0) {
              styleValue = createTemplateReplacement(template, scopeReactions.length);
              scopeReactions.push(...reactions2);
            } else {
              styleValue = template.join("");
            }
          } else {
            const reaction = transformToReaction(value2);
            styleValue = createReplacement(scopeReactions.length);
            scopeReactions.push(reaction);
          }
          scopeTemplate += `${transformStyleAttr(key)}:${styleValue};`;
        }
        return {
          scopeTemplate,
          scopeReactions
        };
      }
      console.warn("Invalid style arguments");
      return { scopeTemplate: "", scopeReactions: [] };
    },
    exe(dom2) {
      const beforeStyle = dom2.getAttribute("style") || "";
      let newStyle = beforeStyle;
      if (typeof a1 === "string") {
        newStyle += a1;
      } else if (isStringTemplateArray(a1)) {
        const template = a1;
        if (reactions.length === 0) {
          newStyle += template[0];
        } else {
          const templateRep = createTemplateReplacement(template);
          const [styles, reactStyles] = parseStyleTemplateToObject(templateRep);
          newStyle += styles;
          newStyle += reactiveStyle(dom2.style, reactStyles, reactions);
        }
      } else if (typeof a1 === "object" || a1 !== null) {
        const style2 = dom2.style;
        for (const key in a1) {
          const value2 = a1[key];
          let styleValue = "";
          if (typeof value2 === "string" || typeof value2 === "number") {
            styleValue = transformStyleValue(key, value2);
          } else if (value2.type === "react") {
            styleValue = subscribeReactBuilder(value2, (content) => {
              setDomStyle(style2, key, content);
            }, "style");
          } else {
            const reaction = transformToReaction(value2);
            styleValue = reaction[subscribe]((v) => {
              setDomStyle(style2, key, v);
            });
          }
          newStyle += `${transformStyleAttr(key)}:${transformStyleValue(key, styleValue)};`;
        }
      } else {
        console.warn("Invalid style arguments");
      }
      dom2.setAttribute("style", newStyle);
    },
    type: "style"
  };
}, StyleAtoms);
function transformStyleAttr(name) {
  return name.replace(/[A-Z]/g, (i2) => "-" + i2.toLowerCase());
}
function transformStyleValue(key, v) {
  if (typeof v === "string")
    return v;
  return v + (OnlyNumberAttrs.includes(key) ? "" : DefaultUint);
}
function parseStyleTemplateToObject(templateRep) {
  const lines = templateRep.split(/[;\n]/);
  let styles = "";
  const reactStyles = {};
  for (let i2 = 0; i2 < lines.length; i2++) {
    const line = lines[i2].trim();
    if (!line)
      continue;
    const [key, value2] = splitTwoPart(line, ":");
    if (!value2)
      continue;
    const styleKey = transformStyleAttr(key);
    if (ReplaceExp.test(line)) {
      reactStyles[key] = value2;
    } else {
      styles += `${styleKey}:${value2};`;
    }
  }
  return [styles, reactStyles];
}
function reactiveStyle(style2, styles, reactions) {
  let styleStr = "";
  for (const k in styles) {
    let value2 = "";
    let key = reactiveTemplate(k, reactions, (content, oldContent) => {
      style2[oldContent] = "";
      setDomStyle(style2, content, value2);
      key = content;
    }, true);
    value2 = reactiveTemplate(styles[k], reactions, (content) => {
      setDomStyle(style2, key, content);
      value2 = content;
    });
    styleStr += concatStyleValue(key, value2);
  }
  return styleStr;
}
function setDomStyle(style2, key, value2) {
  console.log(key, transformStyleValue(key, value2));
  style2[key] = transformStyleValue(key, value2);
}
function concatStyleValue(key, value2) {
  return `${transformStyleAttr(key)}:${transformStyleValue(key, value2)};`;
}

// scripts/dev/samples/count.ts
var Count = () => {
  return comp(Count2);
};
function Count2() {
  const count = react(0);
  return button(click(() => {
    count.value++;
  }), react`:Count deep is ${count}`);
}
function CountProps({ prop: prop2 }) {
  return div(react`:Count is ${prop2.count}`);
}

// scripts/dev/samples/for-3.ts
function createItem() {
  return {
    a: [
      ["a1" + Math.random().toString(), "a2" + Math.random().toString()],
      ["b1" + Math.random().toString(), "b2" + Math.random().toString()]
    ]
  };
}
function For3() {
  const array = [];
  for (let i2 = 0; i2 < 2; i2++) {
    array.push(createItem());
  }
  const arrayReact = react(array);
  return [
    button("add", click(() => arrayReact.push(createItem()))),
    button("clear", click(() => arrayReact.splice(0, arrayReact.length))),
    div.for(arrayReact)((item, index2) => [
      div(":xxx", react`${index2}`),
      div.for(item.a)((str, i2) => [
        ".x3",
        react`.x3-${index2}-${i2}`,
        div.for(str)((a2, ii) => [
          react`${a2}-${index2}-${i2}-${ii}`
        ])
      ])
    ])
  ];
}

// scripts/dev/samples/hello-world.ts
function ReactiveContent() {
  const data = react({
    msg: "world",
    value: 100,
    list: [{ a: 1 }, { a: 2 }]
  });
  return div(".reactive", div(".reactive-content", react`hello ${data.msg}`), div(react`.reactive-class.reactive-${data.msg}`), div(react`.reactive-attr[reactive=${data.msg}]`), div(".reactive-css"), input.model(data.msg)(".input"));
}
function ForDemo() {
  const data = react({
    input: "test",
    list: [{ a: 1 }, { a: 2 }]
  });
  return div(".reactive", div.for(data.list)((item) => [".class", react`:content ${item.a}`]), div.for(data.list)((item) => [react`.class:content ${item.a}`]), div.for(data.list)((item) => [
    div(span.if(item.name)(".name", i(":xxxx"))),
    div(".flex-4-num1-operation", div(".flex-4-num1-play", ":click")),
    input.model(item.a)(".input"),
    input.model(data.input)(".input")
  ]));
}
function Parent() {
  return div(".parent", text("Hello World"), span("content"), comp(HelloWorld, prop({
    value: "11"
  }), event({
    test: () => console.log("test event")
  }), slot((childProp) => div(react`slot-${childProp}`))), comp(ReactiveContent), comp(ForDemo));
}
function HelloWorld({ prop: prop2, slot: slot2, event: event2 }) {
  const onClick = () => {
    console.log("onClick");
  };
  const data = react({
    msg: "1",
    list: [],
    src: "https://shiyix.cn/wx-pay.png"
  });
  const switchSrc = () => {
    data.src = "https://img0.baidu.com/it/u=3380674861,1672768141&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400";
  };
  return div(".flex-4-num1", click(onClick), span(".flex-4-img", click(event2.test), react`Hello ${data.msg} ${prop2.value}`, img("aa[width=100][src=https://shiyix.cn/wx-pay.png]"), img(react`.item-img[width=100][alt=xxx][lazy=loaded][src=${data.src}]`)), button("\u5207\u6362\u56FE\u7247", click(switchSrc)), div("test-slot*********"), input.model(data.msg)(), slot2(data.msg), div(".flex-4-num1-des"));
}
function testLife() {
  return null;
}

// scripts/dev/samples/style-comp.ts
function createCss() {
  const num = react(30);
  window.num2 = num;
  const simpleStyle = style({
    color: "#fff",
    fontSize: react`${num}px`
  });
  return css(".d-form")(["&.aa", simpleStyle], [
    "[a=xx]",
    simpleStyle,
    ["&.aa", simpleStyle],
    [".cc", simpleStyle]
  ]);
}
function StyleComp() {
  const num = react(30);
  window.num = num;
  return [
    div("d-form.d-form", div("d-form-aa.aa"), div("a=yy[a=yy]", div("cc.cc")), div("a=xx[a=xx].aa", div("cc.cc"))),
    div("111", style("color: red; font-size: 10px")),
    div("222", style({
      color: "red",
      fontSize: "10px"
    })),
    div("333", style({
      color: "red",
      marginTop: react`${num}px`,
      fontSize: react`${() => num.value}px`
    })),
    div("444", style`
            color: red;
            marginTop: ${num}px;
            fontSize: ${() => num.value}px;
        `),
    div("555", style.borderBottom(react`${num}px solid #000`).width(() => num.value + 2))
  ];
}

// scripts/dev/samples/todo-list.ts
function todoList() {
  const edit = react("");
  const list = react([]);
  const addItem = () => {
    list.push({ content: edit.value });
    edit.value = "";
  };
  const removeItem = (index2) => {
    list.splice(index2.value, 1);
  };
  return div(input.model(edit)(), button(":\u63D0\u4EA4", click(addItem)), div(".todo-list", react`.todo-${edit}`, div(":111"), div.for(list)((item, index2) => [
    react(".todo-item:", () => index2.value + 1, ":", item.content),
    button(":\u5220\u9664", click(removeItem).args(index2))
  ]), div(":222")));
}

// scripts/dev/index.ts
var oo = react({
  a: {
    b: "ab",
    c: { d: "acd" }
  }
});
mount(div("Hello World"), div("Count------------------"), comp(Count), div(".x0#app", react`value=${oo.a.b}-${oo.a.c.d}`), div("todoList-----------"), comp(todoList), div("Parent-----------"), comp(Parent), div("For3-----------"), comp(For3), div("Count-----------"), comp(Count), div("countProps-----------"), div(() => {
  const count = react(1);
  return [
    button("add", click(() => count.value++)),
    comp(CountProps, prop({ count })),
    comp(CountProps, prop({ count }))
  ];
}), div("testLife-----------"), comp(testLife), div("StyleComp-----------"), comp(StyleComp));
createCss().mount();
//# sourceMappingURL=bundle.js.map
