import { GOVUKFooter } from 'hmrc-gds-react-components';
import {
  FooterColumn,
  LicenceStatement
} from 'hmrc-gds-react-components/dist/Components/GOVUKFooter/GOVUKFooter.types';
import { useTranslation } from 'react-i18next';

export default function AppFooter() {
  const { t } = useTranslation();

  const licenceDeclaration: LicenceStatement = {
    linkHref: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
    textStart: t('FOOTER_LISCENSE_P1'),
    linkText: t('FOOTER_LISCENSE_LINK'),
    textEnd: t('FOOTER_LISCENSE_P2')
  };

  const footerContentLinks: FooterColumn = {
    links: [
      { linkHref: 'cookies', linkText: t('COOKIES') },
      { linkHref: 'accessibility', linkText: t('ACCESSIBILITY') },
      {
        linkHref:
          'https://www.gov.uk/government/publications/data-protection-act-dpa-information-hm-revenue-and-customs-hold-about-you',
        linkText: t('PRIVACY')
      },
      {
        linkHref: 'https://www.tax.service.gov.uk/help/terms-and-conditions',
        linkText: t('TERMS_CONDITIONS')
      },
      { linkHref: 'https://www.gov.uk/help', linkText: t('HELP') },
      {
        linkHref: 'https://www.gov.uk/government/organisations/hm-revenue-customs/contact',
        linkText: t('CONTACT')
      },
      { linkHref: 'https://www.gov.uk/cymraeg', linkText: t('CYMRAEG') }
    ]
  };

  return (
    <GOVUKFooter
      licenceDeclaration={licenceDeclaration}
      copyrightLinkText={t('COPYRIGHT')}
      opensInNewTabText={t('OPENS_IN_NEW_TAB')}
      supportLinksText={t('FOOTER_SUPPORT_LINKS')}
      brandRefresh
      footerContent={[footerContentLinks]}
    />
  );
}
