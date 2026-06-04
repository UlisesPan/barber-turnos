import { Router, Request, Response } from "express";
import { createUser, getUsers, getUserById, loginUser, uploadProfilePhoto } from "../controllers/userControllers";
import { upload } from "../middlewares/uploadMiddleware";
const routerUser: Router = Router();

routerUser.get("/", getUsers);


routerUser.post("/register", createUser);

routerUser.post("/login", loginUser);



routerUser.put("/:id/photo", 
  upload.single("photo"), 
  uploadProfilePhoto
);
routerUser.get("/:id", getUserById);



export default routerUser;