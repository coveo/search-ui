import * as Mock from '../MockEnvironment';
import {ISimpleFilterOptions, SimpleFilter} from "../../src/ui/SimpleFilter/SimpleFilter";
import {Simulate} from "../Simulate";

export function SimpleFilterTest() {
    describe('SimpleFilter', () => {
        let test: Mock.IBasicComponentSetup<SimpleFilter>;

        beforeEach(() => {
            test = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions> {
                field: '@field',
                title: 'FooTitleBar',
                values: ['foo', 'bar'],
                valueCaption: {
                    'gmailmessage' : 'Gmail Message',
                    'lithiummessage' : 'Lithium Message',
                    'youtubevideo' : 'Youtube Video',
                    'message' : 'Message'}
            });
        });

        afterEach(() => {
            test = null;
        });

        it('should set the title correctly', () => {
            test.cmp.ensureDom();
            expect(test.cmp.options.title).toBe('FooTitleBar');
        });

        it('should set the field correctly', () => {
            test.cmp.ensureDom();
            expect(test.cmp.options.field).toBe('@field');
        });

        it('should allow to getValueCaption', () => {
            test.cmp.options.field = '@filetype';
            expect(test.cmp.getValueCaption('gmailmessage')).toBe('Gmail Message');

        });

        it('should set the values correctly', () => {
            expect(test.cmp.options.values).toEqual(['foo', 'bar']);

        });

        it('should expand the component correctly', () => {
            test.cmp.onClick();
            expect(test.cmp.checkboxContainer.el.style.display).toEqual('block');

        });

        it('should collapse the component correctly', () => {
            test.cmp.onClick();
            test.cmp.onClick();
            expect(test.cmp.checkboxContainer.el.style.display).toEqual('none');
        });

        it('should handle clicks correctly', () => {
            test.cmp.onClick();
            test.env.element.parentElement.click();
            expect(test.cmp.checkboxContainer.el.style.display).toEqual('block');                 //checkboxContainer.el.style.display = 'block';
        });

        it('should use the correct selected values', () => {
            test.cmp.checkboxes[0].checkbox.select();
            expect(test.cmp.getSelectedValues()).toEqual(['foo']);
        });

        it('should trigger a query when a checkbox is checked', () => {
            test.cmp.checkboxes[0].checkbox.toggle();
            expect(test.env.queryController.executeQuery).toHaveBeenCalled();
        });

        it('field should set the field in the query', () => {
            let simulation = Simulate.query(test.env);
            expect(simulation.queryBuilder.groupByRequests).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                    field: '@field'
                })
            ]));
        });

        it('field should set the selected values in the query', () => {
            test.cmp.checkboxes[0].checkbox.select();
            let simulation = Simulate.query(test.env);
            expect(simulation.queryBuilder.advancedExpression.build()).toEqual('@field==foo');
        });

    });
}
