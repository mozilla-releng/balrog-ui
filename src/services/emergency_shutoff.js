import axios from 'axios';

const getEmergencyShutoffs = () => axios.get('/emergency_shutoff');
const createEmergencyShutoff = (product, channel) =>
  axios.post('/emergency_shutoff', { product, channel });
const deleteEmergencyShutoff = (product, channel, dataVersion) =>
  axios.delete(`/emergency_shutoff/${product}/${channel}`, {
    params: { data_version: dataVersion },
  });
const getScheduledChanges = () =>
  axios.get('/scheduled_changes/emergency_shutoff');
const scheduleDeleteEmergencyShutoff = (product, channel, dataVersion, when) =>
  axios.post('/scheduled_changes/emergency_shutoff', {
    product,
    channel,
    data_version: dataVersion,
    when,
    change_type: 'delete',
  });

// eslint-disable-next-line import/prefer-default-export
export {
  getEmergencyShutoffs,
  createEmergencyShutoff,
  deleteEmergencyShutoff,
  getScheduledChanges,
  scheduleDeleteEmergencyShutoff,
};
