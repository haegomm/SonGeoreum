import React from 'react'

function authValidation(value, type) {
  const REGEX = {        
    EMAIL: /\S+@\S+\.\S+/,
    // PASSWORD_RULE: /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{7,20}$/,        
    PASSWORD_RULE: /^(?=.*[a-zA-Z]).{8,20}$/,        
    NICKNAME_RULE: /^([가-힣a-zA-Z]+).{2,8}$/
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
export default authValidation
