import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import { formatCurrency, scrollToTop } from '../../../../components/helpers/utils';
import LoadingSpinner from '../../../../components/helpers/LoadingSpinner/LoadingSpinner';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

interface WinterFuelPaymentProps {
  redirectToAllIABDLandingPage: (d: string) => void;
  incomeThresholdForWinterFuelPayment: number;
}

const WinterFuelExplainerPage = ({
  redirectToAllIABDLandingPage,
  incomeThresholdForWinterFuelPayment
}: WinterFuelPaymentProps) => {
  const { t } = useTranslation();
  const { serviceShuttered, isLoading } = useServiceShuttered();

  useEffect(() => {
    setPageTitle();
    scrollToTop();
  }, [i18next.language]);

  return isLoading ? (
    <LoadingSpinner bottomText='Loading' size='30px' />
  ) : (
    <ShutteredServiceWrapper serviceIsShuttered={serviceShuttered}>

      <LoadingWrapper
        pageIsLoading={isLoading}
        spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
      >
        <>
          <Button
            variant="backlink"
            onClick={e => {
              e.preventDefault();
              redirectToAllIABDLandingPage('winterFuelPaymentIABDPage');
            }}
            key="UnderstandYourTaxCodeBacklink"
            attributes={{ type: 'link' }}
          />

          <MainWrapperFull
            title={`${t('WINTER_FUEL_PAYMENT_OR_PENSION_AGE_WINTER_HEATING_PAYMENT', { lng: 'en' })} `}
          >
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">
                <h1 className="govuk-heading-l">
                  {t('WINTER_FUEL_PAYMENT_OR_PENSION_AGE_WINTER_HEATING_PAYMENT')}
                </h1>

                <p className="govuk-body">
                  {t('THE_WINTER_FUEL_PAYMENT_IS_A_YEARLY_PAYMENT')}
                </p>

                <p className="govuk-body">
                  {t('IF_YOU_LIVE_IN_SCOTLAND')}
                </p>

                <p className="govuk-body">
                  {t('YOU_NORMALLY_DO_NOT_NEED_TO_APPLY')}
                </p>

                <p className="govuk-body">
                  {t('MOST_PEOPLE_GET_IT_AUTOMATICALLY')}
                </p>

                <p className="govuk-body">
                  <a
                    className="govuk-link"
                    href="https://www.gov.uk/winter-fuel-payment/eligibility"
                    target="_blank"
                    rel='noreferrer noopener'
                    data-tracking-type='Outbound'
                    data-tracking-target='More about Winter Fuel Payment </winter-fuel-payment/eligibility>'
                  >
                    {t('FIND_OUT_MORE')}
                  </a>
                </p>

                <h2 className="govuk-heading-m">
                  {t('HOW_IT_COULD_AFFECT_YOUR_TAX')}
                </h2>

                <p className="govuk-body">
                  {t('AFFECTS_TAX_CODE_NOT_INCOME')}
                </p>

                <p className="govuk-body">
                  {t('HOW_IT_AFFECTS_YOU')}
                </p>

                <h3 className="govuk-heading-s">
                  {t('IF_TOTAL_INCOME_IS_OR_LESS')} {formatCurrency(incomeThresholdForWinterFuelPayment, true)} {t('OR_Less')}
                </h3>

                <p className="govuk-body">
                  {t('NO_EFFECT_ON_TAX_PAID')}
                </p>

                <h3 className="govuk-heading-s">
                  {t('IF_TOTAL_INCOME_IS_OVER')} {formatCurrency(incomeThresholdForWinterFuelPayment, true)}
                </h3>

                <p className="govuk-body">
                  {t('PAY_BACK_PAYMENT')}
                </p>

                <p className="govuk-body">
                  {t('NO_NEED_TO_CONTACT')}
                </p>

                <h3 className="govuk-heading-s">
                  {t('IF_SELF_ASSESSMENT')}
                </h3>

                <p className="govuk-body">
                  {t('PAYE_SOURCE_NOTE')}
                </p>

                <p className="govuk-body">
                  {t('RECOVER_THROUGH_SELF_ASSESSMENT')}
                </p>

                <h3 className="govuk-heading-s">
                  {t('IF_YOU_LIVE_IN_SCOTLAND_REPEAT')}
                </h3>

                <p className="govuk-body">
                  {t('SAME_TAX_RULES_APPLY')}
                </p>
              </div>
            </div>
          </MainWrapperFull>

        </>
      </LoadingWrapper>

    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(WinterFuelExplainerPage);
