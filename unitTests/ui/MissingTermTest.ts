import * as Mock from '../MockEnvironment';
import { MissingTerm } from '../../src/ui/MissingTerm/MissingTerm';
import { IMissingTermOptions } from '../../src/ui/MissingTerm/MissingTerm';
import { $$ } from '../../src/Core';
import { FakeResults } from '../Fake';

export function MissingTermTest() {
  describe('MissingTerm', () => {
    let test: Mock.IBasicComponentSetup<MissingTerm>;
    describe('exposes options', () => {
      let fakeResult = FakeResults.createFakeResult();

      beforeEach(() => {
        fakeResult['absentTerms'] = ['will'];
        fakeResult.state.q = 'This will be a really long query';
      });

      describe('clickable when set to', () => {
        let missingTermClickableSpy: jasmine.Spy;
        const clickOnMissingTerm = () => {
          test.cmp.includeTermInQuery = missingTermClickableSpy;
          const missingTermElement = $$(test.cmp.element).find('.coveo-missing-term');
          missingTermElement.click();
        };

        beforeEach(() => {
          missingTermClickableSpy = jasmine.createSpy('MissingTermClickableSpy');
        });

        it('true should allow the user to click on the missingTerm', () => {
          test = Mock.optionsResultComponentSetup<MissingTerm, IMissingTermOptions>(
            MissingTerm,
            {
              clickable: true
            },
            fakeResult
          );
          clickOnMissingTerm();
          expect(missingTermClickableSpy).toHaveBeenCalled();
        });

        it('false should allow the user to click on the missingTerm', () => {
          test = Mock.optionsResultComponentSetup<MissingTerm, IMissingTermOptions>(
            MissingTerm,
            {
              clickable: false
            },
            fakeResult
          );
          clickOnMissingTerm();
          expect(missingTermClickableSpy).not.toHaveBeenCalled();
        });
      });

      it('caption allows the user to change the title fot the missing Term', () => {
        const caption = 'The missing keyword';
        test = Mock.optionsResultComponentSetup<MissingTerm, IMissingTermOptions>(
          MissingTerm,
          {
            caption: caption
          },
          fakeResult
        );
        const missingTermElement = $$(test.cmp.element).find('.coveo-field-caption');
        expect(missingTermElement.innerText).toBe(caption);
      });
    });
  });
}
