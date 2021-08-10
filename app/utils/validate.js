/*
A function for validation
1. Password to be alphanumeric
2. D.O.B format in mm/dd/yyyy
*/
module.exports = {
    validatePassword: (password) => {
        // password to be alphanumeric
        const alphanumericRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/);
        return alphanumericRegex.test(password);
    },

    validateDOB: (dob) => {
        // D.O.B format in mm/dd/yyyy
        const dateRegex = new RegExp(/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/);
        return dateRegex.test(dob);
    }
};
