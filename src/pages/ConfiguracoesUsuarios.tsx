import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Search, UserCog, Shield, User, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

const roleColors = {
  admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  moderator: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  user: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const roleLabels = {
  admin: "Administrador",
  moderator: "Moderador",
  user: "Usuário",
};

const roleIcons = {
  admin: Shield,
  moderator: UserCog,
  user: User,
};

export default function ConfiguracoesUsuarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  // Todos os hooks devem vir ANTES de qualquer early return
  const { data: users, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // Buscar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar roles de cada usuário
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id);

          return {
            ...profile,
            roles: roles?.map((r) => r.role) || [],
          };
        })
      );

      return usersWithRoles;
    },
    enabled: isAdmin, // Só executa a query se for admin
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      // Remover todas as roles existentes
      await supabase.from("user_roles").delete().eq("user_id", userId);

      // Adicionar nova role - usando rpc ou raw para contornar tipos não atualizados
      const { error } = await (supabase as any).from("user_roles").insert({
        user_id: userId,
        role: newRole,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Permissões atualizadas com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar permissões:", error);
      toast.error("Erro ao atualizar permissões");
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Permissões removidas com sucesso!");
      setUserToDelete(null);
    },
    onError: (error: any) => {
      console.error("Erro ao remover permissões:", error);
      toast.error("Erro ao remover permissões");
      setUserToDelete(null);
    },
  });

  // Verificar se o usuário é admin DEPOIS de todos os hooks
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Acesso restrito a administradores</p>
        <Button onClick={() => navigate("/")}>Voltar ao Dashboard</Button>
      </div>
    );
  }

  const filteredUsers = users?.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleDeleteRole = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDeleteRole = () => {
    if (userToDelete) {
      deleteRoleMutation.mutate(userToDelete);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Configurações de Usuários</h2>
          </div>
          <p className="text-muted-foreground">Gerencie usuários e suas permissões no sistema</p>
        </div>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Total de usuários cadastrados: {users?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando usuários...</div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const currentRole = user.roles[0] || "user";
                const RoleIcon = roleIcons[currentRole as keyof typeof roleIcons];

                return (
                  <Card key={user.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <RoleIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {user.nome || "Sem nome"}
                              </p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge className={roleColors[currentRole as keyof typeof roleColors]}>
                              {roleLabels[currentRole as keyof typeof roleLabels]}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">ID:</span> {user.id.slice(0, 8)}...
                            </div>
                            {user.created_at && (
                              <div>
                                <span className="font-medium">Cadastro:</span>{" "}
                                {format(new Date(user.created_at), "dd/MM/yyyy", {
                                  locale: ptBR,
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Select
                            value={currentRole}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Selecionar permissão" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>Usuário</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="moderator">
                                <div className="flex items-center gap-2">
                                  <UserCog className="h-4 w-4" />
                                  <span>Moderador</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Administrador</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteRole(user.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Sobre as Permissões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Shield className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Administrador</p>
              <p className="text-sm text-muted-foreground">
                Acesso total ao sistema, incluindo gerenciamento de usuários, configurações e
                aprovações.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <UserCog className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Moderador</p>
              <p className="text-sm text-muted-foreground">
                Pode gerenciar conteúdo e visualizar relatórios, mas não tem acesso às
                configurações do sistema.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-500/10">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Usuário</p>
              <p className="text-sm text-muted-foreground">
                Acesso básico ao sistema para visualização e operações básicas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover todas as permissões?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá remover todas as permissões especiais do usuário, deixando-o apenas
              com acesso básico ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRole}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
