
const generateSearchKeywordsQuery = async (firstName, lastName) => {
  const arrKeywords = [];
  let currName = '';

  await firstName.trim().toLowerCase().split('').forEach((letter) => {
    currName += letter;
    arrKeywords.push(currName);
  });

  currName += ' ';
  await lastName.trim().toLowerCase().split('').forEach((letter) => {
    currName += letter;
    arrKeywords.push(currName);
  });

  currName = '';
  await lastName.trim().toLowerCase().split('').forEach((letter) => {
    currName += letter;
    arrKeywords.push(currName);
  });

  return arrKeywords;
}

export default generateSearchKeywordsQuery;
