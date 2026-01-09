import { useState, useMemo } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { UserWithRole, AppRole, UserStatus } from '@/types/user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Pencil, Trash2, ArrowUpDown, Plus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { EditUserModal } from './EditUserModal';
import { AddUserModal } from './AddUserModal';

type SortField = 'full_name' | 'email' | 'created_at';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'active' | 'inactive' | 'trial' | 'admin' | 'regular';

export function UserManagementTable() {
  const { users, isLoading, deleteUser, isDeleting } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserWithRole | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user =>
          user.full_name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.phone && user.phone.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    switch (filter) {
      case 'active':
        result = result.filter(u => u.status === 'active');
        break;
      case 'inactive':
        result = result.filter(u => u.status === 'inactive');
        break;
      case 'trial':
        result = result.filter(u => u.role === 'trial');
        break;
      case 'admin':
        result = result.filter(u => u.role === 'admin');
        break;
      case 'regular':
        result = result.filter(u => u.role === 'regular');
        break;
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'full_name':
          comparison = a.full_name.localeCompare(b.full_name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [users, searchQuery, filter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getRoleBadgeStyle = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-pink-500 text-white hover:bg-pink-500';
      case 'regular':
        return 'bg-gray-500 text-white hover:bg-gray-500';
      case 'trial':
        return 'bg-gray-500 text-white hover:bg-gray-500';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-500';
    }
  };

  const getStatusBadgeStyle = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'bg-pink-500 text-white hover:bg-pink-500';
      case 'inactive':
        return 'bg-red-500 text-white hover:bg-red-500';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-500';
    }
  };

  const getTrialStatus = (user: UserWithRole) => {
    if (user.role !== 'trial') return 'N/A';
    if (!user.trial_ends_at) return 'N/A';
    const trialEnd = new Date(user.trial_ends_at);
    return trialEnd < new Date() ? 'Expired' : 'Active';
  };

  const handleDeleteConfirm = () => {
    if (deletingUser) {
      deleteUser(deletingUser.user_id);
      setDeletingUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={filter} onValueChange={(v: FilterType) => setFilter(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="inactive">Inactive Users</SelectItem>
              <SelectItem value="trial">Trial Users</SelectItem>
              <SelectItem value="admin">Admin Users</SelectItem>
              <SelectItem value="regular">Regular Users</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-pink-500 hover:bg-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('full_name')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Email
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('created_at')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Created
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>Trial</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedUsers.map((user, index) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeStyle(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeStyle(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{getTrialStatus(user)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingUser(user)}
                          aria-label="Edit user"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingUser(user)}
                          aria-label="Delete user"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {/* Add Modal */}
      <AddUserModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingUser?.full_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
