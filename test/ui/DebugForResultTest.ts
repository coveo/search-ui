import { DebugForResult } from '../../src/ui/Debug/DebugForResult';
import { MockEnvironmentBuilder, IMockEnvironment } from '../MockEnvironment';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';

export function DebugForResultTest() {
  describe('DebugForResult', () => {
    let debugForResult: DebugForResult;
    let env: IMockEnvironment;
    let result: IQueryResult;

    beforeEach(() => {
      env = new MockEnvironmentBuilder().build();
      debugForResult = new DebugForResult(env);
      result = FakeResults.createFakeResult();
    });

    it('should not crash while parsing ranking info, whatever the format is', () => {
      result.rankingInfo = 'this should not crash';
      expect(() => debugForResult.generateDebugInfoForResult(result)).not.toThrow();
      expect(debugForResult.generateDebugInfoForResult(result).rankingInfo()).toEqual(jasmine.objectContaining({}));
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

      result.rankingInfo = info;

      expect(() => debugForResult.generateDebugInfoForResult(result)).not.toThrow();
      expect(debugForResult.generateDebugInfoForResult(result).rankingInfo()).toEqual(
        jasmine.objectContaining({
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
        })
      );
    });

    it('should return the ranking info if it can parse it properly with no QRE', () => {
      let info = `Document weights:
      Title: 0; Quality: 180; Date: 405; Adjacency: 0; Source: 500; Custom: 400; Collaborative rating: 0; QRE: 890; Ranking functions: 0; 
      
      Total weight: 2375`;

      result.rankingInfo = info;

      expect(() => debugForResult.generateDebugInfoForResult(result)).not.toThrow();
      expect(debugForResult.generateDebugInfoForResult(result).rankingInfo()).toEqual(
        jasmine.objectContaining({
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
        })
      );
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
      result.rankingInfo = info;

      expect(() => debugForResult.generateDebugInfoForResult(result)).not.toThrow();
      expect(debugForResult.generateDebugInfoForResult(result).rankingInfo()).toEqual(
        jasmine.objectContaining({
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
        })
      );
    });

    it('should contain a reference to the original result', () => {
      expect(debugForResult.generateDebugInfoForResult(result).result).toEqual(result);
    });

    it('should call list fields to build the fields section', () => {
      debugForResult.generateDebugInfoForResult(result).fields();
      expect(env.searchEndpoint.listFields).toHaveBeenCalled();
    });

    it('should return a correct field description for field of date type', done => {
      result.raw.date = 1;
      (<jasmine.Spy>env.searchEndpoint.listFields).and.returnValue(
        Promise.resolve([
          {
            fieldType: 'Date',
            name: '@date'
          }
        ])
      );

      expect(
        debugForResult
          .generateDebugInfoForResult(result)
          .fields()
          .then(formattedField => {
            expect(formattedField['@date'].getTime()).toEqual(1);
            done();
          })
      );
    });

    it('should return a correct field description for a split group by', done => {
      result.raw.split = 'a;b;c';
      (<jasmine.Spy>env.searchEndpoint.listFields).and.returnValue(
        Promise.resolve([
          {
            splitGroupByField: true,
            name: '@split'
          }
        ])
      );

      expect(
        debugForResult
          .generateDebugInfoForResult(result)
          .fields()
          .then(formattedField => {
            expect(formattedField['@split']).toEqual(jasmine.arrayContaining(['a', 'b', 'c']));
            done();
          })
      );
    });
  });
}
