import { SortBy, User } from "../types.d"

interface Props {
  users: User[];
  showColors?: boolean;
  onDelete: (email: string) => void;
  onChangeSorting: (sort: SortBy) => void;
}

export const UsersList = ({ users, showColors, onDelete, onChangeSorting }: Props) => {
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Foto</th>
          <th className="pointer" onClick={() => onChangeSorting(SortBy.NAME)}>Nombre</th>
          <th className="pointer" onClick={() => onChangeSorting(SortBy.LAST)}>Apellido</th>
          <th className="pointer" onClick={() => onChangeSorting(SortBy.COUNTRY)}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody className={showColors ? 'table--showColors' : ''}>
        {
          users.map((user) => (
              <tr key={user.email}>
                <td>
                  <img src={user.picture.thumbnail} alt={user.name.first} />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button onClick={() => onDelete(user.email)}>Borrar</button>
                </td>
              </tr>
          ))
        }
      </tbody>
    </table>
  )
}