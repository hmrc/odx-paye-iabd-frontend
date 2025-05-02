import React from 'react';
import { useTranslation } from 'react-i18next';

interface PayeCurrentYearLinkProps {
  handleLinkClick: any;
}

const PayeCurrentYearLinks = (props: PayeCurrentYearLinkProps) => {
  const { handleLinkClick } = props;
  const { t } = useTranslation();

  const SummaryCardLink = ({ href, onClick, title }) => (
    <li className='govuk-summary-card-links govuk-card-list'>
      <div className='govuk-summary-card__title-wrapper'>
        <h3 className='govuk-summary-card__title'>
          <a href={href} onClick={onClick} className='govuk-link'>
            {title}
            <svg
              className='govuk-button__start-icon'
              xmlns='http://www.w3.org/2000/svg'
              width='13.5'
              height='14'
              viewBox='0 0 33 40'
              aria-hidden='true'
              focusable='false'
            >
              <path fill='currentColor' d='M0 0h13l20 20-20 20H0l20-20z'></path>
            </svg>
          </a>
        </h3>
      </div>
    </li>
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  return (
    <div className='govuk-grid-row'>
      <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body'>
        <h2 className='govuk-heading-l govuk-!-padding-top-2'>{t('FURTHER_ACTIONS')}</h2>
      </div>

      <ul className='govuk-grid-column-one-half'>
        <SummaryCardLink
          href='#'
          onClick={e => handleNavClick(e, '/tax-relief-for-employees')}
          title={t('CHECK_IF_YOU_CAN_CLAIM_EMPLOYEE_EXPENSES')}
        />
        <SummaryCardLink
          href='#'
          onClick={e =>
            handleNavClick(e, '/digital-forms/form/tell-us-about-other-income/draft/guide')
          }
          title={t('ADD_A_MISSING_INCOME_FROM_ANOTHER_SOURCE')}
        />
        <SummaryCardLink
          href='#'
          onClick={e =>
            handleNavClick(e, '/digital-forms/form/tell-us-about-investment-income/draft/guide')
          }
          title={t('ADD_INVESTMENT_INCOME')}
        />
      </ul>
    </div>
  );
};

export default PayeCurrentYearLinks;
