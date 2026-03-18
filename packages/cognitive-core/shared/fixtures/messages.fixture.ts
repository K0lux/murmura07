export const messagesFixture = [
  {
    content: 'Peux-tu me confirmer la réunion de demain ?',
    canal: 'email',
    userId: 'user_test',
    interlocuteurId: 'contact_test',
    expected: { intention: 'request_info', tensionScore: 0.2 }
  }
];
