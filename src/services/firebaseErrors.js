export const mapAuthError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Este email ya está registrado 📧'

    case 'auth/invalid-email':
      return 'El email no es válido ❌'

    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres 🔐'

    case 'auth/user-not-found':
      return 'No existe una cuenta con este email 👀'

    case 'auth/wrong-password':
      return 'La contraseña es incorrecta 🔑'

    case 'auth/too-many-requests':
      return 'Demasiados intentos. Inténtalo más tarde ⏳'

    case 'auth/network-request-failed':
      return 'Problema de conexión. Revisa tu internet 🌐'

    default:
      return 'Ocurrió un error inesperado. Inténtalo de nuevo 😕'
  }
}
