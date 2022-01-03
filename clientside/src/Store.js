import create from "zustand";
import { persist } from "zustand/middleware";

const products = [
  {
    name: "Bananas",
    details: "(5 pack)",
    image: (
      <img
        width="60%"
        src="https://images.ctfassets.net/6jpeaipefazr/2RmcxZM3iBnnPzQ1pFZ4Hg/da538d311b629159541cec1aae50ac11/F3_Bananas_1000x1000.jpg?w=1080&h=1080"
        alt="bananas"
      />
    ),
    price: 0.8,
    qty: 0,
    description: "Brazil's finest fair trade bunch of 5 bananas",
  },
  {
    name: "Apples",
    details: "(4 pack)",
    image: (
      <img
        width="60%"
        src="https://bellavitashop.co.uk/6288-large_default/red-apples-500g.jpg"
        alt="apples"
      />
    ),
    price: 0.4,
    qty: 0,
    description: "Class 2 succulent Spanish red apples - 4pk.",
  },
  {
    name: "Oranges",
    details: "(4 pack)",
    image: (
      <img
        width="60%"
        src="https://theartisanfoodcompany.com/wp-content/uploads/2021/05/Navel-Oranges-The-Artisan-Food-Company.jpg"
        alt="oranges"
      />
    ),
    price: 0.5,
    qty: 0,
    description: "Juicy class 1 South African oranges, may contain pips.",
  },
  {
    name: "Peaches",
    details: "(4 pack)",
    image: (
      <img
        width="60%"
        src="https://static.libertyprim.com/files/familles/peche-large.jpg?1574630286"
        alt="peaches"
      />
    ),
    price: 1.1,
    qty: 0,
    description:
      "Perfectly ripe, Class I peaches with a sweet and juicy flavour.",
  },
  {
    name: "Melon",
    details: "(single)",
    image: (
      <img
        width="60%"
        src="https://static.libertyprim.com/files/familles/melon-large.jpg?1574629891"
        alt="Melon"
      />
    ),
    price: 1.5,
    qty: 0,
    description: "Sweet and fragrant, packed with vitamins & goodness!",
  },
  {
    name: "Blueberries",
    details: "(150g)",
    image: (
      <img
        width="60%"
        src="https://www.redsofa.co.za/wp-content/uploads/products/blueberries-1.png"
        alt="blueberries"
      />
    ),
    price: 1.2,
    qty: 0,
    description: "Hand picked for freshness, perfect for breakfast! ",
  },
];

const useStore = create((set, get) => ({
  isValidUser: false,
  setValidUser: async () => {
    try {
      const response = await fetch(
        "https://samsfruitstore-pernstack.herokuapp.com/verify",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        set({ isValidUser: true });
      } else {
        const error = await response.text();
        if (error === "jwt expired") {
          alert("your session has timed out.");
          set({ isValidUser: false });
        }
      }
    } catch (error) {
      return;
    }
  },
  userName: "",
  itemCount: 0,
  addItemCount: () => set((state) => ({ itemCount: state.itemCount + 1 })),
  removeItems: () => set({ itemCount: 0 }),
  products: products,
  setProdDefault: () => set((state) => ({ products: products })),
  itemNames: products.map((product) => product.name),
  itemPrices: products.map((product) => product.price),
  greyOut: () => {
    const container =
      document.getElementById("formy") || document.getElementById("checkout");

    if (container) {
      container.style.zIndex = "-1";
    }
    document.getElementById("root").style.backgroundColor = "rgba(0,0,0,0.5)";
    document.querySelector("body").style.background = "none";
  },
  accInfoDisplay: "none",

  // input: "",
  // setInput: (e) => set(state => ({ input: e.target.value})),

  filterProducts: (e) => {
    const inputValue = document.getElementById("searchbar").value;

    if (
      e.key === "Enter" ||
      e.target === document.getElementById("searchbtn")
    ) {
      set((state) => ({
        products: state.products.filter(
          (product) =>
            product.name === inputValue ||
            product.name.toLowerCase() === inputValue
        ),
      }));
    }
  },

  // cartItems: [],
}));

export const cartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
    }),
    {
      name: "cart",
      getStorage: () => sessionStorage,
    }
  )
);

export default useStore;
