import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display appilcation name in Toolbar', () => {
    page.navigateTo();
    expect(page.getToolbarText()).toEqual('Cool Safe');
  });
});
