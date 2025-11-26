"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'
import { Users, DollarSign, Activity, Wrench, ArrowUpRight, ArrowDownRight, Bell, Search, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const data = [
  { name: 'Mon', requests: 40, revenue: 2400 },
  { name: 'Tue', requests: 30, revenue: 1398 },
  { name: 'Wed', requests: 20, revenue: 9800 },
  { name: 'Thu', requests: 27, revenue: 3908 },
  { name: 'Fri', requests: 18, revenue: 4800 },
  { name: 'Sat', requests: 23, revenue: 3800 },
  { name: 'Sun', requests: 34, revenue: 4300 },
]

const recentActivity = [
  { id: 1, user: "Amit Patel", action: "Requested Towing", time: "2 mins ago", status: "Pending", amount: "₹1,200" },
  { id: 2, user: "Sarah Khan", action: "Battery Jump Start", time: "15 mins ago", status: "Completed", amount: "₹500" },
  { id: 3, user: "Rahul Verma", action: "Tire Change", time: "32 mins ago", status: "In Progress", amount: "₹350" },
  { id: 4, user: "Priya Shah", action: "Fuel Delivery", time: "1 hour ago", status: "Completed", amount: "₹800" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Overview of Ride Rescue operations and performance.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full border-slate-700 bg-slate-900 text-slate-400 hover:text-white">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-slate-700 bg-slate-900 text-slate-400 hover:text-white">
              <Bell className="w-4 h-4" />
            </Button>
            <Avatar>
              <AvatarImage src="/admin-avatar.png" />
              <AvatarFallback className="bg-emerald-600 text-white">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹45,231.89</div>
              <p className="text-xs text-emerald-500 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Requests</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+2350</div>
              <p className="text-xs text-emerald-500 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Mechanics</CardTitle>
              <Wrench className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">142</div>
              <p className="text-xs text-red-500 flex items-center mt-1">
                <ArrowDownRight className="w-3 h-3 mr-1" /> -4% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+12,234</div>
              <p className="text-xs text-emerald-500 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +19% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          
          {/* Main Chart */}
          <Card className="col-span-4 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Overview</CardTitle>
              <CardDescription className="text-slate-400">Weekly revenue and request volume.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-3 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">Latest service requests and updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-slate-800 text-slate-300">{item.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{item.user}</p>
                      <p className="text-sm text-slate-400">{item.action}</p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-right">
                      <div className="text-white">{item.amount}</div>
                      <div className={`text-xs ${
                        item.status === 'Completed' ? 'text-emerald-500' : 
                        item.status === 'Pending' ? 'text-yellow-500' : 'text-blue-500'
                      }`}>{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
