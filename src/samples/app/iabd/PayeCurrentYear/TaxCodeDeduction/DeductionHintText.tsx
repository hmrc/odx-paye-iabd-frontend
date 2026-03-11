import React from 'react';
import { useTranslation } from 'react-i18next';
import { AllowanceObject } from '../PayeCurrentYearTypes';
import { formatCurrency } from '../../../../../components/helpers/utils';

interface DeductionHintTextProps {
  explainerPage: string;
  deduction: AllowanceObject;
}

// TODO : This hint text file will be cleaned up in upcoming sprints as the hint text
// for deductions will be coming from pega and react will just plug in that.
const DeductionHintText = ({ explainerPage, deduction }: DeductionHintTextProps) => {
  const { t } = useTranslation();
  const hintTextMap = {
    untaxedsavingsinterest: (
      <p className='govuk-body'>
        {t('UNTAXED_SAVINGS_INTEREST.UNTAXED_SAVINGS_INTEREST_LINK_DESCRIPTION')}
      </p>
    ),
    winterfuelpaymentcharge: (
      <div className='govuk-hint'>
        {`${t('WE_ADJUSTED_ALLOWANCES')}  ${formatCurrency(
          deduction?.AdjustedAmount,
          true
        )} ${t('TO_COLLECT_YOUR')} ${formatCurrency(
          deduction?.SourceAmount
        )}${t('WINTER_FUEL_PAYMENT_CHARGE')}`}
      </div>
    )
  };
  return hintTextMap[explainerPage] || null;
};

export default DeductionHintText;
