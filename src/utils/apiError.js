const STATUS_MESSAGES = {
    400: 'Revisa los datos del formulario. Hay campos invalidos o incompletos.',
    401: 'Tu sesion expiro o las credenciales no son correctas.',
    403: 'No tienes permisos para realizar esta accion.',
    404: 'No encontramos el recurso solicitado.',
    409: 'Ya existe un registro con esos datos.',
    500: 'El servidor tuvo un problema. Intenta nuevamente en unos segundos.',
    503: 'El servicio no esta disponible en este momento.',
};

export const getApiErrorMessage = (error, fallback = 'No se pudo completar la operacion.') => {
    if (!error) return fallback;

    if (error.code === 'ERR_NETWORK') {
        return 'No se pudo conectar con el servidor. Verifica que los servicios esten desplegados.';
    }

    const data = error.response?.data;
    const status = error.response?.status;
    const message = data?.error || data?.message || data?.title;

    if (Array.isArray(data?.errors)) {
        return data.errors.map((item) => item.msg || item.message || String(item)).join(' ');
    }

    if (data?.errors && typeof data.errors === 'object') {
        return Object.values(data.errors).flat().join(' ');
    }

    return message || STATUS_MESSAGES[status] || error.message || fallback;
};
