export default function Container({ children, className = '', as: Component = 'div' }) {
  return <Component className={`container-content ${className}`}>{children}</Component>;
}
