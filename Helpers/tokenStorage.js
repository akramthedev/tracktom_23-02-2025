import * as SecureStore from 'expo-secure-store';

 export async function saveToken(token) {
  await SecureStore.setItemAsync('Token', token);
}

 export async function getToken() {
  const token = await SecureStore.getItemAsync('Token');
  return token;
}

 export async function deleteToken() {
  await SecureStore.deleteItemAsync('Token');
}
