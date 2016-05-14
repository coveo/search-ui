/// <reference path="../../utils/PhonegapFileAccessUtils.ts" />

module Coveo {

  export class LoginPageSettings {
    private pageSettings:JQuery;

    private pageSettingsInputTemplate = _.template(
        "<div class='coveo-input-container'>\
          <span class='coveo-page-settings-icon'></span>\
          <input class='coveo-page-settings' type='text' placeholder='" + l("PageUrl") + "' autocorrect='off' autocapitalize='off' />\
    </div>");

    constructor(public loginPanel:Login) {
    }

    public buildDom() {
      var container = $("<div></div>").addClass('coveo-login-page-settings-container');
      this.pageSettings = $(this.pageSettingsInputTemplate());
      this.pageSettings.keypress((e:JQueryEventObject) => this.handleInputKeypress(e));
      container.append(this.pageSettings);
      this.pageSettings.find('input').val(this.getPageSettingsUrl());
      this.loginPanel.getOrCreateContainer().append(container);
    }

    public getPageSettingsUrl():string {
      return window.localStorage.getItem(this.getLocalStorageKeyPageUrl());
    }

    public setPageSettingsUrl(pageUrl:string) {
      this.pageSettings.find('input').val(pageUrl);
      window.localStorage.setItem(this.getLocalStorageKeyPageUrl(), pageUrl);
    }

    public submit(allValidationPassed:JQueryDeferred<boolean>) {
      var url = this.pageSettings.find('input').val()
      this.setPageSettingsUrl(url);
      var deferredToReturn = $.Deferred();
      this.tryToWriteFileToDisc(allValidationPassed, deferredToReturn, true);
      return deferredToReturn;
    }

    public validate(allValidationPassed:JQueryDeferred<boolean>) {
      var deferredToReturn = $.Deferred();
      //If this value is set, there is a pretty good chance that the file is also written on disc.
      if (this.getPageSettingsUrl()) {
        this.tryToReadFileFomDisc(allValidationPassed, deferredToReturn, false);
      } else {
        deferredToReturn.reject();
      }
      return deferredToReturn;
    }

    private getLocalStorageKeyPageUrl() {
      return "coveo-page-settings-url-" + this.loginPanel.options.id;
    }

    private getSearchApiRootUrl():string {
      var url = this.getPageSettingsUrl().trim();

      // If no page is specified the url is as-is
      if (/https?:\/\/[^\/]*\/?$/.test(url)) {
        return url;
      }

      // Otherwise strip everything after the last /
      return url.match(/^(.*)\/[^\/]*$/)[1];
    }

    private handleInputKeypress(e:JQueryEventObject) {
      if (!this.loginPanel.isHidden && (e.keyCode == 13)) {
        this.loginPanel.submit();
      }
    }

    private loadFromInterfaceEditorUrl(url:string) {
      var urlObject = document.createElement('a');
      urlObject.href = url;
      if (urlObject.pathname == "/load") {
        //the id param is required by the small node 'debug server' packaged with the interface editor
        //The one exposed by the rest api might not need this ?
        //Anyway, we might need to tweak this...
        if (Utils.getQueryStringValue("id", urlObject.search) != "" || url.indexOf("?id") != -1) {
          return url;
        } else {
          return url + "?id"
        }
      } else {
        return url + "/load?id";
      }
    }

    private tryToWriteFileToDisc(allValidationPassed:JQueryDeferred<boolean>, deferredToReturn:JQueryDeferred<any>, writeDocument = false) {
      //allValidationPassed is the deferred sent by the LoginComponent.
      //If the login credentials fail, for example, we don't wanna write the document content. We need a good url + good credentials before doing so.
      //deferredToReturn is what we send back to the login component to signify that we were able to fetch the page and write it
      var url = this.getPageSettingsUrl();
      AjaxUtils.ajaxBasicAuth("GET", this.loadFromInterfaceEditorUrl(url), this.loginPanel.getUser(), this.loginPanel.getPassword(),
          (res:{body: string; root: string})=> {
            if (DeviceUtils.isPhonegap()) {
              new PhonegapFileWriter("SearchPage.html").write(JSON.stringify(res))
                  .done(()=> {
                    this.loginPanel.logger.info("Found the page and successfully wrote to disc", this.getPageSettingsUrl());
                    if (writeDocument) {
                      allValidationPassed.done(()=> {
                        this.loginPanel.logger.info("Replacing body content with new search page", this.getPageSettingsUrl());
                        this.writeDocumentContent(res.body);
                      })
                    }
                    deferredToReturn.resolve();
                  })
                  .fail(()=> {
                    this.loginPanel.logger.error("Found the file but unable to write", this.getPageSettingsUrl());
                    deferredToReturn.reject(l("ErrorSavingToDevice"));
                  })
            } else {
              this.loginPanel.logger.info("Found the page", this.getPageSettingsUrl());
              if (writeDocument) {
                this.writeDocumentContent(res.body);
              }
              deferredToReturn.resolve();
            }
          },
          () => {
            if (this.getPageSettingsUrl() == undefined || this.getPageSettingsUrl() == "") {
              this.loginPanel.logger.error("Search page url is empty");
              deferredToReturn.reject(l("PleaseEnterYourSearchPage"))
            } else {
              this.loginPanel.logger.error("Unable to find the file", this.getPageSettingsUrl())
              deferredToReturn.reject(l("CannotConnectSearchPage"));
            }
          })
    }

    private tryToReadFileFomDisc(allValidationPassed:JQueryDeferred<boolean>, deferredToReturn:JQueryDeferred<any>, writeDocument = false) {
      if (DeviceUtils.isPhonegap()) {
        new PhonegapFileReader("SearchPage.html").read()
            .done((fileContent:string)=> {
              this.loginPanel.logger.info("Found the page on disc", this.getPageSettingsUrl());
              if (writeDocument) {
                allValidationPassed.done(()=> {
                  var body = JSON.parse(fileContent).body
                  this.writeDocumentContent(body);
                })
              }
              //We still want to rewrite the file each time, so that we get the latest one available at each load
              //We don't really care if it fails or not, so we pass a 'fake' deferred
              //If it fails we'll load the one saved on the device anyway at the next restart of the app
              this.tryToWriteFileToDisc($.Deferred(), $.Deferred(), false);
              deferredToReturn.resolve();
            })
            .fail(()=> {
              if (this.getPageSettingsUrl()) {
                this.loginPanel.logger.info("Unable to find the page on disc", this.getPageSettingsUrl());
                this.loginPanel.logger.info("Trying to fetch it with GET request and write to disc");
                this.tryToWriteFileToDisc(allValidationPassed, deferredToReturn, false);
              } else {
                deferredToReturn.reject(l("ErrorReadingFromDevice"));
              }
            })
      } else {
        this.tryToWriteFileToDisc(allValidationPassed, deferredToReturn, writeDocument);
      }

    }

    private writeDocumentContent(content:string) {
      document.body.outerHTML = content;
      //We need to append a login component if there is none on the landing page
      //otherwise the user will never be able to change it's page manually (other than reloading the app completely)
      this.appendMissingLoginComponentIfNeeded();
      //Scan and configure the different part we need to init the new search page
      this.configureNewEndpoints();
      TemplateCache.scanAndRegisterTemplates();
      this.initNewSearchInterface();
    }

    private appendMissingLoginComponentIfNeeded() {
      var login = $('.' + Component.computeCssClassName(Login));
      if (login.length == 0) {
        var loginToAppend = $('<div class="CoveoLogin" data-require-page-settings="true"></div>')
        if (this.loginPanel.options.requireLogin) {
          loginToAppend.attr('data-require-login', 'true');
        } else {
          loginToAppend.attr('data-require-login', 'false');
        }
        $('.coveo-tab-section').append(loginToAppend);
      } else {
        var pageSettingsOnExistingLogin = login.attr('data-require-page-settings')
        if (pageSettingsOnExistingLogin == "false" || pageSettingsOnExistingLogin == undefined) {
          login.attr('data-require-page-settings', 'true');
        }
      }
    }

    private configureNewEndpoints() {
      var scripts = $('body').find('script.CoveoEndpoint');
      _.each(scripts, (script)=> {
        eval($(script).text());
      })

      // By default the endpoints will use relative paths to the REST API.
      // We must detect those and override them to make them fully qualified.
      var endpoint = Coveo.SearchEndpoint.endpoints['default'];
      if (endpoint != null && endpoint.options.restUri.indexOf('/rest/search') == 0) {
        endpoint.options.restUri = this.getSearchApiRootUrl() + endpoint.options.restUri;
        endpoint.reset();
        this.loginPanel.logger.info("Overrode the REST API uri", endpoint.options.restUri);
      }
    }

    private initNewSearchInterface() {
      var scripts = $('body').find('script.CoveoInit');
      if (scripts.length != 0) {
        Coveo["InitializeFromPhonegap"] = true;
        _.each(scripts, (script)=> {
          eval($(script).text());
        })
      } else {
        var searchInterface = $('.' + Component.computeCssClassName(SearchInterface));
        if (searchInterface.length != 0) {
          searchInterface.coveo('init');
        } else {
          $("#search").coveo('init');
        }
      }
    }
  }
}