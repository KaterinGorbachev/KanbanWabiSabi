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

export const mapFirebaseError = (error) => {
  switch (error.code) {
    case 'permission-denied':
      return 'No tienes permisos para realizar esta acción 🙅‍♂️'

    case 'unavailable':
      return 'El servicio no está disponible. Inténtalo más tarde ⏳'

    case 'not-found':
      return 'No se encontró la información solicitada 🔍'

    case 'already-exists':
      return 'Este registro ya existe ⚠️'

    case 'invalid-argument':
      return 'Los datos enviados no son válidos ❌'

    default:
      return 'Ocurrió un error inesperado. Inténtalo de nuevo 😕'
  }
}
