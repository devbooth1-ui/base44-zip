import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, Users, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminAccounting() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem('accounting_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const { data: plays } = useQuery({
    queryKey: ['accounting-plays'],
    queryFn: () => base44.entities.Play.list('-created_date', 10000),
    enabled: isAuthenticated,
    initialData: []
  });

  const { data: awards } = useQuery({
    queryKey: ['accounting-awards'],
    queryFn: () => base44.entities.Award.list('-created_date', 10000),
    enabled: isAuthenticated,
    initialData: []
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "Devbooth" && password === "Raegan0622!") {
      setIsAuthenticated(true);
      sessionStorage.setItem('accounting_auth', 'true');
      toast.success("Access granted");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('accounting_auth');
    setUsername("");
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Accounting Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = plays.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + (p.entry_fee || 0), 0);
  const totalPayouts = awards.filter(a => a.status === 'paid').reduce((sum, a) => sum + (a.amount || 0), 0);
  const netProfit = totalRevenue - totalPayouts;
  const paidPlays = plays.filter(p => p.payment_status === 'paid').length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Accounting Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-500">{paidPlays} paid entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalPayouts.toFixed(2)}</div>
              <p className="text-xs text-slate-500">{awards.filter(a => a.status === 'paid').length} awards paid</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${netProfit.toFixed(2)}</div>
              <p className="text-xs text-slate-500">Revenue - Payouts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Awards</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${awards.filter(a => a.status === 'verified').reduce((sum, a) => sum + (a.amount || 0), 0).toFixed(2)}
              </div>
              <p className="text-xs text-slate-500">{awards.filter(a => a.status === 'verified').length} to be paid</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {plays.filter(p => p.payment_status === 'paid').slice(0, 50).map((play) => (
                  <div key={play.id} className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                    <div>
                      <div className="font-semibold">{play.player_name}</div>
                      <div className="text-xs text-slate-500">{new Date(play.play_date).toLocaleDateString()}</div>
                    </div>
                    <div className="font-bold text-green-600">+${play.entry_fee.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Award Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {awards.slice(0, 50).map((award) => (
                  <div key={award.id} className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                    <div>
                      <div className="font-semibold">{award.player_name}</div>
                      <div className="text-xs text-slate-500">
                        {award.award_type} • {award.status}
                      </div>
                    </div>
                    <div className={`font-bold ${award.status === 'paid' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {award.status === 'paid' ? '-' : ''}${award.amount?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}