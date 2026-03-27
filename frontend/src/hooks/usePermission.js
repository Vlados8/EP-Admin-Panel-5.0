import { useSelector } from 'react-redux';
import { hasPermission as checkPermission } from '../utils/permissions';

/**
 * Custom hook to check if the current logged-in user has a specific permission.
 * @param {string} permissionKey - The permission to check (e.g., 'MANAGE_USERS').
 * @returns {boolean}
 */
const usePermission = (permissionKey) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return false;
    }

    return checkPermission(user, permissionKey);
};

export default usePermission;
