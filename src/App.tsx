import './App.css'
import { OldUsersType, SortBy, User } from './types.d'
import { UsersList } from './components/UsersList'
import { useUsers } from './hooks/useUsers'
import { useMemo, useState } from 'react'
import { Results } from './components/Results'
import { useQueryClient } from '@tanstack/react-query'

function App() {
  const {
    users,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useUsers()
  const queryClient = useQueryClient()

  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string>()
  
  const toggleColors = () => setShowColors(!showColors)
  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }
  
  const handleDelete = (email: string) => {
    // setUsers(users.filter(user => user.email!== email))
    queryClient.setQueryData<OldUsersType>(['users'], (oldUsers) => {
      // oldUsers.filter((user) => user.email!== email)
      return {
        ...oldUsers,
        pages: oldUsers?.pages?.map((page) => ({
         ...page,
          users: page.users.filter(user => user.email!== email),
        })),
      }
    })
  }
  
  const handleReset = async () => {
    await refetch()
  }
  
  const filteredUsers = useMemo(() => {
    console.log('Calculate filtered users')
    return typeof filterCountry==='string' && filterCountry.length>0
    ? users.filter(
        user => user.location.country.toLowerCase().includes(
          filterCountry.toLowerCase()
        )
      )
    : users
  }, [filterCountry, users])
  
  const sortedUsers = useMemo(() => {
    console.log('Calculate sorted users')
    if (sorting === SortBy.NONE) return filteredUsers
  
    const compareProperties: Record<string, (user: User) => string> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
    }
  
    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [sorting, filteredUsers])
  
  const handleChangeSort = (sort: SortBy) => setSorting(sort)

  return (
    <>
      <h1>Prueba técnica</h1>
      <Results />
      <header>
        <button onClick={toggleColors}>
          Colorear filas
        </button>
        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>
          Resetear usuarios
        </button>
        <input
          placeholder='Filtra por país'
          onChange={e => setFilterCountry(e.target.value)}
        />
      </header>
      <main>
        {users.length>0 && (
          <UsersList
            users={sortedUsers}
            showColors={showColors}
            onDelete={handleDelete}
            onChangeSorting={handleChangeSort}
          />
        )}
        {isLoading && <p>Cargando...</p>}
        {isError && <p>Ha habido un error</p>}
        {!isLoading && !isError && users.length===0 && <p>No hay usuarios</p>}
        {!isLoading && !isError && hasNextPage && (
          <button onClick={() => fetchNextPage()}>
            Cargar más usuarios
          </button>
        )}
        {!isLoading && !isError && !hasNextPage && (
          <p>Ya no hay mas resultados</p>
        )}
      </main>
    </>
  )
}

export default App
