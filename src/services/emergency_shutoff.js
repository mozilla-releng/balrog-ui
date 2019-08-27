import axios from 'axios';

const getEmergencyShutoffs = () => axios.get('/emergency_shutoff');
const createEmergencyShutoff = (product, channel) =>
  axios.post('/emergency_shutoff', { product, channel });
const deleteEmergencyShutoff = (product, channel, dataVersion) =>
  axios.delete(`/emergency_shutoff/${product}/${channel}`, {
    params: { data_version: dataVersion },
  });

// eslint-disable-next-line import/prefer-default-export
export { getEmergencyShutoffs, createEmergencyShutoff, deleteEmergencyShutoff };
