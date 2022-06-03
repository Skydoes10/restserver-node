const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const {
  isValidRole,
  emailExists,
  userExistsById,
} = require("../helpers/db-validators");

const {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
} = require("../controllers/users");

const router = Router();

router.get("/", usersGet);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("email", "Email not valid").isEmail(),
    check("email").custom(emailExists),
    check("role").custom(isValidRole),
    validateFields,
  ],
  usersPost
);

router.put(
  "/:id",
  [
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(userExistsById),
    check("role").custom(isValidRole),
    validateFields,
  ],
  usersPut
);

router.patch("/", usersPatch);

router.delete(
  "/:id",
  [
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(userExistsById),
    validateFields,
  ],
  usersDelete
);

module.exports = router;
