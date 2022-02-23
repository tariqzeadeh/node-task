import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";

chai.use(chaiHttp);
chai.should();

describe("GET /users/post", () => {
  let user, firstPost, secondPost, requester;

  before(async () => {
    user = await userModel.create({
      firstName: "Tareq",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
      role: "admin",
    });

    firstPost = await postModel.create({
      userId: user.id,
      body: "Hi, Im new here",
    });

    secondPost = await postModel.create({
      userId: user.id,
      body: "Hallo all",
    });

    requester = chai.request(app).keepOpen();
    console.log("Test Started");
  });

  after(async () => {
    await truncate(userModel);
    await truncate(postModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("GET /posts/post", async () => {
    it("should GET a post with the id (1) in database", async () => {
      const res = await requester.get("/posts/post").send({ id: 1, userId: 1 });

      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.userId.should.equal(user.id);
      res.body.id.should.equal(1);
      res.body.body.should.equal(firstPost.body);
    });
  });

  describe("GET /posts/post", async () => {
    
    it("should return 404 code with post id is not found in the database", async () => {
      const res = await requester.get("/posts/post").send({ id: 3, userId: 1 });

      res.should.have.status(404);
      res.body.message.should.equal("Post Not Found");
    });

    it("should return 404 code with user id is not found in the database", async () => {
      const res = await requester.get("/posts/post").send({ id: 1, userId: 2 });

      res.should.have.status(404);
      res.body.message.should.equal("User Not Found");
    });

    it("should return 404 code with user id is not found in the database", async () => {
      const res = await requester.get("/posts/post").send({ userId: 1 });

      res.should.have.status(404);
      res.body.message.should.equal("Something went wrong");
    });
  });
});
