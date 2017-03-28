describe('CoveoJsSearch.Lazy', function () {
  it('should not load any components eagerly', function () {
    expect(Coveo.Initialization.getListOfLoadedComponents().length).toBe(0);
  });
})
