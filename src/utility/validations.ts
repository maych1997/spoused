export function validName(name: string) {
  if (name > "" && !/[0-9]/.test(name)) {
    return true;
  } else {
    return false;
  }
}

export function validPassword(pw: string) {
  let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/;

  return reg.test(pw);
}
