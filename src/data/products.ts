export type Product = {
  id: string;
  name: string;
  category: "phone" | "laptop" | "earbuds";
  price: number;
  brand: string;
  features: string[];
  rating: number;
  imageUrl: string;
};

export const PRODUCTS: Product[] = [
  // PHONES
  { 
    id: "p1", 
    name: "EconoPhone Basic", 
    category: "phone", 
    price: 99, 
    brand: "Econo", 
    features: ["lcd screen", "basic camera", "headphone jack"], 
    rating: 3.8,
    imageUrl: "/images/img_p1.png"
  },
  { 
    id: "p2", 
    name: "BudgetPhone Z", 
    category: "phone", 
    price: 249, 
    brand: "Econo", 
    features: ["good battery", "basic camera", "4g"], 
    rating: 4.0,
    imageUrl: "/images/img_p2.png"
  },
  { 
    id: "p3", 
    name: "NovaPhone A1", 
    category: "phone", 
    price: 399, 
    brand: "Nova", 
    features: ["good camera", "oled", "5g"], 
    rating: 4.4,
    imageUrl: "/images/phone_1.png"
  },
  { 
    id: "p4", 
    name: "PixelMax Lite", 
    category: "phone", 
    price: 499, 
    brand: "PixelMax", 
    features: ["good camera", "fast charging", "5g"], 
    rating: 4.5,
    imageUrl: "/images/img_p4.png"
  },
  { 
    id: "p5", 
    name: "NovaPhone A1 Pro", 
    category: "phone", 
    price: 549, 
    brand: "Nova", 
    features: ["excellent camera", "oled", "5g"], 
    rating: 4.6,
    imageUrl: "/images/img_p5.png"
  },
  { 
    id: "p6", 
    name: "ZenPhone 8", 
    category: "phone", 
    price: 699, 
    brand: "ZenByte", 
    features: ["compact design", "powerful processor", "great camera"], 
    rating: 4.7,
    imageUrl: "/images/img_p6.png"
  },
  { 
    id: "p7", 
    name: "NovaPhone Ultra", 
    category: "phone", 
    price: 899, 
    brand: "Nova", 
    features: ["telephoto lens", "huge screen", "stylus support"], 
    rating: 4.8,
    imageUrl: "/images/img_p7.png"
  },
  { 
    id: "p8", 
    name: "ZenFold X", 
    category: "phone", 
    price: 1099, 
    brand: "ZenByte", 
    features: ["folding screen", "excellent camera", "5g"], 
    rating: 4.8,
    imageUrl: "/images/img_p8.png"
  },
  { 
    id: "p9", 
    name: "Titanium Pro Max", 
    category: "phone", 
    price: 1299, 
    brand: "Nova", 
    features: ["titanium body", "pro camera system", "lidar"], 
    rating: 4.9,
    imageUrl: "/images/img_p9.png"
  },

  // LAPTOPS
  { 
    id: "p10", 
    name: "EconoBook Basic", 
    category: "laptop", 
    price: 349, 
    brand: "Econo", 
    features: ["cheap", "basic performance", "8gb ram"], 
    rating: 3.9,
    imageUrl: "/images/img_p10.png"
  },
  { 
    id: "p11", 
    name: "UltraBook 14", 
    category: "laptop", 
    price: 999, 
    brand: "ZenByte", 
    features: ["lightweight", "long battery", "16gb ram"], 
    rating: 4.7,
    imageUrl: "/images/laptop_1.png"
  },
  { 
    id: "p12", 
    name: "GameBox G7", 
    category: "laptop", 
    price: 1299, 
    brand: "Volt", 
    features: ["rtx graphics", "144hz", "16gb ram"], 
    rating: 4.6,
    imageUrl: "/images/laptop_2.png"
  },
  { 
    id: "p13", 
    name: "UltraBook Pro 16", 
    category: "laptop", 
    price: 1499, 
    brand: "ZenByte", 
    features: ["4k display", "32gb ram", "long battery"], 
    rating: 4.9,
    imageUrl: "/images/img_p13.png"
  },

  // EARBUDS
  { 
    id: "p14", 
    name: "SoundBuds Lite", 
    category: "earbuds", 
    price: 49, 
    brand: "AudioZen", 
    features: ["affordable", "good sound"], 
    rating: 4.1,
    imageUrl: "/images/img_p14.png"
  },
  { 
    id: "p15", 
    name: "SoundBuds S", 
    category: "earbuds", 
    price: 99, 
    brand: "AudioZen", 
    features: ["noise cancellation", "water resistant"], 
    rating: 4.2,
    imageUrl: "/images/earbuds_1.png"
  },
  { 
    id: "p16", 
    name: "SoundBuds Pro", 
    category: "earbuds", 
    price: 179, 
    brand: "AudioZen", 
    features: ["better noise cancellation", "wireless charging"], 
    rating: 4.5,
    imageUrl: "/images/earbuds_2.png"
  }
];
