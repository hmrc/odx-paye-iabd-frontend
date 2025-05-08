import React from 'react';
import {
  formatDate,
  generateKey,
  formatCurrency,
  getTaxCode,
  getTesLinks,
  getTESLinksOnLang
} from '../../../../components/helpers/utils';
import { useTranslation } from 'react-i18next';

const SummaryCard = ({
  details,
  type,
  handleNavClick,
  handleViewAllDetailsClick,
  beginIntrruptionPage
}) => {
  const { t } = useTranslation();
  const isCurrentEmployment = type === 'currentEmp';
  const isEndedEmployment = type === 'endedEmp';
  const isCurrentPension = type === 'currentPension';
  const isPreviousPension = type === 'previousPension';
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const tesLinkArrLang = getTESLinksOnLang(details, lang);
  const viewPaymentsArr = getTesLinks('PAYMENT', tesLinkArrLang);
  const viewAllDetailsArr = getTesLinks('ALLDETAIL', tesLinkArrLang);
  const updateTaxibleIncomeArr = getTesLinks('ESTPAY', tesLinkArrLang);
  const understandTaxCodeArr = getTesLinks('TAXCODE', tesLinkArrLang);

  return (
    <div
      className='govuk-summary-card'
      key={generateKey(details.EmployerName, details.index, type)}
    >
      <div className='govuk-summary-card__title-wrapper center-align'>
        <h4 className='govuk-summary-card__title'>{details.EmployerName}</h4>

        <ul className='govuk-summary-card__actions'>
          {(viewPaymentsArr?.length > 0 || viewAllDetailsArr?.length > 0) && (
            <ul className='govuk-summary-card__actions'>
              {viewPaymentsArr?.length > 0 && (
                <li className='govuk-summary-card__action'>
                  <a
                    className='govuk-link'
                    href='#'
                    onClick={e => {
                      handleNavClick(e, viewPaymentsArr[0].pyURLContent);
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
              {viewAllDetailsArr?.length > 0 && (
                <li className='govuk-summary-card__action'>
                  <a
                    className='govuk-link'
                    href='#'
                    onClick={() => {
                      handleViewAllDetailsClick(details);
                    }}
                  >
                    {t('VIEW_ALL_DETAILS')}
                    <span className='govuk-visually-hidden'>
                      {t('FOR')}
                      {details.EmployerName}
                    </span>
                  </a>
                </li>
              )}
            </ul>
          )}
        </ul>
      </div>

      <div className='govuk-summary-card__content'>
        <dl className='govuk-summary-list'>
          {(isCurrentEmployment || isCurrentPension) && (
            <>
              <div className='govuk-summary-list__row'>
                <dt className='govuk-summary-list__key'>{t('START_DATE')}</dt>
                <dd className='govuk-summary-list__value'>{formatDate(details.StartDate)}</dd>
              </div>
              <div className='govuk-summary-list__row'>
                <dt className='govuk-summary-list__key'>{t('ESTIMATED_TAXABLE_INCOME')}</dt>
                <dd className='govuk-summary-list__value'>
                  {formatCurrency(details.EstimatedPay)}
                </dd>
                {updateTaxibleIncomeArr?.length > 0 && (
                  <dd className='govuk-summary-list__actions'>
                    <a
                      href='#'
                      onClick={e => {
                        e.preventDefault();
                        if (details.EstimatedPayInterruptionFlag === true) {
                          beginIntrruptionPage(
                            details.EmploymentSequenceNumber,
                            handleNavClick,
                            'PayeCurrentYearPage'
                          );
                        } else {
                          handleNavClick(e, updateTaxibleIncomeArr[0].pyURLContent);
                        }
                      }}
                      className='govuk-link'
                    >
                      {updateTaxibleIncomeArr[0].Name}
                      <span className='govuk-visually-hidden'>
                        {t('ESTIMATED_TAXABLE_INCOME_FOR')} {details.EmployerName}
                      </span>
                    </a>
                  </dd>
                )}
              </div>
            </>
          )}

          {(isEndedEmployment || isPreviousPension) && (
            <>
              {details.Status?.toLowerCase() === 'ceased' && (
                <>
                  <div className='govuk-summary-list__row'>
                    <dt className='govuk-summary-list__key'>{t('END_DATE')}</dt>
                    <dd className='govuk-summary-list__value'>{formatDate(details.EndDate)}</dd>
                  </div>

                  <div className='govuk-summary-list__row'>
                    <dt className='govuk-summary-list__key'>{t('P45_AMOUNT')}</dt>
                    <dd className='govuk-summary-list__value'>
                      {formatCurrency(details.P45Amount)}
                    </dd>
                  </div>
                </>
              )}
            </>
          )}
          {isEndedEmployment && (
            <>
              {details.Status?.toLowerCase() !== 'ceased' && (
                <>
                  <div className='govuk-summary-list__row'>
                    <dt className='govuk-summary-list__key'>{t('PAYROLL_NUMBER')}</dt>
                    <dd className='govuk-summary-list__value'>{details.PayRollID}</dd>
                  </div>
                  <div className='govuk-summary-list__row'>
                    <dt className='govuk-summary-list__key'>{t('EMPLOYER_PAYE_REFRENCE')}</dt>
                    <dd className='govuk-summary-list__value'>{details.PAYENumber}</dd>
                  </div>
                </>
              )}
            </>
          )}

          <div className='govuk-summary-list__row'>
            <dt className='govuk-summary-list__key'>{t('TAX_CODE')}</dt>
            <dd className='govuk-summary-list__value'>{getTaxCode(details.AssignedTaxCode)}</dd>
            {understandTaxCodeArr?.length > 0 && (
              <dd className='govuk-summary-list__actions'>
                <a
                  href='#'
                  onClick={e => handleNavClick(e, understandTaxCodeArr[0].pyURLContent)}
                  className='govuk-link'
                >
                  {understandTaxCodeArr[0].Name}
                  <span className='govuk-visually-hidden'>
                    {t('FOR')}
                    {details.EmployerName}
                  </span>
                </a>
              </dd>
            )}
          </div>

          {isPreviousPension && (
            <>
              {details.Status?.toLowerCase() !== 'ceased' && (
                <>
                  <div className='govuk-summary-list__row'>
                    <dt className='govuk-summary-list__key'>{t('PAYROLL_NUMBER')}</dt>
                    <dd className='govuk-summary-list__value'>{details.PayRollID}</dd>
                  </div>
                  <div className='govuk-summary-list__row'>
                    <dt className='govuk-summary-list__key'>{t('PENSION_PAYE_REFRENCE')}</dt>
                    <dd className='govuk-summary-list__value'>{details.PAYENumber}</dd>
                  </div>
                </>
              )}
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default SummaryCard;
