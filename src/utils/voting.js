export function computeVoteUpdate(userVote, vote) {
  let voteChange = 0;
  let newUserVote = userVote || 0;

  if (vote === newUserVote) {
    voteChange = -vote;
    newUserVote = 0;
  } else if (newUserVote === 0) {
    voteChange = vote;
    newUserVote = vote > 0 ? 1 : -1;
  } else {
    voteChange = vote * 2;
    newUserVote = vote > 0 ? 1 : -1;
  }

  return { voteChange, newUserVote };
}
