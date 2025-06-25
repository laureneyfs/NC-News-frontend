function patchComment(comment_id, vote) {
  setLoadingComments((ids) => [...ids, comment_id]);
  return fetch(`https://nc-news-3uk2.onrender.com/api/comments/${comment_id}`, {
    method: "PATCH",
    body: JSON.stringify({ inc_votes: vote }),
    headers: { "Content-type": "application/json" },
  })
    .then((res) => {
      if (!res.ok) throw new Error("vote failed!");
      return res.json();
    })
    .catch(() => {
      setComments((currComments) =>
        currComments.map((comment) =>
          comment.comment_id === comment_id
            ? {
                ...comment,
                votes: comment.votes - vote,
                userVote: comment.userVote,
              }
            : comment
        )
      );
    })
    .finally(() => {
      setLoadingComments((ids) => ids.filter((id) => id !== comment_id));
    });
}

function postComment() {
  return fetch(
    `https://nc-news-3uk2.onrender.com/api/articles/${articleid}/comments`,
    {
      method: "POST",
      body: JSON.stringify({
        article_id: articleid,
        body: commentBody,
        username: username,
      }),
      headers: { "Content-type": "application/json" },
    }
  ).then((res) => {
    if (!res.ok) throw new Error("post failed!");
    return res.json();
  });
}

function patchArticle(article_id, voteChange) {
  setLoadingArticles((ids) => [...ids, article_id]);
  return fetch(`https://nc-news-3uk2.onrender.com/api/articles/${article_id}`, {
    method: "PATCH",
    body: JSON.stringify({ inc_votes: voteChange }),
    headers: { "Content-type": "application/json" },
  })
    .then((res) => {
      if (!res.ok) throw new Error("vote failed!");
      return res.json();
    })
    .catch(() => {
      setArticles((currArticles) =>
        currArticles.map((article) =>
          article.article_id === article_id
            ? { ...article, votes: article.votes - voteChange, userVote: 0 }
            : article
        )
      );
    })
    .finally(() => {
      setLoadingArticles((ids) => ids.filter((id) => id !== article_id));
    });
}

const fetchArticles = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${baseURL}?${query.toString()}`);
    if (!res.ok) throw new Error("Something went wrong!");
    const data = await res.json();
    setArticles(data.articles.map((article) => ({ ...article, userVote: 0 })));
    setError(null);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const fetchUser = async () => {
  try {
    setLoadingUser(true);
    const res = await fetch(
      `https://nc-news-3uk2.onrender.com/api/users/${username}`
    );
    if (!res.ok) throw new Error("Failed to fetch user");
    const data = await res.json();
    setUser(data.user);
    setError(null);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoadingUser(false);
  }
};

export { patchComment, postComment, patchArticle, fetchArticles, fetchUser };
