import { AccessToken } from '../../src/rest/AccessToken';
import { times } from 'underscore';

export function AccessTokenTest() {
  describe('AccessToken', () => {
    let token: AccessToken;

    beforeEach(() => {
      token = new AccessToken('el accesso tokeno');
    });

    it('should properly return that the renew was not successful if there is no renew function', async done => {
      const renewSuccessful = await token.doRenew();
      expect(renewSuccessful).toBeFalsy();
      done();
    });

    describe('with a valid renew function', () => {
      let renew: jasmine.Spy;

      beforeEach(() => {
        renew = jasmine.createSpy('spy').and.returnValue(Promise.resolve('nuevo tokeno')) as any;
        token = new AccessToken('el accesso tokeno', renew as any);
      });

      it('should return a success on renew', async done => {
        const renewSuccessful = await token.doRenew();
        expect(renew).toHaveBeenCalled();
        expect(renewSuccessful).toBeTruthy();
        done();
      });

      it('should call subscribers', async done => {
        const subscriber = jasmine.createSpy('subscriber');
        token.subscribeToRenewal(subscriber);
        await token.doRenew();
        expect(subscriber).toHaveBeenCalledWith('nuevo tokeno');
        done();
      });
    });

    describe('with an error callback on renew', () => {
      let errCallback: jasmine.Spy;

      beforeEach(() => {
        errCallback = jasmine.createSpy('onError');
      });

      it('should be called if there is no renew function', async done => {
        await token.doRenew(errCallback);
        expect(errCallback).toHaveBeenCalled();
        done();
      });

      describe('with a renew function that throws an error', () => {
        let renew: jasmine.Spy;

        beforeEach(() => {
          renew = jasmine.createSpy('throw error').and.throwError('oh no') as any;
          token = new AccessToken('el accesso tokeno', renew as any);
        });

        it('should call the error callback if the renew function throws an error', async done => {
          await token.doRenew(errCallback);
          expect(errCallback).toHaveBeenCalled();
          done();
        });

        it('should stop trying to renew if it fails rapidly in succession', async done => {
          await times(10, async () => {
            return token.doRenew();
          });
          expect(renew).toHaveBeenCalledTimes(4);
          done();
        });
      });
    });
  });
}
