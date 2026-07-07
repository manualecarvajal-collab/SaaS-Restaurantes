export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export const mockRestaurant = {
  id: "rest-1",
  name: "Le Bistrot",
  slug: "le-bistrot",
};

export const mockTable = {
  id: "table-12",
  tableNumber: 12,
};

export const mockCategories: MenuCategory[] = [
  { id: "cat-1", name: "Entradas" },
  { id: "cat-2", name: "Platos Fuertes" },
  { id: "cat-3", name: "Bebidas" },
  { id: "cat-4", name: "Postres" },
  { id: "cat-5", name: "Complementos" },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: "item-1",
    categoryId: "cat-1",
    name: "Sopa de Cebolla",
    description:
      "Sopa clásica francesa con caldo de res, cebolla caramelizada, crutones y queso gruyère gratinado.",
    price: 12.5,
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-2",
    categoryId: "cat-1",
    name: "Ensalada Niçoise",
    description:
      "Atún sellado, judías verdes, papas, huevo duro, aceitunas y vinagreta de mostaza.",
    price: 16.0,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-3",
    categoryId: "cat-1",
    name: "Tartar de Res",
    description:
      "Corte fino de res con alcaparras, echalotes, yema de huevo y pan brioche tostado.",
    price: 18.5,
    imageUrl:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-4",
    categoryId: "cat-1",
    name: "Pommes Frites",
    description:
      "Papas fritas al estilo francés, crujientes, servidas con alioli casero.",
    price: 6.0,
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-5",
    categoryId: "cat-2",
    name: "Steak Frites",
    description:
      "Ribeye 300g con mantequilla de hierbas, acompañado de papas fritas crujientes y ensalada verde.",
    price: 28.0,
    imageUrl:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-6",
    categoryId: "cat-2",
    name: "Salmón Glaseado",
    description:
      "Salmón del Atlántico con glaseado de miel y soya, servido con puré de batata y espárragos.",
    price: 24.0,
    imageUrl:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-7",
    categoryId: "cat-3",
    name: "Limonada Natural",
    description: "Limonada fresca con hierbabuena y un toque de jengibre.",
    price: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-8",
    categoryId: "cat-3",
    name: "Vino Tinto de la Casa",
    description: "Copa de Malbec argentino, cuerpo medio con notas de frutos rojos.",
    price: 8.0,
    imageUrl:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-9",
    categoryId: "cat-4",
    name: "Crème Brûlée",
    description:
      "Clásico postre francés con base de crema de vainilla y capa de caramelo crujiente.",
    price: 9.0,
    imageUrl:
      "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-10",
    categoryId: "cat-4",
    name: "Tarta de Chocolate",
    description:
      "Tarta de chocolate belga con centro fundente, servida con helado de vainilla.",
    price: 11.0,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-11",
    categoryId: "cat-5",
    name: "Papas fritas",
    description: "Papas fritas crujientes servidas con ketchup.",
    price: 2.5,
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-12",
    categoryId: "cat-5",
    name: "Aros de Cebolla",
    description: "Aros de cebolla empanizados y fritos, servidos con salsa ranch.",
    price: 2.5,
    imageUrl:
      "https://images.unsplash.com/photo-1639024471283-03518883512d?w=200&h=150&fit=crop",
    isAvailable: true,
  },
];

export const mockBankDetails = {
  bank: "Banesco",
  titular: "Le Bistrot C.A.",
  ciRif: "J-40123456-0",
  phone: "0412-1234567",
};

export function getItemsByCategory(categoryId: string): MenuItem[] {
  return mockMenuItems.filter((item) => item.categoryId === categoryId);
}
