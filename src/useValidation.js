import React from 'react';
import produce from 'immer';

const validationReducer = produce((draft, action) => {
    let hasError = false;

    switch (action.type) {
        case 'VALIDATE':
            action.toValidate.forEach(({
                fieldName, value, dynamicCompare,
            }) => {
                let fieldError;
                if (dynamicCompare || dynamicCompare === 0) {
                    fieldError = !draft[fieldName].validate(dynamicCompare)(value);
                } else {
                    fieldError = !draft[fieldName].validate(value);
                }
                draft[fieldName].hasError = fieldError;
                if (fieldError) {
                    draft[fieldName].outputMessage =
                        typeof draft[fieldName].errorMessage === 'function'
                            ? draft[fieldName].errorMessage(value)
                            : draft[fieldName].errorMessage;
                } else {
                    draft[fieldName].outputMessage = undefined;
                }
                hasError = hasError || fieldError;
                draft.hasError = hasError;
            });
            return draft;
        default:
            return draft;
    }
});

// init function to register all fields to the reducer
const init = fields =>
    fields.reduce(
        (acc, { fieldName, ...field }) => ({
            [fieldName]: { ...field },
            ...acc,
        }),
        {},
    );

/**
 * Custom hook for validation
 * Expects and array of fields with fieldName, errorMessage and validator function
 * Returns an array of functions to get error message, validate field and get any validation error
 */
const useValidation = (fields) => {
    const [state, dispatch] = React.useReducer(validationReducer, fields, init);

    const getFieldErrorMessage = ({ fieldName }) => state[fieldName].outputMessage;

    const getAllErrorMessages = () =>
        fields.map(({ fieldName }) => state[fieldName].outputMessage).filter(item => item);

    const hasValidationError = () => state.hasError;

    const validateFields = toValidate =>
        dispatch({
            type: 'VALIDATE',
            toValidate,
        });

    return [getFieldErrorMessage, validateFields, hasValidationError, getAllErrorMessages];
};

export default useValidation;