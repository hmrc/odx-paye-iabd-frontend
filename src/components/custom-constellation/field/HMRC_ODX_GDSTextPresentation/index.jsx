import React from 'react';
import { TextField } from '@material-ui/core';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyValue from '../../../BaseComponents/ReadOnlyValue/ReadOnlyValue';

import StyledHmrcOdxGdsTextPresentationWrapper from './styles';
import GDSConstellationCheckAnswers from '../../../BaseComponents/CheckAnswer/constellationGDS.tsx';
import { checkStatus } from '../../../helpers/utils';

export default function HmrcOdxGdsTextPresentation(props) {
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
    GDSPresentationType
  } = props;

  const helperTextToDisplay = validatemessage || helperText;
  const maxLength = fieldMetadata?.maxLength;

  const readOnlyProp = {};

  let label = props.label;
  const { isOnlyField, overrideLabel } = useIsOnlyField(props.displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  const testProp = { 'data-test-id': testId };

  const formatNino = val => {
    return val
      .toUpperCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s/g, '')
      .replace(/(.{2})/g, '$1 ')
      .trim();
  };

  const formatFullTrim = val => {
    return val.replace(/\s+/g, '');
  };

  const formatPartTrim = val => {
    return val.replace(/\s{2,}/g, ' ').trim();
  };

  const formatTrimCaps = val => {
    return val.replace(/\s+/g, '').toUpperCase();
  };

  const formatCurrency2DP = val => {
    const number = parseFloat(val.toString().replace(/[^\d.-]/g, ''));
    const formattedNumber = number.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `£${formattedNumber}`;
  };

  let formattedValue;
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

  if (
    inprogressStatus.toUpperCase() === 'PENDING-INVESTIGATION' ||
    inprogressStatus.toUpperCase() === 'RESOLVED-COMPLETED' ||
    inprogressStatus.toUpperCase() === 'PENDING-TECH REVIEW'
  ) {
    return (
      <GDSConstellationCheckAnswers
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
