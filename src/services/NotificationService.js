import axiosInstance from "./config";

const API_URL = '/notification-service/api/notifications';

const NotificationService = {
    /**
     * Get notifications for a user.
     * @param {string} userId - The user's UUID.
     * @param {boolean} [isRead] - Optional filter for read/unread notifications.
     * @returns {Promise<Array>} - A list of notifications.
     */
    getNotifications: async (userId, isRead = false) => {
        const response = await axiosInstance.get(API_URL, { params: { userId, isRead } });
        return response.data;
    },

    /**
     * Mark a notification as read.
     * @param {string} notificationId - The notification's UUID.
     * @returns {Promise<void>} - Resolves when the operation is complete.
     */
    markNotificationAsRead: async (notificationId) => {
        await axiosInstance.put(`${API_URL}/${notificationId}/read`);
    },
};

export default NotificationService;
