import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../../AppComponents/LanguageToggle';

const NavBar = props => {
  const { handleSignout, handleLinkClick, hasLanguageToggle } = props;
  const { t } = useTranslation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  return (
    <div className='govuk-width-container'>
      <nav
        id='secondary-nav'
        className='govuk-link hmrc-account-menu'
        aria-label='Account'
        data-module='hmrc-account-menu'
      >
        <a
          href='#'
          className='govuk-link hmrc-account-menu__link hmrc-account-menu__link--home'
          id='PersonalAccountLink'
          onClick={e => handleNavClick(e, '/personal-account')}
        >
          <span className='hmrc-account-icon hmrc-account-icon--home'>{t('ACCOUNT_HOME')}</span>
        </a>

        <ul className='hmrc-account-menu__main'>
          <li>
            <a
              href='#'
              className='govuk-link hmrc-account-menu__link'
              id='MessagesLink'
              onClick={e => handleNavClick(e, '/personal-account/messages')}
            >
              {t('MESSAGES')}
            </a>
          </li>
          <li>
            <a
              href='#'
              className='govuk-link hmrc-account-menu__link'
              id='TrackerLink'
              onClick={e => handleNavClick(e, '/track')}
            >
              {t('FORM_TRACKER')}
            </a>
          </li>
          <li>
            <a
              href='#'
              className='govuk-link hmrc-account-menu__link'
              id='ProfileSettingsLink'
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

export default NavBar;
