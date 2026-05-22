export const ROLES = {
    ADMIN: 'Admin',
    BIBLIOTECARIO: 'Bibliotecario',
    ESTUDIANTE: 'Estudiante',
    PROFESOR: 'Profesor',
};

export const canManageBooks = (roles = []) => {
    return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.BIBLIOTECARIO);
};
