import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import jwt from "jsonwebtoken";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";

chai.use(chaiHttp);
chai.should();

describe("POST /users/new-post", () => {
  let firstUser, requester, firstUserJwtToken;

  before(async () => {
    firstUser = {
      name: "Tareq Zeadeh",
      email: "Tareq@email.com",
      password: "Tareq",
      role: "Admin",
    };

    requester = chai.request(app).keepOpen();
    console.log("Test Started");

    firstUserJwtToken = await signUp(firstUser);
    console.log(`firstUserJwtToken: ${firstUserJwtToken}`);
  });

  after(async () => {
    await truncate(userModel);
    await truncate(postModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("POST /posts/new-post", async () => {
    it("should POST (add) a new post in database", async () => {
      const user = jwt.decode(firstUserJwtToken);
      const res = await requester
        .post("/posts/new-post")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ userId: user.id, body: "Hi" });

      res.body.should.be.a("object");
      res.body.should.have.property("id", 1);
      res.body.should.have.property("userId", user.id);
      res.body.should.have.property("body", "Hi");
    });
  });

  describe("POST /posts/new-post", async () => {
    it("should return 404 code if new post data has some missing fields (body)", async () => {
      const user = jwt.decode(firstUserJwtToken);
      const res = await requester
        .post("/posts/new-post")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ userId: user.id });

      res.should.have.status(404);
      res.body.message.should.equal("Something went wrong");
    });

    it("should return 404 code if the user id is not found in the database", async () => {
      const res = await requester
        .post("/posts/new-post")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ userId: 2, body: "hallo" });

      res.should.have.status(404);
      res.body.message.should.equal("User Not Found");
    });
  });
});
