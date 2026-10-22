export function validateUsername(username) {
  if (!username || typeof username !== "string") {
    return "Username wajib diisi.";
  }
  if (username.length < 3 || username.length > 20) {
    return "Username harus 3-20 karakter.";
  }
  if (/\s/.test(username)) {
    return "Username tidak boleh mengandung spasi.";
  }
  return null;
}

export function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return "Password wajib diisi.";
  }
  if (password.length < 8) {
    return "Password minimal 8 karakter.";
  }
  return null;
}

export function validatePasswordConfirmation(password, confirmation) {
  if (password !== confirmation) {
    return "Konfirmasi password tidak cocok.";
  }
  return null;
}
