/* eslint-disable import/prefer-default-export */
import { store } from '@/store';
import { createUserProfileDocument, updateUserProfileDocument, getInvitedWorkspaces } from '@/firebase';

export const handleLoginAndReturnRedirect = async (authResult) => {
    const { user, additionalUserInfo } = authResult;
    store.dispatch('user/setUserAuth', { email: user.email, uid: user.uid });

    const profilePicture = additionalUserInfo.profile?.picture
        ? { googlePicture: additionalUserInfo.profile?.picture } : {};

    // Create new user profile
    if (additionalUserInfo.isNewUser) {
      await createUserProfileDocument(user, { ...profilePicture });
      await store.dispatch('user/bindUser', user.uid);
      store.dispatch('workspace/setAllWorkspaces', []);
      return '/create-name';
    }

    updateUserProfileDocument(user.uid, profilePicture);

    // Redirect to invites if present
    const invitedWorkspaces = await getInvitedWorkspaces(user.email);
    if (invitedWorkspaces.length) {
      return '/select-workspace';
    }

    await store.dispatch('user/bindUser', user.uid);
    return Promise.resolve('/workspace');
};
