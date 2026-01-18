"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  ArrowRight,
  User,
  Clock,
  CheckCircle2,
  TrendingUp,
  Target,
  Trophy,
  Star,
  Zap,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { Layout } from "@/components/Layout";
import { toast } from "react-hot-toast";

// --- Colors based on inspiration ---
const COLOR_PRIMARY = "#0000cc";
const COLOR_ACCENT_ICON = "text-red-500";
const COLOR_SUCCESS = "#10b981";
const COLOR_WARNING = "#f97316";

// --- Types ---
interface PerformanceData {
  hours: number;
  hoursChange?: number;
  completionRate: number;
  completionChange?: number;
  engagement: number;
  engagementChange?: number;
  rating: number;
  ratingChange?: number;
  weeklyHours: { day: string; hours: number }[];
  completionTrend: { week: string; completion: number }[];
  radar: { metric: string; A: number; fullMark: number }[];
  skills: { skill: string; percentage: number }[];
  achievements: { title: string; subtitle: string; icon: string }[];
}

interface Employee {
  id: string; // Updated to string as Prisma usually returns strings or mixed types
  name: string;
  role: string; // Mapped from roleTitle
  email: string;
  department?: string;
  status?: string;
  performance: PerformanceData | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- SKELETON LOADER COMPONENTS ---
const EmployeeListSkeletonItem = () => (
  <div className="p-3 sm:p-4 rounded-lg flex items-center gap-3 bg-gray-50/50 animate-pulse border border-gray-200">
    <User className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400`} />
    <div>
      <div className="h-3 w-24 sm:w-32 bg-gray-200 rounded mb-1"></div>
      <div className="h-2 w-16 sm:w-20 bg-gray-100 rounded"></div>
    </div>
    <ArrowRight className="h-4 w-4 ml-auto text-gray-300" />
  </div>
);

const DetailStatCardSkeleton = () => (
  <Card className="p-3 sm:p-4 h-20 flex items-center justify-between border-[#0000cc]/20 shadow-sm animate-pulse">
    <div className="space-y-1">
      <div className="h-3 w-20 sm:w-28 bg-gray-200 rounded"></div>
      <div className="h-5 w-12 sm:w-16 bg-gray-300 rounded"></div>
    </div>
    <div className="h-5 w-5 sm:h-6 sm:w-6 bg-red-200 rounded-full"></div>
  </Card>
);

const SkeletonEmployeePerformanceDashboard = () => (
  <Layout>
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3 sm:pb-4 animate-pulse">
        <div>
          <div className="h-7 w-48 sm:w-80 bg-gray-300 rounded mb-1"></div>
          <div className="h-3 w-64 sm:w-96 bg-gray-200 rounded mt-2"></div>
        </div>
        <Card
          className={`p-3 mt-3 sm:mt-0 shadow-md w-full sm:w-56`}
          style={{
            backgroundColor: `${COLOR_PRIMARY}1A`,
            borderColor: `${COLOR_PRIMARY}4D`,
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Users className={`h-5 w-5 sm:h-6 sm:w-6 ${COLOR_ACCENT_ICON}`} />
            <div>
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
              <div className="h-5 w-8 bg-gray-400 rounded mt-1"></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:h-[calc(100vh-160px)]">
        <Card
          className={`lg:col-span-1 p-4 flex flex-col shadow-lg border-[#0000cc]/20 h-[300px] lg:h-full`}
        >
          <CardHeader className="px-2 pt-1 pb-4 animate-pulse">
            <div className="h-5 w-32 sm:w-40 bg-gray-300 rounded"></div>
            <div className="h-9 w-full bg-gray-100 rounded mt-2"></div>
          </CardHeader>
          <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <EmployeeListSkeletonItem key={i} />
            ))}
          </div>
        </Card>

        <Card
          className={`lg:col-span-2 xl:col-span-3 h-[600px] lg:h-full flex flex-col p-4 sm:p-6 overflow-y-auto shadow-lg border-[#0000cc]/20 animate-pulse`}
        >
          <div className="mb-4 sm:mb-6 border-b pb-3">
            <div className="h-7 w-48 sm:w-64 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 sm:w-40 bg-gray-200 rounded mt-2"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <DetailStatCardSkeleton key={i} />
            ))}
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Card className="p-4 sm:p-6 h-64 sm:h-72 border-gray-200 shadow-sm">
              <div className="h-4 w-32 sm:w-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-48 sm:h-52 w-full bg-gray-100 rounded"></div>
            </Card>
            <Card className="p-4 sm:p-6 h-64 sm:h-72 border-gray-200 shadow-sm">
              <div className="h-4 w-32 sm:w-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-48 sm:h-52 w-full bg-gray-100 rounded"></div>
            </Card>
          </div>
          <Card className="p-4 sm:p-6 h-80 sm:h-96 mb-6 border-gray-200 shadow-sm">
            <div className="h-4 w-40 sm:w-52 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 sm:h-72 w-full bg-gray-100 rounded"></div>
          </Card>
        </Card>
      </div>
    </div>
  </Layout>
);

// --- Helper Components ---
const PerformanceStats = ({ data }: { data: PerformanceData }) => {
  const statItems = [
    {
      title: "Total Hours",
      value: `${data.hours}h`,
      change: data.hoursChange ? `${data.hoursChange > 0 ? "+" : ""}${data.hoursChange}%` : "",
      icon: Clock,
      color: COLOR_ACCENT_ICON,
      valueColor: COLOR_PRIMARY,
      trendColor: "text-blue-600",
    },
    {
      title: "Task Completion",
      value: `${data.completionRate}%`,
      change: data.completionChange ? `${data.completionChange > 0 ? "+" : ""}${data.completionChange}%` : "",
      icon: CheckCircle2,
      color: COLOR_ACCENT_ICON,
      valueColor: COLOR_SUCCESS,
      trendColor: "text-green-600",
    },
    {
      title: "Engagement Rate",
      value: `${data.engagement}%`,
      change: data.engagementChange ? `${data.engagementChange > 0 ? "+" : ""}${data.engagementChange}%` : "",
      icon: TrendingUp,
      color: COLOR_ACCENT_ICON,
      valueColor: COLOR_WARNING,
      trendColor: "text-orange-600",
    },
    {
      title: "Overall Rating",
      value: `${data.rating}/5`,
      change: data.ratingChange ? `Top ${data.ratingChange}%` : "",
      icon: Target,
      color: COLOR_ACCENT_ICON,
      valueColor: COLOR_PRIMARY,
      trendColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {statItems.map((item) => (
        <Card
          key={item.title}
          className="p-3 sm:p-4 flex items-center justify-between border-[#0000cc]/20 shadow-sm hover:shadow-md transition-all"
        >
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-medium text-gray-500">
              {item.title}
            </p>
            <h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: item.valueColor }}
            >
              {item.value}
            </h3>
          </div>
          <div className="text-right">
            {item.change && (
              <div
                className={`text-[10px] sm:text-xs font-semibold ${item.trendColor}`}
              >
                {item.change}
              </div>
            )}
            <item.icon
              className={`h-5 w-5 sm:h-6 sm:w-6 opacity-70 ${item.color}`}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

const PerformanceMatrix = ({ data }: { data: PerformanceData }) => (
  <Card className="p-4 sm:p-6 mb-4 sm:mb-6 border-[#0000cc]/20 shadow-sm">
    <CardTitle
      className={`flex items-center gap-2 mb-4 text-lg sm:text-xl`}
      style={{ color: COLOR_PRIMARY }}
    >
      <Zap className={`h-4 w-4 sm:h-5 sm:w-5 ${COLOR_ACCENT_ICON}`} />
      Performance Matrix
    </CardTitle>
    <div className="h-[200px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          outerRadius={window.innerWidth < 640 ? 80 : 130}
          data={data.radar}
        >
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="metric"
            stroke="#666"
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: `1px solid ${COLOR_PRIMARY}`,
              borderRadius: "0.5rem",
              padding: "5px 10px",
            }}
            formatter={(value: any, name: any, props: any) => [
              `${value}%`,
              props.payload.metric,
            ]}
            labelFormatter={() => ""}
          />
          <Radar
            name="Performance"
            dataKey="A"
            stroke={COLOR_PRIMARY}
            fill={COLOR_PRIMARY}
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

// Map string icon names from backend to Components
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Trophy":
      return Trophy;
    case "Star":
      return Star;
    default:
      return Trophy;
  }
};

const SkillsAchievements = ({ data }: { data: PerformanceData }) => (
  <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6">
    <Card className="p-4 sm:p-6 border-[#0000cc]/20 shadow-sm">
      <CardTitle
        className={`text-lg sm:text-xl mb-4`}
        style={{ color: COLOR_PRIMARY }}
      >
        Top Skills
      </CardTitle>
      <div className="space-y-3 sm:space-y-4">
        {(data?.skills || []).map((skill) => (
          <div key={skill.skill}>
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="font-medium text-gray-800">{skill.skill}</span>
              <span className="text-gray-500 font-semibold">
                {skill.percentage}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500`}
                style={{
                  width: `${skill.percentage}%`,
                  backgroundColor: COLOR_PRIMARY,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
    <Card className="p-4 sm:p-6 border-[#0000cc]/20 shadow-sm">
      <CardTitle
        className={`text-lg sm:text-xl mb-4`}
        style={{ color: COLOR_PRIMARY }}
      >
        Recent Achievements
      </CardTitle>
      <div className="space-y-3 sm:space-y-4">
        {(data?.achievements || []).map((ach) => {
          const IconComponent = getIconComponent(ach.icon);
          return (
            <div
              key={ach.title + ach.subtitle}
              className="flex items-center gap-3 sm:gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <IconComponent
                className={`h-5 w-5 sm:h-6 sm:w-6 ${COLOR_ACCENT_ICON} flex-shrink-0`}
              />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-gray-800">
                  {ach.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">{ach.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

// --- Main Component ---
export default function EmployeePerformanceDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/employees/performance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Backend returns roleTitle, map to role for frontend consistency
      const formattedEmployees = res.data.employees.map((emp: any) => ({
        ...emp,
        role: emp.roleTitle || "Unknown Role"
      }));

      setEmployees(formattedEmployees);

      if (formattedEmployees.length > 0) {
        fetchEmployeePerformance(
          formattedEmployees[0].id.toString(),
          formattedEmployees[0]
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeePerformance = async (
    employeeId: string,
    employeeInfo: Employee
  ) => {
    setLoadingPerformance(true);
    // Set basic info immediately so UI updates while loading data
    setSelectedEmployee(employeeInfo);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/employees/${employeeId}/performance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Backend returns { employee: {...}, performance: {...} }
      setSelectedEmployee({
        ...employeeInfo,
        // Merge any updated employee details from the detailed endpoint
        ...res.data.employee,
        role: res.data.employee.roleTitle || employeeInfo.role,
        performance: res.data.performance,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch performance data");
      // Keep selected employee but nullify performance to show empty state
      setSelectedEmployee({ ...employeeInfo, performance: null });
    } finally {
      setLoadingPerformance(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const name = emp.name ?? "";
    const id = emp.id?.toString() ?? "";
    const role = emp.role ?? "";

    return (
      name.toLowerCase().includes(term) ||
      id.includes(term) ||
      role.toLowerCase().includes(term)
    );
  });

  const primaryStyle = { color: COLOR_PRIMARY };
  const primaryBgStyle = { backgroundColor: COLOR_PRIMARY };

  const xAxisWeeklyProps =
    window.innerWidth < 640
      ? { angle: -45, textAnchor: "end", height: 40, style: { fontSize: 10 } }
      : { angle: 0, textAnchor: "middle", height: 30, style: { fontSize: 12 } };

  const xAxisLineProps =
    window.innerWidth < 640
      ? { height: 25, style: { fontSize: 10 } }
      : { height: 30, style: { fontSize: 12 } };

  if (loading) {
    return <SkeletonEmployeePerformanceDashboard />;
  }

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 min-h-screen">
        {/* Header and Total Employees Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3 sm:pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={primaryStyle}>
              Employee Performance Hub
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              In-depth analytics for informed management decisions.
            </p>
          </div>

          <Card
            className={`p-3 mt-3 sm:mt-0 shadow-md w-full sm:w-56`}
            style={{
              backgroundColor: `${COLOR_PRIMARY}1A`,
              borderColor: `${COLOR_PRIMARY}4D`,
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <Users className={`h-4 w-4 sm:h-6 sm:w-6 ${COLOR_ACCENT_ICON}`} />
              <div>
                <div className="text-xs font-medium text-gray-600">
                  Total Team Members
                </div>
                <div
                  className="text-xl sm:text-2xl font-bold"
                  style={primaryStyle}
                >
                  {employees.length}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:h-[calc(100vh-160px)]">
          {/* Employee List */}
          <Card
            className={`lg:col-span-1 p-4 flex flex-col shadow-lg border-[#0000cc]/20 h-[300px] lg:h-full`}
          >
            <CardHeader className="px-2 pt-1 pb-4">
              <CardTitle className="text-lg sm:text-xl" style={primaryStyle}>
                Select Team Member
              </CardTitle>
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${COLOR_ACCENT_ICON}`}
                />
                <Input
                  placeholder="Search by ID, Name, or Role..."
                  className="mt-2 pl-9 border-gray-300 focus:border-[#0000cc] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <div className="space-y-2 flex-1 overflow-y-auto pr-2">
              {filteredEmployees.length === 0 ? (
                <p className="text-center py-4 text-gray-500 text-sm">
                  No employees found
                  <button
                    className="text-[#0000cc] mt-2 font-semibold underline hover:text-red-500 text-xs block mx-auto"
                    onClick={() => window.location.reload()}
                  >
                    Try Refreshing
                  </button>
                </p>
              ) : (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`p-3 sm:p-4 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-150 text-sm ${selectedEmployee?.id === employee.id
                      ? `text-white shadow-md`
                      : "hover:bg-gray-100 border border-gray-200"
                      }`}
                    style={
                      selectedEmployee?.id === employee.id ? primaryBgStyle : {}
                    }
                    onClick={() =>
                      fetchEmployeePerformance(employee.id.toString(), employee)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <User
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${selectedEmployee?.id === employee.id
                          ? COLOR_ACCENT_ICON
                          : `text-blue-700`
                          }`}
                      />
                      <div>
                        <h4 className="font-semibold leading-none">
                          {employee.name}
                        </h4>
                        <p
                          className={`text-xs ${selectedEmployee?.id === employee.id
                            ? "text-white/80"
                            : "text-gray-500"
                            }`}
                        >
                          {employee.role}
                        </p>
                      </div>
                    </div>
                    {selectedEmployee?.id === employee.id && (
                      <ArrowRight className={`h-4 w-4 ${COLOR_ACCENT_ICON}`} />
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Detail View */}
          <div className="lg:col-span-2 xl:col-span-3 relative">
            {loadingPerformance && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
                <Loader2
                  className={`h-10 w-10 animate-spin`}
                  style={primaryStyle}
                />
              </div>
            )}
            {selectedEmployee && selectedEmployee.performance ? (
              <Card
                className={`h-full flex flex-col p-4 sm:p-6 overflow-y-auto shadow-lg border-[#0000cc]/20`}
              >
                <div className="mb-4 sm:mb-6 border-b pb-3">
                  <h2
                    className="text-xl sm:text-3xl font-bold"
                    style={primaryStyle}
                  >
                    Performance Analytics
                  </h2>
                  <p className="text-base sm:text-xl text-gray-600 font-medium">
                    {selectedEmployee.name}
                  </p>
                </div>

                {/* Top Stats - Responsive Grid */}
                <PerformanceStats data={selectedEmployee.performance} />

                {/* Charts - Stacked on Mobile */}
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  {/* Weekly Hours */}
                  <Card className="p-4 sm:p-6 border-[#0000cc]/20 shadow-sm">
                    <CardTitle
                      className={`text-lg sm:text-xl mb-4 flex items-center gap-2`}
                      style={primaryStyle}
                    >
                      <Clock
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${COLOR_ACCENT_ICON}`}
                      />{" "}
                      Weekly Hours Breakdown
                    </CardTitle>
                    {selectedEmployee?.performance?.weeklyHours && selectedEmployee.performance.weeklyHours.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                          data={selectedEmployee.performance.weeklyHours}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="day"
                            stroke="#666"
                            {...xAxisWeeklyProps}
                          />
                          <YAxis stroke="#666" style={{ fontSize: 10 }} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "0.5rem",
                              border: `1px solid ${COLOR_PRIMARY}`,
                            }}
                          />
                          <Bar
                            dataKey="hours"
                            fill={COLOR_PRIMARY}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                        No data available
                      </div>
                    )}
                  </Card>

                  {/* Task Completion Trend */}
                  <Card className="p-4 sm:p-6 border-[#0000cc]/20 shadow-sm">
                    <CardTitle
                      className={`text-lg sm:text-xl mb-4 flex items-center gap-2`}
                      style={primaryStyle}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${COLOR_ACCENT_ICON}`}
                      />{" "}
                      Task Completion Trend
                    </CardTitle>
                    {selectedEmployee?.performance?.completionTrend && selectedEmployee.performance.completionTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                          data={selectedEmployee.performance.completionTrend}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="week"
                            stroke="#666"
                            {...xAxisLineProps}
                          />
                          <YAxis stroke="#666" style={{ fontSize: 10 }} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "0.5rem",
                              border: `1px solid ${COLOR_PRIMARY}`,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="completion"
                            stroke={COLOR_SUCCESS}
                            strokeWidth={3}
                            dot={{ fill: COLOR_SUCCESS, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                        No data available
                      </div>
                    )}
                  </Card>
                </div>

                {/* Radar Chart */}
                {selectedEmployee?.performance?.radar && (
                  <PerformanceMatrix data={selectedEmployee.performance} />
                )}

                {/* Skills & Achievements - Responsive Grid */}
                {selectedEmployee?.performance && (
                  <SkillsAchievements data={selectedEmployee.performance} />
                )}
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 shadow-inner">
                <div className="text-center text-gray-500 p-8">
                  <Target
                    className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4`}
                    style={primaryStyle}
                  />
                  <h3
                    className={`text-lg sm:text-xl font-semibold`}
                    style={primaryStyle}
                  >
                    Performance View
                  </h3>
                  <p className="text-sm">
                    Select an employee from the list to view their detailed
                    performance analytics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}