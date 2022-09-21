const getPartnersInfo = (participants, email) => {
  return participants.find((participant) => participant !== email);
};

export default getPartnersInfo;
