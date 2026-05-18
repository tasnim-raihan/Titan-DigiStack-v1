import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Message {
  id: string;
  senderId: string;
  senderRole: 'customer' | 'admin';
  senderName: string;
  content: string;
  createdAt: any;
}

export interface ChatSession {
  id: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  userName?: string;
}

interface SupportContextType {
  isOpen: boolean;
  chatId: string | null;
  messages: Message[];
  activeChats: ChatSession[];
  selectedAdminChatId: string | null;
  isAdminMode: boolean;
  loading: boolean;
  unreadCount: number;
  userName: string;
  toggleTerminal: () => void;
  sendMessage: (content: string) => Promise<void>;
  toggleAdminMode: () => void;
  selectAdminChat: (id: string) => void;
  closeChat: (id: string) => Promise<void>;
  setUserName: (name: string) => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<ChatSession[]>([]);
  const [selectedAdminChatId, setSelectedAdminChatId] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserNameState] = useState<string>('');

  // 1. Initialize user details (stored in localStorage for guest persistence)
  useEffect(() => {
    const cachedName = localStorage.getItem('titan_support_username');
    if (cachedName) {
      setUserNameState(cachedName);
    } else {
      const randId = Math.floor(1000 + Math.random() * 9000);
      const generatedName = `Guest #${randId}`;
      localStorage.setItem('titan_support_username', generatedName);
      setUserNameState(generatedName);
    }

    const cachedChatId = localStorage.getItem('titan_support_chat_id');
    if (cachedChatId) {
      setChatId(cachedChatId);
    }
  }, []);

  const setUserName = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem('titan_support_username', trimmed);
      setUserNameState(trimmed);
    }
  };

  // 2. Track real-time message stream for the active customer chat
  useEffect(() => {
    if (isAdminMode || !chatId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        msgs.push({
          id: docSnapshot.id,
          senderId: data.senderId || '',
          senderRole: data.senderRole || 'customer',
          senderName: data.senderName || 'Anonymous',
          content: data.content || '',
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        });
      });
      setMessages(msgs);
      setLoading(false);

      // Increment unread count if the terminal console is currently closed
      if (!isOpen && msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.senderRole === 'admin') {
          setUnreadCount((prev) => prev + 1);
        }
      }
    }, (error) => {
      console.error('Error fetching chat messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, isAdminMode, isOpen]);

  // 3. Track all support sessions for the Admin Panel
  useEffect(() => {
    if (!isAdminMode) {
      setActiveChats([]);
      return;
    }

    setLoading(true);
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsList: ChatSession[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        chatsList.push({
          id: docSnapshot.id,
          status: data.status || 'active',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
          lastMessage: data.lastMessage || 'No messages yet.',
          userName: data.userName || 'Guest User'
        });
      });
      setActiveChats(chatsList);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to support chats:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdminMode]);

  // 4. Track real-time message stream for the active Admin selected chat
  useEffect(() => {
    if (!isAdminMode || !selectedAdminChatId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const messagesRef = collection(db, 'chats', selectedAdminChatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        msgs.push({
          id: docSnapshot.id,
          senderId: data.senderId || '',
          senderRole: data.senderRole || 'customer',
          senderName: data.senderName || 'Anonymous',
          content: data.content || '',
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        });
      });
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching admin chat messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedAdminChatId, isAdminMode]);

  // 5. Reset unread badges when terminal toggled open
  const toggleTerminal = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setUnreadCount(0);
      }
      return nextState;
    });
  };

  const toggleAdminMode = () => {
    setIsAdminMode((prev) => !prev);
    setMessages([]);
    setSelectedAdminChatId(null);
  };

  const selectAdminChat = (id: string) => {
    setSelectedAdminChatId(id);
  };

  // 6. Primary Action: Send Message
  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      const isSendingAsAdmin = isAdminMode;
      const targetChatId = isSendingAsAdmin ? selectedAdminChatId : chatId;

      // Determine sender identities
      const senderId = isSendingAsAdmin ? 'admin_dashboard' : (localStorage.getItem('titan_support_userid') || 'customer_user');
      const senderRole = isSendingAsAdmin ? 'admin' : 'customer';
      const senderName = isSendingAsAdmin ? 'Admin Support' : userName;

      let currentChatId = targetChatId;

      // Create new chat room if customer sends first message and has no session
      if (!isSendingAsAdmin && !currentChatId) {
        const newChatRef = doc(collection(db, 'chats'));
        const newChatId = newChatRef.id;

        const chatSessionData = {
          id: newChatId,
          status: 'active',
          userName: userName,
          lastMessage: trimmed,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(newChatRef, chatSessionData);
        localStorage.setItem('titan_support_chat_id', newChatId);
        setChatId(newChatId);
        currentChatId = newChatId;
      }

      if (!currentChatId) {
        throw new Error('No active chat session available.');
      }

      // Add actual message document to Firestore
      const messagesRef = collection(db, 'chats', currentChatId, 'messages');
      await addDoc(messagesRef, {
        senderId,
        senderRole,
        senderName,
        content: trimmed,
        createdAt: serverTimestamp()
      });

      // Update parent chat session metrics
      const chatRef = doc(db, 'chats', currentChatId);
      await updateDoc(chatRef, {
        lastMessage: trimmed,
        userName: isSendingAsAdmin ? undefined : userName, // Preserve name changes
        updatedAt: new Date().toISOString()
      });

    } catch (err) {
      console.error('Failed to send message: ', err);
    }
  };

  // 7. Admin Action: Close chat ticket
  const closeChat = async (id: string) => {
    try {
      const chatRef = doc(db, 'chats', id);
      await updateDoc(chatRef, {
        status: 'closed',
        updatedAt: new Date().toISOString()
      });
      if (selectedAdminChatId === id) {
        setSelectedAdminChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to close support session: ', err);
    }
  };

  return (
    <SupportContext.Provider value={{
      isOpen,
      chatId,
      messages,
      activeChats,
      selectedAdminChatId,
      isAdminMode,
      loading,
      unreadCount,
      userName,
      toggleTerminal,
      sendMessage,
      toggleAdminMode,
      selectAdminChat,
      closeChat,
      setUserName
    }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};
