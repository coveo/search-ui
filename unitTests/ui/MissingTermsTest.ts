import * as Mock from '../MockEnvironment';
import { MissingTerms } from '../../src/ui/MissingTerm/MissingTerms';
import { $$ } from '../../src/Core';
import { FakeResults } from '../Fake';

export function MissingTermsTest() {
  describe('MissingTerm', () => {
    let test: Mock.IBasicComponentSetup<MissingTerms>;
    let fakeResult = FakeResults.createFakeResult();
    fakeResult.state.q = 'This will be a really really really long query';
    const randomWord = 'foo';
    const firstWord = 'This';
    const getSpy: any = jasmine.createSpy('getSpy').and.returnValue('This will be a really really really long query');
    beforeEach(() => {
      fakeResult.absentTerms = [];
      fakeResult.absentTerms.push('will');
    });

    describe('exposes options', () => {
      describe("when the 'clickable' option is set to", () => {
        let missingTermsClickableSpy: jasmine.Spy;
        const clickOnMissingTerms = () => {
          test.cmp.includeTermInQuery = missingTermsClickableSpy;
          const missingTermElement = $$(test.cmp.element).find('.coveo-missing-term');
          missingTermElement.click();
        };

        beforeEach(() => {
          missingTermsClickableSpy = jasmine.createSpy('MissingTermsClickableSpy');
        });

        it('true should allow the user to click on the missingTerm', () => {
          test = Mock.advancedResultComponentSetup<MissingTerms>(
            MissingTerms,
            fakeResult,
            new Mock.AdvancedComponentSetupOptions(
              null,
              { clickable: true },
              (env: Mock.MockEnvironmentBuilder): Mock.MockEnvironmentBuilder => {
                env.queryStateModel.get = getSpy;
                return env;
              }
            )
          );
          test.cmp.queryStateModel.get = getSpy;
          clickOnMissingTerms();
          expect(missingTermsClickableSpy).toHaveBeenCalled();
        });

        it('false should not allow the user to click on the missingTerm', () => {
          test = Mock.advancedResultComponentSetup<MissingTerms>(
            MissingTerms,
            fakeResult,
            new Mock.AdvancedComponentSetupOptions(
              null,
              { clickable: false },
              (env: Mock.MockEnvironmentBuilder): Mock.MockEnvironmentBuilder => {
                env.queryStateModel.get = getSpy;
                return env;
              }
            )
          );
          clickOnMissingTerms();
          expect(missingTermsClickableSpy).not.toHaveBeenCalled();
        });
      });

      it('caption allows the user to change the title for the missing terms', () => {
        const caption = 'The missing keyword';
        test = Mock.advancedResultComponentSetup<MissingTerms>(
          MissingTerms,
          fakeResult,
          new Mock.AdvancedComponentSetupOptions(null, { caption }, (env: Mock.MockEnvironmentBuilder): Mock.MockEnvironmentBuilder => {
            env.queryStateModel.get = getSpy;
            return env;
          })
        );
        const missingTermsElement = $$(test.cmp.element).find('.coveo-field-caption');
        expect(missingTermsElement.innerText).toBe(caption);
      });
    });
    describe('when', () => {
      beforeEach(() => {
        test = Mock.advancedResultComponentSetup<MissingTerms>(
          MissingTerms,
          fakeResult,
          new Mock.AdvancedComponentSetupOptions(null, {}, (env: Mock.MockEnvironmentBuilder): Mock.MockEnvironmentBuilder => {
            env.queryStateModel.get = getSpy;
            return env;
          })
        );
      });
      describe('fetching the missing terms from a query', () => {
        describe('return', () => {
          let expectedResult: string[];
          beforeEach(() => {
            expectedResult = [...fakeResult.absentTerms];
          });
          it('all the missing term present in the query', () => {
            fakeResult.absentTerms.push(firstWord);
            expectedResult.push(firstWord);
            expect(test.cmp.missingTerms.toString()).toBe(expectedResult.toString());
          });

          it('only the missing term present in the query', () => {
            fakeResult.absentTerms.push(randomWord);
            expect(test.cmp.missingTerms.toString()).toBe(expectedResult.toString());
          });
        });
      });

      describe('re-injecting a term as an exact match', () => {
        it('and the term is present in the query, it is re-injected as an exact match', () => {
          test.cmp.includeTermInQuery(fakeResult.absentTerms[0]);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This "will" be a really really really long query');
        });

        it('and the term is the first word in the query, it is re-injected as an exact match', () => {
          fakeResult.absentTerms.push(firstWord);
          test.cmp.includeTermInQuery(firstWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '"This" will be a really really really long query');
        });

        it('and the term is the last word in the query, it is re-injected as an exact match', () => {
          const lastWord = 'query';
          fakeResult.absentTerms.push(lastWord);
          test.cmp.includeTermInQuery(lastWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This will be a really really really long "query"');
        });

        it('and the term is present in the query, it is re-injected as an exact match', () => {
          const multipleWord = 'really';
          fakeResult.absentTerms.push(multipleWord);
          test.cmp.includeTermInQuery(multipleWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This will be a "really" "really" "really" long query');
        });

        it('but the term is not present, the query should remain the same', () => {
          test.cmp.includeTermInQuery(randomWord);
          expect(test.cmp.queryStateModel.set).not.toHaveBeenCalled();
        });
      });
    });
  });
}
