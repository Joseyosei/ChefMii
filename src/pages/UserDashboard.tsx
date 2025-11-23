import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Bookmark, Heart, Settings, LogOut, ChefHat, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';

export default function UserDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  const bookings = [
    {
      id: 1,
      chef: "James O.",
      cuisine: "Italian",
      date: "October 20, 2023",
      time: "6:30 PM",
      status: "Confirmed",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      chef: "Emma R.",
      cuisine: "Vegan",
      date: "October 18, 2023",
      time: "5:00 PM",
      status: "In Progress",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      chef: "Daniel M.",
      cuisine: "Japanese",
      date: "October 12, 2023",
      time: "7:00 PM",
      status: "Completed",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r border-border p-6 hidden lg:block">
          <h2 className="text-2xl font-bold text-primary mb-8">ChefMe</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <ChefHat className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <Link
              to="/chefs"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Search Chefs</span>
            </Link>
            <button
              onClick={() => setActiveNav('messages')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'messages' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Messages</span>
            </button>
            <button
              onClick={() => setActiveNav('bookings')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'bookings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => setActiveNav('favorites')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'favorites' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Favorites</span>
            </button>
            <button
              onClick={() => setActiveNav('settings')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
          <button className="flex items-center gap-3 w-full px-4 py-3 mt-8 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, Sarah!</h1>
                <p className="text-muted-foreground">Dashboard</p>
              </div>
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>SW</AvatarFallback>
              </Avatar>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-muted-foreground">Available Balance</h3>
                    <ChefHat className="w-8 h-8 text-primary opacity-20" />
                  </div>
                  <p className="text-4xl font-bold">£2,560.00</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-muted-foreground">Request a Chef</h3>
                    <Heart className="w-8 h-8 text-primary opacity-20" />
                  </div>
                  <div className="text-6xl font-bold">8</div>
                  <Link to="/chefs">
                    <Button className="mt-4 w-full">Find a Chef</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-muted-foreground">My Favorites</h3>
                    <Heart className="w-8 h-8 text-primary opacity-20 fill-primary" />
                  </div>
                  <div className="mt-8">
                    <Button variant="outline" className="w-full">Find Chef</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Bookings Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Bookings</h2>
                <Button variant="outline">
                  Manage Bookings <span className="ml-2">→</span>
                </Button>
              </div>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={booking.avatar} />
                            <AvatarFallback>{booking.chef.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{booking.chef}</h3>
                            <p className="text-sm text-muted-foreground">{booking.cuisine}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{booking.date}</p>
                          <p className="text-sm text-muted-foreground">{booking.time}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            booking.status === 'In Progress' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {booking.status}
                          </span>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            booking.status === 'In Progress' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
