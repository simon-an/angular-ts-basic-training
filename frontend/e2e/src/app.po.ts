import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getToolbarText() {
    return element(by.css('cool-root cool-header-with-sidenav span')).getText();
  }
}
