export const reportAbuseForm = {
    controls: [
        {
            order: 0,
            name: "type",
            controlType: 'radiolist',
            icon: "abuse",
            label: "ABUSE_TYPE",
            options: [
                { value: "Spam", text: "SPAM" },
                { value: "Offensive", text: "VIO_OFFENCE" },
                { value: "Nudity", text: "NUDITY" },
                { value: "Private", text: "PRIVATE" },
                { value: "Copyright", text: "INFRINGMENT" },
                { value: "Other", text: "OTHER" }
            ],
            validators: {
                required: { message: "TYPE_REQUIRED" }
            }
        },
        {
            order: 1,
            name: "description",
            controlType: 'textarea',
            icon: "details",
            label: "PROVIDE_COMMENTS",
            validators: {
                required: { message: "DESCRIPTION_REQUIRED" },
                minLength: { length: 10, message: "DESCRIPTION_MINLENGTH" },
                maxLength: { length: 5000, message: "DESCRIPTION_MAXLENGTH" }
            }
        },
        {
            order: 2,
            name: "isHidden",
            controlType: 'toggle',
            label: "HIDE_AD",
            value: false,
            validators: {}
        }
    ]
}