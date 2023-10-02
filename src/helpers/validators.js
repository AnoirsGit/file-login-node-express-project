const createValidator = (regex) => {
    return (value) => regex.test(value)
}

const createAllValidators = (arrOfRegex) => {
    return value => {
        for (const regex of arrOfRegex) {
            if (!regex.test(value)) return false;
        }
        return true
    }
}

const createAnyValidator = (arrOfRegex) => {
    return value => {
        for (const regex of arrOfRegex) {
            console.log({ test: regex.test(value), value })
            if (regex.test(value)) return true;
        }
        return false
    }
}

module.exports = { createValidator, createAllValidators, createAnyValidator }