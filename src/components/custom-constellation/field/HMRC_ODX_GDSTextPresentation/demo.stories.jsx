import { withKnobs } from '@storybook/addon-knobs';

import HmrcOdxGdsTextPresentation from './index';

import { stateProps, fieldMetadata, configProps } from './mock';

export default {
  title: 'HmrcOdxGdsTextPresentation',
  decorators: [withKnobs],
  component: HmrcOdxGdsTextPresentation
};

export const baseHmrcOdxGdsTextPresentation = () => {
  if (!window.PCore) {
    window.PCore = {};
  }

  window.PCore.getStoreValue = () => {
    return 'Open';
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

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,

    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            }
          };
        },
        ignoreSuggestion: () => {
          /* nothing */
        },
        acceptSuggestion: () => {
          /* nothing */
        },
        setInheritedProps: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        }
      };
    }
  };

  return <HmrcOdxGdsTextPresentation {...props} />;
};
