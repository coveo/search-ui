import * as Mock from '../MockEnvironment';
import { Badge } from '../../src/ui/Badge/Badge';
import { IBadgeOptions } from '../../src/ui/Badge/Badge';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';

export function BadgeTest() {
  describe('Badge', function() {
    let test: Mock.IBasicComponentSetup<Badge>;

    beforeEach(function() {
      test = Mock.optionsResultComponentSetup<Badge, IBadgeOptions>(
        Badge,
        <IBadgeOptions>{
          colors: {
            icon: '#123',
            text: '#123456',
            values: {
              foo: {
                icon: 'pink',
                text: 'black'
              },
              bar: {
                icon: 'blue',
                text: 'green'
              }
            }
          }
        },
        FakeResults.createFakeResult()
      );
    });

    afterEach(function() {
      test = null;
    });

    describe('exposes options', function() {
      describe('colors', function() {
        it('should throw an error when trying to initialize with an invalid color format', function() {
          expect(() => {
            Mock.advancedResultComponentSetup<Badge>(Badge, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
              element: $$('span', { 'data-colors': 'I am quite invalid.' }).el
            });
          }).toThrow();
        });

        it('should parse the colors using the old format properly', function() {
          test = Mock.advancedResultComponentSetup<Badge>(Badge, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
            element: $$('span', { 'data-colors': 'red; foo: green; bar: #123456; foobar: #911' }).el
          });

          expect(test.cmp.options.colors.icon).toBe('red');
          expect(test.cmp.options.colors.values['foo'].icon).toBe('green');
          expect(test.cmp.options.colors.values['bar'].icon).toBe('#123456');
          expect(test.cmp.options.colors.values['foobar'].icon).toBe('#911');
        });

        it('should parse the colors using the new JSON format properly', function() {
          let jsonColors = {
            icon: 'blue',
            text: '#c0ffee',
            values: {
              foo: {
                icon: '#facade',
                text: 'de1e7e'
              },
              bar: {
                icon: '#f00ba2',
                text: '#123'
              }
            }
          };
          test = Mock.advancedResultComponentSetup<Badge>(Badge, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
            element: $$('span', { 'data-colors': JSON.stringify(jsonColors) }).el
          });
          expect(test.cmp.options.colors).toEqual(jsonColors);
        });
      });
    });

    it('getColor should return the appropriate color corresponding to the passed field value', function() {
      expect(test.cmp.getColor()).toEqual({ icon: '#123', text: '#123456' });
      expect(test.cmp.getColor('foo')).toEqual({ icon: 'pink', text: 'black' });
      expect(test.cmp.getColor('bar')).toEqual({ icon: 'blue', text: 'green' });
      expect(test.cmp.getColor('I do not exist.')).toEqual({ icon: '#123', text: '#123456' });
    });

    describe('renderOneValue', function() {
      it('should render the proper colors', function() {
        test = Mock.optionsResultComponentSetup<Badge, IBadgeOptions>(
          Badge,
          <IBadgeOptions>{
            colors: {
              icon: 'white',
              text: 'black',
              values: {
                foo: {
                  icon: '#000000',
                  text: '#FFFFFF'
                }
              }
            }
          },
          FakeResults.createFakeResult()
        );

        let defaultValue = test.cmp.renderOneValue('');
        expect($$(defaultValue).find('span.coveo-badge-icon').style.color).toBe('white');
        expect($$(defaultValue).find('span.coveo-badge-label').style.color).toBe('black');

        let fooVal = test.cmp.renderOneValue('foo');
        expect($$(fooVal).find('span.coveo-badge-icon').style.color).toBe('rgb(0, 0, 0)');
        expect($$(fooVal).find('span.coveo-badge-label').style.color).toBe('rgb(255, 255, 255)');
      });
    });
  });
}
