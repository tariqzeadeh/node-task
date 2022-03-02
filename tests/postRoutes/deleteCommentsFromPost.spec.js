import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import jwt from "jsonwebtoken";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";
import { commentModel } from "../../dataAccess/models/commentModel";

chai.use(chaiHttp);
chai.should();

describe("DELETE /posts/delete-all-posts", () => {
  let firstUser,
    secondUser,
    firstPost,
    firstComment,
    secondComment,
    requester,
    firstUserJwtToken,
    secondUserJwtToken;

  before(async () => {
    firstUserJwtToken = await signUp({
      name: "Tareq Zeadeh",
      email: "Tareq@email.com",
      password: "Tareq",
      role: "Admin",
    });
    firstUser = jwt.decode(firstUserJwtToken);

    secondUserJwtToken = await signUp({
      name: "Odai Zeadeh",
      email: "Odai@email.com",
      password: "Odai",
      role: "User",
    });
    secondUser = jwt.decode(secondUserJwtToken);

    firstPost = await postModel.create({
      userId: firstUser.id,
      body: "Hi all",
    });

    firstComment = await commentModel.create({
      userId: secondUser.id,
      postId: firstPost.id,
      body: "Hi",
    });

    secondComment = await commentModel.create({
      userId: secondUser.id,
      postId: firstPost.id,
      body: "How are you?",
    });

    requester = chai.request(app).keepOpen();
    console.log("Test Started");
  });

  after(async () => {
    await truncate(userModel);
    await truncate(postModel);
    await truncate(commentModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("DELETE /posts/post/delete-all-comments", async () => {
    it("should DELETE all the comments on the post of id (1)", async () => {
      const res = await requester
        .delete("/posts/post/delete-all-comments")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ postId: firstPost.id });

      res.should.have.status(200);
      res.body.message.should.equal(
        "All comments on the post are successfully deleted"
      );
    });
  });

  describe("DELETE /posts/post/delete-all-comments", async () => {
    it("should return 404 code if the user do not have the post with id (2)", async () => {
      const res = await requester
        .delete("/posts/post/delete-all-comments")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ postId: 2 });

      res.should.have.status(404);
      res.body.message.should.equal("Post Not Found");
    });

    it("should return 404 code if there is no comments on the post", async () => {
      await truncate(commentModel);

      const res = await requester
        .delete("/posts/post/delete-all-comments")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ postId: firstPost.id });

      res.should.have.status(404);
      res.body.message.should.equal("No comments found on this post");
    });
  });
});
