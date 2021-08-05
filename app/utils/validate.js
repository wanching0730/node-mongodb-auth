// validate D.O.B format in mm/dd/yyyy
exports.validateDOB = (dob) => {
    let dateRegex = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
    return dateRegex.test(dob);
};
