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
    const termNotInQuery = 'foo';
    const termPresent = 'will';
    const termIsSubWord = 'is';
    const getEnglishSpy: any = jasmine
      .createSpy('getSpy')
      .and.returnValue('This is and will be a really really really-really long query!!!');
    const getKoreanSpy = jasmine.createSpy('getSpy').and.returnValue('이것은 정말 정말 긴 쿼리가 될 것입니다');
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
          fakeResult.absentTerms.push(termPresent);
          test = mockComponent({ clickable: true });
          clickOnMissingTerms();
          expect(missingTermsClickableSpy).toHaveBeenCalled();
        });

        it('false should not allow the user to click on the missingTerm', () => {
          test = mockComponent({ clickable: false });
          clickOnMissingTerms();
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
            expectedResult = [...fakeResult.absentTerms];
          });
          it('all the missing term present in the query', () => {
            fakeResult.absentTerms.push(termIsSubWord);
            expectedResult.push(termIsSubWord);
            expect(test.cmp.missingTerms.toString()).toBe(expectedResult.toString());
          });

          it('only the missing term present in the query', () => {
            fakeResult.absentTerms.push(termNotInQuery);
            expect(test.cmp.missingTerms.toString()).toBe(expectedResult.toString());
          });
        });
      });

      describe('when re-injecting a term as an exact match', () => {
        it('and the term is present in the query, the term is re-injected as an exact match', () => {
          test.cmp.includeTermInQuery(termPresent);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(
            'q',
            'This is and "will" be a really really really-really long query!!!'
          );
        });

        it('and the term is the first word in the query, the term is re-injected as an exact match', () => {
          const firstWord = 'This';
          fakeResult.absentTerms.push(firstWord);
          test.cmp.includeTermInQuery(firstWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(
            'q',
            '"This" is and will be a really really really-really long query!!!'
          );
        });

        it('and the term is the last word in the query, the term is re-injected as an exact match', () => {
          const lastWord = 'query';
          fakeResult.absentTerms.push(lastWord);
          test.cmp.includeTermInQuery(lastWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(
            'q',
            'This is and will be a really really really-really long "query"!!!'!!!
          );
        });

        it('and the term is present multiple times in the query, the term are all re-injected as an exact match', () => {
          const wordPresentMultipleTimes = 'really';
          fakeResult.absentTerms.push(wordPresentMultipleTimes);
          test.cmp.includeTermInQuery(wordPresentMultipleTimes);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(
            'q',
            'This is and will be a "really" "really" really-really long query!!!'
          );
        });

        it('and the term is not present, the query will not change', () => {
          test.cmp.includeTermInQuery(termNotInQuery);
          expect(test.cmp.queryStateModel.set).not.toHaveBeenCalled();
        });

        it('and the term is present as a full match and sub word, only the full match will be re-injected as an exact match', () => {
          fakeResult.absentTerms.push(termIsSubWord);
          test.cmp.includeTermInQuery(termIsSubWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(
            'q',
            'This "is" and will be a really really really-really long query!!!'
          );
        });

        it('and the term is present and contains hyphens, the term is re-injected as an exact match', () => {
          const hyphensWord = 'really-really';
          fakeResult.absentTerms.push(hyphensWord);
          test.cmp.includeTermInQuery(hyphensWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(
            'q',
            'This is and will be a really really "really-really" long query!!!'
          );
        });
      });
    });

    describe('when the languages is Korean', () => {
      beforeEach(() => {
        fakeResult.absentTerms = [];
        test = mockComponent({}, getKoreanSpy);
      });
      describe('when re-injecting a term as an exact match', () => {
        it('and the term is present in the query', () => {
          const koreanWordPresent = '쿼리가';
          fakeResult.absentTerms.push(koreanWordPresent);
          test.cmp.includeTermInQuery(koreanWordPresent);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '이것은 정말 정말 긴 "쿼리가" 될 것입니다');
        });
        it('and the term is the first word in the query', () => {
          const koreanFirstWord = '이것은';
          fakeResult.absentTerms.push(koreanFirstWord);
          test.cmp.includeTermInQuery(koreanFirstWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '"이것은" 정말 정말 긴 쿼리가 될 것입니다');
        });

        it('and the term is the last word in the query', () => {
          const KoreanlastWord = '것입니다';
          fakeResult.absentTerms.push(KoreanlastWord);
          test.cmp.includeTermInQuery(KoreanlastWord);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '이것은 정말 정말 긴 쿼리가 될 "것입니다"');
        });

        it('and the term is present multiple times in the query, they are all re-injected as an exact match', () => {
          const KoreanWordPresentMultipleTimes = '정말';
          fakeResult.absentTerms.push(KoreanWordPresentMultipleTimes);
          test.cmp.includeTermInQuery(KoreanWordPresentMultipleTimes);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '이것은 "정말" "정말" 긴 쿼리가 될 것입니다');
        });

        it('and the term is a single caracter and present multiple times in the query, they are all re-injected as an exact match', () => {
          const KoreanWordPresentMultipleTimes = '정';
          fakeResult.absentTerms.push(KoreanWordPresentMultipleTimes);
          test.cmp.includeTermInQuery(KoreanWordPresentMultipleTimes);
          expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith('q', '이것은 "정"말 "정"말 긴 쿼리가 될 것입니다');
        });
      });
    });
  });
}
