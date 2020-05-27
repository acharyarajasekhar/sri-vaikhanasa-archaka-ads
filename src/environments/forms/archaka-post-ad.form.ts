export const archakaPostAdForm = {
    controls: [
        {
            order: 0,
            name: "name",
            controlType: 'input',
            inputType: 'text',
            icon: "temple",
            label: "Temple Name",
            validators: {
                required: { message: "Temple Name is required" },
                minLength: { length: 5, message: "Temple Name must be at least 5 characters long" },
                maxLength: { length: 50, message: "Temple Name cannot be more than 50 characters long" },
                pattern: { regEx: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", message: 'Temple Name must contain only letters' }
            }
        },
        {
            order: 1,
            name: "description",
            controlType: 'textarea',
            icon: "details",
            label: "Brief description about roles and responsibilities",
            validators: {
                required: { message: "Description is required" },
                minLength: { length: 10, message: "Description must be at least 10 characters long" },
                maxLength: { length: 5000, message: "Description cannot be more than 5000 characters long" }
            }
        },
        {
            order: 2,
            name: "photos",
            controlType: 'photos',
            icon: "details",
            label: "Choose Cover Photos",
            multiple: true,
            accept: ".png, .jpg, .jpeg",
            validators: {
                maxAllowed: { count: 5, message: "Maximum 5 photos are allowed" },
            }
        },
        {
            order: 3,
            name: "salary",
            controlType: 'input',
            inputType: 'number',
            icon: "rupee",
            label: "Monthly Salary",
            validators: {
                required: { message: "Monthly Salary is required" },
                min: { min: 0, message: "Monthly Salary  must be greater than 0" }
            }
        },
        {
            order: 4,
            name: "additionals",
            controlType: 'checkboxlist',
            icon: "supplyfree",
            label: "Choose...",
            options: [
                { value: "Accommodation", text: "Accommodation" },
                { value: "LPG", text: "LPG" },
                { value: "Rice", text: "Rice" },
                { value: "Vegetables", text: "Vegetables" },
                { value: "Milk", text: "Milk" }
            ],
            validators: {}
        },
        {
            order: 5,
            name: "contactPerson",
            controlType: 'input',
            inputType: 'text',
            icon: "avatar",
            label: "Contact Person Name",
            validators: {
                required: { message: "Contact Person Name is required" },
                minLength: { length: 5, message: "Contact Person Name must be at least 5 characters long" },
                maxLength: { length: 50, message: "Contact Person Name cannot be more than 50 characters long" },
                pattern: { regEx: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", message: 'Contact Person Name must contain only letters' }
            }
        },
        {
            order: 6,
            name: "contactNumber",
            controlType: 'input',
            inputType: 'number',
            icon: "call",
            label: "Contact Number",
            validators: {
                required: { message: "Contact Number is required" }
            }
        },
        {
            order: 7,
            name: "address",
            controlType: 'address',
            icon: "postoffice",
            label: "Fill Address",
            validators: {
                required: { message: 'Address is Required' },
                isAddressLineRequired: { message: "Address Line is required" },
                addressLineMinLength: { length: 3, message: "Address Line must be at least 3 characters long" },
                addressLineMaxLength: { length: 250, message: "Address Line cannot be more than 250 characters long" },
                postalAddressRequired: { message: "Please choose your post office using your pincode" }
                // geoLocationRequired: { message: "Please choose your geo location on google maps" }
            }
        }
    ]
}