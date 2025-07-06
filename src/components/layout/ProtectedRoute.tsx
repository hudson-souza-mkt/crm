import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 ml-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}