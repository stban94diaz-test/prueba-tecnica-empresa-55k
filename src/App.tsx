import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, User } from './types.d'
import { UsersList } from './components/UsersList'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string>()

  const originalUsers = useRef<User[]>([])
  // useRef --> para guardar un valor
  // que queramos que se comparta entre renderizados
  // pero que al cambiar, no vuelva a renderizar el componente

  const toggleColors = () => setShowColors(!showColors)
  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (email: string) => {
    setUsers(users.filter(user => user.email!== email))
  }

  const handleReset = () => setUsers(originalUsers.current)

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

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(response => response.json())
      .then(data => {
        setUsers(data.results)
        originalUsers.current = data.results
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <>
      <h1>Prueba técnica</h1>
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
        <UsersList
          users={sortedUsers}
          showColors={showColors}
          onDelete={handleDelete}
          onChangeSorting={handleChangeSort}
        />
      </main>
    </>
  )
}

export default App
