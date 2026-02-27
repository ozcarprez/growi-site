import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscription(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchSubscription(session.user.id);
        } else {
          setSubscription(null);
        }
      }
    );

    return () => authSub.unsubscribe();
  }, []);

  const fetchSubscription = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('auth_user_id', userId)
        .eq('subscription_status', 'active')
        .maybeSingle();

      if (!error) {
        setSubscription(data);
      }
    } catch {
      setSubscription(null);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSubscription(null);
  }, []);

  const refreshSubscription = useCallback(() => {
    if (user?.id) fetchSubscription(user.id);
  }, [user, fetchSubscription]);

  return {
    user,
    subscription,
    isSubscriber: !!subscription,
    loading,
    signOut,
    refreshSubscription,
  };
}

// Fetch producers via the RPC function (handles contact gating server-side)
export async function fetchProducers(filters = {}) {
  const { data, error } = await supabase.rpc('get_producers', {
    p_region: filters.region || null,
    p_crop: filters.crop || null,
  });

  if (error) {
    console.error('Error fetching producers:', error);
    return [];
  }

  return data || [];
}
