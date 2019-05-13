import React from 'react';
import Dashboard from '../../../components/Dashboard';
import SettingsNav from '../../../components/SettingsNav';

export default function Users() {
  return <Dashboard sidenav={<SettingsNav />} />;
}
