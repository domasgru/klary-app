export const isFeedbackSeen = (feedbackData, userId) => {
  const { participants, authorId, receiverId } = feedbackData;
  const currentUser = participants[userId];

  // User didn't see feedback at all
  if (!currentUser.seenAt) {
    return false;
  }

  // Feedback for yourself handling
  if (authorId === receiverId) {
    return true;
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
