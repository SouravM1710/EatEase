const restaurants = [
  {
    id: 1,
    name: "Spice Villa",
    cuisine: "Indian, Chinese",
    rating: 4.5,
    time: "30 mins",
    image: "https://picsum.photos/400/300?random=1",
    menu: [
      { id: 101, name: "Paneer Butter Masala", price: 220 },
      { id: 102, name: "Veg Fried Rice", price: 180 },
      { id: 103, name: "Butter Naan", price: 40 },
    ],
  },
  {
    id: 2,
    name: "Burger Hub",
    cuisine: "Burgers, Fast Food",
    rating: 4.2,
    time: "25 mins",
    image: "https://picsum.photos/400/300?random=2",
    menu: [
      { id: 201, name: "Cheese Burger", price: 150 },
      { id: 202, name: "French Fries", price: 90 },
      { id: 203, name: "Veg Wrap", price: 120 },
    ],
  },
  {
    id: 3,
    name: "Pizza Palace",
    cuisine: "Italian, Pizza",
    rating: 4.6,
    time: "35 mins",
    image: "https://picsum.photos/400/300?random=3",
    menu: [
      { id: 301, name: "Margherita Pizza", price: 250 },
      { id: 302, name: "Farmhouse Pizza", price: 320 },
      { id: 303, name: "Garlic Bread", price: 140 },
    ],
  },
]

export default restaurants
