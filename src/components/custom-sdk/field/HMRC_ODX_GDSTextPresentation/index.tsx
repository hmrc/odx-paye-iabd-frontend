import React, { useContext } from 'react';
import { TextField } from '@material-ui/core';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyValue from '../../../BaseComponents/ReadOnlyValue/ReadOnlyValue';

import StyledHmrcOdxGdsTextPresentationWrapper from './styles';
import GDSCheckAnswers from '../../../BaseComponents/CheckAnswer';
import { ReadOnlyDefaultFormContext } from '../../../helpers/HMRCAppContext';
import { checkStatus } from '../../../helpers/utils';

interface HmrcOdxGdsTextPresentationProps extends PConnFieldProps {
  stepId: any;
  fieldMetadata?: any;
  GDSPresentationType;
  displayOrder?: any;
  name?: any;
  hiddenText?: any;
  ShowChangeLink?: Boolean;
}

export default function HmrcOdxGdsTextPresentation(props: HmrcOdxGdsTextPresentationProps) {
  const {
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    onChange,
    onBlur,
    stepId,
    readOnly = true,
    testId,
    name,
    fieldMetadata,
    helperText,
    placeholder,
    hiddenText,
    getPConnect,
    GDSPresentationType,
    ShowChangeLink
  } = props;
  const { hasBeenWrapped } = useContext(ReadOnlyDefaultFormContext);
  const helperTextToDisplay = validatemessage || helperText;

  const maxLength = fieldMetadata?.maxLength;

  const readOnlyProp = {};

  let label = props.label;
  const { isOnlyField, overrideLabel } = useIsOnlyField(props.displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  let testProp = {};
  testProp = {
    'data-test-id': testId
  };

  const formatNino = (val: string) => {
    return val
      .toUpperCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s/g, '')
      .replace(/(.{2})/g, '$1 ')
      .trim();
  };

  const formatFullTrim = (val: any) => {
    return val.replace(/\s+/g, '');
  };

  const formatPartTrim = (val: any) => {
    return val.replace(/\s{2,}/g, ' ').trim();
  };

  const formatTrimCaps = (val: any) => {
    return val.replace(/\s+/g, '').toUpperCase();
  };

  const formatCurrency2DP = (val: any) => {
    const number = parseFloat(val.toString().replace(/[^\d.-]/g, ''));
    const formattedNumber = number.toLocaleString('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${formattedNumber}`;
  };

  let formattedValue: any;

  switch (GDSPresentationType) {
    case 'fulltrim':
      formattedValue = formatFullTrim(value);
      break;
    case 'parttrim':
      formattedValue = formatPartTrim(value);
      break;
    case 'trimcaps':
      formattedValue = formatTrimCaps(value);
      break;
    case 'currency2dp':
      formattedValue = formatCurrency2DP(value);
      break;
    case 'nino':
      formattedValue = formatNino(value);
      break;
    default:
      formattedValue = formatFullTrim(value);
  }

  const inprogressStatus = checkStatus();

  if (hasBeenWrapped && stepId && ShowChangeLink && inprogressStatus === 'Open') {
    return (
      <GDSCheckAnswers
        label={label}
        value={formattedValue}
        name={name}
        stepId={stepId}
        hiddenText={hiddenText}
        getPConnect={getPConnect}
        placeholder={placeholder}
        helperText={helperText}
        validatemessage=''
        onChange={undefined}
        readOnly={false}
        testId=''
        hideLabel={false}
        required={false}
        disabled={false}
      />
    );
  }

  if (readOnly) {
    return <ReadOnlyValue label={label} value={formattedValue} />;
  }

  return (
    <StyledHmrcOdxGdsTextPresentationWrapper>
      <TextField
        fullWidth
        variant={readOnly ? 'standard' : 'outlined'}
        helperText={helperTextToDisplay}
        placeholder=''
        name=''
        size='small'
        required={required}
        disabled={disabled}
        onChange={onChange}
        onBlur={!readOnly ? onBlur : undefined}
        error={status === 'error'}
        label={label}
        value={formattedValue}
        InputProps={{ ...readOnlyProp, inputProps: { maxLength, ...testProp } }}
      />
    </StyledHmrcOdxGdsTextPresentationWrapper>
  );
}
