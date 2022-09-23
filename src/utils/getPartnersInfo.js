const getPartnersInfo = (participants, email) => {
  return participants.find((participant) => participant.email !== email);
};

export default getPartnersInfo;
