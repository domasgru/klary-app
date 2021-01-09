/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { store } from '@/store';
import { createUserProfileDocument, updateUserProfileDocument } from '@/firebase';

export const handleLoginAndReturnRedirect = async (authResult) => {
  const { user, additionalUserInfo } = authResult;
  store.dispatch('user/setUserAuth', { email: user.email, uid: user.uid });

  const profilePicture = additionalUserInfo.profile?.picture
      ? { googlePicture: additionalUserInfo.profile?.picture } : {};

  // Create new user profile
  if (additionalUserInfo.isNewUser) {
    const { name, given_name, email } = additionalUserInfo.profile;
    await createUserProfileDocument(user, {
        ...profilePicture,
        name: name || given_name || email,
    });
  } else {
    try {
      updateUserProfileDocument(user.uid, profilePicture);
    } catch (e) {
      console.error(e);
    }
  }

  await store.dispatch('user/bindUser', user.uid);
  return Promise.resolve('/workspace');
};
