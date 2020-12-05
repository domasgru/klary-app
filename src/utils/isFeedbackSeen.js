export const isFeedbackSeen = (feedbackData, userId) => {
  const { participants } = feedbackData;
  const currentUser = participants[userId];

  // User didn't see feedback at all
  if (!currentUser.seenAt) {
    return false;
  }

  const { lastAction, name } = Object.entries(participants)
    .filter(([id, participant]) => id !== userId)
    .map(([id, value]) => value)
    .reduce((max, participant) => (
      max.lastAction.createdAt?.seconds > participant.lastAction.createdAt?.seconds
      ? max
      : participant
    ));

  // No actions from other users
  if (!lastAction.createdAt) {
    return true;
  }

  return currentUser.seenAt.seconds >= lastAction.createdAt.seconds;
};
