"use server";

import User from "@/database/user.model";
import { connect } from "../db";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { FilterQuery } from "mongoose";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connect();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // Find interactions for the user and group by tags...
    // Interaction...

    const interactions = await Interaction.aggregate([
      { $match: { user: user._id } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const tagIds = interactions.map((interaction) => interaction._id);

    const tags = await Tag.find({ _id: { $in: tagIds } });

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connect();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questionsCount: -1 };
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;

      default:
        break;
    }

    const totalTags = await Tag.countDocuments(query);

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connect();

    const { tagId, searchQuery, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const [tag, totalQuestions] = await Promise.all([
      Tag.findOne(tagFilter).populate({
        path: "questions",
        model: Question,
        match: searchQuery
          ? { title: { $regex: searchQuery, $options: "i" } }
          : {},
        options: {
          sort: { createdAt: -1 },
          skip: skipAmount,
          limit: pageSize,
        },
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          { path: "author", model: User, select: "_id clerkId name picture" },
        ],
      }),

      Question.countDocuments({
        tags: tagId,
        ...(searchQuery
          ? { title: { $regex: searchQuery, $options: "i" } }
          : {}),
      }),
    ]);

    if (!tag) {
      throw new Error("Tag not found");
    }

    const isNext = page * pageSize < totalQuestions;

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags() {
  try {
    connect();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
