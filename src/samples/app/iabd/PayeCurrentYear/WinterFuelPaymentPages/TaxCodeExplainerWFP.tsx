import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import setPageTitle from '../../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import LoadingWrapper from '../../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import { formatCurrency, scrollToTop } from '../../../../../components/helpers/utils';
import ShutteredServiceWrapper from '../../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';
import { Heading } from 'hmrc-gds-react-components';

interface TaxCodeExplainerWFPProps {
  taxCodeSourceAmount: string;
  redirectToUnderstandYourTaxPage: () => void;
  redirectToViewTimelineDetailsPage: () => void;
  comingFromPage: string;
  incomeThreshold: number;
  nextTaxStartYear: number;
}

const TaxCodeExplainerWFP = ({
  taxCodeSourceAmount: sourceAmount,
  redirectToUnderstandYourTaxPage,
  redirectToViewTimelineDetailsPage,
  comingFromPage,
  incomeThreshold,
  nextTaxStartYear
}: TaxCodeExplainerWFPProps) => {
  const { t } = useTranslation();
  const { serviceShuttered, isLoading } = useServiceShuttered();

  useEffect(() => {
    setPageTitle();
    scrollToTop();
  }, [i18next.language]);

  const renderWinterFuelPaymentBody = () => {
    return (
      <>
        <p className='govuk-body'>
          {t('YOU_AUTOMATICALLY_RECEIVED')} {formatCurrency(sourceAmount)}{' '}
          {t('PAYMENT_TO_HELP_WHC')}
        </p>
        <p className='govuk-body'>{t('THIS_IS_WFP_BRITAIN_PENSION_SCOTLAND')}</p>
        <p className='govuk-body'>{t('IT_PAID_BY_DWP')}</p>
        <p className='govuk-body'>
          {t('IF_INCOME_OVER')} {formatCurrency(incomeThreshold, true)}
          {t('YOU_NEED_PAY_THIS_TAX_CODE')}
        </p>
        <Heading headingLevel={2} className='govuk-heading-s'>
          {t('HOW_WE_COLLECT_PAYMENT')}
        </Heading>
        <p className='govuk-body'>{`${t('TO_COLLECT_OWE_ADJUSTED_YOUR_TAX_CODE')}`}</p>
        <p className='govuk-body'>{t('THIS_MEANS_YOU_WILL_PAY_MORE_TAX')}</p>
        <p className='govuk-body'>{t('YOU_DONT_CONTACT_SEPARATE_PAYEMENT')}</p>
        <Heading headingLevel={2} className='govuk-heading-s'>
          {t('HOW_THIS_WORKS')}
        </Heading>
        <p className='govuk-body'>{t('WE_ADJUSTED_ALLOWANCES_BY_LARGER_AMOUNT')}</p>
        <p className='govuk-body'>
          {t('YOU_REPAY_ADDITIONAL_TAX_COVER_MONEY')} {formatCurrency(sourceAmount)}{' '}
          {t('IN_TAX_OVER_COVER_MONEY_WFP')}
        </p>
        <Heading headingLevel={2} className='govuk-heading-s'>
          {t('EXAMPLE_WFP_TAX_CODE')}
        </Heading>
        <p className='govuk-body'>{t('IF_SOMENONE_GET_WFP_PA_WHP')}</p>
        <p className='govuk-body'>{t('TO_COLLECT_TAX_RATE')}</p>
        <ul className='govuk-list govuk-list--bullet'>
          <li>{t('WE_REDUCE_THEIR_TA')}</li>
          <li>{t('THIS_MEANS_THEIR_INCOME_IS_TAXED')}</li>
          <li>{t('THEY_WILL_PAY_TAX_OVER_YEAR')}</li>
        </ul>
        <Heading headingLevel={2} className='govuk-heading-s'>
          {t('WHEN_THIS_HAPPENS')}
        </Heading>
        <p className='govuk-body'>
          {t('WE_WILL_COLLECT_AMOUNT_DURING_NEXT_TAX_YEAR')} ({nextTaxStartYear} {t('TO')}{' '}
          {nextTaxStartYear + 1}) {t('THROUGH_PAY_PENSION')}
        </p>
        <p className='govuk-body'>{t('IT_MAY_BE_SHOWN_IN_YOUR_TAX_CODE')}</p>
        <h2 className='govuk-heading-s'>{t('IF_YOUR_INCOME_CHANGES')}</h2>
        <p className='govuk-body'>
          {t('IF_INCOME_FOR_TAX_YEAR_YOU_DO_NOT_OWE')} {formatCurrency(incomeThreshold, true)}{' '}
          {t('LESS_AND_DO_NOT_OWE')}
        </p>
        <p className='govuk-body'>{t('YOU_DO_NOT_NEED_TO_CONTACT_US')}</p>
      </>
    );
  };

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
              if (comingFromPage === 'UnderstandYourTaxCodePage') redirectToUnderstandYourTaxPage();
              else redirectToViewTimelineDetailsPage();
            }}
            key='TaxCodeExplainerWFPBackLink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull title={t('WINTER_FUEL_PAYMENT_CHARGE_HEADING', { lang: 'en' })}>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <h1 className='govuk-heading-l'>{t('WINTER_FUEL_PAYMENT_CHARGE_HEADING')}</h1>

                {renderWinterFuelPaymentBody()}
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(TaxCodeExplainerWFP);
