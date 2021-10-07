const UserModel = require('../models/user');

const noteIsNotEmpty = (note) => {
  if (note.title.trim() !== '' && note.content.trim() !== '') {
    return true;
  }
  return false;
};

const validateUser = (user) => {
  const errors = [];
  if (user.firstName) {
    if (user.firstName.trim() === '') errors.push('User firstname may not be empty');
  } else {
    errors.push('User firstname not defined');
  }
  if (user.lastName) {
    if (user.lastName.trim() === '') errors.push('User lastname may not be empty');
  } else {
    errors.push('User lastname not defined');
  }
  if (user.email) {
    if (user.email.trim() === '') errors.push('User email may not be empty');
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(user.email).toLowerCase())) errors.push('Email format not accepted');
  } else {
    errors.push('User email not defined');
  }
  if (user.password) {
    if (user.password.first) {
      if (user.password.second) {
        if (user.password.first.trim() === '') errors.push('User password is required');
        if (user.password.first.trim().length < 8) errors.push('Password must contain at least 8 carachters');
        if (user.password.first.trim() !== user.password.second.trim()) errors.push('The two passwords did not match');
      } else {
        errors.push('User second password not defined');
      }
    } else {
      errors.push('User first password not defined');
    }
  } else {
    errors.push('User passwords not defined');
  }

  if (errors.length > 0) {
    return errors;
  }
  return true;
};

// eslint-disable-next-line max-len
const checkUserUnicity = async (user) => !await UserModel.countDocuments({ username: user.email }) > 0;

module.exports = { noteIsNotEmpty, validateUser, checkUserUnicity };
