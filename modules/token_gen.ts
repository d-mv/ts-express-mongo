/**
 * Generate token string
 * @function token
 * @param {string} request - Empty
 * @returns {string} - Return token
 */
export const token = (): string => {
  const dictionary = 'abcdefjhiklmnopqrstuvxyzABCDEFJHIKLMNOPQRSTUVXYZ0123456789!#$%&()*+,-./:;<=>?@[]^_{|}~'.split(
    ""
  );
  let token: string = "";
  // build 25 char long string
  for (let i = 0; i < 26; i++) {
    const sample = dictionary[Math.floor(Math.random() * dictionary.length)];
    token = token + sample;
  }
  return token;
};