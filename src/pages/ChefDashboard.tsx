import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, MessageCircle, User, Wallet, LogOut, Bell, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ChefDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);

  const todayBookings = [
    { time: "9:00", client: "Ian M", location: "London", status: "Accepted", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    { time: "10:00", client: "Event Catering", location: "Manchester", status: "Pending", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    { time: "11:00", client: "Rachel G", location: "Oxford", status: "Accepted", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r border-border p-6">
          <h2 className="text-2xl font-bold text-primary mb-8">ChefMe</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveNav('calendar')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'calendar' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Calendar</span>
            </button>
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
              onClick={() => setActiveNav('profile')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'profile' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveNav('payouts')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'payouts' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>Payouts</span>
            </button>
          </nav>
          <button className="flex items-center gap-3 w-full px-4 py-3 mt-8 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Welcome, Chef Olivia 👩‍🍳</h1>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsOnline(!isOnline)}
                  variant={isOnline ? "default" : "secondary"}
                  className={isOnline ? "" : "bg-gray-400"}
                >
                  {isOnline ? "Go Offline" : "Go Online"}
                </Button>
                <Bell className="w-6 h-6 cursor-pointer" />
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>CO</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-sm text-muted-foreground mb-2">Today's Bookings</h3>
                  <p className="text-5xl font-bold">3</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-sm text-muted-foreground mb-2">Earnings (This Week)</h3>
                  <p className="text-5xl font-bold">£950</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-sm text-muted-foreground mb-2">Pending Requests</h3>
                  <p className="text-5xl font-bold text-primary">2</p>
                </CardContent>
              </Card>
            </div>

            {/* Calendar Section */}
            <Card className="glass-card mb-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Your Calendar</h2>
                  <select className="px-4 py-2 border rounded-lg bg-background">
                    <option>April 2024</option>
                    <option>May 2024</option>
                    <option>June 2024</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Time</th>
                        <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Mon</th>
                        <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Tue</th>
                        <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Wed</th>
                        <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Thu</th>
                        <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Fri</th>
                        <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Sat</th>
                        <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Sun</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time, idx) => (
                        <tr key={time} className="border-b border-border/50">
                          <td className="py-4 px-3 text-sm font-medium">{time}</td>
                          {idx === 1 ? (
                            <>
                              <td className="py-4 px-3">
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                                  <div className="font-semibold text-sm">Ian M</div>
                                  <div className="text-xs text-muted-foreground">📍 London</div>
                                  <div className="text-xs mt-1 text-green-700 dark:text-green-400 font-medium">Accepted</div>
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </>
                          ) : idx === 2 ? (
                            <>
                              <td></td>
                              <td></td>
                              <td className="py-4 px-3">
                                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                                  <div className="font-semibold text-sm">Event Catering</div>
                                  <div className="text-xs text-muted-foreground">📍 Manchester</div>
                                  <div className="text-xs mt-1 text-orange-700 dark:text-orange-400 font-medium">Pending</div>
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </>
                          ) : idx === 3 ? (
                            <>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className="py-4 px-3">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                  <div className="font-semibold text-sm">Rachel G</div>
                                  <div className="text-xs text-muted-foreground">📍 Oxford</div>
                                  <div className="text-xs mt-1 text-blue-700 dark:text-blue-400 font-medium">Accepted</div>
                                </div>
                              </td>
                              <td></td>
                            </>
                          ) : (
                            <>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
