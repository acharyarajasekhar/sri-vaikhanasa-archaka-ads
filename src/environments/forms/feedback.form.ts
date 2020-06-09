export const feedbackForm = {
    controls: [
        {
            order: 0,
            name: "type",
            controlType: 'radiolist',
            icon: "abuse",
            label: "Type of Feedback...",
            options: [
                { value: "Compliment", text: "Compliment" },
                { value: "Complaint", text: "Complaint" },
                { value: "Suggestion", text: "Suggestion" },
                { value: "Other", text: "Other" }
            ],
            validators: {
                required: { message: "Type of feedback is required" }
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
        }
    ]
}