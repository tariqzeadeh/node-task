import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";
import { commentModel } from "../../dataAccess/models/commentModel";

chai.use(chaiHttp);
chai.should();

describe("GET /comments/user-comment", () => {
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
      body: "Hi, your welcome",
    });

    secondComment = await commentModel.create({
      userId: secondUser.id,
      postId: firstPost.id,
      body: "Hope you enjoy with us",
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

  describe("GET /comments/user-comment", async () => {
    it("should GET the comments with specific  id, userId and postId from the database", async () => {
      const res = await requester.get("/comments/user-comment").send({
          id: firstComment.id,
          userId: secondUser.id,
          postId: firstPost.id
      });

      res.body.should.be.a("object");
      res.body.should.have.property("id",firstComment.id)
      res.body.should.have.property("userId",secondUser.id)
      res.body.should.have.property("postId",firstPost.id)
      res.body.should.have.property("body",firstComment.body)
    });
  });

  describe("GET /comments/user-comment", async () => {

    it("should return 404 code if comment data has some missing fields", async () => {
      
  
        const res = await requester.get("/comments/user-comment").send({
            id: firstComment.id,
            userId: secondUser.id,
        });
  
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.message.should.equal("Something went wrong");
        
      });

    it("should return 404 code if no user with the givin id in the database", async () => {
        
  
        const res = await requester.get("/comments/user-comment").send({
            id: firstComment.id,
            userId: 3,
            postId: firstPost.id
        });
  
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.message.should.equal("User Not Found");
        
      });

    it("should return 404 code if no post with the givin id in the database", async () => {
     
  
        const res = await requester.get("/comments/user-comment").send({
            id: firstComment.id,
            userId: secondUser.id,
            postId: 3
        });;
  
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.message.should.equal("Post Not Found Or Was Deleted");
        
      });

    it("should return 404 code if no comment for the user on the post in the database", async () => {
      await truncate(commentModel);

      const res = await requester.get("/comments/user-comment").send({
        id: firstComment.id,
        userId: secondUser.id,
        postId: firstPost.id
    });

      res.should.have.status(404);
      res.body.should.be.a("object");
      res.body.message.should.equal("Comment Not Found");
      
    });
  });
});