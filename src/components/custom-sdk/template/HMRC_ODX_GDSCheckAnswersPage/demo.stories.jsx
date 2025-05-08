import { useState } from 'react';

import { withKnobs } from '@storybook/addon-knobs';

import HmrcOdxGdsCheckAnswersPage from './index';
import { DateInput, Input, FieldValueList, Text } from '@pega/cosmos-react-core';
import { PhoneInput as CosmosPhone } from '@pega/cosmos-react-core';
import { pyReviewRaw, regionChildrenResolved } from './mock';

export default {
  title: 'HmrcOdxGdsCheckAnswersPage',
  decorators: [withKnobs],
  component: HmrcOdxGdsCheckAnswersPage
};

const renderField = (resolvedProps, inputValue, setInputValue, phoneValue, setPhoneValue) => {
  const { displayMode, value = '', label = '', key } = resolvedProps;

  const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';

  let val =
    value !== '' ? (
      <Text
        variant='h1'
        as='span'
        key={key}
        onChange={e => {
          setInputValue(e.target.value);
        }}
      >
        {inputValue}
      </Text>
    ) : (
      ''
    );

  if (label === 'Service Date')
    val = (
      <DateInput
        value={inputValue}
        style={{ fontSize: '14px' }}
        key={key}
        onChange={dateValue => {
          const { valueAsISOString: date } = dateValue;
          const trimmedDate = date ? date.substring(0, date.indexOf('T')) : date;
          setInputValue(trimmedDate);
        }}
      ></DateInput>
    );

  if (label === 'Phone Number')
    val = (
      <CosmosPhone
        value={phoneValue}
        style={{ fontSize: '14px' }}
        key={key}
        onChange={phoneVal => {
          setPhoneValue(phoneVal);
        }}
      ></CosmosPhone>
    );

  return <FieldValueList variant={variant} fields={[{ name: label, value: val }]} key={key} />;
};

export const BaseHmrcOdxGdsCheckAnswersPage = () => {
  if (!window.PCore) {
    window.PCore = {};
  }

  window.PCore.getErrorHandler = () => {
    return {
      getGenericFailedMessage() {
        /* nothing */
      }
    };
  };

  window.PCore.getConstants = () => {
    return {
      CASE_INFO: {
        INSTRUCTIONS: ''
      }
    };
  };

  window.PCore.getPubSubUtils = () => {
    return {
      subscribe: (event, callback, context) => {
        callback();
      },
      unsubscribe: (event, callback, context) => {}
    };
  };

  const [firstName, setFirstName] = useState('John');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('Joe');
  const [phone, setPhone] = useState('+16397975093');
  const [suffix, setSuffix] = useState('');
  const [email, setEmail] = useState('john@doe.com');
  const [inputValue, setInputValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('+16397975093');

  const props = {
    NumCols: '1',
    template: 'DefaultForm',

    getPConnect: () => {
      return {
        getChildren: () => {
          return [
            {
              getPConnect: () => {
                return {
                  getChildren: () => {
                    return [
                      {
                        readOnly: undefined,
                        placeholder: 'First Name',
                        value: firstName,
                        label: 'First Name',
                        hasSuggestions: false,
                        onChange: val => {
                          setFirstName(val.target.value);
                        },
                        getPConnect: () => {
                          return {
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
                            getStateProps: () => {
                              return { value: '.firstname' };
                            },
                            getRawMetadata: () => {
                              return {
                                type: 'reference',
                                config: {
                                  name: 'CheckYourAnswersWrapper',
                                  inheritedProps: [
                                    {
                                      prop: 'label',
                                      value: '@L CheckYourAnswersWrapper'
                                    },
                                    {
                                      prop: 'showLabel',
                                      value: false
                                    }
                                  ],
                                  ruleClass: 'HMRC-PAYE-Work-IABD-MissingEmp',
                                  type: 'view'
                                }
                              };
                            }
                          };
                        },
                        key: 'firstName'
                      },
                      {
                        readOnly: undefined,
                        placeholder: 'Middle Name',
                        value: middleName,
                        label: 'Middle Name',
                        hasSuggestions: false,
                        onChange: val => {
                          setMiddleName(val.target.value);
                        },
                        getPConnect: () => {
                          return {
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
                            getStateProps: () => {
                              return { value: '.middlename' };
                            },
                            getRawMetadata: () => {
                              return {
                                type: 'reference',
                                config: {
                                  name: 'CheckYourAnswersWrapper',
                                  inheritedProps: [
                                    {
                                      prop: 'label',
                                      value: '@L CheckYourAnswersWrapper'
                                    },
                                    {
                                      prop: 'showLabel',
                                      value: false
                                    }
                                  ],
                                  ruleClass: 'HMRC-PAYE-Work-IABD-MissingEmp',
                                  type: 'view'
                                }
                              };
                            }
                          };
                        },
                        key: 'middleName'
                      },

                      {
                        value: lastName,
                        label: 'Last Name',
                        required: true,
                        placeholder: 'Last Name',
                        testId: '77587239BF4C54EA493C7033E1DBF636',
                        hasSuggestions: false,
                        onChange: val => {
                          setLastName(val.target.value);
                        },
                        getPConnect: () => {
                          return {
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
                            getStateProps: () => {
                              return { value: '.lastname' };
                            },
                            getRawMetadata: () => {
                              return {
                                type: 'reference',
                                config: {
                                  name: 'CheckYourAnswersWrapper',
                                  inheritedProps: [
                                    {
                                      prop: 'label',
                                      value: '@L CheckYourAnswersWrapper'
                                    },
                                    {
                                      prop: 'showLabel',
                                      value: false
                                    }
                                  ],
                                  ruleClass: 'HMRC-PAYE-Work-IABD-MissingEmp',
                                  type: 'view'
                                }
                              };
                            }
                          };
                        },
                        key: 'lastName'
                      },

                      {
                        readOnly: undefined,
                        value: phone,
                        label: 'Phone Number',
                        datasource: {
                          fields: {
                            value: undefined
                          },
                          source: [
                            {
                              value: '+1'
                            },
                            {
                              value: '+91'
                            },
                            {
                              value: '+48'
                            },
                            {
                              value: '+44'
                            }
                          ]
                        },
                        getPConnect: () => {
                          return {
                            getContextName: () => {
                              return null;
                            },
                            getDataObject: () => {
                              return null;
                            },
                            getActionsApi: () => {
                              return {
                                updateFieldValue: (propName, value) => {
                                  setSuffix(value);
                                },
                                triggerFieldChange: () => {
                                  /* nothing */
                                }
                              };
                            },
                            getStateProps: () => {
                              return {
                                value: ''
                              };
                            },
                            getRawMetadata: () => {
                              return {
                                type: 'reference',
                                config: {
                                  name: 'CheckYourAnswersWrapper',
                                  inheritedProps: [
                                    {
                                      prop: 'label',
                                      value: '@L CheckYourAnswersWrapper'
                                    },
                                    {
                                      prop: 'showLabel',
                                      value: false
                                    }
                                  ],
                                  ruleClass: 'HMRC-PAYE-Work-IABD-MissingEmp',
                                  type: 'view'
                                }
                              };
                            }
                          };
                        },
                        hasSuggestions: false,
                        onChange: val => {
                          setPhone(val.value);
                        },
                        onBlur: () => {
                          /* nothing */
                        },
                        key: 'phoneNumber'
                      },

                      {
                        value: suffix,
                        label: 'Suffix',
                        placeholder: 'Select...',
                        listType: 'associated',
                        datasource: [
                          {
                            key: 'Sr',
                            value: 'Sr'
                          },
                          {
                            key: 'Jr',
                            value: 'Jr'
                          },
                          {
                            key: 'III',
                            value: 'III'
                          },
                          {
                            key: 'IV',
                            value: 'IV'
                          },
                          {
                            key: 'V',
                            value: 'V'
                          }
                        ],
                        testId: '56E6DDD1CB6CEC596B433440DFB21C17',
                        hasSuggestions: false,
                        deferDatasource: false,
                        getPConnect: () => {
                          return {
                            getContextName: () => {
                              return null;
                            },
                            getDataObject: () => {
                              return null;
                            },
                            getActionsApi: () => {
                              return {
                                updateFieldValue: (propName, value) => {
                                  setSuffix(value);
                                },
                                triggerFieldChange: () => {
                                  /* nothing */
                                }
                              };
                            },
                            getStateProps: () => {
                              return {
                                value: ''
                              };
                            },
                            getRawMetadata: () => {
                              return {
                                type: 'reference',
                                config: {
                                  name: 'CheckYourAnswersWrapper',
                                  inheritedProps: [
                                    {
                                      prop: 'label',
                                      value: '@L CheckYourAnswersWrapper'
                                    },
                                    {
                                      prop: 'showLabel',
                                      value: false
                                    }
                                  ],
                                  ruleClass: 'HMRC-PAYE-Work-IABD-MissingEmp',
                                  type: 'view'
                                }
                              };
                            }
                          };
                        },
                        onChange: val => {
                          setSuffix(val.target.value);
                        },
                        key: 'suffix'
                      },

                      {
                        value: email,
                        label: 'Email',
                        required: true,
                        testId: 'CE8AE9DA5B7CD6C3DF2929543A9AF92D',
                        hasSuggestions: false,
                        getPConnect: () => {
                          return {
                            getContextName: () => {
                              return null;
                            },
                            getDataObject: () => {
                              return null;
                            },
                            getActionsApi: () => {
                              return {
                                updateFieldValue: (propName, value) => {
                                  setSuffix(value);
                                },
                                triggerFieldChange: () => {
                                  /* nothing */
                                }
                              };
                            },
                            getStateProps: () => {
                              return {
                                value: ''
                              };
                            },
                            getRawMetadata: () => {
                              return {
                                type: 'reference',
                                config: {
                                  name: 'CheckYourAnswersWrapper',
                                  inheritedProps: [
                                    {
                                      prop: 'label',
                                      value: '@L CheckYourAnswersWrapper'
                                    },
                                    {
                                      prop: 'showLabel',
                                      value: false
                                    }
                                  ],
                                  ruleClass: 'HMRC-PAYE-Work-IABD-MissingEmp',
                                  type: 'view'
                                }
                              };
                            }
                          };
                        },
                        onChange: val => {
                          setEmail(val.target.value);
                        },
                        key: 'email'
                      }
                    ];
                  }
                };
              }
            }
          ];
        },
        getValue: val => {
          return val;
        },
        getCurrentView: () => {
          return '';
        },
        getCurrentClassID: () => {
          return '';
        },
        createComponent: config => {
          // eslint-disable-next-line default-case
          switch (config.config.value) {
            case '@P .FirstName':
              return renderField(regionChildrenResolved[0]);
            case '@P .MiddleName':
              return renderField(regionChildrenResolved[1]);
            case '@P .LastName':
              return renderField(regionChildrenResolved[2]);
            case '@P .Email':
              return renderField(regionChildrenResolved[3]);
            case '@P .PhoneNumber':
              return renderField(regionChildrenResolved[4]);
            case '@P .ServiceDate':
              return renderField(regionChildrenResolved[5]);
          }
        },
        getContextName: () => {
          return 'HmrcOdxGdsCheckAnswersPage';
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {},
            triggerFieldChange: () => {
              /* nothing */
            }
          };
        }
      };
    },
    createComponent: config => {
      return renderField(config, inputValue, setInputValue, phoneValue, setPhoneValue);
    }
  };

  return <HmrcOdxGdsCheckAnswersPage {...props} />;
};
