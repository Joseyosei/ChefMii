export interface ChefMenu {
  name: string;
  price: string;
  description: string;
  serves: string;
  image: string;
  dishes: string[];
}

export interface Chef {
  id: string;
  name: string;
  cuisine: string;
  cuisineType: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  rate: string;
  rateNumber: number;
  rating: number;
  reviews: number;
  img: string;
  specialties: string[];
  dietaryOptions: string[];
  bio: string;
  experience: string;
  languages: string[];
  badges: string[];
  certifications?: string[];
  menus: ChefMiinu[];
  foodImages: string[];
  customerReviews: { name: string; rating: number; comment: string; date: string }[];
  services: string[];
}

const generateAvatarUrl = (name: string, gender: 'male' | 'female', index: number): string => {
  const seed = `${name.replace(/\s+/g, '')}-${index}`;
  const styles = ['adventurer', 'avataaars', 'big-ears', 'lorelei', 'micah', 'miniavs', 'personas'];
  const style = styles[index % styles.length];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

const cuisineFoodData: Record<string, { images: string[]; dishes: string[][] }> = {
  italian: {
    images: [
      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Bruschetta", "Caprese Salad", "Carpaccio", "Fresh Pasta", "Tiramisu"],
      ["Risotto ai Funghi", "Ossobuco", "Polenta", "Panna Cotta"],
      ["Lobster Ravioli", "Truffle Risotto", "Beef Tenderloin", "Limoncello Sorbet", "Chocolate Fondant", "Cheese Selection"],
    ],
  },
  french: {
    images: [
      "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["French Onion Soup", "Salade Niçoise", "Coq au Vin", "Crème Brûlée"],
      ["Beef Bourguignon", "Ratatouille", "Duck Confit", "Tarte Tatin"],
      ["Foie Gras", "Lobster Bisque", "Beef Wellington", "Soufflé au Chocolat", "Cheese Course", "Petit Fours"],
    ],
  },
  japanese: {
    images: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1562158074-d49fbeffcc91?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Edamame", "Miso Soup", "Sashimi Selection", "Tempura", "Mochi"],
      ["Ramen", "Gyoza", "Tonkatsu", "Matcha Cheesecake"],
      ["Omakase Sushi", "Wagyu Tataki", "Black Cod Miso", "Kaiseki Dessert", "Premium Sake Pairing", "Seasonal Fruit"],
    ],
  },
  indian: {
    images: [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Samosas", "Butter Chicken", "Naan Bread", "Biryani", "Gulab Jamun"],
      ["Tandoori Platter", "Dal Makhani", "Palak Paneer", "Kulfi"],
      ["Lamb Rogan Josh", "Prawn Masala", "Chicken Tikka", "Raita", "Rice Kheer", "Mango Lassi"],
    ],
  },
  chinese: {
    images: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Spring Rolls", "Hot & Sour Soup", "Kung Pao Chicken", "Fried Rice", "Mango Pudding"],
      ["Dim Sum Selection", "Sweet & Sour Pork", "Chow Mein", "Egg Tarts"],
      ["Peking Duck", "Lobster Noodles", "Crispy Pork Belly", "Jasmine Tea Sorbet", "Fortune Cookies", "Fresh Lychee"],
    ],
  },
  korean: {
    images: [
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1635963282098-a3b7c0a77d3e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583187855892-cde06a0c1167?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Kimchi", "Bibimbap", "Korean Fried Chicken", "Japchae", "Bingsu"],
      ["Korean BBQ Set", "Bulgogi", "Kimchi Jjigae", "Hotteok"],
      ["Wagyu Korean BBQ", "Galbi-jjim", "Seafood Pancake", "Tteokbokki", "Sikhye", "Seasonal Banchan"],
    ],
  },
  mexican: {
    images: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Guacamole & Chips", "Street Tacos", "Enchiladas", "Mexican Rice", "Churros"],
      ["Carnitas", "Quesadillas", "Elote", "Tres Leches Cake"],
      ["Mole Negro", "Cochinita Pibil", "Ceviche", "Chile Relleno", "Flan", "Mezcal Pairing"],
    ],
  },
  nigerian: {
    images: [
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1643660484138-2b7c7d9a9b7b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Pepper Soup", "Jollof Rice", "Suya Skewers", "Fried Plantain", "Puff Puff"],
      ["Egusi Soup", "Pounded Yam", "Moi Moi", "Chin Chin"],
      ["Ofada Rice", "Grilled Fish", "Asun", "Vegetable Stew", "Palm Wine", "Fresh Fruits"],
    ],
  },
  southafrican: {
    images: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Biltong Board", "Bobotie", "Chakalaka", "Pap", "Malva Pudding"],
      ["Braai Platter", "Boerewors", "Potjiekos", "Koeksisters"],
      ["Springbok Loin", "Sosaties", "Cape Malay Curry", "Snoek", "Amarula Cheesecake", "Rooibos Sorbet"],
    ],
  },
  british: {
    images: [
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Scotch Egg", "Fish & Chips", "Roast Beef", "Yorkshire Pudding", "Sticky Toffee Pudding"],
      ["Shepherd's Pie", "Bangers & Mash", "Peas Pudding", "Eton Mess"],
      ["Wellington", "Roast Lamb", "Dover Sole", "Seasonal Vegetables", "Bread & Butter Pudding", "Cheese Board"],
    ],
  },
  default: {
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop",
    ],
    dishes: [
      ["Starter", "Main Course", "Side Dish", "Dessert"],
      ["Appetizer", "Entrée", "Accompaniment", "Sweet Treat"],
      ["Amuse Bouche", "Fish Course", "Meat Course", "Palate Cleanser", "Dessert", "Petit Fours"],
    ],
  },
};

const generateFoodImage = (cuisine: string, index: number): string => {
  const data = cuisineFoodData[cuisine.toLowerCase()] || cuisineFoodData.default;
  return data.images[index % data.images.length];
};

const getCuisineDishes = (cuisine: string, menuIndex: number): string[] => {
  const data = cuisineFoodData[cuisine.toLowerCase()] || cuisineFoodData.default;
  return data.dishes[menuIndex % data.dishes.length];
};

const reviewerNames = [
  "Sarah M.", "James P.", "Lisa K.", "Mike T.", "Emma R.", "Tom W.", "Amy L.", "Richard B.",
  "Jennifer S.", "David H.", "Sophie C.", "Mark F.", "Rachel G.", "Chris D.", "Laura B.",
  "Andrew N.", "Kate M.", "Daniel W.", "Hannah J.", "Steven R.", "Olivia P.", "Matthew C.",
];

const reviewComments: Record<string, string[]> = {
  italian: [
    "The pasta was absolutely divine! Best Italian food I've had outside of Italy.",
    "Authentic flavors that transported us straight to Tuscany. Incredible experience!",
    "The risotto was cooked to perfection. Will definitely book again!",
  ],
  french: [
    "Michelin-quality dining in our own home. Every course was a masterpiece!",
    "The attention to detail was extraordinary. A true French culinary experience.",
    "Perfectly executed classic French dishes. Outstanding service!",
  ],
  japanese: [
    "The sushi was impeccably fresh. Best omakase experience ever!",
    "Authentic Japanese flavors with beautiful presentation. Highly recommended!",
    "A culinary journey through Japan without leaving home. Exceptional!",
  ],
  indian: [
    "The spices were perfectly balanced. Most authentic Indian food I've tasted!",
    "From the biryani to the naan, everything was phenomenal!",
    "A true feast of flavors. The curry was out of this world!",
  ],
  chinese: [
    "The dim sum was restaurant quality. Absolutely delicious!",
    "Authentic Cantonese cooking at its finest. Every dish was perfect!",
    "The Peking duck was extraordinary. A memorable dining experience!",
  ],
  korean: [
    "Best Korean BBQ experience ever! The banchan was incredible!",
    "Authentic Korean flavors that reminded me of Seoul. Amazing!",
    "The bibimbap was perfectly prepared. Will book again!",
  ],
  mexican: [
    "The tacos were authentic and delicious. Best Mexican food I've had!",
    "From the mole to the churros, every dish was perfect!",
    "A true Mexican fiesta at home. Incredible flavors!",
  ],
  default: [
    "An exceptional dining experience from start to finish!",
    "Professional, friendly, and the food was outstanding. Highly recommend!",
    "One of the best private chef experiences we've ever had!",
  ],
};

const cuisineData: Record<string, { 
  names: { first: string; last: string; gender: 'male' | 'female' }[];
  specialties: string[];
  dietary: string[];
  displayName: string;
}> = {
  italian: {
    names: [
      { first: "Marco", last: "Rossi", gender: "male" },
      { first: "Giuseppe", last: "Ferrari", gender: "male" },
      { first: "Lucia", last: "Romano", gender: "female" },
      { first: "Sofia", last: "Conti", gender: "female" },
      { first: "Alessandro", last: "Esposito", gender: "male" },
      { first: "Francesca", last: "Ricci", gender: "female" },
      { first: "Lorenzo", last: "Marino", gender: "male" },
      { first: "Valentina", last: "Greco", gender: "female" },
    ],
    specialties: ["Pasta Making", "Risotto", "Neapolitan Pizza", "Regional Italian", "Wine Pairing", "Tiramisu", "Ossobuco", "Carpaccio"],
    dietary: ["vegetarian", "gluten-free"],
    displayName: "Italian",
  },
  french: {
    names: [
      { first: "Jean-Pierre", last: "Dubois", gender: "male" },
      { first: "Marie", last: "Laurent", gender: "female" },
      { first: "Pierre", last: "Martin", gender: "male" },
      { first: "Isabelle", last: "Bernard", gender: "female" },
      { first: "François", last: "Moreau", gender: "male" },
      { first: "Camille", last: "Lefebvre", gender: "female" },
      { first: "Antoine", last: "Leroy", gender: "male" },
      { first: "Élise", last: "Roux", gender: "female" },
    ],
    specialties: ["Classic French", "Pastry", "Sauces", "Fine Dining", "Soufflé", "Coq au Vin", "Croissants", "Crème Brûlée"],
    dietary: ["vegetarian"],
    displayName: "French",
  },
  japanese: {
    names: [
      { first: "Takeshi", last: "Tanaka", gender: "male" },
      { first: "Yuki", last: "Yamamoto", gender: "female" },
      { first: "Hiroshi", last: "Watanabe", gender: "male" },
      { first: "Sakura", last: "Ito", gender: "female" },
      { first: "Kenji", last: "Nakamura", gender: "male" },
      { first: "Akiko", last: "Suzuki", gender: "female" },
      { first: "Ryota", last: "Sato", gender: "male" },
      { first: "Mika", last: "Kobayashi", gender: "female" },
    ],
    specialties: ["Sushi", "Ramen", "Tempura", "Kaiseki", "Omakase", "Wagyu", "Izakaya", "Teppanyaki"],
    dietary: ["gluten-free", "dairy-free"],
    displayName: "Japanese",
  },
  indian: {
    names: [
      { first: "Raj", last: "Sharma", gender: "male" },
      { first: "Priya", last: "Patel", gender: "female" },
      { first: "Amit", last: "Kumar", gender: "male" },
      { first: "Deepa", last: "Singh", gender: "female" },
      { first: "Vikram", last: "Gupta", gender: "male" },
      { first: "Ananya", last: "Reddy", gender: "female" },
      { first: "Arjun", last: "Mehta", gender: "male" },
      { first: "Kavita", last: "Joshi", gender: "female" },
    ],
    specialties: ["Tandoori", "Curry", "Biryani", "Street Food", "South Indian", "Mughlai", "Dosa", "Thali"],
    dietary: ["vegetarian", "vegan", "halal"],
    displayName: "Indian",
  },
  chinese: {
    names: [
      { first: "Wei", last: "Zhang", gender: "male" },
      { first: "Mei", last: "Wang", gender: "female" },
      { first: "Chen", last: "Li", gender: "male" },
      { first: "Lin", last: "Liu", gender: "female" },
      { first: "Feng", last: "Chen", gender: "male" },
      { first: "Xiao", last: "Yang", gender: "female" },
      { first: "Ming", last: "Huang", gender: "male" },
      { first: "Hui", last: "Zhou", gender: "female" },
    ],
    specialties: ["Dim Sum", "Cantonese", "Szechuan", "Peking Duck", "Wok Cooking", "Dumplings", "Hot Pot", "Noodles"],
    dietary: ["gluten-free", "dairy-free"],
    displayName: "Chinese",
  },
  korean: {
    names: [
      { first: "Joon", last: "Kim", gender: "male" },
      { first: "Min-ji", last: "Park", gender: "female" },
      { first: "Hyun", last: "Lee", gender: "male" },
      { first: "Soo-yeon", last: "Choi", gender: "female" },
      { first: "Dong-woo", last: "Jung", gender: "male" },
      { first: "Ji-yeon", last: "Kang", gender: "female" },
      { first: "Sung-min", last: "Yoon", gender: "male" },
      { first: "Hana", last: "Lim", gender: "female" },
    ],
    specialties: ["Korean BBQ", "Kimchi", "Bibimbap", "Korean Fried Chicken", "Banchan", "Jjigae", "Kimbap", "Tteokbokki"],
    dietary: ["gluten-free", "halal"],
    displayName: "South Korean",
  },
  mexican: {
    names: [
      { first: "Carlos", last: "García", gender: "male" },
      { first: "Maria", last: "Rodriguez", gender: "female" },
      { first: "Juan", last: "Martinez", gender: "male" },
      { first: "Elena", last: "Lopez", gender: "female" },
      { first: "Miguel", last: "Hernandez", gender: "male" },
      { first: "Rosa", last: "Gonzalez", gender: "female" },
      { first: "Diego", last: "Sanchez", gender: "male" },
      { first: "Carmen", last: "Ramirez", gender: "female" },
    ],
    specialties: ["Tacos", "Mole", "Ceviche", "Street Food", "Oaxacan", "Yucatan", "Enchiladas", "Tamales"],
    dietary: ["gluten-free", "vegetarian"],
    displayName: "Mexican",
  },
  nigerian: {
    names: [
      { first: "Chidi", last: "Okonkwo", gender: "male" },
      { first: "Ngozi", last: "Adeyemi", gender: "female" },
      { first: "Emeka", last: "Nwosu", gender: "male" },
      { first: "Adaeze", last: "Okafor", gender: "female" },
      { first: "Oluwaseun", last: "Adesanya", gender: "male" },
      { first: "Chidinma", last: "Eze", gender: "female" },
      { first: "Tunde", last: "Bakare", gender: "male" },
      { first: "Amara", last: "Nnamdi", gender: "female" },
    ],
    specialties: ["Jollof Rice", "Suya", "Egusi Soup", "Pounded Yam", "Pepper Soup", "Ofada Rice", "Nigerian BBQ", "Chin Chin"],
    dietary: ["halal", "gluten-free"],
    displayName: "Nigerian",
  },
  southafrican: {
    names: [
      { first: "Thabo", last: "Molefe", gender: "male" },
      { first: "Naledi", last: "Ndlovu", gender: "female" },
      { first: "Sipho", last: "Dlamini", gender: "male" },
      { first: "Lerato", last: "Mokoena", gender: "female" },
      { first: "Andile", last: "Zulu", gender: "male" },
      { first: "Thandiwe", last: "Nkosi", gender: "female" },
      { first: "Bongani", last: "Khumalo", gender: "male" },
      { first: "Zanele", last: "Mthembu", gender: "female" },
    ],
    specialties: ["Braai", "Bobotie", "Bunny Chow", "Biltong", "Chakalaka", "Potjiekos", "Cape Malay", "Sosaties"],
    dietary: ["halal", "gluten-free"],
    displayName: "South African",
  },
  british: {
    names: [
      { first: "James", last: "Wilson", gender: "male" },
      { first: "Emma", last: "Thompson", gender: "female" },
      { first: "Oliver", last: "Brown", gender: "male" },
      { first: "Sophie", last: "Taylor", gender: "female" },
      { first: "William", last: "Davies", gender: "male" },
      { first: "Charlotte", last: "Evans", gender: "female" },
      { first: "Harry", last: "Roberts", gender: "male" },
      { first: "Olivia", last: "Walker", gender: "female" },
    ],
    specialties: ["Roast Dinner", "Fish & Chips", "Gastropub", "Modern British", "Afternoon Tea", "Pies", "Puddings", "Farm-to-Table"],
    dietary: ["vegetarian", "gluten-free"],
    displayName: "British",
  },
  spanish: {
    names: [
      { first: "Carlos", last: "Fernández", gender: "male" },
      { first: "María", last: "García", gender: "female" },
      { first: "Javier", last: "López", gender: "male" },
      { first: "Isabel", last: "Martín", gender: "female" },
      { first: "Antonio", last: "Sánchez", gender: "male" },
      { first: "Lucía", last: "Díaz", gender: "female" },
      { first: "Pablo", last: "Ruiz", gender: "male" },
      { first: "Elena", last: "Moreno", gender: "female" },
    ],
    specialties: ["Tapas", "Paella", "Gazpacho", "Jamón", "Basque", "Catalan", "Andalusian", "Seafood"],
    dietary: ["gluten-free", "dairy-free"],
    displayName: "Spanish",
  },
  portuguese: {
    names: [
      { first: "João", last: "Silva", gender: "male" },
      { first: "Ana", last: "Santos", gender: "female" },
      { first: "Pedro", last: "Oliveira", gender: "male" },
      { first: "Mariana", last: "Costa", gender: "female" },
      { first: "António", last: "Ferreira", gender: "male" },
      { first: "Sofia", last: "Pereira", gender: "female" },
      { first: "Miguel", last: "Rodrigues", gender: "male" },
      { first: "Beatriz", last: "Almeida", gender: "female" },
    ],
    specialties: ["Bacalhau", "Pastéis de Nata", "Seafood", "Grilled Sardines", "Cozido", "Francesinha", "Port Wine Pairing", "Algarve Cuisine"],
    dietary: ["gluten-free"],
    displayName: "Portuguese",
  },
  dutch: {
    names: [
      { first: "Willem", last: "de Vries", gender: "male" },
      { first: "Sophie", last: "Jansen", gender: "female" },
      { first: "Pieter", last: "van den Berg", gender: "male" },
      { first: "Emma", last: "Bakker", gender: "female" },
      { first: "Dirk", last: "Visser", gender: "male" },
      { first: "Anna", last: "Smit", gender: "female" },
      { first: "Jan", last: "Meijer", gender: "male" },
      { first: "Lotte", last: "de Boer", gender: "female" },
    ],
    specialties: ["Indonesian-Dutch Fusion", "Stamppot", "Herring", "Bitterballen", "Stroopwafels", "Dutch Cheese", "Modern Dutch", "Seafood"],
    dietary: ["vegetarian"],
    displayName: "Dutch",
  },
  irish: {
    names: [
      { first: "Sean", last: "O'Brien", gender: "male" },
      { first: "Siobhan", last: "Murphy", gender: "female" },
      { first: "Patrick", last: "Kelly", gender: "male" },
      { first: "Aoife", last: "Ryan", gender: "female" },
      { first: "Cian", last: "Walsh", gender: "male" },
      { first: "Niamh", last: "Byrne", gender: "female" },
      { first: "Declan", last: "O'Connor", gender: "male" },
      { first: "Orla", last: "Doyle", gender: "female" },
    ],
    specialties: ["Irish Stew", "Seafood", "Farm-to-Table", "Modern Irish", "Dublin Coddle", "Boxty", "Soda Bread", "Guinness Cooking"],
    dietary: ["gluten-free", "vegetarian"],
    displayName: "Irish",
  },
  arab: {
    names: [
      { first: "Ahmed", last: "Al-Rashid", gender: "male" },
      { first: "Fatima", last: "Hassan", gender: "female" },
      { first: "Omar", last: "Khalil", gender: "male" },
      { first: "Layla", last: "Mahmoud", gender: "female" },
      { first: "Hassan", last: "Ibrahim", gender: "male" },
      { first: "Noor", last: "Ali", gender: "female" },
      { first: "Karim", last: "Youssef", gender: "male" },
      { first: "Sara", last: "Abdullah", gender: "female" },
    ],
    specialties: ["Mezze", "Shawarma", "Kebabs", "Hummus", "Falafel", "Lebanese", "Moroccan", "Tagine"],
    dietary: ["halal", "vegetarian", "vegan"],
    displayName: "Arab/Middle Eastern",
  },
  ivorian: {
    names: [
      { first: "Kouadio", last: "Koné", gender: "male" },
      { first: "Aya", last: "Touré", gender: "female" },
      { first: "Sékou", last: "Diallo", gender: "male" },
      { first: "Mariame", last: "Coulibaly", gender: "female" },
      { first: "Konan", last: "Yao", gender: "male" },
      { first: "Adjoua", last: "Bamba", gender: "female" },
      { first: "Yao", last: "Koffi", gender: "male" },
      { first: "Akissi", last: "N'Guessan", gender: "female" },
    ],
    specialties: ["Attiéké", "Alloco", "Kedjenou", "Garba", "Foutou", "Sauce Graine", "Grilled Fish", "Ivorian BBQ"],
    dietary: ["halal", "gluten-free"],
    displayName: "Ivorian",
  },
  vietnamese: {
    names: [
      { first: "Minh", last: "Nguyen", gender: "male" },
      { first: "Linh", last: "Tran", gender: "female" },
      { first: "Tuan", last: "Le", gender: "male" },
      { first: "Thao", last: "Pham", gender: "female" },
      { first: "Duc", last: "Hoang", gender: "male" },
      { first: "Mai", last: "Vo", gender: "female" },
      { first: "Huy", last: "Dang", gender: "male" },
      { first: "Lan", last: "Bui", gender: "female" },
    ],
    specialties: ["Pho", "Bánh Mì", "Spring Rolls", "Street Food", "Vietnamese BBQ", "Seafood", "Bún Chả", "Com Tam"],
    dietary: ["gluten-free", "dairy-free"],
    displayName: "Vietnamese",
  },
  brazilian: {
    names: [
      { first: "Lucas", last: "Silva", gender: "male" },
      { first: "Ana", last: "Santos", gender: "female" },
      { first: "Rafael", last: "Oliveira", gender: "male" },
      { first: "Julia", last: "Costa", gender: "female" },
      { first: "Pedro", last: "Souza", gender: "male" },
      { first: "Mariana", last: "Lima", gender: "female" },
      { first: "Gabriel", last: "Pereira", gender: "male" },
      { first: "Isabela", last: "Rodrigues", gender: "female" },
    ],
    specialties: ["Churrasco", "Feijoada", "Moqueca", "Coxinha", "Pão de Queijo", "Açaí", "Bahian", "Rodízio"],
    dietary: ["gluten-free"],
    displayName: "Brazilian",
  },
  canadian: {
    names: [
      { first: "Michael", last: "Campbell", gender: "male" },
      { first: "Sarah", last: "MacDonald", gender: "female" },
      { first: "David", last: "Thompson", gender: "male" },
      { first: "Emily", last: "Anderson", gender: "female" },
      { first: "Christopher", last: "Mitchell", gender: "male" },
      { first: "Jennifer", last: "Wilson", gender: "female" },
      { first: "Ryan", last: "Morrison", gender: "male" },
      { first: "Ashley", last: "Fraser", gender: "female" },
    ],
    specialties: ["Farm-to-Table", "Pacific Northwest", "Poutine", "Montreal Bagels", "Quebec Cuisine", "Canadian BBQ", "Seafood", "Modern Canadian"],
    dietary: ["vegetarian", "gluten-free"],
    displayName: "Canadian",
  },
  thai: {
    names: [
      { first: "Somchai", last: "Srisawat", gender: "male" },
      { first: "Nari", last: "Chaiyasit", gender: "female" },
      { first: "Chai", last: "Prasert", gender: "male" },
      { first: "Mali", last: "Thongchai", gender: "female" },
      { first: "Prasert", last: "Kittisak", gender: "male" },
      { first: "Siri", last: "Wongsakorn", gender: "female" },
      { first: "Kiet", last: "Suwan", gender: "male" },
      { first: "Nok", last: "Rattana", gender: "female" },
    ],
    specialties: ["Pad Thai", "Green Curry", "Tom Yum", "Street Food", "Thai BBQ", "Massaman", "Som Tam", "Thai Desserts"],
    dietary: ["gluten-free", "vegan"],
    displayName: "Thai",
  },
  greek: {
    names: [
      { first: "Nikos", last: "Papadopoulos", gender: "male" },
      { first: "Sofia", last: "Georgiou", gender: "female" },
      { first: "Dimitris", last: "Konstantinou", gender: "male" },
      { first: "Elena", last: "Nikolaou", gender: "female" },
      { first: "Kostas", last: "Vasileiou", gender: "male" },
      { first: "Maria", last: "Alexandrou", gender: "female" },
      { first: "Yiannis", last: "Papadakis", gender: "male" },
      { first: "Anna", last: "Christodoulou", gender: "female" },
    ],
    specialties: ["Souvlaki", "Moussaka", "Mezze", "Seafood", "Greek Salad", "Spanakopita", "Lamb", "Mediterranean"],
    dietary: ["vegetarian", "gluten-free"],
    displayName: "Greek",
  },
  turkish: {
    names: [
      { first: "Mehmet", last: "Yılmaz", gender: "male" },
      { first: "Ayşe", last: "Kaya", gender: "female" },
      { first: "Ali", last: "Demir", gender: "male" },
      { first: "Zeynep", last: "Çelik", gender: "female" },
      { first: "Murat", last: "Şahin", gender: "male" },
      { first: "Elif", last: "Yıldız", gender: "female" },
      { first: "Kemal", last: "Öztürk", gender: "male" },
      { first: "Fatma", last: "Arslan", gender: "female" },
    ],
    specialties: ["Kebabs", "Meze", "Baklava", "Pide", "Lahmacun", "Ottoman Cuisine", "Turkish BBQ", "Seafood"],
    dietary: ["halal", "vegetarian"],
    displayName: "Turkish",
  },
  moroccan: {
    names: [
      { first: "Mohammed", last: "Benali", gender: "male" },
      { first: "Fatima", last: "El Idrissi", gender: "female" },
      { first: "Youssef", last: "Amrani", gender: "male" },
      { first: "Amina", last: "Berrada", gender: "female" },
      { first: "Hassan", last: "Fassi", gender: "male" },
      { first: "Khadija", last: "Alaoui", gender: "female" },
      { first: "Ahmed", last: "Tazi", gender: "male" },
      { first: "Zineb", last: "Cherkaoui", gender: "female" },
    ],
    specialties: ["Tagine", "Couscous", "Pastilla", "Harira", "Mechoui", "Moroccan BBQ", "Street Food", "Mint Tea Service"],
    dietary: ["halal", "gluten-free"],
    displayName: "Moroccan",
  },
  ethiopian: {
    names: [
      { first: "Solomon", last: "Tadesse", gender: "male" },
      { first: "Meron", last: "Haile", gender: "female" },
      { first: "Dawit", last: "Bekele", gender: "male" },
      { first: "Tigist", last: "Alemu", gender: "female" },
      { first: "Bereket", last: "Gebre", gender: "male" },
      { first: "Sara", last: "Mulugeta", gender: "female" },
      { first: "Yonas", last: "Tesfaye", gender: "male" },
      { first: "Helen", last: "Abebe", gender: "female" },
    ],
    specialties: ["Injera", "Doro Wat", "Kitfo", "Tibs", "Vegetarian Platters", "Coffee Ceremony", "Ethiopian BBQ", "Berbere Spiced"],
    dietary: ["vegan", "halal"],
    displayName: "Ethiopian",
  },
  peruvian: {
    names: [
      { first: "Carlos", last: "Vargas", gender: "male" },
      { first: "Maria", last: "Fernández", gender: "female" },
      { first: "Luis", last: "Castillo", gender: "male" },
      { first: "Ana", last: "Quispe", gender: "female" },
      { first: "Jorge", last: "Mendoza", gender: "male" },
      { first: "Rosa", last: "Huamán", gender: "female" },
      { first: "Diego", last: "Chávez", gender: "male" },
      { first: "Carmen", last: "Ramos", gender: "female" },
    ],
    specialties: ["Ceviche", "Lomo Saltado", "Anticuchos", "Causa", "Aji de Gallina", "Peruvian BBQ", "Nikkei", "Novo Andino"],
    dietary: ["gluten-free"],
    displayName: "Peruvian",
  },
  argentinian: {
    names: [
      { first: "Mateo", last: "González", gender: "male" },
      { first: "Sofía", last: "Fernández", gender: "female" },
      { first: "Lucas", last: "Rodríguez", gender: "male" },
      { first: "Valentina", last: "López", gender: "female" },
      { first: "Santiago", last: "Martínez", gender: "male" },
      { first: "Camila", last: "García", gender: "female" },
      { first: "Nicolás", last: "Pérez", gender: "male" },
      { first: "Isabella", last: "Díaz", gender: "female" },
    ],
    specialties: ["Asado", "Empanadas", "Milanesa", "Chimichurri", "Argentinian BBQ", "Parrilla", "Dulce de Leche", "Malbec Pairing"],
    dietary: ["gluten-free"],
    displayName: "Argentinian",
  },
};

const locations = [
  { city: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { city: "Manchester", country: "UK", lat: 53.4808, lng: -2.2426 },
  { city: "Birmingham", country: "UK", lat: 52.4862, lng: -1.8904 },
  { city: "Edinburgh", country: "UK", lat: 55.9533, lng: -3.1883 },
  { city: "Leeds", country: "UK", lat: 53.8008, lng: -1.5491 },
  { city: "Glasgow", country: "UK", lat: 55.8642, lng: -4.2518 },
  { city: "Bristol", country: "UK", lat: 51.4545, lng: -2.5879 },
  { city: "Liverpool", country: "UK", lat: 53.4084, lng: -2.9916 },
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { city: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  { city: "Miami", country: "USA", lat: 25.7617, lng: -80.1918 },
  { city: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { city: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { city: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { city: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },
  { city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780 },
  { city: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { city: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { city: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  { city: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  { city: "Abidjan", country: "Ivory Coast", lat: 5.3600, lng: -4.0083 },
  { city: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },
  { city: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { city: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { city: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { city: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
];

const serviceKeywords = [
  "daily-meal-prep", "family-chef", "seniors-meal", "student-meals", "couples-nights",
  "birthday-bash", "wedding-feast", "bridal-bachelor", "remembrance", "baby-shower",
  "office-lunch", "conference-chef", "school-meals", "military-mess", "flight-chef",
  "royalty-residence", "travel-chef", "michelin-home", "celebrity-wellness", "presidential-chef",
  "on-set-chef", "podcast-chef", "festival-booth", "kids-club", "holiday-feast"
];

const generateChefs = (): Chef[] => {
  const chefs: Chef[] = [];
  let id = 1;

  Object.entries(cuisineData).forEach(([cuisineKey, data]) => {
    data.names.forEach((nameData, nameIndex) => {
      const numVariants = 2;
      
      for (let variant = 0; variant < numVariants; variant++) {
        const location = locations[(id - 1) % locations.length];
        const fullName = `${nameData.first} ${nameData.last}`;
        const rating = (4.5 + Math.random() * 0.5);
        const reviews = 50 + Math.floor(Math.random() * 200);
          const baseRate = 75 + Math.floor(Math.random() * 100);
          const selectedSpecialties = [...data.specialties].sort(() => 0.5 - Math.random()).slice(0, 3);
          const experienceYears = 5 + Math.floor(Math.random() * 20);
          const selectedServices = [...serviceKeywords].sort(() => 0.5 - Math.random()).slice(0, 5);

          const cuisineKey2 = cuisineKey as keyof typeof reviewComments;
          const comments = reviewComments[cuisineKey2] || reviewComments.default;

          const chef: Chef = {
            id: `chef-${id}`,
            name: fullName,
            cuisine: `${data.displayName} Cuisine`,
            cuisineType: data.displayName,
            location: `${location.city}, ${location.country}`,
            country: location.country,
            lat: location.lat + (Math.random() - 0.5) * 0.05,
            lng: location.lng + (Math.random() - 0.5) * 0.05,
            rate: `£${baseRate}`,
            rateNumber: baseRate,
            rating: Math.round(rating * 10) / 10,
            reviews,
            img: generateAvatarUrl(fullName, nameData.gender, id),
            specialties: selectedSpecialties,
            dietaryOptions: data.dietary,
            bio: `Passionate ${data.displayName} chef with ${experienceYears}+ years of experience. Specializing in ${selectedSpecialties.slice(0, 2).join(" and ")}. Expert in ${selectedServices.slice(0, 2).map(s => s.replace(/-/g, ' ')).join(" and ")}. Based in ${location.city}, I bring authentic flavors and techniques to create unforgettable dining experiences in your home.`,
            experience: `${experienceYears}+ years`,
            languages: ["English", cuisineKey === "french" ? "French" : cuisineKey === "spanish" ? "Spanish" : cuisineKey === "japanese" ? "Japanese" : cuisineKey === "italian" ? "Italian" : "Local Language"],
            badges: ["Verified Chef", rating >= 4.8 ? "Top Rated" : "Rising Star", Math.random() > 0.5 ? "Quick Responder" : "Popular"],
            certifications: [
              "Level 2 Food Safety & Hygiene",
              "Public Liability Insurance (£5M)",
              "Professional Culinary Diploma",
              "Enhanced DBS (Background Check) Verified"
            ],
            services: selectedServices,
            menus: [

              { 
                name: `${data.displayName} Tasting Menu`, 
                price: `£${baseRate * 4}`, 
                description: `5-course ${data.displayName.toLowerCase()} dining experience`, 
                serves: "4-6 people",
                image: generateFoodImage(cuisineKey, 0),
                dishes: getCuisineDishes(cuisineKey, 0),
              },
              { 
                name: `${data.displayName} Feast`, 
                price: `£${baseRate * 3}`, 
                description: `Traditional ${data.displayName.toLowerCase()} family-style meal`, 
                serves: "4-6 people",
                image: generateFoodImage(cuisineKey, 1),
                dishes: getCuisineDishes(cuisineKey, 1),
              },
              { 
                name: `${data.displayName} Experience`, 
                price: `£${baseRate * 5}`, 
                description: `Premium 7-course culinary journey`, 
                serves: "6-8 people",
                image: generateFoodImage(cuisineKey, 2),
                dishes: getCuisineDishes(cuisineKey, 2),
              },
            ],
          foodImages: [
            generateFoodImage(cuisineKey, 0),
            generateFoodImage(cuisineKey, 1),
            generateFoodImage(cuisineKey, 2),
            generateFoodImage(cuisineKey, 3),
          ],
          customerReviews: [
            { name: reviewerNames[id % reviewerNames.length], rating: 5, comment: comments[0], date: "Dec 2025" },
            { name: reviewerNames[(id + 5) % reviewerNames.length], rating: 5, comment: comments[1] || comments[0], date: "Nov 2025" },
            { name: reviewerNames[(id + 10) % reviewerNames.length], rating: 4, comment: comments[2] || comments[0], date: "Oct 2025" },
          ],
        };

        chefs.push(chef);
        id++;
      }
    });
  });

  return chefs.sort(() => 0.5 - Math.random());
};

export const globalChefs = generateChefs();

export const getChefById = (id: string): Chef | undefined => {
  return globalChefs.find(c => c.id === id);
};

export const getChefsByFilter = (options: {
  cuisine?: string;
  dietary?: string[];
  location?: string;
  search?: string;
  limit?: number;
}): Chef[] => {
  let filtered = [...globalChefs];

  if (options.cuisine) {
    filtered = filtered.filter(c => c.cuisineType.toLowerCase().includes(options.cuisine!.toLowerCase()));
  }

  if (options.dietary && options.dietary.length > 0) {
    filtered = filtered.filter(c => options.dietary!.every(d => c.dietaryOptions.includes(d)));
  }

  if (options.location) {
    filtered = filtered.filter(c => 
      c.location.toLowerCase().includes(options.location!.toLowerCase()) ||
      c.country.toLowerCase().includes(options.location!.toLowerCase())
    );
  }

  if (options.search) {
    const search = options.search.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.cuisine.toLowerCase().includes(search) ||
      c.location.toLowerCase().includes(search) ||
      c.specialties.some(s => s.toLowerCase().includes(search))
    );
  }

  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
};

export const cuisineTypes = [
  "Italian", "French", "Japanese", "Indian", "Chinese", "South Korean", "Mexican",
  "Nigerian", "South African", "British", "Spanish", "Portuguese", "Dutch", "Irish",
  "Arab/Middle Eastern", "Ivorian", "Vietnamese", "Brazilian", "Canadian", "Thai",
  "Greek", "Turkish", "Moroccan", "Ethiopian", "Peruvian", "Argentinian"
];

export const dietaryOptions = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "halal", label: "Halal" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
];
