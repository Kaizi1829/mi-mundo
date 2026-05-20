export type Database = {
  public: {
    Tables: {
      vitales_diarios: {
        Row: {
          id: string
          fecha: string
          energia: 'Baja' | 'Media' | 'Alta'
          enfoque: number
          estado_animo: string
          sueno_horas: number
          sueno_minutos: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['vitales_diarios']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['vitales_diarios']['Insert']>
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          hora: string
          fecha: string
          categoria: string
          color: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['eventos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['eventos']['Insert']>
      }
      tareas: {
        Row: {
          id: string
          titulo: string
          categoria: string
          completada: boolean
          prioridad: number
          fecha: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tareas']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tareas']['Insert']>
      }
      finanzas: {
        Row: {
          id: string
          mes: number
          anio: number
          ingresos: number
          gastos: number
          ahorros: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['finanzas']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['finanzas']['Insert']>
      }
      objetivos: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          progreso: number
          meta: string | null
          anio: number
          icono: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['objetivos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['objetivos']['Insert']>
      }
      viajes: {
        Row: {
          id: string
          destino: string
          pais: string
          fecha_inicio: string
          fecha_fin: string
          imagen_url: string | null
          notas: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['viajes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['viajes']['Insert']>
      }
      wellness: {
        Row: {
          id: string
          fecha: string
          pasos: number
          hidratacion_litros: number
          meditacion_minutos: number
          ciclo_dia: number | null
          ciclo_fase: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wellness']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wellness']['Insert']>
      }
      balance_vida: {
        Row: {
          id: string
          fecha: string
          salud: number
          trabajo: number
          finanzas: number
          crecimiento: number
          relaciones: number
          diversion: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['balance_vida']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['balance_vida']['Insert']>
      }
      notas: {
        Row: {
          id: string
          titulo: string
          contenido: string
          etiquetas: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['notas']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notas']['Insert']>
      }
      diario: {
        Row: {
          id: string
          fecha: string
          contenido: string
          estado_animo: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['diario']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['diario']['Insert']>
      }
    }
  }
}

export type VitalDiario = Database['public']['Tables']['vitales_diarios']['Row']
export type Evento = Database['public']['Tables']['eventos']['Row']
export type Tarea = Database['public']['Tables']['tareas']['Row']
export type Finanza = Database['public']['Tables']['finanzas']['Row']
export type Objetivo = Database['public']['Tables']['objetivos']['Row']
export type Viaje = Database['public']['Tables']['viajes']['Row']
export type Wellness = Database['public']['Tables']['wellness']['Row']
export type BalanceVida = Database['public']['Tables']['balance_vida']['Row']
export type Nota = Database['public']['Tables']['notas']['Row']
export type DiarioEntry = Database['public']['Tables']['diario']['Row']
