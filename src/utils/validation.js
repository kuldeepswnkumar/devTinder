const validator = require("validator")

const userValidationData = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName) {
        throw new Error("Name is required!")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email id")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password should be strong")
    }
}

const validateEditUser = (req) => {
    const allowedEditFields = [
        'firstName',
        'lastName',
        'emailId',
        'password',
        'age',
        'gender',
        'photoUrl',
        'about',
        'skills'
    ]

    const isEditableFields = Object.keys(req.body).every((key) => allowedEditFields.includes(key))

    return isEditableFields;
}
module.exports = {
    userValidationData,
    validateEditUser
}