import validator from "validator";

const validateSignupData = (req) => {
  const { firstName, email, password } = req.body;

  if (!firstName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

export { validateSignupData };
