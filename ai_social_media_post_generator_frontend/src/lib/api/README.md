# API Integration Documentation

This directory contains a comprehensive API integration system using TanStack Query (React Query) and Axios for handling HTTP requests to the backend API.

## 📁 Directory Structure

```
src/lib/api/
├── types.ts          # TypeScript interfaces and types
├── client.ts         # Axios client configuration
├── auth.ts           # Authentication API service
├── posts.ts          # Posts API service
└── index.ts          # Main exports

src/hooks/api/
├── useAuth.ts        # Authentication React Query hooks
├── usePosts.ts       # Posts React Query hooks
└── index.ts          # Hooks exports

src/components/examples/
└── ApiExample.tsx    # Example component demonstrating usage
```

## 🚀 Features

- **Type-safe API calls** with TypeScript
- **Automatic authentication** with JWT tokens
- **Error handling** with automatic logout on 401 errors
- **Request/response interceptors** for global handling
- **React Query integration** for caching and state management
- **Loading, error, and success states** for all operations
- **Optimistic updates** and cache invalidation
- **Infinite scrolling** support for large datasets
- **Bulk operations** for multiple items
- **Export functionality** for data download

## 🔧 Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. Install Dependencies

```bash
npm install axios @tanstack/react-query
```

### 3. Configure React Query Provider

The provider is already set up in `src/components/providers/providerWrapper.tsx`.

## 📚 API Services

### Authentication API (`auth.ts`)

```typescript
import { authApi } from '@/lib/api';

// Login
const response = await authApi.login({ email, password });

// Signup
const response = await authApi.signup({ username, email, password, confirmPassword });

// Logout
await authApi.logout();

// Get current user
const user = await authApi.getCurrentUser();

// Check authentication status
const isAuth = authApi.isAuthenticated();
```

### Posts API (`posts.ts`)

```typescript
import { postsApi } from '@/lib/api';

// Get posts with filters
const posts = await postsApi.getPosts({ platform: 'linkedin', status: 'published' });

// Create post
const newPost = await postsApi.createPost(postData);

// Update post
const updatedPost = await postsApi.updatePost(id, updateData);

// Delete post
await postsApi.deletePost(id);

// Regenerate content
const regeneratedPost = await postsApi.regenerateContent(id);

// Get statistics
const stats = await postsApi.getStats();

// Export posts
const exportData = await postsApi.exportPosts({ format: 'json' });
```

## 🎣 React Query Hooks

### Authentication Hooks

```typescript
import { useLogin, useSignup, useLogout, useAuthStatus } from '@/hooks/api';

// Login hook
const loginMutation = useLogin();
const { mutate, isLoading, isError, error } = loginMutation;

// Signup hook
const signupMutation = useSignup();

// Logout hook
const logoutMutation = useLogout();

// Auth status hook
const { isAuthenticated, user, isLoading } = useAuthStatus();
```

### Posts Hooks

```typescript
import { 
  usePosts, 
  useCreatePost, 
  useUpdatePost, 
  useDeletePost,
  usePostStats 
} from '@/hooks/api';

// Get posts with filters
const { data, isLoading, error, refetch } = usePosts({ platform: 'linkedin' });

// Create post
const createMutation = useCreatePost();
const { mutate, isLoading, isSuccess } = createMutation;

// Update post
const updateMutation = useUpdatePost();

// Delete post
const deleteMutation = useDeletePost();

// Get statistics
const { data: stats } = usePostStats();
```

## 💡 Usage Examples

### Basic Authentication Flow

```typescript
import { useLogin, useAuthStatus } from '@/hooks/api';

const LoginComponent = () => {
  const loginMutation = useLogin();
  const { isAuthenticated } = useAuthStatus();

  const handleLogin = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // Redirect or show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
      <button disabled={loginMutation.isLoading}>
        {loginMutation.isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Posts Management

```typescript
import { usePosts, useCreatePost, useDeletePost } from '@/hooks/api';

const PostsComponent = () => {
  const { data: posts, isLoading, error } = usePosts();
  const createMutation = useCreatePost();
  const deleteMutation = useDeletePost();

  const handleCreate = async (postData) => {
    try {
      await createMutation.mutateAsync(postData);
      // Post created successfully
    } catch (error) {
      // Handle error
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      // Post deleted successfully
    } catch (error) {
      // Handle error
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {posts?.posts.map(post => (
        <div key={post.id}>
          <h3>{post.platform}</h3>
          <button onClick={() => handleDelete(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
```

### Infinite Scrolling

```typescript
import { useInfinitePosts } from '@/hooks/api';

const InfinitePostsComponent = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinitePosts();

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.platform}</div>
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
```

## 🔄 State Management

### Loading States

All hooks provide loading states:

```typescript
const { isLoading, isFetching } = usePosts();

// isLoading: true when making the first request
// isFetching: true when making any request (including background refetches)
```

### Error Handling

```typescript
const { error, isError } = usePosts();

if (isError) {
  console.error('Error:', error);
  // Show error message to user
}
```

### Success States

```typescript
const mutation = useCreatePost();

if (mutation.isSuccess) {
  // Show success message
  // Redirect or update UI
}
```

## 🎯 Best Practices

### 1. Error Handling

```typescript
const mutation = useCreatePost();

const handleSubmit = async (data) => {
  try {
    await mutation.mutateAsync(data);
    toast.success('Post created successfully!');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Something went wrong');
  }
};
```

### 2. Optimistic Updates

```typescript
const updateMutation = useUpdatePost();

const handleUpdate = (id, data) => {
  updateMutation.mutate(
    { id, data },
    {
      onSuccess: () => {
        // Handle success
      },
      onError: (error) => {
        // Handle error and potentially revert optimistic update
      }
    }
  );
};
```

### 3. Cache Management

```typescript
const queryClient = useQueryClient();

// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ['posts'] });

// Remove specific queries
queryClient.removeQueries({ queryKey: ['posts', 'detail', id] });

// Clear all queries
queryClient.clear();
```

## 🔧 Configuration

### Query Client Configuration

The query client is configured in `providerWrapper.tsx` with:

- **Stale time**: 5 minutes for most queries
- **Cache time**: 10 minutes
- **Retry logic**: 3 attempts with exponential backoff
- **Background refetching**: Enabled for active tabs

### Axios Configuration

The Axios client is configured with:

- **Base URL**: From environment variable
- **Timeout**: 10 seconds
- **Request interceptors**: Add auth tokens
- **Response interceptors**: Handle 401 errors

## 🚨 Error Handling

### Automatic Error Handling

- **401 Unauthorized**: Automatically logs out user and redirects to login
- **Network errors**: Logged to console with user-friendly messages
- **Validation errors**: Returned as part of the response for form handling

### Custom Error Handling

```typescript
const mutation = useCreatePost();

mutation.mutate(data, {
  onError: (error) => {
    if (error.response?.status === 400) {
      // Handle validation errors
    } else if (error.response?.status === 500) {
      // Handle server errors
    }
  }
});
```

## 📝 TypeScript Support

All API calls are fully typed with TypeScript:

```typescript
// Request types
interface CreatePostRequest {
  platform: Platform;
  tone: Tone;
  input_bullets: string[];
  // ... other fields
}

// Response types
interface Post {
  id: string;
  platform: Platform;
  tone: Tone;
  // ... other fields
}

// Usage
const createPost = async (data: CreatePostRequest): Promise<Post> => {
  // TypeScript will ensure data matches CreatePostRequest
  // and return type is Post
};
```

## 🔄 Extending the API

### Adding New Endpoints

1. **Add types** in `types.ts`:
```typescript
export interface NewEntity {
  id: string;
  name: string;
  // ... other fields
}
```

2. **Add API service** in new file or existing service:
```typescript
export const newEntityApi = {
  getAll: () => api.get<NewEntity[]>('/new-entity'),
  create: (data: CreateNewEntityRequest) => api.post<NewEntity>('/new-entity', data),
  // ... other methods
};
```

3. **Add React Query hooks**:
```typescript
export const useNewEntities = () => {
  return useQuery({
    queryKey: ['new-entities'],
    queryFn: newEntityApi.getAll,
  });
};
```

### Adding New Query Keys

```typescript
export const queryKeys = {
  // ... existing keys
  newEntity: {
    all: ['new-entity'] as const,
    lists: () => [...queryKeys.newEntity.all, 'list'] as const,
    list: (filters: NewEntityFilters) => [...queryKeys.newEntity.lists(), filters] as const,
    details: () => [...queryKeys.newEntity.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.newEntity.details(), id] as const,
  },
} as const;
```

## 🧪 Testing

### Mocking API Calls

```typescript
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePosts } from '@/hooks/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const { result } = renderHook(() => usePosts(), { wrapper });
```

## 📚 Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)

## 🤝 Contributing

When adding new API endpoints:

1. Add TypeScript interfaces in `types.ts`
2. Create API service functions
3. Create React Query hooks
4. Add to the example component
5. Update this documentation
6. Add tests if applicable
