Coveo.TemplateCache.registerTemplate("CardSalesforceCase", Coveo.HtmlTemplate.fromString("<div class=\"coveo-result-frame\">\n  <div class=\"coveo-result-row\">\n    <div class=\"coveo-result-cell\">\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\" style=\"width: 32px; vertical-align: middle;\">\n          <div class=\"CoveoIcon\" data-small=\"true\" data-with-label=\"false\">\n          </div>\n        </div>\n        <div class=\"coveo-result-cell\" style=\"text-align:left; padding-left: 10px; vertical-align: middle;\">\n          <a class=\"CoveoResultLink\"></a>\n        </div>\n      </div>\n      <div class=\"coveo-result-row\" style=\"padding-top:10px; padding-bottom:10px\">\n        <div class=\"coveo-result-cell\">\n          <span class=\"CoveoFieldValue\"\n                data-field=\"@objecttype\"\n                data-helper=\"translatedCaption\"\n                style=\"border: 1px solid #BCC3CA; border-radius: 3px; padding: 2px 10px;\n                       text-transform: uppercase; font-weight: bold; font-size: 9px\"></span>\n        </div>\n        <div class=\"coveo-result-cell\">\n          <span class=\"CoveoText\" data-value=\"#\"></span><span class=\"CoveoFieldValue\" data-field=\"@sfcasenumber\"></span>\n        </div>\n      </div>\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\" style=\"padding-top:5px; padding-bottom:5px\">\n          <div class=\"CoveoText\" data-value=\"Description\" data-weight=\"bold\"></div>\n          <span class=\"CoveoExcerpt\">\n          </span>\n        </div>\n      </div>\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\">\n          <div class=\"CoveoText\" data-value=\"Owner\" data-weight=\"bold\"></div>\n          <div class=\"CoveoFieldValue\" data-field=\"@sfownername\"></div>\n        </div>\n        <div class=\"coveo-result-cell\">\n          <div class=\"CoveoText\" data-value=\"Priority\" data-weight=\"bold\"></div>\n          <div class=\"CoveoFieldValue\" data-field=\"@sfcasepriority\"></div>\n        </div>\n      </div>\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\">\n          <div class=\"CoveoText\" data-value=\"Modified\" data-weight=\"bold\"></div>\n          <span class=\"CoveoFieldValue\" data-field=\"@date\" data-helper=\"date\">\n          </span>\n        </div>\n      </div>\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\" style=\"padding-top:5px; padding-bottom:5px\">\n          <span class=\"CoveoPrintableUri\">\n          </span>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"CoveoCardActionBar\">\n    <div class=\"CoveoCardOverlay\" data-title=\"Details\" data-icon=\"search\">\n      <table class=\"CoveoFieldTable\" data-allow-minimization=\"false\">\n        <tbody>\n          <tr data-field=\"@sffcaseid\" data-caption=\"Subject\">\n          </tr>\n          <tr data-field=\"@sfcasesubject\" data-caption=\"Subject\">\n          </tr>\n          <tr data-field=\"@sfcasenumber\" data-caption=\"Case Number\">\n          </tr>\n          <tr data-field=\"@sfcasepriority\" data-caption=\"Priority\">\n          </tr>\n          <tr data-field=\"@sfcaseorigin\" data-caption=\"Origin\">\n          </tr>\n          <tr data-field=\"@sfaccountname\" data-caption=\"Account Name\">\n          </tr>\n          <tr data-field=\"@sfowner\" data-caption=\"Owner\">\n          </tr>\n          <tr data-field=\"@sfcasestatus\" data-caption=\"Status\">\n          </tr>\n          <tr data-field=\"@sfcontactname\" data-caption=\"Contact\">\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>\n",{"condition":null,"layout":"card","fieldsToMatch":[{"field":"sfcaseid"}],"mobile":null,"role":null}),true, true)
Coveo.TemplateCache.registerTemplate("SalesforceCase", Coveo.HtmlTemplate.fromString("<div class=\"coveo-result-frame\">\n  <div class=\"coveo-result-row\">\n    <div class=\"coveo-result-cell\" style=\"width:85px; text-align:center; padding-top:7px\">\n      <span class=\"CoveoIcon\">\n      </span>\n      <span class=\"CoveoQuickview\">\n      </span>\n    </div>\n    <div class=\"coveo-result-cell\" style=\"padding-left:15px\">\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\" style=\"font-size:18px\">\n          <a class=\"CoveoResultLink\">\n          </a>\n        </div>\n        <div class=\"coveo-result-cell\" style=\"width:120px;text-align:right;font-size:12px;\">\n          <span class=\"CoveoFieldValue\" data-field=\"@date\" data-helper=\"date\">\n          </span>\n        </div>\n      </div>\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\" style=\"padding-top:5px; padding-bottom:5px\">\n          <div class=\"CoveoExcerpt\">\n          </div>\n        </div>\n      </div>\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\" style=\"padding-top:5px; padding-bottom:5px\">\n          <table class=\"CoveoFieldTable\">\n            <tbody>\n              <tr data-field=\"@sffcaseid\" data-caption=\"Subject\">\n              </tr>\n              <tr data-field=\"@sfcasesubject\" data-caption=\"Subject\">\n              </tr>\n              <tr data-field=\"@sfcasenumber\" data-caption=\"Case Number\">\n              </tr>\n              <tr data-field=\"@sfcasepriority\" data-caption=\"Priority\">\n              </tr>\n              <tr data-field=\"@sfcaseorigin\" data-caption=\"Origin\">\n              </tr>\n              <tr data-field=\"@sfaccountname\" data-caption=\"Account Name\">\n              </tr>\n              <tr data-field=\"@sfowner\" data-caption=\"Owner\">\n              </tr>\n              <tr data-field=\"@sfcasestatus\" data-caption=\"Status\">\n              </tr>\n              <tr data-field=\"@sfcontactname\" data-caption=\"Contact\">\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n",{"condition":null,"layout":"list","fieldsToMatch":[{"field":"sfcaseid"}],"mobile":null,"role":null}),true, true)