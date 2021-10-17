import { getTime } from '@/firebase';

export const getExampleFormData = (uid, name, picture, withAnswers = false) => ({
  uid,
  name,
  title: 'Getting started',
  formTitle: 'Help me to improve 🚀',
  formDescription: "I'm really interested to get your perspective, don't overthink and just tell what you feel, we will discuss if needed",
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
        title: 'Where could I improve?',
      },
      value: withAnswers ? 'I’ve noticed that we’ve both slowed down lately. We complete tasks much slower than we used to.\n And I’m not sure what the reasons might be. Maybe you have ideas on how we can deliver faster?' : null,
    },
    {
      component: 'WorkspaceFormLongAnswer',
      id: 'gs2',
      options: {
        description: '',
        isRequired: false,
        placeholder: 'Type your answer',
        title: 'Is there anything I should do less or stop doing?',
      },
      value: withAnswers ? 'Sometimes it seems to me that you take your work very seriously. And maybe that’s why you sometimes look angry. 😅' : null,
    },
    {
      component: 'WorkspaceFormLongAnswer',
      id: 'gs3',
      options: {
        description: '',
        isRequired: false,
        placeholder: 'Type your answer',
        title: 'What I do good and should continue doing?',
      },
      value: withAnswers ? 'I really like that you pay a lot of attention to the details. And you’re never rush to make a decision if you’re not sure it’s a good decision. Keep it up! 🚀' : null,
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
        content: "Yes, I agree that clearer deadlines could help us. Let's try this in the next sprint.",
        authorUid: 'author',
      },
      {
        content: 'Btw, a bit off topic, but I recommend watching this video:\n\nhttps://www.youtube.com/watch?v=arj7oStGLkU&ab_channel=TED',
        id: 'GBS2B0aCg',
        createdAt: getTime(2021, 6, 21, 16, 14),
        authorUid: 'receiver',
      },
    ],
    content: 'I also feel that we’ve slowed down. Maybe it’s because we have quite a few different tasks at once. And we don’t have clear deadlines by when we have complete our tasks. So perhaps clearer deadlines would help us complete tasks faster?',
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
        content: 'Nice, because I was thinking about what could make you feel angry. 😄',
      },
    ],
    authorUid: 'receiver',
    type: 'COMMENT',
    content: 'Thanks for sharing that I sometimes look angry. I’ll try to communicate and behave better because I haven’t been angry about anything lately. 😅',
  },
  {
    content: 'It’s nice to know that you’ve noticed these details in the designs. 🤩',
    authorUid: 'receiver',
    type: 'COMMENT',
    createdAt: getTime(2021, 6, 21, 16, 21),
  },
  {
    type: 'MARK_AS_CLEAR',
    content: 'Thanks for openly sharing your feedback. 🙌',
    createdAt: getTime(2021, 6, 21, 16, 23),
    authorUid: 'receiver',
  },
];
