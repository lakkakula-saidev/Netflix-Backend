import { body } from "express-validator";
import { checkSchema, validationResult } from "express-validator";

/* export const blogPostValidator = [
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("cover").exists().withMessage("Cover is a required field"),
  body("readTime").exists().withMessage("readTime is a required field"),
  body("readTime.value")
    .exists()
    .isNumeric()
    .withMessage("Read time is a required field"),
  body("readTime.unit").exists().withMessage("Avatar name is a required field"),
  body("author").exists().isObject().withMessage("author is a required field"),
  body("author.name").exists().withMessage("Author name is a required field"),
  body("author.avatar").exists().withMessage("Avatar name is a required field"),
  body("content").exists().withMessage("Avatar name is a required field"),
]; */

const schema = {
  Title: {
    in: ["body"],
    isString: {
      errorMessage: "Title Validation failed, type must be string",
    },
  },
  Year: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Year Validation failed, type must be a number",
    },
  },
  Type: {
    in: ["body"],
    isString: {
      errorMessage: "Type Validation failed, type must be string",
    },
  },
  /*   "author.name": {
      in: ["body"],
      isString: {
        errorMessage: "author.name Validation failed, type must be string",
      },
    },
    "author.avatar": {
      in: ["body"],
      isString: {
        errorMessage: "author.avatar Validation failed, type must be string",
      },
    },
  
    "readTime.value": {
      in: ["body"],
      isNumeric: {
        errorMessage: "readTime.value Validation failed, type must be numeric",
      },
    },
    "readTime.unit": {
      in: ["body"],
      isString: {
        errorMessage: "readTime.unit Validation failed, type must be string",
      },
    }
    /*  cover: {
       in: ["body"],
       isString: {
         errorMessage: "cover Validation failed, type must be string",
       },
     }, */
};

const searchSchema = {
  title: {
    in: ["query"],
    isString: {
      errorMessage: "title must be a string to search!",
    },
  },
};

export const checkSearchSchema = checkSchema(searchSchema);

export const checkMediaSchema = checkSchema(schema);

export const checkValidatonResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Blog post validation is failed");
    error.status = 400;
    error.errors = errors.array();
    next(error);
  } else {
    next();
  }
};
