import { Debug } from '../../src/ui/Debug/Debug';
import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { DebugEvents } from '../../src/events/DebugEvents';
import { ModalBox } from '../../src/ExternalModulesShim';
import { Simulate } from '../Simulate';
import { KEYBOARD } from '../../src/utils/KeyboardUtils';
import _ = require('underscore');

export function DebugTest() {
  describe('Debug', () => {
    let cmp: Debug;
    let env: Mock.IMockEnvironment;
    let open: jasmine.Spy;
    let close: jasmine.Spy;
    let oldOpen: any;
    let oldClose: any;

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().build();
      open = jasmine.createSpy('open');
      close = jasmine.createSpy('close');
      oldOpen = ModalBox.open;
      oldClose = ModalBox.close;
      ModalBox.open = open.and.returnValue({
        wrapper: $$('div', undefined, $$('div', { className: 'coveo-title' }))
      });
      ModalBox.close = close;

      cmp = new Debug(env.root, env.queryController, undefined, ModalBox);
    });

    afterEach(() => {
      cmp = null;
      env = null;
      open = null;
      close = null;
      ModalBox.open = oldOpen;
      ModalBox.close = oldClose;
      oldOpen = null;
      oldClose = null;
    });

    it('should open on showDebugPanelEvent', (done) => {
      $$(env.root).trigger(DebugEvents.showDebugPanel, {
        'foo': 'bar'
      });
      _.defer(() => {
        expect(open).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should not crash while parsing ranking info, whatever the format is', () => {
      expect(() => cmp.parseRankingInfo('this should not crash')).not.toThrow();
      expect(cmp.parseRankingInfo('this should not crash')).toEqual(jasmine.objectContaining({}));
    });

    it('should return the ranking info if it can parse it properly with no terms', () => {
      let info = `Document weights:
      Title: 0; Quality: 180; Date: 405; Adjacency: 0; Source: 500; Custom: 400; Collaborative rating: 0; QRE: 890; Ranking functions: 0; 
      QRE:
      Expression: "@systitle=="Source @ Coveo — A technical blog by the fine people at Coveo"" Score: 0
      Expression: "@sysfiletype=="pdf" @sysisattachment @systitle="Coveo for Sitecore" @systitle="Documentation.pdf" '" Score: 0
      Expression: "@spacekey=JsSearch" Score: 0
      Expression: "@spacekey=Salesforce" Score: 0
      Expression: "@spacekey=SitecoreV3" Score: 0
      Expression: "@syssource=answers" Score: 0
      Expression: "@syssource==(apices70,apices65,"Web Scraper - apisitecore30")" Score: 0
      Expression: "@sysuri=="https://onlinehelp.coveo.com/en/cloud/Search.htm"" Score: 0
      Expression: "@sysuri=="https://onlinehelp.coveo.com/en/ces/7.0/Search.htm"" Score: 0
      Expression: "@sysuri=="https://onlinehelp.coveo.com/en/ces/6.5/Search.htm"" Score: 0
      Expression: "@sysuri=="https://onlinehelp.coveo.com/fr/cloud/Search.htm"" Score: 0
      Expression: "@sysuri=="https://onlinehelp.coveo.com/fr/ces/7.0/Search.htm"" Score: 0
      Expression: "@sysuri=="https://onlinehelp.coveo.com/fr/ces/6.5/Search.htm"" Score: 0
      Expression: "@sysuri=="https://onlinehelp.coveo.com/en/cloud/404_error.htm"" Score: 0
      Expression: "@sysurihash="Fp5jjQ c8VBdA2bV"" Score: 0
      Expression: "@sysurihash="H94tpRkO9JaivGmu"" Score: 890
      Expression: "@sysurihash="aBtg0qhgVOsKsLDP"" Score: 0
      Expression: "@sysurihash="yoipvH6AAPrZeaAc"" Score: 0
      Expression: "@sysurihash="QWYK3u9KwIYfFSVg"" Score: 0
      
      Total weight: 2375`;
      expect(() => cmp.parseRankingInfo(info)).not.toThrow();
      expect(cmp.parseRankingInfo(info)).toEqual(jasmine.objectContaining({
        'Document weights': jasmine.objectContaining({
          Title: 0,
          Quality: 180,
          Date: 405,
          Adjacency: 0,
          Source: 500,
          Custom: 400,
          'Collaborative rating': 0,
          QRE: 890,
          'Ranking functions': 0
        }),
        'Total weight': 2375
      }));
    });

    it('should return the ranking info if it can parse it properly with no QRE', () => {
      let info = `Document weights:
      Title: 0; Quality: 180; Date: 405; Adjacency: 0; Source: 500; Custom: 400; Collaborative rating: 0; QRE: 890; Ranking functions: 0; 
      
      Total weight: 2375`;
      expect(() => cmp.parseRankingInfo(info)).not.toThrow();
      expect(cmp.parseRankingInfo(info)).toEqual(jasmine.objectContaining({
        'Document weights': jasmine.objectContaining({
          Title: 0,
          Quality: 180,
          Date: 405,
          Adjacency: 0,
          Source: 500,
          Custom: 400,
          'Collaborative rating': 0,
          QRE: 890,
          'Ranking functions': 0
        }),
        'Total weight': 2375
      }));
    });

    it('should return the ranking info if it can parse it properly with no QRE', () => {
      let info = `Document weights:
      Title: 303; Quality: 180; Date: 255; Adjacency: 1350; Source: 500; Custom: 400; Collaborative rating: 0; QRE: 0; Ranking functions: 0; 
       
      Terms weights:
      event: 100, 29; events: 70, 33; 
      Title: 429; Concept: 0; Summary: 160; URI: 0; Formatted: 107; Casing: 0; Relation: 107; Frequency: 1271; 
      
      standard: 100, 18; 
      Title: 0; Concept: 0; Summary: 139; URI: 0; Formatted: 0; Casing: 0; Relation: 92; Frequency: 637; 
      
      Total weight: 5930`;
      expect(() => cmp.parseRankingInfo(info)).not.toThrow();
      expect(cmp.parseRankingInfo(info)).toEqual(jasmine.objectContaining({
        'Document weights': jasmine.objectContaining({
          Title: 303,
          Quality: 180,
          Date: 255,
          Adjacency: 1350,
          Source: 500,
          Custom: 400,
          'Collaborative rating': 0,
          QRE: 0,
          'Ranking functions': 0
        }),
        'Total weight': 5930
      }));
    });

    describe('parses the correctly when splitGroupByField is true', () => {
      beforeEach(() => {
        let fieldDescription = [{ name: '@test', splitGroupByField: true }];
        let endpoint = jasmine.createSpyObj('endpoint', ['listFields']);
        endpoint.listFields.and.returnValue(Promise.resolve(fieldDescription));
        env.queryController.getEndpoint = () => endpoint;
      });

      it('when the field is an array', (done) => {
        let result: any = { raw: { test: ['value1', 'value2'] } };
        let expectValue = ['value1', 'value2'];

        cmp.buildFieldsSection(result).then((fields) => {
          expect(fields['@test']).toEqual(expectValue);
          done();
        });
      });

      it('when the field is a string', (done) => {
        let result: any = { raw: { test: 'value1 ; value2' } };
        let expectValue = ['value1', 'value2'];

        cmp.buildFieldsSection(result).then((fields) => {
          expect(fields['@test']).toEqual(expectValue);
          done();
        });
      });
    });

    // KeyboardEvent constructor does not exist in phantomjs
    if (!Simulate.isPhantomJs()) {
      it('should close on escape', (done) => {
        $$(env.root).trigger(DebugEvents.showDebugPanel, {
          'foo': 'bar'
        });
        _.defer(() => {
          expect(open).toHaveBeenCalled();
          Simulate.keyUp(document.body, KEYBOARD.ESCAPE);
          expect(close).toHaveBeenCalled();
          done();
        }, 0);
      });
    }
  });
}
