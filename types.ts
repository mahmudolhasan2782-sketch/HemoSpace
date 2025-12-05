export interface GameItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'Arcade' | 'Puzzle' | 'Strategy' | 'Racing';
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
}