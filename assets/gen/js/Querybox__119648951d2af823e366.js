webpackJsonpCoveo__temporary([43],{

/***/ 317:
/***/ (function(module, exports) {

var Coveo,__extends=this&&this.__extends||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);function s(){this.constructor=t}t.prototype=null===e?Object.create(e):(s.prototype=e.prototype,new s)};!function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,e,n){var s=this;this.expression=e,this.input=n,_.isString(t)?this.value=t:_.isArray(t)&&(this.subResults=t,_.forEach(this.subResults,function(t){t.parent=s}))}return t.prototype.isSuccess=function(){return null!=this.value||null!=this.subResults&&_.all(this.subResults,function(t){return t.isSuccess()})},t.prototype.path=function(t){var e=null!=this.parent&&this.parent!=t?this.parent.path(t):[];return e.push(this),e},t.prototype.findParent=function(t){for(var e=this,n=_.isString(t)?function(e){return t==e.expression.id}:t;null!=e&&!n(e);)e=e.parent;return e},t.prototype.find=function(t){var e=_.isString(t)?function(e){return t==e.expression.id}:t;if(e(this))return this;if(this.subResults)for(var n=0;n<this.subResults.length;n++){var s=this.subResults[n].find(e);if(s)return s}return null},t.prototype.findAll=function(t){var e=[],n=_.isString(t)?function(e){return t==e.expression.id}:t;return n(this)&&e.push(this),this.subResults&&(e=_.reduce(this.subResults,function(t,e){return t.concat(e.findAll(n))},e)),e},t.prototype.resultAt=function(t,e){if(t<0||t>this.getLength())return[];if(null!=e){if(_.isString(e)){if(e==this.expression.id)return[this]}else if(e(this))return[this]}else if(null!=(null==this.value&&null==this.subResults?this.input:this.value))return[this];if(null!=this.subResults){for(var n=[],s=0;s<this.subResults.length;s++){var i=this.subResults[s];if(n=n.concat(i.resultAt(t,e)),(t-=i.getLength())<0)break}return n}return[]},t.prototype.getExpect=function(){return null==this.value&&null==this.subResults?[this]:null!=this.subResults?_.reduce(this.subResults,function(t,e){return t.concat(e.getExpect())},[]):[]},t.prototype.getBestExpect=function(){var t=this.getExpect(),e=(n=_.groupBy(t,function(t){return t.input}))[_.last(_.keys(n).sort(function(t,e){return e.length-t.length}))],n=_.groupBy(e,function(t){return t.expression.id});return _.map(n,function(t){return _.chain(t).map(function(t){return{path:t.path().length,result:t}}).sortBy("path").pluck("result").first().value()})},t.prototype.getHumanReadableExpect=function(){var t=this.getBestExpect(),e=t.length>0?_.last(t).input:"";return"Expected "+_.map(t,function(t){return t.getHumanReadable()}).join(" or ")+" but "+(e.length>0?JSON.stringify(e[0]):"end of input")+" found."},t.prototype.before=function(){if(null==this.parent)return"";var t=_.indexOf(this.parent.subResults,this);return this.parent.before()+_.chain(this.parent.subResults).first(t).map(function(t){return t.toString()}).join("").value()},t.prototype.after=function(){if(null==this.parent)return"";var t=_.indexOf(this.parent.subResults,this);return _.chain(this.parent.subResults).last(this.parent.subResults.length-t-1).map(function(t){return t.toString()}).join("").value()+this.parent.after()},t.prototype.getLength=function(){return null!=this.value?this.value.length:null!=this.subResults?_.reduce(this.subResults,function(t,e){return t+e.getLength()},0):this.input.length},t.prototype.toHtmlElement=function(){var t=document.createElement("span"),e=null!=this.expression?this.expression.id:null;return null!=e&&t.setAttribute("data-id",e),t.setAttribute("data-success",this.isSuccess().toString()),null!=this.value?(t.appendChild(document.createTextNode(this.value)),t.setAttribute("data-value",this.value)):null!=this.subResults?_.each(this.subResults,function(e){t.appendChild(e.toHtmlElement())}):(t.appendChild(document.createTextNode(this.input)),t.setAttribute("data-input",this.input),t.className="magic-box-error"+(this.input.length>0?"":" magic-box-error-empty")),t.result=this,t},t.prototype.clean=function(e){if(null!=e||!this.isSuccess()){e=e||_.last(this.getBestExpect()).path(this);var n=_.first(e);if(null!=n){var s=_.indexOf(this.subResults,n),i=-1==s?[]:_.map(_.first(this.subResults,s),function(t){return t.clean()});return i.push(n.clean(_.rest(e))),new t(i,this.expression,this.input)}return new t(null,this.expression,this.input)}return null!=this.value?new t(this.value,this.expression,this.input):null!=this.subResults?new t(_.map(this.subResults,function(t){return t.clean()}),this.expression,this.input):void 0},t.prototype.clone=function(){return null!=this.value?new t(this.value,this.expression,this.input):null!=this.subResults?new t(_.map(this.subResults,function(t){return t.clone()}),this.expression,this.input):new t(null,this.expression,this.input)},t.prototype.toString=function(){return null!=this.value?this.value:null!=this.subResults?_.map(this.subResults,function(t){return t.toString()}).join(""):this.input},t.prototype.getHumanReadable=function(){return this.expression instanceof e.ExpressionConstant?JSON.stringify(this.expression.value):this.expression.id},t}(),e.Result=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(t){function n(n){t.call(this,[n],e.ExpressionEndOfInput,n.input);var s=new e.Result(null,e.ExpressionEndOfInput,n.input.substr(n.getLength()));s.parent=this,this.subResults.push(s)}return __extends(n,t),n}(e.Result),e.EndOfInputResult=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(t){function n(e,n,s,i){var o=this;t.call(this,null!=e?[e]:null,n,s),this.result=e,this.expression=n,this.input=s,this.failAttempt=i,_.forEach(this.failAttempt,function(t){t.parent=o})}return __extends(n,t),n.prototype.getExpect=function(){var t=this,e=[];return null!=this.result&&(e=this.result.getExpect()),(e=_.reduce(this.failAttempt,function(t,e){return t.concat(e.getExpect())},e)).length>0&&_.all(e,function(e){return e.input==t.input})?[this]:e},n.prototype.clean=function(t){if(null!=t||!this.isSuccess()){t=_.rest(t||_.last(this.getBestExpect()).path(this));var n=_.first(t);return null==n?new e.Result(null,this.expression,this.input):new e.Result([n.clean(_.rest(t))],this.expression,this.input)}return new e.Result(_.map(this.result.subResults,function(t){return t.clean()}),this.expression,this.input)},n}(e.Result),e.OptionResult=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(t){function n(e,n,s,i){t.call(this,e,n,s),this.results=e,this.expression=n,this.input=s,_.last(e)!=i&&(this.failAttempt=i,null!=this.failAttempt&&(this.failAttempt.parent=this))}return __extends(n,t),n.prototype.getExpect=function(){var e=t.prototype.getExpect.call(this);return null!=this.failAttempt?e.concat(this.failAttempt.getExpect()):e},n.prototype.clean=function(n){if(null!=this.failAttempt&&(null!=n||!this.isSuccess())){n=n||_.last(this.getBestExpect()).path(this);var s=_.first(n);if(null!=s&&s==this.failAttempt){var i=_.last(this.subResults),o=_.map(null!=i&&i.isSuccess()?this.subResults:_.initial(this.subResults),function(t){return t.clean()});return o.push(s.clean(_.rest(n))),new e.Result(o,this.expression,this.input)}}return t.prototype.clean.call(this,n)},n}(e.Result),e.RefResult=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,e){this.value=t,this.id=e}return t.prototype.parse=function(t,n){var s=0==t.indexOf(this.value),i=new e.Result(s?this.value:null,this,t);return s&&n&&t.length>this.value.length?new e.EndOfInputResult(i):i},t.prototype.toString=function(){return this.value},t}(),e.ExpressionConstant=n}(Coveo||(Coveo={})),function(t){(t.MagicBox||(t.MagicBox={})).ExpressionEndOfInput={id:"end of input",parse:null}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,e,n){this.func=t,this.id=e,this.grammar=n}return t.prototype.parse=function(t,e){return this.func(t,e,this)},t.prototype.toString=function(){return this.id},t}(),e.ExpressionFunction=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,e){if(this.parts=t,this.id=e,0==t.length)throw JSON.stringify(e)+" should have at least 1 parts"}return t.prototype.parse=function(t,n){for(var s,i=[],o=t,r=0;r<this.parts.length;r++){if(s=this.parts[r].parse(o,n&&r==this.parts.length-1),i.push(s),!s.isSuccess())break;o=o.substr(s.getLength())}return new e.Result(i,this,t)},t.prototype.toString=function(){return this.id},t}(),e.ExpressionList=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,e){this.parts=t,this.id=e}return t.prototype.parse=function(t,n){for(var s=[],i=0;i<this.parts.length;i++){var o=this.parts[i].parse(t,n);if(o.isSuccess())return new e.OptionResult(o,this,t,s);s.push(o)}return new e.OptionResult(null,this,t,s)},t.prototype.toString=function(){return this.id},t}(),e.ExpressionOptions=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,e,n,s){this.ref=t,this.occurrence=e,this.id=n,this.grammar=s}return t.prototype.parse=function(t,e){var n=this.grammar.getExpression(this.ref);if(null==n)throw"Expression not found:"+this.ref;return"?"==this.occurrence||null==this.occurrence?this.parseOnce(t,e,n):this.parseMany(t,e,n)},t.prototype.parseOnce=function(t,n,s){var i=s.parse(t,n),o=i.isSuccess();return o||"?"!=this.occurrence?new e.RefResult([i],this,t,o?null:i):n?0==t.length?new e.RefResult([],this,t,i):_.all(i.getBestExpect(),function(t){return t.expression==e.ExpressionEndOfInput})?new e.RefResult([new e.Result(null,e.ExpressionEndOfInput,t)],this,t,i):i:new e.RefResult([],this,t,null)},t.prototype.parseMany=function(t,n,s){var i,o,r=[],u=t;do{(o=(i=s.parse(u,!1)).isSuccess())&&(r.push(i),u=u.substr(i.getLength()))}while(o&&i.input!=u);var a=_.isNumber(this.occurrence)?this.occurrence:"+"==this.occurrence?1:0;if(r.length<a)r.push(i);else if(n)if(r.length>0){var l=_.last(r);(i=s.parse(l.input,!0)).isSuccess()?r[r.length-1]=i:(r.push(new e.Result(null,e.ExpressionEndOfInput,l.input.substr(l.getLength()))),i=s.parse(l.input.substr(l.getLength()),!0))}else if(0!=t.length){var p=new e.Result(null,e.ExpressionEndOfInput,t);return new e.RefResult([p],this,t,i)}return new e.RefResult(r,this,t,i)},t.prototype.toString=function(){return this.id},t}(),e.ExpressionRef=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,e,n){this.value=t,this.id=e}return t.prototype.parse=function(t,n){var s=t.match(this.value);null!=s&&0!=s.index&&(s=null);var i=new e.Result(null!=s?s[0]:null,this,t);return i.isSuccess()&&n&&t.length>i.value.length?new e.EndOfInputResult(i):i},t.prototype.toString=function(){return this.id},t}(),e.ExpressionRegExp=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,n){void 0===n&&(n={}),this.expressions={},this.start=new e.ExpressionRef(t,null,"start",this),this.addExpressions(n)}return t.prototype.addExpressions=function(t){var e=this;_.each(t,function(t,n){e.addExpression(n,t)})},t.prototype.addExpression=function(e,n){if(e in this.expressions)throw"Grammar already contain the id:"+e;this.expressions[e]=t.buildExpression(n,e,this)},t.prototype.getExpression=function(t){return this.expressions[t]},t.prototype.parse=function(t){return this.start.parse(t,!0)},t.buildExpression=function(t,n,s){if("undefined"==typeof t)throw"Invalid Expression: "+t;if(_.isString(t))return this.buildStringExpression(t,n,s);if(_.isArray(t))return new e.ExpressionOptions(_.map(t,function(t,i){return new e.ExpressionRef(t,null,n+"_"+i,s)}),n);if(_.isRegExp(t))return new e.ExpressionRegExp(t,n,s);if(_.isFunction(t))return new e.ExpressionFunction(t,n,s);throw"Invalid Expression: "+t},t.buildStringExpression=function(n,s,i){var o=t.stringMatch(n,t.spliter),r=_.map(o,function(t,n){if(t[1]){var o=t[1],r=t[3]?Number(t[3]):t[2]||null;return new e.ExpressionRef(o,r,s+"_"+n,i)}return new e.ExpressionConstant(t[4],s+"_"+n)});if(1==r.length){var u=r[0];return u.id=s,u}return new e.ExpressionList(r,s)},t.stringMatch=function(t,e){for(var n,s=[],i=new RegExp(e.source,"g");null!==(n=i.exec(t));)s.push(n);return s},t.spliter=/\[(\w+)(\*|\+|\?|\{([1-9][0-9]*)\})?\]|(.[^\[]*)/,t}(),e.Grammar=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,n,s){this.element=t,this.onchange=n,this.magicBox=s,this.hasFocus=!1,this.justPressedTab=!1,this.underlay=document.createElement("div"),this.underlay.className="magic-box-underlay",this.highlightContainer=document.createElement("span"),this.highlightContainer.className="magic-box-highlight-container",this.underlay.appendChild(this.highlightContainer),this.ghostTextContainer=document.createElement("span"),this.ghostTextContainer.className="magic-box-ghost-text",this.underlay.appendChild(this.ghostTextContainer),this.input=e.$$(t).find("input"),this.input?t.insertBefore(this.underlay,this.input):(this.input=document.createElement("input"),t.appendChild(this.underlay),t.appendChild(this.input)),this.input.spellcheck=!1,this.input.setAttribute("form","coveo-dummy-form"),this.input.setAttribute("autocomplete","off"),this.setupHandler()}return t.prototype.updateInput=function(){this.input.value!=this.result.input&&(this.input.value=this.result.input,this.hasFocus&&this.setCursor(this.getValue().length))},t.prototype.updateHighlight=function(){e.$$(this.highlightContainer).empty(),this.highlightContainer.appendChild(this.result.toHtmlElement())},t.prototype.updateWordCompletion=function(){e.$$(this.ghostTextContainer).empty(),null!=this.wordCompletion&&this.ghostTextContainer.appendChild(document.createTextNode(this.wordCompletion.substr(this.result.input.length)))},t.prototype.updateScroll=function(t){var n=this;void 0===t&&(t=!0);var s=function(){n.underlay.clientWidth<n.underlay.scrollWidth&&(n.underlay.style.visibility="hidden",n.underlay.scrollLeft=n.input.scrollLeft,n.underlay.scrollTop=n.input.scrollTop,n.underlay.style.visibility="visible"),n.updateScrollDefer=null,n.hasFocus&&n.updateScroll()};t?null==this.updateScrollDefer&&(this.updateScrollDefer=e.requestAnimationFrame(s)):s()},t.prototype.setResult=function(t,e){this.result=t,this.updateInput(),this.updateHighlight(),_.isUndefined(e)&&null!=this.wordCompletion&&0==this.wordCompletion.indexOf(this.result.input)?this.updateWordCompletion():this.setWordCompletion(e),this.updateScroll()},t.prototype.setWordCompletion=function(t){null!=t&&0!=t.toLowerCase().indexOf(this.result.input.toLowerCase())&&(t=null),this.wordCompletion=t,this.updateWordCompletion(),this.updateScroll()},t.prototype.setCursor=function(t){if(this.input.focus(),this.input.createTextRange){var e=this.input.createTextRange();e.move("character",t),e.select()}else null!=this.input.selectionStart&&(this.input.focus(),this.input.setSelectionRange(t,t))},t.prototype.getCursor=function(){return this.input.selectionStart},t.prototype.setupHandler=function(){var t=this;this.input.onblur=function(){t.hasFocus=!1,setTimeout(function(){t.hasFocus||t.onblur&&t.onblur()},300),t.updateScroll()},this.input.onfocus=function(){t.hasFocus||(t.hasFocus=!0,t.updateScroll(),t.onfocus&&t.onfocus())},this.input.onkeydown=function(e){t.keydown(e)},this.input.onkeyup=function(e){t.keyup(e)},this.input.onclick=function(){t.onchangecursor()},this.input.oncut=function(){setTimeout(function(){t.onInputChange()})},this.input.onpaste=function(){setTimeout(function(){t.onInputChange()})}},t.prototype.focus=function(){var t=this;this.hasFocus=!0,setTimeout(function(){t.input.focus(),t.setCursor(t.getValue().length)})},t.prototype.blur=function(){this.hasFocus&&this.input.blur()},t.prototype.keydown=function(t){var n=this;switch(t.keyCode||t.which){case 9:!this.justPressedTab&&this.magicBox.hasSuggestions()&&t.preventDefault(),this.justPressedTab=!0;break;default:t.stopPropagation(),this.justPressedTab=!1,null==this.onkeydown||this.onkeydown(t.keyCode||t.which)?e.requestAnimationFrame(function(){n.onInputChange()}):t.preventDefault()}},t.prototype.keyup=function(t){switch(t.keyCode||t.which){case 9:this.tabPress();break;case 37:case 39:this.onchangecursor();break;default:null==this.onkeydown||this.onkeyup(t.keyCode||t.which)?this.onInputChange():t.preventDefault()}},t.prototype.tabPress=function(){null!=this.wordCompletion&&(this.input.value=this.wordCompletion),this.ontabpress&&this.ontabpress(),this.magicBox.showSuggestion()},t.prototype.onInputChange=function(){this.result.input!=this.input.value&&this.onchange(this.input.value,!1)},t.prototype.getValue=function(){return this.input.value},t.prototype.getWordCompletion=function(){return this.wordCompletion},t}(),e.InputManager=n}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,n){var s=this;this.element=t,this.count=1,this.options=_.defaults(n,{selectableClass:"magic-box-suggestion",selectedClass:"magic-box-selected"}),void 0==this.options.timeout&&(this.options.timeout=500),this.hasSuggestions=!1,e.$$(this.element).on("mouseover",function(t){s.handleMouseOver(t)}),e.$$(this.element).on("mouseout",function(t){s.handleMouseOut(t)})}return t.prototype.handleMouseOver=function(t){var n=e.$$(t.target),s=n.parents(this.options.selectableClass);n.hasClass(this.options.selectableClass)?this.addSelectedClass(n.el):s.length>0&&this.element.contains(s[0])&&this.addSelectedClass(s[0])},t.prototype.handleMouseOut=function(t){var n=e.$$(t.target),s=n.parents(this.options.selectableClass);if(t.relatedTarget){var i=e.$$(t.relatedTarget).parents(this.options.selectableClass);n.hasClass(this.options.selectedClass)&&!e.$$(t.relatedTarget).hasClass(this.options.selectableClass)?n.removeClass(this.options.selectedClass):0==i.length&&s.length>0&&e.$$(s[0]).removeClass(this.options.selectedClass)}else n.hasClass(this.options.selectedClass)?n.removeClass(this.options.selectedClass):s.length>0&&e.$$(s[0]).removeClass(this.options.selectedClass)},t.prototype.moveDown=function(){var t=this.element.getElementsByClassName(this.options.selectedClass).item(0),n=this.element.getElementsByClassName(this.options.selectableClass),s=-1;if(null!=t){e.$$(t).removeClass(this.options.selectedClass);for(var i=0;i<n.length;i++)if(t==n.item(i)){s=i;break}s=-1==s?0:s+1}else s=0;return null!=(t=n.item(s))&&e.$$(t).addClass(this.options.selectedClass),this.returnMoved(t)},t.prototype.moveUp=function(){var t=this.element.getElementsByClassName(this.options.selectedClass).item(0),n=this.element.getElementsByClassName(this.options.selectableClass),s=-1;if(null!=t){e.$$(t).removeClass(this.options.selectedClass);for(var i=0;i<n.length;i++)if(t==n.item(i)){s=i;break}s=-1==s?n.length-1:s-1}else s=n.length-1;return null!=(t=n.item(s))&&e.$$(t).addClass(this.options.selectedClass),this.returnMoved(t)},t.prototype.select=function(){var t=this.element.getElementsByClassName(this.options.selectedClass).item(0);return null!=t&&e.$$(t).trigger("keyboardSelect"),t},t.prototype.mergeSuggestions=function(t,e){var n,s=this,i=[],o=!0;t=_.compact(t);var r=this.pendingSuggestion=new Promise(function(e,u){_.each(t,function(t){var e=!1;setTimeout(function(){e=!0,o=!1},s.options.timeout),t.then(function(t){!e&&t&&(i=i.concat(t))})});var a=function(){o&&(n&&clearTimeout(n),0==i.length?e([]):r==s.pendingSuggestion||null==s.pendingSuggestion?e(i.sort(function(t,e){return e.index-t.index})):u("new request queued")),o=!1};0==t.length&&a(),void 0==t&&a(),n=setTimeout(function(){a()},s.options.timeout),Promise.all(t).then(function(){return a()})});r.then(function(t){return e&&e(t),s.updateSuggestions(t),t}).catch(function(){return null})},t.prototype.updateSuggestions=function(t){var n=this;e.$$(this.element).empty(),this.element.className="magic-box-suggestions",_.each(t,function(t){var s=t.dom;if(s){e.$$(s).removeClass(n.options.selectedClass);var i=e.$$(s).find("."+n.options.selectableClass);e.$$(i).removeClass(n.options.selectedClass)}else{if((s=document.createElement("div")).className="magic-box-suggestion",null!=t.html)s.innerHTML=t.html;else if(null!=t.text)s.appendChild(document.createTextNode(t.text));else if(null!=t.separator){s.className="magic-box-suggestion-seperator";var o=document.createElement("div");o.className="magic-box-suggestion-seperator-label",o.appendChild(document.createTextNode(t.separator)),s.appendChild(o)}e.$$(s).on("click",function(){t.onSelect()}),e.$$(s).on("keyboardSelect",function(){t.onSelect()}),e.$$(s).addClass(n.options.selectableClass)}s.suggestion=t,n.element.appendChild(s)}),t.length>0?(e.$$(this.element).addClass("magic-box-hasSuggestion"),this.hasSuggestions=!0):(e.$$(this.element).removeClass("magic-box-hasSuggestion"),this.hasSuggestions=!1)},t.prototype.returnMoved=function(t){if(null!=t){if(t.suggestion)return t.suggestion;if(t["no-text-suggestion"])return null;if(t instanceof HTMLElement)return{text:e.$$(t).text()}}return null},t.prototype.addSelectedClass=function(t){for(var n=this.element.getElementsByClassName(this.options.selectedClass),s=0;s<n.length;s++){var i=n.item(s);e.$$(i).removeClass(this.options.selectedClass)}e.$$(t).addClass(this.options.selectedClass)},t}(),e.SuggestionsManager=n}(Coveo||(Coveo={})),function(t){var e;(function(t){var n=function(t,e){return'<span class="'+t+'">'+_.escape(e)+"</span>"};t.highlightText=function(t,e,s,i,o){if(void 0===s&&(s=!1),void 0===i&&(i="magic-box-hightlight"),void 0===o&&(o=""),0==e.length)return t;var r=e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&"),u=new RegExp("("+r+")|(.*?(?="+r+")|.+)",s?"gi":"g");return t.replace(u,function(t,e,s){return n(null!=e?i:o,t)})};var s=function(){function t(t){this.el=t}return t.prototype.text=function(t){if(!t)return this.el.innerText||this.el.textContent;void 0!=this.el.innerText?this.el.innerText=t:void 0!=this.el.textContent&&(this.el.textContent=t)},t.prototype.nodeListToArray=function(t){for(var e=t.length,n=new Array(e);e--;)n[e]=t.item(e);return n},t.prototype.empty=function(){for(;this.el.firstChild;)this.el.removeChild(this.el.firstChild)},t.prototype.show=function(){this.el.style.display="visible"},t.prototype.hide=function(){this.el.style.display="none"},t.prototype.toggle=function(t){void 0===t?"visible"==this.el.style.display?this.hide():this.show():t?this.show():this.hide()},t.prototype.find=function(t){return this.el.querySelector(t)},t.prototype.is=function(t){return this.el.tagName.toLowerCase()==t.toLowerCase()||!("."!=t[0]||!this.hasClass(t.substr(1)))||"#"==t[0]&&this.el.getAttribute("id")==t.substr(1)},t.prototype.closest=function(t){for(var n=this.el,s=!1;!s&&(e.$$(n).hasClass(t)&&(s=!0),"body"!=n.tagName.toLowerCase())&&null!=n.parentElement;)s||(n=n.parentElement);if(s)return n},t.prototype.parent=function(t){if(void 0!=this.el.parentElement)return this.traverseAncestorForClass(this.el.parentElement,t)},t.prototype.parents=function(e){for(var n=[],s=this.parent(e);s;)n.push(s),s=new t(s).parent(e);return n},t.prototype.findAll=function(t){return this.nodeListToArray(this.el.querySelectorAll(t))},t.prototype.findClass=function(t){return"getElementsByClassName"in this.el?this.nodeListToArray(this.el.getElementsByClassName(t)):this.nodeListToArray(this.el.querySelectorAll("."+t))},t.prototype.findId=function(t){return document.getElementById(t)},t.prototype.addClass=function(t){this.hasClass(t)||(this.el.className?this.el.className+=" "+t:this.el.className=t)},t.prototype.removeClass=function(t){this.el.className=this.el.className.replace(new RegExp("(^|\\s)"+t+"(\\s|\\b)","g"),"$1")},t.prototype.toggleClass=function(t,e){e?this.addClass(t):this.removeClass(t)},t.prototype.getClass=function(){return this.el.className.match(t.CLASS_NAME_REGEX)||[]},t.prototype.hasClass=function(t){return _.contains(this.getClass(),t)},t.prototype.detach=function(){this.el.parentElement&&this.el.parentElement.removeChild(this.el)},t.prototype.on=function(e,n){var s=this;if(_.isArray(e))_.each(e,function(t){s.on(t,n)});else{var i=this.getJQuery();if(i)i(this.el).on(e,n);else if(this.el.addEventListener){var o=function(t){n(t,t.detail)};t.handlers.push({eventHandle:n,fn:o}),this.el.addEventListener(e,o,!1)}else this.el.on&&this.el.on("on"+e,n)}},t.prototype.one=function(t,e){var n=this;if(_.isArray(t))_.each(t,function(t){n.one(t,e)});else{var s=function(i){return n.off(t,s),e(i)};this.on(t,s)}},t.prototype.off=function(e,n){var s=this;if(_.isArray(e))_.each(e,function(t){s.off(t,n)});else{var i=this.getJQuery();if(i)i(this.el).off(e,n);else if(this.el.removeEventListener){var o=0,r=_.find(t.handlers,function(t,e){if(t.eventHandle==n)return o=e,!0});r&&(this.el.removeEventListener(e,r.fn,!1),t.handlers.splice(o,1))}else this.el.off&&this.el.off("on"+e,n)}},t.prototype.trigger=function(t,e){var n=this.getJQuery();if(n)n(this.el).trigger(t,e);else if(void 0!==CustomEvent){var s=new CustomEvent(t,{detail:e,bubbles:!0});this.el.dispatchEvent(s)}},t.prototype.isEmpty=function(){return t.ONLY_WHITE_SPACE_REGEX.test(this.el.innerHTML)},t.prototype.isDescendant=function(t){for(var e=this.el.parentNode;null!=e;){if(e==t)return!0;e=e.parentNode}return!1},t.prototype.traverseAncestorForClass=function(t,n){void 0===t&&(t=this.el),0==n.indexOf(".")&&(n=n.substr(1));for(var s=!1;!s&&(e.$$(t).hasClass(n)&&(s=!0),"body"!=t.tagName.toLowerCase())&&null!=t.parentElement;)s||(t=t.parentElement);if(s)return t},t.prototype.getJQuery=function(){return void 0!=window.jQuery&&window.jQuery},t.CLASS_NAME_REGEX=/-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g,t.ONLY_WHITE_SPACE_REGEX=/^\s*$/,t.handlers=[],t}();t.Dom=s})((e=t.MagicBox||(t.MagicBox={})).Utils||(e.Utils={}))}(Coveo||(Coveo={})),function(t){var e;(e=t.MagicBox||(t.MagicBox={})).$$=function(t){return window.Coveo&&window.Coveo.$$?window.Coveo.$$(t):new e.Utils.Dom(t)}}(Coveo||(Coveo={})),function(t){var e;(function(t){function n(t,e,n,s){_.each(s.expressions,function(e){_.contains(t,e)||t.push(e)}),_.each(s.basicExpressions,function(t){_.contains(e,t)||e.push(t)}),_.each(s.grammars,function(t,e){if(e in n){if(!_.isArray(n[e])||!_.isArray(t))throw _.each(t,function(t){n[e].push(t)}),"Can not merge "+e+"("+new String(t)+" => "+new String(n[e])+")";_.each(t,function(t){n[e].push(t)})}else n[e]=t})}function s(){for(var t=[],e=0;e<arguments.length;e++)t[e-0]=arguments[e];for(var s=[],i=[],o={Start:["Expressions","Empty"],Expressions:"[OptionalSpaces][Expression][ExpressionsList*][OptionalSpaces]",ExpressionsList:"[Spaces][Expression]",Expression:s,BasicExpression:i,OptionalSpaces:/ */,Spaces:/ +/,Empty:/(?!.)/},r=0;r<t.length;r++)n(s,i,o,t[r]),_.each(t[r].include,function(e){_.contains(t,e)||t.push(e)});return s.push("BasicExpression"),{start:"Start",expressions:o}}t.Expressions=s,t.ExpressionsGrammar=function(){for(var t=[],n=0;n<arguments.length;n++)t[n-0]=arguments[n];var i=s.apply(this,t);return new e.Grammar(i.start,i.expressions)}})((e=t.MagicBox||(t.MagicBox={})).Grammars||(e.Grammars={}))}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).notWordStart=" ()[],$@'\"",n.notInWord=" ()[],:",n.Basic={basicExpressions:["Word","DoubleQuoted"],grammars:{DoubleQuoted:'"[NotDoubleQuote]"',NotDoubleQuote:/[^"]*/,SingleQuoted:"'[NotSingleQuote]'",NotSingleQuote:/[^']*/,Number:/-?(0|[1-9]\d*)(\.\d+)?/,Word:function(t,s,i){var o=new RegExp("[^"+n.notWordStart.replace(/(.)/g,"\\$1")+"][^"+n.notInWord.replace(/(.)/g,"\\$1")+"]*"),r=t.match(o);null!=r&&0!=r.index&&(r=null);var u=new e.Result(null!=r?r[0]:null,i,t);return u.isSuccess()&&s&&t.length>u.value.length?new e.EndOfInputResult(u):u}}}}(Coveo||(Coveo={})),function(t){var e;((e=t.MagicBox||(t.MagicBox={})).Grammars||(e.Grammars={})).SubExpression={basicExpressions:["SubExpression"],grammars:{SubExpression:"([Expressions])"}}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).Date={grammars:{Date:"[DateYear]/[DateMonth]/[DateDay]",DateYear:/([0-9]{4})/,DateMonth:/(1[0-2]|0?[1-9])/,DateDay:/([1-2][0-9]|3[0-1]|0?[1-9])/,DateRange:"[Date][Spaces?]..[Spaces?][Date]",DateRelative:["DateRelativeNegative","DateRelativeTerm"],DateRelativeTerm:/now|today|yesterday/,DateRelativeNegative:"[DateRelativeTerm][DateRelativeNegativeRef]",DateRelativeNegativeRef:/([\-\+][0-9]+(s|m|h|d|mo|y))/},include:[n.Basic]}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).Field={basicExpressions:["FieldSimpleQuery","FieldQuery","Field"],grammars:{FieldQuery:"[Field][OptionalSpaces][FieldQueryOperation]",FieldQueryOperation:["FieldQueryValue","FieldQueryNumeric"],FieldQueryValue:"[FieldOperator][OptionalSpaces][FieldValue]",FieldQueryNumeric:"[FieldOperatorNumeric][OptionalSpaces][FieldValueNumeric]",FieldSimpleQuery:"[FieldName]:[OptionalSpaces][FieldValue]",Field:"@[FieldName]",FieldName:/[a-zA-Z][a-zA-Z0-9\.\_]*/,FieldOperator:/==|=|<>/,FieldOperatorNumeric:/<=|>=|<|>/,FieldValue:["DateRange","NumberRange","DateRelative","Date","Number","FieldValueList","FieldValueString"],FieldValueNumeric:["DateRelative","Date","Number"],FieldValueString:["DoubleQuoted","FieldValueNotQuoted"],FieldValueList:"([FieldValueString][FieldValueStringList*])",FieldValueStringList:"[FieldValueSeparator][FieldValueString]",FieldValueSeparator:/ *, */,FieldValueNotQuoted:/[^ \(\),]+/,NumberRange:"[Number][Spaces?]..[Spaces?][Number]"},include:[n.Date,n.Basic]}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).QueryExtension={basicExpressions:["QueryExtension"],grammars:{QueryExtension:"$[QueryExtensionName]([QueryExtensionArguments])",QueryExtensionName:/\w+/,QueryExtensionArguments:"[QueryExtensionArgumentList*][QueryExtensionArgument]",QueryExtensionArgumentList:"[QueryExtensionArgument][Spaces?],[Spaces?]",QueryExtensionArgument:"[QueryExtensionArgumentName]:[Spaces?][QueryExtensionArgumentValue]",QueryExtensionArgumentName:/\w+/,QueryExtensionArgumentValue:["SingleQuoted","Expressions"]},include:[n.Basic]}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).NestedQuery={basicExpressions:["NestedQuery"],grammars:{NestedQuery:"[[NestedField][OptionalSpaces][Expressions]]",NestedField:"[[Field]]",FieldValue:["NestedQuery"]},include:[n.Field]}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).Complete={include:[n.NestedQuery,n.QueryExtension,n.SubExpression,n.Field,n.Basic]}}(Coveo||(Coveo={})),function(t){!function(t){var e=function(){function e(e,n,s){var i=this;void 0===s&&(s={}),this.element=e,this.grammar=n,this.options=s,this.lastSuggestions=[],_.isUndefined(this.options.inline)&&(this.options.inline=!1),t.$$(e).addClass("magic-box"),this.options.inline&&t.$$(e).addClass("magic-box-inline"),this.result=this.grammar.parse(""),this.displayedResult=this.result.clean(),this.clearDom=document.createElement("div"),this.clearDom.className="magic-box-clear";var o=document.createElement("div");o.className="magic-box-icon",this.clearDom.appendChild(o);var r=t.$$(e).find(".magic-box-input");r?e.insertBefore(this.clearDom,r):((r=document.createElement("div")).className="magic-box-input",e.appendChild(this.clearDom),e.appendChild(r)),this.inputManager=new t.InputManager(r,function(t,e){e?(i.setText(t),i.onselect&&i.onselect(i.getFirstSuggestionText())):(i.setText(t),i.showSuggestion(),i.onchange&&i.onchange())},this),this.inputManager.ontabpress=function(){i.ontabpress&&i.ontabpress()};var u=this.inputManager.getValue();u&&(this.displayedResult.input=u),this.inputManager.setResult(this.displayedResult);var a=document.createElement("div");a.className="magic-box-suggestions",this.element.appendChild(a),this.suggestionsManager=new t.SuggestionsManager(a,{selectableClass:this.options.selectableSuggestionClass,selectedClass:this.options.selectedSuggestionClass,timeout:this.options.suggestionTimeout}),this.setupHandler()}return e.prototype.getResult=function(){return this.result},e.prototype.getDisplayedResult=function(){return this.displayedResult},e.prototype.setText=function(e){t.$$(this.element).toggleClass("magic-box-notEmpty",e.length>0),this.result=this.grammar.parse(e),this.displayedResult=this.result.clean(),this.inputManager.setResult(this.displayedResult)},e.prototype.setCursor=function(t){this.inputManager.setCursor(t)},e.prototype.getCursor=function(){return this.inputManager.getCursor()},e.prototype.resultAtCursor=function(t){return this.displayedResult.resultAt(this.getCursor(),t)},e.prototype.setupHandler=function(){var e=this;this.inputManager.onblur=function(){t.$$(e.element).removeClass("magic-box-hasFocus"),e.onblur&&e.onblur(),e.options.inline||e.clearSuggestion()},this.inputManager.onfocus=function(){t.$$(e.element).addClass("magic-box-hasFocus"),e.showSuggestion(),e.onfocus&&e.onfocus()},this.inputManager.onkeydown=function(t){return 38!=t&&40!=t&&(13==t?(null==e.suggestionsManager.select()&&e.onsubmit&&e.onsubmit(),!1):(27==t&&(e.clearSuggestion(),e.blur()),!0))},this.inputManager.onchangecursor=function(){e.showSuggestion()},this.inputManager.onkeyup=function(t){if(38==t)e.onmove&&e.onmove(),e.focusOnSuggestion(e.suggestionsManager.moveUp()),e.onchange&&e.onchange();else{if(40!=t)return!0;e.onmove&&e.onmove(),e.focusOnSuggestion(e.suggestionsManager.moveDown()),e.onchange&&e.onchange()}return!1},this.clearDom.onclick=function(){e.clear()}},e.prototype.showSuggestion=function(){var t=this;this.suggestionsManager.mergeSuggestions(null!=this.getSuggestions?this.getSuggestions():[],function(e){t.updateSuggestion(e)})},e.prototype.updateSuggestion=function(t){var e=this;this.lastSuggestions=t;var n=this.getFirstSuggestionText();this.inputManager.setWordCompletion(n&&n.text),this.onsuggestions&&this.onsuggestions(t),_.each(t,function(t){null==t.onSelect&&null!=t.text&&(t.onSelect=function(){e.setText(t.text),e.onselect&&e.onselect(t)})})},e.prototype.focus=function(){t.$$(this.element).addClass("magic-box-hasFocus"),this.inputManager.focus()},e.prototype.blur=function(){this.inputManager.blur()},e.prototype.clearSuggestion=function(){var t=this;this.suggestionsManager.mergeSuggestions([],function(e){t.updateSuggestion(e)}),this.inputManager.setWordCompletion(null)},e.prototype.focusOnSuggestion=function(t){null==t||null==t.text?(t=this.getFirstSuggestionText(),this.inputManager.setResult(this.displayedResult,t&&t.text)):this.inputManager.setResult(this.grammar.parse(t.text).clean(),t.text)},e.prototype.getFirstSuggestionText=function(){return _.find(this.lastSuggestions,function(t){return null!=t.text})},e.prototype.getText=function(){return this.inputManager.getValue()},e.prototype.getWordCompletion=function(){return this.inputManager.getWordCompletion()},e.prototype.clear=function(){this.setText(""),this.showSuggestion(),this.focus(),this.onclear&&this.onclear()},e.prototype.hasSuggestions=function(){return this.suggestionsManager.hasSuggestions},e}();t.Instance=e,t.create=function(t,n,s){return new e(t,n,s)},t.requestAnimationFrame=function(t){return"requestAnimationFrame"in window?window.requestAnimationFrame(t):setTimeout(t)}}(t.MagicBox||(t.MagicBox={}))}(Coveo||(Coveo={}));

/*** EXPORTS FROM exports-loader ***/
module.exports = Coveo.MagicBox;

/***/ }),

/***/ 318:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var MiscModules_1 = __webpack_require__(52);
var QueryboxQueryParameters = /** @class */ (function () {
    function QueryboxQueryParameters(options) {
        this.options = options;
    }
    QueryboxQueryParameters.queryIsBlocked = function () {
        // This code runs on some assumption :
        // Since all "buildingQuery" events would have to be run in the same call stack
        // We can add a static flag to block 2 or more query box/omnibox from trying to modify the query inside the same event.
        // If 2 query box are activated, we get duplicate terms in the query, or duplicate term correction with did you mean.
        // This means that only one query box/searchbox would be able to modify the query in a single search page.
        // This also means that if there is 2 search box enabled, the first one in the markup in the page would be able to do the job correctly as far as the query is concerned.
        // The second one is inactive as far as the query is concerned.
        // The flag gets reset in "defer" (setTimeout 0) so that it gets reset correctly when the query event has finished executing
        if (!QueryboxQueryParameters.queryIsCurrentlyBlocked) {
            QueryboxQueryParameters.queryIsCurrentlyBlocked = true;
            MiscModules_1.Defer.defer(function () { return QueryboxQueryParameters.allowDuplicateQuery(); });
            return false;
        }
        return true;
    };
    QueryboxQueryParameters.allowDuplicateQuery = function () {
        QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
    };
    QueryboxQueryParameters.prototype.addParameters = function (queryBuilder, lastQuery) {
        if (!QueryboxQueryParameters.queryIsBlocked()) {
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
        }
    };
    QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
    return QueryboxQueryParameters;
}());
exports.QueryboxQueryParameters = QueryboxQueryParameters;


/***/ }),

/***/ 91:
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
var ComponentOptionsModel_1 = __webpack_require__(24);
exports.MagicBox = __webpack_require__(317);
var Initialization_1 = __webpack_require__(1);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var QueryEvents_1 = __webpack_require__(10);
var Model_1 = __webpack_require__(16);
var QueryStateModel_1 = __webpack_require__(12);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(67);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Dom_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var QueryboxQueryParameters_1 = __webpack_require__(318);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
/**
 * The `Querybox` component renders an input which the end user can interact with to enter and submit queries.
 *
 * When the end user submits a search request, the `Querybox` component triggers a query and logs the corresponding
 * usage analytics data.
 *
 * For technical reasons, it is necessary to instantiate this component on a `div` element rather than on an `input`
 * element.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate a `Querybox` along with an
 * optional [`SearchButton`]{@link SearchButton} component.
 */
var Querybox = /** @class */ (function (_super) {
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
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.Q, function (args) {
            return _this.handleQueryStateChanged(args);
        });
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
        this.searchAsYouTypeTimeout = window.setTimeout(function () {
            _this.usageAnalytics.logSearchAsYouType(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxAsYouType, {});
            _this.triggerNewQuery(true);
        }, this.options.searchAsYouTypeDelay);
    };
    Querybox.ID = 'Querybox';
    Querybox.doExport = function () {
        GlobalExports_1.exportGlobally({
            Querybox: Querybox,
            MagicBox: exports.MagicBox,
            QueryboxQueryParameters: QueryboxQueryParameters_1.QueryboxQueryParameters
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
        enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'SearchAsYouType' }),
        /**
         * If the [`enableSearchAsYouType`]{@link Querybox.options.enableSearchAsYouType} option is `true`, specifies how
         * long to wait (in milliseconds) between each key press before triggering a new query.
         *
         * Default value is `50`. Minimum value is `0`
         */
        searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 50, min: 0, section: 'SearchAsYouType' }),
        /**
         * Specifies whether to interpret special query syntax (e.g., `@objecttype=message`) when the end user types
         * a query in the `Querybox` (see
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)). Setting this
         * option to `true` also causes the `Querybox` to highlight any query syntax.
         *
         * Regardless of the value of this option, the Coveo Cloud REST Search API always interprets expressions surrounded
         * by double quotes (`"`) as exact phrase match requests.
         *
         * See also [`enableLowercaseOperators`]{@link Querybox.options.enableLowercaseOperators}.
         *
         * **Notes:**
         * > * End user preferences can override the value you specify for this option.
         * >
         * > If the end user selects a value other than **Automatic** for the **Enable query syntax** setting (see
         * > the [`enableQuerySyntax`]{@link ResultsPreferences.options.enableQuerySyntax} option of the
         * > [`ResultsPreferences`]{@link ResultsPreferences} component), the end user preference takes precedence over this
         * > option.
         * >
         * > * On-premises versions of the Coveo Search API require this option to be set to `true` in order to interpret
         * > expressions surrounded by double quotes (`"`) as exact phrase match requests.
         *
         * Default value is `false`.
         */
        enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),
        /**
         * Specifies whether to expand basic expression keywords containing wildcards characters (`*`) to the possible
         * matching keywords in order to broaden the query (see
         * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
         *
         * See also [`enableQuestionMarks`]{@link Querybox.options.enableQuestionMarks}.
         *
         *  **Note:**
         * > If you are using an on-premises version of the Coveo Search API, you need to set the
         * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` to be able to set
         * > `enableWildcards` to `true`.
         *
         * Default value is `false`.
         */
        enableWildcards: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),
        /**
         * If [`enableWildcards`]{@link Querybox.options.enableWildcards} is `true`, specifies whether to expand basic
         * expression keywords containing question mark characters (`?`) to the possible matching keywords in order to
         * broaden the query (see
         * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
         *
         * **Note:**
         * > If you are using an on-premises version of the Coveo Search API, you also need to set the
         * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` in order to be able to set
         * > `enableQuestionMarks` to `true`.
         *
         * Default value is `false`.
         */
        enableQuestionMarks: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableWildcards' }),
        /**
         * If the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is `true`, specifies whether to
         * interpret the `AND`, `NOT`, `OR`, and `NEAR` keywords in the `Querybox` as query operators in the query, even if
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
         * Whether to convert a basic expression containing at least a certain number of keywords (see the
         * [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option) to a *partial match expression*, so
         * that items containing at least a certain number of those keywords (see the
         * [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option) will match the expression.
         *
         * **Notes:**
         *
         * > - Only the basic expression of the query (see [`q`]{@link q}) can be converted to a partial match expression.
         * > - When the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is set to `true`, this
         * > feature has no effect on a basic expression containing query syntax (field expressions, operators, etc.).
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
         * Default value is `false`, which implies that an item must contain all of the basic expression keywords to match
         * the query.
         * @notSupportedIn salesforcefree
         */
        enablePartialMatch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The minimum number of keywords that need to be present in a basic expression to convert it to a partial match
         * expression.
         *
         * See also the [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option.
         *
         * **Notes:**
         * > - This option has no meaning unless the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch}
         * > option is set to `true`.
         * > - Repeated keywords in a basic expression count as a single keyword.
         * > - Thesaurus expansions in a basic expression count towards the `partialMatchKeywords` count.
         * > - Stemming expansions **do not** count towards the `partialMatchKeywords` count.
         *
         * **Example:**
         * > If the `partialMatchKeywords` value is `7`, the basic expression will have to contain at least 7 keywords
         * > to be converted to a partial match expression.
         *
         * Default value is `5`.
         * @notSupportedIn salesforcefree
         */
        partialMatchKeywords: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1, depend: 'enablePartialMatch' }),
        /**
         * An absolute or relative value indicating the minimum number (rounded up) of partial match expression keywords an
         * item must contain to match the expression.
         *
         * See also the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option.
         *
         * **Notes:**
         * > - This option has no meaning unless the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch}
         * > option is set to `true`.
         * > - A keyword and its stemming expansions count as a single keyword when evaluating whether an item meets the
         * > `partialMatchThreshold`.
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
         * @notSupportedIn salesforcefree
         */
        partialMatchThreshold: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '50%', depend: 'enablePartialMatch' }),
        /**
         * Specifies whether to trigger a query when clearing the `Querybox`.
         *
         * Default value is `false`.
         */
        triggerQueryOnClear: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return Querybox;
}(Component_1.Component));
exports.Querybox = Querybox;
Initialization_1.Initialization.registerAutoCreateComponent(Querybox);


/***/ })

});
//# sourceMappingURL=Querybox__119648951d2af823e366.js.map