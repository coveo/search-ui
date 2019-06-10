import * as Mock from '../MockEnvironment';
import { MissingTerms } from '../../src/ui/MissingTerm/MissingTerms';
import { $$ } from '../../src/Core';
import { FakeResults } from '../Fake';

export function MissingTermsTest() {
  describe('MissingTerm', () => {
    const mockComponent = (query: string, option = {}) => {
      return Mock.advancedResultComponentSetup<MissingTerms>(
        MissingTerms,
        fakeResult,
        new Mock.AdvancedComponentSetupOptions(null, option, (env: Mock.MockEnvironmentBuilder): Mock.MockEnvironmentBuilder => {
          env.withLiveQueryStateModel().queryStateModel.set('q', query);
          return env;
        })
      );
    };

    let test: Mock.IBasicComponentSetup<MissingTerms>;
    let fakeResult = FakeResults.createFakeResult();
    describe('exposes options', () => {
      describe("when the 'clickable' option is set to", () => {
        let missingTermsClickableSpy: jasmine.Spy;
        const clickFirstMissingTerm = () => {
          test.cmp.addTermForcedToAppear = missingTermsClickableSpy;
          const missingTermElement = $$(test.cmp.element).find('.coveo-missing-term');
          missingTermElement.click();
        };

        beforeEach(() => {
          missingTermsClickableSpy = jasmine.createSpy('MissingTermsClickableSpy');
        });

        it('true should allow the user to click on the missingTerm', () => {
          const termPresent = 'my';
          const query = 'This is my query';
          fakeResult.absentTerms = [termPresent];
          test = mockComponent(query, { clickable: true });
          clickFirstMissingTerm();
          expect(missingTermsClickableSpy).toHaveBeenCalled();
        });

        it('false should not allow the user to click on the missingTerm', () => {
          const termPresent = 'my';
          const query = 'This is my query';
          fakeResult.absentTerms = [termPresent];
          test = mockComponent(query, { clickable: false });
          clickFirstMissingTerm();
          expect(missingTermsClickableSpy).not.toHaveBeenCalled();
        });
      });

      it('caption allows the user to change the title for the missing terms', () => {
        const query = 'This is my query';
        const caption = 'The missing term';
        test = mockComponent(query, { caption });
        const missingTermsElement = $$(test.cmp.element).find('.coveo-field-caption');
        expect(missingTermsElement.innerText).toBe(caption);
      });

      it('numberOfResults allows the user to set the maximum number of MissingTerm to be displayed', () => {
        const query = 'This is my query';
        const numberOfResults = 1;
        fakeResult.absentTerms = ['This', 'is'];
        test = mockComponent(query, { numberOfResults });
        expect(fakeResult.absentTerms.length).toBe(1);
      });
    });
    describe('when the langage is', () => {
      describe('English', () => {
        describe('when fetching the missing terms from a query', () => {
          describe('return', () => {
            let expectedResult: string[];
            beforeEach(() => {
              const query = 'This is my query';
              test = mockComponent(query);
              expectedResult = [];
            });
            it('all the missing term present in the query', () => {
              const termIsSubWord = 'is';
              fakeResult.absentTerms = [termIsSubWord];
              expectedResult.push(termIsSubWord);
              expect(test.cmp.missingTerms.toString()).toBe(expectedResult.toString());
            });

            it('only the missing term present in the query', () => {
              const termNotInQuery = 'foo';
              fakeResult.absentTerms = [termNotInQuery];
              expect(test.cmp.missingTerms.toString()).toBe(expectedResult.toString());
            });
          });
        });

        describe('when re-injecting a term as an exact match', () => {
          var query: string;

          it('and the term is present in the query, the term is added to the url', () => {
            const termPresent = 'my';
            query = 'This is my query';
            fakeResult.absentTerms = [termPresent];
            test = mockComponent(query);
            test.cmp.queryController.executeQuery();
            test.cmp.addTermForcedToAppear(termPresent);
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(termPresent);
          });

          it('and the term is the first word in the query, the term is added to the url', () => {
            const firstWord = 'This';
            query = 'This is my query';
            fakeResult.absentTerms = [firstWord];
            test = mockComponent(query);
            test.cmp.addTermForcedToAppear(firstWord);
            test.cmp.queryController.executeQuery();
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(firstWord);
          });

          it('and the term is the last word in the query, the term is added to the url', () => {
            const lastWord = 'query';
            query = 'This is my query';
            fakeResult.absentTerms = [lastWord];
            test = mockComponent(query);
            test.cmp.addTermForcedToAppear(lastWord);
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(lastWord);
          });

          it('and the term is not present, the term is not added to the url', () => {
            const termNotInQuery = 'foo';
            query = 'This is my query';
            test = mockComponent(query);
            test.cmp.queryStateModel.set = jasmine.createSpy('setSpy');
            test.cmp.addTermForcedToAppear(termNotInQuery);
            expect(test.cmp.queryStateModel.set).not.toHaveBeenCalled();
          });

          it('and the term is present and contains hyphens, the term is added to the url', () => {
            const hyphensWord = 'really-really';
            query = 'This is really-really my query';
            fakeResult.absentTerms = [hyphensWord];
            test = mockComponent(query);
            test.cmp.addTermForcedToAppear(hyphensWord);
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(hyphensWord);
          });

          it('and the term is present and have special caracter beside it, the term is added to the url', () => {
            const specialCaracter = 'query';
            query = 'This is really my !!!query!!!';
            fakeResult.absentTerms = [specialCaracter];
            test = mockComponent(query);
            test.cmp.addTermForcedToAppear(specialCaracter);
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(specialCaracter);
          });
        });
      });

      describe('Korean', () => {
        describe('when re-injecting a term as an exact match, the term is added to the url', () => {
          it('and the term is present in the query', () => {
            const koreanWordPresent = '쿼리가';
            const query = '긴 쿼리가 될';
            fakeResult.absentTerms = [koreanWordPresent];
            test = mockComponent(query);
            test.cmp.addTermForcedToAppear(koreanWordPresent);
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(koreanWordPresent);
          });
          it('and the term is the first word in the query. the term is added to the url', () => {
            const koreanFirstWord = '이것은';
            const query = '이것은 정말';
            fakeResult.absentTerms = [koreanFirstWord];
            test = mockComponent(query);
            test.cmp.addTermForcedToAppear(koreanFirstWord);
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(koreanFirstWord);
          });

          it('and the term is the last word in the query, the term is added to the url', () => {
            const KoreanlastWord = '정말';
            const query = '이것은 정말';
            fakeResult.absentTerms = [KoreanlastWord];
            test = mockComponent(query);
            test.cmp.addTermForcedToAppear(KoreanlastWord);
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(KoreanlastWord);
          });

          it('and the term is a single caracter surronded by other caracter, the term is added to the url', () => {
            const KoreanWordPresentMultipleTimes = '것';
            const query = '이것은 정말 정말 긴';
            fakeResult.absentTerms = [KoreanWordPresentMultipleTimes];
            test = mockComponent(query);
            test.cmp.addTermForcedToAppear(KoreanWordPresentMultipleTimes);
            expect(test.cmp.queryStateModel.get('missingTerm')).toContain(KoreanWordPresentMultipleTimes);
          });
        });
      });
    });
  });
}
