export function validateName(name: string): string | null {
  if (!/^[a-zA-Z ]{2,50}$/.test(name))
    return "Name must contain only letters and spaces (2–50 characters)";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!/^[6-9]\d{9}$/.test(phone))
    return "Invalid Indian mobile number";
  return null;
}

export function validateDOB(dob: string): string | null {
  const date = new Date(dob);
  if (isNaN(date.getTime()))
    return "Invalid date of birth";
  if (date > new Date())
    return "Date of birth cannot be in the future";
  return null;
}

export function validateLocation(location: string): string | null {
  if (location.length < 2 || location.length > 100)
    return "Location must be 2–100 characters long";
  return null;
}

export function validateGSTIN(gstin: string): string | null {
  if (
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      gstin
    )
  )
    return "Invalid GSTIN";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8)
    return "Password must be at least 8 characters";
  return null;
}

export function validateEmail(email: string): string | null {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Invalid email format";
  return null;
}