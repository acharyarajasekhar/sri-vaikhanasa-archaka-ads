export const reportAbuseForm = {
    controls: [
        {
            order: 0,
            name: "abuseType",
            controlType: 'radiolist',
            icon: "abuse",
            label: "Type of abuse...",
            options: [
                { value: "Spam", text: "Spam" },
                { value: "Offensive", text: "Violence/offensive" },
                { value: "Nudity", text: "Nudity" },
                { value: "Private", text: "Private/confidential" },
                { value: "Copyright", text: "Copyright infringement" },
                { value: "Other", text: "Other" }
            ],
            validators: {
                required: { message: "Type of abuse is required" }
            }
        },
        {
            order: 1,
            name: "description",
            controlType: 'textarea',
            icon: "details",
            label: "Please provide your comments here...",
            validators: {
                required: { message: "Description is required" },
                minLength: { length: 10, message: "Description must be at least 10 characters long" },
                maxLength: { length: 5000, message: "Description cannot be more than 5000 characters long" }
            }
        },
        {
            order: 2,
            name: "isHidden",
            controlType: 'toggle',
            label: "Hide this Ad from public view immediately",
            value: false,
            validators: {}
        }
    ]
}