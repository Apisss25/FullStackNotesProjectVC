export default function Card({ className = "", children, ...props }) {
  return (
    <div className={`glass p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
