// Provides authentication form normalization and immediate client validation.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function addError(errors, field, message) {
  if (!errors[field]) {
    errors[field] = message;
  }
}

export function validateSignupForm(values) {
  const normalized = {
    name: values?.name?.trim() || "",
    username: values?.username?.trim() || "",
    email: values?.email?.trim().toLowerCase() || "",
    password: values?.password ?? "",
  };

  const errors = {};

  if (!normalized.name) {
    addError(errors, "name", "Name is required.");
  } else if (normalized.name.length > 50) {
    addError(errors, "name", "Name cannot exceed 50 characters.");
  }

  if (!normalized.username) {
    addError(errors, "username", "Username is required.");
  } else if (normalized.username.length > 254) {
    addError(errors, "username", "Username cannot exceed 254 characters.");
  }

  if (!normalized.email) {
    addError(errors, "email", "Email is required.");
  } else if (normalized.email.length > 254) {
    addError(errors, "email", "Email address is too long.");
  } else if (!EMAIL_PATTERN.test(normalized.email)) {
    addError(errors, "email", "Please provide a valid email address.");
  }

  if (!normalized.password) {
    addError(errors, "password", "Password is required.");
  } else if (normalized.password.length < 8) {
    addError(
      errors,
      "password",
      "Password must be at least 8 characters long.",
    );
  }

  return { values: normalized, errors };
}

export function validateLoginForm(values) {
  const rawIdentifier = values?.identifier?.trim() || "";
  const isEmail = rawIdentifier.includes("@");

  const normalized = {
    identifier: isEmail ? rawIdentifier.toLowerCase() : rawIdentifier,
    password: values?.password ?? "",
  };

  const errors = {};

  if (!normalized.identifier) {
    addError(errors, "identifier", "Username or email is required.");
  } else if (normalized.identifier.length > 254) {
    addError(
      errors,
      "identifier",
      "Username or email cannot exceed 254 characters.",
    );
  } else if (isEmail && !EMAIL_PATTERN.test(normalized.identifier)) {
    addError(errors, "identifier", "Please provide a valid email address.");
  }

  if (!normalized.password) {
    addError(errors, "password", "Password is required.");
  }

  return { values: normalized, errors };
}
