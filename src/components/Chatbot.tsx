import { useState, useRef, useEffect } from "react";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { db, collection, addDoc, serverTimestamp } from "@/firebase";
import { toast } from "sonner";
import { doctors, departments } from "@/data";

interface Message {
  role: "user" | "bot";
  content: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const bookAppointmentDeclaration: FunctionDeclaration = {
  name: "bookAppointment",
  description: "Books a medical appointment for the patient. Call this ONLY after you have collected: Patient Name, Phone, Email, Department, Doctor Name, Date, and Time.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      patientName: { type: Type.STRING, description: "Full name of the patient" },
      patientPhone: { type: Type.STRING, description: "Contact phone number" },
      patientEmail: { type: Type.STRING, description: "Email address" },
      departmentId: { type: Type.STRING, description: "ID of the department (e.g., cardiology, neurology)" },
      doctorName: { type: Type.STRING, description: "Name of the doctor selected" },
      appointmentDate: { type: Type.STRING, description: "Date and time in ISO format (e.g., 2024-05-20T10:00:00Z)" },
      reason: { type: Type.STRING, description: "Brief reason for the visit" },
    },
    required: ["patientName", "patientPhone", "patientEmail", "departmentId", "doctorName", "appointmentDate", "reason"],
  },
};

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I'm Kalyani, your hospital's robot assistant. I can help you book an appointment or answer questions. *beep*" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const executeBooking = async (args: any) => {
    if (!user) {
      return "I'm sorry, you must be logged in to book an appointment. Please sign in first. *bzzzt*";
    }

    try {
      await addDoc(collection(db, "appointments"), {
        patientUid: user.uid,
        patientName: args.patientName,
        patientEmail: args.patientEmail,
        patientPhone: args.patientPhone,
        departmentId: args.departmentId,
        doctorId: args.doctorName,
        date: args.appointmentDate,
        reason: args.reason,
        status: "confirmed",
        paymentStatus: "paid", // Chatbot bookings are marked as paid for simplicity in this demo
        amount: 300,
        createdAt: serverTimestamp(),
      });
      
      toast.success("Appointment booked via Kalyani Bot!");
      return `SUCCESS: Appointment confirmed for ${args.patientName} with ${args.doctorName} on ${new Date(args.appointmentDate).toLocaleString()}. The ₹300 fee has been processed. *happy beep*`;
    } catch (error) {
      console.error("Chatbot booking error:", error);
      return "ERROR: My booking module encountered a glitch. Please try again or use the manual booking page. *sad beep*";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: "user", content: userMessage }].map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: `You are a helpful robot assistant for Kalyani Hospital. Your name is Kalyani Bot. 
          
          CAPABILITIES:
          1. Book appointments using the 'bookAppointment' tool.
          2. Provide info on departments: ${departments.map(d => d.name).join(", ")}.
          3. Provide info on doctors: ${doctors.map(d => d.name).join(", ")}.
          
          BOOKING RULES:
          - Every appointment costs ₹300.
          - You MUST collect: Name, Phone, Email, Department, Doctor, Date, and Time before booking.
          - If the user isn't logged in, tell them to sign in first.
          - Once booked, tell the user it will show up in their 'My Bookings' section and the Admin Dashboard.
          
          PERSONA:
          - Be robotic but friendly (*beep*, *boop*, *whirr*).
          - Be efficient and professional.`,
          tools: [{ functionDeclarations: [bookAppointmentDeclaration] }],
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        const call = functionCalls[0];
        if (call.name === "bookAppointment") {
          const result = await executeBooking(call.args);
          setMessages(prev => [...prev, { role: "bot", content: result }]);
        }
      } else {
        const botResponse = response.text || "I'm sorry, my circuits are a bit tangled. *bzzzt*";
        setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: "bot", content: "Error in my communication module. *beep*" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? "auto" : "500px"
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] shadow-2xl"
          >
            <Card className="border-primary/20 overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">Kalyani Bot</CardTitle>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] opacity-80 uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-primary-foreground hover:bg-white/10"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-primary-foreground hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <CardContent 
                    ref={scrollRef}
                    className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50 max-h-[350px]"
                  >
                    {messages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex gap-3 max-w-[85%]",
                          msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                          msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white text-primary border border-primary/10"
                        )}>
                          {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                          "p-3 rounded-2xl text-sm shadow-sm",
                          msg.role === "user" 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 mr-auto max-w-[85%]">
                        <div className="h-8 w-8 rounded-full bg-white text-primary border border-primary/10 flex items-center justify-center shrink-0 shadow-sm">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-white text-slate-700 border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-xs italic">Processing...</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 bg-white border-t">
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                      className="flex w-full gap-2"
                    >
                      <Input 
                        placeholder="Type your question... *beep*" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow"
                        disabled={isLoading}
                      />
                      <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full shadow-xl p-0 relative group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
        </Button>
      </motion.div>
    </div>
  );
}
