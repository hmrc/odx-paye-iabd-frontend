import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../BaseComponents/MainWrapper';
import setPageTitle from '../../helpers/setPageTitleHelpers';

export default function ShutterServicePage() {
  const { t } = useTranslation();
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';

  useEffect(() => {
    const existingBackLinks = document.querySelectorAll('.govuk-back-link');
    existingBackLinks.forEach(link => link.remove());
    setPageTitle();
  }, [lang]);

  return (
    <MainWrapper title={t('SHUTTER_SERVICE_UNAVAILABLE', { lng: 'en' })}>
      <h1 className='govuk-heading-l'>{t('SHUTTER_SERVICE_UNAVAILABLE')}</h1>
      <p className='govuk-body'>{t('SHUTTER_USE_SERVICE_LATER_MESSAGE')}</p>
    </MainWrapper>
  );
}
