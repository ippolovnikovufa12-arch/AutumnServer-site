import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeTab } from './components/HomeTab';
import { CommandsTab } from './components/CommandsTab';
import { PluginsTab } from './components/PluginsTab';
import { RulesTab } from './components/RulesTab';
import { EventsTab } from './components/EventsTab';
import { UpdatesTab } from './components/UpdatesTab';
import { DonationTab } from './components/DonationTab';
import { FrogGameTab } from './components/FrogGameTab';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ApplicationModal } from './components/ApplicationModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { Footer } from './components/Footer';
import { AutumnLeavesCanvas } from './components/AutumnLeavesCanvas';
import {
  INITIAL_EVENTS,
  INITIAL_UPDATES,
  ADMIN_DEFAULT_PASSWORD
} from './data/serverState';
import { ServerEvent, ServerUpdate } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('autumn_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('autumn_admin_password') || ADMIN_DEFAULT_PASSWORD;
    } catch {
      return ADMIN_DEFAULT_PASSWORD;
    }
  });

  // Events & Updates state with localStorage persistence
  const [events, setEvents] = useState<ServerEvent[]>(() => {
    try {
      const stored = localStorage.getItem('autumn_events_v2');
      return stored ? JSON.parse(stored) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [updates, setUpdates] = useState<ServerUpdate[]>(() => {
    try {
      const stored = localStorage.getItem('autumn_updates_v2');
      return stored ? JSON.parse(stored) : INITIAL_UPDATES;
    } catch {
      return INITIAL_UPDATES;
    }
  });

  // Persist state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('autumn_events_v2', JSON.stringify(events));
    } catch {
      // Ignore storage errors
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('autumn_updates_v2', JSON.stringify(updates));
    } catch {
      // Ignore storage errors
    }
  }, [updates]);

  // Admin Auth Handlers
  const handleAdminLogin = (password: string): boolean => {
    if (password === adminPassword) {
      setIsAdmin(true);
      try {
        localStorage.setItem('autumn_is_admin', 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('autumn_is_admin');
    } catch {}
  };

  const handleAdminChangePassword = (oldP: string, newP: string): boolean => {
    if (oldP === adminPassword) {
      setAdminPassword(newP);
      try {
        localStorage.setItem('autumn_admin_password', newP);
      } catch {}
      return true;
    }
    return false;
  };

  // CRUD for Events
  const handleAddEvent = (evt: ServerEvent) => {
    setEvents(prev => [evt, ...prev]);
  };

  const handleUpdateEvent = (updated: ServerEvent) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // CRUD for Updates
  const handleAddUpdate = (upd: ServerUpdate) => {
    setUpdates(prev => [upd, ...prev]);
  };

  const handleUpdateUpdate = (updated: ServerUpdate) => {
    setUpdates(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const handleDeleteUpdate = (id: string) => {
    setUpdates(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      
      {/* Background Pixel Leaves Ambient Canvas */}
      <AutumnLeavesCanvas />

      {/* Decorative Dark Background Vignette & Grids */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(180,83,9,0.08),transparent_60%)]" />
        {/* Subtle Minecraft-like pixel grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenApplication={() => setApplicationModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-8">
        {currentTab === 'home' && (
          <HomeTab
            onOpenApplication={() => setApplicationModalOpen(true)}
            onNavigateToPlugins={() => setCurrentTab('plugins')}
            onNavigateToRules={() => setCurrentTab('rules')}
            onNavigateToEvents={() => setCurrentTab('events')}
            onNavigateToCommands={() => setCurrentTab('commands')}
            onNavigateToDonate={() => setCurrentTab('donate')}
            onNavigateToGame={() => setCurrentTab('game')}
          />
        )}

        {currentTab === 'commands' && (
          <CommandsTab
            isAdmin={isAdmin}
            onOpenAdmin={() => setAdminModalOpen(true)}
          />
        )}

        {currentTab === 'plugins' && <PluginsTab />}

        {currentTab === 'rules' && <RulesTab />}

        {currentTab === 'donate' && <DonationTab />}

        {currentTab === 'game' && <FrogGameTab />}

        {currentTab === 'events' && (
          <EventsTab
            events={events}
            isAdmin={isAdmin}
            onOpenAdmin={() => setAdminModalOpen(true)}
            onOpenApplication={() => setApplicationModalOpen(true)}
          />
        )}

        {currentTab === 'updates' && (
          <UpdatesTab
            updates={updates}
            isAdmin={isAdmin}
            onOpenAdmin={() => setAdminModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenApplication={() => setApplicationModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Mobile Floating Bottom Navigation Bar (Phones < 768px) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenApplication={() => setApplicationModalOpen(true)}
      />

      {/* Interactive Application Modal */}
      <ApplicationModal
        isOpen={applicationModalOpen}
        onClose={() => setApplicationModalOpen(false)}
      />

      {/* Protected Admin Panel Modal */}
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onChangePassword={handleAdminChangePassword}
        events={events}
        updates={updates}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        onAddUpdate={handleAddUpdate}
        onUpdateUpdate={handleUpdateUpdate}
        onDeleteUpdate={handleDeleteUpdate}
      />

    </div>
  );
}
