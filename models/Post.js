const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "El body es obligatorio"],
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", PostSchema);
