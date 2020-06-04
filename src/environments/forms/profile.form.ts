export const profileEditForm = {
    controls: [
        {
            order: 0,
            name: "displayName",
            controlType: 'input',
            inputType: 'text',
            icon: "avatar",
            label: "Full Name",
            validators: {
                required: { message: "Full Name is required" },
                minLength: { length: 5, message: "Full Name must be at least 5 characters long" },
                maxLength: { length: 50, message: "Full Name cannot be more than 50 characters long" },
                pattern: { regEx: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", message: 'Full Name must contain only letters' }
            }
        },
        {
            order: 1,
            name: "photoURL",
            controlType: 'photos',
            icon: "details",
            label: "Choose Profile Photo",
            multiple: false,
            cropRequired: true,
            accept: ".png, .jpg, .jpeg",
            validators: {}
        },
        {
            order: 1,
            name: "coverPhotoURL",
            controlType: 'photos',
            icon: "details",
            label: "Choose Cover Photo",
            multiple: false,
            accept: ".png, .jpg, .jpeg",
            validators: {}
        },
        {
            order: 2,
            name: "isPublic",
            controlType: 'toggle',
            label: "Can show my phone number to others",
            value: false,
            validators: {}
        }
    ]
}