import { User } from "../types";

type UsersResponse = {
  users: User[];
  nextCursor?: number;
}

export const fetchUsers = async (page: number, maxPages=3): Promise<UsersResponse> => {
  return fetch(`https://randomuser.me/api?results=10&seed=stban94diaz&page=${page}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      const currentPage = Number(data.info.page)
      const nextCursor = currentPage >= maxPages ? undefined : currentPage + 1

      return {
        users: data.results,
        nextCursor
      }
    })
}