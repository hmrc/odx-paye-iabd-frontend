import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import { scrollToTop } from '../../../../components/helpers/utils';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

interface UntaxedSavingsInterestPageProps {
  redirectToUnderstandYourTaxPage: () => void;
  redirectToViewTimelineDetailsPage: () => void;
  comingFromPage: string;
}

const UntaxedSavingsInterestPage = ({
  redirectToUnderstandYourTaxPage,
  redirectToViewTimelineDetailsPage,
  comingFromPage
}: UntaxedSavingsInterestPageProps) => {
  const { t } = useTranslation();
  const { serviceShuttered, isLoading } = useServiceShuttered();
  const unTaxedSavingInterestHelpUrl = 'https://www.gov.uk/apply-tax-free-interest-on-savings';

  useEffect(() => {
    setPageTitle();
    scrollToTop();
  }, [i18next.language]);

  const renderUntaxedSavingsInterestBody = () => {
    return (
      <>
        <p className='govuk-body'>{t('UNTAXED_SAVINGS_INTEREST.DESCRIPTION_1')}</p>
        <p className='govuk-body'>{t('UNTAXED_SAVINGS_INTEREST.DESCRIPTION_2')}</p>

        <h2 className='govuk-heading-m'>{t('UNTAXED_SAVINGS_INTEREST.WHY_IN_TAX_CODE')}</h2>
        <p className='govuk-body'>{t('UNTAXED_SAVINGS_INTEREST.WHY_IN_TAX_CODE_DESCRIPTION')}</p>

        <h2 className='govuk-heading-m'>{t('UNTAXED_SAVINGS_INTEREST.SELF_ASSESSMENT')}</h2>
        <p className='govuk-body'>{t('UNTAXED_SAVINGS_INTEREST.INCLUDE_INTEREST_RECEIVED')}</p>

        <h2 className='govuk-heading-m'>{t('UNTAXED_SAVINGS_INTEREST.NO_SELF_ASSESSMENT')}</h2>
        <p className='govuk-body'>{t('UNTAXED_SAVINGS_INTEREST.UNTAXED_SAVINGS_INTEREST_CHECK')}</p>

        <h2 className='govuk-heading-m'>
          {t('UNTAXED_SAVINGS_INTEREST.PERSONAL_SAVINGS_ALLOWANCE')}
        </h2>
        <p className='govuk-body'>
          {t('UNTAXED_SAVINGS_INTEREST.PERSONAL_SAVINGS_ALLOWANCE_DESCRIPTION_1')}
        </p>
        <p className='govuk-body'>
          {t('UNTAXED_SAVINGS_INTEREST.PERSONAL_SAVINGS_ALLOWANCE_DESCRIPTION_2')}
        </p>
        <p className='govuk-body'>{t('UNTAXED_SAVINGS_INTEREST.ALLOWANCE_DETAILS')}</p>
        <ul className='govuk-list govuk-list--bullet'>
          <li>{t('UNTAXED_SAVINGS_INTEREST.ALLOWANCE_BASIC_RATE')}</li>
          <li>{t('UNTAXED_SAVINGS_INTEREST.ALLOWANCE_HIGHER_RATE')}</li>
          <li>{t('UNTAXED_SAVINGS_INTEREST.ALLOWANCE_ADDITIONAL_RATE')}</li>
        </ul>
        <p className='govuk-body'>{t('UNTAXED_SAVINGS_INTEREST.ALLOWANCE_TAX_CODE')}</p>

        <h2 className='govuk-heading-m'>{t('UNTAXED_SAVINGS_INTEREST.FIGURE_MISMATCH')}</h2>
        <p className='govuk-body'>{t('UNTAXED_SAVINGS_INTEREST.FIGURE_MISMATCH_DESCRIPTION')}</p>
        <ul className='govuk-list govuk-list--bullet'>
          <li>{t('UNTAXED_SAVINGS_INTEREST.MISMATCH_REASON_1')}</li>
          <li>{t('UNTAXED_SAVINGS_INTEREST.MISMATCH_REASON_2')}</li>
          <li>{t('UNTAXED_SAVINGS_INTEREST.MISMATCH_REASON_3')}</li>
          <li>{t('UNTAXED_SAVINGS_INTEREST.MISMATCH_REASON_4')}</li>
        </ul>

        <h2 className='govuk-heading-m'>{t('UNTAXED_SAVINGS_INTEREST.MORE_HELP')}</h2>
        <p className='govuk-body'>
          {t('UNTAXED_SAVINGS_INTEREST.MORE_HELP_DESCRIPTION')}{' '}
          <a
            href={unTaxedSavingInterestHelpUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='govuk-link'
            data-tracking-type='Outbound'
            data-tracking-target={`GOV.UK Tax on savings interest <${unTaxedSavingInterestHelpUrl}>`}
          >
            {t('UNTAXED_SAVINGS_INTEREST.MORE_HELP_LINK_TEXT')}
          </a>
          .
        </p>
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
            key='UntaxedSavingsInterestPageBacklink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull
            title={t('UNTAXED_SAVINGS_INTEREST.UNTAXED_SAVINGS_INTEREST_TITLE', { lang: 'en' })}
          >
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <h1 className='govuk-heading-l'>
                  {t('UNTAXED_SAVINGS_INTEREST.UNTAXED_SAVINGS_INTEREST_TITLE')}
                </h1>

                {renderUntaxedSavingsInterestBody()}
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(UntaxedSavingsInterestPage);
