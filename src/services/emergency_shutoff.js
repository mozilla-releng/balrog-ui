import axios from 'axios';

const getEmergencyShutoffs = () => axios.get('/emergency_shutoff');
const createEmergencyShutoff = (product, channel) =>
  axios.post('/emergency_shutoff', { product, channel });

// eslint-disable-next-line import/prefer-default-export
export { getEmergencyShutoffs, createEmergencyShutoff };
