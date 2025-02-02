import axiosInstance from "./config";

const API_URL = '/user-service/api/products';

const ProductService = {
    /**
     * Register a new product.
     * @param {string} name - The name of the product.
     * @param {string} description - The description of the product.
     * @param {string} detail - Additional details about the product.
     * @param {string} customerInfoTemplate - customer info required by the provider
     * @param {string} accountId - UUID of the account registering the product.
     * @returns {Promise<Object>} - The registered product.
     */
    registerProduct: async (name, description, detail, customerInfoTemplate, accountId) => {
        const response = await axiosInstance.post(`${API_URL}/register`, null, {
            params: {name, description, detail, customerInfoTemplate, accountId},
        });
        return response.data;
    },

    /**
     * Delete a product by ID.
     * @param {string} productId - UUID of the product to delete.
     * @returns {Promise<void>} - A promise that resolves when the product is deleted.
     */
    deleteProduct: async (productId) => {
        await axiosInstance.delete(`${API_URL}/delete/${productId}`);
    },

    /**
     * Modify an existing product.
     * @param {string} productId - UUID of the product to modify.
     * @param {string} [name] - The new name of the product (optional).
     * @param {string} [description] - The new description of the product (optional).
     * @param {string} [detail] - The new detail of the product (optional).
     * @returns {Promise<Object>} - The updated product.
     */
    modifyProduct: async (productId, name, description, detail) => {
        const response = await axiosInstance.put(`${API_URL}/modify/${productId}`, null, {
            params: {name, description, detail},
        });
        return response.data;
    },

    /**
     * Get all registered products for a user.
     * @param {string} userId - UUID of the user.
     * @returns {Promise<Array>} - A list of registered products.
     */
    getRegisteredProducts: async (userId) => {
        const response = await axiosInstance.get(`${API_URL}/registered/${userId}`);
        return response.data;
    },

    /**
     * Get all authorized products for a user.
     * @param {string} userId - UUID of the user.
     * @returns {Promise<Array>} - A list of authorized products.
     */
    getAuthorizedProducts: async (userId) => {
        const response = await axiosInstance.get(`${API_URL}/authorized/${userId}`);
        return response.data;
    },

    /**
     * Create a new product group.
     * @param {string} name - The name of the group.
     * @param {string} userId - UUID of the user creating the group.
     * @returns {Promise<string>} - The UUID of the created group.
     */
    createProductGroup: async (name, userId) => {
        const response = await axiosInstance.post(`${API_URL}/group/create`, null, {
            params: {name, userId},
        });
        return response.data;
    },

    /**
     * Add a product authorization to a group.
     * @param {string} productAuthId - UUID of the product authorization.
     * @param {string} userId - UUID of the user adding the product to the group.
     * @param {string} groupId - UUID of the group.
     * @returns {Promise<void>} - A promise that resolves when the product is added to the group.
     */
    addProductToGroup: async (productAuthId, userId, groupId) => {
        await axiosInstance.post(`${API_URL}/group/add`, null, {
            params: {productAuthId, userId, groupId},
        });
    },

    /**
     * Remove a product authorization from a group.
     * @param {string} productAuthId - UUID of the product authorization.
     * @param {string} groupId - UUID of the group.
     * @returns {Promise<void>} - A promise that resolves when the product is removed from the group.
     */
    removeProductFromGroup: async (productAuthId, groupId) => {
        await axiosInstance.delete(`${API_URL}/group/remove`, {
            params: {productAuthId, groupId},
        });
    },

    deleteGroup: async (groupId) => {
        try {
            await axiosInstance.delete(`${API_URL}/group/delete/${groupId}`);
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    },

    getGroups: async (userId) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/group/owner/${userId}`)
            return response.data
        } catch (error) {
            console.error('Error getting group:', error);
        }
    },

    /**
     * Get all authorized products in a group.
     * @param {string} groupId - UUID of the group.
     * @returns {Promise<Array>} - A list of authorized products in the group.
     */
    getAuthorizedProductsByGroup: async (groupId) => {
        const response = await axiosInstance.get(`${API_URL}/group/list/${groupId}`);
        return response.data;
    },

    addUserToGroup: async (userId, childId, groupId) => {
        const response = await axiosInstance.post(`${API_URL}/group/${groupId}/assign`, null, {
            params: {userId, childId}
        })
        return response.data;
    },

    removeUserFromGroup: async (childId, groupId) => {
        await axiosInstance.delete(`${API_URL}/group/${groupId}/users/${childId}`);
    },

    getUsersByGroup: async (groupId) => {
        const response = await axiosInstance.get(`${API_URL}/group/${groupId}/users`);
        return response.data;
    },

    getGroupAssignedToUser: async (userId) => {
        const response = await axiosInstance.get(`${API_URL}/group/user/${userId}`);
        return response.data;
    }
};

export default ProductService;
