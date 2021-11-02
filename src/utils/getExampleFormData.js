import { getTime } from '@/firebase';

export const getExampleFormData = (uid, name, picture, withAnswers = false) => ({
  uid,
  name,
  title: 'Getting started',
  formTitle: 'Hey, help me to improve 🚀',
  formDescription: "I’m really curious to get your perspective. Don’t overthink and just write down what you've noticed. We will be able to discuss if needed.",
  showAuthor: true,
  emoji: '🚀',
  message: '',
  picture: picture || '',
  questions: [
    {
      component: 'WorkspaceFormLongAnswer',
      id: 'gs1',
      options: {
        description: '',
        isRequired: false,
        placeholder: 'Type your answer',
        title: 'What should I start doing?',
      },
      value: withAnswers ? 'Maybe sometimes it feels that your copy lacks some more hyping/inspiring or "crazy" stuff 🤪 For example when we brainstormed emails or onboarding flow copy.' : null,
    },
    {
      component: 'WorkspaceFormLongAnswer',
      id: 'gs2',
      options: {
        description: '',
        isRequired: false,
        placeholder: 'Type your answer',
        title: 'What should I stop doing?',
      },
      value: withAnswers ? 'Sometimes it feels that you ask for additional explanation too quickly. Btw, let me know if my communication is lacking, you just never told me so 🙏' : null,
    },
    {
      component: 'WorkspaceFormLongAnswer',
      id: 'gs3',
      options: {
        description: '',
        isRequired: false,
        placeholder: 'Type your answer',
        title: 'What should I continue doing?',
      },
      value: withAnswers ? 'Continue not rushing and making really well thought decisions! Direction is more important than speed 🚀\n\nContinue working with absolutely maximum standards. Your delivery really often exceeds expectations.\n\nContinue being such interested in other products/solutions. Trying to catch up with you here. You often share a lot of inspiring findings.' : null,
    },
  ],
});

export const exampleFeedbackDiscussion = [
  {
    type: 'COMMENT',
    replies: [
      {
        id: 'kED_BPlan',
        createdAt: getTime(2021, 6, 21, 16, 12),
        content: "But maybe sometimes it's quite worth it to have some hyping/inspiring sentence, for example in onboarding message or email?",
        authorUid: 'author',
      },
      {
        content: 'Agree, will try to pay more attention to this 👍',
        id: 'GBS2B0aCg',
        createdAt: getTime(2021, 6, 21, 16, 14),
        authorUid: 'receiver',
      },
    ],
    content: '"Maybe sometimes it feels that your copy lacks some more hyping/inspiring or "crazy" stuff 🤪 For example when we brainstormed emails or onboarding flow copy."\n\nYeah, I somehow tend to keep texts without fancy expressions, especially in UI. Often, additional unnecessary expressions only make the message more difficult.',
    createdAt: getTime(2021, 6, 21, 16, 10),
    authorUid: 'receiver',
  },
  {
    createdAt: getTime(2021, 6, 21, 16, 14),
    replies: [
      {
        id: 'iyhDiYT5p',
        createdAt: getTime(2021, 6, 21, 16, 20),
        authorUid: 'author',
        content: 'Yeah, messenger is probably not the best tool to handle some of our discussions 😅 Anyway, here was trying to not include such cases.',
      },
    ],
    authorUid: 'receiver',
    type: 'COMMENT',
    content: '"Sometimes it feels that you rush too much to ask for extra clarification before fully grasping the message. Btw, let me know if my communication is lacking, just you never told me so 🙏"\n\nMaybe it’s because our messages are often short and fast. And sometimes it happens that messages on different topics get mixed up with each other. Have you noticed this?\n\nBut got your point. I will try to avoid these quick questions 😁',
  },
  {
    content: '"Continue working with absolutely max standards. Your delivery really often exceeds my expectations."\n\nNice to hear. 🤩  Wondering which design of the last ones you like the most?',
    authorUid: 'receiver',
    type: 'COMMENT',
    createdAt: getTime(2021, 6, 21, 16, 21),
    replies: [
      {
        id: 'replie1',
        createdAt: getTime(2021, 6, 21, 16, 22),
        authorUid: 'author',
        type: 'COMMENT',
        content: 'Onboarding flow design was the most recent one. Was in figma multiple times that day and saw how different variations leaded to a reaaally nice one. Love that onboarding popup for an example feedback 🤩',
      },
    ],
  },
  {
    type: 'MARK_AS_CLEAR',
    content: 'Everything seems clear. Thanks for the feedback 🙌',
    createdAt: getTime(2021, 6, 21, 16, 23),
    authorUid: 'receiver',
  },
];
