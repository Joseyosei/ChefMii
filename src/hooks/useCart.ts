import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching cart:', error);
    } else {
      setCartItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product: { name: string; image: string; price: number }) => {
    if (!user) {
      toast({ title: 'Please login to add items to cart', variant: 'destructive' });
      return false;
    }

    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      product_name: product.name,
      product_image: product.image,
      price: product.price,
      quantity: 1,
    });

    if (error) {
      toast({ title: 'Error adding to cart', variant: 'destructive' });
      return false;
    }

    toast({ title: 'Added to cart!' });
    fetchCart();
    return true;
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id);

    if (!error) fetchCart();
  };

  const removeFromCart = async (id: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchCart();
      toast({ title: 'Item removed from cart' });
    }
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { cartItems, loading, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount, fetchCart };
};
