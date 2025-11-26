"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  MapPin,
  Phone,
  Star,
  Calendar,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  Wrench,
  CreditCard,
  ArrowRight,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"

interface ServiceRequest {
  id: string
  service_type: string
  description: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "emergency"
  location: string
  mechanic_name?: string
  mechanic_phone?: string
  estimated_cost?: number
  final_cost?: number
  requested_at: string
  completed_at?: string
  rating?: number
  feedback?: string
  vehicle_info?: string
}

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
}

const priorityColors = {
  low: "bg-slate-500/20 text-slate-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  emergency: "bg-red-500/20 text-red-400",
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  in_progress: Wrench,
  completed: CheckCircle,
  cancelled: XCircle,
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    if (user) {
      loadServiceRequests()
    }
  }, [user])

  useEffect(() => {
    filterRequests()
  }, [requests, searchQuery, statusFilter, priorityFilter])

  const loadServiceRequests = async () => {
    try {
      // Simulated data - replace with actual Supabase query
      const mockData: ServiceRequest[] = [
        {
          id: "1",
          service_type: "Emergency Towing",
          description: "Car broke down on highway, need immediate towing",
          status: "completed",
          priority: "emergency",
          location: "NH-8, Near Vadodara",
          mechanic_name: "Rajesh Kumar",
          mechanic_phone: "+919825600100",
          estimated_cost: 1500,
          final_cost: 1200,
          requested_at: "2024-01-15T10:30:00Z",
          completed_at: "2024-01-15T12:00:00Z",
          rating: 5,
          feedback: "Excellent service, very quick response",
          vehicle_info: "Maruti Swift - GJ05AB1234",
        },
        {
          id: "2",
          service_type: "Battery Replacement",
          description: "Car battery dead, need replacement",
          status: "completed",
          priority: "high",
          location: "Alkapuri, Vadodara",
          mechanic_name: "Amit Patel",
          mechanic_phone: "+919825600101",
          estimated_cost: 3500,
          final_cost: 3200,
          requested_at: "2024-01-10T08:15:00Z",
          completed_at: "2024-01-10T09:30:00Z",
          rating: 4,
          feedback: "Good service, mechanic was professional",
          vehicle_info: "Honda City - GJ05CD5678",
        },
        {
          id: "3",
          service_type: "Engine Repair",
          description: "Engine making strange noise, needs inspection",
          status: "in_progress",
          priority: "medium",
          location: "Karelibaug, Vadodara",
          mechanic_name: "Suresh Shah",
          mechanic_phone: "+919825600102",
          estimated_cost: 5000,
          requested_at: "2024-01-20T14:00:00Z",
          vehicle_info: "Hyundai i20 - GJ05EF9012",
        },
        {
          id: "4",
          service_type: "Fuel Delivery",
          description: "Ran out of fuel, need emergency delivery",
          status: "cancelled",
          priority: "high",
          location: "Sayajigunj, Vadodara",
          requested_at: "2024-01-18T16:45:00Z",
          vehicle_info: "Tata Nexon - GJ05GH3456",
        },
        {
          id: "5",
          service_type: "AC Service",
          description: "Car AC not cooling properly",
          status: "pending",
          priority: "low",
          location: "Fatehgunj, Vadodara",
          requested_at: "2024-01-22T11:20:00Z",
          vehicle_info: "Maruti Baleno - GJ05IJ7890",
        },
      ]

      setRequests(mockData)
    } catch (error) {
      console.error("Error loading service requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (request) =>
          request.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.mechanic_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((request) => request.priority === priorityFilter)
    }

    setFilteredRequests(filtered)
  }

  const getStatusStats = () => {
    const stats = {
      total: requests.length,
      completed: requests.filter((r) => r.status === "completed").length,
      pending: requests.filter((r) => r.status === "pending").length,
      in_progress: requests.filter((r) => r.status === "in_progress").length,
      cancelled: requests.filter((r) => r.status === "cancelled").length,
    }
    return stats
  }

  const getTotalSpent = () => {
    return requests
      .filter((r) => r.status === "completed" && r.final_cost)
      .reduce((total, r) => total + (r.final_cost || 0), 0)
  }

  const getAverageRating = () => {
    const ratedRequests = requests.filter((r) => r.rating)
    if (ratedRequests.length === 0) return 0
    return ratedRequests.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedRequests.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    )
  }

  const stats = getStatusStats()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Service History
          </h1>
          <p className="text-slate-400">Track your roadside assistance requests and service history</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Car className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
                    <p className="text-slate-400 text-sm">Total Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{stats.completed}</p>
                    <p className="text-slate-400 text-sm">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">₹{getTotalSpent().toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{getAverageRating().toFixed(1)}</p>
                    <p className="text-slate-400 text-sm">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 mb-8">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(searchQuery || statusFilter !== "all" || priorityFilter !== "all") && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                    }}
                    className="border-slate-600 text-slate-300 bg-transparent hover:bg-slate-800"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline View */}
        {filteredRequests.length === 0 ? (
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No service requests found</h3>
              <p className="text-slate-400">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't made any service requests yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {filteredRequests.map((request, index) => {
              const StatusIcon = statusIcons[request.status]
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 group-[.is-active]:bg-emerald-500/20 group-[.is-active]:border-emerald-500/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <StatusIcon className="w-5 h-5 text-emerald-400" />
                  </div>

                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                    <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all hover:border-emerald-500/30 group-hover:shadow-lg group-hover:shadow-emerald-900/10">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-slate-100 text-lg">{request.service_type}</h3>
                              <Badge className={priorityColors[request.priority]}>{request.priority}</Badge>
                            </div>
                            <time className="text-sm text-slate-400 font-mono block">
                              {new Date(request.requested_at).toLocaleString()}
                            </time>
                          </div>
                          <Badge variant="outline" className={statusColors[request.status]}>
                            {request.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <p className="text-slate-300 mb-4 text-sm leading-relaxed">{request.description}</p>

                        <div className="space-y-2 text-sm border-t border-slate-700/50 pt-4">
                          <div className="flex items-center text-slate-400">
                            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                            {request.location}
                          </div>

                          {request.vehicle_info && (
                            <div className="flex items-center text-slate-400">
                              <Car className="w-4 h-4 mr-2 text-emerald-400" />
                              {request.vehicle_info}
                            </div>
                          )}

                          {request.final_cost && (
                            <div className="flex items-center text-emerald-400 font-medium">
                              <CreditCard className="w-4 h-4 mr-2" />
                              ₹{request.final_cost}
                            </div>
                          )}
                        </div>

                        {request.status === "completed" && request.rating && (
                          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                            <div className="flex items-center space-x-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < request.rating! ? "text-yellow-400 fill-current" : "text-slate-600"
                                    }`}
                                />
                              ))}
                            </div>
                            {request.feedback && <p className="text-slate-400 text-xs italic">"{request.feedback}"</p>}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
