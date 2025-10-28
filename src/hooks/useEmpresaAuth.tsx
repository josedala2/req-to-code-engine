import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export const useEmpresaAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch empresa data when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchEmpresaData(session.user.id);
          }, 0);
        } else {
          setEmpresa(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchEmpresaData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchEmpresaData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      setEmpresa(data);
    } catch (error) {
      console.error("Erro ao buscar dados da empresa:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, empresaData: any) => {
    const redirectUrl = `${window.location.origin}/empresa/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) return { error };

    // Create empresa record
    if (data.user) {
      const { error: empresaError } = await supabase
        .from("empresas")
        .insert({
          user_id: data.user.id,
          ...empresaData,
        });

      if (empresaError) return { error: empresaError };
    }

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    empresa,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
