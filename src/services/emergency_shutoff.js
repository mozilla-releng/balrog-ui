import axios from 'axios';

const getEmergencyShutoffs = () => axios.get('/emergency_shutoff');

// eslint-disable-next-line import/prefer-default-export
export { getEmergencyShutoffs };
