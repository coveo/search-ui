import * as Mock from '../MockEnvironment';
import { MissingTerms } from '../../src/ui/MissingTerm/MissingTerms';
import { $$ } from '../../src/Core';
import { FakeResults } from '../Fake';

export function MissingTermsTest() {
  describe('MissingTerm', () => {
    const mockComponent = (option = {}, getSpy = getEnglishSpy) => {
      return Mock.advancedResultComponentSetup<MissingTerms>(
        MissingTerms,
        fakeResult,
        new Mock.AdvancedComponentSetupOptions(null, option, (env: Mock.MockEnvironmentBuilder): Mock.MockEnvironmentBuilder => {
          env.queryStateModel.get = getSpy;
          return env;
        })
      );
    };

    let test: Mock.IBasicComponentSetup<MissingTerms>;
    let fakeResult = FakeResults.createFakeResult();
    const getEnglishSpy: any = jasmine.createSpy('getSpy');
    describe('exposes options', () => {
      describe("when the 'clickable' option is set to", () => {
        let missingTermsClickableSpy: jasmine.Spy;
        const clickFirstMissingTerm = () => {
          test.cmp.includeTermInQuery = missingTermsClickableSpy;
          const missingTermElement = $$(test.cmp.element).find('.coveo-missing-term');
          missingTermElement.click();
        };

        beforeEach(() => {
          missingTermsClickableSpy = jasmine.createSpy('MissingTermsClickableSpy');
        });

        it('true should allow the user to click on the missingTerm', () => {
          const termPresent = 'my';
          getEnglishSpy.and.returnValue('This is my query');
          fakeResult.absentTerms = [termPresent];
          test = mockComponent({ clickable: true });
          clickFirstMissingTerm();
          expect(missingTermsClickableSpy).toHaveBeenCalled();
        });

        it('false should not allow the user to click on the missingTerm', () => {
          const termPresent = 'my';
          getEnglishSpy.and.returnValue('This is my query');
          fakeResult.absentTerms = [termPresent];
          test = mockComponent({ clickable: false });
          clickFirstMissingTerm();
          expect(missingTermsClickableSpy).not.toHaveBeenCalled();
        });
      });

      it('caption allows the user to change the title for the missing terms', () => {
        const caption = 'The missing term';
        test = mockComponent({ caption });
        const missingTermsElement = $$(test.cmp.element).find('.coveo-field-caption');
        expect(missingTermsElement.innerText).toBe(caption);
      });
    });
    describe('when the langage is English', () => {
      beforeEach(() => {
        test = mockComponent();
      });
      describe('when fetching the missing terms from a query', () => {
        describe('return', () => {
          let expectedResult: string[];
          beforeEach(() => {
            expectedResult = [];
            getEnglishSpy.and.returnValue('This is my query');
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
        it('and the term is present in the query, the term is re-injected as an exact match', () => {
          const termPresent = 'my';
          getEnglishSpy.and.returnValue('This is my query');
          fakeResult.absentTerms = [termPresent];
          test.cmp.includeTermInQuery(termPresent);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This is "my" query');
        });

        it('and the term is the first word in the query, the term is re-injected as an exact match', () => {
          const firstWord = 'This';
          getEnglishSpy.and.returnValue('This is my query');
          fakeResult.absentTerms = [firstWord];
          test.cmp.includeTermInQuery(firstWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '"This" is my query');
        });

        it('and the term is the last word in the query, the term is re-injected as an exact match', () => {
          const lastWord = 'query';
          getEnglishSpy.and.returnValue('This is my query');
          fakeResult.absentTerms = [lastWord];
          test.cmp.includeTermInQuery(lastWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This is my "query"');
        });

        it('and the term is present multiple times in the query, the term are all re-injected as an exact match', () => {
          const wordPresentMultipleTimes = 'really';
          getEnglishSpy.and.returnValue('This is really really my query');
          fakeResult.absentTerms = [wordPresentMultipleTimes];
          test.cmp.includeTermInQuery(wordPresentMultipleTimes);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This is "really" "really" my query');
        });

        it('and the term is not present, the query will not change', () => {
          const termNotInQuery = 'foo';
          getEnglishSpy.and.returnValue('This is my query');
          test.cmp.includeTermInQuery(termNotInQuery);
          expect(test.cmp.queryStateModel.set).not.toHaveBeenCalled();
        });

        it('and the term is present as a full match and sub word, only the full match will be re-injected as an exact match', () => {
          const termIsSubWord = 'is';
          getEnglishSpy.and.returnValue('This is my query');
          fakeResult.absentTerms = [termIsSubWord];
          test.cmp.includeTermInQuery(termIsSubWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This "is" my query');
        });

        it('and the term is present and contains hyphens, the term is re-injected as an exact match', () => {
          const hyphensWord = 'really-really';
          getEnglishSpy.and.returnValue('This is really-really my query');
          fakeResult.absentTerms = [hyphensWord];
          test.cmp.includeTermInQuery(hyphensWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This is "really-really" my query');
        });

        it('and the term is present and have special caracter beside him, the term is re-injected as an exact match', () => {
          const hyphensWord = 'query';
          getEnglishSpy.and.returnValue('This is really really my query!!!');
          fakeResult.absentTerms = [hyphensWord];
          test.cmp.includeTermInQuery(hyphensWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', 'This is really really my "query"!!!');
        });
      });
    });

    describe('when the languages is Korean', () => {
      const getKoreanSpy = jasmine.createSpy('getSpy');
      beforeEach(() => {
        test = mockComponent({}, getKoreanSpy);
      });
      describe('when re-injecting a term as an exact match', () => {
        it('and the term is present in the query', () => {
          const koreanWordPresent = '쿼리가';
          getKoreanSpy.and.returnValue('긴 쿼리가 될');
          fakeResult.absentTerms = [koreanWordPresent];
          test.cmp.includeTermInQuery(koreanWordPresent);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '긴 "쿼리가" 될');
        });
        it('and the term is the first word in the query', () => {
          const koreanFirstWord = '이것은';
          getKoreanSpy.and.returnValue('이것은 정말');
          fakeResult.absentTerms = [koreanFirstWord];
          test.cmp.includeTermInQuery(koreanFirstWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '"이것은" 정말');
        });

        it('and the term is the last word in the query', () => {
          const KoreanlastWord = '정말';
          getKoreanSpy.and.returnValue('이것은 정말');
          fakeResult.absentTerms = [KoreanlastWord];
          test.cmp.includeTermInQuery(KoreanlastWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '이것은 "정말"');
        });

        it('and the term is present multiple times in the query, they are all re-injected as an exact match', () => {
          const KoreanWordPresentMultipleTimes = '정말';
          getKoreanSpy.and.returnValue('이것은 정말 정말 긴');
          fakeResult.absentTerms = [KoreanWordPresentMultipleTimes];
          test.cmp.includeTermInQuery(KoreanWordPresentMultipleTimes);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '이것은 "정말" "정말" 긴');
        });

        it('and the term is a single caracter and present multiple times in the query, they are all re-injected as an exact match', () => {
          const KoreanWordPresentMultipleTimes = '정';
          getKoreanSpy.and.returnValue('이것은 정말 정말 긴');
          fakeResult.absentTerms = [KoreanWordPresentMultipleTimes];
          test.cmp.includeTermInQuery(KoreanWordPresentMultipleTimes);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '이것은 "정"말 "정"말 긴');
        });
      });
    });
  });
}
