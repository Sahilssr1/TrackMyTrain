export const stations = [
  { code: 'CSMT', name: 'Mumbai CSMT' },
  { code: 'DR', name: 'Dadar Central' },
  { code: 'TNA', name: 'Thane' },
  { code: 'KYN', name: 'Kalyan Jn' },
  { code: 'NK', name: 'Nasik Road' },
  { code: 'BSL', name: 'Bhusaval Jn' },
  { code: 'NGP', name: 'Nagpur Jn' },
  { code: 'HWH', name: 'Howrah Jn' },
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'BCT', name: 'Mumbai Central' },
  { code: 'ADI', name: 'Ahmedabad Jn' },
  { code: 'PNBE', name: 'Patna Jn' },
  { code: 'RJPB', name: 'Rajendra Nagar Terminal' },
];

export const trains = [
  { number: '12859', name: 'Gitanjali Express', from: 'CSMT', to: 'HWH' },
  { number: '12261', name: 'Howrah Duronto', from: 'CSMT', to: 'HWH' },
  { number: '12951', name: 'Rajdhani Express', from: 'BCT', to: 'NDLS' },
  { number: '12953', name: 'August Kranti Rajdhani', from: 'BCT', to: 'NDLS' },
  { number: '12393', name: 'Sampoorna Kranti Express', from: 'RJPB', to: 'NDLS' }, // RJPB -> NDLS
  { number: '13201', name: 'Patna - RJPB Intercity', from: 'PNBE', to: 'RJPB' }, // PNBE -> RJPB (Mock for testing)
];

// Schedule format: 
// arrival: 'HH:MM' (24hr), departure: 'HH:MM', day: 1 (starts at 1), distance: km
export const schedules = {
  '12859': [
    { stationCode: 'CSMT', arrival: '06:00', departure: '06:00', day: 1, distance: 0 },
    { stationCode: 'DR', arrival: '06:12', departure: '06:15', day: 1, distance: 9 },
    { stationCode: 'KYN', arrival: '06:52', departure: '06:55', day: 1, distance: 54 },
    { stationCode: 'NK', arrival: '09:25', departure: '09:30', day: 1, distance: 186 },
    { stationCode: 'BSL', arrival: '13:00', departure: '13:05', day: 1, distance: 443 },
    { stationCode: 'NGP', arrival: '18:55', departure: '19:00', day: 1, distance: 835 },
    { stationCode: 'HWH', arrival: '12:30', departure: '12:30', day: 2, distance: 1968 },
  ],
  '12951': [
    { stationCode: 'BCT', arrival: '17:00', departure: '17:00', day: 1, distance: 0 },
    { stationCode: 'ADI', arrival: '22:40', departure: '22:50', day: 1, distance: 491 },
    { stationCode: 'NDLS', arrival: '08:30', departure: '08:30', day: 2, distance: 1384 },
  ],
  '13201': [
    { stationCode: 'PNBE', arrival: '23:55', departure: '23:55', day: 1, distance: 0 },
    { stationCode: 'RJPB', arrival: '00:10', departure: '00:15', day: 2, distance: 3 },
  ]
};

export const getTrainSchedule = (trainNo) => {
  return schedules[trainNo] || [];
};

export const searchTrains = (fromCode, toCode) => {
  return trains.filter(t => t.from === fromCode && t.to === toCode);
};
