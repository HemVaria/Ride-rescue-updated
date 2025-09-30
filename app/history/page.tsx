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
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

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
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-purple-500/20 text-purple-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
}

const priorityColors = {
  low: "bg-gray-500/20 text-gray-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  emergency: "bg-red-500/20 text-red-400",
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  in_progress: AlertCircle,
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Service History</h1>
          <p className="text-slate-400">Track your roadside assistance requests and service history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-700">
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

          <Card className="bg-slate-900 border-slate-700">
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

          <Card className="bg-slate-900 border-slate-700">
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

          <Card className="bg-slate-900 border-slate-700">
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
        </div>

        {/* Filters */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
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
                    className="pl-10 bg-slate-800 border-slate-600 text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
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
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
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

        {/* Service Requests List */}
        {filteredRequests.length === 0 ? (
          <Card className="bg-slate-900 border-slate-700">
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
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const StatusIcon = statusIcons[request.status]
              return (
                <Card key={request.id} className="bg-slate-900 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-100">{request.service_type}</h3>
                          <Badge className={statusColors[request.status]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {request.status.replace("_", " ").toUpperCase()}
                          </Badge>
                          <Badge className={priorityColors[request.priority]}>{request.priority.toUpperCase()}</Badge>
                        </div>

                        <p className="text-slate-300 mb-3">{request.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-slate-400">
                              <MapPin className="w-4 h-4" />
                              <span>{request.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-400">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(request.requested_at).toLocaleString()}</span>
                            </div>
                            {request.vehicle_info && (
                              <div className="flex items-center space-x-2 text-slate-400">
                                <Car className="w-4 h-4" />
                                <span>{request.vehicle_info}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            {request.mechanic_name && (
                              <div className="flex items-center space-x-2 text-slate-400">
                                <Wrench className="w-4 h-4" />
                                <span>{request.mechanic_name}</span>
                              </div>
                            )}
                            {request.mechanic_phone && (
                              <div className="flex items-center space-x-2 text-slate-400">
                                <Phone className="w-4 h-4" />
                                <span>{request.mechanic_phone}</span>
                              </div>
                            )}
                            {request.final_cost && (
                              <div className="flex items-center space-x-2 text-emerald-400">
                                <CreditCard className="w-4 h-4" />
                                <span>₹{request.final_cost}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {request.status === "completed" && request.rating && (
                          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < request.rating! ? "text-yellow-400 fill-current" : "text-slate-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-slate-300 text-sm">({request.rating}/5)</span>
                            </div>
                            {request.feedback && <p className="text-slate-400 text-sm">{request.feedback}</p>}
                          </div>
                        )}
                      </div>

                      {request.status === "pending" && (
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400 bg-transparent hover:bg-red-600/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
