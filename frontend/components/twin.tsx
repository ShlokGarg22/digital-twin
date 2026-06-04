'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function Twin() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    session_id: sessionId || undefined,
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();

            if (!sessionId) {
                setSessionId(data.session_id);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            // Add error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#fdfbf7] border-2 border-slate-800 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[4px_4px_0px_#1e293b] p-[2px] transition-all">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="text-center text-slate-800 mt-12 font-medium">
                        <p className="text-2xl transform -rotate-1 inline-block">Hello! I&apos;m your Digital Twin.</p>
                        <p className="text-lg mt-2 opacity-70 transform rotate-1 inline-block">Ask me anything!</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-3 border-2 border-slate-800 text-slate-800 shadow-[2px_2px_0px_#1e293b] ${
                                message.role === 'user'
                                    ? 'bg-[#e2e8f0] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] transform rotate-1'
                                    : 'bg-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transform -rotate-1'
                            }`}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className="text-[10px] mt-2 opacity-50">
                                {message.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="px-4 py-3 bg-white border-2 border-slate-800 text-slate-800 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[2px_2px_0px_#1e293b] transform -rotate-1">
                            <div className="flex space-x-2 items-center h-full">
                                <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-transparent mt-auto">
                <div className="flex gap-3 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border-2 border-slate-800 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] focus:outline-none focus:ring-0 text-slate-800 bg-white placeholder-slate-400 shadow-[2px_2px_0px_#1e293b]"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="px-6 py-3 bg-white border-2 border-slate-800 text-slate-800 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] hover:bg-slate-50 focus:outline-none disabled:opacity-50 transition-all active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_#1e293b] font-medium flex items-center justify-center gap-2 transform hover:-rotate-2"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}