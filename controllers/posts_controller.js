const Post = require("../models/Post");
const path = require("path");

async function displayPostsPage(_, res) {
  try {
    const posts = await Post.find();

    res.status(200).render(path.join(__dirname, '../views/management/posts/list-posts.ejs'), { posts });
  } catch (e) {
      res.status(500).render(path.join(__dirname, '../views/error.ejs'), {
          code: '500',
          message: e.message,
      });
  }
};

function displayCreatePostPage(_, res) {
  res
    .status(200)
    .render(
      path.join(__dirname, "../views/management/posts/create-post.ejs")
    );
};

async function createPost(req, res) {
  const post = new Post({
    title: req.body.title,
    subtitle: req.body.subtitle,
    date: req.body.date,
    link: req.body.link,
    summary: req.body.summary,
    status: req.body.status,
  });

  try {
    await post.save();
    req.session.message = `Post ${req.body.title} créé avec succès.`;

    res.status(200).redirect("/posts");
  } catch(error) {
    req.session.errors = [error.message];
    req.session.formData = req.body;

    res.redirect('/posts/create');
  };
};

function displayPostUpdatePage(req, res) {
  const detailsPost = req.postDetails;

  res
    .status(200)
    .render(
      path.join(__dirname, `../views/management/posts/update-post.ejs`),
      { detailsPost }
    );
};

async function updatePost(req, res) {
  const updatedPost = {
    _id: req.params.id,
    title: req.body.title,
    subtitle: req.body.subtitle,
    date: req.body.date,
    link: req.body.link,
    summary: req.body.summary,
    status: !!req.body.status,
  };

  try {
    await Post.updateOne({ _id: req.params.id }, { ...updatedPost });

    req.session.message = `Post "${updatedPost.title}" mis à jour avec succès.`;
    res.redirect(`/posts`);
  } catch(error) {
    req.session.errors = [error.message];
    req.session.formData = req.body;
    
    res.redirect(`/posts/${req.params.id}/update`);
  }
};

function displayPostDeletePage(req, res) {
  const detailsPost = req.postDetails;

  res
    .status(200)
    .render(
      path.join(__dirname, `../views/management/posts/delete-post.ejs`),
      { detailsPost }
    );
};

async function deletePost(req, res) {
  const post = req.postDetails;

  try {
    await Post.deleteOne({ _id: post._id });

    req.session.message = `Post ${post.title} supprimé avec succès`;
    res.redirect('/posts');
  } catch (error) {
    req.session.message = 'Error delete: ' + error.message;
    res.redirect(`/pots/${post._id}/delete`);
  }
};

module.exports = {
  displayCreatePostPage,
  createPost,
  displayPostsPage,
  displayPostUpdatePage,
  updatePost,
  displayPostDeletePage,
  deletePost,
}
