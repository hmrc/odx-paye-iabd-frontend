import React, { useEffect, useState } from 'react';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface HmrcOdxTestProps extends PConnFieldProps {
  name?: string;
}

export default function GDSConstellationCheckAnswers(props: HmrcOdxTestProps) {
  const COMMA_DELIMITED_FIELD = 'CSV';
  const { label, value, name, placeholder, helperText } = props;
  const [formattedValue, setFormattedValue] = useState<string | string[]>(value ?? '');

  let isCSV = false;

  if (name && name.includes(COMMA_DELIMITED_FIELD) && value?.includes(',')) {
    isCSV = true;
  }

  useEffect(() => {
    if (name && name.includes(COMMA_DELIMITED_FIELD) && value?.includes(',')) {
      const formatValue = value.split(',').map((item: string) => item.trim());
      setFormattedValue(formatValue);
    }
  }, []);

  const isValueNotBlank =
    !!value && value !== ' ' && formattedValue !== 'Invalid Date' && value?.length > 0;

  const formattedValueOrValue = formattedValue || value;
  const placeholderOrHelperText = placeholder || helperText;
  const renderCYAValue = () =>
    !isValueNotBlank ? <>{placeholderOrHelperText} </> : <>{formattedValueOrValue}</>;

  return (
    <>
      <style>{`
        .govuk-summary-list__row {
          display: grid;
          grid-template-columns : minmax(14ch, 39ch) minmax(14ch, 1fr);
          gap : calc(0.5rem) calc(1rem);
          width : 100%;
        }

        .govuk-summary-list__key {
          max-width : max-content;
          word-break: break-word;
          font-size : max(1.125rem, 12px);
          font-weight : 600;
          color : rgba(0, 0, 0, 0.6);;
        }
      `}</style>

      <div className='govuk-summary-list__row'>
        <dt className='govuk-summary-list__key'>{label}</dt>
        <dd className='govuk-summary-list__value' data-is-csv={isCSV}>
          {isValueNotBlank && Array.isArray(formattedValue) ? (
            <>
              {formattedValue.map(item => (
                <React.Fragment key={item}>
                  {formattedValueOrValue}
                  <br />
                </React.Fragment>
              ))}
            </>
          ) : (
            renderCYAValue()
          )}
        </dd>
      </div>
    </>
  );
}
