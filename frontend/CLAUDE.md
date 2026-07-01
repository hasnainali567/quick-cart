# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend for QuickCart, a grocery delivery platform. Built with React 19, Vite, TypeScript, Tailwind CSS, and shadcn/ui components.

## Development Commands

```bash
# Start development server (default: http://localhost:5173)
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Feature-Based Organization

The codebase follows a feature-based architecture pattern. Each domain has its own folder under `src/features/` containing:

```
src/features/<feature-name>/
├── api/
│   ├── queries.ts      # React Query hooks for data fetching
│   └── mutations.ts    # React Query hooks for mutations
├── components/         # Feature-specific components
├── hooks/              # Feature-specific hooks
└── helpers/            # Feature-specific utilities
```

Current features: `product`, `category`, `order`, `store`

### Authentication & Authorization

- **Auth Library**: better-auth with custom user fields
- **Roles**: `CUSTOMER`, `STORE_ADMIN`, `SUPER_ADMIN`
- **Auth Client**: `src/lib/auth.ts` exports `signIn`, `signOut`, `signUp`, `useSession`
- **Protected Routes**: `ProtectedRoute` component wraps routes requiring specific roles
- **Session**: Role-based access is checked via `useSession()` hook

### Routing Structure

Routes are defined in `src/router/router.tsx` with role-based protection:

- `/` - Public home page
- `/login`, `/register` - Auth pages (AuthLayout)
- `/store/*` - Store admin dashboard (requires `STORE_ADMIN` role, uses StoreLayout)
- `/admin/*` - Super admin dashboard (requires `SUPER_ADMIN` role, uses AdminLayout)

All routes use lazy loading via `React.lazy()` and are wrapped in `SuspenseWithLoader`.

### Data Fetching

- **Library**: TanStack React Query
- **Config**: `src/api/query-client.ts` - 5min stale time, retry=1, no refetch on window focus
- **API Client**: `src/api/api.ts` - Axios instance with `baseURL` from `VITE_BACKEND_URL`, credentials enabled
- **Pattern**: Feature folders contain `api/queries.ts` and `api/mutations.ts` with React Query hooks

### Component Organization

- `src/components/ui/` - shadcn/ui components (Radix UI based)
- `src/components/global/` - Shared components across features
- `src/components/auth/` - Authentication-specific components
- `src/components/store/` - Store dashboard components
- `src/layouts/` - Layout wrappers for different sections (App, Auth, Store, Admin)

### Path Aliases

The project uses `@/` as an alias for `src/`:

```typescript
import { something } from '@/components/ui/button'
import api from '@/api/api'
```

Configured in `vite.config.ts` and `tsconfig.json`.

### shadcn/ui Configuration

- **Style**: radix-nova
- **Icon Library**: hugeicons
- **Config**: `components.json`
- **Install components**: `npx shadcn@latest add <component-name>`

### Types

Centralized TypeScript types in `src/types/`:
- `index.ts` - Main type exports
- `product.types.ts`, `order.types.ts`, `store.types.ts` - Domain-specific types
- `global/` - Global type definitions

## Environment Variables

Required in `.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_ROLES=["CUSTOMER", "STORE_ADMIN", "SUPER_ADMIN"]
```

## React Compiler

React Compiler is enabled via Babel plugin. This impacts dev and build performance but optimizes runtime performance. The compiler automatically memoizes components and hooks.

## Key Dependencies

- **UI**: Radix UI primitives via shadcn/ui, Tailwind CSS v4
- **Forms**: react-hook-form + zod validation
- **State**: ~~Zustand for global state,~~ React Query for server state
- **Auth**: better-auth with React client
- **Icons**: @hugeicons/react, @iconify/react

---

## Coding Conventions & Best Practices

### 1. Hook-Based Architecture (CRITICAL)

**Components are for UI only. Logic lives in hooks.**

**Core Principle:**
- Components should be thin presentation layers
- All business logic, state management, side effects, and data transformations go in custom hooks
- This ensures testability, reusability, and separation of concerns

**❌ Bad - Logic in component:**
```tsx
const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ status: 'ALL', search: '' })
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      const data = await getRequest({ url: '/store/orders' })
      setOrders(data)
      setLoading(false)
    }
    fetchOrders()
  }, [])
  
  const filteredOrders = orders.filter(order => {
    // 20 lines of filtering logic
  })
  
  const handleStatusChange = (status) => {
    // logic here
  }
  
  return <div>{/* JSX */}</div>
}
```

**✅ Good - Logic in hooks:**
```tsx
// features/order/hooks/useOrders.ts
export const useOrders = (params: OrderParams) => {
  const [filters, setFilters] = useState({ status: 'ALL', search: '' })
  
  const { data, isLoading } = useGetStoreOrders(params)
  
  const filteredOrders = useMemo(() => {
    return data?.orders?.filter(order => {
      // filtering logic
    })
  }, [data, filters])
  
  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status }))
  }
  
  return { orders: filteredOrders, isLoading, filters, handleStatusChange }
}

// pages/store/orders.tsx
const OrdersPage = () => {
  const { orders, isLoading, filters, handleStatusChange } = useOrders({ skip: 0, take: 20 })
  
  if (isLoading) return <Skeleton />
  
  return (
    <div>
      <OrdersFilters filters={filters} onStatusChange={handleStatusChange} />
      <OrdersTable data={orders} />
    </div>
  )
}
```

**What goes in hooks:**
- Data fetching (React Query hooks)
- Form handling (react-hook-form)
- Filtering, sorting, searching logic
- Calculations and transformations
- Side effects (useEffect logic)
- Event handlers with business logic
- State management

**What stays in components:**
- JSX rendering
- Simple event bindings (onClick, onChange)
- Styling and layout
- Conditional rendering (loading, error states)
- Passing data to child components

### 2. Always Use shadcn/ui Components (CRITICAL)

**NEVER recreate a component that already exists in shadcn/ui.**

**Before creating ANY UI component, check:**
1. Browse shadcn/ui docs: https://ui.shadcn.com/docs/components
2. Check `src/components/ui/` for already installed components
3. Install if needed: `npx shadcn@latest add <component-name>`

**Available shadcn Components:**
```
accordion, alert, alert-dialog, avatar, badge, breadcrumb, button,
calendar, card, carousel, checkbox, collapsible, combobox, command,
context-menu, dialog, drawer, dropdown-menu, form, input, input-otp,
label, menubar, navigation-menu, pagination, popover, progress,
radio-group, resizable, scroll-area, select, separator, sheet,
skeleton, slider, sonner, switch, table, tabs, textarea, toast,
toggle, toggle-group, tooltip
```

**❌ Bad - Custom component:**
```tsx
// Don't create custom modal/dialog
const CustomModal = ({ open, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="bg-white rounded-lg">
        {children}
      </div>
    </div>
  )
}
```

**✅ Good - Use shadcn:**
```tsx
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'

// Use the existing component
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>Title</DialogHeader>
    {children}
  </DialogContent>
</Dialog>
```

**Component Usage Rules:**
- ✅ Use shadcn for: buttons, inputs, modals, dropdowns, cards, tables, forms, etc.
- ✅ Compose shadcn components to build feature-specific components
- ✅ Create custom components ONLY for domain-specific UI (ProductCard, OrderSheet, etc.)
- ❌ Never recreate base UI primitives (buttons, inputs, modals, etc.)

**Example - Proper Component Composition:**
```tsx
// ✅ Build feature components using shadcn primitives
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const OrderCard = ({ order }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <span>Order #{order.id}</span>
          <Badge>{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button>View Details</Button>
      </CardContent>
    </Card>
  )
}
```

### 3. Component Composition

**NEVER write monolithic page components.** Always break down UI into smaller, focused components.

**❌ Bad - Monolithic component:**
```tsx
// pages/store/products.tsx
export default function Products() {
  return (
    <div>
      {/* 500 lines of JSX with tables, filters, forms, etc. */}
    </div>
  )
}
```

**✅ Good - Composed components:**
```tsx
// pages/store/products.tsx
export default function Products() {
  return (
    <div>
      <ProductsHeader />
      <ProductsFilters />
      <ProductsTable />
      <ProductsPagination />
    </div>
  )
}

// features/product/components/ProductsTable.tsx
// features/product/components/ProductsFilters.tsx
// etc.
```

**Component Organization Rules:**
- Page components should be thin orchestration layers
- Extract UI sections into named components (e.g., `ProductGeneralInfo`, `ProductImages`, `ProductInventory`)
- Feature-specific components go in `src/features/<feature>/components/`
- Shared components go in `src/components/global/`
- Keep components under 200 lines when possible

### 2. Type-First Development

**ALWAYS define types BEFORE writing implementation code.**

**Workflow:**
1. **Define types** in `src/types/<domain>.types.ts`
2. **Create API hooks** using those types
3. **Build components** with proper TypeScript types

**Example:**
```typescript
// 1. Define type first
// src/types/earnings.types.ts
export type DailyEarning = {
  date: string;
  revenue: number;
  orders: number;
}

export type EarningsResponse = {
  daily: DailyEarning[];
  total: number;
  weekTotal: number;
}

// 2. Create hook with type
// src/features/earnings/api/queries.ts
export const useGetEarnings = (timeRange: string) => {
  return useQuery<EarningsResponse>({
    queryKey: ['earnings', timeRange],
    queryFn: () => getRequest<EarningsResponse>({ 
      url: `/store/earnings?range=${timeRange}` 
    })
  })
}

// 3. Use in component
// src/pages/store/earnings.tsx
const { data } = useGetEarnings(timeRange)
```

**Type Organization:**
- Domain types: `src/types/product.types.ts`, `src/types/order.types.ts`, etc.
- Global types: `src/types/global/`
- Component prop types: Define inline or in component file
- Always export types for reusability

### 3. API Integration

**ALWAYS use existing API utility functions. NEVER write custom fetch logic.**

**Available API Utilities** (`src/api/requests.ts`):
- `getRequest<T>({ url, params? })`
- `postRequest<T>({ url, data })`
- `putRequest<T>({ url, data })`
- `patchRequest<T>({ url, data })`
- `deleteRequest<T>({ url })`

**❌ Bad - Custom fetch:**
```typescript
const fetchOrders = async () => {
  const response = await fetch(`${API_URL}/store/orders`)
  const data = await response.json()
  return data
}
```

**✅ Good - Use utility:**
```typescript
const fetchOrders = async () => {
  return getRequest<OrdersResponse>({ url: '/store/orders' })
}
```

**React Query Pattern:**
```typescript
// src/features/order/api/queries.ts
import { useQuery } from '@tanstack/react-query'
import { getRequest } from '@/api/requests'
import type { Order } from '@/types/order.types'

export const useGetOrders = (params: { skip: number; take: number }) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getRequest<{ orders: Order[]; total: number }>({
      url: `/store/orders?skip=${params.skip}&take=${params.take}`
    })
  })
}
```

**Mutation Pattern:**
```typescript
// src/features/order/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchRequest } from '@/api/requests'

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { orderId: string; status: string }) =>
      patchRequest({ url: `/store/orders/${data.orderId}`, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })
}
```

### 4. Custom Hooks

**Create custom hooks for reusable logic.**

**Naming Convention:** Always prefix with `use` (e.g., `useGetStoreOrders`, `useUpdateProduct`)

**Hook Organization:**
- Data fetching hooks: `src/features/<feature>/api/queries.ts`
- Mutation hooks: `src/features/<feature>/api/mutations.ts`
- Utility hooks: `src/features/<feature>/hooks/`
- Global hooks: `src/hooks/`

**Example Structure:**
```typescript
// src/features/product/hooks/useProductForm.ts
export const useProductForm = (product?: Product) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || defaultValues
  })
  
  return { form, isValid: form.formState.isValid }
}
```

### 5. State Management

**Use the right tool for the right job:**

- **Server State**: React Query (queries, mutations)
  - API data, remote state
  - Use `useQuery` for fetching, `useMutation` for updates
  
- **Global Client State**: React Context or component composition
  - Theme (use next-themes)
  - Auth (use better-auth's `useSession`)
  - Sidebar state (use shadcn's SidebarProvider)
  
- **Local Component State**: Custom hooks with `useState`, `useReducer`
  - Form inputs, modals, toggles
  - Component-specific UI state
  - Filter/search state
  
**Note:** Zustand is NOT used in this project. We handle global state through specialized libraries and React Context.

### 6. File Naming Conventions

**Frontend:**
- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useGetProducts.ts`)
- Utils: `camelCase.ts` (e.g., `formatPrice.ts`)
- Types: `camelCase.types.ts` (e.g., `product.types.ts`)
- Pages: `camelCase.tsx` (e.g., `dashboard.tsx`, `products.tsx`)

**Backend:**
- Controllers: `camelCase.controller.js` (e.g., `order.controller.js`)
- Routes: `routes.js`
- Utilities: `camelCase.js` (e.g., `apiResponse.js`)

### 7. Import Organization

**Order imports in this sequence:**
```typescript
// 1. External libraries
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal utilities and hooks
import { useGetOrders } from '@/hooks/use-query'
import { formatDate } from '@/lib/utils'

// 3. Components
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import OrderSheet from '@/components/store/global/OrderSheet'

// 4. Types
import type { Order } from '@/types/order.types'

// 5. Icons (last)
import { Search } from '@hugeicons/core-free-icons'
```

### 8. Backend API Response Patterns

**Always use existing backend utilities:**

**Controller Pattern:**
```javascript
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { ApiResponse } from '../../../utils/apiResponse.js'
import { NotFoundError, BadRequestError } from '../../../utils/errors.js'

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({ /* ... */ })
  
  return new ApiResponse(200, orders, 'Orders retrieved').send(res)
})
```

**Error Handling:**
- Use custom error classes: `NotFoundError`, `BadRequestError`, `ValidationError`
- Let `asyncHandler` catch and format errors
- Never use raw `res.status().json()`

**Prisma Queries:**
- Always use explicit `select` to control returned fields
- Include related data with nested `select` objects
- Use `include` sparingly, prefer `select` for performance

### 9. Form Handling

**Use react-hook-form + zod for all forms:**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

type FormData = z.infer<typeof schema>

const MyForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  
  const onSubmit = (data: FormData) => {
    // Handle submission
  }
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

### 10. Code Reusability

**Before writing new code, check if it already exists:**

✅ **Check these first:**
- `src/api/requests.ts` - API utilities
- `src/lib/utils.ts` - General utilities
- `src/hooks/` - Existing hooks
- `src/components/global/` - Shared components
- `src/types/` - Type definitions

**Don't Repeat Yourself (DRY):**
- Extract repeated logic into hooks
- Create shared components for common UI patterns
- Use existing utility functions
- Reuse types across features

### 11. Error Handling & Loading States

**Always handle loading and error states:**

```typescript
const { data, isLoading, isError } = useGetOrders({ skip, take })

if (isLoading) return <Skeleton />
if (isError) return <ErrorMessage />
if (!data) return <EmptyState />

return <OrdersTable data={data} />
```

**Toast notifications for user feedback:**
```typescript
import { toast } from 'sonner'

const { mutate } = useUpdateOrder()

const handleUpdate = () => {
  mutate(data, {
    onSuccess: () => toast.success('Updated successfully'),
    onError: () => toast.error('Failed to update')
  })
}
```

### 12. Performance Considerations

- **Lazy load routes:** Use `React.lazy()` for all route components
- **Optimize images:** Use appropriate formats and sizes
- **Memoize expensive calculations:** Use `useMemo` when needed
- **Debounce search inputs:** Use `useDebounce` hook for search
- **Paginate large lists:** Never load all data at once
- **React Query caching:** Leverage automatic caching (5min stale time configured)

---

## Checklist for New Features

Before implementing a new feature:

- [ ] Define TypeScript types in `src/types/<domain>.types.ts`
- [ ] Create API hooks in `src/features/<feature>/api/`
- [ ] Use existing API utility functions (`getRequest`, `postRequest`, etc.)
- [ ] Break down UI into small, focused components
- [ ] Add proper loading, error, and empty states
- [ ] Use existing shared components where possible
- [ ] Follow established naming conventions
- [ ] Add proper TypeScript types everywhere
- [ ] Test with real API integration
- [ ] Handle edge cases (no data, errors, etc.)