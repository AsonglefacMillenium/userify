import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";
import { allowRoles } from "../middlewares/role";
import { body, param } from "express-validator";
import { validate } from "../middlewares/validate";

const router = Router();

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, birthDate, email, password]
 *             properties:
 *               fullName: { type: string }
 *               birthDate: { type: string, format: date }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201: { description: Created }
 */
router.post(
  "/register",
  body("fullName").isString().notEmpty(),
  body("birthDate").isISO8601().toDate(),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }),
  validate,
  userController.register
);

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: JWT token }
 */
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString().notEmpty(),
  validate,
  userController.login
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (self or admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:  
 *           type: string
 *           format: uuid
 *         required: true
 *     example: 13acb9c6-6c74-4707-adf1-a672237f99a3
 *     responses:
 *       200: { description: User }
 */
router.get(
  "/:id",
  authenticate,
  param("id").isUUID().withMessage("Invalid user ID"),
  validate,
  userController.getUser
);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Users list }
 */
router.get("/", authenticate, allowRoles("ADMIN"), userController.getUsers);

/**
 * @openapi
 * /users/block/{id}:
 *   patch:
 *     summary: Block user (self or admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: 
 *           type: string 
 *           format: uuid
 *         required: true
 *     responses:
 *       200: { description: Blocked user }
 */
router.patch(
  "/block/:id",
  authenticate,
  param("id").isUUID().withMessage("Invalid user ID"),
  validate,
  userController.blockUser
);

export default router;
