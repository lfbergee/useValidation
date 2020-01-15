/**
 * Creates object with expected shape for validation
 * @param {{fieldName: string, errorMessage: string, validate: function}}
 */
const createField = ({
    fieldName, errorMessage, validate, hasError = false,
}) => ({
    fieldName,
    errorMessage,
    validate,
    hasError,
});

export default createField;