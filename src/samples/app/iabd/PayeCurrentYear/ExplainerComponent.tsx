import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, getTaxCode } from '../../../../components/helpers/utils';

interface ExplainerComponentProps {
  code: string;
  netCodedAllowance: string;
  isActivePension: boolean;
}

const ExplainerComponent = ({ code, netCodedAllowance, isActivePension }: ExplainerComponentProps) => {
  const { t } = useTranslation();

  const getExplainerText = (taxCode: string): string => {
    switch (taxCode) {
      case 'S':
        return t('YOUR_INCOME_PENSION_TAXED_SCOTLAND_RATES');
      case 'C':
        return t('YOUR_INCOME_TAXED_WALES_RATES');
      case 'K':
        return t('YOUR_INCOME_NOT_TAXED_WORTH_MORE_THAN_TAX_FREE_ALLOWANCE');
      case 'L':
        return t('YOU_ENTITLED_STANDARD_TAX_FREE_PERSONAL_ALLOWANCE');
      case 'M':
        return t('MARRAIGE_ALLOWANCE_YOU_RECEIVED_TEN_PERCENT_PARTNER_PERSONAL_ALLOWANCE');
      case 'N':
        return t('MARRAIGE_ALLOWANCE_YOU_TRANSFERED_TEN_PERCENT_PARTNER_PERSONAL_ALLOWANCE');
      case 'T':
        return t('YOUR_TAX_CODE_INCLUDES_OTHER_CALCULATIONS_TO_WORK_OUT_ALLOWANCES');
      case 'Week1/Month1':
      case 'X':
        return `${t('YOUR_TAX_BASED_ON_PAY_PERIOD_NOT_WHOLE_YEAR')}${isActivePension ? t('YOUR_PENSION_COULD_SHOW_WEEK_MONTH_ONE') : t('YOUR_PAYSLIP_COULD_SHOW_WEEK_MONTH_ONE')}`;
      case '0T':
        return t('YOUR_PERSONAL_ALLOWANCE_HAS_BEEN_USED_UP');
      case 'S0T':
        return t('YOUR_SCOTLAND_PERSONAL_ALLOWANCE_USED_UP');
      case 'C0T':
        return t('YOUR_WALES_PERSONAL_ALLOWANCE_USED_UP');
      default:
        return `${t('YOUR_TAX_FREE_AMOUNT_FOR_THIS_EMPLOYMENT')} ${netCodedAllowance ? formatCurrency(netCodedAllowance, true) : ''}.`;
    }
  };

  return (
    <>
      <span className='govuk-body govuk-!-font-weight-bold'>{getTaxCode(code)}</span>
      <p className='govuk-body'>{getExplainerText(code)}</p>
    </>
  );
};

export default ExplainerComponent;
