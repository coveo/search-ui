import { Utils } from './Utils';
import { l } from '../strings/Strings';
import * as _ from 'underscore';

export class EmailUtils {
  static splitSemicolonSeparatedListOfEmailAddresses(addresses: string): string[] {
    var addressesAsList: string[] = addresses.split(/\s*;\s*/);
    return _.filter(addressesAsList, (s: string) => {
      return Utils.exists(s) && Utils.isNonEmptyString(Utils.trim(s));
    });
  }

  static emailAddressesToHyperlinks(
    addresses: string[],
    companyDomain?: string,
    me?: string,
    lengthLimit = 2,
    truncateName = false
  ): string {
    addresses = _.filter(addresses, (s: string) => {
      return Utils.exists(s) && Utils.isNonEmptyString(Utils.trim(s));
    });
    var hyperlinks = _.map(addresses, item => {
      var emailArray = EmailUtils.parseEmail(item);
      var email = emailArray[1];
      var name = emailArray[0];
      if (Utils.exists(me) && email == me) {
        name = l('Me');
      }
      if (truncateName) {
        var split = name.split(' ');
        if (!Utils.isNullOrUndefined(split[1])) {
          name = split[0] + ' ' + split[1].substring(0, 1) + '.';
        }
      }
      var domainIndex = email.indexOf('@') >= 0 ? email.indexOf('@') + 1 : 0;
      var domain = email.substr(domainIndex);
      if (Utils.exists(companyDomain) && domain != companyDomain) {
        name += ' (' + domain + ')';
      }

      return '<a title="' + item.replace(/'/g, '&quot;') + '" href="mailto:' + encodeURI(email) + '">' + name + '</a>';
    });
    var excess = hyperlinks.length - lengthLimit;
    var andOthers = excess > 0 ? EmailUtils.buildEmailAddressesAndOthers(_.last(hyperlinks, excess)) : '';
    return _.first(hyperlinks, lengthLimit).join(', ') + andOthers;
  }

  static buildEmailAddressesAndOthers(excessHyperLinks: string[]) {
    return (
      '<span class="coveo-emails-excess-collapsed coveo-active" onclick="Coveo.TemplateHelpers.getHelper(\'excessEmailToggle\')(this);"> ' +
      l('AndOthers', excessHyperLinks.length.toString(), excessHyperLinks.length) +
      '</span>' +
      '<span class="coveo-emails-excess-expanded"> , ' +
      excessHyperLinks.join(' , ') +
      '</span>'
    );
  }

  static parseEmail(email: string): string[] {
    let name: string;
    let match = (<string>email).match(/^\s*(.*)\s+<(.*)>$/);
    if (match != null) {
      name = match[1];
      if (/^'.*'|'.*'$/.test(name)) {
        name = name.substr(1, name.length - 2);
      }
      email = match[2];
    } else {
      name = <string>email;
      email = <string>email;
    }
    return [name, email];
  }
}
