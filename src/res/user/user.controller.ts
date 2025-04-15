import { Request, Response } from "express";
// import * as tf from "@tensorflow/tfjs-node";
import UserModel from "./user.model";
import * as faceapi from "face-api.js";
import { Canvas, createCanvas, Image, loadImage } from "canvas";
import userService from "./user.services";
import config from "../../lib/config";
import jwt from "jsonwebtoken";
import { UserSchema } from "./user.schema";
import Exception from "../../lib/Exception";
import logger from "../../lib/logger";
import { SortOrder } from "mongoose";
import { UserLocal } from "../../types/global";

//@ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image });

export async function signup(
  req: Request<{}, {}, UserSchema["Create"]["body"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { email, fullname, role, descriptor } = req.body;
    const users = await UserModel.find({ email: { $ne: email } });

    if (users.length === 0) {
      logger.info("SIGNUP: Creating first user");
      const user = await UserModel.create({
        descriptor: JSON.stringify(descriptor),
        email,
        fullname,
        role,
      });

      return res.send({ message: "Account created successfully" });
    }

    // check if a user exists by using faceapi to match the descriptor
    logger.info("SIGNUP: checking if users exist");
    let parsed: any[] = [];
    users.forEach((user) => {
      let rawDescriptors = JSON.parse(user.descriptor as any) as Descriptor[];
      let descriptors = rawDescriptors.map((descriptor) => {
        let b: number[] = [];
        for (let i in descriptor) {
          b.push(descriptor[i]);
        }
        return new Float32Array(b);
      });
      parsed.push(
        new faceapi.LabeledFaceDescriptors(user._id.toString(), descriptors)
      );
    });

    logger.info("SIGNUP: no user exists with face");

    logger.info("SIGNUP: load image");
    // Set up face matcher with existing users
    const distance = 0.45;
    const faceMatcher = new faceapi.FaceMatcher(parsed, distance);

    // Check if any of the provided descriptors match existing users
    const newDescriptors = req.body.descriptor;

    for (let descriptor of newDescriptors) {
      // Ensure descriptor has correct length
      if (Object.keys(descriptor).length !== 128) {
        return res.status(400).json({
          error: "Invalid descriptor length - must be 128 values",
        });
      }

      // Convert to Float32Array ensuring correct order
      let orderedArray = new Array(128);
      for (let i = 0; i < 128; i++) {
        orderedArray[i] = descriptor[i];
      }
      const inputDescriptor = new Float32Array(orderedArray);

      const match = faceMatcher.findBestMatch(inputDescriptor);

      if (match.distance <= distance) {
        return res.status(400).json({
          error: "A user with this face already exists",
        });
      }
    }
    logger.info("SIGNUP: image loaded");

    logger.info("SIGNUP: Creating user");
    const user = await UserModel.create({
      descriptor: JSON.stringify(req.body.descriptor),
      email,
      fullname,
      role,
    });

    logger.info("SIGNUP: user created");
    return res.send({ message: "Account created successfully" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to signup",
      code: error?.code ?? 400,
    });
  }
}

type Descriptor = { [key: string]: number };

export async function login(
  req: Request<{}, {}, UserSchema["Login"]["body"]>,
  res: Response
) {
  try {
    const users = await UserModel.find();

    let parsed: any[] = [];
    users.forEach((user) => {
      let rawDescriptors = JSON.parse(user.descriptor as any) as Descriptor[];
      let descriptors = rawDescriptors.map((descriptor) => {
        let b: number[] = [];
        for (let i in descriptor) {
          b.push(descriptor[i]);
        }
        return new Float32Array(b);
      });
      parsed.push(
        new faceapi.LabeledFaceDescriptors(user._id.toString(), descriptors)
      );
    });

    const distance = 0.45;
    // Read the image using canvas or other method
    const img = await loadImage(req.body.face)
      .then((img) => {
        console.log("img loaded");
        return img;
      })
      .catch((error) => {
        throw new Error(`Failed to load image: ${error.message}`);
      });

    // get the image in ImageData
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // const imageData = ctx.getImageData(0, 0, img.width, img.height);
    // any because the client canvas type is different from the node canvas type
    // let temp = faceapi.createCanvasFromMedia(imageData as any);
    // Process the image for the model
    const displaySize = { width: img.width, height: img.height };
    // faceapi.matchDimensions(temp, displaySize);

    const faceMatcher = new faceapi.FaceMatcher(parsed, distance);

    const detections = await faceapi
      .detectAllFaces(canvas as any)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    );

    // console.log(descriptors);
    const face = results.find((result) => result.distance <= distance);

    const id = face?.label;
    if (!id) throw new Error("No user found");

    const user = await userService.findOne({ _id: id });

    if (!user) throw new Error("No account found");

    const userJson = user.toJSON();
    const token = jwt.sign(
      {
        email: userJson.email,
        _id: userJson._id,
        fullname: userJson.fullname,
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt,
      },
      config.SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          email: userJson.email,
          id: userJson._id,
          role: userJson.role,
          fullname: userJson.fullname,
          createdAt: userJson.createdAt,
          updatedAt: userJson.updatedAt,
        },
      },
    });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to login",
      code: 400,
    });
  }
}

export async function findAll(
  req: Request<{}, {}, {}, UserSchema["FindAll"]["query"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { role: userRole } = res.locals.user;
    if (userRole !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to access this resource",
      });
    }

    const { limit = 10, page = 1, search = "", sort = "asc" } = req.query;

    const users = await UserModel.find(
      {
        $or: [
          { fullname: { $regex: search, $options: "i" }, role: "student" },
          { email: { $regex: search, $options: "i" }, role: "student" },
        ],
      }
    )
      .select('-descriptor -__v')
      .sort({ createdAt: sort as SortOrder })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    return res.send({ message: "Users found", data: users });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to find users",
      code: error?.code ?? 400,
    });
  }
}

export async function findOne(
  req: Request<UserSchema["FindOne"]["params"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id, {
      projection: {
        descriptor: 0,
        __v: 0,
      },
    });
    if (!user) throw new Error("User not found");

    return res.send({ message: "User found", data: user });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to find user",
      code: error?.code ?? 400,
    });
  }
}

export async function update(
  req: Request<{}, {}, UserSchema["Update"]["body"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { _id, ...user } = res.locals.user;
    const {
      fullname = user.fullname,
      email = user.email,
      role = user.role,
    } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      { fullname, email, role },
      { new: true }
    );
    if (!updatedUser) throw new Error("User not found");

    return res.send({
      message: "User updated",
      data: {
        _id,
        email: updatedUser.email,
        fullname: updatedUser.fullname,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to update user",
      code: error?.code ?? 400,
    });
  }
}
