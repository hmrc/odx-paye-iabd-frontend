import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ConditionalWrapper from '../../helpers/formatters/ConditionalWrapper';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';
import { DefaultFormContext, ErrorMsgContext } from '../../helpers/HMRCAppContext';
import { checkErrorMsgs } from '../../helpers/utils';
import InstructionTextComponent from '../../override-sdk/template/DefaultForm/InstructionTextComponent';
import { useTranslation } from 'react-i18next';

function makeHintId(identifier) {
  return `${identifier}-hint`;
}
function makeErrorId(identifier) {
  return `${identifier}-error`;
}
function makeItemId(index, identifier) {
  return `${identifier}${index > 0 ? `-${index}` : ''}`;
}

export default function FormGroup({
  labelIsHeading = false,
  label,
  errorText,
  hintText,
  name,
  id,
  fieldId,
  extraLabelClasses = '',
  children,
  testProps = {},
  useCharacterCount = false,
  parentManagedError = false
}) {
  const { instructionText } = useContext(DefaultFormContext);
  const { errorMsgs } = useContext(ErrorMsgContext);
  const [errMessage, setErrorMessage] = useState(errorText);
  const { t } = useTranslation();

  useEffect(() => {
    if (parentManagedError) return;

    const found = checkErrorMsgs(errorMsgs, id, name);

    if (found && !errorText) setErrorMessage(found?.message.message);

    if (!found || errorText) {
      setErrorMessage(errorText);
    }
  }, [errorText, errorMsgs]);

  useEffect(() => {
    const linkToRemove = document.getElementById('dynamic-back-link');
    if (linkToRemove) {
      linkToRemove.remove();
    }
  }, []);

  const formGroupDivClasses = `govuk-form-group ${errMessage ? 'govuk-form-group--error' : ''} ${
    useCharacterCount ? 'govuk-character-count' : ''
  }`.trim();

  const labelClasses =
    `govuk-label ${labelIsHeading ? 'govuk-label--l' : ''} ${extraLabelClasses}`.trim();

  const uniqueClasses = new Set(labelClasses.split(' '));
  if (uniqueClasses.has('govuk-label--l') && uniqueClasses.has('govuk-label--m')) {
    uniqueClasses.delete('govuk-label--m');
  }
  if (uniqueClasses.has('govuk-label--m') && uniqueClasses.has('govuk-date-input__label')) {
    uniqueClasses.delete('govuk-label--m');
  }

  const finalLabelClasses = Array.from(uniqueClasses).join(' ').trim();

  return (
    <div className={formGroupDivClasses} {...testProps}>
      <ConditionalWrapper
        condition={labelIsHeading}
        wrapper={child => <h1 className='govuk-label-wrapper'>{child}</h1>}
        childrenToWrap={
          <label className={finalLabelClasses} htmlFor={fieldId || name}>
            {t(label) !== label ? t(label) : label}
          </label>
        }
      />
      {instructionText && labelIsHeading && (
        <InstructionTextComponent instructionText={instructionText} />
      )}
      {hintText && (
        <div id={makeHintId(fieldId)} className='govuk-hint'>
          <HintTextComponent htmlString={t(hintText) !== hintText ? t(hintText) : hintText} />
        </div>
      )}
      {errMessage && (
        <p id={makeErrorId(fieldId)} className='govuk-error-message'>
          <span className='govuk-visually-hidden'>{t('ERROR')}:</span>
          {errMessage}
        </p>
      )}
      <div>{children}</div>
    </div>
  );
}

FormGroup.propTypes = {
  label: PropTypes.string,
  labelIsHeading: PropTypes.bool,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.node,
  extraLabelClasses: PropTypes.string,
  fieldId: PropTypes.string,
  id: PropTypes.string,
  useCharacterCount: PropTypes.bool,
  parentManagedError: PropTypes.bool
};

export { makeErrorId, makeHintId, makeItemId };
