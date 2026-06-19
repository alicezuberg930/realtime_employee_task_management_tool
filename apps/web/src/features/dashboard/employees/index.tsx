import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { userQueries } from '@/lib/queries/user'

const route = getRouteApi('/dashboard/employees/')

export function Employees() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data } = useQuery(userQueries().getAll.queryOptions())

  return (
    <UsersProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your employess and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        {data && (
          <UsersTable data={data} search={search} navigate={navigate} />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
