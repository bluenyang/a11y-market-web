import { Badge } from '@/components/ui/badge';

const statusVariant = {
  PENDING: 'secondary',
  PAID: 'default',
  SHIPPING: 'outline',
  DELIVERED: 'success',
  CANCELED: 'destructive',
};

export default function OrderStatusBadge({ status }) {
  const variant = statusVariant[status] || 'secondary';

  return <Badge variant={variant}>{status}</Badge>;
}
