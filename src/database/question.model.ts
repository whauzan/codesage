import { Schema, models, model, Document } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  answers: Schema.Types.ObjectId[];
  answersCount: number;
  createdAt: Date;
}

const QuestionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  answersCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

QuestionSchema.post("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.answersCount = docToUpdate.answers.length;
  await docToUpdate.save();
});

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
