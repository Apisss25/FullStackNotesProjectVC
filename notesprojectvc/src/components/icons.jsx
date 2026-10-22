import {
  ArrowRight,
  Bookmark,
  Calendar,
  House,
  Leaf,
  Lock,
  LogOut,
  Menu,
  NotebookText,
  PenLine,
  RefreshCw,
  Trash2,
  User,
  X,
} from "lucide-react";

export function IconHome({ className = "h-5 w-5", ...props }) {
  return <House className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconNote({ className = "h-5 w-5", ...props }) {
  return <NotebookText className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconBookmark({ className = "h-5 w-5", ...props }) {
  return <Bookmark className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconUser({ className = "h-5 w-5", ...props }) {
  return <User className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconLogout({ className = "h-5 w-5", ...props }) {
  return <LogOut className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconMenu({ className = "h-5 w-5", ...props }) {
  return <Menu className={className} strokeWidth={2} aria-hidden="true" {...props} />;
}

export function IconClose({ className = "h-5 w-5", ...props }) {
  return <X className={className} strokeWidth={2} aria-hidden="true" {...props} />;
}

export function IconPen({ className = "h-5 w-5", ...props }) {
  return <PenLine className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconArrowRight({ className = "h-5 w-5", ...props }) {
  return <ArrowRight className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconLock({ className = "h-4 w-4", ...props }) {
  return <Lock className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconLeaf({ className = "h-6 w-6", ...props }) {
  return <Leaf className={className} strokeWidth={1.6} aria-hidden="true" {...props} />;
}

export function IconTrash2({ className = "h-5 w-5", ...props }) {
  return <Trash2 className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconCalendar({ className = "h-5 w-5", ...props }) {
  return <Calendar className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function IconRefreshCw({ className = "h-5 w-5", ...props }) {
  return <RefreshCw className={className} strokeWidth={1.8} aria-hidden="true" {...props} />;
}
