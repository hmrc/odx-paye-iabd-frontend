import { config } from './config';

// Define a common function to perform login and redirection
const login = async page => {
  // Log all redirect URLs
  page.on('response', response => {
    if (response.status() >= 300 && response.status() < 400) {
      console.log('Redirected to:', response.headers.location); // eslint-disable-line no-console
    }
  });
  // Wait for the final URL
  await page.waitForURL(/https:\/\/test-www\.tax\.service\.gov\.uk\/api-test-login\//);
  // Fill in username and password fields
  await page.fill('#userId', config.apps.paye.iabd.username);
  await page.fill('#password', config.apps.paye.iabd.password);
  // Click the "Sign in" button
  await page.click('#submit');
  // Wait for navigation to happen after login
  await page.waitForURL(config.baseUrl);
};

export default login;
