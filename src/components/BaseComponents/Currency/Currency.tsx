import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import AutoNumeric from 'autonumeric';
import { ErrorMsgContext } from '../../helpers/HMRCAppContext';
import { checkErrorMsgs } from '../../helpers/utils';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';
import { makeErrorId, makeHintId } from '../FormGroup/FormGroup';
import { t } from 'i18next';

const CurrencyTextField = props => {
  const {
    currencySymbol,
    inputProps = {},
    label,
    value,
    onChange,
    required,
    disabled,
    helperText,
    onBlur,
    errorText,
    name,
    id
  } = props;
  const inputRef = useRef(null);
  const { errorMsgs } = useContext(ErrorMsgContext);
  const [errMessage, setErrorMessage] = useState(errorText);

  useEffect(() => {
    if (errMessage === '') {
      setErrorMessage(errorText);
    }
  }, [errorText]);

  useEffect(() => {
    const found = checkErrorMsgs(errorMsgs);

    if (!found) {
      setErrorMessage(errorText);
    }
  }, [errorText, errorMsgs]);

  const keyHandler = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleChange = event => {
    const newValue = event.target.value;
    onChange(event, newValue);
  };
  const handleBlur = event => {
    const newValue = event.target.value;
    onBlur(event, newValue);
  };

  useEffect(() => {
    inputRef.current.value = value;
    value.toString();
  }, [value]);

  // Construct the aria-describedby value
  const describedbyIds =
    `${helperText ? makeHintId(name) : ''} ${errorText ? makeErrorId(name) : ''}`.trim();

  if (describedbyIds.length !== 0) {
    inputProps['aria-describedby'] = describedbyIds;
  }

  const formGroupDivClasses =
    `govuk-form-group ${errMessage ? 'govuk-form-group--error' : ''}`.trim();
  // const formName = errMessage ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group';
  const inputName = errMessage
    ? 'govuk-input govuk-input--width-10 govuk-input--error'
    : 'govuk-input govuk-input--width-10';
  return (
    <div className={formGroupDivClasses}>
      <div className='govuk-label-wrapper'>
        <label className='govuk-label govuk-label--m' htmlFor={id}>
          {label}
        </label>
        {helperText && (
          <div id={makeHintId(name)} className='govuk-hint'>
            <HintTextComponent htmlString={helperText} />
          </div>
        )}
      </div>
      <div>
        {errMessage && (
          <p id={makeErrorId(name)} className='govuk-error-message'>
            <span className='govuk-visually-hidden'>{t('ERROR')}:</span> {errMessage}
          </p>
        )}
      </div>
      <div className='govuk-input__wrapper'>
        <div className='govuk-input__prefix' aria-hidden='true'>
          {currencySymbol}
        </div>
        <input
          ref={inputRef}
          className={inputName}
          id={id}
          name={name}
          type='text'
          spellCheck='false'
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={keyHandler}
          required={required}
          disabled={disabled}
          {...inputProps}
        />
      </div>
    </div>
  );
};

CurrencyTextField.propTypes = {
  type: PropTypes.oneOf(['text', 'tel', 'hidden']),
  variant: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  textAlign: PropTypes.oneOf(['right', 'left', 'center']),
  tabIndex: PropTypes.number,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  currencySymbol: PropTypes.string,
  decimalCharacter: PropTypes.string,
  decimalCharacterAlternative: PropTypes.string,
  decimalPlaces: PropTypes.number,
  decimalPlacesShownOnBlur: PropTypes.number,
  decimalPlacesShownOnFocus: PropTypes.number,
  digitGroupSeparator: PropTypes.string,
  // leadingZero: PropTypes.oneOf(['allow', 'deny', 'keep']),
  maximumValue: PropTypes.string,
  minimumValue: PropTypes.string,
  negativePositiveSignPlacement: PropTypes.oneOf(['l', 'r', 'p', 's']),
  negativeSignCharacter: PropTypes.string,
  outputFormat: PropTypes.oneOf(['string', 'number']),
  selectOnFocus: PropTypes.bool,
  positiveSignCharacter: PropTypes.string,
  readOnly: PropTypes.bool,
  preDefined: PropTypes.object,
  helperText: PropTypes.any,
  required: PropTypes.any,
  errorText: PropTypes.string
};

CurrencyTextField.defaultProps = {
  type: 'text',
  variant: 'standard',
  currencySymbol: '£',
  outputFormat: 'number',
  textAlign: 'right',
  maximumValue: '10000000000000',
  minimumValue: '-10000000000000'
};

export default CurrencyTextField;
export const predefinedOptions = AutoNumeric.getPredefinedOptions();
