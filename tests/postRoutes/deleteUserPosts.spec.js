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

describe("DELETE /posts/delete-all-posts", () => {
  let user, firstPost, secondPost, requester, firstUser, firstUserJwtToken;

  before(async () => {
    firstUser = {
      name: "Tareq Zeadeh",
      email: "Tareq@email.com",
      password: "Tareq",
      role: "Admin",
    };

    firstUserJwtToken = await signUp(firstUser);
    user = jwt.decode(firstUserJwtToken);

    firstPost = await postModel.create({
      userId: user.id,
      body: "Hi all",
    });

    secondPost = await postModel.create({
      userId: user.id,
      body: "Hallo...",
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

  describe("DELETE /posts/delete-all-posts", async () => {
    it("should DELETE all posts for userId (1)", async () => {
      const res = await requester
        .delete("/posts/delete-all-posts")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ userId: user.id });

      res.should.have.status(200);
      res.body.message.should.equal("All posts successfully deleted");
    });
  });

  describe("DELETE /posts/delete-all-posts", async () => {
    it("should return 404 code if the user is not found in the database", async () => {
      const res = await requester
        .delete("/posts/delete-all-posts")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ userId: 2 });

      res.should.have.status(404);
      res.body.message.should.equal("User Not Found");
    });

    it("should return 404 code if the user do not have posts", async () => {
      await truncate(postModel);

      const res = await requester
        .delete("/posts/delete-all-posts")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ userId: user.id });

      res.should.have.status(404);
      res.body.message.should.equal("The User Dont Have Any Post Yet");
    });
  });
});
