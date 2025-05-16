import axios from 'axios';
import { API_URL } from '../config';

const notificationApi = {
  // Get all notifications for a dentist
  getDentistNotifications: async (dentistId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/dentist/${dentistId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId: number) => {
    try {
      const response = await axios.patch(`${API_URL}/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (dentistId: string) => {
    try {
      const response = await axios.patch(`${API_URL}/api/notifications/dentist/${dentistId}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId: number) => {
    try {
      const response = await axios.delete(`${API_URL}/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get unread notification count
  getUnreadCount: async (dentistId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/dentist/${dentistId}/unread-count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },
};

export default notificationApi; 
