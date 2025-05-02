import { test, expect } from '@playwright/test';
import { config } from '../../config';
import login from '../../common';

test.beforeEach(async ({ page }) => {
  await page.goto(config.baseUrl);
});

test.describe('E2E test', () => {
  test('Redirect to login page correctly and login', async ({ page }) => {
    await login(page);
  });

  test('Header, logo, and service name are present and correct', async ({ page }) => {
    await login(page);

    const logo = await page.$('.govuk-header__logotype');
    expect(logo).not.toBeNull();

    const serviceNameElement = await page.$('.govuk-header__service-name');
    expect(serviceNameElement).not.toBeNull();

    const serviceName = await serviceNameElement.textContent();
    expect(serviceName.trim()).toBe('PAYE Service');

    const navigationLinks = await page.$$('.govuk-header__navigation__link');
    const textContentPromises = navigationLinks.map(link => {
      return link.textContent();
    });
    const linkTexts = await Promise.all(textContentPromises);
    expect(linkTexts.every(text => text.trim().length > 0)).toBeTruthy();
  });

  test('Phase banner displays correctly', async ({ page }) => {
    await login(page);
    const phaseBanner = await page.$('.govuk-phase-banner');
    expect(phaseBanner).not.toBeNull();

    const textElement = await phaseBanner.$('.govuk-phase-banner__text');
    expect(textElement).not.toBeNull();

    const text = await textElement.textContent();
    expect(text).toContain('This is a new service - your');

    const feedbackLink = await phaseBanner.$('.govuk-phase-banner__text .govuk-link');
    expect(feedbackLink).not.toBeNull();

    const linkText = await feedbackLink.textContent();
    expect(linkText.trim()).toBe('feedback');
  });

  test('Check if all navbar links are visible and correct', async ({ page }) => {
    await login(page);

    await page.waitForSelector('#secondary-nav');

    const homeLink = await page.$('#PersonalAccountLink');
    expect(homeLink).not.toBeNull();
    expect(await homeLink.isVisible()).toBeTruthy();
    const homeText = await homeLink.textContent();
    expect(homeText.trim()).toBe('Account home');

    const messagesLink = await page.$('#MessagesLink');
    expect(messagesLink).not.toBeNull();
    expect(await messagesLink.isVisible()).toBeTruthy();
    const messagesText = await messagesLink.textContent();
    expect(messagesText.trim()).toBe('Messages');

    const formTrackerLink = await page.$('#TrackerLink');
    expect(formTrackerLink).not.toBeNull();
    expect(await formTrackerLink.isVisible()).toBeTruthy();
    const formTrackerText = await formTrackerLink.textContent();
    expect(formTrackerText.trim()).toBe('Form tracker');

    const profileLink = await page.$('#ProfileSettingsLink');
    expect(profileLink).not.toBeNull();
    expect(await profileLink.isVisible()).toBeTruthy();
    const profileText = await profileLink.textContent();
    expect(profileText.trim()).toBe('Profile and settings');

    const signOutLink = await page.$('#signout-btn');
    expect(signOutLink).not.toBeNull();
    expect(await signOutLink.isVisible()).toBeTruthy();
    const signOutText = await signOutLink.textContent();
    expect(signOutText.trim()).toBe('Sign out');
  });

  test('Welsh translation', async ({ page }) => {
    await login(page);
    const welshLanguageLink = await page.$('a[lang="cy"]');
    await welshLanguageLink.click();
    await page.waitForSelector('#signout-btn');
    const signOutLinkCy = await page.$('#signout-btn');
    const linkTextCy = await signOutLinkCy.textContent();
    expect(linkTextCy.trim()).toBe('Allgofnodi');
  });

  test('English translation', async ({ page }) => {
    await login(page);
    const signOutLinkEn = await page.$('#signout-btn');
    const linkTextEn = await signOutLinkEn.textContent();
    expect(linkTextEn.trim()).toBe('Sign out');
  });

  test.describe('Footer', () => {
    test('Footer links and logos are present', async ({ page }) => {
      await login(page);
      const footer = await page.$('footer.govuk-footer');
      expect(footer).not.toBeNull();

      const footerLinks = await footer.$$('.govuk-footer__link');
      expect(footerLinks.length).toBeGreaterThan(0);

      const footerLogos = await footer.$$('.govuk-footer__licence-logo');
      expect(footerLogos.length).toBeGreaterThan(0);
    });

    test('Footer text content is correct', async ({ page }) => {
      await login(page);
      const footer = await page.$('footer.govuk-footer');
      expect(footer).not.toBeNull();

      const footerText = await footer.textContent();
      expect(footerText.includes('All content is available under the')).toBeTruthy();
      expect(footerText.includes('© Crown copyright')).toBeTruthy();
    });
  });

  test.describe('Mobile Navbar test', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 769, height: 1024 });
      await page.goto(config.baseUrl);
      await login(page);
    });

    test('Mobile Navbar appears and functions correctly', async ({ page }) => {
      const mobileNavBar = await page.$('#secondary-nav');
      expect(mobileNavBar).not.toBeNull();
      expect(await mobileNavBar.isVisible()).toBeTruthy();

      const accountMenuLink = await page.$('#AccMenuMobileLink');
      expect(accountMenuLink).not.toBeNull();
      expect(await accountMenuLink.isVisible()).toBeTruthy();

      await accountMenuLink.click();

      await page.waitForSelector('.main-nav-is-open');

      const messagesLink = await page.$('#MessagesMobileLink');
      expect(messagesLink).not.toBeNull();
      expect(await messagesLink.isVisible()).toBeTruthy();
      expect((await messagesLink.textContent()).trim()).toBe('Messages');

      const formTrackerLink = await page.$('#TrackerMobileLink');
      expect(formTrackerLink).not.toBeNull();
      expect(await formTrackerLink.isVisible()).toBeTruthy();
      expect((await formTrackerLink.textContent()).trim()).toBe('Form tracker');

      const profileLink = await page.$('#ProfileSettingsMobileLink');
      expect(profileLink).not.toBeNull();
      expect(await profileLink.isVisible()).toBeTruthy();
      expect((await profileLink.textContent()).trim()).toBe('Profile and settings');

      const signOutLink = await page.$('#signout-btn');
      expect(signOutLink).not.toBeNull();
      expect(await signOutLink.isVisible()).toBeTruthy();
      expect((await signOutLink.textContent()).trim()).toBe('Sign out');
    });
  });
});

test.afterEach(async ({ page }) => {
  await page.pause();
});
