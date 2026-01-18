import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"; // Assuming hook exists
import { useAuth } from "./AuthContext";
import {
    Megaphone,
    MessageSquare,
    Pin,
    Trash2,
    Plus,
    Send,
    User,
    Ghost
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Types
interface Announcement {
    id: string;
    title: string;
    message: string;
    isPinned: boolean;
    createdAt: string;
    author: {
        email: string;
        role: string;
    };
    targetAudience?: string;
}

interface Feedback {
    id: string;
    message: string;
    isAnonymous: boolean;
    createdAt: string;
    user?: {
        email: string;
        role: string;
    };
}

export default function CompanyUpdates() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("announcements");

    // Data states
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

    // Form states
    const [createOpen, setCreateOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newPinned, setNewPinned] = useState(false);
    const [targetAudience, setTargetAudience] = useState("ALL");

    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Fetch Data
    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/announcements`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data);
            }
        } catch (err) {
            console.error("Failed to fetch announcements", err);
        }
    };

    const fetchFeedback = async () => {
        if (user?.role !== "manager") return;
        try {
            const res = await fetch(`${API_BASE_URL}/feedback`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFeedbackList(data);
            }
        } catch (err) {
            console.error("Failed to fetch feedback", err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
        if (activeTab === "feedback" && user?.role === "manager") {
            fetchFeedback();
        }
    }, [activeTab, user]);

    // Actions
    const handleCreateAnnouncement = async () => {
        if (!newTitle || !newMessage) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/announcements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ title: newTitle, message: newMessage, isPinned: newPinned, targetAudience })
            });

            if (!res.ok) throw new Error("Failed");

            toast({ title: "Success", description: "Announcement posted!" });
            setCreateOpen(false);
            setNewTitle("");
            setNewMessage("");
            setNewPinned(false);
            setTargetAudience("ALL");
            fetchAnnouncements();
        } catch (err) {
            toast({ title: "Error", description: "Failed to post announcement", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAnnouncement = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`${API_BASE_URL}/announcements/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast({ title: "Deleted", description: "Announcement removed." });
            fetchAnnouncements();
        } catch (err) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        }
    };

    const handleTogglePin = async (announcement: Announcement) => {
        try {
            await fetch(`${API_BASE_URL}/announcements/${announcement.id}/pin`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ isPinned: !announcement.isPinned })
            });
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackMessage) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ message: feedbackMessage, isAnonymous })
            });

            if (!res.ok) throw new Error("Failed");

            toast({ title: "Received", description: "Thank you for your feedback!" });
            setFeedbackMessage("");
            setIsAnonymous(false);
        } catch (err) {
            toast({ title: "Error", description: "Failed to submit feedback", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0000cc]">Company Updates</h1>
                        <p className="text-gray-500">Stay informed and share your thoughts</p>
                    </div>
                    {user?.role === "manager" && activeTab === "announcements" && (
                        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#0000cc] hover:bg-[#0000cc]/90 text-white gap-2">
                                    <Plus className="h-4 w-4" /> New Announcement
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Announcement</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Important Update" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Message</Label>
                                        <Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Details..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Target Audience</Label>
                                        <Select value={targetAudience} onValueChange={setTargetAudience}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select audience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Company</SelectItem>
                                                <SelectItem value="EMPLOYEES">Employees Only</SelectItem>
                                                <SelectItem value="MANAGERS">Managers Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="pin-mode" checked={newPinned} onCheckedChange={setNewPinned} />
                                        <Label htmlFor="pin-mode">Pin to top</Label>
                                    </div>
                                    <Button onClick={handleCreateAnnouncement} disabled={loading} className="w-full bg-[#0000cc]">
                                        {loading ? "Posting..." : "Post Announcement"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                        <TabsTrigger value="announcements" className="gap-2">
                            <Megaphone className="h-4 w-4" /> Announcements
                        </TabsTrigger>
                        <TabsTrigger value="feedback" className="gap-2">
                            <MessageSquare className="h-4 w-4" /> Feedback
                        </TabsTrigger>
                    </TabsList>

                    {/* ANNOUNCEMENTS TAB */}
                    <TabsContent value="announcements" className="space-y-4">
                        {announcements.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                                <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No announcements yet</p>
                            </div>
                        ) : (
                            announcements.map((item) => (
                                <Card key={item.id} className={`transition-all hover:shadow-md ${item.isPinned ? "border-l-4 border-l-[#0000cc] bg-blue-50/30" : ""}`}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {item.isPinned && <Pin className="h-4 w-4 text-[#0000cc] fill-current" />}
                                                    <CardTitle className="text-xl">{item.title}</CardTitle>
                                                </div>
                                                <CardDescription>
                                                    {new Date(item.createdAt).toLocaleDateString()} • {item.author.email}
                                                    {item.targetAudience && item.targetAudience !== 'ALL' && (
                                                        <Badge variant="outline" className="ml-2 text-xs">
                                                            {item.targetAudience} Only
                                                        </Badge>
                                                    )}
                                                </CardDescription>
                                            </div>
                                            {user?.role === "manager" && (
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleTogglePin(item)}>
                                                        <Pin className={`h-4 w-4 ${item.isPinned ? "fill-black" : ""}`} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteAnnouncement(item.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="whitespace-pre-wrap text-gray-700">{item.message}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* FEEDBACK TAB */}
                    <TabsContent value="feedback">
                        {user?.role === "manager" ? (
                            // MANAGER VIEW: List of Feedback
                            <div className="space-y-4">
                                {feedbackList.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>No feedback received yet</p>
                                    </div>
                                ) : (
                                    feedbackList.map((item) => (
                                        <Card key={item.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center gap-2">
                                                    {item.isAnonymous ? (
                                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <Ghost className="h-4 w-4 text-gray-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <CardTitle className="text-sm font-medium">
                                                            {item.isAnonymous ? "Anonymous Employee" : item.user?.email}
                                                        </CardTitle>
                                                        <CardDescription className="text-xs">
                                                            {new Date(item.createdAt).toLocaleString()}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{item.message}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        ) : (
                            // EMPLOYEE VIEW: Submit Form
                            <Card className="max-w-2xl mx-auto">
                                <CardHeader>
                                    <CardTitle>Submit Feedback</CardTitle>
                                    <CardDescription>
                                        Share your thoughts, suggestions, or concerns. You can choose to remain anonymous.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Your Message</Label>
                                        <Textarea
                                            value={feedbackMessage}
                                            onChange={e => setFeedbackMessage(e.target.value)}
                                            placeholder="I think we should..."
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="anon-mode" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                                        <Label htmlFor="anon-mode" className="flex items-center gap-2">
                                            {isAnonymous ? <Ghost className="h-4 w-4 text-gray-500" /> : <User className="h-4 w-4 text-blue-600" />}
                                            Submit Anonymously
                                        </Label>
                                    </div>
                                    <Button onClick={handleSubmitFeedback} disabled={loading || !feedbackMessage} className="w-full bg-[#0000cc]">
                                        {loading ? "Sending..." : "Submit Feedback"} <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}
