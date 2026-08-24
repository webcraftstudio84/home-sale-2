import {
  Shop,
  Product,
  Order,
  Cart,
  CartItem,
  DeliveryZone,
  User,
  Address,
  Transaction,
  DeliveryPartner,
  OrderStatus,
} from '../types';

/**
 * Service abstraction layer for HOMESALE.
 * In this frontend version, services interact with React state and localStorage.
 * When integrating with a real backend, these functions can be swapped with Axios / Fetch API endpoints.
 */

export const shopService = {
  getShops: async (): Promise<Shop[]> => {
    return [];
  },
  getShopById: async (shopId: string, shops: Shop[]): Promise<Shop | undefined> => {
    return shops.find((s) => s.id === shopId);
  },
  filterShops: (
    shops: Shop[],
    query: string,
    category?: string,
    openOnly: boolean = false
  ): Shop[] => {
    return shops.filter((shop) => {
      const matchesQuery =
        !query ||
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.category.toLowerCase().includes(query.toLowerCase()) ||
        shop.area.toLowerCase().includes(query.toLowerCase()) ||
        shop.description.toLowerCase().includes(query.toLowerCase());

      const matchesCat = !category || category === 'All' || shop.category === category;
      const matchesOpen = !openOnly || shop.isOpen;

      return matchesQuery && matchesCat && matchesOpen;
    });
  },
};

export const productService = {
  getProductsByShop: (products: Product[], shopId: string): Product[] => {
    return products.filter((p) => p.shopId === shopId);
  },
  searchProducts: (products: Product[], query: string): Product[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  },
  getProductCategoriesForShop: (products: Product[], shopId: string): string[] => {
    const shopProds = products.filter((p) => p.shopId === shopId);
    const set = new Set(shopProds.map((p) => p.category));
    return Array.from(set);
  },
};

export const deliveryService = {
  isPincodeDeliverable: (pincode: string, zones: DeliveryZone[]): { isDeliverable: boolean; zone?: DeliveryZone } => {
    const cleanPin = pincode.trim();
    for (const zone of zones) {
      if (zone.isActive && zone.pincodes.includes(cleanPin)) {
        return { isDeliverable: true, zone };
      }
    }
    return { isDeliverable: false };
  },
  calculateDeliveryCharge: (subtotal: number, zone?: DeliveryZone, shopCharge?: number): number => {
    if (zone && zone.standardDeliveryCharge) {
      return zone.standardDeliveryCharge;
    }
    return shopCharge !== undefined ? shopCharge : 30;
  },
};

export const cartService = {
  calculateSubtotal: (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
  checkMinimumOrder: (subtotal: number, minOrder: number = 150): { isMet: boolean; deficit: number } => {
    const deficit = Math.max(0, minOrder - subtotal);
    return {
      isMet: subtotal >= minOrder,
      deficit,
    };
  },
};
