/// <reference path="../../../Test.ts" />

module Coveo {
  describe('InTheLastDateInput', () => {
    let input: InTheLastDateInput;

    beforeEach(function () {
      input = new InTheLastDateInput();
      input.build();
      (<HTMLInputElement>$$((input.getElement())).find('input')).checked = true;
    });

    afterEach(function () {
      input = null;
    });

    describe('getValue', () => {
      it('should return the date >= specified date', () => {
        input.dropdown.selectValue('months');
        input.spinner.setValue(13);
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 13);
        expect(input.getValue()).toEqual('@date>=' + DateUtils.dateForQuery(currentDate))
      })
    })
  })
}
