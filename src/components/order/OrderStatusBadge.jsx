import { Badge } from '@/components/ui/badge';

const statusVariant = {
  PENDING: 'secondary',
  PAID: 'default',
  ACCEPTED: 'warning',
  SHIPPED: 'outline',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
};

export default function OrderStatusBadge({ status }) {
  const variant = statusVariant[status] || 'secondary';

  return <Badge variant={variant}>{status}</Badge>;
}
