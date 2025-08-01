// src/components/NotificationSystem.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertTriangle, X, Clock } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

interface Notification {
  id: string;
  type: 'nurse_alert' | 'emergency' | 'session_update' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  data?: any;
}

interface NotificationSystemProps {
  userId?: string;
  userType?: 'hostess' | 'nurse' | 'admin';
  className?: string;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  userId,
  userType,
  className = ''
}) => {
  const { socket, status } = useSocket(userId);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Add notification helper
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`ServiceSync - ${notification.title}`, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }

    // Auto-hide low priority notifications
    if (notification.priority === 'low') {
      setTimeout(() => {
        markAsRead(newNotification.id);
      }, 5000);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Nurse alerts (for nurses)
    socket.on('nurseAlert', (data) => {
      if (userType === 'nurse') {
        addNotification({
          type: 'nurse_alert',
          title: '🔔 Meal Delivery Alert',
          message: `${data.mealCount} ${data.mealType} meals ready at ${data.wardId}`,
          priority: 'high',
          data
        });
      }
    });

    // Emergency alerts (for all)
    socket.on('emergencyAlert', (data) => {
      addNotification({
        type: 'emergency',
        title: '🚨 Emergency Alert',
        message: `${data.type}: ${data.description} at ${data.location}`,
        priority: 'critical',
        data
      });
    });

    // Session updates (for admins)
    socket.on('sessionStarted', (data) => {
      if (userType === 'admin') {
        addNotification({
          type: 'session_update',
          title: '🚀 New Session Started',
          message: `${data.hostessId} started delivery to ${data.wardId}`,
          priority: 'medium',
          data
        });
      }
    });

    socket.on('sessionCompleted', (data) => {
      if (userType === 'admin') {
        addNotification({
          type: 'session_update',
          title: '✅ Session Completed',
          message: `${data.hostessId} completed delivery (${Math.round(data.duration / 60000)}min)`,
          priority: 'low',
          data
        });
      }
    });

    // Nurse responses (for hostesses)
    socket.on('nurseResponse', (data) => {
      if (userType === 'hostess') {
        addNotification({
          type: 'nurse_alert',
          title: '✅ Nurse Ready',
          message: `Nurse ${data.nurseId} acknowledged and is ready to receive meals`,
          priority: 'high',
          data
        });
      }
    });

    // Hostess location updates (for admins)
    socket.on('hostessLocation', (data) => {
      if (userType === 'admin' && data.location === 'ward_arrival') {
        addNotification({
          type: 'session_update',
          title: '📍 Hostess Arrived',
          message: `${data.hostessId} arrived at destination ward`,
          priority: 'low',
          data
        });
      }
    });

    return () => {
      socket.off('nurseAlert');
      socket.off('emergencyAlert');
      socket.off('sessionStarted');
      socket.off('sessionCompleted');
      socket.off('nurseResponse');
      socket.off('hostessLocation');
    };
  }, [socket, userType]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityIcon = (type: string, priority: string) => {
    if (priority === 'critical') return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (type === 'nurse_alert') return <Bell className="w-5 h-5 text-orange-500" />;
    if (type === 'session_update') return <CheckCircle className="w-5 h-5 text-blue-500" />;
    return <Bell className="w-5 h-5 text-gray-500" />;
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(!isVisible)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {isVisible && (
        <div className="absolute right-0 top-12 w-80 max-h-96 bg-white border rounded-lg shadow-elevated z-50 overflow-hidden">
          <div className="p-4 border-b bg-gradient-subtle">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {status.connected ? '🟢 Live' : '🔴 Offline'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${getPriorityColor(notification.priority)} ${
                      notification.read ? 'opacity-60' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(notification.type, notification.priority)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.timestamp)}
                          </span>
                          <span className="text-xs font-medium text-primary capitalize">
                            {notification.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="w-full text-muted-foreground"
              >
                Clear All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Hook for managing notifications in different components
export const useNotifications = (userId?: string, userType?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocket(userId);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  return {
    notifications,
    addNotification,
    unreadCount: notifications.filter(n => !n.read).length
  };
};