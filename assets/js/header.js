$(window).ready(function(){
    trackEventsGa();
    //trigger mobile menu
    $(".currentSiteName").click(function(){
        $("+ nav",this).slideToggle();
        $(">span i",this).toggleClass("up");
    });


    $(".upHeader nav ul.menu a,.upHeader .externalbox a").click(function(e){
        if (isMobile()){
            e.preventDefault();
            $(".upHeader nav").slideUp();
            window.open($(this).attr("href"),"_blank");

        }
    });

    //open submenu in connected mode
    $("a.connected").click(function(e){
        e.preventDefault();
        $("+ ul",this).slideToggle();
    });

});

function trackEventsGa(){
    //tracking for analytics.js
    //if ga.js use _gaq.push(['_trackEvent', 'button3', 'clicked']) template
    $("#jsSupport").click(function(){ ga('send', 'event', 'TopMenus', 'click', 'Support');});
    $("#jsProductDocs").click(function(){ ga('send', 'event', 'TopMenus', 'click', 'Product docs');});
    $("#jsDevDocs").click(function(){ ga('send', 'event', 'TopMenus', 'click', 'Dev docs');});
    $("#jsAnswers").click(function(){ ga('send', 'event', 'TopMenus', 'click', 'Answers');});
    $("#jsTraining").click(function(){ ga('send', 'event', 'TopMenus', 'click', 'Training');});
    $("#jsCloudAdminV1").click(function(){ ga('send', 'event', 'TopMenus', 'click', 'Cloud Admin V1');});
    $("#jsCloudAdminV2").click(function(){ ga('send', 'event', 'TopMenus', 'click', 'Cloud Admin V2');});
    $("#jsTechBlog").click(function(){ ga('send', 'event', 'TopMenus', 'click', 'Tech Blog');});
}

//Mobile detection
function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
    }
}

// Set the Coveo Cloud Organization search and analytics tokens
var siteOrigin= 'JSSearchRef'; //Take the value from https://search.coveo.com/JS/TechDoc.js
var uaToken = ''; // API Key for allowing to push Usage analytics events
var SuggestionScope = '@source=(JsSearchRef)'; //Search Box suggestion filter ex: @syssource=("ohclouden")
var searchToken = 'xx2cf6ec8e-84e1-4691-bdcb-7e114de939bd'; //API Key allowing to query
var hostname = window.location.hostname; //To manage dev/staging/prod environment
var TechDocSearchPage = 'https://search.coveo.com/';
if (hostname === "coveo.github.io") {
	// Use the production org (coveosearch)
	uaToken = searchToken;
} else {
	// Use the staging org (coveosupport) for UA
	uaToken = '25b8fab8-089b-4325-8d0f-d3145dd282ec';
}

$(function(){
	Coveo.SearchEndpoint.endpoints["default"] = new Coveo.SearchEndpoint({
		restUri: 'https://platform.cloud.coveo.com/rest/search',
		accessToken: searchToken
		});
	Coveo.$("#searchBox").on("afterInitialization", function(){
		Coveo.$("#searchBox").coveo('state', 'site', siteOrigin);
	});
	Coveo.$('#searchBox').coveo('initSearchbox', TechDocSearchPage, {
		FieldSuggestions: {
			omniboxSuggestionOptions: {
			onSelect: function (valueSelected, populateOmniBoxEventArgs) {
				populateOmniBoxEventArgs.closeOmnibox();
				Coveo.SearchEndpoint.endpoints["default"]
					.search({
						q: '@jsuipagetopic=="' + valueSelected + '"',
						aq: SuggestionScope
					})
					.done(function (results) {
						/*window.location = results.results[0].clickUri;*/
						var foundResult = Coveo._.find(results.results, function(result){
							return valueSelected == result.raw.jsuipagetopic && !result.ClickUri.includes('/ac8/');
						});
						if(foundResult){
							logCustomEvent('pageNav', 'omniboxTitleSuggestion', uaToken, foundResult.Title, foundResult.clickUri);
							window.location = foundResult.clickUri;
						} else {
							logger.warn("Selected suggested result," + valueSelected + " , not found.");
						}
					})
				},
				queryOverride: SuggestionScope
			}
		}
	});
});
