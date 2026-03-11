import React, { memo, useState, useEffect, ComponentType } from 'react';
import TEMPLATE_NAME_MAP from './constant/templateNameMap';

interface WhyItem {
  ReferenceID?: string;
  [key: string]: unknown; // allow dynamic DIG_* fields
}

interface Props {
  item: WhyItem;
  lang: string;
}

const RenderReactCategory: React.FC<Props> = ({ item, lang }) => {
  const templateName = item?.ReferenceID ? TEMPLATE_NAME_MAP[item.ReferenceID] : undefined;

  const [WhyTemplate, setWhyTemplate] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    if (!templateName) {
      setWhyTemplate(null);
      return;
    }

    import(`./categoryTypeReact/${templateName}`)
      .then(templateComponent => setWhyTemplate(() => templateComponent.default))
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log('Error loading template:', templateName, err);
        setWhyTemplate(null);
      });
  }, [templateName]);

  if (!WhyTemplate) return null;

  return <WhyTemplate {...item} lang={lang} />;
};

export default memo(RenderReactCategory);
