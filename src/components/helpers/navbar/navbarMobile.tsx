import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../../AppComponents/LanguageToggle';

const NavBarMobile = props => {
  const { handleSignout, handleLinkClick, hasLanguageToggle } = props;
  const { t } = useTranslation();
  const [menuExpanded, setMenuExpanded] = useState(false);

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  return (
    <div className='govuk-width-container'>
      <nav
        id='secondary-nav'
        className='hmrc-account-menu is-smaller'
        aria-label='Account'
        data-module='hmrc-account-menu'
      >
        <a
          href='#'
          data-tracking-type='Outbound'
          data-tracking-target={`${t('ACCOUNT_HOME')} /personal-account`}
          className='govuk-link hmrc-account-menu__link hmrc-account-menu__link--home'
          id='PersonalAccountMobileLink'
          onClick={e => handleNavClick(e, '/personal-account')}
        >
          <span className='hmrc-account-icon hmrc-account-icon--home'>{t('ACCOUNT_HOME')}</span>
        </a>
        <a
          href='#'
          onClick={e => {
            e.preventDefault();
            toggleMenu();
          }}
          className={`govuk-link hmrc-account-menu__link hmrc-account-menu__link--menu js-visible ${menuExpanded ? 'hmrc-account-home--account--is-open' : ''}`}
          id='AccMenuMobileLink'
          aria-expanded={menuExpanded ? 'true' : 'false'}
          aria-hidden='false'
        >
          {t('ACCOUNT_MENU')}
        </a>

        <ul
          className={`hmrc-account-menu__main ${menuExpanded ? 'main-nav-is-open' : 'js-hidden'}`}
        >
          <li>
            <a
              href='#'
              data-tracking-type='Outbound'
              data-tracking-target={`${t('MESSAGES')} /personal-account/messages`}
              className='govuk-link hmrc-account-menu__link'
              id='MessagesMobileLink'
              onClick={e => handleNavClick(e, '/personal-account/messages')}
            >
              {t('MESSAGES')}
            </a>
          </li>
          <li>
            <a
              href='#'
              className='govuk-link hmrc-account-menu__link'
              id='TrackerMobileLink'
              data-tracking-type='Outbound'
              data-tracking-target={`${t('FORM_TRACKER')} /track`}
              onClick={e => handleNavClick(e, '/track')}
            >
              {t('FORM_TRACKER')}
            </a>
          </li>

          <li>
            <a
              href='#'
              className='govuk-link hmrc-account-menu__link'
              id='ProfileSettingsMobileLink'
              data-tracking-type='Outbound'
              data-tracking-target={`${t('PROFILE_AND_SETTINGS')} /personal-account/profile-and-settings`}
              onClick={e => handleNavClick(e, '/personal-account/profile-and-settings')}
            >
              {t('PROFILE_AND_SETTINGS')}
            </a>
          </li>
          {handleSignout && (
            <li>
              <a
                href='#'
                id='signout-btn'
                data-tracking-type='Signout'
                className='govuk-link hmrc-account-menu__link'
                onClick={handleSignout}
              >
                {t('SIGN_OUT')}
              </a>
            </li>
          )}
        </ul>
      </nav>
      {hasLanguageToggle && <LanguageToggle />}
    </div>
  );
};

export default NavBarMobile;
