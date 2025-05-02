import React from 'react';
import {
  formatCurrency,
  getHeadingContent,
  getTESLinksOnLang
} from '../../../../components/helpers/utils';
import { useTranslation } from 'react-i18next';

const SummaryCardIncomeOtherSources = ({ details, handleNavClick }) => {
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const tesLinkArrLang = getTESLinksOnLang(details, lang);
  const otherBenefits = tesLinkArrLang?.[0];
  const { t } = useTranslation();

  const incomeType = getHeadingContent(details?.Content, lang)?.Description;

  return (
    <>
      <div className='govuk-summary-card__title-wrapper'>
        <h4 className='govuk-summary-card__title'>{incomeType}</h4>
        {tesLinkArrLang?.length > 0 && (
          <ul className='govuk-summary-card__actions'>
            <li className='govuk-summary-card__action'>
              <a
                className='govuk-link'
                href='#'
                onClick={e => {
                  handleNavClick(e, otherBenefits?.pyURLContent);
                }}
              >
                {otherBenefits?.Name}
                <span className='govuk-visually-hidden'>
                  {`${otherBenefits?.Name} ${incomeType}`}
                </span>
              </a>
            </li>
          </ul>
        )}
      </div>
      <div className='govuk-summary-card__content'>
        <dl className='govuk-summary-list'>
          <div className='govuk-summary-list__row'>
            <dt className='govuk-summary-list__key'>{t('AMOUNT')}</dt>
            <dd className='govuk-summary-list__value'>{formatCurrency(details?.AnnualAmount)}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};

export default SummaryCardIncomeOtherSources;
