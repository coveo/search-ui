/// <reference path="../../../Test.ts" />

module Coveo {
  describe('DatePicker', () => {
    let picker: DatePicker;

    beforeEach(function () {
      picker = new DatePicker();
    });

    afterEach(function () {
      picker = null;
    });

    it('should be a readonly input', () => {
      let element = picker.getElement();
      expect(element.tagName.toLowerCase()).toEqual('input');
      expect(element.readOnly).toBe(true);
    })

    it('should set the current date as default', () => {
      let currentDate = new Date();
      expect(picker.getValue()).toEqual(DateUtils.dateForQuery(currentDate));
    })
  })
}
