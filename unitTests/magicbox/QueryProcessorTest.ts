import { QueryProcessor, IQueryProcessResult, ProcessingStatus } from '../../src/magicbox/QueryProcessor';

function wait<T = void>(ms?: number, result?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(result), ms));
}

function flat<T>(bumpyArray: T[][]): T[] {
  return bumpyArray.reduce((resultArray, array) => [...resultArray, ...array], []);
}

function expectArrayEqual<T>(actualArray: T[], expectedArray: T[]) {
  if (!expect(actualArray).not.toBeNull()) {
    return;
  }
  if (!expect(actualArray.length).toEqual(expectedArray.length, 'Lengths are not equal')) {
    return;
  }
  if (actualArray.length === 0) {
    return;
  }
  actualArray.forEach((actual, i) => expect(actual).toEqual(expectedArray[i], `Values at ${i} are not equal`));
}

export function QueryProcessorTest() {
  describe('QueryProcessor', () => {
    it('does not throw an error when overriding nothing', () => {
      expect(() => new QueryProcessor().overrideIfProcessing()).not.toThrow();
    });

    describe('calling processQueries', () => {
      describe('without values', () => {
        let queryProcessor: QueryProcessor<string>;
        let returnedPromise: Promise<IQueryProcessResult<string>>;
        beforeEach(() => {
          queryProcessor = new QueryProcessor();
          returnedPromise = queryProcessor.processQueries([]);
        });

        it('resolves immediately', async done => {
          const resolveProcess = jasmine.createSpy('resolveProcess');
          returnedPromise.then(resolveProcess);
          await wait();
          expect(resolveProcess).toHaveBeenCalled();
          done();
        });

        it('resolves with Finished status', async done => {
          expect((await returnedPromise).status).toEqual(ProcessingStatus.Finished);
          done();
        });

        it('resolves with an empty array', async done => {
          expectArrayEqual((await returnedPromise).results, []);
          done();
        });
      });

      const timeBetweenQueries = 10;
      const resolveTimes = [0, timeBetweenQueries, timeBetweenQueries * 2, timeBetweenQueries * 3];
      describe(`with values delayed by ${resolveTimes.map(timeout => timeout + 'ms').join(', ')}`, () => {
        const lastResolveTime = resolveTimes[resolveTimes.length - 1];
        const stringArraysInResolvedOrder = [['abcd', 'efgh'], ['ijkl'], ['mnop', 'qrst'], ['uvwx']];
        let stringPromisesInResolvedOrder: (string[] | Promise<string[]>)[];
        let stringPromisesInParameterOrder: (string[] | Promise<string[]>)[];

        beforeEach(() => {
          stringPromisesInResolvedOrder = [
            stringArraysInResolvedOrder[0],
            wait(resolveTimes[1], stringArraysInResolvedOrder[1]),
            wait(resolveTimes[2], stringArraysInResolvedOrder[2]),
            wait(resolveTimes[3], stringArraysInResolvedOrder[3])
          ];
          stringPromisesInParameterOrder = [
            stringPromisesInResolvedOrder[2],
            stringPromisesInResolvedOrder[1],
            stringPromisesInResolvedOrder[0],
            stringPromisesInResolvedOrder[3]
          ];
        });

        const whenToOverride = resolveTimes[2];
        describe(`when overriding after ${whenToOverride}ms`, () => {
          let queryProcessor: QueryProcessor<string>;
          let returnedPromise: Promise<IQueryProcessResult<string>>;
          beforeEach(() => {
            queryProcessor = new QueryProcessor({ timeout: lastResolveTime + timeBetweenQueries / 2 });
            returnedPromise = queryProcessor.processQueries(stringPromisesInParameterOrder);
          });

          function willBeOverriden() {
            it('resolves with Overriden status', async done => {
              expect((await returnedPromise).status).toEqual(ProcessingStatus.Overriden);
              done();
            });

            it('resolves with no items', async done => {
              expect((await returnedPromise).results).toBeFalsy();
              done();
            });
          }

          describe('by calling overrideIfProcessing', () => {
            beforeEach(() => {
              wait(whenToOverride).then(() => queryProcessor.overrideIfProcessing());
            });

            willBeOverriden();
          });

          describe('by calling processQueries', () => {
            const newStringArraysInResolvedOrder = [['0️⃣1️⃣'], ['2️⃣3️⃣', '4️⃣']];
            const newStringsInResolvedOrder = flat(newStringArraysInResolvedOrder);
            let newReturnedPromise: Promise<IQueryProcessResult<string>>;
            beforeEach(() => {
              newReturnedPromise = new Promise(async resolve => {
                await wait(whenToOverride);
                resolve(
                  await queryProcessor.processQueries([
                    newStringArraysInResolvedOrder[0],
                    wait(timeBetweenQueries, newStringArraysInResolvedOrder[1])
                  ])
                );
              });
            });

            willBeOverriden();

            it('resolves new call with Finished status', async done => {
              expect((await newReturnedPromise).status).toEqual(ProcessingStatus.Finished);
              done();
            });

            it(`resolves new call with ${JSON.stringify(newStringsInResolvedOrder)}`, async done => {
              expectArrayEqual((await newReturnedPromise).results, newStringsInResolvedOrder);
              done();
            });
          });
        });

        function withTimeout(timeout: number, lastResolvedPromiseIndex: number) {
          describe(`with ${timeout}ms timeout`, () => {
            let queryProcessor: QueryProcessor<string>;
            let returnedPromise: Promise<IQueryProcessResult<string>>;
            const expectedStringsInResolvedOrder = flat(stringArraysInResolvedOrder.slice(0, lastResolvedPromiseIndex + 1));
            beforeEach(() => {
              queryProcessor = new QueryProcessor({ timeout });
              returnedPromise = queryProcessor.processQueries(stringPromisesInParameterOrder);
            });

            if (timeout >= lastResolveTime) {
              it('resolves with Finished status', async done => {
                expect((await returnedPromise).status).toEqual(ProcessingStatus.Finished);
                done();
              });
            } else {
              it('resolves with TimedOut status', async done => {
                expect((await returnedPromise).status).toEqual(ProcessingStatus.TimedOut);
                done();
              });
            }

            it(`resolves with ${JSON.stringify(expectedStringsInResolvedOrder)}`, async done => {
              expectArrayEqual((await returnedPromise).results, expectedStringsInResolvedOrder);
              done();
            });
          });
        }

        [
          ...resolveTimes.slice(1).map(timeout => timeout - timeBetweenQueries / 2), // Timing out
          resolveTimes[resolveTimes.length - 1] + timeBetweenQueries / 2 // Finishing
        ].forEach((timeout, i) => withTimeout(timeout, i));
      });
    });
  });
}
