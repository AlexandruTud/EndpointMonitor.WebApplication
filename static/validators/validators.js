export function emailValidator(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email);

    if (emailValid == false || email.length < 3)
        return "Invalid email address";

    return "Valid";
}

export function passwordValidator(password) {
    if (password.length < 8 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
        return "Password must be at least 8 characters long, contain a special character, a digit, a lowercase and an uppercase";
    }

    return "Valid";
}

export function nameValidator(name, label="Name", minLength=-1, maxLength=-1) {
    if (!/^[a-zA-Z\s]+$/.test(name))
        return "Invalid " + label.toLowerCase();

    if (minLength != -1) {
        if (name.length < minLength)
            return label + " must have at least " + minLength + " characters";
    }

    if (maxLength != -1) {
        if (name.length > maxLength)
            return label + " must have maximum " + maxLength + " characters";
    }

    return "Valid";
}

export function integerValidator(number, label="Number", minValue=-1, maxValue=-1) {
    number = parseInt(number);

    if (isNaN(number))
        return label + " must be a valid integer";
    
    if (minValue != maxValue) {
        if (number < minValue)
            return label + " must be at least " + minValue;
        else if (number > maxValue)
            return label + " must be maximum " + maxValue;
    }

    return "Valid";
}