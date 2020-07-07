export const feedbackForm = {
    translationKey: "FEEDBACK_FORM_DATA",
    controls: [
        {
            order: 0,
            name: "type",
            controlType: 'radiolist',
            icon: "abuse",
            label: "FEEDBACK_TYPE",
            options: [
                { value: "Compliment", text: "COMPLIMENT" },
                { value: "Complaint", text: "COMPLAINT" },
                { value: "Suggestion", text: "SUGGESTION" },
                { value: "Other", text: "OTHERS" }
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
            label: "PROVIDE_COMMENT",
            validators: {
                required: { message: "DESCRIPTION_REQUIRED" },
                minLength: { length: 10, message: "DESCRIPTION_MINLENGTH" },
                maxLength: { length: 5000, message: "DESCRIPTION_MAXLENGTH" }
            }
        }
    ]
}