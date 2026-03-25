export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface BoardGame {
  id: string
  name: string
  description: string | null
  image_url: string | null
  category_id: string | null
  min_players: number
  max_players: number
  play_time: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export interface StoreInfo {
  id: string
  name: string
  slogan: string | null
  phone: string | null
  facebook: string | null
  line_id: string | null
  google_maps_url: string | null
  address: string | null
  created_at: string
  updated_at: string
}
