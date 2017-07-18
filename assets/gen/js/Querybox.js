webpackJsonpCoveo__temporary([37],{

/***/ 429:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var s in e)e.hasOwnProperty(s)&&(t[s]=e[s]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},Coveo;!function(t){var e;!function(t){var e=function(){function e(t,e,n){var s=this;this.expression=e,this.input=n,_.isString(t)?this.value=t:_.isArray(t)&&(this.subResults=t,_.forEach(this.subResults,function(t){t.parent=s}))}return e.prototype.isSuccess=function(){return null!=this.value||null!=this.subResults&&_.all(this.subResults,function(t){return t.isSuccess()})},e.prototype.path=function(t){var e=null!=this.parent&&this.parent!=t?this.parent.path(t):[];return e.push(this),e},e.prototype.findParent=function(t){for(var e=this,n=_.isString(t)?function(e){return t==e.expression.id}:t;null!=e&&!n(e);)e=e.parent;return e},e.prototype.find=function(t){var e=_.isString(t)?function(e){return t==e.expression.id}:t;if(e(this))return this;if(this.subResults)for(var n=0;n<this.subResults.length;n++){var s=this.subResults[n].find(e);if(s)return s}return null},e.prototype.findAll=function(t){var e=[],n=_.isString(t)?function(e){return t==e.expression.id}:t;return n(this)&&e.push(this),this.subResults&&(e=_.reduce(this.subResults,function(t,e){return t.concat(e.findAll(n))},e)),e},e.prototype.resultAt=function(t,e){if(t<0||t>this.getLength())return[];if(null!=e){if(_.isString(e)){if(e==this.expression.id)return[this]}else if(e(this))return[this]}else{var n=null==this.value&&null==this.subResults?this.input:this.value;if(null!=n)return[this]}if(null!=this.subResults){for(var s=[],i=0;i<this.subResults.length;i++){var o=this.subResults[i];if(s=s.concat(o.resultAt(t,e)),t-=o.getLength(),t<0)break}return s}return[]},e.prototype.getExpect=function(){return null==this.value&&null==this.subResults?[this]:null!=this.subResults?_.reduce(this.subResults,function(t,e){return t.concat(e.getExpect())},[]):[]},e.prototype.getBestExpect=function(){var t=this.getExpect(),e=_.groupBy(t,function(t){return t.input}),n=_.last(_.keys(e).sort(function(t,e){return e.length-t.length})),s=e[n],e=_.groupBy(s,function(t){return t.expression.id});return _.map(e,function(t){return _.chain(t).map(function(t){return{path:t.path().length,result:t}}).sortBy("path").pluck("result").first().value()})},e.prototype.getHumanReadableExpect=function(){var t=this.getBestExpect(),e=t.length>0?_.last(t).input:"";return"Expected "+_.map(t,function(t){return t.getHumanReadable()}).join(" or ")+" but "+(e.length>0?JSON.stringify(e[0]):"end of input")+" found."},e.prototype.before=function(){if(null==this.parent)return"";var t=_.indexOf(this.parent.subResults,this);return this.parent.before()+_.chain(this.parent.subResults).first(t).map(function(t){return t.toString()}).join("").value()},e.prototype.after=function(){if(null==this.parent)return"";var t=_.indexOf(this.parent.subResults,this);return _.chain(this.parent.subResults).last(this.parent.subResults.length-t-1).map(function(t){return t.toString()}).join("").value()+this.parent.after()},e.prototype.getLength=function(){return null!=this.value?this.value.length:null!=this.subResults?_.reduce(this.subResults,function(t,e){return t+e.getLength()},0):this.input.length},e.prototype.toHtmlElement=function(){var t=document.createElement("span"),e=null!=this.expression?this.expression.id:null;return null!=e&&t.setAttribute("data-id",e),t.setAttribute("data-success",this.isSuccess().toString()),null!=this.value?(t.appendChild(document.createTextNode(this.value)),t.setAttribute("data-value",this.value)):null!=this.subResults?_.each(this.subResults,function(e){t.appendChild(e.toHtmlElement())}):(t.appendChild(document.createTextNode(this.input)),t.setAttribute("data-input",this.input),t.className="magic-box-error"+(this.input.length>0?"":" magic-box-error-empty")),t.result=this,t},e.prototype.clean=function(t){if(null!=t||!this.isSuccess()){t=t||_.last(this.getBestExpect()).path(this);var n=_.first(t);if(null!=n){var s=_.indexOf(this.subResults,n),i=s==-1?[]:_.map(_.first(this.subResults,s),function(t){return t.clean()});return i.push(n.clean(_.rest(t))),new e(i,this.expression,this.input)}return new e(null,this.expression,this.input)}return null!=this.value?new e(this.value,this.expression,this.input):null!=this.subResults?new e(_.map(this.subResults,function(t){return t.clean()}),this.expression,this.input):void 0},e.prototype.clone=function(){return null!=this.value?new e(this.value,this.expression,this.input):null!=this.subResults?new e(_.map(this.subResults,function(t){return t.clone()}),this.expression,this.input):new e(null,this.expression,this.input)},e.prototype.toString=function(){return null!=this.value?this.value:null!=this.subResults?_.map(this.subResults,function(t){return t.toString()}).join(""):this.input},e.prototype.getHumanReadable=function(){return this.expression instanceof t.ExpressionConstant?JSON.stringify(this.expression.value):this.expression.id},e}();t.Result=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(e){function n(n){e.call(this,[n],t.ExpressionEndOfInput,n.input);var s=new t.Result(null,t.ExpressionEndOfInput,n.input.substr(n.getLength()));s.parent=this,this.subResults.push(s)}return __extends(n,e),n}(t.Result);t.EndOfInputResult=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(e){function n(t,n,s,i){var o=this;e.call(this,null!=t?[t]:null,n,s),this.result=t,this.expression=n,this.input=s,this.failAttempt=i,_.forEach(this.failAttempt,function(t){t.parent=o})}return __extends(n,e),n.prototype.getExpect=function(){var t=this,e=[];return null!=this.result&&(e=this.result.getExpect()),e=_.reduce(this.failAttempt,function(t,e){return t.concat(e.getExpect())},e),e.length>0&&_.all(e,function(e){return e.input==t.input})?[this]:e},n.prototype.clean=function(e){if(null!=e||!this.isSuccess()){e=_.rest(e||_.last(this.getBestExpect()).path(this));var n=_.first(e);return null==n?new t.Result(null,this.expression,this.input):new t.Result([n.clean(_.rest(e))],this.expression,this.input)}return new t.Result(_.map(this.result.subResults,function(t){return t.clean()}),this.expression,this.input)},n}(t.Result);t.OptionResult=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(e){function n(t,n,s,i){e.call(this,t,n,s),this.results=t,this.expression=n,this.input=s,_.last(t)!=i&&(this.failAttempt=i,null!=this.failAttempt&&(this.failAttempt.parent=this))}return __extends(n,e),n.prototype.getExpect=function(){var t=e.prototype.getExpect.call(this);return null!=this.failAttempt?t.concat(this.failAttempt.getExpect()):t},n.prototype.clean=function(n){if(null!=this.failAttempt&&(null!=n||!this.isSuccess())){n=n||_.last(this.getBestExpect()).path(this);var s=_.first(n);if(null!=s&&s==this.failAttempt){var i=_.last(this.subResults),o=_.map(null!=i&&i.isSuccess()?this.subResults:_.initial(this.subResults),function(t){return t.clean()});return o.push(s.clean(_.rest(n))),new t.Result(o,this.expression,this.input)}}return e.prototype.clean.call(this,n)},n}(t.Result);t.RefResult=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function e(t,e){this.value=t,this.id=e}return e.prototype.parse=function(e,n){var s=0==e.indexOf(this.value),i=new t.Result(s?this.value:null,this,e);return s&&n&&e.length>this.value.length?new t.EndOfInputResult(i):i},e.prototype.toString=function(){return this.value},e}();t.ExpressionConstant=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){t.ExpressionEndOfInput={id:"end of input",parse:null}}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function t(t,e,n){this.func=t,this.id=e,this.grammar=n}return t.prototype.parse=function(t,e){return this.func(t,e,this)},t.prototype.toString=function(){return this.id},t}();t.ExpressionFunction=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function e(t,e){if(this.parts=t,this.id=e,0==t.length)throw JSON.stringify(e)+" should have at least 1 parts"}return e.prototype.parse=function(e,n){for(var s,i=[],o=e,r=0;r<this.parts.length;r++){var u=this.parts[r];if(s=u.parse(o,n&&r==this.parts.length-1),i.push(s),!s.isSuccess())break;o=o.substr(s.getLength())}return new t.Result(i,this,e)},e.prototype.toString=function(){return this.id},e}();t.ExpressionList=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function e(t,e){this.parts=t,this.id=e}return e.prototype.parse=function(e,n){for(var s=[],i=0;i<this.parts.length;i++){var o=this.parts[i].parse(e,n);if(o.isSuccess())return new t.OptionResult(o,this,e,s);s.push(o)}return new t.OptionResult(null,this,e,s)},e.prototype.toString=function(){return this.id},e}();t.ExpressionOptions=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function e(t,e,n,s){this.ref=t,this.occurrence=e,this.id=n,this.grammar=s}return e.prototype.parse=function(t,e){var n=this.grammar.getExpression(this.ref);if(null==n)throw"Expression not found:"+this.ref;return"?"==this.occurrence||null==this.occurrence?this.parseOnce(t,e,n):this.parseMany(t,e,n)},e.prototype.parseOnce=function(e,n,s){var i=s.parse(e,n),o=i.isSuccess();return o||"?"!=this.occurrence?new t.RefResult([i],this,e,o?null:i):n?0==e.length?new t.RefResult([],this,e,i):_.all(i.getBestExpect(),function(e){return e.expression==t.ExpressionEndOfInput})?new t.RefResult([new t.Result(null,t.ExpressionEndOfInput,e)],this,e,i):i:new t.RefResult([],this,e,null)},e.prototype.parseMany=function(e,n,s){var i,o,r=[],u=e;do i=s.parse(u,!1),o=i.isSuccess(),o&&(r.push(i),u=u.substr(i.getLength()));while(o&&i.input!=u);var a=_.isNumber(this.occurrence)?this.occurrence:"+"==this.occurrence?1:0;if(r.length<a)r.push(i);else if(n)if(r.length>0){var l=_.last(r);i=s.parse(l.input,!0),i.isSuccess()?r[r.length-1]=i:(r.push(new t.Result(null,t.ExpressionEndOfInput,l.input.substr(l.getLength()))),i=s.parse(l.input.substr(l.getLength()),!0))}else if(0!=e.length){var p=new t.Result(null,t.ExpressionEndOfInput,e);return new t.RefResult([p],this,e,i)}return new t.RefResult(r,this,e,i)},e.prototype.toString=function(){return this.id},e}();t.ExpressionRef=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function e(t,e,n){this.value=t,this.id=e}return e.prototype.parse=function(e,n){var s=e.match(this.value);null!=s&&0!=s.index&&(s=null);var i=new t.Result(null!=s?s[0]:null,this,e);return i.isSuccess()&&n&&e.length>i.value.length?new t.EndOfInputResult(i):i},e.prototype.toString=function(){return this.id},e}();t.ExpressionRegExp=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function e(e,n){void 0===n&&(n={}),this.expressions={},this.start=new t.ExpressionRef(e,null,"start",this),this.addExpressions(n)}return e.prototype.addExpressions=function(t){var e=this;_.each(t,function(t,n){e.addExpression(n,t)})},e.prototype.addExpression=function(t,n){if(t in this.expressions)throw"Grammar already contain the id:"+t;this.expressions[t]=e.buildExpression(n,t,this)},e.prototype.getExpression=function(t){return this.expressions[t]},e.prototype.parse=function(t){return this.start.parse(t,!0)},e.buildExpression=function(e,n,s){var i=typeof e;if("undefined"==i)throw"Invalid Expression: "+e;if(_.isString(e))return this.buildStringExpression(e,n,s);if(_.isArray(e))return new t.ExpressionOptions(_.map(e,function(e,i){return new t.ExpressionRef(e,null,n+"_"+i,s)}),n);if(_.isRegExp(e))return new t.ExpressionRegExp(e,n,s);if(_.isFunction(e))return new t.ExpressionFunction(e,n,s);throw"Invalid Expression: "+e},e.buildStringExpression=function(n,s,i){var o=e.stringMatch(n,e.spliter),r=_.map(o,function(e,n){if(e[1]){var o=e[1],r=e[3]?Number(e[3]):e[2]||null;return new t.ExpressionRef(o,r,s+"_"+n,i)}return new t.ExpressionConstant(e[4],s+"_"+n)});if(1==r.length){var u=r[0];return u.id=s,u}return new t.ExpressionList(r,s)},e.stringMatch=function(t,e){for(var n,s=[],i=new RegExp(e.source,"g");null!==(n=i.exec(t));)s.push(n);return s},e.spliter=/\[(\w+)(\*|\+|\?|\{([1-9][0-9]*)\})?\]|(.[^\[]*)/,e}();t.Grammar=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function e(e,n,s){this.element=e,this.onchange=n,this.magicBox=s,this.hasFocus=!1,this.justPressedTab=!1,this.underlay=document.createElement("div"),this.underlay.className="magic-box-underlay",this.highlightContainer=document.createElement("span"),this.highlightContainer.className="magic-box-highlight-container",this.underlay.appendChild(this.highlightContainer),this.ghostTextContainer=document.createElement("span"),this.ghostTextContainer.className="magic-box-ghost-text",this.underlay.appendChild(this.ghostTextContainer),this.input=t.$$(e).find("input"),this.input?e.insertBefore(this.underlay,this.input):(this.input=document.createElement("input"),e.appendChild(this.underlay),e.appendChild(this.input)),this.input.spellcheck=!1,this.input.setAttribute("form","coveo-dummy-form"),this.input.setAttribute("autocomplete","off"),this.setupHandler()}return e.prototype.updateInput=function(){this.input.value!=this.result.input&&(this.input.value=this.result.input,this.hasFocus&&this.setCursor(this.getValue().length))},e.prototype.updateHighlight=function(){this.highlightContainer.innerHTML="",this.highlightContainer.appendChild(this.result.toHtmlElement())},e.prototype.updateWordCompletion=function(){this.ghostTextContainer.innerHTML="",null!=this.wordCompletion&&this.ghostTextContainer.appendChild(document.createTextNode(this.wordCompletion.substr(this.result.input.length)))},e.prototype.updateScroll=function(e){var n=this;void 0===e&&(e=!0);var s=function(){n.underlay.clientWidth<n.underlay.scrollWidth&&(n.underlay.style.visibility="hidden",n.underlay.scrollLeft=n.input.scrollLeft,n.underlay.scrollTop=n.input.scrollTop,n.underlay.style.visibility="visible"),n.updateScrollDefer=null,n.hasFocus&&n.updateScroll()};e?null==this.updateScrollDefer&&(this.updateScrollDefer=t.requestAnimationFrame(s)):s()},e.prototype.setResult=function(t,e){this.result=t,this.updateInput(),this.updateHighlight(),_.isUndefined(e)&&null!=this.wordCompletion&&0==this.wordCompletion.indexOf(this.result.input)?this.updateWordCompletion():this.setWordCompletion(e),this.updateScroll()},e.prototype.setWordCompletion=function(t){null!=t&&0!=t.toLowerCase().indexOf(this.result.input.toLowerCase())&&(t=null),this.wordCompletion=t,this.updateWordCompletion(),this.updateScroll()},e.prototype.setCursor=function(t){if(this.input.focus(),this.input.createTextRange){var e=this.input.createTextRange();e.move("character",t),e.select()}else null!=this.input.selectionStart&&(this.input.focus(),this.input.setSelectionRange(t,t))},e.prototype.getCursor=function(){return this.input.selectionStart},e.prototype.setupHandler=function(){var t=this;this.input.onblur=function(){t.hasFocus=!1,setTimeout(function(){t.hasFocus||t.onblur&&t.onblur()},300),t.updateScroll()},this.input.onfocus=function(){t.hasFocus||(t.hasFocus=!0,t.updateScroll(),t.onfocus&&t.onfocus())},this.input.onkeydown=function(e){t.keydown(e)},this.input.onkeyup=function(e){t.keyup(e)},this.input.onclick=function(){t.onchangecursor()},this.input.oncut=function(){setTimeout(function(){t.onInputChange()})},this.input.onpaste=function(){setTimeout(function(){t.onInputChange()})}},e.prototype.focus=function(){var t=this;this.hasFocus=!0,setTimeout(function(){t.input.focus(),t.setCursor(t.getValue().length)})},e.prototype.blur=function(){this.hasFocus&&this.input.blur()},e.prototype.keydown=function(e){var n=this;switch(e.keyCode||e.which){case 9:this.justPressedTab?this.blur():this.magicBox.hasSuggestions()&&e.preventDefault(),this.justPressedTab=!0;break;default:e.stopPropagation(),this.justPressedTab=!1,null==this.onkeydown||this.onkeydown(e.keyCode||e.which)?t.requestAnimationFrame(function(){n.onInputChange()}):e.preventDefault()}},e.prototype.keyup=function(t){switch(t.keyCode||t.which){case 9:this.tabPress();break;case 37:case 39:this.onchangecursor();break;default:null==this.onkeydown||this.onkeyup(t.keyCode||t.which)?this.onInputChange():t.preventDefault()}},e.prototype.tabPress=function(){null!=this.wordCompletion&&(this.input.value=this.wordCompletion),this.ontabpress&&this.ontabpress(),this.magicBox.showSuggestion()},e.prototype.onInputChange=function(){this.result.input!=this.input.value&&this.onchange(this.input.value,!1)},e.prototype.getValue=function(){return this.input.value},e.prototype.getWordCompletion=function(){return this.wordCompletion},e}();t.InputManager=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e=function(){function e(e,n){var s=this;this.element=e,this.options=_.defaults(n,{selectableClass:"magic-box-suggestion",selectedClass:"magic-box-selected"}),void 0==this.options.timeout&&(this.options.timeout=500),this.hasSuggestions=!1,t.$$(this.element).on("mouseover",function(t){s.handleMouseOver(t)}),t.$$(this.element).on("mouseout",function(t){s.handleMouseOut(t)})}return e.prototype.handleMouseOver=function(e){var n=t.$$(e.target),s=n.parents(this.options.selectableClass);n.hasClass(this.options.selectableClass)?this.addSelectedClass(n.el):s.length>0&&this.element.contains(s[0])&&this.addSelectedClass(s[0])},e.prototype.handleMouseOut=function(e){var n=t.$$(e.target),s=n.parents(this.options.selectableClass);if(e.relatedTarget){var i=t.$$(e.relatedTarget).parents(this.options.selectableClass);n.hasClass(this.options.selectedClass)&&!t.$$(e.relatedTarget).hasClass(this.options.selectableClass)?n.removeClass(this.options.selectedClass):0==i.length&&s.length>0&&t.$$(s[0]).removeClass(this.options.selectedClass)}else n.hasClass(this.options.selectedClass)?n.removeClass(this.options.selectedClass):s.length>0&&t.$$(s[0]).removeClass(this.options.selectedClass)},e.prototype.moveDown=function(){var e=this.element.getElementsByClassName(this.options.selectedClass).item(0),n=this.element.getElementsByClassName(this.options.selectableClass),s=-1;if(null!=e){t.$$(e).removeClass(this.options.selectedClass);for(var i=0;i<n.length;i++)if(e==n.item(i)){s=i;break}s=s==-1?0:s+1}else s=0;return e=n.item(s),null!=e&&t.$$(e).addClass(this.options.selectedClass),this.returnMoved(e)},e.prototype.moveUp=function(){var e=this.element.getElementsByClassName(this.options.selectedClass).item(0),n=this.element.getElementsByClassName(this.options.selectableClass),s=-1;if(null!=e){t.$$(e).removeClass(this.options.selectedClass);for(var i=0;i<n.length;i++)if(e==n.item(i)){s=i;break}s=s==-1?n.length-1:s-1}else s=n.length-1;return e=n.item(s),null!=e&&t.$$(e).addClass(this.options.selectedClass),this.returnMoved(e)},e.prototype.select=function(){var e=this.element.getElementsByClassName(this.options.selectedClass).item(0);return null!=e&&t.$$(e).trigger("keyboardSelect"),e},e.prototype.mergeSuggestions=function(t,e){var n,s=this,i=[];t=_.compact(t);var o=this.pendingSuggestion=new Promise(function(e,r){_.each(t,function(t){var e=!1;setTimeout(function(){e=!0},s.options.timeout),t.then(function(t){!e&&t&&(i=i.concat(t))})});var u=function(){n&&clearTimeout(n),0==i.length?e([]):o==s.pendingSuggestion||null==s.pendingSuggestion?e(i.sort(function(t,e){return e.index-t.index})):r("new request queued")};0==t.length&&u(),void 0==t&&u(),n=setTimeout(function(){u()},s.options.timeout),Promise.all(t).then(function(){return u()})});o.then(function(t){return e&&e(t),s.updateSuggestions(t),t})["catch"](function(){return null})},e.prototype.updateSuggestions=function(e){var n=this;this.element.innerHTML="",this.element.className="magic-box-suggestions",_.each(e,function(e){var s=e.dom;if(s){t.$$(s).removeClass(n.options.selectedClass);var i=t.$$(s).find("."+n.options.selectableClass);t.$$(i).removeClass(n.options.selectedClass)}else{if(s=document.createElement("div"),s.className="magic-box-suggestion",null!=e.html)s.innerHTML=e.html;else if(null!=e.text)s.appendChild(document.createTextNode(e.text));else if(null!=e.separator){s.className="magic-box-suggestion-seperator";var o=document.createElement("div");o.className="magic-box-suggestion-seperator-label",o.appendChild(document.createTextNode(e.separator)),s.appendChild(o)}t.$$(s).on("click",function(){e.onSelect()}),t.$$(s).on("keyboardSelect",function(){e.onSelect()}),t.$$(s).addClass(n.options.selectableClass)}s.suggestion=e,n.element.appendChild(s)}),e.length>0?(t.$$(this.element).addClass("magic-box-hasSuggestion"),this.hasSuggestions=!0):(t.$$(this.element).removeClass("magic-box-hasSuggestion"),this.hasSuggestions=!1)},e.prototype.returnMoved=function(e){if(null!=e){if(e.suggestion)return e.suggestion;if(e["no-text-suggestion"])return null;if(e instanceof HTMLElement)return{text:t.$$(e).text()}}return null},e.prototype.addSelectedClass=function(e){for(var n=this.element.getElementsByClassName(this.options.selectedClass),s=0;s<n.length;s++){var i=n.item(s);t.$$(i).removeClass(this.options.selectedClass)}t.$$(e).addClass(this.options.selectedClass)},e}();t.SuggestionsManager=e}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(e){function n(t){return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function s(t,e,s,o,r){if(void 0===s&&(s=!1),void 0===o&&(o="magic-box-hightlight"),void 0===r&&(r=""),0==e.length)return t;var u=n(e),a="("+u+")|(.*?(?="+u+")|.+)",l=new RegExp(a,s?"gi":"g");return t.replace(l,function(t,e,n){return i(null!=e?o:r,t)})}var i=function(t,e){return'<span class="'+t+'">'+_.escape(e)+"</span>"};e.highlightText=s;var o=function(){function e(t){this.el=t}return e.prototype.text=function(t){return t?void(void 0!=this.el.innerText?this.el.innerText=t:void 0!=this.el.textContent&&(this.el.textContent=t)):this.el.innerText||this.el.textContent},e.prototype.nodeListToArray=function(t){for(var e=t.length,n=new Array(e);e--;)n[e]=t.item(e);return n},e.prototype.empty=function(){for(;this.el.firstChild;)this.el.removeChild(this.el.firstChild)},e.prototype.show=function(){this.el.style.display="visible"},e.prototype.hide=function(){this.el.style.display="none"},e.prototype.toggle=function(t){void 0===t?"visible"==this.el.style.display?this.hide():this.show():t?this.show():this.hide()},e.prototype.find=function(t){return this.el.querySelector(t)},e.prototype.is=function(t){return this.el.tagName.toLowerCase()==t.toLowerCase()||(!("."!=t[0]||!this.hasClass(t.substr(1)))||"#"==t[0]&&this.el.getAttribute("id")==t.substr(1))},e.prototype.closest=function(e){for(var n=this.el,s=!1;!s&&(t.$$(n).hasClass(e)&&(s=!0),"body"!=n.tagName.toLowerCase())&&null!=n.parentElement;)s||(n=n.parentElement);if(s)return n},e.prototype.parent=function(t){if(void 0!=this.el.parentElement)return this.traverseAncestorForClass(this.el.parentElement,t)},e.prototype.parents=function(t){for(var n=[],s=this.parent(t);s;)n.push(s),s=new e(s).parent(t);return n},e.prototype.findAll=function(t){return this.nodeListToArray(this.el.querySelectorAll(t))},e.prototype.findClass=function(t){return"getElementsByClassName"in this.el?this.nodeListToArray(this.el.getElementsByClassName(t)):this.nodeListToArray(this.el.querySelectorAll("."+t))},e.prototype.findId=function(t){return document.getElementById(t)},e.prototype.addClass=function(t){this.hasClass(t)||(this.el.className?this.el.className+=" "+t:this.el.className=t)},e.prototype.removeClass=function(t){this.el.className=this.el.className.replace(new RegExp("(^|\\s)"+t+"(\\s|\\b)","g"),"$1")},e.prototype.toggleClass=function(t,e){e?this.addClass(t):this.removeClass(t)},e.prototype.getClass=function(){return this.el.className.match(e.CLASS_NAME_REGEX)||[]},e.prototype.hasClass=function(t){return _.contains(this.getClass(),t)},e.prototype.detach=function(){this.el.parentElement&&this.el.parentElement.removeChild(this.el)},e.prototype.on=function(t,n){var s=this;if(_.isArray(t))_.each(t,function(t){s.on(t,n)});else{var i=this.getJQuery();if(i)i(this.el).on(t,n);else if(this.el.addEventListener){var o=function(t){n(t,t.detail)};e.handlers.push({eventHandle:n,fn:o}),this.el.addEventListener(t,o,!1)}else this.el.on&&this.el.on("on"+t,n)}},e.prototype.one=function(t,e){var n=this;if(_.isArray(t))_.each(t,function(t){n.one(t,e)});else{var s=function(i){return n.off(t,s),e(i)};this.on(t,s)}},e.prototype.off=function(t,n){var s=this;if(_.isArray(t))_.each(t,function(t){s.off(t,n)});else{var i=this.getJQuery();if(i)i(this.el).off(t,n);else if(this.el.removeEventListener){var o=0,r=_.find(e.handlers,function(t,e){if(t.eventHandle==n)return o=e,!0});r&&(this.el.removeEventListener(t,r.fn,!1),e.handlers.splice(o,1))}else this.el.off&&this.el.off("on"+t,n)}},e.prototype.trigger=function(t,e){var n=this.getJQuery();if(n)n(this.el).trigger(t,e);else if(void 0!==CustomEvent){var s=new CustomEvent(t,{detail:e,bubbles:!0});this.el.dispatchEvent(s)}},e.prototype.isEmpty=function(){return e.ONLY_WHITE_SPACE_REGEX.test(this.el.innerHTML)},e.prototype.isDescendant=function(t){for(var e=this.el.parentNode;null!=e;){if(e==t)return!0;e=e.parentNode}return!1},e.prototype.traverseAncestorForClass=function(e,n){void 0===e&&(e=this.el),0==n.indexOf(".")&&(n=n.substr(1));for(var s=!1;!s&&(t.$$(e).hasClass(n)&&(s=!0),"body"!=e.tagName.toLowerCase())&&null!=e.parentElement;)s||(e=e.parentElement);if(s)return e},e.prototype.getJQuery=function(){return void 0!=window.jQuery&&window.jQuery},e.CLASS_NAME_REGEX=/-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g,e.ONLY_WHITE_SPACE_REGEX=/^\s*$/,e.handlers=[],e}();e.Dom=o}(e=t.Utils||(t.Utils={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){t.$$=function(e){return window.Coveo&&window.Coveo.$$?window.Coveo.$$(e):new t.Utils.Dom(e)}}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(e){function n(t,e,n,s){_.each(s.expressions,function(e){_.contains(t,e)||t.push(e)}),_.each(s.basicExpressions,function(t){_.contains(e,t)||e.push(t)}),_.each(s.grammars,function(t,e){if(e in n){if(!_.isArray(n[e])||!_.isArray(t))throw _.each(t,function(t){n[e].push(t)}),"Can not merge "+e+"("+new String(t)+" => "+new String(n[e])+")";_.each(t,function(t){n[e].push(t)})}else n[e]=t})}function s(){for(var t=[],e=0;e<arguments.length;e++)t[e-0]=arguments[e];for(var s=[],i=[],o={Start:["Expressions","Empty"],Expressions:"[OptionalSpaces][Expression][ExpressionsList*][OptionalSpaces]",ExpressionsList:"[Spaces][Expression]",Expression:s,BasicExpression:i,OptionalSpaces:/ */,Spaces:/ +/,Empty:/(?!.)/},r=0;r<t.length;r++)n(s,i,o,t[r]),_.each(t[r].include,function(e){_.contains(t,e)||t.push(e)});return s.push("BasicExpression"),{start:"Start",expressions:o}}function i(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];var i=s.apply(this,e);return new t.Grammar(i.start,i.expressions)}e.Expressions=s,e.ExpressionsGrammar=i}(e=t.Grammars||(t.Grammars={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(e){e.notWordStart=" ()[],$@'\"",e.notInWord=" ()[],:",e.Basic={basicExpressions:["Word","DoubleQuoted"],grammars:{DoubleQuoted:'"[NotDoubleQuote]"',NotDoubleQuote:/[^"]*/,SingleQuoted:"'[NotSingleQuote]'",NotSingleQuote:/[^']*/,Number:/[0-9]+/,Word:function(n,s,i){var o=new RegExp("[^"+e.notWordStart.replace(/(.)/g,"\\$1")+"][^"+e.notInWord.replace(/(.)/g,"\\$1")+"]*"),r=n.match(o);null!=r&&0!=r.index&&(r=null);var u=new t.Result(null!=r?r[0]:null,i,n);return u.isSuccess()&&s&&n.length>u.value.length?new t.EndOfInputResult(u):u}}}}(e=t.Grammars||(t.Grammars={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(t){t.SubExpression={basicExpressions:["SubExpression"],grammars:{SubExpression:"([Expressions])"}}}(e=t.Grammars||(t.Grammars={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(t){t.Date={grammars:{Date:"[DateYear]/[DateMonth]/[DateDay]",DateYear:/([0-9]{4})/,DateMonth:/(1[0-2]|0?[1-9])/,DateDay:/([1-2][0-9]|3[0-1]|0?[1-9])/,DateRange:"[Date][Spaces?]..[Spaces?][Date]",DateRelative:["DateRelativeNegative","DateRelativeTerm"],DateRelativeTerm:/now|today|yesterday/,DateRelativeNegative:"[DateRelativeTerm][DateRelativeNegativeRef]",DateRelativeNegativeRef:/([\-\+][0-9]+(s|m|h|d|mo|y))/},include:[t.Basic]}}(e=t.Grammars||(t.Grammars={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(t){t.Field={basicExpressions:["FieldSimpleQuery","FieldQuery","Field"],grammars:{FieldQuery:"[Field][OptionalSpaces][FieldQueryOperation]",FieldQueryOperation:["FieldQueryValue","FieldQueryNumeric"],FieldQueryValue:"[FieldOperator][OptionalSpaces][FieldValue]",FieldQueryNumeric:"[FieldOperatorNumeric][OptionalSpaces][FieldValueNumeric]",FieldSimpleQuery:"[FieldName]:[OptionalSpaces][FieldValue]",Field:"@[FieldName]",FieldName:/[a-zA-Z][a-zA-Z0-9\.\_]*/,FieldOperator:/==|=|<>/,FieldOperatorNumeric:/<=|>=|<|>/,FieldValue:["DateRange","NumberRange","DateRelative","Date","Number","FieldValueList","FieldValueString"],FieldValueNumeric:["DateRelative","Date","Number"],FieldValueString:["DoubleQuoted","FieldValueNotQuoted"],FieldValueList:"([FieldValueString][FieldValueStringList*])",FieldValueStringList:"[FieldValueSeparator][FieldValueString]",FieldValueSeparator:/ *, */,FieldValueNotQuoted:/[^ \(\),]+/,NumberRange:"[Number][Spaces?]..[Spaces?][Number]"},include:[t.Date,t.Basic]}}(e=t.Grammars||(t.Grammars={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(t){t.QueryExtension={basicExpressions:["QueryExtension"],grammars:{QueryExtension:"$[QueryExtensionName]([QueryExtensionArguments])",QueryExtensionName:/\w+/,QueryExtensionArguments:"[QueryExtensionArgumentList*][QueryExtensionArgument]",QueryExtensionArgumentList:"[QueryExtensionArgument][Spaces?],[Spaces?]",QueryExtensionArgument:"[QueryExtensionArgumentName]:[Spaces?][QueryExtensionArgumentValue]",QueryExtensionArgumentName:/\w+/,QueryExtensionArgumentValue:["SingleQuoted","Expressions"]},include:[t.Basic]}}(e=t.Grammars||(t.Grammars={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(t){t.NestedQuery={basicExpressions:["NestedQuery"],grammars:{NestedQuery:"[[NestedField][OptionalSpaces][Expressions]]",NestedField:"[[Field]]",FieldValue:["NestedQuery"]},include:[t.Field]}}(e=t.Grammars||(t.Grammars={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){var e;!function(t){t.Complete={include:[t.NestedQuery,t.QueryExtension,t.SubExpression,t.Field,t.Basic]}}(e=t.Grammars||(t.Grammars={}))}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));var Coveo;!function(t){var e;!function(t){function e(t,e,n){return new s(t,e,n)}function n(t){return"requestAnimationFrame"in window?window.requestAnimationFrame(t):setTimeout(t)}var s=function(){function e(e,n,s){var i=this;void 0===s&&(s={}),this.element=e,this.grammar=n,this.options=s,this.lastSuggestions=[],_.isUndefined(this.options.inline)&&(this.options.inline=!1),t.$$(e).addClass("magic-box"),this.options.inline&&t.$$(e).addClass("magic-box-inline"),this.result=this.grammar.parse(""),this.displayedResult=this.result.clean(),this.clearDom=document.createElement("div"),this.clearDom.className="magic-box-clear";var o=document.createElement("div");o.className="magic-box-icon",this.clearDom.appendChild(o);var r=t.$$(e).find(".magic-box-input");r?e.insertBefore(this.clearDom,r):(r=document.createElement("div"),
r.className="magic-box-input",e.appendChild(this.clearDom),e.appendChild(r)),this.inputManager=new t.InputManager(r,function(t,e){e?(i.setText(t),i.onselect&&i.onselect(i.getFirstSuggestionText())):(i.setText(t),i.showSuggestion(),i.onchange&&i.onchange())},this),this.inputManager.ontabpress=function(){i.ontabpress&&i.ontabpress()};var u=this.inputManager.getValue();u&&(this.displayedResult.input=u),this.inputManager.setResult(this.displayedResult);var a=document.createElement("div");a.className="magic-box-suggestions",this.element.appendChild(a),this.suggestionsManager=new t.SuggestionsManager(a,{selectableClass:this.options.selectableSuggestionClass,selectedClass:this.options.selectedSuggestionClass,timeout:this.options.suggestionTimeout}),this.setupHandler()}return e.prototype.getResult=function(){return this.result},e.prototype.getDisplayedResult=function(){return this.displayedResult},e.prototype.setText=function(e){t.$$(this.element).toggleClass("magic-box-notEmpty",e.length>0),this.result=this.grammar.parse(e),this.displayedResult=this.result.clean(),this.inputManager.setResult(this.displayedResult)},e.prototype.setCursor=function(t){this.inputManager.setCursor(t)},e.prototype.getCursor=function(){return this.inputManager.getCursor()},e.prototype.resultAtCursor=function(t){return this.displayedResult.resultAt(this.getCursor(),t)},e.prototype.setupHandler=function(){var e=this;this.inputManager.onblur=function(){t.$$(e.element).removeClass("magic-box-hasFocus"),e.onblur&&e.onblur(),e.options.inline||e.clearSuggestion()},this.inputManager.onfocus=function(){t.$$(e.element).addClass("magic-box-hasFocus"),e.showSuggestion(),e.onfocus&&e.onfocus()},this.inputManager.onkeydown=function(t){if(38==t||40==t)return!1;if(13==t){var n=e.suggestionsManager.select();return null==n&&e.onsubmit&&e.onsubmit(),!1}return 27==t&&(e.clearSuggestion(),e.blur()),!0},this.inputManager.onchangecursor=function(){e.showSuggestion()},this.inputManager.onkeyup=function(t){if(38==t)e.onmove&&e.onmove(),e.focusOnSuggestion(e.suggestionsManager.moveUp()),e.onchange&&e.onchange();else{if(40!=t)return!0;e.onmove&&e.onmove(),e.focusOnSuggestion(e.suggestionsManager.moveDown()),e.onchange&&e.onchange()}return!1},this.clearDom.onclick=function(){e.clear()}},e.prototype.showSuggestion=function(){var t=this;this.suggestionsManager.mergeSuggestions(null!=this.getSuggestions?this.getSuggestions():[],function(e){t.updateSuggestion(e)})},e.prototype.updateSuggestion=function(t){var e=this;this.lastSuggestions=t;var n=this.getFirstSuggestionText();this.inputManager.setWordCompletion(n&&n.text),this.onsuggestions&&this.onsuggestions(t),_.each(t,function(t){null==t.onSelect&&null!=t.text&&(t.onSelect=function(){e.setText(t.text),e.onselect&&e.onselect(t)})})},e.prototype.focus=function(){t.$$(this.element).addClass("magic-box-hasFocus"),this.inputManager.focus()},e.prototype.blur=function(){this.inputManager.blur()},e.prototype.clearSuggestion=function(){var t=this;this.suggestionsManager.mergeSuggestions([],function(e){t.updateSuggestion(e)}),this.inputManager.setWordCompletion(null)},e.prototype.focusOnSuggestion=function(t){null==t||null==t.text?(t=this.getFirstSuggestionText(),this.inputManager.setResult(this.displayedResult,t&&t.text)):this.inputManager.setResult(this.grammar.parse(t.text).clean(),t.text)},e.prototype.getFirstSuggestionText=function(){return _.find(this.lastSuggestions,function(t){return null!=t.text})},e.prototype.getText=function(){return this.inputManager.getValue()},e.prototype.getWordCompletion=function(){return this.inputManager.getWordCompletion()},e.prototype.clear=function(){this.setText(""),this.showSuggestion(),this.focus(),this.onclear&&this.onclear()},e.prototype.hasSuggestions=function(){return this.suggestionsManager.hasSuggestions},e}();t.Instance=s,t.create=e,t.requestAnimationFrame=n}(e=t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));

/*** EXPORTS FROM exports-loader ***/
module.exports = Coveo.MagicBox;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),

/***/ 431:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(1);
var QueryboxQueryParameters = (function () {
    function QueryboxQueryParameters(options) {
        this.options = options;
    }
    QueryboxQueryParameters.prototype.addParameters = function (queryBuilder, lastQuery) {
        if (this.options.enableWildcards) {
            queryBuilder.enableWildcards = true;
        }
        if (this.options.enableQuestionMarks) {
            queryBuilder.enableQuestionMarks = true;
        }
        if (this.options.enableLowercaseOperators) {
            queryBuilder.enableLowercaseOperators = true;
        }
        if (!_.isEmpty(lastQuery)) {
            queryBuilder.enableQuerySyntax = this.options.enableQuerySyntax;
            queryBuilder.expression.add(lastQuery);
            if (this.options.enablePartialMatch) {
                queryBuilder.enablePartialMatch = this.options.enablePartialMatch;
                if (this.options.partialMatchKeywords) {
                    queryBuilder.partialMatchKeywords = this.options.partialMatchKeywords;
                }
                if (this.options.partialMatchThreshold) {
                    queryBuilder.partialMatchThreshold = this.options.partialMatchThreshold;
                }
            }
        }
    };
    return QueryboxQueryParameters;
}());
exports.QueryboxQueryParameters = QueryboxQueryParameters;


/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentOptionsModel_1 = __webpack_require__(26);
exports.MagicBox = __webpack_require__(429);
var Initialization_1 = __webpack_require__(2);
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var QueryEvents_1 = __webpack_require__(11);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(66);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Dom_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(7);
var QueryboxQueryParameters_1 = __webpack_require__(431);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
/**
 * The `Querybox` component renders an input which the end user can interact with to enter and submit queries.
 *
 * When the user submits a query, the `Querybox` component triggers a query and logs the corresponding usage analytics
 * data.
 *
 * For technical reasons, it is necessary to instantiate this component on a `div` element rather than on an `input`
 * element.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate a `Querybox` along with an
 * optional [`SearchButton`]{@link SearchButton} component.
 */
var Querybox = (function (_super) {
    __extends(Querybox, _super);
    /**
     * Creates a new `Querybox component`. Creates a new `Coveo.Magicbox` instance and wraps the Magicbox methods
     * (`onblur`, `onsubmit` etc.). Binds event on `buildingQuery` and before redirection (for standalone box).
     * @param element The HTMLElement on which to instantiate the component. This cannot be an HTMLInputElement for
     * technical reasons.
     * @param options The options for the `Querybox` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Querybox(element, options, bindings) {
        var _this = _super.call(this, element, Querybox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        if (element instanceof HTMLInputElement) {
            _this.logger.error('Querybox cannot be used on an HTMLInputElement');
        }
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Querybox, options);
        _this.options = _.extend({}, _this.options, _this.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchBox));
        _this.magicBox = exports.MagicBox.create(element, new exports.MagicBox.Grammar('Query', {
            Query: '[Term*][Spaces?]',
            Term: '[Spaces?][Word]',
            Spaces: / +/,
            Word: /[^ ]+/
        }), {
            inline: true
        });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents.beforeRedirect, function () { return _this.updateQueryState(); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.Q, function (args) { return _this.handleQueryStateChanged(args); });
        if (_this.options.enableSearchAsYouType) {
            Dom_1.$$(_this.element).addClass('coveo-search-as-you-type');
            _this.magicBox.onchange = function () {
                _this.searchAsYouType();
            };
        }
        _this.magicBox.onsubmit = function () {
            _this.submit();
        };
        _this.magicBox.onblur = function () {
            _this.updateQueryState();
        };
        _this.magicBox.onclear = function () {
            _this.updateQueryState();
            if (_this.options.triggerQueryOnClear) {
                _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxClear, {});
                _this.triggerNewQuery(false);
            }
        };
        return _this;
    }
    /**
     * Adds the current content of the input to the query and triggers a query if the current content of the input has
     * changed since last submit.
     *
     * Also logs the `serachboxSubmit` event in the usage analytics.
     */
    Querybox.prototype.submit = function () {
        this.magicBox.clearSuggestion();
        this.updateQueryState();
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        this.triggerNewQuery(false);
    };
    /**
     * Sets the content of the input.
     *
     * @param text The string to set in the input.
     */
    Querybox.prototype.setText = function (text) {
        this.magicBox.setText(text);
        this.updateQueryState();
    };
    /**
     * Clears the content of the input.
     *
     * See also the [`triggerQueryOnClear`]{@link Querybox.options.triggerQueryOnClear} option.
     */
    Querybox.prototype.clear = function () {
        this.magicBox.clear();
    };
    /**
     * Gets the content of the input.
     *
     * @returns {string} The content of the input.
     */
    Querybox.prototype.getText = function () {
        return this.magicBox.getText();
    };
    /**
     * Gets the result from the input.
     *
     * @returns {Result} The result.
     */
    Querybox.prototype.getResult = function () {
        return this.magicBox.getResult();
    };
    /**
     * Gets the displayed result from the input.
     *
     * @returns {Result} The displayed result.
     */
    Querybox.prototype.getDisplayedResult = function () {
        return this.magicBox.getDisplayedResult();
    };
    /**
     * Gets the current cursor position in the input.
     *
     * @returns {number} The cursor position (index starts at 0).
     */
    Querybox.prototype.getCursor = function () {
        return this.magicBox.getCursor();
    };
    /**
     * Gets the result at cursor position.
     *
     * @param match {string | { (result): boolean }} The match condition.
     *
     * @returns {Result[]} The result.
     */
    Querybox.prototype.resultAtCursor = function (match) {
        return this.magicBox.resultAtCursor(match);
    };
    Querybox.prototype.handleBuildingQuery = function (args) {
        Assert_1.Assert.exists(args);
        Assert_1.Assert.exists(args.queryBuilder);
        this.updateQueryState();
        this.lastQuery = this.magicBox.getText();
        new QueryboxQueryParameters_1.QueryboxQueryParameters(this.options).addParameters(args.queryBuilder, this.lastQuery);
    };
    Querybox.prototype.triggerNewQuery = function (searchAsYouType) {
        clearTimeout(this.searchAsYouTypeTimeout);
        var text = this.magicBox.getText();
        if (this.lastQuery != text && text != null) {
            this.lastQuery = text;
            this.queryController.executeQuery({
                searchAsYouType: searchAsYouType,
                logInActionsHistory: true
            });
        }
    };
    Querybox.prototype.updateQueryState = function () {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, this.magicBox.getText());
    };
    Querybox.prototype.handleQueryStateChanged = function (args) {
        Assert_1.Assert.exists(args);
        var q = args.value;
        if (q != this.magicBox.getText()) {
            this.magicBox.setText(q);
        }
    };
    Querybox.prototype.searchAsYouType = function () {
        var _this = this;
        clearTimeout(this.searchAsYouTypeTimeout);
        this.searchAsYouTypeTimeout = setTimeout(function () {
            _this.usageAnalytics.logSearchAsYouType(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxAsYouType, {});
            _this.triggerNewQuery(true);
        }, this.options.searchAsYouTypeDelay);
    };
    return Querybox;
}(Component_1.Component));
Querybox.ID = 'Querybox';
Querybox.doExport = function () {
    GlobalExports_1.exportGlobally({
        'Querybox': Querybox,
        'MagicBox': exports.MagicBox
    });
};
/**
 * The options for the Querybox.
 * @componentOptions
 */
Querybox.options = {
    /**
     * Specifies whether to enable the search-as-you-type feature.
     *
     * Default value is `false`.
     */
    enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * If the [`enableSearchAsYouType`]{@link Querybox.options.enableSearchAsYouType} option is `true`, specifies how
     * long to wait (in milliseconds) between each key press before triggering a new query.
     *
     * Default value is `50`. Minimum value is `0`
     */
    searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 50, min: 0 }),
    /**
     * Specifies whether the Coveo Platform should try to interpret special query syntax (e.g., `@objecttype=message`)
     * when the end user types a query in the `Querybox` (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)). Enabling query
     * syntax also causes the `Querybox` to highlight any query syntax.
     *
     * **Note:**
     * > End user preferences can override the value you specify for this option.
     * >
     * > If the end user selects a value other than **Automatic** for the **Enable query syntax** setting (see
     * > the [`enableQuerySyntax`]{@link ResultsPreferences.options.enableQuerySyntax} option of the
     * > [`ResultsPreferences`]{@link ResultsPreferences} component), the end user preference takes precedence over this
     * > option.
     *
     * Default value is `false`.
     */
    enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether the Coveo Platform should expand keywords containing wildcard characters (`*`) to the possible
     * matching keywords in order to broaden the query (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
     *
     * Default value is `false`.
     */
    enableWildcards: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether the Coveo Platform should expand keywords containing question mark characters (`?`) to the
     * possible matching keywords in order to broaden the query (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
     *
     * Default value is `false`.
     */
    enableQuestionMarks: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * If the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is `true`, specifies whether to
     * treat the `AND`, `NOT`, `OR`, and `NEAR` keywords in the `Querybox` as query operators in the query, even if
     * the end user types those keywords in lowercase.
     *
     * This option applies to all query operators (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
     *
     * **Example:**
     * > If this option and the `enableQuerySyntax` option are both `true`, the Coveo Platform interprets the `near`
     * > keyword in a query such as `service center near me` as the `NEAR` query operator (not as a query term).
     *
     * > Otherwise, if the `enableQuerySyntax` option is `true` and this option is `false`, the end user has to type the
     * > `NEAR` keyword in uppercase for the Coveo Platform to interpret it as a query operator.
     *
     * Default value is `false`.
     */
    enableLowercaseOperators: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),
    /**
     * Specifies whether to automatically convert any basic expression containing at least a certain number of keywords
     * (see the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option) to a *partial match
     * expression*, so that items containing at least a certain subset of those keywords (see the
     * [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option) will match the query.
     *
     * **Example:**
     *
     * > With the following markup configuration, if a basic expression contains at least 4 keywords, items containing
     * > at least 75% of those keywords (round up) will match the query.
     * > ```html
     * > <div class='CoveoQuerybox' data-enable-partial-match='true' data-partial-match-keywords='4' data-partial-match-threshold='75%'></div>
     * > ```
     * > For instance, if the basic expression is `Coveo custom component configuration help`, items containing
     * > all 5 of those keywords, or 4 of them (75% of 5 rounded up) will match the query.
     *
     * Default value is `false`.
     */
    enablePartialMatch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * When the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch} option is `true`, specifies the
     * minimum number of keywords that need to be present in the basic expression to convert it to a partial match
     * expression.
     *
     * See also the [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option.
     *
     * **Note:**
     * > Only the basic expression of the query (see [`q`]{@link q}) can be converted to a partial match expression.
     *
     * **Example:**
     * > If the `partialMatchKeywords` value is `7`, the basic expression will have to contain at least 7 keywords
     * > to be converted to a partial match expression.
     *
     * Default value is `5`.
     */
    partialMatchKeywords: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),
    /**
     * When the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch} option is `true`, specifies an
     * absolute or relative (percentage) value indicating the minimum number of partial match expression keywords an
     * item must contain to match the query.
     *
     * See also the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option.
     *
     * **Note:**
     * > The relative threshold is always rounded up to the nearest integer.
     *
     * **Examples:**
     * > If the `partialMatchThreshold` value is `50%` and the partial match expression contains exactly 9 keywords,
     * > items will have to contain at least 5 of those keywords to match the query (50% of 9, rounded up).
     *
     * > With the same configuration, if the partial match expression contains exactly 12 keywords, items will have to
     * > contain at least 6 of those keywords to match the query (50% of 12).
     *
     * > If the `partialMatchThreshold` value is `2`, items will always have to contain at least 2 of the partial match
     * > expression keywords to match the query, no matter how many keywords the partial match expression actually
     * > contains.
     *
     * Default value is `50%`.
     */
    partialMatchThreshold: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '50%' }),
    /**
     * Specifies whether to trigger a query when clearing the `Querybox`.
     *
     * Default value is `true`.
     */
    triggerQueryOnClear: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
};
exports.Querybox = Querybox;
Initialization_1.Initialization.registerAutoCreateComponent(Querybox);


/***/ })

});
//# sourceMappingURL=Querybox.js.map