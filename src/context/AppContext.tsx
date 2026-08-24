import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Shop,
  Product,
  ProductCategory,
  Cart,
  CartItem,
  Address,
  Order,
  OrderStatus,
  DeliveryZone,
  DeliveryPartner,
  Transaction,
  ToastMessage,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_USERS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_DELIVERY_PARTNERS,
  INITIAL_TRANSACTIONS,
} from '../data/mockData';
import { deliveryService, cartService } from '../services';

interface LocationState {
  area: string;
  city: string;
  pincode: string;
  isDeliverable: boolean;
  zoneName?: string;
}

interface AppContextType {
  // Authentication & Roles
  currentUser: User | null;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;

  // Location & Delivery Area Check
  location: LocationState;
  setLocation: (loc: { area: string; city: string; pincode: string }) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  checkPincode: (pincode: string) => { isDeliverable: boolean; zone?: DeliveryZone };

  // Data Collections
  categories: ProductCategory[];
  shops: Shop[];
  products: Product[];
  deliveryZones: DeliveryZone[];
  addresses: Address[];
  orders: Order[];
  transactions: Transaction[];
  deliveryPartners: DeliveryPartner[];
  favoriteShopIds: string[];

  // Views & Navigation
  customerView: 'home' | 'shops' | 'shop-details' | 'checkout' | 'order-tracking' | 'order-history' | 'profile';
  setCustomerView: (view: 'home' | 'shops' | 'shop-details' | 'checkout' | 'order-tracking' | 'order-history' | 'profile') => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;

  // Cart
  cart: Cart;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  minOrderRequirement: { isMet: boolean; deficit: number; minAmount: number };
  cartDeliveryCharge: number;
  cartGrandTotal: number;
  cartConflictModal: {
    isOpen: boolean;
    pendingProduct: Product | null;
    pendingQuantity: number;
  };
  resolveCartConflict: (confirmClearAndAdd: boolean) => void;

  // Favorites
  toggleFavoriteShop: (shopId: string) => void;
  isFavoriteShop: (shopId: string) => boolean;

  // Addresses
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;

  // Orders
  placeOrder: (paymentMethod: 'COD' | 'UPI' | 'Card' | 'NetBanking', deliveryInstructions?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Shopkeeper Actions
  shopkeeperShop: Shop | null;
  updateShopProfile: (shopId: string, updates: Partial<Shop>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;

  // Delivery Partner Actions
  currentDeliveryPartner: DeliveryPartner | null;
  acceptDelivery: (orderId: string, partnerId: string) => void;
  updateDeliveryProgress: (orderId: string, status: 'Picked Up' | 'Out for Delivery' | 'Delivered') => void;

  // Admin Actions
  adminAddShop: (shop: Omit<Shop, 'id' | 'rating' | 'reviewCount'>) => void;
  adminUpdateShopStatus: (shopId: string, status: 'active' | 'pending' | 'suspended') => void;
  adminDeleteShop: (shopId: string) => void;
  adminAddDeliveryZone: (zone: Omit<DeliveryZone, 'id'>) => void;
  adminUpdateDeliveryZone: (id: string, zone: Partial<DeliveryZone>) => void;
  adminDeleteDeliveryZone: (id: string) => void;
  adminUpdateDeliveryPartner: (id: string, updates: Partial<DeliveryPartner>) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const STORAGE_KEY_ROLE = 'hs_role';
  const STORAGE_KEY_CART = 'hs_cart';
  const STORAGE_KEY_LOCATION = 'hs_loc';
  const STORAGE_KEY_FAVS = 'hs_favs';
  const STORAGE_KEY_ORDERS = 'hs_orders';
  const STORAGE_KEY_SHOPS = 'hs_shops';
  const STORAGE_KEY_PRODUCTS = 'hs_products';
  const STORAGE_KEY_ZONES = 'hs_zones';
  const STORAGE_KEY_ADDRESSES = 'hs_addresses';

  // Role & Auth
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEY_ROLE) as UserRole) || 'customer';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return INITIAL_USERS.find((u) => u.role === (localStorage.getItem(STORAGE_KEY_ROLE) || 'customer')) || INITIAL_USERS[0];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Location
  const [location, setLocationState] = useState<LocationState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      area: 'Koramangala',
      city: 'Bengaluru',
      pincode: '560034',
      isDeliverable: true,
      zoneName: 'Koramangala & HSR Central',
    };
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Collections state
  const [categories] = useState<ProductCategory[]>(INITIAL_CATEGORIES);
  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHOPS);
    return saved ? JSON.parse(saved) : INITIAL_SHOPS;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ZONES);
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_ZONES;
  });
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ADDRESSES);
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(INITIAL_ADDRESSES[0]?.id || null);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(INITIAL_DELIVERY_PARTNERS);
  const [favoriteShopIds, setFavoriteShopIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FAVS);
    return saved ? JSON.parse(saved) : ['shop-1', 'shop-2'];
  });

  // Navigation & UI state
  const [customerView, setCustomerView] = useState<'home' | 'shops' | 'shop-details' | 'checkout' | 'order-tracking' | 'order-history' | 'profile'>('home');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(INITIAL_ORDERS[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Cart state
  const [cart, setCart] = useState<Cart>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CART);
    return saved ? JSON.parse(saved) : { shopId: null, shopName: null, items: [] };
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartConflictModal, setCartConflictModal] = useState<{
    isOpen: boolean;
    pendingProduct: Product | null;
    pendingQuantity: number;
  }>({
    isOpen: false,
    pendingProduct: null,
    pendingQuantity: 1,
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favoriteShopIds));
  }, [favoriteShopIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ZONES, JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  // Toast Helpers
  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch role and update current demo user
  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const matchedUser = INITIAL_USERS.find((u) => u.role === newRole) || {
      id: `user-${newRole}-1`,
      name: `${newRole.toUpperCase()} User`,
      phone: '+91 99999 00000',
      email: `${newRole}@homesale.in`,
      role: newRole,
    };
    setCurrentUser(matchedUser);
    addToast('info', `Switched to ${newRole.toUpperCase()} mode`, `Demonstrating the ${newRole} experience.`);
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthModalOpen(false);
    addToast('success', 'Logged in successfully', `Welcome back, ${user.name}!`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    addToast('info', 'Logged out', 'You have been logged out of HOMESALE.');
  };

  // Location handler
  const checkPincode = (pincode: string) => {
    return deliveryService.isPincodeDeliverable(pincode, deliveryZones);
  };

  const setLocation = (loc: { area: string; city: string; pincode: string }) => {
    const check = checkPincode(loc.pincode);
    const updatedLocation: LocationState = {
      area: loc.area,
      city: loc.city,
      pincode: loc.pincode,
      isDeliverable: check.isDeliverable,
      zoneName: check.zone?.name,
    };
    setLocationState(updatedLocation);
    setIsLocationModalOpen(false);

    if (check.isDeliverable) {
      addToast('success', 'Location updated', `Delivering to ${loc.area}, ${loc.pincode}`);
    } else {
      addToast('warning', 'Limited Service Area', `Sorry! HOMESALE is currently not available in pincode ${loc.pincode}.`);
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    const shop = shops.find((s) => s.id === product.shopId);
    const shopName = shop?.name || 'Local Shop';

    // Check if cart has items from a different shop
    if (cart.items.length > 0 && cart.shopId && cart.shopId !== product.shopId) {
      setCartConflictModal({
        isOpen: true,
        pendingProduct: product,
        pendingQuantity: quantity,
      });
      return;
    }

    setCart((prev) => {
      const existingIdx = prev.items.findIndex((item) => item.product.id === product.id);
      let updatedItems: CartItem[];

      if (existingIdx > -1) {
        updatedItems = [...prev.items];
        updatedItems[existingIdx] = {
          ...updatedItems[existingIdx],
          quantity: updatedItems[existingIdx].quantity + quantity,
        };
      } else {
        updatedItems = [...prev.items, { product, quantity }];
      }

      return {
        shopId: product.shopId,
        shopName: shopName,
        items: updatedItems,
      };
    });

    addToast('success', 'Added to Cart', `${product.name} (${quantity} added)`);
  };

  const resolveCartConflict = (confirmClearAndAdd: boolean) => {
    if (confirmClearAndAdd && cartConflictModal.pendingProduct) {
      const prod = cartConflictModal.pendingProduct;
      const qty = cartConflictModal.pendingQuantity;
      const shop = shops.find((s) => s.id === prod.shopId);

      setCart({
        shopId: prod.shopId,
        shopName: shop?.name || 'Local Shop',
        items: [{ product: prod, quantity: qty }],
      });
      addToast('success', 'Cart Replaced', `Previous cart cleared. Added ${prod.name} from ${shop?.name}.`);
    }
    setCartConflictModal({
      isOpen: false,
      pendingProduct: null,
      pendingQuantity: 1,
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const existingIdx = prev.items.findIndex((item) => item.product.id === productId);
      if (existingIdx === -1) return prev;

      const updatedItems = [...prev.items];
      const newQty = updatedItems[existingIdx].quantity + delta;

      if (newQty <= 0) {
        updatedItems.splice(existingIdx, 1);
      } else {
        updatedItems[existingIdx] = {
          ...updatedItems[existingIdx],
          quantity: newQty,
        };
      }

      return {
        shopId: updatedItems.length > 0 ? prev.shopId : null,
        shopName: updatedItems.length > 0 ? prev.shopName : null,
        items: updatedItems,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const filtered = prev.items.filter((item) => item.product.id !== productId);
      return {
        shopId: filtered.length > 0 ? prev.shopId : null,
        shopName: filtered.length > 0 ? prev.shopName : null,
        items: filtered,
      };
    });
    addToast('info', 'Item removed from cart');
  };

  const clearCart = () => {
    setCart({ shopId: null, shopName: null, items: [] });
    addToast('info', 'Cart cleared');
  };

  // Cart Calculations
  const cartSubtotal = cartService.calculateSubtotal(cart.items);
  const minOrderRequirement = {
    ...cartService.checkMinimumOrder(cartSubtotal, 150),
    minAmount: 150,
  };

  // Get matching delivery zone and shop delivery charge
  const activeZone = deliveryZones.find((z) => z.isActive && z.pincodes.includes(location.pincode));
  const currentShopInCart = shops.find((s) => s.id === cart.shopId);
  const cartDeliveryCharge = cart.items.length > 0
    ? deliveryService.calculateDeliveryCharge(cartSubtotal, activeZone, currentShopInCart?.deliveryCharge)
    : 0;
  const cartGrandTotal = cart.items.length > 0 ? cartSubtotal + cartDeliveryCharge : 0;

  // Favorites
  const toggleFavoriteShop = (shopId: string) => {
    setFavoriteShopIds((prev) => {
      if (prev.includes(shopId)) {
        addToast('info', 'Removed from favorites');
        return prev.filter((id) => id !== shopId);
      } else {
        addToast('success', 'Added to favorite shops', 'You can quickly access this shop from Favorites.');
        return [...prev, shopId];
      }
    });
  };

  const isFavoriteShop = (shopId: string) => favoriteShopIds.includes(shopId);

  // Address Management
  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = 'addr-' + Date.now();
    const created: Address = {
      ...newAddr,
      id,
    };
    if (newAddr.isDefault || addresses.length === 0) {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: false })).concat({ ...created, isDefault: true })
      );
      setSelectedAddressId(id);
    } else {
      setAddresses((prev) => [...prev, created]);
    }
    addToast('success', 'Address added successfully');
    return created;
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id) {
          return { ...addr, ...updates };
        }
        if (updates.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
    addToast('success', 'Address updated');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (selectedAddressId === id) {
        setSelectedAddressId(filtered[0]?.id || null);
      }
      return filtered;
    });
    addToast('info', 'Address deleted');
  };

  // Place Order
  const placeOrder = async (
    paymentMethod: 'COD' | 'UPI' | 'Card' | 'NetBanking',
    deliveryInstructions?: string
  ): Promise<Order> => {
    const shop = shops.find((s) => s.id === cart.shopId) || shops[0];
    const currentAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

    const orderId = 'ord-' + Date.now();
    const orderNumber = 'HS-' + Math.floor(10000 + Math.random() * 90000);

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerId: currentUser?.id || 'user-guest',
      customerName: currentUser?.name || 'Aarav Sharma',
      customerPhone: currentUser?.phone || currentAddress.phone || '+91 98765 43210',
      shopId: shop.id,
      shopName: shop.name,
      shopAddress: shop.address,
      shopPhone: shop.phone,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        unit: item.product.unit,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      productSubtotal: cartSubtotal,
      deliveryCharge: cartDeliveryCharge,
      grandTotal: cartGrandTotal,
      deliveryAddress: {
        ...currentAddress,
        deliveryInstructions: deliveryInstructions || currentAddress.deliveryInstructions,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Order Placed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '20-25 mins',
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Order submitted to shopkeeper',
        },
      ],
    };

    // Log transaction
    const newTxn: Transaction = {
      id: 'txn-' + Date.now(),
      transactionId: 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000),
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerId: newOrder.customerId,
      customerName: newOrder.customerName,
      shopId: newOrder.shopId,
      shopName: newOrder.shopName,
      productAmount: newOrder.productSubtotal,
      deliveryCharge: newOrder.deliveryCharge,
      totalAmount: newOrder.grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Success',
      orderStatus: 'Order Placed',
      timestamp: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setTransactions((prev) => [newTxn, ...prev]);
    setTrackingOrderId(newOrder.id);
    clearCart();
    setCustomerView('order-tracking');

    addToast('success', 'Order Placed Successfully!', `Order ${orderNumber} is now sent to ${shop.name}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...ord,
            orderStatus: status,
            statusHistory: [...ord.statusHistory, { status, timestamp, note }],
          };
        }
        return ord;
      })
    );

    // Update corresponding transaction if delivered/cancelled
    setTransactions((prev) =>
      prev.map((txn) => {
        if (txn.orderId === orderId) {
          return {
            ...txn,
            orderStatus: status,
            paymentStatus: status === 'Delivered' ? 'Success' : status === 'Cancelled' ? 'Refunded' : txn.paymentStatus,
          };
        }
        return txn;
      })
    );

    addToast('info', `Order ${status}`, note || `Order updated to ${status}`);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'Cancelled', reason || 'Cancelled by customer');
    addToast('warning', 'Order Cancelled', reason || 'The order has been cancelled.');
  };

  // Shopkeeper Actions
  const shopkeeperShop = shops.find((s) => s.ownerId === currentUser?.id || s.id === currentUser?.shopId) || shops[0];

  const updateShopProfile = (shopId: string, updates: Partial<Shop>) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, ...updates } : s))
    );
    addToast('success', 'Shop details updated successfully');
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = 'prod-' + Date.now();
    const created: Product = {
      ...newProd,
      id,
    };
    setProducts((prev) => [created, ...prev]);
    addToast('success', 'Product added to catalogue', created.name);
    return created;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('success', 'Product updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Product removed from catalogue');
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
    const prod = products.find((p) => p.id === id);
    addToast('info', 'Stock status updated', `${prod?.name}: ${!prod?.inStock ? 'In Stock' : 'Out of Stock'}`);
  };

  // Delivery Partner Actions
  const currentDeliveryPartner = deliveryPartners.find((dp) => dp.id === currentUser?.id) || deliveryPartners[0];

  const acceptDelivery = (orderId: string, partnerId: string) => {
    const partner = deliveryPartners.find((dp) => dp.id === partnerId) || currentDeliveryPartner;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...ord,
            deliveryPartnerId: partner.id,
            deliveryPartnerName: partner.name,
            deliveryPartnerPhone: partner.phone,
            orderStatus: 'Delivery Partner Assigned',
            statusHistory: [
              ...ord.statusHistory,
              { status: 'Delivery Partner Assigned', timestamp, note: `${partner.name} accepted delivery task` },
            ],
          };
        }
        return ord;
      })
    );

    setDeliveryPartners((prev) =>
      prev.map((dp) => (dp.id === partnerId ? { ...dp, status: 'on_delivery', currentOrderId: orderId } : dp))
    );

    addToast('success', 'Delivery Task Accepted', `Head to pickup shop to collect package.`);
  };

  const updateDeliveryProgress = (orderId: string, status: 'Picked Up' | 'Out for Delivery' | 'Delivered') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            orderStatus: status,
            paymentStatus: status === 'Delivered' ? 'Paid' : ord.paymentStatus,
            statusHistory: [...ord.statusHistory, { status, timestamp }],
          };
        }
        return ord;
      })
    );

    if (status === 'Delivered') {
      setDeliveryPartners((prev) =>
        prev.map((dp) => {
          if (dp.currentOrderId === orderId || dp.id === currentUser?.id) {
            return {
              ...dp,
              status: 'active',
              currentOrderId: undefined,
              totalDeliveries: dp.totalDeliveries + 1,
              todayEarnings: dp.todayEarnings + 45,
              totalEarnings: dp.totalEarnings + 45,
            };
          }
          return dp;
        })
      );
      addToast('success', 'Order Delivered!', 'Earned ₹45 delivery payout.');
    } else {
      addToast('info', `Status: ${status}`);
    }
  };

  // Admin Actions
  const adminAddShop = (newShop: Omit<Shop, 'id' | 'rating' | 'reviewCount'>) => {
    const id = 'shop-' + Date.now();
    const created: Shop = {
      ...newShop,
      id,
      rating: 5.0,
      reviewCount: 1,
    };
    setShops((prev) => [created, ...prev]);
    addToast('success', 'Shop Added', `${created.name} registered into HOMESALE.`);
  };

  const adminUpdateShopStatus = (shopId: string, status: 'active' | 'pending' | 'suspended') => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, status } : s))
    );
    addToast('info', 'Shop Status Updated', `Status changed to ${status}.`);
  };

  const adminDeleteShop = (shopId: string) => {
    setShops((prev) => prev.filter((s) => s.id !== shopId));
    addToast('warning', 'Shop Removed', 'Shop has been deleted from platform.');
  };

  const adminAddDeliveryZone = (zone: Omit<DeliveryZone, 'id'>) => {
    const id = 'zone-' + Date.now();
    const created: DeliveryZone = { ...zone, id };
    setDeliveryZones((prev) => [...prev, created]);
    addToast('success', 'Delivery Zone Added', created.name);
  };

  const adminUpdateDeliveryZone = (id: string, zoneUpdates: Partial<DeliveryZone>) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, ...zoneUpdates } : z))
    );
    addToast('success', 'Delivery Zone Updated');
  };

  const adminDeleteDeliveryZone = (id: string) => {
    setDeliveryZones((prev) => prev.filter((z) => z.id !== id));
    addToast('info', 'Delivery Zone Deleted');
  };

  const adminUpdateDeliveryPartner = (id: string, updates: Partial<DeliveryPartner>) => {
    setDeliveryPartners((prev) =>
      prev.map((dp) => (dp.id === id ? { ...dp, ...updates } : dp))
    );
    addToast('success', 'Delivery Partner Updated');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        location,
        setLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        checkPincode,
        categories,
        shops,
        products,
        deliveryZones,
        addresses,
        orders,
        transactions,
        deliveryPartners,
        favoriteShopIds,
        customerView,
        setCustomerView,
        selectedShopId,
        setSelectedShopId,
        selectedProduct,
        setSelectedProduct,
        trackingOrderId,
        setTrackingOrderId,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        cart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        minOrderRequirement,
        cartDeliveryCharge,
        cartGrandTotal,
        cartConflictModal,
        resolveCartConflict,
        toggleFavoriteShop,
        isFavoriteShop,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        shopkeeperShop,
        updateShopProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        currentDeliveryPartner,
        acceptDelivery,
        updateDeliveryProgress,
        adminAddShop,
        adminUpdateShopStatus,
        adminDeleteShop,
        adminAddDeliveryZone,
        adminUpdateDeliveryZone,
        adminDeleteDeliveryZone,
        adminUpdateDeliveryPartner,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
