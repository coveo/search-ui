import * as Mock from '../MockEnvironment';
import { MissingTerms } from '../../src/ui/MissingTerm/MissingTerms';
import { IMissingTermsOptions } from '../../src/ui/MissingTerm/MissingTerms';
import { $$ } from '../../src/Core';
import { FakeResults } from '../Fake';

export function MissingTermTest() {
  describe('MissingTerm', () => {
    let test: Mock.IBasicComponentSetup<MissingTerms>;
    describe('exposes options', () => {
      let fakeResult = FakeResults.createFakeResult();

      beforeEach(() => {
        fakeResult['absentTerms'] = ['will'];
        fakeResult.state.q = 'This will be a really long query';
      });

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
          test = Mock.optionsResultComponentSetup<MissingTerms, IMissingTermsOptions>(
            MissingTerms,
            {
              clickable: true
            },
            fakeResult
          );
          clickOnMissingTerms();
          expect(missingTermsClickableSpy).toHaveBeenCalled();
        });

        it('false should not allow the user to click on the missingTerm', () => {
          test = Mock.optionsResultComponentSetup<MissingTerms, IMissingTermsOptions>(
            MissingTerms,
            {
              clickable: false
            },
            fakeResult
          );
          clickOnMissingTerms();
          expect(missingTermsClickableSpy).not.toHaveBeenCalled();
        });
      });

      it('caption allows the user to change the title for the missing terms', () => {
        const caption = 'The missing keyword';
        test = Mock.optionsResultComponentSetup<MissingTerms, IMissingTermsOptions>(
          MissingTerms,
          {
            caption: caption
          },
          fakeResult
        );
        const missingTermsElement = $$(test.cmp.element).find('.coveo-field-caption');
        expect(missingTermsElement.innerText).toBe(caption);
      });
    });
  });
}
