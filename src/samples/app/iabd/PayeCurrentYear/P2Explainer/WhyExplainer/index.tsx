import { useEffect, useState } from 'react';
import RenderReactCategory from './RenderReactCategory';
import { getCurrentLang } from '../../../../../../components/helpers/utils';

interface PegaContentItem {
  pyKeyString?: string;
  Description?: string | null;
  Language?: string;
}

export interface WhyExplainerItem {
  Category: 'Pega' | 'React';
  ReferenceID?: string;
  Content?: PegaContentItem[];
  [k: string]: any; // DIG_* and other dynamic fields for React side templates
}

interface Props {
  items: WhyExplainerItem[] | null;
  lang?: string;
}

const WhyExplainer: React.FC<Props> = ({ items }) => {
  const lang = getCurrentLang().toUpperCase();
  const [currentLang, setCurrentLang] = useState(lang);

  const itemList = items ?? [];

  useEffect(() => {
    PCore.getPubSubUtils().subscribe(
      'languageToggleTriggered',
      ({ language }) => {
        setCurrentLang(language.toUpperCase());
      },
      'languageToggleTriggered'
    );

    return () => {
      PCore.getPubSubUtils().unsubscribe('languageToggleTriggered', 'languageToggleTriggered');
    };
  }, []);

  const renderContent = (item: WhyExplainerItem): string | React.ReactNode | null => {
    if (!item) return null;

    if (item.Category === 'Pega') {
      const content = item.Content ?? [];
      const selectedContent = content.find(cont => cont.Language === currentLang);

      return selectedContent?.Description ?? null;
    }

    if (item.Category === 'React') {
      return <RenderReactCategory item={item} lang={currentLang} />;
    }

    return null;
  };

  if (itemList.length === 1) {
    const body = renderContent(itemList[0]);

    return body && <>{body}</>;
  }

  return (
    <ol className='govuk-list govuk-list--number govuk-list--spaced'>
      {itemList.map(item => {
        return <li key={item.ReferenceID}>{renderContent(item)}</li>;
      })}
    </ol>
  );
};

export default WhyExplainer;
