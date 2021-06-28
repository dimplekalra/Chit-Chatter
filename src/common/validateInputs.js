const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

exports.validateName = (name) => {
  if (name.trim().length <= 0) {
    return {
      error: true,
      message: "please type your name ",
    };
  } else if (!name) {
    return {
      error: true,
      message: "please type your name ",
    };
  } else if (name.length < 3 || name.length > 50) {
    return {
      error: true,
      message:
        "name should be minimum 3 characters and maximum 50 characters long",
    };
  } else {
    return {
      error: false,
      message: "Success",
    };
  }
};

exports.validateEmptyFields = (name, text) => {
  if (text.trim().length <= 0) {
    return {
      error: true,
      message: `please type your ${name} `,
    };
  } else if (!text) {
    return {
      error: true,
      message: `please type your ${name} `,
    };
  } else {
    return {
      error: false,
      message: "Success",
    };
  }
};

exports.validateEmail = (email) => {
  if (email.trim().length <= 0) {
    return {
      error: true,
      message: "Please fill your email address",
    };
  } else if (!email) {
    return {
      error: true,
      message: "Please fill your email address",
    };
  } else if (!emailRegex.test(email)) {
    return {
      error: true,
      message: "invalid email address",
    };
  } else {
    return {
      error: false,
      message: "Success",
    };
  }
};

exports.validatePassword = (pass) => {
  if (pass.trim().length <= 0) {
    return {
      error: true,
      message: "Please fill your password",
    };
  }
  if (!pass) {
    return {
      error: true,
      message: "please fill your password",
    };
  } else if (pass.length < 6 || pass.length > 20) {
    return {
      error: true,
      message: "password should be minimum 6 and maximum 20 characters long",
    };
  } else {
    return {
      error: false,
      message: "Success",
    };
  }
};

exports.validateConfirmPassword = (pass, confirmPass) => {
  if (confirmPass.trim().length <= 0 || pass.trim().length <= 0) {
    return {
      error: true,
      message: "Please type your password",
    };
  } else if (!pass || !confirmPass) {
    return {
      error: true,
      message: "Please type your password",
    };
  } else if (pass !== confirmPass) {
    return {
      error: true,
      message: "password does not match",
    };
  } else {
    return {
      error: false,
      message: "Success",
    };
  }
};

exports.validatePhoneNumber = (number) => {
  if (!number) {
    return {
      error: true,
      message: "Please fill your Phone Number",
    };
  } else if (!phoneRegex.test(number)) {
    return {
      error: true,
      message: "invalid Phone Number",
    };
  } else {
    return {
      error: false,
      message: "Success",
    };
  }
};

exports.validateFiles = (value) => {
  if (!value) {
    return {
      error: true,
      message: "Please upload your video",
    };
  } else if (value.type.split("/")[0] !== "video") {
    return {
      error: true,
      message: "Please upload video",
    };
  } else {
    return {
      error: false,
      message: "success",
    };
  }
};
