import * as Mock from '../MockEnvironment';


import {ISimpleFilterOptions, SimpleFilter} from "../../src/ui/SimpleFilter/SimpleFilter";

export function SimpleFilterTest() {
    describe('SimpleFilter', () => {
        let test: Mock.IBasicComponentSetup<SimpleFilter>;

        beforeEach(() => {
            test = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions> {
                field: '@field',
                title: 'xd',
                captions: ['ehehe'],
                valueCaption: {
                    'gmailmessage' : 'Misshun',
                    'lithiummessage' : 'Compree',
                    'youtubevideo' : '™',
                    'message' : 'SUCCESSSS'}
            });
        });

        afterEach(() => {
            test = null;
        });

        it('sets the title properly', () => {
            test = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions> {
                field: '@field',
                title: 'xd',
                captions: ['ehehe'],
                valueCaption: {}
            });
            test.cmp.ensureDom();
            expect(test.cmp.options.title).toBe('xd');
        });

        it('sets the field properly', () => {
            test = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions> {
                field: '@field',
                title: 'xd',
                captions: ['ehehe'],
                valueCaption: {}
            });
            test.cmp.ensureDom();
            expect(test.cmp.options.field).toBe('@field');
        });

        it('allows to getValueCaption', () => {
            test.cmp.options.field = '@filetype';
            expect(test.cmp.getValueCaption('gmailmessage')).toBe('Misshun');

        });

    });
}
