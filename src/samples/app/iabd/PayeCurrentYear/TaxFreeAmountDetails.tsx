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
import { EventType, InteractionTracker } from 'hmrc-odx-features-and-functions';
import { callClientActionDataPage } from '../eventTrackingConfig';
import DeductionHintText from './TaxCodeDeduction/DeductionHintText';
import isKnownExplainerPage from './TaxCodeDeduction/DeductionUtils';

interface TaxFreeAmountDetailsProps {
  allowances: AllowanceObject[];
  personalAllowances: AllowanceObject[];
  deductions: AllowanceObject[];
  comingFrom: string;
  redirectToDeductionExplainerpage: (
    comingFrom: string,
    explainerPage: string,
    SourceAmount: string
  ) => void;
  handleLinkClick: (d: string) => void;
}

const TaxFreeAmountDetails = ({
  allowances,
  personalAllowances,
  deductions,
  handleLinkClick,
  comingFrom,
  redirectToDeductionExplainerpage
}: TaxFreeAmountDetailsProps) => {
  const currentLang = getCurrentLang();
  const { t } = useTranslation();

  const renderLink = deduction => {
    const tesLink: string = deduction?.TESLinks?.[0]?.Content?.[0]?.pyURLContent;
    const explainerPage = tesLink?.toLowerCase();
    const knownExplainerPage = isKnownExplainerPage(explainerPage) ? explainerPage : null;

    return (
      <>
        <p className='govuk-body'>
          <a
            href='#'
            className='govuk-link'
            onClick={e => {
              e.preventDefault();
              if (knownExplainerPage) {
                redirectToDeductionExplainerpage(
                  comingFrom,
                  explainerPage,
                  deduction?.SourceAmount
                );
              } else {
                const interactionTracker = new InteractionTracker({
                  url: null,
                  apiCallback: callClientActionDataPage
                });
                interactionTracker.logEvent(
                  EventType.Outbound,
                  `${getTESLinksOnLang(deduction, currentLang)?.[0]?.Name} ${tesLink}`,
                  {}
                );
                handleLinkClick(tesLink);
              }
            }}
          >
            {getTESLinksOnLang(deduction, currentLang)?.[0]?.Name}
          </a>
        </p>
        {knownExplainerPage && (
          <DeductionHintText explainerPage={explainerPage} deduction={deduction} />
        )}
      </>
    );
  };

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
          <h3 className='govuk-heading-s'>{t('WHAT_INCREASE_YOUR_TAX_FREE_AMOUNT')}</h3>
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
          <h3 className='govuk-heading-s'>{t('WHAT_DECREASE_YOUR_TAX_FREE_AMOUNT')}</h3>
          <dl className='govuk-summary-list'>
            {deductions.map((deduction, index) => (
              <div
                className='govuk-summary-list__row'
                key={generateKey(deduction?.Content[0]?.pyKeyString, index)}
              >
                <dt className='govuk-summary-list__key govuk-!-font-weight-regular govuk-!-width-one-half'>
                  {deduction?.TESLinks
                    ? renderLink(deduction)
                    : getHeadingContent(deduction?.Content, currentLang)?.Name}
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
