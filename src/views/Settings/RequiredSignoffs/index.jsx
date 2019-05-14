import React from 'react';
import Dashboard from '../../../components/Dashboard';
import SettingsNav from '../../../components/SettingsNav';

export default function RequiredSignoffs() {
  return <Dashboard sidenav={<SettingsNav />}>REQUIRED SIGNOFFS!</Dashboard>;
}
