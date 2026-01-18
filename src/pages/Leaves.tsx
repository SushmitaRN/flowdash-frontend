import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

const LeaveStatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
        APPROVED: "bg-green-100 text-green-800 hover:bg-green-100/80",
        REJECTED: "bg-red-100 text-red-800 hover:bg-red-100/80",
    };
    return <Badge className={`${colors[status] || "bg-gray-100"} border-none`}>{status}</Badge>;
};

export default function Leaves() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const getToken = () => localStorage.getItem("token");

    const fetchMyLeaves = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leaves/my`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch leaves");
        return res.json();
    };

    const fetchPendingLeaves = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leaves/pending`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch pending leaves");
        return res.json();
    };

    const applyLeaveMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leaves`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to apply");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myLeaves"] });
            setIsOpen(false);
            toast.success("Leave application submitted");
        },
        onError: (err: any) => toast.error(err.message),
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leaves/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingLeaves"] });
            toast.success("Leave status updated");
        },
        onError: (err: any) => toast.error(err.message),
    });

    // --- Queries ---
    const { data: myLeaves, isLoading: myLoading } = useQuery({
        queryKey: ["myLeaves"],
        queryFn: fetchMyLeaves,
    });

    const isManager = ["MANAGER", "PROJECT_MANAGER"].includes((user?.role || "").toUpperCase());

    const { data: pendingLeaves, isLoading: pendingLoading } = useQuery({
        queryKey: ["pendingLeaves"],
        queryFn: fetchPendingLeaves,
        enabled: isManager,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        applyLeaveMutation.mutate({
            type: formData.get("type"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            reason: formData.get("reason"),
        });
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
                </div>

                <Tabs defaultValue="my-leaves" className="w-full">
                    <TabsList>
                        <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>
                        {isManager && (
                            <TabsTrigger value="team-requests">Team Requests</TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="my-leaves" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>My Leave History</CardTitle>
                                    <CardDescription>View your past and current leave requests.</CardDescription>
                                </div>
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Apply for Leave</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Apply for Leave</DialogTitle>
                                            <DialogDescription>Fill out the form below to request leave.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="type">Leave Type</Label>
                                                <Select name="type" required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SICK">Sick Leave</SelectItem>
                                                        <SelectItem value="CASUAL">Casual Leave</SelectItem>
                                                        <SelectItem value="EARNED">Earned Leave</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="startDate">Start Date</Label>
                                                    <Input type="date" name="startDate" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="endDate">End Date</Label>
                                                    <Input type="date" name="endDate" required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="reason">Reason</Label>
                                                <Textarea name="reason" placeholder="Reason for leave..." required />
                                            </div>
                                            <Button type="submit" className="w-full" disabled={applyLeaveMutation.isPending}>
                                                {applyLeaveMutation.isPending ? "Submitting..." : "Submit Request"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {myLoading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Start Date</TableHead>
                                                <TableHead>End Date</TableHead>
                                                <TableHead>Reason</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {myLeaves?.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center">No leave requests found.</TableCell>
                                                </TableRow>
                                            )}
                                            {myLeaves?.map((leave: any) => (
                                                <TableRow key={leave.id}>
                                                    <TableCell>{leave.type}</TableCell>
                                                    <TableCell>{format(new Date(leave.startDate), "PP")}</TableCell>
                                                    <TableCell>{format(new Date(leave.endDate), "PP")}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                                                    <TableCell>
                                                        <LeaveStatusBadge status={leave.status} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {isManager && (
                        <TabsContent value="team-requests">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending Requests</CardTitle>
                                    <CardDescription>Manage leave requests from your team.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {pendingLoading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Employee</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Dates</TableHead>
                                                    <TableHead>Reason</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pendingLeaves?.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center">No pending requests.</TableCell>
                                                    </TableRow>
                                                )}
                                                {pendingLeaves?.map((leave: any) => (
                                                    <TableRow key={leave.id}>
                                                        <TableCell>
                                                            <div className="font-medium">{leave.user.Employee[0]?.name || leave.user.email}</div>
                                                            <div className="text-xs text-muted-foreground">{leave.user.email}</div>
                                                        </TableCell>
                                                        <TableCell>{leave.user.Employee[0]?.roleTitle || "N/A"}</TableCell>
                                                        <TableCell><Badge variant="outline">{leave.type}</Badge></TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">
                                                                {format(new Date(leave.startDate), "MMM d")} - {format(new Date(leave.endDate), "MMM d, yyyy")}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate" title={leave.reason}>{leave.reason}</TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatusMutation.mutate({ id: leave.id, status: "APPROVED" })}>
                                                                    Approve
                                                                </Button>
                                                                <Button size="sm" variant="destructive" onClick={() => updateStatusMutation.mutate({ id: leave.id, status: "REJECTED" })}>
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </Layout>
    );
}
