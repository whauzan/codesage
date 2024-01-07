"use server";

import Question from "@/database/question.model";
import { connect } from "../db";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connect();

    const { questionId, userId } = params;

    const question = await Question.findById(questionId);

    if (!question) return console.log("Question not found");

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) return console.log("User has already viewed");

      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
        tags: question?.tags,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
