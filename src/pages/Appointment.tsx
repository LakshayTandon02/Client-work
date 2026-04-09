import * as React from "react"
import { useState, useEffect } from "react";
import { departments, doctors } from "@/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, Clock, CheckCircle2, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, collection, addDoc, serverTimestamp, onSnapshot } from "@/firebase";

interface DoctorData {
  id: string;
  name: string;
  departmentId: string;
  isAvailable: boolean;
  consultationFee: number;
}

export default function Appointment() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [dbDoctors, setDbDoctors] = useState<DoctorData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    time: "",
    reason: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Please sign in to book an appointment");
      navigate("/auth", { state: { from: location } });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user, authLoading, navigate, location]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "doctors"), (snapshot) => {
      setDbDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DoctorData)));
    });
    return () => unsub();
  }, []);

  const filteredDoctors = dbDoctors.length > 0 
    ? dbDoctors.filter(doc => doc.departmentId === selectedDept && doc.isAvailable)
    : doctors.filter(doc => doc.departmentId === selectedDept);

  const handleNext = () => {
    if (step === 1 && (!selectedDept || !selectedDoctor || !date)) {
      toast.error("Please fill in all selection fields");
      return;
    }
    if (step === 2 && (!formData.name || !formData.phone || !formData.email || !formData.time || !formData.reason)) {
      toast.error("Please fill in all patient information");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) {
      toast.error("Please provide payment details");
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date and time
      const appointmentDate = new Date(date!);
      const [hours, minutes] = formData.time.split(":");
      const isPM = formData.time.includes("PM");
      let h = parseInt(hours);
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
      appointmentDate.setHours(h, 0, 0, 0);

      await addDoc(collection(db, "appointments"), {
        patientUid: user.uid,
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        departmentId: selectedDept,
        doctorId: doctors.find(d => d.id === selectedDoctor)?.name || selectedDoctor,
        date: appointmentDate.toISOString(),
        reason: formData.reason,
        status: "confirmed",
        paymentStatus: "paid",
        amount: 300,
        createdAt: serverTimestamp(),
      });

      setStep(4);
      toast.success("Appointment booked and payment successful!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-[80vh] bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">Book an Appointment</CardTitle>
                  <CardDescription>Select your preferred department, doctor, and date.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Department</Label>
                        <Select onValueChange={(val) => {
                          setSelectedDept(val);
                          setSelectedDoctor("");
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Select Doctor</Label>
                        <Select
                          disabled={!selectedDept}
                          value={selectedDoctor}
                          onValueChange={setSelectedDoctor}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedDept ? "Choose Doctor" : "Select department first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredDoctors.map(doc => (
                              <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Select Date</Label>
                      <div className="border rounded-md p-2 bg-white flex justify-center">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button size="lg" onClick={handleNext} className="px-10">
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="w-fit mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Selection
                  </Button>
                  <CardTitle className="text-2xl font-bold">Patient Information</CardTitle>
                  <CardDescription>Please provide your contact details and appointment time.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time</Label>
                        <Select
                          required
                          onValueChange={(val) => setFormData({ ...formData, time: val })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Time Slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <textarea
                        id="reason"
                        required
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border space-y-2">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Doctor:</span> {doctors.find(d => d.id === selectedDoctor)?.name}</div>
                        <div><span className="text-slate-500">Department:</span> {departments.find(d => d.id === selectedDept)?.name}</div>
                        <div><span className="text-slate-500">Date:</span> {date ? format(date, "PPP") : ""}</div>
                        <div className="font-bold text-primary"><span className="text-slate-500">Fee:</span> ₹300</div>
                      </div>
                    </div>

                    <Button type="button" onClick={handleNext} className="w-full py-6 text-lg">
                      Proceed to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="w-fit mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Info
                  </Button>
                  <CardTitle className="text-2xl font-bold">Secure Payment</CardTitle>
                  <CardDescription>Complete your booking by paying the consultation fee.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-8 p-6 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Consultation Fee</p>
                      <p className="text-3xl font-bold text-primary">₹300.00</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            required
                            value={paymentData.cardNumber}
                            onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                          />
                          <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required
                            value={paymentData.expiry}
                            onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            maxLength={3}
                            required
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-md">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      Your payment is secured with 256-bit encryption.
                    </div>

                    <Button type="submit" className="w-full py-6 text-lg" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Pay ₹300 & Book Appointment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <Card className="border-none shadow-2xl max-w-lg mx-auto overflow-hidden">
                <div className="h-2 bg-green-500" />
                <CardContent className="pt-12 pb-12 px-8">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h2>
                  <p className="text-slate-600 mb-8">
                    Thank you, {formData.name}. Your appointment with {doctors.find(d => d.id === selectedDoctor)?.name} has been scheduled for {date ? format(date, "MMMM do, yyyy") : ""} at {formData.time}.
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                      A confirmation email has been sent to {formData.email}. Please arrive 15 minutes before your scheduled time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                      <Button render={<Link to="/" />}>
                        Return Home
                      </Button>
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Book Another
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
