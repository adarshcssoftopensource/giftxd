import * as rug from 'random-username-generator';

export async function generateRandomUsername(model: any) {
  let generatedUsername: string;
  let isUnique = false;

  while (!isUnique) {
    generatedUsername = rug
      .generate()
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\s/g, '');

    const userExist = await model.findOne({ username: generatedUsername });
    if (!userExist) {
      isUnique = true;
    }
  }

  return generatedUsername;
}
