import React from "react";
import { toast } from "sonner";
import { Moon, Sun, Bell, ShieldAlert } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ReferralCard from "../components/referral/ReferralCard";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogoutEverywhere() {
    await logout();
    toast.success("Logged out on this device.");
    navigate("/login");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDark ? <Moon size={18} className="text-accent-hi" /> : <Sun size={18} className="text-warn" />}
          <div>
            <p className="text-sm font-medium text-ink">Appearance</p>
            <p className="text-xs text-ink-4">Switch between dark and light theme</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          {isDark ? "Switch to light" : "Switch to dark"}
        </Button>
      </Card>

      <Card className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-success" />
          <div>
            <p className="text-sm font-medium text-ink">Email notifications</p>
            <p className="text-xs text-ink-4">Get notified when a report is ready</p>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          Enabled
        </Button>
      </Card>

      <ReferralCard detailed />

      <Card className="p-6 border border-danger/30">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert size={18} className="text-danger" />
          <p className="text-sm font-medium text-ink">Account</p>
        </div>
        <Button variant="danger" size="sm" onClick={handleLogoutEverywhere}>
          Log out
        </Button>
      </Card>
    </div>
  );
}
