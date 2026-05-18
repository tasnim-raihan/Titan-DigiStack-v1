import React, { useState, useEffect, useRef } from 'react';
import { useSupport } from '../context/SupportContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, Settings, Terminal, Shield, RefreshCw, Eye } from 'lucide-react';

export const SupportTerminal: React.FC = () => {
  const {
    isOpen,
    chatId,
    messages,
    activeChats,
    selectedAdminChatId,
    isAdminMode,
    loading,
    userName,
    toggleTerminal,
    sendMessage,
    toggleAdminMode,
    selectAdminChat,
    closeChat,
    setUserName
  } = useSupport();

  const [inputVal, setInputVal] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Trap keyboard focus and bind Escape key to toggle closed
  const terminalRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    onClose: toggleTerminal
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    setTempName(userName);
  }, [userName]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    await sendMessage(inputVal);
    setInputVal('');
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      setEditingName(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end font-mono selection:bg-cyan-500 selection:text-black">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={toggleTerminal}
          className="absolute inset-0 bg-black/70 cursor-pointer"
        />

        {/* Support Drawer Body */}
        <motion.div
          ref={terminalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Support Terminal Console"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-[440px] h-full bg-[#080b12] border-l-2 border-cyan-500/30 flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden"
        >
          {/* Header Console */}
          <div className="p-4 bg-[#0a0f1a] border-b border-cyan-500/10 flex items-center justify-between text-[11px] select-none text-white/50">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Terminal size={14} className="animate-pulse" />
              <span>SYS@SUPPORT_TERMINAL:~$</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAdminMode}
                title="Toggle Admin View"
                className="px-2 py-0.5 border border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-400 transition-all rounded-[1px] cursor-pointer text-[10px]"
              >
                {isAdminMode ? 'VISIT CLIENT' : 'ENGAGE ADMIN'}
              </button>
              <button
                onClick={toggleTerminal}
                aria-label="Close terminal"
                className="p-1 hover:text-cyan-400 transition-all cursor-pointer rounded-none active:scale-90"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Staggered System Status Banner */}
          <div className="bg-cyan-950/20 border-b border-cyan-500/10 px-4 py-2 text-[9px] text-cyan-400/70 flex justify-between tracking-wide">
            <span>PING: 22ms</span>
            <span>SECURE ENCRYPTED NODE</span>
            <span>PORT: 3000</span>
          </div>

          {/* SCREEN ANNOUNCEMENTS FOR ACCESSIBILITY */}
          <div aria-live="polite" className="sr-only">
            {messages.length > 0 ? `Message history loaded. Total: ${messages.length} messages.` : 'No messages in chat.'}
          </div>

          {/* Mode Switcher Views */}
          {!isAdminMode ? (
            /* ========================================== */
            /* CUSTOMER PERSPECTIVE                       */
            /* ========================================== */
            <div className="flex-grow flex flex-col min-h-0">
              {/* Customer Display Name Editor */}
              <div className="p-3 bg-[#0d1323]/50 border-b border-cyan-500/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white/80">
                  <User size={13} className="text-cyan-400" />
                  {editingName ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      maxLength={18}
                      className="bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 text-xs font-mono focus:outline-none focus:border-cyan-400 rounded-none w-32"
                    />
                  ) : (
                    <span>NODE: <strong className="text-cyan-400 font-black">{userName}</strong></span>
                  )}
                </div>

                {editingName ? (
                  <button
                    onClick={handleNameSave}
                    className="text-[10px] text-cyan-400 hover:text-white uppercase font-bold border border-cyan-500/20 px-2 py-0.5 rounded-[1px] cursor-pointer"
                  >
                    Set
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-[10px] text-white/40 hover:text-cyan-400 uppercase font-light cursor-pointer underline"
                  >
                    Edit Alias
                  </button>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-cyan-500/10">
                {/* Connection welcome message */}
                <div className="text-[10px] text-white/30 space-y-1 p-2 bg-cyan-950/5 border border-cyan-500/5">
                  <p className="text-cyan-400/60 font-bold uppercase tracking-widest text-[9px] mb-1">System Diagnostic Initialized</p>
                  <p>&gt; Type your query below to alert our operator nodes.</p>
                  <p>&gt; We routinely answer questions about WordPress themes, Elementor pages, Astra Pro license activations, and midjourney/creative subscriptions.</p>
                </div>

                {loading && (
                  <div className="flex justify-center items-center py-4 text-cyan-400 text-xs gap-2 select-none">
                    <RefreshCw size={12} className="animate-spin" />
                    <span>SYNCHRONIZING CONSOLE STREAM...</span>
                  </div>
                )}

                {messages.map((msg) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${isAdmin ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                    >
                      {/* Sender Alias & Date */}
                      <span className="text-[9px] text-white/40 mb-1 flex gap-2 tracking-wider">
                        <span>{msg.senderName}</span>
                        <span>{msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>

                      {/* Chat text box */}
                      <div
                        className={`px-3 py-2 text-xs font-mono leading-relaxed border ${
                          isAdmin
                            ? 'bg-[#0b172b] border-cyan-500/20 text-cyan-400 rounded-none shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                            : 'bg-[#121929] border-white/10 text-white rounded-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Console Input Footer */}
              <form onSubmit={handleSend} className="p-3 bg-[#0a0f1a] border-t border-cyan-500/10 flex gap-2">
                <div className="flex-grow bg-[#0c1222] border border-cyan-500/20 focus-within:border-cyan-400 flex items-center px-3 py-2 text-xs">
                  <span className="text-cyan-400 select-none mr-2 font-bold animate-pulse">$</span>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Type message console prompt..."
                    className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-cyan-400 placeholder-cyan-900/60 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Send support query"
                  className="px-3 bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 transition-all select-none rounded-[1px] flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>
          ) : (
            /* ========================================== */
            /* ADMIN VIEW (SIMULATION)                    */
            /* ========================================== */
            <div className="flex-grow flex flex-col min-h-0">
              <div className="flex-grow flex min-h-0">
                {/* Sidebar chat queue */}
                <div className="w-[140px] border-r border-cyan-500/10 flex flex-col bg-[#070a12] select-none text-[10px]">
                  <div className="p-2 border-b border-cyan-500/10 bg-cyan-950/10 font-bold uppercase tracking-wider text-cyan-400 text-center">
                    Queue Tickets
                  </div>
                  <div className="flex-grow overflow-y-auto divide-y divide-cyan-500/5">
                    {activeChats.length === 0 && (
                      <div className="p-4 text-center text-white/20 italic">No tickets active.</div>
                    )}
                    {activeChats.map((c) => {
                      const isSelected = selectedAdminChatId === c.id;
                      const isClosed = c.status === 'closed';
                      return (
                        <button
                          key={c.id}
                          onClick={() => selectAdminChat(c.id)}
                          className={`w-full text-left p-2.5 flex flex-col gap-1 transition-all cursor-pointer ${
                            isSelected ? 'bg-cyan-950/30 text-cyan-400 font-bold border-l-2 border-cyan-400' : 'text-white/60 hover:bg-cyan-950/10 hover:text-white'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="truncate max-w-[85px]">{c.userName}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${isClosed ? 'bg-white/20' : 'bg-[#06b6d4]'}`} />
                          </div>
                          <span className="truncate text-[8px] text-white/30">{c.lastMessage}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Active Admin Chat Workspace */}
                <div className="flex-grow flex flex-col min-h-0 bg-[#080d16]/30">
                  {selectedAdminChatId ? (
                    <div className="flex-grow flex flex-col min-h-0">
                      {/* Ticket header actions */}
                      <div className="p-2 border-b border-cyan-500/10 bg-[#090e1a] flex items-center justify-between text-[10px] text-cyan-400 select-none">
                        <span>TICKET ACTIVE: #{selectedAdminChatId.slice(0, 5).toUpperCase()}</span>
                        <button
                          onClick={() => closeChat(selectedAdminChatId)}
                          className="px-2 py-0.5 border border-cyan-500/20 hover:border-red-400 hover:text-red-400 transition-all rounded-[1.5px] cursor-pointer"
                        >
                          CLOSE
                        </button>
                      </div>

                      {/* Messages frame */}
                      <div className="flex-grow overflow-y-auto p-3 space-y-3 min-h-0">
                        {loading && (
                          <div className="flex justify-center items-center py-4 text-cyan-400 text-[10px] gap-2">
                            <RefreshCw size={10} className="animate-spin" />
                            <span>SYNCING ADMIN WORKSHEET...</span>
                          </div>
                        )}
                        {messages.map((msg) => {
                          const isCustomer = msg.senderRole === 'customer';
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col max-w-[90%] ${isCustomer ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                            >
                              <span className="text-[8px] text-white/30 mb-0.5 flex gap-1.5">
                                <span>{msg.senderName}</span>
                                <span>{msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </span>
                              <div
                                className={`px-2.5 py-1.5 text-[11px] font-mono leading-relaxed border ${
                                  isCustomer
                                    ? 'bg-[#111929] border-white/10 text-white rounded-none'
                                    : 'bg-[#091526] border-cyan-500/20 text-cyan-400 rounded-none'
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Admin Message submit footer */}
                      <form onSubmit={handleSend} className="p-2.5 bg-[#0a0f1a] border-t border-cyan-500/10 flex gap-2">
                        <div className="flex-grow bg-[#0c1222] border border-cyan-500/20 focus-within:border-cyan-400 flex items-center px-2 py-1.5 text-xs">
                          <span className="text-cyan-400 select-none mr-2 font-bold animate-pulse">&gt;</span>
                          <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            placeholder="Type admin answer prompt..."
                            className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-cyan-400 placeholder-cyan-900/60 font-mono text-[11px]"
                          />
                        </div>
                        <button
                          type="submit"
                          aria-label="Send admin reply"
                          className="px-2.5 bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 transition-all rounded-[1px] flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          <Send size={11} />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col justify-center items-center text-center text-white/30 p-8 select-none">
                      <Shield size={26} className="text-cyan-500/20 mb-2 animate-pulse" />
                      <p className="text-[10px] font-bold tracking-wider uppercase text-cyan-500/50">Operator Interface Standing By</p>
                      <p className="text-[9px] mt-1 leading-normal">Select an incoming user ticket query node from the left queue queue list to mount chat workspace.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
