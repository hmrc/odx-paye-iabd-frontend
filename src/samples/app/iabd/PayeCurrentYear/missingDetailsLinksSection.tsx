import React from 'react';
import { useTranslation } from 'react-i18next';

const MissingDetailLinksSection = () => {
  const { t } = useTranslation();
  return (
    <div className='govuk-!-margin-top-9'>
      <h2 className='govuk-heading-l'>
        {t('MISSING_DETAILS_LINKS.ADD_MISSING_INCOME_DETAILS_HEADER')}
      </h2>
      <div>
        <p className='govuk-body'>{t('MISSING_DETAILS_LINKS.IF_YOU_NOTICE_SOMETHING_MISSING')}</p>
        <ul className='govuk-list govuk-list--bullet'>
          <li>
            <a
              data-tracking-type='Outbound'
              data-tracking-target='add missing allowance or tax relief </submissions/new-form/tell-hmrc-about-your-tax-free-allowance>'
              className='govuk-link'
              href='https://www.tax.service.gov.uk/submissions/new-form/tell-hmrc-about-your-tax-free-allowance'
            >
              {t('MISSING_DETAILS_LINKS.ADD_MISSING_ALLOWANCE_LINK')}
            </a>
          </li>
          <li>
            <a
              data-tracking-type='Outbound'
              data-tracking-target='add income from another source </digital-forms/form/tell-us-about-other-income/draft/guide>'
              className='govuk-link'
              href='https://www.tax.service.gov.uk/digital-forms/form/tell-us-about-other-income/draft/guide'
            >
              {t('MISSING_DETAILS_LINKS.ADD_MISSING_INCOME_LINK')}
            </a>
          </li>
          <li>
            <a
              data-tracking-type='Outbound'
              data-tracking-target='add investment income </submissions/new-form/tell-hmrc-about-your-investment-income/>'
              className='govuk-link'
              href='https://www.tax.service.gov.uk/submissions/new-form/tell-hmrc-about-your-investment-income/'
            >
              {t('MISSING_DETAILS_LINKS.ADD_INVESTMENT_INCOME_LINK')}
            </a>
          </li>
          <li>
            <a
              data-tracking-type='Outbound'
              data-tracking-target='add company benefits </submissions/new-form/tell-hmrc-about-your-company-benefits/>'
              className='govuk-link'
              href='https://www.tax.service.gov.uk/submissions/new-form/tell-hmrc-about-your-company-benefits/'
            >
              {t('MISSING_DETAILS_LINKS.ADD_COMPANY_BENEFIT_LINK')}
            </a>
          </li>
        </ul>
        <p className='govuk-body'>
          {t('MISSING_DETAILS_LINKS.ADD_PENSION_RELIEF_LINK_1')}{' '}
          <a
            data-tracking-type='Outbound'
            data-tracking-target='claim pension tax relief </submissions/new-form/claim-personal-pension-tax-relief>'
            className='govuk-link'
            href='https://www.tax.service.gov.uk/submissions/new-form/claim-personal-pension-tax-relief'
          >
            {t('MISSING_DETAILS_LINKS.ADD_PENSION_RELIEF_EXTERNAL_LINK')}
          </a>{' '}
          {t('MISSING_DETAILS_LINKS.ADD_PENSION_RELIEF_LINK_3')}
        </p>
      </div>
    </div>
  );
};

export default MissingDetailLinksSection;
