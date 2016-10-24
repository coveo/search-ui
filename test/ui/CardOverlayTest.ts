import * as Mock from '../MockEnvironment';
import { CardOverlay, ICardOverlayOptions } from '../../src/ui/CardOverlay/CardOverlay';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';

export function CardOverlayTest() {
  describe('CardOverlay', () => {
    var test: Mock.IBasicComponentSetup<CardOverlay>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<CardOverlay>(CardOverlay);
    });

    afterEach(function () {
      test = null;
    });

    it('should put test here', () => {

    });
  });
}
