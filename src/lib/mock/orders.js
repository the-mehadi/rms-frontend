export const TABLES = Array.from({ length: 20 }).map((_, i) => {
  const n = i + 1;
  const mod = n % 6;
  const status = mod === 0 ? "reserved" : mod <= 2 ? "occupied" : "available";
  return {
    id: `t${n}`,
    number: n,
    status,
    bill: status === "occupied" ? 380 + n * 45 : null,
  };
});

export const CATEGORIES = [
  "All",
  "Starters",
  "Mains",
  "Grill",
  "Seafood",
  "Desserts",
  "Drinks",
];

export const MENU_ITEMS = [
  {
    id: "m1",
    name: "Truffle Pasta",
    price: 990,
    category: "Mains",
    tag: "Signature",
  },
  {
    id: "m2",
    name: "Smoked Salmon Bowl",
    price: 1250,
    category: "Seafood",
    tag: "Premium",
  },
  {
    id: "m3",
    name: "Charcoal Ribeye (250g)",
    price: 1890,
    category: "Grill",
    tag: "Chef’s pick",
  },
  {
    id: "m4",
    name: "Crispy Calamari",
    price: 690,
    category: "Starters",
    tag: "Popular",
  },
  {
    id: "m5",
    name: "Vanilla Crème Brûlée",
    price: 520,
    category: "Desserts",
    tag: "Classic",
  },
  {
    id: "m6",
    name: "Iced Latte",
    price: 240,
    category: "Drinks",
    tag: "Cold",
  },
  {
    id: "m7",
    name: "Spicy Chicken Burger",
    price: 550,
    category: "Mains",
    tag: "Fast",
  },
  {
    id: "m8",
    name: "Lemon Mint Cooler",
    price: 260,
    category: "Drinks",
    tag: "Fresh",
  },
];

