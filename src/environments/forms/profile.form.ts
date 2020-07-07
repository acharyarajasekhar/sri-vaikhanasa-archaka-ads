export const profileEditForm = {
    translationKey: "PROFILE_FORM_DATA",
    controls: [
        {
            order: 0,
            name: "displayName",
            controlType: 'input',
            inputType: 'text',
            icon: "avatar",
            label: "FULLNAME",
            validators: {
                required: { message: "FULLNAME_REQUIRED" },
                minLength: { length: 5, message: "FULLNAME_MINLENGTH" },
                maxLength: { length: 50, message: "FULLNAME_MAXLENGTH" },
                pattern: { regEx: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", message: 'FULLNAME_PATTREN' }
            }
        },
        {
            order: 1,
            name: "photoURL",
            controlType: 'photos',
            icon: "details",
            label: "CHOOSE_PROFILE_PHOTO",
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
            label: "CHOOSE_COVER_PHOTO",
            multiple: false,
            accept: ".png, .jpg, .jpeg",
            validators: {}
        },
        {
            order: 2,
            name: "isPublic",
            controlType: 'toggle',
            label: "SHOW_PHONE_NUMBER",
            value: false,
            validators: {}
        }
    ]
}