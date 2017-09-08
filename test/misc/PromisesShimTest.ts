import { Simulate } from '../Simulate';

export function PromisesShimTest() {
  describe('PromisesShim', function() {
    it('should shim finally', done => {
      new Promise((resolve, reject) => {
        resolve(true);
      }).finally(() => {
        // dummy check, what we really need to see is that done was called
        expect(true).toBe(true);
        done();
      });
    });

    it('should shim done', done => {
      // In a normal browser, this would require
      // to import es6-promises.
      // Testing for phantom js is good enough
      if (Simulate.isPhantomJs()) {
        var p = new Promise((resolve, reject) => {
          resolve(true);
        });

        p.done(value => {
          expect(value).toBe(true);
          done();
        });
      } else {
        expect(true).toBe(true);
        done();
      }
    });

    it('should shim fail', done => {
      // In a normal browser, this would require
      // to import es6-promises.
      // Testing for phantom js is good enough
      if (Simulate.isPhantomJs()) {
        var p = new Promise((resolve, reject) => {
          reject(false);
        });

        p.fail(value => {
          expect(value).toBe(false);
          done();
        });
      } else {
        expect(true).toBe(true);
        done();
      }
    });
  });
}
