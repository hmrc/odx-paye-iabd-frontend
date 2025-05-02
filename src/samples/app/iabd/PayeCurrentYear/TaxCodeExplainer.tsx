import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, generateKey, getTaxCode } from '../../../../components/helpers/utils';
import ExplainerComponent from './ExplainerComponent';

interface TaxCodeExplainerProps {
  taxCode: string[];
  netCodedAllowance: string;
  isActivePension: boolean;
  issuedTaxCode: string;
}

const TaxCodeExplainer = ({ taxCode, netCodedAllowance, isActivePension, issuedTaxCode }: TaxCodeExplainerProps) => {
  const { t } = useTranslation();

  return (
    <details className='govuk-details'>
      <summary className='govuk-details__summary'>
        <span className='govuk-details__summary-text'>{`${t('WHAT')} ${getTaxCode(issuedTaxCode)} ${t('MEANS')}`}</span>
      </summary>
      <div className='govuk-details__text'>
        {taxCode?.length > 0
          ? taxCode.map((code, index) => (
              <ExplainerComponent
                code={code}
                key={generateKey(code, index)}
                netCodedAllowance={netCodedAllowance}
                isActivePension={isActivePension}
              />
            ))
          : `${t('YOUR_TAX_FREE_AMOUNT_FOR_THIS_EMPLOYMENT')} ${formatCurrency(netCodedAllowance, true)}.`}
      </div>
    </details>
  );
};

export default TaxCodeExplainer;
