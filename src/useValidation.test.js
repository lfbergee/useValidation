import React, { useState } from 'react';
import useValidation from './useValidation';
import { shallow } from 'enzyme';
import { createField } from '.';
import InputGroup from '@sb1/ffe-form-react/lib/InputGroup';
import { Input } from '@sb1/ffe-form-react';

const Example = () => {
    const exampleField = createField({
        fieldName: 'example',
        errorMessage: 'Some useful error message',
        validate: value => value.length === 3,
    });

    const [inputValue, updateInputValue] = useState();
    const [getFieldErrorMessage, validateFields, hasValidationError, getAllFieldErrors] = useValidation([exampleField]);

    const onChange = (e) => {
        validateFields([{ fieldName: exampleField.fieldName, value: e.target.value }]);
        updateInputValue(e.target.value || '');
    };

    return (
        <>
            <InputGroup label="Example" fieldMessage={getFieldErrorMessage(exampleField)}>
                <Input id="input" name={exampleField.fieldName} val={inputValue} onChange={onChange} />
            </InputGroup>
            {hasValidationError() && <p id="hasError">{getFieldErrorMessage(exampleField)}</p>}
            {!!getFieldErrorMessage(exampleField) && <p id="hasErrorMessage">{getFieldErrorMessage(exampleField)}</p>}
            {hasValidationError() &&
                getAllFieldErrors().map(err => (
                    <p key={err} id="allErrors">
                        {err}
                    </p>
                ))}
        </>
    );
};

describe('useValidation example', () => {
    test('should not show error when valid input', () => {
        const wrapper = shallow(<Example />);
        wrapper.find('#input').simulate('change', { target: { value: 'abc' } });
        expect(wrapper.find('#hasError').length).toBe(0);
    });
    test('should show error when invalid input', () => {
        const wrapper = shallow(<Example />);
        wrapper.find('#input').simulate('change', { target: { value: 'a' } });
        expect(wrapper.find('#hasError').length).toBe(1);
    });
    test('should show correct error message in DOM when calling getFieldErrorMessage', () => {
        const wrapper = shallow(<Example />);
        wrapper.find('#input').simulate('change', { target: { value: 'a' } });
        expect(wrapper.find('#hasError').text()).toBe('Some useful error message');
    });
    test('should get an array of all errors when calling getAllFieldsError', () => {
        const wrapper = shallow(<Example />);
        wrapper.find('#input').simulate('change', { target: { value: 'a' } });
        expect(wrapper.find('#allErrors').text()).toBe('Some useful error message');
    });
    test('should show error when invalid input then remove when error is solved', () => {
        const wrapper = shallow(<Example />);
        wrapper.find('#input').simulate('change', { target: { value: 'a' } });
        expect(wrapper.find('#hasErrorMessage').length).toBe(1);
        wrapper.find('#input').simulate('change', { target: { value: 'abc' } });
        expect(wrapper.find('#hasErrorMessage').length).toBe(0);
    });
});

const ExampleWithDynamicCompare = () => {
    const exampleField = createField({
        fieldName: 'example',
        errorMessage: () => 'Some useful error message',
        validate: dynamicCompare => value => value.length === dynamicCompare,
    });

    const [inputValue, updateInputValue] = useState();
    const [getFieldErrorMessage, validateFields, hasValidationError, getAllFieldErrors] = useValidation([exampleField]);

    const onChange = (e) => {
        validateFields([
            {
                fieldName: exampleField.fieldName,
                value: e.target.value,
                dynamicCompare: 3,
            },
        ]);
        updateInputValue(e.target.value || '');
    };

    return (
        <>
            <InputGroup label="Example" fieldMessage={getFieldErrorMessage(exampleField)}>
                <Input id="input" name={exampleField.fieldName} val={inputValue} onChange={onChange} />
            </InputGroup>
            {hasValidationError() && <p id="hasError">{getFieldErrorMessage(exampleField)}</p>}
            {!!getFieldErrorMessage(exampleField) && <p id="hasErrorMessage">{getFieldErrorMessage(exampleField)}</p>}
            {hasValidationError() &&
                getAllFieldErrors().map(err => (
                    <p key={err} id="allErrors">
                        {err}
                    </p>
                ))}
        </>
    );
};

describe('useValidation example with dynamic compare and error message as a function', () => {
    test('should not show error when valid input', () => {
        const wrapper = shallow(<ExampleWithDynamicCompare />);
        wrapper.find('#input').simulate('change', { target: { value: 'abc' } });
        expect(wrapper.find('#hasError').length).toBe(0);
    });
    test('should show error when invalid input', () => {
        const wrapper = shallow(<ExampleWithDynamicCompare />);
        wrapper.find('#input').simulate('change', { target: { value: 'a' } });
        expect(wrapper.find('#hasError').length).toBe(1);
    });
    test('should show correct error message in DOM when calling getFieldErrorMessage', () => {
        const wrapper = shallow(<ExampleWithDynamicCompare />);
        wrapper.find('#input').simulate('change', { target: { value: 'a' } });
        expect(wrapper.find('#hasError').text()).toBe('Some useful error message');
    });
    test('should get an array of all errors when calling getAllFieldsError', () => {
        const wrapper = shallow(<ExampleWithDynamicCompare />);
        wrapper.find('#input').simulate('change', { target: { value: 'a' } });
        expect(wrapper.find('#allErrors').text()).toBe('Some useful error message');
    });
    test('should show error when invalid input then remove when error is solved', () => {
        const wrapper = shallow(<ExampleWithDynamicCompare />);
        wrapper.find('#input').simulate('change', { target: { value: 'a' } });
        expect(wrapper.find('#hasErrorMessage').length).toBe(1);
        wrapper.find('#input').simulate('change', { target: { value: 'abc' } });
        expect(wrapper.find('#hasErrorMessage').length).toBe(0);
    });
});