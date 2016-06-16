/// <reference path="../Test.ts" />
module Coveo {
  describe('FieldTable', function () {
    let test: Mock.IBasicComponentSetup<FieldTable>;
    let element: HTMLElement;

    beforeEach(function () {
      element = $$('table', { className: 'CoveoFieldTable' }).el;
      element.appendChild($$('tr', { 'data-field': '@author', 'data-caption': 'Author' }).el);

      test = Mock.advancedResultComponentSetup<FieldTable>(FieldTable, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
        element: element
      })
    })

    afterEach(function () {
      test = null;
      element = null;
    })

    describe('exposes options', function () {
      describe('allowMinimization set to false', function () {
        beforeEach(function () {
          test = Mock.optionsResultComponentSetup<FieldTable, IFieldTableOptions>(FieldTable, <IFieldTableOptions>{
            allowMinimization: false
          }, FakeResults.createFakeResult())
        })

        it('should not show a toggle link', function () {
          expect($$(test.env.element).find('.coveo-field-table-toggle')).toBeNull();
        })

        it('should not wrap table in a toggle container', function () {
          expect($$(test.env.element).find('.coveo-field-table-toggle-container')).toBeNull();
        })

        it('should be expanded', function () {
          expect(test.cmp.isExpanded).toBe(true);
        })

        it('should disable toggling, expanding and minimizing', function () {
          test.cmp.toggle();
          expect(test.cmp.isExpanded).toBe(true);
          test.cmp.minimize();
          expect(test.cmp.isExpanded).toBe(true);
          test.cmp.expand();
          expect(test.cmp.isExpanded).toBe(true);
        })
      })

      describe('allowMinimization set to true', function () {
        beforeEach(function () {
          test = Mock.advancedResultComponentSetup<FieldTable>(FieldTable, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldTableOptions>{
              allowMinimization: true
            }
          })
        })

        it('should show a toggle link', function () {
          expect($$(test.env.element.parentElement).find('.coveo-field-table-toggle')).not.toBeNull();
        })

        it('should wrap the table in a toggle container', function () {
          expect($$(test.env.element.parentElement).hasClass('coveo-field-table-toggle-container')).toBe(true);
        })

        it('expandedTitle should be the text of the toggle link only when table is expanded', function () {
          test = Mock.advancedResultComponentSetup<FieldTable>(FieldTable, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldTableOptions>{
              expandedTitle: 'foobar2000'
            }
          })
          let toggle = $$(test.cmp.element.parentElement.parentElement).find('.coveo-field-table-toggle-caption');
          test.cmp.expand();
          expect(toggle.textContent).toBe('foobar2000');
          test.cmp.minimize();
          expect(toggle.textContent).not.toBe('foobar2000');
        })

        it('expandedTitle should be the localized version of "Details" by default', function () {
          test.cmp.expand();
          let toggle = $$(test.cmp.element.parentElement.parentElement).find('.coveo-field-table-toggle-caption');
          expect(toggle.textContent).toBe('Details'.toLocaleString());
        })

        it('minimizedTitle should be the text of the toggle link only when table is minimized', function () {
          test = Mock.advancedResultComponentSetup<FieldTable>(FieldTable, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldTableOptions>{
              minimizedTitle: 'foobar2000'
            }
          })
          let toggle = $$(test.cmp.element.parentElement.parentElement).find('.coveo-field-table-toggle-caption');
          test.cmp.minimize();
          expect(toggle.textContent).toBe('foobar2000');
          test.cmp.expand();
          expect(toggle.textContent).not.toBe('foobar2000');
        })

        it('minimizedTitle should be the localized version of "Details" by default', function () {
          test.cmp.minimize();
          let toggle = $$(test.cmp.element.parentElement.parentElement).find('.coveo-field-table-toggle-caption');
          expect(toggle.textContent).toBe('Details'.toLocaleString());
        })

        it('minimizedByDefault set to true should initialize the table in a minimized state', function () {
          test = Mock.optionsResultComponentSetup<FieldTable, IFieldTableOptions>(FieldTable, <IFieldTableOptions>{
            minimizedByDefault: true
          }, FakeResults.createFakeResult())
          expect(test.cmp.isExpanded).toBe(false);
        })

        it('minimizedByDefault set to false should initialize the table in an expanded state', function () {
          test = Mock.optionsResultComponentSetup<FieldTable, IFieldTableOptions>(FieldTable, <IFieldTableOptions>{
            minimizedByDefault: false
          }, FakeResults.createFakeResult())
          expect(test.cmp.isExpanded).toBe(true);
        })
      })
    })

    it('toggle should toggle between expanded and minimized states', function () {
      test.cmp.minimize();
      test.cmp.toggle();
      expect(test.cmp.isExpanded).toBe(true);
      test.cmp.toggle();
      expect(test.cmp.isExpanded).toBe(false);
    })
  })
}
