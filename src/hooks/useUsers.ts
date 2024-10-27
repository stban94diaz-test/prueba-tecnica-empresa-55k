import { useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchUsers } from "../services/users"

export const useUsers = () => {
  const {
    isLoading,
    isError,
    data,
    refetch,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: async ({ pageParam }) => fetchUsers(pageParam, 10),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  })

  const users = useMemo(() => {
    return data?.pages.flatMap(page => page.users) ?? []
  }, [data?.pages])

  return {
    users,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch
  }
}
