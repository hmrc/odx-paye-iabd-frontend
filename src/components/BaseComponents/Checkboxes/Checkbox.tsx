import React from 'react';
import PropTypes from 'prop-types';
import { makeItemId, makeHintId } from '../FormGroup/FormGroup';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';

export default function Checkbox({
  item,
  index,
  name,
  inputProps = {},
  onChange,
  onBlur,
  fieldId
}) {
  const itemClasses = 'govuk-checkboxes__item';
  const checkboxItemClasses = 'govuk-checkboxes__input';
  const hintTextClasses = 'govuk-hint govuk-checkboxes__hint';
  const labelClasses = 'govuk-label govuk-checkboxes__label';
  const itemId = makeItemId(index, fieldId).trim();
  // Generate IDs for hint text and error message (if any)
  const hintId = item.hintText ? makeHintId(name) : '';
  const errorId = item.errorMessage ? `${itemId}-error` : '';

  // Construct the aria-describedby value
  const describedbyIds = [hintId, errorId].filter(Boolean).join(' ');

  if (describedbyIds) {
    inputProps['aria-describedby'] = describedbyIds;
  }

  return (
    <div className={itemClasses} key={itemId}>
      <input
        className={checkboxItemClasses}
        {...inputProps}
        id={itemId}
        name={name}
        type='checkbox'
        value={item.checked}
        onChange={!item.readOnly ? onChange : () => {}}
        onBlur={!item.readOnly ? onBlur : () => {}}
        checked={item.checked}
      />
      <label className={labelClasses} htmlFor={itemId}>
        {item.label}
      </label>
      {item.hintText ? (
        <div id={makeHintId(name)} className={hintTextClasses}>
          <HintTextComponent htmlString={item.hintText} />
        </div>
      ) : null}
      {item.errorMessage ? (
        <div id={errorId} className='govuk-error-message'>
          {item.errorMessage}
        </div>
      ) : null}
    </div>
  );
}

Checkbox.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  fieldId: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};
