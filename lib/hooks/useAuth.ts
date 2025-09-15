"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createClient } from "@/lib/supabase/client"
import { setUser } from "@/lib/store/slices/authSlice"
import type { RootState } from "@/lib/store"

export function useAuth() {
  const dispatch = useDispatch()
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          dispatch(setUser(profile))
        }
      } else {
        dispatch(setUser(null))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          dispatch(setUser(profile))
        }
      } else {
        dispatch(setUser(null))
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch, supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    signOut,
  }
}
