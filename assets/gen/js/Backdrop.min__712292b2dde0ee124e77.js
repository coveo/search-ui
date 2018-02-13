webpackJsonpCoveo__temporary([15,22,59],{126:function(t,e,o){"use strict";var n=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])};return function(e,o){function n(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(n.prototype=o.prototype,new n)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=o(6),s=o(7),r=o(76),l=o(1),u=o(61),p=o(2),a=o(23),c=o(0),d=o(3),h=o(27),f=o(13),m=o(14),O=o(4),v=function(t){function e(o,n,u,d,h){void 0===h&&(h=a.ModalBox);var v=t.call(this,o,e.ID,u)||this;v.element=o,v.options=n,v.bindings=u,v.result=d,v.ModalBox=h,v.options=s.ComponentOptions.initComponentOptions(o,e,n),v.resultLink=p.$$("a"),v.resultLink.addClass(i.Component.computeCssClassName(r.ResultLink));var b=p.$$("div");b.addClass("coveo-youtube-thumbnail-container"),v.resultLink.append(b.el);var g=p.$$("img");g.el.style.width=v.options.width,g.el.style.height=v.options.height,g.setAttribute("src",O.Utils.getFieldValue(v.result,"ytthumbnailurl")),g.addClass("coveo-youtube-thumbnail-img"),g.el.onerror=function(){var t=p.$$("div",{},f.SVGIcons.icons.video).el;m.SVGDom.addStyleToSVGInContainer(t,{width:v.options.width}),p.$$(g).remove(),b.append(t)},b.append(g.el);var y=p.$$("span");y.addClass("coveo-youtube-thumbnail-play-button"),b.append(y.el),p.$$(v.element).append(v.resultLink.el),v.options.embed&&(v.options=c.extend(v.options,{onClick:function(){return v.openYoutubeIframe()}}));var k=v.searchInterface.options.originalOptionsObject,C=c.extend({},v.getBindings(),{resultElement:o}),w={options:c.extend({},{initOptions:{ResultLink:n}},k),bindings:C,result:d};return l.Initialization.automaticallyCreateComponentsInside(o,w),v}return n(e,t),e.prototype.openResultLink=function(){h.get(this.resultLink.el).openLinkAsConfigured()},e.prototype.openYoutubeIframe=function(){var t=this,e=p.$$("iframe"),o=p.$$("div");e.setAttribute("src","https://www.youtube.com/embed/"+this.extractVideoId()+"?autoplay=1"),e.setAttribute("allowfullscreen","allowfullscreen"),e.setAttribute("webkitallowfullscreen","webkitallowfullscreen"),e.setAttribute("width","100%"),e.setAttribute("height","100%"),o.append(e.el),this.modalbox=this.ModalBox.open(o.el,{overlayClose:!0,title:u.DomUtils.getQuickviewHeader(this.result,{showDate:!0,title:this.result.title},this.bindings).el,className:"coveo-youtube-player",validation:function(){return!0},body:this.element.ownerDocument.body,sizeMod:"big"}),p.$$(p.$$(this.modalbox.wrapper).find(".coveo-quickview-close-button")).on("click",function(){t.modalbox.close()})},e.prototype.extractVideoId=function(){return this.result.clickUri.split("watch?v=")[1]},e.ID="YouTubeThumbnail",e.doExport=function(){d.exportGlobally({YouTubeThumbnail:e})},e.options={width:s.ComponentOptions.buildStringOption({defaultValue:"200px"}),height:s.ComponentOptions.buildStringOption({defaultValue:"112px"}),embed:s.ComponentOptions.buildBooleanOption({defaultValue:!0})},e}(i.Component);e.YouTubeThumbnail=v,l.Initialization.registerAutoCreateComponent(v)},14:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(0),i=function(){function t(){}return t.addClassToSVGInContainer=function(e,o){var n=e.querySelector("svg");n.setAttribute("class",""+t.getClass(n)+o)},t.removeClassFromSVGInContainer=function(e,o){var n=e.querySelector("svg");n.setAttribute("class",t.getClass(n).replace(o,""))},t.addStyleToSVGInContainer=function(t,e){var o=t.querySelector("svg");n.each(e,function(t,e){o.style[e]=t})},t.getClass=function(t){var e=t.getAttribute("class");return e?e+" ":""},t}();e.SVGDom=i},161:function(t,e,o){"use strict";var n=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])};return function(e,o){function n(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(n.prototype=o.prototype,new n)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=o(6),s=o(7),r=o(1),l=o(0),u=o(4),p=o(3),a=o(126),c=o(2),d=o(23);o(362);var h=function(t){function e(o,n,i,p,a,c){void 0===c&&(c=d.ModalBox);var h=t.call(this,o,e.ID,i)||this;h.element=o,h.options=n,h.result=p,h._window=a,h.ModalBox=c,h.options=s.ComponentOptions.initComponentOptions(o,e,n),h._window=h._window||window;var f="";h.options.overlayColor&&(f+="linear-gradient("+h.options.overlayColor+", "+(h.options.overlayGradient?"rgba(0,0,0,0)":h.options.overlayColor)+"), "),f+="url('"+(h.options.imageUrl||u.Utils.getFieldValue(p,h.options.imageField))+"') center center",h.element.style.background=f,h.element.style.backgroundSize="cover";var m=h.searchInterface.options.originalOptionsObject,O=l.extend({},h.getBindings(),{resultElement:o}),v={options:l.extend({},{initOptions:{ResultLink:n}},m),bindings:O,result:p};return r.Initialization.automaticallyCreateComponentsInside(h.element,v),h.configureSpecialBackdropActions(),h}return n(e,t),e.prototype.configureSpecialBackdropActions=function(){if(u.Utils.getFieldValue(this.result,"ytthumbnailurl")){var t=new a.YouTubeThumbnail(c.$$("div").el,{embed:!0},this.getBindings(),this.result,this.ModalBox);c.$$(this.element).on("click",function(e){c.$$(e.target).hasClass("CoveoResultLink")||t.openResultLink()})}},e.ID="Backdrop",e.doExport=function(){p.exportGlobally({Backdrop:e})},e.options={imageUrl:s.ComponentOptions.buildStringOption(),imageField:s.ComponentOptions.buildFieldOption(),overlayColor:s.ComponentOptions.buildColorOption(),overlayGradient:s.ComponentOptions.buildBooleanOption({defaultValue:!1,depend:"overlayColor"})},e}(i.Component);e.Backdrop=h,r.Initialization.registerAutoCreateComponent(h)},324:function(t,e){},362:function(t,e){},76:function(t,e,o){"use strict";var n=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])};return function(e,o){function n(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(n.prototype=o.prototype,new n)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=o(6),s=o(7),r=o(24),l=o(9),u=o(31),p=o(49),a=o(21),c=o(122),d=o(1),h=o(19),f=o(5),m=o(4),O=o(26),v=o(2),b=o(77),g=o(0),y=o(3);o(324);var k=function(t){function e(o,n,i,u,p){var c=t.call(this,o,e.ID,i)||this;if(c.element=o,c.options=n,c.bindings=i,c.result=u,c.os=p,c.logOpenDocument=g.debounce(function(){c.queryController.saveLastQuery();var t=v.$$(c.element).getAttribute("href");void 0!=t&&""!=t||(t=c.result.clickUri),c.usageAnalytics.logClickEvent(l.analyticsActionCauseList.documentOpen,{documentURL:t,documentTitle:c.result.title,author:m.Utils.getFieldValue(c.result,"author")},c.result,c.root),O.Defer.flush()},1500,!0),c.options=s.ComponentOptions.initComponentOptions(o,e,n),c.options=g.extend({},c.options,c.componentOptionsModel.get(r.ComponentOptionsModel.attributesEnum.resultLink)),c.result=u||c.resolveResult(),null==c.options.openQuickview&&(c.options.openQuickview="ExchangeCrawler"==u.raw.connectortype&&a.DeviceUtils.isMobileDevice()),c.element.setAttribute("tabindex","0"),f.Assert.exists(c.componentOptionsModel),f.Assert.exists(c.result),!c.quickviewShouldBeOpened()){var d=g.once(function(){return c.logOpenDocument()});v.$$(o).on(["contextmenu","click","mousedown","mouseup"],d);var h;v.$$(o).on("touchstart",function(){h=setTimeout(d,1e3)}),v.$$(o).on("touchend",function(){h&&clearTimeout(h)})}return c.renderUri(o,u),c.bindEventToOpen(),c}return n(e,t),e.prototype.renderUri=function(t,e){if(/^\s*$/.test(this.element.innerHTML))if(this.options.titleTemplate){var o=this.parseStringTemplate(this.options.titleTemplate);this.element.innerHTML=o?b.StreamHighlightUtils.highlightStreamText(o,this.result.termsToHighlight,this.result.phrasesToHighlight):this.result.clickUri}else this.element.innerHTML=this.result.title?p.HighlightUtils.highlightString(this.result.title,this.result.titleHighlights,null,"coveo-highlight"):this.result.clickUri},e.prototype.openLink=function(t){void 0===t&&(t=!0),t&&this.logOpenDocument(),window.location.href=this.getResultUri()},e.prototype.openLinkInNewWindow=function(t){void 0===t&&(t=!0),t&&this.logOpenDocument(),window.open(this.getResultUri(),"_blank")},e.prototype.openLinkInOutlook=function(t){void 0===t&&(t=!0),this.hasOutlookField()&&(t&&this.logOpenDocument(),this.openLink())},e.prototype.openLinkAsConfigured=function(t){void 0===t&&(t=!0),this.toExecuteOnOpen&&(t&&this.logOpenDocument(),this.toExecuteOnOpen())},e.prototype.bindEventToOpen=function(){return this.bindOnClickIfNotUndefined()||this.bindOpenQuickviewIfNotUndefined()||this.setHrefIfNotAlready()||this.openLinkThatIsNotAnAnchor()},e.prototype.bindOnClickIfNotUndefined=function(){var t=this;return void 0!=this.options.onClick&&(this.toExecuteOnOpen=function(e){t.options.onClick.call(t,e,t.result)},v.$$(this.element).on("click",function(e){t.toExecuteOnOpen(e)}),!0)},e.prototype.bindOpenQuickviewIfNotUndefined=function(){var t=this;return!!this.quickviewShouldBeOpened()&&(this.toExecuteOnOpen=function(){v.$$(t.bindings.resultElement).trigger(u.ResultListEvents.openQuickview)},v.$$(this.element).on("click",function(e){e.preventDefault(),t.toExecuteOnOpen()}),!0)},e.prototype.openLinkThatIsNotAnAnchor=function(){var t=this;return!this.elementIsAnAnchor()&&(this.toExecuteOnOpen=function(){t.options.alwaysOpenInNewWindow?t.options.openInOutlook?t.openLinkInOutlook():t.openLinkInNewWindow():t.openLink()},v.$$(this.element).on("click",function(){t.toExecuteOnOpen()}),!0)},e.prototype.setHrefIfNotAlready=function(){return!(!this.elementIsAnAnchor()||m.Utils.isNonEmptyString(v.$$(this.element).getAttribute("href")))&&(v.$$(this.element).setAttribute("href",this.getResultUri()),!this.options.alwaysOpenInNewWindow||this.options.openInOutlook&&this.hasOutlookField()||v.$$(this.element).setAttribute("target","_blank"),!0)},e.prototype.getResultUri=function(){return this.options.hrefTemplate?this.parseStringTemplate(this.options.hrefTemplate):(void 0==this.options.field&&this.options.openInOutlook&&this.setField(),void 0!=this.options.field?m.Utils.getFieldValue(this.result,this.options.field):this.result.clickUri)},e.prototype.elementIsAnAnchor=function(){return"A"==this.element.tagName},e.prototype.setField=function(){var t=m.Utils.exists(this.os)?this.os:c.OSUtils.get();t==c.OS_NAME.MACOSX&&this.hasOutlookField()?this.options.field="@outlookformacuri":t==c.OS_NAME.WINDOWS&&this.hasOutlookField()&&(this.options.field="@outlookuri")},e.prototype.hasOutlookField=function(){var t=m.Utils.exists(this.os)?this.os:c.OSUtils.get();return t==c.OS_NAME.MACOSX&&void 0!=this.result.raw.outlookformacuri||t==c.OS_NAME.WINDOWS&&void 0!=this.result.raw.outlookuri},e.prototype.isUriThatMustBeOpenedInQuickview=function(){return 0==this.result.clickUri.toLowerCase().indexOf("ldap://")},e.prototype.quickviewShouldBeOpened=function(){return(this.options.openQuickview||this.isUriThatMustBeOpenedInQuickview())&&h.QueryUtils.hasHTMLVersion(this.result)},e.prototype.parseStringTemplate=function(t){var e=this;return t?t.replace(/\$\{(.*?)\}/g,function(t){var o=t.substring(2,t.length-1),n=e.readFromObject(e.result,o);return n||(n=e.readFromObject(window,o)),n||e.logger.warn(o+" used in the ResultLink template is undefined for this result: "+e.result.title),n||t}):""},e.prototype.readFromObject=function(t,e){if(t&&-1!==e.indexOf(".")){var o=e.substring(e.indexOf(".")+1);return e=e.substring(0,e.indexOf(".")),this.readFromObject(t[e],o)}return t?t[e]:void 0},e.ID="ResultLink",e.doExport=function(){y.exportGlobally({ResultLink:e})},e.options={field:s.ComponentOptions.buildFieldOption(),openInOutlook:s.ComponentOptions.buildBooleanOption({defaultValue:!1}),openQuickview:s.ComponentOptions.buildBooleanOption({defaultValue:!1}),alwaysOpenInNewWindow:s.ComponentOptions.buildBooleanOption({defaultValue:!1}),hrefTemplate:s.ComponentOptions.buildStringOption(),titleTemplate:s.ComponentOptions.buildStringOption(),onClick:s.ComponentOptions.buildCustomOption(function(){return null})},e}(i.Component);e.ResultLink=k,d.Initialization.registerAutoCreateComponent(k)}});