import React, { useEffect, useState } from 'react';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import { useTranslation } from 'react-i18next';

interface HmrcOdxTestProps extends PConnFieldProps {
  name?: string;
  stepId?: any;
  hiddenText?: string;
}
export default function GDSCheckAnswers(props: HmrcOdxTestProps) {
  const COMMA_DELIMITED_FIELD = 'CSV';
  const { label, value, name, stepId, hiddenText, getPConnect, placeholder, helperText } = props;
  const [formattedValue, setFormattedValue] = useState<string | string[]>(value ?? '');
  const pConn = getPConnect();
  const containerItemID = pConn.getContextName();
  const { t } = useTranslation();
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
  const handleOnClick = event => {
    event.preventDefault();
    const initialValue = '';
    const isImplicit = false;
    getPConnect().setValue('.NextStep', stepId, initialValue, isImplicit);
    getPConnect().getActionsApi().finishAssignment(containerItemID);
  };

  const isValueNotBlank =
    !!value && value !== ' ' && formattedValue !== 'Invalid Date' && value?.length > 0;

  const formattedValueOrValue = formattedValue || value;
  const placeholderOrHelperText = placeholder || helperText;
  const renderCYAValue = () =>
    !isValueNotBlank ? (
      <a href='#' className='govuk-link' onClick={handleOnClick} data-step-id={stepId}>
        {placeholderOrHelperText}
      </a>
    ) : (
      <>{formattedValueOrValue}</>
    );

  return (
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
      {isValueNotBlank && (
        <dd className='govuk-summary-list__actions'>
          <a href='#' className='govuk-link' onClick={handleOnClick} data-step-id={stepId}>
            {t('GDS_ACTION_CHANGE')}
            <span className='govuk-visually-hidden'> {hiddenText || label}</span>
          </a>
        </dd>
      )}
    </div>
  );
}
