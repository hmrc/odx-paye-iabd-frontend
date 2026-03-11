import React from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryD1Props {
  handleDetailExplainerLinkClick: (content: string) => void;
  dataType?: string;
}

export default function CategoryD1({ handleDetailExplainerLinkClick, dataType }: CategoryD1Props) {
  const { t } = useTranslation();
  const getDataTypelinkNameAndcomponentName = (
    dType?: string
  ): { linkName: string; componentName: string } => {
    // TODO: We will need to add the linkNames for 005, 007 when POs confirm on what should be the
    // proper content to be displayed for these data types.
    switch (dType) {
      case '129':
        return { linkName: t('WHAT_IS_DIVIDEND_TAX'), componentName: 'DividendTax' };
      case '005':
        return {
          linkName: '',
          componentName: 'PersonalPensionPay'
        };
      case '028':
        return { linkName: t('WHAT_IS_BENEFIT_IN_KIND'), componentName: 'BenefitKind' };
      case '007':
        return { linkName: '', componentName: 'TotalGiftAid' };
      case '019':
        return { linkName: t('WHAT_IS_NON_CODED_INCOME'), componentName: 'NonCodedIncome' };
      default:
        return { linkName: '', componentName: null };
    }
  };

  const { linkName, componentName } = getDataTypelinkNameAndcomponentName(dataType);

  return (
    <>
      <p className='govuk-body'>{t('IF_THIS_CHANGES_TAX_LIABLE_PAY')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
      {linkName && (
        <p className='govuk-body'>
          <a
            href='#'
            className='govuk-link'
            onClick={() => handleDetailExplainerLinkClick(componentName)}
          >
            {linkName}
          </a>
        </p>
      )}
    </>
  );
}
