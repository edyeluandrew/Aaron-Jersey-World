import { Navigate, useParams } from 'react-router-dom';
import { productsPath } from '@/constants/catalogue';

export default function CategoryPage() {
  const { slug } = useParams();
  return <Navigate to={productsPath(slug)} replace />;
}
