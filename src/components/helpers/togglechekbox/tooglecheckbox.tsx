import React from 'react';
import PropTypes from 'prop-types';
import { makeItemId, makeHintId } from '../../BaseComponents/FormGroup/FormGroup';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';

export default function ToggleCheckbox({
  hiddentext,
  item,
  index,
  name,
  inputProps = {},
  onChange
}) {
  const hiddenText = hiddentext || '';
  const itemClasses = 'govuk-checkboxes__item';
  const checkboxItemClasses = 'govuk-checkboxes__input';
  const hintTextClasses = `govuk-hint govuk-checkboxes__hint`;
  const labelClasses = `govuk-label govuk-checkboxes__label`;
  const describedbyIds = `${item.hintText ? makeHintId(name) : ''}`.trim();
  if (item.hintText) {
    inputProps['aria-describedby'] = describedbyIds;
  }

  return (
    <div className='govuk-checkboxes govuk-checkboxes--small' data-module='govuk-checkboxes'>
      <div className={itemClasses} key={makeItemId(index, name)}>
        <input
          data-hiddentext={hiddenText}
          className={checkboxItemClasses}
          {...inputProps}
          id={makeItemId(index, name)}
          name={name}
          type='checkbox'
          value={item.checked}
          onChange={!item.readOnly ? onChange : () => {}}
          checked={item.checked}
        />
        <label className={labelClasses} htmlFor={makeItemId(index, name)}>
          {item.label}
        </label>
        {item.hintText ? (
          <div id={makeItemId(index, `${name}-item-hint`)} className={hintTextClasses}>
            <HintTextComponent htmlString={item.hintText} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

ToggleCheckbox.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  checked: PropTypes.bool.isRequired,
  name: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  hiddentext: PropTypes.string
};
