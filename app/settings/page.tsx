"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Profile {
  id: string
  updated_at?: string
  username?: string
  full_name?: string
  avatar_url?: string
  website?: string
}

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [website, setWebsite] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [uploading, setUploading] = useState(false)

  /* ---------- fetch profile ---------- */
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true)
      try {
        if (!user) throw new Error("No user")

        const { data, error, status } = await supabase
          .from("profiles")
          .select(`username, full_name, avatar_url, website`)
          .eq("id", user.id)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setUsername(data.username || "")
          setFullName(data.full_name || "")
          setWebsite(data.website || "")
          setAvatarUrl(data.avatar_url || "")
          setProfile(data)
        }
      } catch (error: any) {
        console.error(error)
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [user])

  /* ---------- update profile ---------- */
  async function updateProfile({
    username,
    website,
    fullName,
    avatarUrl,
  }: {
    username: string
    website: string
    fullName: string
    avatarUrl: string
  }) {
    setLoading(true)
    try {
      if (!user) throw new Error("No user")

      const updates = {
        id: user.id,
        updated_at: new Date(),
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
        website,
      }

      const { error } = await supabase.from("profiles").upsert(updates)

      if (error) {
        throw error
      }
      toast.success("Profile updated!")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  /* ---------- avatar upload ---------- */
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!user) throw new Error("Could not authenticate user")
      if (!event.target.files?.[0]) return

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const publicUrl = `${supabase.storageUrl}/avatars/${filePath}`
      setAvatarUrl(publicUrl)

      updateProfile({
        username,
        website,
        fullName,
        avatarUrl: publicUrl,
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  /* ---------- UI ---------- */
  return (
    <div className="container mx-auto py-8">
      <Card className="bg-slate-950 text-slate-100 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar" />
              ) : (
                <AvatarFallback>{fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{fullName || "No Name"}</p>
              <p className="text-sm text-slate-400">{username ? `@${username}` : "No username"}</p>
            </div>
          </div>

          {/* Form */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ""} disabled />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="avatar">Avatar</Label>
              <Input type="file" id="avatar" accept="image/*" onChange={handleUpload} />
            </div>

            <div>
              <Button
                isLoading={loading}
                onClick={() => updateProfile({ username, website, fullName, avatarUrl })}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Update profile
              </Button>
            </div>
            <div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={async () => {
                  await signOut()
                  router.push("/login")
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
