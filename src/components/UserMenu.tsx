
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

type UserMenuProps = { scrolled?: boolean };

const UserMenu = ({ scrolled }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Link to="/login" state={{ from: location.pathname }}>
        <Button
          variant="ghost"
          className={
            scrolled
              ? "text-navy-700 hover:text-navy-900"
              : "text-white hover:text-gold-300"
          }
        >
          <User size={18} className="mr-2" />
          Sign In
        </Button>
      </Link>
    );
  }

  const handleSignout = async () => {
    await signOut();
    navigate('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={
            scrolled
              ? "text-navy-700 hover:text-navy-900"
              : "text-white hover:text-gold-300"
          }
        >
          <User size={18} className="mr-2" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 text-sm font-medium">
          {user.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders" className="w-full cursor-pointer">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
