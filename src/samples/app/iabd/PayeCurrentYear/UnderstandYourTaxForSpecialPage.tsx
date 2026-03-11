import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import { formatTaxCode, scrollToTop } from '../../../../components/helpers/utils';
import { DetailsTypes } from './PayeCurrentYearTypes';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

interface UnderstandYourTaxForSpecialPageProps {
  understandYourTaxDetails: DetailsTypes;
  onBack: () => void;
  handleLinkClick: (d: string) => void;
}

const UnderstandYourTaxForSpecialPage = ({
  understandYourTaxDetails,
  onBack,
  handleLinkClick
}: UnderstandYourTaxForSpecialPageProps) => {
  const { t } = useTranslation();
  const { serviceShuttered, isLoading } = useServiceShuttered();

  const isActivePension: boolean = understandYourTaxDetails?.ActiveOccupationalPension;
  const assignedTaxCode: string = understandYourTaxDetails?.AssignedTaxCode;
  const taxCode: string = assignedTaxCode?.split(' ')?.[0];

  useEffect(() => {
    setPageTitle();
    scrollToTop();
  }, [i18next.language]);

  const renderUnderstandYourTaxCodeBody = () => {
    return (
      <>
        <p className='govuk-body'>
          {t(`SPECIAL_TAX.${taxCode}_${isActivePension ? 'PENSION' : 'EMPLOYER'}`)}
        </p>
        {taxCode?.toUpperCase() !== 'NT' && (
          <p className='govuk-body'>
            {t(`SPECIAL_TAX.WE_USE_THIS_CODE_${isActivePension ? 'PENSION' : 'EMPLOYER'}`)}
          </p>
        )}
        <p className='govuk-body govuk-!-margin-bottom-7'>
          <a
            className='govuk-link'
            href='#'
            onClick={e => {
              e.preventDefault();
              handleLinkClick('/check-income-tax/paye-income-tax-estimate');
            }}
          >
            {t('VIEW_INCOME_TAX_ESTIMATE')}
          </a>
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
              onBack();
            }}
            key='UnderstandYourTaxForSpecialBacklink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull
            title={`${t('YOUR_TAX_CODE_FOR', { lng: 'en' })} ${understandYourTaxDetails?.EmployerName} ${t('IS', { lng: 'en' })} ${formatTaxCode(assignedTaxCode)}`}
          >
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <h1 className='govuk-heading-l'>
                  {`${t('YOUR_TAX_CODE_FOR')} ${understandYourTaxDetails?.EmployerName} ${t('IS')} ${formatTaxCode(assignedTaxCode)}`}
                </h1>

                {renderUnderstandYourTaxCodeBody()}
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(UnderstandYourTaxForSpecialPage);
