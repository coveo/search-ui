/// <reference path="../../utils/AjaxUtils.ts" />
module Coveo {

  export class LoginCredentials {
    private credentialContainer: JQuery;
    private loginUser: JQuery;
    private loginPassword: JQuery;

    private userInputTemplate = _.template(
        "<div class='coveo-input-container'>\
          <span class='coveo-username-icon'></span>\
          <input class='coveo-username' type='text' placeholder='" + l("Username") + "' autocorrect='off' autocapitalize='off' />\
      </div>");
    private passwordInputTemplate = _.template(
        "<div class='coveo-input-container'>\
          <span class='coveo-password-icon'></span>\
          <input class='coveo-password'  type='password' placeholder='" + l("Password") + "' autocorrect='off' autocapitalize='off' />\
      </div>");
    private containerTemplate = _.template("<div class='coveo-login-credentials-container'></div>");

    constructor(public loginPanel: Login) {
    }

    public buildDom() {
      this.credentialContainer = $(this.containerTemplate());
      this.loginUser = $(this.userInputTemplate());
      this.loginUser.keypress((e: JQueryEventObject) => this.handleInputKeypress(e));
      this.loginPassword = $(this.passwordInputTemplate());
      this.loginPassword.keypress((e: JQueryEventObject) => this.handleInputKeypress(e));
      this.credentialContainer.append(this.loginUser, this.loginPassword)
      this.loginPanel.getOrCreateContainer().append(this.credentialContainer);
      this.loginUser.find("input").val(this.getUser())
      this.loginPassword.find("input").val(this.getPassword());
    }

    public show() {
      this.credentialContainer.show();
    }

    public getUser(): string {
      return window.localStorage.getItem(this.getLocalStorageKeyUser());
    }

    public setUser(user: string) {
      this.loginUser.find('input').val(user);
      window.localStorage.setItem(this.getLocalStorageKeyUser(), user);
    }

    public getPassword(): string {
      return window.localStorage.getItem(this.getLocalStorageKeyPassword());
    }

    public setPassword(password: string) {
      this.loginPassword.find('input').val(password);
      window.localStorage.setItem(this.getLocalStorageKeyPassword(), password);
    }

    public validate() {
      var deferred = $.Deferred();
      this.setPassword(this.getPasswordFromInput());
      this.setUser(this.getUserFromInput());
      deferred.resolve(true);
      return deferred;
    }

    public submit(allValidationPassed: JQueryDeferred<boolean>) {
      var deferred = $.Deferred();
      this.setPassword(this.getPasswordFromInput());
      this.setUser(this.getUserFromInput());
      deferred.resolve(true);
      return deferred;
    }

    private getLocalStorageKeyUser() {
      return "coveo-user-" + this.loginPanel.options.id;
    }

    private getLocalStorageKeyPassword() {
      return "coveo-password-" + this.loginPanel.options.id;
    }

    private getPasswordFromInput() {
      return this.loginPassword.find('input').val()
    }

    private getUserFromInput() {
      return this.loginUser.find('input').val();
    }

    private handleInputKeypress(e: JQueryEventObject) {
      if (!this.loginPanel.isHidden && (e.keyCode == 13)) {
        this.loginPanel.submit();
      }
    }
  }
}