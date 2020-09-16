export const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
/**
 * checks if password is strong
 * @returns bool
 */
export const isStrongPassword = (password) => strongPasswordRegex.test(password);