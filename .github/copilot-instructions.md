# AI Coding Instructions for FMS (Financial Management System)

## Project Overview
This is a Next.js 16 application built with TypeScript, Tailwind CSS, and MongoDB (via Mongoose) for managing financial transactions across organizations. The app uses the App Router architecture with API routes for backend operations and client components for the dashboard UI.

## Architecture & Data Flow
- **Frontend**: Next.js App Router with client components in `src/app/dashboard/`
- **Backend**: API routes in `src/app/api/` handle CRUD operations
- **Database**: MongoDB with Mongoose ODM; connection managed via `src/lib/db.ts`
- **Validation**: Zod schemas in `src/schema/` for request validation
- **Business Logic**: Service classes in `src/service/` (e.g., `TransactionService`, `paginate`)
- **UI Components**: Custom components in `src/components/custom/` built on Radix UI primitives
- **State Management**: React hooks with useState/useEffect; no global state library

## Key Patterns & Conventions

### Database Models
- Models defined in `src/model/` using Mongoose schemas
- Use `models.ModelName || model("ModelName", Schema)` pattern for Next.js hot reload compatibility
- Timestamps enabled by default: `{ timestamps: true }`
- Status enums: `['Active', 'Inactive', 'Pending', 'Received', 'Approved', 'Rejected']` (case-sensitive)
- Organization IDs: Auto-generated as `org_1`, `org_2`, etc. via `src/utils/functions.ts`

### API Routes Structure
```typescript
// Standard API route pattern
export async function POST(req: Request) {
  await connectDB();
  const result = await validateBody(req, schema); // Zod validation
  if (!result.ok) return result.res;
  
  // Business logic
  const data = await Model.create(result.data);
  return NextResponse.json({ success: true, data }, { status: 201 });
}
```
- Always call `connectDB()` first
- Use `validateBody()` from `src/lib/validate.ts` for request validation
- Return consistent response format: `{ success: boolean, message?: string, data?: any }`

### Client Components
- Dashboard pages use client components (`"use client"`)
- Data fetching via `useEffect` with async functions
- Form handling with `react-hook-form` + Zod resolvers
- Tables use `@tanstack/react-table` with custom column definitions

### Component Patterns
- Custom components in `src/components/custom/` (e.g., `DataTable`, `FormDialog`, `StatCard`)
- UI primitives from `src/components/ui/` (Radix-based)
- Form fields defined as arrays for `FormDialog`:
```typescript
const formFields = [
  { name: 'fieldName', label: 'Label', type: 'text'|'select'|'number'|'textarea', options?: string[] }
];
```

### Transaction Management
- Unified `Transaction` model for both income and expense
- Type field: `'income' | 'expense'`
- Income fields: `source`, `client`, `invoiceNumber`, `receivedDate`
- Expense fields: `vendor`, `department`, `receiptNumber`, `expenseDate`
- Status workflow: `Pending` → `Received`/`Approved`/`Rejected`

### Pagination & Filtering
- Use `paginate()` service for queries with search/filter support
- Supports `page`, `limit`, `sortBy`, `sortOrder`, `q` (search), `searchFields`
- Default sort: `createdAt: -1` (newest first)

## Development Workflow
- **Start dev server**: `npm run dev` (includes `--webpack` flag)
- **Build**: `npm run build` (includes `--webpack` flag)  
- **Lint**: `npm run lint` (ESLint only)
- **Database**: Requires `MONGODB_URI` environment variable

## File Organization Examples
- **Add new API endpoint**: Create `src/app/api/feature/route.ts` with GET/POST handlers
- **Add dashboard page**: Create `src/app/dashboard/feature/page.tsx` as client component
- **Add data model**: Create `src/model/feature.model.ts` with Mongoose schema
- **Add validation**: Add Zod schema to `src/schema/index.ts`
- **Add service logic**: Create methods in `src/service/feature.service.ts`

## Common Gotchas
- Always import from absolute paths starting with `@/src/` (configured in `tsconfig.json`)
- Use `Promise<{ param: string }>` for dynamic route params in Next.js 15+
- Status values are case-sensitive and must match enum definitions exactly
- Organization creation auto-generates `org_id` if not provided
- Database connection is cached globally to prevent connection limits in development

## Dependencies to Know
- **UI**: `lucide-react` for icons, `recharts` for charts, `react-toastify` for notifications
- **Forms**: `react-hook-form` with `@hookform/resolvers/zod`
- **Tables**: `@tanstack/react-table` with custom column renderers
- **Styling**: `tailwindcss` with `tailwind-merge` and `clsx` utilities</content>
<parameter name="filePath">c:\Users\ashan\Documents\Certix\FMS\.github\copilot-instructions.md