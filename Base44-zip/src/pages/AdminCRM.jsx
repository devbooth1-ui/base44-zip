import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Edit, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CourseLocationPicker from "@/components/admin/CourseLocationPicker";

export default function AdminCRM() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role !== 'admin') {
          toast.error("Access denied - Admin only");
          navigate(createPageUrl("Home"));
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        toast.error("Please log in");
        navigate(createPageUrl("Home"));
      }
    };
    checkAdmin();
  }, [navigate]);
  
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    course_name: "",
    hole_number: "",
    location: "",
    yardage: "",
    entry_fee: 8,
    latitude: "",
    longitude: "",
    geofence_radius: 100,
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    notes: ""
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => base44.entities.Course.list('-created_date', 1000),
    initialData: []
  });

  const saveCourse = useMutation({
    mutationFn: async (data) => {
      if (editingCourse) {
        return await base44.entities.Course.update(editingCourse.id, data);
      }
      return await base44.entities.Course.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-courses']);
      setOpen(false);
      setEditingCourse(null);
      setFormData({
        course_name: "",
        hole_number: "",
        location: "",
        yardage: "",
        entry_fee: 8,
        latitude: "",
        longitude: "",
        geofence_radius: 100,
        contact_name: "",
        contact_phone: "",
        contact_email: "",
        notes: ""
      });
      toast.success(editingCourse ? "Course updated!" : "Course added!");
    }
  });

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      course_name: course.course_name || "",
      hole_number: course.hole_number || "",
      location: course.location || "",
      yardage: course.yardage || "",
      entry_fee: course.entry_fee || 8,
      latitude: course.latitude || "",
      longitude: course.longitude || "",
      geofence_radius: course.geofence_radius || 100,
      contact_name: course.contact_name || "",
      contact_phone: course.contact_phone || "",
      contact_email: course.contact_email || "",
      notes: course.notes || ""
    });
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveCourse.mutate(formData);
  };



  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Course CRM</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Map-based Course Search */}
                <div className="border-b pb-4">
                  <Label className="text-base font-semibold mb-2 block">Search & Select Course Location</Label>
                  <CourseLocationPicker
                    onLocationSelect={(data) => {
                      setFormData({
                        ...formData,
                        course_name: data.course_name || formData.course_name,
                        location: data.location || formData.location,
                        latitude: data.latitude?.toString() || formData.latitude,
                        longitude: data.longitude?.toString() || formData.longitude
                      });
                    }}
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                    geofenceRadius={parseInt(formData.geofence_radius) || 100}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Course Name *</Label>
                    <Input
                      value={formData.course_name}
                      onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Hole Number *</Label>
                    <Input
                      type="number"
                      value={formData.hole_number}
                      onChange={(e) => setFormData({...formData, hole_number: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Location (City, State) *</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Phoenix, AZ"
                      required
                    />
                  </div>
                  <div>
                    <Label>Yardage</Label>
                    <Input
                      type="number"
                      value={formData.yardage}
                      onChange={(e) => setFormData({...formData, yardage: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Entry Fee ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.entry_fee}
                    onChange={(e) => setFormData({...formData, entry_fee: e.target.value})}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Geofencing Settings</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                        placeholder="33.4484"
                        readOnly
                        className="bg-slate-50"
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                        placeholder="-112.0740"
                        readOnly
                        className="bg-slate-50"
                      />
                    </div>
                    <div>
                      <Label>Geofence Radius (meters)</Label>
                      <Input
                        type="number"
                        value={formData.geofence_radius}
                        onChange={(e) => setFormData({...formData, geofence_radius: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Contact Information</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Contact Name</Label>
                      <Input
                        value={formData.contact_name}
                        onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Contact Phone</Label>
                      <Input
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Sales notes, follow-ups, special requirements..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saveCourse.isPending}>
                    {saveCourse.isPending ? "Saving..." : editingCourse ? "Update Course" : "Add Course"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setOpen(false);
                    setEditingCourse(null);
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-slate-900" />
          </div>
        ) : (
          <div className="grid gap-4">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{course.course_name} - Hole #{course.hole_number}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(course)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{course.location}</span>
                      </div>
                      {course.yardage && (
                        <div className="text-slate-600">Yardage: {course.yardage} yards</div>
                      )}
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <span>Entry Fee: ${course.entry_fee}</span>
                      </div>
                      {course.latitude && course.longitude && (
                        <div className="text-xs text-slate-500">
                          GPS: {course.latitude}, {course.longitude} (Radius: {course.geofence_radius}m)
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {course.contact_name && (
                        <div><strong>Contact:</strong> {course.contact_name}</div>
                      )}
                      {course.contact_phone && (
                        <div><strong>Phone:</strong> {course.contact_phone}</div>
                      )}
                      {course.contact_email && (
                        <div><strong>Email:</strong> {course.contact_email}</div>
                      )}
                      {course.notes && (
                        <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                          <strong>Notes:</strong> {course.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}