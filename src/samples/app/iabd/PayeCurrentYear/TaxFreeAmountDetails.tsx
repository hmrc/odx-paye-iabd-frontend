import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatCurrency,
  generateKey,
  getCurrentLang,
  getHeadingContent,
  getTESLinksOnLang
} from '../../../../components/helpers/utils';
import { AllowanceObject } from './PayeCurrentYearTypes';

interface TaxFreeAmountDetailsProps {
  allowances: AllowanceObject[];
  personalAllowances: AllowanceObject[];
  deductions: AllowanceObject[];

  handleLinkClick: (d: string) => void;
}

const TaxFreeAmountDetails = ({
  allowances,
  personalAllowances,
  deductions,
  handleLinkClick
}: TaxFreeAmountDetailsProps) => {
  const currentLang = getCurrentLang();
  const { t } = useTranslation();

  return (
    <>
      <h2 className='govuk-heading-m'>{t('HOW_TAX_CODE_CALCULATED')}</h2>
      {personalAllowances?.length > 0 && (
        <dl className='govuk-summary-list'>
          {personalAllowances.map((allowance, index) => (
            <div
              className='govuk-summary-list__row '
              key={generateKey(allowance?.Content[0]?.pyKeyString, index)}
            >
              <dt className='govuk-summary-list__key govuk-!-font-weight-regular govuk-!-width-one-half'>
                {getHeadingContent(allowance?.Content, currentLang)?.Name}
              </dt>
              <dd className='govuk-summary-list__value text-align-tax-free-amount'>
                {formatCurrency(allowance?.AdjustedAmount, true)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {allowances?.length > 0 && (
        <>
          <h2 className='govuk-heading-s'>{t('WHAT_INCREASE_YOUR_TAX_FREE_AMOUNT')}</h2>
          <dl className='govuk-summary-list'>
            {allowances.map((allowance, index) => (
              <div
                className='govuk-summary-list__row '
                key={generateKey(allowance?.Content[0]?.pyKeyString, index)}
              >
                <dt className='govuk-summary-list__key govuk-!-font-weight-regular govuk-!-width-one-half'>
                  {getHeadingContent(allowance?.Content, currentLang)?.Name}
                </dt>
                <dd className='govuk-summary-list__value text-align-tax-free-amount'>
                  {formatCurrency(allowance?.AdjustedAmount, true)}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}

      {deductions?.length > 0 && (
        <>
          <h2 className='govuk-heading-s'>{t('WHAT_DECREASE_YOUR_TAX_FREE_AMOUNT')}</h2>
          <dl className='govuk-summary-list'>
            {deductions.map((deduction, index) => (
              <div
                className='govuk-summary-list__row'
                key={generateKey(deduction?.Content[0]?.pyKeyString, index)}
              >
                <dt className='govuk-summary-list__key govuk-!-font-weight-regular govuk-!-width-one-half'>
                  {deduction?.TESLinks ? (
                    <a
                      href='#'
                      className='govuk-link'
                      onClick={e => {
                        e.preventDefault();
                        handleLinkClick(deduction?.TESLinks?.[0]?.Content?.[0]?.pyURLContent);
                      }}
                    >
                      {getTESLinksOnLang(deduction, currentLang)?.[0]?.Name}
                    </a>
                  ) : (
                    getHeadingContent(deduction?.Content, currentLang)?.Name
                  )}
                </dt>
                <dd className='govuk-summary-list__value text-align-tax-free-amount'>
                  {formatCurrency(deduction?.AdjustedAmount, true)}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </>
  );
};

export default TaxFreeAmountDetails;
