# Boot Next - Next.js Starter Kit Manual

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff&style=flat)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff&style=flat)](https://www.prisma.io/)
[![Lucia](https://img.shields.io/badge/Lucia-5F57FF?logo=lucia&logoColor=fff&style=flat)](https://lucia-auth.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=flat)](https://ui.shadcn.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=fff&style=flat)](https://zod.dev/)

## Features

- 🔐 Authentication with [Lucia Auth](https://lucia-auth.com/)
- 🗃️ Database ORM with [Prisma](https://www.prisma.io/)
- 🐳 Docker setup for PostgreSQL and Dragonfly
- 🚀 Server Actions with [Next Safe Action](https://github.com/TheEdoRan/next-safe-action)
- 📊 Schema validation with [Zod](https://zod.dev/)
- 🛡️ Rate limiting
- 🎨 UI components with [shadcn/ui](https://ui.shadcn.com/)
- 🔒 Protected and public pages/API routes
- 📋 Data table with server-side rendering
- 🔄 Cache invalidation

## Getting Started

1. Clone the repository using degit:

   ```
   npx degit dotyigit/boot-next my-next-app
   ```

2. Install dependencies:

   ```
   cd my-next-app
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the variables in `.env`

4. Start the Docker containers:

   ```
   docker compose up -d
   ```

   This will start the PostgreSQL and Dragonfly (Redis replacement) containers.

5. Run database migrations:

   ```
   npm run db:migrate
   ```

6. Start the development server:
   ```
   npm run dev
   ```

You can now access the application at `http://localhost:3000`.

## Key Features

### 1. Authentication with Lucia Auth

- Pre-configured authentication system
- Login, register, and logout functionality
- Protected routes and API endpoints

To use authentication in your components:

- Import the `validateRequest` function from `@/lib/auth`
- Use it in server components or API routes to check authentication status

### 2. Prisma ORM and Models

- Database schema defined in `prisma/schema.prisma`
- Models for User, Session, and Entry

To use Prisma in your application:

- Import the Prisma client from `@/lib/prisma`
- Use it to query the database in your server-side code

To update the database schema:

1. Modify `prisma/schema.prisma`
2. Run `npm run db:migrate`

### 3. Docker Compose Setup

- PostgreSQL and Dragonfly (Redis replacement) containers

To start the containers:

```
docker compose up
```

### 4. Server Actions with Next Safe Action

- `unprotectedActionClient` and `protectedActionClient` for handling server actions

To create a new server action:

1. Create a new file (e.g., `src/app/your-feature/actions.ts`)
2. Import the appropriate action client
3. Define your action using the client's schema and action methods
4. Use the action in your components

Here is an example of a server action:

```typescript
export const deleteEntry = protectedActionClient
  .metadata({
    actionName: "delete-entry",
  })
  .schema(deleteEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;
    const { user } = ctx;

    // check if the entry belongs to the user
    const entry = await prisma.entry.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!entry) {
      return returnValidationErrors(deleteEntrySchema, {
        _errors: ["Entry not found"],
      });
    }

    await prisma.entry.delete({
      where: {
        id: entry.id,
      },
    });

    revalidateTag("entries");

    return {
      status: "success",
      message: "Entry deleted successfully",
    };
  });
```

### 5. Zod Schema Validation

This starter kit uses Zod for schema validation, providing a type-safe and declarative way to validate data.

To use Zod in your components or actions:

1. Define your schema using Zod's methods (e.g., `z.object()`, `z.string()`, `z.number()`).
2. Use the schema in your server actions or form validations.
3. Handle any validation errors appropriately.

Here's an example of how to use Zod for form validation:

```typescript
import { z } from "zod";

export const mySchema = z.object({
  name: z.string(),
  age: z.number(),
});

export type MySchemaValues = z.infer<typeof mySchema>;
```

For more complex validations, you can use Zod's advanced features like `.refine()` for custom validations or `.transform()` for data transformation during validation.

To see how Zod is used in this starter kit, check the schema definitions in the following files:

```
src/app/(protected)/entries/schema.ts
```

### 6. Rate Limiting

- Automatic rate limiting for unprotected actions and API routes

To apply rate limiting to custom API routes:

- Import and use the `checkRateLimit` function from `@/lib/rate-limit`

### 7. Shadcn/ui Component Library

- Pre-configured UI components

To use a component:

1. Import it from `@/components/ui`
2. Use it in your TSX

### 8. Protected and Public Pages

- Layouts for handling authentication checks

To create a new protected page:

- Add it under the `src/app/(protected)` directory

To create a public page:

- Add it directly under the `src/app` directory

### 9. Protected and Public API

- Helper function for creating protected API routes

To create a protected API route:

1. Create a new file in `src/app/api/your-route/route.ts`
2. Use the `withAuthHandler` function from `@/lib/api`

### 10. Data Table with Server-Side Rendering

- Reusable data table component with server-side data fetching

To use the data table:

1. Define your columns
2. Fetch data on the server
3. Use the `DataTable` component in your page from `@/components/ui/data-table`

### 11. Cache Invalidation

- Built-in cache invalidation using Next.js's `revalidateTag` and `revalidatePath`

To invalidate cache for a specific tag:

```typescript
import { revalidateTag } from "next/cache";
revalidateTag("your-tag-name");
```

Or, specific page:

```typescript
import { revalidatePath } from "next/cache";
revalidatePath("/your-page");
```

By following this manual, you can effectively use the features of this Next.js starter kit and develop new functionality as needed. Remember to adhere to best practices, maintain code quality, and keep your dependencies up to date.
