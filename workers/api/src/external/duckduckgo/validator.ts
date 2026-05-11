import { z } from "zod/v4";
import { DdgRequest, DdgResponse } from "./type";
import { DdgRelatedTopic, DdgRelatedTopicGroup, DdgRelatedTopicLeaf, DdgResult } from "./type.common";

export abstract class DuckDuckGoValidator {
  private static readonly RESULT_VALIDATOR: z.ZodType<DdgResult> = z.object({
    FirstURL: z.string(),
    Text: z.string(),
  });

  private static readonly RELATED_TOPIC_LEAF_VALIDATOR: z.ZodType<DdgRelatedTopicLeaf> = z.object({
    FirstURL: z.string(),
    Text: z.string(),
  });

  private static readonly RELATED_TOPIC_GROUP_VALIDATOR: z.ZodType<DdgRelatedTopicGroup> = z.object({
    Name: z.string(),
    Topics: this.RELATED_TOPIC_LEAF_VALIDATOR.array(),
  });

  private static readonly RELATED_TOPIC_VALIDATOR: z.ZodType<DdgRelatedTopic> = this.RELATED_TOPIC_LEAF_VALIDATOR.or(
    this.RELATED_TOPIC_GROUP_VALIDATOR,
  );

  public static readonly REQUEST_VALIDATOR: z.ZodType<DdgRequest> = z.object({
    q: z.string().min(1),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<DdgResponse> = z.object({
    Answer: z.string().optional(),
    AbstractText: z.string().optional(),
    AbstractURL: z.string().optional(),
    AbstractSource: z.string().optional(),
    Results: this.RESULT_VALIDATOR.array().optional(),
    RelatedTopics: this.RELATED_TOPIC_VALIDATOR.array().optional(),
  });
}
