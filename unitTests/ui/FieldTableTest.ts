import { FieldTable, IFieldTableOptions } from '../../src/ui/FieldTable/FieldTable';
import { $$ } from '../../src/utils/Dom';
import { FakeResults, Mock } from '../../testsFramework/TestsFramework';

export function FieldTableTest() {
  describe('FieldTable', () => {
    let test: Mock.IBasicComponentSetup<FieldTable>;
    let element: HTMLElement;

    const createElement = () => {
      element = $$('table', { className: 'CoveoFieldTable' }).el;
      element.appendChild($$('tr', { 'data-field': '@author', 'data-caption': 'Author' }).el);
    };

    beforeEach(() => {
      test = Mock.advancedResultComponentSetup<FieldTable>(FieldTable, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
        element: element
      });
    });

    afterEach(() => {
      test = null;
      element = null;
    });

    describe('exposes options', () => {
      describe('allowMinimization set to false', () => {
        beforeEach(() => {
          test = Mock.optionsResultComponentSetup<FieldTable, IFieldTableOptions>(
            FieldTable,
            <IFieldTableOptions>{
              allowMinimization: false
            },
            FakeResults.createFakeResult()
          );
        });

        it('should not show a toggle link', () => {
          expect($$(test.env.element).find('.coveo-field-table-toggle')).toBeNull();
        });

        it('should not wrap table in a toggle container', () => {
          expect($$(test.env.element).find('.coveo-field-table-toggle-container')).toBeNull();
        });

        it('should be expanded', () => {
          expect(test.cmp.isExpanded).toBe(true);
        });

        it('should disable toggling, expanding and minimizing', () => {
          test.cmp.toggle();
          expect(test.cmp.isExpanded).toBe(true);
          test.cmp.minimize();
          expect(test.cmp.isExpanded).toBe(true);
          test.cmp.expand();
          expect(test.cmp.isExpanded).toBe(true);
        });
      });

      describe('allowMinimization set to true', () => {
        beforeEach(() => {
          createElement();
          test = Mock.advancedResultComponentSetup<FieldTable>(
            FieldTable,
            FakeResults.createFakeResult(),
            <Mock.AdvancedComponentSetupOptions>{
              element: element,
              cmpOptions: <IFieldTableOptions>{
                allowMinimization: true
              }
            }
          );
        });

        it('should show a toggle link', () => {
          expect($$(test.env.root).find('.coveo-field-table-toggle')).not.toBeNull();
        });

        it('should put the tabindex to 0 on the toggle caption', () => {
          expect(
            $$(test.env.root)
              .find('.coveo-field-table-toggle-caption')
              .getAttribute('tabindex')
          ).toBe('0');
        });

        it('should wrap the table in a toggle container', () => {
          expect($$(test.env.element.parentElement).hasClass('coveo-field-table-toggle-container')).toBe(true);
        });

        it('expandedTitle should be the text of the toggle link only when table is expanded', () => {
          createElement();
          test = Mock.advancedResultComponentSetup<FieldTable>(
            FieldTable,
            FakeResults.createFakeResult(),
            <Mock.AdvancedComponentSetupOptions>{
              element: element,
              cmpOptions: <IFieldTableOptions>{
                expandedTitle: 'foobar2000'
              }
            }
          );
          let toggle = $$(test.env.root).find('.coveo-field-table-toggle-caption');
          test.cmp.expand();
          expect(toggle.textContent).toBe('foobar2000');
          test.cmp.minimize();
          expect(toggle.textContent).not.toBe('foobar2000');
        });

        it('expandedTitle should be the localized version of "Details" by default', () => {
          test.cmp.expand();
          let toggle = $$(test.env.root).find('.coveo-field-table-toggle-caption');
          expect(toggle.textContent).toBe('Details'.toLocaleString());
        });

        it('minimizedTitle should be the text of the toggle link only when table is minimized', () => {
          createElement();
          test = Mock.advancedResultComponentSetup<FieldTable>(
            FieldTable,
            FakeResults.createFakeResult(),
            <Mock.AdvancedComponentSetupOptions>{
              element: element,
              cmpOptions: <IFieldTableOptions>{
                minimizedTitle: 'foobar2000'
              }
            }
          );
          let toggle = $$(test.env.root).find('.coveo-field-table-toggle-caption');
          test.cmp.minimize();
          expect(toggle.textContent).toBe('foobar2000');
          test.cmp.expand();
          expect(toggle.textContent).not.toBe('foobar2000');
        });

        it('minimizedTitle should be the localized version of "Details" by default', () => {
          test.cmp.minimize();
          let toggle = $$(test.env.root).find('.coveo-field-table-toggle-caption');
          expect(toggle.textContent).toBe('Details'.toLocaleString());
        });

        it('minimizedByDefault set to true should initialize the table in a minimized state', () => {
          test = Mock.optionsResultComponentSetup<FieldTable, IFieldTableOptions>(
            FieldTable,
            <IFieldTableOptions>{
              minimizedByDefault: true
            },
            FakeResults.createFakeResult()
          );
          expect(test.cmp.isExpanded).toBe(false);
        });

        it('minimizedByDefault set to false should initialize the table in an expanded state', () => {
          test = Mock.optionsResultComponentSetup<FieldTable, IFieldTableOptions>(
            FieldTable,
            <IFieldTableOptions>{
              minimizedByDefault: false
            },
            FakeResults.createFakeResult()
          );
          expect(test.cmp.isExpanded).toBe(true);
        });
      });
    });

    it('toggle should toggle between expanded and minimized states', () => {
      test.cmp.minimize();
      test.cmp.toggle();
      expect(test.cmp.isExpanded).toBe(true);
      test.cmp.toggle();
      expect(test.cmp.isExpanded).toBe(false);
    });
  });
}
