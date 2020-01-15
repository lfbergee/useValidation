# useValidation

## Core idea

useValidation is to be a non-magical field validation building block. With useValidation you as a developer has more or less what you need to build any form validation. This prioritizes light weight and as little opinions as possible. This allows you to build your forms as you need them, not as how the library author imagine forms to be. The trade off is you need to supply some boilerplate to actually do something interesting with your form. Think of this as fieldValidation, not formValidation, you will build the form validation!

## Note to the future

Maybe we'll see that some of the boilerplate needed to build forms is replicated over and over again, at that point we should look into creating an abstraction layer above the field validation. But this should probably be built when we know how we want to use this library, and still offer developers the options to built it themselves.

## Usage

### Field creation

Please use the included createField function. Honestly it's not essential for useValidation to work, but it will make future refactors so much easier. CreateField puts an abstraction layer on the layout of our configuration object, so when we need to change the shape of configuration, the forms themselves are not affected. One limitation of useValidation is that all fields that needs validation must be created in the constructor, if you need to dynamically create fields, you must also dynamically create fieldValidation for those fields.

-   Fields are created one by one, and supplied as an array to the constructor function of useValidation. It needs a name, unique to the hook scope. So two fields registered to different hooks can have the same name, but not inside one.
-   Validate function can be a function or a one level curried function, `() => true` or `()=>()=>true`. If you use a curried function, you must supply a `dynamicCompare` value to the validateField function. This is useful when the validation of one field is dependant on a value from another field in your form.
-   ErrorMessage is either a function or a string. If its a function, the value of the field is passed as the first and only argument to the function. Useful if you want different error message based what failed in the validation. Strictly speaking, some can argue this is a double validation of the field, however this is inline with the core idea of the library, let the developer have freedom.

### Field validation

To keep with the developer first mantra, you decide when to validate, be it onChange, onBlur, onSubmit or anything else you can think of. Validation happens on validateFields, with an array of the fields to validate, the value of the field and dynamicCompare if needed. So you can validate a single field onChange for that field, or the entire form, just add the fields to the array to validate.

-   validateFields takes an array of fields with value, and sets status in the state of the hook.
-   getFieldErrorMessage takes a field and returns the error message for that field from state
-   getAllErrorMessages returns all errorMessages from all fields in state
-   hasValidationError returns a boolean if the state contains any validation errors
-   All the functions is returned as an array, so if you want to rename them when you use them, you can do that directly. Say you want to use more than one useValidation in a single component, that works just fine.

UseValidation do not really care that much about the validator functions itself, except that it needs to take the value of the field as the argument, and should return true/false. You must supply that function yourself, nothing is built-in to useValidation. See validator function in KFP-SHARED. If using those function out of the box, you need to set message=true, and flip the value, as they were created to use formFieldValidation that had quite different mindset.

## Developer notes

Hooks and Immer, pretty cool I'd say. The base flow of useValidation, called with the fields to be validated. Those fields are used as the second argument to the useReducer function, that is passed to the third argument, the init function. That function returns and object of the fields and that becomes initial state. So if it's needed to modify initial state, do that in the init function. Otherwise it should look somewhat familiar to anyone with redux experience, maybe with the exception of Immer. That gives us immutability in the state with pretty low effort. One important thing to note about immer, is that you must use functions that mutate the draft state, as that is diffed and committed to the immutable state object, so if you dont mutate draft, nothing will happen in state.
Please keep the test coverage at a reasonable level

### TODO

-   Developer warning if same field name is registered more than once in the hook scope
-   Should validateFields return a boolean if all fields validated or not?
-  Optimize validation and get functions with memiozation