export const archakaPostAdForm = {
    translationKey: "ARCHAKA_POST_ADD_FORM",
    controls: [
        {
            order: 0,
            name: "name",
            controlType: 'input',
            inputType: 'text',
            icon: "temple",
            label: "TEMPLE_NAME",
            validators: {
                required: { message: "TEMPLE_NAME_REQUIRED" },
                minLength: { length: 5, message: "TEMPLE_NAME_MINLENGTH" },
                maxLength: { length: 50, message: "TEMPLE_NAME_MAXLENGTH" },
                pattern: { regEx: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", message: 'TEMPLE_NAME_PATTERN' }
            }
        },
        {
            order: 1,
            name: "description",
            controlType: 'textarea',
            icon: "details",
            label: "BRIEF_DESCRIPTION",
            validators: {
                required: { message: "DESCRIPTION_REQUIRED" },
                minLength: { length: 10, message: "DESCRIPTION_MINLENGTH" },
                maxLength: { length: 5000, message: "DESCRIPTION_MAXLENGTH" }
            }
        },
        {
            order: 2,
            name: "photos",
            controlType: 'photos',
            icon: "details",
            label: "CHOOSE_COVERPHOTO",
            multiple: true,
            accept: ".png, .jpg, .jpeg",
            validators: {
                maxAllowed: { count: 5, message: "MAXALLOWED" },
            }
        },
        {
            order: 3,
            name: "salary",
            controlType: 'input',
            inputType: 'number',
            icon: "rupee",
            label: "MONTHLY_SALARY",
            validators: {
                required: { message: "SALARY_REQUIRED" },
                min: { min: 0, message: "MIN_SALARY" }
            }
        },
        {
            order: 4,
            name: "additionals",
            controlType: 'checkboxlist',
            icon: "supplyfree",
            label: "CHOOSE",
            options: [
                { value: "Accommodation", text: "ACCOMMODATION" },
                { value: "LPG", text: "LPG" },
                { value: "Rice", text: "RICE" },
                { value: "Vegetables", text: "VEGETABLES" },
                { value: "Milk", text: "MILK" }
            ],
            validators: {}
        },
        {
            order: 5,
            name: "contactPerson",
            controlType: 'input',
            inputType: 'text',
            icon: "avatar",
            label: "CONTACT_NAME",
            validators: {
                required: { message: "NAME_REQUIRED" },
                minLength: { length: 5, message: "PERSON_NAME_MINLENGTH" },
                maxLength: { length: 50, message: "PERSON_NAME_MAXLENGTH" },
                pattern: { regEx: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", message: 'PERSON_NAME_PATTERN' }
            }
        },
        {
            order: 6,
            name: "contactNumber",
            controlType: 'input',
            inputType: 'number',
            icon: "call",
            label: "CONTACT_NUMBER",
            validators: {
                required: { message: "CONTACT_NUMBER_REQUIRED" }
            }
        },
        {
            order: 7,
            name: "address",
            controlType: 'address',
            icon: "postoffice",
            label: "ADDRESS",
            validators: {
                required: { message: 'ADDRESS_REQUIRED' },
                isAddressLineRequired: { message: "ADDRESS_LINE_REQUIRED" },
                addressLineMinLength: { length: 3, message: "ADDRESS_LINE_MINLENGTH" },
                addressLineMaxLength: { length: 250, message: "ADDRESS_LINE_MAXLENGTH" },
                postalAddressRequired: { message: "POSTAL_REQUIRED" }
                // geoLocationRequired: { message: "LOCATION_REQUIRED" }
            }
        },
        {
            order: 8,
            name: "isActive",
            controlType: 'toggle',
            label: "SHOW_AD_PUBLIC",
            value: false,
            validators: {}
        }
    ]
}