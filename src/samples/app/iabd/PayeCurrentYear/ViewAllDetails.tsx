import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import {
  getTesLinks,
  formatCurrency,
  formatDate,
  formatTaxCode,
  getTESLinksOnLang
} from '../../../../components/helpers/utils';
import { DetailsTypes } from './PayeCurrentYearTypes';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

interface ViewAllDetailsProps {
  details: DetailsTypes;
  redirectCurrentYearPage: () => void;

  handleLinkClick: (d: string) => void;
  handleUnderstandYourTaxCodeClick: (d: DetailsTypes, s: string, st: string) => void;

  beginIntrruptionPage: (
    empSeq: number,
    handleClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => void,
    fromPage: string
  ) => void;
}

const ViewAllDetails = ({
  details,
  redirectCurrentYearPage,
  handleLinkClick,
  beginIntrruptionPage,
  handleUnderstandYourTaxCodeClick
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
  const { serviceShuttered, isLoading } = useServiceShuttered();
  const hasLink = understandTaxCodeArr?.length > 0 || updateTaxibleIncomeArr?.length > 0;
  const noActionClassWithoutLink = hasLink ? 'govuk-summary-list__row--no-actions' : '';

  useEffect(() => {
    setPageTitle();
  }, [i18next.language]);

  const hasPayments = viewPaymentsArr?.length > 0;
  const hasBenefits = companyBenefitArr?.length > 0;

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  const ActionLink = ({ name, url, onClick }) => (
    <a
      className='govuk-link'
      href='#'
      data-tracking-type='Outbound'
      data-tracking-target={`${name} ${t('FOR')} ${details.EmployerName} ${url}`}
      onClick={e => {
        e.preventDefault();
        onClick(e, url);
      }}
    >
      {name}
      <span className='govuk-visually-hidden'>
        {t('FOR')} {details.EmployerName}
      </span>
    </a>
  );

  const PaymentLink = () => (
    <a
      href='#'
      className='govuk-link'
      data-tracking-type='Outbound'
      data-tracking-target={`View Payments for ${details.EmployerName} ${viewPaymentsArr[0].pyURLContent}`}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        handleNavClick(e, viewPaymentsArr[0].pyURLContent);
      }}
    >
      {viewPaymentsArr[0].Name}
      <span className='govuk-visually-hidden'>
        {t('FOR')} {details.EmployerName}
      </span>
    </a>
  );

  const renderOtherActions = () => {
    return (
      <>
        <h2 className='govuk-heading-l'>{t('OTHER_ACTIONS')}</h2>
        <div>
          {hasPayments && hasBenefits ? (
            <ul className='govuk-list'>
              <li>
                <PaymentLink />
              </li>
              <li>
                <ActionLink
                  name={companyBenefitArr[0].Name}
                  url={companyBenefitArr[0].pyURLContent}
                  onClick={(e, url) => handleLinkClick(url)}
                />
              </li>
            </ul>
          ) : (
            <>
              {hasPayments && (
                <p>
                  <PaymentLink />
                </p>
              )}
              {hasBenefits && (
                <p>
                  <ActionLink
                    name={companyBenefitArr[0].Name}
                    url={companyBenefitArr[0].pyURLContent}
                    onClick={(e, url) => handleLinkClick(url)}
                  />
                </p>
              )}
            </>
          )}
        </div>
      </>
    );
  };

  const title = `${isPension ? t('PENSION_DETAILS_FOR', { lng: 'en' }) : t('EMPLOYMENT_DETAILS_FOR', { lng: 'en' })} ${details.EmployerName}`;
  return (
    <ShutteredServiceWrapper serviceIsShuttered={serviceShuttered}>
      <LoadingWrapper
        pageIsLoading={isLoading}
        spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
      >
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
          <MainWrapperFull title={title}>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-three-quarters'>
                <h1 className='govuk-heading-xl'>
                  {isPension ? t('PENSION_DETAILS_FOR') : t('EMPLOYMENT_DETAILS_FOR')}
                  {` ${details.EmployerName}`}
                </h1>
                <dl className='govuk-summary-list'>
                  {!isCeased && (
                    <div className={`govuk-summary-list__row ${noActionClassWithoutLink}`}>
                      <dt className='govuk-summary-list__key'>{t('START_DATE')}</dt>
                      <dd className='govuk-summary-list__value'>{formatDate(details.StartDate)}</dd>
                    </div>
                  )}
                  {isCeased && (
                    <div className={`govuk-summary-list__row ${noActionClassWithoutLink}`}>
                      <dt className='govuk-summary-list__key'>{t('END_DATE')}</dt>
                      <dd className='govuk-summary-list__value'>{formatDate(details.EndDate)}</dd>
                    </div>
                  )}
                  {isCeased && (
                    <div className={`govuk-summary-list__row ${noActionClassWithoutLink}`}>
                      <dt className='govuk-summary-list__key'>{t('P45_AMOUNT')}</dt>
                      <dd className='govuk-summary-list__value'>
                        {formatCurrency(details.P45Amount)}
                      </dd>
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
                    <dd className='govuk-summary-list__value'>
                      {formatTaxCode(details.AssignedTaxCode)}
                    </dd>
                    {!isCeased && (
                      <dd className='govuk-summary-list__actions'>
                        {understandTaxCodeArr?.length > 0 && (
                          <a
                            className='govuk-link'
                            href='#'
                            onClick={e => {
                              e.preventDefault();
                              const taxCode = understandTaxCodeArr[0]?.pyURLContent?.toLowerCase();

                              if (taxCode === 'defaulttaxcode' || taxCode === 'specialtaxcode') {
                                handleUnderstandYourTaxCodeClick(
                                  details,
                                  taxCode,
                                  'ViewAllDetailsPage'
                                );
                              } else {
                                handleLinkClick(understandTaxCodeArr[0].pyURLContent);
                              }
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

                  <div className={`govuk-summary-list__row ${noActionClassWithoutLink}`}>
                    <dt className='govuk-summary-list__key'>{t('PAYROLL_NUMBER')}</dt>
                    <dd className='govuk-summary-list__value'>{details.PayRollID}</dd>
                  </div>
                  <div className={`govuk-summary-list__row ${noActionClassWithoutLink}`}>
                    <dt className='govuk-summary-list__key'>{t('EMPLOYER_PAYE_REFRENCE')}</dt>
                    <dd className='govuk-summary-list__value'>
                      {details?.PAYENumber || t('NO_INFORMATION')}
                    </dd>
                  </div>
                </dl>
                {(viewPaymentsArr?.length > 0 || companyBenefitArr?.length > 0) && (
                  <div> {renderOtherActions()}</div>
                )}
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(ViewAllDetails);
