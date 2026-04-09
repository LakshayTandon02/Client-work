import * as React from "react";
import { useState, useEffect } from "react";
import { db, collection, addDoc, serverTimestamp, onSnapshot, query, where, OperationType, handleFirestoreError } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Quote, User, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Testimonial {
  id: string;
  patientName: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: any;
}

import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Testimonials() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTestimonial, setNewTestimonial] = useState({
    patientName: "",
    content: "",
    rating: 5,
  });

  useEffect(() => {
    if (user) {
      setNewTestimonial(prev => ({ ...prev, patientName: user.displayName || "" }));
    }
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), where("isApproved", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimonial[];
      setTestimonials(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "testimonials");
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to share your story");
      navigate("/auth", { state: { from: location } });
      return;
    }
    try {
      await addDoc(collection(db, "testimonials"), {
        ...newTestimonial,
        patientUid: user.uid,
        isApproved: false, // Needs admin approval
        createdAt: serverTimestamp(),
      });
      toast.success("Thank you! Your testimonial has been submitted for review.");
      setIsModalOpen(false);
      setNewTestimonial({ patientName: user.displayName || "", content: "", rating: 5 });
    } catch (error) {
      toast.error("Failed to submit testimonial. Please try again.");
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Patient Stories</h2>
            <p className="mt-2 text-slate-600">Real experiences from people who trusted us with their care.</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger render={<Button className="rounded-full" />}>
              <Plus className="mr-2 h-4 w-4" /> Share Your Story
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    value={newTestimonial.patientName}
                    onChange={(e) => setNewTestimonial({...newTestimonial, patientName: e.target.value})}
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                        className={cn(
                          "p-1 rounded-full transition-colors",
                          newTestimonial.rating >= star ? "text-yellow-400" : "text-slate-300"
                        )}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Your Story</Label>
                  <Textarea 
                    id="content" 
                    value={newTestimonial.content}
                    onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                    placeholder="Tell us about your experience..." 
                    className="min-h-[120px]"
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">Submit for Review</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {testimonials.map((t, index) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote className="h-12 w-12 text-primary" />
                    </div>
                    <CardHeader>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "h-4 w-4", 
                              i < t.rating ? "text-yellow-400 fill-current" : "text-slate-200"
                            )} 
                          />
                        ))}
                      </div>
                      <CardTitle className="text-lg italic font-medium leading-relaxed">
                        "{t.content}"
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{t.patientName}</p>
                        <p className="text-xs text-slate-500">Verified Patient</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
            <Quote className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900">No testimonials yet</h3>
            <p className="text-slate-500 mt-2">Be the first to share your experience with us!</p>
          </div>
        )}
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
import { Textarea as TextareaComponent } from "@/components/ui/textarea";

// Need to ensure Textarea is available
