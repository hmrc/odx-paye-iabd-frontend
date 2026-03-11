import React, { useEffect } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import { scrollToTop } from '../../../../components/helpers/utils';

import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import DividendTax from './CatDPages/DividendTax';
import PersonalPensionPay from './CatDPages/PersonalPensionPay';
import BenefitKind from './CatDPages/BenefitKind';
import TotalGiftAid from './CatDPages/TotalGiftAid';
import BPATransferred from './CatDPages/BPATransferred';
import BPAReceived from './CatDPages/BPAReceived';
import NonCodedIncome from './CatDPages/NonCodedIncome';
import { useTranslation } from 'react-i18next';

interface DetailExplainerProps {
  componentName: string;
  redirectToViewTimelineDetailsPage: () => void;
}

const componentMap: Record<string, { Component: React.FC; titleKey: string }> = {
  DividendTax: { Component: DividendTax, titleKey: 'WHAT_IS_DIVIDEND_TAX' },
  PersonalPensionPay: {
    Component: PersonalPensionPay,
    titleKey: 'WHAT_ARE_PERSONAL_PENSION_PAYMENTS'
  },
  BenefitKind: { Component: BenefitKind, titleKey: 'WHAT_IS_BENEFIT_IN_KIND' },
  TotalGiftAid: { Component: TotalGiftAid, titleKey: 'WHAT_ARE_GIFT_AID_PAYMENTS' },
  NonCodedIncome: { Component: NonCodedIncome, titleKey: 'WHAT_IS_NON_CODED_INCOME' },
  BPATransferred: { Component: BPATransferred, titleKey: 'WHAT_IS_BPA_TRANSFERRED' },
  BPAReceived: { Component: BPAReceived, titleKey: 'WHAT_IS_BPA_RECEIVED' }
};

const DetailExplainer = ({
  componentName,
  redirectToViewTimelineDetailsPage
}: DetailExplainerProps) => {
  const { t } = useTranslation();
  const {serviceShuttered, isLoading} = useServiceShuttered();

  useEffect(() => {
    setPageTitle();
    scrollToTop();
  }, [i18next.language]);

  const { Component: SelectedComponent, titleKey } = componentMap[componentName] ?? {};

  return (
    <ShutteredServiceWrapper serviceIsShuttered={serviceShuttered}>
      <LoadingWrapper
            pageIsLoading={isLoading}
            spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
          >
        <>
          <Button
            variant='backlink'
            onClick={e => {
              e.preventDefault();
              redirectToViewTimelineDetailsPage();
            }}
            key='detailExplainerBacklink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull title={t(titleKey, { lng: 'en' })}>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <SelectedComponent />
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default DetailExplainer;
