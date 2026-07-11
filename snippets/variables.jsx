export const httpStatusTableColumns = [
    {
        "key": "status",
        "header": "Status",
        render: (value) => <code className="font-mono text-[13px] font-regular">{value}</code>},
    {"key": "description", "header": "Description"},
];

export const httpStatuses = [
    {
        status: "200",
        description: "Everything worked as expected."
    },
    {
        status: "201",
        description: "Everything worked as expected and a new resource was created. This is typically used for create operations (POST requests)."
    },
    {
        status: "202",
        description: "The request has been accepted for processing, but the processing has not been completed. This is used for asynchronous operations."
    },
    {
        status: "400",
        description: "The request was unacceptable, often due to a validation error."
    },
    {
        status: "401",
        description: "No valid credentials provided."
    },
    {
        status: "403",
        description: "The provided credentials don't have permissions to perform the request."
    },
    {
        status: "404",
        description: "The requested resource doesn't exist."
    },
    {
        status: "409",
        description: "The request conflicts with the current state of the resource."
    },
    {
        status: "500",
        description: "Something went wrong on our end."
    }
]

export const errorCodesTableColumns = [
    {"key": "code", "header": "Code", render: (value) => <code className="font-mono text-[13px] font-regular">{value}</code>},
    {"key": "detail", "header": "Description"},
]

export const webhookEventsTableColumns = [
    {"key": "name", "header": "Event", render: (value) => <code className="font-mono text-[13px] font-regular">{value}</code>},
    {"key": "resource_type", "header": "Resource", render: (value) => <code className="font-mono text-[13px] font-regular">{value}</code>},
    {"key": "description", "header": "Description"},
];