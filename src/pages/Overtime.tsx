import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import {
    Clock,
    Plus,
    Check,
    X,
    AlertCircle,
    Calendar,
    Briefcase
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface OvertimeRequest {
    id: string;
    date: string;
    hours: number;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    remarks?: string;
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export default function Overtime() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("my-overtime");

    const [myRequests, setMyRequests] = useState<OvertimeRequest[]>([]);
    const [teamRequests, setTeamRequests] = useState<OvertimeRequest[]>([]);

    const [newDate, setNewDate] = useState("");
    const [newHours, setNewHours] = useState("");
    const [newReason, setNewReason] = useState("");
    const [createOpen, setCreateOpen] = useState(false);

    const [approveRemarks, setApproveRemarks] = useState("");
    const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
    const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null);

    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ totalHoursMonth: 0, pending: 0, approved: 0 });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchMyRequests = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/overtime/my`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMyRequests(data);
                calculateSummary(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTeamRequests = async () => {
        if (user?.role !== "manager") return;
        try {
            const res = await fetch(`${API_BASE_URL}/overtime/pending`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTeamRequests(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const calculateSummary = (data: OvertimeRequest[]) => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        let totalHours = 0;
        let pending = 0;
        let approved = 0;

        data.forEach(req => {
            const d = new Date(req.date);
            if (d.getMonth() === thisMonth && d.getFullYear() === thisYear && req.status === "APPROVED") {
                totalHours += req.hours;
            }
            if (req.status === "PENDING") pending++;
            if (req.status === "APPROVED") approved++;
        });

        setSummary({ totalHoursMonth: totalHours, pending, approved });
    };

    useEffect(() => {
        fetchMyRequests();
        if (user?.role === "manager") {
            fetchTeamRequests();
        }
    }, [user, activeTab]);

    const handleSubmit = async () => {
        if (!newDate || !newHours || !newReason) {
            toast({ title: "Error", description: "All fields are required", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/overtime`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ date: newDate, hours: newHours, reason: newReason })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to submit");
            }

            toast({ title: "Submitted", description: "Overtime request submitted!" });
            setCreateOpen(false);
            setNewDate("");
            setNewHours("");
            setNewReason("");
            fetchMyRequests();
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!selectedRequest || !actionType) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/overtime/${selectedRequest.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ status: actionType, remarks: approveRemarks })
            });

            if (!res.ok) throw new Error("Failed");

            toast({ title: "Success", description: `Request ${actionType.toLowerCase()}` });
            setSelectedRequest(null);
            setActionType(null);
            setApproveRemarks("");
            fetchTeamRequests();
        } catch (err) {
            toast({ title: "Error", description: "Action failed", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
            case "REJECTED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
            default: return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0000cc]">Overtime Tracking</h1>
                        <p className="text-gray-500">Manage your extra hours</p>
                    </div>
                    {activeTab === "my-overtime" && (
                        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#0000cc] hover:bg-[#0000cc]/90 text-white gap-2">
                                    <Plus className="h-4 w-4" /> Log Overtime
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Log Overtime</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Hours</Label>
                                        <Input type="number" step="0.5" min="0.5" value={newHours} onChange={e => setNewHours(e.target.value)} placeholder="e.g. 2.5" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reason</Label>
                                        <Textarea value={newReason} onChange={e => setNewReason(e.target.value)} placeholder="Why was overtime needed?" />
                                    </div>
                                    <Button onClick={handleSubmit} disabled={loading} className="w-full bg-[#0000cc]">
                                        {loading ? "Submitting..." : "Submit Request"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="my-overtime" className="gap-2">
                            <Clock className="h-4 w-4" /> My Overtime
                        </TabsTrigger>
                        {user?.role === "manager" && (
                            <TabsTrigger value="team-requests" className="gap-2">
                                <Briefcase className="h-4 w-4" /> Team Requests
                                {teamRequests.length > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">{teamRequests.length}</span>
                                )}
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="my-overtime" className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">This Month</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{summary.totalHoursMonth.toFixed(1)} <span className="text-xs font-normal text-gray-500">hrs</span></div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending Requests</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold text-yellow-600">{summary.pending}</div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Approved Requests</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold text-green-600">{summary.approved}</div></CardContent>
                            </Card>
                        </div>

                        {/* Recent History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Overtime History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {myRequests.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">No overtime records found.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {myRequests.map((req) => (
                                            <div key={req.id} className="flex justify-between items-center p-4 border rounded-lg bg-white shadow-sm">
                                                <div className="flex gap-4 items-center">
                                                    <div className="bg-blue-50 p-2 rounded-full"><Clock className="h-5 w-5 text-[#0000cc]" /></div>
                                                    <div>
                                                        <div className="font-semibold">{req.hours} Hours</div>
                                                        <div className="text-sm text-gray-500 flex gap-2">
                                                            <span>{new Date(req.date).toLocaleDateString()}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span>{req.reason}</span>
                                                        </div>
                                                        {req.remarks && <div className="text-xs text-red-500 mt-1">Remark: {req.remarks}</div>}
                                                    </div>
                                                </div>
                                                <div>{getStatusBadge(req.status)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="team-requests">
                        {teamRequests.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                                <Check className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-20" />
                                <p>All caught up! No pending requests.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {teamRequests.map((req) => (
                                    <Card key={req.id}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg">{req.user?.email}</h3>
                                                    <div className="text-gray-500 text-sm mb-2">{req.user?.role}</div>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <Badge variant="outline" className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(req.date).toLocaleDateString()}</Badge>
                                                        <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> {req.hours} Hours</Badge>
                                                    </div>
                                                    <p className="mt-3 text-gray-700 bg-gray-50 p-3 rounded-md">{req.reason}</p>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Button variant="outline" className="border-green-200 hover:bg-green-50 text-green-700" onClick={() => { setSelectedRequest(req); setActionType("APPROVED"); }}>
                                                        <Check className="h-4 w-4 mr-2" /> Approve
                                                    </Button>
                                                    <Button variant="outline" className="border-red-200 hover:bg-red-50 text-red-700" onClick={() => { setSelectedRequest(req); setActionType("REJECTED"); }}>
                                                        <X className="h-4 w-4 mr-2" /> Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Approval Dialog */}
                <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{actionType === "APPROVED" ? "Approve Overtime" : "Reject Overtime"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p>
                                You are about to <span className="font-bold">{actionType?.toLowerCase()}</span> {selectedRequest?.hours} hours overtime for {selectedRequest?.user?.email}.
                            </p>
                            <div className="space-y-2">
                                <Label>Remarks (Optional)</Label>
                                <Textarea value={approveRemarks} onChange={e => setApproveRemarks(e.target.value)} placeholder="Add a note..." />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                                <Button className={actionType === "APPROVED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} onClick={handleAction} disabled={loading}>
                                    Confirm {actionType === "APPROVED" ? "Approval" : "Rejection"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}
