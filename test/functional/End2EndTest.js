describe('angularjs homepage', function() {
  it('should have a title', function() {
    browser.get('http://localhost:8000/static/index.html');

    expect(browser.getTitle()).toEqual('Template Project');
  });
});
