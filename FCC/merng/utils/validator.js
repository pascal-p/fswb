module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  const emailRegexp = /^(\w([\-\.\w]*\w)*@(\w)[\-\.\w]*[\w]{2,9})$/;
  
  if (username.trim() === '') {
    errors.username = 'Username cannot be empty';
  }

  if (email.trim() === '') {
    errors.username = 'Email cannot be empty';
  }
  else {    
    if (!email.match(emailRegexp)) {
      errors.email = 'Email must be valid email address';
    }
  }

  if (password === '') {
    errors.password = 'Password must not be empty';
  }
  else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 // lt 1 => no errors
  };
}


module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  
  if (username.trim() === '') {
    errors.username = 'Username cannot be empty';
  }

  if (password === '') {
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 // lt 1 => no errors
  };
}
