import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";
import { commentModel } from "../../dataAccess/models/commentModel";

chai.use(chaiHttp);
chai.should();

describe("DELETE /comments/delete-comment", () => {
  let firstUser,
    secondUser,
    firstPost,
    secondPost,
    firstComment,
    secondComment,
    requester;

  before(async () => {
    firstUser = await userModel.create({
      firstName: "Tareq",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
      role: "admin",
    });

    secondUser = await userModel.create({
      firstName: "Odai",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
      role: "admin",
    });

    firstPost = await postModel.create({
      userId: firstUser.id,
      body: "Hi, Im new here",
    });

    secondPost = await postModel.create({
      userId: secondUser.id,
      body: "Hallo all",
    });

    firstComment = await commentModel.create({
      userId: secondUser.id,
      postId: firstPost.id,
      body: "Hi",
    });

    secondComment = await commentModel.create({
      userId: secondUser.id,
      postId: firstPost.id,
      body: "Hi",
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

  describe("DELETE /comments/delete-all-comments-from-post", async () => {

    it("should DELETE a comment with the givin id", async () => {
      const res = await requester.delete("/comments/delete-all-comments-from-post").send({
        userId: secondUser.id,
        postId: firstPost.id,
      });

      res.should.have.status(200);
      res.body.message.should.equal("All comments successfully deleted")

    });
  });

  describe("DELETE /comments/delete-all-comments-from-post", async () => {

    it("should return 404 code if the deleted comment has missing fields", async () => {
      const res = await requester.delete("/comments/delete-all-comments-from-post").send({
        userId: secondUser.id,
      });

      res.should.have.status(404);
      res.body.message.should.equal("Something went wrong");

      const allPostComments = await commentModel.findAll({
        where: {
          postId: firstPost.id
        }
      })

      allPostComments.length.should.equal(0);
    });

    it("should return 404 code if the comment not found in database", async () => {
        await truncate(commentModel);
        const res = await requester.delete("/comments/delete-all-comments-from-post").send({
          userId: secondUser.id,
          postId: firstPost.id
        });
  
        res.should.have.status(404);
        res.body.message.should.equal("The user dont have comments on the specified post");
  
      });
  });
});
