export type UserRole = 'customer' | 'shopkeeper' | 'delivery' | 'admin';

export type AccountStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  shopId?: string; // If shopkeeper
  username?: string;
  password?: string;
  approvalStatus?: AccountStatus;
  registeredAt?: string;
  address?: string;
  vehicleType?: 'Bike' | 'Scooter' | 'Bicycle' | 'EV';
  vehicleNumber?: string;
  preferredArea?: string;
  rejectionReason?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
  tag?: 'Home' | 'Work' | 'Other';
}

export interface ProductCategory {
  id: string;
  name: string;
  iconName: string;
  image: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  category: string;
  price: number; // in INR
  originalPrice?: number; // for discount calculation
  unit: string; // e.g. "1 kg", "500 g", "1 litre", "1 pack"
  image: string;
  inStock: boolean;
  stockQuantity: number;
  isVeg?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Shop {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  logo: string;
  banner: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
  estimatedDeliveryTime: string; // e.g. "15-25 min"
  distanceKm: number;
  deliveryCharge: number;
  address: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
  isVerified: boolean;
  status: AccountStatus;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  username?: string;
  password?: string;
  registeredAt?: string;
  rejectionReason?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  shopId: string | null;
  shopName: string | null;
  items: CartItem[];
}

export type OrderStatus =
  | 'Order Placed'
  | 'Shopkeeper Accepted'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Delivery Partner Assigned'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Rejected';

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shopId: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  items: OrderItem[];
  productSubtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  deliveryAddress: Address;
  paymentMethod: 'COD' | 'UPI' | 'Card' | 'NetBanking';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  cancellationReason?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  city: string;
  pincodes: string[];
  minimumOrderAmount: number; // default 150
  standardDeliveryCharge: number;
  isActive: boolean;
  estimatedTimeMin: number;
}

export interface Transaction {
  id: string;
  transactionId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  shopId: string;
  shopName: string;
  productAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  orderStatus: OrderStatus;
  timestamp: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'Bike' | 'Scooter' | 'Bicycle' | 'EV';
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  todayEarnings: number;
  totalEarnings: number;
  status: 'active' | 'on_delivery' | 'offline';
  approvalStatus?: AccountStatus;
  currentOrderId?: string;
  avatarUrl: string;
  username?: string;
  password?: string;
  address?: string;
  preferredArea?: string;
  registeredAt?: string;
  rejectionReason?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}
