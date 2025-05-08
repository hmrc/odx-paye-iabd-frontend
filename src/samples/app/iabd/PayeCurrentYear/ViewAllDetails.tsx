import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import {
  getTesLinks,
  formatCurrency,
  formatDate,
  getTaxCode,
  getTESLinksOnLang
} from '../../../../components/helpers/utils';
import { DetailsTypes } from './PayeCurrentYearTypes';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';

interface ViewAllDetailsProps {
  details: DetailsTypes;
  redirectCurrentYearPage: () => void;

  handleLinkClick: (d: string) => void;

  beginIntrruptionPage: (
    empSeq: string,

    handleClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => void,

    fromPage: string
  ) => void;
}

const ViewAllDetails = ({
  details,
  redirectCurrentYearPage,
  handleLinkClick,
  beginIntrruptionPage
}: ViewAllDetailsProps) => {
  const { t } = useTranslation();
  const isCeased = details?.Status?.toUpperCase() === 'CEASED';
  const isPension = details?.ActiveOccupationalPension;
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const tesLinkArrLang = getTESLinksOnLang(details, lang);
  const viewPaymentsArr = getTesLinks('PAYMENT', tesLinkArrLang);
  const companyBenefitArr = getTesLinks('COMPBENEFIT', tesLinkArrLang);
  const updateTaxibleIncomeArr = getTesLinks('ESTPAY', tesLinkArrLang);
  const understandTaxCodeArr = getTesLinks('TAXCODE', tesLinkArrLang);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  useEffect(() => {
    setPageTitle();
  }, [i18next.language]);

  return (
    <>
      <Button
        variant='backlink'
        onClick={e => {
          e.preventDefault();
          redirectCurrentYearPage();
        }}
        key='CardExpandingPageBacklink'
        attributes={{ type: 'link' }}
      />
      <MainWrapperFull>
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-three-quarters'>
            <h1 className='govuk-heading-xl'>
              {isPension ? t('PENSION_DETAILS_FOR') : t('EMPLOYMENT_DETAILS_FOR')}
              {` ${details.EmployerName}`}
            </h1>
            <dl className='govuk-summary-list'>
              {!isCeased && (
                <div className='govuk-summary-list__row govuk-summary-list__row--no-actions'>
                  <dt className='govuk-summary-list__key'>{t('START_DATE')}</dt>
                  <dd className='govuk-summary-list__value'>{formatDate(details.StartDate)}</dd>
                </div>
              )}
              {isCeased && (
                <div className='govuk-summary-list__row govuk-summary-list__row--no-actions'>
                  <dt className='govuk-summary-list__key'>{t('END_DATE')}</dt>
                  <dd className='govuk-summary-list__value'>{formatDate(details.EndDate)}</dd>
                </div>
              )}
              {isCeased && (
                <div className='govuk-summary-list__row govuk-summary-list__row--no-actions'>
                  <dt className='govuk-summary-list__key'>{t('P45_AMOUNT')}</dt>
                  <dd className='govuk-summary-list__value'>{formatCurrency(details.P45Amount)}</dd>
                </div>
              )}
              {!isCeased && (
                <div className='govuk-summary-list__row'>
                  <dt className='govuk-summary-list__key'>{t('ESTIMATED_TAXABLE_INCOME')}</dt>
                  <dd className='govuk-summary-list__value'>
                    {formatCurrency(details.EstimatedPay)}
                  </dd>
                  <dd className='govuk-summary-list__actions'>
                    {updateTaxibleIncomeArr?.length > 0 && (
                      <a
                        className='govuk-link'
                        href='#'
                        onClick={e => {
                          e.preventDefault();
                          if (details.EstimatedPayInterruptionFlag === true) {
                            beginIntrruptionPage(
                              details.EmploymentSequenceNumber,
                              handleNavClick,
                              'ViewAllDetailsPage'
                            );
                          } else {
                            e.preventDefault();
                            handleLinkClick(updateTaxibleIncomeArr[0].pyURLContent);
                          }
                        }}
                      >
                        {updateTaxibleIncomeArr[0].Name}
                        <span className='govuk-visually-hidden'>
                          {t('ESTIMATED_TAXABLE_INCOME_FOR')}
                          {details.EmployerName}
                        </span>
                      </a>
                    )}
                  </dd>
                </div>
              )}

              <div className='govuk-summary-list__row'>
                <dt className='govuk-summary-list__key'>{t('TAX_CODE')}</dt>
                <dd className='govuk-summary-list__value'>{getTaxCode(details.AssignedTaxCode)}</dd>
                {!isCeased && (
                  <dd className='govuk-summary-list__actions'>
                    {understandTaxCodeArr?.length > 0 && (
                      <a
                        className='govuk-link'
                        href='#'
                        onClick={e => {
                          e.preventDefault();
                          handleLinkClick(understandTaxCodeArr[0].pyURLContent);
                        }}
                      >
                        {understandTaxCodeArr[0].Name}

                        <span className='govuk-visually-hidden'>
                          {t('FOR')}
                          {details.EmployerName}
                        </span>
                      </a>
                    )}
                  </dd>
                )}
              </div>

              <div className='govuk-summary-list__row govuk-summary-list__row--no-actions'>
                <dt className='govuk-summary-list__key'>{t('PAYROLL_NUMBER')}</dt>
                <dd className='govuk-summary-list__value'>{details.PayRollID}</dd>
              </div>

              <div className='govuk-summary-list__row govuk-summary-list__row--no-actions'>
                <dt className='govuk-summary-list__key'>{t('EMPLOYER_PAYE_REFRENCE')}</dt>
                <dd className='govuk-summary-list__value'>{details.PAYENumber}</dd>
              </div>
            </dl>
            {(viewPaymentsArr?.length > 0 || companyBenefitArr?.length > 0) && (
              <>
                <h2 className='govuk-heading-l'>{t('OTHER_ACTIONS')}</h2>
                <ul className='govuk-list'>
                  {viewPaymentsArr?.length > 0 && (
                    <li>
                      <a
                        className='govuk-link'
                        href='#'
                        onClick={e => {
                          e.preventDefault();
                          handleLinkClick(viewPaymentsArr[0].pyURLContent);
                        }}
                      >
                        {viewPaymentsArr[0].Name}
                        <span className='govuk-visually-hidden'>
                          {t('FOR')}
                          {details.EmployerName}
                        </span>
                      </a>
                    </li>
                  )}
                  {companyBenefitArr?.length > 0 && (
                    <li>
                      <a
                        className='govuk-link'
                        href='#'
                        onClick={e => {
                          e.preventDefault();
                          handleLinkClick(companyBenefitArr[0].pyURLContent);
                        }}
                      >
                        {companyBenefitArr[0].Name}
                        <span className='govuk-visually-hidden'>
                          {t('FOR')}
                          {details.EmployerName}
                        </span>
                      </a>
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </MainWrapperFull>
    </>
  );
};

export default ViewAllDetails;
