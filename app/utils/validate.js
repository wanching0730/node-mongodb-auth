/*
A function to validate D.O.B format in mm/dd/yyyy
*/
module.exports = {
    validateDOB: (dob) => {
        let dateRegex = new RegExp(/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/);
        let flag = dateRegex.test(dob);
        console.log(flag)
        return dateRegex.test(dob);
    }
};
