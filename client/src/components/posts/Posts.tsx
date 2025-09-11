import PostItem from "../post/Post";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { getAxiosErrorMessage } from "../../utils/error";
import { useState, useEffect } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

interface Props {
  userId: number | null;
}
interface Post {
  ID: number
  title: string
  desc: string
  imgUrl: string
  category: string
  calories: number
  type: string
  user_id: number
  username: string
  name: string
  profile_pic: string
  email: string
  city: string
  website: string
  CreatedAt: string
  User?: {
    ID: number
    username: string
    name: string
    profilePic: string
    email: string
    city: string
    website: string
  }
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

const Posts: React.FC<Props> = ({ userId }) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const { isLoading, error, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<PostsResponse, Error>({
    queryKey: ["posts", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const url = userId 
        ? `posts?userId=${userId}&page=${pageParam}&limit=10`
        : `posts?page=${pageParam}&limit=10`;
      
      const response = await makeRequest.get(url);
      const data = response.data;
      
      // Handle both old format (array of posts) and new format (with pagination)
      if (Array.isArray(data)) {
        // Old format - return as first page
        return {
          posts: data,
          pagination: {
            page: 1,
            limit: data.length,
            total: data.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          }
        } as PostsResponse;
      }
      
      // New format with pagination
      return data as PostsResponse;
    },
    getNextPageParam: (lastPage) => {
      // Add null checks to prevent runtime errors
      if (!lastPage || !lastPage.pagination) {
        return undefined;
      }
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Update allPosts when data changes
  useEffect(() => {
    if (data?.pages && Array.isArray(data.pages)) {
      const posts = data.pages.flatMap(page => {
        // Ensure page has posts array
        return page?.posts && Array.isArray(page.posts) ? page.posts : [];
      });
      setAllPosts(posts);
    }
  }, [data]);

  // Infinite scroll hook
  const loadMoreRef = useInfiniteScroll({
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage: Boolean(isFetchingNextPage),
    fetchNextPage,
  });


  const posts: Post[] = allPosts;

  const renderLoading = () => (
    <div className="flex flex-col gap-[16px]">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="rounded-md border p-4 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-1/3 rounded bg-slate-200"></div>
            <div className="h-3 w-2/3 rounded bg-slate-200"></div>
            <div className="h-48 w-full rounded bg-slate-200"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLoadMoreLoading = () => (
    <div className="flex justify-center py-4">
      <div className="flex items-center gap-2 text-slate-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
        <span>Loading more posts...</span>
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-10 text-center text-slate-500">
      <div className="mb-2 text-lg font-semibold text-slate-700">No posts yet</div>
      <div className="text-sm">Start by sharing your first post!</div>
    </div>
  );

  const renderError = () => (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
      {getAxiosErrorMessage(error, "Unable to load posts")}
    </div>
  );

  return (
    <div className="flex flex-col gap-[24px] p-4">
      {error ? (
        renderError()
      ) : isLoading ? (
        renderLoading()
      ) : posts.length === 0 ? (
        renderEmpty()
      ) : (
        <>
          {posts.map((post: Post, index: number) => (
            <PostItem post={post} key={`${post.ID}-${index}`} />
          ))}
          
          {/* Infinite scroll trigger element */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="h-4" />
          )}
          
          {/* Loading indicator for infinite scroll */}
          {isFetchingNextPage && renderLoadMoreLoading()}
        </>
      )}
    </div>
  );
};

export default Posts;
