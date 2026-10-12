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
  { id: "cat-6", name: "Hamburguesas" },
  { id: "cat-7", name: "Perros Calientes" },
  { id: "cat-8", name: "Sushi" },
  { id: "cat-9", name: "Empanadas" },
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

  // ---------------------------------------------------------------
  // Comida rápida. Las fotos viven en public/menu/ (locales, no
  // hotlink) y fueron verificadas una a una antes de asignarlas.
  // ---------------------------------------------------------------

  // Hamburguesas (cat-6)
  {
    id: "item-13",
    categoryId: "cat-6",
    name: "Hamburguesa Clásica",
    description:
      "Carne de res 150g a la plancha, queso cheddar fundido, lechuga, tomate y salsa de la casa en pan brioche.",
    price: 8.5,
    imageUrl: "/menu/hamburguesa-clasica.jpg",
    isAvailable: true,
  },
  {
    id: "item-14",
    categoryId: "cat-6",
    name: "Doble Bacon",
    description:
      "Dos medallones de res, bacon crujiente, doble cheddar y salsa ahumada. Para los que vienen con hambre de verdad.",
    price: 11.9,
    imageUrl: "/menu/hamburguesa-doble-bacon.jpg",
    isAvailable: true,
  },
  {
    id: "item-15",
    categoryId: "cat-6",
    name: "Pollo Crispy",
    description:
      "Filete de pollo empanizado y crujiente, lechuga, pepinillos y mayonesa de hierbas.",
    price: 9.5,
    imageUrl: "/menu/hamburguesa-pollo-crispy.jpg",
    isAvailable: true,
  },
  {
    id: "item-16",
    categoryId: "cat-6",
    name: "Vegetariana",
    description:
      "Medallón de vegetales y legumbres, queso fresco, zanahoria y remolacha en pan integral.",
    price: 8.9,
    imageUrl: "/menu/hamburguesa-vegetariana.jpg",
    isAvailable: true,
  },
  {
    id: "item-17",
    categoryId: "cat-6",
    name: "BBQ con Aros de Cebolla",
    description:
      "Carne de res, cheddar, aros de cebolla crujientes y una buena capa de salsa BBQ.",
    price: 12.5,
    imageUrl: "/menu/hamburguesa-bbq-aros.jpg",
    isAvailable: true,
  },

  // Perros calientes (cat-7)
  {
    id: "item-18",
    categoryId: "cat-7",
    name: "Perro Clásico",
    description: "Salchicha de res con mostaza y ketchup en pan suave.",
    price: 4.5,
    imageUrl: "/menu/perro-clasico.jpg",
    isAvailable: true,
  },
  {
    id: "item-19",
    categoryId: "cat-7",
    name: "Perro con Cheddar",
    description: "Salchicha de res bañada en queso cheddar fundido.",
    price: 5.9,
    imageUrl: "/menu/perro-cheddar.jpg",
    isAvailable: true,
  },
  {
    id: "item-20",
    categoryId: "cat-7",
    name: "Perro con Chili",
    description:
      "Salchicha de res con chili con carne, cebolla picada y queso rallado por encima.",
    price: 6.5,
    imageUrl: "/menu/perro-chili.jpg",
    isAvailable: true,
  },
  {
    id: "item-21",
    categoryId: "cat-7",
    name: "Perro Completo",
    description:
      "Salchicha de res con palta, tomate, mayonesa y salsa de la casa. El que no deja a nadie indiferente.",
    price: 6.9,
    imageUrl: "/menu/perro-completo.jpg",
    isAvailable: true,
  },
  {
    id: "item-22",
    categoryId: "cat-7",
    name: "Perro Venezolano",
    description:
      "Salchicha de res con papitas trituradas, queso rallado, repollo y salsas. Al estilo de la esquina.",
    price: 5.5,
    imageUrl: "/menu/perro-venezolano.jpg",
    isAvailable: true,
  },

  // Sushi (cat-8)
  {
    id: "item-23",
    categoryId: "cat-8",
    name: "California Roll",
    description:
      "8 piezas de arroz, cangrejo, palta y pepino, envueltas en alga nori.",
    price: 9.0,
    imageUrl: "/menu/sushi-california.jpg",
    isAvailable: true,
  },
  {
    id: "item-24",
    categoryId: "cat-8",
    name: "Philadelphia Roll",
    description: "8 piezas de salmón fresco, queso crema y cebollín.",
    price: 10.5,
    imageUrl: "/menu/sushi-philadelphia.jpg",
    isAvailable: true,
  },
  {
    id: "item-25",
    categoryId: "cat-8",
    name: "Nigiri de Salmón",
    description: "4 piezas de arroz con lámina de salmón fresco sobre la mano.",
    price: 7.5,
    imageUrl: "/menu/sushi-nigiri-salmon.jpg",
    isAvailable: true,
  },
  {
    id: "item-26",
    categoryId: "cat-8",
    name: "Bandeja Surtida",
    description:
      "24 piezas surtidas para compartir: california, philadelphia, nigiri y rolls de la casa.",
    price: 18.0,
    imageUrl: "/menu/sushi-bandeja.jpg",
    isAvailable: true,
  },

  // Empanadas venezolanas (cat-9)
  {
    id: "item-27",
    categoryId: "cat-9",
    name: "Empanada de Queso",
    description: "Empanada frita de maíz con queso blanco venezolano.",
    price: 2.5,
    imageUrl: "/menu/empanada-queso.jpg",
    isAvailable: true,
  },
  {
    id: "item-28",
    categoryId: "cat-9",
    name: "Empanada de Carne Mechada",
    description: "Empanada frita de maíz rellena de carne mechada guisada.",
    price: 3.2,
    imageUrl: "/menu/empanada-carne-mechada.jpg",
    isAvailable: true,
  },
  {
    id: "item-29",
    categoryId: "cat-9",
    name: "Empanada de Pollo",
    description: "Empanada frita de maíz con pollo guisado y especias.",
    price: 3.0,
    imageUrl: "/menu/empanada-pollo.jpg",
    isAvailable: true,
  },
  {
    id: "item-30",
    categoryId: "cat-9",
    name: "Empanada de Jamón y Queso",
    description: "Empanada frita de maíz con jamón y queso fundido.",
    price: 3.2,
    imageUrl: "/menu/empanada-jamon-queso.jpg",
    isAvailable: true,
  },
  {
    id: "item-31",
    categoryId: "cat-9",
    name: "Empanada de Cazón",
    description:
      "Empanada frita de maíz con cazón desmenuzado. La receta del oriente del país.",
    price: 3.5,
    imageUrl: "/menu/empanada-cazon.jpg",
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

export function getItemById(id: string): MenuItem | undefined {
  return mockMenuItems.find((item) => item.id === id);
}
