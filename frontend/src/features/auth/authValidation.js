import React from "react";

function authValidation(value, type) {
  const REGEX = {
    EMAIL: /\S+@\S+\.\S+/,
    PASSWORD_RULE: /^(?=.*[a-zA-Z]).{8,20}$/,
    NICKNAME_RULE: /^[a-zA-Zㄱ-힣0-9-_.]{2,10}$/,
  };

  if (type === "email") {
    return REGEX.EMAIL.test(value);
  } else if (type === "password") {
    return REGEX.PASSWORD_RULE.test(value);
  } else if (type === "nickname") {
    return REGEX.NICKNAME_RULE.test(value);
  } else {
    return false;
  }
}
export default authValidation;
