// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"infinitemenu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var winsize = {
  width: window.innerWidth,
  height: window.innerHeight
};

// https://stackoverflow.com/a/3540295
var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
  // isMobile = true;
}
var InfiniteMenu = /*#__PURE__*/function () {
  function InfiniteMenu(el) {
    var _this = this;
    _classCallCheck(this, InfiniteMenu);
    if (!isMobile) {
      this.DOM = {
        el: el
      };
      this.DOM.menuItems = _toConsumableArray(this.DOM.el.querySelectorAll('.menu__item'));
      this.DOM.bngContainer = document.getElementById('bng__list');
      this.cloneItems();
      this.initScroll();
      this.initEvents();

      // rAF/loop
      requestAnimationFrame(function () {
        return _this.render();
      });
    } else {
      document.body.classList.add('mobile');
    }
  }
  _createClass(InfiniteMenu, [{
    key: "getScrollPos",
    value: function getScrollPos() {
      return (this.DOM.el.pageYOffset || this.DOM.el.scrollTop) - (this.DOM.el.clientTop || 0);
    }
  }, {
    key: "setScrollPos",
    value: function setScrollPos(pos) {
      this.DOM.el.scrollTop = pos;
    }
    // Create menu items clones and append them to the menu items list
    // total clones = number of menu items that fit in the viewport
  }, {
    key: "cloneItems",
    value: function cloneItems() {
      var _this2 = this;
      // Get the height of one menu item
      var itemHeight = this.DOM.menuItems[0].offsetHeight;
      // How many items fit in the window?
      var fitIn = Math.ceil(winsize.height / itemHeight);
      // Create [fitIn] clones from the beginning of the list

      if (!(this.DOM.menuItems.length < fitIn)) {
        // Remove any
        this.DOM.bngContainer.querySelectorAll('.loop__clone').forEach(function (clone) {
          return _this2.DOM.bngContainer.removeChild(clone);
        });
        // Add clones
        var totalClones = 1;
        this.DOM.menuItems.filter(function (_, index) {
          return index < fitIn;
        }).map(function (target) {
          var clone = target.cloneNode(true);
          clone.classList.add('loop__clone');
          _this2.DOM.bngContainer.appendChild(clone);
          _this2.DOM.bngContainer.prepend(clone);
          ++totalClones;
        });

        // All clones height
        this.clonesHeight = totalClones * itemHeight;
        // Scrollable area height
        this.scrollHeight = this.DOM.el.scrollHeight;
      }
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this3 = this;
      window.addEventListener('resize', function () {
        return _this3.resize();
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      this.cloneItems();
      this.initScroll();
    }
  }, {
    key: "initScroll",
    value: function initScroll() {
      // Scroll 1 pixel to allow upwards scrolling
      this.scrollPos = this.getScrollPos();
      if (this.scrollPos <= 0) {
        this.setScrollPos(1);
      }
    }
  }, {
    key: "scrollUpdate",
    value: function scrollUpdate() {
      this.scrollPos = this.getScrollPos();
      if (this.clonesHeight + this.scrollPos >= this.scrollHeight) {
        // Scroll to the top when you’ve reached the bottom
        this.setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
      } else if (this.scrollPos <= 0) {
        // Scroll to the bottom when you reach the top
        this.setScrollPos(this.scrollHeight - this.clonesHeight);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      this.scrollUpdate();
      requestAnimationFrame(function () {
        return _this4.render();
      });
    }
  }]);
  return InfiniteMenu;
}();
exports.default = InfiniteMenu;
},{}],"../../../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return '/';
}
function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
module.exports = reloadCSS;
},{"./bundle-url":"../../../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../css/podcast_base.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../fonts/SaolDisplay-Regular.woff2":[["SaolDisplay-Regular.653fe69e.woff2","../fonts/SaolDisplay-Regular.woff2"],"../fonts/SaolDisplay-Regular.woff2"],"./../fonts/SaolDisplay-Regular.woff":[["SaolDisplay-Regular.e5af0294.woff","../fonts/SaolDisplay-Regular.woff"],"../fonts/SaolDisplay-Regular.woff"],"./../fonts/Recoleta-RegularDEMO.woff2":[["Recoleta-RegularDEMO.1d5dac31.woff2","../fonts/Recoleta-RegularDEMO.woff2"],"../fonts/Recoleta-RegularDEMO.woff2"],"./../fonts/Recoleta-RegularDEMO.woff":[["Recoleta-RegularDEMO.c4339b32.woff","../fonts/Recoleta-RegularDEMO.woff"],"../fonts/Recoleta-RegularDEMO.woff"],"./../fonts/Recoleta-RegularDEMO.ttf":[["Recoleta-RegularDEMO.2693e8cd.ttf","../fonts/Recoleta-RegularDEMO.ttf"],"../fonts/Recoleta-RegularDEMO.ttf"],"_css_loader":"../../../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"podcast_index.js":[function(require,module,exports) {
"use strict";

var _infinitemenu = _interopRequireDefault(require("./infinitemenu"));
require("../css/podcast_base.scss");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var menu = new _infinitemenu.default(document.querySelector('nav.menu'));
},{"./infinitemenu":"infinitemenu.js","../css/podcast_base.scss":"../css/podcast_base.scss"}]