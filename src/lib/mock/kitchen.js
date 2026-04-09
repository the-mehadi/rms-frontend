export const KDS_ORDERS = [
  {
    id: "k1",
    table: 4,
    createdAt: Date.now() - 1000 * 60 * 6,
    priority: "normal",
    status: "pending",
    items: ["Truffle Pasta", "Iced Latte x2"],
    notes: "No chili, extra parmesan.",
  },
  {
    id: "k2",
    table: 12,
    createdAt: Date.now() - 1000 * 60 * 14,
    priority: "high",
    status: "preparing",
    items: ["Charcoal Ribeye (250g)", "Lemon Mint Cooler"],
    notes: "",
  },
  {
    id: "k3",
    table: 8,
    createdAt: Date.now() - 1000 * 60 * 22,
    priority: "normal",
    status: "ready",
    items: ["Crispy Calamari", "Smoked Salmon Bowl"],
    notes: "Allergy: peanuts.",
  },
  {
    id: "k4",
    table: 2,
    createdAt: Date.now() - 1000 * 60 * 2,
    priority: "rush",
    status: "pending",
    items: ["Spicy Chicken Burger", "Iced Latte"],
    notes: "",
  },
];

