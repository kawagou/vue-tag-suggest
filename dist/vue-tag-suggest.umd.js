(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
  (global = global || self, factory(global.VueTagSuggest = {}, global._));
}(this, function (exports, _) { 'use strict';

  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

  //

  var script = {
    name: 'vue-tag-suggest',
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      value: {},
      suggestList: {
        type: [Function],
        default: function () { return []; }
      },
      fuzzySuggestList: {
        type: [Function],
        default: function () { return []; }
      },
    },
    computed: {
      inputData: {
        get: function get () {
          return this.value
        },
        set: function set (value) {
           this.$emit('input', value);
        }
      }
    },
    data: function data () {
      return {
        text: this.value,
        suggestions: [],
        fuzzySuggestions: [],
        showSuggestion: false,
        hoverItem: null,
        items: [],
      }
    },
    methods: {
      onInput: _.debounce(function () {
        this.callGetSuggestionFunction();
      }, 500),
      onFocus: function onFocus() {
        this.showSuggestion = true;
      },
      onBlur: function onBlur() {
        this.showSuggestion = false;
      },
      onMouseOver: function onMouseOver(item) {
        this.hoverItem = item;
      },
      onMouseLeave: function onMouseLeave() {
        this.hoverItem = null;
      },
      isSelected: function isSelected(item) {
        return this.hoverItem == item
      },
      onSelectedAction: function onSelectedAction(item) {
        var this$1 = this;

        var items = [item];
        items = items.filter(function (t) { return t.trim().length > 0; });

        var dup = this.items.find(function (t) { return t === item; });
        if (dup) { return }

        items.forEach(function (item) {
          this$1.items.push(item);
        });
        this.showSuggestion = false;
      },
      onDeleteAtion: function onDeleteAtion(idx) {
        this.items.splice(idx, 1);
      },
      isHovered: function isHovered(item) {
        return this.hoverItem == item
      },
      callGetSuggestionFunction: async function callGetSuggestionFunction() {
        var suggestions = [];
        var fuzzySuggestions = [];
        try {
          suggestions = await this.suggestList();
          if (suggestions.length <= 5) {
            fuzzySuggestions = await this.fuzzySuggestList();
          }
        } catch (e) {
          //console.log(e)
        }
        finally {
          this.$set(this, 'suggestions', suggestions);
          this.$set(this, 'fuzzySuggestions', fuzzySuggestions);

          if ( suggestions.length > 0 || fuzzySuggestions.length > 0) {
            this.showSuggestion = true;
          }
        }
      },
      refresh: function refresh() {
        this.callGetSuggestionFunction();
      }
    },
    watch: {
      // eslint-disable-next-line
      items: function(val) {
        this.$emit('updateItems', this.items);
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD;
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) { style.element.setAttribute('media', css.media); }

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) { style.element.removeChild(nodes[index]); }
        if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
      }
    }
  }

  var browser = createInjector;

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "vue-tag-suggest" }, [
      _c(
        "div",
        { staticClass: "wrap-input" },
        [
          _vm._t("searchInput", [
            _c(
              "ul",
              { staticClass: "wrap-seleted-items" },
              _vm._l(_vm.items, function(item, idx) {
                return _c("li", { key: idx, staticClass: "seleted-item" }, [
                  _c("span", {}, [_vm._v(_vm._s(item))]),
                  _vm._v(" "),
                  _c("div", { staticClass: "wrap-btn" }, [
                    _c(
                      "div",
                      {
                        staticClass: "closeBtn",
                        on: {
                          click: function($event) {
                            return _vm.onDeleteAtion(idx)
                          }
                        }
                      },
                      [_c("span")]
                    )
                  ])
                ])
              }),
              0
            ),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.inputData,
                  expression: "inputData"
                }
              ],
              staticClass: "search-input",
              domProps: { value: _vm.inputData },
              on: {
                focus: _vm.onFocus,
                input: [
                  function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.inputData = $event.target.value;
                  },
                  _vm.onInput
                ],
                blur: _vm.onBlur
              }
            })
          ]),
          _vm._v(" "),
          !!_vm.showSuggestion && _vm.suggestions.length > 0
            ? _c(
                "div",
                { staticClass: "wrap-suggest" },
                [
                  _vm._t(
                    "suggest",
                    [
                      _c(
                        "ul",
                        { staticClass: "suggestions" },
                        _vm._l(_vm.suggestions, function(item, idx) {
                          return _c(
                            "li",
                            {
                              key: idx,
                              staticClass: "item",
                              class: [
                                {
                                  selected: _vm.isSelected(item),
                                  hover: _vm.isHovered(item)
                                }
                              ],
                              on: {
                                mouseover: function($event) {
                                  return _vm.onMouseOver(item)
                                },
                                mouseleave: function($event) {
                                  return _vm.onMouseLeave(item)
                                },
                                mousedown: function($event) {
                                  return _vm.onSelectedAction(item)
                                }
                              }
                            },
                            [_c("span", [_vm._v(_vm._s(item))])]
                          )
                        }),
                        0
                      )
                    ],
                    { suggestions: _vm.suggestions, value: _vm.inputData }
                  )
                ],
                2
              )
            : _vm._e(),
          _vm._v(" "),
          !!_vm.showSuggestion && _vm.fuzzySuggestions.length > 0
            ? _c(
                "div",
                { staticClass: "wrap-suggest" },
                [
                  _vm._t(
                    "fuzzySuggest",
                    [
                      _c("span", [_vm._v("Looking for this?")]),
                      _vm._v(" "),
                      _c(
                        "ul",
                        { staticClass: "suggestions" },
                        _vm._l(_vm.fuzzySuggestions, function(item, idx) {
                          return _c(
                            "li",
                            {
                              key: idx,
                              staticClass: "item",
                              class: [
                                {
                                  selected: _vm.isSelected(item),
                                  hover: _vm.isHovered(item)
                                }
                              ],
                              on: {
                                mouseover: function($event) {
                                  return _vm.onMouseOver(item)
                                },
                                mouseleave: function($event) {
                                  return _vm.onMouseLeave(item)
                                },
                                mousedown: function($event) {
                                  return _vm.onSelectedAction(item)
                                }
                              }
                            },
                            [_c("span", [_vm._v(_vm._s(item))])]
                          )
                        }),
                        0
                      )
                    ],
                    { suggestions: _vm.fuzzySuggestions, value: _vm.inputData }
                  )
                ],
                2
              )
            : _vm._e()
        ],
        2
      )
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-00d7fc0a_0", { source: "\n.vue-tag-suggest {\n  position: relative;\n}\n.vue-tag-suggest > ol,ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.vue-tag-suggest .wrap-input input {\n  width: 100%;\n  padding: 5px;\n  font-size: 16px;\n  border-radius: 3px;\n  /* border: 1px solid #ddd; */\n  border: 1px solid #52b56a;\n  box-sizing: border-box;\n}\n.vue-tag-suggest .wrap-suggest {\n  top: 3px;\n  position: relative;\n}\n.vue-tag-suggest .wrap-suggest .suggestions {\n  position: relative;\n  left: 0;\n  right: 0;\n  top: 100%;\n  border-radius: 3px;\n  border: 1px solid #ddd;\n  background-color: #fff;\n  opacity: 1;\n  z-index: 999999;\n}\n.vue-tag-suggest .suggestions .item {\n  cursor: pointer;\n  user-select: none;\n  text-align: left;\n  padding-left: 5px;\n}\n.vue-tag-suggest .suggestions .item.hover {\n  background-color: #e4e4e4;\n}\n.vue-tag-suggest .wrap-seleted-items .wrap-btn {\n  display: table;\n  height: 100%;\n}\n.vue-tag-suggest .wrap-seleted-items .closeBtn {\n  display: table-cell;\n  width: 22px;\n  position: relative;\n}\n.vue-tag-suggest .wrap-seleted-items .closeBtn span::before,\n.vue-tag-suggest .wrap-seleted-items .closeBtn span::after {\n  display: block;\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 84%;\n  height: 16%;\n  margin: -8% 0 0 -42%;\n  background: #52b56a;\n}\n.vue-tag-suggest .wrap-seleted-items .closeBtn span::before {\n  transform: rotate(-45deg);\n}\n.vue-tag-suggest .wrap-seleted-items .closeBtn span::after {\n  transform: rotate(45deg);\n}\n.vue-tag-suggest .wrap-seleted-items{\n  display: flex;\n  align-content: flex-start;\n  flex-wrap: wrap;\n  padding-bottom: 2px;\n  list-style: none;\n}\n.vue-tag-suggest .wrap-seleted-items .seleted-item{\n  display: flex;\n  margin: 3px;\n  padding: 1px;\n  border-radius: 3px;\n  box-shadow: 0 0 0 1px #52b56a;\n}\n\n", map: {"version":3,"sources":["/Volumes/HDD-G-DRIVE/development/home/vue-tag-suggest/src/vue-tag-suggest.vue"],"names":[],"mappings":";AAwLA;EACA,kBAAA;AACA;AACA;EACA,gBAAA;EACA,UAAA;EACA,SAAA;AACA;AACA;EACA,WAAA;EACA,YAAA;EACA,eAAA;EACA,kBAAA;EACA,4BAAA;EACA,yBAAA;EACA,sBAAA;AACA;AACA;EACA,QAAA;EACA,kBAAA;AACA;AAEA;EACA,kBAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,kBAAA;EACA,sBAAA;EACA,sBAAA;EACA,UAAA;EACA,eAAA;AACA;AACA;EACA,eAAA;EACA,iBAAA;EACA,gBAAA;EACA,iBAAA;AACA;AAEA;EACA,yBAAA;AACA;AAEA;EACA,cAAA;EACA,YAAA;AACA;AACA;EACA,mBAAA;EACA,WAAA;EACA,kBAAA;AACA;AACA;;EAEA,cAAA;EACA,WAAA;EACA,kBAAA;EACA,QAAA;EACA,SAAA;EACA,UAAA;EACA,WAAA;EACA,oBAAA;EACA,mBAAA;AACA;AACA;EACA,yBAAA;AACA;AACA;EACA,wBAAA;AACA;AAEA;EACA,aAAA;EACA,yBAAA;EACA,eAAA;EACA,mBAAA;EACA,gBAAA;AACA;AACA;EACA,aAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;EACA,6BAAA;AACA","file":"vue-tag-suggest.vue","sourcesContent":["<template>\n  <div class=\"vue-tag-suggest\">\n\n    <div class=\"wrap-input\">\n\n      <slot name=\"searchInput\">\n\n        <ul class=\"wrap-seleted-items\">\n          <li class=\"seleted-item\" v-for=\"(item, idx) in items\" v-bind:key=\"idx\">\n            <span class=\"\">{{ item }}</span>\n            <div class=\"wrap-btn\">\n              <div class=\"closeBtn\" @click=\"onDeleteAtion(idx)\"><span></span></div>\n            </div>\n          </li>\n        </ul>\n\n        <input\n          class=\"search-input\"\n          v-model=\"inputData\"\n          @focus=\"onFocus\"\n          @input=\"onInput\"\n          @blur=\"onBlur\"\n        >\n      </slot>\n\n      <div class=\"wrap-suggest\" v-if=\"(!!showSuggestion && suggestions.length > 0)\">\n        <slot name=\"suggest\" :suggestions=\"suggestions\" :value=\"inputData\">\n          <ul class=\"suggestions\">\n            <li\n              class=\"item\"\n              :class=\"[{\n                selected: isSelected(item),\n                hover: isHovered(item)\n              }]\"\n              @mouseover=\"onMouseOver(item)\"\n              @mouseleave=\"onMouseLeave(item)\"\n              @mousedown=\"onSelectedAction(item)\"\n              v-for=\"(item, idx) in suggestions\"\n              v-bind:key=\"idx\"\n              >\n                <span>{{ item }}</span>\n            </li>\n          </ul>\n        </slot>\n      </div>\n\n      <div class=\"wrap-suggest\" v-if=\"(!!showSuggestion && fuzzySuggestions.length > 0)\">\n        <slot name=\"fuzzySuggest\" :suggestions=\"fuzzySuggestions\" :value=\"inputData\">\n          <span>Looking for this?</span>\n          <ul class=\"suggestions\"\n          >\n            <li\n              class=\"item\"\n              :class=\"[{\n                selected: isSelected(item),\n                hover: isHovered(item)\n              }]\"\n              @mouseover=\"onMouseOver(item)\"\n              @mouseleave=\"onMouseLeave(item)\"\n              @mousedown=\"onSelectedAction(item)\"\n              v-for=\"(item, idx) in fuzzySuggestions\"\n              v-bind:key=\"idx\"\n              >\n              <span>{{ item }}</span>\n            </li>\n          </ul>\n        </slot>\n      </div>\n    </div>\n\n  </div>\n</template>\n\n<script>\nimport _ from 'lodash'\n\nexport default {\n  name: 'vue-tag-suggest',\n  model: {\n    prop: 'value',\n    event: 'input'\n  },\n  props: {\n    value: {},\n    suggestList: {\n      type: [Function],\n      default: () => []\n    },\n    fuzzySuggestList: {\n      type: [Function],\n      default: () => []\n    },\n  },\n  computed: {\n    inputData: {\n      get () {\n        return this.value\n      },\n      set (value) {\n         this.$emit('input', value)\n      }\n    }\n  },\n  data () {\n    return {\n      text: this.value,\n      suggestions: [],\n      fuzzySuggestions: [],\n      showSuggestion: false,\n      hoverItem: null,\n      items: [],\n    }\n  },\n  methods: {\n    onInput: _.debounce(function () {\n      this.callGetSuggestionFunction()\n    }, 500),\n    onFocus() {\n      this.showSuggestion = true\n    },\n    onBlur() {\n      this.showSuggestion = false\n    },\n    onMouseOver(item) {\n      this.hoverItem = item\n    },\n    onMouseLeave() {\n      this.hoverItem = null\n    },\n    isSelected(item) {\n      return this.hoverItem == item\n    },\n    onSelectedAction(item) {\n      var items = [item];\n      items = items.filter(t => t.trim().length > 0);\n\n      var dup = this.items.find(t => t === item);\n      if (dup) return\n\n      items.forEach(item => {\n        this.items.push(item)\n      });\n      this.showSuggestion = false\n    },\n    onDeleteAtion(idx) {\n      this.items.splice(idx, 1);\n    },\n    isHovered(item) {\n      return this.hoverItem == item\n    },\n    async callGetSuggestionFunction() {\n      var suggestions = []\n      var fuzzySuggestions = []\n      try {\n        suggestions = await this.suggestList()\n        if (suggestions.length <= 5) {\n          fuzzySuggestions = await this.fuzzySuggestList()\n        }\n      } catch (e) {\n        //console.log(e)\n      }\n      finally {\n        this.$set(this, 'suggestions', suggestions)\n        this.$set(this, 'fuzzySuggestions', fuzzySuggestions)\n\n        if ( suggestions.length > 0 || fuzzySuggestions.length > 0) {\n          this.showSuggestion = true\n        }\n      }\n    },\n    refresh() {\n      this.callGetSuggestionFunction()\n    }\n  },\n  watch: {\n    // eslint-disable-next-line\n    items: function(val) {\n      this.$emit('updateItems', this.items);\n    }\n  }\n}\n</script>\n\n<style>\n.vue-tag-suggest {\n  position: relative;\n}\n.vue-tag-suggest > ol,ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.vue-tag-suggest .wrap-input input {\n  width: 100%;\n  padding: 5px;\n  font-size: 16px;\n  border-radius: 3px;\n  /* border: 1px solid #ddd; */\n  border: 1px solid #52b56a;\n  box-sizing: border-box;\n}\n.vue-tag-suggest .wrap-suggest {\n  top: 3px;\n  position: relative;\n}\n\n.vue-tag-suggest .wrap-suggest .suggestions {\n  position: relative;\n  left: 0;\n  right: 0;\n  top: 100%;\n  border-radius: 3px;\n  border: 1px solid #ddd;\n  background-color: #fff;\n  opacity: 1;\n  z-index: 999999;\n}\n.vue-tag-suggest .suggestions .item {\n  cursor: pointer;\n  user-select: none;\n  text-align: left;\n  padding-left: 5px;\n}\n\n.vue-tag-suggest .suggestions .item.hover {\n  background-color: #e4e4e4;\n}\n\n.vue-tag-suggest .wrap-seleted-items .wrap-btn {\n  display: table;\n  height: 100%;\n}\n.vue-tag-suggest .wrap-seleted-items .closeBtn {\n  display: table-cell;\n  width: 22px;\n  position: relative;\n}\n.vue-tag-suggest .wrap-seleted-items .closeBtn span::before,\n.vue-tag-suggest .wrap-seleted-items .closeBtn span::after {\n  display: block;\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 84%;\n  height: 16%;\n  margin: -8% 0 0 -42%;\n  background: #52b56a;\n}\n.vue-tag-suggest .wrap-seleted-items .closeBtn span::before {\n  transform: rotate(-45deg);\n}\n.vue-tag-suggest .wrap-seleted-items .closeBtn span::after {\n  transform: rotate(45deg);\n}\n\n.vue-tag-suggest .wrap-seleted-items{\n  display: flex;\n  align-content: flex-start;\n  flex-wrap: wrap;\n  padding-bottom: 2px;\n  list-style: none;\n}\n.vue-tag-suggest .wrap-seleted-items .seleted-item{\n  display: flex;\n  margin: 3px;\n  padding: 1px;\n  border-radius: 3px;\n  box-shadow: 0 0 0 1px #52b56a;\n}\n\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var component = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  // vue コンポーネントのインポート

  // Vue.use() によって実行される install 関数を定義
  function install(Vue) {
    if (install.installed) { return; }
    install.installed = true;
    Vue.component('VueTagSuggest', component);
  }

  // Vue.use() のためのモジュール定義を作成
  // Create module definition for Vue.use()
  var plugin = {
    install: install,
  };

  // vue が見つかった場合に自動インストールする (ブラウザで <script> タグを用いた場合等)
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }
  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  exports.default = component;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
