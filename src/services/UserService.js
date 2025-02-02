import axiosInstance from "./config";

const API_URL = '/user-service/api/users';

const UserService = {
    /**
     * Add a free user under a parent account.
     * @param {string} name - Name of the new user.
     * @param {string} password - Password for the new user.
     * @param {string} email - Email of the new user.
     * @param {string} parentAccountId - UUID of the parent account.
     * @returns {Promise<string>} - Promise resolving to the new user's ID.
     */
    addFreeUser: async (name, password, email, parentAccountId) => {
        const response = await axiosInstance.post(`${API_URL}/add-free-user`, null, {
            params: { name, password, email, parentAccountId },
        });
        return response.data; // The new user's ID
    },

    /**
     * Modify an existing user's details.
     * @param {string} accountId - UUID of the user to be modified.
     * @param {string} [name] - New name for the user (optional).
     * @param {string} [password] - New password for the user (optional).
     * @param {string} [email] - New email for the user (optional).
     * @returns {Promise<string>} - Promise resolving to the modified user's ID.
     */
    modifyUser: async (accountId, name, password, email) => {
        const response = await axiosInstance.put(`${API_URL}/modify-user/${accountId}`, null, {
            params: { name, password, email },
        });
        return response.data; // The modified user's ID
    },

    /**
     * Get all free accounts linked to a parent account.
     * @param {string} accountId - UUID of the parent account.
     * @returns {Promise<Array>} - Promise resolving to an array of free accounts.
     */
    getFreeAccounts: async (accountId) => {
        const response = await axiosInstance.get(`${API_URL}/free-accounts/${accountId}`);
        return response.data; // Array of free accounts
    },

    /**
     * Fetch account information for a user by email.
     * @param {string} email - Email of the user.
     * @returns {Promise<Object>} - Promise resolving to the user's account information.
     */
    getAccountInfo: async (email) => {
        const response = await axiosInstance.post(`${API_URL}/account-info`, null, {
            params: { email },
        });
        return response.data; // The user's account information
    },

    /**
     * Send an invitation to a guest.
     * @param {string} fromUserEmail - The sender's email.
     * @param {string} toUserEmail - The recipient's email.
     * @returns {Promise<string>} - Promise resolving to a success message.
     */
    sendInvitation: async (fromUserEmail, toUserEmail) => {
        const response = await axiosInstance.post(`${API_URL}/send-invitation`, null, {
            params: { fromUserEmail, toUserEmail },
        });
        return response.data;
    },

    /**
     * Accept an invitation.
     * @param {string} providerEmail - The sender's email.
     * @param {string} userId - The recipient's id.
     * @returns {Promise<string>} - Promise resolving to a success message.
     */
    acceptInvitation: async (providerEmail, userId) => {
        const response = await axiosInstance.post(`${API_URL}/accept-invitation`, null, {
            params: { providerEmail, userId },
        });
        return response.data;
    },

    /**
     * Delete the link between current user with another user.
     * @param {string} parentId - The provider's id
     * @param {string} childId - The distributor's id.
     * @returns {Promise<string>} - Promise resolving to a success message.
     */
    deleteLink: async (parentId, childId) => {
        const response = await axiosInstance.delete(`${API_URL}/delete-link`, {
            params: { parentId, childId },
        });
        return response.data;
    },

    /**
     * Get distributors of the current user.
     * @param {string} userId - The current user's ID.
     * @param {boolean} includeFree - need to include those free accounts or not
     * @param {boolean} includeDistributor - need to include those subordinates or not
     * @param {boolean} includeProvider - need to include those product providers or not
     * @returns {Promise<Array>} - Promise resolving to an array of distributors.
     */
    getAllLinkedAccounts: async (userId, includeFree, includeDistributor, includeProvider ) => {
        const response = await axiosInstance.post(`${API_URL}/get-all-linked-accounts`, null, {
            params: { userId, includeFree, includeDistributor, includeProvider },
        });
        return response.data;
    },


};

export default UserService;