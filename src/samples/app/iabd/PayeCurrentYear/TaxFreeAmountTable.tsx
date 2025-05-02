import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, getTaxCode } from '../../../../components/helpers/utils';
import { TaxDetailObject } from './PayeCurrentYearTypes';

interface TaxFreeAmountDetailsProps {
  taxDetails: TaxDetailObject[];
}

const TaxFreeAmountTable = ({ taxDetails }: TaxFreeAmountDetailsProps) => {
  const { t } = useTranslation();
  const currentTaxDetails = taxDetails?.find(detail => detail?.pyNote?.toLowerCase() === 'now');
  const beforeTaxDetails = taxDetails?.find(detail => detail?.pyNote?.toLowerCase() === 'before');

  return (
    <table className='govuk-table govuk-!-margin-top-7'>
      <caption className='govuk-table__caption govuk-table__caption--m'>{t('CHANGES_TO_YOUR_TAX_CODE_AMOUNT')}</caption>
      <thead className='govuk-table__head'>
        <tr className='govuk-table__row'>
          <th scope='col' className='govuk-table__header'>
            {t('ITEM')}
          </th>
          <th scope='col' className='govuk-table__header'>
            {t('BEFORE_CHANGE')}
          </th>
          <th scope='col' className='govuk-table__header'>
            {t('NOW')}
          </th>
        </tr>
      </thead>
      <tbody className='govuk-table__body'>
        <tr className='govuk-table__row'>
          <th scope='row' className='govuk-table__header govuk-!-font-weight-regular'>
            {t('TAX_CODE')}
          </th>
          <td className='govuk-table__cell'>
            {beforeTaxDetails?.AssignedTaxCode ? getTaxCode(taxDetails?.[1]?.AssignedTaxCode) : t('NOT_APPLICABLE')}
          </td>
          <td className='govuk-table__cell'>{getTaxCode(currentTaxDetails?.AssignedTaxCode)}</td>
        </tr>
        <tr className='govuk-table__row'>
          <th scope='row' className='govuk-table__header govuk-!-font-weight-regular'>
            {t('TAX_FREE_AMOUNT')}
          </th>
          <td className='govuk-table__cell'>
            {beforeTaxDetails?.NetCodedAllowance ? formatCurrency(beforeTaxDetails?.NetCodedAllowance, true) : t('NOT_APPLICABLE')}
          </td>
          <td className='govuk-table__cell'>
            {currentTaxDetails?.NetCodedAllowance ? formatCurrency(currentTaxDetails?.NetCodedAllowance, true) : t('NOT_APPLICABLE')}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TaxFreeAmountTable;
