// hasNextPage
// :
// false
// productCount
// :
// 2
// products
// :
// Array(2)
// 0
// :
// adminStatus
// :
// "PENDING"
// id
// :
// "acc09c97-b3e8-4386-b33d-43131c24aed8"
// images
// :
// (3) ['https://res.cloudinary.com/di6zqorpf/image/upload/v1778690508/products/fcbrotxsyusavmee36gh.png', 'https://res.cloudinary.com/di6zqorpf/image/upload/v1778690509/products/ftrpeyuuslnvkxt3ibun.png', 'https://res.cloudinary.com/di6zqorpf/image/upload/v1778690510/products/uzcwt7l7ooxfpryv32ot.png']
// isActive
// :
// true
// isOrganic
// :
// false
// name
// :
// "Potato"
// price
// :
// 50
// slug
// :
// // "potato"
// // status
// // :
// // "ACTIVE"
// // stock
// // :
// // 0
// // unit
// // :
// // "kg"
// // variants
// // :
// // []
// // weight
// // :
// // null

// model ProductVariant {
//   id        String   @id @default(uuid())
//   productId String
//   name      String // "500g", "1kg", "2L"
//   price     Float
//   salePrice Float?
//   stock     Int      @default(0)
//   sku       String?
//   isActive  Boolean  @default(true)
//   createdAt DateTime @default(now())

//   product    Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
//   cartItems  CartItem[]
//   orderItems OrderItem[]

//   @@unique([productId, sku])
// }

type ProductVariant = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AdminStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
type Status = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED";

export type StoreProducts = {
  id: string;
  images: string[];
  isActive: boolean;
  name: string;
  slug: string;
  status: Status;
  price: number;
  stock: number;
  adminStatus: AdminStatus;
  variants: ProductVariant[];
  avgRating: number;
  lowStockAlert: number;
};

export type StoreProductsResponse = {
  productCount: number;
  hasNextPage: boolean;
  products: StoreProducts[];
};
