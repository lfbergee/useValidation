import createField from './createField';

describe('createField', () => {
    test('should return correct shape', () => {
        const someFunction = () => {};
        const res = createField({
            fieldName: 'someField',
            errorMessage: 'Some error',
            validate: someFunction,
        });

        expect(res).toMatchObject({
            fieldName: 'someField',
            errorMessage: 'Some error',
            validate: someFunction,
            hasError: false,
        });
    });
});