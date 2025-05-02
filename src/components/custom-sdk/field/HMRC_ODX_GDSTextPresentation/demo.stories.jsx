import { useState } from 'react';
import HmrcOdxGdsTextPresentation from './index';
import { withKnobs } from '@storybook/addon-knobs';
import { configProps, fieldMetadata } from './mock';

export default {
  title: 'HmrcOdxGdsTextPresentation',
  decorators: [withKnobs],
  component: HmrcOdxGdsTextPresentation
};

export const BaseHmrcOdxGdsTextPresentation = () => {
  if (!window.PCore) {
    window.PCore = {};
  }

  window.PCore.getStoreValue = () => {
    return true;
  };

  window.PCore.getConstants = () => {
    return {
      APP: {
        APP: 'HmrcOdxGdsTextPresentation'
      }
    };
  };

  window.PCore.getFormUtils = () => {
    return {
      getEditableFields: () => {
        return [
          { name: 'HmrcOdxGdsTextPresentation' }
        ];
      }
    };
  };

  window.PCore.getContainerUtils = () => {
    return {
      getActiveContainerItemName: () => {
        return 'HmrcOdxGdsTextPresentation';
      },
      getActiveContainerItemContext: () => {
        return 'HmrcOdxGdsTextPresentation';
      }
    };
  };

  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            updateFieldValue: (propName, theValue) => {
              setValue(theValue);
            }
          };
        },
        getStateProps: () => {
          return { value: '.name' };
        }
      };
    },
    onChange: event => {
      setValue(event.target.value);
    },
    onBlur: () => {
      return configProps.value;
    }
  };

  return <HmrcOdxGdsTextPresentation {...props} />;
};
