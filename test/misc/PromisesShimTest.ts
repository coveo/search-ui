/// <reference path="../Test.ts" />

module Coveo {
  describe('PromisesShim', function () {
    it('should shim finally', (done) => {
      new Promise((resolve, reject) => {
        resolve(true);
      }).finally(() => {
        // dummy check, what we really need to see is that done was called
        expect(true).toBe(true);
        done();
      });
    })

    it('should shim done', (done) => {
      var p = new Promise((resolve, reject) => {
        resolve(true);
      })

      p.done((value) => {
        expect(value).toBe(true);
        done();
      });
    })

    it('should shim fail', (done) => {
      var p = new Promise((resolve, reject) => {
        reject(false);
      })

      p.fail((value) => {
        expect(value).toBe(false);
        done();
      });
    })
  })
}
