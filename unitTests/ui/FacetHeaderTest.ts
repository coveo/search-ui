import { FacetHeader } from '../../src/ui/Facet/FacetHeader';
import { IFacetHeaderOptions } from '../../src/ui/Facet/FacetHeader';
import { $$ } from '../../src/utils/Dom';
import { Facet } from '../../src/ui/Facet/Facet';
import { IFacetOptions } from '../../src/ui/Facet/Facet';
import { registerCustomMatcher } from '../CustomMatchers';
import * as Mock from '../MockEnvironment';
import { FacetSettings } from '../../src/ui/Facet/FacetSettings';
import _ = require('underscore');

export function FacetHeaderTest() {
  describe('FacetHeader', function() {
    var facetHeader: FacetHeader;
    var baseOptions: IFacetHeaderOptions;

    beforeEach(function() {
      baseOptions = {
        facetElement: document.createElement('div'),
        title: 'foo',
        field: '@field',
        enableClearElement: true,
        enableCollapseElement: true
      };
    });

    afterEach(function() {
      baseOptions = null;
      facetHeader = null;
    });

    it('should build a title', function() {
      facetHeader = new FacetHeader(
        _.extend(baseOptions, {
          title: 'this is a title'
        })
      );

      var title = $$(facetHeader.build()).find('.coveo-facet-header-title');
      expect($$(title).text()).toBe('this is a title');
    });

    it('should build an icon if specified', function() {
      facetHeader = new FacetHeader(
        _.extend(baseOptions, {
          icon: 'this-is-an-icon'
        })
      );
      var icon = $$(facetHeader.build()).find('.coveo-icon-custom.this-is-an-icon');
      expect(icon).not.toBeNull();
    });

    describe('with a facet', function() {
      var facet: Facet;

      beforeEach(function() {
        facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field'
        }).cmp;
        registerCustomMatcher();
      });

      it('toggle operator should be available if the facet has the option', function() {
        facet.options.enableTogglingOperator = true;
        facetHeader = new FacetHeader(
          _.extend(baseOptions, {
            facet: facet
          })
        );
        facetHeader.build();
        expect(facetHeader.operatorElement.style.display).toEqual('block');

        facet.options.enableTogglingOperator = false;
        facetHeader = new FacetHeader(
          _.extend(baseOptions, {
            facet: facet
          })
        );
        facetHeader.build();
        expect(facetHeader.operatorElement.style.display).toEqual('none');
      });

      it('allow to collapse and expand a facet', function() {
        facetHeader = new FacetHeader(
          _.extend(baseOptions, {
            facet: facet,
            settingsKlass: FacetSettings
          })
        );

        facetHeader.build();
        facetHeader.collapseFacet();
        expect($$(facetHeader.options.facetElement).hasClass('coveo-facet-collapsed')).toBe(true);
        facetHeader.expandFacet();
        expect($$(facetHeader.options.facetElement).hasClass('coveo-facet-collapsed')).not.toBe(true);
      });

      it('allow to switch or and and', function() {
        facet.options.enableTogglingOperator = true;
        facet.getSelectedValues = jasmine.createSpy('spy');
        (<jasmine.Spy>facet.getSelectedValues).and.returnValue(['a', 'b']);

        facetHeader = new FacetHeader(
          _.extend(baseOptions, {
            facet: facet,
            settingsKlass: FacetSettings
          })
        );

        facetHeader.build();
        facetHeader.switchToOr();
        expect(facet.queryStateModel.set).toHaveBeenCalledWith(facet.operatorAttributeId, 'or');

        facetHeader.switchToAnd();
        expect(facet.queryStateModel.set).toHaveBeenCalledWith(facet.operatorAttributeId, 'and');

        facetHeader.operatorElement.click();
        facetHeader.operatorElement.click();
        expect(facet.queryController.executeQuery).toHaveBeenCalledTimes(2);
      });
    });
  });
}
