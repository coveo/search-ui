interface Window {
  sforce: {
    console: {
      isInConsole: () => boolean;
      getPageInfo: (tabId: string, callback?: (result) => any) => void;
      openSubtab: (primaryTabId: string, url: string, active: boolean, tabLabel: string, tabId: string, callback?: (result) => any) => void;
      focusSubtabById: (tabId: string, callback?: (result) => any) => void;
      getSubtabIds: (primaryTabId?: string, callback?: (result) => any) => void;
      getFocusedPrimaryTabId: (callback?: (result) => any) => void;
      openPrimaryTab: (tabId: string, url: string, active: boolean, tabLabel?: string, callback?: (result) => any) => void;
      focusPrimaryTabById: (id: string, callback?: (result) => any) => void;
      getPrimaryTabIds: (callback?: (result) => any) => void;
    }
  }
}

module Coveo {

  export class SalesforceUtilities {

    static isInSalesforce() {
      return window.sforce != undefined;
    }

    static isInSalesforceConsole() {
      return SalesforceUtilities.isInSalesforce() && window.sforce.console != undefined && window.sforce.console.isInConsole();
    }

    static focusOrOpenTab(url: string, tabText: string, openInPrimaryTab: boolean = false) {

      url = typeof url !== 'undefined' ? url : "";
      var originalUrl = url;
      url = url.split('#')[0].split('?')[0];
      var urlId = this.getSfIdFromUrl(url);

      var endsWith = (str, suffix) => {
        if (!(str && suffix))
          return false;
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      }
      var resultError = (result) => {
        if (!result.success) {
          openSubtab(focusedPrimaryTabId, url);
          return true;
        }
        return false;
      }

      // Open in subtab
      var subtabCount = 0;
      var tabFocused = false;
      var subtabIndex = 0;
      var focusedPrimaryTabId = null;

      var openSubtab = (primaryTabId, url) => {
        window.sforce.console.openSubtab(primaryTabId, originalUrl, true, tabText, null, function openSuccess(result) {
          if (!result.success) {
            window.open(originalUrl);
          }
        });
      }
      var handleGetSubtabInfo = (result, id) => {
        if (!resultError(result)) {
          subtabIndex++;
          if (!tabFocused) {
            var tabUrl = (<any>$.parseJSON(result.pageInfo)).url;
            tabUrl = tabUrl ? tabUrl.split('#')[0].split('?')[0] : tabUrl;
            var tabUrlId = (<any>$.parseJSON(result.pageInfo)).objectId;
            tabUrlId = tabUrlId ? tabUrlId.substr(0, 15) : tabUrl;

            if ((tabUrlId == urlId) || (endsWith(url, tabUrl) || endsWith(tabUrl, url))) {
              window.sforce.console.focusSubtabById(id);
              tabFocused = true;
            }
            subtabCount--;
            if (!tabFocused && (subtabCount == 0)) {
              openSubtab(focusedPrimaryTabId, url);
            }
          }
        }
      }
      var handleGetSubTabIds = (result) => {
        if (!resultError(result)) {
          subtabCount = result.ids.length;

          for (var i = 0; i < result.ids.length; i++) {
            window.sforce.console.getPageInfo(result.ids[i], function(newResult) {
              handleGetSubtabInfo(newResult, result.ids[subtabIndex]);
            });
          }
        }
      }
      var handleGetFocusedPrimaryTabId = (result) => {
        if (!resultError(result)) {
          focusedPrimaryTabId = result.id;
          window.sforce.console.getSubtabIds(result.id, handleGetSubTabIds);
        }
      }
      if (!openInPrimaryTab) {
        window.sforce.console.getFocusedPrimaryTabId(handleGetFocusedPrimaryTabId);
      }

      // Open in primary tab
      var primaryTabCount = 0;
      var primaryTabIndex = 0;

      var openPrimaryTab = (url) => {
        window.sforce.console.openPrimaryTab(null, originalUrl, true, tabText, function openSuccess(result) {
          if (!result.success) {
            window.open(originalUrl);
          }
        });
      }
      var handleGetPrimaryTabInfo = (result, id) => {
        if (!resultError(result)) {
          primaryTabIndex++;
          if (!tabFocused) {
            var tabUrl = (<any>$.parseJSON(result.pageInfo)).url;
            tabUrl = tabUrl ? tabUrl.split('#')[0].split('?')[0] : tabUrl;
            var tabUrlId = (<any>$.parseJSON(result.pageInfo)).objectId;
            tabUrlId = tabUrlId ? tabUrlId.substr(0, 15) : tabUrl;

            if ((tabUrlId == urlId) || (endsWith(url, tabUrl) || endsWith(tabUrl, url))) {
              window.sforce.console.focusPrimaryTabById(id);
              tabFocused = true;
            }
            primaryTabCount--;
            if (!tabFocused && (primaryTabCount == 0)) {
              openPrimaryTab(url);
            }
          }
        }
      }
      var handleGetPrimaryTabIds = (result) => {
        if (!resultError(result)) {
          primaryTabCount = result.ids.length;

          for (var i = 0; i < result.ids.length; i++) {
            window.sforce.console.getPageInfo(result.ids[i], function(newResult) {
              handleGetPrimaryTabInfo(newResult, result.ids[primaryTabIndex]);
            });
          }
        }
      }
      if (openInPrimaryTab) {
        window.sforce.console.getPrimaryTabIds(handleGetPrimaryTabIds);
      }
    }

    static getSfIdFromUrl(url: string) {
      var id = url.substr((url.lastIndexOf('/') + 1), 18);
      var idIsValid = /^\w+$/.test(id);
      if (!idIsValid) {
        return url.split('#')[0].split('?')[0];
      }
      return id.substr(0, 15);
    }

    static expandStringUsingRecord(value: string, record: any) {
      if (value != null) {
        var matches = value.match(/\{!(>?)(.*?)\}/g);
        if (matches != null) {
          for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var groups = /\{!(>?)(.*?)\}/g.exec(match);
            var cleanup = groups[1] === '>';
            var fieldName = groups[2].toLowerCase();
            var fieldValue = '';
            if (record[fieldName] != null) {
              fieldValue = record[fieldName].toString();
              if (cleanup) {
                fieldValue = SalesforceUtilities.cleanSentenceForQuery(fieldValue);
              }
            }
            value = value.replace(groups[0], fieldValue);
          }
        }
      }
      return value;
    }

    static expandStringUsingExpert(value: string, expert: any) {
      if (value != null) {
        var matches = value.match(/%(\w+)%/g);
        if (matches != null) {
          for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var groups = /%(\w+)%/g.exec(match);
            var fieldName = groups[1].toLowerCase();
            var fieldValue = Utils.getFieldValue(expert, fieldName);
            if (fieldValue != null) {
              fieldValue = SalesforceUtilities.cleanSentenceForQuery(fieldValue);
            } else {
              fieldValue = '';
            }

            value = value.replace(groups[0], fieldValue);
          }
        }
      }
      return value;
    }

    static cleanSentenceForQuery(sentence: string) {
      return sentence.replace(/[\[\]"'\(\),\.@=<>:]/g, '');
    }
  }
}
