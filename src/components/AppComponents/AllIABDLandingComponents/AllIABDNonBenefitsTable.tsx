import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import i18next from 'i18next';

import { formatCurrency } from '../../helpers/utils';
import {
  getContentOnLanguageSelection,
  getKey
} from '../../helpers/AllIABDLanding/AllIABDLandingUtils';
import { CurrentListOBJ } from '../../../samples/app/iabd/PayeCurrentYear/PayeCurrentYearTypes';

interface AllIABDLandingProps {
  nonBenefitList: CurrentListOBJ[];
  nonBenefitType: string;
  handleMoreInformationClick: (d: string) => void;
  handleLinkClick: (d: string) => void;
}

const AllIABDNonBenefitsTable = ({
  nonBenefitList,
  nonBenefitType,
  handleLinkClick,
  handleMoreInformationClick
}: AllIABDLandingProps) => {
  const { t } = useTranslation();
  const [benefitCaption, setBenefitCaption] = useState('');
  const [noBenefitInfo, setNoBenefitInfo] = useState('');
  const getNonBenefitCategory = nonBenefit => {
    switch (nonBenefit) {
      case 'incomes':
        setBenefitCaption(t('OTHER_INCOME'));
        setNoBenefitInfo(t('NO_INCOME_FROM_OTHER'));
        break;

      case 'allowances':
        setBenefitCaption(t('ALLOWANCES'));
        setNoBenefitInfo(t('NO_ALLOWANCES'));
        break;
      case 'deductions':
        setBenefitCaption(t('DEDUCTIONS'));
        setNoBenefitInfo(t('NO_DEDUCTIONS'));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getNonBenefitCategory(nonBenefitType);
  }, [nonBenefitType, i18next.language]);

  const renderLinks = linkObj => {
    const TesLinkContent = getContentOnLanguageSelection(linkObj?.TESLinks?.[0]?.Content);
    return linkObj?.TESLinks ? (
     <a
        className='govuk-link'
        href='#'
        data-tracking-type='Outbound'
  data-tracking-target={`${TesLinkContent?.Name} ${getContentOnLanguageSelection(linkObj?.Content)?.Name} ${TesLinkContent?.pyURLContent}`}
  onClick={e => {
    e.preventDefault();
    const url = TesLinkContent?.pyURLContent;

    if (url && url !== 'NA') {
      handleLinkClick(url);
    } else {
      handleMoreInformationClick('winterFuelPaymentIABDPage');
    }
  }}
>
  {TesLinkContent?.Name}
        <span className='govuk-visually-hidden'>
    {getContentOnLanguageSelection(linkObj?.Content)?.Name}
  </span>
</a>
    ) : (
      t('NO_ACTIONS')
    );
  };

  return nonBenefitList?.length > 0 ? (
    <table className='govuk-table govuk-!-margin-top-6'>
      <caption className='govuk-table__caption govuk-table__caption--l'>{benefitCaption}</caption>
      <thead className='govuk-table__head'>
        <tr className='govuk-table__row'>
          <th scope='col' className='govuk-table__header govuk-!-width-one-half'>
            {t('ITEM')}
          </th>
          <th scope='col' className='govuk-table__header '>
            {t('AMOUNT')}
          </th>
          <th scope='col' className='govuk-table__header govuk-!-width-one-quarter'>
            {t('ACTIONS')}
          </th>
        </tr>
      </thead>
      <tbody className='govuk-table__body'>
        {nonBenefitList.map(nonBenefit => (
          <tr className='govuk-table__row' key={getKey(nonBenefit)}>
            <th scope='row' className='govuk-table__header'>
              {getContentOnLanguageSelection(nonBenefit?.Content)?.Name}
            </th>
            <td className='govuk-table__cell '>{formatCurrency(nonBenefit?.Amount)}</td>
            <td className='govuk-table__cell'>{renderLinks(nonBenefit)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <>
      <h2 className='govuk-heading-l'>{benefitCaption}</h2>
      <p className='govuk-body'>{noBenefitInfo}</p>
    </>
  );
};

export default AllIABDNonBenefitsTable;
