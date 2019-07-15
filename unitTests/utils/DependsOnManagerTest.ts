import { IBasicComponentSetup } from '../MockEnvironment';
import { ISimulateQueryData, Simulate } from '../Simulate';
import * as Mock from '../MockEnvironment';
import { CategoryFacet } from '../../src/ui/CategoryFacet/CategoryFacet';
import { $$ } from '../Test';
import { Facet, IFacetOptions } from '../../src/ui/Facet/Facet';
import { FakeResults } from '../Fake';
import { buildCategoryFacetResults } from '../ui/CategoryFacet/CategoryFacetTest';

export function DependsOnManagerTest() {
  describe('DependsOnManager', () => {
    const masterCategoryFacetField = '@masterFacet';
    const dependentCategoryFacetField = '@dependentFacet';
    let simulateQueryData: ISimulateQueryData;
    let simulateQueryDataDependent: ISimulateQueryData;
    let testEnv: Mock.MockEnvironmentBuilder;

    beforeEach(() => {
      simulateQueryData = buildCategoryFacetResults(11, 11, masterCategoryFacetField);
      simulateQueryDataDependent = buildCategoryFacetResults(11, 11, dependentCategoryFacetField);
      simulateQueryData.results.categoryFacets.push(simulateQueryDataDependent.results.categoryFacets[0]);
      simulateQueryData.query.categoryFacets.push(simulateQueryDataDependent.query.categoryFacets[0]);

      testEnv = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel();
    });

    describe('CategoryFacet', () => {
      let test: IBasicComponentSetup<CategoryFacet>;
      let master: IBasicComponentSetup<CategoryFacet>;
      beforeEach(() => {
        const masterElement = document.createElement('div');
        const dependentElement = document.createElement('div');
        testEnv.root.appendChild(masterElement);
        testEnv.root.appendChild(dependentElement);

        master = Mock.advancedComponentSetup<CategoryFacet>(
          CategoryFacet,
          new Mock.AdvancedComponentSetupOptions(
            masterElement,
            {
              field: masterCategoryFacetField
            },
            env => testEnv.withElement(masterElement)
          )
        );

        test = Mock.advancedComponentSetup<CategoryFacet>(
          CategoryFacet,
          new Mock.AdvancedComponentSetupOptions(
            dependentElement,
            {
              field: dependentCategoryFacetField,
              dependsOn: masterCategoryFacetField
            },
            env => testEnv.withElement(dependentElement)
          )
        );
      });

      it('the dependent facet is hidden at startup', () => {
        $$(testEnv.root).trigger('state:change', { attributes: {} });
        expect($$(test.cmp.element).isVisible()).toBeFalsy();
      });

      it('the master facet is visible at startup', () => {
        Simulate.query(testEnv, simulateQueryData);
        master.cmp.selectValue('value9');
        expect($$(master.cmp.element).isVisible()).toBeTruthy();
      });

      it(`when the master facet has a selected value,
      the dependent facet is visible`, () => {
        Simulate.query(testEnv, simulateQueryData);
        master.cmp.selectValue('value9');
        Simulate.query(testEnv, simulateQueryData);
        $$(testEnv.root).trigger('state:change', { attributes: {} });
        expect($$(test.cmp.element).isVisible()).toBeTruthy();
      });

      it(`when the master facet has a selected value,
      it adds the coveo-category-facet-non-empty-path class to the master facet`, () => {
        Simulate.query(testEnv, simulateQueryData);
        master.cmp.selectValue('value9');
        Simulate.query(testEnv, simulateQueryData);
        expect($$(master.cmp.element).hasClass('.coveo-category-facet-non-empty-path')).toBeFalsy();
      });

      describe('when the master and the dependent facet have a selected value', () => {
        beforeEach(() => {
          Simulate.query(testEnv, simulateQueryData);
          master.cmp.selectValue('value9');
          Simulate.query(testEnv, simulateQueryData);
          test.cmp.selectValue('value5');
          Simulate.query(testEnv);
        });

        it(`when resetting the master facet,
        it reset the dependent facet`, () => {
          expect(test.cmp.activePath.length).toBe(1);
          master.cmp.deselectCurrentValue();
          Simulate.query(testEnv);
          expect(test.cmp.activePath.length).toBe(0);
        });

        it(`when master value has 2 selected value,
        when we deselect one value
        it doesn't reset the dependent facet`, () => {
          master.cmp.selectValue('value1');
          expect(master.cmp.activePath.length).toBe(2);
          expect(test.cmp.activePath.length).toBe(1);
          master.cmp.deselectCurrentValue();
          Simulate.query(testEnv);
          expect(test.cmp.activePath.length).toBe(1);
        });
      });
    });
    describe('Facet', () => {
      let test: IBasicComponentSetup<Facet>;
      describe('when a facet has the dependsOn option set to the field of another facet', () => {
        let masterFacet: { env: Mock.IMockEnvironment; cmp: Facet };
        const masterFacetField = '@masterFacet';
        const dependentFacetField = '@field';

        function getMasterAndDependentFacetResults() {
          const results = FakeResults.createFakeResults();
          results.groupByResults = [
            FakeResults.createFakeGroupByResult(dependentFacetField, 'foo', 15),
            FakeResults.createFakeGroupByResult(masterFacetField, 'foo', 15)
          ];

          return results;
        }

        function getMasterDependentFacetStateAttributes() {
          return {
            ...getMasterFacetStateAttributes(),
            ...getDependentFacetStateAttributes()
          };
        }

        function getMasterFacetStateAttributes() {
          return {
            [`f:${masterFacetField}`]: masterFacet.cmp.getSelectedValues(),
            [`f:${masterFacetField}:not`]: masterFacet.cmp.getExcludedValues()
          };
        }

        function getDependentFacetStateAttributes() {
          return {
            [`f:${dependentFacetField}`]: test.cmp.getSelectedValues(),
            [`f:${dependentFacetField}:not`]: test.cmp.getExcludedValues()
          };
        }

        beforeEach(() => {
          test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
            field: dependentFacetField,
            dependsOn: masterFacetField
          });

          masterFacet = Mock.advancedComponentSetup<Facet>(
            Facet,
            new Mock.AdvancedComponentSetupOptions(
              undefined,
              {
                field: masterFacetField
              },
              (builder: Mock.MockEnvironmentBuilder) => {
                return builder.withRoot(test.env.root);
              }
            )
          );

          test.cmp.queryStateModel.get = key => {
            const attributes = getMasterDependentFacetStateAttributes();
            return attributes[key];
          };

          Simulate.query(test.env, { results: getMasterAndDependentFacetResults() });
        });

        it('the dependent facet is hidden at startup', () => {
          expect($$(test.cmp.element).isVisible()).toBeFalsy();
        });

        it('the master facet is visible at startup', () => {
          expect($$(masterFacet.cmp.element).isVisible()).toBeTruthy();
        });

        it(`when the master facet has one selected value,
      the dependent facet is visible`, () => {
          masterFacet.cmp.selectValue('master value');
          Simulate.query(test.env, { results: getMasterAndDependentFacetResults() });

          expect($$(test.cmp.element).isVisible()).toBeTruthy();
        });

        it(`when the master facet has one excluded value,
      the dependent facet is still hidden`, () => {
          masterFacet.cmp.excludeValue('excluded master value');
          Simulate.query(test.env, { results: getMasterAndDependentFacetResults() });

          expect($$(test.cmp.element).isVisible()).toBeFalsy();
        });

        describe(`given the master facet has two selected values and the dependent facet has one selected and one excluded value`, () => {
          const selectedMasterValue1 = 'selected master value 1';
          const selectedMasterValue2 = 'selected master value 2';

          function triggerStateChangeOnDependentFacet() {
            rebindDependentFacetStateChangeListeners();
            $$(test.env.root).trigger('change', { attributes: {} });
          }

          function rebindDependentFacetStateChangeListeners() {
            test.cmp.queryStateModel.getEventName = name => name;
            test.cmp['initQueryStateEvents']();
          }

          beforeEach(() => {
            masterFacet.cmp.selectValue(selectedMasterValue1);
            masterFacet.cmp.selectValue(selectedMasterValue2);

            test.cmp.selectValue('selected dependent value');
            test.cmp.excludeValue('excluded dependent value');
            Simulate.query(test.env);
          });

          it(`when the master facet id is not unique,
          it doesn't update keepDisplayedValuesNextTime`, () => {
            Mock.advancedComponentSetup<Facet>(
              Facet,
              new Mock.AdvancedComponentSetupOptions(
                undefined,
                {
                  field: masterFacetField
                },
                (builder: Mock.MockEnvironmentBuilder) => {
                  return builder.withRoot(test.env.root);
                }
              )
            );
            masterFacet.cmp.keepDisplayedValuesNextTime = undefined;
            expect(masterFacet.cmp.keepDisplayedValuesNextTime).toBeUndefined();
            triggerStateChangeOnDependentFacet();
            expect(masterFacet.cmp.keepDisplayedValuesNextTime).toBeUndefined();
          });

          it(`when the master facet id is unique,
          it update keepDisplayedValuesNextTime`, () => {
            masterFacet.cmp.keepDisplayedValuesNextTime = undefined;
            expect(masterFacet.cmp.keepDisplayedValuesNextTime).toBeUndefined();
            triggerStateChangeOnDependentFacet();
            expect(masterFacet.cmp.keepDisplayedValuesNextTime).toBe(false);
          });

          it(`when resetting the master facet,
        it resets the dependent facet`, () => {
            masterFacet.cmp.reset();
            triggerStateChangeOnDependentFacet();

            expect(test.cmp.getSelectedValues().length).toBe(0);
            expect(test.cmp.getExcludedValues().length).toBe(0);
          });

          it(`when deselecting one of the master facet selected options,
        it does not reset the dependent facet`, () => {
            masterFacet.cmp.deselectValue(selectedMasterValue1);
            triggerStateChangeOnDependentFacet();

            expect(test.cmp.getSelectedValues().length).toBe(1);
            expect(test.cmp.getExcludedValues().length).toBe(1);
          });

          it(`when deselecting both master facet selected options,
        it resets the dependent facet`, () => {
            masterFacet.cmp.deselectValue(selectedMasterValue1);
            masterFacet.cmp.deselectValue(selectedMasterValue2);
            triggerStateChangeOnDependentFacet();

            expect(test.cmp.getSelectedValues().length).toBe(0);
            expect(test.cmp.getExcludedValues().length).toBe(0);
          });
        });
      });
    });
  });
}
