import * as Mock from '../MockEnvironment';
import { CardActionBar, ICardActionBarOptions } from '../../src/ui/CardActionBar/CardActionBar';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';

export function CardActionBarTest() {
  describe('CardActionBar', () => {
    var test: Mock.IBasicComponentSetup<CardActionBar>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<CardActionBar>(CardActionBar);
    });

    afterEach(function () {
      test = null;
    });

    it('should put test here', () => {

    });
  });
}
