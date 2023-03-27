var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/js-beautify/js/src/core/output.js
var require_output = __commonJS({
  "node_modules/js-beautify/js/src/core/output.js"(exports, module2) {
    "use strict";
    function OutputLine(parent) {
      this.__parent = parent;
      this.__character_count = 0;
      this.__indent_count = -1;
      this.__alignment_count = 0;
      this.__wrap_point_index = 0;
      this.__wrap_point_character_count = 0;
      this.__wrap_point_indent_count = -1;
      this.__wrap_point_alignment_count = 0;
      this.__items = [];
    }
    OutputLine.prototype.clone_empty = function() {
      var line = new OutputLine(this.__parent);
      line.set_indent(this.__indent_count, this.__alignment_count);
      return line;
    };
    OutputLine.prototype.item = function(index2) {
      if (index2 < 0) {
        return this.__items[this.__items.length + index2];
      } else {
        return this.__items[index2];
      }
    };
    OutputLine.prototype.has_match = function(pattern) {
      for (var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
        if (this.__items[lastCheckedOutput].match(pattern)) {
          return true;
        }
      }
      return false;
    };
    OutputLine.prototype.set_indent = function(indent, alignment) {
      if (this.is_empty()) {
        this.__indent_count = indent || 0;
        this.__alignment_count = alignment || 0;
        this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count);
      }
    };
    OutputLine.prototype._set_wrap_point = function() {
      if (this.__parent.wrap_line_length) {
        this.__wrap_point_index = this.__items.length;
        this.__wrap_point_character_count = this.__character_count;
        this.__wrap_point_indent_count = this.__parent.next_line.__indent_count;
        this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count;
      }
    };
    OutputLine.prototype._should_wrap = function() {
      return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
    };
    OutputLine.prototype._allow_wrap = function() {
      if (this._should_wrap()) {
        this.__parent.add_new_line();
        var next = this.__parent.current_line;
        next.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count);
        next.__items = this.__items.slice(this.__wrap_point_index);
        this.__items = this.__items.slice(0, this.__wrap_point_index);
        next.__character_count += this.__character_count - this.__wrap_point_character_count;
        this.__character_count = this.__wrap_point_character_count;
        if (next.__items[0] === " ") {
          next.__items.splice(0, 1);
          next.__character_count -= 1;
        }
        return true;
      }
      return false;
    };
    OutputLine.prototype.is_empty = function() {
      return this.__items.length === 0;
    };
    OutputLine.prototype.last = function() {
      if (!this.is_empty()) {
        return this.__items[this.__items.length - 1];
      } else {
        return null;
      }
    };
    OutputLine.prototype.push = function(item) {
      this.__items.push(item);
      var last_newline_index = item.lastIndexOf("\n");
      if (last_newline_index !== -1) {
        this.__character_count = item.length - last_newline_index;
      } else {
        this.__character_count += item.length;
      }
    };
    OutputLine.prototype.pop = function() {
      var item = null;
      if (!this.is_empty()) {
        item = this.__items.pop();
        this.__character_count -= item.length;
      }
      return item;
    };
    OutputLine.prototype._remove_indent = function() {
      if (this.__indent_count > 0) {
        this.__indent_count -= 1;
        this.__character_count -= this.__parent.indent_size;
      }
    };
    OutputLine.prototype._remove_wrap_indent = function() {
      if (this.__wrap_point_indent_count > 0) {
        this.__wrap_point_indent_count -= 1;
      }
    };
    OutputLine.prototype.trim = function() {
      while (this.last() === " ") {
        this.__items.pop();
        this.__character_count -= 1;
      }
    };
    OutputLine.prototype.toString = function() {
      var result = "";
      if (this.is_empty()) {
        if (this.__parent.indent_empty_lines) {
          result = this.__parent.get_indent_string(this.__indent_count);
        }
      } else {
        result = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count);
        result += this.__items.join("");
      }
      return result;
    };
    function IndentStringCache(options, baseIndentString) {
      this.__cache = [""];
      this.__indent_size = options.indent_size;
      this.__indent_string = options.indent_char;
      if (!options.indent_with_tabs) {
        this.__indent_string = new Array(options.indent_size + 1).join(options.indent_char);
      }
      baseIndentString = baseIndentString || "";
      if (options.indent_level > 0) {
        baseIndentString = new Array(options.indent_level + 1).join(this.__indent_string);
      }
      this.__base_string = baseIndentString;
      this.__base_string_length = baseIndentString.length;
    }
    IndentStringCache.prototype.get_indent_size = function(indent, column) {
      var result = this.__base_string_length;
      column = column || 0;
      if (indent < 0) {
        result = 0;
      }
      result += indent * this.__indent_size;
      result += column;
      return result;
    };
    IndentStringCache.prototype.get_indent_string = function(indent_level, column) {
      var result = this.__base_string;
      column = column || 0;
      if (indent_level < 0) {
        indent_level = 0;
        result = "";
      }
      column += indent_level * this.__indent_size;
      this.__ensure_cache(column);
      result += this.__cache[column];
      return result;
    };
    IndentStringCache.prototype.__ensure_cache = function(column) {
      while (column >= this.__cache.length) {
        this.__add_column();
      }
    };
    IndentStringCache.prototype.__add_column = function() {
      var column = this.__cache.length;
      var indent = 0;
      var result = "";
      if (this.__indent_size && column >= this.__indent_size) {
        indent = Math.floor(column / this.__indent_size);
        column -= indent * this.__indent_size;
        result = new Array(indent + 1).join(this.__indent_string);
      }
      if (column) {
        result += new Array(column + 1).join(" ");
      }
      this.__cache.push(result);
    };
    function Output(options, baseIndentString) {
      this.__indent_cache = new IndentStringCache(options, baseIndentString);
      this.raw = false;
      this._end_with_newline = options.end_with_newline;
      this.indent_size = options.indent_size;
      this.wrap_line_length = options.wrap_line_length;
      this.indent_empty_lines = options.indent_empty_lines;
      this.__lines = [];
      this.previous_line = null;
      this.current_line = null;
      this.next_line = new OutputLine(this);
      this.space_before_token = false;
      this.non_breaking_space = false;
      this.previous_token_wrapped = false;
      this.__add_outputline();
    }
    Output.prototype.__add_outputline = function() {
      this.previous_line = this.current_line;
      this.current_line = this.next_line.clone_empty();
      this.__lines.push(this.current_line);
    };
    Output.prototype.get_line_number = function() {
      return this.__lines.length;
    };
    Output.prototype.get_indent_string = function(indent, column) {
      return this.__indent_cache.get_indent_string(indent, column);
    };
    Output.prototype.get_indent_size = function(indent, column) {
      return this.__indent_cache.get_indent_size(indent, column);
    };
    Output.prototype.is_empty = function() {
      return !this.previous_line && this.current_line.is_empty();
    };
    Output.prototype.add_new_line = function(force_newline) {
      if (this.is_empty() || !force_newline && this.just_added_newline()) {
        return false;
      }
      if (!this.raw) {
        this.__add_outputline();
      }
      return true;
    };
    Output.prototype.get_code = function(eol) {
      this.trim(true);
      var last_item = this.current_line.pop();
      if (last_item) {
        if (last_item[last_item.length - 1] === "\n") {
          last_item = last_item.replace(/\n+$/g, "");
        }
        this.current_line.push(last_item);
      }
      if (this._end_with_newline) {
        this.__add_outputline();
      }
      var sweet_code = this.__lines.join("\n");
      if (eol !== "\n") {
        sweet_code = sweet_code.replace(/[\n]/g, eol);
      }
      return sweet_code;
    };
    Output.prototype.set_wrap_point = function() {
      this.current_line._set_wrap_point();
    };
    Output.prototype.set_indent = function(indent, alignment) {
      indent = indent || 0;
      alignment = alignment || 0;
      this.next_line.set_indent(indent, alignment);
      if (this.__lines.length > 1) {
        this.current_line.set_indent(indent, alignment);
        return true;
      }
      this.current_line.set_indent();
      return false;
    };
    Output.prototype.add_raw_token = function(token) {
      for (var x = 0; x < token.newlines; x++) {
        this.__add_outputline();
      }
      this.current_line.set_indent(-1);
      this.current_line.push(token.whitespace_before);
      this.current_line.push(token.text);
      this.space_before_token = false;
      this.non_breaking_space = false;
      this.previous_token_wrapped = false;
    };
    Output.prototype.add_token = function(printable_token) {
      this.__add_space_before_token();
      this.current_line.push(printable_token);
      this.space_before_token = false;
      this.non_breaking_space = false;
      this.previous_token_wrapped = this.current_line._allow_wrap();
    };
    Output.prototype.__add_space_before_token = function() {
      if (this.space_before_token && !this.just_added_newline()) {
        if (!this.non_breaking_space) {
          this.set_wrap_point();
        }
        this.current_line.push(" ");
      }
    };
    Output.prototype.remove_indent = function(index2) {
      var output_length = this.__lines.length;
      while (index2 < output_length) {
        this.__lines[index2]._remove_indent();
        index2++;
      }
      this.current_line._remove_wrap_indent();
    };
    Output.prototype.trim = function(eat_newlines) {
      eat_newlines = eat_newlines === void 0 ? false : eat_newlines;
      this.current_line.trim();
      while (eat_newlines && this.__lines.length > 1 && this.current_line.is_empty()) {
        this.__lines.pop();
        this.current_line = this.__lines[this.__lines.length - 1];
        this.current_line.trim();
      }
      this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
    };
    Output.prototype.just_added_newline = function() {
      return this.current_line.is_empty();
    };
    Output.prototype.just_added_blankline = function() {
      return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
    };
    Output.prototype.ensure_empty_line_above = function(starts_with, ends_with) {
      var index2 = this.__lines.length - 2;
      while (index2 >= 0) {
        var potentialEmptyLine = this.__lines[index2];
        if (potentialEmptyLine.is_empty()) {
          break;
        } else if (potentialEmptyLine.item(0).indexOf(starts_with) !== 0 && potentialEmptyLine.item(-1) !== ends_with) {
          this.__lines.splice(index2 + 1, 0, new OutputLine(this));
          this.previous_line = this.__lines[this.__lines.length - 2];
          break;
        }
        index2--;
      }
    };
    module2.exports.Output = Output;
  }
});

// node_modules/js-beautify/js/src/core/token.js
var require_token = __commonJS({
  "node_modules/js-beautify/js/src/core/token.js"(exports, module2) {
    "use strict";
    function Token(type, text2, newlines, whitespace_before) {
      this.type = type;
      this.text = text2;
      this.comments_before = null;
      this.newlines = newlines || 0;
      this.whitespace_before = whitespace_before || "";
      this.parent = null;
      this.next = null;
      this.previous = null;
      this.opened = null;
      this.closed = null;
      this.directives = null;
    }
    module2.exports.Token = Token;
  }
});

// node_modules/js-beautify/js/src/javascript/acorn.js
var require_acorn = __commonJS({
  "node_modules/js-beautify/js/src/javascript/acorn.js"(exports) {
    "use strict";
    var baseASCIIidentifierStartChars = "\\x23\\x24\\x40\\x41-\\x5a\\x5f\\x61-\\x7a";
    var baseASCIIidentifierChars = "\\x24\\x30-\\x39\\x41-\\x5a\\x5f\\x61-\\x7a";
    var nonASCIIidentifierStartChars = "\\xaa\\xb5\\xba\\xc0-\\xd6\\xd8-\\xf6\\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u08a0\\u08a2-\\u08ac\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097f\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c33\\u0c35-\\u0c39\\u0c3d\\u0c58\\u0c59\\u0c60\\u0c61\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d60\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f4\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f0\\u1700-\\u170c\\u170e-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1877\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191c\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19c1-\\u19c7\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4b\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1ce9-\\u1cec\\u1cee-\\u1cf1\\u1cf5\\u1cf6\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2119-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u212d\\u212f-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u2e2f\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309d-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fcc\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua697\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua78e\\ua790-\\ua793\\ua7a0-\\ua7aa\\ua7f8-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa80-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uabc0-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc";
    var nonASCIIidentifierChars = "\\u0300-\\u036f\\u0483-\\u0487\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u0610-\\u061a\\u0620-\\u0649\\u0672-\\u06d3\\u06e7-\\u06e8\\u06fb-\\u06fc\\u0730-\\u074a\\u0800-\\u0814\\u081b-\\u0823\\u0825-\\u0827\\u0829-\\u082d\\u0840-\\u0857\\u08e4-\\u08fe\\u0900-\\u0903\\u093a-\\u093c\\u093e-\\u094f\\u0951-\\u0957\\u0962-\\u0963\\u0966-\\u096f\\u0981-\\u0983\\u09bc\\u09be-\\u09c4\\u09c7\\u09c8\\u09d7\\u09df-\\u09e0\\u0a01-\\u0a03\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a66-\\u0a71\\u0a75\\u0a81-\\u0a83\\u0abc\\u0abe-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ae2-\\u0ae3\\u0ae6-\\u0aef\\u0b01-\\u0b03\\u0b3c\\u0b3e-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b56\\u0b57\\u0b5f-\\u0b60\\u0b66-\\u0b6f\\u0b82\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd7\\u0be6-\\u0bef\\u0c01-\\u0c03\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c62-\\u0c63\\u0c66-\\u0c6f\\u0c82\\u0c83\\u0cbc\\u0cbe-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0ce2-\\u0ce3\\u0ce6-\\u0cef\\u0d02\\u0d03\\u0d46-\\u0d48\\u0d57\\u0d62-\\u0d63\\u0d66-\\u0d6f\\u0d82\\u0d83\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0df2\\u0df3\\u0e34-\\u0e3a\\u0e40-\\u0e45\\u0e50-\\u0e59\\u0eb4-\\u0eb9\\u0ec8-\\u0ecd\\u0ed0-\\u0ed9\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f41-\\u0f47\\u0f71-\\u0f84\\u0f86-\\u0f87\\u0f8d-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u1000-\\u1029\\u1040-\\u1049\\u1067-\\u106d\\u1071-\\u1074\\u1082-\\u108d\\u108f-\\u109d\\u135d-\\u135f\\u170e-\\u1710\\u1720-\\u1730\\u1740-\\u1750\\u1772\\u1773\\u1780-\\u17b2\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u1810-\\u1819\\u1920-\\u192b\\u1930-\\u193b\\u1951-\\u196d\\u19b0-\\u19c0\\u19c8-\\u19c9\\u19d0-\\u19d9\\u1a00-\\u1a15\\u1a20-\\u1a53\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1b46-\\u1b4b\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1bb0-\\u1bb9\\u1be6-\\u1bf3\\u1c00-\\u1c22\\u1c40-\\u1c49\\u1c5b-\\u1c7d\\u1cd0-\\u1cd2\\u1d00-\\u1dbe\\u1e01-\\u1f15\\u200c\\u200d\\u203f\\u2040\\u2054\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2d81-\\u2d96\\u2de0-\\u2dff\\u3021-\\u3028\\u3099\\u309a\\ua640-\\ua66d\\ua674-\\ua67d\\ua69f\\ua6f0-\\ua6f1\\ua7f8-\\ua800\\ua806\\ua80b\\ua823-\\ua827\\ua880-\\ua881\\ua8b4-\\ua8c4\\ua8d0-\\ua8d9\\ua8f3-\\ua8f7\\ua900-\\ua909\\ua926-\\ua92d\\ua930-\\ua945\\ua980-\\ua983\\ua9b3-\\ua9c0\\uaa00-\\uaa27\\uaa40-\\uaa41\\uaa4c-\\uaa4d\\uaa50-\\uaa59\\uaa7b\\uaae0-\\uaae9\\uaaf2-\\uaaf3\\uabc0-\\uabe1\\uabec\\uabed\\uabf0-\\uabf9\\ufb20-\\ufb28\\ufe00-\\ufe0f\\ufe20-\\ufe26\\ufe33\\ufe34\\ufe4d-\\ufe4f\\uff10-\\uff19\\uff3f";
    var identifierStart = "(?:\\\\u[0-9a-fA-F]{4}|[" + baseASCIIidentifierStartChars + nonASCIIidentifierStartChars + "])";
    var identifierChars = "(?:\\\\u[0-9a-fA-F]{4}|[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "])*";
    exports.identifier = new RegExp(identifierStart + identifierChars, "g");
    exports.identifierStart = new RegExp(identifierStart);
    exports.identifierMatch = new RegExp("(?:\\\\u[0-9a-fA-F]{4}|[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "])+");
    exports.newline = /[\n\r\u2028\u2029]/;
    exports.lineBreak = new RegExp("\r\n|" + exports.newline.source);
    exports.allLineBreaks = new RegExp(exports.lineBreak.source, "g");
  }
});

// node_modules/js-beautify/js/src/core/options.js
var require_options = __commonJS({
  "node_modules/js-beautify/js/src/core/options.js"(exports, module2) {
    "use strict";
    function Options(options, merge_child_field) {
      this.raw_options = _mergeOpts(options, merge_child_field);
      this.disabled = this._get_boolean("disabled");
      this.eol = this._get_characters("eol", "auto");
      this.end_with_newline = this._get_boolean("end_with_newline");
      this.indent_size = this._get_number("indent_size", 4);
      this.indent_char = this._get_characters("indent_char", " ");
      this.indent_level = this._get_number("indent_level");
      this.preserve_newlines = this._get_boolean("preserve_newlines", true);
      this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786);
      if (!this.preserve_newlines) {
        this.max_preserve_newlines = 0;
      }
      this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	");
      if (this.indent_with_tabs) {
        this.indent_char = "	";
        if (this.indent_size === 1) {
          this.indent_size = 4;
        }
      }
      this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char"));
      this.indent_empty_lines = this._get_boolean("indent_empty_lines");
      this.templating = this._get_selection_list("templating", ["auto", "none", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
    }
    Options.prototype._get_array = function(name3, default_value) {
      var option_value = this.raw_options[name3];
      var result = default_value || [];
      if (typeof option_value === "object") {
        if (option_value !== null && typeof option_value.concat === "function") {
          result = option_value.concat();
        }
      } else if (typeof option_value === "string") {
        result = option_value.split(/[^a-zA-Z0-9_\/\-]+/);
      }
      return result;
    };
    Options.prototype._get_boolean = function(name3, default_value) {
      var option_value = this.raw_options[name3];
      var result = option_value === void 0 ? !!default_value : !!option_value;
      return result;
    };
    Options.prototype._get_characters = function(name3, default_value) {
      var option_value = this.raw_options[name3];
      var result = default_value || "";
      if (typeof option_value === "string") {
        result = option_value.replace(/\\r/, "\r").replace(/\\n/, "\n").replace(/\\t/, "	");
      }
      return result;
    };
    Options.prototype._get_number = function(name3, default_value) {
      var option_value = this.raw_options[name3];
      default_value = parseInt(default_value, 10);
      if (isNaN(default_value)) {
        default_value = 0;
      }
      var result = parseInt(option_value, 10);
      if (isNaN(result)) {
        result = default_value;
      }
      return result;
    };
    Options.prototype._get_selection = function(name3, selection_list, default_value) {
      var result = this._get_selection_list(name3, selection_list, default_value);
      if (result.length !== 1) {
        throw new Error(
          "Invalid Option Value: The option '" + name3 + "' can only be one of the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name3] + "'"
        );
      }
      return result[0];
    };
    Options.prototype._get_selection_list = function(name3, selection_list, default_value) {
      if (!selection_list || selection_list.length === 0) {
        throw new Error("Selection list cannot be empty.");
      }
      default_value = default_value || [selection_list[0]];
      if (!this._is_valid_selection(default_value, selection_list)) {
        throw new Error("Invalid Default Value!");
      }
      var result = this._get_array(name3, default_value);
      if (!this._is_valid_selection(result, selection_list)) {
        throw new Error(
          "Invalid Option Value: The option '" + name3 + "' can contain only the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name3] + "'"
        );
      }
      return result;
    };
    Options.prototype._is_valid_selection = function(result, selection_list) {
      return result.length && selection_list.length && !result.some(function(item) {
        return selection_list.indexOf(item) === -1;
      });
    };
    function _mergeOpts(allOptions, childFieldName) {
      var finalOpts = {};
      allOptions = _normalizeOpts(allOptions);
      var name3;
      for (name3 in allOptions) {
        if (name3 !== childFieldName) {
          finalOpts[name3] = allOptions[name3];
        }
      }
      if (childFieldName && allOptions[childFieldName]) {
        for (name3 in allOptions[childFieldName]) {
          finalOpts[name3] = allOptions[childFieldName][name3];
        }
      }
      return finalOpts;
    }
    function _normalizeOpts(options) {
      var convertedOpts = {};
      var key;
      for (key in options) {
        var newKey = key.replace(/-/g, "_");
        convertedOpts[newKey] = options[key];
      }
      return convertedOpts;
    }
    module2.exports.Options = Options;
    module2.exports.normalizeOpts = _normalizeOpts;
    module2.exports.mergeOpts = _mergeOpts;
  }
});

// node_modules/js-beautify/js/src/javascript/options.js
var require_options2 = __commonJS({
  "node_modules/js-beautify/js/src/javascript/options.js"(exports, module2) {
    "use strict";
    var BaseOptions = require_options().Options;
    var validPositionValues = ["before-newline", "after-newline", "preserve-newline"];
    function Options(options) {
      BaseOptions.call(this, options, "js");
      var raw_brace_style = this.raw_options.brace_style || null;
      if (raw_brace_style === "expand-strict") {
        this.raw_options.brace_style = "expand";
      } else if (raw_brace_style === "collapse-preserve-inline") {
        this.raw_options.brace_style = "collapse,preserve-inline";
      } else if (this.raw_options.braces_on_own_line !== void 0) {
        this.raw_options.brace_style = this.raw_options.braces_on_own_line ? "expand" : "collapse";
      }
      var brace_style_split = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
      this.brace_preserve_inline = false;
      this.brace_style = "collapse";
      for (var bs = 0; bs < brace_style_split.length; bs++) {
        if (brace_style_split[bs] === "preserve-inline") {
          this.brace_preserve_inline = true;
        } else {
          this.brace_style = brace_style_split[bs];
        }
      }
      this.unindent_chained_methods = this._get_boolean("unindent_chained_methods");
      this.break_chained_methods = this._get_boolean("break_chained_methods");
      this.space_in_paren = this._get_boolean("space_in_paren");
      this.space_in_empty_paren = this._get_boolean("space_in_empty_paren");
      this.jslint_happy = this._get_boolean("jslint_happy");
      this.space_after_anon_function = this._get_boolean("space_after_anon_function");
      this.space_after_named_function = this._get_boolean("space_after_named_function");
      this.keep_array_indentation = this._get_boolean("keep_array_indentation");
      this.space_before_conditional = this._get_boolean("space_before_conditional", true);
      this.unescape_strings = this._get_boolean("unescape_strings");
      this.e4x = this._get_boolean("e4x");
      this.comma_first = this._get_boolean("comma_first");
      this.operator_position = this._get_selection("operator_position", validPositionValues);
      this.test_output_raw = this._get_boolean("test_output_raw");
      if (this.jslint_happy) {
        this.space_after_anon_function = true;
      }
    }
    Options.prototype = new BaseOptions();
    module2.exports.Options = Options;
  }
});

// node_modules/js-beautify/js/src/core/inputscanner.js
var require_inputscanner = __commonJS({
  "node_modules/js-beautify/js/src/core/inputscanner.js"(exports, module2) {
    "use strict";
    var regexp_has_sticky = RegExp.prototype.hasOwnProperty("sticky");
    function InputScanner(input_string) {
      this.__input = input_string || "";
      this.__input_length = this.__input.length;
      this.__position = 0;
    }
    InputScanner.prototype.restart = function() {
      this.__position = 0;
    };
    InputScanner.prototype.back = function() {
      if (this.__position > 0) {
        this.__position -= 1;
      }
    };
    InputScanner.prototype.hasNext = function() {
      return this.__position < this.__input_length;
    };
    InputScanner.prototype.next = function() {
      var val = null;
      if (this.hasNext()) {
        val = this.__input.charAt(this.__position);
        this.__position += 1;
      }
      return val;
    };
    InputScanner.prototype.peek = function(index2) {
      var val = null;
      index2 = index2 || 0;
      index2 += this.__position;
      if (index2 >= 0 && index2 < this.__input_length) {
        val = this.__input.charAt(index2);
      }
      return val;
    };
    InputScanner.prototype.__match = function(pattern, index2) {
      pattern.lastIndex = index2;
      var pattern_match = pattern.exec(this.__input);
      if (pattern_match && !(regexp_has_sticky && pattern.sticky)) {
        if (pattern_match.index !== index2) {
          pattern_match = null;
        }
      }
      return pattern_match;
    };
    InputScanner.prototype.test = function(pattern, index2) {
      index2 = index2 || 0;
      index2 += this.__position;
      if (index2 >= 0 && index2 < this.__input_length) {
        return !!this.__match(pattern, index2);
      } else {
        return false;
      }
    };
    InputScanner.prototype.testChar = function(pattern, index2) {
      var val = this.peek(index2);
      pattern.lastIndex = 0;
      return val !== null && pattern.test(val);
    };
    InputScanner.prototype.match = function(pattern) {
      var pattern_match = this.__match(pattern, this.__position);
      if (pattern_match) {
        this.__position += pattern_match[0].length;
      } else {
        pattern_match = null;
      }
      return pattern_match;
    };
    InputScanner.prototype.read = function(starting_pattern, until_pattern, until_after) {
      var val = "";
      var match;
      if (starting_pattern) {
        match = this.match(starting_pattern);
        if (match) {
          val += match[0];
        }
      }
      if (until_pattern && (match || !starting_pattern)) {
        val += this.readUntil(until_pattern, until_after);
      }
      return val;
    };
    InputScanner.prototype.readUntil = function(pattern, until_after) {
      var val = "";
      var match_index = this.__position;
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);
      if (pattern_match) {
        match_index = pattern_match.index;
        if (until_after) {
          match_index += pattern_match[0].length;
        }
      } else {
        match_index = this.__input_length;
      }
      val = this.__input.substring(this.__position, match_index);
      this.__position = match_index;
      return val;
    };
    InputScanner.prototype.readUntilAfter = function(pattern) {
      return this.readUntil(pattern, true);
    };
    InputScanner.prototype.get_regexp = function(pattern, match_from) {
      var result = null;
      var flags = "g";
      if (match_from && regexp_has_sticky) {
        flags = "y";
      }
      if (typeof pattern === "string" && pattern !== "") {
        result = new RegExp(pattern, flags);
      } else if (pattern) {
        result = new RegExp(pattern.source, flags);
      }
      return result;
    };
    InputScanner.prototype.get_literal_regexp = function(literal_string) {
      return RegExp(literal_string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    };
    InputScanner.prototype.peekUntilAfter = function(pattern) {
      var start = this.__position;
      var val = this.readUntilAfter(pattern);
      this.__position = start;
      return val;
    };
    InputScanner.prototype.lookBack = function(testVal) {
      var start = this.__position - 1;
      return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
    };
    module2.exports.InputScanner = InputScanner;
  }
});

// node_modules/js-beautify/js/src/core/tokenstream.js
var require_tokenstream = __commonJS({
  "node_modules/js-beautify/js/src/core/tokenstream.js"(exports, module2) {
    "use strict";
    function TokenStream(parent_token) {
      this.__tokens = [];
      this.__tokens_length = this.__tokens.length;
      this.__position = 0;
      this.__parent_token = parent_token;
    }
    TokenStream.prototype.restart = function() {
      this.__position = 0;
    };
    TokenStream.prototype.isEmpty = function() {
      return this.__tokens_length === 0;
    };
    TokenStream.prototype.hasNext = function() {
      return this.__position < this.__tokens_length;
    };
    TokenStream.prototype.next = function() {
      var val = null;
      if (this.hasNext()) {
        val = this.__tokens[this.__position];
        this.__position += 1;
      }
      return val;
    };
    TokenStream.prototype.peek = function(index2) {
      var val = null;
      index2 = index2 || 0;
      index2 += this.__position;
      if (index2 >= 0 && index2 < this.__tokens_length) {
        val = this.__tokens[index2];
      }
      return val;
    };
    TokenStream.prototype.add = function(token) {
      if (this.__parent_token) {
        token.parent = this.__parent_token;
      }
      this.__tokens.push(token);
      this.__tokens_length += 1;
    };
    module2.exports.TokenStream = TokenStream;
  }
});

// node_modules/js-beautify/js/src/core/pattern.js
var require_pattern = __commonJS({
  "node_modules/js-beautify/js/src/core/pattern.js"(exports, module2) {
    "use strict";
    function Pattern(input_scanner, parent) {
      this._input = input_scanner;
      this._starting_pattern = null;
      this._match_pattern = null;
      this._until_pattern = null;
      this._until_after = false;
      if (parent) {
        this._starting_pattern = this._input.get_regexp(parent._starting_pattern, true);
        this._match_pattern = this._input.get_regexp(parent._match_pattern, true);
        this._until_pattern = this._input.get_regexp(parent._until_pattern);
        this._until_after = parent._until_after;
      }
    }
    Pattern.prototype.read = function() {
      var result = this._input.read(this._starting_pattern);
      if (!this._starting_pattern || result) {
        result += this._input.read(this._match_pattern, this._until_pattern, this._until_after);
      }
      return result;
    };
    Pattern.prototype.read_match = function() {
      return this._input.match(this._match_pattern);
    };
    Pattern.prototype.until_after = function(pattern) {
      var result = this._create();
      result._until_after = true;
      result._until_pattern = this._input.get_regexp(pattern);
      result._update();
      return result;
    };
    Pattern.prototype.until = function(pattern) {
      var result = this._create();
      result._until_after = false;
      result._until_pattern = this._input.get_regexp(pattern);
      result._update();
      return result;
    };
    Pattern.prototype.starting_with = function(pattern) {
      var result = this._create();
      result._starting_pattern = this._input.get_regexp(pattern, true);
      result._update();
      return result;
    };
    Pattern.prototype.matching = function(pattern) {
      var result = this._create();
      result._match_pattern = this._input.get_regexp(pattern, true);
      result._update();
      return result;
    };
    Pattern.prototype._create = function() {
      return new Pattern(this._input, this);
    };
    Pattern.prototype._update = function() {
    };
    module2.exports.Pattern = Pattern;
  }
});

// node_modules/js-beautify/js/src/core/whitespacepattern.js
var require_whitespacepattern = __commonJS({
  "node_modules/js-beautify/js/src/core/whitespacepattern.js"(exports, module2) {
    "use strict";
    var Pattern = require_pattern().Pattern;
    function WhitespacePattern(input_scanner, parent) {
      Pattern.call(this, input_scanner, parent);
      if (parent) {
        this._line_regexp = this._input.get_regexp(parent._line_regexp);
      } else {
        this.__set_whitespace_patterns("", "");
      }
      this.newline_count = 0;
      this.whitespace_before_token = "";
    }
    WhitespacePattern.prototype = new Pattern();
    WhitespacePattern.prototype.__set_whitespace_patterns = function(whitespace_chars, newline_chars) {
      whitespace_chars += "\\t ";
      newline_chars += "\\n\\r";
      this._match_pattern = this._input.get_regexp(
        "[" + whitespace_chars + newline_chars + "]+",
        true
      );
      this._newline_regexp = this._input.get_regexp(
        "\\r\\n|[" + newline_chars + "]"
      );
    };
    WhitespacePattern.prototype.read = function() {
      this.newline_count = 0;
      this.whitespace_before_token = "";
      var resulting_string = this._input.read(this._match_pattern);
      if (resulting_string === " ") {
        this.whitespace_before_token = " ";
      } else if (resulting_string) {
        var matches2 = this.__split(this._newline_regexp, resulting_string);
        this.newline_count = matches2.length - 1;
        this.whitespace_before_token = matches2[this.newline_count];
      }
      return resulting_string;
    };
    WhitespacePattern.prototype.matching = function(whitespace_chars, newline_chars) {
      var result = this._create();
      result.__set_whitespace_patterns(whitespace_chars, newline_chars);
      result._update();
      return result;
    };
    WhitespacePattern.prototype._create = function() {
      return new WhitespacePattern(this._input, this);
    };
    WhitespacePattern.prototype.__split = function(regexp, input_string) {
      regexp.lastIndex = 0;
      var start_index = 0;
      var result = [];
      var next_match = regexp.exec(input_string);
      while (next_match) {
        result.push(input_string.substring(start_index, next_match.index));
        start_index = next_match.index + next_match[0].length;
        next_match = regexp.exec(input_string);
      }
      if (start_index < input_string.length) {
        result.push(input_string.substring(start_index, input_string.length));
      } else {
        result.push("");
      }
      return result;
    };
    module2.exports.WhitespacePattern = WhitespacePattern;
  }
});

// node_modules/js-beautify/js/src/core/tokenizer.js
var require_tokenizer = __commonJS({
  "node_modules/js-beautify/js/src/core/tokenizer.js"(exports, module2) {
    "use strict";
    var InputScanner = require_inputscanner().InputScanner;
    var Token = require_token().Token;
    var TokenStream = require_tokenstream().TokenStream;
    var WhitespacePattern = require_whitespacepattern().WhitespacePattern;
    var TOKEN = {
      START: "TK_START",
      RAW: "TK_RAW",
      EOF: "TK_EOF"
    };
    var Tokenizer = function(input_string, options) {
      this._input = new InputScanner(input_string);
      this._options = options || {};
      this.__tokens = null;
      this._patterns = {};
      this._patterns.whitespace = new WhitespacePattern(this._input);
    };
    Tokenizer.prototype.tokenize = function() {
      this._input.restart();
      this.__tokens = new TokenStream();
      this._reset();
      var current;
      var previous = new Token(TOKEN.START, "");
      var open_token = null;
      var open_stack = [];
      var comments = new TokenStream();
      while (previous.type !== TOKEN.EOF) {
        current = this._get_next_token(previous, open_token);
        while (this._is_comment(current)) {
          comments.add(current);
          current = this._get_next_token(previous, open_token);
        }
        if (!comments.isEmpty()) {
          current.comments_before = comments;
          comments = new TokenStream();
        }
        current.parent = open_token;
        if (this._is_opening(current)) {
          open_stack.push(open_token);
          open_token = current;
        } else if (open_token && this._is_closing(current, open_token)) {
          current.opened = open_token;
          open_token.closed = current;
          open_token = open_stack.pop();
          current.parent = open_token;
        }
        current.previous = previous;
        previous.next = current;
        this.__tokens.add(current);
        previous = current;
      }
      return this.__tokens;
    };
    Tokenizer.prototype._is_first_token = function() {
      return this.__tokens.isEmpty();
    };
    Tokenizer.prototype._reset = function() {
    };
    Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
      this._readWhitespace();
      var resulting_string = this._input.read(/.+/g);
      if (resulting_string) {
        return this._create_token(TOKEN.RAW, resulting_string);
      } else {
        return this._create_token(TOKEN.EOF, "");
      }
    };
    Tokenizer.prototype._is_comment = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_opening = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_closing = function(current_token, open_token) {
      return false;
    };
    Tokenizer.prototype._create_token = function(type, text2) {
      var token = new Token(
        type,
        text2,
        this._patterns.whitespace.newline_count,
        this._patterns.whitespace.whitespace_before_token
      );
      return token;
    };
    Tokenizer.prototype._readWhitespace = function() {
      return this._patterns.whitespace.read();
    };
    module2.exports.Tokenizer = Tokenizer;
    module2.exports.TOKEN = TOKEN;
  }
});

// node_modules/js-beautify/js/src/core/directives.js
var require_directives = __commonJS({
  "node_modules/js-beautify/js/src/core/directives.js"(exports, module2) {
    "use strict";
    function Directives(start_block_pattern, end_block_pattern) {
      start_block_pattern = typeof start_block_pattern === "string" ? start_block_pattern : start_block_pattern.source;
      end_block_pattern = typeof end_block_pattern === "string" ? end_block_pattern : end_block_pattern.source;
      this.__directives_block_pattern = new RegExp(start_block_pattern + / beautify( \w+[:]\w+)+ /.source + end_block_pattern, "g");
      this.__directive_pattern = / (\w+)[:](\w+)/g;
      this.__directives_end_ignore_pattern = new RegExp(start_block_pattern + /\sbeautify\signore:end\s/.source + end_block_pattern, "g");
    }
    Directives.prototype.get_directives = function(text2) {
      if (!text2.match(this.__directives_block_pattern)) {
        return null;
      }
      var directives = {};
      this.__directive_pattern.lastIndex = 0;
      var directive_match = this.__directive_pattern.exec(text2);
      while (directive_match) {
        directives[directive_match[1]] = directive_match[2];
        directive_match = this.__directive_pattern.exec(text2);
      }
      return directives;
    };
    Directives.prototype.readIgnored = function(input) {
      return input.readUntilAfter(this.__directives_end_ignore_pattern);
    };
    module2.exports.Directives = Directives;
  }
});

// node_modules/js-beautify/js/src/core/templatablepattern.js
var require_templatablepattern = __commonJS({
  "node_modules/js-beautify/js/src/core/templatablepattern.js"(exports, module2) {
    "use strict";
    var Pattern = require_pattern().Pattern;
    var template_names = {
      django: false,
      erb: false,
      handlebars: false,
      php: false,
      smarty: false
    };
    function TemplatablePattern(input_scanner, parent) {
      Pattern.call(this, input_scanner, parent);
      this.__template_pattern = null;
      this._disabled = Object.assign({}, template_names);
      this._excluded = Object.assign({}, template_names);
      if (parent) {
        this.__template_pattern = this._input.get_regexp(parent.__template_pattern);
        this._excluded = Object.assign(this._excluded, parent._excluded);
        this._disabled = Object.assign(this._disabled, parent._disabled);
      }
      var pattern = new Pattern(input_scanner);
      this.__patterns = {
        handlebars_comment: pattern.starting_with(/{{!--/).until_after(/--}}/),
        handlebars_unescaped: pattern.starting_with(/{{{/).until_after(/}}}/),
        handlebars: pattern.starting_with(/{{/).until_after(/}}/),
        php: pattern.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
        erb: pattern.starting_with(/<%[^%]/).until_after(/[^%]%>/),
        // django coflicts with handlebars a bit.
        django: pattern.starting_with(/{%/).until_after(/%}/),
        django_value: pattern.starting_with(/{{/).until_after(/}}/),
        django_comment: pattern.starting_with(/{#/).until_after(/#}/),
        smarty: pattern.starting_with(/{(?=[^}{\s\n])/).until_after(/[^\s\n]}/),
        smarty_comment: pattern.starting_with(/{\*/).until_after(/\*}/),
        smarty_literal: pattern.starting_with(/{literal}/).until_after(/{\/literal}/)
      };
    }
    TemplatablePattern.prototype = new Pattern();
    TemplatablePattern.prototype._create = function() {
      return new TemplatablePattern(this._input, this);
    };
    TemplatablePattern.prototype._update = function() {
      this.__set_templated_pattern();
    };
    TemplatablePattern.prototype.disable = function(language) {
      var result = this._create();
      result._disabled[language] = true;
      result._update();
      return result;
    };
    TemplatablePattern.prototype.read_options = function(options) {
      var result = this._create();
      for (var language in template_names) {
        result._disabled[language] = options.templating.indexOf(language) === -1;
      }
      result._update();
      return result;
    };
    TemplatablePattern.prototype.exclude = function(language) {
      var result = this._create();
      result._excluded[language] = true;
      result._update();
      return result;
    };
    TemplatablePattern.prototype.read = function() {
      var result = "";
      if (this._match_pattern) {
        result = this._input.read(this._starting_pattern);
      } else {
        result = this._input.read(this._starting_pattern, this.__template_pattern);
      }
      var next = this._read_template();
      while (next) {
        if (this._match_pattern) {
          next += this._input.read(this._match_pattern);
        } else {
          next += this._input.readUntil(this.__template_pattern);
        }
        result += next;
        next = this._read_template();
      }
      if (this._until_after) {
        result += this._input.readUntilAfter(this._until_pattern);
      }
      return result;
    };
    TemplatablePattern.prototype.__set_templated_pattern = function() {
      var items = [];
      if (!this._disabled.php) {
        items.push(this.__patterns.php._starting_pattern.source);
      }
      if (!this._disabled.handlebars) {
        items.push(this.__patterns.handlebars._starting_pattern.source);
      }
      if (!this._disabled.erb) {
        items.push(this.__patterns.erb._starting_pattern.source);
      }
      if (!this._disabled.django) {
        items.push(this.__patterns.django._starting_pattern.source);
        items.push(this.__patterns.django_value._starting_pattern.source);
        items.push(this.__patterns.django_comment._starting_pattern.source);
      }
      if (!this._disabled.smarty) {
        items.push(this.__patterns.smarty._starting_pattern.source);
      }
      if (this._until_pattern) {
        items.push(this._until_pattern.source);
      }
      this.__template_pattern = this._input.get_regexp("(?:" + items.join("|") + ")");
    };
    TemplatablePattern.prototype._read_template = function() {
      var resulting_string = "";
      var c = this._input.peek();
      if (c === "<") {
        var peek1 = this._input.peek(1);
        if (!this._disabled.php && !this._excluded.php && peek1 === "?") {
          resulting_string = resulting_string || this.__patterns.php.read();
        }
        if (!this._disabled.erb && !this._excluded.erb && peek1 === "%") {
          resulting_string = resulting_string || this.__patterns.erb.read();
        }
      } else if (c === "{") {
        if (!this._disabled.handlebars && !this._excluded.handlebars) {
          resulting_string = resulting_string || this.__patterns.handlebars_comment.read();
          resulting_string = resulting_string || this.__patterns.handlebars_unescaped.read();
          resulting_string = resulting_string || this.__patterns.handlebars.read();
        }
        if (!this._disabled.django) {
          if (!this._excluded.django && !this._excluded.handlebars) {
            resulting_string = resulting_string || this.__patterns.django_value.read();
          }
          if (!this._excluded.django) {
            resulting_string = resulting_string || this.__patterns.django_comment.read();
            resulting_string = resulting_string || this.__patterns.django.read();
          }
        }
        if (!this._disabled.smarty) {
          if (this._disabled.django && this._disabled.handlebars) {
            resulting_string = resulting_string || this.__patterns.smarty_comment.read();
            resulting_string = resulting_string || this.__patterns.smarty_literal.read();
            resulting_string = resulting_string || this.__patterns.smarty.read();
          }
        }
      }
      return resulting_string;
    };
    module2.exports.TemplatablePattern = TemplatablePattern;
  }
});

// node_modules/js-beautify/js/src/javascript/tokenizer.js
var require_tokenizer2 = __commonJS({
  "node_modules/js-beautify/js/src/javascript/tokenizer.js"(exports, module2) {
    "use strict";
    var InputScanner = require_inputscanner().InputScanner;
    var BaseTokenizer = require_tokenizer().Tokenizer;
    var BASETOKEN = require_tokenizer().TOKEN;
    var Directives = require_directives().Directives;
    var acorn = require_acorn();
    var Pattern = require_pattern().Pattern;
    var TemplatablePattern = require_templatablepattern().TemplatablePattern;
    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }
    var TOKEN = {
      START_EXPR: "TK_START_EXPR",
      END_EXPR: "TK_END_EXPR",
      START_BLOCK: "TK_START_BLOCK",
      END_BLOCK: "TK_END_BLOCK",
      WORD: "TK_WORD",
      RESERVED: "TK_RESERVED",
      SEMICOLON: "TK_SEMICOLON",
      STRING: "TK_STRING",
      EQUALS: "TK_EQUALS",
      OPERATOR: "TK_OPERATOR",
      COMMA: "TK_COMMA",
      BLOCK_COMMENT: "TK_BLOCK_COMMENT",
      COMMENT: "TK_COMMENT",
      DOT: "TK_DOT",
      UNKNOWN: "TK_UNKNOWN",
      START: BASETOKEN.START,
      RAW: BASETOKEN.RAW,
      EOF: BASETOKEN.EOF
    };
    var directives_core = new Directives(/\/\*/, /\*\//);
    var number_pattern = /0[xX][0123456789abcdefABCDEF_]*n?|0[oO][01234567_]*n?|0[bB][01_]*n?|\d[\d_]*n|(?:\.\d[\d_]*|\d[\d_]*\.?[\d_]*)(?:[eE][+-]?[\d_]+)?/;
    var digit = /[0-9]/;
    var dot_pattern = /[^\d\.]/;
    var positionable_operators = ">>> === !== &&= ??= ||= << && >= ** != == <= >> || ?? |> < / - + > : & % ? ^ | *".split(" ");
    var punct = ">>>= ... >>= <<= === >>> !== **= &&= ??= ||= => ^= :: /= << <= == && -= >= >> != -- += ** || ?? ++ %= &= *= |= |> = ! ? > < : / ^ - + * & % ~ |";
    punct = punct.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
    punct = "\\?\\.(?!\\d) " + punct;
    punct = punct.replace(/ /g, "|");
    var punct_pattern = new RegExp(punct);
    var line_starters = "continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export".split(",");
    var reserved_words = line_starters.concat(["do", "in", "of", "else", "get", "set", "new", "catch", "finally", "typeof", "yield", "async", "await", "from", "as", "class", "extends"]);
    var reserved_word_pattern = new RegExp("^(?:" + reserved_words.join("|") + ")$");
    var in_html_comment;
    var Tokenizer = function(input_string, options) {
      BaseTokenizer.call(this, input_string, options);
      this._patterns.whitespace = this._patterns.whitespace.matching(
        /\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff/.source,
        /\u2028\u2029/.source
      );
      var pattern_reader = new Pattern(this._input);
      var templatable = new TemplatablePattern(this._input).read_options(this._options);
      this.__patterns = {
        template: templatable,
        identifier: templatable.starting_with(acorn.identifier).matching(acorn.identifierMatch),
        number: pattern_reader.matching(number_pattern),
        punct: pattern_reader.matching(punct_pattern),
        // comment ends just before nearest linefeed or end of file
        comment: pattern_reader.starting_with(/\/\//).until(/[\n\r\u2028\u2029]/),
        //  /* ... */ comment ends with nearest */ or end of file
        block_comment: pattern_reader.starting_with(/\/\*/).until_after(/\*\//),
        html_comment_start: pattern_reader.matching(/<!--/),
        html_comment_end: pattern_reader.matching(/-->/),
        include: pattern_reader.starting_with(/#include/).until_after(acorn.lineBreak),
        shebang: pattern_reader.starting_with(/#!/).until_after(acorn.lineBreak),
        xml: pattern_reader.matching(/[\s\S]*?<(\/?)([-a-zA-Z:0-9_.]+|{[^}]+?}|!\[CDATA\[[^\]]*?\]\]|)(\s*{[^}]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{([^{}]|{[^}]+?})+?}))*\s*(\/?)\s*>/),
        single_quote: templatable.until(/['\\\n\r\u2028\u2029]/),
        double_quote: templatable.until(/["\\\n\r\u2028\u2029]/),
        template_text: templatable.until(/[`\\$]/),
        template_expression: templatable.until(/[`}\\]/)
      };
    };
    Tokenizer.prototype = new BaseTokenizer();
    Tokenizer.prototype._is_comment = function(current_token) {
      return current_token.type === TOKEN.COMMENT || current_token.type === TOKEN.BLOCK_COMMENT || current_token.type === TOKEN.UNKNOWN;
    };
    Tokenizer.prototype._is_opening = function(current_token) {
      return current_token.type === TOKEN.START_BLOCK || current_token.type === TOKEN.START_EXPR;
    };
    Tokenizer.prototype._is_closing = function(current_token, open_token) {
      return (current_token.type === TOKEN.END_BLOCK || current_token.type === TOKEN.END_EXPR) && (open_token && (current_token.text === "]" && open_token.text === "[" || current_token.text === ")" && open_token.text === "(" || current_token.text === "}" && open_token.text === "{"));
    };
    Tokenizer.prototype._reset = function() {
      in_html_comment = false;
    };
    Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
      var token = null;
      this._readWhitespace();
      var c = this._input.peek();
      if (c === null) {
        return this._create_token(TOKEN.EOF, "");
      }
      token = token || this._read_non_javascript(c);
      token = token || this._read_string(c);
      token = token || this._read_word(previous_token);
      token = token || this._read_singles(c);
      token = token || this._read_comment(c);
      token = token || this._read_regexp(c, previous_token);
      token = token || this._read_xml(c, previous_token);
      token = token || this._read_punctuation();
      token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
      return token;
    };
    Tokenizer.prototype._read_word = function(previous_token) {
      var resulting_string;
      resulting_string = this.__patterns.identifier.read();
      if (resulting_string !== "") {
        resulting_string = resulting_string.replace(acorn.allLineBreaks, "\n");
        if (!(previous_token.type === TOKEN.DOT || previous_token.type === TOKEN.RESERVED && (previous_token.text === "set" || previous_token.text === "get")) && reserved_word_pattern.test(resulting_string)) {
          if ((resulting_string === "in" || resulting_string === "of") && (previous_token.type === TOKEN.WORD || previous_token.type === TOKEN.STRING)) {
            return this._create_token(TOKEN.OPERATOR, resulting_string);
          }
          return this._create_token(TOKEN.RESERVED, resulting_string);
        }
        return this._create_token(TOKEN.WORD, resulting_string);
      }
      resulting_string = this.__patterns.number.read();
      if (resulting_string !== "") {
        return this._create_token(TOKEN.WORD, resulting_string);
      }
    };
    Tokenizer.prototype._read_singles = function(c) {
      var token = null;
      if (c === "(" || c === "[") {
        token = this._create_token(TOKEN.START_EXPR, c);
      } else if (c === ")" || c === "]") {
        token = this._create_token(TOKEN.END_EXPR, c);
      } else if (c === "{") {
        token = this._create_token(TOKEN.START_BLOCK, c);
      } else if (c === "}") {
        token = this._create_token(TOKEN.END_BLOCK, c);
      } else if (c === ";") {
        token = this._create_token(TOKEN.SEMICOLON, c);
      } else if (c === "." && dot_pattern.test(this._input.peek(1))) {
        token = this._create_token(TOKEN.DOT, c);
      } else if (c === ",") {
        token = this._create_token(TOKEN.COMMA, c);
      }
      if (token) {
        this._input.next();
      }
      return token;
    };
    Tokenizer.prototype._read_punctuation = function() {
      var resulting_string = this.__patterns.punct.read();
      if (resulting_string !== "") {
        if (resulting_string === "=") {
          return this._create_token(TOKEN.EQUALS, resulting_string);
        } else if (resulting_string === "?.") {
          return this._create_token(TOKEN.DOT, resulting_string);
        } else {
          return this._create_token(TOKEN.OPERATOR, resulting_string);
        }
      }
    };
    Tokenizer.prototype._read_non_javascript = function(c) {
      var resulting_string = "";
      if (c === "#") {
        if (this._is_first_token()) {
          resulting_string = this.__patterns.shebang.read();
          if (resulting_string) {
            return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + "\n");
          }
        }
        resulting_string = this.__patterns.include.read();
        if (resulting_string) {
          return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + "\n");
        }
        c = this._input.next();
        var sharp = "#";
        if (this._input.hasNext() && this._input.testChar(digit)) {
          do {
            c = this._input.next();
            sharp += c;
          } while (this._input.hasNext() && c !== "#" && c !== "=");
          if (c === "#") {
          } else if (this._input.peek() === "[" && this._input.peek(1) === "]") {
            sharp += "[]";
            this._input.next();
            this._input.next();
          } else if (this._input.peek() === "{" && this._input.peek(1) === "}") {
            sharp += "{}";
            this._input.next();
            this._input.next();
          }
          return this._create_token(TOKEN.WORD, sharp);
        }
        this._input.back();
      } else if (c === "<" && this._is_first_token()) {
        resulting_string = this.__patterns.html_comment_start.read();
        if (resulting_string) {
          while (this._input.hasNext() && !this._input.testChar(acorn.newline)) {
            resulting_string += this._input.next();
          }
          in_html_comment = true;
          return this._create_token(TOKEN.COMMENT, resulting_string);
        }
      } else if (in_html_comment && c === "-") {
        resulting_string = this.__patterns.html_comment_end.read();
        if (resulting_string) {
          in_html_comment = false;
          return this._create_token(TOKEN.COMMENT, resulting_string);
        }
      }
      return null;
    };
    Tokenizer.prototype._read_comment = function(c) {
      var token = null;
      if (c === "/") {
        var comment = "";
        if (this._input.peek(1) === "*") {
          comment = this.__patterns.block_comment.read();
          var directives = directives_core.get_directives(comment);
          if (directives && directives.ignore === "start") {
            comment += directives_core.readIgnored(this._input);
          }
          comment = comment.replace(acorn.allLineBreaks, "\n");
          token = this._create_token(TOKEN.BLOCK_COMMENT, comment);
          token.directives = directives;
        } else if (this._input.peek(1) === "/") {
          comment = this.__patterns.comment.read();
          token = this._create_token(TOKEN.COMMENT, comment);
        }
      }
      return token;
    };
    Tokenizer.prototype._read_string = function(c) {
      if (c === "`" || c === "'" || c === '"') {
        var resulting_string = this._input.next();
        this.has_char_escapes = false;
        if (c === "`") {
          resulting_string += this._read_string_recursive("`", true, "${");
        } else {
          resulting_string += this._read_string_recursive(c);
        }
        if (this.has_char_escapes && this._options.unescape_strings) {
          resulting_string = unescape_string(resulting_string);
        }
        if (this._input.peek() === c) {
          resulting_string += this._input.next();
        }
        resulting_string = resulting_string.replace(acorn.allLineBreaks, "\n");
        return this._create_token(TOKEN.STRING, resulting_string);
      }
      return null;
    };
    Tokenizer.prototype._allow_regexp_or_xml = function(previous_token) {
      return previous_token.type === TOKEN.RESERVED && in_array(previous_token.text, ["return", "case", "throw", "else", "do", "typeof", "yield"]) || previous_token.type === TOKEN.END_EXPR && previous_token.text === ")" && previous_token.opened.previous.type === TOKEN.RESERVED && in_array(previous_token.opened.previous.text, ["if", "while", "for"]) || in_array(previous_token.type, [
        TOKEN.COMMENT,
        TOKEN.START_EXPR,
        TOKEN.START_BLOCK,
        TOKEN.START,
        TOKEN.END_BLOCK,
        TOKEN.OPERATOR,
        TOKEN.EQUALS,
        TOKEN.EOF,
        TOKEN.SEMICOLON,
        TOKEN.COMMA
      ]);
    };
    Tokenizer.prototype._read_regexp = function(c, previous_token) {
      if (c === "/" && this._allow_regexp_or_xml(previous_token)) {
        var resulting_string = this._input.next();
        var esc = false;
        var in_char_class = false;
        while (this._input.hasNext() && ((esc || in_char_class || this._input.peek() !== c) && !this._input.testChar(acorn.newline))) {
          resulting_string += this._input.peek();
          if (!esc) {
            esc = this._input.peek() === "\\";
            if (this._input.peek() === "[") {
              in_char_class = true;
            } else if (this._input.peek() === "]") {
              in_char_class = false;
            }
          } else {
            esc = false;
          }
          this._input.next();
        }
        if (this._input.peek() === c) {
          resulting_string += this._input.next();
          resulting_string += this._input.read(acorn.identifier);
        }
        return this._create_token(TOKEN.STRING, resulting_string);
      }
      return null;
    };
    Tokenizer.prototype._read_xml = function(c, previous_token) {
      if (this._options.e4x && c === "<" && this._allow_regexp_or_xml(previous_token)) {
        var xmlStr = "";
        var match = this.__patterns.xml.read_match();
        if (match) {
          var rootTag = match[2].replace(/^{\s+/, "{").replace(/\s+}$/, "}");
          var isCurlyRoot = rootTag.indexOf("{") === 0;
          var depth = 0;
          while (match) {
            var isEndTag = !!match[1];
            var tagName2 = match[2];
            var isSingletonTag = !!match[match.length - 1] || tagName2.slice(0, 8) === "![CDATA[";
            if (!isSingletonTag && (tagName2 === rootTag || isCurlyRoot && tagName2.replace(/^{\s+/, "{").replace(/\s+}$/, "}"))) {
              if (isEndTag) {
                --depth;
              } else {
                ++depth;
              }
            }
            xmlStr += match[0];
            if (depth <= 0) {
              break;
            }
            match = this.__patterns.xml.read_match();
          }
          if (!match) {
            xmlStr += this._input.match(/[\s\S]*/g)[0];
          }
          xmlStr = xmlStr.replace(acorn.allLineBreaks, "\n");
          return this._create_token(TOKEN.STRING, xmlStr);
        }
      }
      return null;
    };
    function unescape_string(s) {
      var out = "", escaped = 0;
      var input_scan = new InputScanner(s);
      var matched = null;
      while (input_scan.hasNext()) {
        matched = input_scan.match(/([\s]|[^\\]|\\\\)+/g);
        if (matched) {
          out += matched[0];
        }
        if (input_scan.peek() === "\\") {
          input_scan.next();
          if (input_scan.peek() === "x") {
            matched = input_scan.match(/x([0-9A-Fa-f]{2})/g);
          } else if (input_scan.peek() === "u") {
            matched = input_scan.match(/u([0-9A-Fa-f]{4})/g);
          } else {
            out += "\\";
            if (input_scan.hasNext()) {
              out += input_scan.next();
            }
            continue;
          }
          if (!matched) {
            return s;
          }
          escaped = parseInt(matched[1], 16);
          if (escaped > 126 && escaped <= 255 && matched[0].indexOf("x") === 0) {
            return s;
          } else if (escaped >= 0 && escaped < 32) {
            out += "\\" + matched[0];
            continue;
          } else if (escaped === 34 || escaped === 39 || escaped === 92) {
            out += "\\" + String.fromCharCode(escaped);
          } else {
            out += String.fromCharCode(escaped);
          }
        }
      }
      return out;
    }
    Tokenizer.prototype._read_string_recursive = function(delimiter2, allow_unescaped_newlines, start_sub) {
      var current_char;
      var pattern;
      if (delimiter2 === "'") {
        pattern = this.__patterns.single_quote;
      } else if (delimiter2 === '"') {
        pattern = this.__patterns.double_quote;
      } else if (delimiter2 === "`") {
        pattern = this.__patterns.template_text;
      } else if (delimiter2 === "}") {
        pattern = this.__patterns.template_expression;
      }
      var resulting_string = pattern.read();
      var next = "";
      while (this._input.hasNext()) {
        next = this._input.next();
        if (next === delimiter2 || !allow_unescaped_newlines && acorn.newline.test(next)) {
          this._input.back();
          break;
        } else if (next === "\\" && this._input.hasNext()) {
          current_char = this._input.peek();
          if (current_char === "x" || current_char === "u") {
            this.has_char_escapes = true;
          } else if (current_char === "\r" && this._input.peek(1) === "\n") {
            this._input.next();
          }
          next += this._input.next();
        } else if (start_sub) {
          if (start_sub === "${" && next === "$" && this._input.peek() === "{") {
            next += this._input.next();
          }
          if (start_sub === next) {
            if (delimiter2 === "`") {
              next += this._read_string_recursive("}", allow_unescaped_newlines, "`");
            } else {
              next += this._read_string_recursive("`", allow_unescaped_newlines, "${");
            }
            if (this._input.hasNext()) {
              next += this._input.next();
            }
          }
        }
        next += pattern.read();
        resulting_string += next;
      }
      return resulting_string;
    };
    module2.exports.Tokenizer = Tokenizer;
    module2.exports.TOKEN = TOKEN;
    module2.exports.positionable_operators = positionable_operators.slice();
    module2.exports.line_starters = line_starters.slice();
  }
});

// node_modules/js-beautify/js/src/javascript/beautifier.js
var require_beautifier = __commonJS({
  "node_modules/js-beautify/js/src/javascript/beautifier.js"(exports, module2) {
    "use strict";
    var Output = require_output().Output;
    var Token = require_token().Token;
    var acorn = require_acorn();
    var Options = require_options2().Options;
    var Tokenizer = require_tokenizer2().Tokenizer;
    var line_starters = require_tokenizer2().line_starters;
    var positionable_operators = require_tokenizer2().positionable_operators;
    var TOKEN = require_tokenizer2().TOKEN;
    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }
    function ltrim(s) {
      return s.replace(/^\s+/g, "");
    }
    function generateMapFromStrings(list) {
      var result = {};
      for (var x = 0; x < list.length; x++) {
        result[list[x].replace(/-/g, "_")] = list[x];
      }
      return result;
    }
    function reserved_word(token, word) {
      return token && token.type === TOKEN.RESERVED && token.text === word;
    }
    function reserved_array(token, words) {
      return token && token.type === TOKEN.RESERVED && in_array(token.text, words);
    }
    var special_words = ["case", "return", "do", "if", "throw", "else", "await", "break", "continue", "async"];
    var validPositionValues = ["before-newline", "after-newline", "preserve-newline"];
    var OPERATOR_POSITION = generateMapFromStrings(validPositionValues);
    var OPERATOR_POSITION_BEFORE_OR_PRESERVE = [OPERATOR_POSITION.before_newline, OPERATOR_POSITION.preserve_newline];
    var MODE = {
      BlockStatement: "BlockStatement",
      // 'BLOCK'
      Statement: "Statement",
      // 'STATEMENT'
      ObjectLiteral: "ObjectLiteral",
      // 'OBJECT',
      ArrayLiteral: "ArrayLiteral",
      //'[EXPRESSION]',
      ForInitializer: "ForInitializer",
      //'(FOR-EXPRESSION)',
      Conditional: "Conditional",
      //'(COND-EXPRESSION)',
      Expression: "Expression"
      //'(EXPRESSION)'
    };
    function remove_redundant_indentation(output, frame) {
      if (frame.multiline_frame || frame.mode === MODE.ForInitializer || frame.mode === MODE.Conditional) {
        return;
      }
      output.remove_indent(frame.start_line_index);
    }
    function split_linebreaks(s) {
      s = s.replace(acorn.allLineBreaks, "\n");
      var out = [], idx = s.indexOf("\n");
      while (idx !== -1) {
        out.push(s.substring(0, idx));
        s = s.substring(idx + 1);
        idx = s.indexOf("\n");
      }
      if (s.length) {
        out.push(s);
      }
      return out;
    }
    function is_array(mode) {
      return mode === MODE.ArrayLiteral;
    }
    function is_expression(mode) {
      return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
    }
    function all_lines_start_with(lines, c) {
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.charAt(0) !== c) {
          return false;
        }
      }
      return true;
    }
    function each_line_matches_indent(lines, indent) {
      var i = 0, len = lines.length, line;
      for (; i < len; i++) {
        line = lines[i];
        if (line && line.indexOf(indent) !== 0) {
          return false;
        }
      }
      return true;
    }
    function Beautifier(source_text, options) {
      options = options || {};
      this._source_text = source_text || "";
      this._output = null;
      this._tokens = null;
      this._last_last_text = null;
      this._flags = null;
      this._previous_flags = null;
      this._flag_store = null;
      this._options = new Options(options);
    }
    Beautifier.prototype.create_flags = function(flags_base, mode) {
      var next_indent_level = 0;
      if (flags_base) {
        next_indent_level = flags_base.indentation_level;
        if (!this._output.just_added_newline() && flags_base.line_indent_level > next_indent_level) {
          next_indent_level = flags_base.line_indent_level;
        }
      }
      var next_flags = {
        mode,
        parent: flags_base,
        last_token: flags_base ? flags_base.last_token : new Token(TOKEN.START_BLOCK, ""),
        // last token text
        last_word: flags_base ? flags_base.last_word : "",
        // last TOKEN.WORD passed
        declaration_statement: false,
        declaration_assignment: false,
        multiline_frame: false,
        inline_frame: false,
        if_block: false,
        else_block: false,
        class_start_block: false,
        // class A { INSIDE HERE } or class B extends C { INSIDE HERE }
        do_block: false,
        do_while: false,
        import_block: false,
        in_case_statement: false,
        // switch(..){ INSIDE HERE }
        in_case: false,
        // we're on the exact line with "case 0:"
        case_body: false,
        // the indented case-action block
        case_block: false,
        // the indented case-action block is wrapped with {}
        indentation_level: next_indent_level,
        alignment: 0,
        line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
        start_line_index: this._output.get_line_number(),
        ternary_depth: 0
      };
      return next_flags;
    };
    Beautifier.prototype._reset = function(source_text) {
      var baseIndentString = source_text.match(/^[\t ]*/)[0];
      this._last_last_text = "";
      this._output = new Output(this._options, baseIndentString);
      this._output.raw = this._options.test_output_raw;
      this._flag_store = [];
      this.set_mode(MODE.BlockStatement);
      var tokenizer = new Tokenizer(source_text, this._options);
      this._tokens = tokenizer.tokenize();
      return source_text;
    };
    Beautifier.prototype.beautify = function() {
      if (this._options.disabled) {
        return this._source_text;
      }
      var sweet_code;
      var source_text = this._reset(this._source_text);
      var eol = this._options.eol;
      if (this._options.eol === "auto") {
        eol = "\n";
        if (source_text && acorn.lineBreak.test(source_text || "")) {
          eol = source_text.match(acorn.lineBreak)[0];
        }
      }
      var current_token = this._tokens.next();
      while (current_token) {
        this.handle_token(current_token);
        this._last_last_text = this._flags.last_token.text;
        this._flags.last_token = current_token;
        current_token = this._tokens.next();
      }
      sweet_code = this._output.get_code(eol);
      return sweet_code;
    };
    Beautifier.prototype.handle_token = function(current_token, preserve_statement_flags) {
      if (current_token.type === TOKEN.START_EXPR) {
        this.handle_start_expr(current_token);
      } else if (current_token.type === TOKEN.END_EXPR) {
        this.handle_end_expr(current_token);
      } else if (current_token.type === TOKEN.START_BLOCK) {
        this.handle_start_block(current_token);
      } else if (current_token.type === TOKEN.END_BLOCK) {
        this.handle_end_block(current_token);
      } else if (current_token.type === TOKEN.WORD) {
        this.handle_word(current_token);
      } else if (current_token.type === TOKEN.RESERVED) {
        this.handle_word(current_token);
      } else if (current_token.type === TOKEN.SEMICOLON) {
        this.handle_semicolon(current_token);
      } else if (current_token.type === TOKEN.STRING) {
        this.handle_string(current_token);
      } else if (current_token.type === TOKEN.EQUALS) {
        this.handle_equals(current_token);
      } else if (current_token.type === TOKEN.OPERATOR) {
        this.handle_operator(current_token);
      } else if (current_token.type === TOKEN.COMMA) {
        this.handle_comma(current_token);
      } else if (current_token.type === TOKEN.BLOCK_COMMENT) {
        this.handle_block_comment(current_token, preserve_statement_flags);
      } else if (current_token.type === TOKEN.COMMENT) {
        this.handle_comment(current_token, preserve_statement_flags);
      } else if (current_token.type === TOKEN.DOT) {
        this.handle_dot(current_token);
      } else if (current_token.type === TOKEN.EOF) {
        this.handle_eof(current_token);
      } else if (current_token.type === TOKEN.UNKNOWN) {
        this.handle_unknown(current_token, preserve_statement_flags);
      } else {
        this.handle_unknown(current_token, preserve_statement_flags);
      }
    };
    Beautifier.prototype.handle_whitespace_and_comments = function(current_token, preserve_statement_flags) {
      var newlines = current_token.newlines;
      var keep_whitespace = this._options.keep_array_indentation && is_array(this._flags.mode);
      if (current_token.comments_before) {
        var comment_token = current_token.comments_before.next();
        while (comment_token) {
          this.handle_whitespace_and_comments(comment_token, preserve_statement_flags);
          this.handle_token(comment_token, preserve_statement_flags);
          comment_token = current_token.comments_before.next();
        }
      }
      if (keep_whitespace) {
        for (var i = 0; i < newlines; i += 1) {
          this.print_newline(i > 0, preserve_statement_flags);
        }
      } else {
        if (this._options.max_preserve_newlines && newlines > this._options.max_preserve_newlines) {
          newlines = this._options.max_preserve_newlines;
        }
        if (this._options.preserve_newlines) {
          if (newlines > 1) {
            this.print_newline(false, preserve_statement_flags);
            for (var j = 1; j < newlines; j += 1) {
              this.print_newline(true, preserve_statement_flags);
            }
          }
        }
      }
    };
    var newline_restricted_tokens = ["async", "break", "continue", "return", "throw", "yield"];
    Beautifier.prototype.allow_wrap_or_preserved_newline = function(current_token, force_linewrap) {
      force_linewrap = force_linewrap === void 0 ? false : force_linewrap;
      if (this._output.just_added_newline()) {
        return;
      }
      var shouldPreserveOrForce = this._options.preserve_newlines && current_token.newlines || force_linewrap;
      var operatorLogicApplies = in_array(this._flags.last_token.text, positionable_operators) || in_array(current_token.text, positionable_operators);
      if (operatorLogicApplies) {
        var shouldPrintOperatorNewline = in_array(this._flags.last_token.text, positionable_operators) && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE) || in_array(current_token.text, positionable_operators);
        shouldPreserveOrForce = shouldPreserveOrForce && shouldPrintOperatorNewline;
      }
      if (shouldPreserveOrForce) {
        this.print_newline(false, true);
      } else if (this._options.wrap_line_length) {
        if (reserved_array(this._flags.last_token, newline_restricted_tokens)) {
          return;
        }
        this._output.set_wrap_point();
      }
    };
    Beautifier.prototype.print_newline = function(force_newline, preserve_statement_flags) {
      if (!preserve_statement_flags) {
        if (this._flags.last_token.text !== ";" && this._flags.last_token.text !== "," && this._flags.last_token.text !== "=" && (this._flags.last_token.type !== TOKEN.OPERATOR || this._flags.last_token.text === "--" || this._flags.last_token.text === "++")) {
          var next_token = this._tokens.peek();
          while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, "else")) && !this._flags.do_block) {
            this.restore_mode();
          }
        }
      }
      if (this._output.add_new_line(force_newline)) {
        this._flags.multiline_frame = true;
      }
    };
    Beautifier.prototype.print_token_line_indentation = function(current_token) {
      if (this._output.just_added_newline()) {
        if (this._options.keep_array_indentation && current_token.newlines && (current_token.text === "[" || is_array(this._flags.mode))) {
          this._output.current_line.set_indent(-1);
          this._output.current_line.push(current_token.whitespace_before);
          this._output.space_before_token = false;
        } else if (this._output.set_indent(this._flags.indentation_level, this._flags.alignment)) {
          this._flags.line_indent_level = this._flags.indentation_level;
        }
      }
    };
    Beautifier.prototype.print_token = function(current_token) {
      if (this._output.raw) {
        this._output.add_raw_token(current_token);
        return;
      }
      if (this._options.comma_first && current_token.previous && current_token.previous.type === TOKEN.COMMA && this._output.just_added_newline()) {
        if (this._output.previous_line.last() === ",") {
          var popped = this._output.previous_line.pop();
          if (this._output.previous_line.is_empty()) {
            this._output.previous_line.push(popped);
            this._output.trim(true);
            this._output.current_line.pop();
            this._output.trim();
          }
          this.print_token_line_indentation(current_token);
          this._output.add_token(",");
          this._output.space_before_token = true;
        }
      }
      this.print_token_line_indentation(current_token);
      this._output.non_breaking_space = true;
      this._output.add_token(current_token.text);
      if (this._output.previous_token_wrapped) {
        this._flags.multiline_frame = true;
      }
    };
    Beautifier.prototype.indent = function() {
      this._flags.indentation_level += 1;
      this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
    };
    Beautifier.prototype.deindent = function() {
      if (this._flags.indentation_level > 0 && (!this._flags.parent || this._flags.indentation_level > this._flags.parent.indentation_level)) {
        this._flags.indentation_level -= 1;
        this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
      }
    };
    Beautifier.prototype.set_mode = function(mode) {
      if (this._flags) {
        this._flag_store.push(this._flags);
        this._previous_flags = this._flags;
      } else {
        this._previous_flags = this.create_flags(null, mode);
      }
      this._flags = this.create_flags(this._previous_flags, mode);
      this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
    };
    Beautifier.prototype.restore_mode = function() {
      if (this._flag_store.length > 0) {
        this._previous_flags = this._flags;
        this._flags = this._flag_store.pop();
        if (this._previous_flags.mode === MODE.Statement) {
          remove_redundant_indentation(this._output, this._previous_flags);
        }
        this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
      }
    };
    Beautifier.prototype.start_of_object_property = function() {
      return this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ["get", "set"]));
    };
    Beautifier.prototype.start_of_statement = function(current_token) {
      var start = false;
      start = start || reserved_array(this._flags.last_token, ["var", "let", "const"]) && current_token.type === TOKEN.WORD;
      start = start || reserved_word(this._flags.last_token, "do");
      start = start || !(this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement) && reserved_array(this._flags.last_token, newline_restricted_tokens) && !current_token.newlines;
      start = start || reserved_word(this._flags.last_token, "else") && !(reserved_word(current_token, "if") && !current_token.comments_before);
      start = start || this._flags.last_token.type === TOKEN.END_EXPR && (this._previous_flags.mode === MODE.ForInitializer || this._previous_flags.mode === MODE.Conditional);
      start = start || this._flags.last_token.type === TOKEN.WORD && this._flags.mode === MODE.BlockStatement && !this._flags.in_case && !(current_token.text === "--" || current_token.text === "++") && this._last_last_text !== "function" && current_token.type !== TOKEN.WORD && current_token.type !== TOKEN.RESERVED;
      start = start || this._flags.mode === MODE.ObjectLiteral && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ["get", "set"]));
      if (start) {
        this.set_mode(MODE.Statement);
        this.indent();
        this.handle_whitespace_and_comments(current_token, true);
        if (!this.start_of_object_property()) {
          this.allow_wrap_or_preserved_newline(
            current_token,
            reserved_array(current_token, ["do", "for", "if", "while"])
          );
        }
        return true;
      }
      return false;
    };
    Beautifier.prototype.handle_start_expr = function(current_token) {
      if (!this.start_of_statement(current_token)) {
        this.handle_whitespace_and_comments(current_token);
      }
      var next_mode = MODE.Expression;
      if (current_token.text === "[") {
        if (this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === ")") {
          if (reserved_array(this._flags.last_token, line_starters)) {
            this._output.space_before_token = true;
          }
          this.print_token(current_token);
          this.set_mode(next_mode);
          this.indent();
          if (this._options.space_in_paren) {
            this._output.space_before_token = true;
          }
          return;
        }
        next_mode = MODE.ArrayLiteral;
        if (is_array(this._flags.mode)) {
          if (this._flags.last_token.text === "[" || this._flags.last_token.text === "," && (this._last_last_text === "]" || this._last_last_text === "}")) {
            if (!this._options.keep_array_indentation) {
              this.print_newline();
            }
          }
        }
        if (!in_array(this._flags.last_token.type, [TOKEN.START_EXPR, TOKEN.END_EXPR, TOKEN.WORD, TOKEN.OPERATOR, TOKEN.DOT])) {
          this._output.space_before_token = true;
        }
      } else {
        if (this._flags.last_token.type === TOKEN.RESERVED) {
          if (this._flags.last_token.text === "for") {
            this._output.space_before_token = this._options.space_before_conditional;
            next_mode = MODE.ForInitializer;
          } else if (in_array(this._flags.last_token.text, ["if", "while", "switch"])) {
            this._output.space_before_token = this._options.space_before_conditional;
            next_mode = MODE.Conditional;
          } else if (in_array(this._flags.last_word, ["await", "async"])) {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.text === "import" && current_token.whitespace_before === "") {
            this._output.space_before_token = false;
          } else if (in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === "catch") {
            this._output.space_before_token = true;
          }
        } else if (this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
          if (!this.start_of_object_property()) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        } else if (this._flags.last_token.type === TOKEN.WORD) {
          this._output.space_before_token = false;
          var peek_back_two = this._tokens.peek(-3);
          if (this._options.space_after_named_function && peek_back_two) {
            var peek_back_three = this._tokens.peek(-4);
            if (reserved_array(peek_back_two, ["async", "function"]) || peek_back_two.text === "*" && reserved_array(peek_back_three, ["async", "function"])) {
              this._output.space_before_token = true;
            } else if (this._flags.mode === MODE.ObjectLiteral) {
              if (peek_back_two.text === "{" || peek_back_two.text === "," || peek_back_two.text === "*" && (peek_back_three.text === "{" || peek_back_three.text === ",")) {
                this._output.space_before_token = true;
              }
            } else if (this._flags.parent && this._flags.parent.class_start_block) {
              this._output.space_before_token = true;
            }
          }
        } else {
          this.allow_wrap_or_preserved_newline(current_token);
        }
        if (this._flags.last_token.type === TOKEN.RESERVED && (this._flags.last_word === "function" || this._flags.last_word === "typeof") || this._flags.last_token.text === "*" && (in_array(this._last_last_text, ["function", "yield"]) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ["{", ","]))) {
          this._output.space_before_token = this._options.space_after_anon_function;
        }
      }
      if (this._flags.last_token.text === ";" || this._flags.last_token.type === TOKEN.START_BLOCK) {
        this.print_newline();
      } else if (this._flags.last_token.type === TOKEN.END_EXPR || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.END_BLOCK || this._flags.last_token.text === "." || this._flags.last_token.type === TOKEN.COMMA) {
        this.allow_wrap_or_preserved_newline(current_token, current_token.newlines);
      }
      this.print_token(current_token);
      this.set_mode(next_mode);
      if (this._options.space_in_paren) {
        this._output.space_before_token = true;
      }
      this.indent();
    };
    Beautifier.prototype.handle_end_expr = function(current_token) {
      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }
      this.handle_whitespace_and_comments(current_token);
      if (this._flags.multiline_frame) {
        this.allow_wrap_or_preserved_newline(
          current_token,
          current_token.text === "]" && is_array(this._flags.mode) && !this._options.keep_array_indentation
        );
      }
      if (this._options.space_in_paren) {
        if (this._flags.last_token.type === TOKEN.START_EXPR && !this._options.space_in_empty_paren) {
          this._output.trim();
          this._output.space_before_token = false;
        } else {
          this._output.space_before_token = true;
        }
      }
      this.deindent();
      this.print_token(current_token);
      this.restore_mode();
      remove_redundant_indentation(this._output, this._previous_flags);
      if (this._flags.do_while && this._previous_flags.mode === MODE.Conditional) {
        this._previous_flags.mode = MODE.Expression;
        this._flags.do_block = false;
        this._flags.do_while = false;
      }
    };
    Beautifier.prototype.handle_start_block = function(current_token) {
      this.handle_whitespace_and_comments(current_token);
      var next_token = this._tokens.peek();
      var second_token = this._tokens.peek(1);
      if (this._flags.last_word === "switch" && this._flags.last_token.type === TOKEN.END_EXPR) {
        this.set_mode(MODE.BlockStatement);
        this._flags.in_case_statement = true;
      } else if (this._flags.case_body) {
        this.set_mode(MODE.BlockStatement);
      } else if (second_token && (in_array(second_token.text, [":", ","]) && in_array(next_token.type, [TOKEN.STRING, TOKEN.WORD, TOKEN.RESERVED]) || in_array(next_token.text, ["get", "set", "..."]) && in_array(second_token.type, [TOKEN.WORD, TOKEN.RESERVED]))) {
        if (in_array(this._last_last_text, ["class", "interface"]) && !in_array(second_token.text, [":", ","])) {
          this.set_mode(MODE.BlockStatement);
        } else {
          this.set_mode(MODE.ObjectLiteral);
        }
      } else if (this._flags.last_token.type === TOKEN.OPERATOR && this._flags.last_token.text === "=>") {
        this.set_mode(MODE.BlockStatement);
      } else if (in_array(this._flags.last_token.type, [TOKEN.EQUALS, TOKEN.START_EXPR, TOKEN.COMMA, TOKEN.OPERATOR]) || reserved_array(this._flags.last_token, ["return", "throw", "import", "default"])) {
        this.set_mode(MODE.ObjectLiteral);
      } else {
        this.set_mode(MODE.BlockStatement);
      }
      if (this._flags.last_token) {
        if (reserved_array(this._flags.last_token.previous, ["class", "extends"])) {
          this._flags.class_start_block = true;
        }
      }
      var empty_braces = !next_token.comments_before && next_token.text === "}";
      var empty_anonymous_function = empty_braces && this._flags.last_word === "function" && this._flags.last_token.type === TOKEN.END_EXPR;
      if (this._options.brace_preserve_inline) {
        var index2 = 0;
        var check_token = null;
        this._flags.inline_frame = true;
        do {
          index2 += 1;
          check_token = this._tokens.peek(index2 - 1);
          if (check_token.newlines) {
            this._flags.inline_frame = false;
            break;
          }
        } while (check_token.type !== TOKEN.EOF && !(check_token.type === TOKEN.END_BLOCK && check_token.opened === current_token));
      }
      if ((this._options.brace_style === "expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
        if (this._flags.last_token.type !== TOKEN.OPERATOR && (empty_anonymous_function || this._flags.last_token.type === TOKEN.EQUALS || reserved_array(this._flags.last_token, special_words) && this._flags.last_token.text !== "else")) {
          this._output.space_before_token = true;
        } else {
          this.print_newline(false, true);
        }
      } else {
        if (is_array(this._previous_flags.mode) && (this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.COMMA)) {
          if (this._flags.last_token.type === TOKEN.COMMA || this._options.space_in_paren) {
            this._output.space_before_token = true;
          }
          if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR && this._flags.inline_frame) {
            this.allow_wrap_or_preserved_newline(current_token);
            this._previous_flags.multiline_frame = this._previous_flags.multiline_frame || this._flags.multiline_frame;
            this._flags.multiline_frame = false;
          }
        }
        if (this._flags.last_token.type !== TOKEN.OPERATOR && this._flags.last_token.type !== TOKEN.START_EXPR) {
          if (this._flags.last_token.type === TOKEN.START_BLOCK && !this._flags.inline_frame) {
            this.print_newline();
          } else {
            this._output.space_before_token = true;
          }
        }
      }
      this.print_token(current_token);
      this.indent();
      if (!empty_braces && !(this._options.brace_preserve_inline && this._flags.inline_frame)) {
        this.print_newline();
      }
    };
    Beautifier.prototype.handle_end_block = function(current_token) {
      this.handle_whitespace_and_comments(current_token);
      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }
      var empty_braces = this._flags.last_token.type === TOKEN.START_BLOCK;
      if (this._flags.inline_frame && !empty_braces) {
        this._output.space_before_token = true;
      } else if (this._options.brace_style === "expand") {
        if (!empty_braces) {
          this.print_newline();
        }
      } else {
        if (!empty_braces) {
          if (is_array(this._flags.mode) && this._options.keep_array_indentation) {
            this._options.keep_array_indentation = false;
            this.print_newline();
            this._options.keep_array_indentation = true;
          } else {
            this.print_newline();
          }
        }
      }
      this.restore_mode();
      this.print_token(current_token);
    };
    Beautifier.prototype.handle_word = function(current_token) {
      if (current_token.type === TOKEN.RESERVED) {
        if (in_array(current_token.text, ["set", "get"]) && this._flags.mode !== MODE.ObjectLiteral) {
          current_token.type = TOKEN.WORD;
        } else if (current_token.text === "import" && in_array(this._tokens.peek().text, ["(", "."])) {
          current_token.type = TOKEN.WORD;
        } else if (in_array(current_token.text, ["as", "from"]) && !this._flags.import_block) {
          current_token.type = TOKEN.WORD;
        } else if (this._flags.mode === MODE.ObjectLiteral) {
          var next_token = this._tokens.peek();
          if (next_token.text === ":") {
            current_token.type = TOKEN.WORD;
          }
        }
      }
      if (this.start_of_statement(current_token)) {
        if (reserved_array(this._flags.last_token, ["var", "let", "const"]) && current_token.type === TOKEN.WORD) {
          this._flags.declaration_statement = true;
        }
      } else if (current_token.newlines && !is_expression(this._flags.mode) && (this._flags.last_token.type !== TOKEN.OPERATOR || (this._flags.last_token.text === "--" || this._flags.last_token.text === "++")) && this._flags.last_token.type !== TOKEN.EQUALS && (this._options.preserve_newlines || !reserved_array(this._flags.last_token, ["var", "let", "const", "set", "get"]))) {
        this.handle_whitespace_and_comments(current_token);
        this.print_newline();
      } else {
        this.handle_whitespace_and_comments(current_token);
      }
      if (this._flags.do_block && !this._flags.do_while) {
        if (reserved_word(current_token, "while")) {
          this._output.space_before_token = true;
          this.print_token(current_token);
          this._output.space_before_token = true;
          this._flags.do_while = true;
          return;
        } else {
          this.print_newline();
          this._flags.do_block = false;
        }
      }
      if (this._flags.if_block) {
        if (!this._flags.else_block && reserved_word(current_token, "else")) {
          this._flags.else_block = true;
        } else {
          while (this._flags.mode === MODE.Statement) {
            this.restore_mode();
          }
          this._flags.if_block = false;
          this._flags.else_block = false;
        }
      }
      if (this._flags.in_case_statement && reserved_array(current_token, ["case", "default"])) {
        this.print_newline();
        if (!this._flags.case_block && (this._flags.case_body || this._options.jslint_happy)) {
          this.deindent();
        }
        this._flags.case_body = false;
        this.print_token(current_token);
        this._flags.in_case = true;
        return;
      }
      if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
        if (!this.start_of_object_property()) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
      }
      if (reserved_word(current_token, "function")) {
        if (in_array(this._flags.last_token.text, ["}", ";"]) || this._output.just_added_newline() && !(in_array(this._flags.last_token.text, ["(", "[", "{", ":", "=", ","]) || this._flags.last_token.type === TOKEN.OPERATOR)) {
          if (!this._output.just_added_blankline() && !current_token.comments_before) {
            this.print_newline();
            this.print_newline(true);
          }
        }
        if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD) {
          if (reserved_array(this._flags.last_token, ["get", "set", "new", "export"]) || reserved_array(this._flags.last_token, newline_restricted_tokens)) {
            this._output.space_before_token = true;
          } else if (reserved_word(this._flags.last_token, "default") && this._last_last_text === "export") {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.text === "declare") {
            this._output.space_before_token = true;
          } else {
            this.print_newline();
          }
        } else if (this._flags.last_token.type === TOKEN.OPERATOR || this._flags.last_token.text === "=") {
          this._output.space_before_token = true;
        } else if (!this._flags.multiline_frame && (is_expression(this._flags.mode) || is_array(this._flags.mode))) {
        } else {
          this.print_newline();
        }
        this.print_token(current_token);
        this._flags.last_word = current_token.text;
        return;
      }
      var prefix = "NONE";
      if (this._flags.last_token.type === TOKEN.END_BLOCK) {
        if (this._previous_flags.inline_frame) {
          prefix = "SPACE";
        } else if (!reserved_array(current_token, ["else", "catch", "finally", "from"])) {
          prefix = "NEWLINE";
        } else {
          if (this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) {
            prefix = "NEWLINE";
          } else {
            prefix = "SPACE";
            this._output.space_before_token = true;
          }
        }
      } else if (this._flags.last_token.type === TOKEN.SEMICOLON && this._flags.mode === MODE.BlockStatement) {
        prefix = "NEWLINE";
      } else if (this._flags.last_token.type === TOKEN.SEMICOLON && is_expression(this._flags.mode)) {
        prefix = "SPACE";
      } else if (this._flags.last_token.type === TOKEN.STRING) {
        prefix = "NEWLINE";
      } else if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === "*" && (in_array(this._last_last_text, ["function", "yield"]) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ["{", ","]))) {
        prefix = "SPACE";
      } else if (this._flags.last_token.type === TOKEN.START_BLOCK) {
        if (this._flags.inline_frame) {
          prefix = "SPACE";
        } else {
          prefix = "NEWLINE";
        }
      } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
        this._output.space_before_token = true;
        prefix = "NEWLINE";
      }
      if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ")") {
        if (this._flags.inline_frame || this._flags.last_token.text === "else" || this._flags.last_token.text === "export") {
          prefix = "SPACE";
        } else {
          prefix = "NEWLINE";
        }
      }
      if (reserved_array(current_token, ["else", "catch", "finally"])) {
        if ((!(this._flags.last_token.type === TOKEN.END_BLOCK && this._previous_flags.mode === MODE.BlockStatement) || this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
          this.print_newline();
        } else {
          this._output.trim(true);
          var line = this._output.current_line;
          if (line.last() !== "}") {
            this.print_newline();
          }
          this._output.space_before_token = true;
        }
      } else if (prefix === "NEWLINE") {
        if (reserved_array(this._flags.last_token, special_words)) {
          this._output.space_before_token = true;
        } else if (this._flags.last_token.text === "declare" && reserved_array(current_token, ["var", "let", "const"])) {
          this._output.space_before_token = true;
        } else if (this._flags.last_token.type !== TOKEN.END_EXPR) {
          if ((this._flags.last_token.type !== TOKEN.START_EXPR || !reserved_array(current_token, ["var", "let", "const"])) && this._flags.last_token.text !== ":") {
            if (reserved_word(current_token, "if") && reserved_word(current_token.previous, "else")) {
              this._output.space_before_token = true;
            } else {
              this.print_newline();
            }
          }
        } else if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ")") {
          this.print_newline();
        }
      } else if (this._flags.multiline_frame && is_array(this._flags.mode) && this._flags.last_token.text === "," && this._last_last_text === "}") {
        this.print_newline();
      } else if (prefix === "SPACE") {
        this._output.space_before_token = true;
      }
      if (current_token.previous && (current_token.previous.type === TOKEN.WORD || current_token.previous.type === TOKEN.RESERVED)) {
        this._output.space_before_token = true;
      }
      this.print_token(current_token);
      this._flags.last_word = current_token.text;
      if (current_token.type === TOKEN.RESERVED) {
        if (current_token.text === "do") {
          this._flags.do_block = true;
        } else if (current_token.text === "if") {
          this._flags.if_block = true;
        } else if (current_token.text === "import") {
          this._flags.import_block = true;
        } else if (this._flags.import_block && reserved_word(current_token, "from")) {
          this._flags.import_block = false;
        }
      }
    };
    Beautifier.prototype.handle_semicolon = function(current_token) {
      if (this.start_of_statement(current_token)) {
        this._output.space_before_token = false;
      } else {
        this.handle_whitespace_and_comments(current_token);
      }
      var next_token = this._tokens.peek();
      while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, "else")) && !this._flags.do_block) {
        this.restore_mode();
      }
      if (this._flags.import_block) {
        this._flags.import_block = false;
      }
      this.print_token(current_token);
    };
    Beautifier.prototype.handle_string = function(current_token) {
      if (current_token.text.startsWith("`") && current_token.newlines === 0 && current_token.whitespace_before === "" && (current_token.previous.text === ")" || this._flags.last_token.type === TOKEN.WORD)) {
      } else if (this.start_of_statement(current_token)) {
        this._output.space_before_token = true;
      } else {
        this.handle_whitespace_and_comments(current_token);
        if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.inline_frame) {
          this._output.space_before_token = true;
        } else if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
          if (!this.start_of_object_property()) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        } else if (current_token.text.startsWith("`") && this._flags.last_token.type === TOKEN.END_EXPR && (current_token.previous.text === "]" || current_token.previous.text === ")") && current_token.newlines === 0) {
          this._output.space_before_token = true;
        } else {
          this.print_newline();
        }
      }
      this.print_token(current_token);
    };
    Beautifier.prototype.handle_equals = function(current_token) {
      if (this.start_of_statement(current_token)) {
      } else {
        this.handle_whitespace_and_comments(current_token);
      }
      if (this._flags.declaration_statement) {
        this._flags.declaration_assignment = true;
      }
      this._output.space_before_token = true;
      this.print_token(current_token);
      this._output.space_before_token = true;
    };
    Beautifier.prototype.handle_comma = function(current_token) {
      this.handle_whitespace_and_comments(current_token, true);
      this.print_token(current_token);
      this._output.space_before_token = true;
      if (this._flags.declaration_statement) {
        if (is_expression(this._flags.parent.mode)) {
          this._flags.declaration_assignment = false;
        }
        if (this._flags.declaration_assignment) {
          this._flags.declaration_assignment = false;
          this.print_newline(false, true);
        } else if (this._options.comma_first) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
      } else if (this._flags.mode === MODE.ObjectLiteral || this._flags.mode === MODE.Statement && this._flags.parent.mode === MODE.ObjectLiteral) {
        if (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }
        if (!this._flags.inline_frame) {
          this.print_newline();
        }
      } else if (this._options.comma_first) {
        this.allow_wrap_or_preserved_newline(current_token);
      }
    };
    Beautifier.prototype.handle_operator = function(current_token) {
      var isGeneratorAsterisk = current_token.text === "*" && (reserved_array(this._flags.last_token, ["function", "yield"]) || in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.COMMA, TOKEN.END_BLOCK, TOKEN.SEMICOLON]));
      var isUnary = in_array(current_token.text, ["-", "+"]) && (in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.START_EXPR, TOKEN.EQUALS, TOKEN.OPERATOR]) || in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === ",");
      if (this.start_of_statement(current_token)) {
      } else {
        var preserve_statement_flags = !isGeneratorAsterisk;
        this.handle_whitespace_and_comments(current_token, preserve_statement_flags);
      }
      if (current_token.text === "*" && this._flags.last_token.type === TOKEN.DOT) {
        this.print_token(current_token);
        return;
      }
      if (current_token.text === "::") {
        this.print_token(current_token);
        return;
      }
      if (this._flags.last_token.type === TOKEN.OPERATOR && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE)) {
        this.allow_wrap_or_preserved_newline(current_token);
      }
      if (current_token.text === ":" && this._flags.in_case) {
        this.print_token(current_token);
        this._flags.in_case = false;
        this._flags.case_body = true;
        if (this._tokens.peek().type !== TOKEN.START_BLOCK) {
          this.indent();
          this.print_newline();
          this._flags.case_block = false;
        } else {
          this._flags.case_block = true;
          this._output.space_before_token = true;
        }
        return;
      }
      var space_before = true;
      var space_after = true;
      var in_ternary = false;
      if (current_token.text === ":") {
        if (this._flags.ternary_depth === 0) {
          space_before = false;
        } else {
          this._flags.ternary_depth -= 1;
          in_ternary = true;
        }
      } else if (current_token.text === "?") {
        this._flags.ternary_depth += 1;
      }
      if (!isUnary && !isGeneratorAsterisk && this._options.preserve_newlines && in_array(current_token.text, positionable_operators)) {
        var isColon = current_token.text === ":";
        var isTernaryColon = isColon && in_ternary;
        var isOtherColon = isColon && !in_ternary;
        switch (this._options.operator_position) {
          case OPERATOR_POSITION.before_newline:
            this._output.space_before_token = !isOtherColon;
            this.print_token(current_token);
            if (!isColon || isTernaryColon) {
              this.allow_wrap_or_preserved_newline(current_token);
            }
            this._output.space_before_token = true;
            return;
          case OPERATOR_POSITION.after_newline:
            this._output.space_before_token = true;
            if (!isColon || isTernaryColon) {
              if (this._tokens.peek().newlines) {
                this.print_newline(false, true);
              } else {
                this.allow_wrap_or_preserved_newline(current_token);
              }
            } else {
              this._output.space_before_token = false;
            }
            this.print_token(current_token);
            this._output.space_before_token = true;
            return;
          case OPERATOR_POSITION.preserve_newline:
            if (!isOtherColon) {
              this.allow_wrap_or_preserved_newline(current_token);
            }
            space_before = !(this._output.just_added_newline() || isOtherColon);
            this._output.space_before_token = space_before;
            this.print_token(current_token);
            this._output.space_before_token = true;
            return;
        }
      }
      if (isGeneratorAsterisk) {
        this.allow_wrap_or_preserved_newline(current_token);
        space_before = false;
        var next_token = this._tokens.peek();
        space_after = next_token && in_array(next_token.type, [TOKEN.WORD, TOKEN.RESERVED]);
      } else if (current_token.text === "...") {
        this.allow_wrap_or_preserved_newline(current_token);
        space_before = this._flags.last_token.type === TOKEN.START_BLOCK;
        space_after = false;
      } else if (in_array(current_token.text, ["--", "++", "!", "~"]) || isUnary) {
        if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
        space_before = false;
        space_after = false;
        if (current_token.newlines && (current_token.text === "--" || current_token.text === "++" || current_token.text === "~")) {
          var new_line_needed = reserved_array(this._flags.last_token, special_words) && current_token.newlines;
          if (new_line_needed && (this._previous_flags.if_block || this._previous_flags.else_block)) {
            this.restore_mode();
          }
          this.print_newline(new_line_needed, true);
        }
        if (this._flags.last_token.text === ";" && is_expression(this._flags.mode)) {
          space_before = true;
        }
        if (this._flags.last_token.type === TOKEN.RESERVED) {
          space_before = true;
        } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
          space_before = !(this._flags.last_token.text === "]" && (current_token.text === "--" || current_token.text === "++"));
        } else if (this._flags.last_token.type === TOKEN.OPERATOR) {
          space_before = in_array(current_token.text, ["--", "-", "++", "+"]) && in_array(this._flags.last_token.text, ["--", "-", "++", "+"]);
          if (in_array(current_token.text, ["+", "-"]) && in_array(this._flags.last_token.text, ["--", "++"])) {
            space_after = true;
          }
        }
        if ((this._flags.mode === MODE.BlockStatement && !this._flags.inline_frame || this._flags.mode === MODE.Statement) && (this._flags.last_token.text === "{" || this._flags.last_token.text === ";")) {
          this.print_newline();
        }
      }
      this._output.space_before_token = this._output.space_before_token || space_before;
      this.print_token(current_token);
      this._output.space_before_token = space_after;
    };
    Beautifier.prototype.handle_block_comment = function(current_token, preserve_statement_flags) {
      if (this._output.raw) {
        this._output.add_raw_token(current_token);
        if (current_token.directives && current_token.directives.preserve === "end") {
          this._output.raw = this._options.test_output_raw;
        }
        return;
      }
      if (current_token.directives) {
        this.print_newline(false, preserve_statement_flags);
        this.print_token(current_token);
        if (current_token.directives.preserve === "start") {
          this._output.raw = true;
        }
        this.print_newline(false, true);
        return;
      }
      if (!acorn.newline.test(current_token.text) && !current_token.newlines) {
        this._output.space_before_token = true;
        this.print_token(current_token);
        this._output.space_before_token = true;
        return;
      } else {
        this.print_block_commment(current_token, preserve_statement_flags);
      }
    };
    Beautifier.prototype.print_block_commment = function(current_token, preserve_statement_flags) {
      var lines = split_linebreaks(current_token.text);
      var j;
      var javadoc = false;
      var starless = false;
      var lastIndent = current_token.whitespace_before;
      var lastIndentLength = lastIndent.length;
      this.print_newline(false, preserve_statement_flags);
      this.print_token_line_indentation(current_token);
      this._output.add_token(lines[0]);
      this.print_newline(false, preserve_statement_flags);
      if (lines.length > 1) {
        lines = lines.slice(1);
        javadoc = all_lines_start_with(lines, "*");
        starless = each_line_matches_indent(lines, lastIndent);
        if (javadoc) {
          this._flags.alignment = 1;
        }
        for (j = 0; j < lines.length; j++) {
          if (javadoc) {
            this.print_token_line_indentation(current_token);
            this._output.add_token(ltrim(lines[j]));
          } else if (starless && lines[j]) {
            this.print_token_line_indentation(current_token);
            this._output.add_token(lines[j].substring(lastIndentLength));
          } else {
            this._output.current_line.set_indent(-1);
            this._output.add_token(lines[j]);
          }
          this.print_newline(false, preserve_statement_flags);
        }
        this._flags.alignment = 0;
      }
    };
    Beautifier.prototype.handle_comment = function(current_token, preserve_statement_flags) {
      if (current_token.newlines) {
        this.print_newline(false, preserve_statement_flags);
      } else {
        this._output.trim(true);
      }
      this._output.space_before_token = true;
      this.print_token(current_token);
      this.print_newline(false, preserve_statement_flags);
    };
    Beautifier.prototype.handle_dot = function(current_token) {
      if (this.start_of_statement(current_token)) {
      } else {
        this.handle_whitespace_and_comments(current_token, true);
      }
      if (this._flags.last_token.text.match("^[0-9]+$")) {
        this._output.space_before_token = true;
      }
      if (reserved_array(this._flags.last_token, special_words)) {
        this._output.space_before_token = false;
      } else {
        this.allow_wrap_or_preserved_newline(
          current_token,
          this._flags.last_token.text === ")" && this._options.break_chained_methods
        );
      }
      if (this._options.unindent_chained_methods && this._output.just_added_newline()) {
        this.deindent();
      }
      this.print_token(current_token);
    };
    Beautifier.prototype.handle_unknown = function(current_token, preserve_statement_flags) {
      this.print_token(current_token);
      if (current_token.text[current_token.text.length - 1] === "\n") {
        this.print_newline(false, preserve_statement_flags);
      }
    };
    Beautifier.prototype.handle_eof = function(current_token) {
      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }
      this.handle_whitespace_and_comments(current_token);
    };
    module2.exports.Beautifier = Beautifier;
  }
});

// node_modules/js-beautify/js/src/javascript/index.js
var require_javascript = __commonJS({
  "node_modules/js-beautify/js/src/javascript/index.js"(exports, module2) {
    "use strict";
    var Beautifier = require_beautifier().Beautifier;
    var Options = require_options2().Options;
    function js_beautify(js_source_text, options) {
      var beautifier = new Beautifier(js_source_text, options);
      return beautifier.beautify();
    }
    module2.exports = js_beautify;
    module2.exports.defaultOptions = function() {
      return new Options();
    };
  }
});

// node_modules/js-beautify/js/src/css/options.js
var require_options3 = __commonJS({
  "node_modules/js-beautify/js/src/css/options.js"(exports, module2) {
    "use strict";
    var BaseOptions = require_options().Options;
    function Options(options) {
      BaseOptions.call(this, options, "css");
      this.selector_separator_newline = this._get_boolean("selector_separator_newline", true);
      this.newline_between_rules = this._get_boolean("newline_between_rules", true);
      var space_around_selector_separator = this._get_boolean("space_around_selector_separator");
      this.space_around_combinator = this._get_boolean("space_around_combinator") || space_around_selector_separator;
      var brace_style_split = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
      this.brace_style = "collapse";
      for (var bs = 0; bs < brace_style_split.length; bs++) {
        if (brace_style_split[bs] !== "expand") {
          this.brace_style = "collapse";
        } else {
          this.brace_style = brace_style_split[bs];
        }
      }
    }
    Options.prototype = new BaseOptions();
    module2.exports.Options = Options;
  }
});

// node_modules/js-beautify/js/src/css/beautifier.js
var require_beautifier2 = __commonJS({
  "node_modules/js-beautify/js/src/css/beautifier.js"(exports, module2) {
    "use strict";
    var Options = require_options3().Options;
    var Output = require_output().Output;
    var InputScanner = require_inputscanner().InputScanner;
    var Directives = require_directives().Directives;
    var directives_core = new Directives(/\/\*/, /\*\//);
    var lineBreak = /\r\n|[\r\n]/;
    var allLineBreaks = /\r\n|[\r\n]/g;
    var whitespaceChar = /\s/;
    var whitespacePattern = /(?:\s|\n)+/g;
    var block_comment_pattern = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g;
    var comment_pattern = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
    function Beautifier(source_text, options) {
      this._source_text = source_text || "";
      this._options = new Options(options);
      this._ch = null;
      this._input = null;
      this.NESTED_AT_RULE = {
        "@page": true,
        "@font-face": true,
        "@keyframes": true,
        // also in CONDITIONAL_GROUP_RULE below
        "@media": true,
        "@supports": true,
        "@document": true
      };
      this.CONDITIONAL_GROUP_RULE = {
        "@media": true,
        "@supports": true,
        "@document": true
      };
      this.NON_SEMICOLON_NEWLINE_PROPERTY = [
        "grid-template-areas",
        "grid-template"
      ];
    }
    Beautifier.prototype.eatString = function(endChars) {
      var result = "";
      this._ch = this._input.next();
      while (this._ch) {
        result += this._ch;
        if (this._ch === "\\") {
          result += this._input.next();
        } else if (endChars.indexOf(this._ch) !== -1 || this._ch === "\n") {
          break;
        }
        this._ch = this._input.next();
      }
      return result;
    };
    Beautifier.prototype.eatWhitespace = function(allowAtLeastOneNewLine) {
      var result = whitespaceChar.test(this._input.peek());
      var newline_count = 0;
      while (whitespaceChar.test(this._input.peek())) {
        this._ch = this._input.next();
        if (allowAtLeastOneNewLine && this._ch === "\n") {
          if (newline_count === 0 || newline_count < this._options.max_preserve_newlines) {
            newline_count++;
            this._output.add_new_line(true);
          }
        }
      }
      return result;
    };
    Beautifier.prototype.foundNestedPseudoClass = function() {
      var openParen = 0;
      var i = 1;
      var ch = this._input.peek(i);
      while (ch) {
        if (ch === "{") {
          return true;
        } else if (ch === "(") {
          openParen += 1;
        } else if (ch === ")") {
          if (openParen === 0) {
            return false;
          }
          openParen -= 1;
        } else if (ch === ";" || ch === "}") {
          return false;
        }
        i++;
        ch = this._input.peek(i);
      }
      return false;
    };
    Beautifier.prototype.print_string = function(output_string) {
      this._output.set_indent(this._indentLevel);
      this._output.non_breaking_space = true;
      this._output.add_token(output_string);
    };
    Beautifier.prototype.preserveSingleSpace = function(isAfterSpace) {
      if (isAfterSpace) {
        this._output.space_before_token = true;
      }
    };
    Beautifier.prototype.indent = function() {
      this._indentLevel++;
    };
    Beautifier.prototype.outdent = function() {
      if (this._indentLevel > 0) {
        this._indentLevel--;
      }
    };
    Beautifier.prototype.beautify = function() {
      if (this._options.disabled) {
        return this._source_text;
      }
      var source_text = this._source_text;
      var eol = this._options.eol;
      if (eol === "auto") {
        eol = "\n";
        if (source_text && lineBreak.test(source_text || "")) {
          eol = source_text.match(lineBreak)[0];
        }
      }
      source_text = source_text.replace(allLineBreaks, "\n");
      var baseIndentString = source_text.match(/^[\t ]*/)[0];
      this._output = new Output(this._options, baseIndentString);
      this._input = new InputScanner(source_text);
      this._indentLevel = 0;
      this._nestedLevel = 0;
      this._ch = null;
      var parenLevel = 0;
      var insideRule = false;
      var insidePropertyValue = false;
      var enteringConditionalGroup = false;
      var insideAtExtend = false;
      var insideAtImport = false;
      var insideScssMap = false;
      var topCharacter = this._ch;
      var insideNonSemiColonValues = false;
      var whitespace;
      var isAfterSpace;
      var previous_ch;
      while (true) {
        whitespace = this._input.read(whitespacePattern);
        isAfterSpace = whitespace !== "";
        previous_ch = topCharacter;
        this._ch = this._input.next();
        if (this._ch === "\\" && this._input.hasNext()) {
          this._ch += this._input.next();
        }
        topCharacter = this._ch;
        if (!this._ch) {
          break;
        } else if (this._ch === "/" && this._input.peek() === "*") {
          this._output.add_new_line();
          this._input.back();
          var comment = this._input.read(block_comment_pattern);
          var directives = directives_core.get_directives(comment);
          if (directives && directives.ignore === "start") {
            comment += directives_core.readIgnored(this._input);
          }
          this.print_string(comment);
          this.eatWhitespace(true);
          this._output.add_new_line();
        } else if (this._ch === "/" && this._input.peek() === "/") {
          this._output.space_before_token = true;
          this._input.back();
          this.print_string(this._input.read(comment_pattern));
          this.eatWhitespace(true);
        } else if (this._ch === "@" || this._ch === "$") {
          this.preserveSingleSpace(isAfterSpace);
          if (this._input.peek() === "{") {
            this.print_string(this._ch + this.eatString("}"));
          } else {
            this.print_string(this._ch);
            var variableOrRule = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
            if (variableOrRule.match(/[ :]$/)) {
              variableOrRule = this.eatString(": ").replace(/\s$/, "");
              this.print_string(variableOrRule);
              this._output.space_before_token = true;
            }
            variableOrRule = variableOrRule.replace(/\s$/, "");
            if (variableOrRule === "extend") {
              insideAtExtend = true;
            } else if (variableOrRule === "import") {
              insideAtImport = true;
            }
            if (variableOrRule in this.NESTED_AT_RULE) {
              this._nestedLevel += 1;
              if (variableOrRule in this.CONDITIONAL_GROUP_RULE) {
                enteringConditionalGroup = true;
              }
            } else if (!insideRule && parenLevel === 0 && variableOrRule.indexOf(":") !== -1) {
              insidePropertyValue = true;
              this.indent();
            }
          }
        } else if (this._ch === "#" && this._input.peek() === "{") {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch + this.eatString("}"));
        } else if (this._ch === "{") {
          if (insidePropertyValue) {
            insidePropertyValue = false;
            this.outdent();
          }
          if (enteringConditionalGroup) {
            enteringConditionalGroup = false;
            insideRule = this._indentLevel >= this._nestedLevel;
          } else {
            insideRule = this._indentLevel >= this._nestedLevel - 1;
          }
          if (this._options.newline_between_rules && insideRule) {
            if (this._output.previous_line && this._output.previous_line.item(-1) !== "{") {
              this._output.ensure_empty_line_above("/", ",");
            }
          }
          this._output.space_before_token = true;
          if (this._options.brace_style === "expand") {
            this._output.add_new_line();
            this.print_string(this._ch);
            this.indent();
            this._output.set_indent(this._indentLevel);
          } else {
            if (previous_ch === "(") {
              this._output.space_before_token = false;
            } else if (previous_ch !== ",") {
              this.indent();
            }
            this.print_string(this._ch);
          }
          this.eatWhitespace(true);
          this._output.add_new_line();
        } else if (this._ch === "}") {
          this.outdent();
          this._output.add_new_line();
          if (previous_ch === "{") {
            this._output.trim(true);
          }
          insideAtImport = false;
          insideAtExtend = false;
          if (insidePropertyValue) {
            this.outdent();
            insidePropertyValue = false;
          }
          this.print_string(this._ch);
          insideRule = false;
          if (this._nestedLevel) {
            this._nestedLevel--;
          }
          this.eatWhitespace(true);
          this._output.add_new_line();
          if (this._options.newline_between_rules && !this._output.just_added_blankline()) {
            if (this._input.peek() !== "}") {
              this._output.add_new_line(true);
            }
          }
          if (this._input.peek() === ")") {
            this._output.trim(true);
            if (this._options.brace_style === "expand") {
              this._output.add_new_line(true);
            }
          }
        } else if (this._ch === ":") {
          for (var i = 0; i < this.NON_SEMICOLON_NEWLINE_PROPERTY.length; i++) {
            if (this._input.lookBack(this.NON_SEMICOLON_NEWLINE_PROPERTY[i])) {
              insideNonSemiColonValues = true;
              break;
            }
          }
          if ((insideRule || enteringConditionalGroup) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !insideAtExtend && parenLevel === 0) {
            this.print_string(":");
            if (!insidePropertyValue) {
              insidePropertyValue = true;
              this._output.space_before_token = true;
              this.eatWhitespace(true);
              this.indent();
            }
          } else {
            if (this._input.lookBack(" ")) {
              this._output.space_before_token = true;
            }
            if (this._input.peek() === ":") {
              this._ch = this._input.next();
              this.print_string("::");
            } else {
              this.print_string(":");
            }
          }
        } else if (this._ch === '"' || this._ch === "'") {
          var preserveQuoteSpace = previous_ch === '"' || previous_ch === "'";
          this.preserveSingleSpace(preserveQuoteSpace || isAfterSpace);
          this.print_string(this._ch + this.eatString(this._ch));
          this.eatWhitespace(true);
        } else if (this._ch === ";") {
          insideNonSemiColonValues = false;
          if (parenLevel === 0) {
            if (insidePropertyValue) {
              this.outdent();
              insidePropertyValue = false;
            }
            insideAtExtend = false;
            insideAtImport = false;
            this.print_string(this._ch);
            this.eatWhitespace(true);
            if (this._input.peek() !== "/") {
              this._output.add_new_line();
            }
          } else {
            this.print_string(this._ch);
            this.eatWhitespace(true);
            this._output.space_before_token = true;
          }
        } else if (this._ch === "(") {
          if (this._input.lookBack("url")) {
            this.print_string(this._ch);
            this.eatWhitespace();
            parenLevel++;
            this.indent();
            this._ch = this._input.next();
            if (this._ch === ")" || this._ch === '"' || this._ch === "'") {
              this._input.back();
            } else if (this._ch) {
              this.print_string(this._ch + this.eatString(")"));
              if (parenLevel) {
                parenLevel--;
                this.outdent();
              }
            }
          } else {
            var space_needed = false;
            if (this._input.lookBack("with")) {
              space_needed = true;
            }
            this.preserveSingleSpace(isAfterSpace || space_needed);
            this.print_string(this._ch);
            if (insidePropertyValue && previous_ch === "$" && this._options.selector_separator_newline) {
              this._output.add_new_line();
              insideScssMap = true;
            } else {
              this.eatWhitespace();
              parenLevel++;
              this.indent();
            }
          }
        } else if (this._ch === ")") {
          if (parenLevel) {
            parenLevel--;
            this.outdent();
          }
          if (insideScssMap && this._input.peek() === ";" && this._options.selector_separator_newline) {
            insideScssMap = false;
            this.outdent();
            this._output.add_new_line();
          }
          this.print_string(this._ch);
        } else if (this._ch === ",") {
          this.print_string(this._ch);
          this.eatWhitespace(true);
          if (this._options.selector_separator_newline && (!insidePropertyValue || insideScssMap) && parenLevel === 0 && !insideAtImport && !insideAtExtend) {
            this._output.add_new_line();
          } else {
            this._output.space_before_token = true;
          }
        } else if ((this._ch === ">" || this._ch === "+" || this._ch === "~") && !insidePropertyValue && parenLevel === 0) {
          if (this._options.space_around_combinator) {
            this._output.space_before_token = true;
            this.print_string(this._ch);
            this._output.space_before_token = true;
          } else {
            this.print_string(this._ch);
            this.eatWhitespace();
            if (this._ch && whitespaceChar.test(this._ch)) {
              this._ch = "";
            }
          }
        } else if (this._ch === "]") {
          this.print_string(this._ch);
        } else if (this._ch === "[") {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch);
        } else if (this._ch === "=") {
          this.eatWhitespace();
          this.print_string("=");
          if (whitespaceChar.test(this._ch)) {
            this._ch = "";
          }
        } else if (this._ch === "!" && !this._input.lookBack("\\")) {
          this._output.space_before_token = true;
          this.print_string(this._ch);
        } else {
          var preserveAfterSpace = previous_ch === '"' || previous_ch === "'";
          this.preserveSingleSpace(preserveAfterSpace || isAfterSpace);
          this.print_string(this._ch);
          if (!this._output.just_added_newline() && this._input.peek() === "\n" && insideNonSemiColonValues) {
            this._output.add_new_line();
          }
        }
      }
      var sweetCode = this._output.get_code(eol);
      return sweetCode;
    };
    module2.exports.Beautifier = Beautifier;
  }
});

// node_modules/js-beautify/js/src/css/index.js
var require_css = __commonJS({
  "node_modules/js-beautify/js/src/css/index.js"(exports, module2) {
    "use strict";
    var Beautifier = require_beautifier2().Beautifier;
    var Options = require_options3().Options;
    function css_beautify(source_text, options) {
      var beautifier = new Beautifier(source_text, options);
      return beautifier.beautify();
    }
    module2.exports = css_beautify;
    module2.exports.defaultOptions = function() {
      return new Options();
    };
  }
});

// node_modules/js-beautify/js/src/html/options.js
var require_options4 = __commonJS({
  "node_modules/js-beautify/js/src/html/options.js"(exports, module2) {
    "use strict";
    var BaseOptions = require_options().Options;
    function Options(options) {
      BaseOptions.call(this, options, "html");
      if (this.templating.length === 1 && this.templating[0] === "auto") {
        this.templating = ["django", "erb", "handlebars", "php"];
      }
      this.indent_inner_html = this._get_boolean("indent_inner_html");
      this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", true);
      this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", true);
      this.indent_handlebars = this._get_boolean("indent_handlebars", true);
      this.wrap_attributes = this._get_selection(
        "wrap_attributes",
        ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"]
      );
      this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size);
      this.extra_liners = this._get_array("extra_liners", ["head", "body", "/html"]);
      this.inline = this._get_array("inline", [
        "a",
        "abbr",
        "area",
        "audio",
        "b",
        "bdi",
        "bdo",
        "br",
        "button",
        "canvas",
        "cite",
        "code",
        "data",
        "datalist",
        "del",
        "dfn",
        "em",
        "embed",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "keygen",
        "label",
        "map",
        "mark",
        "math",
        "meter",
        "noscript",
        "object",
        "output",
        "progress",
        "q",
        "ruby",
        "s",
        "samp",
        /* 'script', */
        "select",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "svg",
        "template",
        "textarea",
        "time",
        "u",
        "var",
        "video",
        "wbr",
        "text",
        // obsolete inline tags
        "acronym",
        "big",
        "strike",
        "tt"
      ]);
      this.void_elements = this._get_array("void_elements", [
        // HTLM void elements - aka self-closing tags - aka singletons
        // https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "keygen",
        "link",
        "menuitem",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
        // NOTE: Optional tags are too complex for a simple list
        // they are hard coded in _do_optional_end_element
        // Doctype and xml elements
        "!doctype",
        "?xml",
        // obsolete tags
        // basefont: https://www.computerhope.com/jargon/h/html-basefont-tag.htm
        // isndex: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/isindex
        "basefont",
        "isindex"
      ]);
      this.unformatted = this._get_array("unformatted", []);
      this.content_unformatted = this._get_array("content_unformatted", [
        "pre",
        "textarea"
      ]);
      this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter");
      this.indent_scripts = this._get_selection("indent_scripts", ["normal", "keep", "separate"]);
    }
    Options.prototype = new BaseOptions();
    module2.exports.Options = Options;
  }
});

// node_modules/js-beautify/js/src/html/tokenizer.js
var require_tokenizer3 = __commonJS({
  "node_modules/js-beautify/js/src/html/tokenizer.js"(exports, module2) {
    "use strict";
    var BaseTokenizer = require_tokenizer().Tokenizer;
    var BASETOKEN = require_tokenizer().TOKEN;
    var Directives = require_directives().Directives;
    var TemplatablePattern = require_templatablepattern().TemplatablePattern;
    var Pattern = require_pattern().Pattern;
    var TOKEN = {
      TAG_OPEN: "TK_TAG_OPEN",
      TAG_CLOSE: "TK_TAG_CLOSE",
      ATTRIBUTE: "TK_ATTRIBUTE",
      EQUALS: "TK_EQUALS",
      VALUE: "TK_VALUE",
      COMMENT: "TK_COMMENT",
      TEXT: "TK_TEXT",
      UNKNOWN: "TK_UNKNOWN",
      START: BASETOKEN.START,
      RAW: BASETOKEN.RAW,
      EOF: BASETOKEN.EOF
    };
    var directives_core = new Directives(/<\!--/, /-->/);
    var Tokenizer = function(input_string, options) {
      BaseTokenizer.call(this, input_string, options);
      this._current_tag_name = "";
      var templatable_reader = new TemplatablePattern(this._input).read_options(this._options);
      var pattern_reader = new Pattern(this._input);
      this.__patterns = {
        word: templatable_reader.until(/[\n\r\t <]/),
        single_quote: templatable_reader.until_after(/'/),
        double_quote: templatable_reader.until_after(/"/),
        attribute: templatable_reader.until(/[\n\r\t =>]|\/>/),
        element_name: templatable_reader.until(/[\n\r\t >\/]/),
        handlebars_comment: pattern_reader.starting_with(/{{!--/).until_after(/--}}/),
        handlebars: pattern_reader.starting_with(/{{/).until_after(/}}/),
        handlebars_open: pattern_reader.until(/[\n\r\t }]/),
        handlebars_raw_close: pattern_reader.until(/}}/),
        comment: pattern_reader.starting_with(/<!--/).until_after(/-->/),
        cdata: pattern_reader.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
        // https://en.wikipedia.org/wiki/Conditional_comment
        conditional_comment: pattern_reader.starting_with(/<!\[/).until_after(/]>/),
        processing: pattern_reader.starting_with(/<\?/).until_after(/\?>/)
      };
      if (this._options.indent_handlebars) {
        this.__patterns.word = this.__patterns.word.exclude("handlebars");
      }
      this._unformatted_content_delimiter = null;
      if (this._options.unformatted_content_delimiter) {
        var literal_regexp = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
        this.__patterns.unformatted_content_delimiter = pattern_reader.matching(literal_regexp).until_after(literal_regexp);
      }
    };
    Tokenizer.prototype = new BaseTokenizer();
    Tokenizer.prototype._is_comment = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_opening = function(current_token) {
      return current_token.type === TOKEN.TAG_OPEN;
    };
    Tokenizer.prototype._is_closing = function(current_token, open_token) {
      return current_token.type === TOKEN.TAG_CLOSE && (open_token && ((current_token.text === ">" || current_token.text === "/>") && open_token.text[0] === "<" || current_token.text === "}}" && open_token.text[0] === "{" && open_token.text[1] === "{"));
    };
    Tokenizer.prototype._reset = function() {
      this._current_tag_name = "";
    };
    Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
      var token = null;
      this._readWhitespace();
      var c = this._input.peek();
      if (c === null) {
        return this._create_token(TOKEN.EOF, "");
      }
      token = token || this._read_open_handlebars(c, open_token);
      token = token || this._read_attribute(c, previous_token, open_token);
      token = token || this._read_close(c, open_token);
      token = token || this._read_raw_content(c, previous_token, open_token);
      token = token || this._read_content_word(c);
      token = token || this._read_comment_or_cdata(c);
      token = token || this._read_processing(c);
      token = token || this._read_open(c, open_token);
      token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
      return token;
    };
    Tokenizer.prototype._read_comment_or_cdata = function(c) {
      var token = null;
      var resulting_string = null;
      var directives = null;
      if (c === "<") {
        var peek1 = this._input.peek(1);
        if (peek1 === "!") {
          resulting_string = this.__patterns.comment.read();
          if (resulting_string) {
            directives = directives_core.get_directives(resulting_string);
            if (directives && directives.ignore === "start") {
              resulting_string += directives_core.readIgnored(this._input);
            }
          } else {
            resulting_string = this.__patterns.cdata.read();
          }
        }
        if (resulting_string) {
          token = this._create_token(TOKEN.COMMENT, resulting_string);
          token.directives = directives;
        }
      }
      return token;
    };
    Tokenizer.prototype._read_processing = function(c) {
      var token = null;
      var resulting_string = null;
      var directives = null;
      if (c === "<") {
        var peek1 = this._input.peek(1);
        if (peek1 === "!" || peek1 === "?") {
          resulting_string = this.__patterns.conditional_comment.read();
          resulting_string = resulting_string || this.__patterns.processing.read();
        }
        if (resulting_string) {
          token = this._create_token(TOKEN.COMMENT, resulting_string);
          token.directives = directives;
        }
      }
      return token;
    };
    Tokenizer.prototype._read_open = function(c, open_token) {
      var resulting_string = null;
      var token = null;
      if (!open_token) {
        if (c === "<") {
          resulting_string = this._input.next();
          if (this._input.peek() === "/") {
            resulting_string += this._input.next();
          }
          resulting_string += this.__patterns.element_name.read();
          token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
        }
      }
      return token;
    };
    Tokenizer.prototype._read_open_handlebars = function(c, open_token) {
      var resulting_string = null;
      var token = null;
      if (!open_token) {
        if (this._options.indent_handlebars && c === "{" && this._input.peek(1) === "{") {
          if (this._input.peek(2) === "!") {
            resulting_string = this.__patterns.handlebars_comment.read();
            resulting_string = resulting_string || this.__patterns.handlebars.read();
            token = this._create_token(TOKEN.COMMENT, resulting_string);
          } else {
            resulting_string = this.__patterns.handlebars_open.read();
            token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
          }
        }
      }
      return token;
    };
    Tokenizer.prototype._read_close = function(c, open_token) {
      var resulting_string = null;
      var token = null;
      if (open_token) {
        if (open_token.text[0] === "<" && (c === ">" || c === "/" && this._input.peek(1) === ">")) {
          resulting_string = this._input.next();
          if (c === "/") {
            resulting_string += this._input.next();
          }
          token = this._create_token(TOKEN.TAG_CLOSE, resulting_string);
        } else if (open_token.text[0] === "{" && c === "}" && this._input.peek(1) === "}") {
          this._input.next();
          this._input.next();
          token = this._create_token(TOKEN.TAG_CLOSE, "}}");
        }
      }
      return token;
    };
    Tokenizer.prototype._read_attribute = function(c, previous_token, open_token) {
      var token = null;
      var resulting_string = "";
      if (open_token && open_token.text[0] === "<") {
        if (c === "=") {
          token = this._create_token(TOKEN.EQUALS, this._input.next());
        } else if (c === '"' || c === "'") {
          var content = this._input.next();
          if (c === '"') {
            content += this.__patterns.double_quote.read();
          } else {
            content += this.__patterns.single_quote.read();
          }
          token = this._create_token(TOKEN.VALUE, content);
        } else {
          resulting_string = this.__patterns.attribute.read();
          if (resulting_string) {
            if (previous_token.type === TOKEN.EQUALS) {
              token = this._create_token(TOKEN.VALUE, resulting_string);
            } else {
              token = this._create_token(TOKEN.ATTRIBUTE, resulting_string);
            }
          }
        }
      }
      return token;
    };
    Tokenizer.prototype._is_content_unformatted = function(tag_name) {
      return this._options.void_elements.indexOf(tag_name) === -1 && (this._options.content_unformatted.indexOf(tag_name) !== -1 || this._options.unformatted.indexOf(tag_name) !== -1);
    };
    Tokenizer.prototype._read_raw_content = function(c, previous_token, open_token) {
      var resulting_string = "";
      if (open_token && open_token.text[0] === "{") {
        resulting_string = this.__patterns.handlebars_raw_close.read();
      } else if (previous_token.type === TOKEN.TAG_CLOSE && previous_token.opened.text[0] === "<" && previous_token.text[0] !== "/") {
        var tag_name = previous_token.opened.text.substr(1).toLowerCase();
        if (tag_name === "script" || tag_name === "style") {
          var token = this._read_comment_or_cdata(c);
          if (token) {
            token.type = TOKEN.TEXT;
            return token;
          }
          resulting_string = this._input.readUntil(new RegExp("</" + tag_name + "[\\n\\r\\t ]*?>", "ig"));
        } else if (this._is_content_unformatted(tag_name)) {
          resulting_string = this._input.readUntil(new RegExp("</" + tag_name + "[\\n\\r\\t ]*?>", "ig"));
        }
      }
      if (resulting_string) {
        return this._create_token(TOKEN.TEXT, resulting_string);
      }
      return null;
    };
    Tokenizer.prototype._read_content_word = function(c) {
      var resulting_string = "";
      if (this._options.unformatted_content_delimiter) {
        if (c === this._options.unformatted_content_delimiter[0]) {
          resulting_string = this.__patterns.unformatted_content_delimiter.read();
        }
      }
      if (!resulting_string) {
        resulting_string = this.__patterns.word.read();
      }
      if (resulting_string) {
        return this._create_token(TOKEN.TEXT, resulting_string);
      }
    };
    module2.exports.Tokenizer = Tokenizer;
    module2.exports.TOKEN = TOKEN;
  }
});

// node_modules/js-beautify/js/src/html/beautifier.js
var require_beautifier3 = __commonJS({
  "node_modules/js-beautify/js/src/html/beautifier.js"(exports, module2) {
    "use strict";
    var Options = require_options4().Options;
    var Output = require_output().Output;
    var Tokenizer = require_tokenizer3().Tokenizer;
    var TOKEN = require_tokenizer3().TOKEN;
    var lineBreak = /\r\n|[\r\n]/;
    var allLineBreaks = /\r\n|[\r\n]/g;
    var Printer = function(options, base_indent_string) {
      this.indent_level = 0;
      this.alignment_size = 0;
      this.max_preserve_newlines = options.max_preserve_newlines;
      this.preserve_newlines = options.preserve_newlines;
      this._output = new Output(options, base_indent_string);
    };
    Printer.prototype.current_line_has_match = function(pattern) {
      return this._output.current_line.has_match(pattern);
    };
    Printer.prototype.set_space_before_token = function(value, non_breaking) {
      this._output.space_before_token = value;
      this._output.non_breaking_space = non_breaking;
    };
    Printer.prototype.set_wrap_point = function() {
      this._output.set_indent(this.indent_level, this.alignment_size);
      this._output.set_wrap_point();
    };
    Printer.prototype.add_raw_token = function(token) {
      this._output.add_raw_token(token);
    };
    Printer.prototype.print_preserved_newlines = function(raw_token) {
      var newlines = 0;
      if (raw_token.type !== TOKEN.TEXT && raw_token.previous.type !== TOKEN.TEXT) {
        newlines = raw_token.newlines ? 1 : 0;
      }
      if (this.preserve_newlines) {
        newlines = raw_token.newlines < this.max_preserve_newlines + 1 ? raw_token.newlines : this.max_preserve_newlines + 1;
      }
      for (var n = 0; n < newlines; n++) {
        this.print_newline(n > 0);
      }
      return newlines !== 0;
    };
    Printer.prototype.traverse_whitespace = function(raw_token) {
      if (raw_token.whitespace_before || raw_token.newlines) {
        if (!this.print_preserved_newlines(raw_token)) {
          this._output.space_before_token = true;
        }
        return true;
      }
      return false;
    };
    Printer.prototype.previous_token_wrapped = function() {
      return this._output.previous_token_wrapped;
    };
    Printer.prototype.print_newline = function(force2) {
      this._output.add_new_line(force2);
    };
    Printer.prototype.print_token = function(token) {
      if (token.text) {
        this._output.set_indent(this.indent_level, this.alignment_size);
        this._output.add_token(token.text);
      }
    };
    Printer.prototype.indent = function() {
      this.indent_level++;
    };
    Printer.prototype.get_full_indent = function(level) {
      level = this.indent_level + (level || 0);
      if (level < 1) {
        return "";
      }
      return this._output.get_indent_string(level);
    };
    var get_type_attribute = function(start_token) {
      var result = null;
      var raw_token = start_token.next;
      while (raw_token.type !== TOKEN.EOF && start_token.closed !== raw_token) {
        if (raw_token.type === TOKEN.ATTRIBUTE && raw_token.text === "type") {
          if (raw_token.next && raw_token.next.type === TOKEN.EQUALS && raw_token.next.next && raw_token.next.next.type === TOKEN.VALUE) {
            result = raw_token.next.next.text;
          }
          break;
        }
        raw_token = raw_token.next;
      }
      return result;
    };
    var get_custom_beautifier_name = function(tag_check, raw_token) {
      var typeAttribute = null;
      var result = null;
      if (!raw_token.closed) {
        return null;
      }
      if (tag_check === "script") {
        typeAttribute = "text/javascript";
      } else if (tag_check === "style") {
        typeAttribute = "text/css";
      }
      typeAttribute = get_type_attribute(raw_token) || typeAttribute;
      if (typeAttribute.search("text/css") > -1) {
        result = "css";
      } else if (typeAttribute.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1) {
        result = "javascript";
      } else if (typeAttribute.search(/(text|application|dojo)\/(x-)?(html)/) > -1) {
        result = "html";
      } else if (typeAttribute.search(/test\/null/) > -1) {
        result = "null";
      }
      return result;
    };
    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }
    function TagFrame(parent, parser_token, indent_level) {
      this.parent = parent || null;
      this.tag = parser_token ? parser_token.tag_name : "";
      this.indent_level = indent_level || 0;
      this.parser_token = parser_token || null;
    }
    function TagStack(printer) {
      this._printer = printer;
      this._current_frame = null;
    }
    TagStack.prototype.get_parser_token = function() {
      return this._current_frame ? this._current_frame.parser_token : null;
    };
    TagStack.prototype.record_tag = function(parser_token) {
      var new_frame = new TagFrame(this._current_frame, parser_token, this._printer.indent_level);
      this._current_frame = new_frame;
    };
    TagStack.prototype._try_pop_frame = function(frame) {
      var parser_token = null;
      if (frame) {
        parser_token = frame.parser_token;
        this._printer.indent_level = frame.indent_level;
        this._current_frame = frame.parent;
      }
      return parser_token;
    };
    TagStack.prototype._get_frame = function(tag_list, stop_list) {
      var frame = this._current_frame;
      while (frame) {
        if (tag_list.indexOf(frame.tag) !== -1) {
          break;
        } else if (stop_list && stop_list.indexOf(frame.tag) !== -1) {
          frame = null;
          break;
        }
        frame = frame.parent;
      }
      return frame;
    };
    TagStack.prototype.try_pop = function(tag, stop_list) {
      var frame = this._get_frame([tag], stop_list);
      return this._try_pop_frame(frame);
    };
    TagStack.prototype.indent_to_tag = function(tag_list) {
      var frame = this._get_frame(tag_list);
      if (frame) {
        this._printer.indent_level = frame.indent_level;
      }
    };
    function Beautifier(source_text, options, js_beautify, css_beautify) {
      this._source_text = source_text || "";
      options = options || {};
      this._js_beautify = js_beautify;
      this._css_beautify = css_beautify;
      this._tag_stack = null;
      var optionHtml = new Options(options, "html");
      this._options = optionHtml;
      this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, "force".length) === "force";
      this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === "force-expand-multiline";
      this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === "force-aligned";
      this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === "aligned-multiple";
      this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, "preserve".length) === "preserve";
      this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === "preserve-aligned";
    }
    Beautifier.prototype.beautify = function() {
      if (this._options.disabled) {
        return this._source_text;
      }
      var source_text = this._source_text;
      var eol = this._options.eol;
      if (this._options.eol === "auto") {
        eol = "\n";
        if (source_text && lineBreak.test(source_text)) {
          eol = source_text.match(lineBreak)[0];
        }
      }
      source_text = source_text.replace(allLineBreaks, "\n");
      var baseIndentString = source_text.match(/^[\t ]*/)[0];
      var last_token = {
        text: "",
        type: ""
      };
      var last_tag_token = new TagOpenParserToken();
      var printer = new Printer(this._options, baseIndentString);
      var tokens = new Tokenizer(source_text, this._options).tokenize();
      this._tag_stack = new TagStack(printer);
      var parser_token = null;
      var raw_token = tokens.next();
      while (raw_token.type !== TOKEN.EOF) {
        if (raw_token.type === TOKEN.TAG_OPEN || raw_token.type === TOKEN.COMMENT) {
          parser_token = this._handle_tag_open(printer, raw_token, last_tag_token, last_token);
          last_tag_token = parser_token;
        } else if (raw_token.type === TOKEN.ATTRIBUTE || raw_token.type === TOKEN.EQUALS || raw_token.type === TOKEN.VALUE || raw_token.type === TOKEN.TEXT && !last_tag_token.tag_complete) {
          parser_token = this._handle_inside_tag(printer, raw_token, last_tag_token, tokens);
        } else if (raw_token.type === TOKEN.TAG_CLOSE) {
          parser_token = this._handle_tag_close(printer, raw_token, last_tag_token);
        } else if (raw_token.type === TOKEN.TEXT) {
          parser_token = this._handle_text(printer, raw_token, last_tag_token);
        } else {
          printer.add_raw_token(raw_token);
        }
        last_token = parser_token;
        raw_token = tokens.next();
      }
      var sweet_code = printer._output.get_code(eol);
      return sweet_code;
    };
    Beautifier.prototype._handle_tag_close = function(printer, raw_token, last_tag_token) {
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.alignment_size = 0;
      last_tag_token.tag_complete = true;
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
      if (last_tag_token.is_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        if (last_tag_token.tag_start_char === "<") {
          printer.set_space_before_token(raw_token.text[0] === "/", true);
          if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.has_wrapped_attrs) {
            printer.print_newline(false);
          }
        }
        printer.print_token(raw_token);
      }
      if (last_tag_token.indent_content && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
        printer.indent();
        last_tag_token.indent_content = false;
      }
      if (!last_tag_token.is_inline_element && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
        printer.set_wrap_point();
      }
      return parser_token;
    };
    Beautifier.prototype._handle_inside_tag = function(printer, raw_token, last_tag_token, tokens) {
      var wrapped = last_tag_token.has_wrapped_attrs;
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
      if (last_tag_token.is_unformatted) {
        printer.add_raw_token(raw_token);
      } else if (last_tag_token.tag_start_char === "{" && raw_token.type === TOKEN.TEXT) {
        if (printer.print_preserved_newlines(raw_token)) {
          raw_token.newlines = 0;
          printer.add_raw_token(raw_token);
        } else {
          printer.print_token(raw_token);
        }
      } else {
        if (raw_token.type === TOKEN.ATTRIBUTE) {
          printer.set_space_before_token(true);
          last_tag_token.attr_count += 1;
        } else if (raw_token.type === TOKEN.EQUALS) {
          printer.set_space_before_token(false);
        } else if (raw_token.type === TOKEN.VALUE && raw_token.previous.type === TOKEN.EQUALS) {
          printer.set_space_before_token(false);
        }
        if (raw_token.type === TOKEN.ATTRIBUTE && last_tag_token.tag_start_char === "<") {
          if (this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) {
            printer.traverse_whitespace(raw_token);
            wrapped = wrapped || raw_token.newlines !== 0;
          }
          if (this._is_wrap_attributes_force) {
            var force_attr_wrap = last_tag_token.attr_count > 1;
            if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.attr_count === 1) {
              var is_only_attribute = true;
              var peek_index = 0;
              var peek_token;
              do {
                peek_token = tokens.peek(peek_index);
                if (peek_token.type === TOKEN.ATTRIBUTE) {
                  is_only_attribute = false;
                  break;
                }
                peek_index += 1;
              } while (peek_index < 4 && peek_token.type !== TOKEN.EOF && peek_token.type !== TOKEN.TAG_CLOSE);
              force_attr_wrap = !is_only_attribute;
            }
            if (force_attr_wrap) {
              printer.print_newline(false);
              wrapped = true;
            }
          }
        }
        printer.print_token(raw_token);
        wrapped = wrapped || printer.previous_token_wrapped();
        last_tag_token.has_wrapped_attrs = wrapped;
      }
      return parser_token;
    };
    Beautifier.prototype._handle_text = function(printer, raw_token, last_tag_token) {
      var parser_token = {
        text: raw_token.text,
        type: "TK_CONTENT"
      };
      if (last_tag_token.custom_beautifier_name) {
        this._print_custom_beatifier_text(printer, raw_token, last_tag_token);
      } else if (last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        printer.traverse_whitespace(raw_token);
        printer.print_token(raw_token);
      }
      return parser_token;
    };
    Beautifier.prototype._print_custom_beatifier_text = function(printer, raw_token, last_tag_token) {
      var local2 = this;
      if (raw_token.text !== "") {
        var text2 = raw_token.text, _beautifier, script_indent_level = 1, pre = "", post = "";
        if (last_tag_token.custom_beautifier_name === "javascript" && typeof this._js_beautify === "function") {
          _beautifier = this._js_beautify;
        } else if (last_tag_token.custom_beautifier_name === "css" && typeof this._css_beautify === "function") {
          _beautifier = this._css_beautify;
        } else if (last_tag_token.custom_beautifier_name === "html") {
          _beautifier = function(html_source, options) {
            var beautifier = new Beautifier(html_source, options, local2._js_beautify, local2._css_beautify);
            return beautifier.beautify();
          };
        }
        if (this._options.indent_scripts === "keep") {
          script_indent_level = 0;
        } else if (this._options.indent_scripts === "separate") {
          script_indent_level = -printer.indent_level;
        }
        var indentation = printer.get_full_indent(script_indent_level);
        text2 = text2.replace(/\n[ \t]*$/, "");
        if (last_tag_token.custom_beautifier_name !== "html" && text2[0] === "<" && text2.match(/^(<!--|<!\[CDATA\[)/)) {
          var matched = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(text2);
          if (!matched) {
            printer.add_raw_token(raw_token);
            return;
          }
          pre = indentation + matched[1] + "\n";
          text2 = matched[4];
          if (matched[5]) {
            post = indentation + matched[5];
          }
          text2 = text2.replace(/\n[ \t]*$/, "");
          if (matched[2] || matched[3].indexOf("\n") !== -1) {
            matched = matched[3].match(/[ \t]+$/);
            if (matched) {
              raw_token.whitespace_before = matched[0];
            }
          }
        }
        if (text2) {
          if (_beautifier) {
            var Child_options = function() {
              this.eol = "\n";
            };
            Child_options.prototype = this._options.raw_options;
            var child_options = new Child_options();
            text2 = _beautifier(indentation + text2, child_options);
          } else {
            var white = raw_token.whitespace_before;
            if (white) {
              text2 = text2.replace(new RegExp("\n(" + white + ")?", "g"), "\n");
            }
            text2 = indentation + text2.replace(/\n/g, "\n" + indentation);
          }
        }
        if (pre) {
          if (!text2) {
            text2 = pre + post;
          } else {
            text2 = pre + text2 + "\n" + post;
          }
        }
        printer.print_newline(false);
        if (text2) {
          raw_token.text = text2;
          raw_token.whitespace_before = "";
          raw_token.newlines = 0;
          printer.add_raw_token(raw_token);
          printer.print_newline(true);
        }
      }
    };
    Beautifier.prototype._handle_tag_open = function(printer, raw_token, last_tag_token, last_token) {
      var parser_token = this._get_tag_open_token(raw_token);
      if ((last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) && !last_tag_token.is_empty_element && raw_token.type === TOKEN.TAG_OPEN && raw_token.text.indexOf("</") === 0) {
        printer.add_raw_token(raw_token);
        parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
      } else {
        printer.traverse_whitespace(raw_token);
        this._set_tag_position(printer, raw_token, parser_token, last_tag_token, last_token);
        if (!parser_token.is_inline_element) {
          printer.set_wrap_point();
        }
        printer.print_token(raw_token);
      }
      if (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) {
        parser_token.alignment_size = raw_token.text.length + 1;
      }
      if (!parser_token.tag_complete && !parser_token.is_unformatted) {
        printer.alignment_size = parser_token.alignment_size;
      }
      return parser_token;
    };
    var TagOpenParserToken = function(parent, raw_token) {
      this.parent = parent || null;
      this.text = "";
      this.type = "TK_TAG_OPEN";
      this.tag_name = "";
      this.is_inline_element = false;
      this.is_unformatted = false;
      this.is_content_unformatted = false;
      this.is_empty_element = false;
      this.is_start_tag = false;
      this.is_end_tag = false;
      this.indent_content = false;
      this.multiline_content = false;
      this.custom_beautifier_name = null;
      this.start_tag_token = null;
      this.attr_count = 0;
      this.has_wrapped_attrs = false;
      this.alignment_size = 0;
      this.tag_complete = false;
      this.tag_start_char = "";
      this.tag_check = "";
      if (!raw_token) {
        this.tag_complete = true;
      } else {
        var tag_check_match;
        this.tag_start_char = raw_token.text[0];
        this.text = raw_token.text;
        if (this.tag_start_char === "<") {
          tag_check_match = raw_token.text.match(/^<([^\s>]*)/);
          this.tag_check = tag_check_match ? tag_check_match[1] : "";
        } else {
          tag_check_match = raw_token.text.match(/^{{~?(?:[\^]|#\*?)?([^\s}]+)/);
          this.tag_check = tag_check_match ? tag_check_match[1] : "";
          if ((raw_token.text.startsWith("{{#>") || raw_token.text.startsWith("{{~#>")) && this.tag_check[0] === ">") {
            if (this.tag_check === ">" && raw_token.next !== null) {
              this.tag_check = raw_token.next.text.split(" ")[0];
            } else {
              this.tag_check = raw_token.text.split(">")[1];
            }
          }
        }
        this.tag_check = this.tag_check.toLowerCase();
        if (raw_token.type === TOKEN.COMMENT) {
          this.tag_complete = true;
        }
        this.is_start_tag = this.tag_check.charAt(0) !== "/";
        this.tag_name = !this.is_start_tag ? this.tag_check.substr(1) : this.tag_check;
        this.is_end_tag = !this.is_start_tag || raw_token.closed && raw_token.closed.text === "/>";
        var handlebar_starts = 2;
        if (this.tag_start_char === "{" && this.text.length >= 3) {
          if (this.text.charAt(2) === "~") {
            handlebar_starts = 3;
          }
        }
        this.is_end_tag = this.is_end_tag || this.tag_start_char === "{" && (this.text.length < 3 || /[^#\^]/.test(this.text.charAt(handlebar_starts)));
      }
    };
    Beautifier.prototype._get_tag_open_token = function(raw_token) {
      var parser_token = new TagOpenParserToken(this._tag_stack.get_parser_token(), raw_token);
      parser_token.alignment_size = this._options.wrap_attributes_indent_size;
      parser_token.is_end_tag = parser_token.is_end_tag || in_array(parser_token.tag_check, this._options.void_elements);
      parser_token.is_empty_element = parser_token.tag_complete || parser_token.is_start_tag && parser_token.is_end_tag;
      parser_token.is_unformatted = !parser_token.tag_complete && in_array(parser_token.tag_check, this._options.unformatted);
      parser_token.is_content_unformatted = !parser_token.is_empty_element && in_array(parser_token.tag_check, this._options.content_unformatted);
      parser_token.is_inline_element = in_array(parser_token.tag_name, this._options.inline) || parser_token.tag_name.includes("-") || parser_token.tag_start_char === "{";
      return parser_token;
    };
    Beautifier.prototype._set_tag_position = function(printer, raw_token, parser_token, last_tag_token, last_token) {
      if (!parser_token.is_empty_element) {
        if (parser_token.is_end_tag) {
          parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
        } else {
          if (this._do_optional_end_element(parser_token)) {
            if (!parser_token.is_inline_element) {
              printer.print_newline(false);
            }
          }
          this._tag_stack.record_tag(parser_token);
          if ((parser_token.tag_name === "script" || parser_token.tag_name === "style") && !(parser_token.is_unformatted || parser_token.is_content_unformatted)) {
            parser_token.custom_beautifier_name = get_custom_beautifier_name(parser_token.tag_check, raw_token);
          }
        }
      }
      if (in_array(parser_token.tag_check, this._options.extra_liners)) {
        printer.print_newline(false);
        if (!printer._output.just_added_blankline()) {
          printer.print_newline(true);
        }
      }
      if (parser_token.is_empty_element) {
        if (parser_token.tag_start_char === "{" && parser_token.tag_check === "else") {
          this._tag_stack.indent_to_tag(["if", "unless", "each"]);
          parser_token.indent_content = true;
          var foundIfOnCurrentLine = printer.current_line_has_match(/{{#if/);
          if (!foundIfOnCurrentLine) {
            printer.print_newline(false);
          }
        }
        if (parser_token.tag_name === "!--" && last_token.type === TOKEN.TAG_CLOSE && last_tag_token.is_end_tag && parser_token.text.indexOf("\n") === -1) {
        } else {
          if (!(parser_token.is_inline_element || parser_token.is_unformatted)) {
            printer.print_newline(false);
          }
          this._calcluate_parent_multiline(printer, parser_token);
        }
      } else if (parser_token.is_end_tag) {
        var do_end_expand = false;
        do_end_expand = parser_token.start_tag_token && parser_token.start_tag_token.multiline_content;
        do_end_expand = do_end_expand || !parser_token.is_inline_element && !(last_tag_token.is_inline_element || last_tag_token.is_unformatted) && !(last_token.type === TOKEN.TAG_CLOSE && parser_token.start_tag_token === last_tag_token) && last_token.type !== "TK_CONTENT";
        if (parser_token.is_content_unformatted || parser_token.is_unformatted) {
          do_end_expand = false;
        }
        if (do_end_expand) {
          printer.print_newline(false);
        }
      } else {
        parser_token.indent_content = !parser_token.custom_beautifier_name;
        if (parser_token.tag_start_char === "<") {
          if (parser_token.tag_name === "html") {
            parser_token.indent_content = this._options.indent_inner_html;
          } else if (parser_token.tag_name === "head") {
            parser_token.indent_content = this._options.indent_head_inner_html;
          } else if (parser_token.tag_name === "body") {
            parser_token.indent_content = this._options.indent_body_inner_html;
          }
        }
        if (!(parser_token.is_inline_element || parser_token.is_unformatted) && (last_token.type !== "TK_CONTENT" || parser_token.is_content_unformatted)) {
          printer.print_newline(false);
        }
        this._calcluate_parent_multiline(printer, parser_token);
      }
    };
    Beautifier.prototype._calcluate_parent_multiline = function(printer, parser_token) {
      if (parser_token.parent && printer._output.just_added_newline() && !((parser_token.is_inline_element || parser_token.is_unformatted) && parser_token.parent.is_inline_element)) {
        parser_token.parent.multiline_content = true;
      }
    };
    var p_closers = ["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"];
    var p_parent_excludes = ["a", "audio", "del", "ins", "map", "noscript", "video"];
    Beautifier.prototype._do_optional_end_element = function(parser_token) {
      var result = null;
      if (parser_token.is_empty_element || !parser_token.is_start_tag || !parser_token.parent) {
        return;
      }
      if (parser_token.tag_name === "body") {
        result = result || this._tag_stack.try_pop("head");
      } else if (parser_token.tag_name === "li") {
        result = result || this._tag_stack.try_pop("li", ["ol", "ul"]);
      } else if (parser_token.tag_name === "dd" || parser_token.tag_name === "dt") {
        result = result || this._tag_stack.try_pop("dt", ["dl"]);
        result = result || this._tag_stack.try_pop("dd", ["dl"]);
      } else if (parser_token.parent.tag_name === "p" && p_closers.indexOf(parser_token.tag_name) !== -1) {
        var p_parent = parser_token.parent.parent;
        if (!p_parent || p_parent_excludes.indexOf(p_parent.tag_name) === -1) {
          result = result || this._tag_stack.try_pop("p");
        }
      } else if (parser_token.tag_name === "rp" || parser_token.tag_name === "rt") {
        result = result || this._tag_stack.try_pop("rt", ["ruby", "rtc"]);
        result = result || this._tag_stack.try_pop("rp", ["ruby", "rtc"]);
      } else if (parser_token.tag_name === "optgroup") {
        result = result || this._tag_stack.try_pop("optgroup", ["select"]);
      } else if (parser_token.tag_name === "option") {
        result = result || this._tag_stack.try_pop("option", ["select", "datalist", "optgroup"]);
      } else if (parser_token.tag_name === "colgroup") {
        result = result || this._tag_stack.try_pop("caption", ["table"]);
      } else if (parser_token.tag_name === "thead") {
        result = result || this._tag_stack.try_pop("caption", ["table"]);
        result = result || this._tag_stack.try_pop("colgroup", ["table"]);
      } else if (parser_token.tag_name === "tbody" || parser_token.tag_name === "tfoot") {
        result = result || this._tag_stack.try_pop("caption", ["table"]);
        result = result || this._tag_stack.try_pop("colgroup", ["table"]);
        result = result || this._tag_stack.try_pop("thead", ["table"]);
        result = result || this._tag_stack.try_pop("tbody", ["table"]);
      } else if (parser_token.tag_name === "tr") {
        result = result || this._tag_stack.try_pop("caption", ["table"]);
        result = result || this._tag_stack.try_pop("colgroup", ["table"]);
        result = result || this._tag_stack.try_pop("tr", ["table", "thead", "tbody", "tfoot"]);
      } else if (parser_token.tag_name === "th" || parser_token.tag_name === "td") {
        result = result || this._tag_stack.try_pop("td", ["table", "thead", "tbody", "tfoot", "tr"]);
        result = result || this._tag_stack.try_pop("th", ["table", "thead", "tbody", "tfoot", "tr"]);
      }
      parser_token.parent = this._tag_stack.get_parser_token();
      return result;
    };
    module2.exports.Beautifier = Beautifier;
  }
});

// node_modules/js-beautify/js/src/html/index.js
var require_html = __commonJS({
  "node_modules/js-beautify/js/src/html/index.js"(exports, module2) {
    "use strict";
    var Beautifier = require_beautifier3().Beautifier;
    var Options = require_options4().Options;
    function style_html(html_source, options, js_beautify, css_beautify) {
      var beautifier = new Beautifier(html_source, options, js_beautify, css_beautify);
      return beautifier.beautify();
    }
    module2.exports = style_html;
    module2.exports.defaultOptions = function() {
      return new Options();
    };
  }
});

// node_modules/js-beautify/js/src/index.js
var require_src = __commonJS({
  "node_modules/js-beautify/js/src/index.js"(exports, module2) {
    "use strict";
    var js_beautify = require_javascript();
    var css_beautify = require_css();
    var html_beautify = require_html();
    function style_html(html_source, options, js, css) {
      js = js || js_beautify;
      css = css || css_beautify;
      return html_beautify(html_source, options, js, css);
    }
    style_html.defaultOptions = html_beautify.defaultOptions;
    module2.exports.js = js_beautify;
    module2.exports.css = css_beautify;
    module2.exports.html = style_html;
  }
});

// node_modules/js-beautify/js/index.js
var require_js = __commonJS({
  "node_modules/js-beautify/js/index.js"(exports, module2) {
    "use strict";
    function get_beautify(js_beautify, css_beautify, html_beautify) {
      var beautify = function(src2, config) {
        return js_beautify.js_beautify(src2, config);
      };
      beautify.js = js_beautify.js_beautify;
      beautify.css = css_beautify.css_beautify;
      beautify.html = html_beautify.html_beautify;
      beautify.js_beautify = js_beautify.js_beautify;
      beautify.css_beautify = css_beautify.css_beautify;
      beautify.html_beautify = html_beautify.html_beautify;
      return beautify;
    }
    if (typeof define === "function" && define.amd) {
      define([
        "./lib/beautify",
        "./lib/beautify-css",
        "./lib/beautify-html"
      ], function(js_beautify, css_beautify, html_beautify) {
        return get_beautify(js_beautify, css_beautify, html_beautify);
      });
    } else {
      (function(mod2) {
        var beautifier = require_src();
        beautifier.js_beautify = beautifier.js;
        beautifier.css_beautify = beautifier.css;
        beautifier.html_beautify = beautifier.html;
        mod2.exports = get_beautify(beautifier, beautifier, beautifier);
      })(module2);
    }
  }
});

// node_modules/is-whitespace/index.js
var require_is_whitespace = __commonJS({
  "node_modules/is-whitespace/index.js"(exports, module2) {
    "use strict";
    var cache;
    module2.exports = function isWhitespace(str) {
      return typeof str === "string" && regex2().test(str);
    };
    function regex2() {
      return cache || (cache = new RegExp('^[\\s	\n\v\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF"]+$'));
    }
  }
});

// node_modules/is-extendable/index.js
var require_is_extendable = __commonJS({
  "node_modules/is-extendable/index.js"(exports, module2) {
    "use strict";
    module2.exports = function isExtendable(val) {
      return typeof val !== "undefined" && val !== null && (typeof val === "object" || typeof val === "function");
    };
  }
});

// node_modules/extend-shallow/index.js
var require_extend_shallow = __commonJS({
  "node_modules/extend-shallow/index.js"(exports, module2) {
    "use strict";
    var isObject = require_is_extendable();
    module2.exports = function extend2(o) {
      if (!isObject(o)) {
        o = {};
      }
      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var obj = arguments[i];
        if (isObject(obj)) {
          assign(o, obj);
        }
      }
      return o;
    };
    function assign(a, b) {
      for (var key in b) {
        if (hasOwn(b, key)) {
          a[key] = b[key];
        }
      }
    }
    function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
  }
});

// node_modules/is-buffer/index.js
var require_is_buffer = __commonJS({
  "node_modules/is-buffer/index.js"(exports, module2) {
    module2.exports = function(obj) {
      return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
    };
    function isBuffer(obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    }
    function isSlowBuffer(obj) {
      return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
    }
  }
});

// node_modules/kind-of/index.js
var require_kind_of = __commonJS({
  "node_modules/kind-of/index.js"(exports, module2) {
    var isBuffer = require_is_buffer();
    var toString5 = Object.prototype.toString;
    module2.exports = function kindOf(val) {
      if (typeof val === "undefined") {
        return "undefined";
      }
      if (val === null) {
        return "null";
      }
      if (val === true || val === false || val instanceof Boolean) {
        return "boolean";
      }
      if (typeof val === "string" || val instanceof String) {
        return "string";
      }
      if (typeof val === "number" || val instanceof Number) {
        return "number";
      }
      if (typeof val === "function" || val instanceof Function) {
        return "function";
      }
      if (typeof Array.isArray !== "undefined" && Array.isArray(val)) {
        return "array";
      }
      if (val instanceof RegExp) {
        return "regexp";
      }
      if (val instanceof Date) {
        return "date";
      }
      var type = toString5.call(val);
      if (type === "[object RegExp]") {
        return "regexp";
      }
      if (type === "[object Date]") {
        return "date";
      }
      if (type === "[object Arguments]") {
        return "arguments";
      }
      if (type === "[object Error]") {
        return "error";
      }
      if (isBuffer(val)) {
        return "buffer";
      }
      if (type === "[object Set]") {
        return "set";
      }
      if (type === "[object WeakSet]") {
        return "weakset";
      }
      if (type === "[object Map]") {
        return "map";
      }
      if (type === "[object WeakMap]") {
        return "weakmap";
      }
      if (type === "[object Symbol]") {
        return "symbol";
      }
      if (type === "[object Int8Array]") {
        return "int8array";
      }
      if (type === "[object Uint8Array]") {
        return "uint8array";
      }
      if (type === "[object Uint8ClampedArray]") {
        return "uint8clampedarray";
      }
      if (type === "[object Int16Array]") {
        return "int16array";
      }
      if (type === "[object Uint16Array]") {
        return "uint16array";
      }
      if (type === "[object Int32Array]") {
        return "int32array";
      }
      if (type === "[object Uint32Array]") {
        return "uint32array";
      }
      if (type === "[object Float32Array]") {
        return "float32array";
      }
      if (type === "[object Float64Array]") {
        return "float64array";
      }
      return "object";
    };
  }
});

// node_modules/condense-newlines/index.js
var require_condense_newlines = __commonJS({
  "node_modules/condense-newlines/index.js"(exports, module2) {
    "use strict";
    var isWhitespace = require_is_whitespace();
    var extend2 = require_extend_shallow();
    var typeOf2 = require_kind_of();
    module2.exports = function(str, options) {
      var opts = extend2({}, options);
      var sep2 = opts.sep || "\n\n";
      var min3 = opts.min;
      var re;
      if (typeof min3 === "number" && min3 !== 2) {
        re = new RegExp("(\\r\\n|\\n|\\u2424) {" + min3 + ",}");
      }
      if (typeof re === "undefined") {
        re = opts.regex || /(\r\n|\n|\u2424){2,}/g;
      }
      if (opts.keepWhitespace !== true) {
        str = str.split("\n").map(function(line) {
          return isWhitespace(line) ? line.trim() : line;
        }).join("\n");
      }
      str = trailingNewline(str, opts);
      return str.replace(re, sep2);
    };
    function trailingNewline(str, options) {
      var val = options.trailingNewline;
      if (val === false) {
        return str;
      }
      switch (typeOf2(val)) {
        case "string":
          str = str.replace(/\s+$/, options.trailingNewline);
          break;
        case "function":
          str = options.trailingNewline(str);
          break;
        case "undefined":
        case "boolean":
        default: {
          str = str.replace(/\s+$/, "\n");
          break;
        }
      }
      return str;
    }
  }
});

// node_modules/pretty/index.js
var require_pretty = __commonJS({
  "node_modules/pretty/index.js"(exports, module2) {
    "use strict";
    var beautify = require_js();
    var condense = require_condense_newlines();
    var extend2 = require_extend_shallow();
    var defaults = {
      unformatted: ["code", "pre", "em", "strong", "span"],
      indent_inner_html: true,
      indent_char: " ",
      indent_size: 2,
      sep: "\n"
    };
    module2.exports = function pretty2(str, options) {
      var opts = extend2({}, defaults, options);
      str = beautify.html(str, opts);
      if (opts.ocd === true) {
        if (opts.newlines)
          opts.sep = opts.newlines;
        return ocd(str, opts);
      }
      return str;
    };
    function ocd(str, options) {
      return condense(str, options).replace(/^\s+/g, "").replace(/\s+$/g, "\n").replace(/(\s*<!--)/g, "\n$1").replace(/>(\s*)(?=<!--\s*\/)/g, "> ");
    }
  }
});

// output/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff2(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff2(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler(error5) {
    return new Aff2(PURE, void 0);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error5) {
      setTimeout(function() {
        throw error5;
      }, 0);
    }
  }
  function runSync(left, right, eff) {
    try {
      return right(eff());
    } catch (error5) {
      return left(error5);
    }
  }
  function runAsync(left, eff, k) {
    try {
      return eff(k)();
    } catch (error5) {
      k(left(error5))();
      return nonCanceler;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size6 = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size6 !== 0) {
        size6--;
        thunk = queue[ix];
        queue[ix] = void 0;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i, tmp;
        if (size6 === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size6) % limit] = cb;
        size6++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error5) {
            return new Aff2(SYNC, function() {
              for (var k2 in kills) {
                if (kills.hasOwnProperty(k2)) {
                  kills[k2]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status = SUSPENDED;
    var step3 = aff;
    var fail = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run3(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
        switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step3 = bhead(step3);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status = RETURN;
              fail = util.left(e);
              step3 = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step3)) {
              status = RETURN;
              fail = step3;
              step3 = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step3 = util.fromRight(step3);
            }
            break;
          case CONTINUE:
            switch (step3.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff2(CONS, bhead, btail);
                }
                bhead = step3._2;
                status = CONTINUE;
                step3 = step3._1;
                break;
              case PURE:
                if (bhead === null) {
                  status = RETURN;
                  step3 = util.right(step3._1);
                } else {
                  status = STEP_BIND;
                  step3 = step3._1;
                }
                break;
              case SYNC:
                status = STEP_RESULT;
                step3 = runSync(util.left, util.right, step3._1);
                break;
              case ASYNC:
                status = PENDING;
                step3 = runAsync(util.left, step3._1, function(result2) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status = STEP_RESULT;
                      step3 = result2;
                      run3(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status = RETURN;
                fail = util.left(step3._1);
                step3 = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff2(CONS, step3, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step3, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step3 = step3._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff2(CONS, step3, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step3, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step3 = step3._1;
                break;
              case FORK:
                status = STEP_RESULT;
                tmp = Fiber(util, supervisor, step3._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step3._1) {
                  tmp.run();
                }
                step3 = util.right(tmp);
                break;
              case SEQ:
                status = CONTINUE;
                step3 = sequential2(util, supervisor, step3._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status = COMPLETED;
              step3 = interrupt || fail || step3;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail) {
                    status = CONTINUE;
                    step3 = attempt._2(util.fromLeft(fail));
                    fail = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail) {
                    status = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status = STEP_BIND;
                    step3 = util.fromRight(step3);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail === null) {
                    result = util.fromRight(step3);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step3 = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step3, fail), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step3 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail) {
                    step3 = attempt._1.failed(util.fromLeft(fail))(attempt._2);
                  } else {
                    step3 = attempt._1.completed(util.fromRight(step3))(attempt._2);
                  }
                  fail = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step3, fail), attempts, interrupt);
                  status = CONTINUE;
                  step3 = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step3 = attempt._1;
                  fail = attempt._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step3));
              }
            }
            joins = null;
            if (interrupt && fail) {
              setTimeout(function() {
                throw util.fromLeft(fail);
              }, 0);
            } else if (util.isLeft(step3) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step3);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join3) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join3.rethrow;
          join3.handler(step3)();
          return function() {
          };
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join3;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill(error5, cb) {
      return function() {
        if (status === COMPLETED) {
          cb(util.right(void 0))();
          return function() {
          };
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(void 0));
          }
        })();
        switch (status) {
          case SUSPENDED:
            interrupt = util.left(error5);
            status = COMPLETED;
            step3 = interrupt;
            run3(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error5);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step3(error5)), attempts, interrupt);
              }
              status = RETURN;
              step3 = null;
              fail = null;
              run3(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error5);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step3 = null;
              fail = null;
            }
        }
        return canceler;
      };
    }
    function join2(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status === SUSPENDED) {
          run3(runTick);
        }
        return canceler;
      };
    }
    return {
      kill,
      join: join2,
      onComplete,
      isSuspended: function() {
        return status === SUSPENDED;
      },
      run: function() {
        if (status === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run3(runTick);
            });
          } else {
            run3(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root = EMPTY;
    function kill(error5, par2, cb2) {
      var step3 = par2;
      var head3 = null;
      var tail = null;
      var count = 0;
      var kills2 = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step3.tag) {
            case FORKED:
              if (step3._3 === EMPTY) {
                tmp = fibers[step3._1];
                kills2[count++] = tmp.kill(error5, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head3 === null) {
                break loop;
              }
              step3 = head3._2;
              if (tail === null) {
                head3 = null;
              } else {
                head3 = tail._1;
                tail = tail._2;
              }
              break;
            case MAP:
              step3 = step3._2;
              break;
            case APPLY:
            case ALT:
              if (head3) {
                tail = new Aff2(CONS, head3, tail);
              }
              head3 = step3;
              step3 = step3._1;
              break;
          }
        }
      if (count === 0) {
        cb2(util.right(void 0))();
      } else {
        kid = 0;
        tmp = count;
        for (; kid < tmp; kid++) {
          kills2[kid] = kills2[kid]();
        }
      }
      return kills2;
    }
    function join2(result, head3, tail) {
      var fail, step3, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail = result;
        step3 = null;
      } else {
        step3 = result;
        fail = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head3 === null) {
            cb(fail || step3)();
            return;
          }
          if (head3._3 !== EMPTY) {
            return;
          }
          switch (head3.tag) {
            case MAP:
              if (fail === null) {
                head3._3 = util.right(head3._1(util.fromRight(step3)));
                step3 = head3._3;
              } else {
                head3._3 = fail;
              }
              break;
            case APPLY:
              lhs = head3._1._3;
              rhs = head3._2._3;
              if (fail) {
                head3._3 = fail;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail === lhs ? head3._2 : head3._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join2(fail, null, null);
                    } else {
                      join2(fail, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step3 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head3._3 = step3;
              }
              break;
            case ALT:
              lhs = head3._1._3;
              rhs = head3._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail = step3 === lhs ? rhs : lhs;
                step3 = null;
                head3._3 = fail;
              } else {
                head3._3 = step3;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step3 === lhs ? head3._2 : head3._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join2(step3, null, null);
                    } else {
                      join2(step3, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail === null) {
            head3 = null;
          } else {
            head3 = tail._1;
            tail = tail._2;
          }
        }
    }
    function resolve2(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join2(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run3() {
      var status = CONTINUE;
      var step3 = par;
      var head3 = null;
      var tail = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step3.tag) {
                case MAP:
                  if (head3) {
                    tail = new Aff2(CONS, head3, tail);
                  }
                  head3 = new Aff2(MAP, step3._1, EMPTY, EMPTY);
                  step3 = step3._2;
                  break;
                case APPLY:
                  if (head3) {
                    tail = new Aff2(CONS, head3, tail);
                  }
                  head3 = new Aff2(APPLY, EMPTY, step3._2, EMPTY);
                  step3 = step3._1;
                  break;
                case ALT:
                  if (head3) {
                    tail = new Aff2(CONS, head3, tail);
                  }
                  head3 = new Aff2(ALT, EMPTY, step3._2, EMPTY);
                  step3 = step3._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step3;
                  step3 = new Aff2(FORKED, fid, new Aff2(CONS, head3, tail), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve2(step3)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head3 === null) {
                break loop;
              }
              if (head3._1 === EMPTY) {
                head3._1 = step3;
                status = CONTINUE;
                step3 = head3._2;
                head3._2 = EMPTY;
              } else {
                head3._2 = step3;
                step3 = head3;
                if (tail === null) {
                  head3 = null;
                } else {
                  head3 = tail._1;
                  tail = tail._2;
                }
              }
          }
        }
      root = step3;
      for (fid = 0; fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error5, cb2) {
      interrupt = util.left(error5);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill(error5, root, cb2);
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            for (var kid2 in newKills) {
              if (newKills.hasOwnProperty(kid2)) {
                newKills[kid2]();
              }
            }
            return nonCanceler;
          };
        });
      };
    }
    run3();
    return function(killError) {
      return new Aff2(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential2(util, supervisor, par) {
    return new Aff2(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff2.EMPTY = EMPTY;
  Aff2.Pure = AffCtr(PURE);
  Aff2.Throw = AffCtr(THROW);
  Aff2.Catch = AffCtr(CATCH);
  Aff2.Sync = AffCtr(SYNC);
  Aff2.Async = AffCtr(ASYNC);
  Aff2.Bind = AffCtr(BIND);
  Aff2.Bracket = AffCtr(BRACKET);
  Aff2.Fork = AffCtr(FORK);
  Aff2.Seq = AffCtr(SEQ);
  Aff2.ParMap = AffCtr(MAP);
  Aff2.ParApply = AffCtr(APPLY);
  Aff2.ParAlt = AffCtr(ALT);
  Aff2.Fiber = Fiber;
  Aff2.Supervisor = Supervisor;
  Aff2.Scheduler = Scheduler;
  Aff2.nonCanceler = nonCanceler;
  return Aff2;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value) {
        return Aff.Pure(f(value));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
var _liftEffect = Aff.Sync;
var makeAff = Aff.Async;
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _delay = function() {
  function setDelay(n, k) {
    if (n === 0 && typeof setImmediate !== "undefined") {
      return setImmediate(k);
    } else {
      return setTimeout(k, n);
    }
  }
  function clearDelay(n, t) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t);
    } else {
      return clearTimeout(t);
    }
  }
  return function(right, ms) {
    return Aff.Async(function(cb) {
      return function() {
        var timer = setDelay(ms, cb(right()));
        return function() {
          return Aff.Sync(function() {
            return right(clearDelay(ms, timer));
          });
        };
      };
    });
  };
}();
var _sequential = Aff.Seq;

// output/Control.Apply/foreign.js
var arrayApply = function(fs) {
  return function(xs) {
    var l = fs.length;
    var k = xs.length;
    var result = new Array(l * k);
    var n = 0;
    for (var i = 0; i < l; i++) {
      var f = fs[i];
      for (var j = 0; j < k; j++) {
        result[n++] = f(xs[j]);
      }
    }
    return result;
  };
};

// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f) {
    return function(g) {
      return function(x) {
        return f(g(x));
      };
    };
  }
};

// output/Control.Category/index.js
var identity = function(dict) {
  return dict.identity;
};
var categoryFn = {
  identity: function(x) {
    return x;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Boolean/index.js
var otherwise = true;

// output/Data.Function/index.js
var flip = function(f) {
  return function(b) {
    return function(a) {
      return f(a)(b);
    };
  };
};
var $$const = function(a) {
  return function(v) {
    return a;
  };
};

// output/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output/Data.Unit/foreign.js
var unit = void 0;

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
};
var functorArray = {
  map: arrayMap
};

// output/Control.Apply/index.js
var applyArray = {
  apply: arrayApply,
  Functor0: function() {
    return functorArray;
  }
};
var apply = function(dict) {
  return dict.apply;
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var liftA1 = function(dictApplicative) {
  var apply2 = apply(dictApplicative.Apply0());
  var pure1 = pure(dictApplicative);
  return function(f) {
    return function(a) {
      return apply2(pure1(f))(a);
    };
  };
};

// output/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

// output/Control.Bind/index.js
var bindArray = {
  bind: arrayBind,
  Apply0: function() {
    return applyArray;
  }
};
var bind = function(dict) {
  return dict.bind;
};

// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind3 = bind(dictMonad.Bind1());
  var pure3 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind3(f)(function(f$prime) {
        return bind3(a)(function(a$prime) {
          return pure3(f$prime(a$prime));
        });
      });
    };
  };
};

// output/Data.Semigroup/foreign.js
var concatString = function(s1) {
  return function(s2) {
    return s1 + s2;
  };
};

// output/Data.Semigroup/index.js
var semigroupString = {
  append: concatString
};
var append = function(dict) {
  return dict.append;
};

// output/Data.Bounded/foreign.js
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq3) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq3 : gt;
        };
      };
    };
  };
};
var ordStringImpl = unsafeCompareImpl;

// output/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqStringImpl = refEq;

// output/Data.Eq/index.js
var eqString = {
  eq: eqStringImpl
};
var eq = function(dict) {
  return dict.eq;
};

// output/Data.Ordering/index.js
var LT = /* @__PURE__ */ function() {
  function LT2() {
  }
  ;
  LT2.value = new LT2();
  return LT2;
}();
var GT = /* @__PURE__ */ function() {
  function GT2() {
  }
  ;
  GT2.value = new GT2();
  return GT2;
}();
var EQ = /* @__PURE__ */ function() {
  function EQ2() {
  }
  ;
  EQ2.value = new EQ2();
  return EQ2;
}();

// output/Data.Ord/index.js
var ordString = /* @__PURE__ */ function() {
  return {
    compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqString;
    }
  };
}();
var compare = function(dict) {
  return dict.compare;
};

// output/Data.Show/foreign.js
var showStringImpl = function(s) {
  var l = s.length;
  return '"' + s.replace(
    /[\0-\x1F\x7F"\\]/g,
    // eslint-disable-line no-control-regex
    function(c, i) {
      switch (c) {
        case '"':
        case "\\":
          return "\\" + c;
        case "\x07":
          return "\\a";
        case "\b":
          return "\\b";
        case "\f":
          return "\\f";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "	":
          return "\\t";
        case "\v":
          return "\\v";
      }
      var k = i + 1;
      var empty5 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
      return "\\" + c.charCodeAt(0).toString(10) + empty5;
    }
  ) + '"';
};

// output/Data.Show/index.js
var showString = {
  show: showStringImpl
};
var show = function(dict) {
  return dict.show;
};

// output/Data.Maybe/index.js
var Nothing = /* @__PURE__ */ function() {
  function Nothing2() {
  }
  ;
  Nothing2.value = new Nothing2();
  return Nothing2;
}();
var Just = /* @__PURE__ */ function() {
  function Just2(value0) {
    this.value0 = value0;
  }
  ;
  Just2.create = function(value0) {
    return new Just2(value0);
  };
  return Just2;
}();
var maybe = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v;
      }
      ;
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));

// output/Data.Either/index.js
var Left = /* @__PURE__ */ function() {
  function Left2(value0) {
    this.value0 = value0;
  }
  ;
  Left2.create = function(value0) {
    return new Left2(value0);
  };
  return Left2;
}();
var Right = /* @__PURE__ */ function() {
  function Right2(value0) {
    this.value0 = value0;
  }
  ;
  Right2.create = function(value0) {
    return new Right2(value0);
  };
  return Right2;
}();
var either = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Left) {
        return v(v2.value0);
      }
      ;
      if (v2 instanceof Right) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};

// output/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};

// output/Data.Monoid/index.js
var mempty = function(dict) {
  return dict.mempty;
};

// output/Effect/index.js
var $runtime_lazy = function(name3, moduleName, init2) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name3 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init2();
    state2 = 2;
    return val;
  };
};
var monadEffect = {
  Applicative0: function() {
    return applicativeEffect;
  },
  Bind1: function() {
    return bindEffect;
  }
};
var bindEffect = {
  bind: bindE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var applicativeEffect = {
  pure: pureE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
  return {
    map: liftA1(applicativeEffect)
  };
});
var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
  return {
    apply: ap(monadEffect),
    Functor0: function() {
      return $lazy_functorEffect(0);
    }
  };
});
var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);

// output/Effect.Exception/foreign.js
function message(e) {
  return e.message;
}
function throwException(e) {
  return function() {
    throw e;
  };
}
function catchException(c) {
  return function(t) {
    return function() {
      try {
        return t();
      } catch (e) {
        if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
          return c(e)();
        } else {
          return c(new Error(e.toString()))();
        }
      }
    };
  };
}

// output/Control.Monad.Error.Class/index.js
var monadThrowEffect = {
  throwError: throwException,
  Monad0: function() {
    return monadEffect;
  }
};
var monadErrorEffect = {
  catchError: /* @__PURE__ */ flip(catchException),
  MonadThrow0: function() {
    return monadThrowEffect;
  }
};
var catchError = function(dict) {
  return dict.catchError;
};
var $$try = function(dictMonadError) {
  var catchError1 = catchError(dictMonadError);
  var Monad0 = dictMonadError.MonadThrow0().Monad0();
  var map4 = map(Monad0.Bind1().Apply0().Functor0());
  var pure3 = pure(Monad0.Applicative0());
  return function(a) {
    return catchError1(map4(Right.create)(a))(function($52) {
      return pure3(Left.create($52));
    });
  };
};

// output/Unsafe.Coerce/foreign.js
var unsafeCoerce2 = function(x) {
  return x;
};

// output/Data.Tuple/index.js
var Tuple = /* @__PURE__ */ function() {
  function Tuple2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Tuple2.create = function(value0) {
    return function(value1) {
      return new Tuple2(value0, value1);
    };
  };
  return Tuple2;
}();
var snd = function(v) {
  return v.value1;
};
var functorTuple = {
  map: function(f) {
    return function(m) {
      return new Tuple(m.value0, f(m.value1));
    };
  }
};

// output/Effect.Class/index.js
var monadEffectEffect = {
  liftEffect: /* @__PURE__ */ identity(categoryFn),
  Monad0: function() {
    return monadEffect;
  }
};
var liftEffect = function(dict) {
  return dict.liftEffect;
};

// output/Control.Monad.Except.Trans/index.js
var ExceptT = function(x) {
  return x;
};
var runExceptT = function(v) {
  return v;
};

// output/Safe.Coerce/index.js
var coerce = function() {
  return unsafeCoerce2;
};

// output/Data.Newtype/index.js
var coerce2 = /* @__PURE__ */ coerce();
var unwrap = function() {
  return coerce2;
};

// output/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init2) {
    return function(xs) {
      var acc = init2;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init2) {
    return function(xs) {
      var acc = init2;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output/Data.Bifunctor/index.js
var identity2 = /* @__PURE__ */ identity(categoryFn);
var bimap = function(dict) {
  return dict.bimap;
};
var lmap = function(dictBifunctor) {
  var bimap1 = bimap(dictBifunctor);
  return function(f) {
    return bimap1(f)(identity2);
  };
};
var bifunctorEither = {
  bimap: function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return new Left(v(v2.value0));
        }
        ;
        if (v2 instanceof Right) {
          return new Right(v1(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Bifunctor (line 32, column 1 - line 34, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  }
};

// output/Data.Foldable/index.js
var foldr = function(dict) {
  return dict.foldr;
};
var foldl = function(dict) {
  return dict.foldl;
};
var foldMapDefaultR = function(dictFoldable) {
  var foldr2 = foldr(dictFoldable);
  return function(dictMonoid) {
    var append2 = append(dictMonoid.Semigroup0());
    var mempty2 = mempty(dictMonoid);
    return function(f) {
      return foldr2(function(x) {
        return function(acc) {
          return append2(f(x))(acc);
        };
      })(mempty2);
    };
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: function(dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
  }
};

// output/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat22(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply2) {
    return function(map4) {
      return function(pure3) {
        return function(f) {
          return function(array) {
            function go(bot, top2) {
              switch (top2 - bot) {
                case 0:
                  return pure3([]);
                case 1:
                  return map4(array1)(f(array[bot]));
                case 2:
                  return apply2(map4(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply2(apply2(map4(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top2 - bot) / 4) * 2;
                  return apply2(map4(concat22)(go(bot, pivot)))(go(pivot, top2));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output/Partial.Unsafe/foreign.js
var _unsafePartial = function(f) {
  return f();
};

// output/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output/Partial/index.js
var crashWith = function() {
  return _crashWith;
};

// output/Partial.Unsafe/index.js
var crashWith2 = /* @__PURE__ */ crashWith();
var unsafePartial = _unsafePartial;
var unsafeCrashWith = function(msg) {
  return unsafePartial(function() {
    return crashWith2(msg);
  });
};

// output/Effect.Aff/index.js
var $runtime_lazy2 = function(name3, moduleName, init2) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name3 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init2();
    state2 = 2;
    return val;
  };
};
var $$void2 = /* @__PURE__ */ $$void(functorEffect);
var functorAff = {
  map: _map
};
var ffiUtil = /* @__PURE__ */ function() {
  var unsafeFromRight = function(v) {
    if (v instanceof Right) {
      return v.value0;
    }
    ;
    if (v instanceof Left) {
      return unsafeCrashWith("unsafeFromRight: Left");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
  };
  var unsafeFromLeft = function(v) {
    if (v instanceof Left) {
      return v.value0;
    }
    ;
    if (v instanceof Right) {
      return unsafeCrashWith("unsafeFromLeft: Right");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
  };
  var isLeft = function(v) {
    if (v instanceof Left) {
      return true;
    }
    ;
    if (v instanceof Right) {
      return false;
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
  };
  return {
    isLeft,
    fromLeft: unsafeFromLeft,
    fromRight: unsafeFromRight,
    left: Left.create,
    right: Right.create
  };
}();
var makeFiber = function(aff) {
  return _makeFiber(ffiUtil, aff);
};
var launchAff = function(aff) {
  return function __do2() {
    var fiber = makeFiber(aff)();
    fiber.run();
    return fiber;
  };
};
var launchAff_ = function($74) {
  return $$void2(launchAff($74));
};
var monadAff = {
  Applicative0: function() {
    return applicativeAff;
  },
  Bind1: function() {
    return bindAff;
  }
};
var bindAff = {
  bind: _bind,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var applicativeAff = {
  pure: _pure,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
  return {
    apply: ap(monadAff),
    Functor0: function() {
      return functorAff;
    }
  };
});
var monadEffectAff = {
  liftEffect: _liftEffect,
  Monad0: function() {
    return monadAff;
  }
};

// output/Effect.Console/foreign.js
var log = function(s) {
  return function() {
    console.log(s);
  };
};
var error2 = function(s) {
  return function() {
    console.error(s);
  };
};

// output/Node.Encoding/index.js
var ASCII = /* @__PURE__ */ function() {
  function ASCII2() {
  }
  ;
  ASCII2.value = new ASCII2();
  return ASCII2;
}();
var UTF8 = /* @__PURE__ */ function() {
  function UTF82() {
  }
  ;
  UTF82.value = new UTF82();
  return UTF82;
}();
var UTF16LE = /* @__PURE__ */ function() {
  function UTF16LE2() {
  }
  ;
  UTF16LE2.value = new UTF16LE2();
  return UTF16LE2;
}();
var UCS2 = /* @__PURE__ */ function() {
  function UCS22() {
  }
  ;
  UCS22.value = new UCS22();
  return UCS22;
}();
var Base64 = /* @__PURE__ */ function() {
  function Base642() {
  }
  ;
  Base642.value = new Base642();
  return Base642;
}();
var Latin1 = /* @__PURE__ */ function() {
  function Latin12() {
  }
  ;
  Latin12.value = new Latin12();
  return Latin12;
}();
var Binary = /* @__PURE__ */ function() {
  function Binary2() {
  }
  ;
  Binary2.value = new Binary2();
  return Binary2;
}();
var Hex = /* @__PURE__ */ function() {
  function Hex2() {
  }
  ;
  Hex2.value = new Hex2();
  return Hex2;
}();
var showEncoding = {
  show: function(v) {
    if (v instanceof ASCII) {
      return "ASCII";
    }
    ;
    if (v instanceof UTF8) {
      return "UTF8";
    }
    ;
    if (v instanceof UTF16LE) {
      return "UTF16LE";
    }
    ;
    if (v instanceof UCS2) {
      return "UCS2";
    }
    ;
    if (v instanceof Base64) {
      return "Base64";
    }
    ;
    if (v instanceof Latin1) {
      return "Latin1";
    }
    ;
    if (v instanceof Binary) {
      return "Binary";
    }
    ;
    if (v instanceof Hex) {
      return "Hex";
    }
    ;
    throw new Error("Failed pattern match at Node.Encoding (line 19, column 1 - line 27, column 23): " + [v.constructor.name]);
  }
};

// output/Node.FS.Sync/foreign.js
var import_fs = require("fs");

// output/Data.String.CodePoints/foreign.js
var hasArrayFrom = typeof Array.from === "function";
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";

// output/Data.Array/foreign.js
var replicateFill = function(count) {
  return function(value) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value);
  };
};
var replicatePolyfill = function(count) {
  return function(value) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value;
    }
    return result;
  };
};
var replicate = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons3(head3, tail) {
    this.head = head3;
    this.tail = tail;
  }
  var emptyList = {};
  function curryCons(head3) {
    return function(tail) {
      return new Cons3(head3, tail);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr2) {
    return function(xs) {
      return listToArray(foldr2(curryCons)(emptyList)(xs));
    };
  };
}();
var length = function(xs) {
  return xs.length;
};
var sortByImpl = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from2, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from2 + (to - from2 >> 1);
    if (mid - from2 > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from2, mid);
    if (to - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
    i = from2;
    j = mid;
    k = from2;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2) {
    return function(fromOrdering) {
      return function(xs) {
        var out;
        if (xs.length < 2)
          return xs;
        out = xs.slice(0);
        mergeFromTo(compare2, fromOrdering, out, xs.slice(0), 0, xs.length);
        return out;
      };
    };
  };
}();

// output/Data.Array.ST/foreign.js
var sortByImpl2 = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from2, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from2 + (to - from2 >> 1);
    if (mid - from2 > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from2, mid);
    if (to - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
    i = from2;
    j = mid;
    k = from2;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2) {
    return function(fromOrdering) {
      return function(xs) {
        return function() {
          if (xs.length < 2)
            return xs;
          mergeFromTo(compare2, fromOrdering, xs, xs.slice(0), 0, xs.length);
          return xs;
        };
      };
    };
  };
}();

// output/Data.Array/index.js
var singleton2 = function(a) {
  return [a];
};
var $$null = function(xs) {
  return length(xs) === 0;
};
var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
var mapMaybe = function(f) {
  return concatMap(function() {
    var $191 = maybe([])(singleton2);
    return function($192) {
      return $191(f($192));
    };
  }());
};

// output/Data.String.Common/foreign.js
var replaceAll = function(s1) {
  return function(s2) {
    return function(s3) {
      return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2);
    };
  };
};
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};

// output/Data.String.Common/index.js
var $$null2 = function(s) {
  return s === "";
};

// output/Foreign/foreign.js
function typeOf(value) {
  return typeof value;
}
var isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

// output/Data.List.Types/index.js
var Nil = /* @__PURE__ */ function() {
  function Nil3() {
  }
  ;
  Nil3.value = new Nil3();
  return Nil3;
}();
var Cons = /* @__PURE__ */ function() {
  function Cons3(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Cons3.create = function(value0) {
    return function(value1) {
      return new Cons3(value0, value1);
    };
  };
  return Cons3;
}();

// output/Foreign/index.js
var unsafeToForeign = unsafeCoerce2;

// output/Node.FS.Sync/index.js
var show2 = /* @__PURE__ */ show(showEncoding);
var writeTextFile = function(encoding) {
  return function(file) {
    return function(text2) {
      return function() {
        return import_fs.writeFileSync(file, text2, {
          encoding: show2(encoding)
        });
      };
    };
  };
};

// output/Node.Path/foreign.js
var import_path = __toESM(require("path"), 1);
var normalize = import_path.default.normalize;
function concat5(segments) {
  return import_path.default.join.apply(this, segments);
}
var basename = import_path.default.basename;
var extname = import_path.default.extname;
var sep = import_path.default.sep;
var delimiter = import_path.default.delimiter;
var parse2 = import_path.default.parse;
var isAbsolute = import_path.default.isAbsolute;

// output/Halogen.VDom.Types/index.js
var map2 = /* @__PURE__ */ map(functorArray);
var map1 = /* @__PURE__ */ map(functorTuple);
var Text = /* @__PURE__ */ function() {
  function Text2(value0) {
    this.value0 = value0;
  }
  ;
  Text2.create = function(value0) {
    return new Text2(value0);
  };
  return Text2;
}();
var Elem = /* @__PURE__ */ function() {
  function Elem2(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  Elem2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new Elem2(value0, value1, value2, value3);
        };
      };
    };
  };
  return Elem2;
}();
var Keyed = /* @__PURE__ */ function() {
  function Keyed2(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  Keyed2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new Keyed2(value0, value1, value2, value3);
        };
      };
    };
  };
  return Keyed2;
}();
var Widget = /* @__PURE__ */ function() {
  function Widget2(value0) {
    this.value0 = value0;
  }
  ;
  Widget2.create = function(value0) {
    return new Widget2(value0);
  };
  return Widget2;
}();
var Grafted = /* @__PURE__ */ function() {
  function Grafted2(value0) {
    this.value0 = value0;
  }
  ;
  Grafted2.create = function(value0) {
    return new Grafted2(value0);
  };
  return Grafted2;
}();
var Graft = /* @__PURE__ */ function() {
  function Graft2(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  Graft2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new Graft2(value0, value1, value2);
      };
    };
  };
  return Graft2;
}();
var unGraft = function(f) {
  return function($61) {
    return f($61);
  };
};
var graft = unsafeCoerce2;
var bifunctorGraft = {
  bimap: function(f) {
    return function(g) {
      return unGraft(function(v) {
        return graft(new Graft(function($63) {
          return f(v.value0($63));
        }, function($64) {
          return g(v.value1($64));
        }, v.value2));
      });
    };
  }
};
var bimap2 = /* @__PURE__ */ bimap(bifunctorGraft);
var runGraft = /* @__PURE__ */ unGraft(function(v) {
  var go = function(v2) {
    if (v2 instanceof Text) {
      return new Text(v2.value0);
    }
    ;
    if (v2 instanceof Elem) {
      return new Elem(v2.value0, v2.value1, v.value0(v2.value2), map2(go)(v2.value3));
    }
    ;
    if (v2 instanceof Keyed) {
      return new Keyed(v2.value0, v2.value1, v.value0(v2.value2), map2(map1(go))(v2.value3));
    }
    ;
    if (v2 instanceof Widget) {
      return new Widget(v.value1(v2.value0));
    }
    ;
    if (v2 instanceof Grafted) {
      return new Grafted(bimap2(v.value0)(v.value1)(v2.value0));
    }
    ;
    throw new Error("Failed pattern match at Halogen.VDom.Types (line 86, column 7 - line 86, column 27): " + [v2.constructor.name]);
  };
  return go(v.value2);
});

// output/Web.DOM.Element/foreign.js
var getProp = function(name3) {
  return function(doctype) {
    return doctype[name3];
  };
};
var _namespaceURI = getProp("namespaceURI");
var _prefix = getProp("prefix");
var localName = getProp("localName");
var tagName = getProp("tagName");

// output/Web.DOM.ParentNode/foreign.js
var getEffProp = function(name3) {
  return function(node) {
    return function() {
      return node[name3];
    };
  };
};
var children = getEffProp("children");
var _firstElementChild = getEffProp("firstElementChild");
var _lastElementChild = getEffProp("lastElementChild");
var childElementCount = getEffProp("childElementCount");

// output/Foreign.Object/foreign.js
function toArrayWithKey(f) {
  return function(m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});

// output/Halogen.VDom.DOM.Prop/index.js
var Attribute = /* @__PURE__ */ function() {
  function Attribute2(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  Attribute2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new Attribute2(value0, value1, value2);
      };
    };
  };
  return Attribute2;
}();
var Property = /* @__PURE__ */ function() {
  function Property2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Property2.create = function(value0) {
    return function(value1) {
      return new Property2(value0, value1);
    };
  };
  return Property2;
}();
var Handler = /* @__PURE__ */ function() {
  function Handler2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Handler2.create = function(value0) {
    return function(value1) {
      return new Handler2(value0, value1);
    };
  };
  return Handler2;
}();
var Ref = /* @__PURE__ */ function() {
  function Ref2(value0) {
    this.value0 = value0;
  }
  ;
  Ref2.create = function(value0) {
    return new Ref2(value0);
  };
  return Ref2;
}();
var propFromString = unsafeCoerce2;

// output/Halogen.HTML.Core/index.js
var HTML = function(x) {
  return x;
};
var toPropValue = function(dict) {
  return dict.toPropValue;
};
var text = function($29) {
  return HTML(Text.create($29));
};
var prop = function(dictIsProp) {
  var toPropValue1 = toPropValue(dictIsProp);
  return function(v) {
    var $31 = Property.create(v);
    return function($32) {
      return $31(toPropValue1($32));
    };
  };
};
var isPropString = {
  toPropValue: propFromString
};
var isPropMediaType = {
  toPropValue: /* @__PURE__ */ function() {
    var $42 = unwrap();
    return function($43) {
      return propFromString($42($43));
    };
  }()
};
var element = function(ns) {
  return function(name3) {
    return function(props) {
      return function(children2) {
        return new Elem(ns, name3, props, children2);
      };
    };
  };
};
var attr = function(ns) {
  return function(v) {
    return Attribute.create(ns)(v);
  };
};

// output/Halogen.HTML.Elements/index.js
var element2 = /* @__PURE__ */ function() {
  return element(Nothing.value);
}();
var head = /* @__PURE__ */ element2("head");
var head_ = /* @__PURE__ */ head([]);
var html = /* @__PURE__ */ element2("html");
var link = function(props) {
  return element2("link")(props)([]);
};
var meta = function(props) {
  return element2("meta")(props)([]);
};
var script = /* @__PURE__ */ element2("script");
var title = /* @__PURE__ */ element2("title");
var title_ = /* @__PURE__ */ title([]);
var body = /* @__PURE__ */ element2("body");
var body_ = /* @__PURE__ */ body([]);

// output/Halogen.HTML.Properties/index.js
var prop2 = function(dictIsProp) {
  return prop(dictIsProp);
};
var prop22 = /* @__PURE__ */ prop2(isPropString);
var rel = /* @__PURE__ */ prop22("rel");
var src = /* @__PURE__ */ prop22("src");
var type_ = function(dictIsProp) {
  return prop2(dictIsProp)("type");
};
var name2 = /* @__PURE__ */ prop22("name");
var href = /* @__PURE__ */ prop22("href");
var charset = /* @__PURE__ */ prop22("charset");
var attr2 = /* @__PURE__ */ function() {
  return attr(Nothing.value);
}();

// output/Page/index.js
var type_2 = /* @__PURE__ */ type_(isPropMediaType);
var page = /* @__PURE__ */ html([/* @__PURE__ */ attr2("lang")("en")])([/* @__PURE__ */ head_([/* @__PURE__ */ meta([/* @__PURE__ */ charset("utf-8")]), /* @__PURE__ */ meta([/* @__PURE__ */ name2("viewport"), /* @__PURE__ */ attr2("content")("width=device-width, initial-scale=1.0")]), /* @__PURE__ */ title_([/* @__PURE__ */ text("Wisconsin Court System - Log in to Wisconsin eCourts")]), /* @__PURE__ */ link([/* @__PURE__ */ rel("icon"), /* @__PURE__ */ href("/classpath/common/images/lady-justice.png"), /* @__PURE__ */ type_2("image/png")]), /* @__PURE__ */ link([/* @__PURE__ */ rel("stylesheet"), /* @__PURE__ */ href("/webjars/font-awesome/4.4.0/css/font-awesome.min.css"), /* @__PURE__ */ type_2("text/css")]), /* @__PURE__ */ link([/* @__PURE__ */ rel("stylesheet"), /* @__PURE__ */ href("/stylesheets/default.css"), /* @__PURE__ */ type_2("text/css")]), /* @__PURE__ */ script([/* @__PURE__ */ src("https://js.hcaptcha.com/1/api.js?render=explicit"), /* @__PURE__ */ attr2("async")("async"), /* @__PURE__ */ attr2("defer")("defer")])([]), /* @__PURE__ */ script([/* @__PURE__ */ src("/js/commons.packed.js")])([]), /* @__PURE__ */ script([/* @__PURE__ */ src("/js/index.packed.js")])([])]), /* @__PURE__ */ body_([])]);

// output/Render/foreign.js
var pretty = require_pretty();
function _pretty(str) {
  return () => {
    return pretty(str);
  };
}

// output/Data.Map.Internal/index.js
var Leaf = /* @__PURE__ */ function() {
  function Leaf2() {
  }
  ;
  Leaf2.value = new Leaf2();
  return Leaf2;
}();
var Two = /* @__PURE__ */ function() {
  function Two2(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  Two2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new Two2(value0, value1, value2, value3);
        };
      };
    };
  };
  return Two2;
}();
var Three = /* @__PURE__ */ function() {
  function Three2(value0, value1, value2, value3, value4, value5, value6) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }
  ;
  Three2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return function(value6) {
                return new Three2(value0, value1, value2, value3, value4, value5, value6);
              };
            };
          };
        };
      };
    };
  };
  return Three2;
}();
var TwoLeft = /* @__PURE__ */ function() {
  function TwoLeft2(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  TwoLeft2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new TwoLeft2(value0, value1, value2);
      };
    };
  };
  return TwoLeft2;
}();
var TwoRight = /* @__PURE__ */ function() {
  function TwoRight2(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  TwoRight2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new TwoRight2(value0, value1, value2);
      };
    };
  };
  return TwoRight2;
}();
var ThreeLeft = /* @__PURE__ */ function() {
  function ThreeLeft2(value0, value1, value2, value3, value4, value5) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }
  ;
  ThreeLeft2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return new ThreeLeft2(value0, value1, value2, value3, value4, value5);
            };
          };
        };
      };
    };
  };
  return ThreeLeft2;
}();
var ThreeMiddle = /* @__PURE__ */ function() {
  function ThreeMiddle2(value0, value1, value2, value3, value4, value5) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }
  ;
  ThreeMiddle2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return new ThreeMiddle2(value0, value1, value2, value3, value4, value5);
            };
          };
        };
      };
    };
  };
  return ThreeMiddle2;
}();
var ThreeRight = /* @__PURE__ */ function() {
  function ThreeRight2(value0, value1, value2, value3, value4, value5) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }
  ;
  ThreeRight2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return new ThreeRight2(value0, value1, value2, value3, value4, value5);
            };
          };
        };
      };
    };
  };
  return ThreeRight2;
}();
var KickUp = /* @__PURE__ */ function() {
  function KickUp2(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  KickUp2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new KickUp2(value0, value1, value2, value3);
        };
      };
    };
  };
  return KickUp2;
}();
var lookup2 = function(dictOrd) {
  var compare2 = compare(dictOrd);
  return function(k) {
    var go = function($copy_v) {
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v) {
        if (v instanceof Leaf) {
          $tco_done = true;
          return Nothing.value;
        }
        ;
        if (v instanceof Two) {
          var v2 = compare2(k)(v.value1);
          if (v2 instanceof EQ) {
            $tco_done = true;
            return new Just(v.value2);
          }
          ;
          if (v2 instanceof LT) {
            $copy_v = v.value0;
            return;
          }
          ;
          $copy_v = v.value3;
          return;
        }
        ;
        if (v instanceof Three) {
          var v3 = compare2(k)(v.value1);
          if (v3 instanceof EQ) {
            $tco_done = true;
            return new Just(v.value2);
          }
          ;
          var v4 = compare2(k)(v.value4);
          if (v4 instanceof EQ) {
            $tco_done = true;
            return new Just(v.value5);
          }
          ;
          if (v3 instanceof LT) {
            $copy_v = v.value0;
            return;
          }
          ;
          if (v4 instanceof GT) {
            $copy_v = v.value6;
            return;
          }
          ;
          $copy_v = v.value3;
          return;
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 241, column 5 - line 241, column 22): " + [v.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($copy_v);
      }
      ;
      return $tco_result;
    };
    return go;
  };
};
var member = function(dictOrd) {
  var lookup1 = lookup2(dictOrd);
  return function(k) {
    return function(m) {
      return isJust(lookup1(k)(m));
    };
  };
};
var fromZipper = function($copy_dictOrd) {
  return function($copy_v) {
    return function($copy_v1) {
      var $tco_var_dictOrd = $copy_dictOrd;
      var $tco_var_v = $copy_v;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(dictOrd, v, v1) {
        if (v instanceof Nil) {
          $tco_done = true;
          return v1;
        }
        ;
        if (v instanceof Cons) {
          if (v.value0 instanceof TwoLeft) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Two(v1, v.value0.value0, v.value0.value1, v.value0.value2);
            return;
          }
          ;
          if (v.value0 instanceof TwoRight) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Two(v.value0.value0, v.value0.value1, v.value0.value2, v1);
            return;
          }
          ;
          if (v.value0 instanceof ThreeLeft) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Three(v1, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5);
            return;
          }
          ;
          if (v.value0 instanceof ThreeMiddle) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v1, v.value0.value3, v.value0.value4, v.value0.value5);
            return;
          }
          ;
          if (v.value0 instanceof ThreeRight) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5, v1);
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 462, column 3 - line 467, column 88): " + [v.value0.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 459, column 1 - line 459, column 80): " + [v.constructor.name, v1.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_dictOrd, $tco_var_v, $copy_v1);
      }
      ;
      return $tco_result;
    };
  };
};
var insert = function(dictOrd) {
  var fromZipper1 = fromZipper(dictOrd);
  var compare2 = compare(dictOrd);
  return function(k) {
    return function(v) {
      var up = function($copy_v1) {
        return function($copy_v2) {
          var $tco_var_v1 = $copy_v1;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v1, v2) {
            if (v1 instanceof Nil) {
              $tco_done = true;
              return new Two(v2.value0, v2.value1, v2.value2, v2.value3);
            }
            ;
            if (v1 instanceof Cons) {
              if (v1.value0 instanceof TwoLeft) {
                $tco_done = true;
                return fromZipper1(v1.value1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, v1.value0.value0, v1.value0.value1, v1.value0.value2));
              }
              ;
              if (v1.value0 instanceof TwoRight) {
                $tco_done = true;
                return fromZipper1(v1.value1)(new Three(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0, v2.value1, v2.value2, v2.value3));
              }
              ;
              if (v1.value0 instanceof ThreeLeft) {
                $tco_var_v1 = v1.value1;
                $copy_v2 = new KickUp(new Two(v2.value0, v2.value1, v2.value2, v2.value3), v1.value0.value0, v1.value0.value1, new Two(v1.value0.value2, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                return;
              }
              ;
              if (v1.value0 instanceof ThreeMiddle) {
                $tco_var_v1 = v1.value1;
                $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0), v2.value1, v2.value2, new Two(v2.value3, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                return;
              }
              ;
              if (v1.value0 instanceof ThreeRight) {
                $tco_var_v1 = v1.value1;
                $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v1.value0.value3), v1.value0.value4, v1.value0.value5, new Two(v2.value0, v2.value1, v2.value2, v2.value3));
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 5 - line 503, column 108): " + [v1.value0.constructor.name, v2.constructor.name]);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 3 - line 495, column 56): " + [v1.constructor.name, v2.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_v1, $copy_v2);
          }
          ;
          return $tco_result;
        };
      };
      var down = function($copy_v1) {
        return function($copy_v2) {
          var $tco_var_v1 = $copy_v1;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(v1, v2) {
            if (v2 instanceof Leaf) {
              $tco_done1 = true;
              return up(v1)(new KickUp(Leaf.value, k, v, Leaf.value));
            }
            ;
            if (v2 instanceof Two) {
              var v3 = compare2(k)(v2.value1);
              if (v3 instanceof EQ) {
                $tco_done1 = true;
                return fromZipper1(v1)(new Two(v2.value0, k, v, v2.value3));
              }
              ;
              if (v3 instanceof LT) {
                $tco_var_v1 = new Cons(new TwoLeft(v2.value1, v2.value2, v2.value3), v1);
                $copy_v2 = v2.value0;
                return;
              }
              ;
              $tco_var_v1 = new Cons(new TwoRight(v2.value0, v2.value1, v2.value2), v1);
              $copy_v2 = v2.value3;
              return;
            }
            ;
            if (v2 instanceof Three) {
              var v3 = compare2(k)(v2.value1);
              if (v3 instanceof EQ) {
                $tco_done1 = true;
                return fromZipper1(v1)(new Three(v2.value0, k, v, v2.value3, v2.value4, v2.value5, v2.value6));
              }
              ;
              var v4 = compare2(k)(v2.value4);
              if (v4 instanceof EQ) {
                $tco_done1 = true;
                return fromZipper1(v1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, k, v, v2.value6));
              }
              ;
              if (v3 instanceof LT) {
                $tco_var_v1 = new Cons(new ThreeLeft(v2.value1, v2.value2, v2.value3, v2.value4, v2.value5, v2.value6), v1);
                $copy_v2 = v2.value0;
                return;
              }
              ;
              if (v3 instanceof GT && v4 instanceof LT) {
                $tco_var_v1 = new Cons(new ThreeMiddle(v2.value0, v2.value1, v2.value2, v2.value4, v2.value5, v2.value6), v1);
                $copy_v2 = v2.value3;
                return;
              }
              ;
              $tco_var_v1 = new Cons(new ThreeRight(v2.value0, v2.value1, v2.value2, v2.value3, v2.value4, v2.value5), v1);
              $copy_v2 = v2.value6;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 478, column 3 - line 478, column 55): " + [v1.constructor.name, v2.constructor.name]);
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_v1, $copy_v2);
          }
          ;
          return $tco_result;
        };
      };
      return down(Nil.value);
    };
  };
};
var empty3 = /* @__PURE__ */ function() {
  return Leaf.value;
}();

// output/Data.Set/index.js
var member2 = function(dictOrd) {
  var member1 = member(dictOrd);
  return function(a) {
    return function(v) {
      return member1(a)(v);
    };
  };
};
var insert2 = function(dictOrd) {
  var insert1 = insert(dictOrd);
  return function(a) {
    return function(v) {
      return insert1(a)(unit)(v);
    };
  };
};
var empty4 = empty3;
var fromFoldable3 = function(dictFoldable) {
  var foldl2 = foldl(dictFoldable);
  return function(dictOrd) {
    var insert1 = insert2(dictOrd);
    return foldl2(function(m) {
      return function(a) {
        return insert1(a)(m);
      };
    })(empty4);
  };
};

// output/Data.String.Regex/foreign.js
var regexImpl = function(left) {
  return function(right) {
    return function(s1) {
      return function(s2) {
        try {
          return right(new RegExp(s1, s2));
        } catch (e) {
          return left(e.message);
        }
      };
    };
  };
};
var _replaceBy = function(just) {
  return function(nothing) {
    return function(r) {
      return function(f) {
        return function(s) {
          return s.replace(r, function(match) {
            var groups = [];
            var group2, i = 1;
            while (typeof (group2 = arguments[i++]) !== "number") {
              groups.push(group2 == null ? nothing : just(group2));
            }
            return f(match)(groups);
          });
        };
      };
    };
  };
};

// output/Data.String.Regex.Flags/index.js
var global = {
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  sticky: false,
  unicode: false
};

// output/Data.String.Regex/index.js
var replace$prime = /* @__PURE__ */ function() {
  return _replaceBy(Just.create)(Nothing.value);
}();
var renderFlags = function(v) {
  return function() {
    if (v.global) {
      return "g";
    }
    ;
    return "";
  }() + (function() {
    if (v.ignoreCase) {
      return "i";
    }
    ;
    return "";
  }() + (function() {
    if (v.multiline) {
      return "m";
    }
    ;
    return "";
  }() + (function() {
    if (v.dotAll) {
      return "s";
    }
    ;
    return "";
  }() + (function() {
    if (v.sticky) {
      return "y";
    }
    ;
    return "";
  }() + function() {
    if (v.unicode) {
      return "u";
    }
    ;
    return "";
  }()))));
};
var regex = function(s) {
  return function(f) {
    return regexImpl(Left.create)(Right.create)(s)(renderFlags(f));
  };
};

// output/Data.String.Regex.Unsafe/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
var unsafeRegex = function(s) {
  return function(f) {
    return either(unsafeCrashWith)(identity3)(regex(s)(f));
  };
};

// output/Halogen.VDom.StringRenderer.Util/index.js
var escapeRegex = /* @__PURE__ */ unsafeRegex(`[\\"\\'/&<>]`)(global);
var escapeChar = function(v) {
  if (v === '"') {
    return "&quot;";
  }
  ;
  if (v === "'") {
    return "&#39;";
  }
  ;
  if (v === "/") {
    return "&#x2F;";
  }
  ;
  if (v === "&") {
    return "&amp;";
  }
  ;
  if (v === "<") {
    return "&lt;";
  }
  ;
  if (v === ">") {
    return "&gt;";
  }
  ;
  return v;
};
var $$escape = /* @__PURE__ */ replace$prime(escapeRegex)(function($3) {
  return $$const(escapeChar($3));
});
var attrEscapeRegex = /* @__PURE__ */ unsafeRegex(`[\\"\\'<>]`)(global);
var attrEscape = /* @__PURE__ */ replace$prime(attrEscapeRegex)(function($4) {
  return $$const(escapeChar($4));
});

// output/Halogen.VDom.StringRenderer/index.js
var map3 = /* @__PURE__ */ map(functorArray);
var NormalTag = /* @__PURE__ */ function() {
  function NormalTag2() {
  }
  ;
  NormalTag2.value = new NormalTag2();
  return NormalTag2;
}();
var SelfClosingTag = /* @__PURE__ */ function() {
  function SelfClosingTag2() {
  }
  ;
  SelfClosingTag2.value = new SelfClosingTag2();
  return SelfClosingTag2;
}();
var eqTagType = {
  eq: function(x) {
    return function(y) {
      if (x instanceof NormalTag && y instanceof NormalTag) {
        return true;
      }
      ;
      if (x instanceof SelfClosingTag && y instanceof SelfClosingTag) {
        return true;
      }
      ;
      return false;
    };
  }
};
var eq2 = /* @__PURE__ */ eq(eqTagType);
var render = function(getTagType2) {
  return function(renderAttrs) {
    return function(renderWidget2) {
      var renderElement = function(maybeNamespace) {
        return function(v) {
          return function(attrs) {
            return function(children2) {
              var as = renderAttrs(attrs);
              var as$prime = maybe(as)(function(v1) {
                return 'xmlns="' + ($$escape(v1) + ('"' + function() {
                  var $19 = $$null2(as);
                  if ($19) {
                    return "";
                  }
                  ;
                  return " " + as;
                }()));
              })(maybeNamespace);
              return "<" + (v + (function() {
                var $20 = $$null2(as$prime);
                if ($20) {
                  return "";
                }
                ;
                return " ";
              }() + (as$prime + function() {
                var $21 = $$null(children2);
                if ($21) {
                  var $22 = eq2(getTagType2(v))(SelfClosingTag.value);
                  if ($22) {
                    return "/>";
                  }
                  ;
                  return "></" + (v + ">");
                }
                ;
                return ">" + (joinWith("")(map3(go)(children2)) + ("</" + (v + ">")));
              }())));
            };
          };
        };
      };
      var go = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v) {
          if (v instanceof Text) {
            $tco_done = true;
            return $$escape(v.value0);
          }
          ;
          if (v instanceof Elem) {
            $tco_done = true;
            return renderElement(v.value0)(v.value1)(v.value2)(v.value3);
          }
          ;
          if (v instanceof Keyed) {
            $tco_done = true;
            return renderElement(v.value0)(v.value1)(v.value2)(map3(snd)(v.value3));
          }
          ;
          if (v instanceof Widget) {
            $tco_done = true;
            return renderWidget2(v.value0);
          }
          ;
          if (v instanceof Grafted) {
            $copy_v = runGraft(v.value0);
            return;
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.StringRenderer (line 36, column 8 - line 41, column 32): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($copy_v);
        }
        ;
        return $tco_result;
      };
      return go;
    };
  };
};

// output/Halogen.VDom.DOM.StringRenderer/index.js
var show3 = /* @__PURE__ */ show(showString);
var member3 = /* @__PURE__ */ member2(ordString);
var voidElements = /* @__PURE__ */ function() {
  var names = ["area", "base", "br", "col", "embed", "hr", "img", "input", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr"];
  return fromFoldable3(foldableArray)(ordString)(names);
}();
var renderAttr = function(name3) {
  return function(value) {
    return new Just(attrEscape(name3) + ('="' + (attrEscape(value) + '"')));
  };
};
var propNameToAttrName = function(v) {
  if (v === "htmlFor") {
    return "for";
  }
  ;
  if (v === "className") {
    return "class";
  }
  ;
  return v;
};
var renderProperty = function(name3) {
  return function(prop3) {
    var name$prime = propNameToAttrName(name3);
    var v = typeOf(unsafeToForeign(prop3));
    if (v === "string") {
      return renderAttr(name$prime)(prop3);
    }
    ;
    if (v === "number") {
      return renderAttr(name$prime)(show3(prop3));
    }
    ;
    if (v === "boolean") {
      return new Just($$escape(name$prime));
    }
    ;
    return Nothing.value;
  };
};
var renderProp = function(v) {
  if (v instanceof Attribute) {
    return renderAttr(v.value1)(v.value2);
  }
  ;
  if (v instanceof Property) {
    return renderProperty(v.value0)(v.value1);
  }
  ;
  if (v instanceof Handler) {
    return Nothing.value;
  }
  ;
  if (v instanceof Ref) {
    return Nothing.value;
  }
  ;
  throw new Error("Failed pattern match at Halogen.VDom.DOM.StringRenderer (line 27, column 14 - line 31, column 18): " + [v.constructor.name]);
};
var renderProps = /* @__PURE__ */ function() {
  var $22 = joinWith(" ");
  var $23 = mapMaybe(renderProp);
  return function($24) {
    return $22($23($24));
  };
}();
var getTagType = function(v) {
  if (member3(v)(voidElements)) {
    return SelfClosingTag.value;
  }
  ;
  if (otherwise) {
    return NormalTag.value;
  }
  ;
  throw new Error("Failed pattern match at Halogen.VDom.DOM.StringRenderer (line 18, column 1 - line 18, column 36): " + [v.constructor.name]);
};
var render2 = function(renderWidget2) {
  return render(getTagType)(renderProps)(renderWidget2);
};

// output/Render/index.js
var unwrap2 = /* @__PURE__ */ unwrap();
var render3 = function(html2) {
  return replaceAll("&#x2F;")("/")(render2($$const("<!-- I do not know how to render a widget -->"))(unwrap2(html2)));
};
var prependDocType = /* @__PURE__ */ append(semigroupString)("<!DOCTYPE html>");

// output/Effect.Class.Console/index.js
var error3 = function(dictMonadEffect) {
  var $59 = liftEffect(dictMonadEffect);
  return function($60) {
    return $59(error2($60));
  };
};

// output/Node.Process/foreign.js
var import_process = __toESM(require("process"), 1);
function exit(code) {
  return () => {
    import_process.default.exit(code);
  };
}

// output/Util/index.js
var bind2 = /* @__PURE__ */ bind(bindAff);
var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
var error4 = /* @__PURE__ */ error3(monadEffectEffect);
var pure2 = /* @__PURE__ */ pure(applicativeAff);
var processResult = function(r) {
  return bind2(runExceptT(r))(function(e) {
    return either(function(s) {
      return liftEffect2(function __do2() {
        error4("ERROR: " + s)();
        return exit(1)();
      });
    })(pure2)(e);
  });
};
var liftEffectSafely = /* @__PURE__ */ function() {
  var $11 = map(functorEffect)(lmap(bifunctorEither)(message));
  var $12 = $$try(monadErrorEffect);
  return function($13) {
    return ExceptT(liftEffect2($11($12($13))));
  };
}();

// output/Main/index.js
var writeOutput = /* @__PURE__ */ function() {
  var $4 = writeTextFile(UTF8.value)(concat5(["/tmp", "vdom.html"]));
  return function($5) {
    return liftEffectSafely($4($5));
  };
}();
var main = function __do() {
  var html2 = _pretty(prependDocType(render3(page)))();
  log(html2)();
  return launchAff_(processResult(writeOutput(html2)))();
};

// index.js
main();
/*! Bundled license information:

is-whitespace/index.js:
  (*!
   * is-whitespace <https://github.com/jonschlinkert/is-whitespace>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

is-extendable/index.js:
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

condense-newlines/index.js:
  (*!
   * condense-newlines <https://github.com/jonschlinkert/condense-newlines>
   *
   * Copyright (c) 2014 Jon Schlinkert, contributors.
   * Licensed under the MIT License
   *)

pretty/index.js:
  (*!
   * pretty <https://github.com/jonschlinkert/pretty>
   *
   * Copyright (c) 2013-2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
