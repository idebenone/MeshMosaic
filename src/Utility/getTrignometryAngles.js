export const getTrignometryAngles = (value, operation) => {
    switch (operation) {
        case "sin":
            return Math.sin(value);
        case "cos":
            return Math.cos(value);
        case "tan":
            return Math.tan(value);
        case "sinh":
            return Math.sinh(value);
        case "cosh":
            return Math.cosh(value);
        case "tanh":
            return Math.tanh(value);
        default:
            return value;
    }
};
