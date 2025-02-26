const errorMessages = {
    "EMPLOYEE" : {
        "CREATE_FAILED" : (reason) => `Failed to create employee. Reason: ${reason}.`,
        "EDIT_FAILED" : (reason) => `Failed to edit employee. Reason: ${reason}.`,
        "DELETE_FAILED" : (reason) => `Failed to delete employee. Reason: ${reason}.`,
    },

    "DEPARTMENT" : {
        "CREATE_FAILED" : (reason) => `Failed to create department. Reason: ${reason}.`,
        "EDIT_FAILED" : (reason) => `Failed to edit department. Reason: ${reason}.`,
        "DELETE_FAILED" : (reason) => `Failed to delete department. Reason: ${reason}.`,
    },

    "LEAVE_TYPE" : {
        "CREATE_FAILED" : (reason) => `Failed to create leave type. Reason: ${reason}.`,
        "EDIT_FAILED" : (reason) => `Failed to edit leave type. Reason: ${reason}.`,
        "DELETE_FAILED" : (reason) => `Failed to delete leave type. Reason: ${reason}.`,
    },

    "HOLIDAY_REQUEST" : {
        "CREATE_FAILED" : (reason) => `Failed to add holiday request. Reason: ${reason}.`,
        "EDIT_FAILED" : (reason) => `Failed to edit holiday request. Reason: ${reason}.`,
        "DELETE_FAILED" : (reason) => `Failed to cancel holiday request. Reason: ${reason}.`,
    },

    "LEAVE_BALANCE" : {
        "CREATE_FAILED" : (reason) => `Failed to add leave balance. Reason: ${reason}.`,
        "EDIT_FAILED" : (reason) => `Failed to edit leave balance. Reason: ${reason}.`,
        "DELETE_FAILED" : (reason) => `Failed to delete leave balance. Reason: ${reason}.`,
    },

    "REMOTE_REQUEST" : {
        "CREATE_FAILED" : (reason) => `Failed to add remote request. Reason: ${reason}.`,
        "EDIT_FAILED" : (reason) => `Failed to edit remote request. Reason: ${reason}.`,
        "DELETE_FAILED" : (reason) => `Failed to cancel remote request. Reason: ${reason}.`,
    },
}