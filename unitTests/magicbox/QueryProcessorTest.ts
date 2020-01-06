import { QueryProcessor, IQueryProcessResult, ProcessingStatus } from '../../src/magicbox/QueryProcessor';
import { flatten } from 'underscore';

function wait<T = void>(ms?: number, result?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(result), ms));
}

async function tickAndResolve<T>(promise: Promise<T>, ms: number = 0): Promise<T> {
  const date = new Date();
  const startTick = date.getTime();
  jasmine.clock().tick(ms);
  const result = await promise;
  if (date.getTime() - startTick !== 0) {
    throw `Expected promise to be resolved after ticking ${ms}ms.`;
  }
  return result;
}

export function QueryProcessorTest() {
  describe('QueryProcessor', () => {
    it('does not throw an error when overriding nothing', () => {
      expect(() => new QueryProcessor().overrideIfProcessing()).not.toThrow();
    });

    describe('calling processQueries', () => {
      const timeBetweenQueries = 10;
      const resolveTimes = [0, timeBetweenQueries, timeBetweenQueries * 2, timeBetweenQueries * 3];

      beforeEach(() => {
        jasmine.clock().install();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      describe('without values', () => {
        let queryProcessor: QueryProcessor<string>;
        let returnedPromise: Promise<IQueryProcessResult<string>>;
        beforeEach(() => {
          queryProcessor = new QueryProcessor();
          returnedPromise = queryProcessor.processQueries([]);
        });

        it('resolves immediately', async done => {
          const resolveProcess = jasmine.createSpy('resolveProcess');
          await tickAndResolve(returnedPromise.then(resolveProcess));
          expect(resolveProcess).toHaveBeenCalled();
          done();
        });

        it('resolves with Finished status', async done => {
          expect((await tickAndResolve(returnedPromise)).status).toEqual(ProcessingStatus.Finished);
          done();
        });

        it('resolves with an empty array', async done => {
          expect((await tickAndResolve(returnedPromise)).results.length).toEqual(0);
          done();
        });
      });

      describe(`with values delayed by ${resolveTimes.map(timeout => timeout + 'ms').join(', ')}`, () => {
        const resolveAllTime = resolveTimes[resolveTimes.length - 1];
        const completionTimeout = resolveAllTime + timeBetweenQueries / 2;
        const stringArrays = [['abcd', 'efgh'], ['ijkl'], ['mnop', 'qrst'], ['uvwx']];
        let stringPromises: (string[] | Promise<string[]>)[];
        let queryProcessor: QueryProcessor<string>;
        let returnedPromise: Promise<IQueryProcessResult<string>>;

        beforeEach(() => {
          stringPromises = [
            wait(resolveTimes[3], stringArrays[0]),
            wait(resolveTimes[1], stringArrays[1]),
            wait(resolveTimes[2], stringArrays[2]),
            stringArrays[3]
          ];
        });

        describe('when overriding after resolving the second promise', () => {
          const whenToOverride = resolveTimes[1] + timeBetweenQueries / 2;
          beforeEach(() => {
            queryProcessor = new QueryProcessor({ timeout: completionTimeout });
            returnedPromise = queryProcessor.processQueries(stringPromises);
          });

          describe('by calling overrideIfProcessing', () => {
            beforeEach(() => {
              wait(whenToOverride).then(() => queryProcessor.overrideIfProcessing());
            });

            it('resolves with Overriden status', async done => {
              expect((await tickAndResolve(returnedPromise, whenToOverride)).status).toEqual(ProcessingStatus.Overriden);
              done();
            });

            it('resolves with no items', async done => {
              expect((await tickAndResolve(returnedPromise, whenToOverride)).results.length).toEqual(0);
              done();
            });
          });

          describe('by calling processQueries', () => {
            const newStringArraysInResolvedOrder = [['0️⃣1️⃣'], ['2️⃣3️⃣', '4️⃣']];
            const newStringsInResolvedOrder = flatten(newStringArraysInResolvedOrder);
            let newReturnedPromise: Promise<IQueryProcessResult<string>>;
            beforeEach(() => {
              newReturnedPromise = wait(whenToOverride).then(() =>
                queryProcessor.processQueries([
                  newStringArraysInResolvedOrder[0],
                  wait(timeBetweenQueries, newStringArraysInResolvedOrder[1])
                ])
              );
            });

            it('resolves with Overriden status', async done => {
              expect((await tickAndResolve(returnedPromise, whenToOverride)).status).toEqual(ProcessingStatus.Overriden);
              done();
            });

            it('resolves with no items', async done => {
              expect((await tickAndResolve(returnedPromise, whenToOverride)).results.length).toEqual(0);
              done();
            });

            it('resolves new call with Finished status', async done => {
              await tickAndResolve(returnedPromise, whenToOverride);
              expect((await tickAndResolve(newReturnedPromise, timeBetweenQueries)).status).toEqual(ProcessingStatus.Finished);
              done();
            });

            it(`resolves new call with results from the new promises`, async done => {
              await tickAndResolve(returnedPromise, whenToOverride);
              expect((await tickAndResolve(newReturnedPromise, timeBetweenQueries)).results).toEqual(newStringsInResolvedOrder);
              done();
            });
          });
        });

        describe('timing out after resolving the second promise', () => {
          const timeout = resolveTimes[1] + timeBetweenQueries / 2;
          const expectedStringsInResolvedOrder = [...stringArrays[1], ...stringArrays[3]];
          beforeEach(() => {
            queryProcessor = new QueryProcessor({ timeout });
            returnedPromise = queryProcessor.processQueries(stringPromises);
          });

          it('resolves with TimedOut status', async done => {
            expect((await tickAndResolve(returnedPromise, timeout)).status).toEqual(ProcessingStatus.TimedOut);
            done();
          });

          it('resolves with results from the first two promises', async done => {
            expect((await tickAndResolve(returnedPromise, timeout)).results).toEqual(expectedStringsInResolvedOrder);
            done();
          });
        });

        describe('timing out after last promise', () => {
          beforeEach(() => {
            queryProcessor = new QueryProcessor({ timeout: completionTimeout });
            returnedPromise = queryProcessor.processQueries(stringPromises);
          });

          it('resolves with Finished status', async done => {
            expect((await tickAndResolve(returnedPromise, resolveAllTime)).status).toEqual(ProcessingStatus.Finished);
            done();
          });

          it('resolves with results from every promise in the original order', async done => {
            expect((await tickAndResolve(returnedPromise, resolveAllTime)).results).toEqual(flatten(stringArrays));
            done();
          });
        });
      });
    });
  });
}
