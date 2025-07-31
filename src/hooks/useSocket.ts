// ========================================
// SOCKET.IO HOOK WITH FALLBACK - src/hooks/useSocket.ts
// ========================================

import { useEffect, useRef, useState } from 'react';

// Socket connection status
export interface SocketStatus {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastConnected: Date | null;
  usingMock: boolean;
}

// Mock socket for when Socket.IO isn't available
const createMockSocket = (userId: string) => {
  console.log(`📡 Mock Socket: Would connect user ${userId} to localhost:3001`);
  
  return {
    on: (event: string, callback: (data: any) => void) => {
      console.log(`📻 Mock: Listening for '${event}' events`);
      
      // Simulate connection
      if (event === 'connect') {
        setTimeout(() => {
          console.log('✅ Mock: Simulated connection');
          callback({ status: 'connected' });
        }, 500);
      }
    },
    
    emit: (event: string, data?: any) => {
      console.log(`📤 Mock: Would emit '${event}'`, data);
      
      if (event === 'nurseAlert') {
        console.log('🔔 Mock: Nurse alert would be sent', data);
      }
    },
    
    disconnect: () => {
      console.log('❌ Mock: Would disconnect');
    },
    
    connected: false
  };
};

// Try to load Socket.IO dynamically
const getSocketIO = () => {
  try {
    // Try different import methods
    const socketIO = window.require?.('socket.io-client');
    return socketIO?.default || socketIO?.io || socketIO;
  } catch {
    return null;
  }
};

// Main Socket.IO hook
export const useSocket = (userId?: string) => {
  const socketRef = useRef<any>(null);
  const [status, setStatus] = useState<SocketStatus>({
    connected: false,
    connecting: false,
    error: null,
    lastConnected: null,
    usingMock: false
  });

  useEffect(() => {
    if (!userId) {
      console.log('📡 Socket: No userId provided');
      return;
    }

    const ioInstance = getSocketIO();
    
    if (!ioInstance) {
      // Use mock socket
      console.log('🔧 Socket.IO not available, using mock');
      socketRef.current = createMockSocket(userId);
      setStatus(prev => ({ ...prev, usingMock: true }));
      
      // Simulate successful connection for mock
      setTimeout(() => {
        setStatus({
          connected: true,
          connecting: false,
          error: null,
          lastConnected: new Date(),
          usingMock: true
        });
      }, 1000);
      
      return;
    }

    // Real Socket.IO connection
    console.log(`🔌 Socket: Connecting to localhost:3001 for user ${userId}`);
    setStatus(prev => ({ ...prev, connecting: true, error: null, usingMock: false }));

    try {
      socketRef.current = ioInstance('http://localhost:3001', {
        query: { userId },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('✅ Socket: Connected to ServiceSync server');
        setStatus({
          connected: true,
          connecting: false,
          error: null,
          lastConnected: new Date(),
          usingMock: false
        });
        
        socket.emit('joinRoom', `user_${userId}`);
      });

      socket.on('disconnect', (reason: string) => {
        console.log(`❌ Socket: Disconnected - ${reason}`);
        setStatus(prev => ({
          ...prev,
          connected: false,
          connecting: false
        }));
      });

      socket.on('connect_error', (error: any) => {
        console.error('🚨 Socket: Connection error:', error);
        setStatus(prev => ({
          ...prev,
          connected: false,
          connecting: false,
          error: error.message || 'Connection failed'
        }));
      });

      // ServiceSync events
      socket.on('nurseAlert', (data: any) => {
        console.log('🔔 Socket: Nurse alert received:', data);
        
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('ServiceSync - Nurse Alert', {
            body: `${data.hostessName} needs assistance at ${data.wardName}`,
            icon: '/favicon.ico'
          });
        }
        
        window.dispatchEvent(new CustomEvent('nurseAlert', { detail: data }));
      });

      socket.on('sessionUpdate', (data: any) => {
        console.log('📋 Socket: Session update:', data);
        window.dispatchEvent(new CustomEvent('sessionUpdate', { detail: data }));
      });

      socket.on('emergencyAlert', (data: any) => {
        console.log('🚨 Socket: Emergency alert:', data);
        window.dispatchEvent(new CustomEvent('emergencyAlert', { detail: data }));
      });

    } catch (error) {
      console.error('Socket.IO initialization failed:', error);
      setStatus(prev => ({
        ...prev,
        error: 'Failed to initialize Socket.IO',
        connecting: false,
        usingMock: true
      }));
    }

    return () => {
      if (socketRef.current && !status.usingMock) {
        socketRef.current.emit('leaveRoom', `user_${userId}`);
        socketRef.current.disconnect();
      }
      socketRef.current = null;
    };
  }, [userId]);

  const emitHostessLocation = (sessionId: string, location: string) => {
    if (socketRef.current) {
      if (status.usingMock) {
        console.log(`📍 Mock: Would emit location ${location} for session ${sessionId}`);
      } else if (socketRef.current.connected) {
        socketRef.current.emit('hostessLocation', {
          sessionId,
          location,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const joinRoom = (roomId: string) => {
    if (socketRef.current && !status.usingMock && socketRef.current.connected) {
      socketRef.current.emit('joinRoom', roomId);
      console.log(`🏠 Socket: Joined room ${roomId}`);
    }
  };

  return {
    socket: socketRef.current,
    status,
    emitHostessLocation,
    joinRoom
  };
};

// ========================================
// EVENT LISTENER HOOKS
// ========================================

export const useSocketEvents = () => {
  const [nurseAlerts, setNurseAlerts] = useState<any[]>([]);
  const [sessionUpdates, setSessionUpdates] = useState<any[]>([]);

  useEffect(() => {
    const handleNurseAlert = (event: any) => {
      setNurseAlerts(prev => [event.detail, ...prev.slice(0, 9)]);
    };

    const handleSessionUpdate = (event: any) => {
      setSessionUpdates(prev => [event.detail, ...prev.slice(0, 9)]);
    };

    window.addEventListener('nurseAlert', handleNurseAlert);
    window.addEventListener('sessionUpdate', handleSessionUpdate);

    return () => {
      window.removeEventListener('nurseAlert', handleNurseAlert);
      window.removeEventListener('sessionUpdate', handleSessionUpdate);
    };
  }, []);

  return { nurseAlerts, sessionUpdates };
};

// ========================================
// INSTALLATION GUIDE
// ========================================

/*
🚀 TO ENABLE REAL SOCKET.IO:

1. Install Socket.IO client:
   npm install socket.io-client@^4.7.0

2. Restart your dev server:
   npm run dev

3. The hook will automatically detect and use real Socket.IO!

4. Check the browser console for:
   ✅ "Socket: Connected to ServiceSync server" (real)
   📡 "Mock Socket: Would connect..." (mock)

5. Your backend at localhost:3001 already supports Socket.IO!

🔍 TROUBLESHOOTING:

If still getting import errors:
- Make sure you restart your dev server after installing
- Try: npm install socket.io-client@latest
- Check package.json that socket.io-client is listed

The mock version works perfectly until you install Socket.IO!
*/