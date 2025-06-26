export const baseUrl = `https://nc-news-3uk2.onrender.com/api`;

export function fetchArticles(queryParams) {
  const filteredParams = Object.entries(queryParams).filter(
    ([key, value]) => value !== null && value !== ""
  );

  const query = new URLSearchParams(filteredParams).toString();
  return fetch(`${baseUrl}/articles?${query}`).then((res) => {
    if (!res.ok) {
      throw new Error("Topic does not exist!");
    }
    return res.json();
  });
}

export function patchArticle(articleId, voteChange) {
  return fetch(`${baseUrl}/articles/${articleId}`, {
    method: "PATCH",
    body: JSON.stringify({ inc_votes: voteChange }),
    headers: { "Content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("vote failed!");
    return res.json();
  });
}

export function fetchArticleById(articleId) {
  return fetch(`${baseUrl}/articles/${articleId}`).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch article");
    return res.json();
  });
}

export function postComment(articleId, commentBody, loggedInUser) {
  return fetch(`${baseUrl}/articles/${articleId}/comments`, {
    method: "POST",
    body: JSON.stringify({
      article_id: articleId,
      body: commentBody,
      username: loggedInUser.username,
    }),
    headers: { "Content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("comment failed!");
    return res.json();
  });
}

export function fetchTopics() {
  return fetch(`${baseUrl}/topics`).then((res) => {
    if (!res.ok) throw new Error("Could not fetch topics!");
    return res.json();
  });
}

export function deleteComment(commentId) {
  return fetch(`${baseUrl}/comments/${commentId}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("comment deletion failed!");
  });
}
export function deleteArticle(articleId) {
  return fetch(`${baseUrl}/articles/${articleId}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("Article deletion failed!");
  });
}

export function fetchComments(articleId) {
  return fetch(`${baseUrl}/articles/${articleId}/comments`).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
  });
}

export function fetchAllUsers() {
  return fetch(`${baseUrl}/users/`).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch users!");
    return res.json();
  });
}
export function fetchUserByUsername(username) {
  return fetch(`${baseUrl}/users/${username}`).then((res) => {
    if (res.status === 404) {
      throw new Error("User doesn't exist!");
    } else if (!res.ok) {
      throw new Error("Something went wrong - error fetching user!");
    }
    return res.json();
  });
}
export function fetchArticlesByUsername(username) {
  return fetch(
    `${baseUrl}/articles?author=${username}&limit=9223372036854775807`
  ).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch Articles by ${username}!`);
    return res.json();
  });
}

export function patchComment(commentId, vote) {
  return fetch(`${baseUrl}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ inc_votes: vote }),
    headers: { "Content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("vote failed!");
    return res.json();
  });
}

export function postArticle(title, topic, articleBody, loggedInUser, image) {
  console.log(loggedInUser);
  return fetch(`${baseUrl}/articles`, {
    method: "POST",
    body: JSON.stringify({
      article_img_url: image,
      title: title,
      topic: topic,
      body: articleBody,
      author: loggedInUser.username,
    }),
    headers: { "Content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("post failed!");
    return res.json();
  });
}
