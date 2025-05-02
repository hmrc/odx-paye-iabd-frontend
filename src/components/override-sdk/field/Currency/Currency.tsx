import React, { useState, useEffect } from 'react';
import CurrencyTextField from '../../../BaseComponents/Currency/Currency';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import FieldValueList from '@pega/react-sdk-components/lib/components/designSystemExtension/FieldValueList';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';
import { getCurrencyCharacters, getCurrencyOptions } from './currency-utils';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// Using control from: https://github.com/unicef/material-ui-currency-textfield
interface CurrrencyProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Currency here
  currencyISOCode?: string;
  name: string;
}

export default function Currency(props: CurrrencyProps) {
  const {
    getPConnect,
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    readOnly,
    helperText,
    displayMode,
    hideLabel,
    currencyISOCode = 'USD',
    name
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const helperTextToDisplay = helperText;
  const [errorMessage, setErrorMessage] = useState(validatemessage);

  const fieldId = propName?.split('.')?.pop();
  const formattedPropertyName = name || fieldId;

  let variableCheck = false;

  const [currValue, setCurrValue] = useState(value.toString());
  const [theCurrSym, setCurrSym] = useState('$');
  const [theCurrDec, setCurrDec] = useState('.');
  const [theCurrSep, setCurrSep] = useState(',');

  useEffect(() => {
    const theSymbols = getCurrencyCharacters(currencyISOCode);
    setCurrSym(theSymbols.theCurrencySymbol);
    setCurrDec(theSymbols.theDecimalIndicator);
    setCurrSep(theSymbols.theDigitGroupSeparator);
  }, [currencyISOCode]);

  useEffect(() => {
    setCurrValue(currValue.toString());
  }, [value]);

  useEffect(() => {
    setErrorMessage(validatemessage);
  }, [validatemessage]);

  const theCurrencyOptions = getCurrencyOptions(currencyISOCode);
  const formattedValue = format(value, pConn.getComponentName().toLowerCase(), theCurrencyOptions);

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={formattedValue} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <FieldValueList name={hideLabel ? '' : label} value={formattedValue} variant='stacked' />
    );
  }

  function currOnChange() {
    variableCheck = true;
  }

  function currOnBlur(event, inValue) {
    if (variableCheck) {
      setCurrValue(event?.target?.value);
      handleEvent(actions, 'changeNblur', propName, inValue);
    }
  }

  return (
    <CurrencyTextField
      variant={readOnly ? 'standard' : 'outlined'}
      helperText={helperTextToDisplay}
      placeholder=''
      required={required}
      disabled={disabled}
      onChange={currOnChange}
      onBlur={!readOnly ? currOnBlur : undefined}
      label={label}
      value={currValue}
      type='text'
      outputFormat='number'
      textAlign='left'
      currencySymbol={theCurrSym}
      decimalCharacter={theCurrDec}
      digitGroupSeparator={theCurrSep}
      errorText={errorMessage}
      name={formattedPropertyName}
      id={fieldId}
    />
  );
}
