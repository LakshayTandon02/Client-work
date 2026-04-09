import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, collection, onSnapshot, query, doc, updateDoc, deleteDoc, OperationType, handleFirestoreError, setDoc, serverTimestamp, addDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Trash2, LogOut, ShieldAlert, Clock, User, FileText, Plus, Calendar as CalendarIcon, Stethoscope, TrendingUp, DollarSign, Users, PieChart as PieChartIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { doctors, departments } from "@/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Logo from "@/components/Logo";

interface DoctorData {
  id: string;
  name: string;
  departmentId: string;
  isAvailable: boolean;
}

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  departmentId: string;
  doctorId: string;
  date: string;
  status: string;
  paymentStatus?: string;
  amount?: number;
  createdAt: any;
}

interface Testimonial {
  id: string;
  patientName: string;
  content: string;
  isApproved: boolean;
  createdAt: any;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [dbDoctors, setDbDoctors] = useState<DoctorData[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    departmentId: "",
    doctorId: "",
    date: "",
    status: "confirmed"
  });

  useEffect(() => {
    console.log("AdminDashboard: isAdmin =", isAdmin, "loading =", loading, "user =", user?.email);
    if (!loading && !isAdmin) {
      navigate("/");
      toast.error("Access denied. Admins only.");
    }
  }, [isAdmin, loading, navigate, user]);

  useEffect(() => {
    if (!isAdmin) return;
    console.log("AdminDashboard: Setting up Firestore listeners...");

    const unsubAppointments = onSnapshot(collection(db, "appointments"), (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "appointments"));

    const unsubTestimonials = onSnapshot(collection(db, "testimonials"), (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[]);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "testimonials"));

    const unsubDoctors = onSnapshot(collection(db, "doctors"), (snapshot) => {
      if (snapshot.empty) {
        // Initialize doctors if collection is empty
        doctors.forEach(async (docData) => {
          await setDoc(doc(db, "doctors", docData.id), {
            name: docData.name,
            departmentId: docData.departmentId,
            isAvailable: true
          });
        });
      } else {
        setDbDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DoctorData)));
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, "doctors"));

    return () => {
      unsubAppointments();
      unsubTestimonials();
      unsubDoctors();
    };
  }, [isAdmin]);

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
      toast.success(`Appointment ${status}`);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const approveTestimonial = async (id: string, isApproved: boolean) => {
    try {
      await updateDoc(doc(db, "testimonials", id), { isApproved });
      toast.success(isApproved ? "Testimonial approved" : "Testimonial hidden");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const deleteItem = async (col: string, id: string) => {
    // Note: In a production app, we would use a custom confirmation dialog here.
    // For now, we proceed with deletion as window.confirm is prohibited in this environment.
    try {
      await deleteDoc(doc(db, col, id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const toggleDoctorAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "doctors", id), {
        isAvailable: !currentStatus
      });
      toast.success("Doctor availability updated");
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const handleAdminBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "appointments"), {
        ...newBooking,
        patientUid: "admin-created",
        paymentStatus: "paid",
        amount: 300,
        createdAt: serverTimestamp(),
      });
      toast.success("Booking created successfully");
      setIsBookingModalOpen(false);
      setNewBooking({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        departmentId: "",
        doctorId: "",
        date: "",
        status: "confirmed"
      });
    } catch (error) {
      toast.error("Failed to create booking");
    }
  };

  // Analytics Calculations
  const calculateAnalytics = () => {
    const totalRevenue = appointments
      .filter(app => app.paymentStatus === 'paid')
      .reduce((sum, app) => sum + (app.amount || 300), 0);

    const revenueByDoctor = doctors.map(doc => {
      const doctorRevenue = appointments
        .filter(app => app.paymentStatus === 'paid' && app.doctorId === doc.name)
        .reduce((sum, app) => sum + (app.amount || 300), 0);
      return { name: doc.name, revenue: doctorRevenue };
    }).filter(d => d.revenue > 0);

    const appointmentsByDept = departments.map(dept => {
      const count = appointments.filter(app => app.departmentId === dept.id).length;
      return { name: dept.name, count };
    }).filter(d => d.count > 0);

    const statusDistribution = [
      { name: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: '#10b981' },
      { name: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: '#f59e0b' },
      { name: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, color: '#ef4444' },
    ].filter(s => s.value > 0);

    return { totalRevenue, revenueByDoctor, appointmentsByDept, statusDistribution };
  };

  const analytics = calculateAnalytics();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="h-10 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user?.displayName}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testimonials.filter(t => !t.isApproved).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admin Status</CardTitle>
              <ShieldAlert className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white border">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
            </TabsList>

            <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
              <DialogTrigger render={<Button className="gap-2" />}>
                <Plus className="h-4 w-4" /> New Booking
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Appointment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdminBooking} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient Name</Label>
                      <Input 
                        required 
                        value={newBooking.patientName}
                        onChange={e => setNewBooking({...newBooking, patientName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input 
                        required 
                        value={newBooking.patientPhone}
                        onChange={e => setNewBooking({...newBooking, patientPhone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      type="email" 
                      required 
                      value={newBooking.patientEmail}
                      onChange={e => setNewBooking({...newBooking, patientEmail: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select 
                        onValueChange={val => setNewBooking({...newBooking, departmentId: val})}
                        value={newBooking.departmentId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Dept" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(d => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor</Label>
                      <Select 
                        onValueChange={val => setNewBooking({...newBooking, doctorId: val})}
                        value={newBooking.doctorId}
                        disabled={!newBooking.departmentId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors
                            .filter(d => d.departmentId === newBooking.departmentId)
                            .map(d => (
                              <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Appointment Date & Time</Label>
                    <Input 
                      type="datetime-local" 
                      required 
                      value={newBooking.date}
                      onChange={e => setNewBooking({...newBooking, date: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full">Create Appointment</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="appointments">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Review and manage patient appointment requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds).map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="font-medium">{app.patientName}</div>
                          <div className="text-xs text-slate-500">{app.patientPhone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{app.date ? format(new Date(app.date), "PPp") : "N/A"}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{app.departmentId}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              "capitalize",
                              app.status === 'confirmed' ? "bg-green-100 text-green-700 hover:bg-green-100" : 
                              app.status === 'cancelled' ? "bg-red-100 text-red-700 hover:bg-red-100" : 
                              "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            )}
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary"
                            className={cn(
                              "capitalize",
                              app.paymentStatus === 'paid' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                            )}
                          >
                            {app.paymentStatus || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => updateAppointmentStatus(app.id, 'confirmed')}>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => updateAppointmentStatus(app.id, 'cancelled')}>
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteItem('appointments', app.id)}>
                              <Trash2 className="h-4 w-4 text-slate-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Revenue by Doctor
                  </CardTitle>
                  <CardDescription>Total earnings from confirmed appointments per doctor.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.revenueByDoctor}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-blue-600" />
                    Appointment Status
                  </CardTitle>
                  <CardDescription>Distribution of appointment statuses.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Appointments by Department
                  </CardTitle>
                  <CardDescription>Volume of patient requests across different medical departments.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.appointmentsByDept} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={100} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Patient Feedback</CardTitle>
                <CardDescription>Approve or hide testimonials for the public website.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{t.patientName}</span>
                          {t.isApproved ? (
                            <Badge className="bg-green-100 text-green-700">Approved</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 italic">"{t.content}"</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={t.isApproved ? "outline" : "default"}
                          onClick={() => approveTestimonial(t.id, !t.isApproved)}
                        >
                          {t.isApproved ? "Hide" : "Approve"}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteItem('testimonials', t.id)}>
                          <Trash2 className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="doctors">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Doctor Availability</CardTitle>
                <CardDescription>View and manage doctor schedules and availability.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dbDoctors.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{doc.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{doc.departmentId}</p>
                        </div>
                      </div>
                      <Button 
                        variant={doc.isAvailable ? "default" : "outline"} 
                        size="sm"
                        className={cn(
                          "h-8 px-3 text-xs",
                          doc.isAvailable ? "bg-green-600 hover:bg-green-700" : "text-slate-500"
                        )}
                        onClick={() => toggleDoctorAvailability(doc.id, doc.isAvailable)}
                      >
                        {doc.isAvailable ? "Available" : "Unavailable"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Table as TableComponent } from "@/components/ui/table";
