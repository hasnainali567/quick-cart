# Quick Cart Backend — API Documentation (summary)

Note: Auth endpoints are handled by `better-auth` middleware mounted at `/auth`.

Base path notes:
- Protected routes are mounted under `/` and require authentication.
- Protected customer routes are under `/customer` (require active order middleware in some cases).
- Admin routes are under `/admin` and require `SUPER_ADMIN` role.
- Public routes are mounted under `/public` (currently empty).

---

## Auth
- `ALL /auth/*` — delegated to `better-auth` middleware. See auth provider for login/register flows.

---

## Customer (Protected)

- `GET /customer/profile`
  - Auth: required
  - Request: none
  - Response 200: user object

- `PATCH /customer/profile`
  - Auth: required
  - Body (any): { name?: string, phone?: string }
  - Response 200: updated user

- `GET /customer/profile/notifications`
  - Auth: required
  - Response 200: [notification]

- Addresses
  - `GET /customer/profile/addresses` — Response 200: [address]
  - `POST /customer/profile/addresses` — Body: { label?, fullName, phone, addressLine1, addressLine2?, area, city, province, country, latitude?, longitude?, isDefault? }
    - Response 201: created address
  - `PATCH /customer/profile/addresses/:id` — Body: any of address fields above
    - Response 200: updated address
  - `DELETE /customer/profile/addresses/:id` — Response 200: deleted address
  - `PATCH /customer/profile/addresses/:id/default` — toggles default — Response 200

- Cart
  - `GET /customer/cart` — Response 200: cart with items
  - `POST /customer/cart` — Body: { item: { productId, variantId?, quantity } }
    - Response 201: cart item created
  - `PATCH /customer/cart/:itemId` — Body: { quantity }
    - Response 200: updated cart item
  - `DELETE /customer/cart/:itemId` — Response 200: removed item
  - `DELETE /customer/cart` — Response 200: clears cart

---

## Driver (Protected)

- `POST /driver/register`
  - Body: { vehicleType, vehicleName, vehicleNumber, currentLatitude?, currentLongitude? }
  - Response 201: created driver

- `GET /driver` — returns driver dashboard/summary (200)
- `GET /driver/nearby` — returns nearby drivers for store owner (200)
- `PATCH /driver/status` — toggles ONLINE/OFFLINE (200)
- `PUT /driver/location` — Body: { currentLatitude, currentLongitude } — Response 200: updated driver location
- `GET /driver/deliveries` — Response 200: [deliveries]
- `GET /driver/profile` — Response 200: driver profile

---

## Store (Protected — store admin)

- `POST /store/register`
  - Body: { name, addressLine1, city, area, latitude?, longitude? }
  - Response 200: created store

- `GET /store` — store details (200)
- `GET /store/review` — store review payload (200)
- `PATCH /store/:id/update` — Body: { name?, slug?, description?, phone?, email?, area?, city?, latitude?, longitude?, serviceRadiusKm?, minimumOrderAmount?, freeDeliveryAbove?, openingTime?, closingTime?, workingDays? }
  - Response 200: updated store
- `GET /store/:id/logo-banner` — returns logo & banner (200)
- `PATCH /store/:id/logo` — multipart single image `logo` — Response 200
- `PATCH /store/:id/banner` — multipart single image `banner` — Response 200
- `PATCH /store/:id/status` — toggles OPEN/CLOSED (200)
- `GET /store/:id/earnings` — returns earnings analytics (200)
- `GET /store/:id/timings` — returns timings (200)
- `PATCH /store/:id/timings` — Body: timings array — Response 200
- `GET /store/:id/location` — Response 200
- `PATCH /store/:id/location` — Body: { latitude, longitude } — Response 200

---

## Store Product (Protected — store admin)

- `GET /store/product` — list products, supports query params: `category`, `sort`, `inStock`, `lowStock`, `status`, `adminStatus`, `take`, `skip` — Response 200
- `POST /store/product` — multipart `images` (min 3, max 5) and fields: { name, description?, categoryId, variants? (JSON or array), price, stock?, costPrice?, salePrice?, unit?, tags? }
  - Response 201: created product
- `GET /store/product/:slug` — Response 200: product details
- `PATCH /store/product/:productId` — Body: fields to update (name, description, categoryId, unit, price, salePrice, costPrice, tags, weight) — Response 200
- `DELETE /store/product/:productId` — Response 200
- `PATCH /store/product/:productId/status` — toggles active — Response 200

- Product variants
  - `GET /store/product/:productId/variant/:variantId` — Response 200: variant
  - `POST /store/product/:productId/variant` — Body: { name, price, salePrice?, stock? } — Response 201
  - `PATCH /store/product/:productId/variant/:variantId` — Body: { name?, price?, salePrice?, stock?, sku? } — Response 200
  - `DELETE /store/product/:productId/variant/:variantId` — Response 200

---

## Admin (Protected, SUPER_ADMIN)

- Users
  - `GET /admin/user` — list users (200)
  - `GET /admin/user/:id` — user detail (200)

- Drivers
  - `GET /admin/driver` — list drivers (200)
  - `GET /admin/driver/:id` — driver by id (200)
  - `PATCH /admin/driver/:id/approve` — approve driver (200)
  - `PATCH /admin/driver/:id/reject` — reject driver (200)
  - `PATCH /admin/driver/:id/suspend` — suspend driver (200)

- Stores
  - `GET /admin/store` — list stores (200)
  - `GET /admin/store/:id` — store detail (200)
  - `PATCH /admin/store/:id/verify` — verify (200)
  - `PATCH /admin/store/:id/approve` — approve (200)
  - `PATCH /admin/store/:id/reject` — reject (200)
  - `PATCH /admin/store/:id/suspend` — suspend (200)
  - `PATCH /admin/store/:id/commission` — Body: { commission } — Response 200

- Products
  - `GET /admin/product` — list products (200)
  - `GET /admin/product/:id` — product detail (200)
  - `PATCH /admin/product/:id/approve` — approve (200)
  - `DELETE /admin/product/:id/reject` — reject (200)
  - `DELETE /admin/product/:id/suspend` — suspend (200)

- Categories
  - `GET /admin/category` — list categories
  - `GET /admin/category/:id` — get category
  - `POST /admin/category` — Body: { name, slug? } — create
  - `PATCH /admin/category/:id` — update
  - `DELETE /admin/category/:id` — delete
  - `GET /admin/category/:id/products` — products for category

---

Notes / next steps
- This is a summary based on route definitions and controllers. For exhaustive request/response schemas, we can iterate through each controller and generate OpenAPI/Swagger spec.
