webpackJsonpCoveo__temporary([9,37],{

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

/***/ 490:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 496:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path='Omnibox.ts'/>
var Omnibox_1 = __webpack_require__(81);
var OmniboxEvents_1 = __webpack_require__(33);
var _ = __webpack_require__(1);
var FieldAddon = (function () {
    function FieldAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = {};
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    FieldAddon.prototype.getSuggestion = function () {
        var _this = this;
        var hash = this.getHash();
        if (hash == null) {
            return null;
        }
        var hashString = this.hashToString(hash);
        if (this.cache[hashString] != null) {
            return this.hashValueToSuggestion(hash, this.cache[hashString]);
        }
        var values;
        if (hash.type == 'FieldName') {
            values = this.fieldNames(hash.current);
        }
        if (hash.type == 'FieldValue') {
            values = this.fieldValues(hash.field, hash.current);
        }
        if (hash.type == 'SimpleFieldName') {
            values = this.simpleFieldNames(hash.current);
        }
        this.cache[hashString] = values;
        values.catch(function () {
            delete _this.cache[hashString];
        });
        return this.hashValueToSuggestion(hash, values);
    };
    FieldAddon.prototype.getHash = function () {
        var fieldName = _.last(this.omnibox.resultAtCursor('FieldName'));
        if (fieldName != null) {
            fieldName = fieldName.findParent('Field') || fieldName;
            var currentField = fieldName.toString();
            var before = fieldName.before();
            var after = fieldName.after();
            return { type: 'FieldName', current: currentField, before: before, after: after };
        }
        var fieldValue = _.last(this.omnibox.resultAtCursor('FieldValue'));
        if (fieldValue) {
            var fieldQuery = fieldValue.findParent('FieldQuery') || (this.omnibox.options.enableSimpleFieldAddon && fieldValue.findParent('FieldSimpleQuery'));
            if (fieldQuery) {
                var field = fieldQuery.find('FieldName').toString();
                if (this.omnibox.options.fieldAlias) {
                    if (field in this.omnibox.options.fieldAlias) {
                        field = this.omnibox.options.fieldAlias[field];
                    }
                }
                var value = fieldValue.toString();
                var before = fieldValue.before();
                var after = fieldValue.after();
                return { type: 'FieldValue', field: field, current: value, before: before, after: after };
            }
        }
        if (this.omnibox.options.enableSimpleFieldAddon) {
            var word = _.last(this.omnibox.resultAtCursor('Word'));
            if (word != null) {
                var currentField = word.toString();
                var before = word.before();
                var after = word.after();
                return { type: 'SimpleFieldName', current: currentField, before: before, after: after };
            }
        }
    };
    FieldAddon.prototype.hashToString = function (hash) {
        if (hash == null) {
            return null;
        }
        return hash.type + hash.current + (hash.field || '');
    };
    FieldAddon.prototype.hashValueToSuggestion = function (hash, promise) {
        return promise.then(function (values) {
            var suggestions = _.map(values, function (value, i) {
                return {
                    text: hash.before + (hash.current.toLowerCase().indexOf(value.toLowerCase()) == 0 ? hash.current + value.substr(hash.current.length) : value) + hash.after,
                    html: Omnibox_1.MagicBox.Utils.highlightText(value, hash.current, true),
                    index: FieldAddon.INDEX - i / values.length
                };
            });
            return suggestions;
        });
    };
    FieldAddon.prototype.getFields = function () {
        var _this = this;
        if (this.fields == null) {
            this.fields = new Promise(function (resolve, reject) {
                if (_this.omnibox.options.listOfFields != null) {
                    resolve(_this.omnibox.options.listOfFields);
                }
                else {
                    var promise = _this.omnibox.queryController.getEndpoint().listFields();
                    promise.then(function (fieldDescriptions) {
                        var fieldNames = _.chain(fieldDescriptions)
                            .filter(function (fieldDescription) { return fieldDescription.includeInQuery && fieldDescription.groupByField; })
                            .map(function (fieldDescription) { return fieldDescription.name.substr(1); })
                            .value();
                        resolve(fieldNames);
                    }).catch(function () {
                        reject();
                    });
                }
            });
        }
        return this.fields;
    };
    FieldAddon.prototype.fieldNames = function (current) {
        var withAt = current.length > 0 && current[0] == '@';
        var fieldName = withAt ? current.substr(1) : current;
        var fieldNameLC = fieldName.toLowerCase();
        return this.getFields().then(function (fields) {
            var matchFields = _.chain(fields)
                .map(function (field) {
                return {
                    index: field.toLowerCase().indexOf(fieldNameLC),
                    field: withAt ? field : '@' + field
                };
            })
                .filter(function (field) {
                return field.index != -1 && field.field.length > current.length;
            })
                .sortBy('index')
                .map(function (field) { return field.field; })
                .value();
            matchFields = _.first(matchFields, 5);
            return matchFields;
        });
    };
    FieldAddon.prototype.fieldValues = function (field, current) {
        return this.omnibox.queryController.getEndpoint().listFieldValues({
            pattern: '.*' + current + '.*',
            patternType: 'RegularExpression',
            sortCriteria: 'occurrences',
            field: '@' + field,
            maximumNumberOfValues: 5
        }).then(function (values) {
            return _.chain(values)
                .map(function (value) {
                return {
                    index: value.value.toLowerCase().indexOf(current),
                    value: value.value
                };
            })
                .filter(function (value) {
                return value.value.length > current.length;
            })
                .sortBy('index')
                .map(function (value) {
                return value.value.replace(/ /g, '\u00A0');
            })
                .value();
        });
    };
    FieldAddon.prototype.simpleFieldNames = function (current) {
        var fieldName = current;
        var fieldNameLC = fieldName.toLowerCase();
        return this.getFields().then(function (fields) {
            var matchFields = _.chain(fields)
                .map(function (field) {
                return {
                    index: field.toLowerCase().indexOf(fieldNameLC),
                    field: field + ':'
                };
            })
                .filter(function (field) {
                return field.index != -1 && field.field.length > current.length;
            })
                .sortBy('index')
                .map(function (field) { return field.field; })
                .value();
            matchFields = _.first(matchFields, 5);
            return matchFields;
        });
    };
    return FieldAddon;
}());
FieldAddon.INDEX = 64;
exports.FieldAddon = FieldAddon;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),

/***/ 497:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var OmniboxEvents_1 = __webpack_require__(33);
var Dom_1 = __webpack_require__(3);
var Utils_1 = __webpack_require__(5);
var _ = __webpack_require__(1);
var OldOmniboxAddon = (function () {
    function OldOmniboxAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            _.each(_this.getSuggestion(), function (suggestion) {
                args.suggestions.push(suggestion);
            });
        });
    }
    OldOmniboxAddon.prototype.getSuggestion = function () {
        var text = this.omnibox.magicBox.getText();
        if (text.length == 0) {
            return null;
        }
        if (this.lastQuery == text) {
            return this.lastSuggestions;
        }
        this.lastQuery = text;
        var eventArgs = this.buildPopulateOmniboxEventArgs();
        Dom_1.$$(this.omnibox.root).trigger(OmniboxEvents_1.OmniboxEvents.populateOmnibox, eventArgs);
        return this.lastSuggestions = this.rowsToSuggestions(eventArgs.rows);
    };
    OldOmniboxAddon.prototype.getCurrentQueryExpression = function () {
        var cursorPos = this.omnibox.getCursor();
        var value = this.omnibox.getText();
        var length = value.length;
        var start = cursorPos;
        var end = cursorPos;
        if (value[start] == ' ') {
            start--;
        }
        while (start > 0 && value[start] != ' ') {
            start--;
        }
        while (end < length && value[end] != ' ') {
            end++;
        }
        return value.substring(start, end);
    };
    OldOmniboxAddon.prototype.getRegexToSearch = function (strValue) {
        if (strValue == null) {
            strValue = this.omnibox.getText();
        }
        return new RegExp(Utils_1.Utils.escapeRegexCharacter(strValue), 'i');
    };
    OldOmniboxAddon.prototype.getQueryExpressionBreakDown = function () {
        var _this = this;
        var ret = [];
        var queryWords = this.omnibox.getText().split(' ');
        _.each(queryWords, function (word) {
            ret.push({
                word: word,
                regex: _this.getRegexToSearch(word)
            });
        });
        return ret;
    };
    OldOmniboxAddon.prototype.replace = function (searchValue, newValue) {
        this.omnibox.setText(this.omnibox.getText().replace(searchValue, newValue));
    };
    OldOmniboxAddon.prototype.clearCurrentExpression = function () {
        this.replace(this.getCurrentQueryExpression(), '');
    };
    OldOmniboxAddon.prototype.insertAt = function (at, toInsert) {
        var oldValue = this.omnibox.getText();
        var newValue = [oldValue.slice(0, at), toInsert, oldValue.slice(at)].join('');
        this.omnibox.setText(newValue);
    };
    OldOmniboxAddon.prototype.replaceCurrentExpression = function (newValue) {
        this.replace(this.getCurrentQueryExpression(), newValue);
    };
    OldOmniboxAddon.prototype.buildPopulateOmniboxEventArgs = function () {
        var _this = this;
        var currentQueryExpression = this.getCurrentQueryExpression();
        var ret = {
            rows: [],
            completeQueryExpression: {
                word: this.omnibox.getText(),
                regex: this.getRegexToSearch()
            },
            currentQueryExpression: {
                word: currentQueryExpression,
                regex: this.getRegexToSearch(currentQueryExpression)
            },
            allQueryExpressions: this.getQueryExpressionBreakDown(),
            cursorPosition: this.omnibox.getCursor(),
            clear: function () {
                _this.omnibox.clear();
            },
            clearCurrentExpression: function () {
                _this.clearCurrentExpression();
            },
            replace: function (searchValue, newValue) {
                _this.replace(searchValue, newValue);
            },
            replaceCurrentExpression: function (newValue) {
                _this.replaceCurrentExpression(newValue);
            },
            insertAt: function (at, toInsert) {
                _this.insertAt(at, toInsert);
            },
            closeOmnibox: function () {
                _this.omnibox.magicBox.blur();
            }
        };
        return ret;
    };
    OldOmniboxAddon.prototype.rowsToSuggestions = function (rows) {
        return _.map(rows, function (row) {
            if (!Utils_1.Utils.isNullOrUndefined(row.element)) {
                return new Promise(function (resolve) {
                    resolve([{
                            dom: row.element,
                            index: row.zIndex
                        }]);
                });
            }
            else if (!Utils_1.Utils.isNullOrUndefined(row.deferred)) {
                return new Promise(function (resolve) {
                    row.deferred.then(function (row) {
                        if (row.element != null) {
                            resolve([{
                                    dom: row.element,
                                    index: row.zIndex
                                }]);
                        }
                        else {
                            resolve(null);
                        }
                    });
                });
            }
            return null;
        });
    };
    return OldOmniboxAddon;
}());
exports.OldOmniboxAddon = OldOmniboxAddon;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),

/***/ 498:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
///<reference path='Omnibox.ts'/>
var OmniboxEvents_1 = __webpack_require__(33);
var Omnibox_1 = __webpack_require__(81);
var _ = __webpack_require__(1);
var QueryExtensionAddon = (function () {
    function QueryExtensionAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = {};
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    QueryExtensionAddon.prototype.getSuggestion = function () {
        var _this = this;
        var hash = this.getHash(this.omnibox.magicBox);
        if (hash == null) {
            return null;
        }
        var hashString = this.hashToString(hash);
        if (this.cache[hashString] != null) {
            return this.hashValueToSuggestion(hash, this.cache[hashString]);
        }
        var values = (hash.type == 'QueryExtensionName' ? this.names(hash.current) : this.attributeNames(hash.name, hash.current, hash.used));
        this.cache[hashString] = values;
        values.catch(function () {
            delete _this.cache[hashString];
        });
        return this.hashValueToSuggestion(hash, values);
    };
    QueryExtensionAddon.prototype.getHash = function (magicBox) {
        var queryExtension = _.last(magicBox.resultAtCursor('QueryExtension'));
        if (queryExtension != null) {
            var queryExtensionArgumentResults = queryExtension.findAll('QueryExtensionArgument');
            var current = _.last(magicBox.resultAtCursor('QueryExtensionName'));
            if (current != null) {
                return {
                    type: 'QueryExtensionName',
                    current: current.toString(),
                    before: current.before(),
                    after: current.after()
                };
            }
            current = _.last(magicBox.resultAtCursor('QueryExtensionArgumentName'));
            if (current != null) {
                var used = _.chain(queryExtensionArgumentResults)
                    .map(function (result) {
                    var name = result.find('QueryExtensionArgumentName');
                    return name && name.toString();
                })
                    .compact()
                    .value();
                var name = queryExtension.find('QueryExtensionName').toString();
                return {
                    type: 'QueryExtensionArgumentName',
                    current: current.toString(),
                    before: current.before(),
                    after: current.after(),
                    name: name,
                    used: used
                };
            }
        }
        return null;
    };
    QueryExtensionAddon.prototype.hashToString = function (hash) {
        if (hash == null) {
            return null;
        }
        return [hash.type, hash.current, (hash.name || ''), (hash.used ? hash.used.join() : '')].join();
    };
    QueryExtensionAddon.prototype.hashValueToSuggestion = function (hash, promise) {
        return promise.then(function (values) {
            var suggestions = _.map(values, function (value, i) {
                return {
                    html: Omnibox_1.MagicBox.Utils.highlightText(value, hash.current, true),
                    text: hash.before + value + hash.after,
                    index: QueryExtensionAddon.INDEX - i / values.length
                };
            });
            return suggestions;
        });
    };
    QueryExtensionAddon.prototype.getExtensions = function () {
        if (this.extensions == null) {
            this.extensions = this.omnibox.queryController.getEndpoint().extensions();
        }
        return this.extensions;
    };
    QueryExtensionAddon.prototype.names = function (current) {
        var extensionName = current.toLowerCase();
        return this.getExtensions().then(function (extensions) {
            var matchExtensions = _.chain(extensions)
                .map(function (extension) {
                return {
                    index: extension.name.toLowerCase().indexOf(extensionName),
                    extension: extension.name
                };
            })
                .filter(function (extension) {
                return extension.index != -1 && extension.extension.length > extensionName.length;
            })
                .sortBy('index')
                .pluck('extension')
                .value();
            matchExtensions = _.first(matchExtensions, 5);
            return matchExtensions;
        });
    };
    QueryExtensionAddon.prototype.attributeNames = function (name, current, used) {
        return this.getExtensions().then(function (extensions) {
            var extension = _.find(extensions, function (extension) { return extension.name == name; });
            if (extension == null) {
                return [];
            }
            else {
                return _.filter(_.difference(extension.argumentNames, used), function (argumentName) { return argumentName.indexOf(current) == 0; });
            }
        });
    };
    QueryExtensionAddon.prototype.hash = function () {
        return;
    };
    return QueryExtensionAddon;
}());
QueryExtensionAddon.INDEX = 62;
exports.QueryExtensionAddon = QueryExtensionAddon;


/***/ }),

/***/ 499:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var ComponentOptionsModel_1 = __webpack_require__(26);
var OmniboxEvents_1 = __webpack_require__(33);
var StringUtils_1 = __webpack_require__(20);
var _ = __webpack_require__(1);
var QuerySuggestAddon = (function () {
    function QuerySuggestAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = {};
        Dom_1.$$(this.omnibox.element).on(OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (e, args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    QuerySuggestAddon.suggestiontHtml = function (suggestion) {
        return suggestion.highlighted.replace(/\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g, function (part, notMatched, matched, corrected) {
            var className = '';
            if (matched) {
                className = 'coveo-omnibox-hightlight';
            }
            if (corrected) {
                className = 'coveo-omnibox-hightlight2';
            }
            var ret;
            if (className) {
                ret = Dom_1.$$('span', {
                    className: className
                });
            }
            else {
                ret = Dom_1.$$('span');
            }
            ret.text(notMatched || matched || corrected);
            return ret.el.outerHTML;
        });
    };
    QuerySuggestAddon.isPartialMatch = function (suggestion) {
        // groups : 1=notMatched, 2=matched, 3=corrected
        var parts = StringUtils_1.StringUtils.match(suggestion.highlighted, /\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g);
        var firstFail = _.find(parts, function (part) { return part[1] != null; });
        // if no fail found, this is a partial or a full match
        if (firstFail == null) {
            return true;
        }
        // if all right parts are notMatched, the right parts is autocomplete
        return _.every(_.last(parts, _.indexOf(parts, firstFail) - parts.length), function (part) { return part[1] != null; });
    };
    QuerySuggestAddon.prototype.getSuggestion = function () {
        var _this = this;
        var text = this.omnibox.magicBox.getText();
        if (text.length == 0) {
            return null;
        }
        if (this.cache[text] != null) {
            return this.cache[text];
        }
        var promise = this.getQuerySuggest(text);
        this.cache[text] = promise;
        promise.catch(function () {
            delete _this.cache[text];
        });
        return this.cache[text];
    };
    QuerySuggestAddon.prototype.getQuerySuggest = function (text) {
        var payload = { q: text };
        var language = String['locale'];
        var searchHub = this.omnibox.getBindings().componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchHub);
        var pipeline = this.omnibox.getBindings().searchInterface.options.pipeline;
        var enableWordCompletion = this.omnibox.options.enableSearchAsYouType;
        var context = this.omnibox.getBindings().queryController.getLastQuery().context;
        if (language) {
            payload.language = language;
        }
        if (searchHub) {
            payload.searchHub = searchHub;
        }
        if (pipeline) {
            payload.pipeline = pipeline;
        }
        if (context) {
            payload.context = context;
        }
        payload.enableWordCompletion = enableWordCompletion;
        return this.omnibox.queryController.getEndpoint()
            .getQuerySuggest(payload)
            .then(function (result) {
            var completions = result.completions;
            var results = _.map(completions, function (completion, i) {
                return {
                    html: QuerySuggestAddon.suggestiontHtml(completion),
                    text: completion.expression,
                    index: QuerySuggestAddon.INDEX - i / completions.length,
                    partial: QuerySuggestAddon.isPartialMatch(completion),
                    executableConfidence: completion.executableConfidence
                };
            });
            return results;
        });
    };
    return QuerySuggestAddon;
}());
QuerySuggestAddon.INDEX = 60;
exports.QuerySuggestAddon = QuerySuggestAddon;


/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

///<reference path="FieldAddon.ts" />
///<reference path="QueryExtensionAddon.ts" />
///<reference path="QuerySuggestAddon.ts" />
///<reference path="OldOmniboxAddon.ts" />
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
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var QueryEvents_1 = __webpack_require__(11);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(66);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var OmniboxEvents_1 = __webpack_require__(33);
var Dom_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(7);
var QueryStateModel_2 = __webpack_require__(13);
var Initialization_1 = __webpack_require__(2);
var Querybox_1 = __webpack_require__(97);
var FieldAddon_1 = __webpack_require__(496);
var QueryExtensionAddon_1 = __webpack_require__(498);
var QuerySuggestAddon_1 = __webpack_require__(499);
var OldOmniboxAddon_1 = __webpack_require__(497);
var QueryboxQueryParameters_1 = __webpack_require__(431);
var PendingSearchAsYouTypeSearchEvent_1 = __webpack_require__(84);
var Utils_1 = __webpack_require__(5);
var SearchInterface_1 = __webpack_require__(21);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(490);
var MINIMUM_EXECUTABLE_CONFIDENCE = 0.8;
/**
 * The Omnibox component is very similar to the simpler {@link Querybox} component. It supports all of the same options
 * and behaviors.
 *
 * The Omnibox component takes care of adding type-ahead capability to the search input. Custom components can extend
 * and customize the type-ahead and the suggestions it provides.
 *
 * The type-ahead is configurable by activating addons, which the Coveo JavaScript Search Framework provides OOTB
 * (facets, analytics suggestions, Coveo Machine Learning suggestions and advanced Coveo syntax suggestions).
 *
 * It is also possible for external code to provide type-ahead suggestions.
 *
 * See also the {@link Searchbox} component, which can automatically instantiate an Omnibox component along with an
 * optional {@link SearchButton} component.
 */
var Omnibox = (function (_super) {
    __extends(Omnibox, _super);
    /**
     * Creates a new Omnibox component. Also enables necessary addons and binds events on various query events.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Omnibox component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Omnibox(element, options, bindings) {
        var _this = _super.call(this, element, Omnibox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.partialQueries = [];
        _this.lastSuggestions = [];
        _this.movedOnce = false;
        _this.skipAutoSuggest = false;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Omnibox, options);
        var originalValueForQuerySyntax = _this.options.enableQuerySyntax;
        _this.options = _.extend({}, _this.options, _this.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchBox));
        if (_this.options.enableQuerySuggestAddon) {
            new QuerySuggestAddon_1.QuerySuggestAddon(_this);
        }
        new OldOmniboxAddon_1.OldOmniboxAddon(_this);
        _this.createMagicBox();
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents.beforeRedirect, function () { return _this.handleBeforeRedirect(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function () { return _this.handleQuerySuccess(); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.Q, function (args) { return _this.handleQueryStateChanged(args); });
        if (_this.isAutoSuggestion()) {
            _this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function (args) { return _this.handleDuringQuery(args); });
        }
        _this.bind.onComponentOptions(Model_1.MODEL_EVENTS.CHANGE_ONE, ComponentOptionsModel_1.COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, function (args) {
            if (args.value.enableQuerySyntax != null) {
                _this.options.enableQuerySyntax = args.value.enableQuerySyntax;
            }
            else {
                _this.options.enableQuerySyntax = originalValueForQuerySyntax;
            }
            _this.updateGrammar();
        });
        return _this;
    }
    /**
     * Adds the current content of the input to the query and triggers a query if the current content of the input has
     * changed since last submit.
     *
     * Also logs a `searchboxSubmit` event in the usage analytics.
     */
    Omnibox.prototype.submit = function () {
        var _this = this;
        this.magicBox.clearSuggestion();
        this.updateQueryState();
        this.triggerNewQuery(false, function () {
            _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        });
    };
    /**
     * Gets the current content of the input.
     * @returns {string} The current content of the input.
     */
    Omnibox.prototype.getText = function () {
        return this.magicBox.getText();
    };
    /**
     * Sets the content of the input
     * @param text The string to set in the input.
     */
    Omnibox.prototype.setText = function (text) {
        this.magicBox.setText(text);
        this.updateQueryState();
    };
    /**
     * Clears the content of the input.
     */
    Omnibox.prototype.clear = function () {
        this.magicBox.clear();
    };
    /**
     * Gets the `HTMLInputElement` of the Omnibox.
     */
    Omnibox.prototype.getInput = function () {
        return this.magicBox.element.querySelector('input');
    };
    Omnibox.prototype.getResult = function () {
        return this.magicBox.getResult();
    };
    Omnibox.prototype.getDisplayedResult = function () {
        return this.magicBox.getDisplayedResult();
    };
    Omnibox.prototype.getCursor = function () {
        return this.magicBox.getCursor();
    };
    Omnibox.prototype.resultAtCursor = function (match) {
        return this.magicBox.resultAtCursor(match);
    };
    Omnibox.prototype.createGrammar = function () {
        var grammar = null;
        if (this.options.enableQuerySyntax) {
            grammar = exports.MagicBox.Grammars.Expressions(exports.MagicBox.Grammars.Complete);
            if (this.options.enableFieldAddon) {
                new FieldAddon_1.FieldAddon(this);
            }
            if (this.options.fieldAlias != null) {
                this.options.listOfFields = this.options.listOfFields || [];
                this.options.listOfFields = this.options.listOfFields.concat(_.keys(this.options.fieldAlias));
            }
            if (this.options.enableQueryExtensionAddon) {
                new QueryExtensionAddon_1.QueryExtensionAddon(this);
            }
        }
        else {
            grammar = { start: 'Any', expressions: { Any: /.*/ } };
        }
        if (this.options.grammar != null) {
            grammar = this.options.grammar(grammar);
        }
        return grammar;
    };
    Omnibox.prototype.updateGrammar = function () {
        var grammar = this.createGrammar();
        this.magicBox.grammar = new exports.MagicBox.Grammar(grammar.start, grammar.expressions);
        this.magicBox.setText(this.magicBox.getText());
    };
    Omnibox.prototype.createMagicBox = function () {
        var grammar = this.createGrammar();
        this.magicBox = exports.MagicBox.create(this.element, new exports.MagicBox.Grammar(grammar.start, grammar.expressions), {
            inline: this.options.inline,
            selectableSuggestionClass: 'coveo-omnibox-selectable',
            selectedSuggestionClass: 'coveo-omnibox-selected',
            suggestionTimeout: this.options.omniboxTimeout
        });
        this.setupMagicBox();
    };
    Omnibox.prototype.setupMagicBox = function () {
        var _this = this;
        this.magicBox.onmove = function () {
            // We assume that once the user has moved its selection, it becomes an explicit omnibox analytics event
            if (_this.isAutoSuggestion()) {
                _this.modifyEventTo = _this.getOmniboxAnalyticsEventCause();
            }
            _this.movedOnce = true;
        };
        this.magicBox.onfocus = function () {
            if (_this.isAutoSuggestion()) {
                // This flag is used to block the automatic query when the UI is loaded with a query (#q=foo)
                // and then the input is focused. We want to block that query, even if it match the suggestion
                // Only when there is an actual change in the input (user typing something) is when we want the automatic query to kick in
                _this.skipAutoSuggest = true;
            }
        };
        this.magicBox.onsuggestions = function (suggestions) {
            // If text is empty, this can mean that user selected text from the search box
            // and hit "delete" : Reset the partial queries in this case
            if (Utils_1.Utils.isEmptyString(_this.getText())) {
                _this.partialQueries = [];
            }
            _this.movedOnce = false;
            _this.lastSuggestions = suggestions;
            if (_this.isAutoSuggestion() && !_this.skipAutoSuggest) {
                _this.searchAsYouType();
            }
        };
        if (this.options.enableSearchAsYouType) {
            Dom_1.$$(this.element).addClass('coveo-magicbox-search-as-you-type');
        }
        this.magicBox.onchange = function () {
            _this.skipAutoSuggest = false;
            var text = _this.getText();
            if (text != undefined && text != '') {
                if (_this.isAutoSuggestion()) {
                    if (_this.movedOnce) {
                        _this.searchAsYouType(true);
                    }
                }
                else if (_this.options.enableSearchAsYouType) {
                    _this.searchAsYouType(true);
                }
            }
            else {
                _this.clear();
            }
        };
        if (this.options.placeholder) {
            this.magicBox.element.querySelector('input').placeholder = this.options.placeholder;
        }
        this.magicBox.onsubmit = function () {
            _this.magicBox.clearSuggestion();
            _this.updateQueryState();
            _this.triggerNewQuery(false, function () {
                _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
            });
            _this.magicBox.blur();
        };
        this.magicBox.onselect = function (suggestion) {
            var index = _.indexOf(_this.lastSuggestions, suggestion);
            var suggestions = _.compact(_.map(_this.lastSuggestions, function (suggestion) { return suggestion.text; }));
            _this.magicBox.clearSuggestion();
            _this.updateQueryState();
            // A bit tricky here : When it's machine learning auto suggestions
            // the mouse selection and keyboard selection acts differently :
            // keyboard selection will automatically do the query (which will log a search as you type event -> further modified by this.modifyEventTo if needed)
            // mouse selection will not "auto" send the query.
            // the movedOnce variable detect the keyboard movement, and is used to differentiate mouse vs keyboard
            if (!_this.isAutoSuggestion()) {
                _this.usageAnalytics.cancelAllPendingEvents();
                _this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
                });
            }
            else if (_this.isAutoSuggestion() && _this.movedOnce) {
                _this.handleAutoSuggestionWithKeyboard(index, suggestions);
            }
            else if (_this.isAutoSuggestion() && !_this.movedOnce) {
                _this.handleAutoSuggestionsWithMouse(index, suggestions);
            }
            // Consider a selection like a reset of the partial queries (it's the end of a suggestion pattern)
            if (_this.isAutoSuggestion()) {
                _this.partialQueries = [];
            }
        };
        this.magicBox.onblur = function () {
            if (_this.options.enableSearchAsYouType && !_this.options.inline) {
                _this.setText(_this.lastQuery);
            }
            else {
                _this.updateQueryState();
            }
            if (_this.isAutoSuggestion()) {
                _this.usageAnalytics.sendAllPendingEvents();
            }
        };
        this.magicBox.onclear = function () {
            _this.updateQueryState();
            if (_this.options.triggerQueryOnClear) {
                _this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxClear, {});
                });
            }
        };
        this.magicBox.ontabpress = function () {
            _this.handleTabPress();
        };
        this.magicBox.getSuggestions = function () { return _this.handleSuggestions(); };
    };
    Omnibox.prototype.handleAutoSuggestionWithKeyboard = function (index, suggestions) {
        var _this = this;
        if (this.searchAsYouTypeTimeout) {
            // Here, there is currently a search as you typed queued up :
            // Think : user typed very quickly, then very quickly selected a suggestion (without waiting for the search as you type)
            // Cancel the search as you type query, then immediately do the query with the selection (+analytics event with the selection)
            this.usageAnalytics.cancelAllPendingEvents();
            clearTimeout(this.searchAsYouTypeTimeout);
            this.searchAsYouTypeTimeout = undefined;
            this.triggerNewQuery(false, function () {
                _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
            });
        }
        else {
            // Here, the search as you type query has returned, but the analytics event has not ye been sent.
            // Think : user typed slowly, the query returned, and then the user selected a suggestion.
            // Since the analytics event has not yet been sent (search as you type event have a 5 sec delay)
            // modify the pending event, then send the newly modified analytics event immediately.
            this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
            this.modifyCustomDataOnPending(index, suggestions);
            this.usageAnalytics.sendAllPendingEvents();
        }
    };
    Omnibox.prototype.handleAutoSuggestionsWithMouse = function (index, suggestions) {
        var _this = this;
        if (this.searchAsYouTypeTimeout || index != 0) {
            // Here : the user either very quickly chose the first suggestion, and the search as you type is still queued up.
            // OR
            // the user chose something different then the first suggestion.
            // Remove the search as you type if it's there, and do the query with the suggestion directly.
            this.clearSearchAsYouType();
            this.usageAnalytics.cancelAllPendingEvents();
            this.triggerNewQuery(false, function () {
                _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
            });
        }
        else {
            // Here : the user either very slowly chose a suggestion, and there is no search as you typed queued up
            // AND
            // the user chose the first suggestion.
            // this means the query is already returned, but the analytics event is still queued up.
            // modify the analytics event, and send it.
            this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
            this.modifyCustomDataOnPending(index, suggestions);
            this.usageAnalytics.sendAllPendingEvents();
            // This should happen if :
            // users did a (short) query first, which does not match the first suggestion. (eg: typed "t", then search)
            // then, refocus the search box. The same suggestion(s) will re-appear.
            // By selecting the first one with the mouse, we need to retrigger a query because this means the search as you type could not
            // kick in and do the query automatically.
            if (this.lastQuery != this.getText()) {
                this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
                });
            }
        }
    };
    Omnibox.prototype.modifyCustomDataOnPending = function (index, suggestions) {
        var pendingEvt = this.usageAnalytics.getPendingSearchEvent();
        if (pendingEvt instanceof PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent) {
            var newCustomData_1 = this.buildCustomDataForPartialQueries(index, suggestions);
            _.each(_.keys(newCustomData_1), function (k) {
                pendingEvt.modifyCustomData(k, newCustomData_1[k]);
            });
        }
    };
    Omnibox.prototype.buildCustomDataForPartialQueries = function (index, suggestions) {
        return {
            partialQueries: this.cleanCustomData(this.partialQueries),
            suggestionRanking: index,
            suggestions: this.cleanCustomData(suggestions),
            partialQuery: _.last(this.partialQueries)
        };
    };
    Omnibox.prototype.cleanCustomData = function (toClean, rejectLength) {
        if (rejectLength === void 0) { rejectLength = 256; }
        // Filter out only consecutive values that are the identical
        toClean = _.compact(_.filter(toClean, function (partial, pos, array) {
            return pos === 0 || partial !== array[pos - 1];
        }));
        // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
        // Need to replace ;
        toClean = _.map(toClean, function (partial) {
            return partial.replace(/;/g, '');
        });
        // Reduce right to get the last X words that adds to less then rejectLength
        var reducedToRejectLengthOrLess = [];
        _.reduceRight(toClean, function (memo, partial) {
            var totalSoFar = memo + partial.length;
            if (totalSoFar <= rejectLength) {
                reducedToRejectLengthOrLess.push(partial);
            }
            return totalSoFar;
        }, 0);
        toClean = reducedToRejectLengthOrLess.reverse();
        var ret = toClean.join(';');
        // analytics service can store max 256 char in a custom event
        // if we're over that, call cleanup again with an arbitrary 10 less char accepted
        if (ret.length >= 256) {
            return this.cleanCustomData(toClean, rejectLength - 10);
        }
        return toClean.join(';');
    };
    Omnibox.prototype.handleSuggestions = function () {
        var suggestionsEventArgs = {
            suggestions: [],
            omnibox: this
        };
        this.bind.trigger(this.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, suggestionsEventArgs);
        var text = this.getText();
        if (!Utils_1.Utils.isNullOrEmptyString(text)) {
            this.partialQueries.push(text);
        }
        return _.compact(suggestionsEventArgs.suggestions);
    };
    Omnibox.prototype.handleBeforeRedirect = function () {
        this.updateQueryState();
    };
    Omnibox.prototype.handleBuildingQuery = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        this.updateQueryState();
        this.lastQuery = this.getQuery(data.searchAsYouType);
        var result = this.lastQuery == this.magicBox.getDisplayedResult().input ? this.magicBox.getDisplayedResult().clone() : this.magicBox.grammar.parse(this.lastQuery).clean();
        var preprocessResultForQueryArgs = {
            result: result
        };
        if (this.options.enableQuerySyntax) {
            var notQuotedValues = preprocessResultForQueryArgs.result.findAll('FieldValueNotQuoted');
            _.each(notQuotedValues, function (value) { return value.value = '"' + value.value.replace(/"|\u00A0/g, ' ') + '"'; });
            if (this.options.fieldAlias) {
                var fieldNames = preprocessResultForQueryArgs.result.findAll(function (result) { return result.expression.id == 'FieldName' && result.isSuccess(); });
                _.each(fieldNames, function (result) {
                    var alias = _.find(_.keys(_this.options.fieldAlias), function (alias) { return alias.toLowerCase() == result.value.toLowerCase(); });
                    if (alias != null) {
                        result.value = _this.options.fieldAlias[alias];
                    }
                });
            }
        }
        this.bind.trigger(this.element, OmniboxEvents_1.OmniboxEvents.omniboxPreprocessResultForQuery, preprocessResultForQueryArgs);
        var query = preprocessResultForQueryArgs.result.toString();
        new QueryboxQueryParameters_1.QueryboxQueryParameters(this.options).addParameters(data.queryBuilder, query);
    };
    Omnibox.prototype.handleTabPress = function () {
        if (this.options.enableQuerySuggestAddon) {
            this.handleTabPressForSuggestions();
        }
        else {
            this.handleTabPressForOldOmniboxAddon();
        }
    };
    Omnibox.prototype.handleTabPressForSuggestions = function () {
        if (!this.options.enableSearchAsYouType) {
            var suggestions = _.compact(_.map(this.lastSuggestions, function (suggestion) { return suggestion.text; }));
            this.usageAnalytics.logCustomEvent(this.getOmniboxAnalyticsEventCause(), this.buildCustomDataForPartialQueries(0, suggestions), this.element);
        }
    };
    Omnibox.prototype.handleTabPressForOldOmniboxAddon = function () {
        if (this.lastSuggestions && this.lastSuggestions[0] && this.lastSuggestions[0].dom) {
            var firstSelected = Dom_1.$$(this.lastSuggestions[0].dom).find('.coveo-omnibox-selected');
            var firstSelectable = Dom_1.$$(this.lastSuggestions[0].dom).find('.coveo-omnibox-selectable');
            if (firstSelected) {
                Dom_1.$$(firstSelected).trigger('tabSelect');
            }
            else if (firstSelectable) {
                Dom_1.$$(firstSelectable).trigger('tabSelect');
            }
        }
    };
    Omnibox.prototype.triggerNewQuery = function (searchAsYouType, analyticsEvent) {
        clearTimeout(this.searchAsYouTypeTimeout);
        var text = this.getQuery(searchAsYouType);
        if (this.shouldExecuteQuery(searchAsYouType)) {
            this.lastQuery = text;
            analyticsEvent();
            this.queryController.executeQuery({
                searchAsYouType: searchAsYouType,
                logInActionsHistory: true
            });
        }
    };
    Omnibox.prototype.getQuery = function (searchAsYouType) {
        var query;
        if (searchAsYouType) {
            query = this.magicBox.getWordCompletion();
            if (query == null && this.lastSuggestions != null && this.lastSuggestions.length > 0) {
                var textSuggestion = _.find(this.lastSuggestions, function (suggestion) { return suggestion.text != null; });
                if (textSuggestion != null) {
                    query = textSuggestion.text;
                }
            }
        }
        return query || this.magicBox.getText();
    };
    Omnibox.prototype.updateQueryState = function () {
        this.queryStateModel.set(QueryStateModel_2.QueryStateModel.attributesEnum.q, this.magicBox.getText());
    };
    Omnibox.prototype.handleQueryStateChanged = function (args) {
        Assert_1.Assert.exists(args);
        var q = args.value;
        if (q != this.magicBox.getText()) {
            this.magicBox.setText(q);
        }
    };
    Omnibox.prototype.handleQuerySuccess = function () {
        if (!this.isAutoSuggestion()) {
            this.partialQueries = [];
        }
    };
    Omnibox.prototype.handleDuringQuery = function (args) {
        var _this = this;
        // When the query results returns ... (args.promise)
        args.promise.then(function () {
            // Get a handle on a pending search as you type (those events are delayed, not sent instantly)
            var pendingEvent = _this.usageAnalytics.getPendingSearchEvent();
            if (pendingEvent instanceof PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent) {
                pendingEvent.beforeResolve.then(function (evt) {
                    // Check if we need to modify the event type beforeResolving it
                    args.promise.then(function () {
                        if (_this.modifyEventTo) {
                            evt.modifyEventCause(_this.modifyEventTo);
                            _this.modifyEventTo = null;
                        }
                    });
                });
            }
        });
    };
    Omnibox.prototype.searchAsYouType = function (forceExecuteQuery) {
        var _this = this;
        if (forceExecuteQuery === void 0) { forceExecuteQuery = false; }
        this.clearSearchAsYouType();
        if (this.shouldExecuteQuery(true)) {
            this.searchAsYouTypeTimeout = setTimeout(function () {
                if (_this.suggestionShouldTriggerQuery() || forceExecuteQuery) {
                    var suggestions_1 = _.map(_this.lastSuggestions, function (suggestion) { return suggestion.text; });
                    var index_1 = _.indexOf(suggestions_1, _this.magicBox.getWordCompletion());
                    _this.triggerNewQuery(true, function () {
                        _this.usageAnalytics.logSearchAsYouType(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxAsYouType, _this.buildCustomDataForPartialQueries(index_1, suggestions_1));
                    });
                    _this.clearSearchAsYouType();
                }
            }, this.options.searchAsYouTypeDelay);
        }
    };
    Omnibox.prototype.isAutoSuggestion = function () {
        return this.options.enableSearchAsYouType && this.options.enableQuerySuggestAddon;
    };
    Omnibox.prototype.shouldExecuteQuery = function (searchAsYouType) {
        var text = this.getQuery(searchAsYouType);
        return this.lastQuery != text && text != null;
    };
    Omnibox.prototype.suggestionShouldTriggerQuery = function (suggestions) {
        if (suggestions === void 0) { suggestions = this.lastSuggestions; }
        if (this.shouldExecuteQuery(true)) {
            if (suggestions && suggestions[0]) {
                var suggestion = suggestions[0];
                // If we have access to a confidence level, return true if we are equal or above the minimum confidence level.
                if (suggestion && suggestion.executableConfidence != undefined) {
                    return suggestion.executableConfidence >= MINIMUM_EXECUTABLE_CONFIDENCE;
                }
                // If we don't have access to a confidence level, return true only if it "starts with" the content of the search box
                if (suggestion.text && suggestion.text.indexOf(this.magicBox.getText()) == 0) {
                    return true;
                }
            }
        }
        return false;
    };
    Omnibox.prototype.clearSearchAsYouType = function () {
        clearTimeout(this.searchAsYouTypeTimeout);
        this.searchAsYouTypeTimeout = undefined;
    };
    Omnibox.prototype.getOmniboxAnalyticsEventCause = function () {
        if (this.searchInterface instanceof SearchInterface_1.StandaloneSearchInterface) {
            return AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFromLink;
        }
        return AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxAnalytics;
    };
    return Omnibox;
}(Component_1.Component));
Omnibox.ID = 'Omnibox';
Omnibox.doExport = function () {
    GlobalExports_1.exportGlobally({
        'Omnibox': Omnibox,
        'MagicBox': exports.MagicBox
    });
};
/**
 * The options for the omnibox
 * @componentOptions
 */
Omnibox.options = {
    /**
     * Specifies whether suggestions appearing in the Omnibox should push the result down instead of appearing over the
     * results.
     *
     * Set this option as well as {@link Omnibox.options.enableSearchAsYouType} and
     * {@link Omnibox.options.enableQuerySuggestAddon} to `true` for a cool effect!
     *
     * Default value is `false`.
     */
    inline: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether to automatically trigger a new query whenever the end user types new text inside the Omnibox.
     *
     * Set this option as well a {@link Omnibox.options.inline} and
     * {@link Omnibox.options.enableQuerySuggestAddon} to `true` for a cool effect!
     *
     * Default value is `false`.
     */
    enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * If {@link Omnibox.options.enableSearchAsYouType} is `true`, specifies the delay (in milliseconds) before
     * triggering a new query when the user types new text inside the Omnibox.
     *
     * Default value is `2000`. Minimum value is `0`.
     */
    searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({
        defaultValue: 2000,
        min: 0,
        depend: 'enableSearchAsYouType'
    }),
    /**
     * If {@link Querybox.options.enableQuerySyntax} is `true`, specifies whether to enable the `field` addon.
     *
     * The `field` addon allows the search box to highlight and complete field syntax.
     *
     * **Example:**
     *
     * > Suppose you want to filter on a certain file type. You start typing `@sysf` in the input. The Omnibox provides
     * > you with several matching fields. You select the `@sysfiletype` suggestion and type `=`. If this option is set
     * > to `true`, then the Omnibox provides you with suggestions for available matching file types.
     *
     * Default value is `false`.
     */
    enableFieldAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
        defaultValue: false,
        depend: 'enableQuerySyntax',
        postProcessing: function (value, options) {
            if (value) {
                options.enableQuerySyntax = true;
            }
            return value;
        }
    }),
    enableSimpleFieldAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFieldAddon' }),
    listOfFields: ComponentOptions_1.ComponentOptions.buildFieldsOption({ depend: 'enableFieldAddon' }),
    /**
     * Specifies whether to enable the Coveo Machine Learning (Coveo ML) query suggestions.
     *
     * This implies that you have a proper Coveo ML integration configured (see
     * [Managing Machine Learning Query Suggestions in a Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=168)).
     *
     * Default value is `true`.
     */
    enableQuerySuggestAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
        defaultValue: true,
        alias: ['enableTopQueryAddon', 'enableRevealQuerySuggestAddon']
    }),
    /**
     * If {@link Querybox.options.enableQuerySyntax} is `true`, specifies whether to enable the `query extension` addon.
     *
     * The `query extension` addon allows the Omnibox to complete the syntax for query extensions.
     *
     * Default value is `false`.
     */
    enableQueryExtensionAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
        defaultValue: false,
        depend: 'enableQuerySyntax',
        postProcessing: function (value, options) {
            if (value) {
                options.enableQuerySyntax = true;
            }
            return value;
        }
    }),
    /**
     * Specifies a placeholder for the input.
     */
    placeholder: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
    /**
     * Specifies a timeout (in milliseconds) before rejecting suggestions in the Omnibox.
     *
     * Default value is `2000`. Minimum value is `0`.
     */
    omniboxTimeout: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 }),
    /**
     * Specifies whether the Coveo Platform should try to interpret special query syntax such as field references in the
     * query that the user enters in the Querybox (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
     *
     * Setting this option to `true` also causes the query syntax in the Querybox to highlight.
     *
     * Default value is `false`.
     */
    enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({
        defaultValue: false
    }),
};
exports.Omnibox = Omnibox;
Omnibox.options = _.extend({}, Omnibox.options, Querybox_1.Querybox.options);
Initialization_1.Initialization.registerAutoCreateComponent(Omnibox);


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
//# sourceMappingURL=Omnibox.js.map