export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      auditorias: {
        Row: {
          auditor_certificacao: string | null
          auditor_nome: string
          certificado_emitido: boolean | null
          codigo: string
          conformidades: string[] | null
          created_at: string | null
          created_by: string | null
          criterios_avaliados: Json | null
          data_auditoria: string
          id: string
          lote_id: string | null
          nao_conformidades: string[] | null
          observacoes: string | null
          pontuacao_maxima: number | null
          pontuacao_total: number | null
          produtor_id: string | null
          recomendacoes: string | null
          resultado: string | null
          status: string | null
          tipo_auditoria: string
          updated_at: string | null
          validade_certificado: string | null
        }
        Insert: {
          auditor_certificacao?: string | null
          auditor_nome: string
          certificado_emitido?: boolean | null
          codigo: string
          conformidades?: string[] | null
          created_at?: string | null
          created_by?: string | null
          criterios_avaliados?: Json | null
          data_auditoria: string
          id?: string
          lote_id?: string | null
          nao_conformidades?: string[] | null
          observacoes?: string | null
          pontuacao_maxima?: number | null
          pontuacao_total?: number | null
          produtor_id?: string | null
          recomendacoes?: string | null
          resultado?: string | null
          status?: string | null
          tipo_auditoria: string
          updated_at?: string | null
          validade_certificado?: string | null
        }
        Update: {
          auditor_certificacao?: string | null
          auditor_nome?: string
          certificado_emitido?: boolean | null
          codigo?: string
          conformidades?: string[] | null
          created_at?: string | null
          created_by?: string | null
          criterios_avaliados?: Json | null
          data_auditoria?: string
          id?: string
          lote_id?: string | null
          nao_conformidades?: string[] | null
          observacoes?: string | null
          pontuacao_maxima?: number | null
          pontuacao_total?: number | null
          produtor_id?: string | null
          recomendacoes?: string | null
          resultado?: string | null
          status?: string | null
          tipo_auditoria?: string
          updated_at?: string | null
          validade_certificado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditorias_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auditorias_produtor_id_fkey"
            columns: ["produtor_id"]
            isOneToOne: false
            referencedRelation: "produtores"
            referencedColumns: ["id"]
          },
        ]
      }
      certificacoes: {
        Row: {
          certificadora: string
          created_at: string | null
          created_by: string | null
          data_emissao: string
          data_validade: string
          escopo: string
          id: string
          normas: string[] | null
          numero_certificado: string
          observacoes: string | null
          produtor_id: string | null
          requisitos: string[] | null
          status: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          certificadora: string
          created_at?: string | null
          created_by?: string | null
          data_emissao: string
          data_validade: string
          escopo: string
          id?: string
          normas?: string[] | null
          numero_certificado: string
          observacoes?: string | null
          produtor_id?: string | null
          requisitos?: string[] | null
          status?: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          certificadora?: string
          created_at?: string | null
          created_by?: string | null
          data_emissao?: string
          data_validade?: string
          escopo?: string
          id?: string
          normas?: string[] | null
          numero_certificado?: string
          observacoes?: string | null
          produtor_id?: string | null
          requisitos?: string[] | null
          status?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificacoes_produtor_id_fkey"
            columns: ["produtor_id"]
            isOneToOne: false
            referencedRelation: "produtores"
            referencedColumns: ["id"]
          },
        ]
      }
      certificacoes_auditorias: {
        Row: {
          auditor: string
          certificacao_id: string
          created_at: string | null
          data_auditoria: string
          id: string
          nao_conformidades: string[] | null
          observacoes: string | null
          pontuacao: number | null
          resultado: string
        }
        Insert: {
          auditor: string
          certificacao_id: string
          created_at?: string | null
          data_auditoria: string
          id?: string
          nao_conformidades?: string[] | null
          observacoes?: string | null
          pontuacao?: number | null
          resultado: string
        }
        Update: {
          auditor?: string
          certificacao_id?: string
          created_at?: string | null
          data_auditoria?: string
          id?: string
          nao_conformidades?: string[] | null
          observacoes?: string | null
          pontuacao?: number | null
          resultado?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificacoes_auditorias_certificacao_id_fkey"
            columns: ["certificacao_id"]
            isOneToOne: false
            referencedRelation: "certificacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      certificacoes_historico: {
        Row: {
          alterado_por: string | null
          certificacao_id: string
          dados_alteracao: Json | null
          data_alteracao: string | null
          id: string
          observacoes: string | null
          status_anterior: string | null
          status_novo: string | null
          tipo_alteracao: string
        }
        Insert: {
          alterado_por?: string | null
          certificacao_id: string
          dados_alteracao?: Json | null
          data_alteracao?: string | null
          id?: string
          observacoes?: string | null
          status_anterior?: string | null
          status_novo?: string | null
          tipo_alteracao: string
        }
        Update: {
          alterado_por?: string | null
          certificacao_id?: string
          dados_alteracao?: Json | null
          data_alteracao?: string | null
          id?: string
          observacoes?: string | null
          status_anterior?: string | null
          status_novo?: string | null
          tipo_alteracao?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificacoes_historico_certificacao_id_fkey"
            columns: ["certificacao_id"]
            isOneToOne: false
            referencedRelation: "certificacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          cidade: string
          created_at: string | null
          documento_alvara: string | null
          documento_certidao: string | null
          documento_nif: string | null
          documento_outros: string | null
          email: string
          endereco: string
          id: string
          nif: string
          nome_empresa: string
          observacoes_aprovacao: string | null
          provincia: string
          responsavel_cargo: string | null
          responsavel_nome: string
          status: string | null
          telefone: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          cidade: string
          created_at?: string | null
          documento_alvara?: string | null
          documento_certidao?: string | null
          documento_nif?: string | null
          documento_outros?: string | null
          email: string
          endereco: string
          id?: string
          nif: string
          nome_empresa: string
          observacoes_aprovacao?: string | null
          provincia: string
          responsavel_cargo?: string | null
          responsavel_nome: string
          status?: string | null
          telefone: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          cidade?: string
          created_at?: string | null
          documento_alvara?: string | null
          documento_certidao?: string | null
          documento_nif?: string | null
          documento_outros?: string | null
          email?: string
          endereco?: string
          id?: string
          nif?: string
          nome_empresa?: string
          observacoes_aprovacao?: string | null
          provincia?: string
          responsavel_cargo?: string | null
          responsavel_nome?: string
          status?: string | null
          telefone?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      historico_pedidos: {
        Row: {
          alterado_por: string | null
          created_at: string | null
          id: string
          observacoes: string | null
          pedido_id: string
          status_anterior:
            | Database["public"]["Enums"]["status_pedido_certificacao"]
            | null
          status_novo: Database["public"]["Enums"]["status_pedido_certificacao"]
        }
        Insert: {
          alterado_por?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          pedido_id: string
          status_anterior?:
            | Database["public"]["Enums"]["status_pedido_certificacao"]
            | null
          status_novo: Database["public"]["Enums"]["status_pedido_certificacao"]
        }
        Update: {
          alterado_por?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          pedido_id?: string
          status_anterior?:
            | Database["public"]["Enums"]["status_pedido_certificacao"]
            | null
          status_novo?: Database["public"]["Enums"]["status_pedido_certificacao"]
        }
        Relationships: [
          {
            foreignKeyName: "historico_pedidos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_certificacao"
            referencedColumns: ["id"]
          },
        ]
      }
      lotes: {
        Row: {
          certificacao: string | null
          codigo: string
          created_at: string | null
          data_colheita: string
          id: string
          observacoes: string | null
          peneira: string | null
          processo: string
          produtor_id: string | null
          produtor_nome: string
          quantidade: number
          safra: string
          status: string | null
          umidade: number | null
          unidade: string
          updated_at: string | null
          variedade: string[]
        }
        Insert: {
          certificacao?: string | null
          codigo: string
          created_at?: string | null
          data_colheita: string
          id?: string
          observacoes?: string | null
          peneira?: string | null
          processo: string
          produtor_id?: string | null
          produtor_nome: string
          quantidade: number
          safra: string
          status?: string | null
          umidade?: number | null
          unidade: string
          updated_at?: string | null
          variedade: string[]
        }
        Update: {
          certificacao?: string | null
          codigo?: string
          created_at?: string | null
          data_colheita?: string
          id?: string
          observacoes?: string | null
          peneira?: string | null
          processo?: string
          produtor_id?: string | null
          produtor_nome?: string
          quantidade?: number
          safra?: string
          status?: string | null
          umidade?: number | null
          unidade?: string
          updated_at?: string | null
          variedade?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "lotes_produtor_id_fkey"
            columns: ["produtor_id"]
            isOneToOne: false
            referencedRelation: "produtores"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens_negociacao: {
        Row: {
          created_at: string | null
          id: string
          mensagem: string
          negociacao_id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mensagem: string
          negociacao_id: string
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mensagem?: string
          negociacao_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_negociacao_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      negociacoes: {
        Row: {
          comprador_id: string
          created_at: string | null
          id: string
          oferta_id: string
          status: string
          updated_at: string | null
          vendedor_id: string | null
        }
        Insert: {
          comprador_id: string
          created_at?: string | null
          id?: string
          oferta_id: string
          status?: string
          updated_at?: string | null
          vendedor_id?: string | null
        }
        Update: {
          comprador_id?: string
          created_at?: string | null
          id?: string
          oferta_id?: string
          status?: string
          updated_at?: string | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "negociacoes_oferta_id_fkey"
            columns: ["oferta_id"]
            isOneToOne: false
            referencedRelation: "ofertas_venda"
            referencedColumns: ["id"]
          },
        ]
      }
      ofertas_venda: {
        Row: {
          altitude: string | null
          certificado: boolean | null
          classificacao: string | null
          condicoes_venda: string | null
          contato_email: string | null
          contato_nome: string
          contato_telefone: string
          contato_whatsapp: string | null
          created_at: string | null
          created_by: string | null
          data_colheita: string | null
          data_disponibilidade: string | null
          descricao: string | null
          descritores: string[] | null
          documentos_urls: string[] | null
          fazenda: string | null
          fotos_urls: string[] | null
          id: string
          lote_id: string | null
          moeda: string | null
          municipio: string | null
          negociavel: boolean | null
          nota_qualidade: number | null
          observacoes: string | null
          peneira: string | null
          preco_sugerido: number | null
          processo: string
          produtor_id: string | null
          provincia: string
          quantidade_disponivel: number
          status_cafe: string
          status_oferta: string
          tipo_certificacao: string[] | null
          titulo: string
          umidade: number | null
          unidade: string
          updated_at: string | null
          validade_oferta: string | null
          variedade: string[]
          visualizacoes: number | null
        }
        Insert: {
          altitude?: string | null
          certificado?: boolean | null
          classificacao?: string | null
          condicoes_venda?: string | null
          contato_email?: string | null
          contato_nome: string
          contato_telefone: string
          contato_whatsapp?: string | null
          created_at?: string | null
          created_by?: string | null
          data_colheita?: string | null
          data_disponibilidade?: string | null
          descricao?: string | null
          descritores?: string[] | null
          documentos_urls?: string[] | null
          fazenda?: string | null
          fotos_urls?: string[] | null
          id?: string
          lote_id?: string | null
          moeda?: string | null
          municipio?: string | null
          negociavel?: boolean | null
          nota_qualidade?: number | null
          observacoes?: string | null
          peneira?: string | null
          preco_sugerido?: number | null
          processo: string
          produtor_id?: string | null
          provincia: string
          quantidade_disponivel: number
          status_cafe: string
          status_oferta?: string
          tipo_certificacao?: string[] | null
          titulo: string
          umidade?: number | null
          unidade?: string
          updated_at?: string | null
          validade_oferta?: string | null
          variedade?: string[]
          visualizacoes?: number | null
        }
        Update: {
          altitude?: string | null
          certificado?: boolean | null
          classificacao?: string | null
          condicoes_venda?: string | null
          contato_email?: string | null
          contato_nome?: string
          contato_telefone?: string
          contato_whatsapp?: string | null
          created_at?: string | null
          created_by?: string | null
          data_colheita?: string | null
          data_disponibilidade?: string | null
          descricao?: string | null
          descritores?: string[] | null
          documentos_urls?: string[] | null
          fazenda?: string | null
          fotos_urls?: string[] | null
          id?: string
          lote_id?: string | null
          moeda?: string | null
          municipio?: string | null
          negociavel?: boolean | null
          nota_qualidade?: number | null
          observacoes?: string | null
          peneira?: string | null
          preco_sugerido?: number | null
          processo?: string
          produtor_id?: string | null
          provincia?: string
          quantidade_disponivel?: number
          status_cafe?: string
          status_oferta?: string
          tipo_certificacao?: string[] | null
          titulo?: string
          umidade?: number | null
          unidade?: string
          updated_at?: string | null
          validade_oferta?: string | null
          variedade?: string[]
          visualizacoes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ofertas_venda_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ofertas_venda_produtor_id_fkey"
            columns: ["produtor_id"]
            isOneToOne: false
            referencedRelation: "produtores"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_certificacao: {
        Row: {
          certificado_url: string | null
          created_at: string | null
          data_conclusao: string | null
          data_solicitacao: string | null
          documentos_enviados: Json | null
          empresa_id: string
          id: string
          numero_pedido: string
          observacoes: string | null
          quantidade_lotes: number
          selos_url: string | null
          status: Database["public"]["Enums"]["status_pedido_certificacao"]
          tipo_certificacao: Database["public"]["Enums"]["tipo_certificacao"]
          unidade_volume: string
          updated_at: string | null
          volume_estimado: number
        }
        Insert: {
          certificado_url?: string | null
          created_at?: string | null
          data_conclusao?: string | null
          data_solicitacao?: string | null
          documentos_enviados?: Json | null
          empresa_id: string
          id?: string
          numero_pedido: string
          observacoes?: string | null
          quantidade_lotes: number
          selos_url?: string | null
          status?: Database["public"]["Enums"]["status_pedido_certificacao"]
          tipo_certificacao: Database["public"]["Enums"]["tipo_certificacao"]
          unidade_volume: string
          updated_at?: string | null
          volume_estimado: number
        }
        Update: {
          certificado_url?: string | null
          created_at?: string | null
          data_conclusao?: string | null
          data_solicitacao?: string | null
          documentos_enviados?: Json | null
          empresa_id?: string
          id?: string
          numero_pedido?: string
          observacoes?: string | null
          quantidade_lotes?: number
          selos_url?: string | null
          status?: Database["public"]["Enums"]["status_pedido_certificacao"]
          tipo_certificacao?: Database["public"]["Enums"]["tipo_certificacao"]
          unidade_volume?: string
          updated_at?: string | null
          volume_estimado?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_certificacao_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtores: {
        Row: {
          altitude: string | null
          approved_at: string | null
          approved_by: string | null
          area: string | null
          area_arabica: number | null
          area_robusta: number | null
          certificacoes: string[] | null
          comuna: string | null
          created_at: string | null
          documento_bi: string | null
          documento_posse_terra: string | null
          email: string | null
          forma_aquisicao: string | null
          fotografia: string | null
          georeferencia: string | null
          id: string
          identificacao_fazenda: string | null
          localizacao: string
          municipio: string | null
          nif: string | null
          nome: string
          nome_fazenda: string
          observacoes: string | null
          provincia: string | null
          status: Database["public"]["Enums"]["producer_status"] | null
          telefone: string | null
          tipo_producao: string | null
          trabalhadores_colaboradores_homens: number | null
          trabalhadores_colaboradores_mulheres: number | null
          trabalhadores_efetivos_homens: number | null
          trabalhadores_efetivos_mulheres: number | null
          updated_at: string | null
          user_id: string | null
          variedades: string[] | null
        }
        Insert: {
          altitude?: string | null
          approved_at?: string | null
          approved_by?: string | null
          area?: string | null
          area_arabica?: number | null
          area_robusta?: number | null
          certificacoes?: string[] | null
          comuna?: string | null
          created_at?: string | null
          documento_bi?: string | null
          documento_posse_terra?: string | null
          email?: string | null
          forma_aquisicao?: string | null
          fotografia?: string | null
          georeferencia?: string | null
          id?: string
          identificacao_fazenda?: string | null
          localizacao: string
          municipio?: string | null
          nif?: string | null
          nome: string
          nome_fazenda: string
          observacoes?: string | null
          provincia?: string | null
          status?: Database["public"]["Enums"]["producer_status"] | null
          telefone?: string | null
          tipo_producao?: string | null
          trabalhadores_colaboradores_homens?: number | null
          trabalhadores_colaboradores_mulheres?: number | null
          trabalhadores_efetivos_homens?: number | null
          trabalhadores_efetivos_mulheres?: number | null
          updated_at?: string | null
          user_id?: string | null
          variedades?: string[] | null
        }
        Update: {
          altitude?: string | null
          approved_at?: string | null
          approved_by?: string | null
          area?: string | null
          area_arabica?: number | null
          area_robusta?: number | null
          certificacoes?: string[] | null
          comuna?: string | null
          created_at?: string | null
          documento_bi?: string | null
          documento_posse_terra?: string | null
          email?: string | null
          forma_aquisicao?: string | null
          fotografia?: string | null
          georeferencia?: string | null
          id?: string
          identificacao_fazenda?: string | null
          localizacao?: string
          municipio?: string | null
          nif?: string | null
          nome?: string
          nome_fazenda?: string
          observacoes?: string | null
          provincia?: string | null
          status?: Database["public"]["Enums"]["producer_status"] | null
          telefone?: string | null
          tipo_producao?: string | null
          trabalhadores_colaboradores_homens?: number | null
          trabalhadores_colaboradores_mulheres?: number | null
          trabalhadores_efetivos_homens?: number | null
          trabalhadores_efetivos_mulheres?: number | null
          updated_at?: string | null
          user_id?: string | null
          variedades?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nome: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          nome?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
      qualidade: {
        Row: {
          acidez: number | null
          classificacao: string | null
          classificador_certificacao: string | null
          classificador_nome: string
          corpo: number | null
          created_at: string | null
          created_by: string | null
          data_analise: string
          defeitos: number | null
          descritores: string[] | null
          doçura: number | null
          equilibrio: number | null
          fragrancia: number | null
          id: string
          lote_id: string | null
          nota_final: number | null
          observacoes: string | null
          pos_gosto: number | null
          recomendacoes: string | null
          sabor: number | null
          umidade: number | null
          uniformidade: number | null
          updated_at: string | null
          xicara_limpa: number | null
        }
        Insert: {
          acidez?: number | null
          classificacao?: string | null
          classificador_certificacao?: string | null
          classificador_nome: string
          corpo?: number | null
          created_at?: string | null
          created_by?: string | null
          data_analise: string
          defeitos?: number | null
          descritores?: string[] | null
          doçura?: number | null
          equilibrio?: number | null
          fragrancia?: number | null
          id?: string
          lote_id?: string | null
          nota_final?: number | null
          observacoes?: string | null
          pos_gosto?: number | null
          recomendacoes?: string | null
          sabor?: number | null
          umidade?: number | null
          uniformidade?: number | null
          updated_at?: string | null
          xicara_limpa?: number | null
        }
        Update: {
          acidez?: number | null
          classificacao?: string | null
          classificador_certificacao?: string | null
          classificador_nome?: string
          corpo?: number | null
          created_at?: string | null
          created_by?: string | null
          data_analise?: string
          defeitos?: number | null
          descritores?: string[] | null
          doçura?: number | null
          equilibrio?: number | null
          fragrancia?: number | null
          id?: string
          lote_id?: string | null
          nota_final?: number | null
          observacoes?: string | null
          pos_gosto?: number | null
          recomendacoes?: string | null
          sabor?: number | null
          umidade?: number | null
          uniformidade?: number | null
          updated_at?: string | null
          xicara_limpa?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "qualidade_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_auditoria_codigo: { Args: never; Returns: string }
      generate_pedido_numero: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "produtor" | "user" | "moderator"
      producer_status: "pendente" | "aprovado" | "rejeitado"
      status_pedido_certificacao:
        | "pendente"
        | "documentacao_analise"
        | "auditoria_agendada"
        | "auditoria_realizada"
        | "em_emissao"
        | "concluido"
        | "rejeitado"
      tipo_certificacao:
        | "organico"
        | "fair_trade"
        | "rainforest_alliance"
        | "utz"
        | "cafe_especial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "produtor", "user", "moderator"],
      producer_status: ["pendente", "aprovado", "rejeitado"],
      status_pedido_certificacao: [
        "pendente",
        "documentacao_analise",
        "auditoria_agendada",
        "auditoria_realizada",
        "em_emissao",
        "concluido",
        "rejeitado",
      ],
      tipo_certificacao: [
        "organico",
        "fair_trade",
        "rainforest_alliance",
        "utz",
        "cafe_especial",
      ],
    },
  },
} as const
