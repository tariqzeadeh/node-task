// import chai from "chai";
// import chaiHttp from "chai-http";
// import { app } from "../../index";
// import { truncate } from "../helpers/truncate";
// import { userModel } from "../../dataAccess/models/userModel";

// chai.use(chaiHttp);
// chai.should();

// describe("POST /users/new-user", () => {
//   let requester;

//   before(async () => {
//     requester = chai.request(app).keepOpen();
//     console.log("Test Started");
//   });

//   after(async () => {
//     await truncate(userModel);
//     requester.close();
//     console.log("Test Ended");
//   });

//   describe("POST /users/new-user", () => {
//     it("should update the first name and last name for a user with the id of (1)", async () => {
//       const newUser = {
//         firstName: "Tareq",
//         lastName: "Zeadeh",
//         email: "Tareq@email.com",
//         role: "admin",
//       };
//       const res = await requester.post("/users/new-user").send(newUser);
//       console.log(res.body);
//       res.should.have.status(200);
//       res.body.should.be.an("object");
//       res.body.should.have.property("id", 1);
//       res.body.should.have.property("firstName", newUser.firstName);
//       res.body.should.have.property("lastName", newUser.lastName);
//       res.body.should.have.property("email", newUser.email);
//       res.body.should.have.property("role", newUser.role);
//     });
//   });

//   describe("POST /users/new-user", () => {
//     it("should NOT ADD any user (missing fields in new user data)", async () => {
//         const newUser = {
           
//           };
//       const res = await requester.post("/users/new-user").send(newUser);
//       res.should.have.status(404);
//     });
//   });
// });
