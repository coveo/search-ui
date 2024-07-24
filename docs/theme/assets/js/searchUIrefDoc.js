/**
 * Dynamically adjusts the separator (vertical line between TOC and content) position in the page.
 */
function setSeparatorLeftPosition() {
  var tocColumnWidth = document.getElementById('toc-column').offsetWidth;
  document.getElementById('separator').style.left = tocColumnWidth + 'px';
}

window.addEventListener('DOMContentLoaded', setSeparatorLeftPosition);
window.addEventListener('resize', setSeparatorLeftPosition);

/**
 * Gets the user device or browser name.
 * @returns {string} A string containing the user device or browser name, or "Others" if device or browser name cannot
 * be recognized.
 */
function getDeviceName() {
  const userAgent = navigator.userAgent;

  if (userAgent.match(/Android/i)) return 'Android';
  if (userAgent.match(/BlackBerry/i)) return 'BlackBerry';
  if (userAgent.match(/iPhone/i)) return 'iPhone';
  if (userAgent.match(/iPad/i)) return 'iPad';
  if (userAgent.match(/iPod/i)) return 'iPod';
  if (userAgent.match(/Opera Mini/i)) return 'Opera Mini';
  if (userAgent.match(/IEMobile/i)) return 'IE Mobile';
  if (userAgent.match(/Chrome/i)) return 'Chrome';
  if (userAgent.match(/MSIE/i) || userAgent.match(/Trident/i)) return 'IE';
  if (userAgent.match(/Opera/i)) return 'Opera';
  if (userAgent.match(/Firefox/i)) return 'Firefox';
  if (userAgent.match(/Safari/i)) return 'Safari';
  else return 'Others';
}

/**
 * Formats the Breadcrumb string thus: /[ParentDirectory][/ChildDirectory/].
 * @returns {string} The formatted Breadcrumb string.
 */
function formatBreadcrumbString() {
  // This is the array to format.
  let toFormat = $('.tsd-breadcrumb li').text().split('\n');

  // After an element has been trimmed, if it is an empty string, replace that element by a "/".
  // Otherwise, replace the original element in the array by its trimmed version.
  function formatString(element, index, array) {
    if (element.trim() == '') {
      array.splice(index, 1, '/');
    } else {
      array.splice(index, 1, element.trim());
    }
  }

  toFormat.forEach(formatString);

  // Join the array element into a single string and remove the commas.
  return toFormat.join('');
}

/**
 * Formats the current page title so that it is correctly capitalized (all words capitalized).
 * @returns {string} The correctly capitalized page title string.
 */
function capitalizePageTitle() {
  // This is the string to capitalize (using title case).
  let toCapitalize = $('.tsd-page-title h1').text().trim().split(' ');

  function capitalize(element, index, array) {
    array.splice(index, 1, element.replace(element.charAt(0), element.charAt(0).toUpperCase()));
  }

  toCapitalize.forEach(capitalize);

  return toCapitalize.join(' ');
}
