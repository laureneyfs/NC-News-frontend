function CreateArticle() {
  return (
    <section id="create-article">
      <h2>Create an Article</h2>
      <form>
        <label htmlFor="create-title">Title</label>
        <input type="text" id="create-title" />
        <label htmlFor="create-image">Image</label>
        <input type="text" id="create-image" />
        <label htmlFor="create-body">Body</label>
        <input type="text" id="create-body" />
      </form>
    </section>
  );
}

export default CreateArticle;
