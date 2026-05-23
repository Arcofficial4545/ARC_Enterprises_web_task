import { useState, useEffect, useRef } from 'react'
import { collection, addDoc, getDocs, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

const ChatPage = () => {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [activeUser, setActiveUser] = useState(null)
  
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)
  const chatEndRef = useRef(null)

  // Fetch all registered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true)
        const snapshot = await getDocs(collection(db, 'users'))
        const usersList = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          // Exclude current user from chat list
          .filter(u => u.uid !== currentUser?.uid)
        setUsers(usersList)
        if (usersList.length > 0) {
          setActiveUser(usersList[0])
        }
      } catch (err) {
        console.error("Error fetching users:", err)
      } finally {
        setLoadingUsers(false)
      }
    }
    
    if (currentUser) {
      fetchUsers()
    }
  }, [currentUser])

  // Real-time chat listener
  useEffect(() => {
    if (!currentUser || !activeUser) return

    setLoadingMessages(true)
    const roomId = [currentUser.uid, activeUser.uid].sort().join('_')
    
    // Query without orderBy to avoid needing a Firestore index
    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', roomId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Sort in-memory to prevent composite index errors
      msgs.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0
        const timeB = b.createdAt?.seconds || 0
        return timeA - timeB
      })

      setMessages(msgs)
      setLoadingMessages(false)
      
      // Scroll to bottom
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }, (err) => {
      console.error("Firestore chat snapshot error:", err)
      setLoadingMessages(false)
    })

    return unsubscribe
  }, [currentUser, activeUser])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !activeUser) return

    const roomId = [currentUser.uid, activeUser.uid].sort().join('_')
    const messageData = {
      roomId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email.split('@')[0],
      receiverId: activeUser.uid,
      text: newMessage.trim(),
      createdAt: serverTimestamp()
    }

    setNewMessage('')
    try {
      await addDoc(collection(db, 'messages'), messageData)
    } catch (err) {
      console.error("Error sending message:", err)
      alert("Failed to send message.")
    }
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-4 h-[75vh]">
          {/* Users Sidebar */}
          <div className="border-r border-accent/20 bg-secondary/30 flex flex-col h-full col-span-1">
            <div className="p-4 border-b border-accent/20">
              <h2 className="text-xl font-heading text-accent">Active Chats</h2>
              <p className="text-xs text-cream/70 mt-1">Select a registered user to talk to.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loadingUsers ? (
                <p className="text-cream/60 text-sm p-4">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-cream/60 text-sm p-4">No other registered users found.</p>
              ) : (
                users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setActiveUser(u)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeUser?.uid === u.uid ? 'bg-accent/20 border border-accent/50 text-accent font-semibold' : 'hover:bg-cream/5 text-cream border border-transparent'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/30 text-accent flex items-center justify-center font-bold text-sm uppercase">
                      {u.name ? u.name[0] : u.email[0]}
                    </div>
                    <div className="truncate">
                      <p className="text-sm truncate">{u.name || u.email.split('@')[0]}</p>
                      <p className="text-xs text-cream/60 truncate uppercase">{u.role}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex flex-col h-full md:col-span-3">
            {activeUser ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-accent/20 bg-secondary/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold uppercase text-lg">
                    {activeUser.name ? activeUser.name[0] : activeUser.email[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading text-accent">{activeUser.name}</h3>
                    <p className="text-xs text-cream/70">{activeUser.email} ({activeUser.role})</p>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
                  {loadingMessages ? (
                    <div className="text-center py-10">
                      <p className="text-cream/60">Loading chat history...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-20 text-cream/60">
                      <p className="text-lg font-heading mb-1">No Messages Yet</p>
                      <p className="text-xs">Send a message to start the conversation.</p>
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMe = msg.senderId === currentUser?.uid
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-accent text-primary rounded-br-none shadow-md font-medium' : 'glass text-cream rounded-bl-none'}`}>
                            {!isMe && (
                              <p className="text-[10px] text-accent/80 font-bold uppercase mb-1">{msg.senderName}</p>
                            )}
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-primary/70' : 'text-cream/50'}`}>
                              {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Footer Send Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-accent/20 bg-secondary/30 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-grow px-4 py-2.5 rounded bg-secondary border border-accent/40 text-cream focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent text-primary rounded hover:opacity-90 transition font-semibold"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-cream/60">
                <svg className="w-16 h-16 text-accent/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-xl font-heading mb-1 text-accent">Real-Time Messaging</p>
                <p className="text-sm">Select a user from the sidebar list to begin chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
