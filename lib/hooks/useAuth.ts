"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createClient } from "@/lib/supabase/client"
import { setUser, setLoading, logout } from "@/lib/store/slices/authSlice"
import type { RootState } from "@/lib/store"

export function useAuth() {
  const dispatch = useDispatch()
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const supabase = createClient()

  useEffect(() => {
    dispatch(setLoading(true))

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (profile) {
            dispatch(setUser(profile))
          } else {
            const newProfile = {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || null,
              avatar_url: session.user.user_metadata?.avatar_url || null,
              role: "customer",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            const { data: createdProfile } = await supabase.from("profiles").insert(newProfile).select().single()

            if (createdProfile) {
              dispatch(setUser(createdProfile))
            }
          }
        } else {
          dispatch(setUser(null))
        }
      } catch (error) {
        console.error("Error getting session:", error)
        dispatch(setUser(null))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (profile) {
            dispatch(setUser(profile))
          } else {
            const newProfile = {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || null,
              avatar_url: session.user.user_metadata?.avatar_url || null,
              role: "customer",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            const { data: createdProfile } = await supabase.from("profiles").insert(newProfile).select().single()

            if (createdProfile) {
              dispatch(setUser(createdProfile))
            }
          }
        } else {
          dispatch(logout())
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
        dispatch(logout())
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch, supabase])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      dispatch(logout())
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    signOut,
  }
}
