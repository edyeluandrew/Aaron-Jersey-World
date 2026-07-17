import Badge from '@/components/common/Badge';
import { getRequestStatusVariant, formatLabel } from '@/utils/admin';

export default function StatusBadge({ status }) {
  return <Badge variant={getRequestStatusVariant(status)}>{formatLabel(status)}</Badge>;
}
