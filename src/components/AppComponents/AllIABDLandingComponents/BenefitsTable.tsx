import React from 'react';
import { useTranslation } from 'react-i18next';
import { CurrentListOBJ } from '../../../samples/app/iabd/PayeCurrentYear/PayeCurrentYearTypes';
import {
  getEmploymentName,
  getContentOnLanguageSelection,
  getKey
} from '../../helpers/AllIABDLanding/AllIABDLandingUtils';
import { formatCurrency } from '../../helpers/utils';

interface BenefitsTableProps {
  handleLinkClick: (url: string) => void;
  displayList: CurrentListOBJ[];
}

const BenefitsTable: React.FC<BenefitsTableProps> = ({ handleLinkClick, displayList }) => {
  const { t } = useTranslation();

  if (!displayList?.length) {
    return (
      <>
        <h2 className='govuk-heading-l'>{t('BENEFITS')}</h2>
        <p className='govuk-body'>{t('NO_BENEFITS')}</p>
      </>
    );
  }

  return (
    <div className='scrollable-container'>
      <table className='govuk-table govuk-!-margin-top-9 govuk-table--small-text-until-tablet'>
        <caption className='govuk-table__caption govuk-table__caption--l'>{t('BENEFITS')}</caption>
        <thead className='govuk-table__head'>
          <tr className='govuk-table__row'>
            <th scope='col' className='govuk-table__header govuk-!-width-one-half'>
              {t('ITEM')}
            </th>
            <th scope='col' className='govuk-table__header '>
              {t('AMOUNT')}
            </th>
            <th scope='col' className='govuk-table__header'>
              {t('EMPLOYMENT')}
            </th>
            <th scope='col' className='govuk-table__header govuk-!-width-one-quarter'>
              {t('ACTIONS')}
            </th>
          </tr>
        </thead>
        <tbody className='govuk-table__body'>
          {displayList.map(benefit => (
            <tr className='govuk-table__row' key={getKey(benefit)}>
              <th scope='row' className='govuk-table__header item-name'>
                {getContentOnLanguageSelection(benefit?.Content)?.Name}
              </th>
              <td className='govuk-table__cell '>{formatCurrency(benefit?.Amount)}</td>
              <td className='govuk-table__cell'>{getEmploymentName(benefit?.EmploymentName)}</td>
              <td className='govuk-table__cell'>
                {benefit.TESLinks ? (
                  <a
                    className='govuk-link'
                    href='#'
                    onClick={e => {
                      e.preventDefault();
                      handleLinkClick(
                        getContentOnLanguageSelection(benefit?.TESLinks[0]?.Content)?.pyURLContent
                      );
                    }}
                  >
                    {getContentOnLanguageSelection(benefit?.TESLinks[0]?.Content)?.Name}
                    <span className='govuk-visually-hidden'>
                      {`${getContentOnLanguageSelection(benefit?.TESLinks[0]?.Content)?.Name} ${getContentOnLanguageSelection(benefit?.Content)?.Name}`}
                    </span>
                  </a>
                ) : (
                  t('NO_ACTIONS')
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BenefitsTable;
