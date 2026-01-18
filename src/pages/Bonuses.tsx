import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import {
    Gift,
    Plus,
    Check,
    Calendar,
    DollarSign,
    Download
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface User {
    id: string;
    name: string;
    role: string;
}

interface Bonus {
    id: string;
    amount: number;
    reason: string;
    period: string;
    type: "PERFORMANCE" | "FESTIVAL" | "SPOT" | "CUSTOM";
    status: "PENDING" | "APPROVED";
    userId: string;
    user?: {
        name: string;
        email: string;
        Employee?: { name: string }[];
    };
    approver?: {
        email: string;
    };
    createdAt: string;
}

export default function Bonuses() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("my-bonuses");
    const [bonuses, setBonuses] = useState<Bonus[]>([]);
    const [manageBonuses, setManageBonuses] = useState<Bonus[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);

    // Create Form State
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("PERFORMANCE");
    const [period, setPeriod] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ totalApproved: 0, totalPending: 0, totalAllocated: 0, pendingCount: 0 });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (activeTab === "my-bonuses") {
            fetchMyBonuses();
        } else if (activeTab === "manage-bonuses" && user?.role === "manager") {
            fetchManageData();
        }
    }, [activeTab, user]);

    const fetchMyBonuses = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/bonuses/my`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) setBonuses(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchManageData = async () => {
        try {
            const [bonusRes, empRes, statsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/bonuses/all`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
                fetch(`${API_BASE_URL}/bonuses/candidates`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
                fetch(`${API_BASE_URL}/bonuses/stats`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            ]);

            if (bonusRes.ok) setManageBonuses(await bonusRes.json());
            if (empRes.ok) {
                const data = await empRes.json();
                // Check if data is array (candidates endpoint) or object with employees (legacy endpoint)
                setEmployees(Array.isArray(data) ? data : (data.employees || []));
            }
            if (statsRes.ok) setStats(await statsRes.json());

        } catch (err) { console.error(err); }
    };

    const handleAssign = async () => {
        if (!selectedEmployee || !amount || !period || !reason) {
            toast({ title: "Error", description: "All fields are required", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/bonuses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ userId: selectedEmployee, amount, type, reason, period })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to assign bonus");
            }

            toast({ title: "Success", description: "Bonus assigned!" });
            setCreateOpen(false);
            setReason(""); setAmount(""); setSelectedEmployee("");
            fetchManageData();
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to assign bonus", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/bonuses/${id}/approve`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) throw new Error("Failed");

            toast({ title: "Approved", description: "Bonus approved successfully" });
            fetchManageData();
        } catch (err) {
            toast({ title: "Error", description: "Failed to approve", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        return status === "APPROVED"
            ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
            : <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0000cc]">Bonuses & Incentives</h1>
                        <p className="text-gray-500">View and manage employee rewards</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="my-bonuses" className="gap-2">
                            <Gift className="h-4 w-4" /> My Bonuses
                        </TabsTrigger>
                        {user?.role === "manager" && (
                            <TabsTrigger value="manage-bonuses" className="gap-2">
                                <DollarSign className="h-4 w-4" /> Manage Bonuses
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="my-bonuses">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Earned</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        ${bonuses.filter(b => b.status === "APPROVED").reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-400">Approved funds</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending Bonuses</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        ${bonuses.filter(b => b.status === "PENDING").reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-400">Awaiting approval</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader><CardTitle>Bonus History</CardTitle></CardHeader>
                            <CardContent>
                                {bonuses.length === 0 ? <p className="text-gray-500">No bonuses received yet.</p> : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Reason</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bonuses.map(b => (
                                                <TableRow key={b.id}>
                                                    <TableCell>{new Date(b.period).toLocaleDateString()}</TableCell>
                                                    <TableCell><Badge variant="outline">{b.type}</Badge></TableCell>
                                                    <TableCell className="font-bold text-green-600">${b.amount}</TableCell>
                                                    <TableCell>{b.reason}</TableCell>
                                                    <TableCell>{getStatusBadge(b.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="manage-bonuses">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4">
                                <Card className="w-48">
                                    <CardContent className="p-4 pt-4">
                                        <div className="text-sm text-gray-500">Total Given</div>
                                        <div className="text-2xl font-bold text-[#0000cc]">${(stats.totalAllocated || 0).toLocaleString()}</div>
                                        <p className="text-[10px] text-gray-400 mt-1">Incl. ${(stats.totalPending || 0).toLocaleString()} pending</p>
                                    </CardContent>
                                </Card>
                                <Card className="w-48">
                                    <CardContent className="p-4 pt-4">
                                        <div className="text-sm text-gray-500">Approved</div>
                                        <div className="text-2xl font-bold text-green-600">${(stats.totalApproved || 0).toLocaleString()}</div>
                                    </CardContent>
                                </Card>
                            </div>
                            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#0000cc] text-white gap-2">
                                        <Plus className="h-4 w-4" /> Assign Bonus
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Assign Bonus</DialogTitle></DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Employee</Label>
                                            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                                <SelectContent className="max-h-[300px]">
                                                    {employees.map(e => (
                                                        <SelectItem key={e.id} value={e.userId}>{e.name} ({e.role})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Amount ($)</Label>
                                                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Type</Label>
                                                <Select value={type} onValueChange={setType}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PERFORMANCE">Performance</SelectItem>
                                                        <SelectItem value="FESTIVAL">Festival</SelectItem>
                                                        <SelectItem value="SPOT">Spot</SelectItem>
                                                        <SelectItem value="CUSTOM">Custom</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Period</Label>
                                            <Input type="date" value={period} onChange={e => setPeriod(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Reason</Label>
                                            <Textarea value={reason} onChange={e => setReason(e.target.value)} />
                                        </div>
                                        <Button onClick={handleAssign} disabled={loading} className="w-full bg-[#0000cc]">
                                            {loading ? "Assigning..." : "Assign Bonus"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Card>
                            <CardHeader><CardTitle>All Bonuses</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {manageBonuses.map(b => (
                                            <TableRow key={b.id}>
                                                <TableCell className="font-medium">
                                                    {b.user?.Employee?.[0]?.name || b.user?.name || b.user?.email || "Unknown"}
                                                </TableCell>
                                                <TableCell>{new Date(b.period).toLocaleDateString()}</TableCell>
                                                <TableCell><Badge variant="outline">{b.type}</Badge></TableCell>
                                                <TableCell>${b.amount}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">{b.reason}</TableCell>
                                                <TableCell>{getStatusBadge(b.status)}</TableCell>
                                                <TableCell>
                                                    {b.status === "PENDING" && (
                                                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleApprove(b.id)}>
                                                            <Check className="h-4 w-4 mr-1" /> Approve
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}
