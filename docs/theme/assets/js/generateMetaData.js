/**
 * Generates the <meta> tags which can be used to correctly index the page content.
 */
function generatePageMetaData() {

  var pageTopic = $('.tsd-page-title h1')[0].textContent;
  var contextPipe;
  var optionsPipe;

  getContextPipe();
  generatePageTopicMetaData();
  generateItemTypeMetaData();
  generateIndexContentMetaData();

  /**
   * Transforms a string to match title case.
   * @param text The string to transform.
   * @returns {*} The string formatted in title case.
   */
  function toTitleCase(text)
  {
    return text.replace(/\w\S*/g, function(text) {
      return text.charAt(0).toUpperCase() + text.substr(1);
    });
  }

  /**
   * Gets the contextPipe from the breadcrumb. The contextPipe is the page topic followed by a dot ('.').
   * For instance, if the current page topic is "Facet", the contextPipe will be "Facet."
   * No contextPipe is generated if page topic is "Globals".
   * @returns {string} The page topic followed by a dot ('.') if page topic was not "Globals". Empty string otherwise.
   */
  function getContextPipe() {
    var temp = $('ul.tsd-breadcrumb li:last-of-type a')[0].textContent + ".";

    contextPipe = temp == "Globals." ? "" : temp;
  }

  /**
   * Generates the <meta name='page-topic' content='[pageTopic]'> tag in the page head.
   */
  function generatePageTopicMetaData() {

    $('head title').before('<meta name=\'page-topic\' content=\'' + toTitleCase(pageTopic) + '\'>');
  }

  /**
   * Generates the <meta name='item-type' content='[itemType]'> tag in the page head.
   */
  function generateItemTypeMetaData() {

    if (contextPipe != "") {

      var itemType = toTitleCase(pageTopic).split(" ");
      itemType.splice(-1, 1);

      $('head title').before('<meta name=\'item-type\' content=\'' + itemType.join(" ")  + '\'>');
    }
  }

  /**
   * Generates each <meta name="[section-name]" content="..."> tag in the page head.
   * Each of these tags contains elements from a distinct section of the page index.
   * Also generates the <meta name='all-index-elements' content='...'> tag in the page head, which contains all
   * elements from the index.
   */
  function generateIndexContentMetaData() {

    // Get all index header elements in a array.
    var categories = $('section.tsd-index-section:not(.tsd-is-external) h3').toArray();

    // This will be an array of arrays containing all index elements sorted by categories.
    var sortedElements = [];

    // This array will contain all index elements (with no regard to their respective category).
    var allIndexElements = [];

    // Push the header title in the first position of each sortedElements array.
    categories.forEach(function(header, index) {
      var contentArray = [];
      var headerContent = header.textContent;
      contentArray.push(headerContent);

      // Push all header content in the second position of its array.
      var selector = "h3:contains("+ headerContent +")";
      var toPush = $(".tsd-index-content " + selector +"+ul a").toArray();
      contentArray.push(toPush);

      sortedElements.push(contentArray);
    });

    sortedElements.forEach(function(category) {

      // Format section name (which will be used as the meta tag name). Sections names are set to lower case and white
      // spaces are replaced by dashes. Thus, "Coveo components" becomes "coveo-components".
      var categoryTitle = category[0].toLowerCase().split(" ").join("-");

      // This array will contain the elements under the corresponding specific category (section name).
      var categoryElements = [];

      // The optionsPipe will be empty unless the categoryTitle is "component-options".
      optionsPipe = categoryTitle == "component-options" ? "options." : "";

      // Push all corresponding element text in the categoryElements array and in the allIndexElements array.
      // Pushed element text will be formatted in one of the following ways:
      // 1) contextPipe.optionsPipe.elementName if element is an option.
      // 2) contextPipe.elementName if element is not an option and contextPipe is not "Globals.".
      // 3) elementName if pageTopicPipe is "Globals.".
      category[1].forEach(function(element) {
        var toPush = contextPipe + optionsPipe + element.text;
        categoryElements.push(toPush);
        allIndexElements.push(toPush)
      });

      // Generate the corresponding meta tag in the page head. Content will be formatted thus:
      // "[pageTopicPipe.][optionsPipe.]elementName1;...;[pageTopicPipe.][optionsPipe.]elementNameN".
      $('head title').before('<meta name=\'' + categoryTitle + '\' content=\'' + categoryElements.join(';') + '\'>');
    });

    // Generate the "all-index-elements" meta tag in the page head if allIndexElements is not empty.
    if (allIndexElements)
    {
      $('head title').before('<meta name=\'' + "all-index-elements" + '\' content=\'' + allIndexElements.join(';') + '\'>');
    }
  }
}

generatePageMetaData();